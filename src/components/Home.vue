<template>
  <div id="three"></div>

  <div id="loading-percent" class="loading-percent is-loading"></div>

  <div id="loader-container" class="loader-container is-loading">
    <div id="loading-line" class="loading-line is-loading"></div>
  </div>

  <div id="the_titles">
    <div 
      v-for="(item, index) in statesStore.work_name"
      :key="item"
      class="title-container">
      <div>{{statesStore.work_name[index]}}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import * as THREE from "three";
import { gsap } from "gsap";
import router from '@/router';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useStatesStore } from '@/store/states';
import vertexShader_1 from "@/glsl/vertex_1.js";
import fragmentShader_1 from "@/glsl/fragment_1.js";
// eslint-disable-next-line
const statesStore = useStatesStore();

const { scroll_progress } = storeToRefs(statesStore);
const { where } = storeToRefs(statesStore);
const { loading } = storeToRefs(statesStore);
const { about } = storeToRefs(statesStore);





//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GUI } from '/node_modules/dat.gui/build/dat.gui.module.js';
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// import * as SceneUtils from "https://cdn.skypack.dev/three@0.136.0/libs/three/utils/SceneUtils.js";
// Problème : pourquoi tout ça marche pas avec NPM ptin ! Je me suis arraché les balls sur ça
// Il faut en tout cas linker la même librairie en terme de source/version



let scene = new THREE.Scene(); // Lance scène
let camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 1, 1000); // perspective (frustrum cone de vue)
camera.position.set(0, 0, 20).setLength(29); // Position caméra, on peut décaler par ex 
let renderer = new THREE.WebGLRenderer({antialias: true}); // Lissage
renderer.setSize(innerWidth, innerHeight); // Taille du renderer
let bg_color = "#000";
renderer.setClearColor(bg_color); // Couleur renderer
var clock = new THREE.Clock();

var path;
var hover;
var hovered_mesh;
var responsive_z_sphere_front;

onMounted(() => {
  document.getElementById("three").appendChild(renderer.domElement); // Hop on le crée dans le body

    window.addEventListener('resize', function() {
		resize();
	}, true);
}); 

onMounted(async () => {
  await router.isReady()
  path = router.currentRoute.value.fullPath;
  if (path.includes("about")) {
    statesStore.about = true;
  }
});

// On click
var raycaster = new THREE.Raycaster();
// eslint-disable-next-line no-unused-vars
var mouse = new THREE.Vector2(), INTERSECTED;
document.addEventListener( 'mousedown', onDocumentMouseDown, false );  
document.addEventListener( 'mousemove', onDocumentMouseMove, false );  
// let controls = new OrbitControls(camera, renderer.domElement);
// let light = new THREE.PointLight();

// scene.add(light, new THREE.AmbientLight(0xffffff, 1));
// scene.add(new THREE.GridHelper(28, 20, "yellow", "white")); // Grid helper
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// 1 = home ; 2 = Projet gallerie ; 3 = Zoom projet ; 4 = About




var manager = new THREE.LoadingManager();
manager.onProgress = function ( item, loaded, total ) {
  statesStore.loading += (loaded - (loaded - 1))/total*25;
  // console.log(statesStore.loading);
};

// FINI

manager.onLoad = function ( ) {


  
  };


  // // Alourdir loading
  // function addRandomPlaceHoldItImage(){
  //   var r = Math.round(Math.random() * 4000);
  //   new THREE.ImageLoader(manager).load('//picsum.photos/2000/2000');
  // }
  // for(var i = 0; i < 10; i++) addRandomPlaceHoldItImage();


  
window.addEventListener("wheel", function() {
  if (statesStore.where === "home" && statesStore.about === false) {
    scroll_all();
  }
});




let params ={
	bendDepth: 3.7
}

