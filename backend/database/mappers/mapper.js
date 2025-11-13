// MariaDB에 접속할 모듈
const mariadb = require("mariadb");
// DB에서 실행할 SQL문을 별도 파일로 작성
const sqlList = require("../sqlList.js");

// ConnectionPool 생성
const connectionPool = mariadb.createPool({
  // DB에 접속하는 정보
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // 10 -> 3 수정
  connectionLimit: 3,
  // Object의 필드정보(Entiry)를 Query문에 있는 '?'에 자동변환 설정
  permitSetMultiParamEntries: true,

  // DML(insert, update, delete)를 실행할 경우
  // 반환되는 Object의 insertId 속성을 Number 타입으로 자동 변환
  insertIdAsNumber: true,

  // MariaDB의 데이터 타입 중 bigInt 타입을 Javascript의 Number 타입으로 자동 변환
  // 해당 타입을 Javascript에선 자동으로 변환하지 못함
  bigIntAsNumber: true,

  // logger 등록
  logger: {
    // 실제 실행되는 SQL문이 console.log로 출력되도록 설정
    query: console.log,
    // error 발생 시 처리함수
    error: console.log,
  },
});

// MariaDB에 SQL문을 보내고 결과를 받아올 함수 설정
// -> 실제로 동작하는 mariadb의 query 함수를 또 하나의 함수로 감싸는 방식으로
// 반복적인 작업을 효율적으로 처리하도록 함.
const query = async (alias, values) => {
  // alias : 각 테이블 별로 실행할 SQL문을 가지고 있는 변수
  // values : SQL문 안에 선언된 '?'들을 대체할 값의 집합

  // MaraiDB 모듈을 통해 설정한 ConnectionPool을 기반으로 SQL문 실행
  // -> 비동기 작업, Promise 방식
  // 비동기 작업) 작업의 요청과 결과가 동시에 일어나지 않으므로
  //             요청한 작업의 결과를 언제 돌려받을지 알 수 없음
  let conn = null;
  try {
    // ConnectionPool에서 Connection 객체를 가져옴
    conn = await connectionPool.getConnection();
    // SQL문 선택
    let executeSql = sqlList[alias];
    // SQL문을 실행할 결과를 처리
    let result = await conn.query(executeSql, values);
    return result;
  } finally {
    if (conn) conn.release(); // Release to pool
  }
};

module.exports = {
  query,
  connectionPool,
};
