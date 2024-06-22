<template>
  <div>
    <div class="date-picker-container">
      <div class="date-picker-row">
        <div class="date-picker-item">
          <label>시작 날짜:</label>
          <input type="date" v-model="startDate" />
        </div>
        <div class="date-picker-item">
          <label>종료 날짜:</label>
          <input type="date" v-model="endDate" />
        </div>
        <div class="date-picker-item">
          <label>카테고리:</label>
          <select v-model="selectedCategory">
            <option value="">전체</option>
            <optgroup label="수입">
              <option
                v-for="(label, key) in categories.income"
                :key="key"
                :value="key"
              >
                {{ label }}
              </option>
            </optgroup>
            <optgroup label="지출">
              <option
                v-for="(label, key) in categories.expense"
                :key="key"
                :value="key"
              >
                {{ label }}
              </option>
            </optgroup>
          </select>
        </div>
        <div class="date-picker-item">
          <button @click="searchByDateAndCategory">검색</button>
        </div>
      </div>
    </div>

    <ListItem
      v-for="item in filteredByDateAndCategory"
      :key="item.date + item.amount + item.category + item.memo"
      :transaction="item"
      @edit-transaction="handleEditTransaction"
      @delete-transaction="handleDeleteTransaction"
    />
    <EventModal
      :visible="isEventModalVisible"
      :event="targetDay"
      @event-saved="fetchListData"
      @close="isEventModalVisible = false"
    />
  </div>
</template>

<script>
import ListItem from "@/components/ListItem.vue";
import EventModal from "@/components/EventModal.vue";
import axios from "axios";

export default {
  name: "List",
  inject: ["isLoggedIn", "localId"],
  components: {
    ListItem,
    EventModal,
  },
  data() {
    return {
      incomes: [],
      expenses: [],
      all: [],
      isDateModalVisible: false,
      isEventModalVisible: false,
      today: "", // 추가 버튼을 눌렀을 때, 오늘 날짜를 자동으로 넘겨줌
      targetDay: {
        date: "",
        category: "",
        amount: 0,
        memo: "",
        type: "",
      },
      startDate: "", // 검색 시작 날짜
      endDate: "", // 검색 종료 날짜
      selectedCategory: "", // 선택된 카테고리
      categories: {
        income: {
          ietc: "기타",
          allowance: "용돈",
          salary: "근로소득",
          fIncome: "금융소득",
        },
        expense: {
          eetc: "기타",
          shopping: "쇼핑",
          medical: "의료/건강",
          charge: "교통/통신",
          food: "식비",
          fOutcome: "금융지출",
        },
      },
    };
  },
  created() {
    this.fetchListData();
    this.setTodayDate(); // 오늘 날짜 설정
  },
  computed: {
    sortedAll() {
      return [...this.all].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
    },
    filteredByDate() {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        return this.sortedAll.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= start && itemDate <= end;
        });
      }
      return this.sortedAll;
    },
    filteredByDateAndCategory() {
      let filtered = this.filteredByDate;
      if (this.selectedCategory) {
        filtered = filtered.filter((item) => {
          return item.category === this.selectedCategory;
        });
      }
      return filtered;
    },
  },
  methods: {
    async fetchListData() {
      try {
        const response = await axios.get(`/api/${this.localId}`);
        this.incomes = response.data.income.map((item) => ({
          ...item,
          type: "income",
        }));
        this.expenses = response.data.expense.map((item) => ({
          ...item,
          type: "expense",
        }));
        this.all = [...this.incomes, ...this.expenses];
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    },
    handleEditTransaction(event) {
      this.targetDay = {
        date: event.date,
        category: event.category,
        amount: event.amount,
        memo: event.memo,
        type: event.type,
      };
      this.isEventModalVisible = true;
    },
    async handleDeleteTransaction(event) {
      this.targetDay = {
        date: event.date,
        category: event.category,
        amount: event.amount,
        memo: event.memo,
        type: event.type,
      };
      try {
        const response = await axios.get(`/api/${this.localId}`);
        const userData = response.data;

        if (this.targetDay.type === "income") {
          userData.income = userData.income.filter(
            (item) =>
              !(
                item.date === this.targetDay.date &&
                item.category === this.targetDay.category &&
                item.amount === Number(this.targetDay.amount) &&
                item.memo === this.targetDay.memo
              )
          );
        } else {
          userData.expense = userData.expense.filter(
            (item) =>
              !(
                item.date === this.targetDay.date &&
                item.category === this.targetDay.category &&
                item.amount === Number(this.targetDay.amount) &&
                item.memo === this.targetDay.memo
              )
          );
        }
        await axios.put(`/api/${this.localId}`, userData);
        await this.fetchListData();
        location.href = location.href;
      } catch (error) {
        console.error("데이터 전송 실패:", error);
      }
    },
    setTodayDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const dd = String(today.getDate()).padStart(2, "0");
      this.today = `${yyyy}-${mm}-${dd}`;
    },
    searchByDateAndCategory() {
      this.filteredByDateAndCategory();
    },
  },
};
</script>
<style scoped>
.form-check-container {
  padding: 0 15px;
}
.date-picker-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.date-picker-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.date-picker-item {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 150px;
}

.date-picker-item label {
  margin-right: 10px;
  white-space: nowrap;
}

.date-picker-item input,
.date-picker-item select,
.date-picker-item button {
  margin-left: 5px;
}
.date-picker-item button {
  background-color: #356eff;
}
</style>
