// member TABLE에 회원 정보 등록

// 회원가입 시 입력되는 값
// 아이디, 비밀번호, 이름, 생년월일, 이메일, 전화번호, 주소, 가입일자
const signUpUser = {
  // member TABLE에 회원 정보 등록
  signUpUser: `INSERT INTO member (user_id, password, user_name, birthday, email, phone, address, role, created_at)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
};

module.exports = {
  signUpUser: signUpUser.signUpUser,
};
