const express = require("express"); // express 모듈
const app = express();

app.use(login); // 미들웨어를 상단에 두는 이유는 글로벌하게 사용하기 위해

app.get("/", (req, res, next) => {
  console.log("homepage");
  res.send("<h1>HomePage</h1>");
});

app.get("/users", (req, res, next) => {
  console.log("user");
  res.send("<h1>User</h1>");
});

function login(req, res, next) {
  console.log("login...");

  next(); // 다음 미들웨어로 이동
}

app.listen(2000);

//실행순서
//app.use에 login을 찾음
//16번째 줄 login 미들웨어 실행
//login 미들웨어에서 next()를 호출하여 다음 미들웨어로 이동
//끝난 후 6번째 줄의 app.get("/")가 실행되어 "homepage"가 출력됨

//user페이지도 마찬가지로 app.use에 login이 있으므로
//login 미들웨어가 실행되고, next()를 호출하여 다음 미들웨어로 이동
//11번째 줄의 app.get /users 가 실행되어 "user"가 출력됨
