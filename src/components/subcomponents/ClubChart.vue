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
            {
              name: 'Rendimiento General',
              data: []
            }, {
              name: 'Rendimiento Tactico',
              data: []
            }, {
              name: 'Calidad de pases',
              data: []
            }, {
              name: 'Control de balón',
              data: []
            }, {
              name: 'Vision de juego',
              data: []
            }, {
              name: 'Tiempo medio de juego',
              data: []
            }
          ]
        }
      }
    },
    watch: {
        
    },
    methods: {
      async getClubAnalytics() {
        if(this.text_edit_input == "") {
          return;
        }
        this.loading = true;
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/getClubAnalytics/owner`, {
            method: "post",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(postData),
          });
          if (!res.ok) {
            throw new Error(`An error has occurred: ${res.status} - ${res.statusText}`);
          }
          const data = await res.json();

          for (const team of data) {
            if(team.total_reports != 0) {
              this.chartOptions.xAxis.categories.push(team.team_name)
              
              this.chartOptions.series[0].data.push(Number(team.avg_general_performance))
              this.chartOptions.series[1].data.push(Number(team.avg_tactical_performance))
              this.chartOptions.series[2].data.push(Number(team.avg_passes_quality))
              this.chartOptions.series[3].data.push(Number(team.avg_ball_control))
              this.chartOptions.series[4].data.push(Number(team.avg_game_vision))
              this.chartOptions.series[5].data.push(Number(team.avg_played_time))
            }
          }

          this.loading = false;

        } catch (err) {
          //TODO: this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            
            await this.getClubAnalytics()
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

