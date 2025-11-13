require("dotenv").config({ path: "./dbConfig.env" });
console.log("[app.js] 1. Server process starting..."); // <-- 로그 1

const express = require("express");
const app = express();
const port = 3000;

//1.미들웨어 등록영역
//body parser ==> 필수
//컨텐트 타입 두 개 필수로 넣어야함(검색=urlencoded)
// content-type : application/x-www-form-urlencoded == 경로의 "?" 에 있는 key의 value
app.use(express.urlencoded({ extended: true }));
// content-type : application/json
app.use(express.json());

//2.server 실행영역
app.listen(port, () => {
  console.log("Server Start");
  console.log(`http://localhost:${port}`);
});
//3.routing 영역
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

//라우팅 모듈 등록  endpoint에 위치한 미들웨어랑 다를게 없음
const boardRouter = require("./routers/router.js");
app.use("/", boardRouter);

// [신규] 인증 라우터 등록
console.log("[app.js] 2. Loading authRouter...");
const authRouter = require("./routers/authRouter.js");
app.use("/auth", authRouter);
console.log("[app.js] 3. authRouter loaded.");

// 유저 모듈
const userRouter = require("./routers/userRouter");
app.use("/api/user", userRouter);

// 회원가입 모듈
const signupRouter = require("./routers/signupRouter.js");
app.use("/register", signupRouter);
//조사지 등록 모듈
const surveyRouter = require("./routers/surveyRouter.js");
app.use("/system/survey", surveyRouter); // 👈 프론트가 호출할 기본 주소
//유저 모듈
const staffRouter = require("./routers/staffRouter");
app.use("/staff", staffRouter);
