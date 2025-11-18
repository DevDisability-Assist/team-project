<script setup>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import SupportPlanItem from '@/components/staff/SupportPlanItem.vue';

// --- Configuration ---
const ALLOW_MULTIPLE_ACCORDIONS = ref(false); // true로 변경하면 여러 개 동시 열기 가능

// --- State Management ---
const surveys = ref([
  {
    support_plan_no: 1,
    title: '긴급 돌봄 지원 사업',
    writer: '김철수',
    createdAt: '2025-11-10',
    requestDate: '2025-11-09',
    priority: '긴급',
    status: '승인 대기',
  },
  {
    support_plan_no: 2,
    title: '청년 주거 안정 지원',
    writer: '이영희',
    createdAt: '2025-11-08',
    requestDate: '2025-11-07',
    priority: '높음',
    status: '승인 완료',
  },
  {
    support_plan_no: 3,
    title: '노인 일자리 창출 사업',
    writer: '박노인',
    createdAt: '2025-11-05',
    requestDate: '2025-11-04',
    priority: '보통',
    status: '반려',
  },
  {
    support_plan_no: 4,
    title: '신생아 출산 장려금',
    writer: '김부모',
    createdAt: '2025-11-02',
    requestDate: '2025-11-01',
    priority: '높음',
    status: '승인 완료',
  },
  {
    support_plan_no: 5,
    title: '소상공인 긴급 자금 지원',
    writer: '최자영',
    createdAt: '2025-10-28',
    requestDate: '2025-10-27',
    priority: '긴급',
    status: '승인 대기',
  },
  {
    support_plan_no: 6,
    title: '장애인 활동 보조 서비스',
    writer: '이보조',
    createdAt: '2025-10-25',
    requestDate: '2025-10-24',
    priority: '보통',
    status: '승인 완료',
  },
]);
const loading = ref(false);
const searchKeyword = ref(''); // 검색 키워드
const activeSupportPlanNo = ref(null); // 현재 열려있는 SupportPlanItem의 support_plan_no

// --- Event Handlers ---
const handleToggleDetail = (supportPlanNo) => {
  if (ALLOW_MULTIPLE_ACCORDIONS.value) {
    // SupportPlanItem 내부에서 isDetailVisible을 토글하도록 위임
    // 이 경우 activeSupportPlanNo는 사용되지 않음
  } else {
    // 단일 아코디언 모드: 현재 열려있는 항목과 같으면 닫고, 다르면 해당 항목을 엶
    activeSupportPlanNo.value = activeSupportPlanNo.value === supportPlanNo ? null : supportPlanNo;
  }
};

// onBeforeMount(async () => {
//   try {
//     const res = await axios.get('/api/admin');
//     surveys.value = res.data;
//   } catch (err) {
//     console.error('Admin Survey 조회 오류:', err);
//   } finally {
//     loading.value = false;
//   }
// });
</script>

<template>
  <div class="card">
    <!-- 검색창 -->
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="searchKeyword"
        placeholder="사업명, 목적, 작성자 등으로 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 카드 리스트 -->
    <div v-if="!loading" class="flex flex-col gap-6">
      <SupportPlanItem
        v-for="item in surveys"
        :key="item.support_plan_no"
        :item="item"
        :is-active="activeSupportPlanNo === item.support_plan_no"
        :allow-multiple="ALLOW_MULTIPLE_ACCORDIONS"
        @toggle-detail="handleToggleDetail(item.support_plan_no)"
      />
    </div>

    <!-- 로딩 표시 -->
    <div v-else class="text-center p-6 text-lg text-gray-500">데이터를 불러오는 중입니다...</div>
  </div>
</template>
