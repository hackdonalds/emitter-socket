export type RemoteTrigger = BroadcastTrigger | SendTrigger

export interface BroadcastTrigger {
    type: 'broadcast'
    room: string
    _event: string
    payload: any
}

export interface SendTrigger {
    type: 'send'
    id: string
    _event: string
    payload: any
}
