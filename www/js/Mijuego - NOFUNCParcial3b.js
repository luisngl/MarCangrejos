var app={
  inicio: function(){
    pixelsIconos = 64;
    dificultad = 1;
    velocidadX = 0;
    velocidadY = 0;
    velocidadPulpoY = 0.5;
    velocidadPulpoX = 0.5;

    puntuacion = 0;
    puntuacionText= null;

    pulpo2Existe=false;
    
    capturaCangrejo= false;
    fondoInicial= '#00ffff';
    
    dificultadText= null;

    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor= fondoInicial;
      
      game.load.image('rocas', 'assets/rocas.png');
      
      //iconos--> http://icon-icons.com
      game.load.image('cangrejo', 'assets/cangrejo.png');
      game.load.image('pulpo', 'assets/pulpo.png');
      game.load.image('pulpo2', 'assets/pulpo2.png');
//      game.load.image('pulpocangrejo', 'assets/pulpocangrejo.png');
    }

    function create() {
      puntuacionText = game.add.text(10, 10, puntuacion, { fontSize: '20px', fill: '#757676' });
      dificultadText= game.add.text (10, alto - 40, dificultad, {fontSize: '20px', fill: '#757676'});
//      velocidadPulpoXText = game.add.text(10, 40, velocidadPulpoX, { fontSize: '20px', fill: '#757676' });
//      velocidadPulpoYText = game.add.text(10, 70, velocidadPulpoY, { fontSize: '20px', fill: '#757676' });

      puntuacionText.text= 'Score: ' + puntuacion; 
      dificultadText.text= 'Level: ' + dificultad; 
//      velocidadPulpoXText.text= 'Vel Pulpo X: ' + velocidadPulpoX;
//      velocidadPulpoYText.text= 'Vel Pulpo Y: ' + velocidadPulpoY;

      rocas = game.add.sprite(0, alto-45, 'rocas');
      cangrejo = game.add.sprite(app.inicioX(), 0, 'cangrejo');     //el cangrejo empieza desde la derecha
      pulpo = game.add.sprite(0, app.inicioY(), 'pulpo');           //el pulpo empieza desde arriba

      game.physics.arcade.enable(rocas);
      game.physics.arcade.enable(cangrejo);
      game.physics.arcade.enable(pulpo);

      cangrejo.body.collideWorldBounds = true;
      cangrejo.body.onWorldBounds = new Phaser.Signal();
      cangrejo.body.onWorldBounds.add(app.alertaBorde, this);

      pulpo.body.collideWorldBounds = true;
      pulpo.body.onWorldBounds = new Phaser.Signal();
      pulpo.body.onWorldBounds.add(app.alertaBordePulpo, this);

    }

    function update(){
      var factorDificultad = (200 + (dificultad * 25));
      cangrejo.body.velocity.y = (velocidadY * factorDificultad);
      cangrejo.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      pulpo.body.velocity.y = (velocidadPulpoY * factorDificultad);
      pulpo.body.velocity.x = (velocidadPulpoX * (-1 * factorDificultad));

      if (dificultad > 2){
        if (pulpo2Existe = false){
          pulpo2Existe = true;

          pulpo2 = game.add.sprite(0, app.inicioY(), 'pulpo2');           //el pulpo empieza desde arriba
          game.physics.arcade.enable(pulpo2);
          pulpo2.body.collideWorldBounds = true;
          pulpo2.body.onWorldBounds = new Phaser.Signal();
          pulpo2.body.onWorldBounds.add(app.alertaBordePulpo, this);          
        }
      }

      if (pulpo2Existe=true){
        pulpo2.body.velocity.y = (velocidadPulpoY * factorDificultad);
        pulpo2.body.velocity.x = (velocidadPulpoX * (-1 * factorDificultad));
        game.physics.arcade.overlap(cangrejo, pulpo2, app.capturaCangrejo, null, this);          
      }

      game.physics.arcade.overlap(cangrejo, pulpo, app.capturaCangrejo, null, this);
      game.physics.arcade.overlap(cangrejo, rocas, app.incrementaPuntuacion, null, this);
      
      if (capturaCangrejo==true){
        capturaCangrejo=false;
        pulpo.scale.setTo(1.5, 1.5);
//        pulpocangrejo = game.add.sprite(pulpo.body.x, pulpo.body.y, 'pulpocangrejo');
        app.espera(0.2);
      }
      else{
        pulpo.scale.setTo(1, 1);
      }

      puntuacionText.text = 'Score: ' + puntuacion;
      dificultadText.text= 'Level: ' + dificultad;

//      velocidadPulpoXText.text= 'Vel Pulpo X: ' + velocidadPulpoX;
//      velocidadPulpoYText.text= 'Vel Pulpo Y: ' + velocidadPulpoY;

    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },


  alertaBorde: function(){
  },

  alertaBordePulpo: function(){
    if (Math.random()<0.5){
      velocidadPulpoY = -1 * velocidadPulpoY;
    }
    if (Math.random()<0.5){
      velocidadPulpoX = -1 * velocidadPulpoX;
    }
  },

  capturaCangrejo: function(){
    capturaCangrejo = true;
    puntuacion = puntuacion-1;

    cangrejo.body.x = app.inicioX();
    cangrejo.body.y = 0;   //el cangrejo empieza en el lateral derecho
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+3;

    if (puntuacion <= 0){
      dificultad= 0;
    }
    else{
      //Aumentar nivel dificultad cada 10 puntos
      dificultad= Math.floor(puntuacion/10);
    }

    cangrejo.body.x = app.inicioX();
    cangrejo.body.y = 0;   //el cangrejo empieza en el lateral derecho

  },

  espera: function(nsegundos){
    objetivo = (new Date()).getTime() + 1000 * Math.abs(nsegundos);
    while ( (new Date()).getTime() < objetivo );
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - pixelsIconos );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - pixelsIconos );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}