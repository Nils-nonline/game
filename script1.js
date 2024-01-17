import * as THREE from 'three'
import { FBXLoader } from 'three/addons/loaders/FBXLoader'

const changHalfSize =300 / 2
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xffcc00, 1, 100);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
	10000
);
// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ alpha: true,antialias: true });
const canvas = renderer.domElement;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffcc00, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);
var planeGeometry = new THREE.PlaneGeometry(500, 500, 40, 40);
var playerLifes = 150;
var cubeLives = 150;
var cubeDamage = 20;
//0xf0e68c
var material = new THREE.MeshPhongMaterial({ color:0xf0e68c ,side: THREE.DoubleSide });
// Create a mesh using the geometry and material
var plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
plane.castShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.x = 50
plane.position.z = 50
// Add the plane to the scene
scene.add(plane);
const ambientlight = new THREE.AmbientLight(0xffffff,1);
scene.add( ambientlight );

// A cube we are going to animate
const cube = {
  // The geometry: the shape & size of the object
  geometry: new THREE.BoxGeometry(1, 2, 1),
  // The material: the appearance (color, texture) of the object
  material: new THREE.MeshBasicMaterial({ color: 0x00ff00 })
};
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
cube.mesh.visible = false;
cube.mesh.collidable = false;
cube.mesh.position.y = 0
cube.mesh.position.x = 0.5
cube.mesh.position.z = 0
scene.add(cube.mesh);

const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(0, 0, 0);
scene.add(spotlight);
spotlight.target = cube.mesh;
spotlight.angle = 90/180*Math.PI
spotlight.penumbra = 0.5;
spotlight.power = 1;
spotlight.castShadow = true;
var interval;
document.body.addEventListener("click", async () => {
	if(!document.pointerLockElement) {
		await renderer.domElement.requestPointerLock({unadjustedMovement: true});
	}else{
		
		if(zoom){
			if(!tools[actualWeapon][1].repeated){
				if(!tools[actualWeapon][1].lastshot){
					tools[actualWeapon][1].lastshot = Date.now() - tools[actualWeapon][1].cooldown*2
				}
				if(tools[actualWeapon][1].lastshot < Date.now() - tools[actualWeapon][1].cooldown){
					shoot();
					dezoom();
					tools[actualWeapon][1].lastshot = Date.now();
				}
			}else{
				clearInterval(interval);
				dezoom();
			}
		}
	}
});


document.body.addEventListener("mousedown", async () => {
	if(tools[actualWeapon]){
		if(!tools[actualWeapon][1].lastshot){
			tools[actualWeapon][1].lastshot = Date.now() - tools[actualWeapon][1].cooldown*2
		}
		if(tools[actualWeapon][1].lastshot < Date.now() - tools[actualWeapon][1].cooldown){
			if(document.pointerLockElement){
				if(zoom){
					if(!tools[actualWeapon][1].repeated){
						zoom();
					}else{
						if(tools[actualWeapon][1].actualMag > 0){
							if(interval){
								clearInterval(interval);
							}
							shoot();
							tools[actualWeapon][1].lastshot = Date.now();
							tools[actualWeapon][1].actualMag-=1;
							interval = setInterval(()=>{
								if(tools[actualWeapon][1].actualMag > 0){
									shoot();
									tools[actualWeapon][1].lastshot = Date.now();
									tools[actualWeapon][1].actualMag-=1;
								}else{
									setTimeout((w)=>{w.actualMag=w.mag},tools[actualWeapon][1].reloadtime,tools[actualWeapon][1]);
								}
							}, tools[actualWeapon][1].cooldown);
						}else{
							setTimeout((w)=>{w.actualMag=w.mag},tools[actualWeapon][1].reloadtime,tools[actualWeapon][1]);
						}
					}
				}
			
			}
		}
	}
});

var changAreas = [];
var seeds = []
var tools = {};
//var shootingSoundeffect = new Audio('shoot.mp3');

var shootingSoundeffect = document.createElement("audio");
shootingSoundeffect.src = 'shoot.mp3';
shootingSoundeffect.vibration = true;
shootingSoundeffect.setAttribute("preload", "auto");
shootingSoundeffect.setAttribute("controls", "none");
shootingSoundeffect.style.display = "none";


var actualWeapon = null;
import { fileNames } from './spec.js';
const loader = new FBXLoader();

