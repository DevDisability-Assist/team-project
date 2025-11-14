/**
 * 사용자 ID로 사용자 정보 조회 (로그인 시 비밀번호 검증용)
 * 'role' 컬럼을 'user_role'로 별칭하여 사용합니다.
 * -- survey 테이블의 모든 컬럼을 조회하며, 조사 번호(survey_no)를 기준으로 최신순(내림차순)으로 정렬합니다.
 */
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

module.exports = {
  surveySelect,
  supportPlan,
};
