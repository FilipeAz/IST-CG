'use strict';
function extend(subClass, baseClass) {
	var origProto = subClass.prototype;
	subClass.prototype = Object.create(baseClass.prototype);
	
	for(var key in origProto)  {
		subClass.prototype[key] = origProto[key];
	}

	Object.defineProperty(subClass.prototype, 'constructor', { 
		enumerable: false, 
		value: subClass 
	});
}

function getRandomColor() {
	return "#000000".replace(/0/g, function(){ return (~~(Math.random() * 16)).toString(16); });
}

function computeModelBoundingGeometry(model, type) {
	if(type == 'sphere') {
		var minX = 0;
		var minY = 0;
		var minZ = 0;
		var maxX = 0;
		var maxY = 0;
		var maxZ = 0;
		var maxRadius = 0;
		
		if(model instanceof THREE.Object3D) {
			model.traverse(
				function (mesh) {
					if (mesh instanceof THREE.Mesh) {
						mesh.geometry.computeBoundingBox();
						var box =  mesh.geometry.boundingBox;
						
						mesh.geometry.computeBoundingSphere();
						var sphere = mesh.geometry.boundingSphere;

						maxRadius = Math.max(maxRadius, sphere.radius);
						
						minX = Math.min (minX, box.min.x);
						minY = Math.min (minY, box.min.y);
						minZ = Math.min (minZ, box.min.z);
						maxX = Math.max (maxX, box.max.x);
						maxY = Math.max (maxY, box.max.y);
						maxZ = Math.max (maxZ, box.max.z);
					}
			});
		}

		maxRadius = Math.max((maxX - minX) / 2, (maxY - minY) / 2);
		
		return new THREE.Sphere(model.position, maxRadius);
	}
	else {
		var boundBoxHelper = new THREE.BoundingBoxHelper(model, 0x00ff00);
		boundBoxHelper.update();
		
		return boundBoxHelper;
	}
}

function getModelDimension(boundGeometry, dimension) {
	if(boundGeometry instanceof THREE.Box3) {
		var boxMin = boundGeometry.min;
		var boxMax = boundGeometry.max;
		
		return boxMax[dimension] - boxMin[dimension];
	}
	else {
		return (boundGeometry.radius) * 2;
	}
}

function getModelWidth(boundGeometry) {
	return getModelDimension(boundGeometry, 'x');
}

function getModelHeight(boundGeometry) {
	return getModelDimension(boundGeometry, 'y');
}

function getModelDepth(boundGeometry) {
	return getModelDimension(boundGeometry, 'z');
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
