import * as THREE from 'three';

/* ── Animal breed detection from Chinese NPC names ── */
const breedMap: Record<string, string> = {
  柯: 'dog', 柴: 'dog', 哈: 'dog',
  熊猫: 'panda',
  鹦鹉: 'parrot', 鹉: 'parrot',
  浣熊: 'raccoon',
  树懒: 'sloth',
  啄木鸟: 'bird',
  海狸: 'beaver',
  兔: 'rabbit',
  松鼠: 'squirrel',
  鸭: 'duck',
  猴: 'monkey',
  狮子: 'lion', 狮: 'lion',
  猪: 'pig',
  狐狸: 'fox', 狐: 'fox',
  喵: 'cat',
  猫头鹰: 'owl',
  鳄鱼: 'crocodile', 鳄: 'crocodile',
  仓鼠: 'hamster',
  企鹅: 'penguin', 鹅: 'penguin',
  棕熊: 'bear', 熊: 'bear',
  老虎: 'tiger', 虎: 'tiger',
  羊驼: 'alpaca',
  考拉: 'koala',
};

function detectBreed(name: string): string {
  for (const key in breedMap) {
    if (name.includes(key)) return breedMap[key];
  }
  return 'blob'; // fallback generic cute blob
}

/* ── Palette per breed ── */
const breedPalette: Record<string, { main: number; sec: number; belly: number }> = {
  dog:       { main: 0xe8a866, sec: 0xd4934d, belly: 0xf5d4a8 },
  panda:     { main: 0xffffff, sec: 0x333333, belly: 0xffffff },
  parrot:    { main: 0x66dd88, sec: 0xffcc22, belly: 0xaaffcc },
  raccoon:   { main: 0x887788, sec: 0x443344, belly: 0xaaa0aa },
  sloth:     { main: 0xbbaa88, sec: 0x8b7a5e, belly: 0xd4c9a8 },
  bird:      { main: 0xcc4444, sec: 0x88aacc, belly: 0xeeddaa },
  beaver:    { main: 0xa07850, sec: 0x503820, belly: 0xc8a880 },
  rabbit:    { main: 0xffb7d5, sec: 0xff8fab, belly: 0xfff0f5 },
  squirrel:  { main: 0xcc7744, sec: 0x995522, belly: 0xe8aa77 },
  duck:      { main: 0xffdd44, sec: 0xffaa22, belly: 0xfff8cc },
  monkey:    { main: 0xbb8855, sec: 0x8b5e2e, belly: 0xddbb88 },
  lion:      { main: 0xeebb44, sec: 0xcc9933, belly: 0xffe288 },
  pig:       { main: 0xffaacc, sec: 0xdd88aa, belly: 0xffddf0 },
  fox:       { main: 0xdd7722, sec: 0xaa5511, belly: 0xf5e6d3 },
  cat:       { main: 0xffaa55, sec: 0xdd8833, belly: 0xffddaa },
  owl:       { main: 0x886644, sec: 0x553322, belly: 0xbb9977 },
  crocodile: { main: 0x44aa66, sec: 0x227744, belly: 0x88cc99 },
  hamster:   { main: 0xeebb99, sec: 0xcc9966, belly: 0xffeedd },
  penguin:   { main: 0x333344, sec: 0xffffff, belly: 0xffffff },
  bear:      { main: 0x995533, sec: 0x774422, belly: 0xbb8855 },
  tiger:     { main: 0xff9922, sec: 0x333333, belly: 0xffddaa },
  alpaca:    { main: 0xeeddaa, sec: 0xccbb88, belly: 0xfff8ee },
  koala:     { main: 0x8899aa, sec: 0x667788, belly: 0xaabbcc },
  blob:      { main: 0xff88bb, sec: 0xdd6699, belly: 0xffccee },
};

