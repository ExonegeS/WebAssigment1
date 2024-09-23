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

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

document.addEventListener('contextmenu', event => {
    event.preventDefault();
});

window.addEventListener('mousemove', 
    function(event) {
    	let mousePos = getMousePos(event);
        if (mousePos.x - mouse.x + mousePos.y - mouse.y == 0)  {
        }
        mouse.x = mousePos.x
        mouse.y = mousePos.y
        if (isDrawing) {
            let col = Math.floor(mouse.x / w)
            let row = Math.floor(mouse.y / w)
            if (col >= 0 && col < cols-1 && row >= 0 && row < rows-1) {
                let color = gaussianRandom(.7, .16);
                if (event.buttons != 1) {
                    color = 0;
                    resetLowerLayer();
                } 
                grid[col][row] = color;
            }
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
let w = 20;
let cols, rows;
let isDrawing = false
let resetTimer = 0;

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
    w = Math.sqrt(canvas.width * canvas.height) / 100;
    cols = Math.floor(canvas.width / w);
    rows = Math.floor(canvas.height / w / 1.1);
    grid = make2DArray(cols, rows);
    nextGrid = make2DArray(cols, rows);

    for (let i = 0; i < cols*10; i++) {
        var [x, y] = [Math.floor(Math.random()*rows), Math.floor(gaussianRandom(.5, .1)*cols)];
        console.log(cols, rows, x, y, )
        grid[y][x] = gaussianRandom();
    }
    
    ctx.strokeStyle = '#fff';
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            ctx.rect(i*w, j*w, w, w);
        }
    }
}

function draw() {
    // clear the canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let borderSize = 0;
    let changed = false;
    for (let i = 0; i < cols; i++) {
        for (let j = rows-1; j > 0; j--) {
            let state = grid[i][j];
            ctx.fillStyle = `rgb(${255*state},${255*state},${255*state})`;
            ctx.fillRect(i*w+borderSize, j*w+borderSize, w-borderSize*2, w-borderSize*2);
            if (state != 0) {
                let below = grid[i][j+1];
                let dir = Math.random() > 0.5 ? -1 : 1;
                let belowA, belowB
                let slide = 3;
                if (i + dir < cols && i + dir >= 0) {
                    belowA = grid[i+dir][j+slide];
                }
                if (i - dir < cols && i - dir >= 0) {
                    belowB= grid[i-dir][j+slide];
                }
                if (j == rows-1) {
                    nextGrid[i][j] = 0;
                    nextGrid[i][j+1] = 0;
                } else if (below == 0) {
                    nextGrid[i][j] = 0;
                    nextGrid[i][j+1] = state;
                    grid[i][j] = 0;
                    grid[i][j+1] = state;
                } else if (belowA === 0) {
                    grid[i][j] = 0;
                    grid[i+dir][j+slide] = state;
                } else if (belowB === 0) {
                    grid[i][j] = 0;
                    grid[i-dir][j+slide] = state;
                } 
            }
        }
    }

    // only update the grid if something changed
    if (changed) {
        grid = nextGrid.map(arr => arr.slice()); // copy the nextGrid to grid
    }

    resetTimer++;
    if (resetTimer >= 10) { // 300 = 5 seconds * 60 fps
        resetTimer = 0;
    }
}

function resetLowerLayer() {
    for (let i = 0; i < cols; i++) {
        for (let j = rows - 1; j < rows; j++) { // reset the lower 10 rows
            if (Math.random() > .9) {
                grid[i][j] = 0;
            }
        }
    }
}

init()

// setinterval
setInterval(draw, 1000/600)