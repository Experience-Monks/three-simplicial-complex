# three-simplicial-complex

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Creates a THREE.Geometry from a 3D simplicial complex. 

```js
var mesh = {
    positions: [ [25,25,25], [15,15,25], [50,50,25], [15,15,15], ... ],
    cells: [ [0,1,2], [1,3,2], ...]
}
```

This is useful for inter-op with modules like [icosphere](https://www.npmjs.org/package/icosphere), [bunny](https://www.npmjs.org/package/bunny), [stanford-dragon](https://www.npmjs.org/package/stanford-dragon), [mesh-combine](https://www.npmjs.org/package/mesh-combine), [extrude-polyline](https://www.npmjs.org/package/extrude-polyline), [teapot](https://www.npmjs.org/package/teapot), [triangulate-contours](https://www.npmjs.org/package/triangulate-contours), etc.

## Usage

[![NPM](https://nodei.co/npm/three-simplicial-complex.png)](https://nodei.co/npm/three-simplicial-complex/)

#### `geo = Complex([mesh])`

Creates a new THREE.Geometry with the given complex (optional), where `mesh` contains `{ positions, cells }`.

#### `geo.update(mesh)`

Updates the THREE.Geometry with the new simplicial complex.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/three-simplicial-complex/blob/master/LICENSE.md) for details.