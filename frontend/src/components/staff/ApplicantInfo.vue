<script setup>
import { ref } from 'vue';

// 지원자 정보 (예시 데이터)
const applicantInfo = ref({
  이름: '홍길동',
  나이: '25세',
  연락처: '010-1234-5678',
  성별: '남',
  생년월일: '2000-05-12',
  장애유형: '중증',
});
</script>

<template>
  <div class="card p-5 shadow-md rounded-xl bg-white">
    <div class="font-semibold text-xl mb-4">지원자 정보</div>

    <!-- 정보 표시 -->
    <div class="mt-6 grid grid-cols-3 gap-y-4 gap-x-6">
      <div v-for="(value, key) in applicantInfo" :key="key" class="flex flex-col">
        <span class="text-gray-500 text-sm">{{ key }}</span>
        <span class="text-gray-900 font-medium">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
