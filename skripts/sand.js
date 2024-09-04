const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width / 80)
}

class SandParticle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

window.addEventListener('mousemove', 
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
        if (isDrawing) {
            let col = Math.floor(mouse.x / w)
            let row = Math.floor(mouse.y / w)
            if (col >= 0 && col < cols-1 && row >= 0 && row < rows-1)
            grid[col][row] = .5
        }
    }
)

window.addEventListener('mousedown', 
    function() {
        isDrawing = true
    }
)
window.addEventListener('mouseup', 
    function() {
        isDrawing = false
    }
)

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = (canvas.height/80) * (canvas.width / 80)
        init()
    }
)

window.addEventListener('mouseout', 
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)
// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=.5, stdev=.16) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

let grid, nextGrid;
let w = 10;
let cols, rows;
let isDrawing = false

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function init() {
    cols = Math.floor(400 / w);
    rows = Math.floor(400 / w);
    grid = make2DArray(cols, rows);
    nextGrid = make2DArray(cols, rows);

    grid[20][10] = .7;
    grid[20][9] = .6;
    grid[20][8] = .9;
    grid[20][7] = 1;
    grid[20][6] = 1;
    grid[20][5] = 1;
    
    ctx.strokeStyle = '#fff';
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            ctx.rect(i*w, j*w, w, w);
        }
    }
}

function draw() {
    // clear the canvas
    ctx.fillStyle = "#555"
    ctx.fillRect(0, 0, 400, 400);

    let changed = false;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let state = grid[i][j];
            ctx.fillStyle = `rgb(${255*state},${255*state},${255*state})`;
            ctx.fillRect(i*w+1, j*w+1, w-2, w-2);
            if (state != 0) {
                let below = grid[i][j+1];
                let belowR = grid[i+1][j+1];
                let belowL= grid[i-1][j+1];
                if (j == rows-1) {

                } else if (below == 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i][j+1] = state;
                    changed = true;
                } else if (belowR == 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i+1][j+1] = state;
                    changed = true;
                } else if (belowL == 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i-1][j+1] = state;
                    changed = true;
                } 
                else {
                    nextGrid[i][j] = state;
                }
            }
        }
    }

    // only update the grid if something changed
    if (changed) {
        grid = nextGrid.map(arr => arr.slice()); // copy the nextGrid to grid
    }
}


init()

// setinterval
setInterval(draw, 1000/6)