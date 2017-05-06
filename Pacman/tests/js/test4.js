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
    var pDer =true;
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {left:false, right:false, space:false,up:false, down:false};

	var Pacman = function() {
		this.radius = 15;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {

		// Tu código aqui

      player.draw(this.x,this.y);

     //Movimiento hoizontal
    if(player.x+player.velX>w-2*player.radius){
      inputStates.right=false;
      console.log("Choca a la derecha");
    }
    else if(player.x+player.velX==0){
      inputStates.left=false;
      console.log("Choca a la izquierda");
    }
    else{
      player.x=player.x+player.velX;
    }



    //Movimiento verticaL
    if(player.y+player.velY>h-2*player.radius){
      inputStates.down=false;
      console.log("Choca abajo");
    }
    else if(player.y+player.velY==0){
      inputStates.up=false;
      console.log("Choca arriba");
    }
    else{
      player.y=player.y+player.velY;
    }
    
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
       x=x+this.radius;
       y=y+this.radius;
         // Pac Man
      // Tu código aquí  
      ctx.beginPath();
      ctx.arc(x, y, 15, player.angle1*Math.PI, player.angle2*Math.PI,false);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fillStyle = '#FFFF00';
      ctx.fill();	         
    }
  
	// OJO, esto hace a pacman una variable global	
	player = new Pacman();



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
		// Tu código aquí
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

 test('Testeando pos. inicial', function(assert) {  

	     	assert.pixelEqual( canvas, player.x+10, player.y+10, 255, 255,0,255,"Passed!"); 
});

	
test('Movimiento hacia derecha OK', function(assert) {

  	var done = assert.async();
	inputStates.right = true;
  	setTimeout(function() {
			// console.log(player.x);
 		   assert.ok(player.x > 110 && player.x < w, "Passed!");

			inputStates.right = false;
			inputStates.down = true;
    		   done();
			test2();
  }, 1000);

});


var test2 = function(){
test('Movimiento hacia abajo OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y > 110 && player.y < h, "Passed!");
			inputStates.down = false;
			inputStates.left = true;
    		   done();
			test3();
  }, 1000);

});
};

var test3 = function(){
test('Movimiento hacia izquierda OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.x);
   		        assert.ok(player.x == 0 , "Passed!");
			inputStates.left = false;
			inputStates.up = true;
    		   done();
		test4();
  }, 1000);

}); };



var test4 = function(){
test('Movimiento hacia arriba OK', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.y);
   		        assert.ok(player.y < 10 , "Passed!");
			inputStates.up = false;
    		   done();
  }, 1000);

}); };


