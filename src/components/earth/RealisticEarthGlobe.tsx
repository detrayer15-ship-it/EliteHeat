import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture, Float, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { atmosphereVertexShader, atmosphereFragmentShader } from './atmosphereShaders'

// Random "Knowledge Points" across the globe
const KNOWLEDGE_POINTS = [
    { lat: 43.65, lon: 51.2, label: 'Growth' },
    { lat: 43.25, lon: 76.95, label: 'Skill' },
    { lat: 51.17, lon: 71.47, label: 'Future' },
    { lat: 40.71, lon: -74.00, label: 'Knowledge' },
    { lat: 48.85, lon: 2.35, label: 'Success' },
    { lat: 35.67, lon: 139.65, label: 'Digital' }
]

const PulsatingPoint = ({ position }: { position: THREE.Vector3 }) => {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3
            meshRef.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.008, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" />
            </mesh>
            <mesh scale={[2.5, 2.5, 2.5]}>
                <sphereGeometry args={[0.01, 16, 16]} />
                <meshBasicMaterial color="#3b82f6" transparent opacity={0.15} />
            </mesh>
        </group>
    )
}

const NetworkLayer = () => {
    const lineRef = useRef<THREE.LineSegments>(null)

    const lines = useMemo(() => {
        const points = KNOWLEDGE_POINTS.map(p => {
            const radius = 1.01
            const phi = (90 - p.lat) * (Math.PI / 180)
            const theta = (p.lon + 180) * (Math.PI / 180)
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            )
        })

        const linePoints: THREE.Vector3[] = []
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (Math.random() > 0.4) {
                    linePoints.push(points[i], points[j])
                }
            }
        }
        return linePoints
    }, [])

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry().setFromPoints(lines)
        return geo
    }, [lines])

    return (
        <lineSegments ref={lineRef} geometry={geometry}>
            <lineBasicMaterial color="#3b82f6" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
        </lineSegments>
    )
}

const Earth = ({ isHovered }: { isHovered: boolean }) => {
    const earthRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)
    const { pointer } = useThree()

    const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    ])

    const pointPositions = useMemo(() => {
        return KNOWLEDGE_POINTS.map(p => {
            const radius = 1.005
            const phi = (90 - p.lat) * (Math.PI / 180)
            const theta = (p.lon + 180) * (Math.PI / 180)
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            )
        })
    }, [])

    useFrame((state, delta) => {
        const rotationSpeed = isHovered ? 0.03 : 0.06
        if (earthRef.current) earthRef.current.rotation.y += delta * rotationSpeed
        if (cloudsRef.current) cloudsRef.current.rotation.y += delta * (rotationSpeed * 1.2)

        // Mouse Parallax & Dynamic Sway
        if (groupRef.current) {
            const targetX = pointer.x * 0.15
            const targetY = -pointer.y * 0.15
            groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05
            groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
        }
    })

    return (
        <group ref={groupRef}>
            {/* Subtle Atmosphere (Thin Realistic Glow) */}
            <mesh scale={[1.04, 1.04, 1.04]}>
                <sphereGeometry args={[1, 64, 64]} />
                <shaderMaterial
                    vertexShader={atmosphereVertexShader}
                    fragmentShader={atmosphereFragmentShader}
                    blending={THREE.AdditiveBlending}
                    side={THREE.BackSide}
                    transparent
                />
            </mesh>

            <Sphere ref={earthRef} args={[1, 64, 64]}>
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={new THREE.Vector2(0.6, 0.6)}
                    roughnessMap={specularMap}
                    roughness={0.7}
                    metalness={0.02}
                />
                {pointPositions.map((pos, i) => <PulsatingPoint key={i} position={pos} />)}
                <NetworkLayer />
            </Sphere>

            <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial map={cloudsMap} transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>

            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 2, 5]} intensity={1.5} color="#ffffff" />
            <pointLight position={[-5, -2, -5]} intensity={0.4} color="#60a5fa" />
        </group>
    )
}

export const RealisticEarthGlobe = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="relative w-[210px] h-[210px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] transition-all duration-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Canvas shadows gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}>
                <PerspectiveCamera makeDefault position={[0, 0, 2.5]} />
                <Earth isHovered={isHovered} />
                <Environment preset="city" />
            </Canvas>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-400/5 blur-[80px] rounded-full -z-10"></div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-blue-400/10 blur-[30px] rounded-full -z-20"></div>
        </div>
    )
}
