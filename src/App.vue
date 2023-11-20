<script setup>

</script>

<script>
  export default {
    name: 'Main',
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
  <header>
    <div class="userCard">
      <img src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" alt="">
      <h2>Username</h2>
    </div>
    <div class="headerButton">Home</div>
    <div class="headerButton">Club</div>
    <div class="headerButton">Teams</div>
    <div class="headerButton">Users</div>
  </header>

  <RouterView  class="readerPage" />
</template>

<style scoped>
.headerButton {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .4s;
  font-weight: 500;
}
.headerButton:hover {
  background-color: rgba(0, 0, 0, 0.486);
  transition: .4s;
}

.headerButton:active {
  background-color: rgb(255, 255, 255);
  color: black;
  transition: .4s;
}
.userCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.userCard > img {
  max-width: 40%;
  aspect-ratio: 1/1;
  border-radius: 100%;
}
header {
  display: flex;
  flex-direction: column;
  width: min-content;
  width: 100%;
  overflow: auto;
  word-break: break-all;
  background-color: rgb(50, 50, 50);
  box-shadow: 3px 0 8px rgba(0, 0, 0, 0.486);
  color: rgb(200, 200, 200);
}

</style>
