require("dotenv").config({ path: "./dbConfig.env" });
console.log("[app.js] 1. Server process starting..."); // <-- 로그 1

const express = require("express");
const app = express();
const port = 3000;

//1.미들웨어 등록영역
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// [추가] 모든 요청을 로깅하는 최상위 미들웨어
app.use((req, res, next) => {
  console.log(`[GLOBAL] Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

//3.routing 영역
app.get("/", (req, res) => {
  res.send("Welcome!!");
});

// [수정] 구체적인 라우터를 먼저 등록
console.log("[app.js] 2. Loading authRouter...");
const authRouter = require("./routers/authRouter.js");
app.use("/auth", authRouter);
console.log("[app.js] 3. authRouter loaded.");

// 유저 모듈
const userRouter = require("./routers/userRouter");
app.use("/user", userRouter);

// 담당자 모듈
const staffRouter = require("./routers/staffRouter.js");
app.use("/staff", staffRouter);

// 회원가입 모듈
const signupRouter = require("./routers/signupRouter.js");
app.use("/register", signupRouter);

// 시스템 관리자의 권한 승인 목록 보기 모듈
// const approvalRouter = require("./routers/approvalRouter.js");
// app.use("/approval", approvalRouter);

// 시스템 관리자의 등록된 기관 목록 보기 모듈
const institutionRouter = require("./routers/systemRouter.js");
app.use("/institutions", institutionRouter);

//조사지 등록 모듈
const surveyRouter = require("./routers/surveyRouter.js");
app.use("/system/survey", surveyRouter);

const dataBoardRouter = require("./routers/dataBoardRouter.js");
app.use("/system/data-board", dataBoardRouter);

// [수정] 가장 일반적인 라우터를 마지막에 등록
const boardRouter = require("./routers/router.js");
app.use("/", boardRouter);

//2.server 실행영역
app.listen(port, () => {
  console.log("Server Start");
  console.log(`http://localhost:${port}`);
});
