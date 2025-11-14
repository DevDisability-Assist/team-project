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
, answer
, must 
from inquiry_list`;

const inquiryOrderBy = `SELECT inquiry_no, inquiry_name, inquiry_writer, inquiry_status, created_at, updated_at FROM inquiry WHERE inquiry_no = ?`;
const inquiryListOrderBy = `SELECT business_no, answer_list AS question_content, question_category, answer AS response_type, must AS is_required, inquiry_no FROM inquiry_list WHERE inquiry_no = ? ORDER BY inquiry_no ASC`;
// 👇 --- [신규] '조사지' (마스터) INSERT 쿼리 --- 👇
const inquiryInsert = `
  INSERT INTO inquiry (inquiry_name, inquiry_writer, inquiry_status, created_at, updated_at, notice_no)
  VALUES (?, ?, ?, NOW(), NOW(), ?)
`;

// 👇 --- [신규] '질문 목록' (상세) INSERT 쿼리 --- 👇
const questionInsert = `
  INSERT INTO inquiry_list (answer_list, answer, must, priority)
  VALUES (?, ?, ?, ?)
`;
module.exports = {
  inquiry,
  inquiryList,
  inquiryOrderBy,
  inquiryListOrderBy,
  inquiryInsert,
  questionInsert,
};
