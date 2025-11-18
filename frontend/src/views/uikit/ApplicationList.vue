<script setup>
import axios from 'axios';
import { ref, onBeforeMount } from 'vue';
import SupportPlanItem from '@/components/staff/SupportPlanItem.vue';

const surveys = ref([]);
const loading = ref(true);
const searchKeyword = ref(''); // 검색 키워드

// 관리자용 데이터 조회
onBeforeMount(async () => {
  try {
    const res = await axios.get('/api/staff');
    surveys.value = res.data;
  } catch (err) {
    console.error('Staff Survey 조회 오류:', err);
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
        placeholder="사업명, 목적, 작성자 등으로 검색"
        class="w-full p-inputtext-lg"
      />
    </div>

    <!-- 카드 리스트 -->
    <div v-if="!loading" class="flex flex-col gap-6">
      <SupportPlanItem
        v-for="item in surveys"
        :key="item.support_plan_no"
        :title="item.title"
        :writer="item.writer"
        :createdAt="item.createdAt || '-'"
        :requestDate="item.requestDate || '-'"
        :priority="item.priority"
        :status="item.status"
      />
    </div>

    <!-- 로딩 표시 -->
    <div v-else class="text-center p-6 text-lg text-gray-500">데이터를 불러오는 중입니다...</div>
  </div>
</template>
