<script setup>
import { onBeforeMount, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import Button from 'primevue/button';
import axios from 'axios';

const quickMenus = ref([
  // ... (기존 quickMenus 데이터)
  { icon: 'pi pi-file-text', label: '사업 공고' },
  { icon: 'pi pi-pencil', label: '사업 신청' },
  { icon: 'pi pi-users', label: '피보호자 등록' },
  { icon: 'pi pi-calendar', label: '상담 예약' },
  { icon: 'pi pi-question-circle', label: 'Q&A' },
  { icon: 'pi pi-folder', label: '자료실' },
]);

const expiringNotices = ref([]);
const surveyToUserWard = ref([]);

// --- ADDED ---
// 아코디언 상태 관리를 위한 ref
// null: 모두 닫힘, 숫자: 열린 항목의 survey_no
const selectedSurveyNo = ref(null);
// --- END ADDED ---

const setExpiringNotices = async () => {
  try {
    const res = await axios.get('/api/api/user/user-notices');
    console.log('myResult.data', res.data);
    expiringNotices.value = res.data.result;
  } catch (err) {
    console.log(err);
  }
};
const setSurveyToUserWard = async () => {
  try {
    const res = await axios.get('/api/api/user/userwiter-survey');
    console.log('mySurveyResult.data', res.data);
    surveyToUserWard.value = res.data.result;
  } catch (err) {
    console.log(err);
  }
};

// --- ADDED ---
// 아코디언 토글(열기/닫기) 함수
const toggleAccordion = (surveyNo) => {
  // 이미 열려있는 항목을 다시 클릭하면 닫습니다 (null로 설정).
  if (selectedSurveyNo.value === surveyNo) {
    selectedSurveyNo.value = null;
  } else {
    // 다른 항목을 클릭하면 해당 항목의 surveyNo를 저장하여 엽니다.
    selectedSurveyNo.value = surveyNo;
  }
};
// --- END ADDED ---

onBeforeMount(() => {
  setExpiringNotices();
  setSurveyToUserWard();
});
</script>

<template>
  <div class="dashboard-background">
    <div class="search-bar-wrapper">
      <SearchBar />
    </div>

    <div class="main-content-card">
      <div class="col-12 md:col-9">
        <p>자주 찾는 메뉴</p>
        <div class="Menu_Group">
          <a
            v-for="(menu, idx) in quickMenus"
            :key="idx"
            href="#"
            class="Menu_Item"
            @click.prevent="alert(menu.label + ' 페이지 이동')"
          >
            <div class="Icon_Container">
              <i :class="menu.icon + ' menu-icon'" aria-hidden="true"></i>
            </div>
            <p class="Menu_Text">{{ menu.label }}</p>
          </a>
        </div>
      </div>

      <div class="support-header-row">
        <h5 class="section-title section-title--left">마감 임박 지원 / 보조금</h5>
        <div class="support-header-row-right">
          <h5 class="section-title section-title--right">내 지원 현황</h5>
          <Button icon="pi pi-plus" class="p-button-rounded p-button-text" />
        </div>
      </div>

      <div class="support-sections-row">
        <div class="support-column">
          <div v-for="item in expiringNotices" :key="item.notice_no" class="support-item">
            <h6>{{ item.business_name }}</h6>
            <p>{{ item.content }} ({{ item.business_end + ' 마감' }})</p>
          </div>
        </div>

        <div class="support-column">
          <div
            v-for="item in surveyToUserWard"
            :key="item.survey_no"
            class="accordion-item-wrapper"
          >
            <div
              class="support-status-item"
              @click="toggleAccordion(item.survey_no)"
              :class="{ 'item-open': selectedSurveyNo === item.survey_no }"
            >
              <span>{{ item.business_name }}</span>
              <span class="date">{{ item.updated_at }}</span>

              <i
                :class="[
                  'pi',
                  selectedSurveyNo === item.survey_no ? 'pi-chevron-up' : 'pi-chevron-down',
                ]"
                class="accordion-icon"
              ></i>
            </div>

            <transition name="accordion-slide">
              <div v-if="selectedSurveyNo === item.survey_no" class="accordion-panel">
                <p><strong>상세 정보</strong></p>
                <p>
                  이곳에 {{ item.business_name }} (설문번호: {{ item.survey_no }})에 대한 상세
                  내용을 표시합니다.
                </p>
                <p>(예: item.content 또는 item.details 필드)</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (기존 스타일 상단 ... ) */
