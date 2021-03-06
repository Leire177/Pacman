// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

Math.trunc = Math.trunc || function(x) {
  return x - x % 1;
}
// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {left:false, right:false, space:false,up:false, down:false};


	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		// tu código aquí
		if(newValue == 2 || newValue == 3){
				this.pellets++;
			}
			this.map[(row*this.lvlWidth)+col] = newValue;
	};

	this.getMapTile = function(row, col){
		// tu código aquí	
		return this.map[(row*this.lvlWidth)+col];
	};

	this.printMap = function(){
		// tu código aquí
		console.log(this.map);
	};

	this.loadLevel = function(){
		// leer res/levels/1.txt y guardarlo en el atributo map	
		// haciendo uso de setMapTile
		$.ajaxSetup({async:false});

			$.get("../res/levels/1.txt", (data) => {    
				var trozos = data.split("#");

				//cojo el ancho
				var valores = trozos[1].split(" ");
				this.lvlWidth = valores[2];

				//cojo la altura
				valores = trozos[2].split(" ");
				this.lvlHeight = valores[2];

				//cojo los valores
				valores = trozos[3].split("\n");
				//console.log(valores);
				var filas = valores.slice(1,valores.length-1);
				//console.log(filas);

				$.each(filas, (n, elem1) => {
					var nums = elem1.split(" ");
					$.each(nums, (m, elem2) => {
						this.setMapTile(n,m,elem2);
					});

				});
			});
			this.printMap();
	};

         this.drawMap = function(){

	    	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

    		var tileID = {
	    		'door-h' : 20,
			'door-v' : 21,
			'pellet-power' : 3
		};

		 // Tu código aquí
		 thisLevel.powerPelletBlinkTimer += 1;
				if (thisLevel.powerPelletBlinkTimer == 60){
					thisLevel.powerPelletBlinkTimer = 0;
				}
		 // Tu código aquí
		 for(var j=0; j<=thisGame.screenTileSize[0];j++){
		 	for(var i=0; i<=thisGame.screenTileSize[1]-1;i++){
		 	
			 	var bald= this.getMapTile(j, i);
			 	var b=parseInt(bald);

			 	 if(b>=100 && b<=199){
			 		 ctx.fillStyle = "blue";
	        		ctx.fillRect(i*TILE_WIDTH, j*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
	        		ctx.stroke();
			 	 }
		 	/*else if(b==4){
		 		player.x=i*TILE_WIDTH+12;
		 		player.y=j*TILE_WIDTH+12;
		 	}*/
			 	else if(b>=10 && b<=13){
			 		ctx.fillStyle = "black";
	        		ctx.fillRect(i*TILE_WIDTH, j*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
	        		ctx.stroke();
			 	}
			 	else if(b==2){
			 		  ctx.beginPath();
						ctx.fillStyle = "white";
						ctx.arc(i*TILE_WIDTH+12, j*TILE_HEIGHT+12, 5, 0, 2 * Math.PI, true);
						ctx.fill();
						ctx.stroke();
						ctx.closePath();

			 	}
			 	else if(b==3){
			 		if(this.powerPelletBlinkTimer <30){
					ctx.beginPath();
					ctx.fillStyle = "red";
					ctx.arc(i*TILE_WIDTH+12, j*TILE_HEIGHT+12, 5, 0, 2 * Math.PI, true);
					ctx.fill();
					ctx.stroke();
					ctx.closePath();
			 	}
			 }
		 	}
		}

	};


		this.isWall = function(row, col) {
			// Tu código aquí
			var bald=this.getMapTile(row,col);
			var b=parseInt(bald);
			//console.log("Fila "+ row + " , columna " + col);
			//console.log(bald);
			if(b>=100 && b<=199){
				return true;
			}
			else{
				return false;
			}
		};


		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
				// Tu código aquí
				// Determinar si el jugador va a moverse a una fila,columna que tiene pared 
				// Hacer uso de isWall
				if((possiblePlayerX%12==0) || (possiblePlayerY%12==0)){
				var r = Math.trunc(((possiblePlayerY)/24));
				var c = Math.trunc(((possiblePlayerX)/24));
	
						return this.isWall(r,c);
				
			
			}else{
				return true;
			}
		};

		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};

			// Tu código aquí
			//  Gestiona la recogida de píldoras
			var r = Math.trunc(((playerY)/24));
			var c = Math.trunc(((playerX)/24));
			var bald = this.getMapTile(r, c)
		
					if(bald == tileID[ 'pellet' ]){
	
						this.setMapTile(r, c, 0);
						//player.pelletSndNum = 1 - player.pelletSndNum
						
						thisLevel.pellets -= 1;
						
						
						}
					if(bald==tileID[ 'door-v' ]){
						for(var i=0; i<thisLevel.lvlHeight;i++){
							if(i!=r && this.getMapTile(i, c)==tileID['door-v']){
								player.y=i*thisGame.TILE_WIDTH;
								if(player.velY>0){
									player.y=player.y+thisGame.TILE_WIDTH;
								}else{
									player.y=player.y-thisGame.TILE_WIDTH;
								}
							}
						}
					}
					if(bald==tileID[ 'door-h' ]){
						for(var j=0; j<thisLevel.lvlWidth;j++){
							if(j!=c && this.getMapTile(r, j)==tileID['door-h']){
								player.x=j*thisGame.TILE_WIDTH;
								if(player.velX>0){
									player.x=player.x+thisGame.TILE_WIDTH;
								}else{
									player.x=player.x-thisGame.TILE_WIDTH;
								}
							}
						}
					}


						if (thisLevel.pellets == 0){
							console.log("NEXT LEVEL!");
						}

			// Tu código aquí (test9)
			//  Gestiona las puertas teletransportadoras
		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
		this.velY = 0;
		this.velX = this.speed;
	};
	Pacman.prototype.move = function() {

		// Tu código aquí
		//
		 if(player.x+player.velX>w-
		 	player.radius){
	      inputStates.right=false;
	      
	    }
	    else if(player.x==0){
	      inputStates.left=false;
	      
	    }
	    else if(player.y+player.velY>h-player.radius){
	      inputStates.down=false;
	      
	    }
	    else if(player.y==0){
	      inputStates.up=false;
	      
	    }
	    else{
	    	//if(!thisLevel.checkIfHitWall(player.x+player.velX, player.y+player.velY, 0,0)){
	    	 player.y=player.y+player.velY;
	     	player.x=player.x+player.velX;

	    // }
		}	
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		   thisLevel.checkIfHitSomething(player.x, player.y, 0, 0);
		// ....

	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
         // Pac Man
	    
	// tu código aquí
	 ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, player.angle1*Math.PI, player.angle2*Math.PI,false);
      ctx.lineTo(player.x, player.y);
      ctx.closePath();
      ctx.fillStyle = '#FFFF00';
      ctx.fill();  	     
    };

	 player = new Pacman();

	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		// tu código aquí
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
		var TILE_WIDTH = thisGame.TILE_WIDTH;
		var TILE_HEIGHT = thisGame.TILE_HEIGHT;
	if((player.x%(TILE_WIDTH/2))==0 && !((player.x%TILE_WIDTH)==0) && (player.y%(TILE_HEIGHT/2))==0 && !((player.y%TILE_WIDTH)==0) ){
		if(inputStates.right && !thisLevel.checkIfHitWall(player.x+4*player.speed, player.y,0,0)){
		
	      player.velX=player.speed;
	      player.velY=0;

	    }
	    else if(inputStates.left && !thisLevel.checkIfHitWall(player.x-5*player.speed, player.y,0,0)){
	      player.velX=-player.speed;
	      player.velY=0;
	   
	    }
	    else if(inputStates.up && !thisLevel.checkIfHitWall(player.x, player.y-5*player.speed,0,0)){
	      player.velY=-player.speed;
	      player.velX=0;
	      
	    }
	   else if(inputStates.down && !thisLevel.checkIfHitWall(player.x, player.y+4*player.speed,0,0)){
	      player.velY=player.speed;
	      player.velX=0;
	      
	    }
	    else if(inputStates.space){
	      
	    }
	    else{
	    	player.velX=0;
	    	player.velY=0;

	    }
	}
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

 
	player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    var addListeners = function(){
	    //add the listener to the main, window object, and update the states
	    // Tu código aquí
	     window.addEventListener( "keydown", function(evento){
      	tecla = evento.keyCode; 
      	if(tecla==37){
          inputStates.left=true;
          inputStates.right=false;
          inputStates.up=false;
          inputStates.space=false;
          inputStates.down=false;
       }else if(tecla==39){
          inputStates.right=true;
          inputStates.left=false;
          inputStates.down=false;
          inputStates.up=false;
          inputStates.space=false;
       }else if(tecla==38){
          inputStates.up=true;
          inputStates.right=false;
          inputStates.left=false;
          inputStates.down=false;
          inputStates.space=false;
       }else if(tecla==40){
          inputStates.down=true;
          inputStates.up=false;
          inputStates.right=false;
          inputStates.left=false;
          inputStates.space=false;
       }else if(tecla==8){
          inputStates.space=true;
          inputStates.right=false;
          inputStates.left=false;
          inputStates.down=false;
          inputStates.up=false;
       }

    }, false );
    };

    var reset = function(){
	// Tu código aquí
	// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
	// inicializa la posición inicial de Pacman tal y como indica el enunciado
	var TILE_WIDTH = thisGame.TILE_WIDTH;
	    var TILE_HEIGHT = thisGame.TILE_HEIGHT;

	// Tu código aquí
	// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
	// inicializa la posición inicial de Pacman tal y como indica el enunciado
	    for(var j=0; j<=thisGame.screenTileSize[0];j++){
			 for(var i=0; i<=thisGame.screenTileSize[1]-1;i++){
			 	
			 	var bald= thisLevel.getMapTile(j, i);
			 	var b=parseInt(bald);
			 	if(b==4){
			 		player.x=i*TILE_WIDTH+(TILE_WIDTH/2);
					player.y=j*TILE_HEIGHT+(TILE_HEIGHT/2);
			 	}
			 }
		}
	//	inputStates.right=true;
    };

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	addListeners();

	reset();

        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};



  var game = new GF();
  game.start();


