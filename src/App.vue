<template>
  <div id="app">
    <GraphsComp />
  </div>
</template>

<script>
import GraphsComp from './components/GraphsComp.vue';
import HomeView from './views/HomeView.vue';

export default {
  name: 'App',
  components: {
    GraphsComp, HomeView
  },
};
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
