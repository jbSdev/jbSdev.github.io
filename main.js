import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	3000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialiasing: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

camera.position.set(10, 10, 20);
camera.lookAt(0, 0, 0);

// Plane and Center Points

function showGrid()
{
	const geo = new THREE.SphereGeometry(0.05, 32, 16);
	const mat = new THREE.MeshBasicMaterial({color: 0xffffff});
	const pcen = new THREE.Mesh(geo, mat);
	const pbot = new THREE.Mesh(geo, mat);
	const pleft = new THREE.Mesh(geo, mat);
	const pback = new THREE.Mesh(geo, mat);
	pcen.position.set(0, 0, 0);
	pleft.position.set(-5, 0, 0);
	pbot.position.set(0, -5, 0);
	pback.position.set(0, 0, -5);
	scene.add(pcen, pbot, pleft, pback);

	const gridHelpx = new THREE.GridHelper(10, 10, 0x0000cc, 0x666666);
	const gridHelpy = new THREE.GridHelper(10, 10, 0x00cc00, 0x666666);
	const gridHelpz = new THREE.GridHelper(10, 10, 0xcc0000, 0x666666);
	gridHelpx.position.set(0, -5, 0);
	gridHelpy.position.set(-5, 0, 0);
	gridHelpz.position.set(0, 0, -5);
	gridHelpy.rotation.z = 1.57079633;
	gridHelpz.rotation.x = 1.57079633
	scene.add(gridHelpx, gridHelpy, gridHelpz);
}
showGrid();
// ----------------------------------------------------------------------------------------------------

// Points

let point_x = 0;
let point_y = 0;
let point_z = 0;

let point2_x = 0;
let point2_y = 0;
let point2_z = 0;

const pgeo = new THREE.SphereGeometry(0.05, 32, 16);
const pmat1 = new THREE.MeshBasicMaterial({color: 0x00ff00});
const pmat2 = new THREE.MeshBasicMaterial({color: 0xff00ff});
const p1 = new THREE.Mesh(pgeo, pmat1)
const p2 = new THREE.Mesh(pgeo, pmat2);

p1.position.set(point_x, point_y, point_z);
p2.position.set(point2_x, point2_y, point2_z);

scene.add(p1, p2);


// ----------------------------------------------------------------------------------------------------

function create_box(x, y, z)
{
	// Box
	const geometry_box = new THREE.BoxGeometry(1, 1, 1);
	const edges_box = new THREE.EdgesGeometry (geometry_box);
	const box = new THREE.LineSegments (edges_box, new THREE.LineBasicMaterial({color: 0x2345ff}));
	box.position.set(x, y, z);
	box.lookAt(point2_x, point2_y, point2_z);
	scene.add(box);
}

// ----------------------------------------------------------------------------------------------------

// Creating boxes as group

function constructGroup(x, y, z, lookx, looky, lookz)
{
	// Box
	const geometry_box = new THREE.BoxGeometry(1, 1, 1);
	const edges_box = new THREE.EdgesGeometry (geometry_box);
	const box = new THREE.LineSegments (edges_box, new THREE.LineBasicMaterial({color: 0x2345ff}));
	box.position.set(0, 0, 0);
	
	// Circles - i know it's ugly, but it works! :D
	const geometry_circle = new THREE.CircleGeometry(0.5, 16);
	const edges_circle = new THREE.EdgesGeometry(geometry_circle);
	const circle1 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	const circle2 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	const circle3 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	const circle4 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	const circle5 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	const circle6 = new THREE.LineSegments(edges_circle, new THREE.LineBasicMaterial({color: 0xaaaaff}));
	circle1.position.set(0.5, 0, 0);		// right
	circle2.position.set(-0.5, 0, 0);		// left
	circle3.position.set(0, 0.5, 0);		// front
	circle4.position.set(0, -0.5, 0);		// back
	circle5.position.set(0, 0, 0.5);		// top
	circle6.position.set(0, 0, -0.5);		// back
	circle1.rotation.y += 1.57079633;
	circle2.rotation.y += 1.57079633;
	circle3.rotation.x += 1.57079633;
	circle4.rotation.x += 1.57079633;
	circle5.rotation.z += 1.57079633;
	circle6.rotation.z += 1.57079633;
	
	const group = new THREE.Group();
	group.add(box, circle1, circle2, circle3, circle4, circle5, circle6);
	group.position.set(x, y, z);
	group.lookAt(lookx, looky, lookz);
	scene.add(group);
}

// ----------------------------------------------------------------------------------------------------

// Creating the line

function constructLineOrigin(x, y, z)
{
	let repeats = Math.ceil(Math.sqrt((x * x) + (y * y) + (z * z))); 
	const vector = new THREE.Vector3(x, y, z);
	vector.normalize();
	const origin = new THREE.Vector3(0, 0, 0);
	const color = (Math.floor(Math.random() * 16777215).toString(16));
	const arrowHelper = new THREE.ArrowHelper(vector, origin, 1, '#'+color);
	scene.add(arrowHelper);
	while (repeats > 0)
	{
		constructGroup(origin.getComponent(0), origin.getComponent(1), origin.getComponent(2), x, y, z);
		origin.add(vector);
		repeats--;
	}
}

// ----------------------------------------------------------------------------------------------------

// GUI

const gui = new GUI();
const p1Folder = gui.addFolder('First point position');
p1Folder.add(p1.position, 'x', -5, 5);
p1Folder.add(p1.position, 'y', -5, 5);
p1Folder.add(p1.position, 'z', -5, 5);

const p2Folder = gui.addFolder('Second point position');
p2Folder.add(p2.position, 'x', -5, 5);
p2Folder.add(p2.position, 'y', -5, 5);
p2Folder.add(p2.position, 'z', -5, 5);

var button = {
	add: function() {
		scene.remove.apply(scene, scene.children);
		showGrid();
		scene.add(p1, p2);
		constructLineOrigin(p1.position.x, p1.position.y, p1.position.z);
		constructLineOrigin(p2.position.x, p2.position.y, p2.position.z);
	}
};
gui.add(button, 'add').name('Render');
gui.close();



// ----------------------------------------------------------------------------------------------------

// Resize

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera);
}

// Render

function animate()
{
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
animate();