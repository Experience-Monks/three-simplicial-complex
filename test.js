require('domready')(run)

var THREE = require('three')
var Complex = require('./')(THREE)
var OrbitViewer = require('three-orbit-viewer')(THREE)
var meshify = require('./line-mesh')

// var curve = require('adaptive-bezier-curve')
// var path = curve([20, 20], [20, 100], [200, 100], [200, 20], 7)
// path = curve([150, 152], [50, 150], [25, 150], [100, 100], 7, path)

var parse = require('parse-svg-path')
var contours = require('svg-path-contours')
var contents = require('./test/infinity.json')
var simplify = require('simplify-path')

var path = simplify(contours(parse(contents), 7)[6], 0.15).slice(1)
path.unshift(path[path.length-2])

function run() {
    var app = OrbitViewer({
        clearColor: 0x000000,
        clearAlpha: 1.0,
        fov: 65,
        position: new THREE.Vector3(1, 1, -2)
    })

    var mesh = meshify(path)
    var geo = Complex(mesh)
    geo.computeFaceNormals()

    var mat = new THREE.MeshLambertMaterial({ 
        wireframe: false, 
        side: THREE.DoubleSide, 
        color: 0xffffff 
    })
    var box = new THREE.Mesh(geo, mat)
    app.scene.add(box)
    
    var light = new THREE.PointLight( 0x3f7aac, 1, 1000 );
    light.position.set( 1, 1, 1 );
    app.scene.add( light );

    var time = 0
    app.on('tick', function(dt) {
        time += dt/1000 

        // box.rotation.y = (Math.sin(time)/2+0.5) * Math.PI
    })
}