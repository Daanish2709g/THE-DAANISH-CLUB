import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FabricOption, LapelType, ButtonStance } from '../types/suit';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sparkles } from 'lucide-react';

interface ThreeMannequinViewerProps {
  fabric: FabricOption;
  lapel: LapelType;
  buttonStance: ButtonStance;
  monogramText?: string;
  isCustomizing?: boolean;
}

export const ThreeMannequinViewer: React.FC<ThreeMannequinViewerProps> = ({
  fabric,
  lapel,
  buttonStance,
  monogramText,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const jacketGroupRef = useRef<THREE.Group | null>(null);
  const lapelGroupRef = useRef<THREE.Group | null>(null);
  const buttonsGroupRef = useRef<THREE.Group | null>(null);
  const jacketMeshRef = useRef<THREE.Mesh | null>(null);

  const [isRotating, setIsRotating] = useState(true);
  const [currentView, setCurrentView] = useState<'front' | 'angle' | 'side' | 'back'>('angle');
  const targetRotationY = useRef(0.45);
  const isDragging = useRef(false);
  const previousMouseX = useRef(0);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // Detect software WebGL capability cleanly
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0c0c10);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Atelier Lighting Rig (Warm golden key light + cool titanium rim light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyGoldLight = new THREE.DirectionalLight(0xffe8c2, 1.8);
    keyGoldLight.position.set(3, 4, 3);
    keyGoldLight.castShadow = true;
    scene.add(keyGoldLight);

    const rimSilverLight = new THREE.DirectionalLight(0xcfd8dc, 1.2);
    rimSilverLight.position.set(-3, 2, -2);
    scene.add(rimSilverLight);

    const softFillLight = new THREE.PointLight(0xc5a880, 0.8, 10);
    softFillLight.position.set(0, -1, 3);
    scene.add(softFillLight);

    // Root model group
    const mannequinRoot = new THREE.Group();
    scene.add(mannequinRoot);
    jacketGroupRef.current = mannequinRoot;

    // 1. Solid dark brass/titanium stand base
    const baseGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.08, 32);
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a20,
      metalness: 0.85,
      roughness: 0.25,
    });
    const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
    baseMesh.position.y = -1.95;
    mannequinRoot.add(baseMesh);

    // Vertical stand rod
    const rodGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.9, 16);
    const rodMesh = new THREE.Mesh(rodGeo, darkMetalMat);
    rodMesh.position.y = -1.0;
    mannequinRoot.add(rodMesh);

    // 2. Vintage carved wood neck finial (classic Savile Row mannequin)
    const neckFinialGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 24);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x3d271d,
      roughness: 0.4,
    });
    const neckFinial = new THREE.Mesh(neckFinialGeo, woodMat);
    neckFinial.position.y = 1.35;
    mannequinRoot.add(neckFinial);

    const topCapGeo = new THREE.SphereGeometry(0.14, 24, 16);
    const topCap = new THREE.Mesh(topCapGeo, woodMat);
    topCap.position.y = 1.55;
    mannequinRoot.add(topCap);

    // 3. Crisp dress shirt collar & silk tie
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f6,
      roughness: 0.2,
    });
    const collarGeo = new THREE.CylinderGeometry(0.26, 0.34, 0.35, 24, 1, true);
    const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
    collarMesh.position.y = 1.15;
    mannequinRoot.add(collarMesh);

    // Silk black-tie bow / tie knot
    const bowTieGeo = new THREE.BoxGeometry(0.3, 0.1, 0.06);
    const bowTieMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.3,
    });
    const bowTie = new THREE.Mesh(bowTieGeo, bowTieMat);
    bowTie.position.set(0, 1.08, 0.32);
    mannequinRoot.add(bowTie);

    // 4. Mannequin Torso & Jacket Body
    // Using sculpted capsule / truncated cone geometry to represent the sculpted chest and waist
    const chestGeo = new THREE.CylinderGeometry(0.48, 0.4, 0.9, 32);
    const fabricMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabric.colorHex),
      roughness: fabric.textureType === 'velvet' ? 0.95 : 0.45,
      metalness: fabric.textureType === 'pure-silk' ? 0.4 : 0.1,
    });
    const chestMesh = new THREE.Mesh(chestGeo, fabricMat);
    chestMesh.position.y = 0.55;
    chestMesh.castShadow = true;
    chestMesh.receiveShadow = true;
    mannequinRoot.add(chestMesh);
    jacketMeshRef.current = chestMesh;

    // Sculpted lower skirt / jacket quarters
    const skirtGeo = new THREE.CylinderGeometry(0.4, 0.46, 0.8, 32);
    const skirtMesh = new THREE.Mesh(skirtGeo, fabricMat);
    skirtMesh.position.y = -0.3;
    skirtMesh.castShadow = true;
    mannequinRoot.add(skirtMesh);

    // Shoulders
    const leftShoulderGeo = new THREE.SphereGeometry(0.22, 24, 16);
    const leftShoulder = new THREE.Mesh(leftShoulderGeo, fabricMat);
    leftShoulder.position.set(0.55, 0.9, 0);
    mannequinRoot.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(leftShoulderGeo, fabricMat);
    rightShoulder.position.set(-0.55, 0.9, 0);
    mannequinRoot.add(rightShoulder);

    // Gold silk pocket square in chest welt
    const pocketSquareGeo = new THREE.BoxGeometry(0.12, 0.07, 0.04);
    const goldSquareMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.6,
      roughness: 0.2,
    });
    const pocketSquare = new THREE.Mesh(pocketSquareGeo, goldSquareMat);
    pocketSquare.position.set(0.26, 0.72, 0.44);
    pocketSquare.rotation.z = 0.15;
    mannequinRoot.add(pocketSquare);

    // Group for interchangeable lapels
    const lapelGroup = new THREE.Group();
    mannequinRoot.add(lapelGroup);
    lapelGroupRef.current = lapelGroup;

    // Group for interchangeable buttons
    const buttonsGroup = new THREE.Group();
    mannequinRoot.add(buttonsGroup);
    buttonsGroupRef.current = buttonsGroup;

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (mannequinRoot) {
        // Smooth interpolation towards target rotation
        mannequinRoot.rotation.y += (targetRotationY.current - mannequinRoot.rotation.y) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Lapels when lapel or fabric changes
  useEffect(() => {
    if (!lapelGroupRef.current) return;
    const group = lapelGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const lapelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabric.colorHex),
      roughness: 0.25, // silk satin facet
      metalness: 0.35,
    });

    if (lapel === 'peak') {
      // Sculpted peak lapels with sharp upward point
      const peakShape = new THREE.Shape();
      peakShape.moveTo(0, 0);
      peakShape.lineTo(0.24, 0.7);
      peakShape.lineTo(0.38, 0.62);
      peakShape.lineTo(0.12, 0.1);
      peakShape.closePath();

      const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.01, bevelThickness: 0.01 };
      const peakGeo = new THREE.ExtrudeGeometry(peakShape, extrudeSettings);

      const rightLapel = new THREE.Mesh(peakGeo, lapelMat);
      rightLapel.position.set(0.04, 0.38, 0.44);
      rightLapel.rotation.y = -0.15;
      group.add(rightLapel);

      const leftLapel = rightLapel.clone();
      leftLapel.scale.x = -1;
      leftLapel.position.set(-0.04, 0.38, 0.44);
      leftLapel.rotation.y = 0.15;
      group.add(leftLapel);
    } else if (lapel === 'notch') {
      // Classic step notch lapel
      const notchGeo = new THREE.BoxGeometry(0.14, 0.65, 0.03);
      const rightNotch = new THREE.Mesh(notchGeo, lapelMat);
      rightNotch.position.set(0.18, 0.65, 0.45);
      rightNotch.rotation.z = -0.18;
      group.add(rightNotch);

      const leftNotch = new THREE.Mesh(notchGeo, lapelMat);
      leftNotch.position.set(-0.18, 0.65, 0.45);
      leftNotch.rotation.z = 0.18;
      group.add(leftNotch);
    } else if (lapel === 'shawl') {
      // Smooth continuous shawl collar
      const curveGeo = new THREE.TorusGeometry(0.36, 0.08, 16, 32, Math.PI * 0.95);
      const shawl = new THREE.Mesh(curveGeo, lapelMat);
      shawl.position.set(0, 0.72, 0.44);
      shawl.rotation.z = Math.PI;
      shawl.rotation.x = -0.2;
      group.add(shawl);
    }
  }, [lapel, fabric]);

  // Update Buttons when buttonStance changes
  useEffect(() => {
    if (!buttonsGroupRef.current) return;
    const group = buttonsGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x111115,
      metalness: 0.9,
      roughness: 0.2,
    });
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
    });

    const createButton = (x: number, y: number, z: number) => {
      const btnGroup = new THREE.Group();
      const btnGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.015, 24);
      btnGeo.rotateX(Math.PI / 2);
      const core = new THREE.Mesh(btnGeo, buttonMat);
      const rimGeo = new THREE.TorusGeometry(0.036, 0.005, 12, 24);
      const rim = new THREE.Mesh(rimGeo, goldRimMat);
      btnGroup.add(core);
      btnGroup.add(rim);
      btnGroup.position.set(x, y, z);
      return btnGroup;
    };

    if (buttonStance === '1-button') {
      group.add(createButton(0, 0.25, 0.48));
    } else if (buttonStance === '2-button') {
      group.add(createButton(0, 0.35, 0.48));
      group.add(createButton(0, 0.15, 0.47));
    } else if (buttonStance === '4x2-double-breasted') {
      group.add(createButton(-0.12, 0.35, 0.48));
      group.add(createButton(0.12, 0.35, 0.48));
      group.add(createButton(-0.12, 0.15, 0.47));
      group.add(createButton(0.12, 0.15, 0.47));
    } else if (buttonStance === '6x2-double-breasted') {
      group.add(createButton(-0.14, 0.55, 0.47));
      group.add(createButton(0.14, 0.55, 0.47));
      group.add(createButton(-0.13, 0.35, 0.48));
      group.add(createButton(0.13, 0.35, 0.48));
      group.add(createButton(-0.12, 0.15, 0.47));
      group.add(createButton(0.12, 0.15, 0.47));
    }
  }, [buttonStance]);

  // Update fabric color & texture on body
  useEffect(() => {
    if (!jacketMeshRef.current) return;
    const mat = jacketMeshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.color.set(fabric.colorHex);
      mat.roughness = fabric.textureType === 'velvet' ? 0.95 : 0.45;
      mat.metalness = fabric.textureType === 'pure-silk' ? 0.35 : 0.1;
      mat.needsUpdate = true;
    }
  }, [fabric]);

  // Touch and Mouse Orbit Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMouseX.current = e.clientX;
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouseX.current;
    previousMouseX.current = e.clientX;
    targetRotationY.current += deltaX * 0.012;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMouseX.current = e.touches[0].clientX;
      setIsRotating(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMouseX.current;
    previousMouseX.current = e.touches[0].clientX;
    targetRotationY.current += deltaX * 0.015;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Preset view buttons
  const setPresetAngle = (view: 'front' | 'angle' | 'side' | 'back') => {
    setCurrentView(view);
    setIsRotating(false);
    if (view === 'front') targetRotationY.current = 0;
    if (view === 'angle') targetRotationY.current = 0.55;
    if (view === 'side') targetRotationY.current = Math.PI / 2;
    if (view === 'back') targetRotationY.current = Math.PI;
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (direction === 'in' && cam.position.z > 3.0) {
      cam.position.z -= 0.4;
    } else if (direction === 'out' && cam.position.z < 6.0) {
      cam.position.z += 0.4;
    }
  };

  return (
    <div className="relative w-full h-[460px] md:h-[540px] bg-[#0E0E12] rounded-xl overflow-hidden border border-[#27272A] shadow-2xl flex flex-col items-center justify-center select-none">
      {/* Top 3D Status & Monogram Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5A880] ring-4 ring-[#C5A880]/20" />
          <span className="text-xs uppercase tracking-widest text-[#E5E7EB] font-medium">
            3D Bespoke Trial · {fabric.name}
          </span>
        </div>
        {monogramText && (
          <div className="bg-[#18181B]/80 backdrop-blur-md px-3 py-1 rounded border border-[#C5A880]/40 text-[#C5A880] text-xs font-serif italic tracking-wider">
            Monogram: {monogramText}
          </div>
        )}
      </div>

      {/* Interactive 3D Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        data-testid="mannequin-3d-canvas"
        title="Click and drag to rotate 360°"
      />

      {/* Floating View Presets & Zoom Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-auto">
        {/* Preset Angles */}
        <div className="flex items-center gap-1 bg-[#141418]/90 backdrop-blur-md p-1 rounded-lg border border-[#2E2E36]">
          {(['front', 'angle', 'side', 'back'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setPresetAngle(v)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors capitalize ${
                currentView === v
                  ? 'bg-[#C5A880] text-[#0A0A0C] font-semibold shadow-sm'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Orbit hint & Zoom */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="p-2 bg-[#141418]/90 hover:bg-[#202026] text-[#E5E7EB] rounded-lg border border-[#2E2E36] transition-colors"
            aria-label="Zoom in mannequin"
          >
            <ZoomIn className="w-4 h-4 text-[#C5A880]" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="p-2 bg-[#141418]/90 hover:bg-[#202026] text-[#E5E7EB] rounded-lg border border-[#2E2E36] transition-colors"
            aria-label="Zoom out mannequin"
          >
            <ZoomOut className="w-4 h-4 text-[#C5A880]" />
          </button>
          <button
            type="button"
            onClick={() => {
              targetRotationY.current += 1.2;
              setIsRotating(true);
            }}
            className="p-2 bg-[#141418]/90 hover:bg-[#202026] text-[#E5E7EB] rounded-lg border border-[#2E2E36] transition-colors"
            aria-label="Rotate mannequin"
            title="Rotate 360°"
          >
            <RotateCw className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>
      </div>

      {/* Drag Helper Tip */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[11px] text-[#9CA3AF] pointer-events-none opacity-80">
        Drag to inspect silhouette & drape in 360°
      </div>
    </div>
  );
};
