var population = [];
var nextPop = [];
var frame = 0;
var fieldX = 600;
var fieldY = 400;
var liveCells = 0;
var slider;
var randomRate = 0;
var randomLifeCnt = 0;
var resolution = 5;


function setup() {
    createCanvas(600, 450);
    population = createPop();
    nextPop = createPop();

    randomizePopulation();

    translate(0, 400);
    button = createButton('BOOM!');
    button.position(19, 425);
    button.mousePressed(randomizePopulation);

    slider = createSlider(0, 100, randomRate);
    slider.position(120, 420);
    slider.style('width', '120px');

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

    frame++;
    if (frame < 50 - slider4.value()) {
        return true;
    }
    frame = 0;

    background(slider1.value(), slider2.value(), slider3.value());

    randomRate = slider.value();

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
    text('Random life seeds: ' + String(randomLifeCnt) , 120, 20);
    text('Frame rate: ' , 280, 20);
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
    for (var i = 0; i < fieldY / resolution; i++) {
        for (var j = 0; j < fieldX / resolution; j++) {
            population[i][j] = 0;
        }
    }   

    population[2][6] = 1;
    population[3][7] = 1;
    population[3][8] = 1;
    population[2][8] = 1;
    population[1][8] = 1;
}

function renderPopulation() {
    var cntLive = 0;
    for (var i = 0; i < fieldY / resolution; i++) {
        for (var j = 0; j < fieldX / resolution; j++) {
            var cell = population[i][j];

            if (cell == 1) {
                fill(151, 226, 138);
                rect(j * resolution, i * resolution, resolution, resolution);
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
            } else if (cell == 0 && neighbors == 0 && floor(random(map(randomRate, 0, 100, 0, 1000))) == 1) {
                randomLifeCnt++;
                randomLife(population, j, i);
                nextPop[i][j] = cell;
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
        tmp[i] = new Array(fieldX / resolution);
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