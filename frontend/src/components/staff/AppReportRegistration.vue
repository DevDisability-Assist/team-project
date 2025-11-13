<script setup>
// 1. ApplicationPlanForm 컴포넌트를 import 합니다.
import ApplicationPlanForm from './ApplicationPlanForm.vue';
import ActivityReport from './ActivityReport.vue';
import { ref } from 'vue';

const activeTab = ref('0');

const handleTabChange = (tabValue) => {
  activeTab.value = tabValue;
};
</script>

<template>
  <div class="card p-5 shadow-md rounded-xl bg-white">
    <div class="card flex flex-col gap-4 w-full">
      <div class="font-semibold text-xl mb-4">보고서 작성목록</div>
      <Tabs :value="activeTab" @update:value="handleTabChange">
        <TabList>
          <Tab value="0">지원계획서</Tab>
          <Tab value="1">지원결과서</Tab>
        </TabList>
      </Tabs>
      <div v-if="activeTab === '0'">
        <ApplicationPlanForm />
      </div>
      <div v-if="activeTab === '1'">
        <ActivityReport />
      </div>
    </div>
  </div>
</template>
