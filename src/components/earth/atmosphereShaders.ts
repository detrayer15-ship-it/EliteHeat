export const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    // Advanced atmospheric scattering imitation
    // Dot product gives us alignment with view vector
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 8.0);
    
    // Light blue-white color for a premium feel
    vec3 atmosphereColor = vec3(0.7, 0.85, 1.0);
    
    gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
  }
`;
