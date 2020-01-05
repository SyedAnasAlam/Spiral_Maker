var r = 0;
var theta = 0;

//Inital settings
var dtheta = 2;
var dr = 1;
var frametime = 10;
var lw = 3;
//All settings saved en settings array
var settings = [dtheta, dr, frametime, lw];

var frames;

//Backgroundcolor
var backH = 0; var backS = 0; var backL = 1;

var textfieldSettings = document.querySelectorAll('.Settings input[type="number"]');
var sliderSettings = document.querySelectorAll('.Settings input[type="range"]');

//Set textbox and sliders values to inital settings value
for(var i = 0; i < settings.length; i++) {
  textfieldSettings[i].value = settings[i];
  sliderSettings[i].value = settings[i];
}

//Start colors
var h1 = 0; var s1 = 1;var l1 = 0.5;
var h2 = 2 * Math.PI; var s2 = 1; var l2 = 0.5;

var canvas = document.getElementById('Sketch');
var ctx = canvas.getContext('2d');

//Drawpath draws the spiral
function DrawPath(Dtheta, Dr, Lw) {
  var h = map(r, 0, canvas.width/2, h1, h2);
  var s = map(r, 0, canvas.width/2, s1, s2);
  var l = map(r, 0, canvas.width/2, l1, l2);
  var rgb = toRGB(h, s, l);
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

var selectEnum = {
  hardCodedSettings: 0,
  textboxSettings: 1,
  sliderSettings: 2
}

//Update settings of spiral and draw the new spiral
function Update(select) {
  clearInterval(frames);

  if(select == selectEnum.textboxSettings) {
    for(var i = 0; i < settings.length; i++) {
      settings[i] = parseFloat(textfieldSettings[i].value);
      sliderSettings[i].value = parseFloat(textfieldSettings[i].value);
    }
  }

  if(select == selectEnum.sliderSettings) {
    for(var i = 0; i < settings.length; i++) {
      settings[i] = parseFloat(sliderSettings[i].value);
      textfieldSettings[i].value = parseFloat(sliderSettings[i].value);
    }
  }

  r = 0;
  theta = 0;
  var backgrundColor = toRGB(backH, backS, backL);
  ctx.fillStyle = 'rgb(' + backgrundColor[0] + ',' + backgrundColor[1] + ',' + backgrundColor[2] + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  frames = setInterval(DrawPath, settings[2], settings[0], settings[1], settings[3]);
}


//Colorpicker
var canvas2 = document.getElementById('Colorpicker');
var ctx2 = canvas2.getContext('2d');
var r2 = canvas2.width/2;
DrawSpectrum(1, 0.5);

var newH = 0; var newS = 1; var newL = 0.5;

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
  var C = toRGB(newH, newS, newL);
  document.getElementById('ColorDisplay').style.background = 'rgb(' + C[0] + ',' + C[1] + ',' + C[2] + ')';
  document.getElementById('ColorVal').innerHTML = 'H: ' + (newH) + ' S: ' + newS + ' L: ' + newL;
}

function UpdateSatLight() {
  newS = document.getElementById('Sat').value;
  newL = document.getElementById('Light').value;
  DrawSpectrum(newS, newL);
  var C2 = toRGB(newH, newS, newL);
  document.getElementById('ColorDisplay').style.background = 'rgb(' + C2[0] + ',' + C2[1] + ',' + C2[2] + ')';
  document.getElementById('ColorVal').innerHTML = 'H: ' + newH + ' S: ' + newS + ' L: ' + newL;
}

function DrawSpectrum(s, l) {
  ctx2.clearRect(0, 0, canvas2.width/2, canvas2.height/2);
  for (var a = 0; a < Math.PI * 2; a+= 0.001) {
    var c = toRGB(a, s, l);
    ctx2.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    ctx2.beginPath();
    ctx2.lineWidth = 4;
    ctx2.moveTo(canvas2.width/2, canvas2.height/2);
    ctx2.lineTo(Math.cos(a - 0.5 * Math.PI) * r2 + canvas2.width/2, Math.sin(a - 0.5 * Math.PI) * r2 + canvas2.height/2);
    ctx2.stroke();
  }
}

