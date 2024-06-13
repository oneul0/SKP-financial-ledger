<template>
  <div>
    <body>
      <div id="layoutSidenav_content">
        <main>
          <div class="container-fluid px-4">
            <router-view></router-view>
          </div>
        </main>
      </div>
 
    </body>
  </div>
</template>

<script>
import { ref, provide } from 'vue';
import Login from "./views/LoginView.vue";
import Header from './components/Header.vue';


export default {
  name: "App",
  components: { Login, Header },

  setup() {
    const isLoggedIn = ref(false);
    const localId = ref("");

    provide('isLoggedIn', isLoggedIn)
    provide('localId', localId);

    return { isLoggedIn, localId };
  },

  data() {
    return {
      darkMode: false,
      fontSize: ""
    }
  },

  mounted() {
    this.chkLogin();  // mount시 로그인 여부 판별

    this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
  },

  methods: {

    // 로그인 여부 판별 -> 각각 다른 template 적용 (데이터에 대한 무분별한 접근 X)
    chkLogin() {
      const status = localStorage.getItem('loginID');

      if (status !== null && status !== "" && status !== undefined) {
        this.isLoggedIn = true;
        this.localId = status;
      }
    },

    chkMode() {
      const saveMode = localStorage.getItem('darkMode');
      const saveFontMode = localStorage.getItem('fontSize');

      if (saveMode !== null && saveMode === "true") {  // localStorage는 string만 저장 가능       
        this.darkMode = true;
      }

      if (saveFontMode !== null) {
        this.fontSize = saveFontMode;
      }
    }
  }

}
</script>

<style></style>
