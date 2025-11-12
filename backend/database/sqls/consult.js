const getAvailableSchedules = `
SELECT 
  at_no, 
  start_time
FROM available_time
WHERE status = '상담가능' 
AND start_time > NOW()
AND staff_name = ?
ORDER BY start_time`;

// 상담 신청 - reservation 테이블에 예약 정보 삽입
const createReservation = `
INSERT INTO reservation (user_id, at_no, res_status, created_at, updated_at)
VALUES (?, ?, '예약확정', NOW(), NOW())`;

// 상담 신청 - available_time 테이블의 상태를 '예약'으로 변경
const updateSlotStatus = `
UPDATE available_time SET status = '예약' WHERE at_no = ?`;

module.exports = {
  getAvailableSchedules,
  createReservation,
  updateSlotStatus,
};
