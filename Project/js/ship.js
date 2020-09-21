'use strict';
function Ship(maxSpeed, thrust, position, color, type, lives) {
	this.setProperty('maxSpeed', maxSpeed);
	this.setProperty('thrust', thrust);
	this.setProperty('reloadTime', SHIP_RELOAD);
	this.setProperty('firing', false);
	this.setProperty('type', type);
	this.setProperty('lives', lives);
	
	CollidableModel.apply(this, ['box', position, color]);
}

Ship.prototype = {
	createModel: 
		function(model, position, color, lives) {
			model.userData.thrusting = 0;
	
			model.add(new Box({x: 1,  y: -2, z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: 2,  y: -1, z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: 3,  y: 0,  z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: 5,  y: 0,  z: 0, color: color, width: 1, height: 9,  depth: 4}));
			model.add(new Box({x: 6,  y: 1,  z: 0, color: color, width: 1, height: 10, depth: 2}));
			model.add(new Box({x: 7,  y: 3,  z: 0, color: color, width: 1, height: 10, depth: 4}));
			model.add(new Box({x: 4,  y: 3,  z: 0, color: color, width: 1, height: 13, depth: 4}));
			model.add(new Box({x: 8,  y: 3,  z: 0, color: color, width: 1, height: 20, depth: 8}));

			model.add(new Box({x: 0,  y: 0,  z: 0, color: color, width: 1.5, height: 10, depth: 4}));
	
			model.add(new Box({x: -1, y: -2, z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: -2, y: -1, z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: -3, y: 0,  z: 0, color: color, width: 1, height: 4,  depth: 4}));
			model.add(new Box({x: -5, y: 0,  z: 0, color: color, width: 1, height: 9,  depth: 4}));
			model.add(new Box({x: -6, y: 1,  z: 0, color: color, width: 1, height: 10, depth: 2}));
			model.add(new Box({x: -7, y: 3,  z: 0, color: color, width: 1, height: 10, depth: 4}));
			model.add(new Box({x: -4, y: 3,  z: 0, color: color, width: 1, height: 13, depth: 4}));
			model.add(new Box({x: -8, y: 3,  z: 0, color: color, width: 1, height: 20, depth: 8}));

			model.position.copy(position);

			if(this.type == 'life') { this.setMaterial(THREE.MeshBasicMaterial, model); }

			return model;
		},

	update:
		function(delta) {
			var modelProps = this.getModelProperties();
			var model = this.getModel();
			
			this.updateSpeed(modelProps, model, delta);
			this.updateReload(modelProps, model, delta);
			
			CollidableModel.prototype.update.call(this, delta);
		},
		
	handleCollision:
		function(origPos, model) {
			var modelProps = this.getModelProperties();
			
			if(model instanceof Wall) {
				modelProps.speed.x = 0;
			
				//ship model misalligned
				var width = getModelWidth(this.getBoundingGeometry()) / 2;
				var xPos = Math.sign(model.getModel().position.x) < 0 ? 
					model.getModel().position.x + (getModelWidth(model.getBoundingGeometry()) / 2) + width
					: model.getModel().position.x - (getModelWidth(model.getBoundingGeometry()) / 2) - width
				
				this.model.position.set(xPos, origPos.y, origPos.z);
			}
			else if(model instanceof Alien) {
				scene.unregisterModel(model);
				this.lives--;

				if(scene.getModelCount(Ship, 'life') == 0) {
					scene.triggerPause();
					restart();
				}
				else {
					this.updateLives();
				}
			}
		},
		
	updateLives:
		function() {
			for(var i = 0; i < scene.getModels().length; i++) {
				if(scene.getModels()[i] instanceof Ship && scene.getModels()[i].type == 'life') {
					scene.unregisterModel(scene.getModels()[i]);
					return;
				}
			}
		},
	
	//move to modelContainer
	updateSpeed:
		function(modelProps, model, delta) {
			var deltaSpeed = delta * this.thrust;
			
			if(modelProps.thrusting) {
				//console.log('Accelarating ' + ((modelProps.direction.x == 1) ? "Right " : "Left ") + modelProps.speed.x);
			
				if(Math.abs(modelProps.speed.x + deltaSpeed) < this.maxSpeed) {
					modelProps.speed.x += deltaSpeed * modelProps.thrusting;
				}	
				else if(Math.abs(modelProps.speed.x + deltaSpeed) >= this.maxSpeed && Math.sign(modelProps.speed.x) != Math.sign(deltaSpeed * modelProps.thrusting)) {
					modelProps.speed.x += deltaSpeed * modelProps.thrusting;
				}
				else {
					modelProps.speed.x = this.maxSpeed * modelProps.thrusting;
				}
			}
			else if(Math.abs(modelProps.speed.x) > 0){
				//console.log('Stopping ' + modelProps.speed);
				var slowSpeed = -((Math.abs(modelProps.speed.x) / modelProps.speed.x) * deltaSpeed);
		
				if(modelProps.speed.x < 0 && modelProps.speed.x + slowSpeed > 0 || modelProps.speed.x > 0 && modelProps.speed.x + slowSpeed < 0) {
					modelProps.speed.x = 0;
				}
				else {
					modelProps.speed.x += slowSpeed;
				}
			}
			
			modelProps.direction.x = 1; 
		},
		
	updateReload:
		function(modelProps, model, delta) {
			var reloadTime = this.reloadTime;
			
			if(reloadTime <= 0) { reloadTime = SHIP_RELOAD; }
				
			if(reloadTime == SHIP_RELOAD && this.firing) {
				//console.log('Firing!')
				var bullet = new Bullet(new THREE.Vector3(model.position.x, model.position.y + 5.3, model.position.z), this.getWireframe(), this.getMaterial().constructor);
				scene.registerModel(bullet);
				
				reloadTime -= delta;
			} 
			else if(reloadTime < SHIP_RELOAD) {
				//console.log('Reloading ' + this.reloadTime);
				reloadTime -= delta;
			}
			
			this.reloadTime = reloadTime;
		},
	
	//Getters and Setters
	setDirection:
		function(direction) {
			this.setModelProperty('direction', new THREE.Vector3(direction.x, direction.y, direction.z));
		},
		
	getDirection:
		function() {
			return this.getModelProperty('direction');
		},
		
	setThrusting:
		function(thrusting) {
			this.setModelProperty('thrusting', thrusting);
		},
		
	getThrusting:
		function() {
			this.getModelProperty('thrusting');
		},
		
	setFiring:
		function(firing) {
			this.setProperty('firing', firing);
		},
		
	getFiring:
		function() {
			return this.getProperty('firing');
		},
		
	getSpotLight:
		function() {
			var spotLight = null;
			
			this.getModel().traverse(
				function(part) {
					if(part instanceof THREE.SpotLight) {
						spotLight = part;
						return
					}
				});
			
			return spotLight;
		},
	
	getLives:
		function() {
			return this.lives;
		}
	
	};
	
extend(Ship, CollidableModel);