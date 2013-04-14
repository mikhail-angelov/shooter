//effect from three.js sample: webgl_particles_dynamic.html


function ParticlesEffect(position, geometry) {
	//parent constructor
	Particle.call(this, this.makeParticlesSestem(geometry));

	this.position = position.clone();
	this._origine = position.clone();
	this.clock = new THREE.Clock();

	this.update();	
}
//js inheritance 
ParticlesEffect.prototype = Object.create(Particle.prototype);
//optional, set constructor property
ParticlesEffect.prototype.constructor = ParticlesEffect;

ParticlesEffect.prototype.makeParticlesSestem = function(g) {
	var i;
    var vertices = g.vertices; //redo
    var vl = vertices.length;
    var geometry = new THREE.Geometry();
    var vertices_tmp = [];
    var my_particle;
    
    for ( i = 0; i < vl; i ++ ) {
        p = vertices[ i ];
        geometry.vertices[ i ] = p.clone();
        vertices_tmp[ i ] = [ p.x, p.y, p.z, 0, 0 ];
    }
    mesh = new THREE.ParticleSystem( geometry, new THREE.ParticleBasicMaterial( { size: 2, color:0xff0000 } ));
    mesh.scale.set(0.4,0.4,0.4);
     
    this.meshes = [];
    this.meshes.push( {
        mesh: mesh, vertices: geometry.vertices, vertices_tmp: vertices_tmp, vl: vl,
        down: 0, up: 0, direction: -1, speed: 45, delay: 100,
        started: false, start: Math.floor( 100 + 200 * Math.random() ),
        dynamic: true
    } );
    return mesh;
}

ParticlesEffect.prototype.update = function() {
	var j, jl, cm, data, vertices, vertices_tmp, vl, d, vt, delta;

	//call parent method
	Particle.prototype.update.call(this);

    delta = 10 * this.clock.getDelta();
    delta = delta < 2 ? delta : 2;
    //parent.rotation.y += -0.02 * delta;
    
    for( j = 0, jl = this.meshes.length; j < jl; j ++ ) {
       
    
        data = this.meshes[ j ];
        mesh = data.mesh;
        vertices = data.vertices;
        vertices_tmp = data.vertices_tmp;
        vl = data.vl;
        if ( ! data.dynamic ) continue;
        if ( data.start > 0 ) {
            data.start -= 1;
        } else {
            if ( !data.started ) {
                data.direction = -1;
                data.started = true;
            }
        }
        for ( i = 0; i < vl; i ++ ) {
            p = vertices[ i ];
            vt = vertices_tmp[ i ];
            // falling down
            if ( data.direction < 0 ) {
                // var d = Math.abs( p.x - vertices_tmp[ i ][ 0 ] ) + Math.abs( p.y - vertices_tmp[ i ][ 1 ] ) + Math.abs( p.z - vertices_tmp[ i ][ 2 ] );
                // if ( d < 200 ) {
                if ( p.y > -100 ) {
                    // p.y += data.direction * data.speed * delta;
                    p.x += 1.5 * ( 0.50 - Math.random() ) * data.speed * delta;
                    p.y += 3.0 * ( 0.25 - Math.random() ) * data.speed * delta;
                    p.z += 1.5 * ( 0.50 - Math.random() ) * data.speed * delta;
                } else {
                    if ( ! vt[ 3 ] ) {
                        vt[ 3 ] = 1;
                        data.down += 1;
                    }
                }
            }
            // rising up
            if ( data.direction > 0 ) {
                //if ( p.y < vertices_tmp[ i ][ 1 ] ) {
                //    p.y += data.direction * data.speed * delta;
                d = Math.abs( p.x - vt[ 0 ] ) + Math.abs( p.y - vt[ 1 ] ) + Math.abs( p.z - vt[ 2 ] );
                if ( d > 1 ) {
                    p.x += - ( p.x - vt[ 0 ] ) / d * data.speed * delta * ( 0.85 - Math.random() );
                    p.y += - ( p.y - vt[ 1 ] ) / d * data.speed * delta * ( 1 + Math.random() );
                    p.z += - ( p.z - vt[ 2 ] ) / d * data.speed * delta * ( 0.85 - Math.random() );
                } else {
                    if ( ! vt[ 4 ] ) {
                        vt[ 4 ] = 1;
                        data.up += 1;
                    }
                }
            }
        }
        // all down
        if ( data.down === vl ) {
            if ( data.delay === 0 ) {
                data.direction = 1;
                data.speed = 10;
                data.down = 0;
                data.delay = 30;
                for ( i = 0; i < vl; i ++ ) {
                    vertices_tmp[ i ][ 3 ] = 0;
                }
            } else {
                data.delay -= 1;
            }
        }
        // all up
        if ( data.up === vl ) {
            if ( data.delay === 0 ) {
                data.direction = -1;
                data.speed = 35;
                data.up = 0;
                data.delay = 30;
                for ( i = 0; i < vl; i ++ ) {
                    vertices_tmp[ i ][ 4 ] = 0;
                }
            } else {
                data.delay -= 1;
            }
        }
        mesh.geometry.verticesNeedUpdate = true;
    }
}

