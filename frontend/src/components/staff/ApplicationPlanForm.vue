<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import axios from 'axios';

// 전역 고유 id 카운터
let formId = 0;

// 폼 초기화 함수
const createForm = () => ({
  id: formId++,
  writer: '', // 목표
  manager: '', // 담당자
  dropdownItem: null, // 사업선택
  amount: '', // 금액
  content: '', // 내용
  selectedFiles: [], // pdf파일
  priority: null, // 우선순위
});

// 폼 배열
const forms = ref([createForm()]);

// 드롭다운 항목
const dropdownItems = ref([
  { name: '1번 사업', code: 'Option 1' },
  { name: '2번 사업', code: 'Option 2' },
  { name: '3번 사업', code: 'Option 3' },
  { name: '4번 사업', code: 'Option 4' },
  { name: '5번 사업', code: 'Option 5' },
  { name: '6번 사업', code: 'Option 6' },
]);

// 우선순위 선택지
const priority = ref([
  { name: '긴급', code: 1 },
  { name: '중점', code: 2 },
  { name: '반려', code: 3 },
]);

// 금액 3자리 콤마
const formatAmount = (form) => {
  const onlyNums = form.amount.replace(/[^0-9]/g, '');
  form.amount = onlyNums ? Number(onlyNums).toLocaleString() : '';
};

// 파일 선택
const handleFiles = (event, form) => {
  form.selectedFiles = Array.from(event.target.files);
};

// 승인요청 버튼 클릭 → 해당 폼 값만 서버로 전송
const requestApproval = async (form) => {
  // 필수값 체크
  if (!form.writer || !form.dropdownItem || !form.content || !form.priority) {
    alert('필수 항목(목표, 사업, 내용, 우선순위)을 모두 입력해주세요.');
    return;
  }

  try {
    const payload = {
      priority_no: form.priority.code,
      support_plan_goal: form.writer,
      business_name: form.dropdownItem.name,
      spend: parseInt(form.amount.replace(/,/g, '')) || 0,
      plan: form.content,
      file_no: form.selectedFiles.length ? form.selectedFiles.map((f) => f.name).join(',') : null,
      support_plan_status: '승인대기', // 서버 ENUM에 맞춤
    };

    await axios.post('/api/staff/support-plan', payload);
    alert(`폼 ${form.id} 승인요청 완료!`);

    // 전송 후 폼 초기화
    forms.value = [createForm()];
  } catch (err) {
    console.error('승인요청 오류:', err.response?.data || err);
    alert('승인요청 실패. 서버 로그를 확인하세요.');
  }
};

// 버튼 동작
const saveTemp = (form) => alert(`폼 ${form.id} 임시저장 완료!`);
const deleteForm = (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    forms.value = forms.value.filter((f) => f.id !== id);
  }
};
const addForm = () => forms.value.push(createForm());
</script>

<template>
  <div class="md:1">
    <Fluid>
      <div v-for="form in forms" :key="form.id" class="flex mt-8">
        <div class="card flex flex-col gap-4 w-full border p-4 rounded-md shadow-sm">
          <!-- 작성자 / 담당자 -->
          <div class="flex flex-col md:flex-row gap-2">
            <div class="flex flex-wrap gap-2 w-full">
              <label>우선순위</label>
              <Select
                v-model="form.priority"
                :options="priority"
                optionLabel="name"
                placeholder="우선순위"
                class="w-full"
              />
            </div>
            <div class="flex flex-wrap gap-2 w-full">
              <label>목표</label>
              <InputText v-model="form.writer" type="text" />
            </div>
          </div>

          <!-- 지원계획 / 금액 -->
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex flex-wrap gap-2 w-full">
              <label>지원계획</label>
              <Select
                v-model="form.dropdownItem"
                :options="dropdownItems"
                optionLabel="name"
                placeholder="Select One"
                class="w-full"
              />
              <label>예상지원금액</label>
              <InputText
                v-model="form.amount"
                type="text"
                class="text-right"
                placeholder="예: 50,000"
                @input="formatAmount(form)"
              />
            </div>
          </div>

          <!-- 내용 -->
          <div class="flex flex-wrap">
            <label>내용</label>
            <Textarea v-model="form.content" rows="4" />
          </div>

          <!-- PDF 업로드 -->
          <div class="mt-6 border-t pt-4">
            <h6>PDF 업로드</h6>
            <form class="flex flex-col gap-2">
              <input
                :key="form.id"
                type="file"
                name="pdfFiles"
                accept=".pdf"
                multiple
                class="border p-2 rounded"
                @change="(e) => handleFiles(e, form)"
              />
              <ul v-if="form.selectedFiles.length" class="list-disc ml-5 text-sm text-gray-600">
                <li v-for="(file, idx) in form.selectedFiles" :key="idx">{{ file.name }}</li>
              </ul>
            </form>
          </div>

          <!-- 하단 버튼 -->
          <div class="flex justify-end gap-3 mt-6 border-t pt-4">
            <Button
              label="임시저장"
              icon="pi pi-save"
              severity="secondary"
              @click="() => saveTemp(form)"
            />
            <Button
              label="삭제"
              icon="pi pi-trash"
              severity="danger"
              @click="() => deleteForm(form.id)"
            />
            <Button
              label="승인요청"
              icon="pi pi-send"
              severity="success"
              @click="() => requestApproval(form)"
            />
          </div>
        </div>
      </div>

      <!-- 추가 버튼 -->
      <div class="flex justify-end mt-4">
        <Button label="추가" icon="pi pi-plus" severity="info" @click="addForm" />
      </div>
    </Fluid>
  </div>
</template>
