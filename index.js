var inherits = require('inherits')

module.exports = function(THREE) {

    function Complex(mesh) {
        if (!(this instanceof Complex))
            return new Complex(mesh)
        THREE.Geometry.call(this)
        this.dynamic = true

        if (mesh)
            this.update(mesh)
    }

    inherits(Complex, THREE.Geometry)

    //may expose these in next version
    Complex.prototype._updatePositions = function(positions) {
        for (var i=0; i<positions.length; i++) {
            var pos = positions[i]
            if (i > this.vertices.length-1)
                this.vertices.push(new THREE.Vector3().fromArray(pos))
            else 
                this.vertices[i].fromArray(pos)
        }
        this.vertices.length = positions.length
        this.verticesNeedUpdate = true
    }

    Complex.prototype._updateCells = function(cells) {
        for (var i=0; i<cells.length; i++) {
            var face = cells[i]
            if (i > this.faces.length-1)
                this.faces.push(new THREE.Face3(face[0], face[1], face[2]))
            else {
                var tf = this.faces[i]
                tf.a = face[0]
                tf.b = face[1]
                tf.c = face[2]
            }
        }

        this.faces.length = cells.length
        this.elementsNeedUpdate = true
    }

    Complex.prototype.update = function(mesh) {
        this._updatePositions(mesh.positions)
        this._updateCells(mesh.cells)
    }

    return Complex
}