test('Puertas teletransportadoras (i)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 480;
		player.y = 288;
		var row = 12;
		var col = 19;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta lateral derecha
		assert.ok(  player.x < 100 && player.y == 288 , "Pacman debe aparecer en la misma fila, pero en la puerta lateral izquierda" );

    		   done();
  }, 1000);

});

test('Puertas teletransportadoras (ii)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 21;
		player.y = 288;
		var row = 12;
		var col = 1;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta lateral izquierda 
		assert.ok(  player.x > 400 && player.y == 288 , "Pacman debe aparecer en la misma fila, pero en la puerta lateral derecha" );

    		   done();
  }, 2000);

});



test('Puertas teletransportadoras (iii)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 240;
		player.y = 21;
		var row = 1;
		var col = 10;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta superior  
		assert.ok(  player.x == 240 && player.y > 400 , "Pacman debe aparecer en la misma columna, pero en la puerta inferior" );

    		   done();
  }, 3000);

});

test('Puertas teletransportadoras (iv)', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		player.x = 240;
		player.y = 576;
		var row = 23;
		var col = 10;
		thisLevel.checkIfHitSomething(player.x, player.y, row, col); // Pacman entra por la puerta inferior
		assert.ok(  player.x == 240 && player.y < 30 , "Pacman debe aparecer en la misma columna, pero en la puerta superior" );

    		   done();
  }, 4000);

});
