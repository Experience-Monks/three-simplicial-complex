var Stroke = require('extrude-polyline')
var normalize = require('normalize-path-scale')

// var path = [
//     [20, 20],
//     [50, 50],
//     [100, 100],
//     [25, 75],
//     [62, 12],
//     [52, 112], 
//     [121, 12]
// ]

var bounds = null

module.exports = function(path) {
    var mesh2d = Stroke({ thickness: 15, join: 'miter' }).build(path)

    //normalize
    mesh2d.positions = normalize(mesh2d.positions)
    mesh2d.positions = mesh2d.positions.map(function(p) {
        return [p[0], p[1], p[2]||0]
    })

    return mesh2d
}