// var ratio_parfait = (929 * 100) / 1920;
var ratio_window = (window.innerHeight * 100) / window.innerWidth;
responsive_z_sphere_front = 23.5 - (ratio_window/10)*3.5;
// if (ratio_window === ratio_parfait) responsive_z_sphere_front = 7;
// else if (ratio_window < ratio_parfait) responsive_z_sphere_front = 7 * (ratio_parfait/ratio_window);
// else if (ratio_window > ratio_parfait) responsive_z_sphere_front = 7 * (ratio_parfait/ratio_window);


// Nom, x, y, z, opacité, parent
var config_spheres = [
  ["sphere_front", 0, 0, responsive_z_sphere_front, 0, null],
  ["sphere_back", 0, 0, responsive_z_sphere_front - 10, 0, null], 
  ["sphere_front_1", 0, 0, 0, 0, 0], 
  ["sphere_front_2", 0, 0, 0, 0, 0],
  ["sphere_front_3", 0, 0, 0, 0, 0],
  ["sphere_front_4", 0, 0, 0, 0, 0],
  ["sphere_front_5", 0, 0, 0, 0, 0]
];

console.log(responsive_z_sphere_front, window.innerHeight, window.innerWidth, ratio_window);

var spheres = [];

for (let i = 0; i < config_spheres.length; ++i) {

  let geometry_sphere = new THREE.SphereGeometry( 0, 0, 16 ); //0.5, 4
  let material_sphere = new THREE.MeshBasicMaterial( { wireframe: true, color: 0xFF4848, transparent: true, opacity: config_spheres[i][4] } );
  spheres[i] = new THREE.Mesh( geometry_sphere, material_sphere);
  spheres[i].position.set(config_spheres[i][1], config_spheres[i][2], config_spheres[i][3]);
  spheres[i].name = config_spheres[i][0];
 
  if (config_spheres[i][5] == null)
    {scene.add(spheres[i]);}
  else 
    {spheres[config_spheres[i][5]].add(spheres[i]);}



}




// Caches 
let geometry_sphere_cache = new THREE.SphereGeometry( 0, 0, 16 ); 
let material_sphere_cache = new THREE.MeshBasicMaterial( { wireframe: true, color: 0xFF4848, transparent: true, opacity: 0 } );
let sphere_cache = new THREE.Mesh( geometry_sphere_cache, material_sphere_cache);
sphere_cache.position.set(config_spheres[1][1], config_spheres[1][2], config_spheres[1][3]);
scene.add(sphere_cache);


var config_caches = [
  ["-7", "-0.02"],
  ["7","-0.02"],
  ["-19", "0.02"],
  ["19.7","0.02"]
];
var caches = [];

for (let i = 0; i < config_caches.length; ++i) {
  
  let geom = new THREE.PlaneGeometry(19, 9, 20, 20);

  let mat = new THREE.MeshBasicMaterial({
    wireframe: false,
    color: bg_color,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide
  }); 

  caches[i] = new THREE.Mesh(geom, mat);


  caches[i].position.set(config_caches[i][0], 0, config_caches[i][1]); 
  caches[i].rotateY(Math.PI/180*0);
  

  caches[i].name = "mesh-cache" + i;
  sphere_cache.add(caches[i]);

}




var config_circles = [
  ["circle_front", 10, 0, 0],
  ["circle_back", 10, 0, 1]
];



var circles = [];

for (let i = 0; i < config_circles.length; ++i) {

  let geometry_circle = new THREE.CircleGeometry( config_circles[i][1], 32 );
  let material_circle = new THREE.MeshBasicMaterial( { wireframe: true, color: 0x4169E1, transparent: true, opacity: config_circles[i][2] });
  circles[i] = new THREE.Mesh( geometry_circle, material_circle );
  circles[i].rotateY(-Math.PI * 0.5);
  circles[i].material.side = THREE.DoubleSide;

}


// Types :
// 1: cercle d'images front
// 2: cercle d'images back
// 3: cercle d'images projet

