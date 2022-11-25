export default `
precision mediump float;

varying vec2 vUv;
varying float vWave;
uniform sampler2D uTexture;
uniform float uProg;

void main() {
  float wave = vWave * 0.2;
  // Split each texture color vector
  float r = texture2D(uTexture, vUv).r;
  float g = texture2D(uTexture, vUv  + wave * uProg).g;
  float b = texture2D(uTexture, vUv).b;
  // Put them back together
  vec3 texture = vec3(r, g, b);
  gl_FragColor = vec4(texture, 1.);
}
`;