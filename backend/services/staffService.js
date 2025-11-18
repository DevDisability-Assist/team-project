const db = require("../database/mappers/mapper");

<<<<<<< HEAD
exports.surveySelect = async (req, res) => {
  console.log("서베이셀렉트 ");
  let result = await db.query("surveySelect", []);
  console.log("여기다, ", result);
  res.send(result);
};

exports.supportPlan = async (req, res) => {
  console.log("돌겠네");
=======
// 1. surveySelect: 조사 목록 조회 (피보호자 이름/주소 포함)
const surveySelect = async (req, res) => {
  console.log("Survey List 조회");
>>>>>>> main-bjw
  try {
    // sql_queries.js에 새로 추가된 surveyWardJoinSelect 쿼리를 사용
    let result = await db.query("surveyWardJoinSelect", []);
    console.log("Survey List 조회 결과:", result.length, "건");
    res.send(result);
  } catch (error) {
    console.error("surveySelect DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "조사 목록 조회 중 데이터베이스 오류 발생" });
  }
};

<<<<<<< HEAD
exports.wardsearch = async (req, res) => {
=======
// 2. getSurveyDetail: 단일 조사지 상세 정보 조회 (front-end의 Survey 컴포넌트가 호출)
const getSurveyDetail = async (req, res) => {
  console.log(
    "*****************************************\n나는 서베이디테일을 조회할것입니다"
  );
  const { surveyNo } = req.params; // URL 파라미터에서 survey_no를 추출
  console.log(`Survey Detail 조회: surveyNo=${surveyNo}`);

  if (!surveyNo) {
    console.log("번호가없다고합니다.");
    return res.status(400).send({ message: "조사 번호가 필요합니다." });
  }

>>>>>>> main-bjw
  try {
    // 상세 조회용 쿼리 이름(예: surveySelectDetail)과 파라미터 전달
    let result = await db.query("wardsearch", surveyNo);
    console.log("DB조회결과************************************\n", result);
    res.send({ result: result });
    // if (result && result.length > 0) {
    //   console.log("Survey Detail 조회 성공:", result[0].survey_no);
    //   res.send(result[0]); // 단일 객체 반환
    // } else {
    //   res.status(404).send({ message: "해당 조사지를 찾을 수 없습니다." });
    // }
  } catch (error) {
    console.error("getSurveyDetail DB 쿼리 오류:", error);
    res
      .status(500)
      .send({ message: "조사 상세 조회 중 데이터베이스 오류 발생" });
  }
};

const supportPlan = async (req, res) => {
  console.log("지원 계획 목록 조회");
  try {
    let result = await db.query("supportPlan", []);
    console.log("지원 계획 목록 조회 성공");
    res.send(result);
  } catch (error) {
    console.error("supportPlan DB 쿼리 실행 오류:", error);
    res
      .status(500)
      .send({ message: "지원 계획 조회 중 데이터베이스 오류 발생" });
  }
};

// 3. wardsearch: 피보호자 상세 정보 조회 (front-end의 ApplicantInfo 컴포넌트가 호출)
const wardsearch = async (req, res) => {
  // URL 파라미터 또는 쿼리에서 ward_no 추출
  const ward_no = req.params.ward_no || req.query.ward_no;
  console.log(`Ward Search 조회: ward_no=${ward_no}`);

  if (!ward_no) {
    return res.status(400).send({ message: "피보호자 번호가 필요합니다." });
  }

  try {
    // wardsearch 쿼리 실행 시 ward_no를 매개변수로 전달
    let result = await db.query("wardsearch", [ward_no]);

    if (result && result.length > 0) {
      console.log("Ward Search 조회 성공:", result[0]["이름"]);
      res.send(result[0]); // 단일 객체 반환
    } else {
      res.status(404).send({ message: "해당 피보호자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("wardsearch DB 쿼리 실행 오류:", error);
    res
      .status(500)
      .send({ message: "피보호자 정보 조회 중 데이터베이스 오류 발생" });
  }
};

const createSupportPlan = async (req, res) => {
  console.log("승인요청 POST 데이터:", req.body);

  const {
    priority_no,
    support_plan_goal,
    business_name,
    spend,
    plan,
    file_no,
    support_plan_status,
  } = req.body;

  if (!support_plan_goal || !business_name) {
    return res.status(400).send({ message: "필수 데이터 누락" });
  }

  try {
    await db.query("spportinsert", [
      priority_no,
      support_plan_goal,
      business_name,
      spend,
      plan,
      file_no,
      support_plan_status,
    ]);

    console.log("지원 계획 INSERT 성공");
    res.send({ message: "승인요청 완료" });
  } catch (error) {
    console.error("createSupportPlan DB 오류:", error);
    res.status(500).send({ message: "지원 계획 등록 실패" });
  }
};

// 6. planItemList: support_plan 테이블에서 상세 항목 조회
const planItemList = async (req, res) => {
  console.log("지원 계획 항목 목록 조회");
  try {
    let result = await db.query("planitemtem", []);
    res.send(result);
  } catch (error) {
    console.error("planItemList DB 쿼리 실행 오류:", error);
    res.status(500).send({ message: "지원 계획 항목 조회 실패" });
  }
};

<<<<<<< HEAD
// 날짜 포맷팅 (YYYY-MM-DD) - 타임존 문제 방지
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 시간 포맷팅 (HH:MM)
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * [신규] 1. 담당자 스케줄 조회 (GET /api/staff/schedules)
 * - 인증된 담당자(req.user)의 '상담가능' 슬롯과 '예약건수'를 조합
 */
exports.getSchedules = async (req, res) => {
  // authMiddleware가 주입한 사용자 정보 (가정)
  const staff_id = req.user.id; // 예: 'staff_user_01' (member.user_id)
  const staff_name = req.user.name; // 예: '홍길동' (member.user_name)

  if (!staff_id || !staff_name) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    // 1. '상담가능' 슬롯 조회 (at_no 포함)
    const availableSlots = await db.query("getAvailableSlots", [staff_name]);
    // 2. '예약확정' 건수 조회
    const reservationCounts = await db.query("getReservationCounts", [
      staff_id,
    ]);

    // 3. 프론트엔드가 요구하는 scheduledData 객체로 가공
    const scheduledData = {};

    // 3-1. '상담가능' 슬롯 가공
    availableSlots.forEach((slot) => {
      const dateKey = formatDateISO(new Date(slot.start_time));
      if (!scheduledData[dateKey]) {
        scheduledData[dateKey] = [];
      }

      // 프론트엔드 모달에서 삭제/조회할 수 있도록 at_no와 label 전달
      scheduledData[dateKey].push({
        type: "available",
        label: `${formatTime(slot.start_time)} - ${formatTime(
          slot.end_time
        )} 상담가능`,
        at_no: slot.at_no, // [중요] 삭제 시 사용할 고유 ID
      });
    });

    // 3-2. '예약건수' 가공
    reservationCounts.forEach((item) => {
      const dateKey = item.date; // YYYY-MM-DD
      if (!scheduledData[dateKey]) {
        scheduledData[dateKey] = [];
      }
      scheduledData[dateKey].push({
        type: "reservation",
        label: `${item.count}건 예약`,
      });
    });

    res.status(200).json(scheduledData);
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    res.status(500).send({ message: "스케줄 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 2. 담당자 스케줄 생성 (POST /api/staff/schedule/create)
 */
exports.createSchedule = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { start_time, end_time, recurring_rules } = req.body;

  if (!start_time || !end_time) {
    return res
      .status(400)
      .send({ message: "시작 시간과 종료 시간이 필요합니다." });
  }

  try {
    // recurring_rules를 DB 스키마(CHAR(1))에 맞게 변환
    const recurringRulesMap = {
      none: "N",
      weekly: "W",
      weekdays: "D",
    };
    const recurring_rule_char =
      recurringRulesMap[recurring_rules] || recurringRulesMap["none"];

    // --- 반복 날짜 생성 로직 ---
    const datesToInsert = [];
    const baseStartDate = new Date(start_time);
    const baseEndDate = new Date(end_time);

    if (recurring_rules === "none") {
      datesToInsert.push({ start: baseStartDate, end: baseEndDate });
    } else {
      const recurrenceEndDate = new Date(baseStartDate);
      recurrenceEndDate.setMonth(recurrenceEndDate.getMonth() + 3); // 3개월 후까지 반복

      let currentDate = new Date(baseStartDate);
      const dayOfWeek = baseStartDate.getDay(); // 0=일, 1=월, ..., 6=토

      while (currentDate <= recurrenceEndDate) {
        const currentDayOfWeek = currentDate.getDay();

        if (recurring_rules === "weekly") {
          if (currentDayOfWeek === dayOfWeek) {
            const newStartDate = new Date(currentDate);
            newStartDate.setHours(
              baseStartDate.getHours(),
              baseStartDate.getMinutes(),
              baseStartDate.getSeconds()
            );

            const newEndDate = new Date(currentDate);
            newEndDate.setHours(
              baseEndDate.getHours(),
              baseEndDate.getMinutes(),
              baseEndDate.getSeconds()
            );

            datesToInsert.push({ start: newStartDate, end: newEndDate });
          }
        } else if (recurring_rules === "weekdays") {
          if (currentDayOfWeek >= 1 && currentDayOfWeek <= 5) {
            // 월요일부터 금요일
            const newStartDate = new Date(currentDate);
            newStartDate.setHours(
              baseStartDate.getHours(),
              baseStartDate.getMinutes(),
              baseStartDate.getSeconds()
            );

            const newEndDate = new Date(currentDate);
            newEndDate.setHours(
              baseEndDate.getHours(),
              baseEndDate.getMinutes(),
              baseEndDate.getSeconds()
            );

            datesToInsert.push({ start: newStartDate, end: newEndDate });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    // --- 반복 날짜 생성 로직 끝 ---

    // 생성된 모든 날짜에 대해 DB에 INSERT
    for (const datePair of datesToInsert) {
      const params = [
        datePair.start, // Date 객체
        datePair.end, // Date 객체
        staff_name,
        recurring_rule_char,
      ];
      await db.query("createStaffSchedule", params);
    }

    res.status(201).json({
      message: "스케줄이 성공적으로 등록되었습니다.",
      count: datesToInsert.length, // 몇 건이 등록되었는지 정보 제공
    });
  } catch (error) {
    console.error("스케줄 생성 오류:", error);
    res.status(500).send({ message: "스케줄 등록 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 3. 담당자 스케줄 삭제 (DELETE /api/staff/schedule/delete/:at_no)
 */
exports.deleteSchedule = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { at_no } = req.params; // URL 파라미터에서 at_no 추출

  if (!at_no) {
    return res.status(400).send({ message: "삭제할 스케줄 ID가 필요합니다." });
  }

  try {
    const result = await db.query("deleteStaffSchedule", [at_no, staff_name]);

    if (result.affectedRows === 0) {
      // 본인 스케줄이 아니거나, 이미 삭제되었거나, '상담가능' 상태가 아님
      return res
        .status(404)
        .send({ message: "스케줄을 찾을 수 없거나 삭제 권한이 없습니다." });
    }

    res.status(200).send({ message: "스케줄이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("스케줄 삭제 오류:", error);
    res.status(500).send({ message: "스케줄 삭제 중 오류가 발생했습니다." });
  }
};

// --- [신규 추가] 담당자 예약 관리 ---

/**
 * [신규] 4. 담당자 예약 목록 조회 (GET /api/staff/reservations)
 * - (요구사항 1, 2)
 */
exports.getStaffReservations = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { searchType, startDate, endDate, keyword } = req.query;

  if (!staff_name) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    const queryParams = [staff_name];
    let queryName = "getStaffReservationsBase"; // 기본 쿼리

    // 검색 조건에 따라 쿼리 이름과 파라미터 동적 변경
    if (searchType === "date" && startDate && endDate) {
      queryName = "getStaffReservationsByDate";
      queryParams.push(startDate, endDate);
    } else if (searchType === "applicant" && keyword) {
      queryName = "getStaffReservationsByApplicant";
      queryParams.push(`%${keyword}%`);
    } else if (searchType === "reason" && keyword) {
      queryName = "getStaffReservationsByReason";
      queryParams.push(`%${keyword}%`);
    }

    const reservations = await db.query(queryName, queryParams);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("담당자 예약 목록 조회 오류:", error);
    res.status(500).send({ message: "예약 목록 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 5. 담당자 예약 취소 (POST /api/staff/reservations/cancel/:at_no)
 * - (요구사항 3)
 */
exports.cancelStaffReservation = async (req, res) => {
  const staff_name = req.user.name; // 인증된 담당자 이름
  const { at_no } = req.params;

  if (!at_no) {
    return res
      .status(400)
      .send({ message: "취소할 예약 ID(at_no)가 필요합니다." });
  }
  if (!staff_name) {
    return res.status(401).send({ message: "인증 정보가 없습니다." });
  }

  try {
    const result = await db.query("cancelStaffReservation", [
      at_no,
      staff_name,
    ]);

    if (result.affectedRows === 0) {
      // 본인 스케줄이 아니거나, '예약' 상태가 아님
      return res
        .status(404)
        .send({ message: "취소할 예약을 찾을 수 없거나 권한이 없습니다." });
    }

    // (중요) TODO: (요구사항 3) 신청자(사용자)에게 취소 알림 전송 로직
    console.log(
      `(Notification) at_no: ${at_no} 예약이 담당자에 의해 취소됨. 사용자에게 알림 전송 필요.`
    );

    res.status(200).send({ message: "예약이 성공적으로 취소되었습니다." });
  } catch (error) {
    console.error("담당자 예약 취소 오류:", error);
    res.status(500).send({ message: "예약 취소 중 오류가 발생했습니다." });
  }
=======
module.exports = {
  surveySelect,
  getSurveyDetail,
  supportPlan,
  wardsearch,
  createSupportPlan,
  planItemList, // 새로 추가된 함수
>>>>>>> main-bjw
};
