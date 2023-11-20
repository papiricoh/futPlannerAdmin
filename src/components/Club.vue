<script setup>

</script>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        titulo: 'Hola, Vue!'
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
      <div>
        HOLA
      </div>
    </div>
    <div class="resumeComponent">
      <div>
        HOLA
      </div>
    </div>
    <div class="mainBody">HOME</div>
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
}
.home {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  gap: 2rem;
  margin: 1rem;
}
</style>

