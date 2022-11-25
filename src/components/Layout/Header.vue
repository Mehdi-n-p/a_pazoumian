<template>
    <nav 
        id="nav"
        :class="{pointer_all: statesStore.scrollable === false}">
        <a 
            id="ap"
            class="ap" 
            href="/">
            <div>
                <div>Alexis Pazoumian</div>
            </div>
        </a>
        <a id="link_menu" href="/" @click="statesStore.about = !statesStore.about; about_text()">
            <div>
                <div>About</div>
            </div>
            <div>
                <div>Close</div>
            </div>
        </a>
        <a class="cross" id="cross" href="/">
            <div>
                <div>&larr; Projects</div>
            </div>
            <div>
                <div>&larr; Gallery</div>
            </div>
        </a>
    </nav>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from "gsap";
// import router from '@/router';
import { useStatesStore } from '@/store/states';
// eslint-disable-next-line
const statesStore = useStatesStore();

onMounted(() => {
    document.getElementById('link_menu').addEventListener('click', event => {
        event.preventDefault();
    });
});

function about_text() {
    if (statesStore.about) {
        gsap.to(document.querySelectorAll('#link_menu > div:nth-child(1) > div'), {duration: 0.4, delay: 0, translateY: -120 + "%"});
        gsap.to(document.querySelectorAll('#link_menu > div:nth-child(2) > div'), {duration: 0.4, delay: 0, translateY: 0 + "%"});
        // router.push({ path: '/about' });
    }
    else if (!statesStore.about) {
        gsap.to(document.querySelectorAll('#link_menu > div:nth-child(1) > div'), {duration: 0.4, delay: 0, translateY: 0 + "%"});
        gsap.to(document.querySelectorAll('#link_menu > div:nth-child(2) > div'), {duration: 0.4, delay: 0, translateY: 120 + "%"});
        // router.go(-1);
    }
}
</script>


<style scoped>
nav#nav { 
    position: absolute;  
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    letter-spacing: 2px;
    font-size: 1em;
    pointer-events: none;
}

#nav.pointer_all {
    pointer-events: all;
}

.ap {
    position: absolute;
    top: 3rem;
    left: 3rem;
    opacity: 1;
    transition: all 1s ease-out;
    font-weight: 400;
    font-size: 1.2em;
    letter-spacing: 1px;
    pointer-events: all;
}

.ap > div {
    overflow: hidden;
    transform-origin: center;
}

.ap > div > div {
    transform: translateY(120%);
}

#link_menu {
    font-size: 1.2em;
    font-weight: 400;
    letter-spacing: 1px;
    position: absolute;
    top: 3rem;
    right: 3rem;
    pointer-events: all;
    display: flex;
    justify-content: center;
    align-items: center;
        /* transform: rotate(-90deg);
    transform-origin: bottom light; */
}

#link_menu:hover {
    cursor: pointer;
}

#link_menu > div {
    overflow: hidden;
    transform: rotate(-90deg);
    transform-origin: center right;
}

#link_menu > div:not(:first-child) {
    position: absolute;
}

#link_menu > div > div {
    transform: translateY(120%);
}

.cross {
    visibility: hidden;
    position: absolute;
    opacity: 0;
    top: 3rem;
    left: 50%;
    transition: visibility 0s, 0.5s opacity 1s ease-out;
    transform: translateX(-50%);
    pointer-events: all;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cross-active {
    visibility: visible;
    opacity: 1;
}

.cross > div {
    overflow: hidden;
}

.cross > div:not(:first-child) {
    position: absolute;
}

.cross > div:not(:first-child) > div {
    transform: translateY(100%);
}
</style>