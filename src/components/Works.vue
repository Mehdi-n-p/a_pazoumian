<template>
  <div class="works">
    <article
      v-for="(item, index) in works"
      data-scroll-container
			:key="item" 
      class="work"
      :class="[{ is_active: (statesStore.work === index + 1) && statesStore.work_active }, 'work_' + (index + 1)]">
      <section 
        data-scroll-section
        class="work_in">
        <div 
          v-for="(item_2, index_2) in works[index]"
          :key="item_2.src"
          class="picture_container"
          :class="[(statesStore.work === index + 1) && statesStore.work_active === true ? '' : 'is_hidden', index_2 % 2 === 0 ? 'od' : 'ev']"
          :id="`pc_${index + 1}_${index_2 + 1}`"
          @click="gallery($event, false)"
          :style="`margin-left: ${item_2.left};margin-top: ${item_2.top}`">
          <img 
            data-scroll-speed="3"
            :src="require(`@/assets/img/${item_2.src}`)"
            @load="load_img()"/>
        </div>
      </section>
    </article>
    <div class="work_mask"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import LocomotiveScroll from 'locomotive-scroll';
import { useStatesStore } from '@/store/states';
import { storeToRefs } from 'pinia';
import { gsap } from "gsap";
// eslint-disable-next-line
const statesStore = useStatesStore();
const { where } = storeToRefs(statesStore);
const { about } = storeToRefs(statesStore);
 
const works = [
  [
    {src: "black_garden/BG_1.jpg", left: "20vw", top: "20vh"},
    {src: "black_garden/BG_2.jpg", left: "6vw", top: "-20vh"},
    {src: "black_garden/BG_3.jpg", left: "6vw", top: "20vh"},
    {src: "black_garden/BG_5.jpg", left: "6vw", top: "-20vh"},
    {src: "black_garden/BG_1.jpg", left: "6vw", top: "20vh"}
  ],
  [
    {src: "black_garden/BG_1.jpg", left: "20vw", top: "20vh"},
    {src: "black_garden/BG_2.jpg", left: "6vw", top: "-20vh"},
    {src: "black_garden/BG_2.jpg", left: "6vw", top: "20vh"},
    {src: "black_garden/BG_5.jpg", left: "6vw", top: "-20vh"},
    {src: "black_garden/BG_1.jpg", left: "6vw", top: "20vh"}
  ]
];

var works_size = 0;
for (let i = 0; i < works.length; i++){
  for (let l = 0; l < works[i].length; l++) {
    works_size++;
  }
}

var scrolls = [];
var pc_target = null;


onMounted(() => {


for (let i = 0; i < works.length; ++i) {

  scrolls[i] = new LocomotiveScroll({
    el: document.querySelector('.work_' + (i + 1)),
    smooth: true,
    direction: "horizontal"
  });

  scrolls[i].on('scroll', ({ limit, scroll }) => {
  statesStore.scroll_progress = scroll.x / limit.x;
  });

}

document.getElementById('cross').addEventListener('click', event => {
  event.preventDefault();

  if (statesStore.zoom === false) {

    statesStore.scrollable = false; 
    scrolls[statesStore.work - 1].scrollTo(0, {'callback' : function(){ 
    statesStore.where = "home"; 
    statesStore.work_active = false; 
    }});

    }

  if (statesStore.zoom === true) {

    gallery(pc_target, true);

    }

});

});

watch(where, () => {
    if (statesStore.where === "home") {
      gsap.to('.work_' + statesStore.work, {delay: 1.5, visibility: "hidden"});
    }
    else if (statesStore.where === "work") {
      gsap.to('.work_' + statesStore.work, {visibility: "visible"});
    }
});

watch(about, () => {
  if (statesStore.about && statesStore.where === "work") {
    gsap.to('.work_mask', {duration: 0.5, opacity: 1, ease: 'power2.inOut'});
    gsap.to('.work_' + statesStore.work + ' .picture_container', {duration: 0.5, marginTop: 0, ease: 'power2.inOut'});
  }
  else if (statesStore.about === false && statesStore.where === "work") {
    gsap.to('.work_mask', {delay: 0.5, duration: 0.5, opacity: 0, ease: 'power2.inOut'});
    gsap.to('.work_' + statesStore.work + ' .picture_container.od', {delay: 0.2, duration: 0.8, marginTop: "+=20vh", ease: 'power2.inOut'});
    gsap.to('.work_' + statesStore.work + ' .picture_container.ev', {delay: 0.2, duration: 0.8, marginTop: "-=20vh", ease: 'power2.inOut'});
  }
});

function load_img() {
  statesStore.loading += (1/works_size * 75);
}

