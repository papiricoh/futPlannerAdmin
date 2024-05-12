<script setup>
import LoadingBall from '../loading/LoadingBall.vue';
</script>

<script>
import { Chart } from 'highcharts-vue';
export default {
    components: {
        highcharts: Chart
    },
    name: 'ClubChart',
    props: {

    },
    data() {
      return {
        loading: true,
        
        chartOptions: {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Vision general'
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: 'Media'
                }
            },
            series: [
                /*{
                name: 'Tokio',
                data: [4]
                }, {
                name: 'Nueva York',
                data: [42]
                }*/
            ]
        }
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
    <Chart :options="chartOptions"></Chart>
  </div>
</template>

<style scoped>

</style>

