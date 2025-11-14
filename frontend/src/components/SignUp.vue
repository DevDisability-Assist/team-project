<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 라우팅을 위해 추가
import axios from 'axios';

// 상태 변수 정의 (추가된 필드 포함)
const selectedRole = ref('USER'); // 권한 별 로그인
const userId = ref(''); // 아이디
const password = ref(''); // 비밀번호
const confirmPassword = ref(''); // 비밀번호 확인
const name = ref('');
const email = ref('');
const phone = ref('');

const zipcode = ref(''); // 우편번호
const addressMain = ref(''); // 기본 주소
const addressDetail = ref(''); // 상세 주소

const birthYear = ref(''); // 생년월일
const birthMonth = ref('');
const birthDay = ref('');

const agreeTerms = ref(false); // 약관 동의

const apiLoadError = ref(''); // Daum API 연동 에러 상태 변수

const passwordError = ref('');
const termsError = ref('');

const router = useRouter();

// 주소 찾기 표시/숨김 상태
const isPostcodeOpen = ref(false);

// 회원가입 제출 처리 함수
const handleSignUp = async () => {
  // 에러 메시지 초기화
  passwordError.value = '';
  termsError.value = '';
  // 유효성 검사
  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    return;
  }
  if (!agreeTerms.value) {
    termsError.value = '필수 약관에 동의해야 회원가입을 완료할 수 있습니다.';
    return;
  }
  // 생년월일 통합(YYYY-MM-DD) .padStart(4, '0') mariaDB 날짜표기 통합
  const birthDate = `${birthYear.value.padStart(4, '0')}-${birthMonth.value.padStart(2, '0')}-${birthDay.value.padStart(2, '0')}`;

  // 주소 통합
  const fullAddress = `${zipcode.value},${addressMain.value}${addressDetail.value ? ', ' + addressDetail.value : ''}`;

  // backend로 전송할 최종 데이터 객체
  const signUpData = {
    selectedRole: selectedRole.value,
    userId: userId.value,
    password: password.value,
    name: name.value,
    birthDate: birthDate,
    email: email.value,
    phone: phone.value,
    fullAddress: fullAddress,
    role: selectedRole.value,
  };
  // backend API로 POST 요청
  try {
    const nodeApiUrl = '/api/register';

    await axios.post(nodeApiUrl, signUpData);
    alert('회원가입이 완료되었습니다');
    goToLogin();
  } catch (error) {
    // 요청 실패
    console.error('회원가입 실패');
  }
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push({ name: 'login' });
};

