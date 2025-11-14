<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 로그인 화면으로 이동하는 함수
const goToLogin = () => {
  router.push({ name: 'login' });
};
// 회원가입 화면으로 이동하는 함수
const goToSignUp = () => {
  router.push({ name: 'signup' });
};
</script>

<template>
  <div class="home-container">
    <div class="header-content">
      <h1 class="main-title">발달 장애인 지원 대기 프로그램</h1>
      <p class="tagline">맞춤형 지원을 위한 첫걸음을 시작하세요.</p>
    </div>

    <div class="button-group">
      <!-- goToLogin함수 호출 -->
      <button @click="goToLogin" class="btn btn-primary">로그인</button>
      <button @click="goToSignUp" class="btn btn-secondary">회원가입</button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 컨테이너: 화면 중앙 정렬 및 배경 설정 */
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 중앙 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  min-height: 100vh; /* 뷰포트 전체 높이 사용 */
  text-align: center;
  background-color: #f8f9fa; /* 밝고 깨끗한 배경색 */
  padding: 40px;
  /* 배경 이미지 추가 예정 위치 */
  /* background-image: url('path/to/your/image.jpg'); */
  /* background-size: cover; */
  /* background-position: center; */
}

/* 제목 영역 스타일 */
.header-content {
  margin-bottom: 60px;
  /* 배경 이미지 위에서 잘 보이도록 그림자 추가 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.main-title {
  font-size: 3em;
  color: #2c3e50; /* 다크 네이비 */
  margin-bottom: 10px;
  font-weight: 800;
  line-height: 1.3;
}

.tagline {
  font-size: 1.2em;
  color: #7f8c8d; /* 미디엄 그레이 */
  font-weight: 400;
}

/* 버튼 그룹 스타일 */
.button-group {
  display: flex;
  gap: 25px; /* 버튼 사이 간격 */
}

/* 버튼 공통 스타일 */
.btn {
  padding: 15px 35px;
  font-size: 1.1em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* 주 버튼 (회원가입) 스타일 */
.btn-primary {
  background-color: #3498db; /* 브랜드 색상 (밝은 파랑) */
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-3px); /* 마우스 오버 시 살짝 떠오르는 효과 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* 보조 버튼 (로그인) 스타일 */
.btn-secondary {
  background-color: white;
  color: #3498db;
  border: 2px solid #3498db;
}

.btn-secondary:hover {
  background-color: #eaf3fb;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
