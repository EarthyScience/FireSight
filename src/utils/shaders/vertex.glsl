// by Jeran Poehls
uniform vec3 cameraPos;
out vec3 vOrigin;
out vec3 vDirection;
out vec2 vUv;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vOrigin = (inverse(modelMatrix) * vec4(cameraPos, 1.0)).xyz;
    vDirection = position - vOrigin;
    vUv = uv;
    gl_Position = projectionMatrix * mvPosition;
}