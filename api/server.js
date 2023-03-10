require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const multer = require('multer');
const {responseError, callRes} = require('./response/error');

const app = express()
const appChat = express()
const http = require("http")
const { Server } = require("socket.io")
appChat.use(cors())

// use express.json as middleware
app.use('/public', express.static(__dirname + '/webview'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// connect to MongoDB
const url = process.env.mongoURI;
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(`errors: ${err}`)
    );

app.get('/it4788/finishedsignup', (req, res) => {
    res.sendFile(__dirname + '/webview/finishSignup.html');
});

// use Routes
app.use('/it4788/auth', require('./routes/auth'));
app.use('/it4788/friend', require('./routes/friend'));
app.use('/it4788/post', require('./routes/posts'));
app.use('/it4788/search', require('./routes/search'));
app.use('/it4788/comment', require('./routes/comments'));
app.use('/it4788/like', require('./routes/likes'));
app.use('/it4788/friend', require('./routes/friend'));
app.use('/it4788/setting', require('./routes/settings'));
app.use('/it4788/user', require('./routes/user'));
app.use('/it4788/chat', require('./routes/chat'));
app.use(function (err, req, res, next) {
    if(err instanceof multer.MulterError) {
        if(err.code === 'LIMIT_UNEXPECTED_FILE') {
            return callRes(res, responseError.EXCEPTION_ERROR, "'" + err.field + "'" + " không đúng với mong đợi. Xem lại trường ảnh hoặc video gửi lên trong yêu cầu cho đúng");
        }
    }
    console.log(err);
    return callRes(res, responseError.UNKNOWN_ERROR, "Lỗi chưa xác định");
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`))

// chat server
const server = http.createServer(appChat)
const io = new Server(server)

io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`)

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("send_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("delete_message", (data) => {
        console.log(data)
        socket.to(data.room).emit("receiver_delete", data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id)
    })
})

server.listen(3001, () => {
    console.log("SERVER CHAT RUNNING " + 3001)
})
