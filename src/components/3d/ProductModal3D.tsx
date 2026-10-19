import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product, Shade } from '../../types';
import { createLipstickModel, applyCapPosition, setupStudioEnvironment } from './Lipstick3DHelper';
import { X, RotateCw, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ProductModal3DProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, shade: Shade, quantity: number) => void;
}

export const ProductModal3D: React.FC<ProductModal3DProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedShadeIndex, setSelectedShadeIndex] = useState(product.defaultShadeIndex || 0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [capMode, setCapMode] = useState<'beside' | 'hover' | 'closed'>('beside');

  const selectedShade = product.shades[selectedShadeIndex] || product.shades[0];

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    bulletMat: THREE.MeshPhysicalMaterial;
    casingMat: THREE.MeshPhysicalMaterial;
    capGroup: THREE.Group;
    targetRotY: number;
    currentRotY: number;
    group: THREE.Group;
    camera: THREE.PerspectiveCamera;
  } | null>(null);

  const isDragging = useRef(false);
  const prevX = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    // Perspective camera framed to see the complete lipstick: base, tube, bullet, and cap
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    try {
      setupStudioEnvironment(renderer, scene);
    } catch {}

    const key = new THREE.DirectionalLight(0xfffaed, 3.2);
    key.position.set(4, 6, 5);
    scene.add(key);

    const hemi = new THREE.HemisphereLight(0xffffff, 0xd8cebf, 1.4);
    scene.add(hemi);

    const rim = new THREE.DirectionalLight(0xd4af37, 2.4);
    rim.position.set(-4, 3, -4);
    scene.add(rim);

    // Complete Lipstick Model: Base + Tube + Slanted Bullet + Cap
    const model = createLipstickModel({
      bulletColor: selectedShade.hex,
      caseColor: 'gold',
      finish: selectedShade.finish,
      capMode: capMode,
    });
    scene.add(model.group);

    sceneRef.current = {
      renderer,
      bulletMat: model.bulletMat,
      casingMat: model.casingMat,
      capGroup: model.capGroup,
      targetRotY: 0.25,
      currentRotY: 0.25,
      group: model.group,
      camera,
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevX.current = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !sceneRef.current) return;
      const deltaX = e.clientX - prevX.current;
      sceneRef.current.targetRotY += deltaX * 0.01;
      prevX.current = e.clientX;
    };
    const onPointerUp = () => {
      isDragging.current = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (sceneRef.current) {
        if (!isDragging.current) {
          sceneRef.current.targetRotY += 0.004;
        }
        sceneRef.current.currentRotY = THREE.MathUtils.damp(
          sceneRef.current.currentRotY,
          sceneRef.current.targetRotY,
          8,
          delta
        );
        sceneRef.current.group.rotation.y = sceneRef.current.currentRotY;
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product]);

  useEffect(() => {
    if (sceneRef.current && selectedShade) {
      sceneRef.current.bulletMat.color.set(selectedShade.hex);
    }
  }, [selectedShade]);

  useEffect(() => {
    if (!sceneRef.current || !sceneRef.current.capGroup) return;
    applyCapPosition(sceneRef.current.capGroup, capMode);
  }, [capMode]);

  const handleAdd = () => {
    onAddToCart(product, selectedShade, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#D9C8BE] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 border border-[#D9C8BE] flex items-center justify-center text-[#141211] hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* 3D Viewport on Left (Complete Lipstick: Base, Tube, Bullet, and Cap) */}
        <div className="md:w-1/2 h-80 md:h-auto min-h-[380px] bg-gradient-to-b from-[#F7F2EA] to-[#ECE2D2] relative cursor-grab active:cursor-grabbing border-b md:border-b-0 md:border-r border-[#E2D5BE]">
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Top-Left: Indicator */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-[11px] text-[#70665E] bg-white/85 px-2.5 py-1 border border-[#D9C8BE]">
            <RotateCw size={12} className="text-[#8C733E]" />
            <span>Complete 3D Lipstick (Base, Tube & Cap)</span>
          </div>

          {/* Bottom Dock: Cap Mode & Zoom */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-white/95 border border-[#D9C8BE] px-2.5 py-1 text-xs shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#8C733E] font-medium mr-1">Cap:</span>
            <button
              onClick={() => setCapMode('beside')}
              className={`px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                capMode === 'beside' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Beside
            </button>
            <button
              onClick={() => setCapMode('hover')}
              className={`px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                capMode === 'hover' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Exploded
            </button>
            <button
              onClick={() => setCapMode('closed')}
              className={`px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                capMode === 'closed' ? 'bg-[#141211] text-white' : 'text-[#554E48] hover:bg-[#EBE2D5]'
              }`}
            >
              Closed
            </button>
            <span className="text-[#D9C8BE]" aria-hidden="true">|</span>
            <button
              onClick={() => {
                if (sceneRef.current) sceneRef.current.camera.position.z = Math.max(5.0, sceneRef.current.camera.position.z - 1.0);
              }}
              className="p-0.5 text-[#554E48] hover:text-[#141211] cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => {
                if (sceneRef.current) sceneRef.current.camera.position.z = Math.min(11, sceneRef.current.camera.position.z + 1.0);
              }}
              className="p-0.5 text-[#554E48] hover:text-[#141211] cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => {
                if (sceneRef.current) sceneRef.current.camera.position.z = 8.4;
              }}
              className="p-0.5 text-[#8C733E] hover:text-[#141211] cursor-pointer"
              title="Reset View"
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>

        {/* Product Details on Right */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C733E] font-medium mb-1">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>{product.volume}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#141211] font-medium mb-2">
              {product.name}
            </h3>

            <p className="text-xs text-[#70665E] mb-4">{product.subtitle}</p>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-serif text-2xl font-semibold text-[#141211] tabular-nums">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#8C837B] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#554E48] leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Shades selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-[#141211]">
                  Shade: <span className="font-serif font-semibold text-[#4A121A]">{selectedShade.name}</span>
                </span>
                <span className="text-[#8C733E]">{selectedShade.code}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.shades.map((shade, idx) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShadeIndex(idx)}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                      idx === selectedShadeIndex
                        ? 'ring-2 ring-offset-2 ring-[#141211] scale-110'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: shade.hex }}
                    title={`${shade.name} (${shade.code})`}
                  />
                ))}
              </div>
            </div>

            {/* Formula Highlights */}
            <div className="space-y-1.5 mb-6 text-xs text-[#554E48]">
              {product.details.slice(0, 3).map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check size={13} className="text-[#8C733E] shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div className="flex items-stretch gap-3">
              <div className="flex items-center border border-[#141211] bg-white px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-9 text-base text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                >
                  −
                </button>
                <span className="w-7 text-center text-xs font-medium tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-9 text-base text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-5 text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  isAdded
                    ? 'bg-[#2E5E3A] text-white'
                    : 'bg-[#141211] text-[#FAF7F2] hover:bg-[#4A121A]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={14} />
                    <span>Added to Bag</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};
