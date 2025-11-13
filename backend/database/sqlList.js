// 각 테이블 별로 실행한 SQL문을 별도 파일로 작성
const boards = require("./sqls/board.js");
const users = require("./sqls/user.js");
const consult = require("./sqls/consult.js");
<<<<<<< HEAD
const signUp = require("./sqls/signup.js");

=======
const inquiry = require("./sqls/inquiry.js");
>>>>>>> Branch-PHC
module.exports = {
  ...boards,
  ...users,
  ...consult,
<<<<<<< HEAD
  ...signUp,
=======
  ...inquiry,
>>>>>>> Branch-PHC
};
