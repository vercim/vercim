'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export type CloudShaderProps = {
  className?: string;
  children?: ReactNode;
  maskCanvasIds?: readonly string[];
  /** Animation speed multiplier. 1 = default drift. */
  speed?: number;
  /** Number of clouds (1-6). */
  count?: number;
  /** Cloud tint color (hex or rgb string). */
  cloudColor?: string;
  /** Sky color at the top (hex or rgb string). */
  skyTopColor?: string;
  /** Sky color at the bottom (hex or rgb string). */
  skyBottomColor?: string;
};

type CSSCanvasDocument = Document & {
  getCSSCanvasContext?: (type: 'webgl', name: string, width: number, height: number) => WebGLRenderingContext | null;
};

const webGLAttributes = { alpha: false, antialias: false, premultipliedAlpha: false };

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Each cloud is an asymmetric envelope (dome top, flat base) filled with
// domain-warped billow noise. A second density sample above the pixel
// approximates self-shadowing. Clouds drift horizontally and wrap around.
const FRAG = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform vec4 u_view;
uniform int u_mask;
uniform float u_time;
uniform float u_count;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  // domain-warped billow detail, moves with the cloud, evolves slowly
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one cloud and blends it over the current color
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist,
                inout float coverage) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;

  float alpha = smoothstep(0.02, 0.38, d);
  if (u_mask != 0) {
    coverage = max(coverage, alpha);
    return color;
  }

  // sample density toward the sun (straight up) for self-shadowing
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);

  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);

  // silver lining on thin edges
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.10;

  // atmospheric perspective: far clouds fade into the sky
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist,
               inout float coverage) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist, coverage);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 uv = u_view.xy + v_uv * u_view.zw;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time;
  float coverage = 0.0;

  vec3 sky = mix(u_skyBottom, u_skyTop, uv.y);
  vec3 color = sky;

  // faint haze band near the horizon
  color = mix(color, u_skyBottom * 1.06, smoothstep(0.35, 0.0, uv.y) * 0.5);

  // soft sun glow, upper area
  vec2 sunPos = vec2(aspect * 0.78, 0.92);
  float sunDist = length(p - sunPos);
  color += vec3(1.0, 0.95, 0.82) * exp(-sunDist * sunDist * 5.0) * 0.28;

  // thin cirrus streaks, stretched horizontally, high in the sky
  float cirrusBand = smoothstep(0.55, 0.8, uv.y) * (1.0 - smoothstep(0.9, 1.0, uv.y));
  if (u_mask == 0 && cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    color = mix(color, u_cloud * 0.98, wisp * 0.35);
  }

  // far layer: small, high, slow
  if (u_count > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0, coverage);
  }
  if (u_count > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85, coverage);
  }

  // middle layer
  if (u_count > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55, coverage);
  }
  if (u_count > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45, coverage);
  }

  // near layer: big, low, fast
  if (u_count > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15, coverage);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0, coverage);

  if (u_mask != 0) {
    float light = 1.0 - smoothstep(0.47, 0.53, coverage);
    gl_FragColor = u_mask == 1 ? vec4(0.0, 0.0, light, 1.0) : vec4(0.0, 0.0, 0.0, 1.0 - light);
  } else {
    gl_FragColor = vec4(color, 1.0);
  }
}
`;

function parseHex(color: string): [number, number, number] {
  const value = color.trim();
  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = value.match(/[\d.]+/g);
  if (rgb && rgb.length >= 3) {
    return [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255];
  }
  return [0.95, 0.95, 0.95];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createRenderer(gl: RenderingContext | null, mode: 'sky' | 'filter' | 'overlay') {
  if (!gl || !(gl instanceof WebGLRenderingContext)) return;
  const { canvas } = gl;

  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vert || !frag) return;

  const program = gl.createProgram();
  if (!program) return;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, 'a_pos');
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const loc = {
    res: gl.getUniformLocation(program, 'u_res'),
    view: gl.getUniformLocation(program, 'u_view'),
    time: gl.getUniformLocation(program, 'u_time'),
    count: gl.getUniformLocation(program, 'u_count'),
    cloud: gl.getUniformLocation(program, 'u_cloud'),
    skyTop: gl.getUniformLocation(program, 'u_skyTop'),
    skyBottom: gl.getUniformLocation(program, 'u_skyBottom'),
  };

  gl.uniform1i(gl.getUniformLocation(program, 'u_mask'), { sky: 0, filter: 1, overlay: 2 }[mode]);

  return {
    canvas,
    resize(width: number, height: number) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(width * dpr));
      const h = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    },
    setScene(width: number, height: number, view: [number, number, number, number]) {
      gl.uniform2f(loc.res, width, height);
      gl.uniform4f(loc.view, ...view);
    },
    draw(elapsed: number, count: number, cloud: number[], skyTop: number[], skyBottom: number[]) {
      gl.uniform1f(loc.time, elapsed);
      gl.uniform1f(loc.count, count);
      gl.uniform3fv(loc.cloud, cloud);
      gl.uniform3fv(loc.skyTop, skyTop);
      gl.uniform3fv(loc.skyBottom, skyBottom);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    },
  };
}

export const CloudShader = ({
  className,
  children,
  maskCanvasIds,
  speed = 1,
  count = 6,
  cloudColor = '#fbf8f2',
  skyTopColor = '#3876ba',
  skyBottomColor = '#8cbfe8',
}: CloudShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({
    speed,
    count,
    cloudColor,
    skyTopColor,
    skyBottomColor,
  });

  useEffect(() => {
    paramsRef.current = { speed, count, cloudColor, skyTopColor, skyBottomColor };
  }, [speed, count, cloudColor, skyTopColor, skyBottomColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sky = createRenderer(canvas.getContext('webgl', webGLAttributes), 'sky');
    if (!sky) return;

    // WebKit can bypass SVG filters on composited WebGL layers.
    const cssCanvasDocument = document as CSSCanvasDocument;
    const useCSSCanvas = cssCanvasDocument.getCSSCanvasContext
      && CSS.supports('mask-image', '-webkit-canvas(clouds)');
    const maskMode = useCSSCanvas ? 'overlay' : 'filter';
    const masks = (maskCanvasIds ?? []).flatMap((id) => {
      const surface = document.getElementById(id);
      if (!(surface instanceof HTMLCanvasElement) || !surface.parentElement) return [];

      const gl = useCSSCanvas
        ? cssCanvasDocument.getCSSCanvasContext?.('webgl', id, 1, 1) ?? null
        : surface.getContext('webgl', webGLAttributes);
      const renderer = createRenderer(gl, maskMode);
      if (!renderer) return [];

      const group = surface.parentElement;
      if (useCSSCanvas) group.style.setProperty('--hero-cloud-mask', `-webkit-canvas(${id})`);
      return [{ surface, group, renderer, available: true, ready: false }];
    });
    const disableMasks = (event?: Event) => {
      for (const mask of masks) {
        if (event && event.currentTarget !== canvas && event.currentTarget !== mask.renderer.canvas) continue;
        mask.available = false;
        mask.group.removeAttribute('data-cloud-mask-ready');
        if (useCSSCanvas) mask.group.style.removeProperty('--hero-cloud-mask');
      }
    };
    for (const { renderer } of masks) renderer.canvas.addEventListener('webglcontextlost', disableMasks);
    canvas.addEventListener('webglcontextlost', disableMasks);

    let frame = 0;
    let running = true;
    let visible = true;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      sky.resize(bounds.width, bounds.height);
      sky.setScene(canvas.width, canvas.height, [0, 0, 1, 1]);
      for (const { surface, renderer } of masks) {
        const region = surface.getBoundingClientRect();
        renderer.resize(region.width, region.height);
        renderer.setScene(canvas.width, canvas.height, [
          (region.left - bounds.left) / bounds.width,
          (bounds.bottom - region.bottom) / bounds.height,
          region.width / bounds.width,
          region.height / bounds.height,
        ]);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    for (const { group } of masks) resizeObserver.observe(group);
    resize();

    const start = performance.now();
    const draw = (now: number) => {
      frame = 0;
      if (!running || !visible) return;

      const p = paramsRef.current;
      const elapsed = reduceMotion ? 0 : ((now - start) / 1000) * p.speed;
      const cloud = parseHex(p.cloudColor);
      const skyTop = parseHex(p.skyTopColor);
      const skyBottom = parseHex(p.skyBottomColor);

      const cloudCount = Math.min(6, Math.max(1, p.count));
      sky.draw(elapsed, cloudCount, cloud, skyTop, skyBottom);
      for (const mask of masks) {
        if (!mask.available) continue;
        mask.renderer.draw(elapsed, cloudCount, cloud, skyTop, skyBottom);
        if (!mask.ready) {
          mask.group.setAttribute('data-cloud-mask-ready', maskMode);
          mask.ready = true;
        }
      }
      frame = requestAnimationFrame(draw);
    };

    // Stop rendering while the canvas is off screen.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    visibilityObserver.observe(canvas);

    frame = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      disableMasks();
      canvas.removeEventListener('webglcontextlost', disableMasks);
      for (const { renderer } of masks) {
        renderer.canvas.removeEventListener('webglcontextlost', disableMasks);
        renderer.dispose();
      }
      sky.dispose();
    };
  }, [maskCanvasIds]);

  return (
    <div
      className={['relative h-full min-h-80 w-full overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
};
