
// check_password.js
// 사용법: backend 폴더에서 node check_password.js 실행

console.log('--- 비밀번호 검증 스크립트 시작 ---');

// 1. 애플리케이션과 동일한 환경 변수 로드
require('dotenv').config({ path: './dbConfig.env' });

// 2. 필요한 라이브러리 임포트
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

// 3. 검증할 사용자 정보
const userIdToTest = 'test';
const passwordToTest = '1234';

// 4. 데이터베이스 연결 및 검증 실행
async function verifyPassword() {
  let conn;
  try {
    // 애플리케이션과 동일한 DB 설정으로 연결
    console.log('데이터베이스에 연결을 시도합니다...');
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });
    console.log('데이터베이스 연결 성공!');

    // 'test' 사용자의 비밀번호 해시 조회
    console.log(`'${userIdToTest}' 사용자의 비밀번호 해시를 조회합니다...`);
    const query = 'SELECT password FROM member WHERE user_id = ?';
    const rows = await conn.query(query, [userIdToTest]);

    if (rows.length === 0) {
      console.error('!!! 결과: 실패 !!!');
      console.error(`원인: 데이터베이스에서 '${userIdToTest}' 사용자를 찾을 수 없습니다.`);
      return;
    }

    const dbHash = rows[0].password;

    if (!dbHash) {
      console.error('!!! 결과: 실패 !!!');
      console.error(`원인: '${userIdToTest}' 사용자의 비밀번호(hash)가 데이터베이스에 저장되어 있지 않습니다 (NULL 값).`);
      return;
    }

    console.log('데이터베이스에서 가져온 해시:', dbHash);
    console.log('입력된 비밀번호와 해시를 비교합니다...');

    // bcrypt.compare로 비밀번호 검증
    const match = await bcrypt.compare(passwordToTest, dbHash);

    if (match) {
      console.log('*** 결과: 성공 ***');
      console.log('입력된 비밀번호가 데이터베이스의 해시와 일치합니다.');
    } else {
      console.error('!!! 결과: 실패 !!!');
      console.error('원인: 입력된 비밀번호가 데이터베이스의 해시와 일치하지 않습니다.');
    }
  } catch (err) {
    console.error('스크립트 실행 중 오류가 발생했습니다:', err);
  } finally {
    if (conn) {
      console.log('데이터베이스 연결을 닫습니다.');
      await conn.end();
    }
    console.log('--- 비밀번호 검증 스크립트 종료 ---');
  }
}

verifyPassword();
