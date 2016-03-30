/*
  This is an example of 2D rendering, simply
  using bitmap fonts in orthographic space.

  var geom = createText({
    multipage: true,
    ... other options
  })
 */

global.THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)
var createOrbitViewer = require('three-orbit-viewer')(THREE)
var createText = require('../')(THREE)
var loremIpsum = require('lorem-ipsum')
var glslify = require('glslify')
var SDFShader = require('../shaders/sdf')

require('./load')({
  font: 'fnt/Lato-Regular-64.fnt',
  image: 'fnt/lato.png'
}, start)

function start (font, texture) {
  var app = createOrbitViewer({
    clearColor: 'rgb(80, 80, 80)',
    clearAlpha: 1.0,
    fov: 65,
    position: new THREE.Vector3()
  })

  app.camera = new THREE.OrthographicCamera()
  app.camera.left = -1
  app.camera.right = 1
  app.camera.top = 1
  app.camera.bottom = -1
  app.camera.near = 1
  app.camera.far = 10000

  app.camera.position.set(0, 0, 1);

  controls = new OrbitControls(app.camera, app.renderer.domElement)
  controls.enableRotate = false
  controls.mouseButtons = { PAN: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, ORBIT: THREE.MOUSE.RIGHT } // swapping left and right buttons

  output = loremIpsum({
      count: 20                      // Number of words, sentences, or paragraphs to generate.
    , units: 'paragraphs'            // Generate words, sentences, or paragraphs.
    , sentenceLowerBound: 5         // Minimum words per sentence.
    , sentenceUpperBound: 15        // Maximum words per sentence.
    , paragraphLowerBound: 40       // Minimum sentences per paragraph.
    , paragraphUpperBound: 50       // Maximum sentences per paragraph.
    , format: 'plain'               // Plain text or html
    , random: Math.random           // A PRNG function. Uses Math.random by default
  });
  var geom = createText({
    text: "hey",
    font: font,
    align: 'left',
  })
  geom.center();

  texture.needsUpdate = true
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true

  var materialBasic = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  })

  var materialShader = new THREE.RawShaderMaterial(SDFShader({
    map: texture,
    transparent: true,
    color: 'rgb(230, 230, 230)'
  }))

  var layout = geom.layout

  var mesh = new THREE.Mesh(geom, materialBasic)
  mesh.position.set(layout.width, layout.height, 0)
  app.scene.add(mesh)


  // update orthographic
  app.on('tick', function () {
    // update camera
    var width = app.engine.width
    var height = app.engine.height
    app.camera.right = width
    app.camera.bottom = height
    app.camera.updateProjectionMatrix()
  })
}
