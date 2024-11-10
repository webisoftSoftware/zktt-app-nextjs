// import React, { useEffect, useRef } from 'react';

// const ShaderBackground: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const gl = canvas.getContext('webgl');
//     if (!gl) {
//       console.error('WebGL not supported');
//       return;
//     }

//     const vertexShaderSource = `
//       attribute vec4 position;
//       void main() {
//         gl_Position = position;
//       }
//     `;

//     const fragmentShaderSource = `
//       #ifdef GL_ES
//       precision mediump float;
//       #endif

//       uniform float time;
//       uniform vec2 mouse;
//       uniform vec2 resolution;

//       // Function to generate random noise
//       float random(vec2 st) {
//         return fract(sin(dot(st.xy, vec2(120.9898, 78.233))) * 43758.5453123);
//       }

//       void main(void) {
//         vec2 position = gl_FragCoord.xy / resolution.xy;
//         position.x *= resolution.x / resolution.y;

//         // Create a horizontal sinusoidal pattern with randomness
//         float wave = sin(position.y * 20.0 + time * 2.0 + random(position) * 5.0);

//         // Create wavy scanlines by modulating the y position
//         float waveOffset = sin(position.x * 10.0 + time) * 0.05; // Adjust wave frequency and amplitude
//         float scanline = 0.5 + 0.5 * sin((position.y + waveOffset) * 50.0 + time * 10.0);

//         // Combine wave pattern with scanline effect
//         float color = wave * scanline;

//         gl_FragColor = vec4(vec3(color), 1.0);
//       }
//     `;

//     const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
//       const shader = gl.createShader(type);
//       if (!shader) return null;
//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);
//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.error('Shader compile failed with: ' + gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//         return null;
//       }
//       return shader;
//     };

//     const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
//     const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

//     if (!vertexShader || !fragmentShader) return;

//     const program = gl.createProgram();
//     if (!program) return;

//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error('Program failed to link: ' + gl.getProgramInfoLog(program));
//       return;
//     }

//     gl.useProgram(program);

//     const positionLocation = gl.getAttribLocation(program, 'position');
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//       -1, -1,
//       1, -1,
//       -1, 1,
//       -1, 1,
//       1, -1,
//       1, 1
//     ]), gl.STATIC_DRAW);
//     gl.enableVertexAttribArray(positionLocation);
//     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

//     const timeLocation = gl.getUniformLocation(program, 'time');
//     const resolutionLocation = gl.getUniformLocation(program, 'resolution');

//     const render = (time: number) => {
//       gl.uniform1f(timeLocation, time * 0.001);
//       gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
//       gl.drawArrays(gl.TRIANGLES, 0, 6);
//       requestAnimationFrame(render);
//     };

//     requestAnimationFrame(render);
//   }, []);

//   return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
// };

// export default ShaderBackground;