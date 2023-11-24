// G U I
let sketchProps = {

  // input (drawing)
  showGrid: true, // show the input grid?
  gridSize: 10, // size of grid cells and ISO boxes

  // switch drawing mode between draw, text, gif
  drawingMode: "Draw", // default drawing mode
  drawingModes: ['Draw', 'Text', 'Gif'], // drawing mode options

  inputText: "0", // if we render a number or letter, default value

  // output (ISO)

  // switch between color themes (blue, pink, green, purple)

  // select individual colors
  color: [255, 100, 100], // RGB array

  // change animation style

};


// V A R I A B L E S

// font variable
let font;

let bild; // Bild

// bg color
//let bg = '#fff';
let bg = '#161e4f';
bg = 'black';

// define colors
let frontColor = 'white';
let backColor = '#C4C4C4'; // grey
let leftColor = '#00009d'; // dark blue
let rightColor = '#0000fe'; // blue
//let topColor = '#E958C6'; // contrast color
let topColor = '#ff6c00'; // contrast color
topColor = 'fuchsia';
let bottomColor = '#fff'; // white

// input canvases
let gridCanvas; // grid canvas
let inputCanvas; // drawing canvas
const canvasPos = 20; // canvas position
let gridSize = 10; // the size of a box

// scalefactor between canvas and drawing input
const scaleFactor = 5; // drawing canvas is 5 times smaller than the output canvas

// input buttons
let buttonTopView; // change perspective to top view
let buttonLeftView; // change perspective to left view
let buttonRightView; // change perspective to right view
let buttonBottomView; // change perspective to bottom view
let buttonNewShape; // create a new shape
let reset = false;

// camera rotation
let camX = -45;
let camY = 0;
let camZ = -45;

// array to store all drawn shapes
let shapes = [];


// P R E L O A D
function preload() {

  // load font
  font = loadFont("assets/EduFavorit-Medium.woff");
  //font = loadFont("assets/Archia-Bold.otf");
}

// S E T U P
function setup() {

  let canvas = createCanvas(900, 900, WEBGL);
  canvas.parent('sketch'); // attach canvas to parent div

  // run gui setup
  setupDatGui();

  //noCursor();
  noStroke();

  // ortho perspective
  // left, right, bottom, top, near, far
  ortho(-width / 2, width / 2, -height / 2, height / 2, -1000, 2000);

  // input canvas
  inputCanvas = createGraphics(int(width / scaleFactor), int(height / scaleFactor));
  inputCanvas.background(255);
  inputCanvas.fill(0);
  //inputCanvas.textFont(font);

  // grid canvas
  gridCanvas = createGraphics(int(width / scaleFactor), int(height / scaleFactor));
  gridCanvas.background(255, 0);
  gridCanvas.stroke(0); // set stroke color
  gridCanvas.strokeWeight(1); // set stroke weight
  gridCanvas.noFill();

  noStroke();

}