var sizePlanes = [
  [0],
  [1, 19, 9],
  [2, 19, 9],
];

var meshes = [];

// Dimensions, url img, angle, x, y, z, parent, nom
var configMeshes = [
  [1, "home/AP_1.jpg", 270, 0, 0, 0, "sphere_front_1", null],
  [1, "home/AP_2.jpg", 0, 0, 0, 0, "sphere_front_2", null],
  [1, "home/AP_3.jpg", 90, 0, 0, 0, "sphere_front_3", null],
  [1, "home/AP_4.jpg", 90, 0, 0, 0, "sphere_front_4", null],
  [1, "home/AP_5.jpg", 180, 0, 0, 0, "sphere_front_5", null],
  [2, "home/AP_1.jpg", 0, 0, 0, 0, "sphere_back", 1],
  [2, "home/AP_2.jpg", 0, 0, 0, 0, "sphere_back", 2],
  [2, "home/AP_3.jpg", 0, 0, 0, 0, "sphere_back", 3],
  [2, "home/AP_4.jpg", 0, 0, 0, 0, "sphere_back", 4],
  [2, "home/AP_5.jpg", 0, 0, 0, 0, "sphere_back", 5]
];


for (let i = 0; i < configMeshes.length; ++i) {
  
  let geom = new THREE.PlaneGeometry(sizePlanes[configMeshes[i][0]][1], sizePlanes[configMeshes[i][0]][2], 20, 20);

    let mat = new THREE.ShaderMaterial({
      vertexShader : vertexShader_1,
      fragmentShader : fragmentShader_1,
      visible : false,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader(manager).load(require("@/assets/img/" + configMeshes[i][1]))},
        uProg: { value: 0 },
        uScale: {value: configMeshes[i][0] === 2 ? 1 : 0.65}
      },
    });

    meshes[i] = new THREE.Mesh(geom, mat);


  if (configMeshes[i][0] == 1) {
    planeCurve(geom, params.bendDepth); 
  }

  if (configMeshes[i][0] == 2) {
    if (i == 6) meshes[i].position.set(19.7, 0, -0.01); 
    if (i == 7) meshes[i].position.set(300, 0, 0); 
    if (i == 8) meshes[i].position.set(300.7, 0, 0);
    if (i == 9) meshes[i].position.set(300.7, 0, 0);
  }

 if (configMeshes[i][0] == 1) { 
  
  let ox = 0 + config_circles[0][1]*Math.cos(Math.PI/180*configMeshes[i][2]); 
  let oz = 0 + config_circles[0][1]*Math.sin(Math.PI/180*configMeshes[i][2]);
  meshes[i].position.set(ox, 0, oz); 
  meshes[i].rotateY(Math.PI/180*-(configMeshes[i][2] + 90));
 }

 meshes[i].name = configMeshes[i][7];

 scene.getObjectByName(configMeshes[i][6]).add(meshes[i]);

}




var meshesIntro = [1, 4, 5]; // Pas dynamique attention
for (let i = 0; i < meshesIntro.length; ++i) {
  meshes[meshesIntro[i]].material.uniforms.uScale.value = 0
  meshes[meshesIntro[i]].scale.set(1, 0);
}

//________________________________Fin création _______________________________________________//


var active_slide = 1;
var total_slides = spheres[0].children.length;
var prev_slide = total_slides;
var next_slide = active_slide + 1;
var less_slide = prev_slide - 1;
var more_slide = next_slide + 1;




renderer.setAnimationLoop( _ => {
	renderer.render(scene, camera);
  _;

    if(hover == 1 && hovered_mesh) {
    meshes[hovered_mesh].material.uniforms.uTime.value = clock.getElapsedTime();
    }

}); // Je sais pas => Sinon marche pas, animation de threejs