for (const file of Object.keys(fileNames)) {
    let i = Object.keys(fileNames).indexOf(file);
    loader.load(file, (obj) => {
      console.log(file,i);
      let scale = 0.001;
      let turn = [0,0,0];
      try{
        scale = fileNames[file].scale;
        turn = [fileNames[file].tx,fileNames[file].ty,fileNames[file].tz];
      }catch(e){
        console.log(e.message);
        console.log(fileNames[file].scale);
      }
      console.log("scaling");
			console.log(obj.material);
      try{
				for(let i=0;i<obj.children[0].material.length;i++){
					for(let child_i=0;child_i<obj.children.length;child_i++){
						let old = obj.children[child_i].material[i]
						let newMaterial = new THREE.MeshBasicMaterial({
							color:old.color.clone().multiplyScalar(3.5),
							map:old.map,
							transparent:old.transparent,
							opacity:old.opacity,
							side:old.side
						});
						old.dispose()
						obj.children[child_i].material[i] = newMaterial;
					}
				}
				
        obj.scale.set(scale,scale,scale);
        obj.___turn=turn;
        console.log("adding object to tools");
				fileNames[file].publicinf.actualMag = fileNames[file].publicinf.mag;
        tools[i]=[obj,fileNames[file].publicinf];
        console.log("adding object to scene");
        console.log(obj);
        if(i == Object.keys(fileNames).length-1){
          document.getElementById("loader").style.display = "none";
          scene.add(tools[actualWeapon][0]);
        }
      }catch(e){
        console.error(e.message);
      }
    });
}

function getFirstIntersection(x, y, z,height = 0.5,obj = {mesh:undefined}) {
  var raycaster = new THREE.Raycaster();
  // Set the origin and direction of the raycaster
  raycaster.set(new THREE.Vector3(x, y+height, z), new THREE.Vector3(0, -1, 0).normalize());
  // Update the world matrices of all children in the scene
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.updateMatrixWorld(true);
    }
  });
  // Perform the intersection test
  var objectsToIntersect = scene.children.filter((child)=>{
			if(tools[actualWeapon]){
				return (child != cube.mesh) && (child != obj.mesh) && (child != tools[actualWeapon][0])
			}
      return (child != cube.mesh) && (child != obj.mesh)
  });
  var intersections = raycaster.intersectObjects(objectsToIntersect, true);

  if (intersections.length > 0) {
    return intersections[0].point;
  } else {
    return getFirstIntersection(x,y+10,z);
  }
}


var objects = [];
var enemies = [];

function fill(pos) {
  for (let i of changAreas) {
    if (JSON.stringify(i) == JSON.stringify(pos)) {
      return false
    }
  }
  var x = pos[0];
  var y = pos[1];
  for (let i = 0; i < Math.round(Math.random() * 30) + 10; i++) {
    let height = Math.round(Math.random() * 5) + 2
    let width = Math.round(Math.random() * 10) + 3
    let length = Math.round(Math.random() * 10) + 3
    let object = {
      geometry: new THREE.BoxGeometry(width, height, length),
      material: new THREE.MeshStandardMaterial({ color: 0x909090 }),
    };
		
    object.mesh = new THREE.Mesh(object.geometry, object.material);
		object.mesh.shot = [];
		object.material.roughness = 0.9;
    scene.add(object.mesh);
    object.mesh.position.x = x + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize;
    object.mesh.position.z = y + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize;
    if(Math.random()> 0){
        object.mesh.position.y = getFirstIntersection(object.mesh.position.x,1000,object.mesh.position.z,0,object).y 
    }else{
        object.mesh.position.y = height / 2 + Math.round(Math.random() * getFirstIntersection(object.mesh.position.x,1000,object.mesh.position.z,0,object).y);
    }
    objects.push(object);
  }
	for (let i = 0; i < Math.round(Math.random() * 10) + 10; i++) {
		let enemy = {
			geometry: new THREE.BoxGeometry(1, 2, 1),
			material: new THREE.MeshStandardMaterial({ color: 0xff0000 }),
		};
		enemy.mesh = new THREE.Mesh(enemy.geometry, enemy.material);
		enemy.life = cubeLives;
		enemy.mesh.shot = [];
		enemy.direction = [Math.random()*2-1,Math.random()*2-1];
		enemy.material.roughness = 0.9;	
		scene.add(enemy.mesh);
		enemy.mesh.position.x = x + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize;
		enemy.mesh.position.z = y + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize;
	
		seeds.push([x + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize, y + Math.round(Math.random() * 2 * changHalfSize) - changHalfSize])
		enemies.push(enemy);
	}
  // Store the center position of the newly generated chang area
  changAreas.push(pos);
}
var change = [0, 0, Math.PI]
var ableToJump = true

