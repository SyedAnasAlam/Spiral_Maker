float r = 0;
float theta = 0;
float h, s, b;

//Parameters
float deltaR;
float deltaTheta;

float h1, s1, b1;
float h2, s2, b2;

void setup()
{
  size(800, 800);
  colorMode(HSB, TWO_PI, 1, 1);
  background(0, 0, 1);
  strokeWeight(3);
}

void draw()
{
  if(r < width/2)
  {
    translate(width/2, height/2);
    float x1 = r * cos(theta); float y1 = r * sin(theta);
    theta += deltaTheta;
    r += deltaR;
    float x2 = r * cos(theta); float y2 = r * sin(theta);
    
    h = map(r, 0, width/2, h1, h2);
    b = map(r, 0, width/2, b1, b2);
    s = map(r, 0, width/2, s1, s2);
    
    stroke(h, s, b);
    line(x1, y1, x2, y2);    
  }
}

//Every time mouse is clicked make new spirals with random parameters;
void mouseClicked()
{
  //Clear canvas
  background(0, 0, 1);
  //Reset
  r = 0; theta = 0;
  
  //New random values
  deltaR = random(0.5, 3);
  deltaTheta = random(TWO_PI);
  h1 = random(TWO_PI); s1 = random(1); b1 = random(1);
  h2 = random(TWO_PI); s2 = random(1); b2 = random(1);
}
