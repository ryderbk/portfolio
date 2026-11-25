/* eslint-disable react/no-unknown-property */
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Scene3DProps {
  interactive?: boolean;
}

export function HeroScene3D({ interactive = true }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check device / reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse parallax rotation
    const world = new THREE.Group();
    scene.add(world);

    // 1. Core Polyhedron (Icosahedron wireframe + inner glowing particle shell)
    const icoGeometry = new THREE.IcosahedronGeometry(7.2, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4ff3a,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
    world.add(icoMesh);

    // Inner secondary geometric lattice
    const innerGeo = new THREE.OctahedronGeometry(4.8, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x9eff00,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    world.add(innerMesh);

    // 2. Floating Starfield / Particle Cloud
    const particleCount = isMobile ? 350 : 800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 1.8 + 0.4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    // Particle material
    const particleMat = new THREE.PointsMaterial({
      color: 0xd4ff3a,
      size: 0.22,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    world.add(particles);

    // 3. Ambient floating rings
    const ringGeo = new THREE.TorusGeometry(12, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    ringMesh1.rotation.y = Math.PI / 6;
    world.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.x = -Math.PI / 4;
    ringMesh2.rotation.y = -Math.PI / 3;
    world.add(ringMesh2);

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || prefersReduced) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = nx * 0.45;
      mouseRef.current.targetY = ny * 0.45;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (!prefersReduced) {
        // Continuous organic rotation
        icoMesh.rotation.x = elapsed * 0.12;
        icoMesh.rotation.y = elapsed * 0.16;

        innerMesh.rotation.x = -elapsed * 0.2;
        innerMesh.rotation.z = elapsed * 0.14;

        ringMesh1.rotation.z = elapsed * 0.04;
        ringMesh2.rotation.z = -elapsed * 0.05;

        particles.rotation.y = elapsed * 0.025;
        particles.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

        // Apply mouse tilt to the whole scene
        world.rotation.y = mouseRef.current.x + elapsed * 0.02;
        world.rotation.x = -mouseRef.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, opacity: 0.85 }}
      aria-hidden="true"
    />
  );
}
