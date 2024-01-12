import { iframeResizer } from 'iframe-resizer'
import { AsyncMethodReturns, connectToChild } from 'penpal';
import type { ChildApi, EmbedContext, FrameOptions, ParentApi } from './api'
import { applyStyle } from './util'
import { DragHandle } from './drag'
import { addResizerDivs, SizeChange } from './resizer'
import { getContext } from './store'


const apiMethods = (embed: Embed) => ({
    openNewFrame(options: FrameOptions) {
        openNewFrame({ ...options, parent: embed })
    },
    onClose(closeParents) {
        if (closeParents) {
            embed.config.parent?.methods.onClose(closeParents)
        }
        embed.destroy()
    },
} satisfies ParentApi)


class DraggableResizer {
    container: HTMLDivElement
    iframe: HTMLIFrameElement
    dragHandle: DragHandle

    constructor(frame: HTMLIFrameElement, config: FrameOptions) {
        frame.style.width = frame.style.height = '100%'
        this.iframe = frame

        const wrapper = document.createElement('div')
        this.container = wrapper

        this.dragHandle = new DragHandle(config.dragGrabArea || {}, this)
        wrapper.appendChild(this.dragHandle.container)

        addResizerDivs(this, wrapper)

        applyStyle(wrapper, {
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            zIndex: '70', // above navbar, under mobilemenu: https://github.com/openstax/rex-web/blob/main/src/app/theme.ts#L156
            filter: 'drop-shadow(1px 1px 4px #000)',
        })
        wrapper.appendChild(this.iframe)
    }

    resize(change: SizeChange) {
        if (change.bottom) {
            this.container.style.height = (this.container.offsetHeight - change.bottom) + 'px'
        }
        if (change.left) {
           this.container.style.width = (this.container.offsetWidth + change.left) + 'px'
        }
        if (change.top) {
            this.container.style.top = (this.container.offsetTop - change.top) + 'px'
            this.container.style.height = (this.container.offsetHeight + change.top) + 'px'
        }

        if (change.right) {
            this.container.style.width = (this.container.offsetWidth - change.right) + 'px'
            this.container.style.right = ( document.body.clientWidth - ((this.container.offsetLeft + this.container.offsetWidth) - change.right)) + 'px'
        }
    }

    set mouseEventsEnabled(enabled: boolean) {
        this.iframe.style.pointerEvents = enabled ? 'auto' : 'none'
    }

    reposition(x: number, y: number) {
        this.container.style.right = (
            (document.body.offsetWidth - (this.container.offsetLeft + this.container.offsetWidth)) + x
        ) + 'px'
        this.container.style.top = (this.container.offsetTop - y) + 'px'
    }
}


class Embed {
    container: HTMLIFrameElement | HTMLDivElement
    iframe: HTMLIFrameElement
    config: FrameOptions
    api?: AsyncMethodReturns<ChildApi>
    resizer?: DraggableResizer
    methods: ParentApi

    constructor(root: HTMLElement, context: EmbedContext, config: FrameOptions) {
        let wrapper: HTMLIFrameElement | HTMLDivElement = document.createElement('iframe')
        this.config = config
        this.iframe = wrapper as HTMLIFrameElement
        this.methods = apiMethods(this)
        wrapper.setAttribute('id', config.id)
        wrapper.setAttribute('title', config.title)
        wrapper.setAttribute('src', config.srcURL)
        wrapper.style.border = '0px'

        if (config.float) {
            wrapper.style.float = config.float
        }
        if (config.fitContent !== false) {
            setTimeout(() => {
                iframeResizer({ checkOrigin: false, sizeWidth: true, log: false }, wrapper)
            }, 20)
            // set initial size small so the resizer will expand
            wrapper.style.width = '10px'
        }

        connectToChild<ChildApi>({
            iframe: wrapper as HTMLIFrameElement,
            methods: this.methods,
        }).promise.then((api) => {
            this.api = api
            api.setEmbedContext(context)
            config.onReady?.(api)
        })

        if (config.isResizable || config.isDraggable) {
            this.resizer = new DraggableResizer(this.iframe, config)
            // switch wrapper to be the resizer container
            wrapper = this.resizer.container
        }

        if (config.position) {
            for (const [key, value] of Object.entries(config.position)) {
                wrapper.style[key as any] = value
            }
        }

        wrapper.style.maxWidth = '100vw';
        wrapper.style.maxHeight = '100vh';

        this.container = wrapper
        root.appendChild(wrapper)
    }

    destroy = () => {
        this.container.remove()
    }

}


function openNewFrame(opts: FrameOptions) {
    let root: HTMLElement | null = null;

    const context = getContext()
    if (!context.isAuthorized) {
        return
    }

    // check for pre-existing frame
    const existing = document.querySelector(`iframe[id="${opts.id}"]`)
    if (existing) {
        const embed = (existing as any).__CHATBOT_EMBED as Embed | undefined
        if (embed && embed.api) {
            embed.api.setEmbedContext(context)
            return
        } else {
            existing.remove()
        }
    }

    if (opts.embedLocation) {
        const el = document.querySelector<HTMLElement>(opts.embedLocation)
        if (el) root = el
    } else {
        const paras = document.querySelectorAll('p[id]')
        const el = paras[paras.length - 1]
        if (el) root = el as HTMLElement
    }

    if (!root) return

    new Embed(root, context, opts)
}


function onPageLoad() {

    openNewFrame({
        id: 'chatbot-icon-embed',
        title: 'Staxly ChatBot Launch Icon',
        embedLocation: 'body',
        srcURL: process.env.PUBLIC_ENV__CHAT_URL || 'http://localhost:3000/chat/embed/icon',
        position: {
            width: '170px',
            height: '200px',
            position: 'fixed',
            right: '20px',
            bottom: '20px',
        },
    })
}

if (document.readyState === "complete") {
    onPageLoad() // script ran after page load
} else {
    window.addEventListener('load', onPageLoad)
}
