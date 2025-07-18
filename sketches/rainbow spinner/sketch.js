let pos, vel, currentHue;
let maxChange, maxXChange, maxYChange, maxAngleChange;
let border, lineThickness, lineLength;
let dvx, dvy, dvz;
let paused;

function setup() {
  createCanvas(windowWidth,windowHeight);
  colorMode(HSB, 360, 100, 100);  

  // moved basically everything to a separate function so I could
  // basically reset everything when going to/from full screen
  initialize();
}

function initialize() {
  background(0);

  // using z to represent the angle
  pos = createVector(width / 2, height / 2, 0);
  vel = createVector(0, 0, 0);

  currentHue = 0;
  lineLength = 45;
  border = 15;
  lineThickness = 15;
  strokeWeight(border);
  noFill();
  stroke(255);
  rect(0, 0, width, height);

  // alter border to account for line thickness/length as well
  strokeWeight(lineThickness);
  border += lineThickness;
  
  maxChange = 0.02;
  maxXChange = maxChange * width;
  // maxXChange = lineLength;
  maxYChange = maxChange * height;
  // maxYChange = lineLength;
  maxAngleChange = maxChange * TWO_PI * 10;

  paused = false;
}

function draw() {
  // background(0);
  if(!paused) {
  if (vel.z > 0) {
    currentHue = (currentHue + 1) % 360;
  } else {
    currentHue = (currentHue + 359) % 360;
  }

  // pos.z = noise(frameCount/10) * TWO_PI;
  // dvx = (noise(pos.x, frameCount) - 0.5) * width * maxChange * maxChange;
  dvx = (random(0.5) - 0.25) * maxXChange;
  // dvy = (noise(pos.y + 2 * width, frameCount) - 0.5) * height * maxChange * maxChange;
  dvy = (random(0.5) - 0.25) * maxYChange;
  // dvz = (noise(pos.z, frameCount) - 0.5) * TWO_PI * maxChange * maxChange;
  dvz = (random(0.5) - 0.25) * maxAngleChange;

  vel.x = constrain(vel.x + dvx, -maxXChange, maxXChange);
  vel.y = constrain(vel.y + dvy, -maxYChange, maxYChange);
  vel.z = constrain(vel.z + dvz, -maxAngleChange, maxAngleChange);
  // vel.add([dvx, dvy, dvz]);
  pos.add(vel);

  let offset = p5.Vector.fromAngle(pos.z, lineLength);

  if (abs(offset.x) + pos.x > width - border) {
    pos.x = width - border / 2 - abs(offset.x);
    vel.x = -vel.x;
  } else if (pos.x - abs(offset.x) < border) {
    pos.x = border / 2 + abs(offset.x);
    vel.x = -vel.x;
  }

  if (abs(offset.y) + pos.y > height - border) {
    pos.y = height - border / 2 - abs(offset.y);
    vel.y = -vel.y;
  } else if (pos.y - abs(offset.y) < border) {
    pos.y = border / 2 + abs(offset.y);
    vel.y = -vel.y;
  }

  let base = p5.Vector.sub(pos, offset);
  let tip = p5.Vector.add(pos, offset);
  strokeWeight(lineThickness + 1);
  let alpha=1;
  stroke(0,0,0,alpha);
  line(base.x, base.y, tip.x, tip.y);
  strokeWeight(lineThickness);
  stroke(currentHue, 100, 80, 0.6*alpha);
  line(base.x, base.y, tip.x, tip.y);
  // noLoop();
}
}

function mouseClicked() {
  if (mouseButton === LEFT && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function keyTyped() {
  if (keyCode === 32) {
    paused = !paused;
  }
}

function touchStarted() {
  paused =! paused;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initialize();
}

