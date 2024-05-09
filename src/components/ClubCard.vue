<script setup>
import LoadingBall from '../components/loading/LoadingBall.vue';

</script>

<script>
  export default {
    name: 'ClubCard',
    data() {
      return {
        loading: true,
        club: {
            club_name: "Club",
            shield_url: "",
            user_count: 1,
        },
        
        text_edit: false,
        text_edit_input: "",
      }
    },
    methods: {
      toggleTextEdit() {
        this.text_edit_input = this.club.club_name;
        this.text_edit = true;
      },
      async checkUserLoaded() {
        const intervalId = await setInterval(async () => {
          if (this.getUser.id != 0) {
            clearInterval(intervalId);
            this.user = this.getUser;
            await this.loadClub()
          }
        }, 500);
      },
      async loadClub() {
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/club/owner`, {
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
          
          this.club = data;
          this.loading = false;

        } catch (err) {
          //TODO: this.generalError.error = "No conexion error: " + err.message;
        }
      }
    },
    computed: {
      getUser() {
        return this.$store.getters.getUser;
      },
    },
    async mounted() {
      await this.checkUserLoaded();
    }
  };
</script>

<template>
  <div v-if="!loading" class="cc_card">
    <img :src="club.shield_url" alt="" class="cc_img">
    <div class="cc_data_c">
        <div v-if="!text_edit" style="display: flex; gap: 1rem; align-items: center;">
          <div style="font-size: 2rem; font-weight: bold;">{{ club.club_name }}</div>
          <font-awesome-icon @click="toggleTextEdit()" class="cc_edit_btn" :icon="['fas', 'pen-to-square']" size="xl" />
        </div>
        <div v-else style="display: flex; gap: 1rem; align-items: center;">
          <input class="cc_input" v-model="text_edit_input" style="font-size: 2rem; font-weight: bold;" >
          <font-awesome-icon @click="submmitEdit()" class="cc_edit_btn" :icon="['fas', 'check']" size="2xl" />
        </div>
        <div>Cantidad de miembros: {{ club.user_count }}</div>
    </div>
  </div>
  <div v-else class="cc_card" style="align-items: center; justify-content: center;">
    <LoadingBall></LoadingBall>
  </div>
</template>

<style scoped>
.cc_card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin: 1rem;
    min-height: 10rem;
}
.cc_img {
    height: 10rem;
    border-radius: 2rem;
    box-shadow: 0 0 4px black;
}
.cc_data_c {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
.cc_edit_btn {
  cursor: pointer;
}
.cc_edit_btn:active {
  color: rgba(0, 0, 0, 0.541);
}
.cc_input, .cc_input:focus-visible {
  background: none;
  outline: none;
  border: none;
  border-bottom: 2px solid black;
}
</style>

