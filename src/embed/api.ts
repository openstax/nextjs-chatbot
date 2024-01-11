
export type Coords = { x: number, y: number }
import type { OpenStaxUser } from '../lib/types'

export type PageState = {
    id: string
    title: string
}

type BookContext = {
    orn: string  // book:page uuid
    title: string
    subject: string
}

export type BookState = BookContext & {
    id: string
    categories: Array<{subject_category: string}>
}

export type EmbedContext = {
    user: OpenStaxUser | null
    book: BookContext
}

export type Size = {
    left?: string
    right?: string
    top?: string
    bottom?: string
    width?: string
    height?: string
}

export type Position = {
  position?: 'fixed' | 'relative'
}

// options used to implement a frame
export type FrameOptions = {
    id: string
    title: string
    embedLocation: string
    srcURL: string
    fitContent?: boolean
    float?: 'right' | false // TODO: implement left
    isResizable?: boolean
    isDraggable?: boolean
    dragGrabArea?: Size
    position?: Position & Size
    parent?: { methods: ParentApi }
    onReady?(api: ChildApi): void
}

export type FrameOptionsWithDrag = FrameOptions & {
    dragGrabArea: Size
}

// child content calls these methods on the parent
export type ParentApi = {
    openNewFrame(opts: FrameOptions): void
    onClose(closeParents: boolean): void
}

// These methods implemented on the content inside the frame
export type ChildApi = {
    // is called as soon as the iframe is loaded
    setEmbedContext(context: EmbedContext): void
}
