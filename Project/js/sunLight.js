'use strict';
function SunLight(intensity, position, color, target) {	
	Light.apply(this, arguments);
}

SunLight.prototype = {
	createLight:
		function(intensity, position, color, target) {
			var sun = new THREE.DirectionalLight(color, intensity);
			sun.position.copy(position);
			
			sun.target.position.copy(target);
			sun.target.updateMatrixWorld();
	
			return sun;
		}
	};

extend(SunLight, Light);