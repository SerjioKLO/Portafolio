/**
 * DITHER BACKGROUND COMPONENT (WebGL Vanilla Engine)
 * Recreación fiel del componente Dither de React Bits para entornos Vanilla JS / WebGL.
 * Implementa shaders de ondas perlin/fbm y dithering Bayer 8x8 con interacción por cursor.
 */

(function (global) {
  'use strict';

  const VS_SOURCE = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const FS_SOURCE = `
    precision highp float;
    varying vec2 vUv;

    uniform vec2 resolution;
    uniform float time;
    uniform float waveSpeed;
    uniform float waveFrequency;
    uniform float waveAmplitude;
    uniform vec3 waveColor;
    uniform vec2 mousePos;
    uniform int enableMouseInteraction;
    uniform float mouseRadius;
    uniform float colorNum;
    uniform float pixelSize;

    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

    float cnoise(vec2 P) {
      vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
      vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
      Pi = mod289(Pi);
      vec4 ix = Pi.xzxz;
      vec4 iy = Pi.yyww;
      vec4 fx = Pf.xzxz;
      vec4 fy = Pf.yyww;
      vec4 i = permute(permute(ix) + iy);
      vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
      vec4 gy = abs(gx) - 0.5;
      vec4 tx = floor(gx + 0.5);
      gx = gx - tx;
      vec2 g00 = vec2(gx.x, gy.x);
      vec2 g10 = vec2(gx.y, gy.y);
      vec2 g01 = vec2(gx.z, gy.z);
      vec2 g11 = vec2(gx.w, gy.w);
      vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
      g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
      float n00 = dot(g00, vec2(fx.x, fy.x));
      float n10 = dot(g10, vec2(fx.y, fy.y));
      float n01 = dot(g01, vec2(fx.z, fy.z));
      float n11 = dot(g11, vec2(fx.w, fy.w));
      vec2 fade_xy = fade(Pf.xy);
      vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
      return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
    }

    const int OCTAVES = 4;
    float fbm(vec2 p) {
      float value = 0.0;
      float amp = 1.0;
      float freq = waveFrequency;
      for (int i = 0; i < OCTAVES; i++) {
        value += amp * abs(cnoise(p));
        p *= freq;
        amp *= waveAmplitude;
      }
      return value;
    }

    float pattern(vec2 p) {
      vec2 p2 = p - time * waveSpeed;
      return fbm(p + fbm(p2)); 
    }

    float getBayer8x8(int x, int y) {
      int idx = y * 8 + x;
      if (idx < 16) {
        if (idx == 0) return 0.0/64.0; if (idx == 1) return 48.0/64.0; if (idx == 2) return 12.0/64.0; if (idx == 3) return 60.0/64.0;
        if (idx == 4) return 3.0/64.0; if (idx == 5) return 51.0/64.0; if (idx == 6) return 15.0/64.0; if (idx == 7) return 63.0/64.0;
        if (idx == 8) return 32.0/64.0; if (idx == 9) return 16.0/64.0; if (idx == 10) return 44.0/64.0; if (idx == 11) return 28.0/64.0;
        if (idx == 12) return 35.0/64.0; if (idx == 13) return 19.0/64.0; if (idx == 14) return 47.0/64.0; return 31.0/64.0;
      } else if (idx < 32) {
        if (idx == 16) return 8.0/64.0; if (idx == 17) return 56.0/64.0; if (idx == 18) return 4.0/64.0; if (idx == 19) return 52.0/64.0;
        if (idx == 20) return 11.0/64.0; if (idx == 21) return 59.0/64.0; if (idx == 22) return 7.0/64.0; if (idx == 23) return 55.0/64.0;
        if (idx == 24) return 40.0/64.0; if (idx == 25) return 24.0/64.0; if (idx == 26) return 36.0/64.0; if (idx == 27) return 20.0/64.0;
        if (idx == 28) return 43.0/64.0; if (idx == 29) return 27.0/64.0; if (idx == 30) return 39.0/64.0; return 23.0/64.0;
      } else if (idx < 48) {
        if (idx == 32) return 2.0/64.0; if (idx == 33) return 50.0/64.0; if (idx == 34) return 14.0/64.0; if (idx == 35) return 62.0/64.0;
        if (idx == 36) return 1.0/64.0; if (idx == 37) return 49.0/64.0; if (idx == 38) return 13.0/64.0; if (idx == 39) return 61.0/64.0;
        if (idx == 40) return 34.0/64.0; if (idx == 41) return 18.0/64.0; if (idx == 42) return 46.0/64.0; if (idx == 43) return 30.0/64.0;
        if (idx == 44) return 33.0/64.0; if (idx == 45) return 17.0/64.0; if (idx == 46) return 45.0/64.0; return 29.0/64.0;
      } else {
        if (idx == 48) return 10.0/64.0; if (idx == 49) return 58.0/64.0; if (idx == 50) return 6.0/64.0; if (idx == 51) return 54.0/64.0;
        if (idx == 52) return 9.0/64.0; if (idx == 53) return 57.0/64.0; if (idx == 54) return 5.0/64.0; if (idx == 55) return 53.0/64.0;
        if (idx == 56) return 42.0/64.0; if (idx == 57) return 26.0/64.0; if (idx == 58) return 38.0/64.0; if (idx == 59) return 22.0/64.0;
        if (idx == 60) return 41.0/64.0; if (idx == 61) return 25.0/64.0; if (idx == 62) return 37.0/64.0; return 21.0/64.0;
      }
    }

    vec3 dither(vec2 coord, vec3 color) {
      vec2 scaledCoord = floor(coord / pixelSize);
      int x = int(mod(scaledCoord.x, 8.0));
      int y = int(mod(scaledCoord.y, 8.0));
      float threshold = getBayer8x8(x, y) - 0.25;
      float stepVal = 1.0 / (colorNum - 1.0);
      color += threshold * stepVal;
      float bias = 0.2;
      color = clamp(color - bias, 0.0, 1.0);
      return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv -= 0.5;
      uv.x *= resolution.x / resolution.y;
      float f = pattern(uv);
      if (enableMouseInteraction == 1) {
        vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
        mouseNDC.x *= resolution.x / resolution.y;
        float dist = length(uv - mouseNDC);
        float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
        f -= 0.5 * effect;
      }
      vec3 col = mix(vec3(0.0), waveColor, f);
      col = dither(gl_FragCoord.xy, col);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  class DitherBackground {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.getElementById(container) : container;
      if (!this.container) return;

      this.options = Object.assign({
        waveSpeed: 0.05,
        waveFrequency: 3.0,
        waveAmplitude: 0.3,
        waveColor: [0.86, 0.08, 0.24], // Carmesí temático
        colorNum: 4.0,
        pixelSize: 2.0,
        disableAnimation: false,
        enableMouseInteraction: true,
        mouseRadius: 0.3
      }, options);

      this.canvas = document.createElement('canvas');
      this.canvas.className = 'dither-canvas';
      this.container.appendChild(this.canvas);

      this.gl = this.canvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
      if (!this.gl) {
        console.warn('WebGL no disponible para DitherBackground');
        return;
      }

      this.mousePos = { x: -9999, y: -9999 };
      this.startTime = performance.now();
      this.animationFrame = null;
      this.isVisible = true;

      this.initShaders();
      this.initBuffers();
      this.initEvents();
      this.resize();
      this.render();
    }

    createShader(type, source) {
      const gl = this.gl;
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error al compilar shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    initShaders() {
      const gl = this.gl;
      const vertexShader = this.createShader(gl.VERTEX_SHADER, VS_SOURCE);
      const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, FS_SOURCE);

      this.program = gl.createProgram();
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error('Error al enlazar programa WebGL:', gl.getProgramInfoLog(this.program));
        return;
      }

      gl.useProgram(this.program);

      this.uniforms = {
        resolution: gl.getUniformLocation(this.program, 'resolution'),
        time: gl.getUniformLocation(this.program, 'time'),
        waveSpeed: gl.getUniformLocation(this.program, 'waveSpeed'),
        waveFrequency: gl.getUniformLocation(this.program, 'waveFrequency'),
        waveAmplitude: gl.getUniformLocation(this.program, 'waveAmplitude'),
        waveColor: gl.getUniformLocation(this.program, 'waveColor'),
        mousePos: gl.getUniformLocation(this.program, 'mousePos'),
        enableMouseInteraction: gl.getUniformLocation(this.program, 'enableMouseInteraction'),
        mouseRadius: gl.getUniformLocation(this.program, 'mouseRadius'),
        colorNum: gl.getUniformLocation(this.program, 'colorNum'),
        pixelSize: gl.getUniformLocation(this.program, 'pixelSize')
      };
    }

    initBuffers() {
      const gl = this.gl;
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(this.program, 'position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());

      if (this.options.enableMouseInteraction) {
        window.addEventListener('pointermove', (e) => {
          const rect = this.canvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          this.mousePos.x = (e.clientX - rect.left) * dpr;
          this.mousePos.y = (e.clientY - rect.top) * dpr;
        });

        window.addEventListener('mouseleave', () => {
          this.mousePos.x = -9999;
          this.mousePos.y = -9999;
        });
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !this.animationFrame) {
              this.render();
            }
          });
        }, { threshold: 0 });
        observer.observe(this.container);
      }
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(this.container.clientWidth * dpr);
      const height = Math.floor(this.container.clientHeight * dpr);

      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = Math.max(width, 1);
        this.canvas.height = Math.max(height, 1);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    render() {
      if (!this.isVisible) {
        this.animationFrame = null;
        return;
      }

      const gl = this.gl;
      const opt = this.options;
      const elapsedTime = opt.disableAnimation ? 0 : (performance.now() - this.startTime) * 0.001;

      gl.useProgram(this.program);

      gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
      gl.uniform1f(this.uniforms.time, elapsedTime);
      gl.uniform1f(this.uniforms.waveSpeed, opt.waveSpeed);
      gl.uniform1f(this.uniforms.waveFrequency, opt.waveFrequency);
      gl.uniform1f(this.uniforms.waveAmplitude, opt.waveAmplitude);
      gl.uniform3fv(this.uniforms.waveColor, opt.waveColor);
      gl.uniform2f(this.uniforms.mousePos, this.mousePos.x, this.mousePos.y);
      gl.uniform1i(this.uniforms.enableMouseInteraction, opt.enableMouseInteraction ? 1 : 0);
      gl.uniform1f(this.uniforms.mouseRadius, opt.mouseRadius);
      gl.uniform1f(this.uniforms.colorNum, opt.colorNum);
      gl.uniform1f(this.uniforms.pixelSize, opt.pixelSize);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      this.animationFrame = requestAnimationFrame(() => this.render());
    }

    destroy() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  global.DitherBackground = DitherBackground;

  global.initDitherBackground = function (containerId, options) {
    return new DitherBackground(containerId, options);
  };

})(typeof window !== 'undefined' ? window : this);
