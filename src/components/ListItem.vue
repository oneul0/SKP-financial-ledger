<template>
  <div
    :class="[
      'list-item',
      transaction.type === 'income' ? 'income-border' : 'expense-border',
    ]"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="top-row">
      <p>{{ transaction.date }} [{{ translate[transaction.category] }}]</p>
    </div>
    <div class="bottom-row">
      <p class="memo">{{ transaction.memo }}</p>
      <p
        :class="[
          'amount',
          transaction.type === 'income' ? 'income' : 'expense',
        ]"
      >
        {{ transaction.type === "income" ? "+" : "-" }}{{ transaction.amount }}
      </p>
    </div>
    <div v-if="isHovered" class="action-buttons">
      <button @click="editTransaction">수정</button>
      <button @click="deleteTransaction">삭제</button>
    </div>
  </div>
</template>

<script>
const translate = {
  eetc: "기타",
  ietc: "기타",
  allowance: "용돈",
  salary: "근로소득",
  fIncome: "금융소득",
  shopping: "쇼핑",
  medical: "의료/건강",
  charge: "교통/통신",
  food: "식비",
  fOutcome: "금융",
};

export default {
  name: "ListItem",
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      translate,
      isHovered: false,
    };
  },
  methods: {
    editTransaction() {
      this.$emit("edit-transaction", this.transaction);
    },
    deleteTransaction() {
      this.$emit("delete-transaction", this.transaction);
    },
  },
};
</script>

<style scoped>
.list-item {
  position: relative; /* 상대 위치 설정 */
  border: 1px solid blanchedalmond;
  padding: 10px;
  margin: 10px 20px;
  border-right-width: 10px; /* 오른쪽 테두리를 더 두껍게 표시 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 테두리 그림자 효과 */
}

.income-border {
  border-right-color: green; /* 수입일 경우 초록색 테두리 */
}

.expense-border {
  border-right-color: red; /* 지출일 경우 빨간색 테두리 */
}

.top-row,
.bottom-row {
  display: flex;
  justify-content: space-between;
}
.top-row {
  color: gray;
}
.memo {
  font-size: 1.2em;
  font-weight: bold;
  margin-right: auto;
  padding-left: 20px;
  margin-top: auto;
}

.amount {
  font-size: 1.5em;
  font-weight: bold;
}

.income {
  color: green;
}

.expense {
  color: red;
}

.action-buttons {
  position: absolute; /* 절대 위치 설정 */
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.action-buttons button {
  background-color: #9f9f9f;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.action-buttons button:hover {
  background-color: #000000;
}
</style>
