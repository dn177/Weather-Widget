import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import "./astronaut.css";

const SpaceScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const cameraRef = useRef(null);
  const thrusterParticlesRef = useRef([]);
  const starGlowsRef = useRef([]);
  const spaceshipLightsRef = useRef([]);
  const asteroidFieldRef = useRef(null);
  const environmentMapRef = useRef(null);
  const animationFrameRef = useRef(null);
  const cameraFrameRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const gsapCtxRef = useRef(null);

  useEffect(() => {
    // Initialize scene inside a gsap context so all timelines get killed on unmount
    gsapCtxRef.current = gsap.context(() => {
      initScene();
    });

    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (cameraFrameRef.current) {
        cancelAnimationFrame(cameraFrameRef.current);
      }
      if (resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
      }
      if (gsapCtxRef.current) {
        gsapCtxRef.current.revert();
      }

      if (rendererRef.current) {
        const mount = mountRef.current;
        if (mount) {
          mount.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }

      // Dispose of composer
      if (composerRef.current) {
        composerRef.current.passes.forEach(pass => {
          if (pass.dispose) pass.dispose();
        });
      }

      // Dispose of all materials, geometries, and textures
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => {
                disposeMaterial(material);
              });
            } else {
              disposeMaterial(object.material);
            }
          }
        });
      }

      // Dispose environment map
      if (environmentMapRef.current) {
        environmentMapRef.current.dispose();
      }
    };
  }, []);

  // Helper function to dispose materials properly
  const disposeMaterial = (material) => {
    material.dispose();
    
    // Dispose textures
    const textures = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap'];
    textures.forEach(mapName => {
      if (material[mapName]) material[mapName].dispose();
    });
    
    // Dispose uniforms for custom shaders
    if (material.uniforms) {
      Object.values(material.uniforms).forEach(uniform => {
        if (uniform.value && uniform.value.dispose) {
          uniform.value.dispose();
        }
      });
    }
  };

  // Create procedural environment map for reflections
  const createEnvironmentMap = () => {
    const envMapSize = 256;
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(envMapSize);
    
    const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    const envScene = new THREE.Scene();
    
    // Create gradient background for environment
    const gradientShader = {
      uniforms: {
        topColor: { value: new THREE.Color(0x0033ff) },
        bottomColor: { value: new THREE.Color(0x000033) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `
    };
    
    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: gradientShader.uniforms,
      vertexShader: gradientShader.vertexShader,
      fragmentShader: gradientShader.fragmentShader,
      side: THREE.BackSide
    });
    
    const sky = new THREE.Mesh(skyGeo, skyMat);
    envScene.add(sky);
    
    // Add some lights to the environment
    const envLight = new THREE.DirectionalLight(0xffffff, 0.5);
    envLight.position.set(1, 1, 1);
    envScene.add(envLight);
    
    // Render environment map
    cubeCamera.position.set(0, 0, 0);
    cubeCamera.update(rendererRef.current, envScene);
    
    environmentMapRef.current = cubeRenderTarget.texture;
    return cubeRenderTarget.texture;
  };

  const initScene = () => {
    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const clock = new THREE.Clock();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 3;
    camera.position.x = 5;
    cameraRef.current = camera;

    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Create environment map for reflections
    const envMap = createEnvironmentMap();
    scene.environment = envMap;

    // Setup post-processing
    const composer = new EffectComposer(renderer);
    composerRef.current = composer;

    // Render pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom pass for glowing effects
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Film grain for atmosphere
    const filmPass = new FilmPass(
      0.35, // noise intensity
      0.1, // scanline intensity
      648, // scanline count
      false // grayscale
    );
    filmPass.renderToScreen = false;
    composer.addPass(filmPass);

    // FXAA anti-aliasing
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    fxaaPass.renderToScreen = true;
    composer.addPass(fxaaPass);

    // Add fog for atmosphere with better settings
    scene.fog = new THREE.FogExp2(0x000033, 0.0008);

    // Add automatic camera animation
    animateCamera(camera, scene);

    // Add lights, stars, astronaut, spaceship, and enhanced environment
    addLights(scene);
    addEnhancedStars(scene);
    createEnhancedAstronaut(scene);
    createEnhancedSpaceship(scene);
    addSpaceDebris(scene);
    createAsteroidField(scene);
    addPlanetsAndMoons(scene);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      
      // Update FXAA resolution
      const fxaaPass = composer.passes.find(pass => pass.uniforms && pass.uniforms['resolution']);
      if (fxaaPass) {
        fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
      }
    };
    resizeHandlerRef.current = handleResize;
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate stars
      if (scene.getObjectByName("stars")) {
        scene.getObjectByName("stars").rotation.y += 0.0001;
      }

      // Update asteroids
      if (asteroidFieldRef.current) {
        asteroidFieldRef.current.rotation.y += 0.0002;
      }

      // Update thruster particles
      updateThrusterParticles();

      // Update star glows
      updateStarGlows(delta);

      // Update spaceship lights
      updateSpaceshipLights(delta);

      // Render with post-processing
      composer.render();
    };

    animate();
  };

  // Enhanced camera animation with dynamic movement
  const animateCamera = (camera, scene) => {
    // Create a more complex camera path
    const timeline = gsap.timeline({ repeat: -1 });
    
    timeline
      .to(camera.position, {
        x: 8,
        z: 5,
        y: 2,
        duration: 15,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: 3,
        z: 8,
        y: 5,
        duration: 15,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: -6,
        z: 6,
        y: -1,
        duration: 15,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: -4,
        z: -8,
        y: 3,
        duration: 15,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: 5,
        z: 10,
        y: 3,
        duration: 15,
        ease: "power2.inOut",
      });

    // Always look at the center point between astronaut and spaceship
    const centerPoint = new THREE.Vector3(0, 0, 0);

    function updateCameraTarget() {
      if (
        scene.getObjectByName("astronaut") &&
        scene.getObjectByName("spaceship")
      ) {
        const astronautPos = new THREE.Vector3();
        scene.getObjectByName("astronaut").getWorldPosition(astronautPos);

        const spaceshipPos = new THREE.Vector3();
        scene.getObjectByName("spaceship").getWorldPosition(spaceshipPos);

        // Calculate center between the two with slight offset upward
        centerPoint.copy(astronautPos).add(spaceshipPos).multiplyScalar(0.5);
        centerPoint.y += 0.5;
      }

      camera.lookAt(centerPoint);
      cameraFrameRef.current = requestAnimationFrame(updateCameraTarget);
    }

    updateCameraTarget();
  };

  // Enhanced lighting system
  const addLights = (scene) => {
    // Ambient light with color variation
    const ambientLight = new THREE.AmbientLight(0x2a2a4a, 0.4);
    scene.add(ambientLight);

    // Main directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(10, 6, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    scene.add(sunLight);

    // Purple rim light
    const rimLight = new THREE.DirectionalLight(0x9966ff, 0.8);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    // Dynamic point lights
    const purpleLight = new THREE.PointLight(0x8844ff, 2, 15);
    purpleLight.position.set(0, 2, 3);
    scene.add(purpleLight);

    // Animated purple light
    gsap.to(purpleLight.position, {
      x: 3,
      z: -3,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(purpleLight, {
      intensity: 3,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Blue accent light
    const blueLight = new THREE.PointLight(0x0088ff, 1.5, 20);
    blueLight.position.set(-5, 0, -5);
    scene.add(blueLight);

    // Distant star lights
    const starLight1 = new THREE.PointLight(0xffaa33, 1, 50);
    starLight1.position.set(-30, 20, -30);
    scene.add(starLight1);

    const starLight2 = new THREE.PointLight(0x33aaff, 0.8, 50);
    starLight2.position.set(40, -10, -20);
    scene.add(starLight2);
  };

  // Enhanced star system with glowing effects
  const addEnhancedStars = (scene) => {
    // Create multiple layers of stars
    const createStarField = (count, size, range, color = 0xffffff) => {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];
      const sizes = [];

      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * range;
        const y = (Math.random() - 0.5) * range;
        const z = (Math.random() - 0.5) * range;
        
        if (Math.abs(x) > 10 || Math.abs(y) > 10 || Math.abs(z) > 10) {
          positions.push(x, y, z);
          
          const c = new THREE.Color(color);
          c.offsetHSL(Math.random() * 0.2 - 0.1, 0, Math.random() * 0.2);
          colors.push(c.r, c.g, c.b);
          
          sizes.push(size * (0.5 + Math.random() * 0.5));
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      return new THREE.Points(geometry, material);
    };

    // Multiple star layers
    const distantStars = createStarField(8000, 0.05, 200, 0xffffff);
    distantStars.name = "stars";
    scene.add(distantStars);

    const mediumStars = createStarField(1000, 0.1, 150, 0xffffcc);
    scene.add(mediumStars);

    const brightStars = createStarField(200, 0.2, 100, 0xffeeaa);
    scene.add(brightStars);

    // Create glowing star effects - keep them distant
    const glowingStars = [];
    for (let i = 0; i < 50; i++) {
      const starGeo = new THREE.SphereGeometry(0.3, 8, 8);
      const starMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.8),
        transparent: true,
        opacity: 0.8
      });
      
      const star = new THREE.Mesh(starGeo, starMat);
      
      // Position stars far from the main action area
      const minDistance = 40;
      const maxDistance = 80;
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      star.position.set(
        distance * Math.sin(phi) * Math.cos(theta),
        distance * Math.sin(phi) * Math.sin(theta),
        distance * Math.cos(phi)
      );
      
      scene.add(star);
      starGlowsRef.current.push({
        mesh: star,
        speed: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Create nebula clouds with volumetric effect
    const createNebula = (color, position, scale) => {
      const nebulaGroup = new THREE.Group();

      // Create multiple layers for depth
      for (let i = 0; i < 5; i++) {
        const sphereGeo = new THREE.SphereGeometry(
          scale * (1 + i * 0.3),
          32,
          32
        );
        
        const nebulaMat = new THREE.MeshStandardMaterial({
          color: color,
          transparent: true,
          opacity: 0.15 - i * 0.025,
          emissive: color,
          emissiveIntensity: 0.3 - i * 0.05,
          side: THREE.BackSide,
          depthWrite: false
        });
        
        const nebulaSphere = new THREE.Mesh(sphereGeo, nebulaMat);
        nebulaSphere.position.copy(position);
        nebulaGroup.add(nebulaSphere);
        
        // Animate rotation
        gsap.to(nebulaSphere.rotation, {
          x: Math.PI * 2,
          y: Math.PI * 2,
          duration: 200 + i * 50,
          repeat: -1,
          ease: "none"
        });
      }
      
      return nebulaGroup;
    };

    // Add multiple nebulas
    const nebula1 = createNebula(0x6633ff, new THREE.Vector3(-30, 20, -40), 20);
    scene.add(nebula1);

    const nebula2 = createNebula(0xff3366, new THREE.Vector3(40, -30, -50), 25);
    scene.add(nebula2);

    const nebula3 = createNebula(0x33ffff, new THREE.Vector3(0, 50, -80), 30);
    scene.add(nebula3);
  };

  // Create enhanced astronaut with better materials and textures
  const createEnhancedAstronaut = (scene) => {
    const astronaut = new THREE.Group();
    astronaut.name = "astronaut";

    // Enhanced materials with textures
    const createFabricMaterial = (color, roughness = 0.7) => {
      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: 0.1,
        normalScale: new THREE.Vector2(0.5, 0.5),
        envMap: environmentMapRef.current,
        envMapIntensity: 0.3
      });
      
      // Simulate fabric bump with enhanced noise shader
      material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          #include <common>
          varying vec2 vUv;
          `
        );
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          vUv = uv;
          #include <begin_vertex>
          `
        );
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>
          varying vec2 vUv;
          uniform float time;
          
          float noise(vec2 p) {
            return sin(p.x * 50.0) * sin(p.y * 50.0) * 0.5 + 0.5;
          }
          `
        );
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <normal_fragment_begin>',
          `
          #include <normal_fragment_begin>
          vec3 noiseNormal = normalize(normal + vec3(
            noise(vUv * 100.0) * 0.02 - 0.01,
            noise(vUv * 100.0 + 1.0) * 0.02 - 0.01,
            0.0
          ));
          normal = noiseNormal;
          
          // Add subtle iridescence
          float iridescence = sin(vUv.x * 20.0 + vUv.y * 20.0) * 0.1;
          `
        );
        
        // Update time uniform in animation loop
        material.userData.shader = shader;
      };
      
      return material;
    };

    // Materials with enhanced properties
    const purpleFabric = createFabricMaterial(0x6b46c1, 0.7);
    const darkPurpleFabric = createFabricMaterial(0x4c2889, 0.6);
    const lightPurpleFabric = createFabricMaterial(0x8c64d8, 0.8);

    // Metallic materials with purple tint and environment mapping
    const goldMetal = new THREE.MeshStandardMaterial({
      color: 0xcc88ff,  // Purple-gold
      roughness: 0.15,
      metalness: 0.95,
      envMap: environmentMapRef.current,
      envMapIntensity: 1.5
    });

    const silverMetal = new THREE.MeshStandardMaterial({
      color: 0xe6ccff,  // Purple-silver
      roughness: 0.1,
      metalness: 0.98,
      envMap: environmentMapRef.current,
      envMapIntensity: 2
    });

    // Enhanced visor material with purple tint and better refraction
    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcc99ff,  // Purple-tinted glass
      roughness: 0.05,
      metalness: 0.1,
      opacity: 0.9,
      transparent: true,
      transmission: 0.9,
      thickness: 0.5,
      envMap: environmentMapRef.current,
      envMapIntensity: 3,
      clearcoat: 1,
      clearcoatRoughness: 0,
      ior: 1.5,
      reflectivity: 0.9,
      side: THREE.DoubleSide
    });

    // Emissive materials for lights
    const createEmissiveMaterial = (color, intensity = 2) => {
      return new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 0.2,
        metalness: 0.5
      });
    };

    // Helmet with complex details
    const helmetGroup = new THREE.Group();
    
    // Main helmet
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 64),
      purpleFabric
    );
    helmet.position.y = 1.5;
    helmet.castShadow = true;
    helmet.receiveShadow = true;
    helmetGroup.add(helmet);

    // Helmet padding rings
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.52 - i * 0.02, 0.02, 16, 32),
        darkPurpleFabric
      );
      ring.position.y = 1.35 - i * 0.1;
      ring.rotation.x = Math.PI / 2;
      helmetGroup.add(ring);
    }

    // Communication array
    const commArray = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.15, 8),
        silverMetal
      );
      antenna.position.set(
        Math.cos(angle) * 0.4,
        2,
        Math.sin(angle) * 0.4
      );
      antenna.rotation.z = angle * 0.2;
      commArray.add(antenna);
    }
    helmetGroup.add(commArray);

    // Enhanced visor with multiple layers
    const visorGroup = new THREE.Group();
    
    // Main visor
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.6),
      visorMaterial
    );
    visor.rotation.x = Math.PI * 0.1;
    visor.position.set(0, 1.55, 0.15);
    visorGroup.add(visor);

    // Visor frame with details
    const visorFrame = new THREE.Mesh(
      new THREE.TorusGeometry(0.39, 0.03, 16, 32, Math.PI * 0.7),
      goldMetal
    );
    visorFrame.rotation.x = Math.PI * 0.6;
    visorFrame.position.set(0, 1.55, 0.17);
    visorGroup.add(visorFrame);

    // HUD display elements
    const hudLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.15, 0.01),
      createEmissiveMaterial(0xcc88ff, 3)  // Purple HUD
    );
    hudLight.position.set(0.25, 1.6, 0.35);
    visorGroup.add(hudLight);

    helmetGroup.add(visorGroup);

    // Add LED status lights
    const statusLights = new THREE.Group();
    const lightColors = [0xff00ff, 0xaa88ff, 0x8800ff];  // Purple LED colors
    for (let i = 0; i < 3; i++) {
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 8, 8),
        createEmissiveMaterial(lightColors[i], 2)
      );
      light.position.set(-0.15 + i * 0.05, 1.3, 0.48);
      statusLights.add(light);
    }
    helmetGroup.add(statusLights);

    // Neck and torso connection
    const neckJoint = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.15, 32),
      silverMetal
    );
    neckJoint.position.y = 1.1;
    astronaut.add(neckJoint);

    // Enhanced torso with segmented design
    const torsoGroup = new THREE.Group();
    
    // Upper torso segments
    const torsoSegments = [];
    for (let i = 0; i < 3; i++) {
      const segment = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.4 + i * 0.03,
          0.43 + i * 0.03,
          0.2,
          32
        ),
        i % 2 === 0 ? purpleFabric : darkPurpleFabric
      );
      segment.position.y = 0.95 - i * 0.2;
      segment.castShadow = true;
      segment.receiveShadow = true;
      torsoSegments.push(segment);
      torsoGroup.add(segment);
    }

    // Life support chest unit
    const chestUnit = new THREE.Group();
    
    const chestPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.3, 0.12),
      new THREE.MeshStandardMaterial({
        color: 0x663399,  // Purple chest plate
        roughness: 0.3,
        metalness: 0.8
      })
    );
    chestPlate.position.set(0, 0.85, 0.3);
    chestUnit.add(chestPlate);

    // Digital display
    const display = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.1, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x8800ff,  // Purple display
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.9
      })
    );
    display.position.set(0, 0.85, 0.37);
    chestUnit.add(display);

    // Control buttons grid
    const buttonGrid = new THREE.Group();
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const button = new THREE.Mesh(
          new THREE.CylinderGeometry(0.015, 0.015, 0.01, 16),
          createEmissiveMaterial(
            row === 0 ? 0xff88ff : 0xaa88ff,  // Purple buttons
            1
          )
        );
        button.rotation.x = Math.PI / 2;
        button.position.set(
          -0.06 + col * 0.06,
          0.88 - row * 0.06,
          0.38
        );
        buttonGrid.add(button);
      }
    }
    chestUnit.add(buttonGrid);

    // Breathing apparatus connections
    const breathingTubes = new THREE.Group();
    for (let side of [-1, 1]) {
      const tubeStart = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.1, 16),
        silverMetal
      );
      tubeStart.position.set(side * 0.35, 1, 0.2);
      breathingTubes.add(tubeStart);
    }
    chestUnit.add(breathingTubes);
    torsoGroup.add(chestUnit);

    // Enhanced limb creation with detailed joints
    function createEnhancedLimb(isRight, isArm) {
      const limbGroup = new THREE.Group();
      
      // Shoulder/hip joint
      const jointSocket = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 32, 32),
        silverMetal
      );
      jointSocket.castShadow = true;
      limbGroup.add(jointSocket);

      // Upper segment with fabric details
      const upperSegment = new THREE.Group();
      const upperMain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.13, 0.45, 32),
        isArm ? purpleFabric : darkPurpleFabric
      );
      upperMain.position.y = -0.225;
      upperSegment.add(upperMain);

      // Reinforcement bands
      for (let i = 0; i < 2; i++) {
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(0.14 - i * 0.01, 0.015, 8, 32),
          darkPurpleFabric
        );
        band.position.y = -0.15 - i * 0.15;
        band.rotation.x = Math.PI / 2;
        upperSegment.add(band);
      }
      limbGroup.add(upperSegment);

      // Elbow/knee joint mechanism
      const jointMech = new THREE.Group();
      const joint = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 32, 32),
        silverMetal
      );
      joint.position.y = -0.45;
      jointMech.add(joint);

      // Joint hydraulics
      const hydraulic = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16),
        goldMetal
      );
      hydraulic.position.set(0.08, -0.45, 0);
      hydraulic.rotation.z = -Math.PI / 6;
      jointMech.add(hydraulic);
      limbGroup.add(jointMech);

      // Lower segment
      const lowerSegment = new THREE.Group();
      const lowerMain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.11, 0.45, 32),
        isArm ? lightPurpleFabric : purpleFabric
      );
      lowerMain.position.y = -0.675;
      lowerSegment.add(lowerMain);

      // Utility attachments
      if (isArm) {
        const utilityRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.12, 0.02, 8, 32),
          silverMetal
        );
        utilityRing.position.y = -0.8;
        utilityRing.rotation.x = Math.PI / 2;
        lowerSegment.add(utilityRing);
      }
      limbGroup.add(lowerSegment);

      // End effectors (hands or boots)
      if (isArm) {
        const hand = createEnhancedHand();
        hand.position.y = -0.9;
        limbGroup.add(hand);
      } else {
        const boot = createEnhancedBoot();
        boot.position.y = -0.9;
        limbGroup.add(boot);
      }

      // Position limb
      if (isArm) {
        const xPos = isRight ? 0.65 : -0.65;
        const rotateZ = isRight ? -Math.PI * 0.15 : Math.PI * 0.15;
        limbGroup.position.set(xPos, 0.9, 0);
        limbGroup.rotation.set(0, 0, rotateZ);
      } else {
        const xPos = isRight ? 0.25 : -0.25;
        limbGroup.position.set(xPos, 0.1, 0);
      }

      return limbGroup;
    }

    // Enhanced hand with articulated fingers
    function createEnhancedHand() {
      const handGroup = new THREE.Group();
      
      const palm = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.08, 0.18),
        silverMetal
      );
      handGroup.add(palm);

      // Articulated fingers
      const fingerPositions = [
        { x: -0.045, z: 0.08 },
        { x: -0.015, z: 0.09 },
        { x: 0.015, z: 0.09 },
        { x: 0.045, z: 0.08 }
      ];

      fingerPositions.forEach((pos, i) => {
        const finger = new THREE.Group();
        
        for (let j = 0; j < 3; j++) {
          const segment = new THREE.Mesh(
            new THREE.CylinderGeometry(0.012 - j * 0.002, 0.01 - j * 0.002, 0.04, 8),
            silverMetal
          );
          segment.position.y = -0.04 - j * 0.035;
          segment.position.z = j * 0.01;
          finger.add(segment);
        }

        finger.position.set(pos.x, -0.04, pos.z);
        finger.rotation.x = Math.PI / 6;
        handGroup.add(finger);
      });

      // Thumb
      const thumb = new THREE.Group();
      for (let j = 0; j < 2; j++) {
        const segment = new THREE.Mesh(
          new THREE.CylinderGeometry(0.013 - j * 0.002, 0.011 - j * 0.002, 0.035, 8),
          silverMetal
        );
        segment.position.y = -j * 0.03;
        thumb.add(segment);
      }
      thumb.position.set(-0.06, -0.02, 0.03);
      thumb.rotation.set(0, -Math.PI / 4, Math.PI / 6);
      handGroup.add(thumb);

      return handGroup;
    }

    // Enhanced boot with magnetic sole
    function createEnhancedBoot() {
      const bootGroup = new THREE.Group();
      
      const bootMain = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.12, 0.35),
        darkPurpleFabric
      );
      bootMain.position.z = 0.05;
      bootGroup.add(bootMain);

      // Magnetic sole with grip pattern
      const sole = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.03, 0.38),
        new THREE.MeshStandardMaterial({
          color: 0x332244,  // Dark purple sole
          roughness: 0.9,
          metalness: 0.5
        })
      );
      sole.position.set(0, -0.075, 0.05);
      bootGroup.add(sole);

      // Heel stabilizer
      const heelStabilizer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.04, 0.1, 16),
        silverMetal
      );
      heelStabilizer.position.set(0, -0.02, -0.12);
      bootGroup.add(heelStabilizer);

      // Toe cap
      const toeCap = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.1, 0.08),
        silverMetal
      );
      toeCap.position.set(0, 0, 0.19);
      bootGroup.add(toeCap);

      return bootGroup;
    }

    // Create limbs
    const rightArm = createEnhancedLimb(true, true);
    const leftArm = createEnhancedLimb(false, true);
    const rightLeg = createEnhancedLimb(true, false);
    const leftLeg = createEnhancedLimb(false, false);

    // Enhanced backpack system
    const backpackSystem = new THREE.Group();
    
    // Main pack with modular design
    const mainPack = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.8, 0.35),
      new THREE.MeshStandardMaterial({
        color: 0x4a2a6a,  // Dark purple backpack
        roughness: 0.4,
        metalness: 0.7
      })
    );
    mainPack.position.set(0, 0.7, -0.4);
    mainPack.castShadow = true;
    backpackSystem.add(mainPack);

    // Dual oxygen tank system
    const tankSystem = new THREE.Group();
    
    for (let side of [-1, 1]) {
      const tankGroup = new THREE.Group();
      
      // Main tank
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.6, 32),
        silverMetal
      );
      tank.castShadow = true;
      tankGroup.add(tank);

      // Tank caps with pressure gauges
      const topCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        goldMetal
      );
      topCap.position.y = 0.3;
      tankGroup.add(topCap);

      const bottomCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        goldMetal
      );
      bottomCap.position.y = -0.3;
      tankGroup.add(bottomCap);

      // Pressure gauge
      const gauge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16),
        createEmissiveMaterial(0xaa88ff, 2)  // Purple gauge
      );
      gauge.rotation.z = Math.PI / 2;
      gauge.position.set(side * 0.09, 0.15, 0);
      tankGroup.add(gauge);

      tankGroup.position.set(side * 0.22, 0.7, -0.45);
      tankSystem.add(tankGroup);
    }
    backpackSystem.add(tankSystem);

    // Life support tubes with animated flow
    const createLifeSupportTube = (startPos, endPos) => {
      const curve = new THREE.CatmullRomCurve3([
        startPos,
        new THREE.Vector3(
          startPos.x * 1.2,
          startPos.y + 0.3,
          startPos.z * 0.7
        ),
        new THREE.Vector3(
          endPos.x * 0.8,
          endPos.y - 0.1,
          endPos.z * 0.5
        ),
        endPos
      ]);

      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.025, 16, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xcc88ff,  // Purple tubes
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x8800ff,  // Purple emissive
        emissiveIntensity: 0.2
      });
      
      return new THREE.Mesh(tubeGeo, tubeMat);
    };

    const rightTube = createLifeSupportTube(
      new THREE.Vector3(0.22, 0.95, -0.45),
      new THREE.Vector3(0.1, 1.5, 0)
    );
    backpackSystem.add(rightTube);

    const leftTube = createLifeSupportTube(
      new THREE.Vector3(-0.22, 0.95, -0.45),
      new THREE.Vector3(-0.1, 1.5, 0)
    );
    backpackSystem.add(leftTube);

    // Jetpack thrusters
    const jetpackSystem = new THREE.Group();
    
    const thrusterPositions = [
      { x: -0.35, y: 0.9, z: -0.5 },
      { x: 0.35, y: 0.9, z: -0.5 },
      { x: -0.35, y: 0.3, z: -0.5 },
      { x: 0.35, y: 0.3, z: -0.5 }
    ];

    thrusterPositions.forEach((pos, i) => {
      const thruster = new THREE.Group();
      
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.08, 0.15, 16),
        darkPurpleFabric
      );
      thruster.add(housing);

      const nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(0.05, 0.08, 16),
        silverMetal
      );
      nozzle.position.y = -0.115;
      nozzle.rotation.x = Math.PI;
      thruster.add(nozzle);

      const glowRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.05, 0.01, 8, 16),
        createEmissiveMaterial(0xff00ff, 1)
      );
      glowRing.position.y = -0.08;
      glowRing.rotation.x = Math.PI / 2;
      thruster.add(glowRing);

      thruster.position.copy(pos);
      thruster.rotation.x = -Math.PI / 6;
      jetpackSystem.add(thruster);
    });
    
    backpackSystem.add(jetpackSystem);

    // Communication and sensor array
    const commDevice = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.2, 0.05),
      new THREE.MeshStandardMaterial({
        color: 0x444455,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0x8800ff,  // Purple emissive
        emissiveIntensity: 0.3
      })
    );
    commDevice.position.set(0, 0.5, -0.58);
    backpackSystem.add(commDevice);

    // Assemble all parts
    astronaut.add(helmetGroup);
    astronaut.add(torsoGroup);
    astronaut.add(rightArm);
    astronaut.add(leftArm);
    astronaut.add(rightLeg);
    astronaut.add(leftLeg);
    astronaut.add(backpackSystem);

    // Position astronaut
    astronaut.position.set(2, 0, 0);
    astronaut.castShadow = true;
    astronaut.receiveShadow = true;

    // Add to scene
    scene.add(astronaut);

    // Enhanced animations
    animateEnhancedAstronaut(astronaut, jetpackSystem);
  };

  // Enhanced astronaut animations
  const animateEnhancedAstronaut = (astronaut, jetpackSystem) => {
    // Complex floating pattern
    const floatTimeline = gsap.timeline({ repeat: -1 });
    
    floatTimeline
      .to(astronaut.position, {
        y: 0.8,
        z: 0.5,
        duration: 4,
        ease: "power1.inOut"
      })
      .to(astronaut.position, {
        y: 0.3,
        z: -0.3,
        duration: 3,
        ease: "power1.inOut"
      })
      .to(astronaut.position, {
        y: 0,
        z: 0,
        duration: 3,
        ease: "power1.inOut"
      });

    // Rotation with varying speed
    gsap.to(astronaut.rotation, {
      y: Math.PI * 2,
      duration: 25,
      repeat: -1,
      ease: "none"
    });

    // Dynamic tilting
    const tiltTimeline = gsap.timeline({ repeat: -1, yoyo: true });
    tiltTimeline
      .to(astronaut.rotation, {
        x: 0.15,
        z: 0.08,
        duration: 3,
        ease: "sine.inOut"
      })
      .to(astronaut.rotation, {
        x: -0.05,
        z: -0.05,
        duration: 2,
        ease: "sine.inOut"
      });

    // Animate arms
    const rightArm = astronaut.children[2];
    const leftArm = astronaut.children[3];
    
    gsap.to(rightArm.rotation, {
      z: -Math.PI * 0.3,
      x: Math.PI * 0.1,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(leftArm.rotation, {
      z: Math.PI * 0.25,
      x: -Math.PI * 0.05,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

    // Jetpack activation effect
    if (jetpackSystem) {
      gsap.to(jetpackSystem.rotation, {
        y: Math.PI * 0.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    }
  };

  // Create enhanced spaceship with complex geometry
  const createEnhancedSpaceship = (scene) => {
    const spaceship = new THREE.Group();
    spaceship.name = "spaceship";

    // Advanced materials
    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0x6b46c1,
      roughness: 0.2,
      metalness: 0.9,
      envMap: environmentMapRef.current,
      envMapIntensity: 2
    });

    const darkHullMaterial = new THREE.MeshStandardMaterial({
      color: 0x4c2889,
      roughness: 0.25,
      metalness: 0.85,
      envMap: environmentMapRef.current,
      envMapIntensity: 1.5
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xddaaff,  // Purple-tinted glass
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.95,
      thickness: 0.5,
      envMap: environmentMapRef.current,
      envMapIntensity: 3,
      clearcoat: 1,
      clearcoatRoughness: 0,
      ior: 1.45,
      reflectivity: 0.9
    });

    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x553388,  // Dark purple panels
      roughness: 0.4,
      metalness: 0.7,
      normalScale: new THREE.Vector2(1, 1),
      envMap: environmentMapRef.current,
      envMapIntensity: 0.8
    });

    // Define material helper functions
    const createEmissiveMaterial = (color, intensity = 2) => {
      return new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: intensity,
        roughness: 0.2,
        metalness: 0.5
      });
    };

    const silverMetal = new THREE.MeshStandardMaterial({
      color: 0xe6ccff,  // Purple-silver
      roughness: 0.1,
      metalness: 0.98,
      envMap: environmentMapRef.current,
      envMapIntensity: 2
    });

    const goldMetal = new THREE.MeshStandardMaterial({
      color: 0xcc88ff,  // Purple-gold
      roughness: 0.15,
      metalness: 0.95,
      envMap: environmentMapRef.current,
      envMapIntensity: 1.5
    });

    const glowPurple = createEmissiveMaterial(0xc19eff, 2);
    const glowBlue = createEmissiveMaterial(0x00aaff, 2.5);
    const engineGlow = createEmissiveMaterial(0xb088ff, 3);

    // Create complex hull geometry
    const createHullSection = () => {
      const hullGroup = new THREE.Group();
      
      // Main body using lathe geometry for smooth curves
      const points = [];
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = Math.sin(t * Math.PI) * 2 * (1 - t * 0.3);
        const y = t * 5 - 2.5;
        points.push(new THREE.Vector2(x, y));
      }
      
      const hullGeo = new THREE.LatheGeometry(points, 32);
      const hull = new THREE.Mesh(hullGeo, hullMaterial);
      hull.scale.set(0.8, 1, 0.8);
      hull.castShadow = true;
      hull.receiveShadow = true;
      hullGroup.add(hull);

      // Add panel details
      const panelCount = 8;
      for (let i = 0; i < panelCount; i++) {
        const angle = (i / panelCount) * Math.PI * 2;
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(0.8, 2, 0.1),
          panelMaterial
        );
        panel.position.set(
          Math.cos(angle) * 1.5,
          0,
          Math.sin(angle) * 1.5
        );
        panel.rotation.y = angle;
        hullGroup.add(panel);
      }

      return hullGroup;
    };

    const mainHull = createHullSection();
    spaceship.add(mainHull);

    // Advanced cockpit design
    const cockpitGroup = new THREE.Group();
    
    // Cockpit frame
    const cockpitFrame = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 2, 8),
      darkHullMaterial
    );
    cockpitFrame.position.y = 3;
    cockpitGroup.add(cockpitFrame);

    // Multi-layer glass canopy
    for (let i = 0; i < 3; i++) {
      const canopy = new THREE.Mesh(
        new THREE.SphereGeometry(
          1 - i * 0.05,
          32,
          32,
          0,
          Math.PI * 2,
          0,
          Math.PI * 0.6
        ),
        glassMaterial
      );
      canopy.rotation.x = Math.PI * 1.4;
      canopy.position.y = 3.2 - i * 0.02;
      canopy.position.z = 0.3;
      cockpitGroup.add(canopy);
    }

    // Cockpit interior lights
    const cockpitLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.8),
      glowBlue
    );
    cockpitLight.position.y = 2.8;
    cockpitGroup.add(cockpitLight);
    
    spaceship.add(cockpitGroup);

    // Advanced engine system
    const engineSystem = new THREE.Group();
    
    // Main thruster array
    const createEnginePod = (size = 1) => {
      const podGroup = new THREE.Group();
      
      // Engine housing
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.3 * size,
          0.4 * size,
          0.8 * size,
          32
        ),
        darkHullMaterial
      );
      podGroup.add(housing);

      // Thrust chamber
      const chamber = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.25 * size,
          0.2 * size,
          0.3 * size,
          32
        ),
        new THREE.MeshStandardMaterial({
          color: 0x442255,  // Dark purple thrust chamber
          roughness: 0.8,
          metalness: 0.9
        })
      );
      chamber.position.y = -0.55 * size;
      podGroup.add(chamber);

      // Exhaust nozzle
      const nozzle = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 * size, 0.4 * size, 32, 1, true),
        engineGlow
      );
      nozzle.position.y = -0.8 * size;
      nozzle.rotation.x = Math.PI;
      podGroup.add(nozzle);

      // Cooling vanes
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const vane = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.6 * size, 0.15 * size),
          silverMetal
        );
        vane.position.set(
          Math.cos(angle) * 0.35 * size,
          0,
          Math.sin(angle) * 0.35 * size
        );
        vane.rotation.y = angle;
        podGroup.add(vane);
      }

      // Thrust vectoring ring
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.35 * size, 0.05, 16, 32),
        goldMetal
      );
      ring.position.y = -0.3 * size;
      ring.rotation.x = Math.PI / 2;
      podGroup.add(ring);

      return podGroup;
    };

    // Create engine configuration
    const enginePositions = [
      { x: 0, y: -2.5, z: 0, size: 1.5 }, // Center main
      { x: -1.2, y: -2.3, z: 0, size: 1 }, // Left
      { x: 1.2, y: -2.3, z: 0, size: 1 }, // Right
      { x: 0, y: -2.3, z: -1.2, size: 1 }, // Back
      { x: 0, y: -2.3, z: 1.2, size: 1 } // Front
    ];

    enginePositions.forEach((pos, i) => {
      const engine = createEnginePod(pos.size);
      engine.position.set(pos.x, pos.y, pos.z);
      engineSystem.add(engine);
      
      // Store reference for particle effects
      engine.name = `engine_${i}`;
    });

    spaceship.add(engineSystem);

    // Swept wings with control surfaces
    const createWing = (side) => {
      const wingGroup = new THREE.Group();
      
      // Main wing structure
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 0);
      wingShape.lineTo(3, -0.3);
      wingShape.lineTo(4, -1.5);
      wingShape.lineTo(3.5, -2);
      wingShape.lineTo(0.5, -0.8);
      wingShape.lineTo(0, 0);

      const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5
      });
      
      const wing = new THREE.Mesh(wingGeo, hullMaterial);
      wing.castShadow = true;
      wingGroup.add(wing);

      // Wing lights
      const lightPositions = [1, 2, 3];
      lightPositions.forEach(x => {
        const light = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.05, 0.1),
          glowPurple
        );
        light.position.set(x, -x * 0.4, 0.15);
        wingGroup.add(light);
        
        // Add to animated lights
        spaceshipLightsRef.current.push({
          mesh: light,
          baseIntensity: 2,
          phase: Math.random() * Math.PI * 2
        });
      });

      // Control surface
      const controlSurface = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.05, 0.3),
        darkHullMaterial
      );
      controlSurface.position.set(2.5, -1.2, -0.2);
      controlSurface.rotation.z = -Math.PI / 8;
      wingGroup.add(controlSurface);

      if (side < 0) {
        wingGroup.scale.x = -1;
      }
      
      wingGroup.position.x = side * 0.5;
      wingGroup.position.y = 0;
      return wingGroup;
    };

    const leftWing = createWing(-1);
    const rightWing = createWing(1);
    spaceship.add(leftWing);
    spaceship.add(rightWing);

    // Vertical stabilizers
    const createStabilizer = (xPos) => {
      const stabGroup = new THREE.Group();
      
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2.5, 1),
        hullMaterial
      );
      fin.position.y = 1;
      fin.rotation.z = Math.PI / 12 * (xPos > 0 ? 1 : -1);
      stabGroup.add(fin);

      // Rudder
      const rudder = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 1.5, 0.6),
        darkHullMaterial
      );
      rudder.position.set(0, 1.5, -0.7);
      stabGroup.add(rudder);

      // Navigation light
      const navLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        createEmissiveMaterial(xPos > 0 ? 0xff00ff : 0x8800ff, 3)  // Purple nav lights
      );
      navLight.position.set(0, 2.5, 0);
      stabGroup.add(navLight);

      stabGroup.position.x = xPos;
      stabGroup.position.y = -1;
      return stabGroup;
    };

    spaceship.add(createStabilizer(-1.5));
    spaceship.add(createStabilizer(1.5));

    // Sensor array and communications
    const sensorArray = new THREE.Group();
    
    // Rotating radar dish
    const dishBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16),
      silverMetal
    );
    dishBase.position.y = 4.5;
    sensorArray.add(dishBase);

    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3),
      new THREE.MeshStandardMaterial({
        color: 0xeeaaff,  // Light purple dish
        roughness: 0.1,
        metalness: 0.95,
        side: THREE.DoubleSide
      })
    );
    dish.position.y = 4.7;
    dish.rotation.x = -Math.PI / 6;
    sensorArray.add(dish);

    // Antenna array
    for (let i = 0; i < 3; i++) {
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.5 + i * 0.2, 8),
        silverMetal
      );
      antenna.position.set(
        (i - 1) * 0.3,
        4.8 + i * 0.1,
        -0.3
      );
      sensorArray.add(antenna);
    }

    spaceship.add(sensorArray);

    // Animated radar rotation
    gsap.to(dish.rotation, {
      y: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: "none"
    });

    // Position and scale spaceship
    spaceship.scale.set(1.2, 1.2, 1.2);
    spaceship.position.set(-4, -1, -2);
    spaceship.rotation.y = Math.PI * 0.2;

    // Add to scene
    scene.add(spaceship);

    // Create engine effects for all engines
    engineSystem.children.forEach((engine, i) => {
      const worldPos = new THREE.Vector3();
      engine.getWorldPosition(worldPos);
      createEnhancedThrusterEffect(engine, worldPos, 1 + i * 0.2);
    });

    // Animate spaceship
    animateEnhancedSpaceship(spaceship);
  };

  // Enhanced thruster effect with better particles
  const createEnhancedThrusterEffect = (engine, position, scale = 1) => {
    // Create more sophisticated particle system
    for (let i = 0; i < 40; i++) {
      const particleGeo = new THREE.SphereGeometry(0.02 * scale, 8, 8);
      
      // Create gradient material for particles
      const hue = 0.75 + Math.random() * 0.1; // Purple to blue range
      const particleMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1, 0.7),
        transparent: true,
        opacity: Math.random() * 0.7 + 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const particle = new THREE.Mesh(particleGeo, particleMat);
      particle.position.copy(position);
      particle.position.y -= 0.5 * scale;

      // Add glow effect
      const glowGeo = new THREE.SphereGeometry(0.04 * scale, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(hue, 1, 0.9),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      
      const glow = new THREE.Mesh(glowGeo, glowMat);
      particle.add(glow);

      sceneRef.current.add(particle);

      thrusterParticlesRef.current.push({
        mesh: particle,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          -Math.random() * 0.6 - 0.5,
          (Math.random() - 0.5) * 0.3
        ),
        life: 0,
        maxLife: Math.random() * 80 + 60,
        scale: scale,
        basePosition: position.clone(),
        engine: engine,
        hue: hue,
        turbulence: Math.random() * 0.02
      });
    }
  };

  // Enhanced spaceship animation
  const animateEnhancedSpaceship = (spaceship) => {
    // Complex hovering pattern
    const hoverTimeline = gsap.timeline({ repeat: -1 });
    
    hoverTimeline
      .to(spaceship.position, {
        y: -0.5,
        x: -3.5,
        duration: 4,
        ease: "power1.inOut"
      })
      .to(spaceship.position, {
        y: -1.5,
        x: -4.5,
        duration: 3,
        ease: "power1.inOut"
      })
      .to(spaceship.position, {
        y: -1,
        x: -4,
        duration: 3,
        ease: "power1.inOut"
      });

    // Banking motion
    gsap.to(spaceship.rotation, {
      z: 0.1,
      x: 0.05,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Slow yaw movement
    gsap.to(spaceship.rotation, {
      y: Math.PI * 0.4,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  };

  // Add space debris for atmosphere
  const addSpaceDebris = (scene) => {
    const debrisGroup = new THREE.Group();
    
    // Keep debris far from the camera and main subjects
    const minDistance = 25; // Minimum distance from origin
    const maxDistance = 60; // Maximum distance
    
    for (let i = 0; i < 20; i++) {
      const size = Math.random() * 0.3 + 0.1;
      const geometry = Math.random() > 0.5
        ? new THREE.BoxGeometry(size, size, size)
        : new THREE.IcosahedronGeometry(size, 0);
      
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.1, 0.3),
        roughness: 0.8,
        metalness: 0.5
      });
      
      const debris = new THREE.Mesh(geometry, material);
      
      // Position debris in a shell between minDistance and maxDistance
      const radius = minDistance + Math.random() * (maxDistance - minDistance);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      debris.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      debris.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      debris.castShadow = true;
      debrisGroup.add(debris);

      // Animate debris rotation
      gsap.to(debris.rotation, {
        x: debris.rotation.x + Math.PI * 2,
        y: debris.rotation.y + Math.PI * 2,
        z: debris.rotation.z + Math.PI * 2,
        duration: 20 + Math.random() * 30,
        repeat: -1,
        ease: "none"
      });
      
      // Floating motion - smaller range to keep debris in their zone
      gsap.to(debris.position, {
        y: debris.position.y + (Math.random() - 0.5) * 3,
        duration: 10 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    scene.add(debrisGroup);
  };

  // Create detailed asteroid field
  const createAsteroidField = (scene) => {
    const asteroidField = new THREE.Group();
    asteroidField.name = "asteroidField";
    asteroidFieldRef.current = asteroidField;

    // Create asteroid material with custom shader for better textures
    const createAsteroidMaterial = () => {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.4, 0.3, 0.3),
        roughness: 0.9,
        metalness: 0.1,
        envMap: environmentMapRef.current,
        envMapIntensity: 0.2
      });

      material.onBeforeCompile = (shader) => {
        shader.uniforms.scale = { value: 1.0 };
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          #include <common>
          varying vec3 vPosition;
          `
        );
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          vPosition = position;
          #include <begin_vertex>
          `
        );
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>
          varying vec3 vPosition;
          uniform float scale;
          
          float random(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
          }
          
          float noise3D(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            float n = mix(
              mix(
                mix(random(i), random(i + vec3(1.0, 0.0, 0.0)), f.x),
                mix(random(i + vec3(0.0, 1.0, 0.0)), random(i + vec3(1.0, 1.0, 0.0)), f.x),
                f.y
              ),
              mix(
                mix(random(i + vec3(0.0, 0.0, 1.0)), random(i + vec3(1.0, 0.0, 1.0)), f.x),
                mix(random(i + vec3(0.0, 1.0, 1.0)), random(i + vec3(1.0, 1.0, 1.0)), f.x),
                f.y
              ),
              f.z
            );
            
            return n;
          }
          `
        );
        
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
          #include <color_fragment>
          
          // Add surface detail
          float detail = noise3D(vPosition * 10.0 * scale);
          float crater = smoothstep(0.4, 0.6, detail);
          
          diffuseColor.rgb *= mix(0.7, 1.0, crater);
          
          // Add color variation
          vec3 rockColor1 = vec3(0.4, 0.35, 0.3);
          vec3 rockColor2 = vec3(0.5, 0.4, 0.35);
          vec3 rockColor3 = vec3(0.3, 0.25, 0.2);
          
          float colorNoise = noise3D(vPosition * 2.0 * scale);
          vec3 finalColor = mix(rockColor1, rockColor2, colorNoise);
          finalColor = mix(finalColor, rockColor3, crater * 0.5);
          
          diffuseColor.rgb *= finalColor;
          `
        );
      };

      return material;
    };

    // Create various asteroid shapes
    const createAsteroid = (size) => {
      const detail = Math.floor(Math.random() * 2) + 1;
      const geometry = new THREE.IcosahedronGeometry(size, detail);
      
      // Deform vertices for more realistic shape
      const positions = geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        const noise = Math.random() * 0.3 + 0.85;
        vertex.multiplyScalar(noise);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      geometry.computeVertexNormals();
      
      const material = createAsteroidMaterial();
      material.userData.scale = size;
      
      const asteroid = new THREE.Mesh(geometry, material);
      asteroid.castShadow = true;
      asteroid.receiveShadow = true;
      
      return asteroid;
    };

    // Create asteroid belt - keep far from main action
    const asteroidCount = 150;
    for (let i = 0; i < asteroidCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const asteroid = createAsteroid(size);
      
      // Position in a belt formation - further out
      const angle = (i / asteroidCount) * Math.PI * 2;
      const radius = 45 + Math.random() * 25; // Changed from 30-50 to 45-70
      const height = (Math.random() - 0.5) * 15;
      
      asteroid.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      
      asteroid.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Individual rotation animation
      const rotationSpeed = (Math.random() - 0.5) * 0.02;
      gsap.to(asteroid.rotation, {
        x: asteroid.rotation.x + Math.PI * 2,
        y: asteroid.rotation.y + Math.PI * 2,
        duration: 100 / Math.abs(rotationSpeed),
        repeat: -1,
        ease: "none"
      });
      
      asteroidField.add(asteroid);
    }
    
    // Add some larger asteroids - keep them far from camera path
    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 4 + 2;
      const asteroid = createAsteroid(size);
      
      // Ensure minimum distance from center where action happens
      const minRadius = 25;
      const maxRadius = 40;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      asteroid.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Avoid positions too close to the main viewing area
      if (Math.abs(asteroid.position.y) < 10 && asteroid.position.length() < 30) {
        asteroid.position.normalize().multiplyScalar(30);
      }
      
      asteroid.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      gsap.to(asteroid.rotation, {
        x: asteroid.rotation.x + Math.PI * 2,
        y: asteroid.rotation.y + Math.PI * 2,
        duration: 60 + Math.random() * 40,
        repeat: -1,
        ease: "none"
      });
      
      asteroidField.add(asteroid);
    }
    
    scene.add(asteroidField);
  };

  // Add planets and moons to the background
  const addPlanetsAndMoons = (scene) => {
    // Create gas giant planet
    const createGasGiant = () => {
      const planetGroup = new THREE.Group();
      
      // Planet sphere with custom shader
      const planetGeo = new THREE.SphereGeometry(8, 64, 64);
      const planetMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: new THREE.Color(0x4a2a6a) },
          cloudColor: { value: new THREE.Color(0x8c64d8) },
          bandColor: { value: new THREE.Color(0x9333ea) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 baseColor;
          uniform vec3 cloudColor;
          uniform vec3 bandColor;
          varying vec2 vUv;
          varying vec3 vNormal;
          
          float noise(vec2 p) {
            return sin(p.x * 10.0 + time) * sin(p.y * 10.0 + time) * 0.5 + 0.5;
          }
          
          void main() {
            // Create banded atmosphere
            float bands = sin(vUv.y * 20.0 + time * 0.1) * 0.5 + 0.5;
            float turbulence = noise(vUv * 5.0) * 0.3;
            
            vec3 color = mix(baseColor, bandColor, bands);
            color = mix(color, cloudColor, turbulence);
            
            // Add atmosphere glow at edges
            float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            color += cloudColor * fresnel * 0.5;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `
      });
      
      const planet = new THREE.Mesh(planetGeo, planetMat);
      planetGroup.add(planet);
      
      // Add ring system
      const ringGeo = new THREE.RingGeometry(10, 15, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x9966ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        roughness: 0.8,
        metalness: 0.2,
        emissive: 0x4422aa,
        emissiveIntensity: 0.2
      });
      
      const rings = new THREE.Mesh(ringGeo, ringMat);
      rings.rotation.x = Math.PI / 2.5;
      planetGroup.add(rings);
      
      // Animate shader time uniform
      gsap.to(planetMat.uniforms.time, {
        value: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      
      // Slow rotation
      gsap.to(planetGroup.rotation, {
        y: Math.PI * 2,
        duration: 120,
        repeat: -1,
        ease: "none"
      });
      
      return planetGroup;
    };
    
    // Add gas giant
    const gasGiant = createGasGiant();
    gasGiant.position.set(-60, 20, -80);
    scene.add(gasGiant);
    
    // Create rocky moon
    const createMoon = (size = 2) => {
      const moonGeo = new THREE.SphereGeometry(size, 32, 32);
      const moonMat = new THREE.MeshStandardMaterial({
        color: 0x666677,
        roughness: 0.9,
        metalness: 0.1,
        envMap: environmentMapRef.current,
        envMapIntensity: 0.3,
        bumpScale: 0.05
      });
      
      // Add craters using displacement
      const positions = moonGeo.attributes.position;
      const vertex = new THREE.Vector3();
      
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        const crater = Math.random() > 0.9 ? 0.9 : 1;
        vertex.multiplyScalar(crater);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      
      moonGeo.computeVertexNormals();
      
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moon.castShadow = true;
      moon.receiveShadow = true;
      
      return moon;
    };
    
    // Add moons
    const moon1 = createMoon(1.5);
    moon1.position.set(50, -20, -60);
    scene.add(moon1);
    
    const moon2 = createMoon(1);
    moon2.position.set(-40, 30, -70);
    scene.add(moon2);
    
    // Animate moons
    gsap.to(moon1.rotation, {
      y: Math.PI * 2,
      duration: 80,
      repeat: -1,
      ease: "none"
    });
    
    gsap.to(moon2.rotation, {
      y: -Math.PI * 2,
      duration: 60,
      repeat: -1,
      ease: "none"
    });
  };

  // Update thruster particles
  const updateThrusterParticles = () => {
    thrusterParticlesRef.current.forEach((particle, index) => {
      particle.life += 1;

      if (particle.life > particle.maxLife) {
        // Reset particle
        const worldPos = new THREE.Vector3();
        particle.engine.getWorldPosition(worldPos);
        particle.mesh.position.copy(worldPos);
        particle.mesh.position.y -= 0.5 * particle.scale;
        
        particle.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          -Math.random() * 0.6 - 0.5,
          (Math.random() - 0.5) * 0.3
        );
        
        particle.mesh.material.opacity = Math.random() * 0.7 + 0.3;
        particle.life = 0;
        
        // Update color for variety
        particle.hue = 0.75 + Math.random() * 0.1;
        particle.mesh.material.color.setHSL(particle.hue, 1, 0.7);
      } else {
        // Update particle position with turbulence
        const turbulence = new THREE.Vector3(
          Math.sin(particle.life * particle.turbulence) * 0.02,
          0,
          Math.cos(particle.life * particle.turbulence) * 0.02
        );
        
        particle.mesh.position.add(particle.velocity.clone().multiplyScalar(0.1));
        particle.mesh.position.add(turbulence);
        particle.velocity.y -= 0.008; // Gravity effect
        
        // Fade out and scale down
        const lifeRatio = particle.life / particle.maxLife;
        particle.mesh.material.opacity = (1 - lifeRatio) * 0.7;
        particle.mesh.scale.setScalar((1 - lifeRatio * 0.7) * particle.scale);
        
        // Color shift over lifetime
        const brightness = 0.7 - lifeRatio * 0.3;
        particle.mesh.material.color.setHSL(particle.hue, 1 - lifeRatio * 0.5, brightness);
      }
    });
  };

  // Update star glows
  const updateStarGlows = (delta) => {
    starGlowsRef.current.forEach(star => {
      const glowIntensity = Math.sin(star.phase + star.speed * delta) * 0.5 + 0.5;
      star.mesh.material.opacity = 0.3 + glowIntensity * 0.7;
      star.mesh.scale.setScalar(0.8 + glowIntensity * 0.4);
      star.phase += star.speed * delta;
    });
  };

  // Update spaceship lights
  const updateSpaceshipLights = (delta) => {
    spaceshipLightsRef.current.forEach((light, i) => {
      const intensity = Math.sin(light.phase + delta * 2) * 0.5 + 0.5;
      if (light.mesh.material.emissiveIntensity !== undefined) {
        light.mesh.material.emissiveIntensity = light.baseIntensity * (0.5 + intensity * 0.5);
      }
      light.phase += delta * 2;
    });
  };

  return (
    <div className="space-container">
      <div ref={mountRef} className="w-full h-full"></div>
      <div className="space-text">Exploring the cosmic frontier</div>
    </div>
  );
};

export default SpaceScene;
