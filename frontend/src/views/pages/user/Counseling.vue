<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import api from '@/api/api.js'; // [연동] 1. api.js 임포트

const router = useRouter();
const toast = useToast();

// --- 1. 상태 관리 (State Management) ---

// 오늘 날짜 (시간은 00:00:00으로 설정)
const today = new Date();
today.setHours(0, 0, 0, 0);
const minDate = ref(today); // 오늘 이전 날짜는 비활성화

// 선택된 날짜 및 시간
const selectedDate = ref(null);
const selectedTime = ref(null); // [연동] (주의) 이곳에는 '10:30'이 아닌 { time: '10:30', at_no: 1 } 객체가 저장됩니다.

// 상담 신청 완료 알림 팝업 표시 여부
const showConfirmationDialog = ref(false);

// 로딩 상태
const isLoading = ref(false); // '상담 신청' 버튼의 로딩 상태
const isLoadingSchedules = ref(true); // 캘린더 스케줄 로딩 상태

// (Mock Data) -> [연동] 이제 실제 데이터가 담길 변수입니다.
const mockAvailableTimes = ref({});

// [수정] availableDateSet을 ref가 아닌 일반 변수로 선언합니다.
// 반응성(ref)을 제거하여 PrimeVue 컴포넌트와의 충돌을 방지합니다.
let availableDateSet = new Set();

// 선택된 날짜에 해당하는 예약 가능 시간 목록
const availableTimes = ref([]);

// (Mock Data) 로그인한 사용자 이름
const userName = ref('홍길동'); // [참고] 실제로는 로그인 스토어(authStore)에서 가져와야 합니다.

// --- 2. 헬퍼 함수 (Helper Functions) ---

// Date 객체를 'YYYY-MM-DD' 문자열로 변환
function formatDateToISO(date) {
  if (!date) return null;
  // [수정] KST 기준 날짜 계산 (toISOString()은 UTC 기준이므로)
  const offset = date.getTimezoneOffset() * 60000;
  const dateInKST = new Date(date.getTime() - offset);
  return dateInKST.toISOString().split('T')[0];
}

// 캘린더의 date 객체({day, month, year})를 'YYYY-MM-DD' 문자열로 변환
function formatCalendarDateToISO(dateObj) {
  const year = dateObj.year;
  const month = (dateObj.month + 1).toString().padStart(2, '0'); // month는 0-indexed
  const day = dateObj.day.toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Date 객체를 'YYYY년 MM월 DD일' 문자열로 변환
function formatToKoreanDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// --- 3. 이벤트 핸들러 (Event Handlers) ---

/**
 * [고급 구현]
 * 'disabledDates' prop에 전달될 함수.
 */
function isDateDisabled(date) {
  // 1. minDate (오늘) 이전 날짜인지 확인
  const checkDate = new Date(date.year, date.month, date.day);
  if (checkDate < minDate.value) {
    return true; // 오늘 이전이므로 비활성화
  }

  // 2. 예약 가능 목록에 없는 날짜인지 확인
  const dateKey = formatCalendarDateToISO(date);

  // .value를 제거 (availableDateSet은 더 이상 ref가 아님)
  // availableDateSet에 dateKey가 *없으면* 비활성화 (true 반환)
  return !availableDateSet.has(dateKey);
}

/**
 * 캘린더에서 (활성화된) 날짜를 선택했을 때 호출
 */
function onDateSelect(date) {
  console.log('선택된 날짜:', date);
  selectedDate.value = date;
  selectedTime.value = null; // 날짜가 바뀌면 선택된 시간 초기화

  const dateKey = formatDateToISO(date);
  // [연동] 백엔드에서 받은 데이터 (형식: [{ time: '10:30', at_no: 1 }, ...])
  const times = mockAvailableTimes.value[dateKey];

  if (times) {
    // times가 undefined가 아닌지 확인 (빈 배열 []도 포함)
    availableTimes.value = times;
  } else {
    // isDateDisabled가 정확하다면 이 코드는 실행되지 않음
    availableTimes.value = [];
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '선택된 날짜의 시간을 찾을 수 없습니다. 관리자에게 문의하세요.',
      life: 3000,
    });
  }
}

