//Create variables here
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
  sadDog=loadImage("images/Dog.png");
  happyDog=loadImage("images/happy dog.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/Wash Room.png");
  bedroom=loadImage("images/Bed Room.png");
}
  
function setup() {
	createCanvas(400, 500);
  database=firebase.database();

  foodObj = new Food();
  
  foodStock=database.ref('Food');
  foodStock.on("value",function(data){
   
    foodObj.foodStock = data.val();
  });

  fedTime=database.ref('lastFed');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('Gamestate');
  readState.on("value",function(data){
    gameState=data.val();
  });

  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
 
  feed=createButton("Feed the dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(600,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  currentTime = hour();

    if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();

    }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();

    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodObj.washroom();

    }else{
     
        update("Hungry")
        dog.addImage(sadDog);
       
        dog.visible=true;
        foodObj.display();
    }

    if(gameState!=="Hungry" ){
      feed.hide();
      addFood.hide();
   
      dog.visible=false;
    }
    else if(gameState === "Hungry"){
     feed.show();
     addFood.show();
     dog.visible=true;
     
    }

  drawSprites();
}


function feedDog(){
  dog.addImage(happyDog);

  foodObj.foodStock -= 1;

  database.ref('/').update({
    Food:foodObj.foodStock,
    lastFed:hour(),
    Gamestate:"Hungry"
  })
}

function addFoods(){
  foodObj.foodStock++;
  database.ref('/').update({
    Food: foodObj.foodStock
  })
}

function update(state){
  database.ref('/').update({
    Gamestate:state
  })
}
