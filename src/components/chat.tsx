'use client'

import { ENV } from '@/lib/env'
import { useToggle, useDidMount } from '@nathanstitt/sundry/base'



export const EmbeddedChat: FC = () => {
    useDidMount(() => {
        const script = document.createElement('script')
        script.src = ENV.IS_PROD ? '/assets/static/loader.js' : 'http://localhost:8233/chatbot-embed.js'
        script.setAttribute('data-chatbot-embed', 'true')
        script.async = true
        document.head.appendChild(script)
    })
    return null
}
