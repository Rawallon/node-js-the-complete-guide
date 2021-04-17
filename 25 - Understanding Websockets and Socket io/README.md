# Wrap Up

To first talk about Websockets we should remember that the way http works is through a request/response, so a client sends a request to the server and after that request is processed the server sends a response, and this works for the majority of feature, but a problem arises if we try to send something from the server to the client (whithout the first request)

# Websockets

Websockets are stabilished through HTTP, it uses a handshake to "upgrade" it to a Websocket protocol, so instead of only using request/response we also get the ability to push data.
