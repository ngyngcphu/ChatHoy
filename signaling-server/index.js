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
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("joinRoom", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});