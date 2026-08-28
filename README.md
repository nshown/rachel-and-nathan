# Rachel &#10084; Nathan

A clean, romantic full-screen slideshow celebrating Rachel & Nathan — year round,
and especially around our anniversary (September 7). Built with React + TypeScript

- Vite + MUI, deployed to GitHub Pages at **rachelandnathan.com**.

## How it works

The site shows one photo (or muted video clip) at a time, filling the screen
with no blank space. It only draws from media that matches the current screen
orientation, picks 10 at random per session, cross-fades between them on a timer,
and loops. Tap/click advances; swipe left/right browses back and forth.

### Modes

The active mode is chosen automatically from today's date:

| Mode             | When                  | Message                                                                                 |
| ---------------- | --------------------- | --------------------------------------------------------------------------------------- |
| Regular          | Most of the year      | `Rachel ❤ Nathan`                                                                       |
| Pre-anniversary  | 14 days before Sept 7 | `X days until our Nth anniversary!!!`                                                   |
| Anniversary      | September 7           | `Happy Anniversary Rachel & Nathan! It's been a wonderful N years of marriage!!!`       |
| Post-anniversary | 14 days after Sept 7  | `What a wonderful journey it's been! Looking forward to the wonderful years to come!!!` |

Preview any mode regardless of date with a query param:
`?mode=regular`, `?mode=pre`, `?mode=anniversary`, `?mode=post`.

### Installable (PWA)

The site is a Progressive Web App, so it can be installed to a phone home
screen or desktop and launched full-screen. The app shell is precached for
offline launch; photos and videos are cached on demand as they're viewed.

## Development

```bash
npm install
npm run prep-media   # one-time: process source photos into public/media
npm run dev
```

### Testing

Unit tests (Vitest) cover the pure logic — mode/date resolution and media
selection:

```bash
npm test          # run once
npm run test:watch
```

### Media preparation

`npm run prep-media` reads the private source photo folders (kept **outside**
this repo, alongside it), strips all metadata (removing GPS/PII), auto-orients
and resizes images, re-encodes videos with no audio, and writes
`src/media-manifest.json`. The processed files land in `public/media/` and are
committed so the deploy build doesn't need the originals.

Requires [`ffmpeg`](https://ffmpeg.org/) (`ffmpeg` + `ffprobe`) on your PATH for
video processing; `sharp` handles images and is installed via npm.

Expected source folders (siblings of this project directory):

- `../initial-regular-photos`
- `../initial-pre-anniversary-photos`
- `../initial-anniversary-photos`
- `../initial-post-anniversary-photos`

## Build & deploy

```bash
npm run build     # type-check + Vite production build into dist/
npm run preview   # serve the production build locally
```

Pushing to `main` triggers the GitHub Actions workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and
publishes to GitHub Pages. The custom domain is set via `public/CNAME`.