var intheAir = false;
function jumpend() {
  intheAir = false;
  window.setTimeout(() => {
    ableToJump = true;
  }, 500)
}
var speed=3;
var angle = 0;
var mouseMoveX = 0;
var mouseMoveY = 0;
document.addEventListener('mousemove', (event) => {
  mouseMoveX = (event.movementX || event.mozMovementX || event.webkitMovementX || 0) * 0.2;
  mouseMoveY = (event.movementY || event.mozMovementY || event.webkitMovementY || 0) * 0.001;
  change[0] = -mouseMoveX / camera.zoom
  change[2] += mouseMoveY / camera.zoom
});

function keypress(event) {
  if (event.keyCode == 65) { change[0] = 1*speed }
  if (event.keyCode == 87) { if(intheAir){change[1] = -9*speed}else{change[1] = -3*speed} }
  if (event.keyCode == 68) { change[0] = -1*speed }
  if (event.keyCode == 83) { if(intheAir){change[1] = 9*speed}else{change[1] = 3*speed} }
  if (event.keyCode == 90 || event.keyCode == 89){
    zoom();
  }
  if (event.keyCode == 51){camera.zoom = 0.5;camera.updateProjectionMatrix();}
  if (event.keyCode == 49){
		if(interval){
			clearInterval(interval);
		}
    if(tools[actualWeapon] != undefined){
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      scene.remove(tools[actualWeapon][0]);
      actualWeapon += 1;
      actualWeapon %= (Object.keys(tools).length);
			console.log(tools,actualWeapon);
      scene.add(tools[actualWeapon][0]);
     }
    console.log(actualWeapon)
  }
  if (event.keyCode == 32) {
		if(tools[actualWeapon]){
			if(!tools[actualWeapon][1].lastshot){
				tools[actualWeapon][1].lastshot = Date.now() - tools[actualWeapon][1].cooldown*2
			}
			if(tools[actualWeapon][1].lastshot < Date.now() - tools[actualWeapon][1].cooldown){
				if(tools[actualWeapon][1].actualMag > 0){
					if(document.pointerLockElement){
						if(zoom){
							if(!tools[actualWeapon][1].repeated){
								zoom();
							}else{
								if(interval){
									clearInterval(interval);
								}
								tools[actualWeapon][1].lastshot = Date.now();
								shoot();
								tools[actualWeapon][1].actualMag-=1;
							}
						}
					}
				}else{
					setTimeout((w)=>{w.actualMag=w.mag},tools[actualWeapon][1].reloadtime,tools[actualWeapon][1]);
				}
			}
		}
  }
  if (ableToJump && event.keyCode == 70) {cube.mesh.position.y += 4;if(!checkCollision()){intheAir = true; ableToJump = false;  window.setTimeout(jumpend, 1000)}else{cube.mesh.position.y -= 4;}}
}

function keyup(event) {
  if (event.keyCode == 90 || event.keyCode == 89 || event.keyCode ==51){dezoom()}
  if (event.keyCode == 65) { change[0] = 0 }
  if (event.keyCode == 87) { change[1] = 0 }
  if (event.keyCode == 68) { change[0] = 0 }
	if (event.keyCode == 32) {
		if(zoom){
			if(!tools[actualWeapon][1].repeated){
				if(!tools[actualWeapon][1].lastshot){
					tools[actualWeapon][1].lastshot = Date.now() - tools[actualWeapon][1].cooldown*2
				}
				if(tools[actualWeapon][1].lastshot < Date.now() - tools[actualWeapon][1].cooldown){
					shoot();
					dezoom();
					tools[actualWeapon][1].lastshot = Date.now();
				}
			}else{
				clearInterval(interval);
				dezoom();
			}
		}
	}
  if (event.keyCode == 83) { change[1] = 0 }
  if (event.keyCode == 70) { jumpend() }
}

document.onkeydown = keypress
document.onkeyup = keyup
var steps = 0.1
var totaldamage = 0;
function dezoom(){
	camera.zoom = 1;camera.updateProjectionMatrix();
}
function zoom(){
	console.log("zooming",tools[actualWeapon][0],tools[actualWeapon][1].name);
	if(tools[actualWeapon][1].name == "sniper"){//weapon is sniper:big zoom
		camera.zoom = 2;
		camera.updateProjectionMatrix();
	}else{//no sniper:small zoom
		camera.zoom = 1.5;
		camera.updateProjectionMatrix();
	}
}