const resize = () => {
	if (document.querySelector("#three")) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

      ratio_window = (window.innerHeight * 100) / window.innerWidth;
      responsive_z_sphere_front = 23.5 - (ratio_window/10)*3.5;

      if (statesStore.where === "home") {
        spheres[0].position.z = responsive_z_sphere_front;
        spheres[1].position.z = responsive_z_sphere_front - 10;
        sphere_cache.position.z = responsive_z_sphere_front - 10;
      }
      else if (statesStore.where === "work") {
        spheres[0].position.z = responsive_z_sphere_front - 80;
        spheres[1].position.z = responsive_z_sphere_front - 10 - 80;
        sphere_cache.position.z = responsive_z_sphere_front - 10 - 80;
      }

	}
}


function planeCurve(g, z){ // Récupère : g = planegéométrie avec son width/height/width segments/height segments
  // let = var limitée à bloc courant // z = Profondeur courbe (param bend depth réglable GUI)
  let p = g.parameters; // p = param de planegeometrie
  let hw = p.width * 0.5; // hw = width du plane / 2
  
  let a = new THREE.Vector2(-hw, 0); // -8 , 0
  let b = new THREE.Vector2(0, z); //   0, 4 (z = bend depth donc 4 par défaut)
  let c = new THREE.Vector2(hw, 0); //  8, 0
  
  let ab = new THREE.Vector2().subVectors(a, b); // (x de a) - (x de b), (y de a) - (y de b). Par défaut -8, -4
  let bc = new THREE.Vector2().subVectors(b, c); // xb - xc, yb - yc
  let ac = new THREE.Vector2().subVectors(a, c); //etc

  
  let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac))); // On mesure longueur ab et bc (les mêmes car aussi éloignés) et ac (16 car -16,0) puis on divise par 2 fois la valeur absolue du produit croisé de ab et ac 
  let center = new THREE.Vector2(0, z - r); // 0, param benddepth - r
  let baseV = new THREE.Vector2().subVectors(a, center); 
  let baseAngle = baseV.angle() - (Math.PI * 0.5); // angle de baseV - pi*05
  let arc = baseAngle * 2; 
 
  let uv = g.attributes.uv;
  let pos = g.attributes.position;
  let mainV = new THREE.Vector2();
  for (let i = 0; i < uv.count; i++){
    let uvRatio = 1 - uv.getX(i);
    let y = pos.getY(i);
    mainV.copy(c).rotateAround(center, (arc * uvRatio));
    pos.setXYZ(i, mainV.x, y, -mainV.y);
  }
  
  pos.needsUpdate = true;
  
}



var nb = 0.001;
var nb_to_reach = 3.7;
var frames_sec = 60;
var step = nb/frames_sec;
// var nb2 = 2;

// function rebend() {

//     renderer.render(scene, camera)

//     if (nb < nb_to_reach) {
//       planeCurve(meshes[prev_slide - 1].geometry, nb);  
//       planeCurve(meshes[next_slide - 1].geometry, nb);  
//       nb += step*2700; 
//       requestAnimationFrame(rebend);
//     }
//     else if (nb >= nb_to_reach) {  
//       nb = nb_to_reach; 
//       planeCurve(meshes[prev_slide - 1].geometry, nb);  
//       planeCurve(meshes[next_slide - 1].geometry, nb); 
//     }
// }

// var nb3 = 1;
// var scaleSteps = 1; // Scale de base



var focus_obj;
var focus_obj_x;
var focus_obj_y;
var number_obj;

function onDocumentMouseMove( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var nb_of_projects = 0;
  
  for (let i = 0; i < configMeshes.length; ++i) {
  if (configMeshes[i][0] == 1) {nb_of_projects++}
  if (configMeshes[i][0] == 2 && i === (nb_of_projects + active_slide) - 1) {

  var intersects = raycaster.intersectObject(meshes[i]);

  if ( intersects.length > 0 && statesStore.where === "home" && statesStore.about === false ) {
        hovered_mesh = i;
        hover = 1;
        gsap.to([meshes[i].material.uniforms.uProg], {
            value: 0.5,
            ease: "power1",
            duration: 1,
        });

        document.body.style.cursor = 'pointer';

  }

  else {

        hover = 0;
        gsap.to([meshes[i].material.uniforms.uProg], {
            value: 0,
            ease: "power1",
            duration: 1,
        });

        document.body.style.cursor = 'default';

  }

  }
  }

}