/**
 * [연동] 시간 슬롯 버튼을 클릭했을 때 호출
 * @param {object} timeObject - 선택된 시간 객체 (예: { time: '10:30', at_no: 1 })
 */
function selectTime(timeObject) {
  selectedTime.value = timeObject;
}

/**
 * [연동] '상담 신청' 버튼 클릭 시
 */
async function submitApplication() {
  if (!selectedDate.value || !selectedTime.value) {
    toast.add({
      severity: 'warn',
      summary: '신청 불가',
      detail: '날짜와 시간을 모두 선택해주세요.',
      life: 3000,
    });
    return;
  }

  isLoading.value = true;

  try {
    // [연동] 5. API 호출 (POST)
    const payload = {
      at_no: selectedTime.value.at_no, // {time, at_no} 객체에서 at_no를 전송
    };

    await api.post('/schedule/reserve', payload);

    // API 호출 성공
    showConfirmationDialog.value = true;
  } catch (error) {
    // API 호출 실패
    console.error('예약 실패:', error);
    toast.add({
      severity: 'error',
      summary: '예약 실패',
      detail: error.response?.data?.message || '상담 신청 중 오류가 발생했습니다.',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
}

/**
 * 알림 팝업의 '닫기' 버튼 클릭 시
 */
function closeConfirmationDialog() {
  showConfirmationDialog.value = false;
  // 상태 초기화
  selectedDate.value = null;
  selectedTime.value = null;
  availableTimes.value = [];

  // [연동] 예약이 완료되었으므로 스케줄을 새로고침합니다.
  refreshSchedules();
}

/**
 * 알림 팝업의 '목록 보기' 버튼 클릭 시
 */
function goToHistory() {
  closeConfirmationDialog();
  router.push('/counseling-history'); // 상담 내역 페이지로 이동
}

// --- 4. 계산된 속성 (Computed Properties) ---

// [연동] availableTimes.value는 이제 [{time: 'HH:MM', at_no: 1}, ...] 입니다.
const morningTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) < 12)
);
const afternoonTimes = computed(() =>
  availableTimes.value.filter((t) => parseInt(t.time.split(':')[0]) >= 12)
);

const confirmationDateTime = computed(() => {
  if (!selectedDate.value || !selectedTime.value) return '';
  // [연동] selectedTime.time (객체의 time 속성) 을 사용
  return `${formatToKoreanDate(selectedDate.value)} ${selectedTime.value.time}시`;
});

// --- 5. 라이프사이클 (Lifecycle) ---

// [연동] 스케줄 로딩 로직을 별도 함수로 분리 (재사용 위함)
async function refreshSchedules() {
  isLoadingSchedules.value = true;
  try {
    // [연동] 2. API를 호출하여 실제 예약 가능 시간을 가져옵니다.
    const response = await api.get('/user/available-time');

    // [연동] 3. 백엔드 응답(response.data)으로 상태를 설정합니다.
    mockAvailableTimes.value = response.data;
    availableDateSet = new Set(Object.keys(mockAvailableTimes.value));
  } catch (error) {
    console.error('스케줄 로딩 실패:', error);
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '예약 가능한 시간을 불러오는 데 실패했습니다.',
      life: 3000,
    });
    availableDateSet = new Set(); // 오류 시 빈 Set
  } finally {
    isLoadingSchedules.value = false;
  }
}

onMounted(async () => {
  await refreshSchedules();
});
</script>

