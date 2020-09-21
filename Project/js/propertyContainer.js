'use strict';
function PropertyContainer() {
	//empty constructor
}

PropertyContainer.prototype = {
	getProperty:
		function(propName) {
			return this[propName];
		},
		
	setProperty:
		function(propName, propValue) {
			this[propName] = propValue;
		}
	};