<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: String,
  writer: String,
  createdAt: String,
  requestDate: String,
  priority: [String, Number],
  status: String,
});

// 우선순위에 따른 색상 예시
const priorityColor = computed(() => {
  if (props.priority === 1) return 'bg-red-500';
  if (props.priority === 2) return 'bg-yellow-500';
  return 'bg-green-500';
});
</script>

<template>
  <div class="w-full bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ title }}
          <span class="text-gray-500 text-base ml-2">{{ createdAt }}</span>
        </h2>
        <p class="text-gray-500 text-base mt-1">담당자: {{ writer }}</p>
      </div>

      <button class="px-4 py-2 text-base border rounded-lg hover:bg-gray-100">담당자</button>
    </div>

    <div class="flex justify-between items-center mt-6">
      <span :class="`px-3 py-1 text-white rounded-lg text-base ${priorityColor}`">
        {{ priority }}
      </span>

      <div class="flex items-center gap-4">
        <span class="text-gray-600 text-base font-semibold"> 요청일: {{ requestDate }} </span>
        <button class="px-4 py-2 border rounded-lg text-base hover:bg-gray-100">자세히보기</button>
      </div>
    </div>
  </div>
</template>
