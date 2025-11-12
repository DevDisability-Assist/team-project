<script setup>
import { ref } from 'vue';
// import Button from 'primevue/button';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

// PDF의 테이블 데이터를 기반으로 한 샘플 데이터
const reservations = ref([
  { time: '10:00', applicant: '김민수', patient: '이지수', type: '방문 상담', status: '상담 완료' },
  { time: '14:00', applicant: '김민수', patient: '김민재', type: '전화 상담', status: '예약 확정' },
  { time: '16:00', applicant: '박영희', patient: '박철수', type: '방문 상담', status: '예약 확정' },
]);

// 'reservation' 테이블의 res_status 값에 따라 Tag의 색상을 결정하는 함수
const getStatusSeverity = (status) => {
  switch (status) {
    case '상담 완료':
      return 'success'; // 초록색
    case '예약 확정':
      return 'info'; // 파란색
    case '취소':
      return 'danger'; // 빨간색
    default:
      return 'secondary'; // 회색
  }
};

// 카드 클릭 시 페이지 이동을 시뮬레이션하는 함수
const navigateTo = (page) => {
  console.log(`Navigating to ${page}...`);
  // 실제 애플리케이션에서는 Vue Router 등을 사용하여 다음을 실행합니다.
  // router.push({ name: page });
};
</script>

<template>
  <div class="dashboard-layout">
    <!-- <div class="sidebar">
      <Button label="대시보드" icon="pi pi-home" class="p-button-text p-button-primary active" />
      <Button label="상담 스케줄 설정" icon="pi pi-calendar" class="p-button-text" />
      <Button label="상담 예약 관리" icon="pi pi-book" class="p-button-text" />
      <Button label="상담 기록 관리" icon="pi pi-file" class="p-button-text" />
      <Button label="이용자 관리" icon="pi pi-users" class="p-button-text" />
    </div> -->

    <div class="main-content">
      <h1 class="page-title">대시보드</h1>
      <p class="welcome-message">홍길동 담당자님, 환영합니다.</p>
      <p class="summary-message">오늘 처리해야 할 <strong>4건</strong>의 상담 일정이 있습니다.</p>

      <div class="stat-cards-container">
        <Card class="stat-card" @click="navigateTo('today-schedule')">
          <template #title>오늘의 상담 일정</template>
          <template #content>
            <div class="stat-value"><span class="count-blue">4</span>건</div>
          </template>
        </Card>

        <Card class="stat-card" @click="navigateTo('new-reservations')">
          <template #title>신규 예약 신청</template>
          <template #content>
            <div class="stat-value"><span class="count-green">2</span>건</div>
          </template>
        </Card>

        <Card class="stat-card" @click="navigateTo('pending-reports')">
          <template #title>미작성 상담일지</template>
          <template #content>
            <div class="stat-value"><span class="count-red">1</span>건</div>
          </template>
        </Card>
      </div>

      <div class="table-container">
        <DataTable :value="reservations" responsiveLayout="scroll">
          <Column field="time" header="시간" style="width: 15%"></Column>
          <Column field="applicant" header="신청인(보호자)" style="width: 25%"></Column>
          <Column field="patient" header="피보호자" style="width: 25%"></Column>
          <Column field="type" header="상담유형" style="width: 20%"></Column>
          <Column field="status" header="상태" style="width: 15%">
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.status"
                :severity="getStatusSeverity(slotProps.data.status)"
              ></Tag>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style>
/* 전역 폰트 및 배경 설정 */
body {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: #f8f9fa; /* 연한 회색 배경 */
  margin: 0;
}

/* 전체 레이아웃 (Sidebar + Main) */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

/* 1. Sidebar 스타일 */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar .p-button {
  justify-content: flex-start; /* 텍스트 왼쪽 정렬 */
  font-size: 16px;
  color: #495057;
  padding: 12px;
}

.sidebar .p-button .p-button-icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

/* 활성화된 메뉴(대시보드) 스타일 */
.sidebar .p-button.active {
  background-color: #eff6ff; /* PrimeVue blue-50 */
  color: #3b82f6; /* PrimeVue blue-500 */
  font-weight: 600;
}

/* 2. Main Content 스타일 */
.main-content {
  flex-grow: 1;
  padding: 40px;
  overflow-y: auto;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 12px;
  color: #212529;
}

.welcome-message {
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 8px;
}

.summary-message {
  font-size: 1.125rem;
  color: #495057;
  margin-bottom: 32px;
}

/* 3. Stat Cards (PDF 3번 영역) */
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  border: 1px solid #dee2e6; /* PDF의 테두리선 */
  box-shadow: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card .p-card-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #6c757d; /* 연한 글씨색 */
}

.stat-card .p-card-content {
  padding: 0;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: right;
  color: #343a40;
}

.stat-value .count-blue {
  color: #3b82f6; /* PrimeVue blue-500 */
  margin-right: 8px;
}

.stat-value .count-green {
  color: #22c55e; /* PrimeVue green-500 */
  margin-right: 8px;
}

.stat-value .count-red {
  color: #ef4444; /* PrimeVue red-500, PDF의 빨간색 */
  margin-right: 8px;
}

/* 4. DataTable (PDF 2번 영역) */
.table-container .p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table-container .p-datatable .p-datatable-tbody > tr > td {
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 1rem;
}

/* 상태 태그 스타일 */
.p-tag {
  font-size: 0.875rem;
  font-weight: 600;
}
</style>
