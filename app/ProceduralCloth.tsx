"use client";

import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float fabric(vec2 p, float t) {
  vec2 q = mat2(0.88, -0.48, 0.48, 0.88) * p;
  float breath = sin(t * 0.42) * 0.18;
  float broad = sin(q.x * 4.2 + sin(q.y * 2.0 + t * 0.32) * (1.5 + breath));
  float crossing = sin(q.x * 8.4 - q.y * 1.6 - t * 0.44) * 0.28;
  float longWave = sin(q.y * 3.2 + q.x * 0.8 + t * 0.24) * 0.22;
  float ripple = sin(q.x * 15.0 + q.y * 2.5 + t * 0.65) * 0.07;
  return broad * 0.62 + crossing + longWave + ripple;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.42;
  float t = u_time;

  float e = 0.0025;
  float h = fabric(p, t);
  float hx = fabric(p + vec2(e, 0.0), t);
  float hy = fabric(p + vec2(0.0, e), t);
  vec3 normal = normalize(vec3(-(hx - h) / e * 0.3, -(hy - h) / e * 0.3, 1.0));

  float threads = (hash(vec2(p.x * 34.0, p.y * 560.0)) - 0.5) * 0.055;
  normal = normalize(normal + vec3(threads * 0.3, threads, 0.0));

  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 key = normalize(vec3(-0.42 + sin(t * 0.16) * 0.18, 0.62, 0.58));
  vec3 rim = normalize(vec3(0.78, -0.32, 0.42));
  float diffuse = max(dot(normal, key), 0.0);
  float rimLight = max(dot(normal, rim), 0.0);
  float specular = pow(max(dot(normal, normalize(key + viewDir)), 0.0), 24.0);
  float satin = pow(max(dot(normal, normalize(vec3(key.x * 0.2, key.y, key.z) + viewDir)), 0.0), 7.0);

  vec3 shadow = vec3(0.055, 0.0015, 0.006);
  vec3 oxblood = vec3(0.38, 0.008, 0.026);
  vec3 highlight = vec3(0.86, 0.08, 0.12);
  vec3 color = mix(shadow, oxblood, 0.18 + diffuse * 0.72);
  color += highlight * (specular * 0.72 + satin * 0.19);
  color += vec3(0.22, 0.015, 0.02) * rimLight * 0.2;

  float grain = hash(gl_FragCoord.xy + floor(t * 8.0)) - 0.5;
  color += grain * 0.022;
  float vignette = 1.0 - smoothstep(0.18, 1.05, length((uv - 0.5) * vec2(0.82, 1.0)));
  color *= 0.58 + vignette * 0.58;
  gl_FragColor = vec4(color, 1.0);
}
`;

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

export function ProceduralCloth() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { alpha: false, antialias: false });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;

    const render = (now: number) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, reduced ? 2.4 : (now - started) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    };
    render(started);

    return () => {
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={ref} className="procedural-cloth" aria-hidden="true" />;
}
