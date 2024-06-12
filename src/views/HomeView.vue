<template>
  <div class="home-view">
    <div class="top-section"></div>
    <div class="bottom-section">
      <ListComp
        :list="entries"
        @edit-entry="editEntry"
        @delete-entry="deleteEntry"
        @update:list="updateEntries"
      />
    </div>
    <button class="add-button" @click="showModal">+</button>
    <CreateComp
      :isVisible="isModalVisible"
      :entry="editingEntry"
      @close="hideModal"
      @add-entry="addEntry"
    />
  </div>
</template>

<script>
import ListComp from "../components/ListComp.vue";
import CreateComp from "../components/CreateComp.vue";
import axios from "axios";

export default {
  components: {
    ListComp,
    CreateComp,
  },
  data() {
    return {
      entries: [],
      isModalVisible: false,
      editingEntry: null,
    };
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
      this.editingEntry = null;
    },
    hideModal() {
      this.isModalVisible = false;
    },
    async addEntry(entry) {
      if (this.editingEntry) {
        Object.assign(this.editingEntry, entry);
        this.editingEntry = null;
      } else {
        entry.id = this.entries.length + 1;
        this.entries.push(entry);
      }
      this.isModalVisible = false;
      await this.saveEntries();
    },
    editEntry(entry) {
      this.editingEntry = entry;
      this.isModalVisible = true;
    },
    async deleteEntry(id) {
      this.entries = this.entries.filter((entry) => entry.id !== id);
      await this.saveEntries();
    },
    async saveEntries() {
      try {
        await axios.post("http://localhost:3000/api/entries", this.entries);
      } catch (error) {
        console.error("Error saving entries:", error);
      }
    },
    async loadEntries() {
      try {
        const response = await axios.get("http://localhost:3000/api/entries");
        this.entries = response.data;
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    },
    updateEntries(updatedList) {
      this.entries = updatedList;
    },
  },
  async mounted() {
    await this.loadEntries();
  },
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.top-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.add-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 24px;
  cursor: pointer;
}
.bottom-section {
  flex: 1;
  overflow: hidden;
}
</style>
