const db = require("../database/mappers/mapper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// [DB 스키마 기반]
const findUserById = async (userId) => {
  return await db.query("findUserById", [userId]);
};

// 토큰 생성 (동일)
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.user_id, role: user.user_role, name: user.user_name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user.user_id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// [수정] 로그인 서비스 (로그 추가)
const login = async (userId, password) => {
  // 1. 사용자 조회
  const users = await db.query("findUserById", [userId]);
  if (users.length === 0) {
    // [로그 추가] 실패 원인 1
    console.warn(
      `[AuthService] Login Failed: User not found (userId: ${userId})`
    );
    throw new Error("User not found");
  }
  const user = users[0];
  console.log("[AuthService] User found:", user);
  console.log("[AuthService] DB password hash length:", user.password?.length || 'N/A');

  // [추가] DB에 비밀번호가 없는 경우에 대한 방어 코드
  if (!user.password) {
    console.warn(`[AuthService] Login Failed: Password not set for user (userId: ${userId})`);
    throw new Error("Invalid credentials"); // 보안을 위해 동일한 에러 메시지 사용
  }

  // 2. 비밀번호 검증
  console.log(`[AuthService] DEBUG: Comparing password. Type: ${typeof password}, Value: '${password}'`);
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    // [로그 추가] 실패 원인 2
    console.warn(
      `[AuthService] Login Failed: Invalid credentials (userId: ${userId})`
    );
    throw new Error("Invalid credentials");
  }

  // [로그 추가] 로그인 성공
  console.log(
    `[AuthService] Login Success: Tokens generated (userId: ${userId})`
  );

  const { accessToken, refreshToken } = generateTokens(user);
  console.log("토큰값: ", accessToken, refreshToken);

  const userResponse = {
    id: user.user_id,
    name: user.user_name,
    email: user.email,
    role: user.user_role,
  };

  return {
    jsonResponse: { user: userResponse, accessToken, refreshToken },
  };
};

// [수정] 토큰 갱신 서비스 (로그 추가)
const refresh = async (refreshTokenFromBody) => {
  if (!refreshTokenFromBody) {
    // [로그 추가]
    console.warn("[AuthService] Refresh Failed: No refresh token provided.");
    throw new Error("No refresh token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(
      refreshTokenFromBody,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    // [로그 추가]
    console.warn(
      "[AuthService] Refresh Failed: Invalid or expired refresh token."
    );
    throw new Error("Invalid or expired refresh token");
  }

  const users = await db.query("findUserById", [decoded.id]);
  if (users.length === 0) {
    // [로그 추가]
    console.warn(
      `[AuthService] Refresh Failed: User not found (userId: ${decoded.id})`
    );
    throw new Error("User not found");
  }
  const user = users[0];

  const newAccessToken = jwt.sign(
    { id: user.user_id, role: user.user_role, name: user.user_name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // [로그 추가]
  console.log(
    `[AuthService] Refresh Success: New AT generated (userId: ${decoded.id})`
  );
  return {
    jsonResponse: { accessToken: newAccessToken },
  };
};

module.exports = {
  login,
  refresh,
};
