<script setup>

</script>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        page: 'club',

        baseURL: "http://localhost:8080/api",

        loginFase: true,

        user: {
          id: 0,
          username: "Username",
          last_token_key: ""
        },


        //LOGIN FORM
        formUsername: "",
        formPassword: "",

        formError: "",
        
      }
    },
    methods: {
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

          this.loginFase = false;

        } catch (err) {
          this.postResult = err.message;
        }
      }
    },
    computed: {
      
    },
  };
</script>

<template>
  <header>
    <div class="userCard">
      <img src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" alt="">
      <h2>{{user.username}}</h2>
    </div>
    <div v-if="page == 'club'" class="headerButtonActive">Club</div>
    <div v-else @click="page = 'club'" class="headerButton">Club</div>
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
      <input v-model="formPassword" placeholder="***************" type="password" name="" id="">
      <div class="forgot">Forgot password</div>
      <button @click="logIn()">Enter</button>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 40%;
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
