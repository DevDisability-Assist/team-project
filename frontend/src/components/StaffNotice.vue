<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

// PrimeVue 컴포넌트 임포트
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import Tag from 'primevue/tag';

// 재사용할 컴포넌트 임포트
import SearchBar from '@/components/SearchBar.vue';
import BaseDataTable from '@/components/BaseDataTable.vue'; // 공통 테이블 컴포넌트

const router = useRouter();

// 데이터 및 상태 ref
const surveys = ref([]);
const loading = ref(true);
const toggleState = ref(false);

// BaseDataTable에 전달할 컬럼 정의
const staffColumns = ref([
  { field: 'id', header: '조사지ID', style: 'min-width: 8rem' },
  { field: 'name', header: '조사지명', style: 'min-width: 20rem' },
  { field: 'institution', header: '담당기관', style: 'min-width: 10rem' },
  { field: 'status', header: '상태', style: 'min-width: 8rem' },
  { field: 'modifiedDate', header: '최종 수정일', style: 'min-width: 10rem' },
  { field: 'management', header: '관리', style: 'min-width: 8rem; text-align: center;' },
]);

// 컴포넌트가 마운트되기 전에 실행될 훅
onBeforeMount(() => {
  surveys.value = [
    {
      id: 'SUR-001',
      name: '2025년 1분기 만족도 조사',
      institution: '보건복지부',
      status: '진행중',
      modifiedDate: '2025-11-10',
    },
    {
      id: 'SUR-002',
      name: '발달장애인 지원 프로그램 설문',
      institution: '고용노동부',
      status: '마감',
      modifiedDate: '2025-11-05',
    },
    {
      id: 'SUR-003',
      name: '커뮤니티 시설 이용 현황 조사',
      institution: '지방자치단체',
      status: '진행중',
      modifiedDate: '2025-11-12',
    },
    {
      id: 'SUR-004',
      name: '긴급 돌봄 서비스 수요 조사',
      institution: '보건복지부',
      status: '대기',
      modifiedDate: '2025-10-28',
    },
    {
      id: 'SUR-005',
      name: '2024년 연말 종합 평가 설문',
      institution: '기획재정부',
      status: '마감',
      modifiedDate: '2025-10-15',
    },
  ];
  loading.value = false;
});

// "게시글 작성" 버튼 클릭 시 실행될 함수
const writePost = () => {
  alert('게시글 작성 페이지로 이동합니다.');
};

// "상세보기" 버튼 클릭 시 실행될 함수
const viewDetails = (survey) => {
  alert(`${survey.id} 항목의 상세 페이지로 이동합니다.`);
};

// 상태(status)에 따라 Tag의 색상을 결정하는 함수
const getStatusSeverity = (status) => {
  switch (status) {
    case '진행중':
      return 'success';
    case '마감':
      return 'danger';
    case '대기':
      return 'warning';
    default:
      return 'info';
  }
};
</script>

<template>
  <div class="card">
    <SearchBar />

    <div class="flex justify-between items-center my-4">
      <InputSwitch v-model="toggleState" />
      <Button label="게시글 작성" icon="pi pi-pencil" @click="writePost" />
    </div>

    <!-- 공통 테이블 컴포넌트 사용 -->
    <BaseDataTable :data="surveys" :columns="staffColumns" :loading="loading">
      <!-- 'status' 컬럼의 body를 커스터마이징 -->
      <template #body-status="{ data }">
        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
      </template>

      <!-- 'management' 컬럼의 body를 커스터마이징 -->
      <template #body-management="{ data }">
        <Button label="상세보기" outlined @click="viewDetails(data)" />
      </template>
    </BaseDataTable>
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

:deep(.p-inputswitch .p-inputswitch-slider) {
  background: #ef4444;
  border-color: #ef4444;
}

:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) {
  background: #22c55e;
  border-color: #22c55e;
}

:deep(.p-inputswitch .p-inputswitch-slider:before) {
  background: #ffffff;
}
</style>
