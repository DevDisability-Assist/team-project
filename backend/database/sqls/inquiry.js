const inquiry = `select 
 inquiry_no
, inquiry_name
, inquiry_writer
, inquiry_status
, created_at 
, updated_at
, notice_no
from inquiry`;

const inquiryList = `select 
 business_no
, answer_list
, question_category
, answer
, must 
,inquiry_no
from inquiry_list`;

// 👇 --- [신규] '조사지' (마스터) INSERT 쿼리 --- 👇
const inquiryInsert = `
  INSERT INTO inquiry (inquiry_name, inquiry_writer, inquiry_status, created_at, updated_at, notice_no)
  VALUES (?, ?, ?, NOW(), NOW(), ?)
`;

// 👇 --- [신규] '질문 목록' (상세) INSERT 쿼리 --- 👇
const questionInsert = `
  INSERT INTO inquiry_list (inquiry_no, content, response_type, is_required, priority)
  VALUES (?, ?, ?, ?, ?)
`;
module.exports = {
  inquiry,
  inquiryList,
  inquiryInsert,
  questionInsert,
};
