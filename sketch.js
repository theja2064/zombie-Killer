var FIGHT = 1;
var LOST = 0;
const BULLETS_EMPTY = 3;
const WON = 2;
var gameState = FIGHT;


var live = 3;

var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg, zombieGroup;
var heart_1, heart_2, heart_3, heartImg1, heartImg2, heartImg3;
var bullet, bulletGroup;

var winning;
var losing;
var shooting;


var score = 0;
var numberOfBullets = 15;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  //todo
  //load three separate heart images
  //load three sounds loadSound


  heartImg1 = loadImage("assets/heart_1.png") 
  heartImg2 = loadImage("assets/heart_2.png") 
  heartImg3 = loadImage("assets/heart_3.png")

  bgImg = loadImage("assets/bg.jpeg")

  winning = loadSound("assets/win.mp3")
  losing = loadSound("assets/lose.mp3")
  shooting = loadSound("assets/explosion.mp3")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.1
  

//creating the player sprite
   player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
   player.addImage(shooterImg);
   player.scale = 0.3;
   player.debug = true;
   player.setCollider("rectangle",0,0,300,300)

   //creating hearts
   heart_1 = createSprite(displayWidth-400, displayHeight-800, 50, 50)
   heart_1.addImage(heartImg1);
   heart_1.scale = 0.3;

   heart_2 = createSprite(displayWidth-400, displayHeight-800, 50, 50)
   heart_2.addImage(heartImg2);
   heart_2.scale = 0.3;

   heart_3 = createSprite(displayWidth-400, displayHeight-800, 50, 50)
   heart_3.addImage(heartImg3);
   heart_3.scale = 0.3;



   //creating zombieGroup
  zombieGroup = new Group();
  bulletGroup = new Group();
 
  
}

function draw() {
  background(0); 

  //todo
  //if gameState is fight then display hearts sprites based on number of lives
  //use heart1.visible = true/false
  //set gamestate = "lost" when live = 0
  //set gameState to "won" if score is 100, play winning sound

  if(gameState === FIGHT){
    if(live === 3){
      heart_3.visible = true;
      heart_1.visible = false;
      heart_2.visible= false;
    } else if(live === 2){
      heart_2.visible = true;
      heart_1.visible = false;
      heart_3.visible = false;
    } else if(live === 1){
      heart_1.visible = true;
      heart_2.visible = false;
      heart_3.visible = false;
    }
  

  if(live === 0){
    gameState = LOST;
    heart_1.visible = false;
    heart_2.visible = false;
    heart_3.visible = false;
  }

  if(score === 100){
    gameState = WON;
    winning.play();
  }


  




  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}
  //moving the player left and right and making the game mobile compatible using touches
if(keyDown("LEFT_ARROW")||touches.length>0){
    player.x = player.x-30
  }
if(keyDown("RIGHT_ARROW")||touches.length>0){
   player.x = player.x+30
  }


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
 bullet= createSprite(player.x,player.y,20,10);
 bullet.velocityX = 10;
 numberOfBullets = numberOfBullets-1;
 bulletGroup.add(bullet);

  player.addImage(shooter_shooting)
 
  shooting.play();
}
//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

if(numberOfBullets === 0){
  gameState = BULLETS_EMPTY;
}

//spawning zombies
if (frameCount % 60 === 0) {
  var y = Math.round(random(80,displayHeight-200));
  zombie = createSprite(displayWidth-200,y,50,50);
  zombie.addImage(zombieImg);
  zombie.scale = 0.2;
  zombie.velocityX = -3;
  
   //assign lifetime to the variable
  zombie.lifetime = 500;
  
  zombieGroup.add(zombie);

  zombie.setCollider("rectangle",0,0,500,500); 
  zombie.debug = true;

  console.log("spawningZombies" + y);
}
//destroy the zombie when bullet touches it and increase score 
if(zombieGroup.isTouching(bulletGroup)){ 
  for(var i=0;i<zombieGroup.length;i++){ 
    if(zombieGroup[i].isTouching(bulletGroup))
    {
       zombieGroup[i].destroy()
       bulletGroup.destroyEach()
       shooting.play();
       score = score+10
    } 
  }
 }
//when the zombie touches the player
if(zombieGroup.isTouching(player)){
  for(var i=0;i<zombieGroup.length;i++){ 
    if(zombieGroup[i].isTouching(player))
    {
       zombieGroup[i].destroy()
       losing.play();
       live = live-1;    
    } 
  }
}
}

drawSprites();

textSize(20) 
fill("white")
text("Bullets = " + numberOfBullets,displayWidth-210,displayHeight/2-250) 
text("Score = " + score,displayWidth-200,displayHeight/2-220) 
text("Lives = " + live,displayWidth-200,displayHeight/2-280)

//destroy zombie and player and display a message in gameState "lost" 
if(gameState == LOST){
   textSize(100)
   fill("red")
   text("You Lost ",400,400) 
   zombieGroup.destroyEach(); 
   player.destroy(); 
}
if(gameState == WON){
  textSize(100)
  fill("red")
  text("YOU WON",400,400) 
  zombieGroup.destroyEach(); 
  player.destroy(); 
}
if(gameState == BULLETS_EMPTY){
  textSize(100)
  fill("red")
  text("YoU RAN OUT OF BULLETS ",200,400) 
  zombieGroup.destroyEach(); 
  bulletGroup.destroyEach();
  player.destroy(); 
}
}



//load other images: heart and zombie in function preload
//create other sprites in function set up such as hearts and bullet and a zombie group and add their image
//make the player move left and right in the draw function
//spawn zombies from the draw function (createSprites, movement(add velocity), add lifetime, scale) and add them to the group

//make the collider so that when the zombie touches the hunter or the gun the hunter drops dead
//make the scoring system
//add var life,score and no of bullets
//add var gameState