// D R A W
function draw() {

  background(bg);


  /* - - - D R A W  P R E V I O U S  S H A P E S - - - */
  // loop through all stored shapes
  for (let i = 0; i < shapes.length; i++) {

    // get shape info (box positions and camera rotation)
    let shapeInfo = shapes[i];

    // draw boxes
    drawBoxes(shapeInfo.boxes, shapeInfo.camX, shapeInfo.camY, shapeInfo.camZ);
  }


  /* - - - O U T P U T - - - */
  let currentShapeBoxes = getCurrentShapeBoxes();
  drawBoxes(currentShapeBoxes, camX, camY, camZ);


  /* - - - G R I D  C A N V A S - - - */
  // grid canvas on top left corner
  push();

  // translate to normal coordinates
  translate(-width / 2, -height / 2);

  gridCanvas.background(255);

  // draw grid lines on input canvas
  for (let x = 0; x < inputCanvas.width; x = x + sketchProps.gridSize) {
    for (let y = 0; y < inputCanvas.height; y = y + sketchProps.gridSize) {
      gridCanvas.rect(x, y, sketchProps.gridSize, sketchProps.gridSize);
    }
  }

  // show drawing grid canvas?
  if (sketchProps.showGrid) {
    image(gridCanvas, canvasPos, canvasPos);
  }
  pop();


  /* - - - D R A W  C A N V A S - - - */

  // input canvas on top left corner
  push();

  // translate to normal coordinates
  translate(-width / 2, -height / 2);

  // reset drawing
  if (reset) {
    inputCanvas.background(255);
    reset = false;
  }

  // switch between drawing modes
  if (sketchProps.drawingMode === 'Draw') {

    // console.log("Drawing mode: draw");

    // draw when mouse is pressed
    if (mouseIsPressed) {

      let multiX = mouseX - canvasPos - (mouseX % sketchProps.gridSize);
      let multiY = mouseY - canvasPos - (mouseY % sketchProps.gridSize);

      inputCanvas.fill(0);
      inputCanvas.rect(multiX, multiY, sketchProps.gridSize, sketchProps.gridSize);

    }

  } else if (sketchProps.drawingMode === 'Text') {

    // console.log("Drawing mode: text");

    // draw text on input canvas
    inputCanvas.background(255);
    inputCanvas.textAlign(CENTER, CENTER);
    inputCanvas.push();
    inputCanvas.translate(inputCanvas.width / 2, inputCanvas.height * 0.535);
    //inputCanvas.rotate(radians(frameCount * 0.5)); // animated rotation

    inputCanvas.fill(0);
    //inputCanvas.noFill();
    inputCanvas.stroke(0);
    //inputCanvas.strokeWeight(5);
    //inputCanvas.textSize(map(sin(frameCount * 0.02), -1, 1, 50, 120));
    inputCanvas.textSize(240);
    inputCanvas.text(sketchProps.inputText, 0, 0);
    inputCanvas.noStroke();
    inputCanvas.pop();

  } else if (sketchProps.drawingMode === 'Gif') {

    // console.log("Drawing mode: gif");

  }

  // render draw canvas
  blendMode(MULTIPLY);
  image(inputCanvas, canvasPos, canvasPos);
  blendMode(BLEND);

  pop();


  /* - - - M O U S E  C O O R D S - - - */
  // push();
  // translate(mouseX - width / 2, mouseY - height / 2, 0);
  // fill(0);
  // ellipse(0, 0, 10, 10);
  // text("X " + (mouseX - width / 2) + " | Y " + (mouseY - height / 2), 0, -10);
  // pop();


}


// M O U S E   P R E S S E D
function mousePressed() {
  //let fs = fullscreen();
  //fullscreen(!fs);
}

/* - - - I N P U T  B U T T O N  F U N C T I O N S - - - */

// right view (frontal)
function rightView() {
  console.log("frontal");
  camX = -45;
  camY = 0;
  camZ = -45;
}

// top view (flat)
function topView() {
  console.log("flat");
  camX = 45;
  camY = 45;
  camZ = 0;
}

// left view (back)
function leftView() {
  console.log("back");
  camX = -45;
  camY = -90;
  camZ = 45;
}

// bottom view (belly)
function bottomView() {
  console.log("belly");
  camX = -45;
  camY = -90;
  camZ = 45;
}


/* - - - F U N C T I O N : G E T  C U R R E N T  S H A P E  B O X E S - - - */
// this function returns an array of boxes from the current input canvas

function getCurrentShapeBoxes() {
  let currentShapeBoxes = [];

  for (let x = 0; x < inputCanvas.width; x += sketchProps.gridSize) {
    for (let y = 0; y < inputCanvas.height; y += sketchProps.gridSize) {
      let c = inputCanvas.get(x + sketchProps.gridSize / 2, y + sketchProps.gridSize / 2);

      if (brightness(c) < 70) {
        currentShapeBoxes.push({ x: x, y: y, c: c });
      }
    }
  }

  return currentShapeBoxes;
}



/* - - - F U N C T I O N : D R A W  B O X E S - - - */
// this function draws the boxes from the shapes array

