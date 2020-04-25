import WebSocket from "ws"
import withCors from "./cors"
import http from "http"
import express, { Express } from "express"
import { Room, Client } from "./Room"
import pathmatch from "path-match"
import {fixCircularReferences} from "./utils"
const route = pathmatch({
    // path-to-regexp options
    sensitive: false,
    strict: false,
    end: false,
});

const rooms: Room[] = []

export const WebServer = (app: Express, wss: WebSocket.Server) => {
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.get('/rooms', (req,res) => {
        res.send(JSON.stringify(fixCircularReferences(rooms)))
    })

    wss.on('connection', (ws, req) => {
        const {roomName, clientID} = route('/:roomName/:clientID')(req.url as string)
        console.log(roomName,clientID)
        if(!roomName || !clientID) {
            ws.close(400,"connect to /:roomName/:clientID ")
            return
        }
        
        if(roomName) {
            // If room doesn't exist
            const room = rooms.find(r => r.name == roomName) || new Room(roomName,wss)
            new Client(clientID,ws,room)
        }
    })

}


const app = withCors(express())
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 8080
WebServer(app, wss)
server.listen(PORT)
