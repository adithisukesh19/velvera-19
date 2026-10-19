import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shade, Product } from '../../types';
import { createLipstickModel, applyCapPosition, setupStudioEnvironment } from './Lipstick3DHelper';
import { RotateCw, Check, Sparkles, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Layers } from 'lucide-react';

interface SignatureProduct3DProps {
  product: Product;
  onAddToCart: (product: Product, shade: Shade, quantity: number) => void;
}

export const SignatureProduct3D: React.FC<SignatureProduct3DProps> = ({ product, onAddToCart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(product.defaultShadeIndex || 0);
  const [quantity, setQuantity] = useState(1);
  const [caseTone, setCaseTone] = useState<'gold' | 'obsidian'>('gold');
  const [capMode, setCapMode] = useState<'beside' | 'hover' | 'closed'>('beside');
  const [selectedFinish, setSelectedFinish] = useState<'Velvet Matte' | 'Satin Silk' | 'Glass Gloss'>('Velvet Matte');
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);
  const [cameraZoomLevel, setCameraZoomLevel] = useState<'full' | 'tip' | 'base'>('full');

  const selectedShade = product.shades[selectedShadeIndex] || product.shades[0];

  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    group: THREE.Group;
    bulletMat: THREE.MeshPhysicalMaterial;
    casingMat: THREE.MeshPhysicalMaterial;
    capGroup: THREE.Group;
    targetRotationY: number;
    currentRotationY: number;
    targetRotationX: number;
    currentRotationX: number;
    targetDistance: number;
    currentDistance: number;
    targetTargetY: number;
    currentTargetY: number;
  } | null>(null);

  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const previousPointerY = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8f4ee, 0.038);

    // Camera setup - frames the complete lipstick object (base, tube, bullet, and cap)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    const initialDistance = 8.6;
    camera.position.set(0, 0, initialDistance);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    try {
      setupStudioEnvironment(renderer, scene);
    } catch {}

    // 3-point Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfffaea, 3.2);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xfffaee, 0xd0c4b4, 1.4);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.6);
    rimLight.position.set(-4, 4, -4);
    scene.add(rimLight);

    const frontSoft = new THREE.PointLight(0xffeedd, 1.2, 10);
    frontSoft.position.set(0, 0.5, 4);
    scene.add(frontSoft);

    // Complete Lipstick Model: Base + Tube + Slanted Bullet + Cap
    const model = createLipstickModel({
      bulletColor: selectedShade.hex,
      caseColor: caseTone,
      finish: selectedFinish,
      capMode: capMode,
    });
    scene.add(model.group);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      group: model.group,
      bulletMat: model.bulletMat,
      casingMat: model.casingMat,
      capGroup: model.capGroup,
      targetRotationY: 0.25,
      currentRotationY: 0.25,
      targetRotationX: 0.08,
      currentRotationX: 0.08,
      targetDistance: initialDistance,
      currentDistance: initialDistance,
      targetTargetY: 0,
      currentTargetY: 0,
    };

    // Pointer events for 360° orbit
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousPointerX.current = e.clientX;
      previousPointerY.current = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !sceneRef.current) return;
      const deltaX = e.clientX - previousPointerX.current;
      const deltaY = e.clientY - previousPointerY.current;

      sceneRef.current.targetRotationY += deltaX * 0.008;
      sceneRef.current.targetRotationX = Math.max(-0.4, Math.min(0.5, sceneRef.current.targetRotationX + deltaY * 0.006));

      previousPointerX.current = e.clientX;
      previousPointerY.current = e.clientY;
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!sceneRef.current) return;
      e.preventDefault();
      sceneRef.current.targetDistance = Math.max(5.0, Math.min(12, sceneRef.current.targetDistance + e.deltaY * 0.006));
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (sceneRef.current) {
        if (!isDragging.current) {
          sceneRef.current.targetRotationY += 0.0035;
        }

        sceneRef.current.currentRotationY = THREE.MathUtils.damp(
          sceneRef.current.currentRotationY,
          sceneRef.current.targetRotationY,
          8,
          delta
        );
        sceneRef.current.currentRotationX = THREE.MathUtils.damp(
          sceneRef.current.currentRotationX,
          sceneRef.current.targetRotationX,
          8,
          delta
        );
        sceneRef.current.currentDistance = THREE.MathUtils.damp(
          sceneRef.current.currentDistance,
          sceneRef.current.targetDistance,
          7,
          delta
        );
        sceneRef.current.currentTargetY = THREE.MathUtils.damp(
          sceneRef.current.currentTargetY,
          sceneRef.current.targetTargetY,
          7,
          delta
        );

        sceneRef.current.group.rotation.y = sceneRef.current.currentRotationY;
        sceneRef.current.group.rotation.x = sceneRef.current.currentRotationX;

        camera.position.z = sceneRef.current.currentDistance;
        camera.position.y = sceneRef.current.currentTargetY;
        camera.lookAt(0, sceneRef.current.currentTargetY, 0);

        // Subtle floating bob
        const elapsed = clock.getElapsedTime();
        sceneRef.current.group.position.y = Math.sin(elapsed * 1.5) * 0.05;

        renderer.render(scene, camera);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Shade Color dynamically
  useEffect(() => {
    if (!sceneRef.current) return;
    const targetColor = new THREE.Color(selectedShade.hex);
    sceneRef.current.bulletMat.color.copy(targetColor);

    const isGloss = selectedFinish === 'Glass Gloss';
    const isMatte = selectedFinish === 'Velvet Matte';

    sceneRef.current.bulletMat.roughness = isGloss ? 0.05 : isMatte ? 0.65 : 0.32;
    sceneRef.current.bulletMat.clearcoat = isGloss ? 1.0 : isMatte ? 0.05 : 0.45;
    sceneRef.current.bulletMat.sheen = isMatte ? 0.88 : 0.2;
    sceneRef.current.bulletMat.sheenColor = targetColor.clone().offsetHSL(0, 0.1, 0.1);
  }, [selectedShade, selectedFinish]);

  // Update Casing finish (Gold vs Obsidian)
  useEffect(() => {
    if (!sceneRef.current) return;
    const isObs = caseTone === 'obsidian';
    const caseColor = isObs ? 0x141416 : 0xd2ad66;
    sceneRef.current.casingMat.color.setHex(caseColor);
    sceneRef.current.casingMat.metalness = isObs ? 0.35 : 0.95;
    sceneRef.current.casingMat.roughness = isObs ? 0.2 : 0.22;
    sceneRef.current.casingMat.clearcoat = isObs ? 0.9 : 0.4;
  }, [caseTone]);

  // Update Cap configuration (Beside, Hover/Exploded, Closed)
  useEffect(() => {
    if (!sceneRef.current || !sceneRef.current.capGroup) return;
    applyCapPosition(sceneRef.current.capGroup, capMode);
  }, [capMode]);

  // Camera preset views
  const setPresetView = (preset: 'full' | 'tip' | 'base') => {
    setCameraZoomLevel(preset);
    if (!sceneRef.current) return;
    if (preset === 'full') {
      sceneRef.current.targetDistance = 8.6;
      sceneRef.current.targetTargetY = 0;
      sceneRef.current.targetRotationX = 0.08;
    } else if (preset === 'tip') {
      sceneRef.current.targetDistance = 5.2;
      sceneRef.current.targetTargetY = 1.4; // focuses directly on the slanted lipstick bullet
      sceneRef.current.targetRotationX = 0.14;
    } else if (preset === 'base') {
      sceneRef.current.targetDistance = 5.8;
      sceneRef.current.targetTargetY = -0.9; // focuses on the gold casing & tube
      sceneRef.current.targetRotationX = 0.05;
    }
  };

  const handleAdd = () => {
    onAddToCart(product, selectedShade, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2400);
  };

  return (
    <section id="signature-experience" className="py-24 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C733E] font-medium block mb-3">
          Atelier Masterpiece · Complete 3D Showroom
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#141211] font-normal tracking-tight">
          L'Élixir Velvet Rouge
        </h2>
        <p className="mt-4 text-[#554E48] text-base sm:text-lg leading-relaxed">
          Complete 3D cosmetic architecture: weighted base casing, revolving gold ferrule tube,
          sculpted diagonal teardrop bullet, and matching luxury cap.
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F7F2EA] border border-[#E8DEC8] p-6 sm:p-10 md:p-12 relative overflow-hidden">
        {/* Subtle Velvet Texture / Gradient Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${selectedShade.hex}22 0%, transparent 60%)`,
          }}
        />

        {/* 3D Interactive Canvas Column (Left, 7 cols) */}
        <div className="lg:col-span-7 relative h-[500px] sm:h-[580px] md:h-[640px] w-full flex items-center justify-center bg-gradient-to-b from-[#F9F6F0] to-[#EFE7DC] border border-[#E2D5BE] overflow-hidden select-none cursor-grab active:cursor-grabbing">
          {/* Canvas Mount */}
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Top-Left: 3D Indicator & Camera Focus Presets */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#70665E] bg-[#FAF7F2]/90 border border-[#D9C8BE] px-3 py-1.5 backdrop-blur-sm pointer-events-none">
              <RotateCw size={13} className="text-[#8C733E]" />
              <span className="tracking-wide uppercase text-[10px] font-medium">360° Drag to Orbit</span>
            </div>

            {/* View Angle Presets */}
            <div className="flex items-center bg-[#FAF7F2]/90 border border-[#D9C8BE] p-0.5 backdrop-blur-sm">
              <button
                onClick={() => setPresetView('full')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                  cameraZoomLevel === 'full' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:text-[#141211]'
                }`}
              >
                Full Object
              </button>
              <button
                onClick={() => setPresetView('tip')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                  cameraZoomLevel === 'tip' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:text-[#141211]'
                }`}
              >
                Bullet Facet
              </button>
              <button
                onClick={() => setPresetView('base')}
                className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                  cameraZoomLevel === 'base' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:text-[#141211]'
                }`}
              >
                Base & Tube
              </button>
            </div>
          </div>

          {/* Top-Right: Active Shade Tag */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-[#FAF7F2]/90 border border-[#D9C8BE] px-3 py-1.5 backdrop-blur-sm pointer-events-none">
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: selectedShade.hex }}
            />
            <span className="text-xs font-serif font-medium text-[#141211]">{selectedShade.name}</span>
            <span className="text-[11px] text-[#70665E]">({selectedShade.code})</span>
          </div>

          {/* Bottom Dock: Cap Placement Controls (Beside, Hover, Closed) + Zoom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-[#FAF7F2]/95 border border-[#D9C8BE] px-3 py-1.5 shadow-sm backdrop-blur-sm text-xs">
            <span className="text-[11px] text-[#8C733E] font-medium uppercase tracking-wider hidden sm:inline">Cap:</span>
            <button
              onClick={() => setCapMode('beside')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                capMode === 'beside' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Beside
            </button>
            <button
              onClick={() => setCapMode('hover')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                capMode === 'hover' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Exploded
            </button>
            <button
              onClick={() => setCapMode('closed')}
              className={`px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                capMode === 'closed' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Closed
            </button>
            <span className="text-[#D9C8BE]" aria-hidden="true">|</span>
            <button
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.targetDistance = Math.max(5.0, sceneRef.current.targetDistance - 1.0);
                }
              }}
              className="p-1 text-[#554E48] hover:text-[#141211] cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.targetDistance = Math.min(12, sceneRef.current.targetDistance + 1.0);
                }
              }}
              className="p-1 text-[#554E48] hover:text-[#141211] cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setPresetView('full')}
              className="p-1 text-[#8C733E] hover:text-[#141211] cursor-pointer"
              title="Reset View"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Customization & Purchase Module Column (Right, 5 cols) */}
        <div className="lg:col-span-5 relative z-10 flex flex-col justify-center">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C733E] font-medium">
              Haute Couture Lipstick
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl text-[#141211] font-semibold tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#8C837B] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#141211] font-medium mb-3">
            {product.name}
          </h3>

          <p className="text-sm text-[#554E48] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* 1. Shade Palette Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-medium uppercase tracking-wider text-[#141211]">
                Selected Shade: <strong className="font-serif font-semibold text-sm text-[#4A121A]">{selectedShade.name}</strong>
              </span>
              <span className="text-[#8C733E] text-xs">{selectedShade.code} · {selectedFinish}</span>
            </div>

            <div className="grid grid-cols-6 gap-2.5">
              {product.shades.map((shade, idx) => {
                const isSelected = idx === selectedShadeIndex;
                return (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShadeIndex(idx)}
                    className={`group relative flex flex-col items-center p-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#141211] bg-white shadow-sm ring-1 ring-[#141211]'
                        : 'border-[#D9C8BE] bg-[#FAF7F2] hover:border-[#8C733E]'
                    }`}
                    title={`${shade.name} (${shade.code})`}
                  >
                    <span
                      className="w-7 h-7 rounded-full shadow-inner border border-black/15 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: shade.hex }}
                    />
                    <span className="text-[10px] text-[#554E48] mt-1 font-mono">{shade.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Casing & Texture Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#141211] mb-2">
                Casing Finish
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setCaseTone('gold')}
                  className={`py-2 px-2 text-xs text-center transition-all cursor-pointer ${
                    caseTone === 'gold'
                      ? 'bg-[#141211] text-[#FAF7F2] font-medium'
                      : 'bg-white border border-[#D9C8BE] text-[#554E48]'
                  }`}
                >
                  Champagne
                </button>
                <button
                  onClick={() => setCaseTone('obsidian')}
                  className={`py-2 px-2 text-xs text-center transition-all cursor-pointer ${
                    caseTone === 'obsidian'
                      ? 'bg-[#141211] text-[#FAF7F2] font-medium'
                      : 'bg-white border border-[#D9C8BE] text-[#554E48]'
                  }`}
                >
                  Obsidian
                </button>
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium uppercase tracking-wider text-[#141211] mb-2">
                Bullet Texture
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedFinish('Velvet Matte')}
                  className={`py-2 px-2 text-xs text-center transition-all cursor-pointer ${
                    selectedFinish === 'Velvet Matte'
                      ? 'bg-[#141211] text-[#FAF7F2] font-medium'
                      : 'bg-white border border-[#D9C8BE] text-[#554E48]'
                  }`}
                >
                  Matte
                </button>
                <button
                  onClick={() => setSelectedFinish('Glass Gloss')}
                  className={`py-2 px-2 text-xs text-center transition-all cursor-pointer ${
                    selectedFinish === 'Glass Gloss'
                      ? 'bg-[#141211] text-[#FAF7F2] font-medium'
                      : 'bg-white border border-[#D9C8BE] text-[#554E48]'
                  }`}
                >
                  Gloss
                </button>
              </div>
            </div>
          </div>

          {/* 3. Formulation Highlights */}
          <div className="mb-8 p-4 bg-white/70 border border-[#E8DEC8] space-y-2 text-xs text-[#554E48]">
            {product.details.slice(0, 3).map((detail, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check size={14} className="text-[#8C733E] shrink-0 mt-0.5" />
                <span>{detail}</span>
              </div>
            ))}
          </div>

          {/* 4. Quantity and Add to Bag */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center border border-[#141211] bg-white px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-10 text-base text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium tabular-nums text-[#141211]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-10 text-base text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 py-3 px-6 text-sm font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                isAddedFeedback
                  ? 'bg-[#2E5E3A] text-white'
                  : 'bg-[#141211] text-[#FAF7F2] hover:bg-[#4A121A]'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check size={16} />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <span>Add to Bag</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#70665E]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#8C733E]" /> Complimentary engraving & box
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#8C733E]" /> 2 deluxe couture samples
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
