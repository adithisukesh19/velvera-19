import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface LipstickConfig {
  bulletColor: string;
  caseColor?: 'gold' | 'obsidian';
  finish?: 'Velvet Matte' | 'Satin Silk' | 'Glass Gloss' | 'Luminous Shimmer';
  capMode?: 'beside' | 'hover' | 'closed';
}

/**
 * Procedurally generates an authentic, realistic luxury lipstick bullet geometry.
 * Slices a solid cylinder with an iconic diagonal teardrop face (42° slant),
 * matching the exact shape of high-end lipsticks (Chanel, Dior, Tom Ford).
 * NO cones, NO pointed tips, NO rocket shapes.
 */
export function createRealisticLipstickBulletGeometry(
  radius = 0.42,
  shaftBottom = 0,
  y0 = 0.85,
  m = 0.88,
  segments = 64
) {
  const geom = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const uvs: number[] = [];

  const ringCount = 10;

  // Generate cylinder walls from shaftBottom up to the slanted cut plane: y = y0 - m * z
  for (let r = 0; r <= ringCount; r++) {
    const v = r / ringCount;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      // The top rim is defined by the planar cut equation: y = y0 - m * z
      const topY = y0 - m * z;
      const y = shaftBottom + (topY - shaftBottom) * v;

      positions.push(x, y, z);
      uvs.push(i / segments, v);
    }
  }

  // Create triangles for the cylindrical walls
  for (let r = 0; r < ringCount; r++) {
    for (let i = 0; i < segments; i++) {
      const nextI = (i + 1) % segments;
      const p1 = r * segments + i;
      const p2 = r * segments + nextI;
      const p3 = (r + 1) * segments + i;
      const p4 = (r + 1) * segments + nextI;

      indices.push(p1, p3, p2);
      indices.push(p2, p3, p4);
    }
  }

  // The slanted top face: a flat, diagonal teardrop/oval face with subtle luxury concavity
  const topRimStart = ringCount * segments;
  const centerIdx = positions.length / 3;
  // Subtle sensual hollow in the center of the slanted facet
  positions.push(0, y0 - 0.035, 0);
  uvs.push(0.5, 0.5);

  for (let i = 0; i < segments; i++) {
    const nextI = (i + 1) % segments;
    indices.push(centerIdx, topRimStart + i, topRimStart + nextI);
  }

  // Bottom cap at shaftBottom
  const bottomCenterIdx = positions.length / 3;
  positions.push(0, shaftBottom, 0);
  uvs.push(0.5, 0.5);

  for (let i = 0; i < segments; i++) {
    const nextI = (i + 1) % segments;
    indices.push(bottomCenterIdx, nextI, i);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  return geom;
}

/**
 * Creates a complete luxury lipstick product assembly including:
 * 1. Base component (weighted outer cylinder/casing)
 * 2. Inner revolving tube / ferrule (polished mirror gold cylinder)
 * 3. Authentic slanted-facet lipstick bullet (pure cosmetic teardrop shape)
 * 4. Cap component (outer case cover with engraved crown)
 * 5. Ground contact shadow plane
 */
