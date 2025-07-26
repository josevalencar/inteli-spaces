uniform float uOpacity;
varying float vDistance;

void main() {
  vec3 color = vec3(1.0, 1.0, 0.8);
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 3.0);

  color = mix(color, vec3(1.0, 1.0, 0.8), vDistance * 0.5);
  color = mix(vec3(0.0), color, strength);
  
  // Apply opacity for fade effects
  float finalAlpha = strength * uOpacity;
  gl_FragColor = vec4(color, finalAlpha);
}