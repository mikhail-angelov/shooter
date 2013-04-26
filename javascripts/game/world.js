
world = function(map, map_scale){
	this.map = map;
	this.map_scale = map_scale;

	//create 2d array
	this.objects = new Array(this.map[0].length);
	for (var i = this.objects.length - 1; i >= 0; i--) {
		this.objects[i] = new Array(this.map.length);
	}
	
	//load textures
	this.textures = new Array(4);
	this.textures[0] =  THREE.ImageUtils.loadTexture('images/walls/efloor590.bmp');
	this.textures[0].wrapS = THREE.RepeatWrapping;
    this.textures[0].wrapT = THREE.RepeatWrapping;
    this.textures[0].repeat.x = 128;
    this.textures[0].repeat.y = 128;
    this.textures[1] =  THREE.ImageUtils.loadTexture('images/walls/ss111.jpg');
	this.textures[2] = THREE.ImageUtils.loadTexture('images/walls/brick.png');
	this.textures[3] = THREE.ImageUtils.loadTexture('images/walls/door.bmp');
}

world.prototype.init = function(scene){

    console.log('w: ' + this.map[0].length + '  h: ' + this.map.length);

	var world = {width: (this.map[0].length * this.map_scale), height: (this.map.length * this.map_scale)};
	
	//floor
	var mesh = new THREE.Mesh(new THREE.CubeGeometry(world.width, 5, world.height), new THREE.MeshBasicMaterial({map: this.textures[0]}));
	mesh.overdraw = true;
	mesh.position.set(-50 + world.width/2, 1, -50 + world.height/2);
	scene.add(mesh); 
    //sky
	mesh = new THREE.Mesh(new THREE.CubeGeometry(world.width*2, 5, world.height*2), new THREE.MeshBasicMaterial({map: this.textures[1]}));
	mesh.overdraw = true;
	mesh.position.set(-50 + world.width, 200, -50 + world.height);
	scene.add(mesh);


    //walls
	for ( var y = this.map.length - 1; y >= 0; y -- ) {
		for (var x = this.map[y].length - 1; x >= 0; x--) {

			if(this.map[y][x] == 2){
				mesh = new THREE.Mesh(new THREE.CubeGeometry(this.map_scale, this.map_scale, this.map_scale), new THREE.MeshBasicMaterial({map: this.textures[2]}));
				mesh.position.set(this.map_scale * x, 50, this.map_scale * y);
			} else if (this.map[y][x] == 3) {
				mesh = new THREE.Mesh(new THREE.CubeGeometry(this.map_scale, this.map_scale, this.map_scale), new THREE.MeshBasicMaterial({map: this.textures[3]}));
				mesh.position.set(this.map_scale * x, 50, this.map_scale * y);
			} else {
				mesh = null;
			};
			if (mesh) {
				mesh.overdraw = true;
				scene.add(mesh);
				this.objects[x][y] = mesh;				
			};
		}
	}


	//add lights
	var ambientLight = new THREE.AmbientLight(0xfff);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 10, 1000, 10 ).normalize();
	scene.add( directionalLight );

	//add some fog
	//scene.fog = new THREE.Fog( 0xddddff, 0, 750 );
}

world.prototype.getObject = function(x,y) {
	return this.objects[x][y];
};