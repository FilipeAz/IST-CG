'use strict';
function Scene(width, height, depth, wallWidth) {
	this.setProperty('models', []);
	this.setProperty('lights', []);
	this.setProperty('lighting', true);
	this.setProperty('shading', 1);
	this.setProperty('paused', false);
	
	this.setProperty('debug', false); //debug
	
	ModelContainer.apply(this);
	this.createModels.apply(this, [width, height, depth, wallWidth]);
}

Scene.prototype = {
	createModel:
		function() {
			var scene = new THREE.Scene();
			//scene.add(new THREE.AxisHelper(20));
			
			return scene;
		},
		
	createModels:
		function(width, height, depth, wallWidth) {
			var currModel = null;
			var star = null;
			
			var background = new Background(0, 100, -5, 'images/edesta.jpeg', 1150, 575);
			this.inject(background.getModel());

			var pauseBackground = new Background(0, 0, -2050, 'images/pause.jpeg', 100, 100);
			this.inject(pauseBackground.getModel()); 

			var endBackground = new Background(0, 0, -4050, 'images/gameover.jpeg', 100, 100);
			this.inject(endBackground.getModel()); 
            
            var winBackground = new Background(0, 0, -6050, 'images/youw.jpeg', 100, 100);
			this.inject(winBackground.getModel());
		   
            var sun = new SunLight(SUN_INT, SUN_POS, SUN_COLOR, SUN_TARGET);
			this.registerLight(sun);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(-75, 75, 40), STAR_COLOR, STAR_DIST); 
			this.registerLight(star);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(0, 25, 40), STAR_COLOR, STAR_DIST); 
			this.registerLight(star);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(75, 75, 40), STAR_COLOR, STAR_DIST);
			this.registerLight(star);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(-75, -75, 40), STAR_COLOR, STAR_DIST); 
			this.registerLight(star);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(0, -25, 40), STAR_COLOR, STAR_DIST); 
			this.registerLight(star);
			
			star = new StarLight(STAR_INT, new THREE.Vector3(75, -75, 40), STAR_COLOR, STAR_DIST); 
			this.registerLight(star);
			
			currModel = new Ship(SHIP_THRUST, SHIP_MAX_SPEED, new THREE.Vector3(0, -75, 0), SHIP_COLOR, 'playable', SHIP_LIVES);
			this.registerModel(currModel);
			
			var spotLight = new SpotLight(SPOT_INT, SPOT_POS, SPOT_COLOR, SPOT_DIST, SPOT_ANGLE, SPOT_PENUM, SPOT_DECAY, SPOT_TARGET);
			currModel.inject(spotLight.getLight());
			currModel.inject(camera3);
			
			var numLives = currModel.getLives();

			for(var i = 0; i < numLives; i++) {
				var currModel = new Ship(0, 0, new THREE.Vector3(viewPort.startX, -20000, 0), 0x00cc00, 'life', 0);
				viewPort.startX += viewPort.livesDist;

				currModel.getModel().scale.set(0.4, 0.6, 0.01);
				this.registerModel(currModel);
			}

			viewPort.startX -= numLives * viewPort.livesDist;

			for(var y = 70; y >= 30; y -= 40) {
				for(var x = -60; x <= 60; x += 40) {
					currModel = new Alien(new THREE.Vector3(x, y, 0), getRandomColor());
					this.registerModel(currModel);
				}
			}

			currModel = new Wall(new THREE.Vector3((-width / 2) - (wallWidth / 2), 0, 0), wallWidth, height, depth, 'vertical', SCENE_WALL_COLOR, SCENE_WALL_VISIBLE);
			this.registerModel(currModel);
			
			currModel = new Wall(new THREE.Vector3(0, (-height / 2) - (wallWidth / 2), 0), width + (2 * wallWidth), wallWidth, depth, 'horizontal', SCENE_WALL_COLOR, SCENE_WALL_VISIBLE);
			this.registerModel(currModel);
			
			currModel = new Wall(new THREE.Vector3(0, (height / 2) + (wallWidth / 2), 0), width + (2 * wallWidth), wallWidth, depth, 'horizontal', SCENE_WALL_COLOR, SCENE_WALL_VISIBLE);
			this.registerModel(currModel);
			
			currModel = new Wall(new THREE.Vector3((width / 2) + (wallWidth / 2), 0, 0), wallWidth, height, depth, 'vertical', SCENE_WALL_COLOR, SCENE_WALL_VISIBLE);
			this.registerModel(currModel);
			
			currModel = new Wall(new THREE.Vector3(0, 0, (-depth / 2) + (wallWidth / 2)), width, height, 1, 'floor', SCENE_FLOOR_COLOR, SCENE_FLOOR_VISIBLE);
			this.registerModel(currModel);
	},
	
	update:
		function(delta) {
			if(!this.getProperty('paused')) {
				for(var i = 0; i < this.models.length; i++) {
					this.models[i].update(delta);
				}
			}
		},
		
	getModels:
		function() {
			return this.models;
		},
	
	getLights:
		function() {
			return this.lights;
		},
		
	getMainShip:
		function() {
			for(var i = 0; i < this.models.length; i++) {
				if(this.models[i] instanceof Ship) {
					return this.models[i];
				}
			}
		},
		
	getSunLight:
		function() {
			for(var i = 0; i < this.lights.length; i++) {
				if(this.lights[i] instanceof SunLight) {
					return this.lights[i];
				}
			}
		},
		
	getSpotLight:
		function() {
			var spotLight = this.getMainShip().getSpotLight();
			
			var light = new Light(SPOT_INT);
			light.setProperty('on', (spotLight.intensity == 0) ? false : true);
			light.setProperty('light', spotLight);

			return light;
		},
		
	triggerSun:
		function() {
			if(!this.lighting) { return; }
			
			this.getSunLight().trigger();
		},
		
	triggerStars:
		function() {
			if(!this.lighting) { return; }
			
			for(var i = 0; i < this.lights.length; i++) {
				if(this.lights[i] instanceof StarLight) {
					this.lights[i].trigger();
				}
			}
		},
		
	triggerSpotLight:
		function() {
			if(!this.lighting) { return; }
			
			this.getSpotLight().trigger();	
		},
		
	triggerWireframe:
		function() {
			for(var i = 0; i < this.models.length; i++) {
				this.models[i].triggerWireframe();
			}
		},
		
	triggerPause:
		function() {
			this.paused = !this.paused;
		},
		
	registerModel:
		function(model) {
			if(model instanceof ModelContainer) {
				this.models = this.models.concat([model]);
				this.inject(model.getModel());
			}
		},
		
	unregisterModel:
		function(model) {
			for(var i = 0; i < this.models.length; i++) {
				if(this.models[i] == model) {
					scene.getModel().remove(this.models[i].getModel());
					this.models.splice(i, 1);
				}
			}
		},
		
	registerLight:
		function(light) {
			if(light instanceof Light) {
				this.lights = this.lights.concat([light]);
				this.inject(light.getLight());
			}
		},
		
	unregisterLight:
		function(light) {
			for(var i = 0; i < this.lights.length; i++) {
				if(this.lights[i] == light) {
					scene.getModel().remove(this.lights[i].getLight());
					this.lights.splice(i, 1);
				}
			}
		},
		
	getModelCount:
		function(model, type) {
			var count = 0;
			
			for(var i = 0; i < this.models.length; i++) {
				if(this.models[i] instanceof model && this.models[i].type == type) {
					count++;
				}
			}
			
			return count;
		},
	
	switchShadingModel:
		function(switchShading) {
			if(this.lighting) {
				if(switchShading) { this.shading = !this.shading; }
				
				for(var i = 0; i < this.models.length; i++) {
					if(this.models[i].type == 'life') { continue; } //temp prevent life ship material change
					
					if(this.shading) {
						this.models[i].setMaterial(THREE.MeshPhongMaterial); //Phong
					}
					else {
						this.models[i].setMaterial(THREE.MeshLambertMaterial); //Gouraud
					}
				}
			}
		},

	switchLightingModel:
		function() {
			this.lighting = !this.lighting;

			if(!this.lighting) {
				for(var i = 0; i < this.models.length; i++) {
					this.models[i].setMaterial(THREE.MeshBasicMaterial);
				}
			}
			else {
				this.switchShadingModel(false);
			}	
		},
	
	//debug
	triggerDebug:
		function() {
			this.debug = !this.debug;
			
			if(this.debug) {
				for(var i = 0; i < this.models.length; i++) {
					if(this.models[i].visibleBound instanceof THREE.BoundingBoxHelper) {
						this.model.add(this.models[i].visibleBound);
					}
					else {
						this.models[i].model.add(this.models[i].visibleBound);
					}
				}
			}
			else {
				for(var i = 0; i < this.models.length; i++) {
					this.models[i].model.remove(this.models[i].visibleBound);
					this.model.remove(this.models[i].visibleBound);
				}
			}
		},
	};	

extend(Scene, ModelContainer);
