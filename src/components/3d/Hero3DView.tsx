import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createLipstickModel, setupStudioEnvironment } from './Lipstick3DHelper';

interface Hero3DViewProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const Hero3DView: React.FC<Hero3DViewProps> = ({ onExploreClick, onStoryClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfbf8f3, 0.035);

    // 2. Camera setup - framed to view the entire lipstick
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 8.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflections
    try {
      setupStudioEnvironment(renderer, scene);
    } catch {}

    // 5. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.0);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xfffaed, 0xd8cebf, 1.4);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.4);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const frontFill = new THREE.PointLight(0xfceee6, 1.0, 12);
    frontFill.position.set(0, 1, 4);
    scene.add(frontFill);

    // 6. Complete Luxury 3D Model: Floating Full Lipstick Centerpiece
    const { group: lipstickGroup, capGroup } = createLipstickModel({
      bulletColor: '#500A18', // Deep Couture Velvet Bordeaux
      caseColor: 'gold',
      finish: 'Velvet Matte',
      capMode: 'beside',
    });

    // Perfectly positioned and centered
    lipstickGroup.position.set(1.2, 0, 0);
    lipstickGroup.rotation.set(0.12, -0.35, 0.08);
    scene.add(lipstickGroup);

    // 7. Floating Champagne Stardust Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      particleSpeeds.push(0.003 + Math.random() * 0.006);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(212, 175, 55, 0.85)');
      grad.addColorStop(0.5, 'rgba(235, 200, 160, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const pTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: pTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse parallax handler
    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;

      if (width < 768) {
        lipstickGroup.position.set(0, 0.2, 0);
        lipstickGroup.scale.set(0.72, 0.72, 0.72);
      } else if (width < 1024) {
        lipstickGroup.position.set(0.8, 0, 0);
        lipstickGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        lipstickGroup.position.set(1.2, 0, 0);
        lipstickGroup.scale.set(1, 1, 1);
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseRef.current.x = THREE.MathUtils.damp(mouseRef.current.x, mouseRef.current.targetX, 4, delta);
      mouseRef.current.y = THREE.MathUtils.damp(mouseRef.current.y, mouseRef.current.targetY, 4, delta);

      // Gentle floating bob
      const floatY = Math.sin(elapsed * 1.2) * 0.1;
      const tiltX = Math.cos(elapsed * 0.8) * 0.04 + mouseRef.current.y * 0.25;
      const tiltY = -0.35 + Math.sin(elapsed * 0.6) * 0.12 + mouseRef.current.x * 0.45;

      const basePosY = width < 768 ? 0.2 : 0;
      lipstickGroup.position.y = basePosY + floatY;
      lipstickGroup.rotation.x = 0.12 + tiltX;
      lipstickGroup.rotation.y = tiltY;

      // Cap hover
      if (capGroup) {
        capGroup.position.y = -0.6 + Math.cos(elapsed * 1.4) * 0.08;
      }

      // Drift particles slowly
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 5) {
          positions[i * 3 + 1] = -5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x = mouseRef.current.x * 0.25;
      camera.position.y = 0.1 - mouseRef.current.y * 0.2;
      camera.lookAt(width < 768 ? 0 : 0.4, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
    };
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-b from-[#FBF8F4] via-[#F8F4EE] to-[#FAF7F2]">
      {/* Three.js Isolated Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Atmospheric Glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#EBD5CC]/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#F3DEC3]/35 blur-3xl pointer-events-none" />

      {/* Semantic Editorial DOM Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-16 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          {/* Brand Philosophy Kicker */}
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#8C733E] font-medium mb-6">
            <span>Haute Beauté</span>
            <span aria-hidden="true">·</span>
            <span>Paris & Mumbai Atelier</span>
            <span aria-hidden="true">·</span>
            <span>Edition 2026</span>
          </div>

          {/* Hero Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[1.04] text-[#141211] font-normal tracking-tight mb-8">
            Beauty, <br />
            <span className="italic font-light text-[#4A121A]">Beyond the Surface.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#554E48] leading-relaxed max-w-lg mb-10 font-normal">
            Discover a new dimension of beauty with formulas designed to make you unforgettable.
            Architectural pigments, luminous glass finishes, and sensory luxury crafted for discerning connoisseurs.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-3.5 bg-[#171514] text-[#FAF7F2] text-sm tracking-wider uppercase font-medium hover:bg-[#4A121A] transition-colors duration-300 shadow-sm whitespace-nowrap cursor-pointer"
            >
              Explore the Collection
            </button>
            <button
              onClick={onStoryClick}
              className="px-8 py-3.5 border border-[#8C733E]/50 text-[#171514] text-sm tracking-wider uppercase font-medium hover:border-[#171514] hover:bg-[#171514]/5 transition-colors duration-300 whitespace-nowrap cursor-pointer"
            >
              Discover Our Story
            </button>
          </div>

          {/* Formulation Credentials */}
          <div className="mt-14 pt-8 border-t border-[#E8DEC8]/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#70665E]">
            <div>
              <span className="block font-serif text-2xl text-[#141211]">100%</span>
              <span>Clean Vegan Matrix</span>
            </div>
            <span className="text-[#C5A059]" aria-hidden="true">·</span>
            <div>
              <span className="block font-serif text-2xl text-[#141211]">12H</span>
              <span>Weightless Cushion Wear</span>
            </div>
            <span className="text-[#C5A059]" aria-hidden="true">·</span>
            <div>
              <span className="block font-serif text-2xl text-[#141211]">3D</span>
              <span>Full Showroom View</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Interaction Hint Badge */}
      <div className="hidden lg:flex absolute bottom-8 right-12 z-10 items-center gap-3 text-xs tracking-wider text-[#8C733E] pointer-events-none">
        <span className="w-8 h-[1px] bg-[#8C733E]/60" />
        <span>Move cursor to orbit full 3D cosmetic container</span>
      </div>

      {/* Subtle Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-80">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#8C733E]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#8C733E] to-transparent animate-pulse" />
      </div>
    </section>
  );
};
