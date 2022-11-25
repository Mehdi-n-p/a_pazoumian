import { createRouter, createWebHistory } from 'vue-router';


// Pages
import Home from '../components/Home.vue';

// Router
const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		// alias: '/about'
	},
	{
		path: '/about',
		name: 'About',
		component: Home,
	},
	{
		path: '/work/:work_name',
		name: 'Work',
		component: Home,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
