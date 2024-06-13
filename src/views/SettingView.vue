<template>
    <div>
        <body class="bg-primary">
        <div id="layoutAuthentication" :class="[darkMode ? 'dark-mode' : '', fontSize == 'small' ? 'small-mode':'', fontSize == 'medium' ? 'medium-mode':'', fontSize == 'large' ? 'large-mode':'']">
            <div id="layoutAuthentication_content">

                <main>
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-lg-7">
                                <div class="card shadow-lg border-0 rounded-lg mt-5">
                                    <div class="card-header"><h3 class="text-center font-weight-light my-4">App Setting</h3></div>
                                    <div class="card-body">
                                        <form @submit.prevent="update">

                                            <!-- -----------프로필 설정 부분----------- -->
                                            <h3>프로필 설정</h3>
                                            <!-- ID 보여주는 input -->
                                            <div class="form-floating mb-3">
                                                <input v-model="localId" class="form-control" id="inputID" type="text" placeholder="Disabled input" disabled/>
                                                <label for="inputID">ID</label>
                                            </div>

                                            <!-- pw 생성 및 재확인 input -->
                                            <div class="row mb-3">
                                                <div class="col-md-6">
                                                    <div class="form-floating mb-3 mb-md-0">
                                                        <input v-model="pw" class="form-control" id="inputPassword" type="password" placeholder="Create a password" required/>
                                                        <label for="inputPassword">Password</label>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-floating mb-3 mb-md-0">
                                                        <input v-model="pwChk" class="form-control" id="inputPasswordConfirm" type="password" placeholder="Confirm password" required/>
                                                        <label for="inputPasswordConfirm">Confirm Password</label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <!-- name 생성 input -->
                                            <div class="form-floating mb-3">
                                                <input v-model="name" class="form-control" id="inputName" type="text" placeholder="Enter your first name" required/>
                                                <label for="inputFirstName">Name</label>
                                            </div>
                                            
                                            <!-- email 생성 input -->
                                            <div class="form-floating mb-3">
                                                <input v-model="email" class="form-control" id="inputEmail" type="email" placeholder="name@example.com" required/>
                                                <label for="inputEmail">Email address</label>
                                            </div>

                                            <!-- 업데이트 버튼 -->
                                            <div class="mt-4 mb-0">
                                                
                                                <div class="d-grid"><button type="submit" class="btn btn-primary btn-block">Update</button></div>
                                            </div>

                                            <br/><hr/><br/>

                                        </form>

                                        <!-- -----------앱 설정 부분----------- -->
                                        <h3>앱 설정</h3>

                                        <!-- 다크모드 스위치 -->
                                        <div class="form-check form-switch">
                                            <label class="form-check-label" for="darkMode">다크모드</label>
                                            <input v-model="darkMode" class="form-check-input" type="checkbox" role="switch" id="darkMode">
                                        </div>

                                        <!-- 글자크기 설정 버튼 -->
                                        <div class="mt-4 mb-0">
                                            <label class="form-check-label" for="fontBtn">글자크기 설정</label><br/>
                                            <button @click="fontSet($event)" value="small" class="btn btn-outline-primary btn-sm" id="fontBtn-sm">작게</button> &nbsp;
                                            <button @click="fontSet($event)" value="medium" class="btn btn-outline-primary" id="fontBtn-md">중간</button> &nbsp;
                                            <button @click="fontSet($event)" value="large" class="btn btn-outline-primary btn-lg" id="fontBtn-lg">크게</button>
                                        </div>
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
    name: "Setting",
    inject: ["isLoggedIn", "localId"],

    data(){
        return{

            pw: "",
            pwChk: "",
            name: "", 
            email: "",

            user: [],
            index: 0,
            
            darkMode: false,
            fontSize: ""
        }
    },

    mounted() {

        this.chkMode(); // mount시 darkMode 여부와 fontSize 판별
        this.previewInfo(); // mount시 로그인된 id의 정보 불러오기
    },

    methods:{

        // darkMode 작동
        chkMode() {

            const saveMode = localStorage.getItem('darkMode');
            const saveFontMode = localStorage.getItem('fontSize');

            if(saveMode !== null && saveMode === "true") {  // localStorage는 string만 저장 가능       
                this.darkMode = true;
            }

            if(saveFontMode !== null) {
                this.fontSize = saveFontMode;
            }

        },


        // 로그인된 정보를 미리 input에 띄워 정보 수정이 용이하도록 함
        previewInfo(){ 
            
            // 로그인이 된 상태에서만 preview시킬 정보 불러오기
            if( this.isLoggedIn === true ) {  
                
                axios.get("/api/" + this.localId)
                    .then(res => {
                        this.user = res.data;
                        console.log('previewInfo: ' + JSON.stringify(this.user));

                        this.pw = this.user.pw;
                        this.name = this.user.name;
                        this.email = this.user.email;
                    })
                    .catch(err=>alert(err))

            }
        },
        
        // 회원정보 수정
        update(){ 
            
            // 비밀번호 재확인
            if(this.pw !== this.pwChk){
                alert("비밀번호가 일치하지 않습니다.");
            }
            else if(this.pw === this.pwChk){
                const setUser = { id:this.localId, pw:this.pw, name:this.name, email:this.email };
                console.log(setUser);

                axios.patch("/api/" + this.localId, setUser)
                    .then(res=>{
                        console.log('response:', res.data);
                        alert("회원정보가 성공적으로 수정되었습니다.");
                        // Home으로 이동
                        this.$router.push('/');
                    })
                    .catch(err=>alert(err))
                
            }

        },

        // 앱의 글자 크기 설정을 핸들링
        fontSet(event) {
            // 버튼의 value를 가져옴
            this.fontSize = event.target.value;
            console.log(this.fontSize);
        }

    },

    watch: {
        darkMode(changeMode) {  // darkMode변경
            localStorage.setItem('darkMode', changeMode);
        },

        fontSize() {
            localStorage.setItem('fontSize', this.fontSize);
        }
    }
}
</script>


<style scoped>
    h1{
        text-align: center;
    }
</style>
