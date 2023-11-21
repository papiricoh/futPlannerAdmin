import { createStore } from 'vuex';

const store = createStore({
    state: {
        logged: false
    },
    mutations: {
        setLogged(state, newValue) {
            state.logged = newValue;
        }
    },
    actions: {
        setLoggedAction({ commit }, newValue ) {
            commit('setLogged', newValue);
        }
    },
    getters: {
        getLogged: state => state.logged
    }
});

export default store;