function setNameDiv(){
    
    let nameDiv = document.getElementById('name');
    name.left = (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) / 2);
    name.top = (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 2);
  }

  function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
  }

  function randomNeg(){
    if(getRandomInt(2) == 1){
      return 1;
    } else {
      return -1;
    }
  }

  function createBall(minSize, maxSize, colors, rightWall, bottomWall){
    
    let sizeRange = maxSize - minSize;

    let ballSize = getRandomInt(sizeRange) + minSize;
    let ballRadius = Math.floor(ballSize / 2);
    let ballXPos = getRandomInt(rightWall - ballSize - 25) + ballRadius;
    let ballYPos = getRandomInt(bottomWall - ballSize) - 25 + ballRadius;
    let ballXVel = (getRandomInt(2) + 1) * randomNeg();
    let ballYVel = (getRandomInt(2) + 1) * randomNeg();
    let ballColor = colors[getRandomInt(colors.length)];
    let ballZIndex = getRandomInt(5) + 1;
    let previousCollision = 'initial';


    let ball = {
      size: ballSize,
      radius: ballRadius,
      xPos: ballXPos,
      yPos: ballYPos,
      xVel: ballXVel,
      yVel: ballYVel,
      color: ballColor,
      zIndex: ballZIndex,
      previousCollision: previousCollision
    };

    return ball;
  }

  function getDistance(x1,x2,y1,y2){

    return Math.floor(Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2)));
  }

  function detectCollisions(walls, balls){

    // for each ball in the list of balls
    for(let i = 0; i < balls.length; i++){
      let ball = balls[i];

      // left wall
      if(ball.xPos <= walls.left){
        if(ball.previousCollision !== 'left'){
          ball.xVel = -(ball.xVel - (ball.xVel * resistance));
          ball.previousCollision = 'left';
        }
      }

      // right wall
      if(ball.xPos >= walls.right - ball.size){
        if(ball.previousCollision !== 'right'){
          ball.xVel = -(ball.xVel - (ball.xVel * resistance));
          ball.previousCollision = 'right';
        }
      }
    
      // top wall
      if(ball.yPos <= walls.top){
        if(ball.previousCollision !== 'top'){
          ball.yVel = -(ball.yVel - (ball.yVel * resistance));
          ball.previousCollision = 'top';
        }
      }

      // bottom wall
      if(ball.yPos >= walls.bottom - ball.size){
        if(ball.previousCollision !== 'bottom'){
          ball.yVel = -(ball.yVel - (ball.yVel * resistance));
          ball.previousCollision = 'bottom';
        }
      }

      // ball collision
      for(let j=0; j < balls.length; j++){

        if(i != j){

          let second = balls[j];

          if(getDistance(ball.xPos, second.xPos, ball.yPos, second.yPos) <= ball.radius + second.radius){

            if(ball.previousCollision != 'ball'+j && second.previousCollision != 'ball'+i){

              if(100 - getRandomInt(100) < 2){

                let swap = ball.xVel - (ball.xVel * resistance);
                ball.xVel = second.xVel - (second.xVel * resistance);
                second.xVel = swap;

                swap = ball.yVel - (ball.yVel * resistance);
                ball.yVel = second.yVel - (second.yVel * resistance);
                second.yVel = swap;

                ball.previousCollision = 'ball'+j;
                second.previousCollision = 'ball'+i;

              }
            }
          }
        }
      }
  }
}

  function initializeDiv(ball,num){
    let div = document.createElement('div');
    div.id = 'ball'+num;
    div.style.zIndex = ball.zIndex;
    div.style.position = 'absolute';    
    div.style.left = ball.xPos + 'px';    
    div.style.top = ball.yPos + 'px';    
    div.style.width = ball.size + 'px';    
    div.style.height = ball.size + 'px';    
    div.style.borderRadius = '50%';
    div.style.background = ball.color;
    div.style.border = '1px solid white';

    document.getElementsByTagName('body')[0].appendChild(div);
  }

  function initializeDivs(balls){
    for(let i = 0; i < balls.length; i++){
      initializeDiv(balls[i],i);
    }
  }

  function updateBalls(walls, balls){
    for(let i = 0; i < balls.length; i++){

      let ball = balls[i];
      let div = document.getElementById('ball'+i);

      ball.xPos += ball.xVel;
      div.style.left = ball.xPos + 'px';

      ball.yPos += ball.yVel;

      if(grav > 0 && ball.yVel < 0.5 && ball.yPos >= (walls.bottom - ball.size)){
        ball.yPos = walls.bottom - ball.size;
        ball.yVel = 0;
      }
      div.style.top = ball.yPos + 'px';

    }
  }

  function firstScene(walls, balls){
    
    detectCollisions(walls, balls);

    updateBalls(walls, balls);

  }

  function addGravity(balls){

    for(let i = 0; i < balls.length; i++){

      let ball = balls[i];
      
      ball.yVel += grav;

    }
  }

  function secondScene(walls, balls, runtime){

    addGravity(balls);

    detectCollisions(walls, balls);

    updateBalls(walls, balls);

    runtime.ms++;

    if(runtime.ms >= 4000){
      clearInterval(secondTicker);
    }
  }

  function nextScene(){
    if(firstSceneFlag){
      clearInterval(firstScene);
      document.getElementById('name-text').innerHTML = 'Max Ohsawa';
      grav = 0.05;
      resistance = 0.1;
      
      secondTicker = setInterval(function(){secondScene(walls, balls, runtime);}, 0.2);
      firstSceneFlag = false;
      secondSceneFlag = true;
    } 
  }

  setNameDiv();

  let ballMinSize = 20;
  let ballMaxSize = 100;
  let numBalls = 128;
  let ballColors = ['#4285F4','#DB4437','#F4B400','#0F9D58'];

  let leftWall = 25;
  let rightWall = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 25;
  //let rightWall = 500;
  let topWall = 25;
  //let bottomWall = 500;
  let bottomWall = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 25;

  if(rightWall > 1000){
    numBalls *= 2;
  }

  let walls = {
    left: leftWall,
    right: rightWall,
    top: topWall,
    bottom: bottomWall
  };

  let balls = [];
  for(let i = 0; i < numBalls; i++){
    balls.push(createBall(ballMinSize, ballMaxSize, ballColors, rightWall, bottomWall));
  }

  initializeDivs(balls);

  window.addEventListener('click', nextScene);
  window.addEventListener('touchend', nextScene);

  var grav = 0;
  var resistance = 0;
  var runtime = {ms: 0};
  var firstTicker = setInterval(function(){firstScene(walls, balls);}, 1);
  var secondTicker;
  var firstSceneFlag = true;
  var secondSceneFlag = false;

  // end