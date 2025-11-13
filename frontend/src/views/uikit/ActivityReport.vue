<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// 데이터 및 상태
const surveys = ref([]);
const loading = ref(true);
const toggleState = ref(false);

// 필터 설정
const filters = ref({});
function initFilters() {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
}

// 상태(status)에 따라 색상 구분
const getStatusSeverity = (status) => {
  switch (status) {
    case '접수':
      return 'info';
    case '중점':
      return 'warning';
    case '반려':
      return 'danger';
    default:
      return null;
  }
};

// 초기 데이터 로드
onBeforeMount(() => {
  initFilters();

  surveys.value = [
    {
      survey_no: 1,
      ward_no: 101,
      business_name: '복지 지원사업 만족도 조사',
      purpose: '사업의 효율성 평가',
      content: '설문 응답자들의 만족도 조사 결과 수집',
      writer: '김민수',
      status: '접수',
      modify_reason: null,
      created_at: '2025-11-01 09:30:00',
      updated_at: '2025-11-02 14:20:00',
    },
    {
      survey_no: 2,
      ward_no: 102,
      business_name: '장애인 지원 프로그램 설문',
      purpose: '프로그램 개선안 도출',
      content: '이용자 의견 기반의 개선사항 분석',
      writer: '박지영',
      status: '심사중',
      modify_reason: '설문 문항 수정 요청',
      created_at: '2025-11-03 10:15:00',
      updated_at: '2025-11-05 13:45:00',
    },
    {
      survey_no: 3,
      ward_no: 103,
      business_name: '긴급 돌봄 서비스 현황 조사',
      purpose: '서비스 만족도 및 수요 파악',
      content: '대상자별 돌봄 지원 현황 파악',
      writer: '이철수',
      status: '반려',
      modify_reason: '조사 범위 미흡',
      created_at: '2025-10-29 11:00:00',
      updated_at: '2025-10-30 16:30:00',
    },
  ];

  loading.value = false;
});

// 게시글 작성 버튼
const writePost = () => {
  console.log('새 조사지 등록 페이지로 이동');
};

// 상세보기 버튼
const viewDetails = (survey) => {
  console.log(`${survey.survey_no}번 조사지 상세보기`);
};
</script>

<template>
  <div class="card">
    <!-- 검색창 -->
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="filters.global.value"
        placeholder="사업명, 목적, 작성자 등으로 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 필터 및 버튼 -->
    <div class="flex justify-between items-center mt-4 mb-2">
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-700">토글 필터:</span>
        <InputSwitch v-model="toggleState" />
      </div>
      <Button label="조사지 작성" icon="pi pi-pencil" @click="writePost" />
    </div>

    <!-- 데이터 테이블 -->
    <DataTable
      :value="surveys"
      :loading="loading"
      :filters="filters"
      filterDisplay="row"
      paginator
      :rows="5"
      dataKey="survey_no"
      removableSort
      stripedRows
    >
      <Column field="survey_no" header="조사지번호" :sortable="true" style="min-width: 8rem" />
      <Column field="ward_no" header="구역번호" :sortable="true" style="min-width: 6rem" />
      <Column field="business_name" header="사업명" :sortable="true" style="min-width: 15rem" />
      <Column field="purpose" header="목적" :sortable="true" style="min-width: 15rem" />
      <Column field="content" header="내용" :sortable="true" style="min-width: 20rem" />
      <Column field="writer" header="작성자" :sortable="true" style="min-width: 8rem" />

      <!-- 상태 컬럼 -->
      <Column field="status" header="상태" :sortable="true" style="min-width: 8rem">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.status"
            :severity="getStatusSeverity(slotProps.data.status)"
          />
        </template>
      </Column>

      <!-- 수정사유 (값이 있을 때만 표시) -->
      <Column field="modify_reason" header="수정사유" :sortable="true" style="min-width: 15rem">
        <template #body="slotProps">
          <span v-if="slotProps.data.modify_reason">{{ slotProps.data.modify_reason }}</span>
          <span v-else class="text-gray-400 italic">-</span>
        </template>
      </Column>

      <Column field="created_at" header="작성일" :sortable="true" style="min-width: 12rem" />
      <Column field="updated_at" header="수정일" :sortable="true" style="min-width: 12rem" />

      <!-- 관리 버튼 -->
      <Column header="관리" style="min-width: 8rem; text-align: center">
        <template #body="slotProps">
          <Button label="상세보기" outlined size="small" @click="viewDetails(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

/* InputSwitch 색상 커스터마이징 */
:deep(.p-inputswitch .p-inputswitch-slider) {
  background: #ef4444;
  border-color: #ef4444;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: #22c55e;
  border-color: #22c55e;
}
:deep(.p-inputswitch .p-inputswitch-slider:before) {
  background: #ffffff;
}
</style>
