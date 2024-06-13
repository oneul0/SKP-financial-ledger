<template>
  <div v-if="isVisible" class="modal" @click.self="close">
    <!-- 모달창 전체를 감싸는 div -->
    <div class="modal-content">
      <!-- 모달창 내용물 -->
      <span class="close" @click="close">&times;</span>
      <!-- 닫기 버튼 -->
      <div class="input-comp">
        <!-- 입력폼을 감싸는 div -->
        <label>
          날짜:
          <input type="date" v-model="entryDate" />
          <!-- 날짜 입력 필드 -->
        </label>
        <label>
          수입/지출:
          <select v-model="type">
            <option disabled value="">선택하세요</option>
            <!-- 기본 선택지 -->
            <option value="income">수입</option>
            <option value="expense">지출</option>
            <!-- 수입/지출 선택지 -->
          </select>
        </label>
        <label>
          카테고리:
          <select v-model="category">
            <option disabled value="">선택하세요</option>
            <!-- 기본 선택지 -->
            <option
              v-for="(label, key) in categories[type]"
              :key="key"
              :value="key"
            >
              {{ label }}
              <!-- 카테고리 선택지, type에 따라 변경 -->
            </option>
          </select>
        </label>
        <label>
          금액:
          <input
            type="text"
            v-model="amount"
            @input="formatAmount"
            placeholder="금액을 입력하세요"
          />
          <!-- 금액 입력 필드 -->
        </label>
        <label>
          메모:
          <input type="text" v-model="note" placeholder="메모를 입력하세요" />
          <!-- 메모 입력 필드 -->
        </label>
        <div class="buttons">
          <!-- 버튼을 감싸는 div -->
          <button @click="submit">{{ isEditing ? "수정" : "추가" }}</button>
          <!-- submit 버튼, 수정 또는 추가 -->
          <button @click="close">취소</button>
          <!-- close 버튼, 취소 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["isVisible", "entry"],
  // isVisible: 모달창 표시 여부, entry: 수정할 항목 데이터
  data() {
    return {
      entryDate: this.entry?.date || new Date().toISOString().split("T")[0],
      // entryDate: 항목 날짜, 기본값은 오늘 날짜
      type: this.entry?.type || "",
      // type: 수입 또는 지출, 기본값은 빈 문자열
      category: this.entry?.category || "",
      // category: 항목 카테고리, 기본값은 빈 문자열
      amount: this.entry?.amount || "",
      // amount: 항목 금액, 기본값은 빈 문자열
      note: this.entry?.note || "",
      // note: 항목 메모, 기본값은 빈 문자열
      isEditing: !!this.entry,
      // isEditing: 수정 모드 여부
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
        // categories: 수입/지출에 따른 카테고리 목록
      },
    };
  },
  methods: {
    formatAmount() {
      // 금액 입력값을 포맷팅하는 함수
      const value = this.amount.replace(/,/g, "");
      this.amount = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    submit() {
      // 폼 제출 함수
      if (!this.type) {
        alert("수입/지출을 선택하세요");
        return;
      }
      if (!this.category) {
        alert("카테고리를 선택하세요");
        return;
      }
      if (!this.amount) {
        alert("금액을 입력하세요");
        return;
      }
      // 유효성 검사 후 add-entry 이벤트 발생
      this.$emit("add-entry", {
        ...this.entry,
        date: this.entryDate,
        type: this.type,
        category: this.category,
        amount: parseFloat(this.amount.replace(/,/g, "")),
        note: this.note,
      });
      this.resetForm();
      this.close();
    },
    close() {
      // 폼 리셋 후 모달 닫기
      this.resetForm();
      this.$emit("close");
    },
    resetForm() {
      // 폼 리셋 함수
      this.entryDate =
        this.entry?.date || new Date().toISOString().split("T")[0];
      this.type = this.entry?.type || "";
      this.category = this.entry?.category || "";
      this.amount = this.entry?.amount
        ? this.entry.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "";
      this.note = this.entry?.note || "";
      this.isEditing = !!this.entry;
    },
  },
  watch: {
    entry: {
      // entry prop이 변경될 때마다 폼 업데이트
      handler(newValue) {
        if (newValue) {
          this.entryDate = newValue.date;
          this.type = newValue.type;
          this.category = newValue.category;
          this.amount = newValue.amount
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          this.note = newValue.note;
          this.isEditing = true;
        } else {
          this.resetForm();
          this.isEditing = false;
        }
      },
      deep: true,
    },
  },
};
</script>
