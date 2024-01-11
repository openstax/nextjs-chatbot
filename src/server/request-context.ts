import { OnProgressCB, OnCompleteCB, MessageSendContext, OpenStaxUser, DEFAULT_MODEL } from '../lib/types'


export class RequestContext implements MessageSendContext {

    onProgress: OnProgressCB
    onComplete: OnCompleteCB

    readonly subject!: string
    readonly topic!: string
    readonly orn!: string
    readonly chatId!: string
    readonly message!: string
    readonly model = DEFAULT_MODEL
    readonly user!: OpenStaxUser
    readonly secondsActive!: number

    constructor(onProgress: OnProgressCB, onComplete: OnCompleteCB, ctx: MessageSendContext & { user: OpenStaxUser }) {
        this.onProgress = onProgress
        this.onComplete = onComplete

        Object.assign(this, ctx)
    }

}
