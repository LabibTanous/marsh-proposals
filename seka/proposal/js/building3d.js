/* Brands by SEKA, Irbid — interactive 3D building for the proposal page.
   Three.js scene + CSS2D labels (Arabic and English stay real HTML text).
   The shapes and colours follow docs/RESEARCH-place-and-brand.md:
   PHOTO  = seen in the Irbid facade photo · BRAND LOOK = other branches · UNKNOWN = neutral placeholder. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/CSS2DRenderer.js';

const MM = window.MM;
const stage = document.getElementById('stage');
const host = document.getElementById('b3d');
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SMALL = matchMedia('(max-width: 900px)').matches;
const COARSE = matchMedia('(hover: none) and (pointer: coarse)').matches;
const G = window.gsap;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);

/* ---------- CONFIG ---------- */
const CFG = {
  W: 14, D: 11, R: 3.2,            // front width, depth, radius of the curved front-right corner (PHOTO)
  GH: 4.2, LH: 3.4, BAND: 0.6,     // tall glass ground floor, upper levels, black bands between floors (PHOTO)
  brand: {                          // measured brand colours (logo PNG, website, Nashmi Amman)
    mmDark: '#1e1e1c', mmOrange: '#ef8903', mmGold: '#bc955a', led: '#ff3c00', signRed: '#e80000',
    nRed: '#da252a', nDark: '#b61a1d', nOff: '#ede7e7',
    mbRed: '#ed212d', sekaCream: '#faf6ed', sekaInk: '#050402', gold1: '#ddb158', gold2: '#f2d06e', ciInk: '#050101',   // SEKA.md §2/§8
    slat: '#572d23', wood: '#6b4a30', brass: '#b08d57', rope: '#7a1018',
    leather: '#a17951', banquette: '#5c5e63', stoneFloor: '#5f5d5a', steel: '#a8aeb3', bulb: '#ffc27a',
    jordanStone: '#d8cbb2', plant: '#3e6a39', meat: '#5a2716', glass: '#cfe3f0',
  },
  env: {
    dark:  { ground: '#1a1614', road: '#24211f', side: '#3d3833', kerb: '#5f5952', line: '#e9e2d8', car: ['#6f7c88', '#c8c1b8', '#3d4a57'] },
    light: { ground: '#d9d0c4', road: '#8f8a85', side: '#c6bdb0', kerb: '#efe9e0', line: '#ffffff', car: ['#6f7c88', '#e6e1da', '#3d4a57'] },
  },
};

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}
try {
  if (!webglOK()) throw new Error('WebGL not available');
  init();
} catch (e) {
  console.error('3D building failed, showing the flat fallback:', e);
  stage.classList.add('no3d');
}

