// Prepares web-optimized, metadata-stripped media from the private source photo
// folders and writes src/media-manifest.json.
//
// Images: sharp auto-orients (baking in EXIF rotation), resizes, re-encodes to
// JPEG, and drops ALL metadata (removing GPS/PII).
// Videos: ffmpeg re-encodes with rotation baked in, audio removed (no sound),
// and all metadata stripped; ffprobe reads the true output dimensions.
//
// Requirements: `sharp` (npm dependency) and `ffmpeg` + `ffprobe` on PATH.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SCRIPT_DIR = fileURLToPath(new URL('.', import.meta.url))
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..')
const SOURCE_ROOT = resolve(PROJECT_ROOT, '..')
const OUTPUT_ROOT = join(PROJECT_ROOT, 'public', 'media')
const MANIFEST_PATH = join(PROJECT_ROOT, 'src', 'media-manifest.json')

const MAX_IMAGE_EDGE = 2200
const JPEG_QUALITY = 82
const MAX_VIDEO_EDGE = 1280

const MODES = {
    regular: 'initial-regular-photos',
    pre: 'initial-pre-anniversary-photos',
    anniversary: 'initial-anniversary-photos',
    post: 'initial-post-anniversary-photos',
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png'])
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.m4v'])

function orientationOf(width, height) {
    return width >= height ? 'landscape' : 'portrait'
}

function ensureFfmpeg() {
    for (const bin of ['ffmpeg', 'ffprobe']) {
        try {
            execFileSync(bin, ['-version'], { stdio: 'ignore' })
        } catch {
            throw new Error(`Required tool "${bin}" was not found on PATH. Install ffmpeg and retry.`)
        }
    }
}

async function processImage(inputPath, outDir, id) {
    const outName = `${id}.jpg`
    const outPath = join(outDir, outName)
    const info = await sharp(inputPath)
        .rotate() // apply + drop EXIF orientation
        .resize({
            width: MAX_IMAGE_EDGE,
            height: MAX_IMAGE_EDGE,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(outPath) // sharp drops all other metadata by default
    return { file: outName, width: info.width, height: info.height, type: 'image' }
}

function probeDimensions(filePath) {
    const out = execFileSync(
        'ffprobe',
        [
            '-v',
            'error',
            '-select_streams',
            'v:0',
            '-show_entries',
            'stream=width,height',
            '-of',
            'json',
            filePath,
        ],
        { encoding: 'utf8' },
    )
    const stream = JSON.parse(out).streams?.[0]
    return { width: Number(stream.width), height: Number(stream.height) }
}

function processVideo(inputPath, outDir, id) {
    const outName = `${id}.mp4`
    const outPath = join(outDir, outName)
    execFileSync(
        'ffmpeg',
        [
            '-y',
            '-i',
            inputPath,
            '-an', // strip audio entirely (no sound)
            '-map_metadata',
            '-1', // strip all metadata (GPS/PII)
            '-vf',
            `scale=w=${MAX_VIDEO_EDGE}:h=${MAX_VIDEO_EDGE}:force_original_aspect_ratio=decrease:force_divisible_by=2`,
            '-c:v',
            'libx264',
            '-crf',
            '24',
            '-preset',
            'medium',
            '-pix_fmt',
            'yuv420p',
            '-movflags',
            '+faststart',
            outPath,
        ],
        { stdio: 'ignore' },
    )
    const { width, height } = probeDimensions(outPath)
    return { file: outName, width, height, type: 'video' }
}

async function processMode(mode, sourceDirName) {
    const sourceDir = join(SOURCE_ROOT, sourceDirName)
    if (!existsSync(sourceDir)) {
        throw new Error(`Source folder not found: ${sourceDir}`)
    }

    const outDir = join(OUTPUT_ROOT, mode)
    rmSync(outDir, { recursive: true, force: true })
    mkdirSync(outDir, { recursive: true })

    // Shuffle so the sequential output number doesn't encode the (date-based)
    // source ordering; the original filenames are dropped entirely.
    const entries = readdirSync(sourceDir).filter((entry) => {
        const ext = extname(entry).toLowerCase()
        return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext)
    })
    for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[entries[i], entries[j]] = [entries[j], entries[i]]
    }

    const items = []
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const isImage = IMAGE_EXTS.has(extname(entry).toLowerCase())
        const id = String(i + 1).padStart(3, '0')
        const inputPath = join(sourceDir, entry)
        const result = isImage
            ? await processImage(inputPath, outDir, id)
            : processVideo(inputPath, outDir, id)

        items.push({
            src: `/media/${mode}/${result.file}`,
            width: result.width,
            height: result.height,
            type: result.type,
            orientation: orientationOf(result.width, result.height),
        })
        process.stdout.write(`  ${mode}: ${result.file} (${result.width}x${result.height})\n`)
    }

    return items
}

async function main() {
    ensureFfmpeg()
    mkdirSync(OUTPUT_ROOT, { recursive: true })

    const manifest = {}
    for (const [mode, sourceDirName] of Object.entries(MODES)) {
        process.stdout.write(`Processing "${mode}" from ${sourceDirName}...\n`)
        manifest[mode] = await processMode(mode, sourceDirName)
    }

    writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)

    const counts = Object.entries(manifest)
        .map(([mode, items]) => {
            const portrait = items.filter((i) => i.orientation === 'portrait').length
            const landscape = items.length - portrait
            return `${mode}: ${items.length} (${portrait}P/${landscape}L)`
        })
        .join(', ')
    process.stdout.write(`\nDone. ${counts}\n`)
    process.stdout.write(`Manifest written to ${MANIFEST_PATH}\n`)
}

main().catch((err) => {
    process.stderr.write(`\nprep-media failed: ${err.message}\n`)
    process.exit(1)
})
