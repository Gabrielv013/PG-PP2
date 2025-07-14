import * as THREE from 'three';

const scene = new THREE.Scene();
const clock = new THREE.Clock();
// antialias foi adicionado para suavizar as bordas
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Adicionando luz na cena
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);


// Definição dos parâmetros vertexShader e fragmentShader da classe RawShaderMaterial,
// como encontrado em exemplos.
// Tentativa de aplicar um efeito de pulsação no núcleo
const nucleoVertexShader = `
    attribute vec3 position;
    attribute vec3 normal;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 normalMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(vec3(normalMatrix * vec4(normal, 0.0)));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const nucleoFragmentShader = `
    precision mediump float;

    uniform float uTime;

    varying vec3 vNormal;

    void main() {
        float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        vec3 glowColor = vec3(1.0, 0.5, 0.0) * pow(intensity, 2.0);
        glowColor += vec3(0.8, 0.4, 0.0) * (0.5 + 0.5 * sin(uTime * 4.0)) * 0.2;
        
        gl_FragColor = vec4(glowColor, 1.0);
    }
`;

// Definindo o shader próprio no núcleo com a classe RawShaderMaterial
const nucleoMaterial = new THREE.RawShaderMaterial({
    uniforms: {
        uTime: { value: 0.0 }
    },
    vertexShader: nucleoVertexShader,
    fragmentShader: nucleoFragmentShader,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
});
// SphereGeometry define, respectivamente, raio, numero de segmentos horizontais e verticais do nucleo (esfera)
const nucleoGeometry = new THREE.SphereGeometry(2, 64, 64);
const nucleo = new THREE.Mesh(nucleoGeometry, nucleoMaterial);
// scale.set definindo o tamanho do núcleo
nucleo.scale.set(1.5, 1.5, 1.5);
scene.add(nucleo);

// Câmera cima
const topCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topCamera.position.set(0, 20, 0);
topCamera.lookAt(nucleo.position);
scene.add(topCamera);

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    nucleoMaterial.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, topCamera);
}

animate();