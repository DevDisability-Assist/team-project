<script setup>
// 1. [삭제] CustomerService import 제거
// import { CustomerService } from '@/service/system_service/Institution';

import { ProductService } from '@/service/ProductService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onMounted, reactive, ref } from 'vue';
import SurveyDetailButton from '@/components/system/SurveyDetailButton.vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 👈 2. [추가] axios import

const router = useRouter();
const customers1 = ref([]);

const filters1 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  'country.name': {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  date: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
  },
  balance: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  status: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS },
});
const loading1 = ref(true); // 로딩 초기값 true로 설정

const products = ref([]);

const representatives = reactive([
  { name: '장애인지원센터1' },
  { name: '장애인지원센터2' },
  { name: '장애인지원센터3' },
  { name: '장애인지원센터4' },
  { name: '장애인지원센터5' },
  { name: '장애인지원센터6' },
  { name: '장애인지원센터7' },
  { name: '장애인지원센터8' },
  { name: '장애인지원센터9' },
]);

onMounted(async () => {
  ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));

  // 👇 3. [수정] 백엔드 API 호출 로직으로 변경
  try {
    // 백엔드 서버 주소 (포트 3000 확인 필요)

    const response = await axios.get('/api/system/survey');

    const dbData = response.data;

    // 4. [중요] DB 데이터(inquiry 테이블)를 프론트엔드 테이블 구조에 맞게 변환
    customers1.value = dbData.map((item, index) => {
      // 1️⃣ 안전한 날짜 변환 함수
      const parseDate = (value) => {
        if (!value) return null; // null 또는 undefined면 그냥 null 반환
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date; // Invalid Date 방지
      };

      return {
        id: item.inquiry_no ?? index, // null/undefined면 인덱스로 대체
        name: item.inquiry_no ?? '-', // 조사지ID
        country: {
          name: item.inquiry_name || '이름없음', // 조사지명
        },
        representative: {
          name: item.inquiry_writer || '미지정', // 담당기관
        },
        date: parseDate(item.created_at), // ✅ 안전한 날짜 변환
        balance: 0, // 더미 데이터
        status: item.inquiry_status || '미정', // 상태값 기본값
      };
    });

    console.log('DB 데이터 로드 성공:', customers1.value);
  } catch (error) {
    console.error('백엔드 API 호출 실패:', error);
    // 에러 발생 시 빈 배열로 초기화하여 테이블이 깨지지 않게 함
    customers1.value = [];
  } finally {
    loading1.value = false; // 로딩 종료
  }

  initFilters1();
});

function goToRegistSurvey() {
  router.push({
    name: 'RegistSurvey',
  });
}

function initFilters1() {
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    'country.name': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    balance: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
}

function formatDate(value) {
  if (!value) return '';
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
</script>

<template>
  <div class="card">
    <div class="font-semibold text-xl mb-4">조사지 관리</div>
    <DataTable
      v-model:filters="filters1"
      :value="customers1"
      :paginator="true"
      :rows="10"
      dataKey="id"
      :rowHover="true"
      filterDisplay="menu"
      :loading="loading1"
      :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
      showGridlines
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-fw pi-pencil"
            label="조사지 등록"
            outlined
            @click="goToRegistSurvey()"
          />
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
          </IconField>
        </div>
      </template>
      <template #empty> No customers found. </template>
      <template #loading> Loading customers data. Please wait. </template>
      <Column field="name" header="조사지ID" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
        </template>
      </Column>
      <Column header="조사지명" filterField="country.name" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.country.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by country" />
        </template>
        <template #filterclear="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-times"
            @click="filterCallback()"
            severity="secondary"
          ></Button>
        </template>
        <template #filterapply="{ filterCallback }">
          <Button
            type="button"
            icon="pi pi-check"
            @click="filterCallback()"
            severity="success"
          ></Button>
        </template>
      </Column>
      <Column
        header="작성자"
        filterField="representative"
        :showFilterMatchModes="false"
        :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 14rem"
      >
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.representative.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="representatives"
            optionLabel="name"
            placeholder="Any"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column header="최종 수정일" filterField="date" dataType="date" style="min-width: 10rem">
        <template #body="{ data }">
          {{ formatDate(data.date) }}
        </template>
        <template #filter="{ filterModel }">
          <DatePicker v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
        </template>
      </Column>
      <Column header="상세보기" style="min-width: 10rem">
        <template #body="{ data }">
          <SurveyDetailButton :surveyId="data.id" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>