/* ── Exported type ── */
export interface Animal3D {
  group: THREE.Group;
  body: THREE.Mesh;
  headGroup: THREE.Group;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftEar: THREE.Mesh | null;
  rightEar: THREE.Mesh | null;
  tail: THREE.Mesh | null;
  hitMesh: THREE.Mesh;
  npcId: string;
  npcName: string;
  baseY: number;
  baseX: number;
  baseZ: number;
  phase: number;
  animType: 'idle' | 'happy' | 'angry' | 'tired' | 'dancing' | 'typing';
  bubble: THREE.Mesh | null;
  breed: string;
}

/* ── Create a cute bubbly 3D animal from primitive shapes ── */
export function createAnimal3D(
  npcId: string,
  npcName: string,
  color: number,
  pos: [number, number, number],
  scene: THREE.Scene
): Animal3D {
  const breed = detectBreed(npcName);
  const pal = breedPalette[breed] || breedPalette.blob;
  const group = new THREE.Group();
  group.position.set(pos[0], pos[1], pos[2]);

  // ── Body: chubby sphere ──
  const bodyGeo = new THREE.SphereGeometry(0.38, 20, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.5, metalness: 0.05 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.42;
  body.castShadow = true;
  group.add(body);

  // Belly patch
  const bellyGeo = new THREE.SphereGeometry(0.26, 16, 12);
  const bellyMat = new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.6 });
  const belly = new THREE.Mesh(bellyGeo, bellyMat);
  belly.position.set(0, 0.38, 0.22);
  belly.scale.set(1, 0.9, 0.5);
  group.add(belly);

  // ── Head group ──
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.78, 0);
  group.add(headGroup);

  // Head sphere
  const headGeo = new THREE.SphereGeometry(0.28, 20, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.45 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.castShadow = true;
  headGroup.add(head);

  // Cheeks (chubbier)
  const cheekGeo = new THREE.SphereGeometry(0.12, 12, 10);
  const cheekMat = new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.5 });
  const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
  leftCheek.position.set(-0.18, -0.06, 0.18);
  leftCheek.scale.set(1, 0.8, 0.6);
  headGroup.add(leftCheek);
  const rightCheek = leftCheek.clone();
  rightCheek.position.set(0.18, -0.06, 0.18);
  headGroup.add(rightCheek);

  // Eyes (big and cute)
  const eyeWhiteGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const leftEyeW = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  leftEyeW.position.set(-0.1, 0.04, 0.22);
  headGroup.add(leftEyeW);
  const rightEyeW = leftEyeW.clone();
  rightEyeW.position.set(0.1, 0.04, 0.22);
  headGroup.add(rightEyeW);

  const eyePupilGeo = new THREE.SphereGeometry(0.04, 10, 10);
  const eyePupilMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.1 });
  const leftPupil = new THREE.Mesh(eyePupilGeo, eyePupilMat);
  leftPupil.position.set(-0.1, 0.04, 0.28);
  headGroup.add(leftPupil);
  const rightPupil = leftPupil.clone();
  rightPupil.position.set(0.1, 0.04, 0.28);
  headGroup.add(rightPupil);

  // Eye highlights
  const hlGeo = new THREE.SphereGeometry(0.015, 6, 6);
  const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftHL = new THREE.Mesh(hlGeo, hlMat);
  leftHL.position.set(-0.08, 0.07, 0.30);
  headGroup.add(leftHL);
  const rightHL = leftHL.clone();
  rightHL.position.set(0.12, 0.07, 0.30);
  headGroup.add(rightHL);

  // Snout / nose area
  const snoutGeo = new THREE.SphereGeometry(0.08, 12, 10);
  const snoutMat = new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.5 });
  const snout = new THREE.Mesh(snoutGeo, snoutMat);
  snout.position.set(0, -0.08, 0.24);
  snout.scale.set(1.3, 0.8, 0.8);
  headGroup.add(snout);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const noseMat = new THREE.MeshStandardMaterial({ color: pal.sec, roughness: 0.3 });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.set(0, -0.06, 0.31);
  headGroup.add(nose);

  // ── Ears (breed-specific) ──
  let leftEar: THREE.Mesh | null = null;
  let rightEar: THREE.Mesh | null = null;

  function addEars(geo: THREE.BufferGeometry, scale: [number, number, number], yOff: number, zOff: number, spread: number) {
    const earMat = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.5 });
    const le = new THREE.Mesh(geo, earMat);
    le.position.set(-spread, yOff, zOff);
    le.scale.set(...scale);
    le.castShadow = true;
    headGroup.add(le);
    const re = le.clone();
    re.position.set(spread, yOff, zOff);
    headGroup.add(re);
    // Inner ear
    const innerGeo = geo.clone();
    const innerMat = new THREE.MeshStandardMaterial({ color: pal.belly, roughness: 0.6 });
    const li = new THREE.Mesh(innerGeo, innerMat);
    li.position.set(-spread * 0.85, yOff * 0.9, zOff + 0.04);
    li.scale.set(scale[0] * 0.6, scale[1] * 0.6, scale[2] * 0.5);
    headGroup.add(li);
    const ri = li.clone();
    ri.position.set(spread * 0.85, yOff * 0.9, zOff + 0.04);
    headGroup.add(ri);
    return [le, re];
  }

  if (breed === 'rabbit' || breed === 'cat' || breed === 'fox') {
    // Tall pointy ears
    const earGeo = new THREE.ConeGeometry(0.08, 0.22, 10);
    const ears = addEars(earGeo, [0.9, 1, 0.6], 0.24, 0, 0.14);
    leftEar = ears[0]; rightEar = ears[1];
  } else if (breed === 'dog' || breed === 'bear' || breed === 'panda') {
    // Round ears on top
    const earGeo = new THREE.SphereGeometry(0.08, 12, 10);
    const ears = addEars(earGeo, [1, 1, 0.7], 0.24, 0, 0.16);
    leftEar = ears[0]; rightEar = ears[1];
  } else if (breed === 'monkey' || breed === 'lion' || breed === 'hamster') {
    // Tiny round ears
    const earGeo = new THREE.SphereGeometry(0.06, 10, 8);
    const ears = addEars(earGeo, [1, 1, 0.8], 0.2, -0.02, 0.18);
    leftEar = ears[0]; rightEar = ears[1];
  } else if (breed === 'tiger') {
    // Round ears with flat top
    const earGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.08, 10);
    const ears = addEars(earGeo, [1, 0.8, 0.8], 0.26, 0, 0.15);
    leftEar = ears[0]; rightEar = ears[1];
  } else {
    // Small nub ears (default cute)
    const earGeo = new THREE.SphereGeometry(0.06, 10, 8);
    const ears = addEars(earGeo, [1, 0.9, 0.7], 0.22, 0, 0.16);
    leftEar = ears[0]; rightEar = ears[1];
  }

  // ── Arms (chubby short) ──
  const armGeo = new THREE.CapsuleGeometry(0.07, 0.18, 8, 12);
  const armMat = new THREE.MeshStandardMaterial({ color: pal.main, roughness: 0.5 });

  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(-0.32, 0.45, 0.12);
  leftArm.rotation.z = 0.35;
  leftArm.rotation.x = -0.3;
  leftArm.castShadow = true;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, armMat);
  rightArm.position.set(0.32, 0.45, 0.12);
  rightArm.rotation.z = -0.35;
  rightArm.rotation.x = -0.3;
  rightArm.castShadow = true;
  group.add(rightArm);

  // ── Legs (tiny nubs) ──
  const legGeo = new THREE.SphereGeometry(0.1, 10, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: pal.sec, roughness: 0.5 });
  const legL = new THREE.Mesh(legGeo, legMat);
  legL.position.set(-0.15, 0.06, 0.2);
  legL.scale.set(1, 0.6, 1.2);
  group.add(legL);
  const legR = legL.clone();
  legR.position.set(0.15, 0.06, 0.2);
  group.add(legR);

  // ── Tail (breed-specific) ──
  let tail: THREE.Mesh | null = null;
  if (breed === 'dog' || breed === 'cat' || breed === 'rabbit') {
    const tailGeo = new THREE.SphereGeometry(0.08, 10, 8);
    const tailMat = new THREE.MeshStandardMaterial({ color: pal.sec, roughness: 0.5 });
    tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, 0.35, -0.35);
    group.add(tail);
  } else if (breed === 'squirrel' || breed === 'fox') {
    const tailGeo = new THREE.ConeGeometry(0.1, 0.35, 10);
    const tailMat = new THREE.MeshStandardMaterial({ color: pal.sec, roughness: 0.5 });
    tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, 0.5, -0.38);
    tail.rotation.x = -0.8;
    group.add(tail);
  } else if (breed === 'panda') {
    const tailGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    tail = new THREE.Mesh(tailGeo, tailMat);
    tail.position.set(0, 0.32, -0.34);
    group.add(tail);
  }

  // ── Hit sphere (invisible, for raycasting) ──
  const hitGeo = new THREE.SphereGeometry(0.55, 12, 12);
  const hitMat = new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0 });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.position.set(pos[0], pos[1] + 0.6, pos[2]);
  hitMesh.userData = { npcId };
  scene.add(hitMesh);

  scene.add(group);

  return {
    group, body, headGroup, leftArm, rightArm, leftEar, rightEar,
    tail, hitMesh, npcId, npcName,
    baseY: pos[1], baseX: pos[0], baseZ: pos[2],
    phase: Math.random() * Math.PI * 2,
    animType: ['idle', 'happy', 'tired', 'typing'][Math.floor(Math.random() * 4)] as Animal3D['animType'],
    bubble: null,
    breed,
  };
}

