class Utils {
    static norm(value, min, max) {
        return (value - min) / (max - min);
    }
    static lerp(norm, min, max) {
        return (max - min) * norm + min;
    }
    static map(value, sourceMin, sourceMax, destMin, destMax) {
        return Utils.lerp(Utils.norm(value, sourceMin, sourceMax), destMin, destMax);
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    static distance(p0, p1) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static distanceXY(x0, y0, x1, y1) {
        var dx = x1 - x0,
            dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static circleCollision(c0, c1) {
        return Utils.distance(c0, c1) <= c0.radius + c1.radius;
    }

    static circlePointCollision(x, y, circle) {
        return Utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    }

    static pointInRect(x, y, rect) {
        return Utils.inRange(x, rect.x, rect.x + rect.width) &&
            Utils.inRange(y, rect.y, rect.y + rect.height);
    }

    static inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }

    static rangeIntersect(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    }

    static rectIntersect(r0, r1) {
        return Utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            Utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
    }

    static degreesToRads(degrees) {
        return degrees / 180 * Math.PI;
    }

    static radsToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    static randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    static randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    static randomDist(min, max, iterations) {
        var total = 0;

        for (var i = 0; i < iterations; i += 1) {
            total += Utils.randomRange(min, max);
        }
        return total / iterations;
    }

    static randomColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)]
    }
}

const mouse = {};
const colors = ['#645f5a'];

window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
})

class Particle {
  constructor(x, y) {
    this.canvas = document.querySelector('#canvas');
    this.ctx = canvas.getContext("2d");
    this.color = Utils.randomColor(colors);
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.x2 = Math.random() * this.canvas.width;
    this.y2 = Math.random() * this.canvas.height;
    this.radius = Math.random() * 2.5 + 1;
    this.vx = 0;
    this.vy = 0;
    this.vx2 = 0;
    this.vy2 = 0;
    this.friction = Math.random() * 0.05 + 0.94;
    this.speed = 20;
    this.angle = Math.PI * 2 * Math.random();
    this.rotationSpeed = Math.random() * .001 + .0015;
    this.distancex = Utils.randomDist(this.canvas.width / 12, this.canvas.width / 6 + 120, 2);
    this.distancey = Utils.randomDist(this.canvas.height / 12, this.canvas.height / 1.8 + 200, 6);
    this.x3 = Math.cos(this.angle) * this.distancex + this.canvas.width / 2;
    this.y3 = Math.sin(this.angle) * this.distancey + this.canvas.height / 2;
    this.rotationSpeed = Math.random() * .001 + .0015;
    this.x4 = x;
    this.y4 = y;
    this.ax = (Math.random() - 0.5) * 10;
    this.ay = (Math.random() - 0.5) * 10;
  }
  load() {
    this.vx = (this.x2 - this.x) / this.speed;
    this.vy = (this.y2 - this.y) / this.speed;
    this.x += this.vx;
    this.y += this.vy;
  }
  circle() {
    this.dist = Utils.distanceXY(this.x, this.y, mouse.x, mouse.y);
    this.angle += this.rotationSpeed;
    this.vx = (this.x3 - this.x) / this.speed;
    this.vy = (this.y3 - this.y) / this.speed;
    this.x += this.vx;
    this.y += this.vy;
    this.x3 = Math.cos(this.angle) * this.distancex + this.canvas.width / 2 + this.vx2;
    this.y3 = Math.sin(this.angle) * this.distancey + this.canvas.height / 2 + this.vy2;
    this.vx2 *= this.friction;
    this.vy2 *= this.friction;
    if (this.dist < this.radius * 20) {
      this.vx2 += this.ax * mouse.x;
      this.vy2 += this.ay * mouse.y;
    }
  }
  font() {
    this.vx = (this.x4 - this.x) / this.speed;
    this.vy = (this.y4 - this.y) / this.speed;
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill()
    this.ctx.restore();
  }
}

(() => {

    window.addEventListener('load', function () {
        init();
        render01();
        setTimeout(function () {
            cancelAnimationFrame(frame01);
            title.style.opacity = 0;
            text.style.opacity = 1;
            render02();
        }, 3000);
        setTimeout(function () {
            cancelAnimationFrame(frame02);
            text.style.opacity = 0;
            render03();
        }, 10000);
    })

    window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        init();
    }

    const offscreencanvas = document.createElement('canvas'),
        offscreenctx = offscreencanvas.getContext('2d'),
        canvas = document.querySelector('#canvas'),
        ctx = canvas.getContext('2d'),
        body = document.querySelector('body'),
        title = document.querySelector('h1'),
        text = document.querySelector('p');


    body.classList.add('active');

    let amount = 0, particles = [], frame01 = 0, frame02 = 0;

    function init() {

        // RequestAnimationFrame
        (function () {
            const requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            window.requestAnimationFrame = requestAnimationFrame;
        })();

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        offscreencanvas.width = WIDTH;
        offscreencanvas.height = HEIGHT;

        offscreenctx.font = "bold " + (WIDTH / 8) + "px arial";
        offscreenctx.textAlign = 'center';
        offscreenctx.baseline = 'middle';
        offscreenctx.fillText("Follow me !!", WIDTH / 2, HEIGHT / 2);
        const imgData = offscreenctx.getImageData(0, 0, WIDTH, HEIGHT).data;

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const skip = 150;
        for (let x = 0; x < WIDTH; x += Math.round(WIDTH / skip)) {
            for (let y = 0; y < HEIGHT; y += Math.round(WIDTH / skip)) {
                if (imgData[((x + y * WIDTH) * 4) + 3] > skip) {
                    particles.push(new Particle(x, y));
                }
            }
        }
        amount = particles.length;
    }

    function render01() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < amount; i++) {
            let p = particles[i];
            p.load();
            p.draw();
        }
        frame01 = requestAnimationFrame(render01);
    }
    function render02() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < amount; i++) {
            let p = particles[i];
            p.circle();
            p.draw();
        }
        frame02 = requestAnimationFrame(render02);
    }
    function render03() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < amount; i++) {
            let p = particles[i];
            p.font();
            p.draw();
        }
        requestAnimationFrame(render03);
    }
})();