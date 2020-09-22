<template>
	<div>
		<div style=" padding-top: 2rem; padding-left: 1rem">
			<h3 v-for="item in myAnswer" :key="item.index">
				第{{item.index}}题:<span style="padding-left: 0.5rem" v-for="item in item.answer">{{item}}</span>
			</h3>
		</div>
		<div class="btn position-absolute">
			<div class="back_btn d-flex align-items-center justify-content-center" @click="back">返回</div>
		</div>
	</div>
</template>

<script>
	import common from '@/utils/common'

	export default {
		name: 'Result',
		data() {
			return {
				myAnswer: []
			}
		},
		methods: {
			back() {
				common.setLocalStorage('SET_MY_ANSWER', [])
				common.setLocalStorage('SET_CURRENT_INDEX', 0)
				this.$router.replace({path: '/'})
			}
		},
		created() {
			this.myAnswer = common.getLocalStorage('SET_MY_ANSWER')
			console.log(this.myAnswer)
		}
	}
</script>

<style scoped>
	.btn {
		width: 100%;
		height: 4rem;
		bottom: 0;
	}

	.back_btn {
		width: 100%;
		height: 4rem;
		background-color: #ff5767;
		font-size: 1.3rem;
		color: #ffffff;
	}
</style>