function onDocumentMouseDown( event ) {

  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // find intersections
  raycaster.setFromCamera( mouse, camera );

  var intersects = raycaster.intersectObjects(spheres[1].children);


  if ( intersects.length > 0 && statesStore.where === "home" && statesStore.about === false ) { //Home click

    if (statesStore.running === false) { 
 
    statesStore.where = "work";

    }

    
  }

}

const visibleHeightAtZDepth = ( depth, camera ) => {

  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  const vFOV = camera.fov * Math.PI / 180; 

  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = ( depth, camera ) => {
  const height = visibleHeightAtZDepth( depth, camera );
  return height * camera.aspect;
};

var prev_obj;
var next_obj;


function scroll_all() {

  if (statesStore.running === false) { 
    
    statesStore.running = true

    if (event.deltaY < 0) { // Scroll down


        //Sphere rotation
        gsap.to([spheres[prev_slide + 1].rotation, spheres[active_slide + 1].rotation, spheres[next_slide + 1].rotation, spheres[less_slide + 1].rotation, ], {duration: 1.5, delay: 0, x: 0, y: "-=" + Math.PI/180*90, ease: 'power2.inOut', onComplete: () => {statesStore.running = false} });
        // +1 ici est la place des front dans le tableau sphere, quand il y avait la sphere text c'était +2

        //Titres
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + active_slide + ') > div'), {duration: 0.4, delay: 0, translateY: 110 + "%", ease: 'power1.easeIn'  });
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + prev_slide + ') > div'), {duration: 0, delay: 0, translateY: -110 + "%"});
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + prev_slide + ') > div'), {duration: 0.4, delay: 1.1, translateY: 0 + "%", ease: 'power1.easeOut'  });        

        //Images
        gsap.to(spheres[1].children[active_slide - 1].position, {duration: 1.5, delay: 0, x: "+=" + 19.7,  ease: 'power2.inOut' });
        spheres[1].children[prev_slide - 1].position.x = -19.7;
        gsap.to(spheres[1].children[prev_slide - 1].position, {duration: 1.5, delay: 0, x: "+=" + 19.7, ease: 'power2.inOut' });

      


        active_slide -= 1;
        if (active_slide < 1) { active_slide = total_slides}

        if (active_slide == 1) {prev_slide = total_slides; next_slide = active_slide + 1}
        else if(active_slide == total_slides) {prev_slide = active_slide - 1; next_slide = 1}
        else {prev_slide = active_slide - 1; next_slide = active_slide + 1;}

        if (prev_slide == 1) {less_slide = total_slides;}
        else {less_slide = prev_slide - 1;}

        if (next_slide == total_slides) {more_slide = 1;}
        else {more_slide = next_slide + 1;}

        console.log(more_slide, prev_slide, active_slide, next_slide);

    }
    
    else if (event.deltaY > 0) { // Scroll up

        //Sphere rotation
        gsap.to([spheres[prev_slide + 1].rotation, spheres[active_slide + 1].rotation, spheres[next_slide + 1].rotation, spheres[more_slide + 1].rotation, ], {duration: 1.5, delay: 0, x: 0, y: "+=" + Math.PI/180*90, ease: 'power2.inOut', onComplete: () => {statesStore.running = false} });
        // +1 ici est la place des front dans le tableau sphere, quand il y avait la sphere text c'était +2

        //Titres
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + active_slide + ') > div'), {duration: 0.4, delay: 0, translateY: -110 + "%", ease: 'power1.easeIn'  });
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + next_slide + ') > div'), {duration: 0, delay: 0, translateY: 110 + "%"});
        gsap.to(document.querySelectorAll('#the_titles > div:nth-child(' + next_slide + ') > div'), {duration: 0.4, delay: 1.1, translateY: 0 + "%", ease: 'power1.easeOut'  });

        //Images
        gsap.to(spheres[1].children[active_slide - 1].position, {duration: 1.5, delay: 0, x: "-=" + 19.7,  ease: 'power2.inOut' });
        spheres[1].children[next_slide - 1].position.x = 19.7;
        gsap.to(spheres[1].children[next_slide - 1].position, {duration: 1.5, delay: 0, x: "-=" + 19.7, ease: 'power2.inOut' });


        active_slide += 1;
        if (active_slide > total_slides) { active_slide = 1}
       
        if (active_slide == 1) {prev_slide = total_slides; next_slide = active_slide + 1}
        else if(active_slide == total_slides) {prev_slide = active_slide - 1; next_slide = 1}
        else {prev_slide = active_slide - 1; next_slide = active_slide + 1;}

        if (prev_slide == 1) {less_slide = total_slides;}
        else {less_slide = prev_slide - 1;}

        if (next_slide == total_slides) {more_slide = 1;}
        else {more_slide = next_slide + 1;}

       

        console.log(prev_slide, active_slide, next_slide, more_slide);


    }
  }
}

