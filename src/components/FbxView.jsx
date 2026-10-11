import { useEffect, useRef, useState } from "react";

export function FbxView({ url }) {
  const ref = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const host = ref.current;
    if (!host || !url) return undefined;
    let stopped = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three");
        const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        if (stopped) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 1000);
        camera.position.set(1.6, 1.2, 2.4);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        scene.add(new THREE.AmbientLight(0xffffff, 0.85));
        const light = new THREE.DirectionalLight(0xffffff, 1.3);
        light.position.set(3, 5, 2);
        scene.add(light);

        const resize = () => {
          const width = host.clientWidth || 320;
          const height = host.clientHeight || 360;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        };
        resize();
        host.appendChild(renderer.domElement);

        const loader = new FBXLoader();
        loader.load(
          url,
          (object) => {
            if (stopped) return;
            const box = new THREE.Box3().setFromObject(object);
            const size = box.getSize(new THREE.Vector3()).length() || 1;
            const scale = 2.2 / size;
            object.scale.setScalar(scale);
            const center = box.getCenter(new THREE.Vector3());
            object.position.sub(center.multiplyScalar(scale));
            scene.add(object);
          },
          undefined,
          () => {
            if (!stopped) setError("No se pudo abrir el modelo.");
          },
        );

        let frame = 0;
        const tick = () => {
          frame = requestAnimationFrame(tick);
          controls.update();
          renderer.render(scene, camera);
        };
        tick();
        window.addEventListener("resize", resize);
        cleanup = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          controls.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!stopped) setError("No se pudo abrir el modelo.");
      }
    })();

    return () => {
      stopped = true;
      cleanup();
    };
  }, [url]);

  return (
    <div className="fbx-view" ref={ref}>
      {error && <p>{error}</p>}
    </div>
  );
}
