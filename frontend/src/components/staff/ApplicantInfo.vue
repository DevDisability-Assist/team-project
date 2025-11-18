<script setup>
import { defineProps, ref, watch } from 'vue';
import axios from 'axios';

// Prop 정의: 외부에서 ward-id(ward_no)를 받습니다.
const props = defineProps({
  wardId: {
    type: [String, Number],
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
});

// 데이터 로딩 상태
const isLoading = ref(false);

/**
 * wardId를 사용하여 백엔드에서 지원자 상세 정보를 조회합니다.
 */
const fetchApplicantData = async (id) => {
  if (!id) {
    console.log('fetchApplicantData: wardId가 아직 없습니다.');
    return;
  }

  console.log('ApplicantInfo: wardId 변경 감지, 데이터 조회 시작 ->', id);
  isLoading.value = true;
  try {
    // ward_no(id)를 사용하여 피보호자 정보 조회
    const response = await axios.get(`/api/staff/${id}`);

    console.log('ApplicantInfo API 응답 전체:', response.data); // ⭐ 핵심 수정: API 응답 구조에 유연하게 대응 (result 배열 또는 data 자체 배열)

    const resultData = response.data.result || response.data; // resultData가 배열이고, 최소한 하나의 요소가 있을 때 첫 번째 요소를 사용
    const data = Array.isArray(resultData) && resultData.length > 0 ? resultData[0] : null;

    if (data) {
      console.log('ApplicantInfo: 조회 성공, 데이터:', data);

      applicantData.value = {
        // ⭐ DB 조회 결과가 한글 별칭이므로 대괄호 표기법 사용
        이름: data['이름'] || '정보 없음',
        나이: data['나이'] ? `${data['나이']}세` : '정보 없음',
        성별: data['성별'] || '정보 없음',
        생년월일: data['생년월일'] || '정보 없음',
        장애유형: data['장애유형'] || '없음',
        주소: data['주소'] || '정보 없음',
      };
    } else {
      // 데이터가 비어있을 경우 (조회 조건 불일치 등)
      console.warn('ApplicantInfo: 조회된 지원자 정보가 없습니다. ID:', id);
      applicantData.value = {
        이름: '정보 없음',
        나이: '정보 없음',
        성별: '정보 없음',
        생년월일: '정보 없음',
        장애유형: '없음',
        주소: '정보 없음',
      };
    }
  } catch (error) {
    console.error('지원자 정보 조회 오류:', error); // 오류 발생 시에도 데이터 없음 상태로 초기화
    applicantData.value = {
      이름: '오류',
      나이: '오류',
      성별: '오류',
      생년월일: '오류',
      장애유형: '오류',
      주소: '오류',
    };
  } finally {
    isLoading.value = false;
  }
};

// props.wardId 값이 변경될 때마다 함수 실행
watch(
  () => props.wardId,
  (newWardId, oldWardId) => {
    console.log('ApplicantInfo: wardId prop 변경됨', { old: oldWardId, new: newWardId });
    if (newWardId) {
      fetchApplicantData(newWardId);
    }
  }
);
</script>

<template>
  <div
    class="card p-3 shadow-xl rounded-xl bg-white border border-gray-100 transition duration-300 hover:shadow-2xl"
  >
    <div class="text-lg mb-3 text-indigo-700 border-b pb-2">지원자 상세 정보</div>

    <div v-if="isLoading" class="text-center p-6 text-indigo-500">
      데이터를 불러오는 중입니다...
    </div>

    <div v-else-if="!props.wardId" class="text-center p-6 text-gray-500">
      상위 데이터 로드 대기 중...
    </div>

    <div v-else class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4">
      <div
        v-for="(value, key) in applicantData"
        :key="key"
        class="flex flex-col p-2 bg-gray-50 rounded-lg border border-gray-200"
      >
        <span class="text-gray-600 font-bold text-xs uppercase tracking-wider mb-0.5">{{
          key
        }}</span>
        <span class="text-gray-800 text-xs break-words">{{ value }}</span>
      </div>
    </div>
  </div>
</template>
