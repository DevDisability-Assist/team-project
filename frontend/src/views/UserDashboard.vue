<script setup>
import { onBeforeMount, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import Button from 'primevue/button';
import axios from 'axios';

const quickMenus = ref([
  { icon: 'pi pi-file-text', label: '사업 공고' },
  { icon: 'pi pi-pencil', label: '사업 신청' },
  { icon: 'pi pi-users', label: '피보호자 등록' },
  { icon: 'pi pi-calendar', label: '상담 예약' },
  { icon: 'pi pi-question-circle', label: 'Q&A' },
  { icon: 'pi pi-folder', label: '자료실' },
]);

const expiringSupport = ref([
  {
    title: '발달 장애인 유아 학비 지원',
    details: '국공립/사립 유치원 3~5세 유아 현금(감면)지급',
    deadline: '2025-11-09 마감',
  },
  {
    title: '1분기 발달 장애인 생계수급비 지원',
    details: '1분기 발달 생계비 현금 지급',
    deadline: '2025-11-10 마감',
  },
]);

const mySupport = ref([
  { business_name: '대구시 발달 장애인 커뮤니티 회원 모집', business_end: '25-11-04' },
  { business_name: '발달 장애인 생활비 지원 사업', business_end: '25-11-03' },
  { business_name: '발달 장애인 우선 채용 일자리', business_end: '25-11-02' },
  { business_name: '발달 장애인 긴급 구호 사업', business_end: '25-11-01' },
]);

const mySet = async () => {
  try {
    const res = await axios.get('/api/ud');
    console.log('myResult.data', res.data);
    mySupport.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

onBeforeMount(() => {
  mySet();
});
</script>

<template>
  <div class="dashboard-background">
    <!-- 1. Search Bar (확장된 너비와 하단 chip 포함된 컴포넌트) -->
    <div class="search-bar-wrapper">
      <SearchBar />
    </div>

    <!-- 2. Main Content Block -->
    <div class="main-content-card">
      <!-- <div class="grid"> -->
      <!-- Top Row: Quick Menu -->
      <div class="col-12 md:col-9">
        <p>자주 찾는 메뉴</p>
        <div class="Menu_Group">
          <!-- quickMenus를 사용해 동적 렌더링 -->
          <a
            v-for="(menu, idx) in quickMenus"
            :key="idx"
            href="#"
            class="Menu_Item"
            @click.prevent="alert(menu.label + ' 페이지 이동')"
          >
            <div class="Icon_Container">
              <i :class="menu.icon + ' menu-icon'" aria-hidden="true"></i>
            </div>
            <p class="Menu_Text">{{ menu.label }}</p>
          </a>
        </div>
        <!-- </div> -->
      </div>

      <!-- Header Row: 두 섹션의 제목을 한 줄에 배치 -->
      <div class="support-header-row">
        <h5 class="section-title section-title--left">마감 임박 지원 / 보조금</h5>

        <div class="support-header-row-right">
          <h5 class="section-title section-title--right">내 지원 현황</h5>
          <Button icon="pi pi-plus" class="p-button-rounded p-button-text" />
        </div>
      </div>

      <!-- Row: Support Sections (두 컬럼 컨텐츠) -->
      <div class="support-sections-row">
        <!-- Left column: 마감 임박 지원 / 보조금 -->
        <div class="support-column">
          <div v-for="(item, i) in expiringSupport" :key="i" class="support-item">
            <h6>{{ item.title }}</h6>
            <p>{{ item.details }} ({{ item.deadline }})</p>
          </div>
        </div>

        <!-- Right column: 내 지원 현황 -->
        <div class="support-column">
          <div v-for="(item, i) in mySupport" :key="i" class="support-status-item">
            <span>{{ item.title }}</span>
            <span class="date">{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 + header-row 비율 조정용 변수 추가 */
.dashboard-background {
  background-color: #f8f9fa;
  padding: 2rem;
  min-height: 100vh;
}

/* main-content-card를 가운데 정렬하도록 변경 (요청 2) */
.main-content-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 1200px; /* 중앙 폭 제한, 필요시 조정 */
  margin: 0 auto; /* 가로 중앙 정렬 */
}

/* Header row: 화면 비율로 너비 지정 가능하도록 CSS 변수 사용 (요청 1) */
/* 기본값: left 30vw, right 40vw — 쉽게 변경하려면 아래 변수값만 수정하세요. */
.support-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.25rem 0 0.75rem 0;
  flex-wrap: nowrap;
  --support-left-width: 30vw; /* 화면의 30% */
  --support-right-width: 40vw; /* 화면의 40% */
}

/* 왼쪽 제목: 고정 너비(뷰포트 기반) */
.section-title--left {
  margin: 0;
  flex: 0 0 var(--support-left-width);
  max-width: var(--support-left-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 오른쪽 제목 및 버튼 그룹: 제목 너비 고정 + 버튼 우측에 위치 */
.support-header-row-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title--right {
  margin: 0;
  flex: 0 0 var(--support-right-width);
  max-width: var(--support-right-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

/* 기존 search-bar-wrapper 정렬 보조 */
.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

/* 두 섹션을 한 행에 배치 (콘텐츠 컬럼) */
.support-sections-row {
  border-spacing: 1px;
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

/* 각 컬럼이 대략 50% 너비를 차지 */
.support-column {
  flex: 1 1 48%;
  min-width: 280px;
  box-sizing: border-box;
  border: 1px solid #000; /* 추가: 검은색 얇은 외곽선 */
  border-radius: 10px;
  padding: 0.75rem; /* 선택: 내부 여백(원치 않으면 제거 가능) */
}

/* 기존 menu/support 스타일 유지 */
.Menu_Group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center; /* 추가: Menu_Item들을 가운데 정렬 */
}

.Menu_Item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-decoration: none;
  color: inherit;
}

.Icon_Container {
  width: 80px;
  height: 80px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.menu-icon {
  font-size: 2rem;
}

/* support lists */
.support-item {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.support-item h6 {
  margin: 0 0 0.5rem 0;
}
.support-item p {
  margin: 0;
  color: #6b6b6b;
}

.support-status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e6e6e6;
}
.support-status-item:last-child {
  border-bottom: none;
}
.support-status-item .date {
  color: #6b6b6b;
}

/* 반응형: 좁은 화면에서는 헤더와 컬럼을 쌓음 */
@media (max-width: 992px) {
  .support-header-row {
    flex-wrap: wrap;
    --support-left-width: 100%;
    --support-right-width: 100%;
    gap: 0.5rem;
  }
  .section-title--left,
  .section-title--right {
    flex: 0 0 100%;
    max-width: 100%;
    text-align: left;
  }
  .support-header-row-right {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .support-column {
    flex-basis: 100%;
  }
}
</style>
