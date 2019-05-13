//General Variables
let stage = 1;
let randomizer = (min, max) => Math.floor(Math.random() * (max- min) + min);
const row = [60, 143, 226];
const currentLevel = document.getElementById("level");
currentLevel.textContent = stage;
const highScore = document.getElementById("high-score");
let bestScore = 0;

// For placement and rendering of objects
class Character{
  constructor(x, y, sprite, width){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = (width/2);
    this.xA = this.x + this.width;
    this.xB = this.x - this.width;
  }
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

// Enemies our player must avoid
class Enemy extends Character { 
  constructor() {
    super(randomizer(-200, -550), row[randomizer(0, 3)], 'images/enemy-bug.png', 100);
    this.speed = stage * randomizer(80, 100);
  };
  
  update(dt) {
    if((this.y === player.y - 13) && this.xA >= player.xB && this.xB <= player.xA){
      player.reset(0);    
      hearts.pop();
      allEnemies.forEach(function(enemy){
      enemy.speed = 0;
      enemy.reset(200);
      });

      if(hearts.length === 0){
        allEnemies = [new Enemy(), new Enemy()];        
        if(stage > highScore.textContent){
          highScore.textContent = stage;
        }
        stage = 1;
        currentLevel.textContent = stage;
        hearts = [new Heart(20, 400), new Heart(70, 400), new Heart(120, 400)];
      };

    } else {
      this.x += this.speed * dt;
      this.xA = this.x + this.width;
      this.xB = this.x - this.width;
      if (this.x >= 500){
        this.reset();
      }
    }
  };

  reset(){
    this.x = randomizer(-250, -1050) + randomizer(-100, -350);
    this.y = row[randomizer(0, 3)];
    this.speed = randomizer(80, 100);
    
    if(stage >=5){
      this.speed = randomizer(80, 100) + this.y/ (stage/2);
    }
  };
}


// Now write your own player class
class Player extends Character{
  constructor(){
    super(200, 405, "images/Star.png", 100);
  };

  update(){     
    this.xA = this.x + this.width;
    this.xB = this.x - this.width;
  };

  reset(time){
    setTimeout(function(){
      player.x = 200; 
      player.y = 405}, time);
    }

  handleInput(direction){
    if(direction === "left" && this.x >= 100){
      this.x -= 100;

    } else  if(direction === "right" && this.x <= 300) {
      this.x += 100;

    } else  if(direction === "up"&& this.y >= 0){
      this.y -= 83; 
      if(this.y <=0){
        this.reset(1000);
        stage++;
        currentLevel.textContent = stage;
        if(allEnemies.length < 10){
          allEnemies.push(new Enemy());
        }
      };

    } else  if(direction === "down" && this.y < 405 && this.y >= 0) {
      this.y += 83;
    } 
  };
};
//Hearts
class Heart extends Character{
  constructor(x, y) {
    super(x, y, 'images/Heart.png', 100);
  };
};


// Now instantiate your objects.
// Place all enemy objects in an array called 
let allEnemies = [new Enemy(), new Enemy()];

// Place the player object in a variable called 
let player= new Player();

// Hearts stored in this array
let hearts = [new Heart(5, 440), new Heart(45, 440), new Heart(85, 440)];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
