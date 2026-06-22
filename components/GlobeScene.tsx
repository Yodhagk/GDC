'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ── Animated particle field around the globe ──────────────────────────────────
function Particles({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.8 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.04;
      mesh.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#C8920E" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ── Single flight arc between two lat/lon points ──────────────────────────────
function FlightArc({ from, to, color }: { from: [number, number]; to: [number, number]; color: string }) {
  const points = useMemo(() => {
    const toVec = ([lat, lon]: [number, number]) => {
      const phi   = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = 1.08;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta),
      );
    };
    const start = toVec(from);
    const end   = toVec(to);
    const mid   = start.clone().add(end).normalize().multiplyScalar(1.6);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(60);
  }, [from, to]);

  const lineObject = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
    return new THREE.Line(geom, mat);
  }, [points, color]);

  useFrame((state) => {
    const mat = lineObject.material as THREE.LineBasicMaterial;
    mat.opacity = 0.35 + 0.25 * Math.sin(state.clock.elapsedTime * 1.2);
  });

  return <primitive object={lineObject} />;
}

// ── Globe mesh with custom shader-like material ───────────────────────────────
function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.09;
  });

  const wireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0A2040',
        emissive: '#0D3060',
        emissiveIntensity: 0.4,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.92,
      }),
    []
  );

  const wireframeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#C8920E',
        wireframe: true,
        transparent: true,
        opacity: 0.07,
      }),
    []
  );

  return (
    <group>
      {/* Base solid globe */}
      <Sphere ref={globeRef} args={[1, 64, 64]} material={wireMat} />
      {/* Gold wireframe overlay */}
      <Sphere args={[1.005, 32, 32]} material={wireframeMat} />
      {/* Atmosphere glow */}
      <Sphere args={[1.18, 32, 32]}>
        <meshBasicMaterial
          color="#1A4080"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// ── Animated moving dot (plane marker) along an arc ──────────────────────────
function MovingMarker({ from, to, speed = 0.3 }: { from: [number, number]; to: [number, number]; speed?: number }) {
  const markerRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(Math.random());

  const curvePoints = useMemo(() => {
    const toVec = ([lat, lon]: [number, number]) => {
      const phi   = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = 1.08;
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta),
      );
    };
    const s = toVec(from);
    const e = toVec(to);
    const m = s.clone().add(e).normalize().multiplyScalar(1.6);
    return new THREE.QuadraticBezierCurve3(s, m, e);
  }, [from, to]);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * speed) % 1;
    if (markerRef.current) {
      const pos = curvePoints.getPoint(tRef.current);
      markerRef.current.position.copy(pos);
    }
  });

  return (
    <mesh ref={markerRef}>
      <sphereGeometry args={[0.022, 8, 8]} />
      <meshStandardMaterial color="#E8C040" emissive="#E8C040" emissiveIntensity={2} />
    </mesh>
  );
}

// ── Scene composition ─────────────────────────────────────────────────────────
const ROUTES: Array<{ from: [number, number]; to: [number, number]; color: string }> = [
  { from: [40.7, -74.0],   to: [51.5, -0.12],  color: '#E8C040' },  // NYC → London
  { from: [19.4, -99.1],   to: [28.6, 77.2],   color: '#C8920E' },  // Mexico → Delhi
  { from: [1.35, 103.8],   to: [40.7, -74.0],  color: '#A07500' },  // Singapore → NYC
  { from: [48.8, 2.35],    to: [-33.9, 151.2], color: '#E8C040' },  // Paris → Sydney
  { from: [25.2, 55.27],   to: [51.5, -0.12],  color: '#C8920E' },  // Dubai → London
  { from: [35.7, 139.7],   to: [37.6, -122.4], color: '#A07500' },  // Tokyo → SF
  { from: [22.3, 114.2],   to: [40.7, -74.0],  color: '#E8C040' },  // HK → NYC
];

function SceneContent() {
  const { camera } = useThree();
  camera.position.set(0, 0, 3.2);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#1A4080" />
      <pointLight position={[0, 0, 4]} intensity={0.3} color="#C8920E" />

      <Stars radius={80} depth={50} count={2000} factor={3} fade speed={0.5} />

      <Globe />
      <Particles count={250} />

      {ROUTES.map((r, i) => (
        <FlightArc key={i} from={r.from} to={r.to} color={r.color} />
      ))}
      {ROUTES.map((r, i) => (
        <MovingMarker key={i} from={r.from} to={r.to} speed={0.12 + i * 0.03} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI * 0.75}
        minPolarAngle={Math.PI * 0.25}
      />
    </>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <SceneContent />
    </Canvas>
  );
}
