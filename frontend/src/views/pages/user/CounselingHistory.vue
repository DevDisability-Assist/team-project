<script setup>
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
// Card 컴포넌트 import (선택 사항이지만, table-container가 Card 스타일을 사용하므로)
import Card from 'primevue/card';

const confirm = useConfirm();
const toast = useToast();

// --- 1. 상태 관리 (State Management) ---

// 상담 내역 목록
const reservations = ref([]);
const isLoading = ref(true);

// (Mock Data) 백엔드에서 가져왔다고 가정하는 데이터
const mockData = [
  {
    id: 1,
    dateTime: '2025년 11월 12일 14:00',
    staff: '김민수',
    type: '방문 상담',
    status: '상담 완료',
  },
  {
    id: 2,
    dateTime: '2025년 11월 13일 14:00',
    staff: '김민수',
    type: '전화 상담',
    status: '예약 확정',
  },
  {
    id: 3,
    dateTime: '2025년 11월 20일 10:30',
    staff: '이영희',
    type: '화상 상담',
    status: '예약 확정',
  },
  {
    id: 4,
    dateTime: '2025년 10월 05일 11:00',
    staff: '박철수',
    type: '방문 상담',
    status: '예약 취소',
  },
];

// --- 2. 헬퍼 함수 (Helper Functions) ---

/**
 * 상태(status) 문자열에 따라 PrimeVue Tag의 'severity' 반환
 * @param {string} status - 상태 문자열
 */
function getStatusSeverity(status) {
  switch (status) {
    case '상담 완료':
      return 'success';
    case '예약 확정':
      return 'info';
    case '예약 취소':
      return 'danger';
    default:
      return 'warning'; // 예: '확인중'
  }
}

// --- 3. 이벤트 핸들러 (Event Handlers) ---

/**
 * '예약 취소' 버튼 클릭 시 확인 팝업 표시
 * @param {Event} event - 클릭 이벤트
 * @param {object} reservationData - 취소할 예약 데이터
 */
function confirmCancel(event, reservationData) {
  confirm.require({
    target: event.currentTarget,
    message: `${reservationData.dateTime} 예약을 취소하시겠습니까?`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '예, 취소합니다',
    rejectLabel: '아니요',
    acceptClass: 'p-button-danger',
    accept: () => {
      // 'accept' 콜백: 실제 취소 로직 실행
      handleCancel(reservationData.id);
    },
    reject: () => {
      // 'reject' 콜백: 취소 알림
      toast.add({
        severity: 'info',
        summary: '알림',
        detail: '예약 취소가 보류되었습니다.',
        life: 3000,
      });
    },
  });
}

/**
 * 실제 예약 취소 로직 (API 호출 시뮬레이션)
 * @param {number} id - 취소할 예약 ID
 */
