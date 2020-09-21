'use strict';
var renderer, scene, viewPortScene, mainCamera, camera1, camera2, camera3, camera4, camera5, camera6, cameraAux, viewPortCamera, clock, stats;
var aspectRatio = window.innerWidth / window.innerHeight, viewSize = 115, viewPortSize = 12;

var hasWon = false;
var hasEnded = false;

function createCameras() {
	camera1 = new THREE.OrthographicCamera(-aspectRatio * viewSize, aspectRatio * viewSize, viewSize, -viewSize, 1, 10000);
	camera1.position.x = 0;
	camera1.position.y = 0;
	camera1.position.z = 1000;

    camera2 = new THREE.PerspectiveCamera(75, aspectRatio, 1, 10000);    
    camera2.position.x = 0;
    camera2.position.y = -125;
    camera2.position.z = 70; 
    camera2.rotateX(Math.PI / (8 / 2));
    
    camera3 = new THREE.PerspectiveCamera(75, aspectRatio, 1, 10000);
    camera3.position.x = 0;
    camera3.position.y = -30;
    camera3.position.z = 25;
    camera3.rotateX(Math.PI / 3);
	
	camera4 = new THREE.OrthographicCamera(-aspectRatio * viewSize, aspectRatio * viewSize, viewSize, -viewSize, 1, 100);
    camera4.position.x = 0;
    camera4.position.y = 0;
    camera4.position.z = -2000;

    camera5 = new THREE.OrthographicCamera(-aspectRatio * viewSize, aspectRatio * viewSize, viewSize, -viewSize, 1, 100);
    camera5.position.x = 0;
    camera5.position.y = 0;
    camera5.position.z = -4000;

    camera6 = new THREE.OrthographicCamera(-aspectRatio * viewSize, aspectRatio * viewSize, viewSize, -viewSize, 1, 100);
    camera6.position.x = 0;
    camera6.position.y = 0;
    camera6.position.z = -6000;
	
	viewPortCamera = new THREE.OrthographicCamera(-aspectRatio * viewPortSize, aspectRatio * viewPortSize, viewPortSize, -viewPortSize, 1, 100);
	viewPortCamera.position.copy(viewPort.cameraPosition);
	viewPort.camera = viewPortCamera;
	
	mainCamera = camera1;
}

function createScene() {
	scene = new Scene(SCENE_WIDTH, SCENE_HEIGHT, SCENE_WALL_DEPTH, SCENE_WALL_WIDTH);
}

function render() {
	renderer.clear();

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene.getModel(), mainCamera);
	
	renderer.setViewport(window.innerWidth * viewPort.left, window.innerHeight * viewPort.bottom, window.innerWidth * viewPort.width, window.innerHeight * viewPort.height);
	renderer.render(scene.getModel(), viewPort.camera);
}

function animate() {
	stats.begin();
	
	var delta = clock.getDelta();

	scene.update(delta);
	
	render();	
	
	stats.end();

	window.requestAnimationFrame(animate);
}

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	createCameras();
	clock = new THREE.Clock();
	createScene();

	stats = new Stats();
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", onKeyUp);
	window.addEventListener("resize", onResize);

	renderer.autoClear = false;
	render();
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	aspectRatio = window.innerWidth / window.innerHeight;
	
	if(mainCamera instanceof THREE.OrthographicCamera){
		if (aspectRatio >= 1) {
			mainCamera.left = -viewSize * aspectRatio;
			mainCamera.right = viewSize * aspectRatio;
			mainCamera.top = viewSize;
			mainCamera.bottom = -viewSize;   
		}
		else {
			mainCamera.left = -viewSize;
			mainCamera.right = viewSize;
			mainCamera.top = viewSize / aspectRatio;
			mainCamera.bottom = -viewSize / aspectRatio;   
		}
	}
	else {
		mainCamera.aspect = aspectRatio;
	}
	
	if (aspectRatio >= 1) {
		viewPort.camera.left = -aspectRatio * viewPortSize;
		viewPort.camera.right = aspectRatio * viewPortSize;
		viewPort.camera.top = viewPortSize;
		viewPort.camera.bottom = viewPortSize;
	}
	else {
		viewPort.camera.left = -viewPortSize;
		viewPort.camera.right = viewPortSize;
		viewPort.camera.top = viewPortSize / aspectRatio;
		viewPort.camera.bottom = -viewPortSize / aspectRatio;
	}

	//viewPortCamera.updateProjectionMatrix();
    mainCamera.updateProjectionMatrix();
}

function onKeyDown(e) {
	switch(e.keyCode) {
		case 65: //A
		case 97: //a
			scene.triggerWireframe();
			break;
		case 39: //->
			scene.getMainShip().setThrusting(1);
			break;
		case 37: //<-
			scene.getMainShip().setThrusting(-1);
			break;
		case 49: //1
			if(!scene.paused) {
				mainCamera = camera1;
				onResize();
			}
            break;
        case 50: //2
			if(!scene.paused) {
				mainCamera = camera2;
				onResize();
			}
            break;
        case 51: //3
			if(!scene.paused) { 
				mainCamera = camera3;
				onResize();
			}
            break;
		case 66: //B
        case 98: //b
			scene.getMainShip().setFiring(true);
			break;
		case 78: //N
		case 110: //n
			scene.triggerSun();
			break;
		case 67: //C
		case 99: //c
			scene.triggerStars();
			break;
		case 76:  //L
		case 108: //l
			scene.switchLightingModel();
			break;
		case 71: //G
		case 103: //g
			scene.switchShadingModel(true);
			break;
		case 68: //D
		case 100: //d
			scene.triggerDebug();
			break;
		case 72: //H 
		case 104: //h
			scene.triggerSpotLight();
			break;
		case 83: //S
		case 115: //s
			scene.triggerPause();
			
			if(scene.paused) {
				cameraAux = mainCamera;
				mainCamera = camera4;
			}
			else {
				mainCamera = cameraAux;
			}
			
			break;
		case 82: //R
		case 114: //r
			if(hasEnded) {
				mainCamera = camera1;
				hasEnded = false;
				
				sleep(500).then(() => { 
					scene.triggerPause(); 
					viewPortCamera.position.copy(viewPort.cameraPosition); 
				});
			}
			break;
	}
}

function onKeyUp(e) {
	switch(e.keyCode) {
		case 39: //->
		case 37: //<-
			scene.getMainShip().setThrusting(0);
			break;
		case 66: //B
        case 98: //b
			scene.getMainShip().setFiring(false);
			break;
	}
}

function restart() {
	hasEnded = true;
	createScene();
	scene.triggerPause();
	
	if(hasWon) {
		mainCamera = camera6;
	}
	else {
		mainCamera = camera5;
	}
	
	hasWon = false;
	viewPortCamera.position.set(-1000, -1000, -1000);
}





