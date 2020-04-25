# HackDonalds' Emitter Socket

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
- [API](#api)
- [License](#license)

Emitter socket is used to emit events in a socket client swarm. 

*Client:* A WebSocket client on browser 

*Server:* Websocket server

*Room:* A namespace _Client_ connects to 

Socket messages between _Client_ and _Server_ are always `typeof RemoteTrigger`

## Install

Install with `npm install @hackdonalds/emitter-socket`

Import in your project:
```javascript
// ES6 Style
import EmitterClient from "@hackdonalds/emitter-socket"
// CommonJS
const EmitterClient = require("@hackdonalds/emitter-socket")

const peer = new EmitterClient({
    host: 'localhost',
    port: 8080,
    room: 'room_name_to_connect_to'
})
```

## Examples

Trigger the event on every peer connected to the room:

```javascript
peer.triggerOnRoom({
    type: 'event_type',
    ...yourData
})
```

Or trigger event on another peer

```javascript
peer.triggerOnClient(clientID, {
    type: 'event_type',
    ...yourData
})
```

## API

...

## License

[MIT License](https://opensource.org/licenses/MIT) © [Hilmi Tolga SAHIN](https://kucukkanat.com/)