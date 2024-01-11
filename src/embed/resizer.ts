import type { Coords } from './api'
import { applyStyle } from './util'


export type SizeChange = {
    left?: number
    right?: number
    top?: number
    bottom?: number
}

type Parent = {
    resize(size: SizeChange): void
    set mouseEventsEnabled(enabled: boolean)
}

export function addResizerDivs(parent: Parent, container: HTMLDivElement) {
    [
        LResizer, TResizer, RResizer, BResizer,
        TRResizer, TLResizer, BRResizer, BLResizer,
    ].forEach((Klass: typeof ResizerBase) => {
        const resizer = new Klass(parent)
        container.appendChild(resizer.container)
    })
}

class ResizerBase {

    coords: Coords | false = false
    container: HTMLDivElement
    parent: Parent

    constructor(parent: Parent) {
        this.parent = parent

        this.container = applyStyle(document.createElement('div'), {
            background: 'transparent',
            height: '5px',
            width: '5px',
            position: 'absolute',
        })

        this.container.addEventListener('mousedown', this.onResize)
    }

    recordPosition(ev: MouseEvent) {
        this.coords = { x: ev.clientX, y: ev.clientY }
    }

    onResize = (ev: MouseEvent) => {
        if (ev.target !== ev.currentTarget) { return }

        this.parent.mouseEventsEnabled = false
        document.body.addEventListener('mousemove', this.onResizeMove)
        document.body.addEventListener('mouseup', this.stopResize)
        this.recordPosition(ev)
    }

    onResizeMove(_: MouseEvent) { } // eslint-disable-line

    stopResize = () => {
        document.body.removeEventListener('mousemove', this.onResizeMove)
        document.body.removeEventListener('mouseup', this.stopResize)
        this.parent.mouseEventsEnabled = true
        this.coords = false
    }

}

class LResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'ew-resize',
            top: '5px',
            height: '',
            bottom: '5px',
            left: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            left: this.coords.x - ev.clientX,
        })
        this.recordPosition(ev)
    }
}

class BResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'ns-resize',
            bottom: '0px',
            left: '5px',
            right: '5px',
            width: '',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            bottom: this.coords.y - ev.clientY,
        })
        this.recordPosition(ev)
    }
}


class TResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'ns-resize',
            top: '0px',
            left: '5px',
            right: '5px',
            width: '',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            top: this.coords.y - ev.clientY,
        })
        this.recordPosition(ev)
    }
}

class RResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'ew-resize',
            top: '5px',
            height: '',
            bottom: '5px',
            width: '2px',
            right: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            right: this.coords.x - ev.clientX,
        })
        this.recordPosition(ev)
    }
}


class BLResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'nesw-resize',
            bottom: '0px',
            left: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            left: this.coords.x - ev.clientX,
            bottom: this.coords.y - ev.clientY,
        })
        this.recordPosition(ev)
    }
}


class TLResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'nwse-resize',
            top: '0px',
            left: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            top: this.coords.y - ev.clientY,
            left: this.coords.x - ev.clientX,
        })
        this.recordPosition(ev)
    }
}


class TRResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'nesw-resize',
            top: '0px',
            right: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            top: this.coords.y - ev.clientY,
            right: this.coords.x - ev.clientX,
        })
        this.recordPosition(ev)
    }
}

class BRResizer extends ResizerBase {
    constructor(parent: Parent) {
        super(parent)
        applyStyle(this.container, {
            cursor: 'nwse-resize',
            right: '0px',
            bottom: '0px',
        })
    }
    onResizeMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.resize({
            right: this.coords.x - ev.clientX,
            bottom: this.coords.y - ev.clientY,
        })
        this.recordPosition(ev)
    }
}
