//hack, static variable
var personFactory = {
	pending: [],
	geometry: null,
	material: null,
	mesh: null,
	error: false
};

function Person(position, cb){
	var param = {self: this, position: position, cb: cb};
	if(personFactory.pending.length > 0) {
		personFactory.pending.push(param);
	} else if(personFactory.mesh == null && personFactory.error == false) {
		personFactory.pending.push(param);
		loadModel();
	} else if(personFactory.mesh != null){
		this.init(param);
	} else {
		//error
		console.log("cannot load model for Person");
	}

}

Person.prototype = Object.create(Particle.prototype);
Person.prototype.constructor = Person;

Person.prototype.init = function(param){
	//call superclass constructor here
	this.size = 30;
	
	var m = personFactory.mesh.clone();
	Particle.call(this, m);
	
	this.position = param.position;
	this.countdown = -1; //forever

	param.cb.add(this);
	//remove it from pending list
	if (personFactory.pending.length > 0) {
		for (var i = personFactory.pending.length - 1; i >= 0; i--) {
			if(personFactory.pending[i] == param){
				personFactory.pending.splice(i,1); //it should be a better way to do this
			}
		}
	}
	if(personFactory.pending.length > 0){
		var param = personFactory.pending[0];
		param.self.init(param); //tricky
	}
}

Person.prototype.update = function() {
	Particle.prototype.update.call(this);
	this.rotation.y += 0.002; //spin it around
};

Person.prototype.buildMesh = function() {
	var size = this.size;
	var n = this.chunks;
	var cube;


	// Create an array of materials to be used in a cube, one for each side
	var cubeMaterialArray = [];
	// order to add materials: x+,x-,y+,y-,z+,z-
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map:this.texture} ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map:this.texture} ) );
	// Cube parameters: width (x), height (y), depth (z), 
	//        (optional) segments along x, segments along y, segments along z, materials array
	var cubeGeometry = new THREE.CubeGeometry( size,size,size/n); // , 1, 1, 1, cubeMaterialArray );
//THREE.GeometryUtils.normalizeUVs(cubeGeometry);
	// using THREE.MeshFaceMaterial() in the constructor below
	//   causes the mesh to use the materials stored in the geometry
	var cube = new THREE.Mesh( cubeGeometry, new THREE.MeshFaceMaterial(cubeMaterialArray) )
	//var cube = new THREE.Mesh(new THREE.CubeGeometry(size,size,size), new THREE.MeshBasicMaterial({map:texture}));
//THREE.GeometryUtils.normalizeUVs(cubeGeometry);
//cubeGeometry.faceVertexUvs[0][0][0].v =0.5


 /*   var material = new THREE.MeshBasicMaterial( { map: this.texture });
	var runnerGeometry = new THREE.CubeGeometry(size, size, size/n);
	var cube = new THREE.Mesh(runnerGeometry, material);
	cube.doubleSided = true;
*/
	return cube;

};

Person.prototype.hit = function() {
	var size = this.size;
	var n = this.chunks;
	var texture = this.texture;
	var mesh;
	var particles = [];
	var particle;

	var pg = new THREE.CubeGeometry( 5, 5, 5 );
	var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var geometry = this.object.children[0].geometry;

mesh = new THREE.ParticleSystem( geometry, new THREE.ParticleBasicMaterial( { size: 2, color: 0xff0000 } ) );
particle = new Particle(mesh);
		
particles.push(mesh);					
/*	
	for (var i = geometry.vertices.length - 1; i >= 0; i--) {
		var m = new THREE.Mesh(pg, material);
		m.position = geometry.vertices[i].clone();
		particle = new Particle(m);
		
		particles.push(particle);
	};
*/
/*
	var cubeMaterialArray = [];
	// order to add materials: x+,x-,y+,y-,z+,z-
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map:this.texture} ) );
	cubeMaterialArray.push( new THREE.MeshBasicMaterial( { map:this.texture} ) );

	var material = new THREE.MeshFaceMaterial(cubeMaterialArray);

	console.log('start');
	
	for (var i = 0; i < n ; i++) {
		for (var j = 0; j < n ; j++) {
			var geometry = new THREE.CubeGeometry(size/n, size/n, size/n);
			var uvSet = geometry.faceVertexUvs[0][5];
			//update texture coordinates
			uvSet[0].u = i/n; uvSet[0].v = (j+1)/n;
			uvSet[1].u = i/n; uvSet[1].v = j/n;
			uvSet[2].u = (i+1)/n; uvSet[2].v = j/n;
			uvSet[3].u = (i+1)/n; uvSet[3].v = (j+1)/n;
			//--

			//console.log(uvSet);
			particle = new Particle(new THREE.Mesh(geometry, material));
			particles.push(particle);

			particle.position = this.position.clone();
			particle.position.x -= (size+2)*i/n;
			particle.position.y += (size+2)*j/n;
			particle.velocity.x = (Math.random() - 0.5) * 5;
			particle.velocity.y = (Math.random() - 0.5) * 1.5;
			particle.velocity.x = (Math.random() - 0.5) * 5;

			particle.update = chunkUpdate;
		};
	};
*/
	console.log('end');		

	//remove self
	this.alive = false;

	return null;
};

//overite update function for particles
chunkUpdate = function(){
	//call parent method
	Particle.prototype.update.call(this);

	//if bullet is far away - dismis it.
	if (this.position.length > 100) {
		this.alive = false;
	};
}

loadModel = function(){

	var loader = new THREE.JSONLoader();
				var callbackMale = function ( geometry, materials ) {
					personFactory.geometry = geometry;
					personFactory.material = materials;
					personFactory.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );

					personFactory.mesh.scale.set(0.4,0.4,0.4);

					//continue preson creation
					if(personFactory.pending.length > 0){
						var param = personFactory.pending[0];
						param.self.init(param); //tricky
					}
				};
				
	loader.load( "images/male02/Male02_dds.js", callbackMale );
	//loader.load( "images/female02/Female02_slim.js", callbackFemale );
}

