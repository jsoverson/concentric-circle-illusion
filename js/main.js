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
    centerRadius : 15,
    circles : 4,
    angle : 100,
    distance : 56,
    width : 16,
    alternateRotation : true
  };

  function getUrlValues() {
    var hashKeyVals = [],
        i = 0,
        key = null,
        val = null;
    if(window.location.hash) {
      hashKeyVals = window.location.hash.substr(1).split('&');
      for(i in hashKeyVals) {
        key = hashKeyVals[i].split('=')[0];
        val = parseInt(hashKeyVals[i].split('=')[1], 10);
        if(key === 'alternateRotation') {
          val = !!val;
        }
        if(typeof(options[key]) !== 'undefined') {
          options[key] = val;
        }
      }
    }
  }
  getUrlValues();

  var gui = new dat.GUI();
  gui.add(options, 'centerRadius', 0,100).step(1);
  gui.add(options, 'circles', 1,10).step(1);
  gui.add(options, 'angle', 0, 360).step(1);
  gui.add(options, 'distance', 0, 200);
  gui.add(options, 'alternateRotation');
  var folder = gui.addFolder('Square');
  folder.add(options, 'width', 0, 32).step(1);
  folder.open();

  function updateUrl() {
    var hashVals = [],
        hashVal = '',
        option = null;
    for(option in options) {
        hashVals.push(option + '=' + options[option]);
    }
    hashVal = hashVals.join('&');
    if(window.location.hash !== '#' + hashVal) {
        window.location.hash = hashVal;
    }
  }

  function render() {
    var center = {
      x : parseInt(canvas.width / 2, 10),
      y : parseInt(canvas.height / 2, 10)
    };
    var sprite = {
      width  : options.width,
      height : options.width
    };
    var spriteWidth = Math.sqrt(sprite.width * sprite.width + sprite.height * sprite.height);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 2;
    for (var i = 0; i < options.circles; i++) {
      var radius = (i+1) * options.distance;
      var circumference = 2 * Math.PI * (radius + options.centerRadius);
      var numSprites = parseInt(circumference / spriteWidth,10);
      if (numSprites % 2) numSprites--; // keep even for color purposes
      var ratio = (Math.PI * 2) / numSprites;
      for (var j = 0; j < numSprites ; j++) {
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate((ratio * j));
        ctx.translate(radius + options.centerRadius,0);
        var rotation = options.angle * (Math.PI / 180);
        ctx.rotate(options.alternateRotation && i % 2 ? -rotation : rotation);
        ctx.strokeStyle = (j % 2) ? '#222222' : '#dddddd';
        ctx.strokeRect(-(sprite.width / 2),-(sprite.height / 2), sprite.width,sprite.height);
        ctx.stroke();
        ctx.restore();
      }

    }
    updateUrl();
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
