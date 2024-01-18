import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 )



let pano = 'p1'
const canvas = document.getElementById(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize( window.innerWidth, window.innerHeight )
var texture = new THREE.TextureLoader().load(`./static/img/${pano}.jpg`)
texture.encoding = THREE.sRGBEncoding

// const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10)
// let vekt = new THREE.Vector3()



// for(let point = 0; point < geometry.attributes.position.count; point++) {
// 	vekt.fromBufferAttribute(geometry.attributes.position, point)
// 	vekt.normalize()
// 	geometry.attributes.position.setXYZ(point, vekt.x, vekt.y, vekt.z)
// 	var latitude = Math.asin(vekt.y)
// 	var longitude = Math.atan2(vekt.x, -vekt.z)
// 	coordinatetopoint(latitude, longitude)
// }
// geometry.computeVertexNormals()

// function coordinatetopoint(lat, long) {
// 	var y = Math.sin(lat)
// 	var r = Math.cos(lat)
// 	var x = Math.sin(long) * r
// 	var z = -Math.cos(long) * r
// 	console.log(new THREE.Vector3(x, y, z))
// 	return new THREE.Vector3(x, y, z)
// }

var controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.rotateSpeed = -0.5
controls.panSpeed = 0
controls.zoomSpeed = 5
controls.enableZoom = false
var material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} )
const geometry2 = new THREE.SphereGeometry(15, 64)
// const cubic = new THREE.Mesh( geometry2, material2 )
var sphere = new THREE.Mesh( geometry2, material )

scene.add( sphere )

camera.position.z = 0.1


controls.update()


function animate() {
	requestAnimationFrame( animate )

	controls.update()

	renderer.render( scene, camera )
}


function isFullscreen(event) { 
	if (event.keyCode == 122) {
		canvas.style.height = "100vh"
	}
}


function changeclicked(event) {		// смена панорамы
	scene.remove(sphere)
	texture = new THREE.TextureLoader().load(`./static/img/${event.target.id}.jpg`)
	texture.encoding = THREE.sRGBEncoding
	material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} )
	sphere = new THREE.Mesh( geometry2, material )
	scene.add(sphere)
	generatingList(event.target.id)
}


function takingphotos(target) {		// берем данные о нынешней панораме и зависимых от неё из словаря
	var dict = {	// словарь с переходами
		"p0": "1 2",
		"p1": "0 4 13",
		"p2": "3 19",
		"p3": "2 4",
		"p4": "0 1 3",
		"p5": "6 13",
		"p6": "5 7",
		"p7": "6 8",
		"p8": "7 9",
		"p9": "8 10",
		"p10": "9 11",
		"p11": "10 14",
		"p12": "14 16",
		"p13": "1 5",
		"p14": "11 12 16",
		"p15": "16 19",
		"p16": "14 15 12",
		"p17": "19 18",
		"p18": "17",
		"p19": "17 2"
	}
	for(var key in dict) {
		if(target == key) {
			placingarrows(target)
			return dict[key]
		}
	}
}

function placingarrows(current) {
	var dict = {	// словарь с переходами
		"p0": "1 2",
		"p1": "r f l",
		"p2": "3 19",
		"p3": "2 4",
		"p4": "0 1 3",
		"p5": "6 13",
		"p6": "5 7",
		"p7": "6 8",
		"p8": "7 9",
		"p9": "8 10",
		"p10": "9 11",
		"p11": "10 14",
		"p12": "14 16",
		"p13": "1 5",
		"p14": "11 12 16",
		"p15": "16 19",
		"p16": "14 15 12",
		"p17": "19 18",
		"p18": "17",
		"p19": "17 2"
	}
	let elem = document.createElement('div')
	// elem.setAttribute('id')
}


function generatingList(current) {
	var list = document.getElementById("spisok_vibora")	// список, в который мы будем добавлять элементы (на странице)
	list.innerHTML = ''		// убираем все предыдущие вараинты выбора


	var versions = takingphotos(current).split(' ')	// получаем элементы в которые можем пойти
	
	for(var i = 0; i < versions.length; i++){
		let elem = document.createElement('li')		// эелемент списка
		let ima = document.createElement('img')		// фото для этого элемента
		ima.setAttribute('id', `p${versions[i]}`)
		ima.setAttribute('class', 'variants')
		ima.setAttribute('src', `./static/img/p${versions[i]}.jpg`)
		ima.setAttribute('alt', `Needs img: ${versions[i]}`)
		elem = ima
		list.appendChild(elem)
	}

	var phs = document.getElementsByClassName('variants')

	const buttonsArray = [...phs];    // список этих кнопок

	buttonsArray.forEach((item) => {
		item.addEventListener("click", changeclicked)
	});
}

generatingList('p1')

function coordin(event) {
	console.log(`X: ${event.clientX} Y: ${event.clientY} ${controls.getAzimuthalAngle()}`)
}


function zooming(event) {
	if(event.deltaY < 0) {
		if(camera.zoom + 1 < 5) {
			camera.zoom += 0.2
			camera.updateProjectionMatrix()
		}
	}
	else {
		if(camera.zoom - 1 > 0) {
			camera.zoom -= 0.2
			camera.updateProjectionMatrix()
		}
	}
}

addEventListener("keydown", isFullscreen)
addEventListener('wheel', zooming)
animate()
