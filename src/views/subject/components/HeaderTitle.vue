<template>
	<div class="container text-center">
		<p>{{ title }}</p>
	</div>
</template>

<script>
	export default {
		name: 'HeaderTitle',
		props: {
			title: {
				type: String,
				default: '未知标题'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #ffffff;
		padding: 0.75rem 1.25rem;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		box-shadow: 0 0.19rem 0.44rem 0 rgba(0, 0, 0, 0.08)
	}
</style>