//Set color A and Color B of spiral
function setColor(color) {
  var h = parseFloat(document.getElementById('Hue').value);
  var s = parseFloat(document.getElementById('Sat').value);
  var l = parseFloat(document.getElementById('Light').value);
  color ? (h1 = h, s1 = s, l1 = l) : (h2 = h, s2 = s, l2 = l);
  Update(selectEnum.sliderSettings);
}

function setBackgroundColor(select) {
  if (select) {
    backH = document.getElementById('Hue').value;
    backS = document.getElementById('Sat').value;
    backL = document.getElementById('Light').value;
  }

  var b = toRGB(backH, backS, backL);
  ctx.fillStyle = 'rgb(' + b[0] + ',' + b[1] + ',' + b[2] + ')';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function LoadPreset() {
  var preset = parseInt(document.querySelector('select').value);
  switch (preset) {
    case 0:
      backL = 1;
      settings = [0.2, 0.75, 10, 4];
      h1 = 0; s1 = 1; l1 = 0.5;
      h2 = 2 * Math.PI; s2 = 1; ligthB = 0.5;
      break;
    case 1:
      backL = 1;
      settings = [0.84, 1.113, 10, 5.3];
      h1 = 4.62; s1 = 1; l1 = 0;
      h2 = 5.43; s2 = 1; ligthB = 0.5;
      break;
    case 2:
      backL = 1;
      settings = [5.19, 0.629, 10, 1];
      h1 = 3.76; s1 = 0.5; l1 = 0.5;
      h2 = 1.81; s2 = 0.5; ligthB = 0.5;
      break;
  }
  Update(selectEnum.hardCodedSettings);
}

var maxAngle = 2 * Math.PI;
var maxRadius = 3;
var maxLinewidth = 10;
function Randomise() {
  settings = [Random(maxAngle), Random(maxRadius), 10, Random(maxLinewidth)];
  h1 = Random(2 * Math.PI); s1 = Random(1); l1 = Random(1);
  h2 = Random(2 * Math.PI); s2 = Random(1); l2 = Random(1);
  for(var i = 0; i < settings.length; i++) {
    sliderSettings[i].value = settings[i];
    textfieldSettings[i].value = settings[i];
  }
  Update(selectEnum.hardCodedSettings);
}

function toRGB(h, s, l) {
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var dh = h/(Math.PI/3);
  var x = c * (1 - Math.abs(dh % 2 - 1));
  var m = l - c/2;

  var rgb = [];

  if (h < toRadians(60)) {
    rgb = [(c + m) * 255, (x + m) * 255, 0 + m * 255];
  }
  if(h >= toRadians(60) && h < toRadians(120)) {
    rgb = [(x + m) * 255, (c + m) * 255, 0 + m * 255];
  }
  if(h >= toRadians(120) && h < toRadians(180)) {
    rgb = [0 + m * 255, (c + m) * 255, (x + m) * 255];
  }
  if(h >= toRadians(180) && h < toRadians(240)) {
    rgb = [0 + m * 255, (x + m) * 255, (c + m) * 255];
  }
  if(h >= toRadians(240) && h < toRadians(300)) {
    rgb = [(x + m) * 255, 0 + m * 255, (c + m) * 255];
  }
  if(h >= toRadians(300) && h < toRadians(360)) {
    rgb = [(c + m) * 255, 0 + m * 255, (x + m) * 255];
  }

  return rgb;
}

function toRadians(degrees) {
  return degrees * Math.PI/180;
}

function Random(max) {
  return parseFloat((Math.random() * max).toFixed(3));
}

function map(value, a1, b1, a2, b2) {
      return a2 + (b2 - a2) * ((value - a1) / (b1 - a1));
}
