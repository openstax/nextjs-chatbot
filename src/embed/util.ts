import { Size } from './api'


export function applyPositioning<EL extends HTMLElement>(el: EL, size: Size, defaults: Size = {}) {
    for (const prop of ['left', 'right', 'top', 'bottom', 'width', 'height'] as (keyof Size)[]) {
        const value = size[prop] || defaults[prop]
        if (value) {
            el.style[prop] = value
        }
    }
    return el
}

export function applyStyle<EL extends HTMLElement>(el: EL, style: Partial<CSSStyleDeclaration>) {
  for (const [key, value] of Object.entries(style) as [any, string][] ) {
        el.style[key] = value
    }
    return el
}
