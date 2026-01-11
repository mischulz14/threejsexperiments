uniform float uWaveSize;
uniform float uWaveAmount;
uniform float uTime;


void main() {
vec4 modelPosition = modelMatrix * vec4(position, 1.0);
modelPosition.z += sin(modelPosition.x * uWaveAmount + uTime) * uWaveSize;

vec4 viewPosition = viewMatrix * modelPosition;
vec4 projectedPosition = modelPosition * viewPosition;
gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
