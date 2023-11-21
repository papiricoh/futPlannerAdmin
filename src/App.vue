<script setup>
import Cookies from 'js-cookie';
</script>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        page: 'home',

        baseURL: "http://localhost:8080/api",

        loginFase: true,

        user: {
          id: 0,
          username: "Username",
          photo_url: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
          last_token_key: ""
        },


        //LOGIN FORM
        formUsername: "",
        formPassword: "",

        formError: { error: ""},
        generalError: { error: ""},
        
      }
    },
    watch: {
      loginFase(newValue, oldValue) {
        this.$store.dispatch('setLoggedAction', !newValue);
      }
    },
    methods: {
      changeRouter(router) {
        this.$router.push('/'+ router);
      },
      async autologin(user, token) {
        const postData = {
          username: user,
          token: token,
        };
        try {
          const res = await fetch(`${this.baseURL}/logIn/token`, {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postData),
          });
          if (!res.ok) {
            this.formError = await res.json();//Asign error variable
            throw new Error(`An error has occurred: ${res.status} - ${res.statusText}`);
          }
          const data = await res.json();
          if(data.user_type != "owner") {
            console.error("User is not owner");
            throw new Error(`User is not owner`);
          }
          this.postResult = JSON.stringify(data, null, 2);
          

          this.user = data;
          this.$store.dispatch('setUserAction', data);

          if(this.user.photo_url == "") {
            this.user.photo_url = "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
          }

          this.loginFase = false;

        } catch (err) {
          Cookies.remove('authUser');
          Cookies.remove('authToken');
          this.generalError.error = "No conexion error: " + err.message;
        }
      },
      async logIn() {
        const postData = {
          username: this.formUsername,
          password: this.formPassword,
        };
        try {
          const res = await fetch(`${this.baseURL}/logIn`, {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(postData),
          });
          if (!res.ok) {
            this.formError = await res.json();//Asign error variable
            throw new Error(`An error has occurred: ${res.status} - ${res.statusText}`);
          }
          const data = await res.json();
          if(data.user_type != "owner") {
            console.error("User is not owner");
            throw new Error(`User is not owner`);
          }
          this.postResult = JSON.stringify(data, null, 2);
          

          this.user = data;
          this.$store.dispatch('setUserAction', data);
          Cookies.set('authUser', data.username, { expires: 100, path: '' });
          Cookies.set('authToken', data.last_token_key, { expires: 100, path: '' });

          if(this.user.photo_url == "") {
            this.user.photo_url = "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
          }

          this.loginFase = false;
          this.$router.push('/');


        } catch (err) {
          this.generalError.error = "No conexion error: " + err.message;
        }
      }
    },
    computed: {
      
    },
    async created() {
      const user = Cookies.get('authUser');
      const token = Cookies.get('authToken');
      if (token && user) {
        await this.autologin(user, token);
      }
    }
  };
</script>

<template>
  <header>
    <div class="userCard">
      <img :src="user.photo_url" alt="">
      <h2>{{user.username.charAt(0).toUpperCase() + user.username.substring(1)}}</h2>
      <h5>{{user.first_name}} {{user.last_name}}</h5>
    </div>
    <div v-if="page == 'club'" class="headerButtonActive">Club</div>
    <div v-else @click="page = 'club', changeRouter('club')" class="headerButton">Club</div>
    <div v-if="page == 'teams'" class="headerButtonActive">Teams</div>
    <div v-else @click="page = 'teams'" class="headerButton">Teams</div>
    <div v-if="page == 'users'" class="headerButtonActive">Users</div>
    <div v-else @click="page = 'users'" class="headerButton">Users</div>
  </header>

  <RouterView  class="readerPage" />

  <div v-if="loginFase" class="loginPage">
    <div class="loginContainer">
      <h1>FutPlanner</h1>
      <h3>Admin Panel</h3>
      <input v-model="formUsername" placeholder="presidenteEjemploFC" type="text" name="" id="">
      <input v-model="formPassword" placeholder="··············" type="password" name="" id="">
      <div class="formError">{{ formError.error }}</div>
      <div class="forgot">Forgot password</div>
      <button @click="logIn()">Enter</button>
    </div>
  </div>
</template>

<style scoped>
.formError {
  color: darkred;
  font-weight: bold;
  transition: .4s;
}
.loginContainer > button {
  width: 60%;
  height: 3rem;
  font-size: 2rem;
  background-color: transparent;
  border: 2px solid rgb(230, 230, 230);
  border-radius: .4rem;
  cursor: pointer;
  transition: .4s;
}
.loginContainer > button:hover {
  background-color: rgb(230, 230, 230);
  transition: .4s;
}
.loginContainer > button:active {
  background-color: rgb(0, 0, 0);
  color: white;
  transition: .4s;
}
.loginContainer > .forgot {
  text-decoration: none;
  color: #166295;
  cursor: pointer;
}
.loginContainer > input {
  width: 80%;
  height: 3rem;
  font-size: 1rem;
  border: 2px solid rgb(230, 230, 230);
  border-radius: .4rem;
}
.loginContainer {
  min-width: 30rem;
  min-height: 40rem;
  background-color: white;
  border-radius: .4rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.loginPage {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.468);
}
.headerButtonActive{
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .4s;
  font-weight: 500;
  background-color: rgba(0, 0, 0, 0.786);
  cursor: pointer;
}
.headerButtonActive:hover {
  background-color: rgba(0, 0, 0, 0.486);
  transition: .4s;
}

.headerButtonActive:active {
  background-color: rgb(255, 255, 255);
  color: black;
  transition: .4s;
}
.headerButton {
  width: 100%;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .4s;
  font-weight: 500;
  cursor: pointer;
}
.headerButton:hover {
  background-color: rgba(0, 0, 0, 0.486);
  transition: .4s;
  cursor: pointer;
}

.headerButton:active {
  background-color: rgb(255, 255, 255);
  color: black;
  transition: .4s;
  cursor: pointer;
}
.userCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.userCard > img {
  max-width: 50%;
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