export function createLipstickModel(config: LipstickConfig) {
  const group = new THREE.Group();
  const isObsidian = config.caseColor === 'obsidian';
  const capMode = config.capMode || 'beside';

  // --- LUXURY PBR MATERIALS ---
  const goldMetalMat = new THREE.MeshPhysicalMaterial({
    color: 0xdfb86c,
    metalness: 0.96,
    roughness: 0.16,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
  });

  const mirrorRoseGoldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5caa6,
    metalness: 0.98,
    roughness: 0.08,
    clearcoat: 0.8,
    clearcoatRoughness: 0.05,
  });

  const casingMat = new THREE.MeshPhysicalMaterial({
    color: isObsidian ? 0x141416 : 0xd2ad66,
    metalness: isObsidian ? 0.35 : 0.95,
    roughness: isObsidian ? 0.2 : 0.22,
    clearcoat: isObsidian ? 0.9 : 0.4,
    clearcoatRoughness: 0.12,
  });

  // --- 1. BASE COMPONENT (OUTER LOWER CASING) ---
  const baseGroup = new THREE.Group();
  baseGroup.name = 'baseComponent';

  // Weighted bottom plate
  const basePlateGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.16, 48);
  const basePlate = new THREE.Mesh(basePlateGeo, goldMetalMat);
  basePlate.position.y = -1.95;
  basePlate.castShadow = true;
  baseGroup.add(basePlate);

  // Outer casing cylinder (the heavy lower body)
  const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.8, 48);
  const barrel = new THREE.Mesh(barrelGeo, casingMat);
  barrel.position.y = -1.0;
  barrel.castShadow = true;
  barrel.receiveShadow = true;
  baseGroup.add(barrel);

  // Middle engraved gold collar band (connecting base to tube)
  const collarBandGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.2, 48);
  const collarBand = new THREE.Mesh(collarBandGeo, goldMetalMat);
  collarBand.position.y = -0.05;
  collarBand.castShadow = true;
  baseGroup.add(collarBand);

  group.add(baseGroup);

  // --- 2. TUBE COMPONENT (INNER REVOLVING SLEEVE & FERRULE) ---
  const tubeGroup = new THREE.Group();
  tubeGroup.name = 'tubeComponent';

  // Inner revolving gold sleeve (slides out of the base)
  const innerSleeveGeo = new THREE.CylinderGeometry(0.68, 0.68, 1.1, 48);
  const innerSleeve = new THREE.Mesh(innerSleeveGeo, mirrorRoseGoldMat);
  innerSleeve.position.y = 0.55;
  innerSleeve.castShadow = true;
  tubeGroup.add(innerSleeve);

  // Inner beveled ferrule/ring holding the wax bullet
  const ferruleGeo = new THREE.CylinderGeometry(0.55, 0.68, 0.22, 48);
  const ferrule = new THREE.Mesh(ferruleGeo, goldMetalMat);
  ferrule.position.y = 1.15;
  ferrule.castShadow = true;
  tubeGroup.add(ferrule);

  group.add(tubeGroup);

  // --- 3. AUTHENTIC LIPSTICK BULLET (REAL SLANTED TEARDROP CUT) ---
  const bulletColor = new THREE.Color(config.bulletColor || '#500A18');
  const isMatte = config.finish === 'Velvet Matte' || !config.finish;
  const isGloss = config.finish === 'Glass Gloss';

  const bulletMat = new THREE.MeshPhysicalMaterial({
    color: bulletColor,
    roughness: isGloss ? 0.05 : isMatte ? 0.65 : 0.32,
    metalness: isGloss ? 0.02 : 0.04,
    clearcoat: isGloss ? 1.0 : isMatte ? 0.05 : 0.45,
    clearcoatRoughness: isGloss ? 0.04 : 0.25,
    sheen: isMatte ? 0.88 : 0.2,
    sheenRoughness: 0.3,
    sheenColor: bulletColor.clone().offsetHSL(0, 0.1, 0.12),
  });

  // Authentic slanted lipstick geometry
  // Sits inside the ferrule at y = 1.15 and rises to an angled crest at y ~ 2.45
  const bulletGeo = createRealisticLipstickBulletGeometry(0.46, 0.0, 0.95, 0.88, 64);
  const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);
  bulletMesh.position.set(0, 1.18, 0);
  bulletMesh.castShadow = true;
  bulletMesh.receiveShadow = true;
  group.add(bulletMesh);

  // --- 4. CAP COMPONENT (OUTER TOP CASING) ---
  const capGroup = new THREE.Group();
  capGroup.name = 'capComponent';

  // Cap cylinder body
  const capBodyGeo = new THREE.CylinderGeometry(0.81, 0.81, 2.3, 48, 1, true);
  const capBody = new THREE.Mesh(capBodyGeo, casingMat);
  capBody.castShadow = true;
  capGroup.add(capBody);

  // Cap top plate (beveled gold crown with monogram styling)
  const capCrownGeo = new THREE.CylinderGeometry(0.81, 0.81, 0.14, 48);
  const capCrown = new THREE.Mesh(capCrownGeo, goldMetalMat);
  capCrown.position.y = 1.15;
  capCrown.castShadow = true;
  capGroup.add(capCrown);

  // Position cap based on mode:
  // 'beside': Elegant studio display standing alongside the base on the platform
  // 'hover': Exploded vertical presentation aligned above the tube
  // 'closed': Fully seated over the tube covering the lipstick bullet
  applyCapPosition(capGroup, capMode);
  group.add(capGroup);

  // --- 5. GROUND CONTACT SHADOW PLANE ---
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(35, 20, 15, 0.45)');
    gradient.addColorStop(0.5, 'rgba(50, 30, 20, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowPlaneGeo = new THREE.PlaneGeometry(5.0, 5.0);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.65,
  });
  const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -2.05;
  group.add(shadowPlane);

  return {
    group,
    bulletMat,
    casingMat,
    capGroup,
    barrelMat: casingMat,
    capMat: casingMat,
  };
}

/**
 * Positions the cap according to the requested showroom mode.
 */
export function applyCapPosition(capGroup: THREE.Group, mode: 'beside' | 'hover' | 'closed') {
  if (mode === 'beside') {
    // Upright adjacent to the base on the same ground plane (classic luxury display)
    capGroup.position.set(1.45, -0.9, -0.15);
    capGroup.rotation.set(0, -0.2, 0);
  } else if (mode === 'hover') {
    // Exploded view hovering directly above the bullet
    capGroup.position.set(0, 3.2, 0);
    capGroup.rotation.set(0, 0, 0);
  } else {
    // Closed over the inner tube & bullet
    capGroup.position.set(0, 1.15, 0);
    capGroup.rotation.set(0, 0, 0);
  }
}

/**
 * Procedural studio environment map generator via RoomEnvironment & PMREM
 */
export function setupStudioEnvironment(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
  scene.environment = envTexture;
  pmremGenerator.dispose();
  roomEnv.dispose();
  return envTexture;
}