function isEnemy(obj){
	for(let a of enemies){
		if(a.mesh == obj){
			return a;
		}
	};
	return false;
}
function animateFog(to,speed=100){
	let number = scene.fog.far;
	let fogIntervall = setInterval(
		()=>{
			try{
				if(number == to){
					 clearInterval(fogIntervall);
				 }else{
					 number += (to-number)/10
					 scene.fog.far = number;
				 }
			}catch(e){
				alert(e);
			}
			
		},speed);
}
function sandstorm(isSandstorm=true){
	if(isSandstorm){
		animateFog(20);
	}else{
		animateFog(100);
	}
}

function shoot(){
	if(shootingSoundeffect && shootingSoundeffect.currentTime > 0 && !shootingSoundeffect.paused && !shootingSoundeffect.ended && shootingSoundeffect.readyState > 2){
		shootingSoundeffect.currentTime = 0;
	} else {
		shootingSoundeffect.play();
	}
	totaldamage+=tools[actualWeapon][1].damage;
	let raycaster = new THREE.Raycaster();
	let camPosition = camera.position.clone();
	// Update the raycaster's position and direction using the cam's position and direction
	raycaster.set(camPosition, new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion));
	let intersects = raycaster.intersectObjects(enemies.concat(objects).map((obj) => obj.mesh));
	if (intersects.length > 0) {
		var shotObject = intersects[0].object;
		if(isEnemy(shotObject)==false){
			const geometry = new THREE.SphereGeometry( 0.05); 
			const material = new THREE.MeshBasicMaterial( { color: 0x000000} ); 
			const sphere = new THREE.Mesh(geometry, material);
			sphere.position.copy(intersects[0].point);
			scene.add(sphere);
			setTimeout(function(){
				scene.remove(sphere);
				const index = shotObject.shot.indexOf(sphere);
				if (index > -1) {
					shotObject.shot.splice(index, 1);
				}
			},5000)
		}else{
			let a = isEnemy(shotObject);
			a.life -= tools[actualWeapon][1].damage;
			document.getElementById("health-bar").innerHTML = a.life+" lifes"+"<br> Number of enemies: "+enemies.length
			a.direction = [Math.random()*2-1,Math.random()*2-1];
			a.mesh.material.color.setHex(0xff5555);
			setTimeout(function(){
				a.mesh.material.color.setHex(0xff0000);
			},20)
			if(parseInt(a.life) <= 0){
				let index = enemies.indexOf(a);
				enemies.splice(index, 1);
				shotObject.visible = false;
				shotObject.collidable = false;
				document.getElementById("health-bar").innerHTML = "No status <br>Number of enemies: "+enemies.length
			}
		}
	
	}
}
function checkCollision(a=cube,eCheck=false) {
  const playerBoundingBox = new THREE.Box3().setFromObject(a.mesh);
  for (const object of objects.concat(enemies).concat([cube])) {
		if(object != a){
			const baseBoundingBox = new THREE.Box3().setFromObject(object.mesh);
			if (playerBoundingBox.intersectsBox(baseBoundingBox) && object.mesh.visible) {
				if(a==cube && enemies.includes(object)){
					//playerLifes -= cubeDamage;
					if(eCheck){
						return false;
					}
				}
				return true
			}
		}
    
  }
  return false;
}
function insideCube()  {
  const greenCubeBoundingBox = new THREE.Box3().setFromObject(cube.mesh);
  for (const object of objects) {
    const redCubeBoundingBox = new THREE.Box3().setFromObject(object.mesh);
    if(redCubeBoundingBox.containsBox(greenCubeBoundingBox) && object.mesh.visible){
      return redCubeBoundingBox.max.y;
    }
  }
  return false;
}

var voronoigrade = 4
function voronoi(x, y) {
  seeds.sort(function(a, b) { return Math.sqrt((a[0] - x) ** 2 + (a[1] - y) ** 2) - Math.sqrt((b[0] - x) ** 2 + (b[1] - y) ** 2) })
  let a = seeds[voronoigrade]
  return Math.sqrt((a[0] - x) ** 2 + (a[1] - y) ** 2)/5
}
function dune() {
  const planeWorldMatrix = plane.matrixWorld;
  //console.log(plane)
  plane.geometry.vertices.forEach(vertex => {
    const vertexWorld = vertex.clone();
    vertexWorld.applyMatrix4(planeWorldMatrix);
    const resultZ = voronoi(vertexWorld.x, vertexWorld.y);
    vertex.z = resultZ;
  });

  plane.geometry.computeVertexNormals();
  plane.geometry.computeFaceNormals();
  plane.geometry.verticesNeedUpdate = true;
  plane.geometry.normalsNeedUpdate = true;
  plane.geometry.__dirtyVertices = true;
  plane.geometry.__dirtyNormals = true;

}

