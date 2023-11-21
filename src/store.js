import { createStore } from 'vuex';

const store = createStore({
    state: {
        logged: false,
        baseURL: "http://localhost:8080/api",
        user: {
            id: 0,
            username: "Username",
            photo_url: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
            last_token_key: ""
        }
    },
    mutations: {
        setLogged(state, newValue) {
            state.logged = newValue;
        },
        setUser(state, newValue) {
            state.user = newValue;
        }
    },
    actions: {
        setLoggedAction({ commit }, newValue ) {
            commit('setLogged', newValue);
        },
        setUserAction({ commit }, newValue ) {
            commit('setUser', newValue);
        }
    },
    getters: {
        getLogged: state => state.logged,
        getBaseURL: state => state.baseURL,
        getUser: state => state.user
    }
});

export default store;