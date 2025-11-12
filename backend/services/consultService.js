const db = require("../database/mappers/mapper");
// Date 객체를 'HH:MM' 형식으로 변환하는 헬퍼 함수
function formatToTime(date) {
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Date 객체를 'YYYY-MM-DD' 형식으로 변환하는 헬퍼 함수
function formatDateToISO(date) {
  return date.toISOString().split("T")[0];
}
/**
 * 예약 가능한 모든 스케줄을 조회하여
 * { 'YYYY-MM-DD': [{ time: 'HH:MM', at_no: 1 }, ...], ... } 형식으로 가공
 */

module.exports.getAvailableSchedules = async (req, res) => {
  try {
    const schedules = await db.query("getAvailableSchedules");
    const formattedSchedules = {};

    schedules.forEach((slot) => {
      const dateKey = formatDateToISO(slot.start_time);
      const timeObj = {
        time: formatToTime(slot.start_time), // '10:30'
        at_no: slot.at_no, // 1
      };

      if (!formattedSchedules[dateKey]) {
        formattedSchedules[dateKey] = [];
      }
      formattedSchedules[dateKey].push(timeObj);
    });

    res.status(200).json(formattedSchedules);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "스케줄 조회 중 오류가 발생했습니다." });
  }
};
/**
 * [추가] 신규 상담 예약을 생성
 */
module.exports.createReservation = async (req, res) => {
  try {
    const { at_no } = req.body;
    // [중요] user_id는 실제로는 authMiddleware를 통해 세션/토큰에서 가져와야 합니다.
    // const { user_id } = req.user;
    const user_id = "temp_user_id"; // (임시 하드코딩)

    if (!at_no) {
      return res
        .status(400)
        .send({ message: "필수 정보(at_no)가 누락되었습니다." });
    }

    // 1. available_time 상태 변경
    const updateResult = await db.query("updateSlotStatus", [at_no]);
    if (updateResult.affectedRows === 0) {
      // 이미 예약되었거나 존재하지 않는 슬롯
      return res
        .status(409)
        .send({ message: "이미 예약되었거나 유효하지 않은 시간입니다." });
    }

    // 2. reservation 테이블에 삽입
    await db.query("createReservation", [user_id, at_no]);

    res.status(201).send({ message: "상담 예약이 완료되었습니다." });
  } catch (error) {
    console.error(error);
    // [참고] 트랜잭션이 없다면, 1번만 성공하고 2번이 실패할 경우 롤백 로직이 필요합니다.
    res.status(500).send({ message: "예약 처리 중 오류가 발생했습니다." });
  }
};