function calculateMiddle(x){
  if(x >= 0) {
    return x - (x % (changHalfSize * 2)) + changHalfSize
  }else{
    return x - (x % (changHalfSize * 2)) - changHalfSize
  }
}
actualWeapon = 0;
function render() {
	if(playerLifes<=0){
		message("THE END","You have been killed by the enemies.<br>The game will restart automatically.","red");
		intheAir = true;
		cube.mesh.position.y += 40
		setTimeout(function(){location.reload();},1000);
		return;
	}
  
  // Render the scene and the camera
  angle +=  change[0];
  cube.mesh.position.z += Math.cos(angle / 180 * Math.PI) * (change[1] * steps)
  cube.mesh.position.x += Math.sin(angle / 180 * Math.PI) * (change[1] * steps)
  cube.mesh.rotation.y = angle / 180 * Math.PI
  camera.rotation.y = angle / 180 * Math.PI
  camera.position.z = cube.mesh.position.z + Math.cos(angle / 180 * Math.PI) * 1.5
  camera.position.y = cube.mesh.position.y + 1.5
  camera.position.x = cube.mesh.position.x + Math.sin(angle / 180 * Math.PI) * 1.5
  
	if (checkCollision(cube,true)){
    cube.mesh.position.z += Math.cos(angle / 180 * Math.PI) * (-change[1] * steps)
    cube.mesh.position.x += Math.sin(angle / 180 * Math.PI) * (-change[1] * steps)
    cube.mesh.rotation.y = angle / 180 * Math.PI
    camera.rotation.y = angle / 180 * Math.PI
    camera.position.z = cube.mesh.position.z
    camera.position.y = cube.mesh.position.y + 1
    camera.position.x = cube.mesh.position.x
  }
  camera.lookAt(new THREE.Vector3(camera.position.x+Math.sin(angle / 180 * Math.PI) * Math.cos(change[2])* 10,camera.position.y+ Math.sin(change[2])*10,camera.position.z+Math.cos(angle / 180 * Math.PI) * Math.cos(change[2]) * 10));
  const cubeX = cube.mesh.position.x;
  const cubeZ = cube.mesh.position.z;
  const duneheight = getFirstIntersection(cube.mesh.position.x,cube.mesh.position.y,cube.mesh.position.z,0.5,cube).y  
  let changPosition = [calculateMiddle(cubeX), calculateMiddle(cubeZ)]
  for (let x of [changHalfSize*2, 0, -2*changHalfSize]) {
    for (let y of [changHalfSize*2, 0, -2*changHalfSize]) {
      fill([changPosition[0] + x, changPosition[1] + y])
    }
  }
  if(insideCube()!== false){
    cube.mesh.position.y = insideCube()+0.6
  }
	if(!intheAir){
		if(!checkCollision()){
			cube.mesh.position.y-=0.1
			if(!checkCollision()){
				cube.mesh.position.y=(duneheight+1.6)
			}else{
				cube.mesh.position.y+=0.1
			}
		}
	}
	camera.position.y = cube.mesh.position.y + 1
  //plane.position.x = cube.mesh.position.x
  //plane.position.z = cube.mesh.position.z
	dune();
  if(tools[actualWeapon] != undefined){
    tools[actualWeapon][0].position.x = cubeX + Math.sin((angle) / 180 * Math.PI) * -0.1;
    tools[actualWeapon][0].position.z = cubeZ + Math.cos((angle) / 180 * Math.PI) * -0.1;
    tools[actualWeapon][0].position.y = cube.mesh.position.y+0.3;
    tools[actualWeapon][0].rotation.y = (angle+tools[actualWeapon][0].___turn[0]) / 180 * Math.PI;
  }
  renderer.render(scene, camera);
	spotlight.position.set(cube.mesh.position.x, cube.mesh.position.y+5, cube.mesh.position.z);
  requestAnimationFrame(render);
}



