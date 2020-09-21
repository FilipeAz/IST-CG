'use strict';
function SpotLight(intensity, position, color, distance, angle, penumbra, decay, target){
	Light.apply(this, arguments);
}

SpotLight.prototype = {
	createLight:
		function(intensity, position, color, distance, angle, penumbra, decay, target){
			var spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay); 
			spotLight.position.copy(position);
			
			spotLight.target.position.copy(target);
			spotLight.target.updateMatrixWorld();
		
			return spotLight;
		}
};

extend(SpotLight, Light); 
