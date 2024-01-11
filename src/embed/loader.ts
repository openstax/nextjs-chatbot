import { isAuthorized } from './store'

function onPageLoad() {
    if (!isAuthorized()) {
        return
    }

    const tag = document.createElement('script')
    tag.async = true
    const env = window.location.host.split('.')[0]
    tag.src = 'https://chat.'
    if (env !== 'openstax' ) { // production is just "openstax.org"
        tag.src += 'staging'
    }
    tag.src += '.research.openstax.org/assets/static/chatbot-embed.js'
    document.head.appendChild(tag)
}

if (document.readyState === "complete") {
    onPageLoad() // script ran after page load
} else {
    window.addEventListener('load', onPageLoad)
}