setInterval(()=>{
	for(let enemy of enemies){
		if(true || enemy.mesh.shot.length == 0){
			enemy.mesh.position.y = 0.1+enemy.mesh.geometry.parameters.height/2+getFirstIntersection(enemy.mesh.position.x,enemy.mesh.position.y,enemy.mesh.position.z,1,enemy).y
			let distance = Math.sqrt((cube.mesh.position.x-enemy.mesh.position.x)**2+(cube.mesh.position.z-enemy.mesh.position.z)**2);
			if(distance < (scene.fog.far+27)){
				let deltaX = enemy.direction[0]/5;
				let deltaZ = enemy.direction[1]/5;
				if((distance>(scene.fog.far+17) || distance<(scene.fog.far+7))){
					deltaX += (cube.mesh.position.x-enemy.mesh.position.x)/(distance);
					deltaZ += (cube.mesh.position.z-enemy.mesh.position.z)/(distance);
				}
				if(Math.sqrt((cube.mesh.position.x-enemy.mesh.position.x)**2+(cube.mesh.position.z-enemy.mesh.position.z)**2+(cube.mesh.position.y-enemy.mesh.position.y)**2)<1){
					playerLifes -= cubeDamage;
				}
				enemy.mesh.position.x += deltaX*0.8;
				enemy.mesh.position.z += deltaZ*0.8;
				if(checkCollision(enemy)){
						enemy.mesh.position.y += 4;
						if(checkCollision(enemy)){
							enemy.mesh.position.x -= deltaX;
							enemy.mesh.position.z -= deltaZ;
							enemy.mesh.position.y -= 4;
						}else{
							enemy.mesh.position.y = 0.1+enemy.mesh.geometry.parameters.height/2+getFirstIntersection(enemy.mesh.position.x,enemy.mesh.position.y,enemy.mesh.position.z,1,enemy).y
						}
				}
			}
				
			
		}
	}
},200)
fill([50, 50]);
dune();
for(let object of objects){
	if(Math.random()> 0.5){
			object.mesh.position.y = getFirstIntersection(object.mesh.position.x,100,object.mesh.position.z,0,object).y 
	}else{
			object.mesh.position.y = Math.round(Math.random() * getFirstIntersection(object.mesh.position.x,100,object.mesh.position.z,object.geometry.height / 2,object).y);
	}
}
function message(title,text,color){
	let msg = document.getElementById("message")
	msg.style.color = color;
	msg.innerHTML = title + "<br>" + text;
}
message("START","The game started.","green");
render();

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
		document.getElementById("cross").style.top = parseInt(canvas.offsetHeight)/2+"px";
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

}


var lightX=0;
setInterval(function(){
	lightX += 0.002
	let a = 2
	brightness = Math.round(((((lightX % a)-(a/2))/Math.abs((lightX%a)-(a/2)))*((lightX%(a/2))-(a/4))+a/4)*100)/100
	ambientlight.intensity = brightness
	document.getElementById("player-health").innerHTML  = playerLifes;
	document.getElementById("brightness").innerHTML=brightness;
	console.log(tools,actualWeapon);
	document.getElementById("magazine").innerHTML= tools[actualWeapon][1].actualMag;
	document.getElementById("fullMagazine").innerHTML= tools[actualWeapon][1].mag;
	try{
		let color = new THREE.Color(0xffcc00);
		color.multiplyScalar(brightness);
		scene.fog.color.set(parseInt("0x"+color.getHexString()));
		renderer.setClearColor(parseInt("0x"+color.getHexString()), 1);
	}catch(e){
		console.log(e.message);
		console.log(THREE);
	}

},200);

var sandstormStarted = false
setInterval(function(){
	if(Math.random()>0.9 && !sandstormStarted){
		message("Sandstorm!","You have been hit by a sandstorm.","red");
		sandstorm(true);
		sandstormStarted = true;
		let waitingTime= Math.round(Math.random()*40000)+5000
		setTimeout(function(){
			sandstorm(false);
			sandstormStarted = false;
			message("Sandstorm!","The sandstorm has vanished.","green");
		},waitingTime)
		
		setTimeout(function(){
			sandstormStarted = false;
		},waitingTime+1000)
	}
	
},4000);

setTimeout(function(){
	for(let object of objects){
			object.mesh.position.y = object.mesh.geometry.parameters.height/2 + getFirstIntersection(object.mesh.position.x,object.mesh.position.y,object.mesh.position.z,100,object).y 
	}
	document.getElementById("cross").style.top = parseInt(canvas.offsetHeight)/2+"px";
},500)