.dashboard-background {
  background-color: #f8f9fa;
  padding: 2rem;
  min-height: 100vh;
}
.main-content-card {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  max-width: 1200px;
  margin: 0 auto;
}
.support-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.25rem 0 0.75rem 0;
  flex-wrap: nowrap;
  --support-left-width: 30vw;
  --support-right-width: 40vw;
}
.section-title--left {
  margin: 0;
  flex: 0 0 var(--support-left-width);
  max-width: var(--support-left-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.support-header-row-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.section-title--right {
  margin: 0;
  flex: 0 0 var(--support-right-width);
  max-width: var(--support-right-width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.search-bar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.support-sections-row {
  border-spacing: 1px;
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.support-column {
  flex: 1 1 48%;
  min-width: 280px;
  box-sizing: border-box;
  border: 1px solid #000;
  border-radius: 10px;
  padding: 0.75rem;
}
.Menu_Group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.Menu_Item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  text-decoration: none;
  color: inherit;
}
.Icon_Container {
  width: 80px;
  height: 80px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.menu-icon {
  font-size: 2rem;
}
.support-item {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.support-item h6 {
  margin: 0 0 0.5rem 0;
}
.support-item p {
  margin: 0;
  color: #6b6b6b;
}
/* (... 기존 스타일 끝) */

/* --- MODIFIED ---
  .support-status-item (아코디언 헤더) 스타일 수정
  - cursor: pointer 추가 (클릭 가능 표시)
  - align-items: center 추가 (아이콘 수직 정렬)
  - padding-right 수정 (아이콘 공간 확보)
  - transition 추가 (부드러운 호버 효과)
*/
.support-status-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 아이콘 수직 정렬 */
  padding: 0.75rem 0.5rem; /* 좌우 여백 수정 */
  border-bottom: 1px solid #e6e6e6;
  cursor: pointer; /* 클릭 가능하도록 커서 변경 */
  transition: background-color 0.2s ease;
}

/* (선택 사항) 호버 및 열린 상태 스타일 */
.support-status-item:hover {
  background-color: #f9f9f9;
}
.support-status-item.item-open {
  background-color: #f5f5f5;
  font-weight: 600; /* 500 또는 bold */
}

/* --- MODIFIED ---
  :last-child 규칙을 'accordion-item-wrapper' 기준으로 변경합니다.
  '열리지 않은' 마지막 항목의 헤더만 하단 테두리를 제거합니다.
*/
.accordion-item-wrapper:last-child .support-status-item:not(.item-open) {
  border-bottom: none;
}

.support-status-item .date {
  color: #6b6b6b;
}

/* --- ADDED --- (아코디언 아이콘 스타일) */
.accordion-icon {
  margin-left: 0.75rem;
  color: #888;
  font-size: 0.9rem;
}

/* --- ADDED --- (아코디언 패널 스타일) */
.accordion-panel {
  padding: 1rem 1.25rem; /* 헤더보다 좀 더 안쪽으로 */
  background-color: #fdfdfd; /* 헤더와 약간 다른 배경색 */
  border-bottom: 1px solid #e6e6e6;
  /* 트랜지션을 위해 overflow: hidden이 필수입니다. */
  overflow: hidden;
  color: #333;
}
.accordion-panel p {
  margin: 0.5rem 0;
}

/* 마지막 아이템의 패널은 하단 테두리 제거 */
.accordion-item-wrapper:last-child .accordion-panel {
  border-bottom: none;
}

/* --- ADDED ---
  Vue <transition>을 위한 CSS (name="accordion-slide"와 일치)
  max-height를 이용한 부드러운 슬라이드 효과입니다.
*/
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.3s ease-out;
  /* 주의: 이 값은 패널 콘텐츠의 최대 예상 높이보다 커야 합니다.
    콘텐츠가 더 길어질 수 있다면 200px, 300px 등으로 넉넉하게 잡으세요.
  */
  max-height: 150px;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
  /* 닫힐 때 패딩과 마진이 0이 되도록 하여 더 부드럽게 만듭니다. */
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
}
/* --- END ADDED --- */

/* (기존 반응형 @media 스타일 ... ) */
@media (max-width: 992px) {
  .support-header-row {
    flex-wrap: wrap;
    --support-left-width: 100%;
    --support-right-width: 100%;
    gap: 0.5rem;
  }
  .section-title--left,
  .section-title--right {
    flex: 0 0 100%;
    max-width: 100%;
    text-align: left;
  }
  .support-header-row-right {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .support-column {
    flex-basis: 100%;
  }
}
</style>
