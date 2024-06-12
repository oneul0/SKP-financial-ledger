<template>
  <div class="input-comp">
    <label>
      날짜:
      <input type="date" v-model="date" />
    </label>
    <label>
      수입/지출:
      <select v-model="type">
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
    </label>
    <label>
      카테고리:
      <select v-model="category">
        <option value="etc">기타</option>
        <option value="allowance">용돈</option>
        <option value="salary">근로소득</option>
        <option value="fIncome">금융소득</option>
        <option value="shopping">쇼핑</option>
        <option value="medical">의료/건강</option>
        <option value="charge">교통/통신</option>
        <option value="food">식비</option>
        <option value="fOutcome">금융</option>
      </select>
    </label>
    <label>
      금액:
      <input
        type="text"
        v-model="formattedAmount"
        @input="formatAmount"
        placeholder="금액을 입력하세요"
      />
    </label>
    <label>
      메모:
      <input type="text" v-model="note" />
    </label>
    <div class="buttons">
      <button @click="submit">{{ isEditing ? "수정" : "추가" }}</button>
      <button @click="cancel">취소</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["entry"],
  data() {
    return {
      date: this.entry?.date || new Date().toISOString().split("T")[0],
      type: this.entry?.type || "income",
      category: this.entry?.category || "etc",
      amount: this.entry?.amount || 0,
      note: this.entry?.note || "",
      isEditing: !!this.entry,
    };
  },
  computed: {
    formattedAmount: {
      get() {
        return this.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      set(value) {
        this.amount = parseInt(value.replace(/,/g, "")) || 0;
      },
    },
  },
  methods: {
    submit() {
      this.$emit("add-entry", {
        ...this.entry,
        date: this.date,
        type: this.type,
        category: this.category,
        amount: this.amount,
        note: this.note,
      });
      this.resetForm();
    },
    cancel() {
      this.$emit("cancel");
    },
    resetForm() {
      this.date = new Date().toISOString().split("T")[0];
      this.type = "income";
      this.category = "etc";
      this.amount = 0;
      this.note = "";
    },
    formatAmount() {
      this.formattedAmount = this.formattedAmount; // This triggers the computed setter
    },
  },
};
</script>

<style scoped>
.input-comp {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 10px;
}
input,
select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
}
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
button {
  flex: 1;
  padding: 10px 0;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
button:nth-child(2) {
  background-color: #6c757d;
}
</style>
