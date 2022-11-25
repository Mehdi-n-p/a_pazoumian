<template>
  <Header />
  <Home />
  <Works />
  <About/>
</template>

<script setup>
import Header from './components/Layout/Header.vue';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Works from './components/Works.vue';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useStatesStore } from '@/store/states';

const statesStore = useStatesStore();

onMounted(() => {
	// statesStore.getData();
});

</script>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
