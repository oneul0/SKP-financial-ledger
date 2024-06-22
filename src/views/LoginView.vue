<template>
    <div>

        <body class="bg-primary">
            <div id="layoutAuthentication"
                :class="[darkMode ? 'dark-mode' : '', fontSize == 'small' ? 'small-mode' : '', fontSize == 'medium' ? 'medium-mode' : '', fontSize == 'large' ? 'large-mode' : '']">
                <div id="layoutAuthentication_content">
                    <main>
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-5">
                                    <div class="card shadow-lg border-0 rounded-lg mt-5">
                                        <div class="card-header">
                                            <h3 class="text-center font-weight-light my-4">Login</h3>
                                        </div>
                                        <div class="card-body">
                                            <form @submit.prevent="login">  <!-- form이 자동으로 submit으로 넘어가는 것 방지 -->

                                                <!-- ID 입력 부분 -->
                                                <div class="form-floating mb-3">
                                                    <input v-model="id" class="form-control" id="inputID" type="text"
                                                        placeholder="ID" required />
                                                    <label for="inputEmail">ID</label>
                                                </div>

                                                <!-- PW 입력 부분 -->
                                                <div class="form-floating mb-3">
                                                    <input v-model="pw" class="form-control" id="inputPassword"
                                                        type="password" placeholder="Password" required />
                                                    <label for="inputPassword">Password</label>
                                                </div>


                                                <!-- Login 버튼 부분 -->
                                                <div
                                                    class="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                    <button type="submit" class="btn btn-primary">Login</button>
                                                </div>
                                            </form>
                                        </div>

                                        <div class="card-footer text-center py-3">
                                            <!-- 회원이 아니라면 바로 회원가입 페이지로 이동 -->
                                            <div class="small"><a href="/signUp">회원이 아니신가요? 가입하러 가기!</a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

                <!-- Footer 부분 -->
                <div id="layoutAuthentication_footer">
                    <footer class="py-4 bg-light mt-auto">
                        <div class="container-fluid px-4">
                            <div class="d-flex align-items-center justify-content-between small">
                                <div class="text-muted">Copyright &copy; Your Website 2023</div>
                                <div>
                                    <a href="#">Privacy Policy</a>
                                    &middot;
                                    <a href="#">Terms &amp; Conditions</a>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </body>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: "Login",
    inject: ["isLoggedIn", "localId"],

    data() {
        return {
            id: "",
            pw: "",
            users: [],

            darkMode: false,
            fontSize: ""
        }
    },

    mounted() {
        this.chkMode(); // mount시 darkMode 여부와 fontSize 판별

    },

    methods: {
        refresh() {
            location.href = location.href;
        },
        chkMode() {
            const saveMode = localStorage.getItem('darkMode');  // localStroge에서 darkMode 기본 설정 가져오기 
            const saveFontMode = localStorage.getItem('fontSize');  // localStroge에서 fontSize 기본 설정 가져오기 

            if (saveMode !== null && saveMode === "true") {  // localStorage는 string만 저장 가능       
                this.darkMode = true;
            }

            if (saveFontMode !== null) {
                this.fontSize = saveFontMode;
            }
        },

        login() {

            // json데이터와 id, pw 입력 값을 받아 비교 -> 로그인 성공시 Home으로 routing
            axios.get("/api/", {})
                .then(res => {

                    // 입력한 패스워드가 일치하는지 확인
                    if (this.id === undefined || this.pw === undefined) {
                        alert('id나 패스워드가 형식에 맞지 않습니다.');
                        return;
                    }
                    else {
                        this.users = res.data;

                        // 회원가입이 되어 있는 회원정보를 검색
                        let index = -1;
                        this.users.forEach((user, i) => {
                            if (this.id === user.id && this.pw === user.pw) {
                                index = i;
                                return;
                            }
                        });

                        if (index < 0) { // 회원정보를 찾지 못한 경우, index= -1
                            alert('일치하는 회원정보가 없습니다.')
                            return '';
                        } else { // 회원정보를 찾았을 경우.

                            alert(this.users[index].name + "님 로그인에 성공했습니다.");

                            localStorage.setItem("loginID", this.id);  // localStorage는 string만 저장 가능

                            // Home으로 이동
                            this.$router.push('/').then(() => {
                                location.href = location.href;
                            }).catch((error) => {
                                console.error('Router navigation failed:', error);
                            });

                        }
                    }
                })
                .catch(err => alert(err))
        }
    }
}
</script>


<style scoped></style>
