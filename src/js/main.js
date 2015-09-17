(function() {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var header = document.querySelector('.header');
  var headerCanvas = document.querySelector('.header-canvas');

  var scene, camera, renderer, light, composer, effect;
  var circle, cube, cubeSleeve;


  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
    camera.position.z = 250;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({ canvas: headerCanvas });
    renderer.setSize(windowWidth, windowHeight);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);

    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, -1, 1);

    scene.add(light);

    circle = new THREE.Object3D();

    cube = [];
    cubeSleeve = [];

    for (var i = 0; i < 15; i++) {
      cube[i] = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshPhongMaterial());
      cube[i].position.y = 100;
      cube[i].rotation.x = randomIntFromInterval(0, 180);
      cube[i].rotation.y = randomIntFromInterval(0, 180);

      //Position each cube in a circle formation. (http://inmosystems.com/demos/surrogateRings/source)
      cubeSleeve[i] = new THREE.Object3D();
      cubeSleeve[i].add(cube[i]);
      cubeSleeve[i].rotation.z = i * (360 / 15) * Math.PI / 180;

      circle.add(cubeSleeve[i]);
    }

    scene.add(circle);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 5;
    composer.addPass(effect);

    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.005;
    effect.renderToScreen = true;
    composer.addPass(effect);

    renderer.render(scene, camera);
  }

  init();



  function render() {
    requestAnimationFrame(render);

    for (var i = 0; i < 15; i++) {
      cube[i].rotation.y += 0.01;
      cube[i].rotation.x += 0.01;
    }

    circle.rotation.z += 0.01;

    renderer.render(scene, camera);

    composer.render();
  }

  render();


  window.addEventListener('resize', function () {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
  });
})();
