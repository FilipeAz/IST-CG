'use strict';
function StarLight(intensity, position, color, distance) {	
	Light.apply(this, arguments);
}

StarLight.prototype = {
	createLight:
		function(intensity, position, color, distance) {
			var star = new THREE.PointLight(color, intensity, distance);
	
			star.position.copy(position);
			
			return star;
		}
	};

extend(StarLight, Light);