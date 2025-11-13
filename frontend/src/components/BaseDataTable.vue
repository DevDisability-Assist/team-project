<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Props 정의
defineProps({
  // 테이블에 표시될 데이터 배열
  data: {
    type: Array,
    required: true,
  },
  // 컬럼 설정 배열
  columns: {
    type: Array,
    required: true,
  },
  // 로딩 상태
  loading: {
    type: Boolean,
    default: false,
  },
  // 한 페이지에 표시될 행 수
  rows: {
    type: Number,
    default: 10,
  },
});
</script>

<template>
  <DataTable :value="data" :loading="loading" :paginator="true" :rows="rows" :rowHover="true" showGridlines>
    <template #empty>
      표시할 데이터가 없습니다.
    </template>
    <template #loading>
      데이터를 불러오는 중입니다. 잠시만 기다려주세요.
    </template>

    <!-- columns prop을 기반으로 컬럼을 동적으로 생성 -->
    <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" :style="col.style">
      <!-- 
        각 컬럼의 body를 커스터마이징하기 위한 스코프 슬롯입니다.
        슬롯 이름은 'body-{field}' 형식으로 지정됩니다. (예: <template #body-status="{ data }">)
        부모 컴포넌트에서 이 슬롯을 정의하면 해당 컬럼의 내용이 대체됩니다.
      -->
      <template #body="slotProps">
        <slot :name="`body-${col.field}`" :data="slotProps.data">
          <!-- 슬롯이 제공되지 않을 경우, 기본적으로 필드 데이터를 표시합니다. -->
          {{ slotProps.data[col.field] }}
        </slot>
      </template>
    </Column>
  </DataTable>
</template>
