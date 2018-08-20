class Meteor {
  constructor(ctx, width, height) {
    this.ctx = ctx
    //粒子出现的范围
    this.width = width
    this.height = height
    //记录粒子当前的坐标
    this.tx = 0
    this.ty = 0
    //粒子的半径
    this.r = 1.2
    this.PI_2 = Math.PI * 2
    //粒子移动的最小长度（也是刚生成时的移动长度）
    this.minLen = 1
    //粒子移动的最大长度
    this.maxLen = 8
    //记录粒子当前移动的长度
    this.len = 0
    //外部传进来的颜色值
    this.changeColor = 0
    //当前粒子的颜色值
    this.color = 0
    //随机生成粒子坐标
    this.randomXY()
  }

  setColor(color) {
    this.changeColor = color
    if(this.color === 0) {
      this.color = this.changeColor
    }
  }

  randomXY() {
    this.tx = Math.random() * width
    this.ty = Math.random() * height
    this.color = this.changeColor
    this.len = this.minLen
  }

  draw(mx, my) {
    /**
     * 计算粒子到目标位置的长度（根据勾股定理来计算）
     */
    let c = Math.sqrt(Math.pow(this.tx - mx, 2) + Math.pow(this.ty - my, 2))
    let rand = parseInt(Math.random() * 500)
    if (c <= 10 || rand % 499 == 0) {
      //长度小于10则可以认为是到达目标位置，重新生成粒子
      this.randomXY()
    } else {
      //计算出粒子该移动的x长度和y长度（根据相似三角形边的比例一样来计算）
      this.tx -= (this.tx - mx) * this.len / c
      this.ty -= (this.ty - my) * this.len / c
    }
    
    //如果移动长度还没达到最大，则每次加0.05
    if(this.len < this.maxLen) {
      this.len += 0.05
    }

    //绘制粒子
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.tx, this.ty, this.r, 0, this.PI_2, true)
    ctx.closePath()
    ctx.fill()
  }
}

//获取屏幕宽高
let width = window.innerWidth
let height = window.innerHeight

//粒子数量
let count = 150
//存放粒子
let meteors = []
//粒子颜色
let colors = [
  "rgb(80, 214, 39)",
  "rgb(196, 214, 39)",
  "rgb(39, 161, 214)",
  "rgb(214, 91, 39)",
  "rgb(214, 39, 115)"
]
//记录鼠标位置
let mouseX = 0
let mouseY = 0
//获取canvas并设置宽高
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = width
canvas.height = height
//初始化数据
init()
//循环绘制
setInterval(run , 20)

function init() {
  //监听鼠标移动和移出的事件
  document.onmousemove = onDocMouseMove
  document.onmouseout = onDocMouseOut

  //一开始设置鼠标位置为canvas中心位置
  mouseX = width / 2
  mouseY = height / 2

  //初始化粒子
  for(let i = 0; i < count; ++i) {
    meteors[i] = new Meteor(ctx, width, height, meteors)
  }
}

function onDocMouseMove(e) {
  let ev = e ? e : window.event
  mouseX = ev.clientX
  mouseY = ev.clientY
}

function onDocMouseOut(e) {
  mouseX = width / 2
  mouseY = height / 2
}

let f = -1
let color = 0

function run() {
  //绘制背景，并且叠加在目标画布上，不会清除原来的（设置透明度，达到粒子带尾部的效果）
	ctx.globalCompositeOperation = "source-over"
	ctx.fillStyle = "rgba(8, 8, 12, 0.4)"
	ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = "lighter"

  //绘制粒子
  for(let i = 0; i < count; ++i) {
    meteors[i].setColor(colors[color])
    meteors[i].draw(mouseX, mouseY)
  }

  f++
  if(f === 200) {
    f = -1
    color++
    if(color === colors.length) {
      color = 0
    }
  }
}