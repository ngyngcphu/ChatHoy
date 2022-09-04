const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "https://ngyngcphu.github.io",
        methods: ["GET", "POST"],
    },
});
httpServer.listen(process.env.PORT || 3000);
let numClients = [];
let roomNumber = new Map();
io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
        socket.join(data);
        roomNumber.set(socket.id, data);
        if (numClients[data] == undefined || numClients[data] <= 0) {
            numClients[data] = 1;
        } else {
            numClients[data]++;
        }
        io.to(data).emit("numberClients", numClients[data]);
    });
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        let cnt = roomNumber.get(socket.id);
        numClients[cnt]--;
        io.to(cnt).emit("numberClients", numClients[cnt]);
    });
});