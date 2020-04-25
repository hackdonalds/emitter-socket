import Emitter from "@hackdonalds/emitter"
import guid from "./guid"
import { RemoteTrigger } from "./types"
type PossibleEvents = "ws:close" | "ws:error" | "ws:open" | "ws:message"
type Options = {
    host: string
    port: string | number
    room: string
    secure?: boolean
}
const nativeEvents = ["ws:close", "ws:error", "ws:open", "ws:message"]
export default class Client extends Emitter<PossibleEvents> {
    id: string
    ws: WebSocket
    constructor(opts: Options) {
        super()
        const { host, port, secure, room } = opts
        this.id = guid()
        const connectString = `ws${secure ? 's' : ''}://${host}:${port}/${room}/${this.id}`
        this.ws = new WebSocket(connectString)
        console.log(`Connecting to ${connectString}`)
        this.ws.onclose = (event) => this.emit('ws:close', event)
        this.ws.onerror = (event) => this.emit('ws:error', event)
        this.ws.onopen = (event) => this.emit('ws:open', event)
        this.ws.onmessage = (event) => {
            try {
                const parsedMessage = JSON.parse(event.data)
                this.emit('ws:message', parsedMessage)
                const { _event, ...rest } = parsedMessage
                if (_event && !nativeEvents.includes(_event)) {
                    this.emit(_event.type, ...rest)
                }
            } catch (error) {
                console.error(`Socket message is not a valid json object : `, event.data, error)
            }
        }
    }
    send(message: RemoteTrigger) {
        const stringifiedMessage = JSON.stringify(message)
        this.ws.send(stringifiedMessage)
    }
    triggerOnClient(clientID: string, _event: string, payload: any) {
        this.send({
            type: 'send',
            id: clientID,
            _event,
            payload
        })
    }
    triggerOnRoom(roomID: string, _event: string, payload: any) {
        this.send({
            type: 'broadcast',
            room: roomID,
            _event,
            payload
        })
    }

}