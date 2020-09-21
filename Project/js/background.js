'use strict'
function Background(startX, startY, startZ, texture, width, height){
	ModelContainer.apply(this, arguments);
}

Background.prototype = {
	createModel:
		function(model, startX, startY, startZ, name, width, height) {
			var group = new THREE.Group();
			var loader = new THREE.TextureLoader();
			
			loader.load(name, function(texture) {
					var geometry = new THREE.PlaneGeometry(width, height);
					var material = new THREE.MeshBasicMaterial({ map: texture });
					var mesh = new THREE.Mesh(geometry, material);
					
					mesh.position.set(startX, startY, startZ);
					mesh.rotateX(Math.PI / 8);
					group.add(mesh);
				});
			
			return group;
		}
	}

extend(Background, ModelContainer);
