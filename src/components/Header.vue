<template>

    <nav class="navbar navbar-expand-md navbar-dark mt-2" style="background-color: #212529; border-bottom: 2px solid #DC392D; height: 80px;">
        <span class="navbar-brand"><h1>👛</h1></span>
        

        <div :class="navClass">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">홈</router-link>
                </li>
                &nbsp;&nbsp;&nbsp;
                <li class="nav-item">
                    <router-link class="nav-link" to="/total">조회</router-link>
                </li>
                &nbsp;&nbsp;&nbsp;
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="/setting">Setting</a></li>
                        <li><hr class="dropdown-divider" /></li>
                        <li><a class="dropdown-item" @click="logout">Logout</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
    
</template>


<script>
export default {
    name: "Header",

    methods: {
        logout() {
            localStorage.removeItem("loginID");
            // Home으로 이동
            this.$router.push('/');
        }
    }
}
</script>


<style>
</style>