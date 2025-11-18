const express = require("express");
// Express의 Router 모듈을 사용해서 라우팅 등록, 라우팅을 별도 파일로 관리
const router = express.Router();
// 해당 라우터를 통해 제공할 서비스를 가져옴
const staffService = require("../services/staffService.js");
// [신규] 인증 미들웨어 임포트
const { verifyAccessToken } = require("../middleware/authMiddleware");

<<<<<<< HEAD
router.get("/", staffService.surveySelect);
// wardsearch
router.get("/wardsearch", staffService.wardsearch);

// 1. 담당자 스케줄 조회 (캘린더 로드 시)
// (경로: /api/staff/schedules)
router.get("/schedules", verifyAccessToken, staffService.getSchedules);

// 2. 담당자 스케줄 생성 (모달 '적용' 버튼)
// (경로: /api/staff/schedule/create)
router.post("/schedule/create", verifyAccessToken, staffService.createSchedule);

// 3. 담당자 스케줄 삭제 (모달 '삭제' 버튼)
// (경로: /api/staff/schedule/delete/123)
router.delete(
  "/schedule/delete/:at_no",
  verifyAccessToken,
  staffService.deleteSchedule
);

// 담당자 예약 관리 (ReservationManagement.vue 연동)
/**
 * 4. 담당자 예약 목록 조회 (GET /api/staff/reservations)
 * - (요구사항 1, 2)
 */
router.get(
  "/reservations",
  verifyAccessToken,
  staffService.getStaffReservations
);

/**
 * 5. 담당자 예약 취소 (POST /api/staff/reservations/cancel/:at_no)
 * - (요구사항 3)
 */
router.post(
  "/reservations/cancel/:at_no",
  verifyAccessToken,
  staffService.cancelStaffReservation
);
=======
// 실제 라우팅 등록 영역
// 해당 javascript 파일의 마지막 코드, 모듈화
// 위에 선언한 기능(변수, 함수 등)들 중 외부로 노출할 대상을 설정
// => 다른 파일에서 require()을 통해 가져옴
router.get("/support-plan", staffService.supportPlan);
router.post("/support-plan", staffService.createSupportPlan);
router.get("/survey-select", staffService.surveySelect);

router.get("/:surveyNo", staffService.getSurveyDetail);

>>>>>>> main-bjw
module.exports = router;
