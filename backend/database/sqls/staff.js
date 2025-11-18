/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 */

// ⭐ 기존: survey 테이블의 모든 컬럼을 조회하며, 조사 번호(survey_no)를 기준으로 최신순(내림차순)으로 정렬합니다.
const surveySelect = `
SELECT 
    survey_no, 
    business_name, 
    purpose, 
    content, 
    writer, 
    status, 
    modify_reason, 
    created_at, 
    updated_at
FROM survey
ORDER BY survey_no DESC`;

// ⭐ 추가: survey 테이블과 ward 테이블을 조인하여 목록 조회에 필요한 정보를 포함합니다.
const surveyWardJoinSelect = `
SELECT 
    T1.*, 
    T2.name AS ward_name, 
    T2.address AS ward_address
FROM 
    survey T1
INNER JOIN 
    ward T2 ON T1.ward_no = T2.ward_no
ORDER BY T1.survey_no DESC`;

const supportPlan = `
  SELECT 
      support_plan_no,
      notice_no,
      support_plan_goal AS title,
      staff_name AS writer,
      DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt,
      DATE_FORMAT(support_plan_accepted_at, '%Y-%m-%d') AS requestDate,
      priority_no AS priority,
      support_plan_status AS status
  FROM support_plan
  ORDER BY created_at DESC;
`;

const wardsearch = `
SELECT
    w.name AS '이름',
    w.age AS '나이',
    NULL AS '생년월일',
    CASE
        WHEN w.sex = 'MALE' THEN '남'
        WHEN w.sex = 'FEMALE' THEN '여'
        ELSE w.sex
    END AS '성별',
    w.disabled_level AS '장애유형',
    w.address AS '주소',
    w.ward_no AS '피보호자번호'
FROM
    survey s -- FROM 절과 테이블 지정 (survey: s)
INNER JOIN
    ward w ON s.ward_no = w.ward_no -- JOIN 절과 조건 지정 (ward: w)
WHERE
    s.survey_no = ?
`;

const supportplan = `
  SELECT
    t1.support_plan_goal,
    DATE(t1.created_at) AS 작성일,
    t1.support_plan_status AS 우선순위_상태,
    t1.staff_name AS 작성자_이름,
    t1.ward_name AS 담당_구역_팀명,
    DATE(t1.created_at) AS 요청일
    
FROM 
    support_plan t1
ORDER BY 
    t1.created_at DESC`;

const wardno = `SELECT * FROM survey WHERE survey_no = ?`;

const spportinsert = `
INSERT INTO support_plan (
  priority_no,
  support_plan_goal,
  business_name,
  spend,
  plan,
  file_no,
  support_plan_status,
  writer_date
) VALUES (?, ?, ?, ?, ?, ?, '승인대기', NOW());
`;

const planitem = `    SELECT 
      support_plan_no,
      support_plan_goal,
      staff_name,
      created_at,
      writer_date,
      priority_no,
      plan
    FROM support_plan
    ORDER BY support_plan_no DESC`;

/**
 * 담당자 아이디(staff_id)으로 '상담가능' 스케줄 조회
 * - at_no: 삭제 시 필요
 * - staff_id: 본인 확인용
 */
const getAvailableSlots = `
SELECT 
    at_no, 
    start_time, 
    end_time
FROM available_time
WHERE staff_id = ? 
  AND status = '상담가능'
  AND start_time >= NOW()
ORDER BY start_time`;

/**
 * 담당자 ID(staff_id)로 '예약확정'된 상담 건수 조회 (날짜별 그룹)
 */
const getReservationCounts = `
SELECT 
    DATE_FORMAT(res_start, '%Y-%m-%d') AS date, 
    COUNT(*) AS count
FROM reservation
WHERE staff_id = ?
  AND res_status = '예약확정'
  AND res_start >= NOW()
GROUP BY DATE_FORMAT(res_start, '%Y-%m-%d')`;

/**
 * '상담가능' 스케줄 신규 등록
 * - 참고: DB 스키마의 recurring_rules가 CHAR(1)이지만,
 * - 프론트엔드 UI(반복 없음, 매주)와 맞추기 위해 VARCHAR(10)로 가정함.
 */
const createStaffSchedule = `
INSERT INTO available_time (
    start_time, 
    end_time, 
    staff_id, 
    status, 
    recurring_rules,
    created_at
) VALUES (?, ?, ?, '상담가능', ?, NOW())`;

/**
 * '상담가능' 스케줄 삭제
 * - at_no와 staff_id가 모두 일치해야 삭제 (보안)
 */
const deleteStaffSchedule = `
DELETE FROM available_time 
WHERE at_no = ? AND staff_id = ? AND status = '상담가능'`;

module.exports = {
  surveySelect,
  surveyWardJoinSelect,
  supportPlan,
  wardsearch,
  wardno,
  spportinsert,
  planitem,
  getAvailableSlots,
  getReservationCounts,
  createStaffSchedule,
  deleteStaffSchedule,
};
