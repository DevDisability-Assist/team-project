<script setup>
// ⭐ onMounted 대신 watch를 import 합니다.
import { defineProps, ref, watch } from 'vue';
import axios from 'axios'; // 🚨 Axios import

// Prop 정의: 외부에서 ward-id(ward_no)를 받습니다.
const props = defineProps({
  wardId: {
    type: [String, Number],
    // required: true -> 초기값이 null일 수 있으므로 false로 변경하거나 제거
    default: null,
  },
});

// 조회된 지원자 데이터를 저장할 반응형 상태
const applicantData = ref({
  피보호자이름: '...',
  나이: '...',
  성별: '...',
  생년월일: '...',
  장애유형: '...',
  주소: '...',
  보호자이름: '...',
  보호자관계: '...',
});

// 데이터 로딩 상태
const isLoading = ref(false); // 초기값은 false로 변경

/**
 * wardId를 사용하여 백엔드에서 지원자 상세 정보를 조회합니다.
 */
const fetchApplicantData = async (id) => {
  // ⭐ id가 유효하지 않으면 함수 실행 중단
  if (!id) {
    console.log('fetchApplicantData: wardId가 아직 없습니다.');
    return;
  }

  console.log('ApplicantInfo: wardId 변경 감지, 데이터 조회 시작 ->', id);
  isLoading.value = true;
  try {
    // 🚨 Axios 호출: props.wardId 대신 전달받은 id 파라미터 사용
    const response = await axios.get(`/api/staff/${id}`);

    const data = response.data && response.data.length > 0 ? response.data[0] : null;

    if (data) {
      applicantData.value = {
        이름: data['이름'] || '정보 없음',
        나이: data['나이'] ? `${data['나이']}세` : '정보 없음',
        성별: data['성별'] || '정보 없음',
        생년월일: data['생년월일'] || '정보 없음',
        장애유형: data['장애유형'] || '없음',
        보호자이름: data['보호자이름'] || '정보 없음',
        보호자관계: data['보호자관계'] || '정보 없음',
        주소: data['주소'] || '정보 없음',
      };
    } else {
      // ... (데이터 없는 경우 처리)
    }
  } catch (error) {
    console.error('지원자 정보 조회 오류:', error);
    // ... (오류 처리)
  } finally {
    isLoading.value = false;
  }
};

// ⭐ 수정된 부분: onMounted 대신 watch 사용
// props.wardId 값이 변경될 때마다 이 함수가 실행됩니다.
watch(
  () => props.wardId,
  (newWardId, oldWardId) => {
    console.log('ApplicantInfo: wardId prop 변경됨', { old: oldWardId, new: newWardId });
    // newWardId가 유효한 값일 때만(null이나 undefined가 아닐 때) fetch 함수 호출
    if (newWardId) {
      fetchApplicantData(newWardId);
    }
  },
  {
    // immediate: true // 만약 컴포넌트 마운트 시점에 wardId가 이미 있어도 즉시 실행
    // 여기서는 부모가 비동기로 가져오므로 immediate는 불필요할 수 있습니다.
  }
);

/*
// 기존 onMounted 코드는 제거되거나 주석 처리됩니다.
onMounted(() => {
  if (props.wardId) {
    fetchApplicantData();
  } else {
    isLoading.value = false;
    console.warn('wardId prop이 전달되지 않았습니다.');
  }
});
*/
</script>

<template>
  <div
    class="card p-5 shadow-xl rounded-xl bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
  >
    <div class="font-bold text-2xl mb-6 text-indigo-700 border-b pb-2">지원자 상세 정보</div>

    <div v-if="isLoading" class="text-center p-8 text-indigo-500 font-semibold">
      데이터를 불러오는 중입니다...
    </div>
    <!-- ⭐ v-else-if 추가: 로딩중도 아니고, ID도 없으면 대기 메시지 표시 -->
    <div v-else-if="!props.wardId" class="text-center p-8 text-gray-500 font-medium">
      상위 데이터 로드 대기 중...
    </div>
    <div
      v-else
      class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-6 gap-x-8"
    >
      <div
        v-for="(value, key) in applicantData"
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
