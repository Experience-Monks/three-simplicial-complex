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

    Complex.prototype.update = function(mesh) {
        for (var i=0; i<mesh.positions.length; i++) {
            var pos = mesh.positions[i]
            if (i > this.vertices.length-1)
                this.vertices.push(new THREE.Vector3().fromArray(pos))
            else 
                this.vertices[i].fromArray(pos)
        }

        for (i=0; i<mesh.cells.length; i++) {
            var face = mesh.cells[i]
            if (i > this.faces.length-1)
                this.faces.push(new THREE.Face3(face[0], face[1], face[2]))
            else {
                var tf = this.faces[i]
                tf.a = face[0]
                tf.b = face[1]
                tf.c = face[2]
            }
        }

        this.vertices.length = mesh.positions.length
        this.faces.length = mesh.cells.length
        this.elementsNeedUpdate = true
        this.verticesNeedUpdate = true
    }

    return Complex
}