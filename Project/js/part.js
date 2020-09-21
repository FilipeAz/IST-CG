'use strict';
var geometry, material, mesh;

extend(BoxShip, Part);
extend(Box, Part);
extend(Sphere, Part);
extend(Cone, Part);
extend(Circle, Part);
extend(Tetrahedron, Part);

function Part() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];

		var lx = params.x || 0;
		var ly = params.y || 0;
		var lz = params.z || 0;
		var lcolor = params.color || 0xffff00;
		var lxRot = params.xRot || 0;
		var lyRot = params.yRot || 0;
		var lzRot = params.zRot || 0;
		var lwireframe = params.wireframe || false;
		var lmaterial = params.material || THREE.MeshPhongMaterial;
		var lvisible = params.visible;
		
		if(lxRot) { geometry.rotateX(lxRot); }
		if(lyRot) { geometry.rotateY(lyRot); }
		if(lzRot) { geometry.rotateZ(lzRot); }
		
		material = new lmaterial({color: lcolor, wireframe: lwireframe});
		mesh = new THREE.Mesh(geometry, material);
		
		mesh.visible = lvisible;
		mesh.position.set(lx, ly, lz);
		
		return mesh;
	}
	else {
		return undefined;
	}
}

function BoxShip() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lwidth = params.width || 10; 
		var lheight = params.height || 10; 
		var ldepth = params.depth || 10; 
		var lwidthSegments = params.widthSegments || 1;
		var lheightSegments = params.heightSegments || 1;
		var ldepthSegments = params.depthSegments || 1;
		
		geometry = new THREE.Geometry();
		
		var v1 = new THREE.Vector3(0, 0, 0);
		var v2 = new THREE.Vector3(lwidth, 0, 0);
		var v3 = new THREE.Vector3(lwidth, lheight, 0);
		var v4 = new THREE.Vector3(0, lheight, 0);
		var v5 = new THREE.Vector3(0, 0, ldepth);
		var v6 = new THREE.Vector3(lwidth, 0, ldepth);
		var v7 = new THREE.Vector3(lwidth, lheight, ldepth);
		var v8 = new THREE.Vector3(0, lheight, ldepth);
		
		geometry.vertices.push(v1);
		geometry.vertices.push(v2);
		geometry.vertices.push(v3);
		geometry.vertices.push(v4);
		geometry.vertices.push(v5);
		geometry.vertices.push(v6);
		geometry.vertices.push(v7);
		geometry.vertices.push(v8);
		
		geometry.faces.push(new THREE.Face3( 2, 1, 0 ) );	//bottom face
		geometry.faces.push(new THREE.Face3( 0, 3, 2 ) );	//bottom face
		
		geometry.faces.push(new THREE.Face3( 0, 4, 7 ) );	//left face
		geometry.faces.push(new THREE.Face3( 7, 3, 0 ) );	//left face
		
		geometry.faces.push(new THREE.Face3( 4, 5, 6 ) );	//top face
		geometry.faces.push(new THREE.Face3( 6, 7, 4 ) );	//top face
		
		geometry.faces.push(new THREE.Face3( 5, 1, 2 ) );	//right face
		geometry.faces.push(new THREE.Face3( 2, 6, 5 ) );	//right face
		
		geometry.faces.push(new THREE.Face3( 2, 3, 7 ) );	//top base face
		geometry.faces.push(new THREE.Face3( 7, 6, 2 ) );	//top base face
		
		geometry.faces.push(new THREE.Face3( 0, 1, 5 ) );	//bottom base face
		geometry.faces.push(new THREE.Face3( 5, 4, 0 ) );	//bottom base face
		
		geometry.computeFaceNormals();
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}

function Box() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lwidth = params.width || 10; 
		var lheight = params.height || 10; 
		var ldepth = params.depth || 10; 
		var lwidthSegments = params.widthSegments || 8;
		var lheightSegments = params.heightSegments || 8;
		var ldepthSegments = params.depthSegments || 8;
		
		geometry = new THREE.BoxGeometry(lwidth, lheight, ldepth, lwidthSegments, lheightSegments, ldepthSegments);
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}

function Sphere() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lradius = params.radius || 50; 
		var lwidthSegments = params.widthSegments || 32; 
		var lheightSegments = params.heightSegments || 32; 
		var lphiStart = params.phiStart || 0;
		var lphiLength = params.phiLength || 2 * Math.PI;
		var lthetaStart = params.thetaStart || 0;
		var lthetaLength = params.thetaLength || Math.PI;
		
		geometry = new THREE.SphereGeometry(lradius, lwidthSegments, lheightSegments, lphiStart, lphiLength, lthetaStart, lthetaLength);
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}

function Cone() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lradius = params.radius || 5; 
		var lheight = params.height || 8; 
		var lradialSegments = params.radialSegments || 16; 
		var lheightSegments = params.heightSegments || 8;
		var lopenEnded = params.openEnded || false;
		var lthetaStart = params.thetaStart || 0;
		var lthetaLength = params.thetaLength || 2 * Math.PI;
		
		geometry = new THREE.ConeGeometry(lradius, lheight, lradialSegments, lheightSegments, lopenEnded, lthetaStart, lthetaLength);
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}

function Circle() {
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lradius = params.radius || 50; 
		var lsegments = params.segments || 16; 
		var lthetaStart = params.thetaStart || 0; 
		var lthetaLength = params.thetaLength || 2 * Math.PI;
		
		geometry = new THREE.CircleGeometry(lradius, lsegments, lthetaStart, lthetaLength);
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}

function Tetrahedron(){
	if(typeof arguments[0] == 'object') {
		var params = arguments[0];
		
		var lradius = params.radius || 1; 
		var ldetail = params.detail || 0; 
		
		geometry = new THREE.TetrahedronGeometry(lradius, ldetail);
		
		return Part.apply(this, arguments);
	}
	else {
		return undefined;
	}
}	