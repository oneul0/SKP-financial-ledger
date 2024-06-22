<template>
  <div
    :class="[
      darkMode ? 'app-dark-mode' : '',
      fontSize == 'small' ? 'small-mode' : '',
      fontSize == 'medium' ? 'medium-mode' : '',
      fontSize == 'large' ? 'large-mode' : '',
    ]"
  >
    <main>
      <div class="container-fluid px-4">
        <h1 class="mt-4">홈</h1>
        <ol class="breadcrumb mb-4">
          <li class="breadcrumb-item active">Home</li>
        </ol>
        <!-- 그래프 부분 -->
        <div class="row">
          <div class="col-xl-6">
            <DoughnutGraph />
          </div>
          <div class="col-xl-6">
            <MixedGraph />
          </div>
        </div>

        <div class="card mb-4">
          <div class="card-header">
            <h3 style="text-align: center">최근 거래 내역</h3>
          </div>

          <div class="card-body">
            <HomeList />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import DoughnutGraph from "../components/DoughnutGraph.vue";
import MixedGraph from "../components/MixedGraph.vue";
import HomeList from "../components/HomeList.vue";
import axios from "axios";

export default {
  components: {
    DoughnutGraph,
    MixedGraph,
    HomeList,
  },
  data() {
    return {
      entries: [], // 거래 내역 리스트
      isModalVisible: false, // 모달 표시 여부
      editingEntry: null, // 수정 중인 항목

      darkMode: false,
      fontSize: "",
    };
  },
  created() {
    this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
    console.log(this.darkMode);
    console.log(this.fontSize);
  },

  methods: {
    // darkMode & fontSize 설정 작동
    chkMode() {
      const saveMode = localStorage.getItem("darkMode");
      const saveFontMode = localStorage.getItem("fontSize");
      if (saveMode !== null && saveMode === "true") {
        // localStorage는 string만 저장 가능
        this.darkMode = true;
      }
      if (saveFontMode !== null) {
        this.fontSize = saveFontMode;
      }
    },

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
    // darkMode & fontSize 설정 작동
    chkMode() {
      const saveMode = localStorage.getItem("darkMode");
      const saveFontMode = localStorage.getItem("fontSize");
      if (saveMode !== null && saveMode === "true") {
        // localStorage는 string만 저장 가능
        this.darkMode = true;
      }
      if (saveFontMode !== null) {
        this.fontSize = saveFontMode;
      }
    },
  },
  async mounted() {
    await this.loadEntries(); // 컴포넌트가 마운트될 때 항목 불러오기
  },
  created() {
    this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
  },
};
</script>

<style scoped></style>
