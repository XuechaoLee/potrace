;(function(exports) {

  /*
   * Iterate through the canvas image vertex (NW point)
   * Check each one if it is an edge based on the condition that all four neighbors are not equal in value
   */

  //this object will be responsible for finding all vertices given a canvas image
  function VertexFinder (imgData) {
    if (typeof imgData == 'undefined') {
      throw new Error('No image data passed!');
    }
    this.imgData = imgData;
    this.allVertices = [];
    this.vLength = 0;
  }

  VertexFinder.prototype.addVertex = function (coords) {
    var index = coords.y * this.imgData.width + coords.x;
    if (typeof (this.allVertices[index] = new Vertex(coords.x, coords.y)) === 'object') {
      this.vLength++;
      return true;
    }
    return false;
  };

  VertexFinder.prototype.findAllVertices = function () {
    var vertex;
		for (var y = 0, maxH = this.imgData.height; y < maxH; y++) {
			for (var x = 0, maxW = this.imgData.width; x < maxW; x++) {
        vertex = new Vertex(x, y);
        if (vertex.checkIfEdge(this.imgData) === true) {
          this.addVertex({x: x, y: y});
        }
			}
		}
  };

  VertexFinder.prototype.getAllVertices = function () {
    return this.allVertices;
  };

  VertexFinder.prototype.getLength = function () {
    return this.vLength;
  };

  //this object will be handling individual vertex particularly determining if a vertex is an edge or not
  function Vertex(x, y) {
    if (typeof x == 'undefined' || typeof y == 'undefined') {
      throw new Error('No x and y passed!');
    }
    this.x = x;
    this.y = y;
  }

  Vertex.prototype.getNeighborPixels = function (width, height) {
    var neighbors = {};
    var checkedIfBorder = this.checkIfBorder(width, height);

    neighbors.nw = checkedIfBorder.top || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y - 1};
    neighbors.ne = checkedIfBorder.top || checkedIfBorder.right ? null : {x: this.x, y: this.y - 1};
    neighbors.sw = checkedIfBorder.bottom || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
    neighbors.se = checkedIfBorder.bottom || checkedIfBorder.right ? null : {x: this.x, y: this.y};
    return neighbors;
  };

  Vertex.prototype.getNeighborVertices = function (width, height) {
    var neighbors = {};
    var checkedIfBorder = this.checkIfBorder(width, height);

    neighbors.n = checkedIfBorder.top ? null : {x: this.x, y: this.y - 1};
    neighbors.s = checkedIfBorder.bottom ? null : {x: this.x, y: this.y + 1};
    neighbors.e = checkedIfBorder.right ? null : {x: this.x + 1, y: this.y};
    neighbors.w = checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
    return neighbors;
  };

  Vertex.prototype.checkIfBorder = function (width, height) {
    var borders = {};
    borders.top = this.y === 0 ? true : false;
    borders.bottom = this.y === height ? true : false;
    borders.left = this.x === 0 ? true : false;
    borders.right = this.x === width ? true : false;
    return borders;
  };

  Vertex.prototype.checkIfEdge = function (imgData) {
    var neighbors = this.getNeighborPixels(imgData.width, imgData.height),
        currPixel, otherPixel;

    //the horror D:
    for (currPixel in neighbors) {
      if (neighbors.hasOwnProperty(currPixel) && neighbors[currPixel] !== null) {
        for (otherPixel in neighbors) {
          if (neighbors.hasOwnProperty(otherPixel) && neighbors[otherPixel] !== null) {
            if (imgData.data[coordsToIndex(neighbors[currPixel], imgData.width)] !== imgData.data[coordsToIndex(neighbors[otherPixel], imgData.width)]) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };
  
  function coordsToIndex (coords, width) {
    return (coords.x * 4) + (coords.y * width * 4);  
  }

  exports.VertexFinder = VertexFinder;
  exports.Vertex = Vertex;

}(this));
