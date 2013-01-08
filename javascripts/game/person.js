function Person(position){
	this.p = [];
	this.position = position;
	this.chunks = 4;
	this.size = 30;
	this.texture = THREE.ImageUtils.loadTexture('images/man.bmp');

	Particle.call(this, this.buildMesh());
	
	this.position = position;
	this.rotation.y = Math.PI/2;
	this.countdown = -1; //forever
}

Person.prototype = Object.create(Particle.prototype);
Person.prototype.constructor = Person;

Person.prototype.update = function() {
	Particle.prototype.update.call(this);
	this.rotation.y += 0.02; //spin it around
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
	console.log('end');		

	//remove self
	this.alive = false;

	return particles;
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