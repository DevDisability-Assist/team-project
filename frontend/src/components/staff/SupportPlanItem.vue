<script setup>
import { computed } from 'vue';
import SupportPlanDetail from './SupportPlanDetail.vue';

const props = defineProps({
  item: Object,
  isActive: Boolean,
  allowMultiple: Boolean,
});

const emit = defineEmits(['toggle-detail']);

// 우선순위 색상
const priorityColor = computed(() => {
  if (props.item.priority === '긴급') return 'bg-red-500';
  if (props.item.priority === '중점') return 'bg-yellow-500';
  return 'bg-green-500'; // 준비
});

// 상세 토글
const handleButtonClick = () => {
  emit('toggle-detail', props.item.support_plan_no);
};
</script>

<template>
  <div class="w-full bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
    <!-- 제목 / 작성자 -->
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ props.item.title || '' }}
          <span class="text-gray-500 text-base ml-2">{{ props.item.createdAt || '' }}</span>
        </h2>
        <p class="text-gray-500 text-base mt-1">작성자: {{ props.item.writer || '' }}</p>
      </div>
      <button class="px-4 py-2 text-base border rounded-lg hover:bg-gray-100">담당자</button>
    </div>

    <!-- 우선순위 / 요청일 / 자세히보기 -->
    <div class="flex justify-between items-center mt-6">
      <span :class="`px-3 py-1 text-white rounded-lg text-base ${priorityColor}`">
        {{ props.item.priority || '' }}
      </span>

      <div class="flex items-center gap-4">
        <span class="text-gray-600 text-base font-semibold">
          요청일: {{ props.item.requestDate || '-' }}
        </span>
        <button
          @click="handleButtonClick"
          class="px-4 py-2 border rounded-lg text-base hover:bg-gray-100"
        >
          자세히보기
        </button>
      </div>
    </div>

    <!-- 아코디언 상세 정보 -->
    <div v-if="props.isActive">
      <SupportPlanDetail :item="props.item" />
    </div>
  </div>
</template>
