'use strict';
function CollidableModel(boundingGeometry) {
	ModelContainer.apply(this, Array.from(arguments).splice(1));
	
	this.setProperty('boundingGeometry', computeModelBoundingGeometry(this.getModel(), boundingGeometry));
	
	//debug 
	if(this.boundingGeometry instanceof THREE.Sphere) {
		var visibleBoundSphere = new Sphere({
			x: 0, 
			y: 0, 
			z: 0, 
			radius: this.boundingGeometry.radius,
			widthSegments: 8,
			heightSegments: 8,
			color: 0x00ff00,
			wireframe: true,
			material: THREE.MeshBasicMaterial});
		this.setProperty('visibleBound', visibleBoundSphere);
	}
	else {
		this.setProperty('visibleBound', this.boundingGeometry);
	}
}

CollidableModel.prototype = {
	handleCollision:
		function(origPos, model) {
			//abstract function
		},
		
	hasCollision:
		function(origPos) {
			var models = scene.getModels();
			
			for(var i = 0; i < models.length; i++) {
				if(models[i] != this) {
					if(models[i].getBoundingGeometry() instanceof THREE.Box3) {
						if(this.getBoundingGeometry().intersectsBox(models[i].getBoundingGeometry())) {
							this.handleCollision.apply(this, [origPos, models[i]]);
						}
					}
					else {
						if(this.getBoundingGeometry().intersectsSphere(models[i].getBoundingGeometry())) {						
							this.handleCollision.apply(this, [origPos, models[i]]);
						}
					}
				}
			}
		},
	
	update:
		function(delta) {			
			ModelContainer.prototype.update.call(this, delta);
			
			var origPos = this.getModel().position;
			
			this.updateBoundingGeometry();
			this.hasCollision(origPos);
		},
		
	updateBoundingGeometry:
		function() {
			if(this.boundingGeometry instanceof THREE.BoundingBoxHelper) {
				this.boundingGeometry.update();
			}
			else {
				this.boundingGeometry.center = this.getModel().position;
			}
			
			//debug
			for(var i = 0; i < this.model.children.length; i++) {
				if(this.model.children[i] == this.visibleBound) {
					this.model.children[i].material.wireframe = true;
				}
			}
			
			//debug
			for(var i = 0; i < scene.model.children.length; i++) {
				if(this.visibleBound == scene.model.children[i]) {
					scene.model.children[i].material.wireframe = true;
				}
			}
		},
		
	getBoundingGeometry:
		function() {
			if(this.boundingGeometry instanceof THREE.BoundingBoxHelper) {
				return this.boundingGeometry.box;
			}
			else {
				return this.boundingGeometry;
			}
		}	
	};

extend(CollidableModel, ModelContainer);