<template>
  <div class="dashboard-layout">
    <div class="main-content">
      <h1 class="page-title">상담 신청</h1>
      <p class="welcome-message">
        '예약 가능'한 날짜 중 하루를 선택하세요. (오늘: {{ formatToKoreanDate(new Date()) }})
      </p>

      <div class="table-container">
        <Card>
          <template #content>
            <div class="flex justify-content-center">
              <ProgressSpinner
                v-if="isLoadingSchedules"
                style="width: 50px; height: 50px"
                strokeWidth="8"
              />
              <Calendar
                v-else
                v-model="selectedDate"
                inline
                :minDate="minDate"
                dateFormat="yy-mm-dd"
                @date-select="onDateSelect"
                class="w-full"
                :disabledDates="isDateDisabled"
              >
              </Calendar>
            </div>
            <template v-if="!isLoadingSchedules && availableDateSet.size === 0">
              <div class="mt-4 text-center text-gray-500">
                현재 예약 가능한 상담 일정이 없습니다.
              </div>
            </template>
          </template>
        </Card>
      </div>

      <div class="table-container" v-if="selectedDate && availableTimes.length > 0">
        <Card>
          <template #content>
            <div class="mt-0">
              <Divider />
              <h6 class="text-center mb-4">
                {{ formatToKoreanDate(selectedDate) }}
              </h6>

              <div v-if="morningTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오전</div>
                <div class="flex flex-wrap gap-3">
                  <Button
                    v-for="timeObj in morningTimes"
                    :key="timeObj.at_no"
                    :label="timeObj.time"
                    :outlined="selectedTime?.at_no !== timeObj.at_no"
                    @click="selectTime(timeObj)"
                    style="min-width: 80px"
                  />
                </div>
              </div>

              <div v-if="afternoonTimes.length > 0" class="mb-4">
                <div class="font-semibold text-lg mb-3">오후</div>
                <div class="flex flex-wrap gap-3">
                  <Button
                    v-for="timeObj in afternoonTimes"
                    :key="timeObj.at_no"
                    :label="timeObj.time"
                    :outlined="selectedTime?.at_no !== timeObj.at_no"
                    @click="selectTime(timeObj)"
                    style="min-width: 80px"
                  />
                </div>
              </div>

              <div class="text-center mt-5">
                <Button
                  label="상담 신청"
                  icon="pi pi-check"
                  :loading="isLoading"
                  :disabled="!selectedTime"
                  @click="submitApplication"
                  class="p-button-lg w-full md:w-auto"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div
        class="table-container"
        v-if="selectedDate && availableTimes.length === 0 && !isLoadingSchedules"
      >
        <Card>
          <template #content>
            <div class="text-center text-gray-500 py-4">
              선택하신 날짜에는 예약 가능한 시간이 없습니다. 다른 날짜를 선택해주세요.
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="showConfirmationDialog"
    modal
    header="상담 신청 완료"
    :style="{ width: '450px' }"
    :breakpoints="{ '960px': '75vw', '641px': '100vw' }"
    @hide="closeConfirmationDialog"
  >
    <div class="flex flex-column align-items-center text-center">
      <i class="pi pi-check-circle text-green-500 text-5xl mb-4"></i>
      <p class="line-height-3 text-center">
        {{ userName }}님 {{ confirmationDateTime }}<br />
        상담이 예약되었습니다.
      </p>
    </div>
    <template #footer>
      <div class="flex w-full gap-2">
        <Button label="목록보기" @click="goToHistory" class="p-button-text flex-1" />
        <Button label="닫기" @click="closeConfirmationDialog" autofocus class="flex-1" />
      </div>
    </template>
  </Dialog>
</template>

<style>
/* ... (스타일 태그 내용은 이전과 동일하게 유지) ... */
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

.table-container {
  margin-top: 2rem; /* 카드 간의 수직 여백 */
}
.table-container:first-of-type {
  margin-top: 0; /* 첫 번째 카드는 여백 없음 */
}

.table-container .p-card .p-card-body {
  padding: 2rem; /* Card 기본 패딩 적용 */
}
.table-container .p-card .p-card-content {
  padding: 0; /* Card content의 기본 패딩 제거 */
}

/* --- 기존 CounselingApplication.vue의 스타일 --- */

/* PrimeVue 캘린더의 오늘 날짜 표시에 강한 테두리 추가 */
:deep(.p-datepicker-today > .p-datepicker-button) {
  border: 1px solid var(--primary-color);
}

/* 캘린더 내부의 날짜 버튼 크기를 키워 가독성을 높입니다. */
:deep(.p-datepicker table td > .p-datepicker-button) {
  width: 3rem;
  height: 3rem;
}

/* 캘린더 헤더(월, 연도) 폰트 크기 */
:deep(.p-datepicker .p-datepicker-header .p-datepicker-title) {
  font-size: 1.25rem;
}

/* Dialog 팝업의 헤더 스타일을 page-title과 유사하게 조정 */
:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  font-weight: 600;
  font-size: 1.25rem;
  color: #212529;
}
</style>
