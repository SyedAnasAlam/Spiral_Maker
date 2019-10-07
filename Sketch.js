var r = 0;
var theta = 0;
var dtheta = 2;
var dr = 1;
var frametime = 30;
var lw = 3;

var settings = [dtheta, dr, frametime, lw];

var bound = 0;
var frames;

var backH = 0;
var backS = 0;
var backL = 1;

var settingsRanges = document.querySelectorAll('.Settings input[type="range"]');
var settingsTextfields = document.querySelectorAll('.Settings input[type="number"]');

function Update(select) {
  clearInterval(frames);
  if(select != 5) {
    settingsRanges = document.querySelectorAll('.Settings input[type="range"]');

    if(select >= 0) {
      settingsTextfields = document.querySelectorAll('.Settings input[type="number"]');
      settingsRanges[select].value = parseFloat(settingsTextfields[select].value);
    }

    for (var i = 0; i < settingsRanges.length; i++) {
      settings[i] = parseFloat(settingsRanges[i].value);
    }
  }

  if(select < 0) {
    for (var i = 0; i < settingsRanges.length; i++) {
      settingsTextfields[i].value = settings[i];
    }
  }

  r = 0;
  theta = 0;
  var b = RGB(backH, backS, backL);
  ctx.fillStyle = 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  frames = setInterval(DrawPath, settings[2], settings[0], settings[1], settings[3]);
}

var hueA = 0;
var hueB = 360;

var satA = 1;
var satB = 1;

var lightA = 0.5;
var lightB = 0.5;

var canvas = document.getElementById('Sketch');
var ctx = canvas.getContext('2d');

function DrawPath(Dtheta, Dr, Lw) {
  bound = (canvas.width * 0.5 * Dtheta)/Dr;
  var hue = hueA + (hueB - hueA) * (theta - 0)/(bound - 0);
  var sat = satA + (satB - satA) * (r - 0)/(canvas.width/2 - 0);
  var light = lightA + (lightB - lightA) * (r - 0)/(canvas.width/2 - 0);
  var rgb = RGB(hue, sat, light);
  ctx.strokeStyle = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  ctx.lineWidth = Lw;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r * Math.cos(theta) + canvas.width/2, r * Math.sin(theta) + canvas.height/2);
  r += Dr;
  theta += Dtheta;
  ctx.lineTo(r * Math.cos(theta) + canvas.width/2, r * Math.sin(theta) + canvas.height/2);
  ctx.stroke();

  if (r >= canvas.width/2) {
    clearInterval(frames);
  }
}

var canvas2 = document.getElementById('Colorpicker');
var ctx2 = canvas2.getContext('2d');
var r2 = canvas2.width/2;
DrawSpectrum(1, 0.5);

var newH = 0;
var newS = 1;
var newL = 0.5;

function UpdateHue() {
  var canvas3 = document.getElementById('Top');
  var ctx3 = canvas3.getContext('2d');
  ctx3.clearRect(0, 0, canvas2.width, canvas2.height);

  newH = document.getElementById('Hue').value;
  ctx3.beginPath();
  ctx3.lineWidth = 4;
  ctx3.strokeStyle = 'black';
  ctx3.moveTo(canvas2.width/2, canvas2.height/2);
  ctx3.lineTo(Math.cos(newH - 0.5 * Math.PI) * r2 + canvas2.width/2, Math.sin(newH - 0.5 * Math.PI) * r2 + canvas2.height/2);
  ctx3.stroke();
  newH = newH * 180/3.14;
  var C = RGB(newH, newS, newL);
  document.getElementById('ColorDisplay').style.background = 'rgb(' + C[0] + ',' + C[1] + ',' + C[2] + ')';
  document.getElementById('ColorVal').innerHTML = 'H: ' + parseInt(newH) + ' S: ' + newS + ' L: ' + newL;
}

