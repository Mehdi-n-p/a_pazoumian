import { defineStore } from "pinia";

export const useStatesStore = defineStore('states', {
	state: () => ({
		about: false,
        work_active: false,
        work: 1,
		work_name : ['Black Garden','Aragats', 'Sacha', 'Faubourg Treme', 'Nike'],
		scroll_progress: 0,
		where: "home",
		running: false,
		scrollable: true,
		loading: 0,
		zoom: false
	}),
});

