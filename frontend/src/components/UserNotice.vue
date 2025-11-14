<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

// PrimeVue 컴포넌트 임포트
import Button from 'primevue/button';
import Tag from 'primevue/tag';

// 공통 테이블 컴포넌트 임포트
import BaseDataTable from '@/components/BaseDataTable.vue';

const router = useRouter();

// 데이터 및 상태 ref
const userSurveys = ref([]);
const loading = ref(true);

// BaseDataTable에 전달할 컬럼 정의
const userColumns = ref([
  { field: 'name', header: '조사지명', style: 'min-width: 20rem' },
  { field: 'target', header: '대상자', style: 'min-width: 10rem' },
  { field: 'status', header: '상태', style: 'min-width: 8rem' },
  { field: 'deadline', header: '제출기한', style: 'min-width: 10rem' },
  { field: 'management', header: '관리', style: 'min-width: 15rem' },
]);

// 컴포넌트가 마운트되기 전에 실행될 훅
onBeforeMount(() => {
  userSurveys.value = [
    {
      id: 'USR-SUR-001',
      name: '2025년 1분기 만족도 조사',
      target: '홍길동',
      status: '작성 가능',
      deadline: '2025-11-20',
    },
    {
      id: 'USR-SUR-002',
      name: '발달장애인 지원 프로그램 설문',
      target: '김철수',
      status: '제출 완료',
      deadline: '2025-11-10',
    },
    {
      id: 'USR-SUR-003',
      name: '커뮤니티 시설 이용 현황 조사',
      target: '이영희',
      status: '작성 가능',
      deadline: '2025-11-30',
    },
    {
      id: 'USR-SUR-004',
      name: '긴급 돌봄 서비스 수요 조사',
      target: '박지성',
      status: '제출 완료',
      deadline: '2025-10-28',
    },
  ];
  loading.value = false;
});

// "작성하기" 버튼 클릭 시 실행될 함수
const doSurvey = (survey) => {
  alert(`'${survey.name}' 조사를 시작합니다.`);
};

// "결과보기" 버튼 클릭 시 실행될 함수
const viewResult = (survey) => {
  alert(`'${survey.name}' 조사 결과를 봅니다.`);
};

// 상태(status)에 따라 Tag의 색상을 결정하는 함수
const getStatusSeverity = (status) => {
  switch (status) {
    case '작성 가능':
      return 'success';
    case '제출 완료':
      return 'secondary';
    default:
      return 'contrast';
  }
};
</script>

<template>
  <div class="card">
    <div class="flex items-center mb-5">
      <i class="pi pi-file-text" style="font-size: 2.5rem; color: var(--primary-color)"></i>
      <h2 class="text-3xl font-bold ml-4">조사지 관리</h2>
    </div>

    <div class="survey-list-box">
      <h3 class="text-xl font-semibold mb-4">조사지 목록</h3>

      <!-- 공통 테이블 컴포넌트 사용 -->
      <BaseDataTable :data="userSurveys" :columns="userColumns" :loading="loading" :rows="5">
        <!-- 'status' 컬럼의 body를 커스터마이징 -->
        <template #body-status="{ data }">
          <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
        </template>

        <!-- 'management' 컬럼의 body를 커스터마이징 -->
        <template #body-management="{ data }">
          <div class="flex gap-2">
            <Button
              label="작성하기"
              outlined
              @click="doSurvey(data)"
              :disabled="data.status === '제출 완료'"
            />
            <Button
              label="결과보기"
              severity="secondary"
              outlined
              @click="viewResult(data)"
              :disabled="data.status === '작성 가능'"
            />
          </div>
        </template>
      </BaseDataTable>
    </div>
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

.survey-list-box {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}
</style>
