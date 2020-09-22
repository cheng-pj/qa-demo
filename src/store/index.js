import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		currentIndex: 0,
		myAnswer: []
	},
	mutations: {
		SET_CURRENT_INDEX: (state, currentIndex) => {
			state.currentIndex = currentIndex
		},
		SET_MY_ANSWER: (state, myAnswer) => {
			state.myAnswer = myAnswer
		}
	},
	actions: {},
	modules: {}
})
