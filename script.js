const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
ctx.scale(2, 2);

const colors = [
  {r: 45, g: 74, b: 255}, // seablue
  {r: 258, g: 255, b: 89}, // yellow
  {r: 255, g: 104, b: 248}, // purple
  {r: 44, g: 209, b: 252}, // skyblue
  {r: 54, g: 233, b: 84} // green
];

class GlowParticle {
  constructor(x, y, radius, rgb) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rgb = rgb;

    this.vx = Math.random() * 6;
    this.vy = Math.random() * 6;

    this.sinValue = Math.random();
  }

  animate(ctx, stageWidth, stageHeight){
    this.sinValue += 0.01;
    this.radius += Math.sin(this.sinValue);
    this.x += this.vx * 0.5;
    this.y += this.vy * 0.5;

    if (this.x < 0) {
      this.vx *= -1;
      this.x += 10;
    } else if (this.x > stageWidth) {
      this.vx *= -1;
      this.x -= 10;
    }

    if (this.y < 0) {
      this.vy *= -1;
      this.y += 10;
    } else if (this.y > stageHeight) {
      this.vy *= -1;
      this.y -= 10;
    }
    
    ctx.beginPath();
    
    const g = ctx.createRadialGradient(
      this.x,
      this.y,
      this.radius * 0.01,
      this.x,
      this.y,
      this.radius
    );
    g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
    g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);
    
    ctx.fillStyle = g
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();    
  }
}

class init {
  constructor() {
    this.pixelRatio = (window.devicePixelRatio > 1) ? 2 : 1;
    
    this.animate = this.animate.bind(this);

    this.totalParticles = 28;
    this.particles = [];
    this.minRadius = Math.floor((canvas.width + canvas.height) * 0.03);
    this.maxRadius = Math.floor((canvas.width + canvas.height) * 0.09);

    this.resize();
    this.animate();
  }

  resize() {
    this.stageWidth = canvas.width = window.innerWidth * this.pixelRatio;
    this.stageHeight = canvas.height = window.innerHeight * this.pixelRatio;
    ctx.scale(this.pixelRatio, this.pixelRatio);
    this.createParticles();
    ctx.globalCompositeOperation = 'saturation';
  }

  createParticles() {
    let curColor = 0;
    this.particles = [];
  
    for (let i = 0; i < this.totalParticles; i++) {
      const color = colors[curColor];
      const radius = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius;
      
      const item = new GlowParticle(
        Math.random() * this.stageWidth,
        Math.random() * this.stageHeight,
        Math.abs(radius),
        color
      );

      curColor = (curColor + 1) % colors.length;

      this.particles[i] = item;
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    ctx.imageSmoothingEnabled = true;

    for (let i = 0; i < this.totalParticles; i++) {
      const item = this.particles[i];
      item.animate(ctx, this.stageWidth, this.stageHeight);
    } 
  }
}

const animation = new init();

window.addEventListener('resize',
  function () {
    animation.resize();
  })
