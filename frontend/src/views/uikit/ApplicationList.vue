<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import axios from 'axios';
import InputText from 'primevue/inputtext';
import SupportPlanItem from '@/components/staff/SupportPlanItem.vue';

// 여러 개 아코디언 열기 여부
const ALLOW_MULTIPLE_ACCORDIONS = ref(false);

// 상태
const surveys = ref([]);
const loading = ref(false);
const searchKeyword = ref('');
const activeSupportPlanNo = ref(null);

// 우선순위 변환
const mapPriority = (no) => {
  switch (no) {
    case 1:
      return '긴급';
    case 2:
      return '중점';
    case 3:
      return '준비';
    default:
      return '준비';
  }
};

// 상세 토글
const handleToggleDetail = (supportPlanNo) => {
  if (!ALLOW_MULTIPLE_ACCORDIONS.value) {
    activeSupportPlanNo.value = activeSupportPlanNo.value === supportPlanNo ? null : supportPlanNo;
  }
};

// DB 데이터 로딩
onBeforeMount(async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/staff/support-plan'); // <<< 반드시 /staff 붙음

    surveys.value = res.data.map((item) => ({
      support_plan_no: item.support_plan_no,
      title: item.support_plan_goal,
      writer: item.staff_name,
      createdAt: item.created_at ? item.created_at.split('T')[0] : '',
      requestDate: item.writer_date ? item.writer_date.split('T')[0] : '',
      priority: mapPriority(item.priority_no),
      plan: item.plan,
    }));
  } catch (err) {
    console.error('Support Plan 조회 오류:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="card">
    <!-- 검색창 -->
    <div class="p-input-icon-left w-full mb-4">
      <i class="pi pi-search" />
      <InputText
        v-model="searchKeyword"
        placeholder="사업명, 작성자 등으로 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 리스트 -->
    <div v-if="!loading" class="flex flex-col gap-6">
      <SupportPlanItem
        v-for="item in surveys"
        :key="item.support_plan_no"
        :item="item"
        :is-active="activeSupportPlanNo === item.support_plan_no"
        :allow-multiple="ALLOW_MULTIPLE_ACCORDIONS"
        @toggle-detail="() => handleToggleDetail(item.support_plan_no)"
      />
    </div>

    <!-- 로딩 -->
    <div v-else class="text-center p-6 text-lg text-gray-500">데이터를 불러오는 중입니다...</div>
  </div>
</template>
