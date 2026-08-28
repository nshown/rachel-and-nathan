export type Mode = 'regular' | 'pre' | 'anniversary' | 'post'

export type Orientation = 'portrait' | 'landscape'

export type MediaType = 'image' | 'video'

export interface MediaItem {
    /** Path relative to the site root, e.g. "/media/regular/foo.jpg". */
    src: string
    width: number
    height: number
    type: MediaType
    orientation: Orientation
}

export type MediaManifest = Record<Mode, MediaItem[]>
