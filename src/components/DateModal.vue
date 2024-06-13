<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <!-- 모달 닫기 버튼 -->
      <form @submit.prevent="submitForm">
        <div>
          <label for="date">날짜</label>
          {{ date }}
        </div>
        <div>
          <label>
            수입/지출:
            <select v-model="formData.type">
              <option disabled value="">선택하세요</option>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            카테고리:
            <select v-model="formData.category">
              <option disabled value="">선택하세요</option>
              <option
                v-for="(label, key) in categories[formData.type]"
                :key="key"
                :value="key"
              >
                {{ label }}
              </option>
            </select>
          </label>
        </div>
        <div>
          <label for="amount">금액</label>
          <input
            type="text"
            id="amount"
            v-model="formattedAmount"
            @input="formatAmount"
            required
          />
        </div>
        <div>
          <label for="memo">메모</label>
          <input type="text" id="memo" v-model="formData.memo" required />
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        date: this.date,
        category: "",
        amount: "",
        type: "",
        memo: "",
      },
      formattedAmount: "",
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
          fOutcome: "금융지출",
        },
      },
    };
  },
  watch: {
    date(newDate) {
      this.formData.date = newDate;
    },
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    resetForm() {
      this.formData = {
        date: this.date,
        category: "",
        amount: "",
        type: "",
        memo: "",
      };
      this.formattedAmount = "";
    },
    formatAmount(event) {
      let value = event.target.value.replace(/,/g, "");
      if (!isNaN(value) && value !== "") {
        this.formattedAmount = parseInt(value).toLocaleString();
        this.formData.amount = value;
      } else {
        this.formattedAmount = "";
        this.formData.amount = "";
      }
    },
    async submitForm() {
      try {
        const response = await axios.get("/api/aaa");
        console.log("response", response);
        const userData = response.data;

        console.log("userData.income", userData.income);
        console.log("userData.expense", userData.expense);

        const plainFormData = {
          date: this.formData.date,
          category: this.formData.category,
          amount: Number(this.formData.amount),
          memo: this.formData.memo,
        };
        if (this.formData.type == "income") {
          userData.income.push(plainFormData);
        } else {
          userData.expense.push(plainFormData);
        }

        await axios.put("api/aaa", userData);

        this.$emit("data-saved");
        this.closeModal();
      } catch (error) {
        console.error("데이터 전송 실패:", error);
      }
    },
  },
};
</script>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #45a049;
}
</style>
