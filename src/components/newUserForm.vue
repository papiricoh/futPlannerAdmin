<script setup>
import LoadingBall from './loading/LoadingBall.vue';
</script>

<script>
  export default {
    name: 'UserForm',
    data() {
      return {
        loading: false,

        //Form parts
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        date_of_birth: "2000-01-01",

      }
    },
    props: {
        type: String,
        club_id: Number
    },
    methods: {
      async submitNewUser() {
        if(!this.loading && this.username != "" && this.password != "" && this.first_name != "") {
          this.loading = true;
          
          const postData = {
            username: this.username,
            password: this.password,
            first_name: this.first_name,
            last_name: this.last_name,
            date_of_birth: this.date_of_birth,
            type: this.type,
            club_id: this.club_id,
          };
          try {
            const res = await fetch(`${this.$store.getters.getBaseURL}/newUser`, {
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
            console.log(data)

            this.$emit('reload')
            this.loading = false;

          } catch (err) {
            //TODO: this.generalError.error = "No conexion error: " + err.message;
          }
        }
      }
    }
    
  };
</script>

<template>
    <div class="new_form">
        <hr>
        <div class="f_username_c">
            <b>Nombre de Usuario</b>
            <input v-model="username" type="text" placeholder="Username">
        </div>
        <div class="f_username_c">
            <b>Contraseña</b>
            <input v-model="password" type="password" placeholder="************">
        </div>
        <div class="f_username_c">
            <b>Nombre</b>
            <input v-model="first_name" type="text" placeholder="Juan">
        </div>
        <div class="f_username_c">
            <b>1er Apellido</b>
            <input v-model="last_name" type="text" placeholder="Perez">
        </div>
        <div class="f_username_c">
            <b>Fecha nacimiento</b>
            <input v-model="date_of_birth" type="date">
        </div>
        <div class="add_button" v-if="type == 'trainer'" @click="submitNewUser()">
          <div v-if="!loading">+ Añadir entrenador</div>
          <LoadingBall v-else></LoadingBall>
        </div>
        <div class="add_button" v-else @click="submitNewUser()">
          <div v-if="!loading">+ Añadir jugador</div>
          <LoadingBall v-else></LoadingBall>
        </div>
    </div>
</template>

<style scoped>
.add_button {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: white;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .4s;
  border-radius: .4rem;
}
.add_button:hover {
  color: black;
  background-color: white;
}
.add_button:active {
  color: white;
  background-color: black;
}
.f_username_c {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 4rem;
  gap: .6rem;
}
input {
  font-size: 1.2rem;
  width: 60%;
  padding: .4rem 1rem;
}
input:focus-visible {
  outline: none;
}
.new_form {
  display: flex;
  gap: .6rem;
  flex-direction: column;
}
</style>