function UpdateSatLight() {
  newS = document.getElementById('Sat').value;
  newL = document.getElementById('Light').value;
  DrawSpectrum(newS, newL);
  var C2 = RGB(newH, newS, newL);
  document.getElementById('ColorDisplay').style.background = 'rgb(' + C2[0] + ',' + C2[1] + ',' + C2[2] + ')';
  document.getElementById('ColorVal').innerHTML = 'H: ' + parseInt(newH) + ' S: ' + newS + ' L: ' + newL;
}

function DrawSpectrum(s, l) {
  ctx2.clearRect(0, 0, canvas2.width/2, canvas2.height/2);
  for (var a = 0; a < Math.PI * 2; a+= 0.001) {
    var angle = a * 180/Math.PI;
    var c = RGB(angle, s, l);
    ctx2.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    ctx2.beginPath();
    ctx2.lineWidth = 4;
    ctx2.moveTo(canvas2.width/2, canvas2.height/2);
    ctx2.lineTo(Math.cos(a - 0.5 * Math.PI) * r2 + canvas2.width/2, Math.sin(a - 0.5 * Math.PI) * r2 + canvas2.height/2);
    ctx2.stroke();
  }
}

function setColor(select) {
  var h = document.getElementById('Hue').value * 180/Math.PI;
  var s = parseFloat(document.getElementById('Sat').value);
  var l = parseFloat(document.getElementById('Light').value);
  select ? (hueA = h, satA = s, lightA = l) : (hueB = h, satB = s, lightB = l);
  Update(0);
}

function setBackgroundColor(select) {
  if (select) {
    backH = document.getElementById('Hue').value * 180/Math.PI;
    backS = document.getElementById('Sat').value;
    backL = document.getElementById('Light').value;
  }

  var b = RGB(backH, backS, backL);
  ctx.fillStyle = 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function LoadPreset() {
  var selected = parseInt(document.querySelector('select').value);
  switch (selected) {
    case 0:
      backL = 1;
      settings = [9.42, 0.4, 10, 2];
      hueA = 199; satA = 1; lightA = 0;
      hueB = 219; satB = 1; lightB = 0.57;
      break;
    case 1:
      backL = 1;
      settings = [0.2, 0.75, 10, 4];
      hueA = 0; satA = 1; lightA = 0.5;
      hueB = 360; satB = 1; ligthB = 0.5;
      break;
    case 2:
      backL = 0;
      settings = [11, 0.5, 10, 5];
      hueA = 0; satA = 1; lightA = 0.5;
      hueB = 60; satB = 1; ligthB = 0.5;
      break;
  }
  Update(5);
}

function Randomise() {
  settings = [R(6.28318530718), R(3), 10, R(10)];
  hueA = R(360); satA = R(1); lightA = R(1);
  hueB = R(360); satB = R(1); lightB = R(1);
  for(var i = 0; i < settings.length; i++) {
    settingsRanges[i].value = settings[i];
    settingsTextfields[i].value = settings[i];
  }
  Update(5);
}

function RGB(h, s, l) {
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var dh = h/60;
  var x = c * (1 - Math.abs(dh % 2 - 1));
  var m = l - c/2;

  var rgb = [];

  if (h < 60) {
    rgb = [(c + m) * 255, (x + m) * 255, 0 + m * 255];
  }
  if(h >= 60 && h < 120) {
    rgb = [(x + m) * 255, (c + m) * 255, 0 + m * 255];
  }
  if(h >= 120 && h < 180) {
    rgb = [0 + m * 255, (c + m) * 255, (x + m) * 255];
  }
  if(h >= 180 && h < 240) {
    rgb = [0 + m * 255, (x + m) * 255, (c + m) * 255];
  }
  if(h >= 240 && h < 300) {
    rgb = [(x + m) * 255, 0 + m * 255, (c + m) * 255];
  }
  if(h >= 300 && h < 360) {
    rgb = [(c + m) * 255, 0 + m * 255, (x + m) * 255];
  }

  return rgb;
}

function R(max) {
  return parseFloat((Math.random() * max).toFixed(3));
}
