import type { Migration } from '../migrate'

export default {
    version: 'reindex-chats',
    description: 'Reindex chats by updating each',
    async up(db, _, params) {
        console.log('reindexing chat')
        if (!params.dry) {
            const Chat = db.getModel('Chat')
            const chats = await Chat.scan()
            chats.forEach((c: any) => Chat.update(c))
        }
    }
} satisfies Migration
