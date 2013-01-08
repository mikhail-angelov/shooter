function Bullet(position, direction) {
	//parent constructor
	Particle.call(this, this.makeBullet());

	this.position = position.clone();
	this.velocity = direction.clone();
	this._origine = position.clone();

	this.update();	
}
//js inheritance 
Bullet.prototype = Object.create(Particle.prototype);
//optional, set constructor property
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
	//call parent method
	Particle.prototype.update.call(this);
}

Bullet.prototype.makeBullet = function() {
	var size = 5;
	return new THREE.Mesh(new THREE.CubeGeometry(size, size, size), 
		new THREE.MeshBasicMaterial({color:0xff0000, wireframe:true}));
}