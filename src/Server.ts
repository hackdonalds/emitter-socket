import WebSocket from "ws"
import withCors from "./cors"
import http from "http"
import express, { Express } from "express"
import { Room, Client } from "./Room"
import pathmatch from "path-match"
import { fixCircularReferences } from "./utils"
const route = pathmatch({
    // path-to-regexp options
    sensitive: false,
    strict: false,
    end: false,
});

const rooms: Room[] = []

const WebServer = (app: Express, wss: WebSocket.Server) => {
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    if (process.env.NODE_ENV == "development") {
        app.get('/rooms', (req, res) => {
            res.send(fixCircularReferences(rooms))
        })
    }

    wss.on('connection', (ws, req) => {
        const { roomName, clientID } = route('/:roomName/:clientID')(req.url as string)
        if (!roomName || !clientID) {
            ws.close(400, "connect to /:roomName/:clientID ")
            return
        }

        if (roomName) {
            // If room doesn't exist
            const existingRoom = rooms.find(r => r.name == roomName)
            let room = existingRoom || new Room(roomName, wss)

            if (!existingRoom) {
                rooms.push(room)
            }
            // @ts-ignore
            const client = new Client(clientID, ws, room)
        }
    })

}


export const app = withCors(express())
export const server = http.createServer(app)
export const wss = new WebSocket.Server({ server });

WebServer(app, wss)


