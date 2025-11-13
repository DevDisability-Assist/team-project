// src/views/uikit/system_ui/RegistSurveyForm.js

import { ref } from 'vue';
import { useRouter } from 'vue-router'; // 👈 1. [추가]
import axios from 'axios'; // 👈 1. [추가]

// 이 함수 자체가 하나의 '훅(hook)' 또는 '기능'이 됩니다.
export function RegistSurveyForm() {
  const router = useRouter(); // 👈 2. [추가]

  // --- 옵션 목록 ---
  const businessItems = ref([
    { name: '사업명 1', code: 'Business 1' },
    { name: '사업명 2', code: 'Business 2' },
  ]);
  const statuses = ref([
    { name: '0', code: ' 0' },
    { name: '1', code: ' 1' },
  ]);
  const responses = ref([
    { name: '서술형', code: 'response 1' },
    { name: 'O/X', code: 'response 2' },
  ]);
  const priorityList = ref([
    { name: '긴급', code: 'priority 1' },
    { name: '중점', code: 'priority 2' },
    { name: '계획', code: 'priority 3' },
  ]);

  // --- 폼 데이터 ---
  const basicInfo = ref({
    surveyName: '',
    businessItem: null,
    status: null,
  });

  const questionList = ref([]);

  // --- 헬퍼 함수 ---
  function createNewQuestion() {
    return {
      id: Date.now(),
      content: '',
      responseType: null,
      required: false,
      priority: null,
    };
  }

  // --- 폼 관리 함수 ---
  function addForm() {
    questionList.value.push(createNewQuestion());
  }

  function removeQuestion(index) {
    if (questionList.value.length > 1) {
      questionList.value.splice(index, 1);
    } else {
      console.warn('최소 1개의 질문이 필요합니다.');
    }
  }

  // --- 저장 함수 ---
  const saveTemp = () => {
    // (임시저장 API가 필요하다면 이 함수도 requestApproval처럼 수정)
    const surveyData = {
      ...basicInfo.value,
      questionList: questionList.value,
    };
    console.log('--- [Composable] 임시 저장 데이터 ---');
    console.log(JSON.stringify(surveyData, null, 2));
    alert('임시저장 (콘솔 확인)');
  };

  // 👇 3. [교체]
  const requestApproval = async () => {
    // 1. 유효성 검사
    if (!basicInfo.value.surveyName) return alert('조사지명을 입력하세요.');
    if (!basicInfo.value.businessItem) return alert('사업명을 선택하세요.');
    if (!basicInfo.value.status) return alert('상태를 선택하세요.');
    if (questionList.value.length === 0 || !questionList.value[0].content) {
      return alert('질문을 1개 이상 입력하세요.');
    }

    // 2. 백엔드로 보낼 데이터 조립
    const surveyData = {
      ...basicInfo.value,
      questionList: questionList.value,
      writer: '관리자', // (임시)
    };

    console.log('--- [Composable] 등록 요청 데이터 ---');
    console.log(JSON.stringify(surveyData, null, 2));

    try {
      // 3. 백엔드 POST API 호출
      const postResponse = await axios.post('/api/system/survey', surveyData);

      // 4. 등록 성공
      alert('조사지가 성공적으로 등록되었습니다!');

      // 5. 목록 페이지로 이동 (라우터 이름 'SurveyList' 가정)
      router.push({ name: 'SurveyList' });
    } catch (err) {
      // 6. 등록 실패
      console.error('등록 실패:', err);
      alert('등록에 실패했습니다: ' + (err.response?.data?.message || err.message));
    }
  };

  // --- 초기화 로직 ---
  function initializeForm() {
    if (questionList.value.length === 0) {
      addForm();
    }
  }

  // 컴포넌트가 사용할 수 있도록 모든 ref와 함수를 return
  return {
    businessItems,
    statuses,
    responses,
    priorityList,
    basicInfo,
    questionList,
    initializeForm,
    addForm,
    removeQuestion,
    saveTemp,
    requestApproval,
  };
}
