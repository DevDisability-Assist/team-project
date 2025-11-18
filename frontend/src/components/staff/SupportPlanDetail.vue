<script setup>
// This component is now read-only, so interactive components are not needed.

// This component would receive props with the actual data
const props = defineProps({
  item: Object,
});
</script>

<template>
  <div class="support-detail-container">
    <h3 class="detail-title">지원 사유</h3>
    <table class="detail-table">
      <tbody>
        <tr>
          <th>중점 지원 필요</th>
          <td>2년 이내에 지원 필요</td>
          <td class="checkbox-cell">■ 예</td>
          <td class="checkbox-cell">□ 아니오</td>
        </tr>
        <tr>
          <td colspan="4" class="sub-item">실제 문항이 들어갈 자리입니다.</td>
        </tr>
        <tr>
          <th>계획 수립 필요</th>
          <td>지원이 필요한 시점이 2년 이상 5년 미만인 경우</td>
          <td class="checkbox-cell">■ 예</td>
          <td class="checkbox-cell">□ 아니오</td>
        </tr>
        <tr>
          <td colspan="4" class="sub-item nested">
            <p>2년 이상 후에 필요한 지원이 예상됨</p>
            <ul>
              <li>구체적 사유 1</li>
              <li>구체적 사유 2</li>
              <li>구체적 사유 3</li>
            </ul>
            <p>필요시기: 2024년 3월 12일</p>
          </td>
        </tr>
        <tr>
          <th>교통</th>
          <td>처음 요청일자: 2024년 2월 11일</td>
          <td class="checkbox-cell">■ 예</td>
          <td class="checkbox-cell">□ 아니오</td>
        </tr>
        <tr>
          <td colspan="4" class="sub-item">실제 문항이 들어갈 자리입니다.</td>
        </tr>
      </tbody>
    </table>

    <div class="form-section">
      <div class="form-field span-2">
        <label for="project">사업</label>
        <p id="project" class="readonly-field">발달장애인 공공후견지원</p>
      </div>
      <div class="form-field span-2">
        <label for="content">내용</label>
        <p id="content" class="readonly-field textarea-field">
          반려된 지원 계획의 내용(수정 가능함)
        </p>
      </div>
      <div class="form-field">
        <label for="amount">금액</label>
        <p id="amount" class="readonly-field">1,000,000</p>
      </div>
      <div class="form-field">
        <label>첨부</label>
        <div class="attachments readonly-field">
          <span>첨부된 파일01.확장자</span>
          <span>첨부된 파일02.확장자</span>
        </div>
      </div>
    </div>

    <!-- Actions removed as per request -->
  </div>
</template>

<style scoped>
.support-detail-container {
  background-color: #fff8f8; /* Light pink background */
  border: 1px solid #e91e63;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 1rem;
}
.detail-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}
.detail-table th,
.detail-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
  vertical-align: middle;
}
.detail-table th {
  background-color: #fce4ec;
  width: 150px;
}
.checkbox-cell {
  width: 80px;
  text-align: center;
}
.sub-item {
  padding-left: 2rem !important;
  background-color: #fff;
}
.nested {
  padding-left: 4rem !important;
}
.nested ul {
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

/* --- Form Section Layout --- */
.form-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
.form-field {
  display: flex;
  flex-direction: column;
}
.form-field.span-2 {
  grid-column: span 2;
}
.form-field label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
.readonly-field {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.75rem;
  min-height: 40px; /* Match input height */
  width: 100%;
  box-sizing: border-box;
}
.textarea-field {
  min-height: 80px;
}
.attachments span {
  display: block;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
아코디언_배징웃.txt 5KB
