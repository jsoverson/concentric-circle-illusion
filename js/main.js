/*global require, dat*/

// copy paste from paul irish http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
})();

document.addEventListener('DOMContentLoaded',function(){
  "use strict";

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  window.addEventListener('resize', resize); resize();

  var options = {
    circles : 4,
    angle : 100,
    distance : 56
  };

  var gui = new dat.GUI();
  gui.add(options, 'circles', 1,10).step(1);
  gui.add(options, 'angle', 0, 360).step(1);
  gui.add(options, 'distance', 0, 200);

  function render() {
    var center = {
      x : parseInt(canvas.width / 2, 10),
      y : parseInt(canvas.height / 2, 10)
    };
    var sprite = {
      width  : 16,
      height : 16
    };
    var spriteWidth = Math.sqrt(sprite.width * sprite.width + sprite.height * sprite.height);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 2;
    for (var i = 0; i < options.circles; i++) {
      var radius = (i+1) * options.distance;
      var circumference = 2 * Math.PI * radius;
      var numSprites = parseInt(circumference / spriteWidth,10);
      if (numSprites % 2) numSprites--; // keep even for color purposes
      var ratio = (Math.PI * 2) / numSprites;
      for (var j = 0; j < numSprites ; j++) {
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate((ratio * j));
        ctx.translate(radius + 15,0);
        ctx.rotate(options.angle * (Math.PI / 180));
        ctx.strokeStyle = (j % 2) ? '#222222' : '#dddddd';
        ctx.strokeRect(-8,8, 16,16);
        ctx.stroke();
        ctx.restore();
      }

    }
  }

  (function animloop(){
    requestAnimFrame(animloop);
    render();
  })();

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
