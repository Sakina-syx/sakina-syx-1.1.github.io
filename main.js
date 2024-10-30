// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight - 60; // 减去按钮高度

// 生成随机数的函数

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数

function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

// 定义 Ball 构造器

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// 定义彩球绘制函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 碰撞检测
      if (distance < this.size + balls[j].size) {
        // 改变颜色
        this.color = randomColor();
        balls[j].color = randomColor();

        // 交换速度
        const tempVelX = this.velX;
        const tempVelY = this.velY;
        this.velX = balls[j].velX;
        this.velY = balls[j].velY;
        balls[j].velX = tempVelX;
        balls[j].velY = tempVelY;

        // 简单处理碰撞后的反弹方向
        this.velX = -this.velX;
        this.velY = -this.velY;
      }
    }
  }
};

// 定义 DemonCircle 构造器

function DemonCircle(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
}

// 绘制恶魔圈的函数（空心圆圈）

DemonCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = 5;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// 检测恶魔圈与小球的碰撞
DemonCircle.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    const dx = this.x - balls[j].x;
    const dy = this.y - balls[j].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + balls[j].size) {
      // 从数组中移除被吃掉的小球
      balls.splice(j, 1);
      j--; // 调整索引
    }
  }
};

// 定义一个数组，生成并保存所有的球
let balls = [];

// 生成小球的函数
function generateBalls(num) {
  for (let i = 0; i < num; i++) {
    const size = random(10, 20);
    let ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomColor(),
      size
    );
    balls.push(ball);
  }
}

// 初始生成小球
generateBalls(45);

// 创建恶魔圈，初始位置为固定的 
const demonCircle = new DemonCircle(300, 300, 20);

// 处理键盘事件以更新恶魔圈的位置
document.addEventListener('keydown', (event) => {
  const step = 15; // 移动步长
  switch (event.key) {
    case 'ArrowUp':
      demonCircle.y -= step;
      break;
    case 'ArrowDown':
      demonCircle.y += step;
      break;
    case 'ArrowLeft':
      demonCircle.x -= step;
      break;
    case 'ArrowRight':
      demonCircle.x += step;
      break;
  }
});


// 创建调整恶魔圈大小的按钮
const increaseButton = document.createElement('button');
increaseButton.textContent = '增大恶魔圈';
increaseButton.style.position = 'absolute';
increaseButton.style.bottom = '10px'; // 按钮距离底部10像素
increaseButton.style.left = '50px';  // 按钮距离左侧50像素
increaseButton.style.zIndex = '1000';  // 确保按钮在最上层
increaseButton.style.padding = '10px';
increaseButton.style.fontSize = '16px';
document.body.appendChild(increaseButton);

increaseButton.addEventListener('click', () => {
  demonCircle.size += 5; // 增加恶魔圈的大小
});

// 创建调整恶魔圈大小的按钮
const decreaseButton = document.createElement('button');
decreaseButton.textContent = '减小恶魔圈';
decreaseButton.style.position = 'absolute';
decreaseButton.style.bottom = '10px'; // 按钮距离底部10像素
decreaseButton.style.left = '200px';  // 按钮距离左侧100像素
decreaseButton.style.zIndex = '1000';  // 确保按钮在最上层
decreaseButton.style.padding = '10px';
decreaseButton.style.fontSize = '16px';
document.body.appendChild(decreaseButton);

decreaseButton.addEventListener('click', () => {
  if (demonCircle.size > 5) { // 确保恶魔圈不会减小到负值
    demonCircle.size -= 5; // 减小恶魔圈的大小
  }
});


function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'; // 使用半透明黑色填充背景
  ctx.fillRect(0, 0, width, height); // 重绘背景以清除之前的帧

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  // 绘制恶魔圈
  demonCircle.draw();
  // 检测恶魔圈与小球的碰撞，并移除被吃掉的小球
  demonCircle.collisionDetect(balls);

  // 绘制计分器
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.fillText(`Ball Count: ${balls.length}`, 10, 30); // 显示小球数量

  requestAnimationFrame(loop); // 请求下一帧动画
}

loop(); // 开始动画循环



