<script setup>
import { ref, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { reservationApi } from '@/api/api.js';

const confirm = useConfirm();
const toast = useToast();

// --- 1. 상태 관리 (State Management) ---

const reservations = ref([]);
const isLoading = ref(true);

// --- 2. 헬퍼 함수 (Helper Functions) ---

function getStatusSeverity(status) {
  switch (status) {
    case '상담완료':
      return 'success';
    case '예약확정':
      return 'info';
    case '취소': // MockData의 '예약 취소' -> DB의 '취소' (ENUM과 일치)
      return 'danger';
    default:
      return 'warning'; // 예: '확인중'
  }
}

// --- 3. API 로직 및 이벤트 핸들러 ---

/**
 * [신규] 서버에서 예약 내역을 불러오는 함수
 */
async function loadReservations() {
  isLoading.value = true;
  try {
    const response = await reservationApi.getMyReservations();
    reservations.value = response.data;
  } catch (error) {
    console.error('예약 내역 로딩 실패:', error);
    toast.add({
      severity: 'danger',
      summary: '오류',
      detail: '예약 내역을 불러오는 데 실패했습니다.',
      life: 3000,
    });
    reservations.value = []; // 오류 시 빈 배열로 초기화
  } finally {
    isLoading.value = false;
  }
}

/**
 * '예약 취소' 버튼 클릭 시 확인 팝업 표시
 * (이 함수는 수정 없음)
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
      // 'accept' 콜백: 실제 취소 로직 실행 (reservationData.id는 res_no)
      handleCancel(reservationData.id);
    },
    reject: () => {
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
 * [수정] 실제 예약 취소 로직 (API 호출로 변경)
 * @param {number} id - 취소할 예약 ID (res_no)
 */
async function handleCancel(id) {
  try {
    // 1. 백엔드로 취소 API 호출
    console.log(`API 호출: ${id}번 예약 취소`);
    await reservationApi.cancelReservation(id);

    // 2. API 호출 성공 시:
    // 목록에서 해당 항목의 상태를 '취소'로 변경
    const index = reservations.value.findIndex((res) => res.id === id);
    if (index !== -1) {
      reservations.value[index].status = '취소'; // DB ENUM과 일치
    }

    // 3. 사용자에게 성공 알림
    toast.add({
      severity: 'success',
      summary: '예약 취소',
      detail: '예약이 정상적으로 취소되었습니다.',
      life: 3000,
    });
  } catch (error) {
    console.error('예약 취소 실패:', error);
    toast.add({
      severity: 'danger',
      summary: '취소 실패',
      detail: error.response?.data?.message || '예약 취소 중 오류가 발생했습니다.',
      life: 3000,
    });
  }
}

// --- 4. 라이프사이클 (Lifecycle) ---

onMounted(() => {
  // (Simulation) -> [수정] 실제 데이터 로드
  loadReservations();
});
</script>

<template>
  <!-- [레이아웃 수정] StaffDashboard.vue의 구조를 적용 -->
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">상담 내역</h1>
      <p class="welcome-message">신청하신 상담 예약의 현재 상태입니다.</p>

      <div class="table-container">
        <ConfirmPopup></ConfirmPopup>
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
              <!-- [수정] getStatusSeverity가 '취소'를 처리하도록 수정됨 -->
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>

          <!-- 관리 (예약취소 버튼) -->
          <Column header="관리" style="min-width: 8rem; text-align: center">
            <template #body="{ data }">
              <!-- [수정] data.status가 '예약확정'인지 확인 (DB ENUM과 일치) -->
              <Button
                v-if="data.status === '예약확정'"
                label="예약취소"
                class="p-button-danger p-button-outlined p-button-sm"
                @click="confirmCancel($event, data)"
              />

              <!-- '상담 완료' 상태일 때 표시 (수정) -->
              <span
                v-if="data.status === '상담완료'"
                class="text-green-500 font-bold"
                style="display: inline-block"
              >
                완료됨
              </span>

              <!-- [수정] '취소' 상태일 때 표시 (DB ENUM과 일치) -->
              <span
                v-if="data.status === '취소'"
                class="text-gray-500"
                style="display: inline-block"
              >
                취소됨
              </span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<!-- [스타일 추가] StaffDashboard.vue의 스타일을 적용합니다. -->
<style>
/* (제공된 스타일 코드는 변경 없이 그대로 사용) */

/* ... (이하 스타일 생략) ... */

/* 전체 레이아웃 */
.dashboard-layout {
  min-height: 100vh;
}

/* 2. Main Content 스타일 */
.main-content {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
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

/* 4. DataTable / Content 컨테이너 */
.table-container {
  margin-top: 2rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
}
.table-container:first-of-type {
  margin-top: 0;
}

.table-container .p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-align: center; /* [수정] 헤더 중앙 정렬 */
}

/* [신규 추가] PrimeVue 헤더 내부의 span을 중앙 정렬하기 위해 flex justify-content 사용 */
.table-container .p-datatable .p-datatable-thead > tr > th .p-datatable-column-header-content {
  justify-content: center;
}

.table-container .p-datatable .p-datatable-tbody > tr > td {
  padding-top: 16px;
  padding-bottom: 16px;
  font-size: 1rem;
  text-align: center; /* [수정] 본문 중앙 정렬 */
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
