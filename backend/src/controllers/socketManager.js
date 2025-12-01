import { connect, Connection, disconnect } from "mongoose";
import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server);

    io.on("connection", (socket) => {
        socket.on("join-call", (path) => {
            if(connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach(connection => {
                io.to(connection).emit("user-joined", socket.id, connections[path]);
            });

            if(messages[path] !== undefined) {
                messages[path].forEach(messages => {
                    io.to(socket.id).emit("chat-message", message['data'], message['sender'], message['socket-id-sender']);
                });
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue]) => {
                if(!isFound, roomValue.includes(socket.id)) {
                    return [roomKey, true];
                }

                return [room, isFound];
            }, ['', false]);

            if(found) {
                if(messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({"sender": sender, "data": data, "socket-id-sender": socket.id});

                connections[matchingRoom].forEach(connection => {
                    io.to(connection).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on(disconnect, () => {
            var diffTime = Math.abs(timeOnline[socket.id] - new Date());
            var key;

            for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for(let i = 0; i < v.length; ++a) {
                    if(v[a] == socket.id) {
                        key = k;

                        connections[key].forEach(connection => {
                            io.to(connection).emit("user-left", socket.id);
                        });

                        var index = connections[key].indexOf(socket.id);
                        connections[key].splice(index, 1);

                        if(connections[key].length == 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        });
    });
}