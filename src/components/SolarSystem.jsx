import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import "./astronaut.css"; // We'll reuse the same CSS for now

const SolarSystem = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const planetsRef = useRef({});
  const orbitGroupsRef = useRef({});
  const animationFrameRef = useRef(null);
  const resizeHandlerRef = useRef(null);
  const gsapCtxRef = useRef(null);

  // Planet configurations based on the Solar Exploration project
  const planetConfigs = {
    mercury: {
      name: 'Mercury',
      radius: 0.38,
      distance: 5.8,
      orbitSpeed: 0.01,    // Reduced from 0.0479
      rotationSpeed: 0.00017,
      color: 0xA0A0A0,
      emissive: 0x222222,
      metalness: 0.8,
      roughness: 0.9,
      inclination: 7.0
    },
    venus: {
      name: 'Venus',
      radius: 0.95,
      distance: 10.8,
      orbitSpeed: 0.007,   // Reduced from 0.035
      rotationSpeed: -0.00004,
      color: 0xFDA700,
      emissive: 0x7F5200,
      metalness: 0.3,
      roughness: 0.8,
      inclination: 3.4
    },    earth: {
      name: 'Earth',
      radius: 1.0,
      distance: 15.0,
      orbitSpeed: 0.006,   // Reduced from 0.0298
      rotationSpeed: 0.00729,
      color: 0x2233FF,
      emissive: 0x112244,
      metalness: 0.3,
      roughness: 0.7,
      inclination: 0.0,
      hasAtmosphere: true,
      atmosphereColor: 0x87CEEB,
      atmosphereOpacity: 0.25
    },
    mars: {
      name: 'Mars',
      radius: 0.53,
      distance: 22.8,
      orbitSpeed: 0.005,   // Reduced from 0.0241
      rotationSpeed: 0.00708,
      color: 0xCD5C5C,
      emissive: 0x551111,
      metalness: 0.5,
      roughness: 0.9,
      inclination: 1.9
    },
    jupiter: {
      name: 'Jupiter',
      radius: 3.0,
      distance: 35.2,
      orbitSpeed: 0.0025,  // Reduced from 0.0131
      rotationSpeed: 0.0174,
      color: 0xC88B3F,
      emissive: 0x332211,
      metalness: 0.2,
      roughness: 0.5,
      inclination: 1.3,
      hasBands: true
    },    saturn: {
      name: 'Saturn',
      radius: 2.5,
      distance: 42.7,
      orbitSpeed: 0.002,   // Reduced from 0.0097
      rotationSpeed: 0.0168,
      color: 0xFAD5A5,
      emissive: 0x332211,
      metalness: 0.3,
      roughness: 0.6,
      inclination: 2.5,
      hasRings: true,
      ringInnerRadius: 3.5,
      ringOuterRadius: 7.0,
      ringColor: 0xBB9B5A,
      ringOpacity: 0.8
    },
    uranus: {
      name: 'Uranus',
      radius: 1.5,
      distance: 51.5,
      orbitSpeed: 0.0015,  // Reduced from 0.0068
      rotationSpeed: 0.0101,
      color: 0x4FD0E7,
      emissive: 0x112233,
      metalness: 0.3,
      roughness: 0.4,
      inclination: 0.8,
      axialTilt: 97.8
    },
    neptune: {
      name: 'Neptune',
      radius: 1.5,
      distance: 59.0,
      orbitSpeed: 0.001,   // Reduced from 0.0054
      rotationSpeed: 0.0108,
      color: 0x4B70DD,
      emissive: 0x111144,
      metalness: 0.3,
      roughness: 0.4,
      inclination: 1.8
    }  };

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

      // Dispose of all materials and geometries
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);
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
    camera.position.set(30, 20, 30);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add fog for depth
    scene.fog = new THREE.FogExp2(0x000033, 0.00125);
    // Add camera animation
    animateCamera(camera, scene);

    // Add lights, stars, sun, and planets
    addLights(scene);
    addStarField(scene);
    createSun(scene);
    createPlanets(scene);
    createAsteroidBelt(scene);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    resizeHandlerRef.current = handleResize;
    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate star field slowly
      if (scene.getObjectByName("starField")) {
        scene.getObjectByName("starField").rotation.y += 0.0001;
      }

      // Animate planets
      animatePlanets();

      // Render
      renderer.render(scene, camera);
    };

    animate();
  };
  // Camera animation
  const animateCamera = (camera, scene) => {
    const timeline = gsap.timeline({ repeat: -1 });
    
    timeline
      .to(camera.position, {
        x: 40,
        z: 20,
        y: 30,
        duration: 20,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: 20,
        z: 40,
        y: 25,
        duration: 20,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: -30,
        z: 30,
        y: 20,
        duration: 20,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: -20,
        z: -40,
        y: 35,
        duration: 20,
        ease: "power2.inOut",
      })
      .to(camera.position, {
        x: 30,
        z: 30,
        y: 30,
        duration: 20,
        ease: "power2.inOut",
      });

    // Always look at the sun
    gsap.ticker.add(() => {
      camera.lookAt(0, 0, 0);
    });
  };
  // Add lights
  const addLights = (scene) => {
    // Very dim ambient light for space
    const ambientLight = new THREE.AmbientLight(0x222244, 0.1);
    scene.add(ambientLight);

    // Main sun light
    const sunLight = new THREE.PointLight(0xffffff, 3, 200);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 100;
    scene.add(sunLight);
    
    // Add secondary dim light for better visibility
    const fillLight = new THREE.PointLight(0x4444ff, 0.2, 300);
    fillLight.position.set(50, 50, 50);
    scene.add(fillLight);
  };

  // Create star field
  const addStarField = (scene) => {
    // Create multiple layers of stars for depth
    const starLayers = [
      { count: 5000, size: 0.02, distance: 200, opacity: 0.9 },
      { count: 3000, size: 0.05, distance: 300, opacity: 0.7 },
      { count: 2000, size: 0.08, distance: 500, opacity: 0.5 },
    ];
    
    const starFieldGroup = new THREE.Group();
    starFieldGroup.name = "starField";
    
    starLayers.forEach((layer, layerIndex) => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: layer.size,
        transparent: true,
        opacity: layer.opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const starsVertices = [];
      const starColors = [];
      
      for (let i = 0; i < layer.count; i++) {
        // Spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = layer.distance;
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        starsVertices.push(x, y, z);
        
        // Slight color variation for stars
        const colorVariation = 0.8 + Math.random() * 0.2;
        starColors.push(colorVariation, colorVariation, colorVariation * (0.8 + Math.random() * 0.2));
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      starsGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(starColors, 3)
      );

      const stars = new THREE.Points(starsGeometry, starsMaterial);
      starFieldGroup.add(stars);
    });
    
    scene.add(starFieldGroup);
  };
  // Create sun
  const createSun = (scene) => {
    const sunGroup = new THREE.Group();
    sunGroup.name = "sunGroup";
    
    // Main sun sphere
    const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 2,
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = "sun";
    sunGroup.add(sun);

    // Inner glow
    const innerGlowGeometry = new THREE.SphereGeometry(3.3, 64, 64);
    const innerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide,
    });
    const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
    sunGroup.add(innerGlow);
    
    // Outer glow
    const outerGlowGeometry = new THREE.SphereGeometry(4, 32, 32);
    const outerGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    sunGroup.add(outerGlow);
    
    // Corona effect
    const coronaGeometry = new THREE.SphereGeometry(5, 16, 16);
    const coronaMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(corona);
    
    scene.add(sunGroup);

    // Animate sun and its effects
    gsap.to(sun.rotation, {
      y: Math.PI * 2,
      duration: 25,
      repeat: -1,
      ease: "none",
    });
    
    // Pulsing glow effect
    gsap.to(innerGlowMaterial, {
      opacity: 0.6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
    
    gsap.to(outerGlowMaterial, {
      opacity: 0.3,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });
  };
  // Create planets
  const createPlanets = (scene) => {
    Object.keys(planetConfigs).forEach((planetKey) => {
      const config = planetConfigs[planetKey];
      
      // Create orbit group
      const orbitGroup = new THREE.Group();
      orbitGroup.name = `${planetKey}Orbit`;
      scene.add(orbitGroup);
      orbitGroupsRef.current[planetKey] = orbitGroup;

      // Create planet
      const planetGeometry = new THREE.SphereGeometry(config.radius, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.emissive,
        emissiveIntensity: 0.1,
        metalness: config.metalness,
        roughness: config.roughness,
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.name = planetKey;
      planet.position.x = config.distance;
      planet.castShadow = true;
      planet.receiveShadow = true;
      
      orbitGroup.add(planet);
      planetsRef.current[planetKey] = planet;

      // Add orbit line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        config.distance, config.distance,
        0, 2 * Math.PI,
        false,
        0
      );
      const orbitPoints = orbitCurve.getPoints(100);
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444466,
        transparent: true,
        opacity: 0.3,
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);

      // Add rings to Saturn
      if (config.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          config.ringInnerRadius,
          config.ringOuterRadius,
          128,
          1
        );
        
        // Create gradient texture for rings
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 1;
        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 256, 0);
        gradient.addColorStop(0.0, 'rgba(170, 136, 68, 0.0)');
        gradient.addColorStop(0.1, 'rgba(170, 136, 68, 0.8)');
        gradient.addColorStop(0.3, 'rgba(187, 155, 90, 0.9)');
        gradient.addColorStop(0.5, 'rgba(170, 136, 68, 0.8)');
        gradient.addColorStop(0.7, 'rgba(187, 155, 90, 0.9)');
        gradient.addColorStop(0.9, 'rgba(170, 136, 68, 0.8)');
        gradient.addColorStop(1.0, 'rgba(170, 136, 68, 0.0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 1);
        
        const ringTexture = new THREE.CanvasTexture(canvas);
        
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          color: config.ringColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: config.ringOpacity,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2 + 0.1; // Slight tilt
        planet.add(rings);
      }

      // Add planet glow
      const glowGeometry = new THREE.SphereGeometry(config.radius * 1.3, 32, 32);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { value: 0.5 },
          p: { value: 4.5 },
          glowColor: { value: new THREE.Color(config.color) },
          viewVector: { value: new THREE.Vector3() }
        },
        vertexShader: `
          uniform float c;
          uniform float p;
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(c - dot(vNormal, vNormel), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, intensity * 0.5);
          }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      const planetGlow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(planetGlow);
      
      // Add atmosphere to Earth
      if (config.hasAtmosphere) {
        const atmosphereGeometry = new THREE.SphereGeometry(config.radius * 1.1, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
          color: config.atmosphereColor,
          transparent: true,
          opacity: config.atmosphereOpacity,
          side: THREE.BackSide,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        planet.add(atmosphere);
      }
      
      // Add axial tilt to Uranus
      if (config.axialTilt) {
        orbitGroup.rotation.z = config.axialTilt * Math.PI / 180;
      }
    });
  };
  // Create asteroid belt between Mars and Jupiter
  const createAsteroidBelt = (scene) => {
    const asteroidGroup = new THREE.Group();
    asteroidGroup.name = "asteroidBelt";
    
    // Create shared geometry for performance
    const asteroidGeometries = [
      new THREE.SphereGeometry(0.05, 6, 6),
      new THREE.SphereGeometry(0.08, 8, 8),
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.TetrahedronGeometry(0.1, 0),
      new THREE.OctahedronGeometry(0.08, 0),
    ];
    
    for (let i = 0; i < 500; i++) {
      const radius = 28 + Math.random() * 4; // Between Mars and Jupiter
      const angle = Math.random() * Math.PI * 2;
      const verticalOffset = (Math.random() - 0.5) * 1.5;
      
      // Random geometry
      const geometry = asteroidGeometries[Math.floor(Math.random() * asteroidGeometries.length)];
      
      const asteroidMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0.5 + Math.random() * 0.2, 0.5 + Math.random() * 0.2, 0.5 + Math.random() * 0.2),
        metalness: 0.6 + Math.random() * 0.3,
        roughness: 0.7 + Math.random() * 0.3,
      });
      
      const asteroid = new THREE.Mesh(geometry, asteroidMaterial);
      asteroid.position.x = Math.cos(angle) * radius;
      asteroid.position.z = Math.sin(angle) * radius;
      asteroid.position.y = verticalOffset;
      
      // Random rotation
      asteroid.rotation.x = Math.random() * Math.PI;
      asteroid.rotation.y = Math.random() * Math.PI;
      asteroid.rotation.z = Math.random() * Math.PI;
      
      // Random scale
      const scale = 0.5 + Math.random() * 1.5;
      asteroid.scale.set(scale, scale, scale);
      
      asteroidGroup.add(asteroid);
    }
    
    scene.add(asteroidGroup);
    
    // Rotate asteroid belt slowly
    gsap.to(asteroidGroup.rotation, {
      y: Math.PI * 2,
      duration: 150,
      repeat: -1,
      ease: "none",
    });
  };
  // Animate planets
  const animatePlanets = () => {
    Object.keys(planetConfigs).forEach((planetKey) => {
      const config = planetConfigs[planetKey];
      const planet = planetsRef.current[planetKey];
      const orbitGroup = orbitGroupsRef.current[planetKey];
      
      if (planet && orbitGroup) {
        // Orbit rotation
        orbitGroup.rotation.y += config.orbitSpeed;
        
        // Planet rotation
        planet.rotation.y += config.rotationSpeed;
      }
    });
  };

  return (
    <div className="space-container">
      <div ref={mountRef} className="w-full h-full"></div>
      <div className="space-text">Journey Through the Solar System</div>
    </div>
  );
};

export default SolarSystem;