<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'PlayerData',
    props: {
      player: Object //player and player.team
    },
    data() {
      return {
        loading: true,
        
        
      }
    },
    watch: {
        
    },
    methods: {
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            
            this.loading = false
          }
        }, 400);
      },
    },
    computed: {
      getUser() {
        return this.$store.getters.getUser;
      }
    },
    async mounted() {
      await this.checkUserLoaded();
    }
  };
</script>

<template>
  <div>
    
  </div>
</template>

<style scoped>

</style>

