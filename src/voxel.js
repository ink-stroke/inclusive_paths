// Voxel primitives: build a Group from a {color: [[x,y,z], ...]} spec.
// One InstancedMesh per color keeps draw calls small even for chunky figures.

import { THREE } from './three-setup.js';

const BOX = new THREE.BoxGeometry(1, 1, 1);

export function makeVoxelGroup(spec) {
  const group = new THREE.Group();
  for (const [colorKey, positions] of Object.entries(spec)) {
    if (!positions.length) continue;
    const color = Number(colorKey);
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.InstancedMesh(BOX, mat, positions.length);
    const m = new THREE.Matrix4();
    positions.forEach((p, i) => {
      m.makeTranslation(p[0], p[1], p[2]);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    group.add(mesh);
  }
  return group;
}

export function makePlate(width, depth, color, y = 0) {
  const positions = [];
  for (let x = -Math.floor(width / 2); x < Math.ceil(width / 2); x++) {
    for (let z = -Math.floor(depth / 2); z < Math.ceil(depth / 2); z++) {
      positions.push([x, y, z]);
    }
  }
  return makeVoxelGroup({ [color]: positions });
}

export function makeGlow(color) {
  // A single brighter cube floating above the ground — choice marker.
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 });
  const mesh = new THREE.Mesh(BOX, mat);
  return mesh;
}
