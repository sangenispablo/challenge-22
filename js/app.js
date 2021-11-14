// Boton de inicio
const startButton = document.querySelector("#startButton");
// Botones del juego esta numerados asi:
// arribaIzq (topLeft)     = 0
// arribaDer (topright)    = 1
// abajoIzq  (bottomleft)  = 2
// abajoDer  (bottomright) = 3
const simonButtons = document.querySelectorAll(".square");
// Donde voy poniendo las rondas
const round = document.querySelector("#round");

// Creo una clase y ahi guardo todo
// Explicación de la clase
// "round" es donde se va guardando las secuencias que se van adivinando
// "userPosition" es el orden de la secuencia que va realizando el usuario
// "totalRounds" cantidad de secuencias o rondas para ganar
// "sequence" es la secuencia a repetir por parte del usuario
// "speed" velocidad en la que se ejecuta la secuencia
// "blockedButtons" bandera bloquea botones cuando se muestra la secuencia
// "buttons" array de los botones del tablero los square
// "display" objeto con el boton y el donde muestro las rondas
// "errorSound" objeto audio con el sonido para cuando el user pierde
// "buttonSounds" sonidos para cada uno de los botones uso un array c/object audio
class Simon {
  constructor(simonButtons, startButton, round) {
    this.round = 0;
    this.userPosition = 0;
    this.totalRounds = 10;
    this.sequence = [];
    this.speed = 1000;
    this.blockedButtons = true;
    this.buttons = Array.from(simonButtons);
    this.display = {
      startButton,
      round,
    };
    this.errorSound = new Audio("./sounds/error.wav");
    this.buttonSounds = [
      new Audio("./sounds/1.mp3"),
      new Audio("./sounds/2.mp3"),
      new Audio("./sounds/3.mp3"),
      new Audio("./sounds/4.mp3"),
    ];
  }

  // este metodo inicia el juego, agrego al evento onclick el metodo startGame()
  init() {
    this.display.startButton.onclick = () => this.startGame();
  }

  // Comienza el juego
  // le agrego la clase disabled al boton startButton
  // actualizo el tablero con el numero de ronda
  // pongo userPosition en cero como inicio
  // creo la secuencia con el metodo createSequence
  // recorro botones p/sacar clase winner y asigno al evento onclick buttonClick
  // por ultimo muestro la secuencia (obviamente un solo boton)
  startGame() {
    this.display.startButton.disabled = true;
    this.updateRound(0);
    this.userPosition = 0;
    this.sequence = this.createSequence();
    this.buttons.forEach((element, i) => {
      element.classList.remove("winner");
      element.onclick = () => this.buttonClick(i);
    });
    this.showSequence();
  }

  // Actualiza la ronda en el div round
  updateRound(value) {
    this.round = value;
    this.display.round.textContent = `${this.round}`;
  }

  // Crea el array aleatorio de botones
  createSequence() {
    let secuencia = Array.from({ length: this.totalRounds }, () =>
      this.getRandomColor()
    );
    console.log(secuencia);
    return secuencia;
  }

  // Devuelve un número al azar entre 0 y 3
  getRandomColor() {
    return Math.floor(Math.random() * 4);
  }

  // Si los botones no estan bloqueados ejecuto
  buttonClick(value) {
    if (!this.blockedButtons) {
      this.validateChosenColor(value);
    }
    // !this.blockedButtons && this.validateChosenColor(value);
  }

  // Valida si el boton que toca el usuario corresponde al valor de la secuencia
  // Aca chequeo si el boton que toca coincide con sequence
  // los indices de sequence son las rondas (0, 1, 2....totalRounds)
  // el valor que tiene este array es el boton que se genero y debe tocar el user
  // para seguir jugando
  // userPosition es la position el la ronda del usuario
  validateChosenColor(value) {
    if (this.sequence[this.userPosition] === value) {
      this.buttonSounds[value].play();
      if (this.round === this.userPosition) {
        this.updateRound(this.round + 1);
        this.speed /= 1.02;
        this.isGameOver();
      } else {
        this.userPosition++;
      }
    } else {
      this.gameLost();
    }
  }

  // Verifica que no haya acabado el juego
  // Si no termino el juego y gano el usuario 
  // comienzo de nuevo la ronda por eso pongo userPosition = 0
  isGameOver() {
    if (this.round === this.totalRounds) {
      this.gameWon();
    } else {
      this.userPosition = 0;
      this.showSequence();
    }
  }

  // Muestra la secuencia de botones que va a tener que tocar el usuario
  showSequence() {
    this.blockedButtons = true;
    let sequenceIndex = 0;
    let timer = setInterval(() => {
      const button = this.buttons[this.sequence[sequenceIndex]];
      this.buttonSounds[this.sequence[sequenceIndex]].play();
      this.toggleButtonStyle(button);
      // Espero un tiempo para cambiar el estilo al boton y seguir
      setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
      // Paso al siguiente boton en la secuencia
      sequenceIndex++;
      if (sequenceIndex > this.round) {
        // Si el indice de secuencia es mayor que la ronda en donde estoy
        // desbloqueo botones y limpio el intervalo
        this.blockedButtons = false;
        clearInterval(timer);
      }
    }, this.speed);
  }

  // Pinta los botones para cuando se está mostrando la secuencia
  toggleButtonStyle(button) {
    button.classList.toggle("active");
  }

  // Actualiza el simon cuando el jugador pierde
  gameLost() {
    this.errorSound.play();
    this.display.startButton.disabled = false;
    this.blockedButtons = true;
  }

  // Muestra la animacón de triunfo y actualiza el simon cuando el jugador gana
  gameWon() {
    this.display.startButton.disabled = false;
    this.blockedButtons = true;
    this.buttons.forEach((element) => {
      element.classList.add("winner");
    });
    this.updateRound("🏆");
  }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();
