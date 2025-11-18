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
    const res = await axios.get(`/api/staff/${props.surveyNo}`);
    // ⭐ DB 응답 전체 로그는 확인용으로 남겨둡니다.
    console.log('DB 응답 전체:', res.data);

    // 1. 응답 데이터의 result 배열의 첫 번째 요소에 접근
    const wardData = res.data.result && res.data.result.length > 0 ? res.data.result[0] : null;

    if (wardData) {
      // 2. 한글 키 '피보호자번호'를 사용하여 wardId 설정
      // 만약 wardData가 survey 테이블의 정보를 포함한다면 'ward_no' 키를 사용해야 할 수도 있습니다.
      // 하지만 wardsearch 쿼리 결과이므로 '피보호자번호'를 사용합니다.
      wardId.value = wardData['피보호자번호']; // ⭐ 대괄호 표기법으로 한글 키 접근

      survey.value = wardData;
    } else {
      console.error('조회된 피보호자 데이터가 없습니다.');
    }

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