watch(router.currentRoute, () => {
  console.log(router.currentRoute.value.fullPath);
  if (router.currentRoute.value.fullPath.includes('about')) {
    
  }
  // Do something here...

  // Optionally you can set immediate: true config for the watcher to run on init
//}, { immediate: true });
});

watch(scroll_progress, () => {
    gsap.to(scene.position, {duration: 0, x: -statesStore.scroll_progress*20, ease: 'none'});
});

watch(loading, () => {

  document.getElementById('loading-line').style.width = statesStore.loading + '%';
  document.getElementById('loading-percent').innerHTML = "";
  document.getElementById('loading-percent').innerHTML = Math.round(statesStore.loading) + '%'; 

  if (statesStore.loading >= 100) {
    
    statesStore.running = true;

    document.getElementById('ap').classList.remove('loading_logo');
    document.getElementById('loader-container').classList.remove('is-loading');
    document.getElementById('loading-percent').classList.remove('is-loading');


    meshes[1].material.visible = true;
    meshes[4].material.visible = true;
    meshes[5].material.visible = true;

    gsap.to([meshes[1].scale,meshes[4].scale], {duration: 1.5, delay: 0, y: 1, ease: 'power1' });
    gsap.to([meshes[1].material.uniforms.uScale, meshes[4].material.uniforms.uScale], {duration: 2, delay: 0, value: 0.65, ease: 'power4.inOut' })
    gsap.from([meshes[1].material.uniforms.uProg, meshes[4].material.uniforms.uProg], {duration: 2, delay: 0, value: 2, ease: 'power4.inOut' })

    gsap.to(meshes[5].scale, {duration: 1.5, delay: 0, y: 1, ease: 'power1' });
    gsap.to(meshes[5].material.uniforms.uScale, {duration: 2, delay: 0, value: 1, ease: 'power4.inOut'});
    gsap.from(meshes[5].material.uniforms.uProg, {duration: 2.5, delay: 0, value: 2, ease: 'power4.inOut' });

    gsap.to(['#the_titles > div:nth-child(1) > div', '#link_menu > div:nth-child(1) > div', '.ap > div:nth-child(1) > div'], {duration: 0.4, delay: 1.6, translateY: 0 + "%", ease: 'power1', onComplete: () => {statesStore.running = false}  });

    for(var i = 0; i < meshes.length; i++) {
      gsap.to(meshes[i].material, { visible: true, duration: 0, delay: 2 });
    } 
  }

});


