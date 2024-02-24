import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 )

// для функций панорамы
let pano = 'p1'
const canvas = document.getElementById(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
var texture = new THREE.TextureLoader().load(`./static/img/${pano}/${pano}.jpg`)
var material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} )
const geometry2 = new THREE.SphereGeometry(15, 64)

var controls = new OrbitControls(camera, renderer.domElement)

var sphere = new THREE.Mesh( geometry2, material )

function init() {
	renderer.setSize( window.innerWidth, window.innerHeight )
	texture.encoding = THREE.sRGBEncoding

	// controls.enableDamping = true
	controls.rotateSpeed = -0.5
	controls.panSpeed = 0
	controls.zoomSpeed = 5
	controls.enableZoom = false

	scene.add( sphere )

	camera.position.z = 0.1
	controls.saveState()
	controls.update()
	setarrows(pano)
}


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

function Cgoto(event) {	// переход для консоли
	let tile = document.getElementById('cLine').value
	controls.reset()
	setarrows(tile)
	scene.remove(sphere)
	texture = new THREE.TextureLoader().load(`./static/img/${tile}/${tile}.jpg`)
	texture.encoding = THREE.sRGBEncoding
	material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} )
	sphere = new THREE.Mesh( geometry2, material )
	scene.add(sphere)
}

function goto(tile) {
	console.log(tile)
	scene.remove(sphere)
	texture = new THREE.TextureLoader().load(`./static/img/${tile}/${tile}.jpg`)
	texture.encoding = THREE.sRGBEncoding
	material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: false, map: texture} )
	sphere = new THREE.Mesh( geometry2, material )
	scene.add(sphere)
	setarrows(tile)
}

function setarrows(current) {
	let xhr = new XMLHttpRequest();

	xhr.open('POST', 'http://127.0.0.1:8000/');

	// 3. Отсылаем запрос
	xhr.send(current);

	let arrows = [...document.getElementsByClassName('arrow')]
	for(let i in arrows) {
		arrows[i].remove()
	}

	// 4. Этот код сработает после того, как мы получим ответ сервера
	xhr.onload = function() {
		var restext = this.responseText
		let result = JSON.parse(restext)
		let res = result['arroworder']
		let dir_values = {
			'l': 0,
			'f': 1,
			'r': 2,
			'b': 3
		}
		
		let arrows = [...document.getElementsByClassName('arrow')]

		let arrforwid = -1
		
		for(let i in res) {
			let dir = result['info'][res[i]]
			if(dir == 'f') {
				arrforwid = res[i]

			}

			let elem = document.createElement('img')
			
			
			if(dir_values[dir] == 1) {
				elem.style.marginBottom = '60px'
			}

			if(dir_values[dir] == 3) {
				let arrdiv = document.getElementById('arrowsdiv').getBoundingClientRect()	// координаты parent'a (arrowsdiv)
				let arrforw = ''

				if(arrforwid == -1) {
					elem.style.right = `${(arrdiv.width / 2) + 20}px`
				} else {
					arrforw = document.getElementById(`arrow_${arrforwid}`).getBoundingClientRect().right	// координаты child'a (стрелки вперед)
					elem.style.right = `${arrdiv.right - arrforw}px`
				}
				elem.style.position = 'absolute'
				elem.style.margin = '0px'
				elem.style.top = `100px`	// 100px
			}

			elem.setAttribute('id', `arrow_${res[i]}`)
			elem.setAttribute('class', 'arrow')
			elem.setAttribute('src', 'static/img/arrow.png')
			elem.onclick = function() { goto(res[i]) }
			
			elem.style.rotate = `${90 * dir_values[dir] + controls.getAzimuthalAngle() * (180 / Math.PI)}deg`	// устанавливаем поворот стрелки
			elem.style.visibility = 'visible'

			document.getElementById('arrowsdiv').appendChild(elem)
		}
	// setsigns(result['signs'])
	};
}

function rotatearrows(event) {	// расчитываем поворот стрелок перехода при движении панорамы
	let arrows = [...document.getElementsByClassName('arrow')]
	for(let i in arrows) {
		let rotangle = (controls.getAzimuthalAngle()  - prevAzimAngle) * (180 / Math.PI)	// пересчитываем радианы в градусы
		arrows[i].style.rotate = `${(parseFloat(arrows[i].style.rotate.slice(0, -3)) + rotangle)}deg`
		// console.log(controls.getAzimuthalAngle())
	}
}

function setsigns(data) {
	for(let i in data) {
		let splitted = data[i].split(';')
		console.log(splitted)
		let elem = document.createElement('img')
		elem.setAttribute('class', 'info')
		elem.setAttribute('id', splitted[0])
		elem.setAttribute('src', 'static/img/info.png')
		elem.style.left = String(splitted[3]).trim() + 'px'
		elem.style.top = String(splitted[4]).trim() + 'px'
		elem.style.position = 'absolute'
		document.body.appendChild(elem)
	}
}

addEventListener("keydown", isFullscreen)
// addEventListener('mousemove', rotatearrows)

var prevAzimAngle = 0;
document.body.onmousedown = function() { 
  prevAzimAngle = controls.getAzimuthalAngle();
}

function getoverelement(event) {	// получаем элемент над которым находится мышка 
	// console.log(event.target.id)
	return event.target
}

function zooming(event) {
	if(getoverelement(event).id != 'map') {
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
		prevAzimAngle = 0
	} else {
		resize_map(event)
	}
}


function resize_map(event) {
	let map = document.getElementById('map')
	let mapcanv = document.getElementById('mapcanv')
	console.log(mapcanv.offsetWidth)
	map.style.width = String(map.offsetWidth) + 'px'
	if(event.deltaY < 0) {
		let w = parseInt(map.style.width.slice(0, -2))
		// if((w - 10) < mapcanv.offsetWidth) {
			map.style.width = String(w - 25) + 'px'
		// }
	}
}

// addEventListener('mousemove', function(event) { console.log(event.clientX, event.clientY) })
addEventListener('mouseover', getoverelement)
addEventListener('mouseup', rotatearrows)
addEventListener('wheel', zooming)

// document.getElementById('cBut').addEventListener('click', Cgoto)
init()
animate()