/* ── Speech bubble above animal's head ── */
export function createSpeechBubble(text: string, color: string): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  // Rounded rect bg
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  const r = 20;
  const w = 240; const h = 64; const x = 8; const y = 8;
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + 50, y + h); ctx.lineTo(x + 30, y + h + 16); ctx.lineTo(x + 40, y + h);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath(); ctx.fill();
  // Border
  ctx.strokeStyle = color; ctx.lineWidth = 4;
  ctx.stroke();
  // Text
  ctx.fillStyle = '#333';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 42);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.45), mat);
  mesh.renderOrder = 999;
  return mesh;
}

/* ── Animation state machine ── */
export function updateAnimal3D(a: Animal3D, t: number, _dt?: number): void {
  const { group, headGroup, leftArm, rightArm, tail, baseY, phase } = a;
  const tp = t + phase;

  switch (a.animType) {
    case 'idle': {
      // Gentle breathing bob
      group.position.y = baseY + Math.sin(tp * 1.5) * 0.015;
      // Head sways slightly
      headGroup.rotation.y = Math.sin(tp * 0.8) * 0.08;
      headGroup.rotation.x = Math.sin(tp * 1.2) * 0.03;
      // Arms dangle gently
      leftArm.rotation.z = 0.35 + Math.sin(tp * 1.5) * 0.05;
      rightArm.rotation.z = -0.35 - Math.sin(tp * 1.5 + 0.5) * 0.05;
      // Tail wags slow
      if (tail) { tail.rotation.y = Math.sin(tp * 2) * 0.15; tail.rotation.z = Math.sin(tp * 1.5) * 0.1; }
      break;
    }
    case 'happy': {
      // Bouncing!
      const bounce = Math.abs(Math.sin(tp * 6));
      group.position.y = baseY + bounce * 0.18;
      group.rotation.y = Math.sin(tp * 3) * 0.2;
      // Arms up in joy
      leftArm.rotation.z = 2.0 + Math.sin(tp * 8) * 0.4;
      rightArm.rotation.z = -2.0 - Math.sin(tp * 8) * 0.4;
      // Head nodding
      headGroup.rotation.x = -0.2 + Math.sin(tp * 6) * 0.15;
      // Fast tail wag
      if (tail) { tail.rotation.y = Math.sin(tp * 10) * 0.5; }
      break;
    }
    case 'angry': {
      // Shaking left-right
      group.position.x = a.baseX + Math.sin(tp * 18) * 0.04;
      group.position.y = baseY;
      // Arms flailing
      leftArm.rotation.z = 0.8 + Math.sin(tp * 12) * 0.6;
      rightArm.rotation.z = -0.8 - Math.sin(tp * 12 + 1) * 0.6;
      // Head tilting aggressively
      headGroup.rotation.z = Math.sin(tp * 15) * 0.1;
      headGroup.rotation.x = 0.15;
      // Body turns red-ish via emissive flash
      const flash = 0.1 + Math.sin(tp * 8) * 0.1;
      (a.body.material as THREE.MeshStandardMaterial).emissive.setRGB(flash * 0.5, 0, 0);
      break;
    }
    case 'tired': {
      // Slouched forward
      group.rotation.x = 0.2;
      group.position.y = baseY - 0.06;
      // Head droops
      headGroup.rotation.x = 0.35 + Math.sin(tp * 0.5) * 0.05;
      // Arms hang down
      leftArm.rotation.z = 0.1; leftArm.rotation.x = 0.5;
      rightArm.rotation.z = -0.1; rightArm.rotation.x = 0.5;
      break;
    }
    case 'dancing': {
      // Spinning + bouncing
      group.rotation.y = tp * 2.5;
      group.position.y = baseY + Math.abs(Math.sin(tp * 5)) * 0.15;
      // Arms waving wildly
      leftArm.rotation.z = 1.2 + Math.sin(tp * 6) * 0.8;
      rightArm.rotation.z = -1.2 - Math.sin(tp * 7) * 0.8;
      leftArm.rotation.x = Math.sin(tp * 4) * 0.5;
      rightArm.rotation.x = Math.cos(tp * 4) * 0.5;
      // Head banging
      headGroup.rotation.x = Math.sin(tp * 8) * 0.2;
      // Tail spinning
      if (tail) { tail.rotation.z = Math.sin(tp * 12) * 0.8; }
      break;
    }
    case 'typing': {
      // Fast jitter
      group.position.y = baseY + Math.sin(tp * 20) * 0.008;
      group.position.x = a.baseX + Math.sin(tp * 30) * 0.003;
      // Arms typing rapidly
      leftArm.rotation.x = -0.8 + Math.sin(tp * 15) * 0.3;
      rightArm.rotation.x = -0.8 + Math.sin(tp * 17) * 0.3;
      leftArm.rotation.z = 0.2 + Math.sin(tp * 12) * 0.1;
      rightArm.rotation.z = -0.2 - Math.sin(tp * 13) * 0.1;
      // Head leaned forward
      headGroup.rotation.x = 0.25 + Math.sin(tp * 2) * 0.03;
      break;
    }
  }

  // ── Reset emissive if not angry ──
  if (a.animType !== 'angry') {
    (a.body.material as THREE.MeshStandardMaterial).emissive.setRGB(0, 0, 0);
  }

  // ── Update bubble position ──
  if (a.bubble) {
    a.bubble.position.set(a.baseX, group.position.y + 1.55, a.baseZ);
  }
}

/* ── Change animation type with probability ── */
export function maybeChangeAnimation(a: Animal3D): void {
  const types: Animal3D['animType'][] = ['idle', 'happy', 'angry', 'tired', 'dancing', 'typing'];
  // 2% chance per frame to switch
  if (Math.random() < 0.02) {
    const newType = types[Math.floor(Math.random() * types.length)];
    a.animType = newType;
    // Reset body rotation when changing states
    a.group.rotation.set(0, 0, 0);
  }
}

/* ── Cleanup ── */
export function destroyAnimal3D(a: Animal3D, scene: THREE.Scene): void {
  scene.remove(a.group);
  scene.remove(a.hitMesh);
  if (a.bubble) scene.remove(a.bubble);
  // Dispose geometries and materials
  a.group.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
  });
}
