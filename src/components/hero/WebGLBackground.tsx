import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, PerspectiveCamera, useAspect } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// Layer 1: Energy Fog Shader
const energyFogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const energyFogFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Standard 2D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    vec3 m1 = 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float noise(vec2 p) {
      return snoise(p);
  }

  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      for (int i = 0; i < 5; ++i) {
          v += a * noise(p);
          p = p * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.15;
    
    vec2 p = uv * 3.0;
    float n = fbm(p + vec2(t * 0.5, t * 0.2));
    
    vec2 q = vec2(fbm(p + vec2(0.0, 0.0) + n), fbm(p + vec2(5.2, 1.3) + n));
    vec2 r = vec2(fbm(p + 4.0*q + vec2(1.7, 9.2) + 0.15*t), fbm(p + 4.0*q + vec2(8.3, 2.8) + 0.126*t));
    
    float f = fbm(p + 4.0*r);
    
    vec3 color1 = vec3(0.02, 0.05, 0.15); // Deep Blue
    vec3 color2 = vec3(0.92, 0.45, 0.05); // Elite Orange
    vec3 color3 = vec3(0.01, 0.02, 0.05); // Deep Shadow
    
    vec3 finalColor = mix(color1, color2, clamp((f*f)*3.0, 0.0, 1.0));
    finalColor = mix(finalColor, color3, clamp(length(q), 0.0, 1.0));
    finalColor += 0.08 * f; // Energy gleam
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

const EnergyFog = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [width, height] = useAspect(window.innerWidth, window.innerHeight)

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }), [])

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial
            material.uniforms.uTime.value = state.clock.getElapsedTime()
        }
    })

    return (
        <mesh ref={meshRef} scale={[width, height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={energyFogVertexShader}
                fragmentShader={energyFogFragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    )
}

// Layer 2: Glow Particles
const GlowParticles = ({ count = 300 }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 60
            const y = (Math.random() - 0.5) * 40
            const z = (Math.random() - 0.5) * 20
            const size = Math.random() * 0.15 + 0.05
            const speed = Math.random() * 0.02 + 0.01
            temp.push({ x, y, z, size, speed, offset: Math.random() * 100 })
        }
        return temp
    }, [count])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()

        particles.forEach((particle, i) => {
            const { x, y, z, size, speed, offset } = particle

            const nx = x + Math.sin(t * speed + offset) * 3
            const ny = y + Math.cos(t * speed * 0.6 + offset) * 3

            dummy.position.set(nx, ny, z)
            dummy.scale.set(size, size, size)
            dummy.updateMatrix()
            meshRef.current?.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    )
}

// Layer 3: Light Ribbons
const LightRibbons = () => {
    const lines = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            points: Array.from({ length: 40 }).map((_, j) => new THREE.Vector3(j - 20, 0, 0)),
            offset: i * 15,
            speed: 0.15 + Math.random() * 0.2,
            color: i % 2 === 0 ? '#f97316' : '#3b82f6'
        }))
    }, [])

    return (
        <group>
            {lines.map((line, i) => (
                <Ribbon key={i} {...line} />
            ))}
        </group>
    )
}

const Ribbon = ({ points, offset, speed, color }: any) => {
    const lineRef = useRef<THREE.Line>(null)

    useFrame((state) => {
        if (!lineRef.current) return
        const t = state.clock.getElapsedTime()

        const newPoints = points.map((p: THREE.Vector3) => {
            const x = p.x
            const y = Math.sin(x * 0.15 + t * speed + offset) * 4
            const z = Math.cos(x * 0.1 + t * speed * 0.8) * 3
            return new THREE.Vector3(x, y, z)
        })

        lineRef.current.geometry.setFromPoints(newPoints)
    })

    return (
        <primitive
            object={useMemo(() => new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
                color,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending
            })), [color])}
            ref={lineRef}
        />
    )
}

const CameraRig = ({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) => {
    const { camera } = useThree()

    useFrame(() => {
        const targetX = mouse.current[0] * 1.5
        const targetY = mouse.current[1] * 1.5

        camera.position.x += (targetX - camera.position.x) * 0.05
        camera.position.y += (targetY - camera.position.y) * 0.05
        camera.lookAt(0, 0, 0)
    })

    return null
}

export const WebGLBackground = () => {
    const mouse = useRef<[number, number]>([0, 0])

    const handleMouseMove = (e: any) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
        const x = (clientX / window.innerWidth) * 2 - 1
        const y = -(clientY / window.innerHeight) * 2 + 1
        mouse.current = [x, y]
    }

    return (
        <div
            className="fixed inset-0 z-0 bg-black overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
        >
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 50 }}>
                <color attach="background" args={['#000000']} />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <EnergyFog />
                    <GlowParticles count={350} />
                    <LightRibbons />
                </Float>

                <CameraRig mouse={mouse} />

                {/* EffectComposer is disabled due to a persistent library TypeError in this environment */}
                {/* 
                <EffectComposer>
                    <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer> 
                */}
            </Canvas>
        </div>
    )
}
