const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
    },
});
httpServer.listen(3000);
let numClients = [];
let roomNumber = new Map();
io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
        socket.join(data);
        roomNumber.set(socket.id, data);
        if (numClients[data] == undefined) {
            numClients[data] = 1;
        } else {
            numClients[data]++;
        }
        io.to(data).emit("numberClients", numClients[data]);
    });
    socket.on("back", (data) => {
        numClients[data]--;
    })
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        let cnt = roomNumber.get(socket.id);
        numClients[cnt]--;
        socket.to(cnt).emit("numberClients", numClients[cnt]);
    });
});