function init() {
  const { W, D, R, GH, LH, BAND } = CFG, BR = CFG.brand;
  const L1Y = GH + BAND, ROOFY = L1Y + LH + BAND;   // level bases: ground + level 1 only (Safi, 18 Oct: there is no second floor)

  /* ---------- renderer, labels, camera, controls ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: !SMALL, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, SMALL ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = !SMALL;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('role', 'img');
  const labels = new CSS2DRenderer();
  labels.domElement.className = 'labels';
  host.appendChild(labels.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 500);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enableZoom: false, enablePan: false, minPolarAngle: 0.3, maxPolarAngle: 1.42, rotateSpeed: 0.7 });
  const HOME_T = new THREE.Vector3(0.6, 4.3, 1.5);   // centre of a 2-floor building
  controls.target.copy(HOME_T);

  const hemi = new THREE.HemisphereLight(0xfff4e8, 0x2a2018, 0.6);
  const sun = new THREE.DirectionalLight(0xfff1e0, 2.2);
  sun.position.set(18, 30, 22); sun.castShadow = !SMALL;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.bias = -0.0006;
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 24, bottom: -14, near: 1, far: 90 });
  const rim = new THREE.DirectionalLight(0xbcd2ff, 0.9); rim.position.set(-20, 18, -26);
  scene.add(hemi, sun, rim);

  /* ---------- textures drawn in code ---------- */
  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.userData.redraw = () => { draw(c.getContext('2d'), w, h); t.needsUpdate = true; }; return t; };
  // Meat Moot sign: "Meat" + cleaver handle with 3 rivets + gold plate with "Moot" + "EXPRESS" outside / "SMOKING" inside (PHOTO + logo file)
  const drawMM = (x, w, h, lit) => {
    x.fillStyle = BR.mmDark; x.fillRect(0, 0, w, h);
    const s = h / 256;
    x.fillStyle = BR.mmGold; x.beginPath(); x.roundRect(60 * s, 40 * s, 170 * s, 46 * s, 12 * s); x.fill();
    x.fillStyle = '#fff'; [95, 140, 185].forEach((cx) => { x.beginPath(); x.arc(cx * s, 63 * s, 7 * s, 0, 6.283); x.fill(); });
    x.fillStyle = BR.mmGold; x.beginPath(); x.moveTo(238 * s, 30 * s); x.lineTo(w - 40 * s, 30 * s); x.lineTo(w - 40 * s, 150 * s);
    for (let i = 0; i <= 12; i++) x.lineTo(w - 40 * s - (i * (w - 278 * s)) / 12, (150 + (i % 2 ? 9 : -4)) * s);
    x.closePath(); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2 * s; x.strokeRect(252 * s, 42 * s, w - 304 * s, 96 * s);
    x.fillStyle = '#fff'; x.font = `italic 700 ${92 * s}px "Playfair Display", Georgia, serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('Moot', (238 * s + w - 40 * s) / 2, 92 * s);
    x.fillStyle = lit ? BR.signRed : BR.mmOrange; x.font = `900 ${96 * s}px "Albert Sans", Arial, sans-serif`; x.textAlign = 'left';
    x.fillText('Meat', 50 * s, 168 * s);
    x.fillStyle = BR.mmGold; x.fillRect(300 * s, 205 * s, 70 * s, 4 * s);
    x.font = `800 ${34 * s}px "Albert Sans", Arial, sans-serif`; x.fillText(lit ? 'EXPRESS' : 'SMOKING', 384 * s, 208 * s);   // facade sign: "Meat Moot EXPRESS" (SEKA.md §4); inside wall logo: "Smoking"
  };
  const mmSignTex = canvasTex(768, 256, (x, w, h) => drawMM(x, w, h, true));
  const mmWallTex = canvasTex(768, 256, (x, w, h) => drawMM(x, w, h, false));
  const nashmiTex = canvasTex(512, 160, (x, w, h) => {
    x.fillStyle = BR.nRed; x.fillRect(0, 0, w, h); x.fillStyle = BR.nDark; x.fillRect(0, h - 26, w, 26);
    for (let i = 0; i < w; i += 26) { x.fillStyle = i % 52 ? BR.nOff : '#020202'; x.fillRect(i, h - 26, 13, 13); }
    x.fillStyle = BR.nOff; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '900 64px "Albert Sans", Arial, sans-serif'; x.fillText('NASHMI', w / 2, 52);
    x.font = '800 34px "Tajawal", Arial, sans-serif'; x.fillText('شاورما', w / 2, 104);
  });
  const mashTex = canvasTex(512, 160, (x, w, h) => {             // Mashhoor (MFC): red sign, white type (SEKA.md: red #ED212D)
    x.fillStyle = BR.mbRed; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '800 44px "Tajawal", Arial, sans-serif'; x.fillText('مشهور', w / 2, 50);
    x.font = '900 46px "Albert Sans", Arial, sans-serif'; x.fillText('MASHHOOR', w / 2, 108);
  });
  const gold = (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, BR.gold2); g.addColorStop(1, BR.gold1); return g; };
  const sekaTex = canvasTex(512, 160, (x, w, h) => {             // Brands by Seka: gold panel, black type (facade photo, SEKA.md §4)
    x.fillStyle = gold(x, w, h); x.fillRect(0, 0, w, h);
    x.fillStyle = BR.sekaInk; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '700 40px "Albert Sans", Arial, sans-serif'; x.fillText('Brands by', w / 2, 52);
    x.font = '900 60px "Albert Sans", Arial, sans-serif'; x.fillText('SEKA', w / 2, 108);
  });
  const checkTex = canvasTex(512, 160, (x, w, h) => {            // Check Inn: black type with cartoon eyes on gold (SEKA.md §8)
    x.fillStyle = BR.ciInk; x.fillRect(0, 0, w, h);
    x.fillStyle = gold(x, w, h); x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '900 62px "Albert Sans", Arial, sans-serif'; x.fillText('Check Inn', w / 2 - 22, 78);
    [[w - 70, 62], [w - 44, 62]].forEach(([cx, cy]) => { x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, cy, 12, 0, 6.283); x.fill(); x.fillStyle = BR.ciInk; x.beginPath(); x.arc(cx + 3, cy + 2, 5, 0, 6.283); x.fill(); });
  });
  const brickTex = canvasTex(256, 256, (x, w, h) => {
    x.fillStyle = '#1b1816'; x.fillRect(0, 0, w, h);
    for (let r = 0; r < 16; r++) for (let c = -1; c < 9; c++) { const off = r % 2 ? 16 : 0; x.fillStyle = `hsl(20,${6 + ((r * c) % 5)}%,${4 + ((r * 7 + c * 3) % 4)}%)`; x.fillRect(c * 32 + off + 1, r * 16 + 1, 30, 14); }
  });
  brickTex.wrapS = brickTex.wrapT = THREE.RepeatWrapping; brickTex.repeat.set(3, 1.2);
  const pitchTex = canvasTex(512, 288, (x) => {
    for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#22733a' : '#1f6b34'; x.fillRect(i * 64, 0, 64, 288); }
    x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 4; x.strokeRect(16, 16, 480, 256);
    x.beginPath(); x.moveTo(256, 16); x.lineTo(256, 272); x.stroke(); x.beginPath(); x.arc(256, 144, 46, 0, 6.283); x.stroke();
    x.strokeRect(16, 84, 70, 120); x.strokeRect(426, 84, 70, 120);
  });
  if (document.fonts) Promise.all(['italic 700 40px "Playfair Display"', '900 40px "Albert Sans"', '800 30px "Tajawal"'].map((f) => document.fonts.load(f))).then(() => [mmSignTex, mmWallTex, nashmiTex, mashTex, sekaTex, checkTex].forEach((t) => t.userData.redraw())).catch((e) => console.error('sign fonts did not load', e));

  /* ---------- materials: one set per group so a level can fade on its own ---------- */
  const themed = [];
  function M(role, opts = {}) { const m = new THREE.MeshStandardMaterial({ roughness: 0.78, metalness: 0.04, ...opts }); m.userData.role = role; m.userData.base = opts.opacity ?? 1; themed.push(m); return m; }
  const fixed = (hex, o = {}) => M('fixed', { color: hex, ...o });
  const glow = (hex, i = 1.4) => { const m = M('glow', { color: hex, emissive: hex, emissiveIntensity: i }); m.userData.glowBase = i; return m; };
  function mats() {
    return {
      ground: M('env:ground', { roughness: 0.95 }), road: M('env:road', { roughness: 0.9 }), side: M('env:side'), kerb: M('env:kerb'), line: M('env:line'),
      car0: M('env:car0', { metalness: 0.35, roughness: 0.4 }), car1: M('env:car1', { metalness: 0.35, roughness: 0.4 }), car2: M('env:car2', { metalness: 0.35, roughness: 0.4 }),
      frame: fixed(BR.mmDark, { roughness: 0.45, metalness: 0.3 }), fin: fixed('#141413', { roughness: 0.4, metalness: 0.4 }),
      glass: M('glass', { color: BR.glass, transparent: true, opacity: 0.17, roughness: 0.06, metalness: 0.1, depthWrite: false }),
      brick: M('fixed', { map: brickTex, roughness: 0.9 }), floor: fixed(BR.stoneFloor, { roughness: 0.55 }), wood: fixed(BR.wood, { roughness: 0.7 }),
      slat: fixed(BR.slat, { roughness: 0.7 }), steel: fixed(BR.steel, { metalness: 0.6, roughness: 0.35 }), brass: fixed(BR.brass, { metalness: 0.7, roughness: 0.35 }),
      rope: fixed(BR.rope, { roughness: 0.6 }), leather: fixed(BR.leather, { roughness: 0.6 }), banquette: fixed(BR.banquette, { roughness: 0.8 }),
      dark: fixed(BR.mmDark, { roughness: 0.55 }), stone: fixed(BR.jordanStone, { roughness: 0.9 }), plant: fixed(BR.plant), meat: fixed(BR.meat, { roughness: 0.55 }),
      orange: fixed(BR.mmOrange, { roughness: 0.4 }), nRed: fixed(BR.nRed, { roughness: 0.5 }),
      led: glow(BR.led, 2.2), bulb: glow(BR.bulb, 1.6), ember: glow('#ff6a1a', 1.4), signLight: glow('#fff4e0', 0.6),
      mmSign: M('fixed', { map: mmSignTex, emissive: '#ffffff', emissiveMap: mmSignTex, emissiveIntensity: 0.9, roughness: 0.5 }),
      mmWall: M('fixed', { map: mmWallTex, emissive: '#ffffff', emissiveMap: mmWallTex, emissiveIntensity: 0.55, roughness: 0.5 }),
      nSign: M('fixed', { map: nashmiTex, emissive: '#ffffff', emissiveMap: nashmiTex, emissiveIntensity: 0.6, roughness: 0.5 }),
      mSign: M('fixed', { map: mashTex, emissive: '#ffffff', emissiveMap: mashTex, emissiveIntensity: 0.6, roughness: 0.5 }),
      sSign: M('fixed', { map: sekaTex, emissive: '#ffffff', emissiveMap: sekaTex, emissiveIntensity: 0.6, roughness: 0.5 }),
      cSign: M('fixed', { map: checkTex, emissive: '#ffffff', emissiveMap: checkTex, emissiveIntensity: 0.6, roughness: 0.5 }),
    };
  }
  const Bx = (w, h, d) => new THREE.BoxGeometry(w, h, d);
  const Cy = (rt, rb, h, s = 20) => new THREE.CylinderGeometry(rt, rb, h, s);
  const Sp = (r, s = 12) => new THREE.SphereGeometry(r, s, Math.max(8, s - 4));
  function add(g, geo, mat, x, y, z, o = {}) {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    if (o.ry) m.rotation.y = o.ry; if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz;
    m.castShadow = o.cast ?? true; m.receiveShadow = o.recv ?? true; g.add(m); return m;
  }
  const insideLabels = [];
  // a restaurant name you can click: it opens that restaurant's numbers (index.html openBrand)
  const brandLabel = (o, k) => { const el = o.userData.el; el.dataset.brand = k; el.classList.add('pick'); el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-pressed', 'false'); return o; };
  function label(g, key, x, y, z, cls = '', inside = false) {
    const el = document.createElement('div'); el.className = `lbl ${cls}`; el.dataset.t = key; MM.fill(el);
    const o = new CSS2DObject(el); o.position.set(x, y, z); o.userData.el = el; g.add(o);
    if (inside) { o.userData.level = g.userData.key; insideLabels.push(o); }
    return o;
  }

  /* ---------- the plan shape: rectangle with the curved front-right corner ---------- */
  const shape = new THREE.Shape();
  shape.moveTo(-W / 2, -D / 2); shape.lineTo(W / 2 - R, -D / 2);
  shape.absarc(W / 2 - R, -D / 2 + R, R, -Math.PI / 2, 0, false);
  shape.lineTo(W / 2, D / 2); shape.lineTo(-W / 2, D / 2); shape.lineTo(-W / 2, -D / 2);
  function plate(g, mat, y, t) { const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false, curveSegments: 24 }); const m = new THREE.Mesh(geo, mat); m.rotation.x = -Math.PI / 2; m.position.y = y; m.castShadow = m.receiveShadow = true; g.add(m); return m; }
  // the front path: straight front, then the quarter curve to the right side
  const straight = W - R, arcLen = (Math.PI / 2) * R, pathLen = straight + arcLen;
  function onPath(u, off = 0) {
    const s = u * pathLen;
    if (s <= straight) return { x: -W / 2 + s, z: D / 2 + off, a: 0 };
    const phi = ((s - straight) / arcLen) * (Math.PI / 2);
    return { x: W / 2 - R + (R + off) * Math.sin(phi), z: D / 2 - R + (R + off) * Math.cos(phi), a: phi };
  }
  function frontGlass(g, mat, y0, h, off = -0.05) {
    add(g, Bx(straight, h, 0.05), mat, -W / 2 + straight / 2, y0 + h / 2, D / 2 + off, { cast: false });
    const c = new THREE.Mesh(new THREE.CylinderGeometry(R + off, R + off, h, 24, 1, true, 0, Math.PI / 2), mat); c.position.set(W / 2 - R, y0 + h / 2, D / 2 - R); g.add(c);
  }
  function ledLine(g, mat, y, off = 0.42) {
    add(g, Bx(straight, 0.06, 0.06), mat, -W / 2 + straight / 2, y, D / 2 + off, { cast: false });
    const t = new THREE.Mesh(new THREE.TorusGeometry(R + off, 0.03, 6, 24, Math.PI / 2), mat); t.rotation.x = Math.PI / 2; t.position.set(W / 2 - R, y, D / 2 - R); g.add(t);
  }
  function fins(g, mat, y0, h, step = 0.5) {
    for (let s = 0.25; s < pathLen; s += step) { const p = onPath(s / pathLen, 0.22); add(g, Bx(0.06, h, 0.42), mat, p.x, y0 + h / 2, p.z, { ry: p.a }); }
  }
  function bulbCluster(g, m, x, y, z) {
    add(g, Cy(0.006, 0.006, 0.8, 4), m.dark, x, y + 0.4, z, { cast: false });
    for (let i = 0; i < 7; i++) { const a = i * 0.9, r = i ? 0.22 : 0; add(g, Sp(0.07, 10), m.bulb, x + Math.cos(a) * r, y - (i % 3) * 0.12, z + Math.sin(a) * r, { cast: false }); }
  }
  function table(g, m, x, y, z, chairMat) {
    add(g, Bx(1.2, 0.06, 1.2), m.wood, x, y + 0.75, z);
    add(g, Bx(0.1, 0.72, 0.1), m.dark, x, y + 0.37, z);
    add(g, Bx(0.85, 0.025, 0.45), m.dark, x, y + 0.79, z);                      // black serving board
    for (let i = 0; i < 5; i++) add(g, Cy(0.045, 0.035, 0.05, 10), i % 2 ? m.wood : m.dark, x - 0.36 + i * 0.18, y + 0.82, z + 0.3, { cast: false });
    [[0, -0.85, 0], [0, 0.85, Math.PI], [-0.85, 0, Math.PI / 2], [0.85, 0, -Math.PI / 2]].forEach(([a, b, r]) => {
      add(g, Bx(0.48, 0.07, 0.48), chairMat, x + a, y + 0.46, z + b);
      add(g, Bx(0.48, 0.48, 0.07), chairMat, x + a + Math.sin(r) * -0.22, y + 0.72, z + b + Math.cos(r) * -0.22, { ry: r });
    });
  }

  const groups = { street: new THREE.Group(), g: new THREE.Group(), l1: new THREE.Group(), roof: new THREE.Group() };
  const keyOf = { street: 'street', g: 'g', l1: 'l1', roof: 'roof' };
  Object.entries(groups).forEach(([k, g]) => { g.userData.key = keyOf[k]; g.userData.mats = mats(); scene.add(g); });

  /* ---------- street: sidewalk, front parking, divided road, mosque opposite, neighbours ---------- */
  (function () {
    const g = groups.street, m = g.userData.mats, z0 = D / 2;
    add(g, new THREE.PlaneGeometry(140, 140), m.ground, 0, -0.02, 6, { rx: -Math.PI / 2, cast: false });
    add(g, Bx(40, 0.14, 3.2), m.side, 0, 0.07, z0 + 1.6, { cast: false });                          // sidewalk
    add(g, Bx(40, 0.04, 5.2), m.road, 0, 0.02, z0 + 5.8, { cast: false });                          // front parking (not confirmed)
    for (let x = -12; x <= 12; x += 2.6) add(g, Bx(0.08, 0.012, 4.6), m.line, x, 0.045, z0 + 5.8, { cast: false });
    add(g, Bx(80, 0.18, 0.25), m.kerb, 0, 0.09, z0 + 8.5, { cast: false });
    add(g, Bx(80, 0.04, 7.5), m.road, 0, 0.02, z0 + 12.3, { cast: false });                         // near carriageway
    add(g, Bx(80, 0.3, 4), m.kerb, 0, 0.15, z0 + 18.05);                                              // median (a few metres, DATA)
    add(g, Bx(80, 0.05, 3.6), m.plant, 0, 0.32, z0 + 18.05, { cast: false });
    for (let x = -30; x <= 30; x += 9) { add(g, Cy(0.1, 0.14, 2.8, 8), m.wood, x, 1.7, z0 + 18.05); add(g, Sp(1.0, 12), m.plant, x, 3.4, z0 + 18.05); }
    add(g, Bx(80, 0.04, 7.5), m.road, 0, 0.02, z0 + 23.8, { cast: false });                         // far carriageway
    [z0 + 12.3, z0 + 23.8].forEach((z) => { for (let x = -36; x <= 36; x += 3.4) add(g, Bx(1.6, 0.012, 0.13), m.line, x, 0.05, z, { cast: false }); });
    add(g, Bx(80, 0.14, 3), m.side, 0, 0.07, z0 + 29.1, { cast: false });
    // the mosque opposite (Atta Najeeb Mosque, address listing)
    add(g, Bx(12, 6, 9), m.stone, -3, 3, z0 + 35.5);
    add(g, new THREE.SphereGeometry(3.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.stone, -3, 6, z0 + 35.5);
    add(g, Cy(0.55, 0.65, 16, 12), m.stone, 4.2, 8, z0 + 32.2);
    add(g, Cy(0.85, 0.85, 0.8, 12), m.stone, 4.2, 13.2, z0 + 32.2);
    add(g, new THREE.ConeGeometry(0.6, 1.8, 12), m.stone, 4.2, 16.9, z0 + 32.2);
    label(g, 'mosque', -3, 10.2, z0 + 35.5, 'tag');
    // neighbours on the same side: light Jordan stone shops (DATA + PHOTO)
    [[-W / 2 - 6.6, 11, 7.4], [W / 2 + 6.2, 10, 8.6]].forEach(([x, w, h]) => {
      add(g, Bx(w, h, D), m.stone, x, h / 2, 0);
      add(g, Bx(w - 1, 2.6, 0.08), m.glass, x, 1.5, D / 2 + 0.05, { cast: false });
      add(g, Bx(w - 2, 0.7, 0.2), m.frame, x, 3.2, D / 2 + 0.12);
    });
    // street lamps on the median, parked and moving cars
    [-10, 0, 10].forEach((x) => { add(g, Cy(0.07, 0.09, 6, 8), m.dark, x, 3, z0 + 18.05); add(g, Bx(3.4, 0.14, 0.3), m.signLight, x, 6, z0 + 18.05); });
    function car(x, z, ry, mat) {
      add(g, Bx(4.3, 0.62, 1.9), mat, x, 0.56, z, { ry });
      add(g, Bx(2.3, 0.55, 1.72), mat, x - 0.2 * Math.cos(ry), 1.12, z + 0.2 * Math.sin(ry), { ry });
      [[1.35, 0.86], [-1.35, 0.86], [1.35, -0.86], [-1.35, -0.86]].forEach(([a, b]) => add(g, Cy(0.34, 0.34, 0.25, 14), m.dark, x + a * Math.cos(ry) + b * Math.sin(ry), 0.34, z - a * Math.sin(ry) + b * Math.cos(ry), { rx: Math.PI / 2, ry }));
    }
    car(-3.9, z0 + 5.8, Math.PI / 2, m.car0); car(1.3, z0 + 5.8, Math.PI / 2, m.car1);
    car(-9, z0 + 11.2, 0, m.car2); car(8, z0 + 24.9, Math.PI, m.car1);
    label(g, 'road', -11, 0.5, z0 + 12.3, 'tag');
    label(g, 'tagSt', 10, 0.6, z0 + 3, 'tag');
  })();

  /* ---------- ground floor: glass front, the sign, smokers, carving counter, Nashmi, seating ---------- */
  const spits = [];
  (function () {
    const g = groups.g, m = g.userData.mats, top = 0.25;
    plate(g, m.frame, 0, 0.25);
    add(g, Bx(W - 0.6, 0.02, D - 0.6), m.floor, -0.2, top + 0.01, 0.2, { cast: false });
    add(g, Bx(W, GH, 0.3), m.brick, 0, GH / 2, -D / 2 + 0.15);                                     // black brick back wall (BRAND LOOK)
    add(g, Bx(0.3, GH, D), m.frame, -W / 2 + 0.15, GH / 2, 0);
    add(g, Bx(0.3, GH, D - R), m.frame, W / 2 - 0.15, GH / 2, -R / 2);
    frontGlass(g, m.glass, top, GH - top);                                                         // tall frameless glass (PHOTO)
    for (let s = 2; s < pathLen - 0.5; s += 2.2) { const p = onPath(s / pathLen, -0.02); add(g, Bx(0.02, GH - top, 0.3), m.glass, p.x, top + (GH - top) / 2, p.z, { ry: p.a, cast: false }); }
    add(g, Bx(0.45, GH, 0.45), m.frame, -W / 2 + 0.22, GH / 2, D / 2 - 0.05);
    // planter strip with shrubs along the base (PHOTO)
    add(g, Bx(straight - 1.2, 0.45, 0.7), m.frame, -W / 2 + straight / 2 + 0.3, 0.22, D / 2 + 0.55);
    for (let x = -W / 2 + 1.2; x < W / 2 - R - 0.6; x += 1.1) { add(g, new THREE.ConeGeometry(0.22, 0.75, 8), m.plant, x, 0.8, D / 2 + 0.55); add(g, Sp(0.12, 8), m.nRed, x + 0.5, 0.52, D / 2 + 0.6, { cast: false }); }
    // smoker cabinets along the back wall: black, orange plate, orange handle (PHOTO, opening photo)
    [0.4, 1.7, 3.0, 4.3].forEach((x) => {
      add(g, Bx(1.15, 2.2, 1.0), m.dark, x, top + 1.1, -D / 2 + 0.85);
      add(g, Bx(0.6, 0.22, 0.02), m.orange, x, top + 1.75, -D / 2 + 1.36, { cast: false });
      add(g, Bx(0.05, 0.9, 0.06), m.orange, x + 0.45, top + 1.1, -D / 2 + 1.38);
    });
    label(g, 'smoker', 2.35, top + 2.75, -D / 2 + 0.85, 'tag', true);
    add(g, Bx(3.6, 1.1, 0.06), m.mmWall, 2.35, top + 3.25, -D / 2 + 0.32, { cast: false });       // backlit logo on the brick wall (BRAND LOOK)
    // carving counter with wood slats, LED strip, a scale, a black board and the cleaver; ropes on brass posts
    add(g, Bx(4.6, 1.0, 0.95), m.slat, 2.35, top + 0.5, -D / 2 + 2.55);
    add(g, Bx(4.7, 0.07, 1.05), m.steel, 2.35, top + 1.03, -D / 2 + 2.55);
    add(g, Bx(4.6, 0.04, 0.04), m.led, 2.35, top + 0.95, -D / 2 + 3.04, { cast: false });
    add(g, Bx(0.38, 0.12, 0.32), m.steel, 0.6, top + 1.13, -D / 2 + 2.5);
    add(g, Bx(0.24, 0.08, 0.02), m.led, 0.6, top + 1.16, -D / 2 + 2.67, { cast: false });
    add(g, Bx(1.1, 0.05, 0.6), m.dark, 2.6, top + 1.09, -D / 2 + 2.55);
    for (let i = 0; i < 3; i++) add(g, Bx(0.3, 0.13, 0.25), m.meat, 2.25 + i * 0.36, top + 1.18, -D / 2 + 2.55);
    add(g, Bx(0.32, 0.02, 0.2), m.steel, 3.6, top + 1.1, -D / 2 + 2.5); add(g, Bx(0.15, 0.035, 0.05), m.dark, 3.83, top + 1.1, -D / 2 + 2.5);
    for (let i = 0; i < 5; i++) { const x = 0.2 + i * 1.08; add(g, Cy(0.04, 0.05, 0.95, 10), m.brass, x, top + 0.48, -D / 2 + 3.45); if (i < 4) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.035, 6, 16, Math.PI), m.rope); r.rotation.z = Math.PI; r.position.set(x + 0.54, top + 0.9, -D / 2 + 3.45); g.add(r); } }
    brandLabel(label(g, 'lbMM', 2.35, top + 1.9, -D / 2 + 2.6, 'acc', true), 'MM');
    // Nashmi counter on the left: red front, shawarma spits in front of a burner, fryers (Nashmi look; Irbid counter layout UNKNOWN)
    add(g, Bx(4.0, 1.05, 1.0), m.nRed, -4.0, top + 0.52, -D / 2 + 1.2);
    add(g, Bx(4.1, 0.07, 1.1), m.steel, -4.0, top + 1.08, -D / 2 + 1.2);
    add(g, Bx(1.9, 0.6, 0.05), m.nSign, -4.9, top + 2.9, -D / 2 + 0.32, { cast: false });
    add(g, Bx(1.9, 0.6, 0.05), m.mSign, -2.9, top + 2.9, -D / 2 + 0.32, { cast: false });
    add(g, Bx(1.9, 0.6, 0.05), m.cSign, -0.9, top + 2.9, -D / 2 + 0.32, { cast: false });                  // Check Inn counter (SEKA.md §4)
    brandLabel(label(g, 'lbCI', -0.9, top + 1.9, -D / 2 + 1.2, '', true), 'CI');
    [-5.2, -4.55].forEach((x) => { add(g, Bx(0.55, 1.1, 0.08), m.ember, x, top + 1.65, -D / 2 + 0.8, { cast: false }); add(g, Cy(0.02, 0.02, 1.25, 6), m.steel, x, top + 1.7, -D / 2 + 1.15); spits.push(add(g, Cy(0.24, 0.16, 0.85, 16), m.meat, x, top + 1.66, -D / 2 + 1.15)); });
    add(g, Bx(1.4, 0.5, 0.65), m.steel, -3.0, top + 1.37, -D / 2 + 1.1);
    brandLabel(label(g, 'lbNS', -4.9, top + 2.5, -D / 2 + 1.2, '', true), 'NS');
    brandLabel(label(g, 'lbMB', -3.0, top + 1.9, -D / 2 + 1.2, '', true), 'MB');
    // seating: wooden tables and chairs, bulb chandeliers (PHOTO), grey banquette on the left (BRAND LOOK)
    [-3.6, -0.6, 2.4].forEach((x) => [0.9, 3.3].forEach((z) => { table(g, m, x, top, z, m.wood); bulbCluster(g, m, x, GH - 1.0, z); }));
    add(g, Bx(0.8, 0.45, 5.4), m.banquette, -W / 2 + 0.75, top + 0.23, 2.0); add(g, Bx(0.25, 0.7, 5.4), m.banquette, -W / 2 + 0.42, top + 0.6, 2.0);
    // soffit downlights + the black band with the signs (PHOTO)
    g.userData.ceiling = plate(g, m.frame, GH, BAND);
    for (let s = 0.6; s < pathLen; s += 1.4) { const p = onPath(s / pathLen, -0.3); add(g, Cy(0.08, 0.08, 0.02, 10), m.signLight, p.x, GH - 0.01, p.z, { cast: false }); }
    // the fascia: 5 signs, left to right as in the facade photo (SEKA.md §4, 18 Oct): Nashmi, Meat Moot Express, Brands by Seka, Check Inn, Mashhoor
    [[-5.85, 'nSign'], [-3.7, 'mmSign'], [-1.55, 'sSign'], [0.6, 'cSign'], [2.75, 'mSign']].forEach(([x, mat]) => {
      add(g, Bx(2.05, 0.9, 0.22), m.frame, x, GH + BAND / 2 + 0.02, D / 2 + 0.15);
      add(g, Bx(1.95, 0.82, 0.02), m[mat], x, GH + BAND / 2 + 0.02, D / 2 + 0.27, { cast: false });
    });
    const pl = new THREE.PointLight(0xffb070, SMALL ? 16 : 26, 16, 2); pl.position.set(0, GH - 0.8, 1.5); g.add(pl); g.userData.light = pl;
    label(g, 'tagG', -W / 2 - 0.4, 1.2, D / 2, 'tag');
  })();

  /* ---------- level 1: the new restaurant and café behind black fins, inside the orange LED frame
     (outside: PHOTO; inside UNKNOWN: neutral placeholder; café upstairs = level 1, Safi 17 + 18 Oct) ---------- */
  (function () {
    const g = groups.l1, m = g.userData.mats, top = 0.02;
    add(g, Bx(W - 0.6, 0.02, D - 0.6), m.floor, -0.2, top, 0.2, { cast: false });
    add(g, Bx(W, LH, 0.3), m.brick, 0, LH / 2, -D / 2 + 0.15);
    add(g, Bx(0.3, LH, D), m.frame, -W / 2 + 0.15, LH / 2, 0);
    add(g, Bx(0.3, LH, D - R), m.frame, W / 2 - 0.15, LH / 2, -R / 2);
    frontGlass(g, m.glass, 0, LH);
    fins(g, m.fin, 0.1, LH - 0.2);
    ledLine(g, m.led, 0.12); ledLine(g, m.led, LH - 0.12);
    add(g, Bx(0.06, LH - 0.24, 0.06), m.led, -W / 2 + 0.05, LH / 2, D / 2 + 0.42, { cast: false });
    add(g, Bx(1.1, 1.05, 5.0), m.slat, -W / 2 + 1.5, top + 0.52, -0.6);
    add(g, Bx(1.2, 0.07, 5.1), m.wood, -W / 2 + 1.5, top + 1.07, -0.6);
    add(g, Bx(4.9, 0.04, 0.04), m.led, -W / 2 + 2.08, top + 0.98, -0.6, { ry: Math.PI / 2, cast: false });
    add(g, Bx(0.7, 0.48, 0.48), m.steel, -W / 2 + 1.5, top + 1.35, -2.4);
    for (let i = 0; i < 4; i++) add(g, Cy(0.2, 0.2, 0.06, 14), m.leather, -W / 2 + 2.5, top + 0.72, -2.6 + i * 1.2);
    [0.3, 3.6].forEach((x) => { add(g, Bx(3.0, 0.45, 0.95), m.banquette, x, top + 0.24, -D / 2 + 1.0); add(g, Bx(3.0, 0.62, 0.24), m.banquette, x, top + 0.56, -D / 2 + 0.55); add(g, Cy(0.42, 0.42, 0.4, 20), m.wood, x, top + 0.2, -D / 2 + 2.2); });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.0), new THREE.MeshBasicMaterial({ map: pitchTex, toneMapped: false })); screen.position.set(1.95, 2.0, -D / 2 + 0.33); g.add(screen);
    add(g, Bx(3.8, 2.2, 0.08), m.dark, 1.95, 2.0, -D / 2 + 0.27);
    label(g, 'matchNights', 1.95, 3.25, -D / 2 + 0.4, 'tag', true);
    [[-2.2, 1.2], [0.8, 1.6], [3.6, 1.6], [-2.2, 3.6], [0.8, 3.8], [3.6, 3.8]].forEach(([x, z]) => {
      add(g, Cy(0.55, 0.55, 0.06, 24), m.wood, x, top + 0.75, z); add(g, Cy(0.06, 0.06, 0.72, 8), m.dark, x, top + 0.37, z);
      for (let a = 0; a < 3; a++) add(g, Cy(0.22, 0.22, 0.45, 12), m.leather, x + Math.cos(a * 2.1) * 0.85, top + 0.24, z + Math.sin(a * 2.1) * 0.85);
      bulbCluster(g, m, x, LH - 0.9, z);
    });
    [[-W / 2 + 0.7, D / 2 - 0.8], [W / 2 - 0.9, -0.6]].forEach(([x, z]) => { add(g, Cy(0.28, 0.22, 0.5, 12), m.dark, x, top + 0.25, z); add(g, Sp(0.45), m.plant, x, top + 0.85, z); });
    g.userData.ceiling = plate(g, m.frame, LH, BAND);
    const pl = new THREE.PointLight(0xffb070, SMALL ? 14 : 22, 16, 2); pl.position.set(0, LH - 0.7, 0.8); g.add(pl); g.userData.light = pl;
    brandLabel(label(g, 'f2Cafe', -0.6, 1.8, 2.2, 'acc', true), 'L1');
    label(g, 'newTag', -0.6, 2.45, 2.2, '', true);
    label(g, 'tagL1', -W / 2 - 0.4, 1.0, D / 2, 'tag');
  })();

  /* ---------- roof: parapet, plant, the smoker flue (roof UNKNOWN: placeholder) ---------- */
  const smokeAnchor = new THREE.Object3D();
  (function () {
    const g = groups.roof, m = g.userData.mats;
    plate(g, m.frame, 0, 0.12);
    add(g, Bx(W, 0.6, 0.2), m.frame, 0, 0.42, -D / 2 + 0.1); add(g, Bx(0.2, 0.6, D), m.frame, -W / 2 + 0.1, 0.42, 0);
    add(g, Bx(1.5, 0.85, 1.1), m.steel, -2.0, 0.55, -1.5); add(g, Bx(1.5, 0.85, 1.1), m.steel, -4.0, 0.55, -1.5);
    add(g, Cy(0.32, 0.36, 2.8, 16), m.dark, 2.35, 1.5, -D / 2 + 0.9);
    add(g, Cy(0.45, 0.45, 0.12, 16), m.dark, 2.35, 2.95, -D / 2 + 0.9);
    smokeAnchor.position.set(2.35, 3.05, -D / 2 + 0.9); g.add(smokeAnchor);
  })();

  /* ---------- smoke and embers from the flue ---------- */
  const smokeTex = canvasTex(64, 64, (x) => { const gr = x.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); });
  const smoke = [], embers = [];
  for (let i = 0; i < (SMALL ? 22 : 36); i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: 0 })); s.userData = { life: Math.random(), speed: 0.12 + Math.random() * 0.08, dx: (Math.random() - 0.5) * 0.5, dz: (Math.random() - 0.5) * 0.5 }; scene.add(s); smoke.push(s); }
  for (let i = 0; i < 10; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xff7a2a, opacity: 0 })); s.userData = { life: Math.random(), speed: 0.3 + Math.random() * 0.3, dx: (Math.random() - 0.5) * 0.6, dz: (Math.random() - 0.5) * 0.6 }; scene.add(s); embers.push(s); }

  /* ---------- hover + fade state ---------- */
  let hovered = null;
  let fadeTo = { street: 1, g: 1, l1: 1, roof: 1 };
  function applyFade() {
    Object.values(groups).forEach((g) => {
      const f = fadeTo[g.userData.key] ?? 1;
      g.visible = (g.userData.dropVis ?? true) && f > 0.02;
      g.traverse((o) => {
        if (o.isMesh && o.material.userData && o.material.userData.role) {
          const mt = o.material, base = mt.userData.base ?? 1, op = base * f, glass = mt.userData.role === 'glass';
          mt.transparent = op < 0.999 || glass; mt.opacity = op; mt.depthWrite = op > 0.9 && !glass;
        }
        if (o.isCSS2DObject) o.userData.el.classList.toggle('dim', f < 0.5);
      });
    });
  }
  function setHover(k, force) {
    if (k === hovered && !force) return; hovered = k;
    Object.values(groups).forEach((g) => { const on = !!k && g.userData.key === k && k !== 'street'; g.userData.mats.frame.emissive.set(on ? MM.theme.accent : 0x000000); g.userData.mats.frame.emissiveIntensity = on ? 0.35 : 0; });
    renderer.domElement.style.cursor = k ? 'pointer' : 'grab';
    document.querySelectorAll('#floorList [data-floor]').forEach((b) => b.classList.toggle('hl', b.dataset.floor === k));
  }

  /* ---------- theme: environment follows light/dark; brand colours stay real ---------- */
  function applyTheme() {
    const th = MM.theme, mode = th.mode === 'light' ? 'light' : 'dark', E = CFG.env[mode];
    themed.forEach((m) => {
      const r = m.userData.role;
      if (r.startsWith('env:')) { const k = r.slice(4); m.color.set(k.startsWith('car') ? E.car[+k.slice(3)] : E[k]); }
      if (r === 'glass') m.userData.base = mode === 'dark' ? 0.17 : 0.26;
      if (r === 'glow') m.emissiveIntensity = (mode === 'dark' ? 1 : 0.65) * m.userData.glowBase;
    });
    hemi.intensity = mode === 'dark' ? 0.95 : 1.35; rim.intensity = mode === 'dark' ? 1.4 : 0.5;
    hemi.groundColor.set(mode === 'dark' ? 0x2a2018 : 0xb8a894);
    sun.intensity = mode === 'dark' ? 1.7 : 2.6;
    renderer.toneMappingExposure = mode === 'dark' ? 1.0 : 1.05;
    Object.values(groups).forEach((g) => { if (g.userData.light) g.userData.light.intensity = (mode === 'dark' ? 24 : 9) * (SMALL ? 0.7 : 1); });
    scene.fog = new THREE.Fog(new THREE.Color(th.bg2 || '#14110f'), 70, 160);
    smoke.forEach((s) => s.material.color.set(mode === 'dark' ? 0xd8d2cc : 0x6b6460));
    applyFade(); setHover(hovered, true);
  }

  /* ---------- layout: assemble (levels drop in) + explode (levels lift apart) ---------- */
  const st = { assemble: REDUCED ? 1 : 0, explode: 0, focus: 'all', manual: false };
  const LEVELS = [['g', 0, 0], ['l1', L1Y, 3.2], ['roof', ROOFY, 6.6]];
  function layout() {
    const a = st.assemble, e = ease(clamp(st.explode));
    LEVELS.forEach(([k, base, lift], i) => {
      const t = clamp((a - i * 0.17) / 0.55), drop = Math.pow(1 - t, 3);
      groups[k].position.y = base + e * lift + drop * (10 + i * 4);
      groups[k].userData.dropVis = drop < 0.97;
      groups[k].visible = groups[k].userData.dropVis && (fadeTo[groups[k].userData.key] ?? 1) > 0.02;
    });
    ['g', 'l1'].forEach((k) => { const c = groups[k].userData.ceiling; if (c) c.visible = st.explode < 0.35; });
    insideLabels.forEach((o) => { const show = st.focus === o.userData.level || (st.focus === 'all' && st.explode > 0.45); o.userData.el.style.visibility = show ? '' : 'hidden'; });
  }

  /* ---------- focus a level: open, fade the rest, move the camera ---------- */
  function fadeAnim(target) { if (!G || REDUCED) { fadeTo = { ...target }; applyFade(); return; } G.to(fadeTo, { ...target, duration: 0.6, ease: 'power2.out', onUpdate: applyFade }); }
  const homeDist = () => (camera.aspect < 0.9 ? 64 : camera.aspect < 1.3 ? 52 : 44);
  let flyingUntil = 0, scrollTheta = 0;
  const orbit = { theta: -0.28, phi: 1.2 };
  function syncOrbit() { const v = camera.position.clone().sub(controls.target); orbit.theta = Math.atan2(v.x, v.z) - scrollTheta; orbit.phi = Math.acos(clamp(v.y / v.length(), -1, 1)); }
  function flyTo(t, dist, dur = 1.1, phi = null) {
    flyingUntil = performance.now() + dur * 1000 + 60;
    const v0 = camera.position.clone().sub(controls.target);
    const from = { x: controls.target.x, y: controls.target.y, z: controls.target.z, d: v0.length(), p: Math.acos(clamp(v0.y / v0.length(), -1, 1)) };
    const apply = () => {
      const v = camera.position.clone().sub(controls.target), th = Math.atan2(v.x, v.z);
      controls.target.set(from.x, from.y, from.z);
      camera.position.set(from.x + from.d * Math.sin(from.p) * Math.sin(th), from.y + from.d * Math.cos(from.p), from.z + from.d * Math.sin(from.p) * Math.cos(th));
      camera.lookAt(controls.target);
    };
    const to = { x: t.x, y: t.y, z: t.z, d: dist, p: phi ?? from.p };
    if (!G || REDUCED) { Object.assign(from, to); apply(); syncOrbit(); return; }
    G.to(from, { ...to, duration: dur, ease: 'power3.inOut', onUpdate: apply, onComplete: syncOrbit });
  }
  function syncExplodeBtn(open) { const b = document.getElementById('explodeBtn'); const k = open ? 'vClose' : 'vOpen'; if (b.dataset.t !== k) { b.dataset.t = k; MM.fill(b); } b.setAttribute('aria-pressed', String(open)); }
  function setExplode(v, dur = 0.9) {
    syncExplodeBtn(v > 0.5);
    if (!G || REDUCED) { st.explode = v; layout(); return; }
    G.to(st, { explode: v, duration: dur, ease: 'power2.inOut', onUpdate: layout });
  }
  function focus(k) {
    st.focus = k || 'all';
    document.querySelectorAll('#views [data-focus]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.focus === st.focus)));
    document.querySelectorAll('#floorList [data-floor]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.floor === st.focus)));
    if (st.focus === 'all') { st.manual = false; setExplode(0); fadeAnim({ street: 1, g: 1, l1: 1, roof: 1 }); flyTo(HOME_T, homeDist(), 1.1, 1.2); return; }
    st.manual = true;
    if (st.focus === 'street') { setExplode(0); fadeAnim({ street: 1, g: 1, l1: 1, roof: 1 }); flyTo(new THREE.Vector3(0, 4, D / 2 + 12), homeDist() * 1.05, 1.1, 1.05); return; }
    setExplode(1);
    const y = { g: GH / 2, l1: L1Y + 3.2 + LH / 2 }[st.focus];
    fadeAnim({ g: { street: 0.5, g: 1, l1: 0, roof: 0 }, l1: { street: 0.4, g: 0.22, l1: 1, roof: 0 } }[st.focus]);
    flyTo(new THREE.Vector3(0, y, 0.5), homeDist() * 0.6, 1.1, 0.78);
  }

  /* ---------- pointer: hover lights a level, a click opens it ---------- */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const pickables = []; Object.values(groups).forEach((g) => g.traverse((o) => { if (o.isMesh) pickables.push(o); }));
  const groupOf = (o) => { while (o && !o.userData.key) o = o.parent; return o ? o.userData.key : null; };
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(pickables, false).find((h) => h.object.material.opacity > 0.3 && groupOf(h.object));
    const k = hit ? groupOf(hit.object) : null;
    return k === 'roof' ? 'l1' : k;
  }
  let down = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
    down = null; const k = pick(e); focus(k && k !== st.focus ? k : 'all');
  });
  if (!COARSE) renderer.domElement.addEventListener('pointermove', (e) => { if (!e.buttons) setHover(pick(e)); });
  renderer.domElement.addEventListener('pointerleave', () => setHover(null));

  /* ---------- buttons ---------- */
  document.getElementById('views').addEventListener('click', (e) => { const b = e.target.closest('[data-focus]'); if (b) focus(b.dataset.focus); });
  document.getElementById('floorList').addEventListener('click', (e) => { const b = e.target.closest('[data-floor]'); if (b) focus(b.dataset.floor === st.focus ? 'all' : b.dataset.floor); });
  document.getElementById('floorList').addEventListener('mouseover', (e) => { const b = e.target.closest('[data-floor]'); setHover(b ? b.dataset.floor : null); });
  document.getElementById('floorList').addEventListener('mouseleave', () => setHover(null));
  document.getElementById('explodeBtn').addEventListener('click', () => { st.manual = true; setExplode(st.explode > 0.5 ? 0 : 1); });
  const rotBtn = document.getElementById('rotateBtn');
  function touchRotate(on) { controls.enabled = on; renderer.domElement.style.touchAction = on ? 'none' : 'pan-y'; const k = on ? 'vDone' : 'vRotate'; if (rotBtn.dataset.t !== k) { rotBtn.dataset.t = k; MM.fill(rotBtn); } rotBtn.setAttribute('aria-pressed', String(on)); }
  if (COARSE) {
    touchRotate(false);
    const hint = document.getElementById('stageHint'); hint.dataset.t = 'vHintTouch'; MM.fill(hint);
    rotBtn.addEventListener('click', () => touchRotate(!controls.enabled));
    new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && controls.enabled) touchRotate(false); })).observe(stage);
  }
  let userMoved = false;
  controls.addEventListener('start', () => { userMoved = true; });

  /* ---------- camera home + scroll ---------- */
  function placeCamera(extra = 0) {
    const d = homeDist(), t = orbit.theta + extra, p = orbit.phi;
    camera.position.set(controls.target.x + d * Math.sin(p) * Math.sin(t), controls.target.y + d * Math.cos(p), controls.target.z + d * Math.sin(p) * Math.cos(t));
    camera.lookAt(controls.target);
  }
  const ST = window.ScrollTrigger;
  if (G && ST && !REDUCED) {
    // pin only where the whole section fits on screen; re-evaluated on resize and rotation
    const mq = G.matchMedia();
    mq.add('(min-width: 901px) and (min-height: 700px)', () => {
      const sec = document.getElementById('building');
      if (sec.offsetHeight > innerHeight + 4) { st.assemble = 1; layout(); return; }
      controls.autoRotate = false;
      const pin = ST.create({
        trigger: sec, start: 'top top', end: '+=170%', pin: true, scrub: true,
        onUpdate(self) {
          const p = self.progress;
          st.assemble = clamp(0.35 + p / 0.3);
          if (!st.manual) { st.explode = clamp((p - 0.5) / 0.38); syncExplodeBtn(st.explode > 0.5); }
          scrollTheta = p * 0.75;
          layout();
        },
      });
      ST.sort(); ST.refresh();
      return () => { pin.kill(); scrollTheta = 0; };
    });
    mq.add('(max-width: 900px), (max-height: 699px)', () => {
      const trig = ST.create({ trigger: '#stage', start: 'top 80%', once: true, onEnter: () => G.to(st, { assemble: 1, duration: 2.4, ease: 'power2.out', onUpdate: layout }) });
      controls.autoRotate = !REDUCED; controls.autoRotateSpeed = 0.5;
      return () => { trig.kill(); controls.autoRotate = false; st.assemble = 1; layout(); };
    });
  } else { st.assemble = 1; }
  layout();

  /* ---------- resize ---------- */
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h); labels.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!userMoved && st.focus === 'all') placeCamera(scrollTheta);
  }
  new ResizeObserver(resize).observe(host);
  resize();

  /* ---------- frame loop: runs only while the stage is on screen ---------- */
  const clock = new THREE.Clock(); let running = false, raf = 0;
  const wp = new THREE.Vector3();
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, clock.getDelta());
    if (!userMoved && st.focus === 'all' && !controls.autoRotate && performance.now() > flyingUntil) { orbit.theta += REDUCED ? 0 : dt * 0.015; placeCamera(scrollTheta); }
    controls.update();
    if (!REDUCED) {
      spits.forEach((s) => { s.rotation.y += dt * 1.4; });
      smokeAnchor.getWorldPosition(wp);
      const show = groups.roof.visible ? 1 : 0, dark = MM.theme.mode !== 'light', f = fadeTo.roof ?? 1;
      smoke.forEach((s) => { const u = s.userData; u.life += dt * u.speed; if (u.life > 1) { u.life = 0; u.dx = (Math.random() - 0.5) * 0.5; u.dz = (Math.random() - 0.5) * 0.5; }
        const L = u.life; s.position.set(wp.x + u.dx * L * 3 + L * 1.8, wp.y + L * 6, wp.z + u.dz * L * 3 + L * 0.8); const sc = 0.6 + L * 3.4; s.scale.set(sc, sc, 1);
        s.material.opacity = show * Math.sin(Math.PI * L) * (dark ? 0.32 : 0.26) * f; });
      embers.forEach((s) => { const u = s.userData; u.life += dt * u.speed; if (u.life > 1) u.life = 0;
        const L = u.life; s.position.set(wp.x + u.dx * L * 2, wp.y + L * 3, wp.z + u.dz * L * 2); s.scale.setScalar(0.12 + (1 - L) * 0.1);
        s.material.opacity = show * (1 - L) * (dark ? 0.9 : 0.55) * f; });
    }
    renderer.render(scene, camera); labels.render(scene, camera);
  }
  function start() { if (running) return; running = true; clock.getDelta(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { rootMargin: '120px' }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else { const r = stage.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) start(); } });

  /* ---------- theme + language hooks ---------- */
  MM.onTheme.push(() => { applyTheme(); if (!running) { renderer.render(scene, camera); labels.render(scene, camera); } });
  MM.onLang.push(() => { syncExplodeBtn(st.explode > 0.5); if (COARSE) touchRotate(controls.enabled); renderer.domElement.setAttribute('aria-label', MM.T('buildSub')); });
  applyTheme();
  renderer.domElement.setAttribute('aria-label', MM.T('buildSub'));
  placeCamera(0);
  renderer.render(scene, camera); labels.render(scene, camera);
  window.B3D = { focus, setExplode, state: st };
}
