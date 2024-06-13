<template>
  <div>
    <body
      :class="[
        darkMode ? 'dark-mode' : '',
        fontSize == 'small' ? 'small-mode' : '',
        fontSize == 'medium' ? 'medium-mode' : '',
        fontSize == 'large' ? 'large-mode' : '',
      ]"
    >
      <router-view></router-view>
    </body>
  </div>
</template>

<script>
import Login from "./views/LoginView.vue";

export default {
  name: "App",
  components: { Login },

  data() {
    return {
      darkMode: false,
      fontSize: "",
    };
  },

  mounted() {
    this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
  },

  methods: {
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
};
</script>

<style></style>
