'use strict';
function Light(intensity) {
	this.setProperty('light', this.createLight.apply(this, arguments));
	this.setProperty('on', true);
	this.setProperty('intensity', intensity);
}

Light.prototype = {
	createLight:
		function() {
			//abstract function
		},
		
	getLight:
		function() {
			return this.getProperty('light');
		},
	
	getLightProperty: 
		function(propName) {
			return this.getLight()[propName]; 
		},
		
	setLightProperty: 
		function(propName, propValue) {
			this.getLight()[propName] = propValue;
		},
		
	getIntensity:
		function(){
			return this.getProperty('intensity');
		},

	trigger:
		function() {
			this.on = !this.on;
			
			if(this.on) {
				this.light.intensity = this.intensity;
			}
			else {
				this.light.intensity = 0;
			}
		}
	};
	
extend(Light, PropertyContainer);