watch(where, () => {

    if (statesStore.where === "work") {

      document.body.style.cursor = 'default';
      document.getElementById('cross').classList.toggle('cross-active');

      // Situation globale
      statesStore.running = true;
      statesStore.scroll_progress = 0;
      statesStore.work = active_slide;
      statesStore.work_active = true;
      router.push({ path: '/work/' + statesStore.work_name[statesStore.work - 1].split(' ').join('_').toLowerCase()});

      // On détache meshes avant et après de sphere 0 pour rattacher en onComplete une fois terminé, malin !
      scene.attach(meshes[next_slide - 1]);
      scene.attach(meshes[prev_slide - 1]);
    
      //Courbe
      planeCurve(meshes[prev_slide - 1].geometry, 0.01);
      planeCurve(meshes[next_slide - 1].geometry, 0.01);

      // Rotation/Position images gauche et droite
      gsap.to(meshes[prev_slide - 1].rotation, {duration: 1, delay: 0, y: "-=" + Math.PI/180*90, ease: 'power1' });
      gsap.to(meshes[prev_slide - 1].position, {duration: 1, delay: 0, x: "-=" + 20, z: "-=" + 90, ease: 'power1' });
      gsap.to(meshes[next_slide - 1].rotation, {duration: 1, delay: 0, y: "+=" + Math.PI/180*90, ease: 'power1' });
      gsap.to(meshes[next_slide - 1].position, {duration: 1, delay: 0, x: "+=" + 20, z: "-=" + 90, ease: 'power1' });

      // On recule les sphères, quand c'est terminé on réattache images gauche et droite
      gsap.to([spheres[0].position, spheres[1].position], {duration: 1, delay: 0, z: "-=" + 80, y: "-=" + 0, ease: 'power1',   onComplete: () => {spheres[prev_slide + 1].attach(meshes[prev_slide - 1]); spheres[next_slide + 1].attach(meshes[next_slide - 1]);} });

      gsap.to("#three", {duration: 1, opacity: 0.6, ease: 'power1' });

      // Cache les caches
      sphere_cache.position.y = -1000;

      // On explore le tableau meshes,
      // On met opacity 0 sur meshes spheres plate qui sont pas celles actives
      for (let i = 0; i < configMeshes.length; ++i) { 
         if (configMeshes[i][0] <= 2 && i != (active_slide - 1) && i != (prev_slide - 1) && i != (next_slide - 1) && i != ((active_slide + total_slides) - 1) ) {
            gsap.to(meshes[i].material, { opacity: 0, duration: 0, delay: 0});
            gsap.to(meshes[i].position, {duration: 0, delay: 0, y: "-=" + 1000});
         }
      }

    }

    if (statesStore.where === "home") {
      
      statesStore.running = true;
      router.go(-1);

      document.getElementById('cross').classList.toggle('cross-active');


      // Reset des positions, quand complete on detache
      gsap.to([scene.position], {duration: 0, delay: 0, x: 0,  onComplete: () => {scene.attach(meshes[prev_slide - 1]); scene.attach(meshes[next_slide - 1]); }  });

      planeCurve(meshes[prev_slide - 1].geometry, 3.7);
      planeCurve(meshes[next_slide - 1].geometry, 3.7);
      //rebend();

      gsap.to(meshes[prev_slide - 1].position, {duration: 1.5, delay: 0, x: "+=" + 20, z: "+=" + 90, ease: 'power4.out' });
      gsap.to(meshes[prev_slide - 1].rotation, {duration: 1.5, delay: 0, y: "+=" + Math.PI/180*90, ease: 'power4.out' });
      gsap.to(meshes[next_slide - 1].position, {duration: 1.5, delay: 0, x: "-=" + 20, z: "+=" + 90, ease: 'power4.out' });
      gsap.to(meshes[next_slide - 1].rotation, {duration: 1.5, delay: 0, y: "-=" + Math.PI/180*90, ease: 'power4.out' });

      // Quand spheres revenues on reattache prev next à spheres parentes
      gsap.to([spheres[0].position, spheres[1].position], {duration: 1.5, delay: 0, z: "+=" + 80, y: "-=" + 0, ease: 'power4.out',  onComplete: () => {spheres[prev_slide + 1].attach(meshes[prev_slide - 1]); spheres[next_slide + 1].attach(meshes[next_slide - 1]); } });

      // gsap.to(meshes[active_slide - 1].material, { opacity: 1, duration: 0, delay: 1.55, ease: 'power4.out' });
      // gsap.to([meshes[next_slide - 1].material, meshes[(active_slide + total_slides) - 1].material, meshes[prev_slide - 1].material], { opacity: 1, duration: 1.5, ease: 'power1' });
      
      gsap.to("#three", {duration: 1, opacity: 1, ease: 'power1'});

      gsap.to(sphere_cache.position, {duration: 0, delay: 1.55, y: 0, onComplete: () => {statesStore.running = false; statesStore.scrollable = true;} });

      // Comme enter project, inversé, avec délai pour tout remettre une fois anim back terminée
      for (let i = 0; i < configMeshes.length; ++i) { 
        
         if (configMeshes[i][0] <= 2 && i != (active_slide - 1) && i != (prev_slide - 1) && i != (next_slide - 1) && i != ((active_slide + total_slides) - 1) ) {
          gsap.to(meshes[i].material, { opacity: 1, duration: 0, delay: 1.55});
          gsap.to(meshes[i].position, {duration: 0, delay: 1.55, y: "+=" + 1000});
         }

      }

    }
});

