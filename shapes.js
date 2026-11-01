// shapes.js - Comprehensive Brush Shape System
// Easily extensible - just add new shapes to the BRUSH_SHAPES object

const BRUSH_SHAPES = {
  // ========== A. BASIC GEOMETRY ==========
  circle: {
    name: 'Circle',
    category: 'Basic',
    icon: '⚫',
    draw: (layer, x, y, size, rotation) => {
      layer.circle(x, y, size);
    }
  },
  
  square: {
    name: 'Square',
    category: 'Basic',
    icon: '⬛',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      layer.square(0, 0, size);
      layer.pop();
    }
  },
  
  diamond: {
    name: 'Diamond',
    category: 'Basic',
    icon: '◆',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation + 45));
      layer.rectMode(CENTER);
      layer.square(0, 0, size);
      layer.pop();
    }
  },
  
  triangle: {
    name: 'Triangle',
    category: 'Basic',
    icon: '▲',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      const h = size * 0.866;
      layer.triangle(0, -h/2, -size/2, h/2, size/2, h/2);
      layer.pop();
    }
  },
  
  rightTriangle: {
    name: 'Right Triangle',
    category: 'Basic',
    icon: '◢',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.triangle(-size/2, -size/2, -size/2, size/2, size/2, size/2);
      layer.pop();
    }
  },
  
  pentagon: {
    name: 'Pentagon',
    category: 'Basic',
    icon: '⬠',
    draw: (layer, x, y, size, rotation) => {
      drawPolygon(layer, x, y, size/2, 5, rotation);
    }
  },
  
  hexagon: {
    name: 'Hexagon',
    category: 'Basic',
    icon: '⬡',
    draw: (layer, x, y, size, rotation) => {
      drawPolygon(layer, x, y, size/2, 6, rotation);
    }
  },
  
  octagon: {
    name: 'Octagon',
    category: 'Basic',
    icon: '⯃',
    draw: (layer, x, y, size, rotation) => {
      drawPolygon(layer, x, y, size/2, 8, rotation);
    }
  },
  
  ellipse: {
    name: 'Ellipse',
    category: 'Basic',
    icon: '⬭',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.ellipse(0, 0, size, size * 0.6);
      layer.pop();
    }
  },
  
  roundedRect: {
    name: 'Rounded Rect',
    category: 'Basic',
    icon: '▢',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      layer.rect(0, 0, size, size * 0.7, size * 0.2);
      layer.pop();
    }
  },
  
  thinRect: {
    name: 'Thin Rect',
    category: 'Basic',
    icon: '▬',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      layer.rect(0, 0, size, size * 0.2);
      layer.pop();
    }
  },
  
  cross: {
    name: 'Cross',
    category: 'Basic',
    icon: '✚',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const thickness = size * 0.3;
      layer.rect(0, 0, thickness, size);
      layer.rect(0, 0, size, thickness);
      layer.pop();
    }
  },
  
  xShape: {
    name: 'X Shape',
    category: 'Basic',
    icon: '✖',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation + 45));
      layer.rectMode(CENTER);
      const thickness = size * 0.3;
      layer.rect(0, 0, thickness, size);
      layer.rect(0, 0, size, thickness);
      layer.pop();
    }
  },

  // ========== B. STARS & SPARKLES ==========
  star5: {
    name: '5-Point Star',
    category: 'Stars',
    icon: '⭐',
    draw: (layer, x, y, size, rotation) => {
      drawStar(layer, x, y, size/2, size/4, 5, rotation);
    }
  },
  
  star6: {
    name: '6-Point Star',
    category: 'Stars',
    icon: '✡',
    draw: (layer, x, y, size, rotation) => {
      drawStar(layer, x, y, size/2, size/4, 6, rotation);
    }
  },
  
  puffyStar: {
    name: 'Puffy Star',
    category: 'Stars',
    icon: '⭐',
    draw: (layer, x, y, size, rotation) => {
      drawStar(layer, x, y, size/2, size/2.5, 5, rotation);
    }
  },
  
  starburst: {
    name: 'Starburst',
    category: 'Stars',
    icon: '✴',
    draw: (layer, x, y, size, rotation) => {
      drawStar(layer, x, y, size/2, size/8, 8, rotation);
    }
  },
  
  sunburst: {
    name: 'Sunburst',
    category: 'Stars',
    icon: '☀',
    draw: (layer, x, y, size, rotation) => {
      drawStar(layer, x, y, size/2, size/6, 12, rotation);
    }
  },
  
  sparkle: {
    name: 'Sparkle',
    category: 'Stars',
    icon: '✧',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const thin = size * 0.15;
      layer.rect(0, 0, thin, size);
      layer.rect(0, 0, size, thin);
      layer.rotate(radians(45));
      layer.rect(0, 0, thin * 0.7, size * 0.7);
      layer.rect(0, 0, size * 0.7, thin * 0.7);
      layer.pop();
    }
  },
  
  diamondShine: {
    name: 'Diamond Shine',
    category: 'Stars',
    icon: '✦',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation + 45));
      const s = size / 2;
      layer.quad(0, -s, s*0.3, 0, 0, s, -s*0.3, 0);
      layer.rotate(radians(90));
      layer.quad(0, -s, s*0.3, 0, 0, s, -s*0.3, 0);
      layer.pop();
    }
  },

  // ========== C. ORGANIC / NATURAL ==========
  leaf: {
    name: 'Leaf',
    category: 'Organic',
    icon: '🍃',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = t * PI;
        const r = sin(angle) * size/2;
        const px = cos(angle) * r;
        const py = (t - 0.5) * size;
        layer.vertex(px, py);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  teardrop: {
    name: 'Teardrop',
    category: 'Organic',
    icon: '💧',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 30; i++) {
        const angle = map(i, 0, 30, 0, TWO_PI);
        const r = size/2 * (1 - cos(angle) * 0.5);
        const px = sin(angle) * r;
        const py = -cos(angle) * r;
        layer.vertex(px, py);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  cloud: {
    name: 'Cloud',
    category: 'Organic',
    icon: '☁',
    draw: (layer, x, y, size, rotation) => {
      const r = size / 6;
      layer.circle(x - size/4, y, r * 1.5);
      layer.circle(x, y - size/8, r * 2);
      layer.circle(x + size/4, y, r * 1.5);
      layer.circle(x, y + size/8, r * 1.3);
    }
  },
  
  flower: {
    name: 'Flower',
    category: 'Organic',
    icon: '🌸',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      const petals = 6;
      for (let i = 0; i < petals; i++) {
        layer.push();
        layer.rotate(TWO_PI / petals * i);
        layer.ellipse(0, -size/3, size/3, size/2);
        layer.pop();
      }
      layer.circle(0, 0, size/4);
      layer.pop();
    }
  },
  
  petal: {
    name: 'Petal',
    category: 'Organic',
    icon: '🌺',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = t * PI - PI/2;
        const r = sin(t * PI) * size/2;
        const px = cos(angle) * r;
        const py = sin(angle) * r;
        layer.vertex(px, py);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  flame: {
    name: 'Flame',
    category: 'Organic',
    icon: '🔥',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const angle = t * TWO_PI;
        const wave = sin(t * PI * 4) * 0.15;
        const r = (size/2) * (1 - t * 0.8) * (1 + wave);
        const px = sin(angle) * r;
        const py = -cos(angle) * r - size/4;
        layer.vertex(px, py);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  smokePuff: {
    name: 'Smoke Puff',
    category: 'Organic',
    icon: '💨',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      for (let i = 0; i < 5; i++) {
        const angle = random(TWO_PI);
        const dist = random(size/4);
        const s = random(size/3, size/2);
        layer.circle(cos(angle) * dist, sin(angle) * dist, s);
      }
      layer.pop();
    }
  },
  
  snowflake: {
    name: 'Snowflake',
    category: 'Organic',
    icon: '❄',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(size * 0.05);
      for (let i = 0; i < 6; i++) {
        layer.push();
        layer.rotate(PI / 3 * i);
        layer.line(0, 0, 0, -size/2);
        layer.line(0, -size/3, -size/8, -size/3 - size/8);
        layer.line(0, -size/3, size/8, -size/3 - size/8);
        layer.pop();
      }
      layer.pop();
    }
  },
  
  bubble: {
    name: 'Bubble',
    category: 'Organic',
    icon: '⚪',
    draw: (layer, x, y, size, rotation) => {
      layer.circle(x, y, size);
      layer.push();
      layer.noFill();
      layer.stroke(255, 255, 255, 100);
      layer.strokeWeight(2);
      layer.arc(x - size/6, y - size/6, size/3, size/3, PI, TWO_PI);
      layer.pop();
    }
  },

  // ========== D. ARTISTIC / STYLIZED ==========
  splatter: {
    name: 'Paint Splatter',
    category: 'Artistic',
    icon: '💥',
    draw: (layer, x, y, size, rotation) => {
      layer.circle(x, y, size * 0.6);
      for (let i = 0; i < 8; i++) {
        const angle = random(TWO_PI);
        const dist = random(size/3, size/2);
        const s = random(size/4, size/3);
        layer.circle(x + cos(angle) * dist, y + sin(angle) * dist, s);
      }
    }
  },
  
  inkBlot: {
    name: 'Ink Blot',
    category: 'Artistic',
    icon: '🖤',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.beginShape();
      for (let i = 0; i < 20; i++) {
        const angle = TWO_PI / 20 * i;
        const r = size/2 * (1 + random(-0.3, 0.3));
        layer.vertex(cos(angle) * r, sin(angle) * r);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  roughBlob: {
    name: 'Rough Blob',
    category: 'Artistic',
    icon: '◉',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.beginShape();
      for (let i = 0; i < 30; i++) {
        const angle = TWO_PI / 30 * i;
        const noise = sin(i * 0.8) * 0.2;
        const r = size/2 * (1 + noise);
        layer.vertex(cos(angle) * r, sin(angle) * r);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  grainyTexture: {
    name: 'Grainy Texture',
    category: 'Artistic',
    icon: '⚫',
    draw: (layer, x, y, size, rotation) => {
      for (let i = 0; i < 30; i++) {
        const angle = random(TWO_PI);
        const dist = random(size/2);
        const s = random(2, 6);
        layer.circle(x + cos(angle) * dist, y + sin(angle) * dist, s);
      }
    }
  },
  
  hairline: {
    name: 'Hairline',
    category: 'Artistic',
    icon: '─',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(1);
      layer.line(-size/2, 0, size/2, 0);
      layer.pop();
    }
  },
  
  calligraphy: {
    name: 'Calligraphy',
    category: 'Artistic',
    icon: '✒',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation + 45));
      layer.rectMode(CENTER);
      layer.rect(0, 0, size * 0.3, size);
      layer.pop();
    }
  },
  
  markerChisel: {
    name: 'Marker Chisel',
    category: 'Artistic',
    icon: '🖊',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation + 30));
      layer.rectMode(CENTER);
      layer.rect(0, 0, size * 0.4, size, size * 0.1);
      layer.pop();
    }
  },
  
  chalkGrain: {
    name: 'Chalk Grain',
    category: 'Artistic',
    icon: '⬜',
    draw: (layer, x, y, size, rotation) => {
      layer.rectMode(CENTER);
      for (let i = 0; i < 20; i++) {
        const offsetX = random(-size/3, size/3);
        const offsetY = random(-size/3, size/3);
        const s = random(3, 8);
        layer.circle(x + offsetX, y + offsetY, s);
      }
    }
  },
  
  pixelBlock: {
    name: 'Pixel Block',
    category: 'Artistic',
    icon: '▪',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const gridSize = 4;
      const cellSize = size / gridSize;
      for (let i = -gridSize/2; i < gridSize/2; i++) {
        for (let j = -gridSize/2; j < gridSize/2; j++) {
          if (random() > 0.3) {
            layer.square(i * cellSize, j * cellSize, cellSize);
          }
        }
      }
      layer.pop();
    }
  },

  // ========== E. MOTION / FLOW ==========
  spiral: {
    name: 'Spiral',
    category: 'Motion',
    icon: '🌀',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.1);
      layer.beginShape();
      for (let i = 0; i < 60; i++) {
        const angle = i / 10;
        const r = (i / 60) * size/2;
        layer.vertex(cos(angle) * r, sin(angle) * r);
      }
      layer.endShape();
      layer.pop();
    }
  },
  
  swirl: {
    name: 'Mini Swirl',
    category: 'Motion',
    icon: '🌪',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const angle = t * PI * 3;
        const r = t * size/2;
        layer.vertex(cos(angle) * r, sin(angle) * r);
      }
      layer.endShape();
      layer.pop();
    }
  },
  
  cometTail: {
    name: 'Comet Tail',
    category: 'Motion',
    icon: '☄',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      layer.vertex(size/2, 0);
      layer.vertex(-size/2, -size/4);
      layer.vertex(-size/3, 0);
      layer.vertex(-size/2, size/4);
      layer.endShape(CLOSE);
      layer.circle(size/2, 0, size/3);
      layer.pop();
    }
  },
  
  lightning: {
    name: 'Lightning',
    category: 'Motion',
    icon: '⚡',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(size * 0.08);
      layer.beginShape();
      layer.vertex(0, -size/2);
      layer.vertex(-size/6, -size/6);
      layer.vertex(size/8, -size/8);
      layer.vertex(-size/8, size/8);
      layer.vertex(size/6, size/6);
      layer.vertex(0, size/2);
      layer.endShape();
      layer.pop();
    }
  },
  
  wave: {
    name: 'Wave',
    category: 'Motion',
    icon: '〰',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.1);
      layer.beginShape();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const px = map(t, 0, 1, -size/2, size/2);
        const py = sin(t * TWO_PI * 2) * size/6;
        layer.vertex(px, py);
      }
      layer.endShape();
      layer.pop();
    }
  },
  
  crescent: {
    name: 'Crescent',
    category: 'Motion',
    icon: '🌙',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.circle(0, 0, size);
      layer.erase();
      layer.circle(size/6, 0, size * 0.8);
      layer.noErase();
      layer.pop();
    }
  },
  
  sCurve: {
    name: 'S Curve',
    category: 'Motion',
    icon: '∫',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.15);
      layer.beginShape();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const px = map(t, 0, 1, -size/2, size/2);
        const py = sin(t * PI) * size/3;
        layer.vertex(px, py);
      }
      layer.endShape();
      layer.pop();
    }
  },

  // ========== F. CUTE / FUN ==========
  heart: {
    name: 'Heart',
    category: 'Cute',
    icon: '❤',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 40; i++) {
        const t = map(i, 0, 40, 0, TWO_PI);
        const hx = 16 * pow(sin(t), 3);
        const hy = 13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t);
        layer.vertex(hx * size/40, -hy * size/40);
      }
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  starHeart: {
    name: 'Star Heart',
    category: 'Cute',
    icon: '💖',
    draw: (layer, x, y, size, rotation) => {
      // Draw heart
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      for (let i = 0; i <= 40; i++) {
        const t = map(i, 0, 40, 0, TWO_PI);
        const hx = 16 * pow(sin(t), 3);
        const hy = 13 * cos(t) - 5 * cos(2*t) - 2 * cos(3*t) - cos(4*t);
        layer.vertex(hx * size/40, -hy * size/40);
      }
      layer.endShape(CLOSE);
      // Add sparkles
      layer.circle(-size/4, -size/4, size/8);
      layer.circle(size/4, -size/4, size/8);
      layer.pop();
    }
  },
  
  smiley: {
    name: 'Smiley',
    category: 'Cute',
    icon: '😊',
    draw: (layer, x, y, size, rotation) => {
      layer.circle(x, y, size);
      layer.erase();
      layer.circle(x - size/5, y - size/8, size/8);
      layer.circle(x + size/5, y - size/8, size/8);
      layer.arc(x, y + size/8, size/2, size/3, 0, PI);
      layer.noErase();
    }
  },
  
  emoji: {
    name: 'Emoji',
    category: 'Cute',
    icon: '😀',
    draw: (layer, x, y, size, rotation) => {
      layer.circle(x, y, size);
      layer.push();
      layer.fill(0);
      layer.circle(x - size/5, y - size/8, size/10);
      layer.circle(x + size/5, y - size/8, size/10);
      layer.pop();
    }
  },
  
  pawPrint: {
    name: 'Paw Print',
    category: 'Cute',
    icon: '🐾',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      // Main pad
      layer.ellipse(0, size/6, size/2, size/2.5);
      // Toe pads
      layer.circle(-size/4, -size/6, size/5);
      layer.circle(-size/12, -size/4, size/5);
      layer.circle(size/12, -size/4, size/5);
      layer.circle(size/4, -size/6, size/5);
      layer.pop();
    }
  },
  
  butterfly: {
    name: 'Butterfly',
    category: 'Cute',
    icon: '🦋',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      // Wings
      layer.ellipse(-size/4, -size/6, size/2, size/2.5);
      layer.ellipse(size/4, -size/6, size/2, size/2.5);
      layer.ellipse(-size/4, size/6, size/2.5, size/3);
      layer.ellipse(size/4, size/6, size/2.5, size/3);
      // Body
      layer.strokeWeight(size * 0.08);
      layer.line(0, -size/3, 0, size/3);
      layer.pop();
    }
  },
  
  balloon: {
    name: 'Balloon',
    category: 'Cute',
    icon: '🎈',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      // Balloon
      layer.beginShape();
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const angle = map(t, 0, 1, 0, TWO_PI);
        const r = size/2 * (1 - t * 0.1);
        layer.vertex(sin(angle) * r, cos(angle) * r - size/8);
      }
      layer.endShape(CLOSE);
      // String
      layer.strokeWeight(1);
      layer.line(0, size/3, 0, size/2);
      layer.pop();
    }
  },
  
  musicNote: {
    name: 'Music Note',
    category: 'Cute',
    icon: '♪',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.circle(0, size/4, size/3);
      layer.strokeWeight(size * 0.08);
      layer.line(size/6, size/4, size/6, -size/2);
      layer.pop();
    }
  },

  // ========== G. SYMBOLS & ICONS ==========
  playButton: {
    name: 'Play',
    category: 'Symbols',
    icon: '▶',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.triangle(-size/3, -size/2, -size/3, size/2, size/2, 0);
      layer.pop();
    }
  },
  
  checkMark: {
    name: 'Check',
    category: 'Symbols',
    icon: '✓',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.15);
      layer.beginShape();
      layer.vertex(-size/3, 0);
      layer.vertex(-size/8, size/3);
      layer.vertex(size/2, -size/3);
      layer.endShape();
      layer.pop();
    }
  },
  
  arrowThin: {
    name: 'Arrow Thin',
    category: 'Symbols',
    icon: '→',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(size * 0.08);
      layer.line(-size/2, 0, size/2, 0);
      layer.line(size/4, -size/4, size/2, 0);
      layer.line(size/4, size/4, size/2, 0);
      layer.pop();
    }
  },
  
  arrowThick: {
    name: 'Arrow Thick',
    category: 'Symbols',
    icon: '➡',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.beginShape();
      layer.vertex(-size/2, -size/6);
      layer.vertex(size/4, -size/6);
      layer.vertex(size/4, -size/3);
      layer.vertex(size/2, 0);
      layer.vertex(size/4, size/3);
      layer.vertex(size/4, size/6);
      layer.vertex(-size/2, size/6);
      layer.endShape(CLOSE);
      layer.pop();
    }
  },
  
  gearCog: {
    name: 'Gear',
    category: 'Symbols',
    icon: '⚙',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      const teeth = 8;
      const innerR = size/4;
      const outerR = size/2;
      layer.beginShape();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = TWO_PI / (teeth * 2) * i;
        const r = i % 2 === 0 ? outerR : innerR * 1.5;
        layer.vertex(cos(angle) * r, sin(angle) * r);
      }
      layer.endShape(CLOSE);
      layer.erase();
      layer.circle(0, 0, innerR);
      layer.noErase();
      layer.pop();
    }
  },
  
  infinity: {
    name: 'Infinity',
    category: 'Symbols',
    icon: '∞',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.1);
      layer.beginShape();
      for (let i = 0; i <= 60; i++) {
        const t = map(i, 0, 60, 0, TWO_PI);
        const scale = size/3;
        const px = scale * cos(t) / (1 + pow(sin(t), 2));
        const py = scale * sin(t) * cos(t) / (1 + pow(sin(t), 2));
        layer.vertex(px, py);
      }
      layer.endShape();
      layer.pop();
    }
  },
  
  hashtag: {
    name: 'Hashtag',
    category: 'Symbols',
    icon: '#',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(size * 0.1);
      const gap = size/4;
      layer.line(-gap, -size/2, -gap, size/2);
      layer.line(gap, -size/2, gap, size/2);
      layer.line(-size/2, -gap, size/2, -gap);
      layer.line(-size/2, gap, size/2, gap);
      layer.pop();
    }
  },
  
  atSymbol: {
    name: 'At Symbol',
    category: 'Symbols',
    icon: '@',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.08);
      layer.circle(0, 0, size);
      layer.circle(size/6, 0, size/3);
      layer.line(size/6 + size/6, 0, size/6 + size/6, size/3);
      layer.pop();
    }
  },

  // ========== H. PATTERN-FRIENDLY ==========
  honeycombHex: {
    name: 'Honeycomb',
    category: 'Patterns',
    icon: '⬡',
    draw: (layer, x, y, size, rotation) => {
      drawPolygon(layer, x, y, size/2, 6, rotation);
      layer.erase();
      drawPolygon(layer, x, y, size/3, 6, rotation);
      layer.noErase();
    }
  },
  
  mosaicTile: {
    name: 'Mosaic',
    category: 'Patterns',
    icon: '◫',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const s = size/3;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if ((i + j) % 2 === 0) {
            layer.square(i * s, j * s, s * 0.9);
          }
        }
      }
      layer.pop();
    }
  },
  
  dotCluster: {
    name: 'Dot Cluster',
    category: 'Patterns',
    icon: '⋮',
    draw: (layer, x, y, size, rotation) => {
      const dotSize = size / 8;
      const spacing = size / 4;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          layer.circle(x + i * spacing, y + j * spacing, dotSize);
        }
      }
    }
  },
  
  lattice: {
    name: 'Lattice',
    category: 'Patterns',
    icon: '╬',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.strokeWeight(size * 0.05);
      const gap = size/4;
      for (let i = -2; i <= 2; i++) {
        layer.line(i * gap, -size/2, i * gap, size/2);
        layer.line(-size/2, i * gap, size/2, i * gap);
      }
      layer.pop();
    }
  },
  
  concentricCircles: {
    name: 'Concentric',
    category: 'Patterns',
    icon: '◎',
    draw: (layer, x, y, size, rotation) => {
      layer.noFill();
      layer.strokeWeight(size * 0.05);
      for (let i = 1; i <= 4; i++) {
        layer.circle(x, y, size * i / 4);
      }
    }
  },
  
  stripeHorizontal: {
    name: 'H-Stripes',
    category: 'Patterns',
    icon: '☰',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const stripeH = size / 5;
      for (let i = -2; i <= 2; i++) {
        layer.rect(0, i * stripeH, size, stripeH * 0.6);
      }
      layer.pop();
    }
  },
  
  stripeVertical: {
    name: 'V-Stripes',
    category: 'Patterns',
    icon: '|||',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const stripeW = size / 5;
      for (let i = -2; i <= 2; i++) {
        layer.rect(i * stripeW, 0, stripeW * 0.6, size);
      }
      layer.pop();
    }
  },
  
  zigzagStamp: {
    name: 'Zigzag',
    category: 'Patterns',
    icon: '⚡',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.1);
      layer.beginShape();
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        const px = map(i, 0, steps, -size/2, size/2);
        const py = (i % 2 === 0) ? -size/4 : size/4;
        layer.vertex(px, py);
      }
      layer.endShape();
      layer.pop();
    }
  },
  
  wavyBand: {
    name: 'Wavy Band',
    category: 'Patterns',
    icon: '≈',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.noFill();
      layer.strokeWeight(size * 0.15);
      for (let offset = -size/6; offset <= size/6; offset += size/6) {
        layer.beginShape();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const px = map(t, 0, 1, -size/2, size/2);
          const py = sin(t * TWO_PI * 2) * size/8 + offset;
          layer.vertex(px, py);
        }
        layer.endShape();
      }
      layer.pop();
    }
  },
  
  checkerSquare: {
    name: 'Checker',
    category: 'Patterns',
    icon: '▦',
    draw: (layer, x, y, size, rotation) => {
      layer.push();
      layer.translate(x, y);
      layer.rotate(radians(rotation));
      layer.rectMode(CENTER);
      const cellSize = size / 4;
      for (let i = -2; i < 2; i++) {
        for (let j = -2; j < 2; j++) {
          if ((i + j) % 2 === 0) {
            layer.square(i * cellSize + cellSize/2, j * cellSize + cellSize/2, cellSize);
          }
        }
      }
      layer.pop();
    }
  }
};

// ========== HELPER FUNCTIONS ==========
function drawPolygon(layer, x, y, radius, sides, rotation) {
  layer.push();
  layer.translate(x, y);
  layer.rotate(radians(rotation));
  layer.beginShape();
  for (let i = 0; i < sides; i++) {
    const angle = TWO_PI / sides * i - PI / 2;
    const px = cos(angle) * radius;
    const py = sin(angle) * radius;
    layer.vertex(px, py);
  }
  layer.endShape(CLOSE);
  layer.pop();
}

function drawStar(layer, x, y, radius1, radius2, npoints, rotation) {
  layer.push();
  layer.translate(x, y);
  layer.rotate(radians(rotation));
  const angle = TWO_PI / npoints;
  const halfAngle = angle / 2;
  layer.beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = cos(a) * radius1;
    let sy = sin(a) * radius1;
    layer.vertex(sx, sy);
    sx = cos(a + halfAngle) * radius2;
    sy = sin(a + halfAngle) * radius2;
    layer.vertex(sx, sy);
  }
  layer.endShape(CLOSE);
  layer.pop();
}

// Expose to global scope
if (typeof window !== 'undefined') {
  window.BRUSH_SHAPES = BRUSH_SHAPES;
}
