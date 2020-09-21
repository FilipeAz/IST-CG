'use strict';
function Wall(position, width, height, depth, type, color, visible) {
	CollidableModel.apply(this, ['box', position, width, height, depth, color, visible]);
	
	this.setProperty('type', type);
}

Wall.prototype = {
	createModel:
		function(model, position, width, height, depth, color, visible) {
			var model = new THREE.Object3D();
			
			model.userData = {
				speed: new THREE.Vector3(0, 0, 0),
				direction: (new THREE.Vector3(0, 0, 0)).normalize(),
				rotation: new THREE.Vector3(0, 0, 0)
			}
			
			model.add(new Box({color: color, width: width, height: height, depth: depth, widthSegments: 64, heightSegments: 64, visible: visible}));
			
			model.position.copy(position);

			return model;
		}
	}

extend(Wall, CollidableModel);