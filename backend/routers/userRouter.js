const express = require("express");
const router = express.Router();
const consultService = require("../services/consultService");
// const authMiddleware = require('../middleware/authMiddleware'); // [참고] 실제로는 로그인 인증 필요

// GET /api/schedule/available : 예약 가능한 모든 날짜/시간 조회
router.get("/available-time", consultService.getAvailableSchedules);

// [추가] POST /api/schedule/reserve : 신규 상담 예약 생성
// [참고] 실제로는 authMiddleware를 추가하여 로그인한 사용자만 접근하도록 해야 합니다.
// router.post('/reserve', authMiddleware, scheduleService.createReservation);
router.post("/reserve", consultService.createReservation);

module.exports = router;
