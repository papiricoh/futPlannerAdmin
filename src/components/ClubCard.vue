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

        hover: false,
        
        text_edit: false,
        text_edit_input: "",
      }
    },
    methods: {
      triggerFileInput() {
        // Simula un clic en el input de archivo
        this.$refs.fileInput.click();
      },
      async onFileChange(event) {
        const file = event.target.files[0];

        if (file) {
          console.log(file);

          this.loading = true;
          const formdata = new FormData();
          formdata.append('user_id', this.getUser.id);
          formdata.append('token', this.getUser.last_token_key);
          formdata.append('photo', file);
          formdata.append('type', 'club');
          try {
            const res = await fetch(`${this.$store.getters.getUploadURL}`, {
              method: "post",
              body: formdata,
            });
            if (!res.ok) {
              throw new Error(`An error has occurred: ${res.status} - ${res.statusText}`);
            }
            const data = await res.json();
            
            await this.loadClub();

          } catch (err) {
            //TODO: this.generalError.error = "No conexion error: " + err.message;
          }
        }
      },
      toggleTextEdit() {
        this.text_edit_input = this.club.club_name;
        this.text_edit = true;
      },
      async submmitEdit() {
        if(this.text_edit_input == "") {
          return;
        }
        this.loading = true;
        const postData = {
          user_id: this.getUser.id,
          token: this.getUser.last_token_key,
          name: this.text_edit_input,
        };
        try {
          const res = await fetch(`${this.$store.getters.getBaseURL}/changeClubName/owner`, {
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
          
          await this.loadClub();
          this.text_edit = false;

        } catch (err) {
          //TODO: this.generalError.error = "No conexion error: " + err.message;
        }
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
    <div class="image-container" @mouseover="hover = true" @mouseleave="hover = false">
      <img :src="club.shield_url" alt="" class="cc_img">
      <div class="overlay" v-show="hover" @click="triggerFileInput()">
        <font-awesome-icon class="upload-icon" :icon="['fas', 'pen-to-square']" size="2xl" />
        <input type="file" @change="onFileChange" style="display: none" ref="fileInput">
      </div>
    </div>
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
.image-container {
    height: 10rem;
    width: 10rem;
    border-radius: 2rem;
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

.overlay {
  position: relative;
  z-index: 1;
  top: -10.25rem;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
  border-radius: inherit;
}

.overlay:hover {
  visibility: visible;
  opacity: 1;
}

.upload-icon {
  font-size: 4rem;
  color: white;
}
</style>

