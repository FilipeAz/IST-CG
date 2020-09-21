'use strict';
function ModelContainer() {
	var model = new THREE.Object3D();
	model.userData.speed = new THREE.Vector3(0, 0, 0);
	model.userData.direction = (new THREE.Vector3(0, 0, 0)).normalize();
	model.userData.rotation = new THREE.Vector3(0, 0, 0);

	this.setProperty('model', this.createModel.apply(this, [model].concat(Array.from(arguments))));
}

ModelContainer.prototype = {
	getModel:
		function() {
			return this.getProperty('model');
		},
		
	getModelProperties: 
		function() {
			return this.getModel().userData;
		},
	
	getModelProperty: 
		function(propName) {
			return this.getModelProperties()[propName]; 
		},
		
	setModelProperty: 
		function(propName, propValue) {
			this.getModelProperties()[propName] = propValue;
		},

	createModel: 
		function() {
			//abstract function
		},

	update:
		function(delta) {
			var modelProps = this.getModelProperties();
			var model = this.getModel();

			model.position.setX(model.position.x + (modelProps.direction.x * (modelProps.speed.x * delta)));
			model.position.setY(model.position.y + (modelProps.direction.y * (modelProps.speed.y * delta)));
			model.position.setZ(model.position.z + (modelProps.direction.z * (modelProps.speed.z * delta)));
			
			model.rotateX(modelProps.rotation.x);
			model.rotateY(modelProps.rotation.y);
			model.rotateZ(modelProps.rotation.z);
		},

		
	setMaterial:
		function(material, model) {
			var actualModel = model || this.getModel();
			
			for(var i = 0; i < actualModel.children.length; i++) {
				if(actualModel.children[i] instanceof THREE.Mesh) {
					var curMaterial = actualModel.children[i].material;
				
					actualModel.children[i].material = new material({color: curMaterial.color, wireframe: curMaterial.wireframe});
				}
			}
		},
	
	//Multiple materials ? -> Consider returning array or resolve array before returning or error
	getMaterial:
		function() {
			var material = null;
			
			this.getModel().traverse(
				function(part) {
					if(part instanceof THREE.Mesh && part.material instanceof THREE.Material) {
						material = part.material;
						return;
					}
				}
			);
			
			return material;
		},
	
	
	triggerWireframe:
		function() {
			this.getModel().traverse(
				function(part) {
					if(part instanceof THREE.Mesh){
						part.material.wireframe = !part.material.wireframe;
					}
				}
			);
		},
	
	//Different states of wireframe ? -> Consider returning array or resolve array before returning or error
	getWireframe:
		function() {
			var wireframe;
			
			this.getModel().traverse(
				function(part) {
					if(part instanceof THREE.Mesh && part.material instanceof THREE.Material){
						wireframe = part.material.wireframe;
						return;
					}
				}
			);
			
			return wireframe;
		},
		
	inject:
		function(part) {
			this.getModel().add(part);
		}
	};

extend(ModelContainer, PropertyContainer);