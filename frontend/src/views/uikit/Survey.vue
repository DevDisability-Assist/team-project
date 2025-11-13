<script setup>
import ApplicantInfo from '@/components/staff/ApplicantInfo.vue';
import SelectCategory from '@/components/staff/SelectCategory.vue';
// import ApplicationPlanForm from '@/components/staff/ApplicationPlanForm.vue';
import AppReportRegistration from '@/components/staff/AppReportRegistration.vue';
</script>

<template>
  <div class="flex flex-col md:flex-row w-full min-h-screen gap-4 p-4">
    <!-- 왼쪽 열: ApplicantInfo + SelectCategory -->
    <div class="w-full md:w-1/2 flex flex-col gap-4">
      <!-- flex-1 제거: 각 컴포넌트가 내용에 맞는 높이 -->
      <ApplicantInfo />
      <SelectCategory />
    </div>
    <!-- 오른쪽 열: ApplicationPlanForm -->
    <div class="w-full md:w-1/2 flex">
      <!-- 오른쪽 컴포넌트가 전체 높이 차지 -->
      <!-- <ApplicationPlanForm class="flex-1" /> -->
      <AppReportRegistration class="flex-1" />
    </div>
  </div>
</template>
