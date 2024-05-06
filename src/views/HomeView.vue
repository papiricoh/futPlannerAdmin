<script setup>
import ClubCard from '../components/ClubCard.vue';
</script>

<script>
  export default {
    name: 'HomeView',
    data() {
      return {
        
        
      }
    },
  };
</script>

<template>
  <main>
    <div>
      <ClubCard></ClubCard>
    </div>
    <div class="hv_hero">
      <div style="font-size: 1.6rem;">Bienvenido a el panel de control de <b>FutPlanner</b></div>
      <div class="hv_body">Desde aqui puedes organizar tanto los usuarios de tu club como asignar a los jugadores y entrenadores a sus equipos, crear equipos nuevos y modificarlos.</div>
      <div class="hv_body">Añade, modifica o crea equipos en el club usando el apartado EQUIPOS</div>
      <div class="hv_body">Añade, modifica o crea usuarios en el club usando el apartado USUARIOS</div>
    </div>
  </main>
</template>

<style scoped>
.hv_hero {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 1.2rem;
  padding: 2rem 2rem;
  background: rgb(0,100,0);
  background: linear-gradient(-90deg, rgba(0,100,0,1) 0%, rgba(7,134,7,1) 100%);
  color: rgb(240, 240, 240);
  box-shadow: inset 4px 2px 4px rgba(0, 0, 0, 0.25);
  gap: 1.4rem;
}
.hv_body {
  margin: 0 24vw;
  text-align: center;
}
</style>

