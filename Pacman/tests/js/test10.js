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

    const TILE_WIDTH=24, TILE_HEIGHT=24;
    var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost


	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;

	this.draw = function(){
		// Pintar cuerpo de fantasma

		// Tu código aquí
		this.ctx.beginPath();
		this.ctx.moveTo(this.x-11,this.y+11);
		this.ctx.quadraticCurveTo(this.x,this.y-24,this.x+11,this.y+11);
		this.ctx.closePath();
		this.ctx.fillStyle = ghostcolor[this.id];
		this.ctx.fill(); 
		// Tu código aquí
		
		// Pintar ojos 
		this.ctx.beginPath();
		this.ctx.arc(this.x+2, this.y-3, 2, 0, 2*Math.PI,false);
		this.ctx.arc(this.x-2, this.y-3, 2, 0, 2*Math.PI,false);
		this.ctx.closePath();
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.fill(); 

		

	}; // draw

	    	this.move = function() {
	    		//Si está en punto crítico
			if(this.x%thisGame.TILE_WIDTH!=0  &&  this.x%(thisGame.TILE_WIDTH/2)==0  &&  this.y%thisGame.TILE_HEIGHT!=0  &&  this.y%(thisGame.TILE_HEIGHT/2)==0){
					var filaGhost = Math.trunc(((this.y)/24));
					var colGhost = Math.trunc(((this.x)/24));
			
			var posiblesMovimientos=[];


			//Si a la izquierda no hay pared
			if(!thisLevel.isWall(filaGhost, colGhost-1)){
			//Añadimos "izquierda" a posibles movimientos
			posiblesMovimientos.push("left");
			}

			//Si a la derecha no hay pared
			if(!thisLevel.isWall(filaGhost, colGhost+1)){
			//Añadimos "derecha" a posibles movimientos
			posiblesMovimientos.push("right");
			}

			//Si arriba no hay pared
			if(!thisLevel.isWall(filaGhost-1, colGhost)){
			//Añadimos "arriba" a posibles movimientos
			posiblesMovimientos.push("up");
			}

			//Si abajo no hay pared
			if(!thisLevel.isWall(filaGhost+1, colGhost)){
			//Añadimos "abajo" a posibles movimientos
			posiblesMovimientos.push("down");
			}


			//Si hay cruce o va a chocar
			if(posiblesMovimientos.length>=3  ||  this.velX<0 && thisLevel.isWall(filaGhost, colGhost-1)  ||  
				this.velX>0 && thisLevel.isWall(filaGhost, colGhost+1)  ||  
				this.velY<0 && thisLevel.isWall(filaGhost-1, colGhost)  ||  
				this.velY>0 && thisLevel.isWall(filaGhost+1, colGhost)  || 
				(this.velX==0 && this.velY==0)){

			var dirElegida=posiblesMovimientos[Math.round(Math.random()*(posiblesMovimientos.length-1))];
			//Actualizamos velX y velY según la dirección
				if(dirElegida=="left"){
					this.velX=-this.speed;
					this.velY=0;
				}
				else if(dirElegida=="right"){
					this.velX=this.speed;
					this.velY=0;
				}
				else if(dirElegida=="up"){
					this.velX=0;
					this.velY=-this.speed;
				}
				else{
					this.velX=0;
					this.velY=this.speed;
				}

				}

				}


			this.x=this.x+this.velX;
			this.y=this.y+this.velY;

			
		};

	};

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
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
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
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );



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

	// Tu código aquí
	    // Mover fantasmas
	    for(var i=0; i<numGhosts;i++){
	    	ghosts[i].move();
	    }

	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	// Tu código aquí
	    // Pintar fantasmas
	    for(var i=0; i<numGhosts;i++){
	    	ghosts[i].draw();
	    }

 
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
	// Tu código aquí (test10)
	// Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente
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
			 	if(b==10){
			 		
					ghosts[0].x=i*TILE_WIDTH+(TILE_WIDTH/2);
					ghosts[0].y=j*TILE_HEIGHT+(TILE_HEIGHT/2);
					ghosts[0].velX=ghosts[0].speed;
					ghosts[0].velY=0;
					
				}
				if(b==11){
			 		
					ghosts[1].x=i*TILE_WIDTH+(TILE_WIDTH/2);
					ghosts[1].y=j*TILE_HEIGHT+(TILE_HEIGHT/2);
					ghosts[1].velX=ghosts[1].speed;
					ghosts[1].velY=0;
					
				}
				if(b==12){
			 		
					ghosts[2].x=i*TILE_WIDTH+(TILE_WIDTH/2);
					ghosts[2].y=j*TILE_HEIGHT+(TILE_HEIGHT/2);
					ghosts[2].velX=ghosts[2].speed;
					ghosts[2].velY=0;
					
				}
				if(b==13){
			 		
					ghosts[3].x=i*TILE_WIDTH+(TILE_WIDTH/2);
					ghosts[3].y=j*TILE_HEIGHT+(TILE_HEIGHT/2);
					ghosts[3].velX=ghosts[3].speed;
					ghosts[3].velY=0;
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
        start: start,
	ghost: Ghost // exportando Ghost para poder probarla
    };
};



  var game = new GF();
  game.start();


test('Clase Ghost bien implementada', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		var ghost = new game.ghost(4, canvas.getContext("2d"));
		assert.ok( typeof(ghost)!= "undefined" , "El fantasma existe" );

		ghost.x = 250;
		ghost.y = 240;
		ghost.velX = 3;
		ghost.velY = 0;
		ghost.draw(); // no se va a ver, porque no está en el mainloop, pero queremos verificar que no da errores
		ghost.move();
		assert.ok( ghost.x > 250 , "El fantasma se mueve hacia la derecha cuando es posible" );

    		ghost.x = 240;
		ghost.y = 242;
		ghost.velX = 0;
		ghost.velY = 3;
		ghost.draw(); // no se va a ver, porque no está en el mainloop....
		ghost.move();
		assert.ok( ghost.y > 240 , "El fantasma se mueve hacia abajo cuando es posible" );
    	
		ghost.x = 240;
		ghost.y = 240;
		ghost.draw(); // no se va a ver, porque no está en el mainloop....
		ghost.move(); // lo movemos dos veces
		ghost.move();
		ghost.velX = 3;
		ghost.velY = 3;
		assert.ok( (ghost.x != 240 && ghost.y == 240) || (ghost.x == 240 && ghost.y != 240) , "El fantasma elige una direccio'n al azar cuando encuentra una bifurcacio'n " );
    	
		done();
  }, 1000);

});


