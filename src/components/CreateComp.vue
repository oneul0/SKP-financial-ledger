<template>
  <div v-if="isVisible" class="modal" @click.self="close">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <div class="input-comp">
        <label>
          날짜:
          <input type="date" v-model="entryDate" />
        </label>
        <label>
          수입/지출:
          <select v-model="type">
            <option disabled value="">선택하세요</option>
            <option value="income">수입</option>
            <option value="expense">지출</option>
          </select>
        </label>
        <label>
          카테고리:
          <select v-model="category">
            <option disabled value="">선택하세요</option>
            <option
              v-for="(label, key) in categories[type]"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select>
        </label>
        <label>
          금액:
          <input
            type="text"
            v-model="amount"
            @input="formatAmount"
            placeholder="금액을 입력하세요"
          />
        </label>
        <label>
          메모:
          <input type="text" v-model="note" placeholder="메모를 입력하세요" />
        </label>
        <div class="buttons">
          <button @click="submit">{{ isEditing ? "수정" : "추가" }}</button>
          <button @click="close">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["isVisible", "entry"],
  data() {
    return {
      entryDate: this.entry?.date || new Date().toISOString().split("T")[0],
      type: this.entry?.type || "",
      category: this.entry?.category || "",
      amount: this.entry?.amount || "",
      note: this.entry?.note || "",
      isEditing: !!this.entry,
      categories: {
        income: {
          etc: "기타",
          allowance: "용돈",
          salary: "근로소득",
          fIncome: "금융소득",
        },
        expense: {
          etc: "기타",
          shopping: "쇼핑",
          medical: "의료/건강",
          charge: "교통/통신",
          food: "식비",
          fOutcome: "금융",
        },
      },
    };
  },
  methods: {
    formatAmount() {
      const value = this.amount.replace(/,/g, "");
      this.amount = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    submit() {
      if (!this.type) {
        alert("수입/지출을 선택하세요");
        return;
      }
      if (!this.category) {
        alert("카테고리를 선택하세요");
        return;
      }
      if (!this.amount) {
        alert("금액을 입력하세요");
        return;
      }
      this.$emit("add-entry", {
        ...this.entry,
        date: this.entryDate,
        type: this.type,
        category: this.category,
        amount: parseFloat(this.amount.replace(/,/g, "")),
        note: this.note,
      });
      this.resetForm();
      this.close();
    },
    close() {
      this.resetForm();
      this.$emit("close");
    },
    resetForm() {
      this.entryDate =
        this.entry?.date || new Date().toISOString().split("T")[0];
      this.type = this.entry?.type || "";
      this.category = this.entry?.category || "";
      this.amount = this.entry?.amount
        ? this.entry.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "";
      this.note = this.entry?.note || "";
      this.isEditing = !!this.entry;
    },
  },
  watch: {
    entry: {
      handler(newValue) {
        if (newValue) {
          this.entryDate = newValue.date;
          this.type = newValue.type;
          this.category = newValue.category;
          this.amount = newValue.amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          this.note = newValue.note;
          this.isEditing = true;
        } else {
          this.resetForm();
          this.isEditing = false;
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
}
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
