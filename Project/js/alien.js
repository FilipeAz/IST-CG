'use strict';
function Alien(position, color) {
	CollidableModel.apply(this, ['sphere', position, color]);
}

Alien.prototype = {
	createModel:
		function(model, position, color) {
			var model = new THREE.Object3D();
			
			model.userData = {
				speed: new THREE.Vector3(40, 40, 0),
				direction: (new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 2) - 1, 0)).normalize(),
				rotation: new THREE.Vector3(0, (Math.PI / 200) * Math.random() * 5, 0)
			};
			
			model.add(new Sphere({x: 0, y: 0, z: 0, color: color, radius: 8.5, phiLength: 2 * Math.PI, thetaLength: Math.PI / 2}));
			model.add(new Circle({x: 0, y: 0, z: 0, color: color, xRot: Math.PI / 2, radius: 8.5, segments: 8}));
			model.add(new Cone({x: 4,  y: -4, z: 2.5,  color: color, xRot: Math.PI, radius: 3.5, height: 9}));
			model.add(new Cone({x: -4, y: -4, z: 2.5,  color: color, xRot: Math.PI, radius: 3.5, height: 9}));
			model.add(new Cone({x: 0,    y: -4, z: -5, color: color, xRot: Math.PI, radius: 3.5, height: 9}));
		
			model.rotateX(Math.PI / 2);
			model.position.copy(position);

			return model;
		},
	
	handleCollision:
		function(origPos, model) {
			var modelProps = this.getModelProperties();

			if(model instanceof Wall) {				
				if(model.getProperty('type') == 'vertical') {
					modelProps.direction.setX(-modelProps.direction.x);
					
					var width = getModelWidth(this.getBoundingGeometry()) / 2;
					var xPos = Math.sign(model.getModel().position.x) < 0 ? 
					model.getModel().position.x + (getModelWidth(model.getBoundingGeometry()) / 2) + width
					: model.getModel().position.x - (getModelWidth(model.getBoundingGeometry()) / 2) - width;
					
					this.model.position.set(xPos, origPos.y, origPos.z);
				}
				else if(model.getProperty('type') == 'horizontal') {
					modelProps.direction.setY(-modelProps.direction.y);
					
					var height = getModelHeight(this.getBoundingGeometry()) / 2;
					var yPos = Math.sign(model.getModel().position.y) < 0 ? 
					model.getModel().position.y + (getModelHeight(model.getBoundingGeometry()) / 2) + height 
					: model.getModel().position.y - (getModelHeight(model.getBoundingGeometry()) / 2) - height;
					
					this.model.position.set(origPos.x, yPos, origPos.z);
				}
			}
			else if(model instanceof Alien) {
				var otherModelProps = model.getModelProperties();
			
				modelProps.direction.setX(-modelProps.direction.x);
				modelProps.direction.setY(-modelProps.direction.y);
			
				otherModelProps.direction.setX(-modelProps.direction.x);
				otherModelProps.direction.setY(-modelProps.direction.y);
			
				this.model.position.set(origPos.x, origPos.y, origPos.z);
			}
		}
	};
	
extend(Alien, CollidableModel);