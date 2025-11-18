<script setup>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Tag from 'primevue/tag';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useRouter } from 'vue-router';
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
    case '심사중':
      return 'warning';
    case '반려':
      return 'danger';
    default:
      return null;
  }
};

onBeforeMount(async () => {
  initFilters();
  try {
    const res = await axios.get('/api/staff/survey-select'); // ⭐ 여기로 DB 조회됨
    console.log('res', res);
    surveys.value = res.data; // ⭐ DB → Vue DataTable 바로 연결
  } catch (err) {
    console.error('Survey 조회 오류:', err);
  } finally {
    loading.value = false;
  }
});

const router = useRouter();

// 상세보기 버튼
const viewDetails = (row) => {
  router.push({
    name: 'survey',
    params: { surveyNo: row.survey_no },
  });
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
      <!-- <Column field="created_at" header="작성일"> -->
      <!-- <template #body="slotProps">
          {{ new Date(slotProps.data.created_at).toLocaleString() }}
        </template>
      </Column> -->

      <Column field="created_at" header="작성일" :sortable="true" style="min-width: 12rem">
        <template #body="slotProps">
          {{
            slotProps.data.created_at
              ? new Date(slotProps.data.created_at).toLocaleDateString()
              : '-'
          }}
        </template>
      </Column>

      <Column field="updated_at" header="수정일" :sortable="true" style="min-width: 12rem">
        <template #body="slotProps">
          {{
            slotProps.data.updated_at
              ? new Date(slotProps.data.updated_at).toLocaleDateString()
              : '-'
          }}
        </template>
      </Column>

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
