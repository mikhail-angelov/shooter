function ParticleController(scene, map, map_scale) {
	this.scene = scene;
	this.map = map;
	this.map_scale = map_scale;
	this.particles = [];
	this.gameCount = 0;

	//add 12 objects
	this.addPerson(1, 4);
	for (var i = 0; i < 12; i++) this.addPerson();
}

ParticleController.prototype.add = function(particle) {
	if(particle && typeof particle === 'object') {
		if (typeof particle.length === 'number') {
			//handle array
			for (var i = 0; i < particle.length; i++) {
				this.particles.push(particle[i]);
				this.scene.add(particle[i].object);
			};
		} else {
			this.particles.push(particle);
			this.scene.add(particle.object);
		}
	}
}

ParticleController.prototype.update = function(){
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var particle = this.particles[i]; 
		particle.update();
		if(!particle.isActive()){
			if(particle.dissmisable) this.scene.remove(particle.object);
			this.particles.splice(i, 1); //not good
		}
	}
	this.checkForCollide();
}

ParticleController.prototype.checkForCollide = function() {
	
	for (var i = 0; i < this.particles.length; i++) {
		var particle = this.particles[i];

		//particle vs walls (reflection)
		var map_position = get_map_position(particle.position);
		var zond = particle.position.clone();
		zond.x += particle.velocity.x;
		zond.z += particle.velocity.z; 
		var map_position_new = get_map_position(zond);
		if(this.map[map_position.y][map_position_new.x] != 1) particle.velocity.x = -particle.velocity.x;
		if(this.map[map_position_new.y][map_position.x] != 1) particle.velocity.z = -particle.velocity.z;

		//particle vs bullet
		if(particle instanceof Person) {
			for (var j = 0; j < this.particles.length; j++) {
				if(this.particles[j] instanceof Bullet){
					if(particle.position.distanceTo(this.particles[j].position) <= 
						particle.size + this.particles[j].size){
						this.particles[j].alive = false; //todo exploid bullet here
						this.add(particle.hit());

						//indicator
						this.gameCount++;
						document.getElementById("gameCount").innerHTML = 'Count - ' + this.gameCount;

						//add new person
						this.addPerson();
					}
				}
			}
		}
	}
}

function get_map_position(position) {
	return {x: Math.floor((position.x + this.map_scale/2 )/this.map_scale),
	        y: Math.floor((position.z  + this.map_scale/2 )/this.map_scale)};
}

ParticleController.prototype.addPerson = function(x_position, y_position){
	var x, y;
	if(x_position != undefined && y_position != undefined) {
		x = x_position;
		y = y_position;
	} else {
		x = Math.floor(Math.random()*this.map[0].length);
		y = Math.floor(Math.random()*this.map.length);
		while(this.map[y][x] != 1) {
			x = Math.floor(Math.random()*this.map[0].length);
			y = Math.floor(Math.random()*this.map.length);
		}
	}

    var person_position = new THREE.Vector3();
    person_position.x = x * this.map_scale;
    person_position.z = y * this.map_scale;
    person_position.y = 35;
    var person = new Person(person_position);
    this.add(person);
}