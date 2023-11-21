<script setup>
import Loading from './loading/Loading.vue';
</script>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        loading: true,
      }
    },
    methods: {
      
    },
    computed: {
      
    },
  };
</script>

<template>
  <div class="home">
    <div class="resumeComponent">
      <div v-if="loading">
        <Loading></Loading>
      </div>
      <div v-else>
        HOLA
      </div>
    </div>
    <div class="resumeComponent">
      <div v-if="loading">
        <Loading></Loading>
      </div>
      <div v-else>
        HOLA
      </div>
    </div>

    <div v-if="loading" class="mainBody">
        <Loading></Loading>
    </div>
    <div v-else>
      HELLO
    </div>
  </div>
</template>

<style scoped>
.resumeComponent {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(230, 230, 230);
  border-radius: .3rem;
  box-sizing: border-box;
  padding: 1rem;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mainBody {
  grid-column: 1/3;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  gap: 2rem;
  margin: 1rem;
}
</style>

