<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Card from 'primevue/card';

const emit = defineEmits(['search']);

const props = defineProps({
  // results 프로퍼티를 외부에서 받을 수 있도록 유지 (없으면 SAMPLE_RESULTS 사용)
  results: { type: Array, default: () => [] },
  initialQuery: { type: String, default: '' },
});

/* 테스트용 하드코딩 샘플 데이터 (thumbnail 필드 제거) */
const SAMPLE_RESULTS = [
  {
    id: 'r1',
    title: '생계비 지원 사업 안내',
    content: '2025년 생계비 지원 사업 상세 안내 및 신청 방법 포함',
    category: '지원 계획',
    url: '#/support/1',
    date: '2025-11-01',
    views: 123,
  },
  {
    id: 'r2',
    title: '발달 장애인 우선 채용 안내',
    content: '우선 채용 공고 및 지원 절차, 관련 서류 안내',
    category: '사이트 메뉴명',
    url: '#/jobs/2',
    date: '2025-10-28',
    views: 98,
  },
  {
    id: 'r3',
    title: '장애인 보조금 신청 가이드',
    content: '보조금 종류별 지원 대상 및 신청 방법 안내',
    category: '자료실',
    url: '#/docs/3',
    date: '2025-09-15',
    views: 210,
  },
  {
    id: 'r4',
    title: '의료비 지원 프로그램(신규)',
    content: '의료비 지원 대상자 범위 및 제출서류 안내',
    category: '지원 계획',
    url: '#/support/4',
    date: '2025-11-05',
    views: 45,
  },
  {
    id: 'r5',
    title: '커뮤니티 공지: 오프라인 모임 안내',
    content: '지역 커뮤니티 참가 안내 및 신청 링크 제공',
    category: '사이트 메뉴명',
    url: '#/community/5',
    date: '2025-10-20',
    views: 76,
  },
  {
    id: 'r6',
    title: '자료실: 지원 서식 모음',
    content: '각종 지원 신청서 양식 및 작성 예시 제공',
    category: '자료실',
    url: '#/docs/6',
    date: '2025-08-30',
    views: 150,
  },
];

const query = ref(props.initialQuery || '');
const selectedCategories = ref(new Set(['지원 계획', '사이트 메뉴명', '자료실'])); // 기본 전체 선택
const sortBy = ref('relevance'); // relevance | recent | popular

/* Pagination / counts (간단) */
// const perPage = ref(10);
const page = ref(1);

/* 결과 원본: props.results 우선, 없으면 SAMPLE_RESULTS 사용 */
const sourceResults = computed(() => {
  if (props.results && props.results.length) return props.results;
  return SAMPLE_RESULTS;
});

/* 필터/검색/정렬 처리 */
function resetFilters() {
  selectedCategories.value = new Set(['지원 계획', '사이트 메뉴명', '자료실']);
}
function toggleCategory(cat) {
  if (selectedCategories.value.has(cat)) selectedCategories.value.delete(cat);
  else selectedCategories.value.add(cat);
}

const filteredResults = computed(() => {
  const q = query.value.trim().toLowerCase();
  const cats = selectedCategories.value;
  let list = sourceResults.value.filter((r) => cats.has(r.category));
  if (q) {
    list = list.filter(
      (r) =>
        (r.title || '').toLowerCase().includes(q) || (r.content || '').toLowerCase().includes(q)
    );
  }
  // 정렬
  if (sortBy.value === 'recent') {
    list = list.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  } else if (sortBy.value === 'popular') {
    list = list.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
  } // relevance는 기본 그대로
  return list;
});

const totalResults = computed(() => filteredResults.value.length);

