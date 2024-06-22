<template>
  <div class="form-check-container d-flex align-items-center mb-3">
    <div class="d-flex align-items-center flex-grow-1">
      <div class="form-check form-switch me-3">
        <label class="form-check-label" for="flexSwitchCheckChecked">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            :checked="isDesc"
            @change="toggleSortOrder"
          />
          {{ isDesc ? "최신 순으로 보기" : "오래된 순으로 보기" }}
        </label>
      </div>
      <div class="filter-options d-flex">
        <button
          class="btn btn-outline-secondary"
          :class="{ active: filterOption === 'all' }"
          @click="setFilterOption('all')"
        >
          전체보기
        </button>
        <button
          class="btn btn-outline-secondary"
          :class="{ active: filterOption === 'recent' }"
          @click="setFilterOption('recent')"
        >
          최근 한 달만 보기
        </button>
      </div>
    </div>
    <button
      class="addButton"
      @click="$emit('add-click')"
      style="display: inline-block; margin-left: auto"
    >
      새로운 거래내역 추가
    </button>
  </div>
</template>

<script>
export default {
  name: "FilterOptions",
  props: {
    isDesc: {
      type: Boolean,
      required: true,
    },
    filterOption: {
      type: String,
      required: true,
    },
  },
  methods: {
    toggleSortOrder() {
      this.$emit("toggle-sort-order");
    },
    setFilterOption(option) {
      this.$emit("set-filter-option", option);
    },
  },
};
</script>

<style scoped>
.addButton {
  background-color: #356eff;
  display: inline-block;
  white-space: nowrap;
  margin-left: auto;
}
</style>
