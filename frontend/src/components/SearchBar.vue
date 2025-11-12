<script setup>
import InputText from 'primevue/inputtext';
import Chip from 'primevue/chip';
// IconField / InputIcon는 전역 또는 상위에서 등록되어 있다고 가정합니다.
</script>

<template>
  <div class="search-bar-container">
    <div class="search-input-wrapper">
      <IconField iconPosition="left" class="max-width-large full-width">
        <InputIcon class="pi pi-search" />
        <InputText type="text" placeholder="무엇이 궁금하신가요?" class="full-width" />
      </IconField>
    </div>

    <!-- Chip들을 입력창 하단으로 이동 -->
    <div class="chip-row">
      <Chip label="#조사지 작성방법" class="mr-2" />
      <Chip label="#피부양자 등록" />
    </div>
  </div>
</template>

<style scoped>
.search-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.max-width-large {
  width: 100%;
  max-width: 900px; /* 확장된 최대 너비, 필요 시 조정 */
}

.full-width {
  width: 100%;
}

.chip-row {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
