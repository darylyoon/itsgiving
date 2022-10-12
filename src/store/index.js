import { createStore } from "vuex";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

const store = createStore({
  state: {
    user: null,
    authState: false,
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setAuthState(state, payload) {
      state.authState = payload;
    },
  },
  actions: {
    async login({ commit }, payload) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      if (userCredential) {
        commit("setUser", userCredential.user);
        commit("setAuthState", true);
      } else {
        throw new Error("Login failed");
      }
    },
    logout({ commit }) {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          commit("setUser", null);
        })
        .catch((error) => {
          // An error happened.
          throw new Error(error.message);
        });
    },
    async signup({ commit }, payload) {
      const response = await createUserWithEmailAndPassword(
        auth,
        payload.email,
        payload.password
      );
      if (response) {
        // Signed in
        const user = response.user;
        updateProfile(user, {
          displayName: payload.userName,
        });
        commit("setUser", user);
        // ...
      } else {
        throw new Error("Could not complete Signup");
      }
    },
  },
  modules: {},
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    store.commit("setUser", user);
    console.log("user state changed", user);
    store.commit("setAuthState", true);
  } else {
    store.commit("setUser", null);
    store.commit("setAuthState", false);
  }
});

export default store;