/* 하이라이트 함수 (검색어 강조) */
function highlightText(text, term) {
  if (!term) return escapeHtml(text);
  const t = String(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(${t})`, 'gi');
  return escapeHtml(text).replace(re, '<strong class="hl">$1</strong>');
}
function escapeHtml(str = '') {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Enter 처리: 부모에 이벤트 emit하고 내부 상태 갱신 */
function submitSearch() {
  page.value = 1;
  emit('search', { term: query.value });
}

/* 플로팅 버튼 동작 */
function doRefresh() {
  submitSearch();
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/* 체크박스 목록 (UI 명세에 따른 카테고리) */
const categories = ['지원 계획', '사이트 메뉴명', '자료실'];

/* 반응형에서 필터를 접을 수 있도록 상태 제공 (모바일) */
const filterCollapsed = ref(false);
function toggleFilterCollapsed() {
  filterCollapsed.value = !filterCollapsed.value;
}
</script>

<template>
  <section class="ts-search-root">
    <!-- 1. Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/" class="crumb">홈</a>
      <span class="sep">›</span>
      <span class="crumb current">통합검색</span>
    </nav>

    <!-- 2. Search bar -->
    <div class="search-row">
      <div class="search-input">
        <InputText v-model="query" placeholder="무엇이 궁금하신가요?" @keyup.enter="submitSearch" />
      </div>
      <div class="search-meta">
        <div class="applied">
          적용된 검색어: '{{ query || '전체' }}' · 검색 결과: {{ totalResults }}
        </div>
      </div>
    </div>

    <!-- 레이아웃: 사이드필터 + 메인결과 -->
    <div class="layout">
      <!-- 사이드 필터 (왼쪽) -->
      <aside class="side-filter" :class="{ collapsed: filterCollapsed }">
        <div class="filter-header">
          <h4>검색 필터</h4>
          <div>
            <button class="reset" @click="resetFilters" title="필터 초기화">⟲</button>
            <button class="collapse" @click="toggleFilterCollapsed" title="접기/펼치기">▾</button>
          </div>
        </div>

        <div class="filter-body" v-show="!filterCollapsed">
          <div class="filter-group">
            <label v-for="cat in categories" :key="cat" class="filter-item">
              <Checkbox
                :model-value="selectedCategories.has(cat)"
                @update:model-value="() => toggleCategory(cat)"
              />
              <span class="label">{{ cat }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- 메인 콘텐츠 -->
      <main class="main-results">
        <!-- 정렬 옵션 (우측 상단) -->
        <div class="sort-row">
          <div class="sort-options">
            <a
              href="#"
              :class="{ active: sortBy === 'relevance' }"
              @click.prevent="sortBy = 'relevance'"
              >관련도순</a
            >
            <a href="#" :class="{ active: sortBy === 'recent' }" @click.prevent="sortBy = 'recent'"
              >최신순</a
            >
            <a
              href="#"
              :class="{ active: sortBy === 'popular' }"
              @click.prevent="sortBy = 'popular'"
              >인기순</a
            >
          </div>
        </div>

        <!-- 결과 그리드 -->
        <div class="results-grid">
          <div v-if="totalResults === 0" class="no-results">검색 결과가 없습니다.</div>

          <div class="grid">
            <Card v-for="item in filteredResults" :key="item.id" class="result-card">
              <template #title>
                <div class="card-title" v-html="highlightText(item.title, query)"></div>
              </template>

              <div class="card-body">
                <!-- 썸네일/이미지 관련 마크업 제거 (요청 반영) -->
                <div class="excerpt" v-html="highlightText(item.content, query)"></div>
              </div>

              <template #footer>
                <div class="card-footer">
                  <div class="meta">
                    <span class="cat">{{ item.category }}</span>
                    <span class="date" v-if="item.date">{{ item.date }}</span>
                  </div>
                  <div class="actions">
                    <Button
                      icon="pi pi-external-link"
                      label="사이트 가기"
                      class="p-button-text"
                      @click="() => (window.location.href = item.url || '#')"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </main>
    </div>

    <!-- 플로팅 버튼들 -->
    <div class="fab-group">
      <button class="fab" title="새로고침" @click="doRefresh">⟲</button>
      <button class="fab" title="위로" @click="scrollToTop">▲</button>
      <button class="fab" title="아래로" @click="scrollToBottom">▼</button>
    </div>
  </section>
</template>

<style scoped>
/* 전체 레이아웃 */
.ts-search-root {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  color: #222;
}

/* 1. Breadcrumb */
.breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
}
.breadcrumb .crumb {
  color: #333;
  text-decoration: none;
}
.breadcrumb .crumb.current {
  color: #666;
  pointer-events: none;
}

/* 2. Search row */
.search-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.search-input {
  flex: 1;
}
.search-input :deep(.p-inputtext) {
  width: 100%;
  padding: 0.6rem 0.75rem;
  box-sizing: border-box;
}
.search-meta .applied {
  color: #666;
  font-size: 0.9rem;
}

/* 레이아웃: 사이드 + 메인 */
.layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.side-filter {
  width: 280px;
  background: #fafafa;
  border: 1px solid #eee;
  padding: 12px;
  border-radius: 8px;
  box-sizing: border-box;
}
.side-filter.collapsed .filter-body {
  display: none;
}
.filter-header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.reset,
.collapse {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.filter-item {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

/* main */
.main-results {
  flex: 1;
  min-width: 0;
}
.sort-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.sort-options a {
  margin-left: 8px;
  color: #666;
  text-decoration: none;
  cursor: pointer;
}
.sort-options a.active {
  font-weight: 700;
  color: #007ad9;
}

/* 결과 그리드: 데스크톱 2열, 모바일 1열 */
.results-grid .grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (max-width: 880px) {
  .results-grid .grid {
    grid-template-columns: 1fr;
  }
}

/* 카드 내부 스타일 (primevue Card 확장) */
.result-card {
  padding: 0;
}
.result-card .p-card-title {
  padding: 12px 16px;
  font-size: 1rem;
  border-bottom: 1px solid #f0f0f0;
}
.card-body {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  align-items: flex-start;
}
.excerpt {
  color: #444;
  font-size: 0.95rem;
}

/* footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px 12px 12px;
  border-top: 1px solid #f2f2f2;
}
.card-footer .meta {
  color: #777;
  font-size: 0.85rem;
}
.actions {
}

/* 하이라이트 */
.hl {
  background: #fffbcc;
  padding: 0 2px;
  border-radius: 2px;
}

/* 플로팅 버튼 그룹 */
.fab-group {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1200;
}
.fab {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #111;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* no results */
.no-results {
  padding: 24px;
  color: #777;
}

/* 반응형: 필터가 상단으로 이동 (모바일) */
@media (max-width: 980px) {
  .layout {
    flex-direction: column;
  }
  .side-filter {
    order: -1;
    width: 100%;
  }
}
</style>
