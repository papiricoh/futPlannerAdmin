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
    <div class="data_row">
      <div class="data_box">
        
      </div>
      <div class="data_box">

      </div>
    </div>
  </div>
</template>

<style scoped>
.data_box {
  min-height: 4rem;
  width: 100%;
  border-radius: .2rem;
  padding: .4rem;
  background-color: rgba(128, 128, 128, 0.2);
}
.data_row {
  width: 100%;
  box-sizing: border-box;
  grid: 1rem;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: stretch;
  gap: 1rem;
}
.data_container {
  min-height: 4rem;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
}
.loading_padding {
  padding: 1rem;
}
</style>

