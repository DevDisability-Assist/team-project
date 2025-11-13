// routers/surveyRouter.js
const express = require("express");
const router = express.Router();

// [수정] dbPool 대신 { query } 함수를 가져옵니다.
const { query, connectionPool } = require("../database/mappers/mapper.js");
const sql = require("../database/sqlList.js");
// 👆 db.js에서 module.exports = { query }로 내보낸 함수

/**
 * [GET /api/surveys]
 * 조사지 '목록'을 DB에서 조회합니다.
 */
router.get("/", async (req, res) => {
  console.log("[surveyRouter] GET / 요청 받음");

  // [수정] getConnection/release 로직을 모두 삭제하고
  // db.js에서 만든 query 함수를 사용합니다.
  try {
    // 1. 'inquiry'는 ../sqlList.js 파일에 정의된 SQL문의 key(alias) 이름입니다.
    // 2. values(두 번째 인자)는 지금 필요 없으므로 생략합니다.
    const rows = await query("inquiry");

    // 3. 프론트로 DB 결과 전송
    res.json(rows);
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
  //
  // finally { if (conn) conn.release(); }
  // 👆 이 로직은 이제 db.js의 query 함수가 대신 처리하므로 필요 없습니다.
});
/**
 * [POST /api/surveys]
 * 새 조사지 등록 (트랜잭션 사용)
 */
router.post("/", async (req, res) => {
  console.log("[surveyRouter] POST / 요청 받음");

  // 1. 프론트엔드에서 보낸 데이터 분리
  // (RegistSurveyForm.js에서 보낸 surveyData 객체입니다)
  const { surveyName, businessItem, status, questionList, writer } = req.body;

  let conn; // 트랜잭션을 위한 커넥션 객체
  try {
    // 2. 풀(pool)에서 커넥션을 직접 가져옵니다.
    // (mapper.js의 query 함수는 트랜잭션을 지원하지 않으므로)
    conn = await connectionPool.getConnection();

    // 3. [트랜잭션 시작]
    await conn.beginTransaction();

    // 4. 'inquiry' (마스터) 테이블에 INSERT
    // (sqlList.js에 정의된 inquiryInsert 키 사용)
    const inquiryResult = await conn.query(sql.inquiryInsert, [
      surveyName,
      writer || "관리자", // (임시) 작성자
      status.name, // '상태1' 등
      null, // notice_no (null로 가정)
    ]);

    // 5. 방금 생성된 'inquiry_no' (PK) 가져오기
    const newInquiryNo = inquiryResult.insertId;

    if (!newInquiryNo) {
      throw new Error("조사지 ID 생성 실패");
    }

    // 6. 'questionList' 배열을 순회하며 'inquiry_list' (질문) INSERT
    for (const question of questionList) {
      await conn.query(sql.questionInsert, [
        newInquiryNo, // 👈 생성된 PK (외래 키)
        question.content,
        question.responseType.name, // '서술형' 등
        question.required, // true/false
        question.priority ? question.priority.name : null, // '긴급' 또는 null
      ]);
    }

    // 7. [커밋] 모든 쿼리 성공
    await conn.commit();

    console.log("등록 성공! inquiry_no:", newInquiryNo);
    res.status(201).json({
      message: "조사지가 성공적으로 등록되었습니다.",
      inquiryNo: newInquiryNo,
    });
  } catch (err) {
    // 8. [롤백] 하나라도 실패하면 모두 되돌림
    if (conn) await conn.rollback();

    console.error("DB 등록 트랜잭션 실패:", err);
    res.status(500).json({ message: "서버 오류", error: err.message });
  } finally {
    // 9. [반환] 커넥션을 풀에 반환
    if (conn) conn.release();
  }
});

// (나중에 등록 API 'POST /' 도 여기에 추가하면 됩니다)

module.exports = router;
