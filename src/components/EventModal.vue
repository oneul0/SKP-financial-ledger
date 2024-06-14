<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>

      <form @submit.prevent="submitForm">
        <div>
          <label for="date">날짜</label>
          {{ formattedEventDate }}
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
              <!-- 기본 선택지 -->
              <option
                v-for="(label, key) in categories[formData.type]"
                :key="key"
                :value="key"
              >
                {{ label }}
                <!-- 카테고리 선택지, type에 따라 변경 -->
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
            :placeholder="formattedPlaceholderAmount"
            required
          />
        </div>
        <div>
          <label for="memo">메모</label>
          <input
            type="text"
            id="memo"
            v-model="formData.memo"
            :placeholder="event.extendedProps?.memo"
            required
          />
        </div>
        <button class="submitButton" type="submit">제출</button>
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
      required: true,
    },
    event: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      formData: {
        // event 전체가 거래내역에 대한 데이터임.
        date: this.event.date,
        category: "",
        amount: 0,
        type: "",
        memo: "",
      },
      formattedAmount: this.amount,
      categories: {
        income: {
          ietc: "기타소득",
          allowance: "용돈",
          salary: "근로소득",
          fIncome: "금융소득",
        },
        expense: {
          eetc: "기타지출",
          shopping: "쇼핑",
          medical: "의료/건강",
          charge: "교통/통신",
          food: "식비",
          fOutcome: "금융지출",
        },
      },
    };
  },
  computed: {
    formattedEventDate() {
      const eventDate = new Date(this.event.date);
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, "0");
      const day = String(eventDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formattedPlaceholderAmount() {
      return this.formatAmountPlaceholder(
        this.event.extendedProps?.amount || ""
      );
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    },
    classNames(newVal) {
      this.formData.type = newVal.includes("income-custom")
        ? "income"
        : "expense";
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    resetForm() {
      this.formData = {
        date: this.event.date,
        category: this.event.category,
        amount: this.event.amount,
        type: this.event.type,
        memo: this.event.memo,
      };
      this.formattedAmount = this.formatAmountPlaceholder(this.formData.amount);
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
    formatAmountPlaceholder(amount) {
      if (!isNaN(amount) && amount !== "") {
        return parseInt(amount).toLocaleString();
      }
      return "";
    },

    async submitForm() {
      try {
        const response = await axios.get("/api/aaa");
        const userData = response.data;
        // 기존 데이터 삭제
        const formattedDate = this.formattedEventDate;

        if (this.formData.type === "income") {
          userData.income = userData.income.filter(
            (item) =>
              !(
                item.date === formattedDate &&
                item.category === this.event.category &&
                item.amount === Number(this.event.amount) &&
                item.memo === this.event.memo
              )
          );
        } else {
          userData.expense = userData.expense.filter(
            (item) =>
              !(
                item.date === formattedDate &&
                item.category === this.event.category &&
                item.amount === Number(this.event.amount) &&
                item.memo === this.event.memo
              )
          );
        }

        // 수정된 데이터 추가
        const plainFormData = {
          date: formattedDate,
          category: this.formData.category,
          amount: Number(this.formData.amount),
          memo: this.formData.memo,
        };
        if (this.formData.type === "income") {
          userData.income.push(plainFormData);
        } else {
          userData.expense.push(plainFormData);
        }

        await axios.put("/api/aaa", userData);
        this.$emit("event-saved");
        location.href = location.href;
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
.submitButton {
  background-color: #356eff;
}
</style>
