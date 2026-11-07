import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FabricOption } from '../types/suit';
import { calculateDrapeFluidity, deriveMaterialProperties } from '../utils/fabric';
import { Sparkles, Layers, Eye, Move } from 'lucide-react';

interface ThreeFabricDrapeViewerProps {
  fabric: FabricOption;
  isHovered?: boolean;
}

export const ThreeFabricDrapeViewer: React.FC<ThreeFabricDrapeViewerProps> = ({
  fabric,
  isHovered = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clothMeshRef = useRef<THREE.Mesh | null>(null);
  const mousePosition = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [touchActive, setTouchActive] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0e0e12);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Atelier Lighting Rig for tactile fabric sheen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyGoldLight = new THREE.DirectionalLight(0xffe8c6, 2.2);
    keyGoldLight.position.set(2.5, 3.5, 2.8);
    scene.add(keyGoldLight);

    const rimSilverLight = new THREE.DirectionalLight(0xd1d5db, 1.4);
    rimSilverLight.position.set(-2.5, 1.8, -1.5);
    scene.add(rimSilverLight);

    const grazingLight = new THREE.PointLight(0xc5a880, 0.9, 8);
    grazingLight.position.set(0, -1.8, 1.8);
    scene.add(grazingLight);

    // Procedural 3D Draped Textile Mesh
    // High-resolution plane geometry with undulating soft folds
    const geometry = new THREE.PlaneGeometry(2.0, 2.0, 48, 48);
    const pos = geometry.attributes.position;
    const initialZ = new Float32Array(pos.count);

    // Compute sculptural drape ripples based on physical fabric stiffness and fluidity
    const fluidityMetrics = calculateDrapeFluidity(fabric.drapeStiffness);
    const waveFreq = fluidityMetrics.rippleFrequency;
    const waveAmp = fluidityMetrics.rippleAmplitude * 1.6;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Cascading diagonal waterfall drape folds
      const fold =
        Math.sin(x * waveFreq + y * 1.5) * waveAmp * (1 - (y + 1) * 0.25) +
        Math.cos(x * 1.8 - y * 2.2) * (waveAmp * 0.5);
      pos.setZ(i, fold);
      initialZ[i] = fold;
    }
    geometry.computeVertexNormals();

    // Procedural Weave Bump Texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);

      // Fine twill / pinstripe / houndstooth weave generator
      ctx.lineWidth = 1;
      for (let y = 0; y < 256; y += 4) {
        for (let x = 0; x < 256; x += 4) {
          const isWeft = (x + y) % 8 === 0;
          ctx.fillStyle = isWeft ? '#a0a0a0' : '#606060';
          ctx.fillRect(x, y, 3, 3);
        }
      }

      if (fabric.textureType === 'pinstripe') {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 2;
        for (let x = 32; x < 256; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 256);
          ctx.stroke();
        }
      } else if (fabric.textureType === 'houndstooth') {
        ctx.fillStyle = '#c5a880';
        for (let y = 0; y < 256; y += 16) {
          for (let x = 0; x < 256; x += 16) {
            ctx.fillRect(x, y, 6, 6);
            ctx.fillRect(x + 6, y + 6, 6, 6);
          }
        }
      }
    }
    const bumpTexture = new THREE.CanvasTexture(canvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(6, 6);

    const pbrProps = deriveMaterialProperties(fabric);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(fabric.colorHex),
      bumpMap: bumpTexture,
      bumpScale: pbrProps.bumpScale,
      roughness: pbrProps.roughness,
      metalness: pbrProps.metalness,
      side: THREE.DoubleSide,
    });

    const clothMesh = new THREE.Mesh(geometry, material);
    scene.add(clothMesh);
    clothMeshRef.current = clothMesh;

    // Brass fabric bolt suspension bar
    const barGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.3, 24);
    barGeo.rotateZ(Math.PI / 2);
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.9,
      roughness: 0.2,
    });
    const brassBar = new THREE.Mesh(barGeo, brassMat);
    brassBar.position.set(0, 1.05, 0);
    scene.add(brassBar);

    // Finials
    const finialGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftFinial = new THREE.Mesh(finialGeo, brassMat);
    leftFinial.position.set(-1.18, 1.05, 0);
    scene.add(leftFinial);

    const rightFinial = new THREE.Mesh(finialGeo, brassMat);
    rightFinial.position.set(1.18, 1.05, 0);
    scene.add(rightFinial);

    // 3D Render Loop with subtle cloth drape physics
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse tilt damping
      mousePosition.current.x += (mousePosition.current.targetX - mousePosition.current.x) * 0.08;
      mousePosition.current.y += (mousePosition.current.targetY - mousePosition.current.y) * 0.08;

      if (clothMesh) {
        clothMesh.rotation.y = mousePosition.current.x * 0.45;
        clothMesh.rotation.x = -mousePosition.current.y * 0.35;

        // Subtle fluid cloth breathing simulation on hover
        const positions = geometry.attributes.position;
        const flexFactor = 1 - fabric.drapeStiffness; // softer fabrics breathe more
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const dynamicRipple = Math.sin(elapsed * 2.2 + x * 3.0 + y * 2.0) * (0.018 * flexFactor);
          positions.setZ(i, initialZ[i] + dynamicRipple);
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      bumpTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fabric]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosition.current.targetX = x;
    mousePosition.current.targetY = y;
  };

  const handlePointerLeave = () => {
    mousePosition.current.targetX = 0;
    mousePosition.current.targetY = 0;
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={() => setTouchActive(true)}
      onTouchEnd={() => setTouchActive(false)}
      className="relative w-full h-[240px] sm:h-[260px] bg-[#0A0A0C] rounded-xl overflow-hidden border border-[#272730] shadow-xl group cursor-crosshair select-none flex flex-col justify-between"
    >
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Spec Badges */}
      <div className="relative z-10 p-3 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] bg-[#141418]/90 px-2 py-0.5 rounded border border-[#C5A880]/30 backdrop-blur-sm">
          3D Drape Simulation
        </span>
        <span className="text-[10px] text-[#E5E7EB] font-mono bg-[#141418]/90 px-2 py-0.5 rounded border border-[#272730] backdrop-blur-sm">
          {fabric.weightGsm} GSM
        </span>
      </div>

      {/* Interactive Drag / Tilt Prompt Overlay */}
      <div className="relative z-10 p-3 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent pointer-events-none">
        <div className="flex items-center justify-between text-[11px] text-[#F3F4F6] font-medium mb-1">
          <span className="truncate">{fabric.drapeProfile}</span>
          <span className="text-[#C5A880] font-mono text-[10px] shrink-0 ml-2">
            {fabric.lusterGrade}
          </span>
        </div>

        {/* Drape Fluidity Gauge Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#9CA3AF]">
            <span>Liquid Fluidity</span>
            <span>Structured Fall</span>
          </div>
          <div className="w-full h-1 bg-[#1F1F28] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5D5B8] rounded-full transition-all duration-300"
              style={{ width: `${fabric.drapeStiffness * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 text-[10px] text-[#9CA3AF]">
          <span className="flex items-center gap-1 text-[#C5A880]">
            <Move className="w-3 h-3" />
            <span>Tilt or hover to examine light reflection & warp drape</span>
          </span>
          {fabric.yarnMicron && (
            <span className="font-mono">{fabric.yarnMicron.split(' ')[0]}μ</span>
          )}
        </div>
      </div>
    </div>
  );
};
