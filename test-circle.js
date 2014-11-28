require('domready')(run)

var THREE = require('three')
var Complex = require('./')(THREE)
var OrbitViewer = require('three-orbit-viewer')(THREE)

//get a straight line of N points between [-X ... X] 
var array = require('array-range')


//This is how a typical (incremental) bezier curve might look
var bezier = require('bezier')
var tmpX = [0, 0, 0, 0]
var tmpY = [0, 0, 0, 0]

function createBezier(start, c1, c2, end, steps, points) {
    if (!points)
        points = []
    steps = typeof steps === 'number' ? steps : 16

    tmpX[0] = start[0]
    tmpX[1] = c1[0]
    tmpX[2] = c2[0]
    tmpX[3] = end[0]

    tmpY[0] = start[1]
    tmpY[1] = c1[1]
    tmpY[2] = c2[1]
    tmpY[3] = end[1]
    for (var t = 0; t < steps; t++) {
        var a = t/(steps-1)
        points.push([bezier(tmpX, a), bezier(tmpY, a)])
    }
    return points
}

var adaptiveCurve = require('adaptive-bezier-curve')
var path = createBezier([-1, 0], [-0.5, 0.5], [0.5, 0.5], [1, 0], 12)

function run() {
    var app = OrbitViewer({
        clearColor: 0x000000,
        clearAlpha: 1.0,
        fov: 65,
        position: new THREE.Vector3(1, 1, -2)
    })

    var mesh = { positions: [], cells: [], texcoords: []  }

    path.forEach(function(p) {
        addCircle(mesh, 0.03, p)
    })

    //surround the line with another complex
    var sphere = Complex(mesh)

    var uvs = sphere.faceVertexUvs[0]
    for (var i=0; i<mesh.cells.length; i++) {
        var f = mesh.cells[i]
        var uv0 = mesh.texcoords[f[0]],
            uv1 = mesh.texcoords[f[1]],
            uv2 = mesh.texcoords[f[2]]
        uvs.push([
            new THREE.Vector2().fromArray(uv0),
            new THREE.Vector2().fromArray(uv1),
            new THREE.Vector2().fromArray(uv2)
        ]);
    }

    // var sphereMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ 
    //     wireframe: true,
    //     side: THREE.DoubleSide
    // }))
        
    var mat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        // wireframe: true,
        uniforms: {
            thickness: { type: "f", value: 0.1 }
        },
        vertexShader: [
            "varying vec2 vUv;",

            "void main() {",
                "vUv = uv;",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [   
            "varying vec2 vUv;",
            "void main() {",
                "float dist = length(vUv);",
                "float edge = 0.2;",
                "float smooth = 0.01;",
                "float a = smoothstep(0.5+smooth, 0.5, dist);",
                "float b = smoothstep(0.5+edge+smooth, 0.5+edge, dist);",
                "float alpha = b-a;",
                "if (alpha < 0.01) {",
                "  discard;",
                "}",
                "gl_FragColor = vec4(vec3(1.0), alpha);",
            "}"
        ].join("\n")
    })
    var sphereMesh = new THREE.Mesh(sphere, mat)

    app.scene.add(sphereMesh)
}

function addCircle(mesh, radius, position) {
    var x = position[0], y = position[1]
    //Create a circle
    var points = mesh.positions, 
        cells = mesh.cells,
        texcoords = mesh.texcoords
    var steps = 8
    var start = points.length
    points.push([x, y, 0])
    texcoords.push([0, 0])
    for(var i=0; i<steps; ++i) {
        var theta = i / (steps-2) * Math.PI * 2.0
        var cx = Math.cos(theta),
            cy = Math.sin(theta)
        points.push([x + cx*radius, y + cy*radius, 0])
        texcoords.push([ cx, cy ])
        cells.push([start, start + (i+1)%steps, start + i])
    }

}