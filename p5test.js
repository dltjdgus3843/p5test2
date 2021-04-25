let num = 80; // bubble num
let Bubbles = [];
let rotation = 0;
let Fishes = [];
let r = 10;
let soundFile, analyzer, delay, mic, reverb;

function preload(){
  soundFormats('ogg', 'mp3');
  soundFile = loadSound('ICT.mp3');
}

function mousePressed(){
  soundFile.amp(3);
  soundFile.play();
}

class bubble {
  constructor(x, y, z, op) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.op = op;
    //this.grad = grad;
  }
  
  move() {
    this.speed = 1; //+(num)해서 속도 조절가능(if (s>100))
    this.z = this.z - (this.speed);
    if (this.z < 1) {
      this.z = height;
    }
  }
  
  render() {
    let x_z = map(this.x / this.z, 0, 13, 0, width);
    let y_z = map(this.y / this.z, 0, 13, 0, height);
    
    let size = map(this.z, 0, windowHeight-50, 13, 0);
    
    noStroke();
    fill(255, 255, 255, this.op);
    //물방울
    ellipse(x_z, y_z, size+6.5, size+6.5);
    //물방울 안 그라데이션
    let a =size+5;
    for(let i=0; i<30; i+=2){
      noStroke();
      fill(40,100,225,i+25);
      ellipse(x_z, y_z, (a)-i, (a)-i);
      a++;
    }
  }
}

function fish(v) {

  this.v = v;
  
  this.move = function() {
    let c = createVector(0, 0.8);
    c.setHeading(atan2(this.v.y - height/2, this.v.x - width/2));
    this.v.add(c);
  }

  this.render = function() {
    //물고기
    noStroke();
    fill(random(150,255),225,225,245);
    
    push();
    translate(this.v.x, this.v.y);
    rotate(atan2(this.v.y - height/2, this.v.x - width/2)-PI); //가운데를 중심으로 머리가 향하게 회전
    ellipse(2*r+15, 0, 40,23);
    triangle(random(0,5), random(0,5),             // x1, y1
             r+random(0,5), random(0,5)-r*sqrt(3), //x2, y2
             2*r, 0);                              // x3, y3 (디폴트 = 피라미드 형)
    pop();
  }
}

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  
  delay = new p5.Delay();
  delay.process(mic, 0.12, 0.7, 1000);
  delay.setType('pingPong'); //스테레오 효과
  reverb = new p5.Reverb();
  reverb.process(mic, 0.1, 0.2);
  reverb.amp(4);
  analyzer = new p5.Amplitude();
  analyzer.setInput(mic);
  
  createCanvas(1920,1080); //배경이미지 사이즈에 맞춤
  //createCanvas(windowWidth, windowHeight);
  bg=loadImage('deepsea.jpg') // 배경이미지(파일명/이미지명)
  frameRate(30);

  for (var i = 0; i < num; i++) {
    Bubbles[i] = new bubble(
      random(width, -width), random(height, -height),
      random(windowHeight), random(150, 220)); 
  }
  
  for(var f = 0; f<30; f++){
    Fishes[f] = new fish(createVector(random(0,windowWidth), random(0, windowHeight)));
  }
}

function draw() {
  let level = analyzer.getLevel();
  soundFile.amp(3);
  
  background(bg)
  if (random(0, 7)>6){ //확률로 물고기 수 조절
    Fishes.push(new fish(createVector(random(120, windowWidth), random(120, windowHeight))));
  }
  for (let i = 0; i <Fishes.length; i++){
    
  if(Fishes[i].v.x>width+40||Fishes[i].v.x<-40||Fishes[i].v.y>height+40||Fishes[i].v.y<-40){
    Fishes.splice(i, 1); // 화면 경계선+40 넘어가면 물고기 없애기
  }else{
    Fishes[i].move();
    Fishes[i].render();
  }
 }
  
  translate(width /2, height /2);  
  rotation -= 0.0018; //음수->반시계
  rotate(rotation);
  
  for (let i =0; i<Bubbles.length; i++) {
  if(Bubbles[i]>width+40 || Bubbles[i]<-40 || Bubbles[i]>height+40||Bubbles[i]<-40){
    Bubbles.splice(i, 1);
     }else{
    Bubbles[i].move();
    Bubbles[i].render();
  }
 }
}