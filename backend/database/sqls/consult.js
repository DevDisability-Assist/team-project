/**
 * 예약 가능한 슬롯 조회 (staff_id 포함)
 */
const getAvailableSchedules = `
SELECT 
  at_no, 
  staff_id,
  start_time,
  end_time
FROM available_time
WHERE status = '상담가능' 
AND start_time > NOW()
ORDER BY start_time`;

/**
 * at_no로 staff_id 조회 (createReservation 시 필요)
 */
const getStaffIdByAtNo = `
SELECT staff_id 
FROM available_time 
WHERE at_no = ?`;

/**
 * [v14 수정] reservation 테이블에 예약 정보 삽입 (모든 NOT NULL 컬럼 포함)
 */
const createReservation = `
INSERT INTO reservation (
    user_id, staff_id, consult_category, name, 
    res_start, res_end, res_reason, at_no,
    res_status, created_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, '예약확정', NOW())`;

/**
 * available_time 테이블의 상태를 '예약'으로 변경
 */
const updateSlotStatus = `
UPDATE available_time SET status = '예약' WHERE at_no = ?`;

/**
 * [신규] user_id로 나의 모든 예약 내역 조회 (UI 바인딩용)
 * - staff 테이블(가정)과 JOIN하여 담당자 이름을 가져옵니다.
 * - 날짜 형식을 UI(mockData)와 동일하게 포맷팅합니다.
 */
const getMyReservations = `
SELECT
    r.res_no AS id,
    DATE_FORMAT(r.res_start, '%Y년 %m월 %d일 %H:%i') AS dateTime,
    IFNULL(m.user_name, '담당자 미지정') AS staff,
    IFNULL(r.consult_category, '미지정') AS type,
    r.res_status AS status
FROM reservation r
LEFT JOIN member m ON r.staff_id = m.staff_id
WHERE r.user_id = ?
ORDER BY r.res_start DESC;
`;

/**
 * [신규] user_id와 res_no로 예약을 '취소' 상태로 변경
 * - user_id를 조건에 넣어 본인의 예약만 취소할 수 있도록 합니다.
 */
const cancelReservationById = `
UPDATE reservation
SET res_status = '취소'
WHERE res_no = ? AND user_id = ?;
`;

module.exports = {
  getAvailableSchedules,
  getStaffIdByAtNo,
  createReservation,
  updateSlotStatus,
  getMyReservations,
  cancelReservationById,
};
