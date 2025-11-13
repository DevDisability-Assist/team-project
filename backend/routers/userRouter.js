const express = require("express");
const router = express.Router();
const consultService = require("../services/consultService");
const userService = require("../services/userService");
// const authMiddleware = require('../middleware/authMiddleware'); // [참고] 실제로는 로그인 인증 필요

// GET /api/schedule/available : 예약 가능한 모든 날짜/시간 조회
router.get("/available-time", consultService.getAvailableSchedules);

// [추가] POST /api/schedule/reserve : 신규 상담 예약 생성
// [참고] 실제로는 authMiddleware를 추가하여 로그인한 사용자만 접근하도록 해야 합니다.
// router.post('/reserve', authMiddleware, scheduleService.createReservation);
router.post("/reserve", consultService.createReservation);

// 일반 이용자 로그인 페이지에서 출력되는 마감 임박 공고 목록 조회.(데이터부족으로 2년치 조회 쿼리문으로 사용 중.)
router.get("/user-notices", async (req, res) => {
  let nowNotices = [];
  try {
    nowNotices = await userService.getExpiringNotices();
  } catch (err) {
    res.send({ err: "userServices Err: " + err });
  }
  res.status(200).send({ result: nowNotices });
});

router.get("/userwiter-survey", async (req, res) => {
  console.log("************\n\nuserRouter - GET /userwiter-survey called");
  // req에서 받은 userName을 서비스로 전달
  let survey = [];
  try {
    survey = await userService.getSurveyToUserWard("test");
    console.log("test nowSurvey is !!!!!!!", survey);
  } catch (err) {
    console.error("Error fetching survey:", err);
    res.send({ err: "userwiter-survey Err: " + err });
  }
  res.send({ result: survey });
});

module.exports = router;
