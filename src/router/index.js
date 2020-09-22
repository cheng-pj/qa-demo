import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Index',
		component: () => import('@/views/subject/index'),
		meta: {title: '图标'}
	}, {
		path: '/result',
		name: 'Result',
		component: () => import('@/views/subject/result')
	}
]

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

export default router
