<script setup>
import { defineProps } from 'vue';
import { ref } from 'vue'; // ref는 props 외의 내부 상태 관리가 필요할 경우를 대비하여 유지할 수 있지만, 여기서는 불필요하므로 제거해도 무방합니다. (일단 유지)

// Prop 정의: 외부에서 applicantData 객체를 받습니다.
const props = defineProps({
  applicantData: {
    type: Object,
    required: true,
    // 데이터가 주어지지 않았을 때의 기본값 (예시)
    default: () => ({
      이름: '정보 없음',
      나이: '정보 없음',
      연락처: '정보 없음',
      성별: '정보 없음',
      생년월일: '정보 없음',
      장애유형: '정보 없음',
    }),
  },
});

// 참고: 실제 사용 시에는 부모 컴포넌트에서 다음과 같이 데이터를 전달해야 합니다.
/*
const myExternalData = {
  이름: '김영희',
  나이: '30세',
  연락처: '010-9876-5432',
  성별: '여',
  생년월일: '1995-01-20',
  장애유형: '경증',
};
<ApplicantInfoDisplay :applicant-data="myExternalData" />
*/
</script>

<template>
  <!-- applicantData prop을 사용하도록 수정 -->
  <div
    class="card p-5 shadow-xl rounded-xl bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
  >
    <div class="font-bold text-2xl mb-6 text-indigo-700 border-b pb-2">지원자 상세 정보</div>

    <!-- 정보 표시 -->
    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-6 gap-x-8">
      <!-- props.applicantData를 순회하며 정보를 표시합니다. -->
      <div
        v-for="(value, key) in props.applicantData"
        :key="key"
        class="flex flex-col p-3 bg-indigo-50 rounded-lg"
      >
        <span class="text-indigo-500 font-semibold text-xs uppercase tracking-wider mb-1">{{
          key
        }}</span>
        <span class="text-gray-800 text-lg font-extrabold break-words">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
