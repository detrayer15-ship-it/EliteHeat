export const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    // Proactive Fix: Use a safer normalization
    vec3 transformedNormal = normalize(normalMatrix * normal);
    vNormal = transformedNormal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    // dot product can be slightly > 1.0 or < -1.0 due to precision
    float alignment = dot(vNormal, vec3(0.0, 0.0, 1.0));
    
    // Proactive Fix: Clamp input for pow() to avoid undefined behavior or division by zero in derivatives
    float intensity = pow(max(0.0, 0.65 - alignment), 8.0);
    
    // Light blue-white color for a premium feel
    vec3 atmosphereColor = vec3(0.7, 0.85, 1.0);
    
    gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
  }
`;