// function input: array of boxes, camera rotation
function drawBoxes(boxes, camX, camZ, camY) {
  push();

  // Apply the stored camera rotation
  rotateX(radians(camX));
  rotateY(radians(camY));
  rotateZ(radians(camZ));

  // Translate zero point to top left
  translate(-width / 2, -height / 2);

  // loop through boxes array
  for (let i = 0; i < boxes.length; i++) {
    let boxInfo = boxes[i];

    fill(boxInfo.c);
    push();

    // Variante 1
    //translate(boxInfo.x * scaleFactor, boxInfo.y * scaleFactor, sin(frameCount / 30 + PI + i * 50) * map(sin(frameCount * 0.04), -1, 1, -10, 200));

    // Variante 2
    translate(boxInfo.x * scaleFactor, boxInfo.y * scaleFactor, sin(frameCount / 30 + PI + i * 50) * map(sin(frameCount * 0.04), -1, 1, -30, 30));

    // Variante 3
    //translate(boxInfo.x * scaleFactor, boxInfo.y * scaleFactor, sin(frameCount / 30 + PI + i * 50) * 30);

    // without animation
    //translate(boxInfo.x * scaleFactor, boxInfo.y * scaleFactor, 0);

    // rotation round Y axis with easing
    //let angle = frameCount * 2;
    //rotateZ(radians(angle));
    //rotateX(radians(angle));
    //rotateY(radians(angle));

    // draw coloured box
    drawColoredBox(sketchProps.gridSize * scaleFactor, frontColor, backColor, leftColor, rightColor, topColor, bottomColor);
    pop();
  }

  pop();
}

/* - - - F U N C T I O N : R E S E T  G R I D - - - */
function resetGrid() {
  // Code to reset the grid
  console.log('Grid reset');
  reset = true;
}


/* - - - F U N C T I O N : D R A W  S I N G L E  C O L O R E D  B O X - - - */

function drawColoredBox(size, frontColor, backColor, leftColor, rightColor, topColor, bottomColor) {
  const halfSize = size / 2;

  // Front face
  fill(frontColor);
  beginShape();
  vertex(-halfSize, -halfSize, halfSize);
  vertex(halfSize, -halfSize, halfSize);
  vertex(halfSize, halfSize, halfSize);
  vertex(-halfSize, halfSize, halfSize);
  endShape(CLOSE);

  // Back face
  fill(backColor);
  beginShape();
  vertex(-halfSize, -halfSize, -halfSize);
  vertex(halfSize, -halfSize, -halfSize);
  vertex(halfSize, halfSize, -halfSize);
  vertex(-halfSize, halfSize, -halfSize);
  endShape(CLOSE);

  // Left face
  fill(leftColor);
  beginShape();
  vertex(-halfSize, -halfSize, -halfSize);
  vertex(-halfSize, -halfSize, halfSize);
  vertex(-halfSize, halfSize, halfSize);
  vertex(-halfSize, halfSize, -halfSize);
  endShape(CLOSE);

  // Right face
  fill(rightColor);
  beginShape();
  vertex(halfSize, -halfSize, -halfSize);
  vertex(halfSize, -halfSize, halfSize);
  vertex(halfSize, halfSize, halfSize);
  vertex(halfSize, halfSize, -halfSize);
  endShape(CLOSE);

  // Top face
  fill(topColor);
  beginShape();
  vertex(-halfSize, -halfSize, -halfSize);
  vertex(halfSize, -halfSize, -halfSize);
  vertex(halfSize, -halfSize, halfSize);
  vertex(-halfSize, -halfSize, halfSize);
  endShape(CLOSE);

  // Bottom face
  fill(bottomColor);
  beginShape();
  vertex(-halfSize, halfSize, -halfSize);
  vertex(halfSize, halfSize, -halfSize);
  vertex(halfSize, halfSize, halfSize);
  vertex(-halfSize, halfSize, halfSize);
  endShape(CLOSE);
}


// - - - G U I - - - //
function setupDatGui() {

  let gui = new dat.GUI({ autoPlace: false }); // disable auto placement
  gui.domElement.id = 'gui'; // give it an ID
  document.body.appendChild(gui.domElement); // append it to the body
  // document.getElementById('myContainer').appendChild(gui.domElement); // append to a specific div

  // folders
  let f1 = gui.addFolder('Input (Drawing)');
  let f2 = gui.addFolder('Output (ISO)');
  let f3 = gui.addFolder('Export');

  // add controlers to folder 1 (input)
  f1.add(sketchProps, 'showGrid').name('Show drawing?'); // show the input grid?
  f1.add(sketchProps, 'gridSize', 2, 40).name('Box size'); // size of grid cells and ISO boxes
  f1.add(sketchProps, 'inputText').name('Type text'); // type text
  f1.add(window, 'resetGrid').name('Reset drawing'); // reset drawing canvas when clicked
  f1.open(); // open folder

  // add controlers to folder 2 (output)
  // f2.addColor(sketchProps, 'color'); // Color picker for color
  f2.add(sketchProps, 'drawingMode', sketchProps.drawingModes); // Dropdown menu for drawing mode
  f2.open(); // open folder
}