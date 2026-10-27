import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RefreshCw, Eye, Move3D } from 'lucide-react';
import robotModelUrl from '../../assets/3D model.glb';

export default function Robot3DCanvas({
  className = '',
  height = '550px',
  frameless = true,
  showHud = false,
}) {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const controlsRef = useRef(null);
  const robotGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let heightPx = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera (elevated angle to view full uncut floor ring with bottom margin clearance)
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 0.55, 3.8);

    // 3. Renderer with transparent background (alpha: true)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0); // Completely transparent canvas
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -0.15, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minPolarAngle = Math.PI / 4;
    controlsRef.current = controls;

    // 5. Lighting Setup (Sci-Fi Cyberpunk ambient and key lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    cyanLight.position.set(-5, 3, -3);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xa855f7, 4.5, 12);
    violetLight.position.set(0, -1, 2.5);
    scene.add(violetLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 2.2);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // 6. Floor Ring / Glow Pedestal (Positioned at y = -0.85 to fit completely in frame)
    const ringGeo = new THREE.RingGeometry(0.7, 1.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.85;
    scene.add(ringMesh);

    const innerRingGeo = new THREE.RingGeometry(1.18, 1.24, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = -0.85;
    scene.add(innerRing);

    // 7. Robot Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);
    robotGroupRef.current = robotGroup;

    let mixer = null;
    const clock = new THREE.Clock();

    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;
    let userDragging = false;

    controls.addEventListener('start', () => {
      userDragging = true;
      setIsInteracting(true);
    });
    controls.addEventListener('end', () => {
      userDragging = false;
      setIsInteracting(false);
    });

    // 8. Load Model
    const loader = new GLTFLoader();
    loader.load(
      robotModelUrl,
      (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.35 / (maxDim || 1);
        model.scale.setScalar(scale);

        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale + 0.12;
        model.position.z = -center.z * scale;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.envMapIntensity = 1.2;
              if (child.material.roughness !== undefined) {
                child.material.roughness = Math.min(child.material.roughness, 0.45);
              }
            }
          }
        });

        robotGroup.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          setProgress(pct);
        } else {
          setProgress((p) => (p < 90 ? p + 10 : p));
        }
      },
      (err) => {
        console.error('Error loading 3D robot model:', err);
        setLoading(false);
      }
    );

    // 9. Mouse movement tracking
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetRotY = normX * 0.75;
      targetRotX = -normY * 0.35;

      setCoords({
        x: Math.round(normX * 100),
        y: Math.round(normY * 100),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 10. Animation Loop
    let animFrameId;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (mixer) mixer.update(delta);

      ringMesh.rotation.z = elapsedTime * 0.15;
      innerRing.rotation.z = -elapsedTime * 0.25;

      if (!userDragging && robotGroup) {
        currentRotY += (targetRotY - currentRotY) * 0.06;
        currentRotX += (targetRotX - currentRotX) * 0.06;

        robotGroup.rotation.y = currentRotY;
        robotGroup.rotation.x = currentRotX;
        robotGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.06;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 11. ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w && h) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animFrameId);

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const containerClasses = frameless
    ? `relative w-full h-full select-none bg-transparent overflow-visible ${className}`
    : `relative w-full h-full rounded-3xl overflow-hidden border border-violet-500/30 bg-gradient-to-b from-[#0e0c1f] via-[#090714] to-[#05040a] shadow-2xl shadow-violet-950/70 select-none ${className}`;

  const isPercent = typeof height === 'string' && height.endsWith('%');
  const styleObj = isPercent ? { height: height, minHeight: '480px' } : { height: height, minHeight: height };

  return (
    <div className={containerClasses} style={styleObj}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ height: '100%', minHeight: '480px' }} />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-20">
          <div className="w-14 h-14 rounded-full border-3 border-violet-500/30 border-t-violet-400 animate-spin mb-3" />
          <p className="text-xs font-mono text-violet-300 tracking-wider">
            LOADING ROBOT 3D {progress > 0 ? `${progress}%` : ''}
          </p>
        </div>
      )}

      {/* HUD Overlays (Only if showHud is true) */}
      {showHud && (
        <>
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            <div className="inline-flex items-center gap-2 bg-[#0d0d1a]/70 backdrop-blur-md px-3 py-1 rounded-full border border-violet-400/30 text-[11px] font-mono text-violet-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ROBOT TRACKING: {isInteracting ? 'MANUAL' : 'CURSOR ACTIVE'}</span>
            </div>

            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset View"
              className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-500/20 hover:bg-violet-500/35 border border-violet-400/30 text-[11px] font-medium text-ink transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-violet-300" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          <div className="absolute bottom-2 left-2 right-2 bg-[#0d0d1a]/75 backdrop-blur-md p-2.5 rounded-xl border border-violet-500/20 pointer-events-none z-10">
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-ink-dim">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-violet-400" />
                <span className="text-violet-300 font-semibold">X: {coords.x}%, Y: {coords.y}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-ink-faint">
                <Move3D className="w-3 h-3 text-sky-400" />
                <span>Move cursor to turn robot</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