// 우편번호 검색 함수 (모달 열기)
const searchZipcode = () => {
  isPostcodeOpen.value = true;
  apiLoadError.value = ''; // 에러 메시지 초기화
};
// 우편번호 검색 완료 시 처리 함수
const addressSearched = (data) => {
  // 모달 닫기
  isPostcodeOpen.value = false;
  // 기본 주소 (vue-daum-postcode가 제공)
  let fullAddress = '';
  let extraAddr = '';

  if (data.userSelectedType === 'R') {
    // 도로명 주소
    fullAddress = data.roadAddress;
  } else {
    // 지번 주소
    fullAddress = data.jibunAddress;
  }
  // 참고항목 (법정동명, 건물명 등)
  if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
    extraAddr += data.bname;
  }
  if (data.buildingName !== '' && data.apartment === 'Y') {
    extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
  }
  if (extraAddr !== '') {
    fullAddress += `(${extraAddr})`;
  }
  // 상태 변수 업데이트
  zipcode.value = data.zonecode;
  addressMain.value = fullAddress;
  addressDetail.value = ''; // 상세 주소 초기화
  // 상세 주소는 이용자가 직접 입력하도록 포커스스
  setTimeout(() => {
    document.getElementById('address-detail')?.focus();
  }, 100);
};
// 우편번호 찾기 화면 닫기
const closePostcode = () => {
  isPostcodeOpen.value = false;
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 역할 탭: 디자인 동일하게 유지 -->
      <div class="role-tabs">
        <button
          :class="['tab-button', { active: selectedRole === '1a' }]"
          @click="selectedRole = '1a'"
        >
          일반 이용자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === '2a' }]"
          @click="selectedRole = '2a'"
        >
          기관 담당자
        </button>
        <button
          :class="['tab-button', { active: selectedRole === '3a' }]"
          @click="selectedRole = '3a'"
        >
          기관 관리자
        </button>
      </div>

      <!-- 회원가입 폼 (로그인 폼 레이아웃 복제) -->
      <form @submit.prevent="handleSignUp">
        <!-- 1. 아이디 -->
        <div class="form-group">
          <label for="user-id">아이디</label>
          <input
            id="user-id"
            type="text"
            v-model="userId"
            placeholder="아이디를 입력해주세요"
            required
          />
        </div>
        <!-- 2. 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="비밀번호 입력해주세요"
            required
          />
        </div>
        <!-- 3. 비밀번호 확인 (추가) -->
        <div class="form-group">
          <label for="confirm-password">비밀번호 확인</label>
          <input
            id="confirm-password"
            type="password"
            v-model="confirmPassword"
            placeholder="비밀번호를 확인하세요"
            required
          />
          <p v-if="passwordError" class="inline-error-message mx-1 test-sm">{{ passwordError }}</p>
        </div>

        <!-- 4. 이름 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input id="name" type="text" v-model="name" placeholder="이름" required />
        </div>
        <!-- 생년월일 -->
        <div class="form-group">
          <label>생년월일</label>
          <div class="birth-input-group">
            <input type="text" v-model="birthYear" placeholder="년 (YYYY)" maxlength="4" required />
            <input type="text" v-model="birthMonth" placeholder="월 (MM)" maxlength="2" required />
            <input type="text" v-model="birthDay" placeholder="일 (DD)" maxlength="2" required />
          </div>
        </div>

        <!-- 5. 이메일 -->
        <div class="form-group">
          <label for="email">이메일</label>
          <input id="email" type="email" v-model="email" placeholder="이메일 주소" required />
        </div>
        <!-- 6. 전화번호 -->
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input id="phone" type="tel" v-model="phone" placeholder="010-1234-5678" required />
        </div>

        <!-- 7. 주소 필드 (추가) -->
        <div class="form-group">
          <label for="address-zip">주소</label>
          <div class="address-input-group">
            <input
              id="address-zip"
              type="text"
              v-model="zipcode"
              placeholder="우편번호"
              required
              readonly
            />
            <button type="button" class="btn-zipcode-search" @click="searchZipcode">
              우편번호 찾기
            </button>
          </div>
        </div>
        <!-- Daum API연동 에러 발생시 -->
        <p v-if="apiLoadError" class="error-message">{{ apiLoadError }}</p>

        <div class="form-group">
          <input
            id="address-main"
            type="text"
            v-model="addressMain"
            placeholder="기본 주소"
            required
            readonly
          />
        </div>
        <div class="form-group">
          <input
            id="address-detail"
            type="text"
            v-model="addressDetail"
            placeholder="상세 주소 (동/호수 등)"
          />
        </div>

        <div v-if="isPostcodeOpen" class="postcode-modal-overlay" @click.self="closePostcode">
          <div class="postcode-modal-content">
            <VueDaumPostcode
              @complete="addressSearched"
              :width="600"
              :height="600"
              :animation="true"
              :theme="{
                bgColor: '#fff',
                searchColor: '#3498db',
                // ... 기타 테마 설정 가능
              }"
            />
            <button class="close-btn" @click="closePostcode">닫기</button>
          </div>
        </div>

        <!-- 주소 필드는 레이블을 하나로 묶고, 입력 필드를 분리하여 디자인 통일성을 유지했습니다. -->

        <!-- 약관 동의  -->
        <div class="login-options signup-options">
          <div class="remember-me">
            <input id="agree-terms" type="checkbox" v-model="agreeTerms" />
            <label for="agree-terms">[필수] 이용약관 및 개인정보 처리방침 동의</label>
          </div>
          <br />
          <p v-if="termsError" class="inline-error-message mt-1 text-sm">{{ termsError }}</p>
          <!-- 회원가입 페이지에서는 '아이디/비번 찾기' 링크는 불필요하므로 제거 -->
        </div>

        <div class="action-buttons">
          <button type="submit" class="btn-login">회원가입</button>
          <button type="button" class="btn-signup" @click="goToLogin">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* =======================================================
   로그인 컴포넌트에서 제공된 기본 스타일 (디자인 통일성 유지)
   ======================================================= */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.login-box {
  width: 400px;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 1. 역할 탭 */
.role-tabs {
  display: flex;
  margin-bottom: 1.5rem;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.tab-button:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.tab-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.tab-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

/* 2. 폼 그룹 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
.birth-input-group {
  display: flex;
  gap: 8px; /* 입력 필드 사이 간격 */
}

/* 생년월일 입력 필드는 모두 동일한 너비로 설정 */
.birth-input-group input {
  flex: 1; /* 가용 공간을 균등하게 분할 */
  min-width: 0; /* flex 컨테이너 내에서 overflow 방지 */
}

/* 3. 로그인 옵션 (회원가입 약관 동의로 사용) */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 0.25rem;
  /* 회원가입 시 input 크기 조정 */
  width: auto;
  padding: 0;
}
.inline-error-message {
  color: #ef4444; /* Red 500 */
  font-size: 0.875rem; /* text-sm */
  margin-top: 5px;
}

