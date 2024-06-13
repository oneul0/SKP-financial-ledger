<template>

        <!-- 그래프 부분 -->
        <div class="row">
          <div class="col-xl-6">
            <DoughnutGraph />
          </div>
          <div class="col-xl-6">
            <MixedGraph />
          </div>
        </div>

        <!-- 리스트 부분 -->
        <div class="card mb-4">
          <div class="card-header">
            <i class="fas fa-table me-1"></i>
            최근 거래 내역
          </div>
          <div class="card-body">
            <!-- ListComp 컴포넌트를 사용하여 리스트를 표시 -->
            <ListComp :list="entries" @edit-entry="editEntry" @delete-entry="deleteEntry"
              @update:list="updateEntries" />
            <!-- 항목 추가를 위한 버튼 -->
            <button class="add-button" @click="showModal">+</button>
            <!-- CreateComp 컴포넌트를 사용하여 항목 생성 모달 -->
            <CreateComp :isVisible="isModalVisible" :entry="editingEntry" @close="hideModal" @add-entry="addEntry" />
          </div>
        </div>
      </div>
    </main>
  </div>

</template>

<script>
import ListComp from "../components/ListComp.vue";
import CreateComp from "../components/CreateComp.vue";
import DoughnutGraph from "../components/DoughnutGraph.vue";
import MixedGraph from "../components/MixedGraph.vue";

import axios from "axios";

export default {
  components: {
    ListComp,
    CreateComp,
    DoughnutGraph,
    MixedGraph,
  },
  data() {
    return {
      entries: [], // 거래 내역 리스트
      isModalVisible: false, // 모달 표시 여부
      editingEntry: null, // 수정 중인 항목
    };
  },
  methods: {
    // 모달 표시
    showModal() {
      this.isModalVisible = true;
      this.editingEntry = null;
    },
    // 모달 숨기기
    hideModal() {
      this.isModalVisible = false;
    },
    // 항목 추가 및 수정
    async addEntry(entry) {
      if (this.editingEntry) {
        // 수정 모드일 경우 기존 항목 업데이트
        Object.assign(this.editingEntry, entry);
        this.editingEntry = null;
      } else {
        // 새로운 항목 추가
        entry.id = this.entries.length + 1;
        this.entries.push(entry);
      }
      this.isModalVisible = false;
      await this.saveEntries(); // 변경 사항 저장
    },
    // 항목 수정 모드 활성화
    editEntry(entry) {
      this.editingEntry = entry;
      this.isModalVisible = true;
    },
    // 항목 삭제
    async deleteEntry(id) {
      this.entries = this.entries.filter((entry) => entry.id !== id);
      await this.saveEntries(); // 변경 사항 저장
    },
    // 항목 저장 (서버에 POST 요청)
    async saveEntries() {
      try {
        await axios.post("/api", this.entries);
      } catch (error) {
        console.error("Error saving entries:", error);
      }
    },
    // 항목 불러오기 (서버에 GET 요청)
    async loadEntries() {
      try {
        const response = await axios.get("/api");
        this.entries = response.data;
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    },
    // 항목 리스트 업데이트
    updateEntries(updatedList) {
      this.entries = updatedList;
    },
  },
  async mounted() {
    await this.loadEntries(); // 컴포넌트가 마운트될 때 항목 불러오기
  },
};
</script>
