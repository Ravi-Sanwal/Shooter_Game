var gunLoaded = true;
var enemiesMovingDown = false;
var gameStarted = false;
//var enemiesRemaining = 6;
var startTime;
var timeElapsed;
var lifes = 3;
var score = 0;
var flag = 0;
onEvent("game_screen", "keydown", function(event) {
  var pacmanx = getXPosition("pacman");
  var pacmany = getYPosition("pacman");
  var distance = 10;
  if(event.key == "Left"){
    pacmanx = pacmanx - distance;
  }
  if(event.key == "Right"){
    pacmanx = pacmanx + distance;
  }
  if(event.key == "Enter"){
    fire();
  }
  setPosition("pacman", pacmanx, pacmany);
  horizontalWrapAround("pacman");
});

function horizontalWrapAround(object){
  var objectx = getXPosition(object);
  var objecty = getYPosition(object);
  var objectWidth = getProperty(object, "width");
   
  if (objectx < 0 - (objectWidth) / 2 ){
    objectx = 320 - (objectWidth) / 2;
  }
  else if (objectx > 320 - (objectWidth) / 2 ){
    objectx = 50 - (objectWidth) / 2;
  }
  setPosition(object, objectx, objecty);
}

function fire(){
  if(gunLoaded){
    gunLoaded = false;
    var pacmanx = getXPosition("pacman");
    var pacmany = getYPosition("pacman");
    var pacmanHeight = getProperty("pacman", "height");
    var pacmanWidth = getProperty("pacman", "width");
    var energyBoltWidth = getProperty("pacman_bullet", "width");
    
    var energyBolty = pacmany - pacmanHeight + (pacmanHeight / 2) + 4;
    var energyBoltx = pacmanx + (energyBoltWidth / 4);
    setPosition("pacman_bullet", energyBoltx, energyBolty);
  }
}
onEvent("button_start", "click", function(event) {
  if(!gameStarted){
    gameStarted = true;
    setPosition("button_start", 100, 500);
    startTime = getTime();
    setPosition("pacman_bullet", 500, 500);
    for (var i = 1; i <= 6; i++) {
      setPosition("enemy_bullet_" + i, 500, 500);
    }
    
    timedLoop(10, function() {
      
      updateTime();
      moveEnergyBolt();
      moveEnemy("enemy_1");
      moveEnemy("enemy_2");
      moveEnemy("enemy_3");
      moveEnemy("enemy_4");
      moveEnemy("enemy_5");
      moveEnemy("enemy_6");
      
      collisionDetection("enemy_1", "enemy_bullet_1");
      collisionDetection("enemy_2", "enemy_bullet_2");
      collisionDetection("enemy_3", "enemy_bullet_3");
      collisionDetection("enemy_4", "enemy_bullet_4");
      collisionDetection("enemy_5", "enemy_bullet_5");
      collisionDetection("enemy_6", "enemy_bullet_6");
      
      if((score % 6) < 5){
        showElement("enemy_1");
        showElement("enemy_2");
        showElement("enemy_3");
        showElement("enemy_4");
        showElement("enemy_5");
        showElement("enemy_6");
        showElement("enemy_bullet_1");
        showElement("enemy_bullet_2");
        showElement("enemy_bullet_3");
        showElement("enemy_bullet_4");
        showElement("enemy_bullet_5");
        showElement("enemy_bullet_6");
      }
      
      enemyFire();
      
      moveEnemyBomb("enemy_bullet_1");
      moveEnemyBomb("enemy_bullet_2");
      moveEnemyBomb("enemy_bullet_3");
      moveEnemyBomb("enemy_bullet_4");
      moveEnemyBomb("enemy_bullet_5");
      moveEnemyBomb("enemy_bullet_6");
  
      pacmanCollisionDetection("enemy_bullet_1");
      pacmanCollisionDetection("enemy_bullet_2"); 
      pacmanCollisionDetection("enemy_bullet_3");
      pacmanCollisionDetection("enemy_bullet_4");
      pacmanCollisionDetection("enemy_bullet_5");
      pacmanCollisionDetection("enemy_bullet_6");
      
    });
    
  }
});
function updateTime(){
  var currentTime = getTime();
  elapsedTime = currentTime - startTime;
  elapsedTime  = (elapsedTime / 1000 ).toFixed(1);
  //setNumber("label_time", elapsedTime);
  
}
function moveEnergyBolt(){
  var energyBoltx = getXPosition("pacman_bullet");
  var energyBolty = getYPosition("pacman_bullet");
  var energyBoltSpeed = 5;
  energyBolty = energyBolty - energyBoltSpeed;
  setPosition("pacman_bullet", energyBoltx, energyBolty);
  
  if(energyBolty < 0)
    gunLoaded = true;
}
function moveEnemy(name){
  var enemyx = getXPosition(name);
  var enemyy = getYPosition(name);
  var maxy = 300;
  var miny = 20;
  //var minx = 35;
  var distanceFromMax = maxy - enemyy;
  var horizontalSpeed = (distanceFromMax / 200);
  var verticalSpeed = Math.random()*2;
  enemyx = enemyx + horizontalSpeed;
  /*if(enemyx < minx){
    enemyx = enemyx - horizontalSpeed;
  }*/
  if(enemyy > maxy)
    enemiesMovingDown = true;
  if(enemyy < miny)
    enemiesMovingDown = false;
  
  if(enemiesMovingDown)
    enemyy = enemyy - verticalSpeed;
  else
    enemyy = enemyy + verticalSpeed;
    
  setPosition(name, enemyx, enemyy);
  horizontalWrapAround(name);
}
function collisionDetection(object, objectBomb){
   var energyBoltx = getXPosition("pacman_bullet");
   var energyBolty = getYPosition("pacman_bullet");
   var objectx = getXPosition(object);
   var objecty = getYPosition(object);
   
   var energyBoltWidth = getProperty("pacman_bullet", "width");
   var energyBoltHeight = getProperty("pacman_bullet", "height");
   var objectWidth = getProperty(object, "width");
   var objectHeight = getProperty(object, "height");
   
   if(energyBoltx + energyBoltWidth >= objectx && energyBoltx <= objectx + objectWidth){
    
    if(energyBolty + energyBoltHeight >= objecty && energyBolty <= objecty + objectHeight){
      if(!getProperty(objectBomb, "hidden")&&!getProperty(object, "hidden")){
        score++;
        hideElement(object);
        hideElement(objectBomb)
        setText("label_time", "score: "+ score);
      } 
    }
   }
}

