<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'TeamData',
    data() {
      return {
        loading: true,
        user: {},

        
      }
    },
    methods: {
      async loadTeamData() {
        this.loading = false;
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            await this.loadTeamData();
          }
        }, 1000);
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
  <div v-if="loading">
    <LoadingBall class="loading_padding"></LoadingBall>
    
  </div>
  <div class="data_container" v-else>

  </div>
</template>

<style scoped>
.data_container {
  background-color: black;
  height: 4rem;
  width: 100%;
}
.loading_padding {
  padding: 1rem;
}
</style>

