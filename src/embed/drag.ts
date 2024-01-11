import type { Size, Coords } from './api'
import { applyStyle, applyPositioning } from './util'


type Parent = {
    reposition(x: number, y: number): void
    set mouseEventsEnabled(enabled: boolean)
}


export class DragHandle {

    container: HTMLDivElement
    coords: Coords | false = false
    parent: Parent
    
    constructor(size: Size, parent: Parent) {
        this.parent = parent

        this.container = applyStyle(document.createElement('div'), {
            cursor: 'grab',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
        })
        applyPositioning(this.container, size || {}, {
            height: '40px',
            left: '0px',
            width: '65%',
        })
        this.container.addEventListener('mousedown', this.onDrag)

    }

    recordPosition(ev: MouseEvent) {
        this.coords = { x: ev.clientX, y: ev.clientY }
    }

    onDrag = (ev: MouseEvent) => {
        if (ev.target !== ev.currentTarget) { return }

        this.parent.mouseEventsEnabled = false

        this.container.style.cursor = 'grab'
        document.body.addEventListener('mousemove', this.onDragMove)
        document.body.addEventListener('mouseup', this.stopDragging)
        this.recordPosition(ev)
    }

    onDragMove = (ev: MouseEvent) => {
        if (!this.coords) return

        this.parent.reposition(
            this.coords.x - ev.clientX,
            this.coords.y - ev.clientY
        )
        this.recordPosition(ev)
    }

    stopDragging = () => {
        this.container.style.cursor = 'grab'
        document.body.removeEventListener('mousemove', this.onDragMove)
        this.parent.mouseEventsEnabled = true
        this.coords = false
    }

}
