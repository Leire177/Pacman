// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


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
		for(var j=0; j<=thisGame.screenTileSize[0];j++){
		 for(var i=0; i<=thisGame.screenTileSize[1]-1;i++){
		 	
		 	var bald= this.getMapTile(j, i);
		 	var b=parseInt(bald);

		 	 if(b>=100 && b<=199){
		 		 ctx.fillStyle = "blue";
        		ctx.fillRect(i*TILE_WIDTH, j*TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
        		ctx.stroke();
		 	}
		 	else if(b==4){
		 		player.x=i*TILE_WIDTH;
		 		player.y=j*TILE_WIDTH;
		 	}
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
				ctx.beginPath();
				ctx.fillStyle = "red";
				ctx.arc(i*TILE_WIDTH+12, j*TILE_HEIGHT+12, 5, 0, 2 * Math.PI, true);
				ctx.fill();
				ctx.stroke();
				ctx.closePath();
		 	}
		 }
		}
	};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {

		// tu código aquí
		 player.draw(this.x,this.y);

     //Movimiento hoizontal
    if(player.x+player.velX>w-2*player.radius){
      inputStates.right=false;
      
    }
    else if(player.x+player.velX==0){
      inputStates.left=false;
      
    }
    else{
      player.x=player.x+player.velX;
    }



    //Movimiento verticaL
    if(player.y+player.velY>h-2*player.radius){
      inputStates.down=false;
      
    }
    else if(player.y+player.velY==0){
      inputStates.up=false;
      
    }
    else{
      player.y=player.y+player.velY;
    }
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
         // Pac Man
	    
	// tu código aquí
	  x=x+this.radius;
      y=y+this.radius; 
      ctx.beginPath();
      ctx.arc(x, y, player.radius, player.angle1*Math.PI, player.angle2*Math.PI,false);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fillStyle = '#FFFF00';
      ctx.fill();   	     
    };

	var player = new Pacman();

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
		if(inputStates.right){
      player.x=player.x+player.speed;
      player.velY=0;
    }
    if(inputStates.left){
      player.x=player.x-player.speed;
      player.velY=0;
    }
    if(inputStates.up){
      player.y=player.y-player.speed;
      player.velX=0;
    }
    if(inputStates.down){
      player.y=player.y+player.speed;
      player.velX=0;
    }
    if(inputStates.space){
      
    }
	
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	player.move();
 
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
       }else if(tecla==39){
          inputStates.right=true;
       }else if(tecla==38){
          inputStates.up=true;
       }else if(tecla==40){
          inputStates.down=true;
       }else if(tecla==8){
          inputStates.space=true;
       }

    }, false );
   };


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	addListeners();

	player.x = 0;
	player.y = 0; 
	player.velY = 0;
	player.velX = player.speed;
 
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

test('Mapa correctamente dibujado en pantalla', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {


	     	   assert.pixelEqual( canvas,  35,35, 0, 0, 255, 255,"esquina superior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 250,35, 0, 0, 0, 0,"puerta superior negra");
	     	   assert.pixelEqual( canvas, 465,35, 0, 0, 255, 255,"esquina superior derecha azul");
	     	   assert.pixelEqual( canvas, 58,58, 255, 255, 255,255,"primera pi'ldora esquina superior izquierda blanca");
	     	   assert.pixelEqual( canvas, 58,82, 255, 0,0,255,"pi'ldora de poder esquina superior izquierda roja");
	     	   assert.pixelEqual( canvas, 442,82, 255, 0,0,255,"pi'ldora de poder esquina superior derecha roja");

	     	   assert.pixelEqual( canvas, 35,300, 0, 0,0,0 ,"puerta lateral izquierda negra");
	     	   assert.pixelEqual( canvas, 252,300, 0, 0,0, 255,"centro de casa de los fantasmas negro");
	     	   assert.pixelEqual( canvas, 482, 300, 0, 0,0, 0,"puerta lateral derecha negra");
		
		   assert.pixelEqual( canvas, 12, 585, 0, 0,255,255,"esquina inferior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 60, 538, 0, 0,255,255,"cuadrado interior esquina inferior izquierda azul");
	     	   assert.pixelEqual( canvas, 250,538, 255, 255,255,255,"pi'ldora central lateral inferior blanca");
	     	   assert.pixelEqual( canvas, 442,538, 0, 0,255,255,"cuadrado interior esquina inferior derecha azul");
		   assert.pixelEqual( canvas, 488,582, 0, 0,255,255,"esquina inferior derecha azul"); 

    		   done();
  }, 1000);

});

