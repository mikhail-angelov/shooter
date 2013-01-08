function Particle(mesh) {
	this.position = new THREE.Vector3(0, 0, 0);
	this.velocity = new THREE.Vector3(0, 0, 0);
	this.rotation = new THREE.Vector3(0, 0, 0);

	this.object = new THREE.Object3D();
	this.object.add(mesh);

	this.alive = true;
	this.dissmisable = true;
	this.size = 10;
	this.countdown = 150; //live countdown
}

Particle.prototype.update = function() {
	//shift object, todo: check collisions
	this.position.addSelf(this.velocity);
	this.object.position = this.position;
	this.object.rotation = this.rotation;
	if(this.countdown > 0) this.countdown--;
	if(this.countdown == 0) this.alive = false;
};

Particle.prototype.isActive = function() {
	return this.alive;
};

Particle.prototype.hit = function() {
	// nothing
};