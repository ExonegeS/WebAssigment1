const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// get mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/80) * (canvas.width / 80)
}

window.addEventListener('mousemove', 
    function(event) {
    	let mousePos = getMousePos(event);
        if (mousePos.x - mouse.x + mousePos.y - mouse.y == 0)  {
        }
        mouse.x = mousePos.x
        mouse.y = mousePos.y
    }
)
function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
let particlesArray = [];
let particlesArrayCursor = [];


// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color, maxSize = 5, push = true, decaying=true) {
        this.x = x;
        this.y = y;
        this.startx = x;
        this.starty = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.time = Date.now();
        this.growing = true;
        this.decaying = decaying
        this.maxSize = maxSize;
        this.push = push;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width-this.size || this.x < this.size) {
            this.directionX *= -1
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY *= -1
        }

        // check colision
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size && this.push && this.decaying) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 0
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 0
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 0
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 0
            }
        } else {
            if (this.growing) {
                this.size += 0.01
                if (this.size > this.maxSize) {
                    this.growing = false
                }
            } else {
                this.size -= 0.05
                this.x += this.directionX;
                this.y += this.directionY;
            }
        }
        this.draw()
    }
}

function init() {
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    particlesArray = [];
    for (let i = 0; i < numberOfParticles ; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size / 2) - (size*2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size / 2) - (size*2)) + size * 2);
        let speed = 2;
        let directionX = (Math.random() * speed) - speed/2;
        let directionY = (Math.random() * speed) - speed/2;
        let color = '#0FF';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }
}
let prevX, prevY
function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    var time = Date.now();
    // map each value size if time < 5s
    particlesArray = particlesArray.map(function(item){
        if (time - item.time > 1000 * 15) {
            item.decaying = false
        }
        return item
    })
    particlesArray = particlesArray.filter(function(item) {
        // Delete if time of creation > 5s
        return item.size > 0.1;
    });
    particlesArray.red
    particlesArrayCursor = particlesArrayCursor.filter(function(item) {
        // Delete if time of creation > 5s
        return item.size > 0.1;
    });
    

    let size = (Math.random() * 5) + .1;
    let x = mouse.x;
    let y = mouse.y;
    let dx = prevX - mouse.x;
    let dy = prevY - mouse.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let speed = 2;
    let directionX = (Math.random() * speed) - speed/2;
    let directionY = (Math.random() * speed) - speed/2;
    let color = '#8C5523';


    if (distance > 0) {
        if (particlesArrayCursor.length > (canvas.height * canvas.width) / 18000) {
            particlesArrayCursor.shift();
        }
        particlesArrayCursor.push(new Particle(x, y, directionX, directionY, size, '#ccc', 3, false, false))
    }
    x = (Math.random() * ((innerWidth - size / 2) - (size*2)) + size * 2);
    y = (Math.random() * ((innerHeight - size / 2) - (size*2)) + size * 2);


    if (particlesArray.length < (canvas.height * canvas.width) / 18000) {
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color))
    }


    [prevX, prevY] = [mouse.x, mouse.y]
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    for (let i = 0; i < particlesArrayCursor.length; i++) {
        particlesArrayCursor[i].update();
    }
    connect()
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y))
        
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance / 5000)
                ctx.strokeStyle=`rgba(250,85,151,${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize',
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = (canvas.height/80) * (canvas.width / 80)
    }
)

window.addEventListener('mouseout', 
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
)

animate();