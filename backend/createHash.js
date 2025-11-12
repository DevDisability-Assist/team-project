// createHash.js
// 이 스크립트는 테스트용 비밀번호를 Bcrypt 해시로 변환하기 위해 사용합니다.
// 터미널에서 'node createHash.js'로 실행합니다.

const bcrypt = require("bcrypt");
const passwordToHash = "1234"; // 테스트에 사용할 비밀번호
const saltRounds = 10;

console.log(`Hashing password: ${passwordToHash}`);

bcrypt.hash(passwordToHash, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("--- Copy this hash: ---");
  console.log(hash);
  console.log("------------------------");
});
