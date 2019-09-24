(function () {
  var TEXT_SIZE = 30
  // var TEXT_COLOR = "rgba(255,255,255,0)"
  var TEXT_COLOR = "rgba(255,255,255,1)"
  var MOUSEX = 0;
  var MOUSEY = 0;
  var SELECTOR = document.querySelector(".name");
  var WINDOW_HEIGHT = window.innerHeight;
  var WINDOW_WIDTH = window.innerWidth;

  var canvas = document.createElement('canvas');
  var CANVAS_HEIGHT = canvas.height = Math.floor(WINDOW_HEIGHT)
  var CANVAS_WIDTH = canvas.width = Math.floor(WINDOW_WIDTH);

  // canvas.style.backgroundColor = "transparent";
  canvas.style.backgroundColor = "blue";
  var ctx = canvas.getContext('2d');

  var LEFT_EYE = new Eye(ctx,
    CANVAS_WIDTH / 2 - (TEXT_SIZE * 3) + 17,
    CANVAS_HEIGHT / 2 - (TEXT_SIZE * 4),
    10);
  var RIGHT_EYE = new Eye(ctx,
    CANVAS_WIDTH / 2 - (TEXT_SIZE * 1) + 5,
    CANVAS_HEIGHT / 2 - (TEXT_SIZE * 4),
    20, 
    "#eee");

  var imageWhiteIndexes = [];
  var whiteSpaces = [];
  var Eyes = [];

  Eyes.push(LEFT_EYE);
  Eyes.push(RIGHT_EYE);
  var imageHeight, imageWidth;

  function initCanvas() {
    var TEXT = "ALL EYES ON ME"
    ctx.font = "800 " + TEXT_SIZE * 6 + "px Segoe UI";
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "center";
    ctx.fillText(TEXT, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    var ImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    var imgDataArray = ImageData.data;
    imageHeight = ImageData.height;
    imageWidth = ImageData.width;

    for (var i = 0; i < imgDataArray.length; i += 4) {
      var r = imgDataArray[i];
      var g = imgDataArray[i + 1];
      var b = imgDataArray[i + 2];
      var a = imgDataArray[i + 3];

      if (r === 255 && g === 255 && b === 255 && a === 255) {

        // console.log(i / 4 );

        imageWhiteIndexes.push(i / 4);
      }

    }



    // ctx.rect(0,0,10,10);
    // ctx.stroke();
    clearCanvas();

    // for (var i = 0; i < imageWhiteIndexes.length; i++) {
    //   var pixelXPos = imageWhiteIndexes[i] % imageWidth;
    //   var pixelYPos = Math.floor(imageWhiteIndexes[i] / imageHeight);

    //   whiteSpaces.push([pixelXPos, pixelYPos]);

    //   // ctx.beginPath();
    //   // ctx.arc(pixelXPos, pixelYPos, 1, 0, 2 * Math.PI);
    //   // ctx.fillStyle = "#292929";
    //   // ctx.fill();
    //   // ctx.stroke();


    //   // var a = new Eye(ctx, pixelXPos, pixelYPos, 1)
    //   // a.draw();
    // }
    LEFT_EYE.draw();
    RIGHT_EYE.draw();
  }

  function drawCanvas() {

    clearCanvas();
    Eyes.forEach(function (eye) {
      eye.draw();
    });

  }
  initCanvas();
  // drawCanvas();
  // clearCanvas();


  // use below if yo want to update periodically

  // var internal = setInterval(function () {
  //   if (whiteSpaces.length > 0) {
  //     var randomIndex = Math.floor(Math.random() * whiteSpaces.length);

  //     var randomEye = new Eye(ctx, whiteSpaces[randomIndex][0], whiteSpaces[randomIndex][1], 5, "#eee")
  //     Eyes.push(randomEye)
  //     randomEye.draw();
  //     whiteSpaces.splice(randomIndex, 1);
  //   }else{
  //     clearInterval(interval);
  //   }
  // }, 0);
  function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  function Eye(ctx, xPos, yPos, radius, color) {
    this.ctx = ctx;
    this.xPos = xPos || 0;
    this.yPos = yPos || 0;
    this.radius = radius || 5;
    this.color = color || "#fff";

    this.pupilColor = "#000";
    // this.cursor = cursor || { x: 0, y: 0 };

    this.draw = function () {
      this.ctx.beginPath();
      this.ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.ctx.stroke();
      var pupilPositions = this.pupilPos();

      this.ctx.beginPath();
      this.ctx.arc(pupilPositions.x, pupilPositions.y, this.radius * 0.3, 0, 2 * Math.PI);
      this.ctx.fillStyle = this.pupilColor;
      this.ctx.fill();
      this.ctx.stroke();
    }

    this.pupilPos = function () {
      var tempX = MOUSEX - this.xPos;
      var tempY = MOUSEY - this.yPos;
      var distance = Math.pow(tempX, 2) + Math.pow(tempY, 2);

      if (distance > Math.pow(this.radius * 0.7, 2)) {
        var pupilX = this.xPos + (this.radius * 0.7 * tempX) / Math.sqrt(distance);
        var pupilY = this.yPos + (this.radius * 0.7 * tempY) / Math.sqrt(distance);
        return {
          x: pupilX,
          y: pupilY
        }
      } else {
        return {
          x: MOUSEX,
          y: MOUSEY,
        }
      }
    }

    this.setPosition = function (xPos, yPos) {
      this.xPos = xPos;
      this.yPos = yPos;

    }
  }

  function resetCanvas() {
    clearCanvas();
    var WINDOW_HEIGHT = window.innerHeight;
    var WINDOW_WIDTH = window.innerWidth;

    CANVAS_HEIGHT = canvas.height = Math.floor(WINDOW_HEIGHT / 2)
    CANVAS_WIDTH = canvas.width = Math.floor(WINDOW_WIDTH / 2);
    LEFT_EYE.setPosition(CANVAS_WIDTH / 2 - (TEXT_SIZE * 3) + 17, CANVAS_HEIGHT / 2 - (TEXT_SIZE * 4));
    LEFT_EYE.pupilPos();
    RIGHT_EYE.setPosition(CANVAS_WIDTH / 2 - (TEXT_SIZE * 1) + 5, CANVAS_HEIGHT / 2 - (TEXT_SIZE * 4));
    // drawCanvas();
  }

  function moveCursor(event) {
    MOUSEX = event.offsetX || event.changedTouches[0].pageX
    MOUSEY = event.offsetY || event.changedTouches[0].pageY
    drawCanvas();
  }

  //--------------- can animate the eyes with reset the eyes ----------------------!
  canvas.addEventListener('mousemove', moveCursor)  // desktop?
  canvas.addEventListener('touchmove', moveCursor)  // mobile
  window.addEventListener("resize", function (event) {
    resetCanvas();
  })


  SELECTOR.appendChild(canvas)
  window.Eye = Eye;
})()