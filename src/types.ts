export type RemoteTrigger = BroadcastTrigger | SendTrigger

export interface BroadcastTrigger {
    type: 'broadcast'
    room: string
    event: any
}

export interface SendTrigger {
    type: 'send'
    id: string
    event: any
}
