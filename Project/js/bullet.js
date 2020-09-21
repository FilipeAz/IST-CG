'use strict';
function Bullet(position, wireframe, material) {	
	CollidableModel.apply(this, ['box', position, wireframe, material]);
}

Bullet.prototype = {
	createModel:
		function(model, position, wireframe, material) {
			var model = new THREE.Object3D();
       
			model.userData = {
				speed: new THREE.Vector3(0, 75, 0),
				direction: (new THREE.Vector3(0, 1, 0)).normalize(),
				rotation: new THREE.Vector3(0, Math.PI / 25, 0)
			};
	   
			model.add(new Tetrahedron({x: 0, y: 0, z: 0, color: 0xFFFFFF, radius: 2, width: 1.3, height: 5, depth: 1.3, xRot: Math.PI - (Math.PI / 6), zRot: Math.PI/5, wireframe: wireframe, material: material}));
	
			model.position.copy(position);
	
			return model;
		},
		
	handleCollision:
		function(origPos, model) {
			if(model instanceof Alien) {
				scene.unregisterModel(model);
				scene.unregisterModel(this);
				
				if(scene.getModelCount(Alien, null) == 0) {
					hasWon = true;
					restart();	
				}
			}
			else if(model instanceof Wall) {
				scene.unregisterModel(this);
			}
			
			if(this.visibleBound) { scene.getModel().remove(this.visibleBound); } //debug
		}
	};

extend(Bullet, CollidableModel);