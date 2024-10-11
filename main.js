let particles = [];
let microparticles = [];

const c1 = createCanvas({
  width: $(window).width(),
  height: $(window).height(),
});

const tela = c1.canvas;
const canvas = c1.context;

$("body").append(c1.canvas);

class Particle1 {
  constructor(canvas) {
    this.progress = 0;
    this.canvas = canvas;
    this.life = 1000 + Math.random() * 3000;

    // Xuất phát từ vị trí ngẫu nhiên
    this.x = Math.random() * $(window).width();
    this.y = $(window).height();
    this.s = 2 + Math.random() * 2;
    this.radius = 4 + Math.random() * 4;
    this.color = "#ff0000"; // Màu đỏ khi bay lên

    // Thời gian nổ ngẫu nhiên
    this.explodeAt = Math.random() * 100 + 100; // Nổ ở vị trí khác nhau

    // Chọn loại quỹ đạo ngẫu nhiên
    this.pathType = Math.floor(Math.random() * 3); // 0: thẳng, 1: lượn, 2: xiên

    this.ID = setInterval(
      function() {
        if (this.progress > this.explodeAt) {
          for (let i = 0; i < 150; i++) { // Tạo 150 hạt nhỏ khi nổ
            microparticles.push(
              new microParticle(c1.context, {
                x: this.x,
                y: this.y,
                explosionDirection: Math.random() * 2 * Math.PI,
                speed: Math.random() * 4 + 2, // Tốc độ hạt nhỏ
                color: "#ffff00" // Màu vàng khi nổ
              })
            );
          }

          clearInterval(this.ID);
        }
      }.bind(this),
      this.random * 50
    );

    setTimeout(
      function() {
        clearInterval(this.ID);
      }.bind(this),
      this.life
    );
  }

  render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move() {
    switch (this.pathType) {
      case 0: // Thẳng
        this.y -= this.s;
        break;
      case 1: // Lượn
        this.x += Math.sin(this.progress / 20) * 2; // Lượn qua lượn lại
        this.y -= this.s;
        break;
      case 2: // Xiên
        this.x += Math.cos(this.progress / 20) * 1; // Bay xiên
        this.y -= this.s;
        break;
    }

    // Khi đến độ cao nhất định, bắt đầu nổ
    if (this.progress > this.explodeAt) {
      this.render();
      return false; // Dừng lại sau khi nổ
    }

    this.render();
    this.progress++;
    return true;
  }
}

class microParticle {
  constructor(canvas, options) {
    this.canvas = canvas;
    this.x = options.x;
    this.y = options.y;
    this.angle = options.explosionDirection;
    this.speed = options.speed;
    this.radius = 2 + Math.random() * 2; // Kích thước nhỏ hơn
    this.color = options.color; // Màu từ tham số
    this.hasExplodedAgain = false; // Kiểm tra xem đã nổ lần thứ hai chưa
    this.progress = 0; // Thời gian cho lần nổ thứ hai
    this.explodeAgainAt = Math.random() * 30 + 20; // Thời gian nổ lại ngẫu nhiên
  }

  render() {
    this.canvas.beginPath();
    this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.canvas.fillStyle = this.color;
    this.canvas.fill();
    this.canvas.closePath();
  }

  move() {
    this.x += Math.cos(this.angle) * this.speed; // Di chuyển theo hướng góc
    this.y += Math.sin(this.angle) * this.speed; // Di chuyển theo hướng góc

    // Giảm kích thước để tạo hiệu ứng mờ dần
    this.radius *= 0.99;

    // Kiểm tra nổ lần thứ hai
    if (!this.hasExplodedAgain && this.progress > this.explodeAgainAt) {
      for (let i = 0; i < 20; i++) { // Tạo 20 hạt mới khi nổ lại
        microparticles.push(
          new microParticle(this.canvas, {
            x: this.x,
            y: this.y,
            explosionDirection: Math.random() * 2 * Math.PI,
            speed: Math.random() * 3 + 1,
            color: "#ffff00" // Màu vàng khi nổ
          })
        );
      }
      this.hasExplodedAgain = true; // Đánh dấu là đã nổ lại
    }

    this.progress++;
    
    if (this.radius < 0.1) {
      return false; // Loại bỏ nếu quá nhỏ
    }

    this.render();
    return true;
  }
}

setInterval(
  function() {
    // Tạo 2-3 hạt pháo hoa mỗi lần
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle1(canvas));
    }
  },
  2000 * Math.random() // Khoảng thời gian ngẫu nhiên để tạo pháo hoa
);

function clear() {
  let grd = canvas.createRadialGradient(
    tela.width / 2,
    tela.height / 2,
    0,
    tela.width / 2,
    tela.height / 2,
    tela.width
  );
  grd.addColorStop(0, "rgba(20,20,20,1)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  canvas.globalAlpha = 0.16;
  canvas.fillStyle = grd;
  canvas.fillRect(0, 0, tela.width, tela.height);
}

function update() {
  clear();
  particles = particles.filter(function(p) {
    return p.move();
  });
  microparticles = microparticles.filter(function(mp) {
    return mp.move();
  });
  requestAnimationFrame(update.bind(this));
}

function createCanvas(properties) {
  let canvas = document.createElement("canvas");
  canvas.width = properties.width;
  canvas.height = properties.height;
  let context = canvas.getContext("2d");
  return {
    canvas: canvas,
    context: context,
  };
}

update();
