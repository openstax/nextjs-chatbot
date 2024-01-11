export const DynamoDBSchema = {
    format: 'onetable:1.1.0',
    version: '0.0.1',
    indexes: {
        primary: { hash: 'pk', sort: 'sk' },
        gs1: { hash: 'gs1' },
    },
    models: {
        User: {
            pk: { type: String, value: 'us:${id}' },
            sk: { type: String, value: 'created' },
            id: { type: String, required: true, readonly: true }, // unlike other models, the id is provided: it's the users uuid from accounts
            created: { type: Date, readonly: true },
            secondsActive: { type: Number, default: 0 },
            monthYearOfBirth: { type: String },
            surveysGiven: { type: Array, default: [] },
            acceptedTOU: { type: Boolean, default: false },
        },

        Chat: {
            pk: { type: String, value: 'ct:${id}' },
            sk: { type: String, value: 'userId' },
            gs1: { type: String, value: 'us:${userId}' },
            id: { type: String, generate: 'ulid', readonly: true },
            created: { type: Date, readonly: true },
            userId: { type: String, required: true, reference: 'User:primary:id=id' },
            model: { type: String },
        },

        Message: {
            pk: { type: String, value: 'msg:${id}' },
            sk: { type: String, value: 'chatId' },
            gs1: { type: String, value: 'msg:${chatId}' },
            id: { type: String, generate: 'ulid', readonly: true },
            created: { type: Date, readonly: true },
            chatId: { type: String, required: true, readonly: true, reference: 'Chat:primary:id=id', },
            content: { type: String, required: true },
            isBot: { type: 'boolean', map: 'bot', default: false },
            liked: { type: 'boolean', map: 'liked', default: false },
            disliked: { type: 'boolean', map: 'disliked', default: false },
            feedback: { type: String, required: false },
            orn: { type: String, value: 'us:${userId}' },
            topic: { type: String },
            secondsActive: { type: Number, default: 0 },
            subject: { type: String },
        },
    } as const,
    params: {
        isoDates: true,
        timestamps: 'create',
    },
}
