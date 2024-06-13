<template>
  <div>
    <!-- 항목 추가 버튼 -->
    <button class="add-button" @click="showModal">+</button>
    <!-- EditComp 컴포넌트를 사용하여 항목 생성 모달 표시 -->
    <EditComp
      :isVisible="isModalVisible"
      :entry="entry"
      @close="hideModal"
      @add-entry="addEntry"
    />
  </div>
</template>

<script>
import EditComp from "./EditComp.vue"; // EditComp 컴포넌트 임포트

export default {
  components: {
    EditComp, // EditComp 컴포넌트 등록
  },
  data() {
    return {
      isModalVisible: false, // 모달 표시 여부 상태
      entry: null, // 현재 편집 중인 항목 (항목 생성 시 null)
    };
  },
  methods: {
    showModal() {
      // 모달 표시 메소드
      this.isModalVisible = true;
      this.entry = null; // 항목 생성 모드로 설정
    },
    hideModal() {
      // 모달 숨기기 메소드
      this.isModalVisible = false;
    },
    addEntry(entry) {
      // 항목 추가 메소드
      this.$emit("add-entry", entry); // 부모 컴포넌트로 'add-entry' 이벤트 발송
      this.hideModal(); // 모달 숨기기
    },
  },
};
</script>
