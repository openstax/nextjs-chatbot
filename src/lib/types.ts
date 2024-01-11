export type TranscriptMessage = {
    id: string
    chatId: string
    content: string
    isBot: boolean
    model?: string
    occurred: string
    feedback?: string
    liked?: boolean
    disliked?: boolean
}

export interface ChatbotUserRecord {
    id: string
    created: Date
    surveysGiven?: Array<string>
    secondsActive: number
    monthYearOfBirth: string
    acceptedTOU: boolean
}

export type ChatbotUser = ChatbotUserRecord & {
    messageCount: number
}

export interface UserLocation {
    country: string
    region: string
}

export type UserEligibility = "NEEDS_VERIFICATION" | "ELIGIBLE" | "INELIGIBLE"

export type UserEligibilityReply = {
    user?: ChatbotUser,
    eligibility: UserEligibility
    userLocation?: UserLocation
}
export interface OpenStaxUser {
    uuid: string;
    first_name: string;
    last_name: string;
}

export interface CookieUser extends OpenStaxUser {
    id: number;
    name: string;
    full_name: string;
    faculty_status: string;
    is_administrator: boolean;
    is_not_gdpr_location: boolean;
    contact_infos: Array<{
        type: string;
        value: string;
        is_verified: boolean;
        is_guessed_preferred: boolean;
    }>;
}

export type SSChatUpdate = {
    msgId: string
    isPending: boolean
    content: string,
}

export type ChatWithTranscript = {
    id: string,
    userId: string,
    model?: string
    transcript: TranscriptMessage[]
}

export type ChatMessageReply = ChatWithTranscript & {
    error?: string
}

export const BLANK_UUID = '00000000-0000-0000-0000-000000000000'
export const DUMMY_ORN = `${BLANK_UUID}:${BLANK_UUID}`
export const DUMMY_OX_USER: OpenStaxUser = { first_name: 'Blank', last_name: 'User', uuid: BLANK_UUID }
export const DUMMY_CB_USER: ChatbotUser = {
    id: BLANK_UUID,
    created: new Date,
    secondsActive: 0,
    messageCount: 0,
    monthYearOfBirth: '01-2001',
    acceptedTOU: true,
}

export type  OnProgressCB = (msg: SSChatUpdate) => void

export type OnCompleteCB =  (errorMessage?: string) => void

export type ChatWithFirstMessage = {
    id: string,
    occurred: string
    message: string
}


export type MessageSendContext = {
    secondsActive: number
    chatId: string
    message: string
    topic: string
    model: string
    subject: string
    orn: string
}

export const DEFAULT_MODEL = 'togethercomputer/llama-2-70b-chat'

export type InferenceMessage = {
    content: string
    isBot?: boolean
}

export type InferenceContext = {
    transcript: InferenceMessage[]
    model: string
    message: string
    topic: string
    subject: string
    onProgress(content: string): void
    onComplete({ error, content }: { error?: string, content?: string }): void
}

export type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];
