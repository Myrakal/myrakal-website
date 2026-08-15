"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_image;
uniform float u_time;

void main() {
  float canvasAspect = u_resolution.x / u_resolution.y;
  float imageAspect = u_image.x / u_image.y;
  vec2 uv = v_uv;

  if (canvasAspect > imageAspect) {
    uv.y = (uv.y - 0.5) / (canvasAspect / imageAspect) + 0.5;
  } else {
    uv.x = (uv.x - 0.5) * (canvasAspect / imageAspect) + 0.5;
  }

  float broad = sin(uv.y * 8.5 + u_time * 0.72) * 0.010;
  float fine = sin(uv.y * 21.0 - u_time * 0.48) * 0.004;
  float cross = sin(uv.x * 9.0 + uv.y * 4.0 + u_time * 0.36) * 0.003;
  float edge = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
  uv.x += (broad + fine) * (0.45 + edge);
  uv.y += cross;

  vec3 color = texture2D(u_texture, uv).rgb;
  float movingLight = sin((uv.x * 0.75 + uv.y) * 10.0 - u_time * 0.55);
  color *= 0.98 + movingLight * 0.035;
  gl_FragColor = vec4(color, 1.0);
}`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const value = gl.createShader(type);
  if (!value) return null;
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    gl.deleteShader(value);
    return null;
  }
  return value;
}

export function ClothRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vertex = shader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
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

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    const imageSize = gl.getUniformLocation(program, "u_image");
    const time = gl.getUniformLocation(program, "u_time");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    };

    const render = (now: number) => {
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(imageSize, image.naturalWidth, image.naturalHeight);
      gl.uniform1f(time, reduced ? 0 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduced) frame = requestAnimationFrame(render);
    };

    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      start = performance.now();
      render(start);
      canvas.dataset.ready = "true";
    };
    image.src = "/myrakal-hero.png";

    return () => {
      cancelAnimationFrame(frame);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="cloth-ripple" aria-hidden="true" />;
}
