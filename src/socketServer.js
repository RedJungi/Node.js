const express = require("express"); // express 모듈
const http = require("http");
const { Client } = require("ssh2"); // ssh모듈
const { Server } = require("socket.io");
const path = require("path"); // 경로 모듈

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const linux = {
  host: "192.168.105.131",
  port: 22,
  username: "hjg",
  password: "1234",
};

app.use(express.static("public")); // 정적 파일 제공

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "socket.html")); // 클라이언트 HTML 파일 제공
});

io.on("connection", (socket) => {
  console.log("클라이언트 접속");

  const conn = new Client(); // ssh2 모듈의 Client 클래스를 사용하여 SSH 클라이언트 인스턴스를 생성

  conn.on("ready", () => {
    console.log("SSH 연결 완료");

    conn.exec("ps", (err, stream) => {
      if (err) {
        socket.emit("error", { message: "명령어 실행 오류" });
        return;
      }
      stream.on("data", (data) => {
        socket.emit("pslog", data.toString());
      });

      stream.stderr.on("data", (data) => {
        socket.emit("error", data.toString());
      });

      socket.on("disconnect", () => {
        console.log("클라이언트 연결 종료");
        stream.close();
        conn.close();
      });
    });
  });
  conn.connect(linux); // SSH 서버에 연결
});
server.listen(3000, () => {
  console.log("서버가 3000 포트에서 실행");
});
