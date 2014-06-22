var assert = require("assert"),
    StraightLine = require("../js/straight").StraightLine;
    PathFinder = require('../js/path').PathFinder;

var objTests = {},
    vertices1 = [],
    vertices2 = [],
    vertices3 = [],
    Vertex,
    straightPath1 = {},
    nonStraightPath1 = {},
    nonStraightPath2 = {},
    pair1 = [
      {
        x: 1,
        y: 1
      },
      {
        x: 0,
        y: 1
      }
    ],
    pair2 = [
      {
        x: 1,
        y: 1
      },
      {
        x: 2,
        y: 1
      }
    ],
    pair3 = [
      {
        x: 1,
        y: 1
      },
      {
        x: 1,
        y: 0
      }
    ],
    pair4 = [
      {
        x: 1,
        y: 1
      },
      {
        x: 1,
        y: 2
      }
    ];

Vertex = function (coords) {
  this.x = coords.x;
  this.y = coords.y;
};

Vertex.prototype = {
  getNeighborPixels : function (width, height) {
    var neighbors = {};
    var checkedIfBorder = this.checkIfBorder(width, height);

    neighbors.nw = checkedIfBorder.top || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y - 1};
    neighbors.ne = checkedIfBorder.top || checkedIfBorder.right ? null : {x: this.x, y: this.y - 1};
    neighbors.sw = checkedIfBorder.bottom || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
    neighbors.se = checkedIfBorder.bottom || checkedIfBorder.right ? null : {x: this.x, y: this.y};
    return neighbors;
  },

  checkIfBorder : function (width, height) {
    var borders = {};
    borders.top = this.y === 0 ? true : false;
    borders.bottom = this.y === height ? true : false;
    borders.left = this.x === 0 ? true : false;
    borders.right = this.x === width ? true : false;
    return borders;
  },

  getNeighborVertices : function (width, height) {
      var neighbors = {};
      var checkedIfBorder = this.checkIfBorder(width, height);

      neighbors.n = checkedIfBorder.top ? null : {x: this.x, y: this.y - 1};
      neighbors.s = checkedIfBorder.bottom ? null : {x: this.x, y: this.y + 1};
      neighbors.e = checkedIfBorder.right ? null : {x: this.x + 1, y: this.y};
      neighbors.w = checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
      return neighbors;
    }
};

describe("Straight Line", function() {
  setup(function () {
    allPaths1 = [
      {
        x: 0,
        y: 3
      },
      {
        x: 1,
        y: 3
      },
      {
        x: 2,
        y: 3
      },
      {
        x: 2,
        y: 2
      },
      {
        x: 3,
        y: 2
      },
      {
        x: 4,
        y: 2
      },
      {
        x: 5,
        y: 2
      },
      {
        x: 5,
        y: 1
      },
      {
        x: 6,
        y: 1
      },
      {
        x: 7,
        y: 1
      },
      {
        x: 8,
        y: 1
      },
      {
        x: 9,
        y: 1
      },
      {
        x: 9,
        y: 0
      }
    ];

    allPaths2 = [
      {
        x: 0,
        y: 2
      },
      {
        x: 1,
        y: 2
      },
      {
        x: 2,
        y: 2
      },
      {
        x: 2,
        y: 1
      },
      {
        x: 3,
        y: 1
      },
      {
        x: 4,
        y: 1
      },
      {
        x: 5,
        y: 1
      },
      {
        x: 5,
        y: 0
      },
      {
        x: 6,
        y: 0
      },
      {
        x: 7,
        y: 0
      },
      {
        x: 8,
        y: 0
      },
      {
        x: 9,
        y: 0
      },
      {
        x: 9,
        y: 1
      },
    ];

    allPaths3 = [
      {
        x: 0,
        y: 1
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      },
      {
        x: 3,
        y: 0
      },
      {
        x: 3,
        y: 1
      },
      {
        x: 2,
        y: 1
      },
    ];
  });

  it("returns false if all four directions occur in path", function() {
    assert.equal(StraightLine.isStraight(allPaths3), false);
  });

  it("returns false if a vertex of the path is too far from the line", function() {
    assert.equal(StraightLine.isStraight(allPaths2), false);
  });

  it("returns true if path is straight in that it does not have all four directions and all vertices lie .5 pixels away from the straight line", function() {
    assert.equal(StraightLine.isStraight(allPaths1), true);
  });

  it("returns true if path contains all four directions", function() {
    allDirectionsPath = [
      {
        x: 0,
        y: 1
      },
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      },
      {
        x: 2,
        y: 1
      },
      {
        x: 1,
        y: 1
      },
    ];
    assert.equal(StraightLine.containsAllDirections(allDirectionsPath), true);
  });

  it("returns false if path does not contain all four directions", function() {
    someDirectionsPath = [
      {
        x: 0,
        y: 0
      },
      {
        x: 1,
        y: 0
      },
      {
        x: 2,
        y: 0
      },
      {
        x: 2,
        y: 1
      },
    ];
    assert.equal(StraightLine.containsAllDirections(someDirectionsPath), false);
  });

  it("returns one of four directions possible given two coordinates", function() {
    assert.equal(StraightLine.getDirection(pair1[0], pair1[1]), 'west');
    assert.equal(StraightLine.getDirection(pair2[0], pair2[1]), 'east');
    assert.equal(StraightLine.getDirection(pair3[0], pair3[1]), 'north');
    assert.equal(StraightLine.getDirection(pair4[0], pair4[1]), 'south');
  });
});
