<template>
    <div>

        <body class="bg-primary">
            <div id="layoutAuthentication"
                :class="[darkMode ? 'dark-mode' : '', fontSize == 'small' ? 'small-mode' : '', fontSize == 'medium' ? 'medium-mode' : '', fontSize == 'large' ? 'large-mode' : '']">
                <div id="layoutAuthentication_content">
                    <main>
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-7">
                                    <div class="card shadow-lg border-0 rounded-lg mt-5">
                                        <div class="card-header">
                                            <h3 class="text-center font-weight-light my-4">Create Account</h3>
                                        </div>
                                        <div class="card-body">
                                            <form @submit.prevent="account">

                                                <!-- ID 생성 input -->
                                                <div class="form-floating mb-3">

                                                    <input v-model="id" required class="form-control" id="inputID"
                                                        type="text" placeholder="Enter your ID" />
                                                    <label for="inputID">ID</label>

                                                    <button class="btn btn-primary" type="button" id="idChkBtn"
                                                        @click="idCheck">중복확인</button>

                                                    <br /><br />
                                                    <p id="idChkMsg" v-html="idChkColor"></p>
                                                </div>

                                                <!-- pw 생성 및 재확인 input -->
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <div class="form-floating mb-3 mb-md-0">
                                                            <input v-model="pw" class="form-control" id="inputPassword"
                                                                type="password" placeholder="Create a password"
                                                                required />
                                                            <label for="inputPassword">Password</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-floating mb-3 mb-md-0">
                                                            <input v-model="pwChk" class="form-control"
                                                                id="inputPasswordConfirm" type="password"
                                                                placeholder="Confirm password" required />
                                                            <label for="inputPasswordConfirm">Confirm Password</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- name 생성 input -->
                                                <div class="form-floating mb-3">
                                                    <input v-model="name" class="form-control" id="inputName"
                                                        type="text" placeholder="Enter your first name" required />
                                                    <label for="inputFirstName">Name</label>
                                                </div>

                                                <!-- email 생성 input -->
                                                <div class="form-floating mb-3">
                                                    <input v-model="email" class="form-control" id="inputEmail"
                                                        type="email" placeholder="name@example.com" required />
                                                    <label for="inputEmail">Email address</label>
                                                </div>


                                                <!-- 회원가입 버튼 -->
                                                <div class="mt-4 mb-0">
                                                    <div class="d-grid"><button type="submit"
                                                            class="btn btn-primary btn-block">Create Account</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        <div class="card-footer text-center py-3">
                                            <div class="small"><a href="/login">이미 계정이 있으신가요? 로그인하러 가기!</a></div>
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
    name: "SignUp",

    data() {
        return {
            id: "",
            pw: "",
            pwChk: "",
            name: "",
            email: "",

            users: [],
            index: -2,
            message: "",
            idChkColor: "",

            darkMode: false,
            fontSize: ""
        }
    },

    mounted() {
        this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
    },

    methods: {

        // 다크모드와 폰트사이즈 설정
        chkMode() {
            const saveMode = localStorage.getItem('darkMode');  // localStroge에서 darkMode 기본 설정 가져오기
            const saveFontMode = localStorage.getItem('fontSize'); // localStroge에서 fontSize 기본 설정 가져오기 

            if (saveMode !== null && saveMode === "true") {  // localStorage는 string만 저장 가능       
                this.darkMode = true;
            }

            if (saveFontMode !== null) {
                this.fontSize = saveFontMode;
            }
        },

        // ID 중복확인
        idCheck() {

            axios.get("/api/", {})
                .then(res => {

                    // ID가 형식에 맞지 않을 경우
                    if (this.id === undefined) {
                        alert('id가 형식에 맞지 않습니다.');
                        return;
                    }
                    else {
                        this.users = res.data;

                    }

                    // 이미 가입되어 있는 ID인지 검색
                    this.index = -1;
                    this.users.forEach((user, i) => {
                        if (this.id === user.id) {
                            this.index = i;
                            return;
                        }
                    });

                    // 중복된 ID가 없는 경우 -> ID 사용 가능, index= -1
                    if (this.index === -1 && this.id !== "") { 

                        this.message = "사용 가능한 ID 입니다.";
                        this.idChkColor = `<span style="color: green;">${this.message}</span>`;

                    // 중복된 ID가 있는 경우 -> ID 사용 불가능
                    } else { 
                        this.message = "사용 불가능한 ID 입니다.";
                        this.idChkColor = `<span style="color: red;">${this.message}</span>`;

                    }
                })
                .catch(err => alert(err))
        },

        // 회원 생성
        account() {

            // ID 중복확인 버튼을 누르지 않았을 경우
            if (this.index === -2) {
                alert("ID 중복확인 버튼을 눌러주세요.");
            }
            // ID가 중복된 경우
            else if (this.index >= 0) {
                alert("중복된 ID는 사용하실 수 없습니다.");
            }
            // 비밀번호가 일치하지 않을 경우
            else if (this.pw !== this.pwChk) {
                alert("비밀번호가 일치하지 않습니다.");
            }
            else if ((this.index === -1) && (this.pw === this.pwChk)) {
                const newUser = { id: this.id, pw: this.pw, name: this.name, email: this.email };

                axios.post("/api/", newUser)
                    .then(res => {
                        alert(newUser.name + "님 가입을 환영합니다.");
                        // login으로 이동
                        this.$router.push('/login');
                    })
                    .catch(err => alert(err));
            }

        }

    }
}
</script>


<style scoped>
#inputID {
    width: 500px;
    float: left;
}

#idChkBtn {
    margin-top: 10px;
}
</style>
