<template>
  <div class="list-comp">
    <!-- 필터와 정렬 옵션을 제공하는 컨트롤 섹션 -->
    <div class="controls">
      <div class="header">
        <h2>최근 거래 내역</h2>
        <div class="filter-controls">
          <!-- 정렬 옵션 -->
          <select v-model="sortOrder" @change="applyFilters">
            <option value="latest">최신순</option>
            <option value="oldest">오래된 순</option>
          </select>
          <!-- 카테고리 필터 옵션 -->
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
            <option value="fOutcome">금융지출</option>
          </select>
          <!-- 날짜 필터 옵션 -->
          <input type="date" v-model="startDate" @change="applyFilters" />
          <input type="date" v-model="endDate" @change="applyFilters" />
          <!-- 검색 입력 필터 -->
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
    <!-- 거래 내역을 표시하는 테이블 -->
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
          <!-- 필터링 및 페이지네이션된 거래 내역을 반복하여 표시 -->
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
    <!-- 페이지네이션 컨트롤 -->
    <div class="pagination">
      <button v-if="currentPage > 1" @click="prevPage">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button v-if="currentPage < totalPages" @click="nextPage">다음</button>
    </div>
    <!-- 항목 수정 모달창 -->
    <EditComp
      :isVisible="isModalVisible"
      :entry="editingEntry"
      @close="hideModal"
      @add-entry="updateEntry"
    />
  </div>
</template>

<script>
import EditComp from "./EditComp.vue";

export default {
  props: ["list"], // 상위 컴포넌트로부터 받은 거래 내역 목록
  components: {
    EditComp, // EditComp 컴포넌트 등록
  },
  data() {
    return {
      sortOrder: "latest", // 기본 정렬 순서
      categoryFilter: "", // 기본 카테고리 필터 (전체)
      startDate: "", // 시작 날짜 필터
      endDate: "", // 종료 날짜 필터
      searchQuery: "", // 검색어 필터
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 20, // 페이지 당 항목 수
      isModalVisible: false, // 모달 표시 여부
      editingEntry: null, // 수정 중인 항목
    };
  },
  computed: {
    filteredList() {
      // 필터링 및 정렬된 거래 내역 목록
      let sortedList = [...this.list];
      if (this.sortOrder === "latest") {
        // 최신순 정렬
        sortedList.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        // 오래된 순 정렬
        sortedList.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      if (this.categoryFilter) {
        // 카테고리 필터링
        sortedList = sortedList.filter(
          (item) => item.category === this.categoryFilter
        );
      }

      if (this.startDate) {
        // 시작 날짜 필터링
        sortedList = sortedList.filter(
          (item) => new Date(item.date) >= new Date(this.startDate)
        );
      }

      if (this.endDate) {
        // 종료 날짜 필터링
        sortedList = sortedList.filter(
          (item) => new Date(item.date) <= new Date(this.endDate)
        );
      }

      if (this.searchQuery) {
        // 검색어 필터링
        sortedList = sortedList.filter(
          (item) =>
            item.note.includes(this.searchQuery) ||
            item.category.includes(this.searchQuery)
        );
      }

      return sortedList;
    },
    paginatedList() {
      // 페이지네이션된 거래 내역 목록
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredList.slice(start, end);
    },
    totalPages() {
      // 전체 페이지 수
      return Math.ceil(this.filteredList.length / this.itemsPerPage);
    },
  },
  methods: {
    applyFilters() {
      // 필터 적용 및 페이지 리셋
      this.currentPage = 1;
    },
    editEntry(item) {
      // 수정 버튼 클릭 시 모달 표시
      this.editingEntry = item;
      this.isModalVisible = true;
    },
    deleteEntry(id) {
      // 삭제 버튼 클릭 시 상위 컴포넌트로 이벤트 전달
      this.$emit("delete-entry", id);
    },
    updateEntry(updatedEntry) {
      // 항목 업데이트
      const index = this.list.findIndex(
        (entry) => entry.id === updatedEntry.id
      );
      if (index !== -1) {
        this.$emit("update:list", [
          ...this.list.slice(0, index),
          updatedEntry,
          ...this.list.slice(index + 1),
        ]);
      }
      this.isModalVisible = false;
    },
    hideModal() {
      // 모달 숨기기
      this.isModalVisible = false;
    },
    formatDate(date) {
      // 날짜 형식 변환
      return new Date(date).toISOString().split("T")[0];
    },
    formatCategory(key) {
      // 카테고리 키를 카테고리 이름으로 변환
      const categories = {
        etc: "기타",
        allowance: "용돈",
        salary: "근로소득",
        fIncome: "금융소득",
        shopping: "쇼핑",
        medical: "의료/건강",
        charge: "교통/통신",
        food: "식비",
        fOutcome: "금융지출",
      };
      return categories[key] || key;
    },
    nextPage() {
      // 다음 페이지로 이동
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      // 이전 페이지로 이동
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>
