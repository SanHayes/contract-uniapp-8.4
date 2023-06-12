import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		title: ''
	},
	getters: {
		title: state => {
			return state.title
		}
	},
	mutations: {
		setTitle(state, payload) {
			state.title = payload.title
		},
	}
})

export default store