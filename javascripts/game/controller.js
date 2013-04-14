
controller = function(camera, position_probe, door_probe, shoot, jump){

	this.camera = camera;
	this.position_probe = position_probe;
	this.door_probe = door_probe;
	this.shoot = shoot;
	this.jump = jump;

    var self = this;
	
	//this callback is called in context of document, so we should use
	//self here, not this
	this._onKeyboardDown = function (event) { self.onKeyPressed(event, true); }
    this._onKeyboardUp = function (event) { self.onKeyPressed(event, false); }
    
    document.addEventListener('keydown', this._onKeyboardDown, false);
    document.addEventListener('keyup', this._onKeyboardUp, false);

    //state of key (pressed, or not)
    this.keys = { 
        up: false, down: false, left: false, right: false, 
        space: false, enter: false, control: false, alt: false, shift: false
    };
}

controller.prototype.onKeyPressed = function(event, pressed) {
	event.preventDefault(); //?

    switch (event.keyCode)
    {
        case 13: this.keys.enter = pressed; break;
        case 16: this.keys.shift = pressed; break;    
        case 17: this.keys.control = pressed; break;
        case 18: this.keys.alt = pressed; break;                        
        case 32: this.keys.space = pressed; break;
        case 37: this.keys.left = pressed; break;
        case 38: this.keys.up = pressed; break;
        case 39: this.keys.right = pressed; break;
        case 40: this.keys.down = pressed; break;
    }
}

controller.prototype.update = function(delta) {
	var position = {x: this.camera.position.x, z: this.camera.position.z};
	var zond = {x: this.camera.position.x, z: this.camera.position.z};
	var new_position = {x: this.camera.position.x, z: this.camera.position.z};
	var direction = this.camera.rotation.y;
	var shift = 5;
	var zond_shift = 15;
	//handle movements
	if(this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
		if(this.keys.up) {
			new_position.x -= shift * Math.sin(direction);
			new_position.z -= shift * Math.cos(direction);
			zond.x -= zond_shift * Math.sin(direction);
			zond.z -= zond_shift * Math.cos(direction);
		} else if (this.keys.down) {
			new_position.x += shift * Math.sin(direction);
			new_position.z += shift * Math.cos(direction);
			zond.x += zond_shift * Math.sin(direction);
			zond.z += zond_shift * Math.cos(direction);	
		}
		//check for collisions
	    new_position = this.position_probe(position, zond, new_position);

		if (this.keys.left) {
			direction += 0.03;
		} else if (this.keys.right) {
			direction -= 0.03;
		};

		this.camera.rotation.y = direction;
		this.camera.position.x = new_position.x;
		this.camera.position.z = new_position.z;
	}
	//open door
	var zond_shift = 50;
	if(this.keys.space){
		this.keys.space = false;
		zond.x -= zond_shift * Math.sin(direction);
		zond.z -= zond_shift * Math.cos(direction);
		this.door_probe(zond);
	}
	//shoot
	if(this.keys.control){
		this.keys.control = false;
		this.shoot();
	}
	//jump
	if(this.keys.shift){
		this.keys.shift = false;
		this.jump();
	}
};