<template>
  <div>
    <HomeFilterOption
      :isDesc="isDesc"
      :filterOption="filterOption"
      @toggle-sort-order="toggleSortOrder"
      @set-filter-option="setFilterOption"
      @add-click="handleAddClick"
    />
    <ListItem
      v-for="item in filteredSortedAll"
      :key="item.date + item.amount + item.category + item.memo"
      :transaction="item"
      @edit-transaction="handleEditTransaction"
      @delete-transaction="handleDeleteTransaction"
    />
    <DateModal
      :visible="isDateModalVisible"
      :date="today"
      @data-saved="fetchListData"
      @close="isDateModalVisible = false"
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
import DateModal from "@/components/DateModal.vue";
import EventModal from "@/components/EventModal.vue";
import HomeFilterOption from "@/components/HomeFilterOption.vue";
import axios from "axios";

export default {
  name: "List",
  components: {
    ListItem,
    DateModal,
    EventModal,
    HomeFilterOption,
  },
  data() {
    return {
      incomes: [],
      expenses: [],
      all: [],
      sortOrder: "desc",
      isDesc: true,
      isDateModalVisible: false,
      isEventModalVisible: false,
      today: "", // 오늘 날짜를 저장할 변수 추가
      targetDay: {
        date: "",
        category: "",
        amount: 0,
        memo: "",
        type: "",
      },
      filterOption: "recent", // 최신순? 오래된순?
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
        return this.sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    },
    filteredSortedAll() {
      if (this.filterOption === "recent") {
        const oneMonthAgo = new Date(this.today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        return this.sortedAll.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= oneMonthAgo && itemDate <= new Date(this.today);
        });
      }
      return this.sortedAll;
    },
  },
  methods: {
    async fetchListData() {
      try {
        const response = await axios.get("/api/aaa");
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
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    handleAddClick() {
      this.isDateModalVisible = true;
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
        const response = await axios.get("/api/aaa");
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
        await axios.put("api/aaa", userData);
        await this.fetchListData();
      } catch (error) {
        console.error("데이터 전송 실패:", error);
      }
    },
    setTodayDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
      const dd = String(today.getDate()).padStart(2, "0");
      this.today = `${yyyy}-${mm}-${dd}`;
    },
    setFilterOption(option) {
      this.filterOption = option;
    },
  },
  watch: {
    isDesc(newValue) {
      this.sortOrder = newValue ? "desc" : "asc";
    },
  },
};
</script>
<style scoped>
.form-check-container {
  padding: 0 15px;
}
</style>
