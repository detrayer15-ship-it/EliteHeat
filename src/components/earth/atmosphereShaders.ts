export const atmosphereVertexShader = `
  precision mediump float;
  varying vec3 vNormal;
  void main() {
    // Proactive Fix: Add a tiny epsilon before normalization to prevent division by zero
    vec3 transformedNormal = normalMatrix * normal;
    float len = length(transformedNormal);
    vNormal = (len > 0.0001) ? normalize(transformedNormal) : vec3(0.0, 1.0, 0.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  precision mediump float;
  varying vec3 vNormal;
  void main() {
    // Proactive Fix: Use a safe vector for dot product calculation
    vec3 viewVector = vec3(0.0, 0.0, 1.0);
    
    // Proactive Fix: Clamp alignment and handle potential precision edge cases
    float alignment = clamp(dot(vNormal, viewVector), -0.999, 0.999);
    
    // Proactive Fix: Intensity calculation with safe bounds
    // The pow() function can be tricky with base near zero and high exponents
    float rawIntensity = 0.65 - alignment;
    float intensity = pow(clamp(rawIntensity, 0.001, 1.0), 8.0);
    
    vec3 atmosphereColor = vec3(0.7, 0.85, 1.0);
    
    // Final color with alpha transparency
    gl_FragColor = vec4(atmosphereColor, intensity);
  }
`;
