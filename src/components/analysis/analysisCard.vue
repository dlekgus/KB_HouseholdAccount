<template>
  <div class="col-12 col-md-3 mb-3">
    <small class="text-muted">
      총 {{ title }}
      <span :class="diffClass()">
        {{ diffData }}
      </span>
    </small>
    <div class="h5"><AnimatedNumber :value="data" />원</div>
    <div class="small">
      {{
        prevData === 0
          ? '지난 데이터 없음'
          : `지난 ${title} ${prevData.toLocaleString()}원`
      }}
    </div>
  </div>
</template>

<script setup>
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import { computed, ref } from 'vue';

const props = defineProps({
  diffData: String,
  data: Number,
  prevData: Number,
  title: String,
});

const diffClass = () => {
  if (props.diffData === '--%') {
    return 'text-muted';
  }
  const number = parseFloat(props.diffData.replace('%', ''));
  const isPositive = number > 0;

  if (props.title === '수입') {
    return isPositive ? 'text-success' : 'text-danger';
  } else if (props.title === '지출') {
    return isPositive ? 'text-danger' : 'text-success';
  } else {
    return isPositive ? 'text-success' : 'text-danger';
  }
};
</script>
