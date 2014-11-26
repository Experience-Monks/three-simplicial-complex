require('domready')(run)

var THREE = require('three')
var Complex = require('./')(THREE)
var OrbitViewer = require('three-orbit-viewer')(THREE)

//generating 
var icosphere = require('icosphere')(0)

//to build our thick bezier curve 
var stroke = require('extrude-polyline')({ 
    thickness: 0.15, 
    join: 'bevel'
})

//get a straight line of N points between [-X ... X] 
var array = require('array-range')
var path = array(100).map(function(e, i, list) {
    var a = (i/(list.length-1))*2-1
    return [a * 1.5, 0]
})

function run() {
    var app = OrbitViewer({
        clearColor: 0x000000,
        clearAlpha: 1.0,
        fov: 65,
        position: new THREE.Vector3(1, 1, -2)
    })

    var lineMesh = meshify(path)
    var lineGeo = Complex(lineMesh)

    //extrude-polyline doesn't use consistent face winding,
    //so we need to specify DoubleSide !
    var mat = new THREE.MeshBasicMaterial({ 
        side: THREE.DoubleSide
    })

    //make a mesh our of the geometry
    var line = new THREE.Mesh(lineGeo, mat)
    line.scale.multiplyScalar(0.4)
    app.scene.add(line)

    //surround the line with another complex
    var sphere = Complex(icosphere)
    var sphereMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ 
        wireframe: true, 
        transparent: true,
        opacity: 0.25
    }))
    app.scene.add(sphereMesh)

    var time = 0
    app.on('tick', function(dt) {
        time += dt/1000

        var angle = Math.sin(time)*2.5

        //modify our original 2D path
        path.forEach(function(p, i, list) {
            var a = i/(list.length)*2-1
            p[1] = Math.sin(angle*a*5)
        })

        //get a new 3D complex and update our buffers
        lineGeo.update(meshify(path))
    })
}

//turns a 2D path into an indexed 3D mesh
function meshify(path) {
    var mesh2d = stroke.build(path)
    mesh2d.positions = mesh2d.positions.map(function(p) {
        return [p[0], p[1], p[2]||0]
    })
    return mesh2d
}