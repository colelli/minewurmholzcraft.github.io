// === Fireworks Canvas Setup ===
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
});

const fireworks = [];
const particles = [];
const maxParticles = 100;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
    this.distanceTraveled = 0;
    this.speed = 2;
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.coordinates = Array(3).fill([sx, sy]);
    this.brightness = random(50, 70);
  }

  update(i) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled += Math.hypot(vx, vy);
    if (this.distanceTraveled >= this.distanceToTarget) {
      for (let j = 0; j < maxParticles; j++) {
        particles.push(new Particle(this.tx, this.ty));
      }
      fireworks.splice(i, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[2][0], this.coordinates[2][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = Array(5).fill([x, y]);
    this.angle = random(0, 2 * Math.PI);
    this.speed = random(1, 5);
    this.friction = 0.95;
    this.gravity = 0.7;
    this.brightness = random(50, 80);
    this.decay = random(0.015, 0.03);
  }

  update(i) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.brightness -= this.decay * 20;
    if (this.brightness <= 0) {
      particles.splice(i, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[4][0], this.coordinates[4][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
    ctx.stroke();
  }
}

function fireWorkAt(x, y) {
  const sx = W / 2;
  const sy = H;
  fireworks.push(new Firework(sx, sy, x, y));
}

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }
}
loop();

// === Login Handler ===
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const loginBox = document.getElementById('loginBox');

  if (!username) {
    alert("Bitte geben Sie einen Benutzernamen ein.");
    return;
  }

  loginBox.innerHTML = `
    <div class="text-7xl text-shadow-lg text-stone-300">
      Willkommen <span class="text-amber-400">${username}</span> bei Minewurmholzcraft!
    </div>
  `;

  const fireNow = () => {
    fireWorkAt(random(W * 0.3, W * 0.7), random(H * 0.2, H * 0.6));
  };

  fireNow();
  for (let i = 1; i <= 4; i++) setTimeout(fireNow, i * 300);
}
