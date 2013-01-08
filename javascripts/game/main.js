//the purpose of this application is just for fun and it help me to learn javascript
//I used those links to write this app:
//resiurces: http://www.wolfenstein3d.co.uk
//code and map: http://www.demonixis.net/lab/index.php
//good sample: http://mroushey.com/SIS3DIIJS/03/
//some ideas: http://www.isaacsukin.com/news/2012/06/how-build-first-person-shooter-browser-threejs-and-webglhtml5-canvas
//very good resource: http://www.webgl.com

 var mmap = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,2,1,1,1,2,2,2,1,1,2],[2,1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,3,1,1,1,2,2,1,1,1,1,1,2,1,1,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,2,1,1,1,2,2,1,1,1,2,1,2,1,1,2],[2,1,1,2,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,1,2,1,1,2],[2,1,2,2,1,2,2,1,2,1,2,2,2,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1,2],[2,1,2,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,2,2,1,2,2,2,2,2,2,2,2,1,1,1,1,2],[2,1,2,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],[2,1,1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],[2,2,1,2,1,2,2,2,2,1,2,2,2,2,2,2,2,3,2,2,2,2,1,2,2,2,2,2,2,2,2,1,1,1,1,2],[2,2,1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,2],[2,1,1,2,1,1,1,1,2,1,2,2,2,2,2,1,1,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],[2,2,1,2,2,2,2,2,2,1,2,2,2,2,2,1,1,1,1,2,2,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2],[2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2],[2,2,2,2,1,2,2,2,2,1,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,1,1,1,1,2],[2,1,1,2,1,2,1,2,2,1,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,1,2],[2,1,2,2,1,2,1,2,1,1,1,1,1,2,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,2,1,2],[2,1,1,2,1,1,1,2,1,1,1,1,1,2,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,1,1,2,1,2,1,2,1,1,1,1,1,1,3,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,1,1,2,1,2,1,2,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,1,1,2,1,2,1,2,1,1,1,1,1,2,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,1,1,2,1,2,1,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,1,1,1,1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,2,2,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];

const mmap_scale = 100;
 

var camera, scene, world, renderer, controller, particleController;
var stats;
var jump_timer, jump_delta;

init();
mainLoop();

function init() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.set( 100, 50, 100 );
	camera.rotation.y = Math.PI;
	scene.add(camera);

	controller = new controller(camera, position_probe,
	                                    door_probe,
	                                    shoot,
	                                    jump);

	// init world
	world = new world(mmap, mmap_scale);
	world.init(scene);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColorHex(0xEEEEEE, 1.0);
	renderer.clear();

	stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";

    document.body.appendChild(stats.domElement);

	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
    console.log(window.innerWidth + ' --- '+ window.innerHeight );

    particleController = new ParticleController(scene, mmap, mmap_scale);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	console.log(window.innerWidth + ' --- '+ window.innerHeight );
}


function mainLoop() {
	requestAnimationFrame( mainLoop );
	stats.update();
	particleController.update();
	renderMe();
}

function renderMe() {
	controller.update();

	renderer.render( scene, camera );
}

function get_map_position(position) {
	return {x: Math.floor((position.x + mmap_scale/2 )/mmap_scale),
	        y: Math.floor((position.z  + mmap_scale/2 )/mmap_scale)};
}

function position_probe(position, zond, new_position) {

	var map_position = get_map_position(position);
	var map_position_new = get_map_position(zond);

/*	if(new_position.x != position.x || new_position.y != position.y) {
	    document.getElementById("info").innerHTML = ' x: '+position.x + ' y: '+position.z ;

	}
*/
	if(mmap[map_position.y][map_position_new.x] != 1) new_position.x = position.x;
	if(mmap[map_position_new.y][map_position.x] != 1) new_position.z = position.z;
    return new_position;
}

function door_probe(zond) {
	var map_position = get_map_position(zond);
	if(mmap[map_position.y][map_position.x] == 3){
		console.log('this is door');
		var mesh = world.getObject(map_position.x, map_position.y);
		//console.log(mesh);
		var particle = new Particle(mesh);
		particle.dissmisable = false;
		particle.countdown = -1;
		particle.velocity = new THREE.Vector3(0,-0.7,0);
		particle.isActive = function(){
			var openning = (this.position.y > -90);
			if(openning) mmap[map_position.y][map_position.x] = 1;
			return openning;
		}
		particleController.add(particle);
	}
}

function shoot() {
	var speed = 10;
	var direction = new THREE.Vector3(-speed*Math.sin(camera.rotation.y), 0,
		-speed*Math.cos(camera.rotation.y));
	var position = camera.position.clone();
	position.y = 20;
	var bullet = new Bullet(position, direction);
	particleController.add(bullet);
}

function jump() {
	jump_delta = 0;
	var gravity = -9.0;
	jump_timer = setInterval(function(){
		camera.position.y += gravity*jump_delta*jump_delta + 6.5*jump_delta;
		jump_delta += 0.005
		if(camera.position.y < 50){
			camera.position.y = 50;
			clearInterval(jump_timer);
		}
	},10);
}
