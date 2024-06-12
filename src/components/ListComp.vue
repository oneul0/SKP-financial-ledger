<template>
  <div class="list-comp">
    <div class="controls">
      <div class="header">
        <h2>최근 거래 내역</h2>
        <div class="filter-controls">
          <select v-model="sortOrder" @change="applyFilters">
            <option value="latest">최신순</option>
            <option value="oldest">오래된 순</option>
          </select>
          <select v-model="categoryFilter" @change="applyFilters">
            <option value="">전체</option>
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
          <input type="date" v-model="startDate" @change="applyFilters" />
          <input type="date" v-model="endDate" @change="applyFilters" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="검색어를 입력하세요"
            @input="applyFilters"
          />
          <button @click="applyFilters">검색</button>
        </div>
      </div>
    </div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>수입/지출</th>
            <th>분류</th>
            <th>내역</th>
            <th>메모</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in paginatedList"
            :key="item.id"
            :class="{
              income: item.type === 'income',
              expense: item.type === 'expense',
            }"
          >
            <td>{{ formatDate(item.date) }}</td>
            <td>{{ item.type === "income" ? "수입" : "지출" }}</td>
            <td>{{ formatCategory(item.category) }}</td>
            <td>{{ item.amount.toLocaleString() }}원</td>
            <td>{{ item.note }}</td>
            <td>
              <button @click="editEntry(item)">수정</button>
              <button @click="deleteEntry(item.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        다음
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {
      sortOrder: "latest",
      categoryFilter: "",
      startDate: "",
      endDate: "",
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 20,
    };
  },
  computed: {
    filteredList() {
      let sortedList = [...this.list];
      if (this.sortOrder === "latest") {
        sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        sortedList.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      if (this.categoryFilter) {
        sortedList = sortedList.filter(
          (item) => item.category === this.categoryFilter
        );
      }

      if (this.startDate) {
        sortedList = sortedList.filter(
          (item) => new Date(item.date) >= new Date(this.startDate)
        );
      }

      if (this.endDate) {
        sortedList = sortedList.filter(
          (item) => new Date(item.date) <= new Date(this.endDate)
        );
      }

      if (this.searchQuery) {
        sortedList = sortedList.filter(
          (item) =>
            item.note.includes(this.searchQuery) ||
            item.category.includes(this.searchQuery)
        );
      }

      return sortedList;
    },
    paginatedList() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.itemsPerPage);
    },
  },
  methods: {
    applyFilters() {
      this.currentPage = 1;
    },
    editEntry(item) {
      this.$emit("edit-entry", item);
    },
    deleteEntry(id) {
      this.$emit("delete-entry", id);
    },
    formatDate(date) {
      return new Date(date).toISOString().split("T")[0];
    },
    formatCategory(key) {
      const categories = {
        etc: "기타",
        allowance: "용돈",
        salary: "근로소득",
        fIncome: "금융소득",
        shopping: "쇼핑",
        medical: "의료/건강",
        charge: "교통/통신",
        food: "식비",
        fOutcome: "금융",
      };
      return categories[key] || key;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.list-comp {
  width: 100%;
  height: 100%;
}
.table-container {
  height: calc(100% - 150px); /* 필터와 검색창 높이를 고려하여 설정 */
  overflow-y: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #333; /* 경계선 색상 진하게 수정 */
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
tr.income {
  background-color: #ffdddd; /* 수입 행의 배경색 */
}
tr.expense {
  background-color: #ddddff; /* 지출 행의 배경색 */
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.pagination button {
  margin: 0 5px;
}
.controls {
  margin-bottom: 10px;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.filter-controls {
  display: flex;
  align-items: center;
}
.filter-controls select,
.filter-controls input {
  margin-right: 10px;
}
</style>
