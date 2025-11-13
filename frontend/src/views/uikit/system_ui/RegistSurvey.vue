<script setup>
import { onBeforeMount } from 'vue';
// 1. 방금 만든 Composable을 import 합니다.
import { RegistSurveyForm } from './RegistSurveyForm.js'; // (경로 확인)

// 2. Composable을 호출하여 필요한 모든 것을 "구조 분해 할당"으로 가져옵니다.
const {
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
} = RegistSurveyForm();

// 3. 컴포넌트 생명주기 훅에서 초기화 함수를 호출합니다.
onBeforeMount(() => {
  initializeForm();
});

// <script setup> 끝! 매우 깔끔해졌습니다.
</script>

<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="md:w-1/2 flex flex-col gap-8">
        <div class="card flex flex-col gap-6">
          <div class="font-semibold text-xl">조사지 기본 정보</div>

          <div class="flex flex-col gap-3">
            <label for="name1">조사지명</label>
            <InputText id="name1" type="text" v-model="basicInfo.surveyName" />
          </div>

          <div class="flex flex-col gap-3">
            <label for="businessName">사업명</label>
            <Select
              id="businessName"
              v-model="basicInfo.businessItem"
              :options="businessItems"
              optionLabel="name"
              placeholder="미선택"
              class="w-full"
            ></Select>
          </div>

          <div class="flex flex-col gap-3">
            <label for="surveyStatus">상태</label>
            <Select
              id="surveyStatus"
              v-model="basicInfo.status"
              :options="statuses"
              optionLabel="name"
              placeholder="미선택"
              class="w-full"
            ></Select>
          </div>
        </div>

        <div class="card flex flex-col gap-6">
          <div class="font-semibold text-xl">질문목록</div>

          <div
            v-for="(question, index) in questionList"
            :key="question.id"
            class="flex-col gap-4 p-4 border rounded-lg relative"
          >
            <span class="font-medium text-lg w-full flex justify-between items-center mb-3">
              질문 {{ index + 1 }}

              <Button
                icon="pi pi-times"
                severity="danger"
                text
                rounded
                @click="removeQuestion(index)"
                v-if="questionList.length > 1"
              />
            </span>

            <div class="flex flex-col grow basis-0 gap-3">
              <label :for="'questionContent-' + index">질문내용</label>
              <InputText
                v-model="question.content"
                :id="'questionContent-' + index"
                type="text"
                placeholder="질문 내용을 입력하세요."
              />
            </div>

            <div class="flex flex-wrap grow basis-0 gap-3 mt-4">
              <label :for="'responseType-' + index">답변유형</label>
              <Select
                :id="'responseType-' + index"
                v-model="question.responseType"
                :options="responses"
                optionLabel="name"
                placeholder="유형을 선택하세요"
                class="w-full"
              ></Select>

              <div class="flex items-center gap-2">
                <Checkbox
                  v-model="question.required"
                  :inputId="'essential-' + index"
                  :binary="true"
                />
                <label :for="'essential-' + index">필수 여부</label>
              </div>
            </div>

            <div class="flex flex-wrap grow basis-0 gap-3 mt-4">
              <label :for="'priority-' + index">우선 순위</label>
              <Select
                :id="'priority-' + index"
                v-model="question.priority"
                :options="priorityList"
                optionLabel="name"
                placeholder="우선 순위를 선택하세요"
                class="w-full"
              ></Select>
            </div>
          </div>

          <div class="flex justify-center mt-6">
            <Button label="질문 추가" icon="pi pi-plus" severity="info" @click="addForm" outlined />
          </div>

          <div class="flex justify-center gap-4 mt-4">
            <Button label="임시저장" icon="pi pi-save" severity="secondary" @click="saveTemp" />
            <Button label="등록" icon="pi pi-send" severity="info" @click="requestApproval" />
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<style lang="scss" scoped></style>