watch(about, () => {
  if (statesStore.about && statesStore.where === "home") {

    gsap.to('#three', {duration: 0.5, opacity: 0, ease: 'power2.inOut'});
    gsap.to('#the_titles > div:nth-child(' + active_slide + ') > div', {duration: 0.5, translateY: "110%", ease: 'power2.inOut'});
    gsap.to(scene.position, {duration: 0.5, z: "+=" + 5, ease: 'power2.inOut'});

  }

  if (statesStore.about === false && statesStore.where === "home") {

    gsap.to('#three', {delay: 0.5, duration: 0.5, opacity: 1, ease: 'power2.inOut'});
    gsap.to('#the_titles > div:nth-child(' + active_slide + ') > div', {delay: 0.5, duration: 0.5, translateY: "0%", ease: 'power2.inOut'});
    gsap.to(scene.position, {delay: 0, duration: 1, z: "-=" + 5, ease: 'power2.inOut'});

  }
});

</script>

<style scoped>
/* @font-face {
	font-family: 'Humane';
	src: url('@/assets/fonts/Humane-Regular.woff2') format('woff2');
} */

#three {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.loading-percent {
width: 100%;
text-align: center;
font-size: 2em;
opacity: 0;
position: absolute;
top: 45%;
margin-top: -1px;
transition: opacity 0.5s ease-out;
margin: 0 auto
}

.loader-container {
width: 100%;
height: 2px;
background: #333;
opacity: 0;
position: absolute;
top: 50%;
margin-top: -1px;
transition: opacity 0.5s ease-out;
margin: 0 auto
}

.loading-line {
opacity: 0;
width: 0;
height: 2px;
background: #fff;
transition: all 0.5s ease-out;
margin: 0 auto
}

.is-loading {
  opacity: 1;
}

#the_titles {
  position: absolute;
  letter-spacing: -0.05em;
  font-size: 6em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

#the_titles > div {
  transform: rotate(-90deg);
  position: absolute;
  overflow: hidden;
  padding-bottom:10px
}

#the_titles > div > div {
  transform: translateY(110%);
  vertical-align: middle;
}

/* On translate le 1 au loading pour l'instant
#the_titles > div:not(:first-child) > div {
  transform: translateY(120%);
  vertical-align: middle;
} */

</style>