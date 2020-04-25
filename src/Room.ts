import Emitter from "@hackdonalds/emitter";
import WebSocket from "ws"
import { RemoteTrigger } from "./types"
import guid from "./guid";

export class Client extends Emitter<'ws:message'> {
     constructor(public id: string, public ws: WebSocket, public room: Room) {
        super()
        this.id = id
        this.ws = ws
        this.room = room
        this.room.addClient(this)
        this.ws.onclose = () => {
            this.room.removeClient(this)
        }
        this.ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message as string)
                this.emit('ws:message', parsedMessage)
            } catch (error) {
                console.log(`Socket message is not a valid JSON object:`, message)
            }
        })

        this.on('ws:message', (message: RemoteTrigger) => {
            const { _event, payload } = message
            if (message.type == 'broadcast') {
                this.room.broadcast({_event, ...payload})
            } else if (message.type == 'send') {
                this.room.send(message.id as string, {_event, ...payload})
            }
        })
    }
    send(message: any) {
        this.ws.send(JSON.stringify(message))
    }
}

export class Room extends Emitter {
    id: string
    clients: Client[]
    wss: WebSocket.Server
    constructor(public name: string, wss: WebSocket.Server) {
        super()
        this.id = guid()
        this.wss = wss
        this.name = name
        this.clients = []
    }
    addClient(client: Client) {
        const clientExists = this.clients.find(c => c.id == client.id)
        if(!clientExists) {
            this.clients.push(client)
        }
        return this.clients
    }
    removeClient(client: Client) {
        const index = this.clients.indexOf(client)
        this.clients.splice(index, 1)
        return this.clients
    }
    broadcast(message: any) {
        this.clients.forEach(c => {
            c.ws.send(JSON.stringify(message))
        })
        return this.clients
    }
    send(clientID: string, message: any) {
        const foundClient = this.clients.find(client => client.id == clientID)
        if (foundClient) {
            foundClient.send(message)
        }
        return foundClient
    }
}