//Constants Declarations
	var SCENE_WIDTH = 200;						//scene width
	var SCENE_HEIGHT = 200; 					//scene height
	var SCENE_WALL_WIDTH = 0.01; 				//scene wall width
	var SCENE_WALL_DEPTH = 22; 					//scene wall depth
	var SCENE_WALL_COLOR = 0xE9E5DC; 			//scene walls color	
	var SCENE_WALL_VISIBLE = false; 			//scene set visible walls
	var SCENE_FLOOR_COLOR = getRandomColor(); 	//scene floor color
	var SCENE_FLOOR_VISIBLE = false; 			//scene set visible floor
	
	var SHIP_THRUST = 130; 		//ship thrust
	var SHIP_MAX_SPEED = 150; 	//ship max speed
	var SHIP_RELOAD = 0.3; 		//ship reload time
	var SHIP_COLOR = 0x1a1a1a;	//ship color
	var SHIP_LIVES = 3; 		//ship lives
	
	var SUN_INT = 1; 								//sun intensity
	var SUN_TARGET = new THREE.Vector3(0, 0, 0); 	//sun target
	var SUN_POS = new THREE.Vector3(0, 0, 50); 		//sun position
	var SUN_COLOR = 0xffffff; 						//sun color
	
	var SPOT_INT = 1.5; 								//spot light intensity
	var SPOT_TARGET = new THREE.Vector3(0, 10000, 0); 	//spotlight target
	var SPOT_COLOR = 0xffffff; 							//spotlight color
	var SPOT_POS = new THREE.Vector3(0, -2.5, 0); 		//spotlight position
	var SPOT_DIST = 200; 								//spotlight max ilumination distance
	var SPOT_ANGLE = Math.PI / 3; 						//spotlight angle
	var SPOT_DECAY = 0.3; 								//spotlight ilumination decay
	var SPOT_PENUM = 0.6; 								//spotlight ilumination penumbra 
	
	var STAR_INT = 0.4; 		//star instensity
	var STAR_DIST = 250; 		//star max ilumination distance
	var STAR_COLOR = 0xffffff; 	//star color
	
	//lives viewport
	var viewPort = {
		startX: -20005,
		livesDist: 8,
		left: 0.82,
		bottom: 0.90,
		width: 0.15,
		height: 0.07,
		cameraPosition: new THREE.Vector3(-20000, -20000, 5) 
	};
	