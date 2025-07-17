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

// raio e numero de segmentos do elétron
const eletronGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Primeiro elétron
// orbit é a órbita invisível (objeto vazio), o 'eixo' onde o elétron 
// e sua trajetória (visível) são definidos
const orbit1 = new THREE.Object3D();
scene.add(orbit1);
const eletronMaterial1 = new THREE.MeshStandardMaterial({color: 0x0000ff, metalness: 0.5, roughness: 0.1});
const eletron1 = new THREE.Mesh(eletronGeometry, eletronMaterial1);
eletron1.scale.set(1.0, 1.0, 1.0);
orbit1.add(eletron1);

// Órbita do elétron 1
const caminhoMaterial1 = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
const caminhoGeometry1 = new THREE.TorusGeometry(8, 0.01, 16, 100);
const caminho1 = new THREE.Mesh(caminhoGeometry1, caminhoMaterial1);
orbit1.add(caminho1);

// Segundo elétron
const orbit2 = new THREE.Object3D();
scene.add(orbit2);
const textureLoader = new THREE.TextureLoader();
const eletronTexture = textureLoader.load('./eletron.jpg');
const eletronMaterial2 = new THREE.MeshStandardMaterial({map: eletronTexture, metalness: 0.2, roughness: 0.8});
const eletron2 = new THREE.Mesh(eletronGeometry, eletronMaterial2);
eletron2.scale.set(1.2, 1.2, 1.2);
orbit2.add(eletron2);

// Órbita do elétron 2
const caminhoMaterial2 = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
const caminhoGeometry2 = new THREE.TorusGeometry(12, 0.01, 16, 100);
const caminho2 = new THREE.Mesh(caminhoGeometry2, caminhoMaterial2);
// mudando orientação do caminho
caminho2.rotation.x = Math.PI / 2;
orbit2.add(caminho2);

// Terceiro elétron
const orbit3 = new THREE.Object3D();
scene.add(orbit3);
const eletronMaterial3 = new THREE.MeshStandardMaterial({color: 0x00ff00, metalness: 0.5, roughness: 0.1});
const eletron3 = new THREE.Mesh(eletronGeometry, eletronMaterial3);
eletron3.scale.set(1.0, 1.0, 1.0);
orbit3.add(eletron3);

// Órbita do elétron 3
const caminhoMaterial3 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const caminhoGeometry3 = new THREE.TorusGeometry(4, 0.01, 16, 100);
const caminho3 = new THREE.Mesh(caminhoGeometry3, caminhoMaterial3);
caminho3.rotation.x = Math.PI / 2;
orbit3.add(caminho3);

// Câmera cima
const topCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topCamera.position.set(0, 20, 0);
topCamera.lookAt(nucleo.position);
scene.add(topCamera);

// Câmera diagonal
const diagCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
diagCamera.position.set(12, 12, 12); // Posição estática
diagCamera.lookAt(nucleo.position); // Apontando para o núcleo
scene.add(diagCamera);

let cameraAtual = topCamera;

// Troca de câmera com o teclado
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 't' || event.key === 'Tab') {
        event.preventDefault();
        if (cameraAtual === diagCamera) {
            cameraAtual = topCamera
        } else {
            cameraAtual = diagCamera
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    nucleoMaterial.uniforms.uTime.value = elapsedTime;

    // Elétron 1 na vertical, se move nos eixos X e Y
    const orbitRadius1 = 8;
    const speed1 = 2.0;
    eletron1.position.x = Math.cos(elapsedTime * speed1) * orbitRadius1;
    eletron1.position.y = Math.sin(elapsedTime * speed1) * orbitRadius1;

    // Elétron 2 na horizontal, se move nos eixos X e Z
    const orbitRadius2 = 12;
    const speed2 = 1.4;
    eletron2.position.x = Math.cos(elapsedTime * speed2) * orbitRadius2;
    eletron2.position.z = Math.sin(elapsedTime * speed2) * orbitRadius2;

    // Elétron 3 na horizontal
    const orbitRadius3 = 4;
    const speed3 = 2.6;
    eletron3.position.x = Math.cos(elapsedTime * speed3) * orbitRadius3;
    eletron3.position.z = Math.sin(elapsedTime * speed3) * orbitRadius3;

    renderer.render(scene, cameraAtual);
}

animate();