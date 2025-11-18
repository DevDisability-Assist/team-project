<script setup>
import ApplicantInfo from '@/components/staff/ApplicantInfo.vue';
import SelectCategory from '@/components/staff/SelectCategory.vue';
// import ApplicationPlanForm from '@/components/staff/ApplicationPlanForm.vue';
import AppReportRegistration from '@/components/staff/AppReportRegistration.vue';
import { defineProps, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  surveyNo: { type: Number, required: true },
});

console.log('Survey.vue가 받은 surveyNo:', props.surveyNo);

const survey = ref(null);
const wardId = ref(null); // ⭐ 초기값은 null

onMounted(async () => {
  try {
    const res = await axios.get(`/api/survey/${props.surveyNo}`);
    survey.value = res.data; // survey_no, ward_no 포함
    wardId.value = res.data.ward_no; // ⭐ 여기서 wardId 값이 설정됨
    console.log('Survey.vue가 DB에서 조회한 wardId:', wardId.value);
  } catch (err) {
    console.error('Survey 상세 조회 오류:', err);
  }
});
</script>

<template>
  <div class="flex flex-col md:flex-row w-full min-h-screen gap-4 p-4">
    <!-- 
      ⭐ 수정된 부분: 
      자식 컴포넌트들에게 v-bind (줄임말 ':')를 사용하여 props를 전달합니다.
      이제 wardId.value가 변경되면 자식들의 'ward-id' prop도 함께 변경됩니다.
    -->
    <div class="w-full md:w-1/2 flex flex-col gap-4">
      <ApplicantInfo :ward-id="wardId" />
      <SelectCategory :ward-id="wardId" />
    </div>

    <div class="w-full md:w-1/2 flex">
      <AppReportRegistration :ward-id="wardId" class="flex-1" />
    </div>
  </div>
</template>