async function handleCancel(id) {
  // (Simulation) 실제로는 여기서 백엔드로 취소 API 호출
  console.log(`API 호출: ${id}번 예약 취소`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // API 호출 성공 시:
  // 1. 목록에서 해당 항목의 상태를 '예약 취소'로 변경
  const index = reservations.value.findIndex((res) => res.id === id);
  if (index !== -1) {
    reservations.value[index].status = '예약 취소';
  }

  // 2. 사용자에게 성공 알림
  toast.add({
    severity: 'success',
    summary: '예약 취소',
    detail: '예약이 정상적으로 취소되었습니다.',
    life: 3000,
  });
}

// --- 4. 라이프사이클 (Lifecycle) ---

onMounted(() => {
  // (Simulation) 컴포넌트 마운트 시 데이터 로드
  isLoading.value = true;
  setTimeout(() => {
    reservations.value = mockData;
    isLoading.value = false;
  }, 1000);
});
</script>

<template>
  <!-- [레이아웃 수정] StaffDashboard.vue의 구조를 적용 -->
  <div class="dashboard-layout">
    <div class="main-content">
      <!-- [레이아웃 수정] h5 -> h1.page-title로 변경 -->
      <h1 class="page-title">상담 내역</h1>
      <!-- [레이아웃 수정] p -> p.welcome-message로 변경 -->
      <p class="welcome-message">신청하신 상담 예약의 현재 상태입니다.</p>

      <!-- [레이아웃 수정] 내용을 .table-container로 감싸서 스타일 통일 -->
      <div class="table-container">
        <!-- PrimeVue ConfirmPopup: '예약 취소' 확인 팝업을 위한 컴포넌트 -->
        <ConfirmPopup></ConfirmPopup>

        <!-- PrimeVue Toast: 알림 메시지를 위한 컴포넌트 -->
        <Toast />

        <DataTable
          :value="reservations"
          :loading="isLoading"
          responsiveLayout="scroll"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
        >
          <template #empty> 신청하신 상담 내역이 없습니다. </template>
          <template #loading> 상담 내역을 불러오는 중입니다... </template>

          <!-- 상담일시 -->
          <Column
            field="dateTime"
            header="상담일시"
            :sortable="true"
            style="min-width: 12rem"
          ></Column>

          <!-- 담당자 -->
          <Column field="staff" header="담당자" style="min-width: 8rem"></Column>

          <!-- 상담유형 -->
          <Column field="type" header="상담유형" style="min-width: 8rem"></Column>

          <!-- 상태 -->
          <Column field="status" header="상태" style="min-width: 8rem">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <!-- 관리 (예약취소 버튼) -->
          <Column header="관리" style="min-width: 8rem; text-align: center">
            <template #body="{ data }">
              <!-- '예약 확정' 상태일 때만 '예약취소' 버튼 표시 -->
              <Button
                v-if="data.status === '예약 확정'"
                label="예약취소"
                class="p-button-danger p-button-outlined p-button-sm"
                @click="confirmCancel($event, data)"
              />

              <!-- '상담 완료' 상태일 때 표시 (예: 완료됨 텍스트) -->
              <span v-if="data.status === '상담 완료'" class="text-green-500 font-bold">
                완료됨
              </span>

              <!-- '예약 취소' 상태일 때 표시 -->
              <span v-if="data.status === '예약 취소'" class="text-gray-500"> 취소됨 </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<!-- [스타일 추가] StaffDashboard.vue의 스타일을 적용합니다. -->
<style>
/* 전역 폰트 및 배경 설정 (layout.scss 등에서 관리되어야 함) */
/*
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    background-color: #f8f9fa; 
    margin: 0;
}
*/

/* 전체 레이아웃 */
.dashboard-layout {
  min-height: 100vh;
}

/* 1. Sidebar 스타일 (참고용으로 남겨둠) */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #dee2e6;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 2. Main Content 스타일 */
.main-content {
  width: 90%;
  max-width: 1200px; /* 최대 너비를 1200px로 설정 */
  margin: 0 auto; /* 상하 0, 좌우 auto (중앙 정렬) */
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
  margin-bottom: 32px;
}

/* 3. Stat Cards (참고용으로 남겨둠) */
.stat-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

/* 4. DataTable / Content 컨테이너 */
.table-container {
  /* [수정] .table-container는 Card가 아닌 DataTable을 직접 감쌀 수 있으므로
        기본적인 여백과 스타일을 보장합니다.
     */
  margin-top: 2rem;
  border: 1px solid #dee2e6; /* 카드와 유사한 테두리 */
  border-radius: 6px; /* PrimeVue 카드와 유사한 둥근 모서리 */
  overflow: hidden; /* DataTable의 모서리를 마스크하기 위해 */
}
.table-container:first-of-type {
  margin-top: 0;
}

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

/*
   .table-container가 Card를 감쌀 경우의 패딩 설정
*/
.table-container .p-card .p-card-body {
  padding: 2rem;
}
.table-container .p-card .p-card-content {
  padding: 0;
}
</style>
