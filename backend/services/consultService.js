const db = require("../database/mappers/mapper");

// [v13 수정] KST(서버 로컬 시간) 기준 'HH:MM'
function formatToTime(date) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// [v13 수정] KST(서버 로컬 시간) 기준 'YYYY-MM-DD'
function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * [v12 수정] 30분 단위 시간 슬롯 생성 로직
 */
module.exports.getAvailableSchedules = async (req, res) => {
  console.log("--- getAvailableSchedules Service ---");
  try {
    // [v12 수정] staff_id도 함께 조회합니다.
    // 'getAvailableSchedules' 쿼리는 쿼리 파일에 있어야 합니다.
    const schedules = await db.query("getAvailableSchedules");
    console.log("DB Result (getAvailableSchedules):", schedules);

    const formattedSchedules = {};
    const thirtyMinutes = 30 * 60 * 1000; // 30분을 밀리초로

    schedules.forEach((slot) => {
      const startDate = slot.start_time;
      const endDate = slot.end_time;

      console.log(
        `Processing block at_no ${slot.at_no}: ${startDate} to ${endDate}`
      );

      let currentTime = new Date(startDate.getTime());

      while (currentTime < endDate) {
        const dateKey = formatDateToISO(currentTime);
        const timeStr = formatToTime(currentTime);

        const timeObj = {
          time: timeStr,
          at_no: slot.at_no,
          staff_id: slot.staff_id,
          start_time_stamp: currentTime.toISOString(),
        };

        if (!formattedSchedules[dateKey]) {
          formattedSchedules[dateKey] = [];
        }
        formattedSchedules[dateKey].push(timeObj);

        currentTime = new Date(currentTime.getTime() + thirtyMinutes);
      }
    });

    console.log("Formatted Response:", formattedSchedules);
    res.status(200).json(formattedSchedules);
  } catch (error) {
    console.error("스케줄 조회 오류:", error);
    res.status(500).send({ message: "스케줄 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [v14 수정] 신규 상담 예약을 생성 (res_start, res_end 저장 로직 수정)
 */
module.exports.createReservation = async (req, res) => {
  console.log("--- createReservation Service ---");
  try {
    const { at_no, start_time_stamp, consult_category, name, res_reason } =
      req.body;
    console.log("Request Payload:", req.body);

    const user_id = "test"; // (임시 하드코딩)

    if (!at_no || !start_time_stamp) {
      return res.status(400).send({
        message: "필수 정보(at_no, start_time_stamp)가 누락되었습니다.",
      });
    }

    // [v14 수정] 1. at_no로 staff_id를 조회합니다.
    console.log(`Executing Query: getStaffIdByAtNo with at_no = ${at_no}`);
    // 'getStaffIdByAtNo' 쿼리는 쿼리 파일에 있어야 합니다.
    const staffResult = await db.query("getStaffIdByAtNo", [at_no]);

    if (!staffResult || staffResult.length === 0) {
      console.warn("Staff ID not found for at_no:", at_no);
      return res
        .status(404)
        .send({ message: "유효하지 않은 예약 블록입니다." });
    }

    const staff_id = staffResult[0].staff_id;
    console.log("Found staff_id:", staff_id);

    // [v14 수정] 2. res_start, res_end 계산 (상담 시간을 30분으로 가정)
    const res_start = new Date(start_time_stamp);
    // 30분(ms)을 더해 종료 시간 설정
    const res_end = new Date(res_start.getTime() + 30 * 60 * 1000); // [v14 수정] 3. reservation 테이블에 staff_id 및 시간 포함하여 삽입

    const params = [
      user_id,
      staff_id,
      consult_category || "미지정", // UI에서 받아야 함
      name || "홍길동", // UI에서 받아야 함
      res_start,
      res_end,
      res_reason || "", // UI에서 받아야 함
      at_no,
    ];

    console.log(`Executing Query: createReservation with params:`, params);
    // 'createReservation' 쿼리는 쿼리 파일에 있어야 합니다.
    await db.query("createReservation", params); // [v13 수정] 4. at_no 블록을 '예약'으로 변경합니다.

    // (참고: 이 로직은 여전히 at_no 블록 *전체*를 예약 상태로 바꿉니다.)
    console.log(`Executing Query: updateSlotStatus with at_no = ${at_no}`);
    // 'updateSlotStatus' 쿼리는 쿼리 파일에 있어야 합니다.
    const updateResult = await db.query("updateSlotStatus", [at_no]);

    if (updateResult.affectedRows === 0) {
      console.warn("Update failed: Slot already taken or does not exist.");
    }

    console.log("Reservation successful (block reserved).");
    res.status(201).send({ message: "상담 예약이 완료되었습니다." });
  } catch (error) {
    console.error("예약 생성 오류:", error);
    res.status(500).send({ message: "예약 처리 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 나의 상담 내역 조회
 */
module.exports.getMyReservations = async (req, res) => {
  console.log("--- getMyReservations Service ---");
  try {
    // [임시] 실제로는 authMiddleware에서 req.user.id를 가져와야 함
    const user_id = "test";

    // 'getMyReservations' 쿼리는 쿼리 파일에 있어야 합니다.
    const reservations = await db.query("getMyReservations", [user_id]);
    console.log("DB Result (getMyReservations):", reservations);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("나의 예약 조회 오류:", error);
    res.status(500).send({ message: "예약 조회 중 오류가 발생했습니다." });
  }
};

/**
 * [신규] 상담 예약 취소
 */
module.exports.cancelMyReservation = async (req, res) => {
  console.log("--- cancelMyReservation Service ---");
  try {
    const { res_no } = req.params; // 라우트에서 res_no를 받음
    // [임시] 실제로는 authMiddleware에서 req.user.id를 가져와야 함
    const user_id = "test";

    // 'cancelReservationById' 쿼리는 쿼리 파일에 있어야 합니다.
    const result = await db.query("cancelReservationById", [res_no, user_id]);

    if (result.affectedRows === 0) {
      // 본인 예약이 아니거나, 존재하지 않는 예약
      return res
        .status(404)
        .send({ message: "예약을 찾을 수 없거나 취소 권한이 없습니다." });
    }

    res.status(200).send({ message: "예약이 취소되었습니다." });
  } catch (error) {
    console.error("예약 취소 오류:", error);
    res.status(500).send({ message: "예약 취소 중 오류가 발생했습니다." });
  }
};
