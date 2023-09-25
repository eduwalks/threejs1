import * as THREE from 'three';
// import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

let camera, scene, renderer, stats;

const clock = new THREE.Clock();

let mixer1;
let mixer2;

init();
animate();

function init() {
    const container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 500 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 2 );
    hemiLight.position.set( 0, 200, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
    dirLight.position.set( 100, 100, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;

    scene.add( dirLight );

    // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // background-image
    // var texture = new THREE.TextureLoader().load(
    //     "https://images.pexels.com/photos/110854/pexels-photo-110854.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    //   );
    //  scene.background = texture;

    // const bgloader = new THREE.TextureLoader();
    // const texture = bgloader.load(
    //   'images/shot-panoramic-composition-bedroom.jpg',
    //   () => {
    //     const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    //     rt.fromEquirectangularTexture(renderer, texture);
    //     scene.background = rt.texture;
    // });

    // model
    const loader = new FBXLoader();
    loader.load( 'https://lms.aimind.co.kr/upload/3case_component.fbx', function ( object ) {

        mixer2 = new THREE.AnimationMixer( object );

        const action = mixer2.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.material.opacity = 1;
                child.material.transparent = true;
            }
        } );

        // object.position.set(0, 90, 90);
        object.rotation.x = -89.5;
        object.rotation.y = 0;
        object.rotation.z = 0;
        // object.rotation.z = -190.5; // 4case
        object.scale.set(2, 2, 2);

        scene.add( object );
    } );

    //
    // https://lms.aimind.co.kr/upload/4case_body.fbx
    // https://lms.aimind.co.kr/upload/4case_component.fbx
    // https://lms.aimind.co.kr/upload/4case_opacity.fbx

    loader.load( 'https://lms.aimind.co.kr/upload/3case_opacity.fbx', function ( object ) {

        mixer1 = new THREE.AnimationMixer( object );

        const action = mixer1.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.opacity = .06;
                child.material.transparent = true;
            }

        } );

        DDDINK.addURL(object, "https://www.npmjs.com/package/3dink");
        DDDINK.domEvent.setGlobalLinkConfig( '_self', 'ON', 'ON', '0x000000');
        DDDINK.domEvent.isShineOnMouseCanvas = 'OFF'
        DDDINK.readRendererObj( renderer, scene, camera );
        DDDINK.domEvent.addFnc();

        // object.position.set(-490.139, -57.571, 90);
        object.rotation.x = -89.5;
        object.rotation.y = 0;
        object.rotation.z = 0;
        // object.rotation.z = -190.5; // 4case
        object.scale.set(2, 2, 2);

        // case2
        // object.rotation.z = 180;

        scene.add( object );

        // 특정 오브젝트 색상변경
        // const targetObjectName = 'H5T(모델링_완료_000645';

        // scene.traverse((object) => {
        //     if (object.isMesh && object.name === targetObjectName) {
        //       const newMaterial = new THREE.MeshBasicMaterial({ color: 0xff0010 }); // Replace with your desired color
        //       object.material = newMaterial;
        //     }
        // });

        // // 그룹오브젝트 색상변경
        // // Define the name of the parent you want to change the color for
        // const parentNameToChangeColor = 'H5T(모델링_완료_000539';

        // // Define the color you want to change to
        // const newColor = 0xff0000; // Red color

        // // Traverse the model's hierarchy to find the parent with the specified name
        // let parentObject = null;
        // object.traverse((child) => {
        //     if (child.name === parentNameToChangeColor) {
        //     parentObject = child;
        //     }
        // });

        // // Check if the parent object was found
        // if (parentObject) {
        //     // Change the color of the parent object
        //     const newMaterial = new THREE.MeshBasicMaterial({ color: newColor });
        //     parentObject.material = newMaterial;

        //     // If you want to change the color of the children as well, you can traverse them
        //     parentObject.traverse((child) => {
        //     if (child instanceof THREE.Mesh) {
        //         child.material = newMaterial;
        //         child.material.opacity = .5;
        //         child.material.transparent = true;
        //     }
        //     });
        // }
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 100, 0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

    // stats
    // stats = new Stats();
    // container.appendChild( stats.dom );

}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//

function animate() {

    requestAnimationFrame( animate );
    const delta = clock.getDelta();

    if ( mixer1 ) mixer1.update( delta );
    if ( mixer2 ) mixer2.update( delta );

    renderer.render( scene, camera );
    stats.update();

}