function gallery(event, back_from_menu) {
  
  if (statesStore.zoom === false && back_from_menu === false) pc_target = event.target.offsetParent.id;

  var offsets = document.getElementById(pc_target).getBoundingClientRect();
  var top = offsets.top;
  var left = offsets.left;

  var height = document.getElementById(pc_target).offsetHeight;
  var width = document.getElementById(pc_target).offsetWidth;

  var scale = (window.innerHeight*0.9)/height;

  var center_img_h = top + (height/2);
  var center_img_w = left + (width/2);
  var center_window_h = window.innerHeight/2;
  var center_window_w = window.innerWidth/2;
  var originY = (center_window_h - center_img_h) * scale;
  var originX = (center_window_w - center_img_w) * scale;

  if (statesStore.zoom === false && back_from_menu === false) {

    statesStore.zoom = true;
    scrolls[statesStore.work - 1].stop()

    gsap.to('#' + pc_target + ' img', {duration: 0.3, scaleX : 2, scaleY: 2, ease: 'power2.inOut'});
    gsap.to('.works', {delay: 0.2, duration: 0.8, scaleX: scale, scaleY: scale, ease: 'power2.inOut'});
    gsap.to('.works', {delay: 0.2, duration: 0.8, translateY: originY + "px", translateX: originX + "px", ease: 'power2.inOut'});
    gsap.to('#' + pc_target + ' img', {delay: 0.5, duration: 0.2, scaleX : 1, scaleY: 1, ease: 'power2.inOut'});

    gsap.to(document.querySelectorAll('.cross > div:nth-child(1) > div'), {duration: 0.4, delay: 0.6, translateY: -100 + "%"});
    gsap.to(document.querySelectorAll('.cross > div:nth-child(2) > div'), {duration: 0.4, delay: 0.6, translateY: 0 + "%"});

  }

  else if (statesStore.zoom === true && back_from_menu === true) {

    statesStore.zoom = false;

    gsap.to('#' + pc_target + ' img', {duration: 0.3, scaleX : 2, scaleY: 2, ease: 'power2.inOut'});
    gsap.to('.works', {delay: 0, duration: 0.8, scaleX: 1, scaleY: 1, ease: 'power2.inOut'});
    gsap.to('.works', {delay: 0, duration: 0.8, translateY: 0, translateX: 0, ease: 'power2.inOut',
      onComplete: () => {scrolls[statesStore.work - 1].start()}});
    gsap.to('#' + pc_target + ' img', {delay: 0.5, duration: 0.2, scaleX : 1, scaleY: 1, ease: 'power2.inOut'});

    gsap.to(document.querySelectorAll('.cross > div:nth-child(1) > div'), {duration: 0.4, delay: 0.6, translateY: 0 + "%"});
    gsap.to(document.querySelectorAll('.cross > div:nth-child(2) > div'), {duration: 0.4, delay: 0.6, translateY: 100 + "%"});
  }
}


</script>

<style scoped>
.works {
  z-index: 3;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  transition: opacity 1s ease-out;
}

article.work {
  visibility: hidden;
  left: 0;
  position: absolute;
  min-width: 100%;
  height: 100vh;
}

/* article.work.is_active {
  visibility: visible;
} */

.work_in {
  opacity: 1;
  min-width: 100%;
  width: auto;
  height: 100%;
  display: inline-flex !important;
  align-items: center;
  padding-right: 6vw;
}

.picture_container {
  position: relative;
  width: 20vw;
  min-width: 250px;
  height: auto;
  overflow: hidden;
  display:flex;
  transition: transform 1.5s cubic-bezier(0.250, 0.250, 0.000, 0.975);
  cursor: pointer;
}

.picture_container > img {
  width: 25vw;
  min-width: 250px;
  height: auto;
  transition: transform 1.5s cubic-bezier(0.250, 0.250, 0.000, 0.975);
}

.work_mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  background: #000;
  opacity: 0;
  pointer-events: none;
}

#pc_1_1.is_hidden, #pc_2_1.is_hidden {
  transform: translate(-50vw, 0vh) scale(2);
}

#pc_1_2.is_hidden, #pc_2_2.is_hidden {
  transform: translate(0vw, -70vh) scale(1);
}

#pc_1_3.is_hidden, #pc_2_3.is_hidden {
  transform: translate(0vw, 70vh) scale(1);
}

#pc_1_4.is_hidden, #pc_2_4.is_hidden {
  transform: translate(20vw, 0vh) scale(1);
}

#pc_1_1, #pc_1_1 > img, #pc_2_1, #pc_2_1 > img {
  transition-duration: 1.5s;
}

#pc_1_2, #pc_1_2 > img, #pc_2_2, #pc_2_2 > img {
  transition-duration: 1.7s;
}

#pc_1_3, #pc_1_3 > img, #pc_1_4, #pc_1_4 > img, #pc_2_3, #pc_2_4 > img {
  transition-duration: 1.9s;
}

.picture_container.is_hidden > img {
  transform: scale(20);
}
</style>