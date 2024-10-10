const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// get mouse position
let mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: (canvas.height/80) * (canvas.width / 80)
}

window.addEventListener('mousemove', 
    function(event) {
    	let mousePos = getMousePos(event);
        if (mousePos.x - mouse.x + mousePos.y - mouse.y == 0)  {
        }
        mouse.x = mousePos.x
        mouse.y = mousePos.y

        // not make it zero
        if (event.movementX * event.movementY != 0) {
            GdirectionX =  event.movementX / 20;
            GdirectionY = event.movementY / 20;
        } else {
            GdirectionX += (gaussianRandom()-.5) / 10;
            GdirectionY += (gaussianRandom()-.5) / 10;
        }
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
let QTree;
let GdirectionX;
let GdirectionY;

// create particle
class Particle {
    constructor(x, y, directionX, directionY, size, color, maxSize = 5, push = true, decaying=true, colorConnect='rgba(255,255,0,1)') {
        this.x = x;
        this.y = y;
        this.startx = x;
        this.starty = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.colorConnect = colorConnect
        this.time = Date.now();
        this.growing = true;
        this.decaying = decaying
        this.maxSize = maxSize;
        this.push = push;
    }
    draw() {
        if (this.size > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
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
        
        if (distance < mouse.radius + this.size && this.push && false) {
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
            if(distance > mouse.radius) {
                this.size -= 0.005
            } else {
                this.size -= 0.05
            }
                
            this.x += -GdirectionX  * distance/300;
            this.y += -GdirectionY  * distance/300;
        }
        this.draw()
    }
}
// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=.5, stdev=.16) {
    let u = 1 - Math.random(); //Converting [0,1) to (0,1)
    let v = Math.random();
    let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

function init() {
    particlesArray = [];
    mouse.x = 0
    mouse.y = 0
    GdirectionX = (gaussianRandom()-.5) / 10;
    GdirectionY = (gaussianRandom()-.5) / 10;
}

let prevY, prevX;
let t = []
let fps = 60
let targetFPS = 60; 
let lastTime = 0;

function animate(now) {
    const dt = (now - lastTime) / 1000 * targetFPS;
    lastTime = now;
    t.unshift(now);
    if (t.length > 10) {
        var t0 = t.pop();
        fps = Math.floor(1000 * 10 / (now - t0));
    }    

    
    requestAnimationFrame(animate);
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
        let val = item.size > 0.1;
        val = val && item.x >= 0 && item.x <= canvas.width;
        val = val && item.y >= 0 && item.y <= canvas.height;
        return val;
    });
    particlesArray.red
    particlesArrayCursor = particlesArrayCursor.filter(function(item) {
        // Delete if time of creation > 5s
        return item.size > 0.1;
    });
    

    let size = (gaussianRandom() * 20 ) + 1.0;
    let x = mouse.x;
    let y = mouse.y;
    let dx = prevX - mouse.x;
    let dy = prevY - mouse.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let speed = 10 * dt;
    let directionX = (Math.random() * speed) - speed/2;
    let directionY = (Math.random() * speed) - speed/2;
    let color = `hsla(${lastTime}, 50%, 50%, .5)`;

    if (distance > 0) {
        if (particlesArrayCursor.length > (canvas.height * canvas.width) / 18000) {
            particlesArrayCursor.shift();
        }
        particlesArrayCursor.push(new Particle(x, y, directionX/10, directionY/10, 10*gaussianRandom(), '#ccc', 3, true, false))
    }
    x = (Math.random() * ((innerWidth - size / 2) - (size*2)) + size * 2);
    y = (Math.random() * ((innerHeight - size / 2) - (size*2)) + size * 2);
    [prevX, prevY] = [mouse.x, mouse.y]

    if (particlesArray.length < (canvas.height * canvas.width) / 5000) {
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color, 5, true, true, `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},1)`))
    }


    QTree = new QuadTree(new Rectangle(canvas.width/2, canvas.height/2, canvas.width/2, canvas.height/2), 4);
    for (let p of particlesArray) {
        QTree.insert(new Point(p.x, p.y, p));
        p.update();
    }
    for (let p of particlesArrayCursor) {
        QTree.insert(new Point(p.x, p.y, p));
        if (p != particlesArrayCursor[particlesArrayCursor.length-1])
        p.update();
    }
    // for (let i = 0; i < particlesArrayCursor.length; i++) {
    //     particlesArrayCursor[i].update();
    // }
    connect()
}

function connect() {
    if (particlesArrayCursor.length < 1) {
        return;
    }
    // QTree.show(ctx)
    
    let opacityValue = 1;
    let p = particlesArrayCursor[particlesArrayCursor.length-1];
    //for (let p of particlesArrayCursor) {
        let points = [];
        let range = new Rectangle(mouse.x, mouse.y, mouse.radius, mouse.radius);
        // console.log(range)
        // range.draw(ctx)
        //range.draw(ctx)
        points = QTree.query(range);
        // console.log(points.length)
        let i = 0;
        for (let point of points) {
            
            let o = point.userData;
            if (p == o) {
                continue
            }
            let distance = ((p.x - o.x) * (p.x - o.x));
            + ((p.y - o.y) * (p.y - o.y))
            if (o.size > 0) {
                opacityValue = .2
                ctx.strokeStyle=`hsla(0, 0%, ${o.size > 10 ? 80 : 100}%, ${opacityValue})`;
                ctx.lineWidth = o.size/10;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(o.x, o.y);
                ctx.stroke();
            }
        }
    //}

    return;
    for (let p of particlesArray) {
        for (let o of particlesArray) {
            if (p == o) {
                continue
            }
            let distance = ((p.x - o.x) * (p.x - o.x))
            + ((p.y - o.y) * (p.y - o.y))
        
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = .05;
                ctx.strokeStyle=`rgba(210,185,151,${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(o.x, o.y);
                ctx.stroke();
            }
        }
    }
    return
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
        //mouse.x = 0;
        //mouse.y = 0;
        GdirectionX /= 3;
        GdirectionY /= 3;
    }
)

// make mouseScroll event only when alt is pressed
window.addEventListener('wheel',
    function(event) {
        if (event.shiftKey) {
            if (event.deltaY > 0) {
                // scroll down
                mouse.radius *= .9
            } else {
                mouse.radius *= 1.1
            }
        }
    }
);

init()
animate();