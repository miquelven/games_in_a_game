<template>
  <div class="max-2xl:scale-75">
    <canvas height="540" width="360" ref="canvas" id="canvas"> </canvas>
  </div>
</template>

<script>
import birdImage from "@/assets/images/FlappyGame/bird.webp";
import pipeImg from "@/assets/images/FlappyGame/pipe.webp";
import collision from "@/mixins/collision";
import sound from "@/assets/songs/flappyBirdSound.wav";

export default {
  mixins: [collision],
  data() {
    return {
      canvas: null,
      canvasWidth: 360,
      canvasHeight: 640,
      ctx: null,

      birdWidth: 34,
      birdHeight: 24,
      birdX: 0,
      birdY: 0,
      birdImg: new Image(),

      bird: {},

      pipeArray: [],
      pipeX: 0,
      pipeY: 0,
      pipeWidth: 64,
      pipeHeight: 512,
      topPipeImg: new Image(),
      bottomPipeImg: new Image(),

      velocityX: -2,
      velocityY: 0,
      gravity: 0.025,

      gameOver: false,

      score: 0,

      interval: null,

      allowPlaysoundExecution: true,
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.canvas.height = this.canvas.offsetHeight;
    this.canvas.width = this.canvasWidth;
    this.ctx = this.canvas.getContext("2d");

    this.birdX = this.canvasWidth / 8;
    this.birdY = this.canvasHeight / 2;
    this.bird = {
      x: this.birdX,
      y: this.birdY,
      width: this.birdWidth,
      height: this.birdHeight,
    };

    this.pipeX = this.canvasWidth;

    this.birdImg.onload = this.draw;
    this.birdImg.src = birdImage;

    this.topPipeImg.src = pipeImg;
    this.topPipeImg.onload = this.draw;
    this.bottomPipeImg.src = pipeImg;

    requestAnimationFrame(this.update);
    this.interval = setInterval(this.placePipes, 1500);
  },
  methods: {
    playSound() {
      if (!this.allowPlaysoundExecution) return;
      let audio = new Audio(sound);
      audio.play();
    },
    draw() {
      // bird
      this.velocityY += this.gravity;
      this.bird.y = Math.max(this.bird.y, this.velocityY, 0);
      this.ctx.drawImage(
        this.birdImg,
        this.bird.x,
        this.bird.y,
        this.bird.width,
        this.bird.height
      );

      // pipes
      for (let i = 0; i < this.pipeArray.length; i++) {
        let pipe = this.pipeArray[i];
        pipe.x += this.velocityX;
        this.ctx.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && this.bird.x > pipe.x + pipe.width) {
          this.score += 0.5;
          pipe.passed = true;
          if (this.score == 20) {
            this.$emit("addScore", 10000);
            this.$emit("addCounter");
          }
        }

        if (this.detectCollision(this.bird, pipe)) {
          this.gameOver = true;
          this.$emit("addScore", 4000);
          this.$emit("addCounter");
        }
      }

      // clear pipes
      while (this.pipeArray.length > 0 && this.pipeArray[0].x < -this.pipeWidth)
        this.pipeArray.shift();

      // score
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "45px sans-serif";
      this.ctx.fillText(this.score, this.canvasWidth - 60, 65);
    },
    placePipes() {
      this.gravity = 0.4;
      let randomPipeY =
        this.pipeY -
        this.pipeHeight / 4 -
        Math.random() * (this.pipeHeight / 2);

      let openingSpace = this.canvas.height / 4;

      let topPipe = {
        img: this.topPipeImg,
        x: this.pipeX,
        y: randomPipeY,
        width: this.pipeWidth,
        height: this.pipeHeight,
        passed: false,
      };

      this.pipeArray.push(topPipe);

      let bottomPipe = {
        img: this.bottomPipeImg,
        x: this.pipeX,
        y: randomPipeY + this.pipeHeight + openingSpace,
        width: this.pipeWidth,
        height: this.pipeHeight,
        passed: false,
      };

      this.pipeArray.push(bottomPipe);
    },
    moveBird(e) {
      if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        this.velocityY = -6;
        this.playSound();
      }
    },
    update() {
      if (this.gameOver) return;
      requestAnimationFrame(this.update);
      this.bird.y += this.velocityY;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.draw();

      // detect collision bird with ground
      if (this.bird.y > this.canvas.height) {
        this.gameOver = true;
        this.$emit("addScore", 4000);
        this.$emit("addCounter");
      }

      document.addEventListener("keydown", this.moveBird);
    },
  },
  unmounted() {
    this.allowPlaysoundExecution = false;
    clearInterval(this.interval);
  },
};
</script>
