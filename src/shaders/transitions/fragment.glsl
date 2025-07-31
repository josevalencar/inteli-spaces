uniform sampler2D textureA;
uniform sampler2D textureB;
uniform float progress;

varying vec2 vUv;

void main() {
    vec4 colorA = texture2D(textureA, vUv);
    vec4 colorB = texture2D(textureB, vUv);
    gl_FragColor = mix(colorA, colorB, progress);
}