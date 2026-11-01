// patterns.js
// ====== USAGE NOTES ======
/*
To use these patterns in your Scratch-Off Pro application:

1. Replace the entire PATTERN_REGISTRY object in your HTML file with this code
2. All patterns are organized by category for easy navigation
3. Each pattern includes:
   - name: Display name in the dropdown
   - category: Group for organizing in the dropdown
   - color: Representative color for particles/effects
   - draw: Function that renders the pattern to a p5.js graphics layer

4. The patterns from your image (#1-#12) are implemented at the top
5. Original patterns are improved with better algorithms
6. New creative patterns add variety across categories:
   - Rainbow Stripes (from image)
   - Rainbow (original improved)
   - Nature (aurora, sunset, ocean, fire)
   - Metallic (gold, silver, copper)
   - Space (starry night, galaxy, nebula)
   - Geometric (triangles, hexagons, diamonds)

7. All patterns are optimized for performance and visual quality
8. Colors automatically sync with particle effects when scratching
*/

// https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTWHHPzK9JbSP6cXJOTLQ91VJ4IFuAnpibcBHlI6iAm7we_FVpQhfidi7p1RuPq4t7DvHLOQD-WHjSy7qgJ93xwoH9sbRBzeHqrmjm4g0MoJ3YkCiZrRrUGs5zUSYXckxMSZ4Xdye_rJo/s640/rainbow-backgrounds.png
const PATTERN_REGISTRY = {
  // ========== PATTERNS FROM IMAGE ==========
  
  'diagonal-rainbow': {
    name: '#1 Diagonal Rainbow',
    category: 'Rainbow Stripes',
    color: '#ff6b9d',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const stripeWidth = 30;
      const totalStripes = Math.ceil((layer.width + layer.height) / stripeWidth) * 2;
      
      for (let i = 0; i < totalStripes; i++) {
        const hue = (i * 15) % 360;
        layer.fill(hue, 85, 95);
        layer.quad(
          i * stripeWidth - layer.height, 0,
          (i + 1) * stripeWidth - layer.height, 0,
          (i + 1) * stripeWidth, layer.height,
          i * stripeWidth, layer.height
        );
      }
      layer.colorMode(RGB);
    }
  },
  
  'vertical-gradient': {
    name: '#2 Vertical Rainbow',
    category: 'Rainbow Stripes',
    color: '#00d4ff',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      for (let y = 0; y < layer.height; y++) {
        const hue = map(y, 0, layer.height, 0, 360);
        layer.fill(hue, 90, 95);
        layer.rect(0, y, layer.width, 1);
      }
      layer.colorMode(RGB);
    }
  },
  
  'wavy-rainbow': {
    name: '#3 Rainbow Waves',
    category: 'Rainbow Stripes',
    color: '#ff1493',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const stripeHeight = 25;
      
      for (let y = -50; y < layer.height + 50; y += stripeHeight) {
        const hue = map(y, 0, layer.height, 0, 360);
        layer.fill(hue, 90, 95);
        
        layer.beginShape();
        for (let x = 0; x <= layer.width; x += 5) {
          const wave = sin(x * 0.02 + y * 0.05) * 20;
          layer.vertex(x, y + wave);
        }
        for (let x = layer.width; x >= 0; x -= 5) {
          const wave = sin(x * 0.02 + (y + stripeHeight) * 0.05) * 20;
          layer.vertex(x, y + stripeHeight + wave);
        }
        layer.endShape(CLOSE);
      }
      layer.colorMode(RGB);
    }
  },
  
  'vertical-bars': {
    name: '#4 Vertical Color Bars',
    category: 'Rainbow Stripes',
    color: '#9370db',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const barWidth = 15;
      const numBars = Math.ceil(layer.width / barWidth);
      
      for (let i = 0; i < numBars; i++) {
        const hue = (i * 30) % 360;
        layer.fill(hue, 95, 90);
        layer.rect(i * barWidth, 0, barWidth, layer.height);
      }
      layer.colorMode(RGB);
    }
  },
  
  'horizontal-gradient': {
    name: '#5 Horizontal Rainbow',
    category: 'Rainbow Stripes',
    color: '#ffa500',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      for (let x = 0; x < layer.width; x++) {
        const hue = map(x, 0, layer.width, 0, 360);
        layer.fill(hue, 85, 95);
        layer.rect(x, 0, 1, layer.height);
      }
      layer.colorMode(RGB);
    }
  },
  
  'radial-burst': {
    name: '#6 Radial Rainbow Burst',
    category: 'Rainbow Stripes',
    color: '#ff69b4',
    draw: (layer) => {
      layer.push();

      layer.colorMode(HSB);
      layer.noStroke();
      layer.translate(layer.width / 2, layer.height / 2);
      
      const rays = 360;
      const maxRadius = Math.sqrt(layer.width * layer.width + layer.height * layer.height);
      
      for (let angle = 0; angle < 360; angle += 360 / rays) {
        const hue = angle;
        layer.fill(hue, 90, 95);
        layer.beginShape();
        layer.vertex(0, 0);
        const rad = radians(angle);
        layer.vertex(cos(rad) * maxRadius, sin(rad) * maxRadius);
        const nextRad = radians(angle + 360 / rays);
        layer.vertex(cos(nextRad) * maxRadius, sin(nextRad) * maxRadius);
        layer.endShape(CLOSE);
      }
      layer.colorMode(RGB);
      layer.pop();
    }
  },
  
  'spiral-rainbow': {
  name: '#7 Rainbow Spiral',
  category: 'Rainbow Stripes',
  color: '#da70d6',
  draw: (layer) => {
    layer.colorMode(HSB);
    layer.noStroke();
    layer.background(240, 10, 96);

    const cx = layer.width / 2;
    const cy = layer.height / 2;
    const maxRadius = Math.sqrt(cx * cx + cy * cy);
    const arms = 3;
    const pointsPerArm = 1000;

    for (let arm = 0; arm < arms; arm++) {
      const baseAngle = (TWO_PI / arms) * arm;

      for (let i = 0; i < pointsPerArm; i++) {
        const t = i / pointsPerArm;
        const radius = t * maxRadius;

        if (radius > maxRadius) break;

        // Spiral curve + jitter
        const angle = baseAngle + t * 20.0;   // how tight the spiral is
        const jitterR = randomGaussian() * 6;
        const jitterA = randomGaussian() * 0.06;

        const r2 = radius + jitterR;
        const a2 = angle + jitterA;

        const x = cx + cos(a2) * r2;
        const y = cy + sin(a2) * r2;

        const hue = (t * 360 * 2) % 360;
        const bri = map(t, 0, 1, 100, 40);
        const alpha = map(t, 0, 1, 255, 60);
        const size = map(t, 0, 1, 18, 6);

        layer.fill(hue, 90, bri, alpha);
        layer.circle(x, y, size);
      }
    }

    // Tiny background stars to add depth
    for (let i = 0; i < 200; i++) {
      const x = random(layer.width);
      const y = random(layer.height);
      const size = random(1, 2);
      const alpha = random(80, 180);
      layer.fill(0, 0, 100, alpha);
      layer.circle(x, y, size);
    }

    layer.colorMode(RGB);
  }
},

  
  'zigzag-rainbow': {
    name: '#8 Rainbow Zigzag',
    category: 'Rainbow Stripes',
    color: '#7fff00',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const zigzagHeight = 40;
      const zigzagWidth = 50;
      
      for (let y = -zigzagHeight; y < layer.height + zigzagHeight; y += zigzagHeight) {
        const hue = map(y, 0, layer.height, 0, 360);
        layer.fill(hue, 90, 95);
        
        layer.beginShape();
        for (let x = -zigzagWidth; x <= layer.width + zigzagWidth; x += zigzagWidth) {
          layer.vertex(x, y);
          layer.vertex(x + zigzagWidth / 2, y + zigzagHeight / 2);
        }
        layer.vertex(layer.width + zigzagWidth, y + zigzagHeight);
        for (let x = layer.width + zigzagWidth; x >= -zigzagWidth; x -= zigzagWidth) {
          layer.vertex(x + zigzagWidth / 2, y + zigzagHeight / 2);
          layer.vertex(x, y + zigzagHeight);
        }
        layer.endShape(CLOSE);
      }
      layer.colorMode(RGB);
    }
  },
  
  'diagonal-rainbow-reverse': {
    name: '#9 Diagonal Rainbow (Reverse)',
    category: 'Rainbow Stripes',
    color: '#4169e1',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const stripeWidth = 30;
      const totalStripes = Math.ceil((layer.width + layer.height) / stripeWidth) * 2;
      
      for (let i = 0; i < totalStripes; i++) {
        const hue = (i * 15) % 360;
        layer.fill(hue, 85, 95);
        layer.quad(
          layer.width - (i * stripeWidth - layer.height), 0,
          layer.width - ((i + 1) * stripeWidth - layer.height), 0,
          layer.width - ((i + 1) * stripeWidth), layer.height,
          layer.width - (i * stripeWidth), layer.height
        );
      }
      layer.colorMode(RGB);
    }
  },
  
  'horizontal-bars': {
    name: '#10 Horizontal Rainbow Bars',
    category: 'Rainbow Stripes',
    color: '#ff4500',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const barHeight = 50;
      const numBars = Math.ceil(layer.height / barHeight);
      
      for (let i = 0; i < numBars; i++) {
        const hue = (i * 40) % 360;
        layer.fill(hue, 90, 95);
        layer.rect(0, i * barHeight, layer.width, barHeight);
      }
      layer.colorMode(RGB);
    }
  },
  
  'concentric-rainbow': {
  name: '#11 Concentric Rainbow',
  category: 'Rainbow Stripes',
  color: '#ff1493',
  draw: (layer) => {
    layer.colorMode(HSB);
    layer.noStroke();
    layer.background(0, 0, 96);

    const cx = layer.width / 2;
    const cy = layer.height / 2;
    const maxRadius = Math.max(cx, cy) * 1.1;
    const ringWidth = 14;

    // Slight random wobble seed so each render is unique
    const wobbleSeed = random(1000);

    for (let r = maxRadius; r > 0; r -= ringWidth) {
      const t = r / maxRadius;
      const hue = map(t, 1, 0, 0, 360);
      const sat = 90;
      const bri = 95;

      // Subtle irregularity using noise
      const wobble = (noise(wobbleSeed + r * 0.02) - 0.5) * 18;

      layer.fill(hue, sat, bri);
      layer.ellipse(
        cx,
        cy,
        r * 2 + wobble,
        r * 2 * 1.3 + wobble * 1.1
      );
    }

    // Soft white glow at the center
    for (let i = 0; i < 6; i++) {
      const rr = map(i, 0, 5, 120, 0);
      const alpha = map(i, 0, 5, 60, 255);
      layer.fill(0, 0, 100, alpha);
      layer.ellipse(cx, cy, rr, rr);
    }

    layer.colorMode(RGB);
  }
},

  
  'mosaic-rainbow': {
    name: '#12 Rainbow Mosaic',
    category: 'Rainbow Stripes',
    color: '#00ced1',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const tileSize = 40;
      
      for (let y = 0; y < layer.height + tileSize; y += tileSize) {
        for (let x = 0; x < layer.width + tileSize; x += tileSize) {
          const hue = (x * 0.5 + y * 0.5) % 360;
          layer.fill(hue, 90, 95);
          
          layer.push();
          layer.translate(x + tileSize / 2, y + tileSize / 2);
          layer.rotate(noise(x * 0.01, y * 0.01) * TWO_PI);
          layer.rectMode(CENTER);
          layer.rect(0, 0, tileSize * 0.9, tileSize * 0.9, 5);
          layer.pop();
        }
      }
      layer.colorMode(RGB);
    }
  },

  // ========== IMPROVED ORIGINAL PATTERNS ==========
  
  'gradient': {
    name: 'Rainbow Gradient',
    category: 'Rainbow',
    color: '#ff6b9d',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      // Smooth horizontal gradient with enhanced saturation
      for (let x = 0; x < layer.width; x++) {
        const hue = map(x, 0, layer.width, 0, 360);
        layer.fill(hue, 90, 95);
        layer.rect(x, 0, 1, layer.height);
      }
      layer.colorMode(RGB);
    }
  },
  
  'stripes': {
    name: 'Rainbow Stripes',
    category: 'Rainbow',
    color: '#ffd700',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      const stripeHeight = 50;
      
      for (let y = 0; y < layer.height + stripeHeight; y += stripeHeight) {
        const hue = map(y, 0, layer.height, 0, 360);
        layer.fill(hue, 85, 95);
        
        // Organic wavy edges
        layer.beginShape();
        for (let x = 0; x <= layer.width; x += 8) {
          const offset = noise(x * 0.008, y * 0.008) * 30 - 15;
          layer.vertex(x, y + offset);
        }
        for (let x = layer.width; x >= 0; x -= 8) {
          const offset = noise(x * 0.008, (y + stripeHeight) * 0.008) * 30 - 15;
          layer.vertex(x, y + stripeHeight + offset);
        }
        layer.endShape(CLOSE);
      }
      layer.colorMode(RGB);
    }
  },
  
  'glitter': {
    name: 'Holographic Glitter',
    category: 'Rainbow',
    color: '#00d4ff',
    draw: (layer) => {
      layer.background(250, 250, 255);
      layer.colorMode(HSB);
      layer.noStroke();
      
      // Multiple layers of sparkles with varying sizes
      for (let i = 0; i < 12000; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        const hue = random(360);
        const size = random(1, 7);
        const alpha = random(80, 255);
        const sat = random(50, 100);
        const bright = random(70, 100);
        
        layer.fill(hue, sat, bright, alpha);
        
        // Mix of circles and stars for variety
        if (random() > 0.7) {
          layer.push();
          layer.translate(x, y);
          layer.rotate(random(TWO_PI));
          layer.beginShape();
          for (let a = 0; a < TWO_PI; a += TWO_PI / 4) {
            const r1 = size;
            const r2 = size * 0.4;
            layer.vertex(cos(a) * r1, sin(a) * r1);
            layer.vertex(cos(a + PI / 4) * r2, sin(a + PI / 4) * r2);
          }
          layer.endShape(CLOSE);
          layer.pop();
        } else {
          layer.circle(x, y, size);
        }
      }
      layer.colorMode(RGB);
    }
  },

  // ========== NEW CREATIVE PATTERNS ==========
  
  'aurora': {
    name: 'Aurora Borealis',
    category: 'Nature',
    color: '#00ff7f',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.background(200, 40, 15);
      layer.noStroke();
      
      // Create flowing aurora waves
      for (let i = 0; i < 8; i++) {
        const baseY = random(layer.height * 0.3, layer.height * 0.7);
        const hue = random([120, 140, 160, 180, 280]);
        
        for (let j = 0; j < 100; j++) {
          const alpha = random(10, 40);
          layer.fill(hue, random(60, 90), random(60, 90), alpha);
          
          layer.beginShape();
          for (let x = 0; x <= layer.width; x += 10) {
            const y1 = baseY + sin(x * 0.01 + j * 0.5) * 40 + noise(x * 0.01, j * 0.1) * 60;
            layer.vertex(x, y1);
          }
          for (let x = layer.width; x >= 0; x -= 10) {
            const y2 = baseY + sin(x * 0.01 + j * 0.5) * 40 + noise(x * 0.01, j * 0.1) * 60 + 30;
            layer.vertex(x, y2);
          }
          layer.endShape(CLOSE);
        }
      }
      layer.colorMode(RGB);
    }
  },
  
  'sunset': {
    name: 'Sunset Sky',
    category: 'Nature',
    color: '#ff6347',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      
      // Gradient from orange to purple
      for (let y = 0; y < layer.height; y++) {
        const t = y / layer.height;
        let hue, sat, bright;
        
        if (t < 0.3) {
          // Yellow to orange
          hue = lerp(40, 15, t / 0.3);
          sat = lerp(80, 95, t / 0.3);
          bright = 95;
        } else if (t < 0.6) {
          // Orange to pink
          hue = lerp(15, 340, (t - 0.3) / 0.3);
          sat = 90;
          bright = lerp(95, 80, (t - 0.3) / 0.3);
        } else {
          // Pink to purple
          hue = lerp(340, 280, (t - 0.6) / 0.4);
          sat = lerp(90, 70, (t - 0.6) / 0.4);
          bright = lerp(80, 40, (t - 0.6) / 0.4);
        }
        
        layer.fill(hue, sat, bright);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add some clouds
      layer.noStroke();
      for (let i = 0; i < 15; i++) {
        const x = random(layer.width);
        const y = random(layer.height * 0.3, layer.height * 0.8);
        const size = random(40, 100);
        layer.fill(0, 0, 100, random(10, 30));
        
        for (let j = 0; j < 5; j++) {
          layer.ellipse(x + random(-size/2, size/2), y + random(-10, 10), size * random(0.5, 1), size * 0.4);
        }
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'ocean': {
    name: 'Ocean Waves',
    category: 'Nature',
    color: '#1e90ff',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      
      // Base ocean gradient
      for (let y = 0; y < layer.height; y++) {
        const depth = y / layer.height;
        const hue = lerp(190, 210, depth);
        const sat = lerp(60, 90, depth);
        const bright = lerp(90, 40, depth);
        layer.fill(hue, sat, bright);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add wave patterns
      layer.noFill();
      layer.strokeWeight(2);
      for (let i = 0; i < 20; i++) {
        const y = random(layer.height);
        const hue = 200;
        layer.stroke(hue, 40, 80, random(30, 80));
        
        layer.beginShape();
        for (let x = 0; x <= layer.width; x += 5) {
          const wave = sin(x * 0.02 + y * 0.01 + i) * 15;
          layer.vertex(x, y + wave);
        }
        layer.endShape();
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'fire': {
    name: 'Flames',
    category: 'Nature',
    color: '#ff4500',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      
      // Dark background
      layer.background(15, 80, 10);
      
      // Create flame effect from bottom
      for (let x = 0; x < layer.width; x += 3) {
        for (let y = layer.height; y > 0; y -= 5) {
          const intensity = map(y, layer.height, 0, 0, 1);
          const flicker = noise(x * 0.02, y * 0.02, frameCount * 0.05);
          
          let hue, sat, bright, alpha;
          if (intensity < 0.3) {
            // Yellow-white at base
            hue = lerp(50, 45, flicker);
            sat = lerp(80, 100, flicker);
            bright = lerp(95, 100, flicker);
            alpha = random(50, 150);
          } else if (intensity < 0.6) {
            // Orange middle
            hue = lerp(30, 15, flicker);
            sat = 100;
            bright = lerp(90, 95, flicker);
            alpha = random(40, 120);
          } else {
            // Red top
            hue = lerp(10, 0, flicker);
            sat = lerp(90, 100, flicker);
            bright = lerp(70, 90, flicker);
            alpha = random(20, 80);
          }
          
          const size = random(5, 15) * (1 - intensity);
          layer.fill(hue, sat, bright, alpha);
          layer.circle(x + random(-10, 10), y + random(-5, 5), size);
        }
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'gold': {
    name: 'Gold Luxury',
    category: 'Metallic',
    color: '#daa520',
    draw: (layer) => {
      // Rich gold gradient background
      layer.noStroke();
      for (let y = 0; y < layer.height; y++) {
        const t = y / layer.height;
        const r = lerp(218, 184, t);
        const g = lerp(165, 134, t);
        const b = lerp(32, 11, t);
        layer.fill(r, g, b);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add sparkles and highlights
      layer.noStroke();
      for (let i = 0; i < 6000; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        const size = random(1, 5);
        const brightness = random(180, 255);
        const alpha = random(50, 200);
        
        // Gold tones
        layer.fill(brightness, brightness * 0.8, brightness * 0.3, alpha);
        layer.circle(x, y, size);
      }
      
      // Add larger highlights
      for (let i = 0; i < 30; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        layer.fill(255, 245, 200, random(80, 150));
        layer.circle(x, y, random(10, 25));
      }
    }
  },
  
  'silver': {
    name: 'Silver Metallic',
    category: 'Metallic',
    color: '#c0c0c0',
    draw: (layer) => {
      // Silver gradient background
      layer.noStroke();
      for (let y = 0; y < layer.height; y++) {
        const t = y / layer.height;
        const brightness = lerp(200, 140, t);
        layer.fill(brightness, brightness, brightness + 10);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add metallic sparkles
      for (let i = 0; i < 7000; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        const size = random(1, 4);
        const brightness = random(150, 255);
        const alpha = random(60, 180);
        
        layer.fill(brightness, brightness, brightness + random(-10, 10), alpha);
        layer.circle(x, y, size);
      }
      
      // Add streaks for metallic effect
      layer.strokeWeight(1);
      for (let i = 0; i < 50; i++) {
        const x = random(layer.width);
        const y1 = random(layer.height);
        const y2 = y1 + random(-50, 50);
        const alpha = random(20, 60);
        layer.stroke(255, 255, 255, alpha);
        layer.line(x, y1, x, y2);
      }
    }
  },
  
  'copper': {
    name: 'Copper Shine',
    category: 'Metallic',
    color: '#b87333',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.noStroke();
      
      // Copper gradient background
      for (let y = 0; y < layer.height; y++) {
        const t = y / layer.height;
        const hue = lerp(25, 20, t);
        const sat = lerp(75, 85, t);
        const bright = lerp(85, 50, t);
        layer.fill(hue, sat, bright);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add sparkles
      for (let i = 0; i < 5000; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        const size = random(1, 4);
        const hue = random(20, 30);
        const alpha = random(50, 180);
        
        layer.fill(hue, random(60, 80), random(70, 100), alpha);
        layer.circle(x, y, size);
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'starrynight': {
    name: 'Starry Night',
    category: 'Space',
    color: '#191970',
    draw: (layer) => {
      // Deep night sky gradient
      layer.noStroke();
      for (let y = 0; y < layer.height; y++) {
        const t = y / layer.height;
        const r = lerp(10, 5, t);
        const g = lerp(15, 5, t);
        const b = lerp(35, 20, t);
        layer.fill(r, g, b);
        layer.rect(0, y, layer.width, 1);
      }
      
      // Add stars with various sizes and brightness
      layer.noStroke();
      for (let i = 0; i < 400; i++) {
        const x = random(layer.width);
        const y = random(layer.height);
        const size = random(1, 5);
        const brightness = random(150, 255);
        const twinkle = random(100, 255);
        
        // Star with glow
        layer.fill(brightness, brightness, 220, twinkle);
        layer.circle(x, y, size);
        
        // Add glow around larger stars
        if (size > 3) {
          layer.fill(brightness, brightness, 220, twinkle * 0.3);
          layer.circle(x, y, size * 2);
        }
      }
      
      // Add a few shooting stars
      layer.strokeWeight(2);
      for (let i = 0; i < 5; i++) {
        const x1 = random(layer.width);
        const y1 = random(layer.height * 0.5);
        const length = random(30, 80);
        const angle = random(PI / 6, PI / 3);
        const x2 = x1 + cos(angle) * length;
        const y2 = y1 + sin(angle) * length;
        
        layer.stroke(255, 255, 240, random(100, 200));
        layer.line(x1, y1, x2, y2);
      }
    }
  },
  
  'galaxy': {
  name: 'Galaxy Nebula',
  category: 'Space',
  color: '#9370db',
  draw: (layer) => {
    const w = layer.width;
    const h = layer.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);

    layer.background(5, 5, 10); // very dark
    layer.colorMode(HSB);
    layer.noStroke();

    // --- Soft galactic core (radial gradient) ---
    layer.push();
    layer.translate(cx, cy);
    for (let r = maxR; r > 0; r -= 6) {
      const t = r / maxR;
      const hue = map(t, 1, 0, 250, 310);     // purple-ish core
      const sat = map(t, 1, 0, 30, 5);
      const bri = map(t, 1, 0, 10, 98);
      const alpha = map(t, 1, 0, 0, 220);

      layer.fill(hue, sat, bri, alpha);
      layer.ellipse(0, 0, r * 2, r * 2 * 0.7);
    }
    layer.pop();

    // --- Spiral arms with star clusters ---
    const arms = 3;
    for (let arm = 0; arm < arms; arm++) {
      const baseAngle = (TWO_PI / arms) * arm;

      for (let i = 0; i < 1200; i++) {
        const t = i / 1200;
        const angle = baseAngle + t * 5.0;           // arm curve
        const radius = t * maxR * 1.1;

        const jitterR = randomGaussian() * 8;
        const jitterA = randomGaussian() * 0.08;

        const r2 = radius + jitterR;
        const a2 = angle + jitterA;

        const x = cx + cos(a2) * r2;
        const y = cy + sin(a2) * r2;

        const hue = random([260, 280, 300, 200, 190]);
        const sat = random(40, 95);
        const bri = random(40, 95);
        const alpha = map(t, 0, 1, 220, 40);

        layer.fill(hue, sat, bri, alpha);
        layer.circle(x, y, random(4, 10));
      }
    }

    // --- Nebula clouds overlay ---
    for (let i = 0; i < 35; i++) {
      const x = random(w);
      const y = random(h);
      const baseHue = random([280, 300, 320, 200, 180]);
      const size = random(60, 140);

      for (let j = 0; j < 80; j++) {
        const ox = randomGaussian() * size * 0.5;
        const oy = randomGaussian() * size * 0.4;
        const particleSize = random(12, 32);

        const d = dist(0, 0, ox, oy) / size;
        const alpha = map(d, 0, 1.5, 45, 0);

        if (alpha <= 0) continue;

        layer.fill(baseHue, random(50, 90), random(35, 80), alpha);
        layer.circle(x + ox, y + oy, particleSize);
      }
    }

    // --- Bright stars ---
    for (let i = 0; i < 260; i++) {
      const x = random(w);
      const y = random(h);
      const size = random(1, 4);
      const brightness = random(80, 100);
      const alpha = random(150, 255);

      layer.fill(0, 0, brightness, alpha);
      layer.circle(x, y, size);
    }

    // Lens flare-like center stars
    for (let i = 0; i < 14; i++) {
      const x = cx + randomGaussian() * 40;
      const y = cy + randomGaussian() * 40;
      const size = random(6, 16);
      const hue = random(40, 60);

      layer.fill(hue, 20, 100, 230);
      layer.circle(x, y, size);
    }

    layer.colorMode(RGB);
  }
},

  
  'nebula': {
  name: 'Colorful Nebula',
  category: 'Space',
  color: '#ff1493',
  draw: (layer) => {
    layer.background(0, 0, 5);      // deep space
    layer.colorMode(HSB);
    layer.noStroke();

    const w = layer.width;
    const h = layer.height;

    // --- Noise-based base cloud layer ---
    const noiseScale = 0.008;
    const step = 8; // bigger step = faster render

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const n = noise(x * noiseScale, y * noiseScale);
        if (n < 0.35) continue; // skip dark pockets

        // Map noise to hue/sat/bright
        const hue = map(n, 0.35, 1, 0, 360);
        const sat = map(n, 0.35, 1, 60, 100);
        const bri = map(n, 0.35, 1, 25, 80);
        const alpha = map(n, 0.35, 1, 15, 35);

        layer.fill(hue, sat, bri, alpha);
        layer.circle(x, y, step * 2.2);
      }
    }

    // --- Swirly highlight plumes (your old idea, but a bit softer) ---
    for (let i = 0; i < 40; i++) {
      const cx = random(w);
      const cy = random(h);
      const baseHue = random(360);
      const angle0 = random(TWO_PI);

      for (let j = 0; j < 80; j++) {
        const radius = j * random(1.8, 2.4);
        const spiralAngle = angle0 + j * random(0.08, 0.12);
        const nx = cx + cos(spiralAngle) * radius;
        const ny = cy + sin(spiralAngle) * radius;

        const size = random(12, 32);
        const alpha = random(10, 35);
        const hue = (baseHue + j * random(-1.5, 1.5)) % 360;

        layer.fill(hue, random(70, 100), random(55, 95), alpha);
        layer.circle(nx, ny, size);
      }
    }

    // --- Dark dust lanes (subtle) ---
    layer.blendMode(MULTIPLY);
    for (let i = 0; i < 20; i++) {
      const cx = random(w);
      const cy = random(h);
      const rx = random(80, 220);
      const ry = random(40, 140);
      const rot = random(TWO_PI);

      layer.push();
      layer.translate(cx, cy);
      layer.rotate(rot);
      const alpha = random(30, 70);
      layer.fill(0, 0, 0, alpha);
      layer.ellipse(0, 0, rx, ry);
      layer.pop();
    }
    layer.blendMode(BLEND);

    // --- Star field ---
    for (let i = 0; i < 500; i++) {
      const x = random(w);
      const y = random(h);
      const size = random(1, 3.5);
      const brightness = random(75, 100);
      const alpha = random(150, 255);

      layer.fill(0, 0, brightness, alpha);
      layer.circle(x, y, size);
    }

    // Occasional big glowing stars
    for (let i = 0; i < 40; i++) {
      const x = random(w);
      const y = random(h);
      const size = random(6, 18);
      const brightness = random(85, 100);

      layer.fill(random(40, 60), random(10, 40), brightness, 200);
      layer.circle(x, y, size);
    }

    layer.colorMode(RGB);
  }
},

  
  'geometric': {
    name: 'Geometric Triangles',
    category: 'Geometric',
    color: '#ff6b9d',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.strokeWeight(2);
      layer.stroke(0, 0, 0, 50);
      
      const triangleSize = 60;
      const rows = Math.ceil(layer.height / (triangleSize * 0.866)) + 1;
      const cols = Math.ceil(layer.width / triangleSize) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * triangleSize + (row % 2) * (triangleSize / 2);
          const y = row * triangleSize * 0.866;
          const hue = (x * 0.5 + y * 0.5) % 360;
          
          layer.fill(hue, 80, 90);
          
          // Draw triangle
          layer.triangle(
            x, y,
            x + triangleSize / 2, y + triangleSize * 0.866,
            x - triangleSize / 2, y + triangleSize * 0.866
          );
        }
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'hexagons': {
  name: 'Honeycomb Pattern',
  category: 'Geometric',
  color: '#ffa500',
  draw: (layer) => {
    layer.colorMode(HSB);
    layer.strokeWeight(2.5);
    layer.stroke(40, 80, 20, 180); // darker honey borders

    const hexSize = 40;
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;

    for (let row = -1; row < layer.height / hexHeight + 2; row++) {
      for (let col = -1; col < layer.width / hexWidth + 2; col++) {
        const x = col * hexWidth * 0.75;
        const y = row * hexHeight + (col % 2) * hexHeight / 2;

        // Slight randomization per cell
        const jitter = noise(x * 0.01, y * 0.01);
        const baseHue = 40 + map(jitter, 0, 1, -4, 6);   // warm yellow/orange
        const sat = 80 + map(jitter, 0, 1, -10, 10);
        const bri = 80 + map(jitter, 0, 1, -20, 10);

        // Some cells darker, like filled with thicker honey
        const darkFactor = random() < 0.15 ? random(0.6, 0.9) : 1;
        layer.fill(baseHue, sat, bri * darkFactor, 230);

        // Outer hexagon
        layer.beginShape();
        for (let i = 0; i < 6; i++) {
          const angle = PI / 3 * i;
          const hx = x + cos(angle) * hexSize;
          const hy = y + sin(angle) * hexSize;
          layer.vertex(hx, hy);
        }
        layer.endShape(CLOSE);

        // Inner highlight to give a glossy look
        layer.noStroke();
        const innerSize = hexSize * 0.7;
        const highlightBri = min(100, bri + 15);
        layer.fill(baseHue, sat * 0.4, highlightBri, 140);
        layer.beginShape();
        for (let i = 0; i < 6; i++) {
          const angle = PI / 3 * i;
          const hx = x + cos(angle) * innerSize;
          const hy = y + sin(angle) * innerSize;
          layer.vertex(hx, hy);
        }
        layer.endShape(CLOSE);

        // Restore stroke for next cell
        layer.stroke(40, 80, 20, 180);
      }
    }

    layer.colorMode(RGB);
  }
},

  
  'diamonds': {
    name: 'Diamond Grid',
    category: 'Geometric',
    color: '#00ced1',
    draw: (layer) => {
      layer.colorMode(HSB);
      layer.strokeWeight(2);
      layer.stroke(0, 0, 100, 50);
      
      const size = 50;
      
      for (let y = -size; y < layer.height + size; y += size) {
        for (let x = -size; x < layer.width + size; x += size) {
          const hue = (x * 0.7 + y * 0.7) % 360;
          layer.fill(hue, 80, 90);
          
          // Draw diamond (rotated square)
          layer.push();
          layer.translate(x + size / 2, y + size / 2);
          layer.rotate(PI / 4);
          layer.rectMode(CENTER);
          layer.square(0, 0, size * 0.7);
          layer.pop();
        }
      }
      
      layer.colorMode(RGB);
    }
  },
  
  'custom': {
    name: 'Custom Image',
    category: 'Custom',
    color: '#808080',
    draw: (layer) => {
      if (customBgImage) {
        layer.image(customBgImage, 0, 0, layer.width, layer.height);
      } else {
        layer.background(200);
      }
    }
  }
};

// expose to the rest of your code
if (typeof window !== "undefined") {
  window.PATTERN_REGISTRY = PATTERN_REGISTRY;
}
