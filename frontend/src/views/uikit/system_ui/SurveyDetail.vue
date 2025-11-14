<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 1. 라우터 정보 가져오기
import axios from 'axios';

// PrimeVue 컴포넌트들 (표시용)
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import ProgressSpinner from 'primevue/progressspinner';

const route = useRoute(); // 2. 현재 라우트 정보에 접근
const surveyId = route.params.id; // 3. URL의 :id 값을 가져옴 (예: '123')

const basicInfo = ref(null); // 4. 설문지 기본 정보를 담을 ref
const questionList = ref([]); // 5. 설문지 질문 목록을 담을 ref
const loading = ref(true); // 로딩 상태

// 6. 컴포넌트가 마운트(로드)될 때 실행
onMounted(async () => {
  if (!surveyId) {
    console.error('ID가 없습니다.');
    loading.value = false;
    return;
  }

  try {
    // 7. 서버에 특정 ID의 설문지 데이터를 요청합니다.
    //    (백엔드에서 이 API 엔드포인트 /api/system/survey/:id 를 만들어야 함)
    const response = await axios.get(`/api/system/survey/detail/${surveyId}`);

    // 8. 서버가 { basicInfo: {...}, questions: [...] } 형태의 데이터를 보냈다고 가정
    basicInfo.value = response.data.basicInfo;
    questionList.value = response.data.questions;
  } catch (error) {
    console.error('데이터를 불러오는 데 실패했습니다:', error);
  } finally {
    loading.value = false; // 9. 로딩 종료
  }
});

// 날짜 포맷팅 함수 (List 컴포넌트에서 가져옴)
function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return ''; // 유효하지 않은 날짜 방지
  return date.toLocaleDateString('ko-KR', {
    // 한국 스타일로 변경
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <div v-else-if="basicInfo" class="flex flex-col gap-8">
      <Card>
        <template #title>
          <div class="font-semibold text-xl">조사지 기본 정보</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-3">
              <label>조사지명</label>
              <InputText type="text" v-model="basicInfo.inquiry_name" readonly />
            </div>

            <div class="flex flex-col gap-3">
              <label>담당 기관 (작성자)</label>
              <InputText type="text" v-model="basicInfo.inquiry_writer" readonly />
            </div>

            <div class="flex flex-col gap-3">
              <label>상태</label>
              <InputText type="text" v-model="basicInfo.inquiry_status" readonly />
            </div>

            <div class="flex flex-col gap-3">
              <label>최종 수정일</label>
              <InputText type="text" :value="formatDate(basicInfo.updated_at)" readonly />
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="questionList.length > 0">
        <template #title>
          <div class="font-semibold text-xl">질문 목록 (총 {{ questionList.length }}개)</div>
        </template>
        <template #content>
          <div class="flex flex-col gap-6">
            <div
              v-for="(question, index) in questionList"
              :key="question.question_no"
              class="p-4 border rounded-lg"
            >
              <span class="font-medium text-lg w-full mb-3"> 질문 {{ index + 1 }} </span>

              <div class="flex flex-col gap-3 mt-4">
                <label>질문 내용</label>
                <InputText v-model="question.question_content" readonly />
              </div>

              <div class="flex flex-col gap-3 mt-4">
                <label>답변 유형</label>
                <InputText v-model="question.response_type" readonly />
              </div>

              <div class="flex flex-col gap-3 mt-4">
                <label>필수 여부</label>
                <InputText :value="question.is_required ? '필수' : '선택'" readonly />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else>
      <Card>
        <template #title>오류</template>
        <template #content>
          <p>조사지 정보를 불러올 수 없습니다. ID ({{ surveyId }})가 올바른지 확인해주세요.</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* 읽기 전용 InputText가 너무 흐릿하지 않게 스타일 조정 (선택 사항) */
:deep(.p-inputtext:read-only) {
  opacity: 0.8;
  background-color: #f9fafb; /* 살짝 회색 배경 */
}
</style>
