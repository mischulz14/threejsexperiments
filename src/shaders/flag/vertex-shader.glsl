uniform float uWaveSize;
uniform float uWaveAmount;
uniform float uTime;


void main() {
float speed = uTime * 2.0;
vec4 modelPosition = modelMatrix * vec4(position, 1.0);
modelPosition.z += sin(modelPosition.x * uWaveAmount + speed) * uWaveSize;
modelPosition.y += sin(modelPosition.x * uWaveAmount + speed) * uWaveSize;

vec4 viewPosition = viewMatrix * modelPosition;
vec4 projectedPosition = modelPosition * viewPosition;
gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
