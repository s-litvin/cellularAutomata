var population = [];
var nextPop = [];
var fieldX = 600;
var fieldY = 400;
var liveCells = 0;
var resolution = 5;
var targetFrameRate = 80;


function setup() {
    createCanvas(600, 450);
    noStroke();

    population = createPop();
    nextPop = createPop();

    randomizePopulation();

    translate(0, 400);
    button = createButton('RST');
    button.position(9, 425);
    button.mousePressed(randomizePopulation);

    button = createButton('CLS');
    button.position(58, 425);
    button.mousePressed(function() { population = createPop(); nextPop = createPop();});

    button = createButton('Glider');
    button.position(410, 425);
    button.mousePressed(setGlider);

    //
    slider4 = createSlider(0, 50, 47);
    slider4.position(280, 420);
    slider4.style('width', '100px');

    slider1 = createSlider(0, 100);
    slider1.position(480, 413);
    slider1.style('width', '49px');
    slider1.style('rotate', -90);

    slider2 = createSlider(0, 100);
    slider2.position(505, 413);
    slider2.style('width', '49px');
    slider2.style('rotate', -90);

    slider3 = createSlider(0, 100);
    slider3.position(530, 413);
    slider3.style('width', '49px');
    slider3.style('rotate', -90);

}

function draw() {

    targetFrameRate = map(slider4.value(), 0, 100, 0.25, 120);
    frameRate(targetFrameRate);

    background(slider1.value(), slider2.value(), slider3.value());

    renderPopulation();

    renderBar();
}

function renderBar() {
    fill(170, 170, 150);
    push();
    translate(0, 400);
    rect(0, 0, 600, 50);
    fill(0);
    text('Live cells: ' + String(liveCells) , 10, 20);
    text('Frame rate: ' + targetFrameRate.toFixed(0) , 280, 20);
    pop();
}

function randomizePopulation() {
    for (var i = 0; i < fieldY / resolution; i++) {
        for (var j = 0; j < fieldX / resolution; j++) {
            population[i][j] = floor(random(2));
        }
    }
}

function setGlider() {
    
    var i = floor(2 + random(fieldY/resolution - 10));
    var j = floor(2 + random(fieldX/resolution - 10));

    population[i - 1][j - 1] = 0;
    population[i - 1][j] = 1;
    population[i - 1][j - 1] = 0;
    population[i][j - 1] = 0;
    population[i][j] = 0;
    population[i][j + 1] = 1;
    population[i + 1][j - 1] = 1;
    population[i + 1][j] = 1;
    population[i + 1][j + 1] = 1;
}

function renderPopulation() {
    var cntLive = 0;
    for (var i = 0; i < fieldY / resolution; i++) {
        for (var j = 0; j < fieldX / resolution; j++) {
            var cell = population[i][j];

            if (cell == 1) {
                fill(151, 226, 138);
                ellipse(j * resolution, i * resolution, resolution, resolution);
            }

            var neighbors = countNeighbors(population, j, i);

            if (mouseIsPressed) {
                if ((mouseX > j * resolution) && mouseX < (j * resolution + resolution)
                    && mouseY > (i * resolution) && mouseY < (i * resolution + resolution)) {

                    randomLife(population, j, i);

                }
            }

            if (cell == 0 && neighbors == 3) {
                nextPop[i][j] = 1;
            } else if (cell == 1 && (neighbors < 2 || neighbors > 3)) {
                nextPop[i][j] = 0;
            } else {
                nextPop[i][j] = cell;
            }

            cntLive += nextPop[i][j];

        }
    }

    liveCells = cntLive;
    population = nextPop;
    nextPop = createPop();
}

function countNeighbors(population, x, y) {
    sum = 0;

    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {

            var col = (fieldX/resolution + x + j) % (fieldX/resolution);
            var row = (fieldY/resolution + y + i) % (fieldY/resolution);

            sum += population[row][col];
        }
    }
    
    return sum - population[y][x];
}

function createPop() {
    var tmp = [];
    for (var i = 0; i < fieldY / resolution; i++) {
        tmp[i] = [];
        for (var j = 0; j < (fieldX / resolution); j++) {
            tmp[i][j] = 0;
        }
    }

    return tmp;
}

function randomLife(population, x, y) {
    for (i = -1; i < 2; i++) {
        for (j = -1; j < 2; j++) {

            var col = (fieldX/resolution + x + j) % (fieldX/resolution);
            var row = (fieldY/resolution + y + i) % (fieldY/resolution);

            population[row][col] = floor(random(2));
        }
    }
}