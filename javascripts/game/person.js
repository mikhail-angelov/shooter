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

Person.prototype.hit = function() {

	console.log('end');		

	//remove self
	this.alive = false;

	return new ParticlesEffect(this.position, personFactory.geometry);
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