function enemyFire(){
  var id = Math.floor(Math.random()*7);
  if(id == 0){
    id = 1;
  }
  if(getYPosition("enemy_bullet_"+ id) >  800){
    var enemyx = getXPosition("enemy_" + id);
    var enemyy = getYPosition("enemy_" + id);
    
    var enemyHeight = getProperty("enemy_" + id, "height");
    var enemyWidth = getProperty("enemy_" + id, "width");
    var enemyBombWidth = getProperty("enemy_bullet_" + id, "width");
      
    var enemyBomby = enemyy + (enemyHeight / 2);
    var enemyBombx = enemyx  + 4;
    setPosition("enemy_bullet_" + id, enemyBombx, enemyBomby);
  }
}
function moveEnemyBomb(bullet){
  var enemyBombx = getXPosition(bullet);
  var enemyBomby = getYPosition(bullet);
  var enemyBombSpeed = 1;
  if(bullet == "enemy_bullet_1")
    enemyBombSpeed = enemyBombSpeed + 5;
  if(bullet == "enemy_bullet_2")
    enemyBombSpeed = enemyBombSpeed + 1;
  if(bullet == "enemy_bullet_3")
    enemyBombSpeed = enemyBombSpeed + 1;
  if(bullet == "enemy_bullet_4")
    enemyBombSpeed = enemyBombSpeed + 0;
  if(bullet == "enemy_bullet_5")
    enemyBombSpeed = enemyBombSpeed + 2;
  if(bullet == "enemy_bullet_6")
    enemyBombSpeed = enemyBombSpeed + 1;
  
  enemyBomby = enemyBomby + enemyBombSpeed;
  setPosition(bullet, enemyBombx, enemyBomby);
}
function pacmanCollisionDetection(bullet){
   var enemyBombx = getXPosition(bullet);
   var enemyBomby = getYPosition(bullet);
   var pacmanx = getXPosition("pacman");
   var pacmany = getYPosition("pacman");
   var enemyBombWidth = getProperty(bullet, "width");
   var enemyBombHeight = getProperty(bullet, "height");
   var pacmanWidth = getProperty("pacman", "width");
   var pacmanHeight = getProperty("pacman", "height");
   
   if(enemyBombx + enemyBombWidth >= pacmanx && enemyBombx <= pacmanx + pacmanWidth){
    
    if(enemyBomby + enemyBombHeight >= pacmany && enemyBomby <= pacmany + pacmanHeight){
      if(!getProperty(bullet, "hidden")){
        var width = 0;
        var height = getYPosition("pacman");
        setPosition("pacman", width, height);
        switch(lifes){
        case 1:
          {hideElement("pacman_bullet");
          hideElement("life_1");
          hideElement(bullet);
          lifes--;
          console.log(lifes);
          stopTimedLoop();
          showElement("EndGame");
          setText("EndGame", "GAME OVER\nSCORE:" + score);
          gameStarted = false;
          break;}
        case 2:
          {hideElement("life_2");
          lifes--;
          console.log(lifes);
          break;}
        case 3:
          {hideElement("life_3");
          lifes--;
          flag = 1;
          console.log(lifes);
          break;}
        }
        if(false){
          hideElement("life_3");
          hideElement(bullet);
          lifes--;
          flag = 1;
          console.log(lifes);
        }
        else if(false){
          hideElement("life_2");
          hideElement(bullet);
          lifes--;
          console.log(lifes);
          flag = 1;
        }
        else{
          /*hideElement("pacman_bullet");
          hideElement("life_1");
          hideElement(bullet);
          lifes--;
          console.log(lifes);
          stopTimedLoop();
          showElement("EndGame");
          setText("EndGame", "GAME OVER\nSCORE:" + score);
          gameStarted = false;
          score = 0;
          lifes = 3*/
        }
        }
    }
    } 
   }