/* 링크는 회원가입 페이지에서는 제거되었지만 클래스 구조 유지를 위해 CSS는 남겨둡니다. */
.links {
  display: none;
}

/* 4. 액션 버튼 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-buttons button {
  padding: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
}

.btn-login {
  /* 회원가입 완료 버튼 */
  background-color: #007bff;
  color: white;
}

.btn-signup {
  /* 로그인 돌아가기 버튼 */
  background-color: #f0f0f0;
  color: #333;
}

/* =======================================================
   주소 필드를 위한 추가 스타일 (기존 폼 스타일 유지하면서 배치)
   ======================================================= */

.address-input-group {
  display: flex;
  gap: 8px; /* 입력창과 버튼 사이 간격 */
}

/* 우편번호 입력창 스타일 */
.address-input-group input {
  flex-grow: 0; /* 우편번호 칸을 작게 유지 */
  width: 120px;
}

/* 우편번호 찾기 버튼 스타일 */
.btn-zipcode-search {
  flex-grow: 1; /* 나머지 공간을 채움 */
  padding: 0 0.75rem; /* form-group input과 높이 맞추기 위해 폼 그룹 인풋과 동일한 패딩 사용 */
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
  height: 41px; /* input과 높이를 맞추기 위해 명시적 높이 설정 (input padding 기준) */
}

.btn-zipcode-search:hover {
  background-color: #e0e0e0;
}

/* 에러 메시지 스타일 */
.error-message {
  color: #e53935; /* 밝은 빨간색 */
  font-size: 0.9em;
  margin-top: -10px; /* 주소 필드 그룹과 붙이기 위해 마진 조정 */
  margin-bottom: 10px;
  padding-left: 5px;
  font-weight: bold;
}

/* ... (기존 스타일) ... */

/* 예시로 필요한 스타일들을 추가 (login-container, form-group 등) */
.login-container {
  display: flex;
  justify-content: center;
  padding: 50px;
}

.login-box {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

/* 주소 입력 그룹 스타일 */
.address-input-group {
  display: flex;
  gap: 10px;
}

.address-input-group input {
  flex-grow: 1;
}

.btn-zipcode-search {
  padding: 10px 15px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap; /* 버튼 텍스트 줄바꿈 방지 */
}
.close-btn {
  color: blue;
  padding: 10px;
  border: 1px, solid;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
