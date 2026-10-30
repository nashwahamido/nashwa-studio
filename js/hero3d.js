// ============================================================
// HERO 3D CENTREPIECE — self-contained WebGL (no libraries)
// A faceted crystal that auto-rotates and can be dragged to spin.
// Placeholder object: swap the geometry for a real .glb later.
// ============================================================
(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) { canvas.classList.add('no-webgl'); return; }

  // ---- tiny mat4 helpers --------------------------------------------------
  function mul(a, b) {
    var o = new Float32Array(16);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      o[c * 4 + r] = a[0 * 4 + r] * b[c * 4 + 0] + a[1 * 4 + r] * b[c * 4 + 1] +
                     a[2 * 4 + r] * b[c * 4 + 2] + a[3 * 4 + r] * b[c * 4 + 3];
    }
    return o;
  }
  function perspective(fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }
  function translation(x, y, z) {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); }

  // ---- icosahedron, expanded to flat-shaded triangles ---------------------
  var t = (1 + Math.sqrt(5)) / 2;
  var V = [
    [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
    [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
    [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
  ].map(function (p) { var l = Math.hypot(p[0], p[1], p[2]); return [p[0]/l, p[1]/l, p[2]/l]; });
  var F = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]
  ];
  var pos = [], nrm = [];
  F.forEach(function (f) {
    var a = V[f[0]], b = V[f[1]], c = V[f[2]];
    var u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    var w = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
    var n = [u[1]*w[2]-u[2]*w[1], u[2]*w[0]-u[0]*w[2], u[0]*w[1]-u[1]*w[0]];
    var nl = Math.hypot(n[0], n[1], n[2]); n = [n[0]/nl, n[1]/nl, n[2]/nl];
    [a, b, c].forEach(function (p) { pos.push(p[0], p[1], p[2]); nrm.push(n[0], n[1], n[2]); });
  });
  var vertCount = pos.length / 3;

  // ---- shaders ------------------------------------------------------------
  var vsrc =
    'attribute vec3 aPos; attribute vec3 aNrm;' +
    'uniform mat4 uModel; uniform mat4 uVP;' +
    'varying vec3 vN; varying vec3 vP;' +
    'void main(){ vec4 wp = uModel * vec4(aPos,1.0); vP = wp.xyz;' +
    'vN = mat3(uModel) * aNrm; gl_Position = uVP * wp; }';
  var fsrc =
    'precision mediump float;' +
    'varying vec3 vN; varying vec3 vP;' +
    'uniform vec3 uLo; uniform vec3 uHi; uniform vec3 uRim;' +
    'void main(){ vec3 N = normalize(vN);' +
    'vec3 L = normalize(vec3(0.45, 0.75, 0.55));' +
    'float d = max(dot(N, L), 0.0);' +
    'float grad = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);' +
    'vec3 base = mix(uLo, uHi, grad);' +
    'vec3 col = base * (0.42 + 0.72 * d);' +
    'float rim = pow(1.0 - max(N.z, 0.0), 3.0);' +
    'col += uRim * rim * 0.65;' +
    'gl_FragColor = vec4(col, 1.0); }';

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { canvas.classList.add('no-webgl'); return null; }
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, vsrc), fs = compile(gl.FRAGMENT_SHADER, fsrc);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.classList.add('no-webgl'); return; }
  gl.useProgram(prog);

  function buffer(data, attr, size) {
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, attr);
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  buffer(pos, 'aPos', 3);
  buffer(nrm, 'aNrm', 3);

  var uModel = gl.getUniformLocation(prog, 'uModel');
  var uVP = gl.getUniformLocation(prog, 'uVP');
  gl.uniform3fv(gl.getUniformLocation(prog, 'uLo'), [0.055, 0.42, 0.40]);   // deep teal
  gl.uniform3fv(gl.getUniformLocation(prog, 'uHi'), [0.20, 0.90, 0.78]);    // bright teal
  gl.uniform3fv(gl.getUniformLocation(prog, 'uRim'), [1.00, 0.45, 0.37]);   // coral rim

  gl.enable(gl.DEPTH_TEST);

  // ---- sizing -------------------------------------------------------------
  var proj;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth || 360, h = canvas.clientHeight || 360;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    proj = perspective(0.9, w / h, 0.1, 100);
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- interaction --------------------------------------------------------
  var yaw = 0.6, pitch = -0.3, velY = 0, velX = 0, dragging = false, lastX = 0, lastY = 0;
  function down(x, y) { dragging = true; lastX = x; lastY = y; velY = velX = 0; canvas.classList.add('grabbing'); }
  function move(x, y) {
    if (!dragging) return;
    velY = (x - lastX) * 0.01; velX = (y - lastY) * 0.01;
    yaw += velY; pitch += velX;
    pitch = Math.max(-1.3, Math.min(1.3, pitch));
    lastX = x; lastY = y;
  }
  function up() { dragging = false; canvas.classList.remove('grabbing'); }

  canvas.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
  window.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
  window.addEventListener('mouseup', up);
  canvas.addEventListener('touchstart', function (e) { down(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  canvas.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  canvas.addEventListener('touchend', up);

  // ---- render loop --------------------------------------------------------
  var view = translation(0, 0, -3.2);
  function frame() {
    if (!dragging) {
      yaw += 0.0035 + velY; pitch += velX;
      pitch = Math.max(-1.3, Math.min(1.3, pitch));
      velY *= 0.94; velX *= 0.94;
    }
    var model = mul(rotY(yaw), rotX(pitch));
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 0);
    gl.uniformMatrix4fv(uModel, false, model);
    gl.uniformMatrix4fv(uVP, false, mul(proj, view));
    gl.drawArrays(gl.TRIANGLES, 0, vertCount);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
