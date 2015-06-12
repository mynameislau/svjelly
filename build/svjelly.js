(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.svjelly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Lau/www/svjelly/libs/poly2tri/dist/poly2tri.js":[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.poly2tri=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={"version": "1.3.5"}
},{}],2:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

/* jshint maxcomplexity:11 */

"use strict";


/*
 * Note
 * ====
 * the structure of this JavaScript version of poly2tri intentionally follows
 * as closely as possible the structure of the reference C++ version, to make it 
 * easier to keep the 2 versions in sync.
 */


// -------------------------------------------------------------------------Node

/**
 * Advancing front node
 * @constructor
 * @private
 * @struct
 * @param {!XY} p - Point
 * @param {Triangle=} t triangle (optional)
 */
var Node = function(p, t) {
    /** @type {XY} */
    this.point = p;

    /** @type {Triangle|null} */
    this.triangle = t || null;

    /** @type {Node|null} */
    this.next = null;
    /** @type {Node|null} */
    this.prev = null;

    /** @type {number} */
    this.value = p.x;
};

// ---------------------------------------------------------------AdvancingFront
/**
 * @constructor
 * @private
 * @struct
 * @param {Node} head
 * @param {Node} tail
 */
var AdvancingFront = function(head, tail) {
    /** @type {Node} */
    this.head_ = head;
    /** @type {Node} */
    this.tail_ = tail;
    /** @type {Node} */
    this.search_node_ = head;
};

/** @return {Node} */
AdvancingFront.prototype.head = function() {
    return this.head_;
};

/** @param {Node} node */
AdvancingFront.prototype.setHead = function(node) {
    this.head_ = node;
};

/** @return {Node} */
AdvancingFront.prototype.tail = function() {
    return this.tail_;
};

/** @param {Node} node */
AdvancingFront.prototype.setTail = function(node) {
    this.tail_ = node;
};

/** @return {Node} */
AdvancingFront.prototype.search = function() {
    return this.search_node_;
};

/** @param {Node} node */
AdvancingFront.prototype.setSearch = function(node) {
    this.search_node_ = node;
};

/** @return {Node} */
AdvancingFront.prototype.findSearchNode = function(/*x*/) {
    // TODO: implement BST index
    return this.search_node_;
};

/**
 * @param {number} x value
 * @return {Node}
 */
AdvancingFront.prototype.locateNode = function(x) {
    var node = this.search_node_;

    /* jshint boss:true */
    if (x < node.value) {
        while (node = node.prev) {
            if (x >= node.value) {
                this.search_node_ = node;
                return node;
            }
        }
    } else {
        while (node = node.next) {
            if (x < node.value) {
                this.search_node_ = node.prev;
                return node.prev;
            }
        }
    }
    return null;
};

/**
 * @param {!XY} point - Point
 * @return {Node}
 */
AdvancingFront.prototype.locatePoint = function(point) {
    var px = point.x;
    var node = this.findSearchNode(px);
    var nx = node.point.x;

    if (px === nx) {
        // Here we are comparing point references, not values
        if (point !== node.point) {
            // We might have two nodes with same x value for a short time
            if (point === node.prev.point) {
                node = node.prev;
            } else if (point === node.next.point) {
                node = node.next;
            } else {
                throw new Error('poly2tri Invalid AdvancingFront.locatePoint() call');
            }
        }
    } else if (px < nx) {
        /* jshint boss:true */
        while (node = node.prev) {
            if (point === node.point) {
                break;
            }
        }
    } else {
        while (node = node.next) {
            if (point === node.point) {
                break;
            }
        }
    }

    if (node) {
        this.search_node_ = node;
    }
    return node;
};


// ----------------------------------------------------------------------Exports

module.exports = AdvancingFront;
module.exports.Node = Node;


},{}],3:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 *
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 *
 * All rights reserved.
 *
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

"use strict";

/*
 * Function added in the JavaScript version (was not present in the c++ version)
 */

/**
 * assert and throw an exception.
 *
 * @private
 * @param {boolean} condition   the condition which is asserted
 * @param {string} message      the message which is display is condition is falsy
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assert Failed");
    }
}
module.exports = assert;



},{}],4:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

"use strict";


/*
 * Note
 * ====
 * the structure of this JavaScript version of poly2tri intentionally follows
 * as closely as possible the structure of the reference C++ version, to make it 
 * easier to keep the 2 versions in sync.
 */

var xy = _dereq_('./xy');

// ------------------------------------------------------------------------Point
/**
 * Construct a point
 * @example
 *      var point = new poly2tri.Point(150, 150);
 * @public
 * @constructor
 * @struct
 * @param {number=} x    coordinate (0 if undefined)
 * @param {number=} y    coordinate (0 if undefined)
 */
var Point = function(x, y) {
    /**
     * @type {number}
     * @expose
     */
    this.x = +x || 0;
    /**
     * @type {number}
     * @expose
     */
    this.y = +y || 0;

    // All extra fields added to Point are prefixed with _p2t_
    // to avoid collisions if custom Point class is used.

    /**
     * The edges this point constitutes an upper ending point
     * @private
     * @type {Array.<Edge>}
     */
    this._p2t_edge_list = null;
};

/**
 * For pretty printing
 * @example
 *      "p=" + new poly2tri.Point(5,42)
 *      // → "p=(5;42)"
 * @returns {string} <code>"(x;y)"</code>
 */
Point.prototype.toString = function() {
    return xy.toStringBase(this);
};

/**
 * JSON output, only coordinates
 * @example
 *      JSON.stringify(new poly2tri.Point(1,2))
 *      // → '{"x":1,"y":2}'
 */
Point.prototype.toJSON = function() {
    return { x: this.x, y: this.y };
};

/**
 * Creates a copy of this Point object.
 * @return {Point} new cloned point
 */
Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};

/**
 * Set this Point instance to the origo. <code>(0; 0)</code>
 * @return {Point} this (for chaining)
 */
Point.prototype.set_zero = function() {
    this.x = 0.0;
    this.y = 0.0;
    return this; // for chaining
};

/**
 * Set the coordinates of this instance.
 * @param {number} x   coordinate
 * @param {number} y   coordinate
 * @return {Point} this (for chaining)
 */
Point.prototype.set = function(x, y) {
    this.x = +x || 0;
    this.y = +y || 0;
    return this; // for chaining
};

/**
 * Negate this Point instance. (component-wise)
 * @return {Point} this (for chaining)
 */
Point.prototype.negate = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this; // for chaining
};

/**
 * Add another Point object to this instance. (component-wise)
 * @param {!Point} n - Point object.
 * @return {Point} this (for chaining)
 */
Point.prototype.add = function(n) {
    this.x += n.x;
    this.y += n.y;
    return this; // for chaining
};

/**
 * Subtract this Point instance with another point given. (component-wise)
 * @param {!Point} n - Point object.
 * @return {Point} this (for chaining)
 */
Point.prototype.sub = function(n) {
    this.x -= n.x;
    this.y -= n.y;
    return this; // for chaining
};

/**
 * Multiply this Point instance by a scalar. (component-wise)
 * @param {number} s   scalar.
 * @return {Point} this (for chaining)
 */
Point.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this; // for chaining
};

/**
 * Return the distance of this Point instance from the origo.
 * @return {number} distance
 */
Point.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * Normalize this Point instance (as a vector).
 * @return {number} The original distance of this instance from the origo.
 */
Point.prototype.normalize = function() {
    var len = this.length();
    this.x /= len;
    this.y /= len;
    return len;
};

/**
 * Test this Point object with another for equality.
 * @param {!XY} p - any "Point like" object with {x,y}
 * @return {boolean} <code>true</code> if same x and y coordinates, <code>false</code> otherwise.
 */
Point.prototype.equals = function(p) {
    return this.x === p.x && this.y === p.y;
};


// -----------------------------------------------------Point ("static" methods)

/**
 * Negate a point component-wise and return the result as a new Point object.
 * @param {!XY} p - any "Point like" object with {x,y}
 * @return {Point} the resulting Point object.
 */
Point.negate = function(p) {
    return new Point(-p.x, -p.y);
};

/**
 * Add two points component-wise and return the result as a new Point object.
 * @param {!XY} a - any "Point like" object with {x,y}
 * @param {!XY} b - any "Point like" object with {x,y}
 * @return {Point} the resulting Point object.
 */
Point.add = function(a, b) {
    return new Point(a.x + b.x, a.y + b.y);
};

/**
 * Subtract two points component-wise and return the result as a new Point object.
 * @param {!XY} a - any "Point like" object with {x,y}
 * @param {!XY} b - any "Point like" object with {x,y}
 * @return {Point} the resulting Point object.
 */
Point.sub = function(a, b) {
    return new Point(a.x - b.x, a.y - b.y);
};

/**
 * Multiply a point by a scalar and return the result as a new Point object.
 * @param {number} s - the scalar
 * @param {!XY} p - any "Point like" object with {x,y}
 * @return {Point} the resulting Point object.
 */
Point.mul = function(s, p) {
    return new Point(s * p.x, s * p.y);
};

/**
 * Perform the cross product on either two points (this produces a scalar)
 * or a point and a scalar (this produces a point).
 * This function requires two parameters, either may be a Point object or a
 * number.
 * @param  {XY|number} a - Point object or scalar.
 * @param  {XY|number} b - Point object or scalar.
 * @return {Point|number} a Point object or a number, depending on the parameters.
 */
Point.cross = function(a, b) {
    if (typeof(a) === 'number') {
        if (typeof(b) === 'number') {
            return a * b;
        } else {
            return new Point(-a * b.y, a * b.x);
        }
    } else {
        if (typeof(b) === 'number') {
            return new Point(b * a.y, -b * a.x);
        } else {
            return a.x * b.y - a.y * b.x;
        }
    }
};


// -----------------------------------------------------------------"Point-Like"
/*
 * The following functions operate on "Point" or any "Point like" object 
 * with {x,y} (duck typing).
 */

Point.toString = xy.toString;
Point.compare = xy.compare;
Point.cmp = xy.compare; // backward compatibility
Point.equals = xy.equals;

/**
 * Peform the dot product on two vectors.
 * @public
 * @param {!XY} a - any "Point like" object with {x,y}
 * @param {!XY} b - any "Point like" object with {x,y}
 * @return {number} The dot product
 */
Point.dot = function(a, b) {
    return a.x * b.x + a.y * b.y;
};


// ---------------------------------------------------------Exports (public API)

module.exports = Point;

},{"./xy":11}],5:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

"use strict";

/*
 * Class added in the JavaScript version (was not present in the c++ version)
 */

var xy = _dereq_('./xy');

/**
 * Custom exception class to indicate invalid Point values
 * @constructor
 * @public
 * @extends Error
 * @struct
 * @param {string=} message - error message
 * @param {Array.<XY>=} points - invalid points
 */
var PointError = function(message, points) {
    this.name = "PointError";
    /**
     * Invalid points
     * @public
     * @type {Array.<XY>}
     */
    this.points = points = points || [];
    /**
     * Error message
     * @public
     * @type {string}
     */
    this.message = message || "Invalid Points!";
    for (var i = 0; i < points.length; i++) {
        this.message += " " + xy.toString(points[i]);
    }
};
PointError.prototype = new Error();
PointError.prototype.constructor = PointError;


module.exports = PointError;

},{"./xy":11}],6:[function(_dereq_,module,exports){
(function (global){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of Poly2Tri nor the names of its contributors may be
 *   used to endorse or promote products derived from this software without specific
 *   prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

/**
 * Public API for poly2tri.js
 * @module poly2tri
 */


/**
 * If you are not using a module system (e.g. CommonJS, RequireJS), you can access this library
 * as a global variable <code>poly2tri</code> i.e. <code>window.poly2tri</code> in a browser.
 * @name poly2tri
 * @global
 * @public
 * @type {module:poly2tri}
 */
var previousPoly2tri = global.poly2tri;
/**
 * For Browser + &lt;script&gt; :
 * reverts the {@linkcode poly2tri} global object to its previous value,
 * and returns a reference to the instance called.
 *
 * @example
 *              var p = poly2tri.noConflict();
 * @public
 * @return {module:poly2tri} instance called
 */
// (this feature is not automatically provided by browserify).
exports.noConflict = function() {
    global.poly2tri = previousPoly2tri;
    return exports;
};

/**
 * poly2tri library version
 * @public
 * @const {string}
 */
exports.VERSION = _dereq_('../dist/version.json').version;

/**
 * Exports the {@linkcode PointError} class.
 * @public
 * @typedef {PointError} module:poly2tri.PointError
 * @function
 */
exports.PointError = _dereq_('./pointerror');
/**
 * Exports the {@linkcode Point} class.
 * @public
 * @typedef {Point} module:poly2tri.Point
 * @function
 */
exports.Point = _dereq_('./point');
/**
 * Exports the {@linkcode Triangle} class.
 * @public
 * @typedef {Triangle} module:poly2tri.Triangle
 * @function
 */
exports.Triangle = _dereq_('./triangle');
/**
 * Exports the {@linkcode SweepContext} class.
 * @public
 * @typedef {SweepContext} module:poly2tri.SweepContext
 * @function
 */
exports.SweepContext = _dereq_('./sweepcontext');


// Backward compatibility
var sweep = _dereq_('./sweep');
/**
 * @function
 * @deprecated use {@linkcode SweepContext#triangulate} instead
 */
exports.triangulate = sweep.triangulate;
/**
 * @deprecated use {@linkcode SweepContext#triangulate} instead
 * @property {function} Triangulate - use {@linkcode SweepContext#triangulate} instead
 */
exports.sweep = {Triangulate: sweep.triangulate};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../dist/version.json":1,"./point":4,"./pointerror":5,"./sweep":7,"./sweepcontext":8,"./triangle":9}],7:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

/* jshint latedef:nofunc, maxcomplexity:9 */

"use strict";

/**
 * This 'Sweep' module is present in order to keep this JavaScript version
 * as close as possible to the reference C++ version, even though almost all
 * functions could be declared as methods on the {@linkcode module:sweepcontext~SweepContext} object.
 * @module
 * @private
 */

/*
 * Note
 * ====
 * the structure of this JavaScript version of poly2tri intentionally follows
 * as closely as possible the structure of the reference C++ version, to make it 
 * easier to keep the 2 versions in sync.
 */

var assert = _dereq_('./assert');
var PointError = _dereq_('./pointerror');
var Triangle = _dereq_('./triangle');
var Node = _dereq_('./advancingfront').Node;


// ------------------------------------------------------------------------utils

var utils = _dereq_('./utils');

/** @const */
var EPSILON = utils.EPSILON;

/** @const */
var Orientation = utils.Orientation;
/** @const */
var orient2d = utils.orient2d;
/** @const */
var inScanArea = utils.inScanArea;
/** @const */
var isAngleObtuse = utils.isAngleObtuse;


// ------------------------------------------------------------------------Sweep

/**
 * Triangulate the polygon with holes and Steiner points.
 * Do this AFTER you've added the polyline, holes, and Steiner points
 * @private
 * @param {!SweepContext} tcx - SweepContext object
 */
function triangulate(tcx) {
    tcx.initTriangulation();
    tcx.createAdvancingFront();
    // Sweep points; build mesh
    sweepPoints(tcx);
    // Clean up
    finalizationPolygon(tcx);
}

/**
 * Start sweeping the Y-sorted point set from bottom to top
 * @param {!SweepContext} tcx - SweepContext object
 */
function sweepPoints(tcx) {
    var i, len = tcx.pointCount();
    for (i = 1; i < len; ++i) {
        var point = tcx.getPoint(i);
        var node = pointEvent(tcx, point);
        var edges = point._p2t_edge_list;
        for (var j = 0; edges && j < edges.length; ++j) {
            edgeEventByEdge(tcx, edges[j], node);
        }
    }
}

/**
 * @param {!SweepContext} tcx - SweepContext object
 */
function finalizationPolygon(tcx) {
    // Get an Internal triangle to start with
    var t = tcx.front().head().next.triangle;
    var p = tcx.front().head().next.point;
    while (!t.getConstrainedEdgeCW(p)) {
        t = t.neighborCCW(p);
    }

    // Collect interior triangles constrained by edges
    tcx.meshClean(t);
}

/**
 * Find closes node to the left of the new point and
 * create a new triangle. If needed new holes and basins
 * will be filled to.
 * @param {!SweepContext} tcx - SweepContext object
 * @param {!XY} point   Point
 */
function pointEvent(tcx, point) {
    var node = tcx.locateNode(point);
    var new_node = newFrontTriangle(tcx, point, node);

    // Only need to check +epsilon since point never have smaller
    // x value than node due to how we fetch nodes from the front
    if (point.x <= node.point.x + (EPSILON)) {
        fill(tcx, node);
    }

    //tcx.AddNode(new_node);

    fillAdvancingFront(tcx, new_node);
    return new_node;
}

function edgeEventByEdge(tcx, edge, node) {
    tcx.edge_event.constrained_edge = edge;
    tcx.edge_event.right = (edge.p.x > edge.q.x);

    if (isEdgeSideOfTriangle(node.triangle, edge.p, edge.q)) {
        return;
    }

    // For now we will do all needed filling
    // TODO: integrate with flip process might give some better performance
    //       but for now this avoid the issue with cases that needs both flips and fills
    fillEdgeEvent(tcx, edge, node);
    edgeEventByPoints(tcx, edge.p, edge.q, node.triangle, edge.q);
}

function edgeEventByPoints(tcx, ep, eq, triangle, point) {
    if (isEdgeSideOfTriangle(triangle, ep, eq)) {
        return;
    }

    var p1 = triangle.pointCCW(point);
    var o1 = orient2d(eq, p1, ep);
    if (o1 === Orientation.COLLINEAR) {
        // TODO integrate here changes from C++ version
        // (C++ repo revision 09880a869095 dated March 8, 2011)
        throw new PointError('poly2tri EdgeEvent: Collinear not supported!', [eq, p1, ep]);
    }

    var p2 = triangle.pointCW(point);
    var o2 = orient2d(eq, p2, ep);
    if (o2 === Orientation.COLLINEAR) {
        // TODO integrate here changes from C++ version
        // (C++ repo revision 09880a869095 dated March 8, 2011)
        throw new PointError('poly2tri EdgeEvent: Collinear not supported!', [eq, p2, ep]);
    }

    if (o1 === o2) {
        // Need to decide if we are rotating CW or CCW to get to a triangle
        // that will cross edge
        if (o1 === Orientation.CW) {
            triangle = triangle.neighborCCW(point);
        } else {
            triangle = triangle.neighborCW(point);
        }
        edgeEventByPoints(tcx, ep, eq, triangle, point);
    } else {
        // This triangle crosses constraint so lets flippin start!
        flipEdgeEvent(tcx, ep, eq, triangle, point);
    }
}

function isEdgeSideOfTriangle(triangle, ep, eq) {
    var index = triangle.edgeIndex(ep, eq);
    if (index !== -1) {
        triangle.markConstrainedEdgeByIndex(index);
        var t = triangle.getNeighbor(index);
        if (t) {
            t.markConstrainedEdgeByPoints(ep, eq);
        }
        return true;
    }
    return false;
}

/**
 * Creates a new front triangle and legalize it
 * @param {!SweepContext} tcx - SweepContext object
 */
function newFrontTriangle(tcx, point, node) {
    var triangle = new Triangle(point, node.point, node.next.point);

    triangle.markNeighbor(node.triangle);
    tcx.addToMap(triangle);

    var new_node = new Node(point);
    new_node.next = node.next;
    new_node.prev = node;
    node.next.prev = new_node;
    node.next = new_node;

    if (!legalize(tcx, triangle)) {
        tcx.mapTriangleToNodes(triangle);
    }

    return new_node;
}

/**
 * Adds a triangle to the advancing front to fill a hole.
 * @param {!SweepContext} tcx - SweepContext object
 * @param node - middle node, that is the bottom of the hole
 */
function fill(tcx, node) {
    var triangle = new Triangle(node.prev.point, node.point, node.next.point);

    // TODO: should copy the constrained_edge value from neighbor triangles
    //       for now constrained_edge values are copied during the legalize
    triangle.markNeighbor(node.prev.triangle);
    triangle.markNeighbor(node.triangle);

    tcx.addToMap(triangle);

    // Update the advancing front
    node.prev.next = node.next;
    node.next.prev = node.prev;


    // If it was legalized the triangle has already been mapped
    if (!legalize(tcx, triangle)) {
        tcx.mapTriangleToNodes(triangle);
    }

    //tcx.removeNode(node);
}

/**
 * Fills holes in the Advancing Front
 * @param {!SweepContext} tcx - SweepContext object
 */
function fillAdvancingFront(tcx, n) {
    // Fill right holes
    var node = n.next;
    while (node.next) {
        // TODO integrate here changes from C++ version
        // (C++ repo revision acf81f1f1764 dated April 7, 2012)
        if (isAngleObtuse(node.point, node.next.point, node.prev.point)) {
            break;
        }
        fill(tcx, node);
        node = node.next;
    }

    // Fill left holes
    node = n.prev;
    while (node.prev) {
        // TODO integrate here changes from C++ version
        // (C++ repo revision acf81f1f1764 dated April 7, 2012)
        if (isAngleObtuse(node.point, node.next.point, node.prev.point)) {
            break;
        }
        fill(tcx, node);
        node = node.prev;
    }

    // Fill right basins
    if (n.next && n.next.next) {
        if (isBasinAngleRight(n)) {
            fillBasin(tcx, n);
        }
    }
}

/**
 * The basin angle is decided against the horizontal line [1,0].
 * @param {Node} node
 * @return {boolean} true if angle < 3*π/4
 */
function isBasinAngleRight(node) {
    var ax = node.point.x - node.next.next.point.x;
    var ay = node.point.y - node.next.next.point.y;
    assert(ay >= 0, "unordered y");
    return (ax >= 0 || Math.abs(ax) < ay);
}

/**
 * Returns true if triangle was legalized
 * @param {!SweepContext} tcx - SweepContext object
 * @return {boolean}
 */
function legalize(tcx, t) {
    // To legalize a triangle we start by finding if any of the three edges
    // violate the Delaunay condition
    for (var i = 0; i < 3; ++i) {
        if (t.delaunay_edge[i]) {
            continue;
        }
        var ot = t.getNeighbor(i);
        if (ot) {
            var p = t.getPoint(i);
            var op = ot.oppositePoint(t, p);
            var oi = ot.index(op);

            // If this is a Constrained Edge or a Delaunay Edge(only during recursive legalization)
            // then we should not try to legalize
            if (ot.constrained_edge[oi] || ot.delaunay_edge[oi]) {
                t.constrained_edge[i] = ot.constrained_edge[oi];
                continue;
            }

            var inside = inCircle(p, t.pointCCW(p), t.pointCW(p), op);
            if (inside) {
                // Lets mark this shared edge as Delaunay
                t.delaunay_edge[i] = true;
                ot.delaunay_edge[oi] = true;

                // Lets rotate shared edge one vertex CW to legalize it
                rotateTrianglePair(t, p, ot, op);

                // We now got one valid Delaunay Edge shared by two triangles
                // This gives us 4 new edges to check for Delaunay

                // Make sure that triangle to node mapping is done only one time for a specific triangle
                var not_legalized = !legalize(tcx, t);
                if (not_legalized) {
                    tcx.mapTriangleToNodes(t);
                }

                not_legalized = !legalize(tcx, ot);
                if (not_legalized) {
                    tcx.mapTriangleToNodes(ot);
                }
                // Reset the Delaunay edges, since they only are valid Delaunay edges
                // until we add a new triangle or point.
                // XXX: need to think about this. Can these edges be tried after we
                //      return to previous recursive level?
                t.delaunay_edge[i] = false;
                ot.delaunay_edge[oi] = false;

                // If triangle have been legalized no need to check the other edges since
                // the recursive legalization will handles those so we can end here.
                return true;
            }
        }
    }
    return false;
}

/**
 * <b>Requirement</b>:<br>
 * 1. a,b and c form a triangle.<br>
 * 2. a and d is know to be on opposite side of bc<br>
 * <pre>
 *                a
 *                +
 *               / \
 *              /   \
 *            b/     \c
 *            +-------+
 *           /    d    \
 *          /           \
 * </pre>
 * <b>Fact</b>: d has to be in area B to have a chance to be inside the circle formed by
 *  a,b and c<br>
 *  d is outside B if orient2d(a,b,d) or orient2d(c,a,d) is CW<br>
 *  This preknowledge gives us a way to optimize the incircle test
 * @param pa - triangle point, opposite d
 * @param pb - triangle point
 * @param pc - triangle point
 * @param pd - point opposite a
 * @return {boolean} true if d is inside circle, false if on circle edge
 */
function inCircle(pa, pb, pc, pd) {
    var adx = pa.x - pd.x;
    var ady = pa.y - pd.y;
    var bdx = pb.x - pd.x;
    var bdy = pb.y - pd.y;

    var adxbdy = adx * bdy;
    var bdxady = bdx * ady;
    var oabd = adxbdy - bdxady;
    if (oabd <= 0) {
        return false;
    }

    var cdx = pc.x - pd.x;
    var cdy = pc.y - pd.y;

    var cdxady = cdx * ady;
    var adxcdy = adx * cdy;
    var ocad = cdxady - adxcdy;
    if (ocad <= 0) {
        return false;
    }

    var bdxcdy = bdx * cdy;
    var cdxbdy = cdx * bdy;

    var alift = adx * adx + ady * ady;
    var blift = bdx * bdx + bdy * bdy;
    var clift = cdx * cdx + cdy * cdy;

    var det = alift * (bdxcdy - cdxbdy) + blift * ocad + clift * oabd;
    return det > 0;
}

/**
 * Rotates a triangle pair one vertex CW
 *<pre>
 *       n2                    n2
 *  P +-----+             P +-----+
 *    | t  /|               |\  t |
 *    |   / |               | \   |
 *  n1|  /  |n3           n1|  \  |n3
 *    | /   |    after CW   |   \ |
 *    |/ oT |               | oT \|
 *    +-----+ oP            +-----+
 *       n4                    n4
 * </pre>
 */
function rotateTrianglePair(t, p, ot, op) {
    var n1, n2, n3, n4;
    n1 = t.neighborCCW(p);
    n2 = t.neighborCW(p);
    n3 = ot.neighborCCW(op);
    n4 = ot.neighborCW(op);

    var ce1, ce2, ce3, ce4;
    ce1 = t.getConstrainedEdgeCCW(p);
    ce2 = t.getConstrainedEdgeCW(p);
    ce3 = ot.getConstrainedEdgeCCW(op);
    ce4 = ot.getConstrainedEdgeCW(op);

    var de1, de2, de3, de4;
    de1 = t.getDelaunayEdgeCCW(p);
    de2 = t.getDelaunayEdgeCW(p);
    de3 = ot.getDelaunayEdgeCCW(op);
    de4 = ot.getDelaunayEdgeCW(op);

    t.legalize(p, op);
    ot.legalize(op, p);

    // Remap delaunay_edge
    ot.setDelaunayEdgeCCW(p, de1);
    t.setDelaunayEdgeCW(p, de2);
    t.setDelaunayEdgeCCW(op, de3);
    ot.setDelaunayEdgeCW(op, de4);

    // Remap constrained_edge
    ot.setConstrainedEdgeCCW(p, ce1);
    t.setConstrainedEdgeCW(p, ce2);
    t.setConstrainedEdgeCCW(op, ce3);
    ot.setConstrainedEdgeCW(op, ce4);

    // Remap neighbors
    // XXX: might optimize the markNeighbor by keeping track of
    //      what side should be assigned to what neighbor after the
    //      rotation. Now mark neighbor does lots of testing to find
    //      the right side.
    t.clearNeighbors();
    ot.clearNeighbors();
    if (n1) {
        ot.markNeighbor(n1);
    }
    if (n2) {
        t.markNeighbor(n2);
    }
    if (n3) {
        t.markNeighbor(n3);
    }
    if (n4) {
        ot.markNeighbor(n4);
    }
    t.markNeighbor(ot);
}

/**
 * Fills a basin that has formed on the Advancing Front to the right
 * of given node.<br>
 * First we decide a left,bottom and right node that forms the
 * boundaries of the basin. Then we do a reqursive fill.
 *
 * @param {!SweepContext} tcx - SweepContext object
 * @param node - starting node, this or next node will be left node
 */
function fillBasin(tcx, node) {
    if (orient2d(node.point, node.next.point, node.next.next.point) === Orientation.CCW) {
        tcx.basin.left_node = node.next.next;
    } else {
        tcx.basin.left_node = node.next;
    }

    // Find the bottom and right node
    tcx.basin.bottom_node = tcx.basin.left_node;
    while (tcx.basin.bottom_node.next && tcx.basin.bottom_node.point.y >= tcx.basin.bottom_node.next.point.y) {
        tcx.basin.bottom_node = tcx.basin.bottom_node.next;
    }
    if (tcx.basin.bottom_node === tcx.basin.left_node) {
        // No valid basin
        return;
    }

    tcx.basin.right_node = tcx.basin.bottom_node;
    while (tcx.basin.right_node.next && tcx.basin.right_node.point.y < tcx.basin.right_node.next.point.y) {
        tcx.basin.right_node = tcx.basin.right_node.next;
    }
    if (tcx.basin.right_node === tcx.basin.bottom_node) {
        // No valid basins
        return;
    }

    tcx.basin.width = tcx.basin.right_node.point.x - tcx.basin.left_node.point.x;
    tcx.basin.left_highest = tcx.basin.left_node.point.y > tcx.basin.right_node.point.y;

    fillBasinReq(tcx, tcx.basin.bottom_node);
}

/**
 * Recursive algorithm to fill a Basin with triangles
 *
 * @param {!SweepContext} tcx - SweepContext object
 * @param node - bottom_node
 */
function fillBasinReq(tcx, node) {
    // if shallow stop filling
    if (isShallow(tcx, node)) {
        return;
    }

    fill(tcx, node);

    var o;
    if (node.prev === tcx.basin.left_node && node.next === tcx.basin.right_node) {
        return;
    } else if (node.prev === tcx.basin.left_node) {
        o = orient2d(node.point, node.next.point, node.next.next.point);
        if (o === Orientation.CW) {
            return;
        }
        node = node.next;
    } else if (node.next === tcx.basin.right_node) {
        o = orient2d(node.point, node.prev.point, node.prev.prev.point);
        if (o === Orientation.CCW) {
            return;
        }
        node = node.prev;
    } else {
        // Continue with the neighbor node with lowest Y value
        if (node.prev.point.y < node.next.point.y) {
            node = node.prev;
        } else {
            node = node.next;
        }
    }

    fillBasinReq(tcx, node);
}

function isShallow(tcx, node) {
    var height;
    if (tcx.basin.left_highest) {
        height = tcx.basin.left_node.point.y - node.point.y;
    } else {
        height = tcx.basin.right_node.point.y - node.point.y;
    }

    // if shallow stop filling
    if (tcx.basin.width > height) {
        return true;
    }
    return false;
}

function fillEdgeEvent(tcx, edge, node) {
    if (tcx.edge_event.right) {
        fillRightAboveEdgeEvent(tcx, edge, node);
    } else {
        fillLeftAboveEdgeEvent(tcx, edge, node);
    }
}

function fillRightAboveEdgeEvent(tcx, edge, node) {
    while (node.next.point.x < edge.p.x) {
        // Check if next node is below the edge
        if (orient2d(edge.q, node.next.point, edge.p) === Orientation.CCW) {
            fillRightBelowEdgeEvent(tcx, edge, node);
        } else {
            node = node.next;
        }
    }
}

function fillRightBelowEdgeEvent(tcx, edge, node) {
    if (node.point.x < edge.p.x) {
        if (orient2d(node.point, node.next.point, node.next.next.point) === Orientation.CCW) {
            // Concave
            fillRightConcaveEdgeEvent(tcx, edge, node);
        } else {
            // Convex
            fillRightConvexEdgeEvent(tcx, edge, node);
            // Retry this one
            fillRightBelowEdgeEvent(tcx, edge, node);
        }
    }
}

function fillRightConcaveEdgeEvent(tcx, edge, node) {
    fill(tcx, node.next);
    if (node.next.point !== edge.p) {
        // Next above or below edge?
        if (orient2d(edge.q, node.next.point, edge.p) === Orientation.CCW) {
            // Below
            if (orient2d(node.point, node.next.point, node.next.next.point) === Orientation.CCW) {
                // Next is concave
                fillRightConcaveEdgeEvent(tcx, edge, node);
            } else {
                // Next is convex
                /* jshint noempty:false */
            }
        }
    }
}

function fillRightConvexEdgeEvent(tcx, edge, node) {
    // Next concave or convex?
    if (orient2d(node.next.point, node.next.next.point, node.next.next.next.point) === Orientation.CCW) {
        // Concave
        fillRightConcaveEdgeEvent(tcx, edge, node.next);
    } else {
        // Convex
        // Next above or below edge?
        if (orient2d(edge.q, node.next.next.point, edge.p) === Orientation.CCW) {
            // Below
            fillRightConvexEdgeEvent(tcx, edge, node.next);
        } else {
            // Above
            /* jshint noempty:false */
        }
    }
}

function fillLeftAboveEdgeEvent(tcx, edge, node) {
    while (node.prev.point.x > edge.p.x) {
        // Check if next node is below the edge
        if (orient2d(edge.q, node.prev.point, edge.p) === Orientation.CW) {
            fillLeftBelowEdgeEvent(tcx, edge, node);
        } else {
            node = node.prev;
        }
    }
}

function fillLeftBelowEdgeEvent(tcx, edge, node) {
    if (node.point.x > edge.p.x) {
        if (orient2d(node.point, node.prev.point, node.prev.prev.point) === Orientation.CW) {
            // Concave
            fillLeftConcaveEdgeEvent(tcx, edge, node);
        } else {
            // Convex
            fillLeftConvexEdgeEvent(tcx, edge, node);
            // Retry this one
            fillLeftBelowEdgeEvent(tcx, edge, node);
        }
    }
}

function fillLeftConvexEdgeEvent(tcx, edge, node) {
    // Next concave or convex?
    if (orient2d(node.prev.point, node.prev.prev.point, node.prev.prev.prev.point) === Orientation.CW) {
        // Concave
        fillLeftConcaveEdgeEvent(tcx, edge, node.prev);
    } else {
        // Convex
        // Next above or below edge?
        if (orient2d(edge.q, node.prev.prev.point, edge.p) === Orientation.CW) {
            // Below
            fillLeftConvexEdgeEvent(tcx, edge, node.prev);
        } else {
            // Above
            /* jshint noempty:false */
        }
    }
}

function fillLeftConcaveEdgeEvent(tcx, edge, node) {
    fill(tcx, node.prev);
    if (node.prev.point !== edge.p) {
        // Next above or below edge?
        if (orient2d(edge.q, node.prev.point, edge.p) === Orientation.CW) {
            // Below
            if (orient2d(node.point, node.prev.point, node.prev.prev.point) === Orientation.CW) {
                // Next is concave
                fillLeftConcaveEdgeEvent(tcx, edge, node);
            } else {
                // Next is convex
                /* jshint noempty:false */
            }
        }
    }
}

function flipEdgeEvent(tcx, ep, eq, t, p) {
    var ot = t.neighborAcross(p);
    assert(ot, "FLIP failed due to missing triangle!");

    var op = ot.oppositePoint(t, p);

    // Additional check from Java version (see issue #88)
    if (t.getConstrainedEdgeAcross(p)) {
        var index = t.index(p);
        throw new PointError("poly2tri Intersecting Constraints",
                [p, op, t.getPoint((index + 1) % 3), t.getPoint((index + 2) % 3)]);
    }

    if (inScanArea(p, t.pointCCW(p), t.pointCW(p), op)) {
        // Lets rotate shared edge one vertex CW
        rotateTrianglePair(t, p, ot, op);
        tcx.mapTriangleToNodes(t);
        tcx.mapTriangleToNodes(ot);

        // XXX: in the original C++ code for the next 2 lines, we are
        // comparing point values (and not pointers). In this JavaScript
        // code, we are comparing point references (pointers). This works
        // because we can't have 2 different points with the same values.
        // But to be really equivalent, we should use "Point.equals" here.
        if (p === eq && op === ep) {
            if (eq === tcx.edge_event.constrained_edge.q && ep === tcx.edge_event.constrained_edge.p) {
                t.markConstrainedEdgeByPoints(ep, eq);
                ot.markConstrainedEdgeByPoints(ep, eq);
                legalize(tcx, t);
                legalize(tcx, ot);
            } else {
                // XXX: I think one of the triangles should be legalized here?
                /* jshint noempty:false */
            }
        } else {
            var o = orient2d(eq, op, ep);
            t = nextFlipTriangle(tcx, o, t, ot, p, op);
            flipEdgeEvent(tcx, ep, eq, t, p);
        }
    } else {
        var newP = nextFlipPoint(ep, eq, ot, op);
        flipScanEdgeEvent(tcx, ep, eq, t, ot, newP);
        edgeEventByPoints(tcx, ep, eq, t, p);
    }
}

/**
 * After a flip we have two triangles and know that only one will still be
 * intersecting the edge. So decide which to contiune with and legalize the other
 *
 * @param {!SweepContext} tcx - SweepContext object
 * @param o - should be the result of an orient2d( eq, op, ep )
 * @param t - triangle 1
 * @param ot - triangle 2
 * @param p - a point shared by both triangles
 * @param op - another point shared by both triangles
 * @return returns the triangle still intersecting the edge
 */
function nextFlipTriangle(tcx, o, t, ot, p, op) {
    var edge_index;
    if (o === Orientation.CCW) {
        // ot is not crossing edge after flip
        edge_index = ot.edgeIndex(p, op);
        ot.delaunay_edge[edge_index] = true;
        legalize(tcx, ot);
        ot.clearDelaunayEdges();
        return t;
    }

    // t is not crossing edge after flip
    edge_index = t.edgeIndex(p, op);

    t.delaunay_edge[edge_index] = true;
    legalize(tcx, t);
    t.clearDelaunayEdges();
    return ot;
}

/**
 * When we need to traverse from one triangle to the next we need
 * the point in current triangle that is the opposite point to the next
 * triangle.
 */
function nextFlipPoint(ep, eq, ot, op) {
    var o2d = orient2d(eq, op, ep);
    if (o2d === Orientation.CW) {
        // Right
        return ot.pointCCW(op);
    } else if (o2d === Orientation.CCW) {
        // Left
        return ot.pointCW(op);
    } else {
        throw new PointError("poly2tri [Unsupported] nextFlipPoint: opposing point on constrained edge!", [eq, op, ep]);
    }
}

/**
 * Scan part of the FlipScan algorithm<br>
 * When a triangle pair isn't flippable we will scan for the next
 * point that is inside the flip triangle scan area. When found
 * we generate a new flipEdgeEvent
 *
 * @param {!SweepContext} tcx - SweepContext object
 * @param ep - last point on the edge we are traversing
 * @param eq - first point on the edge we are traversing
 * @param {!Triangle} flip_triangle - the current triangle sharing the point eq with edge
 * @param t
 * @param p
 */
function flipScanEdgeEvent(tcx, ep, eq, flip_triangle, t, p) {
    var ot = t.neighborAcross(p);
    assert(ot, "FLIP failed due to missing triangle");

    var op = ot.oppositePoint(t, p);

    if (inScanArea(eq, flip_triangle.pointCCW(eq), flip_triangle.pointCW(eq), op)) {
        // flip with new edge op.eq
        flipEdgeEvent(tcx, eq, op, ot, op);
    } else {
        var newP = nextFlipPoint(ep, eq, ot, op);
        flipScanEdgeEvent(tcx, ep, eq, flip_triangle, ot, newP);
    }
}


// ----------------------------------------------------------------------Exports

exports.triangulate = triangulate;

},{"./advancingfront":2,"./assert":3,"./pointerror":5,"./triangle":9,"./utils":10}],8:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

/* jshint maxcomplexity:6 */

"use strict";


/*
 * Note
 * ====
 * the structure of this JavaScript version of poly2tri intentionally follows
 * as closely as possible the structure of the reference C++ version, to make it 
 * easier to keep the 2 versions in sync.
 */

var PointError = _dereq_('./pointerror');
var Point = _dereq_('./point');
var Triangle = _dereq_('./triangle');
var sweep = _dereq_('./sweep');
var AdvancingFront = _dereq_('./advancingfront');
var Node = AdvancingFront.Node;


// ------------------------------------------------------------------------utils

/**
 * Initial triangle factor, seed triangle will extend 30% of
 * PointSet width to both left and right.
 * @private
 * @const
 */
var kAlpha = 0.3;


// -------------------------------------------------------------------------Edge
/**
 * Represents a simple polygon's edge
 * @constructor
 * @struct
 * @private
 * @param {Point} p1
 * @param {Point} p2
 * @throw {PointError} if p1 is same as p2
 */
var Edge = function(p1, p2) {
    this.p = p1;
    this.q = p2;

    if (p1.y > p2.y) {
        this.q = p1;
        this.p = p2;
    } else if (p1.y === p2.y) {
        if (p1.x > p2.x) {
            this.q = p1;
            this.p = p2;
        } else if (p1.x === p2.x) {
            throw new PointError('poly2tri Invalid Edge constructor: repeated points!', [p1]);
        }
    }

    if (!this.q._p2t_edge_list) {
        this.q._p2t_edge_list = [];
    }
    this.q._p2t_edge_list.push(this);
};


// ------------------------------------------------------------------------Basin
/**
 * @constructor
 * @struct
 * @private
 */
var Basin = function() {
    /** @type {Node} */
    this.left_node = null;
    /** @type {Node} */
    this.bottom_node = null;
    /** @type {Node} */
    this.right_node = null;
    /** @type {number} */
    this.width = 0.0;
    /** @type {boolean} */
    this.left_highest = false;
};

Basin.prototype.clear = function() {
    this.left_node = null;
    this.bottom_node = null;
    this.right_node = null;
    this.width = 0.0;
    this.left_highest = false;
};

// --------------------------------------------------------------------EdgeEvent
/**
 * @constructor
 * @struct
 * @private
 */
var EdgeEvent = function() {
    /** @type {Edge} */
    this.constrained_edge = null;
    /** @type {boolean} */
    this.right = false;
};

// ----------------------------------------------------SweepContext (public API)
/**
 * SweepContext constructor option
 * @typedef {Object} SweepContextOptions
 * @property {boolean=} cloneArrays - if <code>true</code>, do a shallow copy of the Array parameters
 *                  (contour, holes). Points inside arrays are never copied.
 *                  Default is <code>false</code> : keep a reference to the array arguments,
 *                  who will be modified in place.
 */
/**
 * Constructor for the triangulation context.
 * It accepts a simple polyline (with non repeating points), 
 * which defines the constrained edges.
 *
 * @example
 *          var contour = [
 *              new poly2tri.Point(100, 100),
 *              new poly2tri.Point(100, 300),
 *              new poly2tri.Point(300, 300),
 *              new poly2tri.Point(300, 100)
 *          ];
 *          var swctx = new poly2tri.SweepContext(contour, {cloneArrays: true});
 * @example
 *          var contour = [{x:100, y:100}, {x:100, y:300}, {x:300, y:300}, {x:300, y:100}];
 *          var swctx = new poly2tri.SweepContext(contour, {cloneArrays: true});
 * @constructor
 * @public
 * @struct
 * @param {Array.<XY>} contour - array of point objects. The points can be either {@linkcode Point} instances,
 *          or any "Point like" custom class with <code>{x, y}</code> attributes.
 * @param {SweepContextOptions=} options - constructor options
 */
var SweepContext = function(contour, options) {
    options = options || {};
    this.triangles_ = [];
    this.map_ = [];
    this.points_ = (options.cloneArrays ? contour.slice(0) : contour);
    this.edge_list = [];

    // Bounding box of all points. Computed at the start of the triangulation, 
    // it is stored in case it is needed by the caller.
    this.pmin_ = this.pmax_ = null;

    /**
     * Advancing front
     * @private
     * @type {AdvancingFront}
     */
    this.front_ = null;

    /**
     * head point used with advancing front
     * @private
     * @type {Point}
     */
    this.head_ = null;

    /**
     * tail point used with advancing front
     * @private
     * @type {Point}
     */
    this.tail_ = null;

    /**
     * @private
     * @type {Node}
     */
    this.af_head_ = null;
    /**
     * @private
     * @type {Node}
     */
    this.af_middle_ = null;
    /**
     * @private
     * @type {Node}
     */
    this.af_tail_ = null;

    this.basin = new Basin();
    this.edge_event = new EdgeEvent();

    this.initEdges(this.points_);
};


/**
 * Add a hole to the constraints
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      var hole = [
 *          new poly2tri.Point(200, 200),
 *          new poly2tri.Point(200, 250),
 *          new poly2tri.Point(250, 250)
 *      ];
 *      swctx.addHole(hole);
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.addHole([{x:200, y:200}, {x:200, y:250}, {x:250, y:250}]);
 * @public
 * @param {Array.<XY>} polyline - array of "Point like" objects with {x,y}
 */
SweepContext.prototype.addHole = function(polyline) {
    this.initEdges(polyline);
    var i, len = polyline.length;
    for (i = 0; i < len; i++) {
        this.points_.push(polyline[i]);
    }
    return this; // for chaining
};

/**
 * For backward compatibility
 * @function
 * @deprecated use {@linkcode SweepContext#addHole} instead
 */
SweepContext.prototype.AddHole = SweepContext.prototype.addHole;


/**
 * Add several holes to the constraints
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      var holes = [
 *          [ new poly2tri.Point(200, 200), new poly2tri.Point(200, 250), new poly2tri.Point(250, 250) ],
 *          [ new poly2tri.Point(300, 300), new poly2tri.Point(300, 350), new poly2tri.Point(350, 350) ]
 *      ];
 *      swctx.addHoles(holes);
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      var holes = [
 *          [{x:200, y:200}, {x:200, y:250}, {x:250, y:250}],
 *          [{x:300, y:300}, {x:300, y:350}, {x:350, y:350}]
 *      ];
 *      swctx.addHoles(holes);
 * @public
 * @param {Array.<Array.<XY>>} holes - array of array of "Point like" objects with {x,y}
 */
// Method added in the JavaScript version (was not present in the c++ version)
SweepContext.prototype.addHoles = function(holes) {
    var i, len = holes.length;
    for (i = 0; i < len; i++) {
        this.initEdges(holes[i]);
    }
    this.points_ = this.points_.concat.apply(this.points_, holes);
    return this; // for chaining
};


/**
 * Add a Steiner point to the constraints
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      var point = new poly2tri.Point(150, 150);
 *      swctx.addPoint(point);
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.addPoint({x:150, y:150});
 * @public
 * @param {XY} point - any "Point like" object with {x,y}
 */
SweepContext.prototype.addPoint = function(point) {
    this.points_.push(point);
    return this; // for chaining
};

/**
 * For backward compatibility
 * @function
 * @deprecated use {@linkcode SweepContext#addPoint} instead
 */
SweepContext.prototype.AddPoint = SweepContext.prototype.addPoint;


/**
 * Add several Steiner points to the constraints
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      var points = [
 *          new poly2tri.Point(150, 150),
 *          new poly2tri.Point(200, 250),
 *          new poly2tri.Point(250, 250)
 *      ];
 *      swctx.addPoints(points);
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.addPoints([{x:150, y:150}, {x:200, y:250}, {x:250, y:250}]);
 * @public
 * @param {Array.<XY>} points - array of "Point like" object with {x,y}
 */
// Method added in the JavaScript version (was not present in the c++ version)
SweepContext.prototype.addPoints = function(points) {
    this.points_ = this.points_.concat(points);
    return this; // for chaining
};


/**
 * Triangulate the polygon with holes and Steiner points.
 * Do this AFTER you've added the polyline, holes, and Steiner points
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.triangulate();
 *      var triangles = swctx.getTriangles();
 * @public
 */
// Shortcut method for sweep.triangulate(SweepContext).
// Method added in the JavaScript version (was not present in the c++ version)
SweepContext.prototype.triangulate = function() {
    sweep.triangulate(this);
    return this; // for chaining
};


/**
 * Get the bounding box of the provided constraints (contour, holes and 
 * Steinter points). Warning : these values are not available if the triangulation 
 * has not been done yet.
 * @public
 * @returns {{min:Point,max:Point}} object with 'min' and 'max' Point
 */
// Method added in the JavaScript version (was not present in the c++ version)
SweepContext.prototype.getBoundingBox = function() {
    return {min: this.pmin_, max: this.pmax_};
};

/**
 * Get result of triangulation.
 * The output triangles have vertices which are references
 * to the initial input points (not copies): any custom fields in the
 * initial points can be retrieved in the output triangles.
 * @example
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.triangulate();
 *      var triangles = swctx.getTriangles();
 * @example
 *      var contour = [{x:100, y:100, id:1}, {x:100, y:300, id:2}, {x:300, y:300, id:3}];
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.triangulate();
 *      var triangles = swctx.getTriangles();
 *      typeof triangles[0].getPoint(0).id
 *      // → "number"
 * @public
 * @returns {array<Triangle>}   array of triangles
 */
SweepContext.prototype.getTriangles = function() {
    return this.triangles_;
};

/**
 * For backward compatibility
 * @function
 * @deprecated use {@linkcode SweepContext#getTriangles} instead
 */
SweepContext.prototype.GetTriangles = SweepContext.prototype.getTriangles;


// ---------------------------------------------------SweepContext (private API)

/** @private */
SweepContext.prototype.front = function() {
    return this.front_;
};

/** @private */
SweepContext.prototype.pointCount = function() {
    return this.points_.length;
};

/** @private */
SweepContext.prototype.head = function() {
    return this.head_;
};

/** @private */
SweepContext.prototype.setHead = function(p1) {
    this.head_ = p1;
};

/** @private */
SweepContext.prototype.tail = function() {
    return this.tail_;
};

/** @private */
SweepContext.prototype.setTail = function(p1) {
    this.tail_ = p1;
};

/** @private */
SweepContext.prototype.getMap = function() {
    return this.map_;
};

/** @private */
SweepContext.prototype.initTriangulation = function() {
    var xmax = this.points_[0].x;
    var xmin = this.points_[0].x;
    var ymax = this.points_[0].y;
    var ymin = this.points_[0].y;

    // Calculate bounds
    var i, len = this.points_.length;
    for (i = 1; i < len; i++) {
        var p = this.points_[i];
        /* jshint expr:true */
        (p.x > xmax) && (xmax = p.x);
        (p.x < xmin) && (xmin = p.x);
        (p.y > ymax) && (ymax = p.y);
        (p.y < ymin) && (ymin = p.y);
    }
    this.pmin_ = new Point(xmin, ymin);
    this.pmax_ = new Point(xmax, ymax);

    var dx = kAlpha * (xmax - xmin);
    var dy = kAlpha * (ymax - ymin);
    this.head_ = new Point(xmax + dx, ymin - dy);
    this.tail_ = new Point(xmin - dx, ymin - dy);

    // Sort points along y-axis
    this.points_.sort(Point.compare);
};

/** @private */
SweepContext.prototype.initEdges = function(polyline) {
    var i, len = polyline.length;
    for (i = 0; i < len; ++i) {
        this.edge_list.push(new Edge(polyline[i], polyline[(i + 1) % len]));
    }
};

/** @private */
SweepContext.prototype.getPoint = function(index) {
    return this.points_[index];
};

/** @private */
SweepContext.prototype.addToMap = function(triangle) {
    this.map_.push(triangle);
};

/** @private */
SweepContext.prototype.locateNode = function(point) {
    return this.front_.locateNode(point.x);
};

/** @private */
SweepContext.prototype.createAdvancingFront = function() {
    var head;
    var middle;
    var tail;
    // Initial triangle
    var triangle = new Triangle(this.points_[0], this.tail_, this.head_);

    this.map_.push(triangle);

    head = new Node(triangle.getPoint(1), triangle);
    middle = new Node(triangle.getPoint(0), triangle);
    tail = new Node(triangle.getPoint(2));

    this.front_ = new AdvancingFront(head, tail);

    head.next = middle;
    middle.next = tail;
    middle.prev = head;
    tail.prev = middle;
};

/** @private */
SweepContext.prototype.removeNode = function(node) {
    // do nothing
    /* jshint unused:false */
};

/** @private */
SweepContext.prototype.mapTriangleToNodes = function(t) {
    for (var i = 0; i < 3; ++i) {
        if (!t.getNeighbor(i)) {
            var n = this.front_.locatePoint(t.pointCW(t.getPoint(i)));
            if (n) {
                n.triangle = t;
            }
        }
    }
};

/** @private */
SweepContext.prototype.removeFromMap = function(triangle) {
    var i, map = this.map_, len = map.length;
    for (i = 0; i < len; i++) {
        if (map[i] === triangle) {
            map.splice(i, 1);
            break;
        }
    }
};

/**
 * Do a depth first traversal to collect triangles
 * @private
 * @param {Triangle} triangle start
 */
SweepContext.prototype.meshClean = function(triangle) {
    // New implementation avoids recursive calls and use a loop instead.
    // Cf. issues # 57, 65 and 69.
    var triangles = [triangle], t, i;
    /* jshint boss:true */
    while (t = triangles.pop()) {
        if (!t.isInterior()) {
            t.setInterior(true);
            this.triangles_.push(t);
            for (i = 0; i < 3; i++) {
                if (!t.constrained_edge[i]) {
                    triangles.push(t.getNeighbor(i));
                }
            }
        }
    }
};

// ----------------------------------------------------------------------Exports

module.exports = SweepContext;

},{"./advancingfront":2,"./point":4,"./pointerror":5,"./sweep":7,"./triangle":9}],9:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 *
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

/* jshint maxcomplexity:10 */

"use strict";


/*
 * Note
 * ====
 * the structure of this JavaScript version of poly2tri intentionally follows
 * as closely as possible the structure of the reference C++ version, to make it 
 * easier to keep the 2 versions in sync.
 */

var xy = _dereq_("./xy");


// ---------------------------------------------------------------------Triangle
/**
 * Triangle class.<br>
 * Triangle-based data structures are known to have better performance than
 * quad-edge structures.
 * See: J. Shewchuk, "Triangle: Engineering a 2D Quality Mesh Generator and
 * Delaunay Triangulator", "Triangulations in CGAL"
 *
 * @constructor
 * @struct
 * @param {!XY} pa  point object with {x,y}
 * @param {!XY} pb  point object with {x,y}
 * @param {!XY} pc  point object with {x,y}
 */
var Triangle = function(a, b, c) {
    /**
     * Triangle points
     * @private
     * @type {Array.<XY>}
     */
    this.points_ = [a, b, c];

    /**
     * Neighbor list
     * @private
     * @type {Array.<Triangle>}
     */
    this.neighbors_ = [null, null, null];

    /**
     * Has this triangle been marked as an interior triangle?
     * @private
     * @type {boolean}
     */
    this.interior_ = false;

    /**
     * Flags to determine if an edge is a Constrained edge
     * @private
     * @type {Array.<boolean>}
     */
    this.constrained_edge = [false, false, false];

    /**
     * Flags to determine if an edge is a Delauney edge
     * @private
     * @type {Array.<boolean>}
     */
    this.delaunay_edge = [false, false, false];
};

var p2s = xy.toString;
/**
 * For pretty printing ex. <code>"[(5;42)(10;20)(21;30)]"</code>.
 * @public
 * @return {string}
 */
Triangle.prototype.toString = function() {
    return ("[" + p2s(this.points_[0]) + p2s(this.points_[1]) + p2s(this.points_[2]) + "]");
};

/**
 * Get one vertice of the triangle.
 * The output triangles of a triangulation have vertices which are references
 * to the initial input points (not copies): any custom fields in the
 * initial points can be retrieved in the output triangles.
 * @example
 *      var contour = [{x:100, y:100, id:1}, {x:100, y:300, id:2}, {x:300, y:300, id:3}];
 *      var swctx = new poly2tri.SweepContext(contour);
 *      swctx.triangulate();
 *      var triangles = swctx.getTriangles();
 *      typeof triangles[0].getPoint(0).id
 *      // → "number"
 * @param {number} index - vertice index: 0, 1 or 2
 * @public
 * @returns {XY}
 */
Triangle.prototype.getPoint = function(index) {
    return this.points_[index];
};

/**
 * For backward compatibility
 * @function
 * @deprecated use {@linkcode Triangle#getPoint} instead
 */
Triangle.prototype.GetPoint = Triangle.prototype.getPoint;

/**
 * Get all 3 vertices of the triangle as an array
 * @public
 * @return {Array.<XY>}
 */
// Method added in the JavaScript version (was not present in the c++ version)
Triangle.prototype.getPoints = function() {
    return this.points_;
};

/**
 * @private
 * @param {number} index
 * @returns {?Triangle}
 */
Triangle.prototype.getNeighbor = function(index) {
    return this.neighbors_[index];
};

/**
 * Test if this Triangle contains the Point object given as parameter as one of its vertices.
 * Only point references are compared, not values.
 * @public
 * @param {XY} point - point object with {x,y}
 * @return {boolean} <code>True</code> if the Point object is of the Triangle's vertices,
 *         <code>false</code> otherwise.
 */
Triangle.prototype.containsPoint = function(point) {
    var points = this.points_;
    // Here we are comparing point references, not values
    return (point === points[0] || point === points[1] || point === points[2]);
};

/**
 * Test if this Triangle contains the Edge object given as parameter as its
 * bounding edges. Only point references are compared, not values.
 * @private
 * @param {Edge} edge
 * @return {boolean} <code>True</code> if the Edge object is of the Triangle's bounding
 *         edges, <code>false</code> otherwise.
 */
Triangle.prototype.containsEdge = function(edge) {
    return this.containsPoint(edge.p) && this.containsPoint(edge.q);
};

/**
 * Test if this Triangle contains the two Point objects given as parameters among its vertices.
 * Only point references are compared, not values.
 * @param {XY} p1 - point object with {x,y}
 * @param {XY} p2 - point object with {x,y}
 * @return {boolean}
 */
Triangle.prototype.containsPoints = function(p1, p2) {
    return this.containsPoint(p1) && this.containsPoint(p2);
};

/**
 * Has this triangle been marked as an interior triangle?
 * @returns {boolean}
 */
Triangle.prototype.isInterior = function() {
    return this.interior_;
};

/**
 * Mark this triangle as an interior triangle
 * @private
 * @param {boolean} interior
 * @returns {Triangle} this
 */
Triangle.prototype.setInterior = function(interior) {
    this.interior_ = interior;
    return this;
};

/**
 * Update neighbor pointers.
 * @private
 * @param {XY} p1 - point object with {x,y}
 * @param {XY} p2 - point object with {x,y}
 * @param {Triangle} t Triangle object.
 * @throws {Error} if can't find objects
 */
Triangle.prototype.markNeighborPointers = function(p1, p2, t) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if ((p1 === points[2] && p2 === points[1]) || (p1 === points[1] && p2 === points[2])) {
        this.neighbors_[0] = t;
    } else if ((p1 === points[0] && p2 === points[2]) || (p1 === points[2] && p2 === points[0])) {
        this.neighbors_[1] = t;
    } else if ((p1 === points[0] && p2 === points[1]) || (p1 === points[1] && p2 === points[0])) {
        this.neighbors_[2] = t;
    } else {
        throw new Error('poly2tri Invalid Triangle.markNeighborPointers() call');
    }
};

/**
 * Exhaustive search to update neighbor pointers
 * @private
 * @param {!Triangle} t
 */
Triangle.prototype.markNeighbor = function(t) {
    var points = this.points_;
    if (t.containsPoints(points[1], points[2])) {
        this.neighbors_[0] = t;
        t.markNeighborPointers(points[1], points[2], this);
    } else if (t.containsPoints(points[0], points[2])) {
        this.neighbors_[1] = t;
        t.markNeighborPointers(points[0], points[2], this);
    } else if (t.containsPoints(points[0], points[1])) {
        this.neighbors_[2] = t;
        t.markNeighborPointers(points[0], points[1], this);
    }
};


Triangle.prototype.clearNeighbors = function() {
    this.neighbors_[0] = null;
    this.neighbors_[1] = null;
    this.neighbors_[2] = null;
};

Triangle.prototype.clearDelaunayEdges = function() {
    this.delaunay_edge[0] = false;
    this.delaunay_edge[1] = false;
    this.delaunay_edge[2] = false;
};

/**
 * Returns the point clockwise to the given point.
 * @private
 * @param {XY} p - point object with {x,y}
 */
Triangle.prototype.pointCW = function(p) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if (p === points[0]) {
        return points[2];
    } else if (p === points[1]) {
        return points[0];
    } else if (p === points[2]) {
        return points[1];
    } else {
        return null;
    }
};

/**
 * Returns the point counter-clockwise to the given point.
 * @private
 * @param {XY} p - point object with {x,y}
 */
Triangle.prototype.pointCCW = function(p) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if (p === points[0]) {
        return points[1];
    } else if (p === points[1]) {
        return points[2];
    } else if (p === points[2]) {
        return points[0];
    } else {
        return null;
    }
};

/**
 * Returns the neighbor clockwise to given point.
 * @private
 * @param {XY} p - point object with {x,y}
 */
Triangle.prototype.neighborCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.neighbors_[1];
    } else if (p === this.points_[1]) {
        return this.neighbors_[2];
    } else {
        return this.neighbors_[0];
    }
};

/**
 * Returns the neighbor counter-clockwise to given point.
 * @private
 * @param {XY} p - point object with {x,y}
 */
Triangle.prototype.neighborCCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.neighbors_[2];
    } else if (p === this.points_[1]) {
        return this.neighbors_[0];
    } else {
        return this.neighbors_[1];
    }
};

Triangle.prototype.getConstrainedEdgeCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.constrained_edge[1];
    } else if (p === this.points_[1]) {
        return this.constrained_edge[2];
    } else {
        return this.constrained_edge[0];
    }
};

Triangle.prototype.getConstrainedEdgeCCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.constrained_edge[2];
    } else if (p === this.points_[1]) {
        return this.constrained_edge[0];
    } else {
        return this.constrained_edge[1];
    }
};

// Additional check from Java version (see issue #88)
Triangle.prototype.getConstrainedEdgeAcross = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.constrained_edge[0];
    } else if (p === this.points_[1]) {
        return this.constrained_edge[1];
    } else {
        return this.constrained_edge[2];
    }
};

Triangle.prototype.setConstrainedEdgeCW = function(p, ce) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        this.constrained_edge[1] = ce;
    } else if (p === this.points_[1]) {
        this.constrained_edge[2] = ce;
    } else {
        this.constrained_edge[0] = ce;
    }
};

Triangle.prototype.setConstrainedEdgeCCW = function(p, ce) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        this.constrained_edge[2] = ce;
    } else if (p === this.points_[1]) {
        this.constrained_edge[0] = ce;
    } else {
        this.constrained_edge[1] = ce;
    }
};

Triangle.prototype.getDelaunayEdgeCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.delaunay_edge[1];
    } else if (p === this.points_[1]) {
        return this.delaunay_edge[2];
    } else {
        return this.delaunay_edge[0];
    }
};

Triangle.prototype.getDelaunayEdgeCCW = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.delaunay_edge[2];
    } else if (p === this.points_[1]) {
        return this.delaunay_edge[0];
    } else {
        return this.delaunay_edge[1];
    }
};

Triangle.prototype.setDelaunayEdgeCW = function(p, e) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        this.delaunay_edge[1] = e;
    } else if (p === this.points_[1]) {
        this.delaunay_edge[2] = e;
    } else {
        this.delaunay_edge[0] = e;
    }
};

Triangle.prototype.setDelaunayEdgeCCW = function(p, e) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        this.delaunay_edge[2] = e;
    } else if (p === this.points_[1]) {
        this.delaunay_edge[0] = e;
    } else {
        this.delaunay_edge[1] = e;
    }
};

/**
 * The neighbor across to given point.
 * @private
 * @param {XY} p - point object with {x,y}
 * @returns {Triangle}
 */
Triangle.prototype.neighborAcross = function(p) {
    // Here we are comparing point references, not values
    if (p === this.points_[0]) {
        return this.neighbors_[0];
    } else if (p === this.points_[1]) {
        return this.neighbors_[1];
    } else {
        return this.neighbors_[2];
    }
};

/**
 * @private
 * @param {!Triangle} t Triangle object.
 * @param {XY} p - point object with {x,y}
 */
Triangle.prototype.oppositePoint = function(t, p) {
    var cw = t.pointCW(p);
    return this.pointCW(cw);
};

/**
 * Legalize triangle by rotating clockwise around oPoint
 * @private
 * @param {XY} opoint - point object with {x,y}
 * @param {XY} npoint - point object with {x,y}
 * @throws {Error} if oPoint can not be found
 */
Triangle.prototype.legalize = function(opoint, npoint) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if (opoint === points[0]) {
        points[1] = points[0];
        points[0] = points[2];
        points[2] = npoint;
    } else if (opoint === points[1]) {
        points[2] = points[1];
        points[1] = points[0];
        points[0] = npoint;
    } else if (opoint === points[2]) {
        points[0] = points[2];
        points[2] = points[1];
        points[1] = npoint;
    } else {
        throw new Error('poly2tri Invalid Triangle.legalize() call');
    }
};

/**
 * Returns the index of a point in the triangle. 
 * The point *must* be a reference to one of the triangle's vertices.
 * @private
 * @param {XY} p - point object with {x,y}
 * @returns {number} index 0, 1 or 2
 * @throws {Error} if p can not be found
 */
Triangle.prototype.index = function(p) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if (p === points[0]) {
        return 0;
    } else if (p === points[1]) {
        return 1;
    } else if (p === points[2]) {
        return 2;
    } else {
        throw new Error('poly2tri Invalid Triangle.index() call');
    }
};

/**
 * @private
 * @param {XY} p1 - point object with {x,y}
 * @param {XY} p2 - point object with {x,y}
 * @return {number} index 0, 1 or 2, or -1 if errror
 */
Triangle.prototype.edgeIndex = function(p1, p2) {
    var points = this.points_;
    // Here we are comparing point references, not values
    if (p1 === points[0]) {
        if (p2 === points[1]) {
            return 2;
        } else if (p2 === points[2]) {
            return 1;
        }
    } else if (p1 === points[1]) {
        if (p2 === points[2]) {
            return 0;
        } else if (p2 === points[0]) {
            return 2;
        }
    } else if (p1 === points[2]) {
        if (p2 === points[0]) {
            return 1;
        } else if (p2 === points[1]) {
            return 0;
        }
    }
    return -1;
};

/**
 * Mark an edge of this triangle as constrained.
 * @private
 * @param {number} index - edge index
 */
Triangle.prototype.markConstrainedEdgeByIndex = function(index) {
    this.constrained_edge[index] = true;
};
/**
 * Mark an edge of this triangle as constrained.
 * @private
 * @param {Edge} edge instance
 */
Triangle.prototype.markConstrainedEdgeByEdge = function(edge) {
    this.markConstrainedEdgeByPoints(edge.p, edge.q);
};
/**
 * Mark an edge of this triangle as constrained.
 * This method takes two Point instances defining the edge of the triangle.
 * @private
 * @param {XY} p - point object with {x,y}
 * @param {XY} q - point object with {x,y}
 */
Triangle.prototype.markConstrainedEdgeByPoints = function(p, q) {
    var points = this.points_;
    // Here we are comparing point references, not values        
    if ((q === points[0] && p === points[1]) || (q === points[1] && p === points[0])) {
        this.constrained_edge[2] = true;
    } else if ((q === points[0] && p === points[2]) || (q === points[2] && p === points[0])) {
        this.constrained_edge[1] = true;
    } else if ((q === points[1] && p === points[2]) || (q === points[2] && p === points[1])) {
        this.constrained_edge[0] = true;
    }
};


// ---------------------------------------------------------Exports (public API)

module.exports = Triangle;

},{"./xy":11}],10:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

"use strict";

/**
 * Precision to detect repeated or collinear points
 * @private
 * @const {number}
 * @default
 */
var EPSILON = 1e-12;
exports.EPSILON = EPSILON;

/**
 * @private
 * @enum {number}
 * @readonly
 */
var Orientation = {
    "CW": 1,
    "CCW": -1,
    "COLLINEAR": 0
};
exports.Orientation = Orientation;


/**
 * Formula to calculate signed area<br>
 * Positive if CCW<br>
 * Negative if CW<br>
 * 0 if collinear<br>
 * <pre>
 * A[P1,P2,P3]  =  (x1*y2 - y1*x2) + (x2*y3 - y2*x3) + (x3*y1 - y3*x1)
 *              =  (x1-x3)*(y2-y3) - (y1-y3)*(x2-x3)
 * </pre>
 *
 * @private
 * @param {!XY} pa  point object with {x,y}
 * @param {!XY} pb  point object with {x,y}
 * @param {!XY} pc  point object with {x,y}
 * @return {Orientation}
 */
function orient2d(pa, pb, pc) {
    var detleft = (pa.x - pc.x) * (pb.y - pc.y);
    var detright = (pa.y - pc.y) * (pb.x - pc.x);
    var val = detleft - detright;
    if (val > -(EPSILON) && val < (EPSILON)) {
        return Orientation.COLLINEAR;
    } else if (val > 0) {
        return Orientation.CCW;
    } else {
        return Orientation.CW;
    }
}
exports.orient2d = orient2d;


/**
 *
 * @private
 * @param {!XY} pa  point object with {x,y}
 * @param {!XY} pb  point object with {x,y}
 * @param {!XY} pc  point object with {x,y}
 * @param {!XY} pd  point object with {x,y}
 * @return {boolean}
 */
function inScanArea(pa, pb, pc, pd) {
    var oadb = (pa.x - pb.x) * (pd.y - pb.y) - (pd.x - pb.x) * (pa.y - pb.y);
    if (oadb >= -EPSILON) {
        return false;
    }

    var oadc = (pa.x - pc.x) * (pd.y - pc.y) - (pd.x - pc.x) * (pa.y - pc.y);
    if (oadc <= EPSILON) {
        return false;
    }
    return true;
}
exports.inScanArea = inScanArea;


/**
 * Check if the angle between (pa,pb) and (pa,pc) is obtuse i.e. (angle > π/2 || angle < -π/2)
 *
 * @private
 * @param {!XY} pa  point object with {x,y}
 * @param {!XY} pb  point object with {x,y}
 * @param {!XY} pc  point object with {x,y}
 * @return {boolean} true if angle is obtuse
 */
function isAngleObtuse(pa, pb, pc) {
    var ax = pb.x - pa.x;
    var ay = pb.y - pa.y;
    var bx = pc.x - pa.x;
    var by = pc.y - pa.y;
    return (ax * bx + ay * by) < 0;
}
exports.isAngleObtuse = isAngleObtuse;


},{}],11:[function(_dereq_,module,exports){
/*
 * Poly2Tri Copyright (c) 2009-2014, Poly2Tri Contributors
 * http://code.google.com/p/poly2tri/
 * 
 * poly2tri.js (JavaScript port) (c) 2009-2014, Poly2Tri Contributors
 * https://github.com/r3mi/poly2tri.js
 * 
 * All rights reserved.
 * 
 * Distributed under the 3-clause BSD License, see LICENSE.txt
 */

"use strict";

/**
 * The following functions operate on "Point" or any "Point like" object with {x,y},
 * as defined by the {@link XY} type
 * ([duck typing]{@link http://en.wikipedia.org/wiki/Duck_typing}).
 * @module
 * @private
 */

/**
 * poly2tri.js supports using custom point class instead of {@linkcode Point}.
 * Any "Point like" object with <code>{x, y}</code> attributes is supported
 * to initialize the SweepContext polylines and points
 * ([duck typing]{@link http://en.wikipedia.org/wiki/Duck_typing}).
 *
 * poly2tri.js might add extra fields to the point objects when computing the
 * triangulation : they are prefixed with <code>_p2t_</code> to avoid collisions
 * with fields in the custom class.
 *
 * @example
 *      var contour = [{x:100, y:100}, {x:100, y:300}, {x:300, y:300}, {x:300, y:100}];
 *      var swctx = new poly2tri.SweepContext(contour);
 *
 * @typedef {Object} XY
 * @property {number} x - x coordinate
 * @property {number} y - y coordinate
 */


/**
 * Point pretty printing : prints x and y coordinates.
 * @example
 *      xy.toStringBase({x:5, y:42})
 *      // → "(5;42)"
 * @protected
 * @param {!XY} p - point object with {x,y}
 * @returns {string} <code>"(x;y)"</code>
 */
function toStringBase(p) {
    return ("(" + p.x + ";" + p.y + ")");
}

/**
 * Point pretty printing. Delegates to the point's custom "toString()" method if exists,
 * else simply prints x and y coordinates.
 * @example
 *      xy.toString({x:5, y:42})
 *      // → "(5;42)"
 * @example
 *      xy.toString({x:5,y:42,toString:function() {return this.x+":"+this.y;}})
 *      // → "5:42"
 * @param {!XY} p - point object with {x,y}
 * @returns {string} <code>"(x;y)"</code>
 */
function toString(p) {
    // Try a custom toString first, and fallback to own implementation if none
    var s = p.toString();
    return (s === '[object Object]' ? toStringBase(p) : s);
}


/**
 * Compare two points component-wise. Ordered by y axis first, then x axis.
 * @param {!XY} a - point object with {x,y}
 * @param {!XY} b - point object with {x,y}
 * @return {number} <code>&lt; 0</code> if <code>a &lt; b</code>,
 *         <code>&gt; 0</code> if <code>a &gt; b</code>, 
 *         <code>0</code> otherwise.
 */
function compare(a, b) {
    if (a.y === b.y) {
        return a.x - b.x;
    } else {
        return a.y - b.y;
    }
}

/**
 * Test two Point objects for equality.
 * @param {!XY} a - point object with {x,y}
 * @param {!XY} b - point object with {x,y}
 * @return {boolean} <code>True</code> if <code>a == b</code>, <code>false</code> otherwise.
 */
function equals(a, b) {
    return a.x === b.x && a.y === b.y;
}


module.exports = {
    toString: toString,
    toStringBase: toStringBase,
    compare: compare,
    equals: equals
};

},{}]},{},[6])
(6)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/Lau/www/svjelly/src/core/ConfObject.js":[function(require,module,exports){
module.exports = {

	definition: 1,
	worldWidth: 20,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default:
		{
			structure: 'preciseHexaFill',
			innerStructureDef: 0.04,
			physics:
			{
				distanceConstraint:
				{
					stiffness: 500,
					relaxation: 0.1
				},
				nodeRadius: 0.1,
				mass: 1
			}
		},
		line:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 500,
					relaxation: 0.1
				},
				nodeRadius: 0.1,
				mass: 1
			}
		},
		hard:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard'
			}
		},
		noCollide:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard',
				noCollide: true
			}
		},
		cloud:
		{
			physics:
			{
				mass: 1,
				gravityScale: 0,
				bodyType: 'hard',
				noCollide: true
			}
		},
		metal:
		{

			physics:
			{
				mass: 10,
				bodyType: 'hard'
			}
		},
		balloon:
		{
			physics:
			{
				mass: 1,
				gravityScale: -1,
				bodyType: 'hard'
			}
		},
		static:
		{
			fixed: true,
			physics:
			{
				mass: 0,
				bodyType: 'hard'
			}
		},
		ghost:
		{
			physics:
			{
				bodyType: 'ghost'
			}
		}
	}
};


},{}],"/Users/Lau/www/svjelly/src/core/Grid.js":[function(require,module,exports){
var Grid =
{
	init: function ($graph)
	{
		this._graph = $graph;
		var nodesArray = this._nodesArray = [];
		this._graph.forEach(function ($line)
		{
			if ($line)
			{
				$line.forEach(function ($node)
				{
					if ($node) { nodesArray.push($node); }
				});
			}
		});
		return this;
	},

	createFromPolygon: function ($polygon, $def, $hexa)
	{
		var boundingBox = $polygon.getBoundingBox();

		var def = $def;
		//var def = width / $def;
		var toReturn = [];
		var yInc = $hexa ? def * (Math.sqrt(3) / 2) : def;
		var halfDef = def * 0.5;
		for (var yPos = boundingBox[0][1]; yPos <= boundingBox[1][1]; yPos += yInc)
		{
			var line = [];
			//var intersections = $polygon.getIntersectionsAtY(yPos);
			var xPos = boundingBox[0][0];
			xPos = ($hexa && toReturn.length % 2 !== 0) ? xPos + halfDef : xPos;
			for (xPos; xPos <= boundingBox[1][0] + halfDef; xPos += def)
			{
				if ($polygon.isInside([xPos, yPos])) { line.push([xPos, yPos]); }
				else { line.push(null); }
			}
			toReturn.push(line);
		}
		return Object.create(Grid).init(toReturn);
	},

	getGraph: function () { return this._graph; },

	getNodesArray: function () { return this._nodesArray; },

	getClosest: function ($x, $y, $size)
	{
		var size = $size || 1;
		var closest = this._nodesArray.concat();
		closest.sort(function ($a, $b)
		{
			if ($a === null || $b === null) { return true; }
			var sideX1 = Math.abs($a[0] - $x);
			var sideY1 = Math.abs($a[1] - $y);
			var dist1 = Math.sqrt(sideX1 * sideX1 + sideY1 * sideY1);

			var sideX2 = Math.abs($b[0] - $x);
			var sideY2 = Math.abs($b[1] - $y);
			var dist2 = Math.sqrt(sideX2 * sideX2 + sideY2 * sideY2);

			return dist1 - dist2;
		});
		return closest.slice(0, size);
	},

	getNeighbours: function ($x, $y, $returnEmpty)
	{
		var toReturn = [];
		var graph = this._graph;
		var even = $y % 2 > 0;
		var left = even ? $x : $x - 1;
		var right = even ? $x + 1 : $x;

		var NE = graph[$y - 1] && graph[$y - 1][right] ? graph[$y - 1][right] : null;
		var E = graph[$y + 0] && graph[$y + 0][$x + 1] ? graph[$y][$x + 1] : null;
		var SE = graph[$y + 1] && graph[$y + 1][right] ? graph[$y + 1][right] : null;
		var SW = graph[$y + 1] && graph[$y + 1][left] ? graph[$y + 1][left] : null;
		var W = graph[$y + 0] && graph[$y + 0][$x - 1] ? graph[$y][$x - 1] : null;
		var NW = graph[$y - 1] && graph[$y - 1][left] ? graph[$y - 1][left] : null;

		if (NE || $returnEmpty) { toReturn.push(NE); }
		if (E || $returnEmpty) { toReturn.push(E); }
		if (SE || $returnEmpty) { toReturn.push(SE); }
		if (SW || $returnEmpty) { toReturn.push(SW); }
		if (W || $returnEmpty) { toReturn.push(W); }
		if (NW || $returnEmpty) { toReturn.push(NW); }

		return toReturn;
	},

	getNetwork: function ()
	{
		var graph = this._graph;
		var network = [];
		var visited = [];
		var i = 0;
		var rowsLength = graph.length;
		for (i; i < rowsLength; i += 1)
		{
			var k = 0;
			var pointsLength = graph[i].length;
			for (k; k < pointsLength; k += 1)
			{
				var currPoint = graph[i][k];
				if (currPoint)
				{
					var currPointNeighbours = this.getNeighbours(k, i);
					for (var m = 0, neighboursLength = currPointNeighbours.length; m < neighboursLength; m += 1)
					{
						var currNeigh = currPointNeighbours[m];
						if (currNeigh && visited.indexOf(currNeigh) === -1)
						{
							network.push([currPoint, currNeigh]);
						}
					}
					visited.push(currPoint);
				}
			}
		}
		return network;
	},

	getOutline: function ()
	{
		if (!this.outline)
		{
			var graph = this._graph;
			var outlineGraph = [];
			for (var i = 0, rowsLength = graph.length; i < rowsLength; i += 1)
			{
				outlineGraph[i] = [];
				for (var k = 0, pointsLength = graph[i].length; k < pointsLength; k += 1)
				{
					var point = graph[i][k];
					outlineGraph[i][k] = null;
					if (point)
					{
						var isEdge = this.getNeighbours(k, i).length < 6;
						if (isEdge)
						{
							outlineGraph[i][k] = [k, i];
						}
					}
				}
			}
			this.outline = Object.create(Grid).init(outlineGraph);
		}

		return this.outline;
	},

	getShapePath: function ()
	{
		var path = [];
		var currentOutline = this.getOutlines()[0];
		var outlineGraph = currentOutline.getGraph();
		var getStartingIndex = function ()
		{
			for (var i = 0, length = outlineGraph.length; i < length; i += 1)
			{
				if (!outlineGraph[i]) { continue; }
				for (var k = 0, pointsLength = outlineGraph[i].length; k < pointsLength; k += 1)
				{
					var currPoint = outlineGraph[i][k];
					if (currPoint)
					{
						console.log(currPoint, currentOutline.getNeighbours(currPoint[0], currPoint[1]));
					}
					if (currPoint && currentOutline.getNeighbours(currPoint[0], currPoint[1]).length === 2)
					{
						return currPoint;
					}
				}
			}
		};

		var visited = [];
		var startingIndex = getStartingIndex.call(this);
		console.log(startingIndex);
		debugger;
		if (!startingIndex) { return; }

		var getAngle = function ($index)
		{
			var angle = ($index + 1) * 60;
			angle = angle === 0 ? 360 : angle;
			return angle;
		};
		var getNeighbourIndex = function ($point, $neighbour)
		{
			return currentOutline.getNeighbours($point[0], $point[1], true).indexOf($neighbour);
		};

		var next = currentOutline.getNeighbours(startingIndex[0], startingIndex[1])[0];
		var lastAngle = getAngle(getNeighbourIndex(startingIndex, next));
		var currIndex = next;
		path.push(this._graph[startingIndex[1]][startingIndex[0]]);
		path.push(this._graph[next[1]][next[0]]);
		visited.push(startingIndex);

		var best;
		var neighbours;
		var bestAngle;
		var outlineNodesArray = currentOutline.getNodesArray();
		var outlinePointsLength = outlineNodesArray.length;

		while (visited.length < outlinePointsLength - 1)//currIndex !== startingIndex)
		{
			neighbours = currentOutline.getNeighbours(currIndex[0], currIndex[1]);
			var bestScore = 0;
			best = undefined;

			for (var i = 0, length = neighbours.length; i < length; i += 1)
			{
				var currNeigh = neighbours[i];
				var currScore = 0;
				var currAngle = getAngle(getNeighbourIndex(currIndex, currNeigh));
				currScore = currAngle - lastAngle;
				if (currScore > 180) { currScore = currScore - 360; }
				if (currScore < -180) { currScore = currScore + 360; }
				var neighIndex = visited.indexOf(currNeigh);
				if (neighIndex !== -1) { currScore = neighIndex / visited.length * 10000 + 10000 + currScore; }
				if (!best || currScore < bestScore)
				{
					bestScore = currScore;
					best = currNeigh;
					bestAngle = currAngle;
				}
			}
			lastAngle = bestAngle;
			if (visited.indexOf(currIndex) !== -1) { visited.splice(visited.indexOf(currIndex), 1); }
			visited.push(currIndex);
			currIndex = best;

			path.push(this._graph[currIndex[1]][currIndex[0]]);
		}
		return path;
	},

	getOutlines: function ()
	{
		var toReturn = [];
		var currentGraph;
		var outline = this.getOutline();
		var remaining = outline.getNodesArray().concat();

		var recur = function ($point)
		{
			currentGraph[$point[1]] = currentGraph[$point[1]] || [];
			currentGraph[$point[1]][$point[0]] = $point;
			var neighbours = outline.getNeighbours($point[0], $point[1]);
			remaining.splice(remaining.indexOf($point), 1);
			for (var i = 0, length = neighbours.length; i < length; i += 1)
			{
				var neigh = neighbours[i];
				if (remaining.indexOf(neigh) !== -1) { recur(neigh); }
			}
		};

		while (remaining.length)
		{
			currentGraph = [];
			var startingPoint = remaining[0];
			recur(startingPoint);
			toReturn.push(Object.create(Grid).init(currentGraph));
		}
		return toReturn;
	}
};

module.exports = Grid;


},{}],"/Users/Lau/www/svjelly/src/core/Polygon.js":[function(require,module,exports){
var Polygon =
{
	init: function ($points)
	{
		var polygon = Object.create(Polygon);
		polygon.points = $points;
		polygon._boundingBox = undefined;
		return polygon;
	},

	getArea: function ()
	{
		var sumA = 0;
		var sumB = 0;
		for (var i = 0, length = this.points.length; i < length; i += 1)
		{
			var currPoint = this.points[i];
			var next = i === length - 1 ? this.points[0] : this.points[i + 1];
			sumA += currPoint[0] * next[1];
			sumB += currPoint[1] * next[0];
		}

		return Math.abs((sumA - sumB) * 0.5);
	},

	getBoundingBox: function ()
	{
		if (!this._boundingBox)
		{
			var minX = this.points[0][0];
			var maxX = minX;
			var minY = this.points[0][1];
			var maxY = minY;

			for (var i = 0, length = this.points.length; i < length; i += 1)
			{
				var point = this.points[i];
				minX = Math.min(minX, point[0]);
				maxX = Math.max(maxX, point[0]);
				minY = Math.min(minY, point[1]);
				maxY = Math.max(maxY, point[1]);
			}
			this._boundingBox = [[minX, minY], [maxX, maxY]];
		}
		return this._boundingBox;
	},

	getSegments: function ()
	{
		var segments = [];
		for (var i = 0, length = this.points.length - 1; i < length; i += 1)
		{
			segments.push([this.points[i], this.points[i + 1]]);
		}
		segments.push([this.points[this.points.length - 1], this.points[0]]);
		return segments;
	},

	getIntersectionsAtY: function ($testY)
	{
		var segments = this.getSegments();
		var intersections = [];
		for (var i = 0, length = segments.length; i < length; i += 1)
		{
			var currSegment = segments[i];
			var x1 = currSegment[0][0];
			var y1 = currSegment[0][1];
			var x2 = currSegment[1][0];
			var y2 = currSegment[1][1];
			var smallY = Math.min(y1, y2);
			var bigY = Math.max(y1, y2);

			if ($testY > smallY && $testY < bigY)
			{
				var pY = y2 - $testY;
				var segY = y2 - y1;
				var segX = x2 - x1;
				var pX = pY * segX / segY;
				intersections.push(x2 - pX);
			}
		}
		return intersections;
	},

	isInside: function ($point)
	{
		var infNumber = 0;
		var intersections = this.getIntersectionsAtY($point[1]);
		for (var i = 0, length = intersections.length; i < length; i += 1)
		{
			if ($point[0] < intersections[i]) { infNumber += 1; }
		}
		return infNumber % 2 > 0;
	}
};

module.exports = Polygon;


},{}],"/Users/Lau/www/svjelly/src/core/SVGParser.js":[function(require,module,exports){

var SVGParser = function () {};
//var isPolygon = /polygon|rect/ig;
var isLine = /polyline|line|path/ig;
var lineTags = 'polyline, line, path';

SVGParser.prototype.parse = function ($world, $SVG)
{
	this.SVG = $SVG;
	this.viewBoxWidth = Number(this.SVG.getAttribute('viewBox').split(' ')[2]);
	this.viewBoxHeight = Number(this.SVG.getAttribute('viewBox').split(' ')[3]);
	this.ratio = $world.getWidth() / this.viewBoxWidth;
	this.world = $world;
	this.world.setHeight(this.viewBoxHeight * this.ratio);

	//temp
	var elementsQuery = '*:not(g):not(linearGradient):not(radialGradient):not(stop):not([id*="joint"]):not([id*="constraint"])';
	var elemRaws = this.SVG.querySelectorAll(elementsQuery);

	var i = 0;
	var rawGroupPairings = [];
	var elemsLength = elemRaws.length;

	for (i = 0; i < elemsLength; i += 1)
	{
		var rawElement = elemRaws[i];
		//if (rawElement.nodeType === 3) { continue; }
		var groupInfos = this.getGroupInfos(rawElement);
		var currGroup = $world.createGroup(groupInfos.type, groupInfos.ID);

		//var elements = rawElement;
		//this.parseElements(elements, currGroup);

		var element = this.parseElement(rawElement);
		var nodesToDraw = currGroup.structure.create(element);
		this.setGraphicInstructions(currGroup, rawElement, nodesToDraw, element);

		// var hasGroup;
		// for (var k = 0, length = rawGroupPairings.length; k < length; k += 1)
		// {
		// 	var curr = rawGroupPairings[k];
		// 	if (curr.group === currGroup)
		// 	{
		// 		hasGroup = true;
		// 		break;
		// 	}
		// }
		// if (!hasGroup) { rawGroupPairings.push({ group: currGroup, raw: rawElement.parentNode }); }
		rawGroupPairings.push({ group: currGroup, raw: rawElement.parentNode });
	}

	var pairingsLength = rawGroupPairings.length;
	for (i = 0; i < pairingsLength; i += 1)
	{
		var pairing = rawGroupPairings[i];
		// this.parseAnchors(pairing.raw, pairing.group);
		this.parseConstraints(pairing.raw, pairing.group);
		this.parseCustomJoints(pairing.raw, pairing.group);
	}

	this.world.addGroupsToWorld();
};

SVGParser.prototype.getGroupInfos = function ($rawGroup)
{
	var groupElement = !$rawGroup.id && $rawGroup.parentNode.tagName !== 'svg' ? $rawGroup.parentNode : $rawGroup;
	var type;
	var ID;
	var regex = /([a-z\d]+)\w*/igm;
	var first = regex.exec(groupElement.id);
	var second = regex.exec(groupElement.id);
	//if (first) { type = second ? second[1] : first[1]; }
	//var groupType = groupElement.id.match();
	//if (groupType) { return groupType[1] || groupType[0]; }
	//automatic for lines
	if (!first && (groupElement.querySelectorAll(lineTags).length > 0 || groupElement.tagName.search(isLine) > -1))
	{
		type = 'line';
	}
	type = first ? first[1] : undefined;
	ID = second ? second[1] : null;

	return { ID: ID, type: type };
};

SVGParser.prototype.parseConstraints = function ($rawGroup, $group)
{
	var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	{
		if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/constraint/i) < 0) { continue; }
		var currConstraint = children[i];
		var result = /constraint-([a-z\d]*)/ig.exec(currConstraint.id);

		var parentGroupID = result ? result[1] : undefined;
		var parentGroup = parentGroupID ? this.world.getGroupByID(parentGroupID) : undefined;
		var points = this.parseElement(currConstraint).points;
		// console.log($group.ID, parentGroup ? parentGroup.ID : undefined);
		this.world.constrainGroups($group, parentGroup, points);
	}
};

SVGParser.prototype.parseElements = function ($elements, $group)
{
	for (var i = 0, elementsLength = $elements.length; i < elementsLength; i += 1)
	{
		var rawElement = $elements[i];

		var element = this.parseElement(rawElement);

		var nodesToDraw = $group.structure.create(element);
		this.setGraphicInstructions($group, rawElement, nodesToDraw, element);
	}
};

SVGParser.prototype.parseElement = function ($rawElement)
{
	var tagName = $rawElement.tagName;

	switch (tagName)
	{
		case 'line':
			return this.parseLine($rawElement);
		case 'rect':
			return this.parseRect($rawElement);

		case 'polygon':
		case 'polyline':
			return this.parsePoly($rawElement);

		case 'path':
			return this.parsePath($rawElement);

		case 'circle':
			return this.parseCircle($rawElement);
	}
};

SVGParser.prototype.setGraphicInstructions = function ($group, $rawElement, $nodes)
{
	for (var i = 0, length = $nodes.length; i < length; i += 1)
	{
		var currNode = $nodes[i];
		currNode.drawing = {};
		$group.nodes.splice($group.nodes.indexOf(currNode), 1);
		$group.nodes.splice(i, 0, currNode);
		// console.log($group.nodes.indexOf(currNode));
		// debugger;
	}
	var startNode = $nodes[0];
	var endNode = $nodes[$nodes.length - 1];

	var fill = $rawElement.getAttribute('fill') || '#000000';
	var stroke = $rawElement.getAttribute('stroke') || 'none';
	var lineWidth = $rawElement.getAttribute('stroke-width');
	var opacity = $rawElement.getAttribute('opacity');
	startNode.drawing.fill = fill;//fill === undefined ? 'none' : fill;
	startNode.drawing.stroke = stroke;
	startNode.drawing.radius = $group.structureProperties.radius / this.ratio;
	startNode.drawing.lineWidth = lineWidth * this.ratio || 1 * this.ratio;//lineWidth === undefined ? 'none' : lineWidth * this.ratio;
	startNode.drawing.lineCap = $rawElement.getAttribute('stroke-linecap') || 'round';
	startNode.drawing.lineJoin = $rawElement.getAttribute('stroke-linejoin') || 'round';
	startNode.drawing.opacity = opacity ? opacity : undefined;
	startNode.drawing.closePath = $group.type !== 'line' && $group.structureProperties.radius === undefined;

	startNode.drawing.strokeGradient = this.getGradient(stroke);
	startNode.drawing.fillGradient = this.getGradient(fill);

	startNode.endNode = endNode;
	startNode.isStart = true;
};

SVGParser.prototype.getGradient = function ($value)
{
	var gradientID = /url\(#(.*)\)/im.exec($value);
	if (gradientID)
	{
		var gradientElement = this.SVG.querySelector('#' + gradientID[1]);
		if (gradientElement.tagName !== 'linearGradient' && gradientElement.tagName !== 'radialGradient') { return; }

		var gradient = { stops: [], type: gradientElement.tagName };

		if (gradientElement.tagName === 'linearGradient')
		{
			gradient.x1 = this.getCoordX(gradientElement.getAttribute('x1'));
			gradient.y1 = this.getCoordX(gradientElement.getAttribute('y1'));
			gradient.x2 = this.getCoordX(gradientElement.getAttribute('x2'));
			gradient.y2 = this.getCoordX(gradientElement.getAttribute('y2'));
		}
		if (gradientElement.tagName === 'radialGradient')
		{
			gradient.cx = this.getCoordX(gradientElement.getAttribute('cx'));
			gradient.cy = this.getCoordX(gradientElement.getAttribute('cy'));
			gradient.fx = this.getCoordX(gradientElement.getAttribute('fx'));
			gradient.fy = this.getCoordX(gradientElement.getAttribute('fy'));
			gradient.r = this.getCoordX(gradientElement.getAttribute('r'));
		}

		var stops = gradientElement.querySelectorAll('stop');
		for (var k = 0, stopLength = stops.length; k < stopLength; k += 1)
		{
			var currStop = stops[k];
			var offset = Number(currStop.getAttribute('offset'));
			var color = /stop-color:(#[0-9A-F]+)/im.exec(currStop.getAttribute('style'))[1];
			gradient.stops.push({ offset: offset, color: color });
		}

		return gradient;
	}
};

SVGParser.prototype.parseCircle = function ($rawCircle)
{
	var xPos = this.getCoordX($rawCircle.getAttribute('cx'));
	var yPos = this.getCoordY($rawCircle.getAttribute('cy'));
	var radius = this.getCoordX($rawCircle.getAttribute('r'));
	return { type: 'circle', points: [[xPos, yPos]], radius: radius };
};

SVGParser.prototype.parseLine = function ($rawLine)
{
	var x1 = this.getCoordX($rawLine.getAttribute('x1'));
	var x2 = this.getCoordX($rawLine.getAttribute('x2'));
	var y1 = this.getCoordX($rawLine.getAttribute('y1'));
	var y2 = this.getCoordX($rawLine.getAttribute('y2'));
	var points = [];
	points.push([x1, y1]);
	points.push([x2, y2]);
	var thickness = this.getCoordX($rawLine.getAttribute('stroke-width'));
	return { type: 'line', points: points, thickness: thickness };
};

SVGParser.prototype.parseRect = function ($rawRect)
{
	var x1 = $rawRect.getAttribute('x') ? this.getCoordX($rawRect.getAttribute('x')) : 0;
	var y1 = $rawRect.getAttribute('y') ? this.getCoordY($rawRect.getAttribute('y')) : 0;
	var x2 = x1 + this.getCoordX($rawRect.getAttribute('width'));
	var y2 = y1 + this.getCoordY($rawRect.getAttribute('height'));
	var points = [];
	points.push([x1, y1]);
	points.push([x1, y2]);
	points.push([x2, y2]);
	points.push([x2, y1]);

	return { type: 'polygon', points: points };
};

SVGParser.prototype.parsePoly = function ($rawPoly)
{
	var splits = $rawPoly.getAttribute('points').split(' ');
	var points = [];

	for (var i = 0, splitsLength = splits.length; i < splitsLength; i += 1)
	{
		var currSplit = splits[i];

		if (currSplit !== '')
		{
			var point = currSplit.split(',');
			var pointX = this.getCoordX(point[0]);
			var pointY = this.getCoordY(point[1]);
			var exists = false;
			for (var k = 0, otherCoordsArrayLength = points.length; k < otherCoordsArrayLength; k += 1)
			{
				var otherPoint = points[k];
				var otherX = otherPoint[0];
				var otherY = otherPoint[1];
				if (otherX === pointX && otherY === pointY)
				{
					exists = true;
				}
			}
			if (exists === false)
			{
				points.push([pointX, pointY]);
			}
		}
	}

	var thickness = this.getCoordX($rawPoly.getAttribute('stroke-width'));
	var type = $rawPoly.tagName === 'polyline' ? 'line' : 'polygon';
	return { type: type, points: points, thickness: thickness };
};

SVGParser.prototype.parsePath = function ($rawPath)
{
	var d = $rawPath.getAttribute('d');
	var pathReg = /([mlscvh])(-?[\d\.]*[,-]+[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*)/igm;
	var points = [];
	var lastCoordX = this.getCoordX(0);
	var lastCoordY = this.getCoordY(0);
	for (var array = pathReg.exec(d); array !== null; array = pathReg.exec(d))
	{
		var coordString;
		var numberCoordX;
		var numberCoordY;
		if (array[1] === 'v')
		{
			numberCoordX = lastCoordX;
			numberCoordY = lastCoordY + this.getCoordY(array[2]);
		}
		else if (array[1] === 'h')
		{
			numberCoordX = lastCoordX + this.getCoordY(array[2]);
			numberCoordY = lastCoordY;
		}
		else
		{
			if (array[4] !== '')
			{
				coordString = array[4];
			}
			else if (array[3] !== '')
			{
				coordString = array[3];
			}
			else
			{
				coordString = array[2];
			}
			var coordReg = /(-?\d+\.?\d*)/igm;
			var coords = coordString.match(coordReg);

			numberCoordX = lastCoordX + this.getCoordX(coords[0]);
			numberCoordY = lastCoordY + this.getCoordY(coords[1]);
		}
		//console.log(numberCoordX, numberCoordY);
		points.push([numberCoordX, numberCoordY]);

		lastCoordX = numberCoordX;
		lastCoordY = numberCoordY;
	}

	var thickness = this.getCoordX($rawPath.getAttribute('stroke-width'));
	return { type: 'line', points: points, thickness: thickness };
};

SVGParser.prototype.round = function ($number)
{
	// var number = Number($number);
	// return Math.floor(number * 100) / 100;
	return $number;
	//return Math.floor(Number($number));
};

SVGParser.prototype.getCoordX = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

SVGParser.prototype.getCoordY = function ($coordSTR)
{
	var number = this.round($coordSTR);
	//number = this.viewBoxHeight - number;
	return number * this.ratio;
};

SVGParser.prototype.parseCustomJoints = function ($rawGroup, $group)
{
	var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	{
		if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/joint/i) < 0) { continue; }

		var currRawJoint = children[i];
		var p1x = this.getCoordX(currRawJoint.getAttribute('x1'));
		var p1y = this.getCoordY(currRawJoint.getAttribute('y1'));
		var p2x = this.getCoordX(currRawJoint.getAttribute('x2'));
		var p2y = this.getCoordY(currRawJoint.getAttribute('y2'));

		var n1 = $group.getNodeAtPoint(p1x, p1y) || $group.createNode(p1x, p1y);
		var n2 = $group.getNodeAtPoint(p2x, p2y) || $group.createNode(p2x, p2y);
		$group.createJoint(n1, n2);
	}
};

module.exports = SVGParser;


},{}],"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js":[function(require,module,exports){
var SVJellyNode = require('./SVJellyNode');
var SVJellyJoint = require('./SVJellyJoint');

var SVJellyGroup = function ($type, $conf, $ID)
{
	this.physicsManager = undefined;
	this.structure = undefined;
	this.conf = $conf;
	this.type = $type;
	this.nodes = [];
	this.joints = [];
	this.ID = $ID;
};

SVJellyGroup.prototype.getNodeAtPoint = function ($x, $y)
{
	for (var i = 0, nodesLength = this.nodes.length; i < nodesLength; i += 1)
	{
		var node = this.nodes[i];

		if (node.oX === $x && node.oY === $y)
		{
			return node;
		}
	}
};

SVJellyGroup.prototype.createNode = function ($px, $py, $options, $overwrite)
{
	var node = this.getNodeAtPoint($px, $py);
	if (node !== undefined && $overwrite)
	{
		node.setOptions($options);
	}
	else
	{
		node = new SVJellyNode($px, $py, $options);
		this.nodes.push(node);
	}

	//this.physicsManager.addNodeToWorld(node);

	return node;
};

SVJellyGroup.prototype.getClosestPoint = function ($points, $nodes)
{
	var nodes = $nodes || this.nodes;
	var closestDist = Infinity;
	var closestPoint;
	var closestNode;
	var closestOffsetX;
	var closestOffsetY;

	for (var i = 0, length = $points.length; i < length; i += 1)
	{
		var currPoint = $points[i];
		for (var k = 0, nodesLength = nodes.length; k < nodesLength; k += 1)
		{
			var currNode = nodes[k];
			var offsetX = currPoint[0] - currNode.oX;
			var offsetY = currPoint[1] - currNode.oY;
			var cX = Math.abs(offsetX);
			var cY = Math.abs(offsetY);
			var dist = Math.sqrt(cX * cX + cY * cY);
			if (dist < closestDist)
			{
				closestNode = currNode;
				closestPoint = currPoint;
				closestDist = dist;
				closestOffsetX = offsetX;
				closestOffsetY = offsetY;
			}
		}
	}

	return closestPoint;
};

SVJellyGroup.prototype.getClosestNode = function ($coord, $nodes)
{
	var nodes = $nodes || this.nodes;
	var closestDist = Infinity;
	var closest;
	for (var i = 0, length = nodes.length; i < length; i += 1)
	{
		var node = nodes[i];
		var offsetX = $coord[0] - node.oX;
		var offsetY = $coord[1] - node.oY;
		var cX = Math.abs(offsetX);
		var cY = Math.abs(offsetY);
		var dist = Math.sqrt(cX * cX + cY * cY);
		if (dist < closestDist)
		{
			closest = node;
			closestDist = dist;
		}
	}
	return closest;
};

SVJellyGroup.prototype.getNodesInside = function ($points)
{
	var Polygon = require('./Polygon');
	var toReturn = [];
	var polygon = Polygon.init($points);
	for (var i = 0, length = this.nodes.length; i < length; i += 1)
	{
		var node = this.nodes[i];
		if (polygon.isInside([node.oX, node.oY]))
		{
			toReturn.push(node);
		}
	}
	return toReturn;
};

SVJellyGroup.prototype.getBoundingBox = function ()
{
	var minX;
	var maxX;
	var minY;
	var maxY;
	for (var i = 0, length = this.nodes.length; i < length; i += 1)
	{
		var node = this.nodes[i];
		minX = minX > node.oX || minX === undefined ? node.oX : minX;
		maxX = maxX < node.oX || maxX === undefined ? node.oX : maxX;
		minY = minY > node.oY || minY === undefined ? node.oY : minY;
		maxY = maxY < node.oY || maxY === undefined ? node.oY : maxY;
	}
	return [[minX, minY], [maxX, maxY]];
};

//TODO : to remove
SVJellyGroup.prototype.hitTest = function ($point)
{
	var currX = $point[0];
	var currY = $point[1];
	var bounding = this.getBoundingBox();
	if (currX >= bounding[0][0] && currX <= bounding[1][0] &&
		currY >= bounding[0][1] && currY <= bounding[1][1])
	{
		return true;
	}
	return false;
};

SVJellyGroup.prototype.createJoint = function ($node1, $node2)
{
	for (var i = 0, jointsLength = this.joints.length; i < jointsLength; i += 1)
	{
		var currJoint = this.joints[i];
		if ((currJoint.node1 === $node1 && currJoint.node2 === $node2) || (currJoint.node2 === $node1 && currJoint.node1 === $node2))
		{
			return;
		}
	}

	var joint = new SVJellyJoint($node1, $node2);

	this.joints.push(joint);

	//this.physicsManager.addJointToWorld(joint);
};

SVJellyGroup.prototype.createNodesFromPoints = function ($coordsArray)
{
	var coordsArrayLength = $coordsArray.length;
	var toReturn = [];
	for (var i = 0; i < coordsArrayLength; i += 1)
	{
		var currPoint = $coordsArray[i];
		toReturn.push(this.createNode(currPoint[0], currPoint[1], undefined, false));
	}
	return toReturn;
};

SVJellyGroup.prototype.getBestMatchForGroupConstraint = function ($points, $anchor)
{
	return this.physicsManager.getBestMatchForGroupConstraint($points, $anchor);
};

SVJellyGroup.prototype.createJointsFromPoints = function ($coordsArray, $noClose)
{
	var coordsArrayLength = $coordsArray.length;
	for (var i = 1; i < coordsArrayLength; i += 1)
	{
		var currPoint = $coordsArray[i];
		var lastPoint = $coordsArray[i - 1];
		var lastNode = this.getNodeAtPoint(lastPoint[0], lastPoint[1]);
		var currNode = this.getNodeAtPoint(currPoint[0], currPoint[1]);
		this.createJoint(lastNode, currNode);
		if (i === coordsArrayLength - 1 && $noClose !== true)
		{
			var firstNode = this.getNodeAtPoint($coordsArray[0][0], $coordsArray[0][1]);
			this.createJoint(currNode, firstNode);
		}
	}
};

SVJellyGroup.prototype.addNodesToWorld = function ()
{
	this.physicsManager.addNodesToWorld();
};

SVJellyGroup.prototype.addJointsToWorld = function ()
{
	this.physicsManager.addJointsToWorld();
};

module.exports = SVJellyGroup;


},{"./Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js"}],"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js":[function(require,module,exports){
var SVJellyJoint = function ($node1, $node2)
{
	this.node1 = $node1;
	this.node2 = $node2;
};

module.exports = SVJellyJoint;


},{}],"/Users/Lau/www/svjelly/src/core/SVJellyNode.js":[function(require,module,exports){
var SVJellyNode = function ($oX, $oY, $options)
{
	this.jointsArray = [];
	this.oX = $oX;
	this.oY = $oY;
	this.drawing = undefined;
	this.fixed = false;
	this.isStart = false;
	this.endNode = undefined;
	this.setOptions($options);
};

//raccourci
SVJellyNode.prototype.setOptions = function ($options)
{
	if ($options)
	{
		// var = $ === undefined ? {} : $options;
		if ($options.fixed !== undefined) { this.fixed = $options.fixed; }
	}
};

SVJellyNode.prototype.setFixed = function ($fixed)
{
	this.fixed = $fixed;
	this.physicsManager.setFixed($fixed);
};

SVJellyNode.prototype.getX = function ()
{
	return this.physicsManager.getX();
};

//raccourci
SVJellyNode.prototype.getY = function ()
{
	return this.physicsManager.getY();
};

module.exports = SVJellyNode;


},{}],"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js":[function(require,module,exports){
module.exports = {
	extend: function ($toExtend, $extension)
	{
		var recur = function ($object, $extend)
		{
			for (var name in $extend)
			{
				if (typeof $extend[name] === 'object' && !Array.isArray($extend[name]) && $extend[name] !== null)
				{
					if ($object[name] === undefined) { $object[name] = {}; }
					recur($object[name], $extend[name]);
				}
				else
				{
					$object[name] = $extend[name];
				}
			}
		};
		recur($toExtend, $extension);

		return $toExtend;
	}
};


},{}],"/Users/Lau/www/svjelly/src/core/SVJellyWorld.js":[function(require,module,exports){
var SVJellyGroup = require('./SVJellyGroup');
var Structure = require('./Structure');

var SVJellyWorld = function ($physicsManager, $conf)
{
	this.physicsManager = $physicsManager;
	this.groupsArray = [];
	this.conf = $conf;
	this.worldNodes = [];
	this.groupConstraints = [];
	this.worldWidth = this.physicsManager.worldWidth = $conf.worldWidth;
};

SVJellyWorld.prototype.setHeight = function ($height)
{
	this.worldHeight = this.physicsManager.worldHeight = $height;
};

SVJellyWorld.prototype.getWidth = function ()
{
	return this.worldWidth;
};

SVJellyWorld.prototype.getGroupByID = function ($ID)
{
	for (var i = 0, length = this.groupsArray.length; i < length; i += 1)
	{
		var currGroup = this.groupsArray[i];
		if (currGroup.ID === $ID) { return currGroup; }
	}
};

SVJellyWorld.prototype.createGroup = function ($type, $ID)
{
	var type = $type || 'default';
	var group = new SVJellyGroup(type, this.conf.groups[type], $ID);
	group.physicsManager = this.physicsManager.getGroupPhysicsManager(group);
	group.structure = new Structure(group, this);
	this.groupsArray.push(group);
	return group;
};

SVJellyWorld.prototype.constrainGroups = function ($groupA, $groupB, $points)
{
	var points = $points;
	var groupA = $groupA;
	var groupB = $groupB;

	if (points.length < 3)
	{
		var anchorA = groupA.physicsManager.createAnchorFromLine(points);
		points.splice(points.indexOf(anchorA.point), 1);
		var anchorB = groupB ? groupB.physicsManager.createAnchorFromPoint(points[0]) : this.physicsManager.getAnchorPhysicsManager(points[0]);
		this.groupConstraints.push({ anchorA: anchorA, anchorB: anchorB });
	}
	else
	{
		var anchorsA = groupA.physicsManager.createAnchors(points);
		//console.log('A', groupA.ID, anchorsA.length, 'B', groupB ? groupB.ID : groupB);
		for (var i = 0, nodesLength = anchorsA.length; i < nodesLength; i += 1)
		{
			var currAnchorA = anchorsA[i];
			if (!groupB)
			{
				currAnchorA.setFixed(true);
			}
			else
			{
				var anchorsB = groupB.physicsManager.createAnchors(points);
				for (var k = 0, anchorsBLength = anchorsB.length; k < anchorsBLength; k += 1)
				{
					var currAnchorB = anchorsB[k];
					this.groupConstraints.push({ anchorA: currAnchorA, anchorB: currAnchorB });
				}
			}
		}
	}
};

SVJellyWorld.prototype.addGroupsToWorld = function ()
{
	for (var i = 0, groupsArrayLength = this.groupsArray.length; i < groupsArrayLength; i += 1)
	{
		var currGroup = this.groupsArray[i];
		currGroup.addNodesToWorld();
		currGroup.addJointsToWorld();
		this.worldNodes = this.worldNodes.concat(currGroup.nodes);
	}

	var toConstrainLength = this.groupConstraints.length;
	for (i = 0; i < toConstrainLength; i += 1)
	{
		var currToConstrain = this.groupConstraints[i];
		this.physicsManager.constrainGroups(currToConstrain.anchorA, currToConstrain.anchorB);
	}
};

module.exports = SVJellyWorld;


},{"./SVJellyGroup":"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js","./Structure":"/Users/Lau/www/svjelly/src/core/Structure.js"}],"/Users/Lau/www/svjelly/src/core/Structure.js":[function(require,module,exports){
var Triangulator = require('./Triangulator');
var Polygon = require('./Polygon');
var Grid = require('./Grid');

var Structure = function ($group, $world)
{
	this.world = $world;
	this.group = $group;
	this.innerStructure = undefined;
};

Structure.prototype.create = function ($properties)
{
	var nodesToDraw;
	var points = $properties.points;
	this.group.structureProperties = $properties;

	if ($properties.type === 'polygon')
	{
		var polygon = Polygon.init(points);
		this.group.structureProperties.area = polygon.getArea();
	}
	else if ($properties.type === 'line')
	{
		var area = 0;
		for (var i = 1, length = this.points.length; i < length; i += 1)
		{
			var currPoint = this.points[i];
			var lastPoint = this.points[i - 1];
			var dX = Math.abs(currPoint[0] - lastPoint[0]);
			var dY = Math.abs(currPoint[1] - lastPoint[1]);
			area += Math.sqrt(dX * dX + dY * dY);
		}
		this.group.structureProperties.area = area;
	}
	else if ($properties.type === 'circle')
	{
		this.group.structureProperties.area = Math.pow(Math.PI * $properties.radius, 2);
	}

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			nodesToDraw = this.group.createNodesFromPoints(points);
			this.createJointsFromTriangles(points);
			break;
		case 'line':
			nodesToDraw = this.group.createNodesFromPoints(points);
			this.group.createJointsFromPoints(points, true);
			//nodesToDraw[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			nodesToDraw = this.createPreciseHexaFillStructure(points);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			nodesToDraw = this.createHexaFillStructure(points);
			break;
		default:
			nodesToDraw = this.group.createNodesFromPoints(points);
			break;
	}

	return nodesToDraw;
};

Structure.prototype.createHexaFillStructure = function ($coordsArray)
{
	this.createInnerStructure($coordsArray);
	var path = this.innerStructure.getShapePath();
	var nodesToDraw = [];
	for (var i = 0, length = path.length; i < length; i += 1)
	{
		nodesToDraw.push(this.group.getNodeAtPoint(path[i][0], path[i][1]));
	}
	return nodesToDraw;
};

Structure.prototype.createPreciseHexaFillStructure = function ($coordsArray)
{
	var nodesToDraw = this.group.createNodesFromPoints($coordsArray);
	this.createInnerStructure($coordsArray);

	this.group.createJointsFromPoints($coordsArray, false);
	var i = 0;
	var length = $coordsArray.length;
	for (i; i < length; i += 1)
	{
		var currPoint = $coordsArray[i];
		var closest = this.innerStructure.getClosest(currPoint[0], currPoint[1], 2);
		for (var k = 0, closestLength = closest.length; k < closestLength; k += 1)
		{
			var currClosest = closest[k];
			var n1 = this.group.getNodeAtPoint(currPoint[0], currPoint[1]);
			var n2 = this.group.getNodeAtPoint(currClosest[0], currClosest[1]);
			this.group.createJoint(n1, n2);
		}
	}
	return nodesToDraw;
};

Structure.prototype.createJointsFromTriangles = function ($coordsArray)
{
	var triangulator = new Triangulator();
	var triangles = triangulator.triangulate($coordsArray);

	var trianglesLength = triangles.length;
	for (var i = 0; i < trianglesLength; i += 1)
	{
		var currTriangle = triangles[i];
		var n0 = this.group.getNodeAtPoint(currTriangle[0].x, currTriangle[0].y);
		var n1 = this.group.getNodeAtPoint(currTriangle[1].x, currTriangle[1].y);
		var n2 = this.group.getNodeAtPoint(currTriangle[2].x, currTriangle[2].y);
		this.group.createJoint(n0, n1);
		this.group.createJoint(n1, n2);
		this.group.createJoint(n2, n0);
	}
};

Structure.prototype.createInnerStructure = function ($coordsArray)
{
	var polygon = Polygon.init($coordsArray);
	var diam = this.world.getWidth() * this.group.conf.innerStructureDef;//width / 10;//this.world.getWidth() / 30;
	this.innerStructure = Grid.createFromPolygon(polygon, diam, true);
	var structureNodes = this.group.createNodesFromPoints(this.innerStructure.getNodesArray());

	var network = this.innerStructure.getNetwork();
	var i = 0;
	var length = network.length;
	for (i; i < length; i += 1)
	{
		var currLink = network[i];
		var n1 = this.group.getNodeAtPoint(currLink[0][0], currLink[0][1]);
		var n2 = this.group.getNodeAtPoint(currLink[1][0], currLink[1][1]);
		this.group.createJoint(n1, n2);
	}
	return structureNodes;
};

module.exports = Structure;


},{"./Grid":"/Users/Lau/www/svjelly/src/core/Grid.js","./Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./Triangulator":"/Users/Lau/www/svjelly/src/core/Triangulator.js"}],"/Users/Lau/www/svjelly/src/core/Triangulator.js":[function(require,module,exports){
var poly2tri = require('../../libs/poly2tri/dist/poly2tri');

var Triangulator = function ()
{
};

Triangulator.prototype.triangulate = function ($coords)
{
	var poly2triContour = [];
	//debugger;

	for (var i = 0, pointsLength = $coords.length; i < pointsLength; i += 1)
	{
		var point = $coords[i];
		poly2triContour.push(new poly2tri.Point(point[0], point[1]));
	}

	var swctx;
	try
	{
		// prepare SweepContext
		swctx = new poly2tri.SweepContext(poly2triContour, { cloneArrays: true });

		// triangulate
		swctx.triangulate();
	}
	catch (e)
	{
		throw e;
		// console.log(e);
		// console.log(e.points);
	}
	var triangles = swctx.getTriangles();

	var pointsArray = [];

	var trianglesLength = triangles.length;
	for (i = 0; i < trianglesLength; i += 1)
	{
		var currTriangle = triangles[i];
		/*jshint camelcase:false*/
		//jscs:disable disallowDanglingUnderscores
		pointsArray.push(currTriangle.points_);
		//jscs:enable disallowDanglingUnderscores
		/*jshint camelcase:true*/
	}

	return pointsArray;
};

module.exports = Triangulator;


},{"../../libs/poly2tri/dist/poly2tri":"/Users/Lau/www/svjelly/libs/poly2tri/dist/poly2tri.js"}],"/Users/Lau/www/svjelly/src/svjelly.js":[function(require,module,exports){
module.exports =
{
	ConfObject: require('./core/ConfObject'),
	Grid: require('./core/Grid'),
	Polygon: require('./core/Polygon'),
	Structure: require('./core/Structure'),
	SVGParser: require('./core/SVGParser'),
	SVJellyGroup: require('./core/SVJellyGroup'),
	SVJellyJoint: require('./core/SVJellyJoint'),
	SVJellyNode: require('./core/SVJellyNode'),
	SVJellyUtils: require('./core/SVJellyUtils'),
	SVJellyWorld: require('./core/SVJellyWorld'),
	Triangulator: require('./core/Triangulator')
};


},{"./core/ConfObject":"/Users/Lau/www/svjelly/src/core/ConfObject.js","./core/Grid":"/Users/Lau/www/svjelly/src/core/Grid.js","./core/Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./core/SVGParser":"/Users/Lau/www/svjelly/src/core/SVGParser.js","./core/SVJellyGroup":"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js","./core/SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./core/SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js","./core/SVJellyUtils":"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js","./core/SVJellyWorld":"/Users/Lau/www/svjelly/src/core/SVJellyWorld.js","./core/Structure":"/Users/Lau/www/svjelly/src/core/Structure.js","./core/Triangulator":"/Users/Lau/www/svjelly/src/core/Triangulator.js"}]},{},["/Users/Lau/www/svjelly/src/svjelly.js"])("/Users/Lau/www/svjelly/src/svjelly.js")
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmkuanMiLCJzcmMvY29yZS9Db25mT2JqZWN0LmpzIiwic3JjL2NvcmUvR3JpZC5qcyIsInNyYy9jb3JlL1BvbHlnb24uanMiLCJzcmMvY29yZS9TVkdQYXJzZXIuanMiLCJzcmMvY29yZS9TVkplbGx5R3JvdXAuanMiLCJzcmMvY29yZS9TVkplbGx5Sm9pbnQuanMiLCJzcmMvY29yZS9TVkplbGx5Tm9kZS5qcyIsInNyYy9jb3JlL1NWSmVsbHlVdGlscy5qcyIsInNyYy9jb3JlL1NWSmVsbHlXb3JsZC5qcyIsInNyYy9jb3JlL1N0cnVjdHVyZS5qcyIsInNyYy9jb3JlL1RyaWFuZ3VsYXRvci5qcyIsInNyYy9zdmplbGx5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYucG9seTJ0cmk9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5tb2R1bGUuZXhwb3J0cz17XCJ2ZXJzaW9uXCI6IFwiMS4zLjVcIn1cbn0se31dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cbi8qIGpzaGludCBtYXhjb21wbGV4aXR5OjExICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU5vZGVcblxuLyoqXG4gKiBBZHZhbmNpbmcgZnJvbnQgbm9kZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHN0cnVjdFxuICogQHBhcmFtIHshWFl9IHAgLSBQb2ludFxuICogQHBhcmFtIHtUcmlhbmdsZT19IHQgdHJpYW5nbGUgKG9wdGlvbmFsKVxuICovXG52YXIgTm9kZSA9IGZ1bmN0aW9uKHAsIHQpIHtcbiAgICAvKiogQHR5cGUge1hZfSAqL1xuICAgIHRoaXMucG9pbnQgPSBwO1xuXG4gICAgLyoqIEB0eXBlIHtUcmlhbmdsZXxudWxsfSAqL1xuICAgIHRoaXMudHJpYW5nbGUgPSB0IHx8IG51bGw7XG5cbiAgICAvKiogQHR5cGUge05vZGV8bnVsbH0gKi9cbiAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZXxudWxsfSAqL1xuICAgIHRoaXMucHJldiA9IG51bGw7XG5cbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICB0aGlzLnZhbHVlID0gcC54O1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQWR2YW5jaW5nRnJvbnRcbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHN0cnVjdFxuICogQHBhcmFtIHtOb2RlfSBoZWFkXG4gKiBAcGFyYW0ge05vZGV9IHRhaWxcbiAqL1xudmFyIEFkdmFuY2luZ0Zyb250ID0gZnVuY3Rpb24oaGVhZCwgdGFpbCkge1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLmhlYWRfID0gaGVhZDtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy50YWlsXyA9IHRhaWw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMuc2VhcmNoX25vZGVfID0gaGVhZDtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkXztcbn07XG5cbi8qKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZXRIZWFkID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMuaGVhZF8gPSBub2RlO1xufTtcblxuLyoqIEByZXR1cm4ge05vZGV9ICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWxfO1xufTtcblxuLyoqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnNldFRhaWwgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdGhpcy50YWlsXyA9IG5vZGU7XG59O1xuXG4vKiogQHJldHVybiB7Tm9kZX0gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hfbm9kZV87XG59O1xuXG4vKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuc2V0U2VhcmNoID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMuc2VhcmNoX25vZGVfID0gbm9kZTtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmZpbmRTZWFyY2hOb2RlID0gZnVuY3Rpb24oLyp4Ki8pIHtcbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgQlNUIGluZGV4XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoX25vZGVfO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0geCB2YWx1ZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmxvY2F0ZU5vZGUgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLnNlYXJjaF9ub2RlXztcblxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICBpZiAoeCA8IG5vZGUudmFsdWUpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBub2RlLnByZXYpIHtcbiAgICAgICAgICAgIGlmICh4ID49IG5vZGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUubmV4dCkge1xuICAgICAgICAgICAgaWYgKHggPCBub2RlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBub2RlLnByZXY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUucHJldjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHshWFl9IHBvaW50IC0gUG9pbnRcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5sb2NhdGVQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdmFyIHB4ID0gcG9pbnQueDtcbiAgICB2YXIgbm9kZSA9IHRoaXMuZmluZFNlYXJjaE5vZGUocHgpO1xuICAgIHZhciBueCA9IG5vZGUucG9pbnQueDtcblxuICAgIGlmIChweCA9PT0gbngpIHtcbiAgICAgICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICAgICAgaWYgKHBvaW50ICE9PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAvLyBXZSBtaWdodCBoYXZlIHR3byBub2RlcyB3aXRoIHNhbWUgeCB2YWx1ZSBmb3IgYSBzaG9ydCB0aW1lXG4gICAgICAgICAgICBpZiAocG9pbnQgPT09IG5vZGUucHJldi5wb2ludCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBvaW50ID09PSBub2RlLm5leHQucG9pbnQpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgQWR2YW5jaW5nRnJvbnQubG9jYXRlUG9pbnQoKSBjYWxsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHB4IDwgbngpIHtcbiAgICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUucHJldikge1xuICAgICAgICAgICAgaWYgKHBvaW50ID09PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUubmV4dCkge1xuICAgICAgICAgICAgaWYgKHBvaW50ID09PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkdmFuY2luZ0Zyb250O1xubW9kdWxlLmV4cG9ydHMuTm9kZSA9IE5vZGU7XG5cblxufSx7fV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICpcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gKiBGdW5jdGlvbiBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuICovXG5cbi8qKlxuICogYXNzZXJ0IGFuZCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uICAgdGhlIGNvbmRpdGlvbiB3aGljaCBpcyBhc3NlcnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgICAgICB0aGUgbWVzc2FnZSB3aGljaCBpcyBkaXNwbGF5IGlzIGNvbmRpdGlvbiBpcyBmYWxzeVxuICovXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgXCJBc3NlcnQgRmFpbGVkXCIpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0O1xuXG5cblxufSx7fV0sNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIHh5ID0gX2RlcmVxXygnLi94eScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Qb2ludFxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBwb2ludFxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHBvaW50ID0gbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKTtcbiAqIEBwdWJsaWNcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHBhcmFtIHtudW1iZXI9fSB4ICAgIGNvb3JkaW5hdGUgKDAgaWYgdW5kZWZpbmVkKVxuICogQHBhcmFtIHtudW1iZXI9fSB5ICAgIGNvb3JkaW5hdGUgKDAgaWYgdW5kZWZpbmVkKVxuICovXG52YXIgUG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZXhwb3NlXG4gICAgICovXG4gICAgdGhpcy54ID0gK3ggfHwgMDtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBleHBvc2VcbiAgICAgKi9cbiAgICB0aGlzLnkgPSAreSB8fCAwO1xuXG4gICAgLy8gQWxsIGV4dHJhIGZpZWxkcyBhZGRlZCB0byBQb2ludCBhcmUgcHJlZml4ZWQgd2l0aCBfcDJ0X1xuICAgIC8vIHRvIGF2b2lkIGNvbGxpc2lvbnMgaWYgY3VzdG9tIFBvaW50IGNsYXNzIGlzIHVzZWQuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgZWRnZXMgdGhpcyBwb2ludCBjb25zdGl0dXRlcyBhbiB1cHBlciBlbmRpbmcgcG9pbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48RWRnZT59XG4gICAgICovXG4gICAgdGhpcy5fcDJ0X2VkZ2VfbGlzdCA9IG51bGw7XG59O1xuXG4vKipcbiAqIEZvciBwcmV0dHkgcHJpbnRpbmdcbiAqIEBleGFtcGxlXG4gKiAgICAgIFwicD1cIiArIG5ldyBwb2x5MnRyaS5Qb2ludCg1LDQyKVxuICogICAgICAvLyDihpIgXCJwPSg1OzQyKVwiXG4gKiBAcmV0dXJucyB7c3RyaW5nfSA8Y29kZT5cIih4O3kpXCI8L2NvZGU+XG4gKi9cblBvaW50LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4eS50b1N0cmluZ0Jhc2UodGhpcyk7XG59O1xuXG4vKipcbiAqIEpTT04gb3V0cHV0LCBvbmx5IGNvb3JkaW5hdGVzXG4gKiBAZXhhbXBsZVxuICogICAgICBKU09OLnN0cmluZ2lmeShuZXcgcG9seTJ0cmkuUG9pbnQoMSwyKSlcbiAqICAgICAgLy8g4oaSICd7XCJ4XCI6MSxcInlcIjoyfSdcbiAqL1xuUG9pbnQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHg6IHRoaXMueCwgeTogdGhpcy55IH07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgUG9pbnQgb2JqZWN0LlxuICogQHJldHVybiB7UG9pbnR9IG5ldyBjbG9uZWQgcG9pbnRcbiAqL1xuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG59O1xuXG4vKipcbiAqIFNldCB0aGlzIFBvaW50IGluc3RhbmNlIHRvIHRoZSBvcmlnby4gPGNvZGU+KDA7IDApPC9jb2RlPlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLnNldF96ZXJvID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gMC4wO1xuICAgIHRoaXMueSA9IDAuMDtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhpcyBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB4ICAgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHkgICBjb29yZGluYXRlXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMueCA9ICt4IHx8IDA7XG4gICAgdGhpcy55ID0gK3kgfHwgMDtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIE5lZ2F0ZSB0aGlzIFBvaW50IGluc3RhbmNlLiAoY29tcG9uZW50LXdpc2UpXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogQWRkIGFub3RoZXIgUG9pbnQgb2JqZWN0IHRvIHRoaXMgaW5zdGFuY2UuIChjb21wb25lbnQtd2lzZSlcbiAqIEBwYXJhbSB7IVBvaW50fSBuIC0gUG9pbnQgb2JqZWN0LlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLnggKz0gbi54O1xuICAgIHRoaXMueSArPSBuLnk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGlzIFBvaW50IGluc3RhbmNlIHdpdGggYW5vdGhlciBwb2ludCBnaXZlbi4gKGNvbXBvbmVudC13aXNlKVxuICogQHBhcmFtIHshUG9pbnR9IG4gLSBQb2ludCBvYmplY3QuXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24obikge1xuICAgIHRoaXMueCAtPSBuLng7XG4gICAgdGhpcy55IC09IG4ueTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIE11bHRpcGx5IHRoaXMgUG9pbnQgaW5zdGFuY2UgYnkgYSBzY2FsYXIuIChjb21wb25lbnQtd2lzZSlcbiAqIEBwYXJhbSB7bnVtYmVyfSBzICAgc2NhbGFyLlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnggKj0gcztcbiAgICB0aGlzLnkgKj0gcztcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgZGlzdGFuY2Ugb2YgdGhpcyBQb2ludCBpbnN0YW5jZSBmcm9tIHRoZSBvcmlnby5cbiAqIEByZXR1cm4ge251bWJlcn0gZGlzdGFuY2VcbiAqL1xuUG9pbnQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIHRoaXMgUG9pbnQgaW5zdGFuY2UgKGFzIGEgdmVjdG9yKS5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG9yaWdpbmFsIGRpc3RhbmNlIG9mIHRoaXMgaW5zdGFuY2UgZnJvbSB0aGUgb3JpZ28uXG4gKi9cblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGgoKTtcbiAgICB0aGlzLnggLz0gbGVuO1xuICAgIHRoaXMueSAvPSBsZW47XG4gICAgcmV0dXJuIGxlbjtcbn07XG5cbi8qKlxuICogVGVzdCB0aGlzIFBvaW50IG9iamVjdCB3aXRoIGFub3RoZXIgZm9yIGVxdWFsaXR5LlxuICogQHBhcmFtIHshWFl9IHAgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuUG9pbnQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gdGhpcy54ID09PSBwLnggJiYgdGhpcy55ID09PSBwLnk7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tUG9pbnQgKFwic3RhdGljXCIgbWV0aG9kcylcblxuLyoqXG4gKiBOZWdhdGUgYSBwb2ludCBjb21wb25lbnQtd2lzZSBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYSBuZXcgUG9pbnQgb2JqZWN0LlxuICogQHBhcmFtIHshWFl9IHAgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQubmVnYXRlID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoLXAueCwgLXAueSk7XG59O1xuXG4vKipcbiAqIEFkZCB0d28gcG9pbnRzIGNvbXBvbmVudC13aXNlIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0geyFYWX0gYSAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQuYWRkID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBuZXcgUG9pbnQoYS54ICsgYi54LCBhLnkgKyBiLnkpO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0d28gcG9pbnRzIGNvbXBvbmVudC13aXNlIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0geyFYWX0gYSAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQuc3ViID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBuZXcgUG9pbnQoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSBhIHBvaW50IGJ5IGEgc2NhbGFyIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0ge251bWJlcn0gcyAtIHRoZSBzY2FsYXJcbiAqIEBwYXJhbSB7IVhZfSBwIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhlIHJlc3VsdGluZyBQb2ludCBvYmplY3QuXG4gKi9cblBvaW50Lm11bCA9IGZ1bmN0aW9uKHMsIHApIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHMgKiBwLngsIHMgKiBwLnkpO1xufTtcblxuLyoqXG4gKiBQZXJmb3JtIHRoZSBjcm9zcyBwcm9kdWN0IG9uIGVpdGhlciB0d28gcG9pbnRzICh0aGlzIHByb2R1Y2VzIGEgc2NhbGFyKVxuICogb3IgYSBwb2ludCBhbmQgYSBzY2FsYXIgKHRoaXMgcHJvZHVjZXMgYSBwb2ludCkuXG4gKiBUaGlzIGZ1bmN0aW9uIHJlcXVpcmVzIHR3byBwYXJhbWV0ZXJzLCBlaXRoZXIgbWF5IGJlIGEgUG9pbnQgb2JqZWN0IG9yIGFcbiAqIG51bWJlci5cbiAqIEBwYXJhbSAge1hZfG51bWJlcn0gYSAtIFBvaW50IG9iamVjdCBvciBzY2FsYXIuXG4gKiBAcGFyYW0gIHtYWXxudW1iZXJ9IGIgLSBQb2ludCBvYmplY3Qgb3Igc2NhbGFyLlxuICogQHJldHVybiB7UG9pbnR8bnVtYmVyfSBhIFBvaW50IG9iamVjdCBvciBhIG51bWJlciwgZGVwZW5kaW5nIG9uIHRoZSBwYXJhbWV0ZXJzLlxuICovXG5Qb2ludC5jcm9zcyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAodHlwZW9mKGEpID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAodHlwZW9mKGIpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGEgKiBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludCgtYSAqIGIueSwgYSAqIGIueCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGIpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludChiICogYS55LCAtYiAqIGEueCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiUG9pbnQtTGlrZVwiXG4vKlxuICogVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgb3BlcmF0ZSBvbiBcIlBvaW50XCIgb3IgYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCBcbiAqIHdpdGgge3gseX0gKGR1Y2sgdHlwaW5nKS5cbiAqL1xuXG5Qb2ludC50b1N0cmluZyA9IHh5LnRvU3RyaW5nO1xuUG9pbnQuY29tcGFyZSA9IHh5LmNvbXBhcmU7XG5Qb2ludC5jbXAgPSB4eS5jb21wYXJlOyAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5Qb2ludC5lcXVhbHMgPSB4eS5lcXVhbHM7XG5cbi8qKlxuICogUGVmb3JtIHRoZSBkb3QgcHJvZHVjdCBvbiB0d28gdmVjdG9ycy5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7IVhZfSBhIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3RcbiAqL1xuUG9pbnQuZG90ID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnk7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHMgKHB1YmxpYyBBUEkpXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG5cbn0se1wiLi94eVwiOjExfV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gKiBDbGFzcyBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuICovXG5cbnZhciB4eSA9IF9kZXJlcV8oJy4veHknKTtcblxuLyoqXG4gKiBDdXN0b20gZXhjZXB0aW9uIGNsYXNzIHRvIGluZGljYXRlIGludmFsaWQgUG9pbnQgdmFsdWVzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIEVycm9yXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgLSBlcnJvciBtZXNzYWdlXG4gKiBAcGFyYW0ge0FycmF5LjxYWT49fSBwb2ludHMgLSBpbnZhbGlkIHBvaW50c1xuICovXG52YXIgUG9pbnRFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHBvaW50cykge1xuICAgIHRoaXMubmFtZSA9IFwiUG9pbnRFcnJvclwiO1xuICAgIC8qKlxuICAgICAqIEludmFsaWQgcG9pbnRzXG4gICAgICogQHB1YmxpY1xuICAgICAqIEB0eXBlIHtBcnJheS48WFk+fVxuICAgICAqL1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xuICAgIC8qKlxuICAgICAqIEVycm9yIG1lc3NhZ2VcbiAgICAgKiBAcHVibGljXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiSW52YWxpZCBQb2ludHMhXCI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlICs9IFwiIFwiICsgeHkudG9TdHJpbmcocG9pbnRzW2ldKTtcbiAgICB9XG59O1xuUG9pbnRFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblBvaW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9pbnRFcnJvcjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50RXJyb3I7XG5cbn0se1wiLi94eVwiOjExfV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuICogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgUG9seTJUcmkgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZVxuICogICB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljXG4gKiAgIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SXG4gKiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcbiAqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcbiAqIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxuICogUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICogU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUHVibGljIEFQSSBmb3IgcG9seTJ0cmkuanNcbiAqIEBtb2R1bGUgcG9seTJ0cmlcbiAqL1xuXG5cbi8qKlxuICogSWYgeW91IGFyZSBub3QgdXNpbmcgYSBtb2R1bGUgc3lzdGVtIChlLmcuIENvbW1vbkpTLCBSZXF1aXJlSlMpLCB5b3UgY2FuIGFjY2VzcyB0aGlzIGxpYnJhcnlcbiAqIGFzIGEgZ2xvYmFsIHZhcmlhYmxlIDxjb2RlPnBvbHkydHJpPC9jb2RlPiBpLmUuIDxjb2RlPndpbmRvdy5wb2x5MnRyaTwvY29kZT4gaW4gYSBicm93c2VyLlxuICogQG5hbWUgcG9seTJ0cmlcbiAqIEBnbG9iYWxcbiAqIEBwdWJsaWNcbiAqIEB0eXBlIHttb2R1bGU6cG9seTJ0cml9XG4gKi9cbnZhciBwcmV2aW91c1BvbHkydHJpID0gZ2xvYmFsLnBvbHkydHJpO1xuLyoqXG4gKiBGb3IgQnJvd3NlciArICZsdDtzY3JpcHQmZ3Q7IDpcbiAqIHJldmVydHMgdGhlIHtAbGlua2NvZGUgcG9seTJ0cml9IGdsb2JhbCBvYmplY3QgdG8gaXRzIHByZXZpb3VzIHZhbHVlLFxuICogYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGluc3RhbmNlIGNhbGxlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICAgICAgICAgIHZhciBwID0gcG9seTJ0cmkubm9Db25mbGljdCgpO1xuICogQHB1YmxpY1xuICogQHJldHVybiB7bW9kdWxlOnBvbHkydHJpfSBpbnN0YW5jZSBjYWxsZWRcbiAqL1xuLy8gKHRoaXMgZmVhdHVyZSBpcyBub3QgYXV0b21hdGljYWxseSBwcm92aWRlZCBieSBicm93c2VyaWZ5KS5cbmV4cG9ydHMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGdsb2JhbC5wb2x5MnRyaSA9IHByZXZpb3VzUG9seTJ0cmk7XG4gICAgcmV0dXJuIGV4cG9ydHM7XG59O1xuXG4vKipcbiAqIHBvbHkydHJpIGxpYnJhcnkgdmVyc2lvblxuICogQHB1YmxpY1xuICogQGNvbnN0IHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuVkVSU0lPTiA9IF9kZXJlcV8oJy4uL2Rpc3QvdmVyc2lvbi5qc29uJykudmVyc2lvbjtcblxuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFBvaW50RXJyb3J9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1BvaW50RXJyb3J9IG1vZHVsZTpwb2x5MnRyaS5Qb2ludEVycm9yXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5Qb2ludEVycm9yID0gX2RlcmVxXygnLi9wb2ludGVycm9yJyk7XG4vKipcbiAqIEV4cG9ydHMgdGhlIHtAbGlua2NvZGUgUG9pbnR9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1BvaW50fSBtb2R1bGU6cG9seTJ0cmkuUG9pbnRcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnRzLlBvaW50ID0gX2RlcmVxXygnLi9wb2ludCcpO1xuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFRyaWFuZ2xlfSBjbGFzcy5cbiAqIEBwdWJsaWNcbiAqIEB0eXBlZGVmIHtUcmlhbmdsZX0gbW9kdWxlOnBvbHkydHJpLlRyaWFuZ2xlXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5UcmlhbmdsZSA9IF9kZXJlcV8oJy4vdHJpYW5nbGUnKTtcbi8qKlxuICogRXhwb3J0cyB0aGUge0BsaW5rY29kZSBTd2VlcENvbnRleHR9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1N3ZWVwQ29udGV4dH0gbW9kdWxlOnBvbHkydHJpLlN3ZWVwQ29udGV4dFxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydHMuU3dlZXBDb250ZXh0ID0gX2RlcmVxXygnLi9zd2VlcGNvbnRleHQnKTtcblxuXG4vLyBCYWNrd2FyZCBjb21wYXRpYmlsaXR5XG52YXIgc3dlZXAgPSBfZGVyZXFfKCcuL3N3ZWVwJyk7XG4vKipcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I3RyaWFuZ3VsYXRlfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydHMudHJpYW5ndWxhdGUgPSBzd2VlcC50cmlhbmd1bGF0ZTtcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I3RyaWFuZ3VsYXRlfSBpbnN0ZWFkXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBUcmlhbmd1bGF0ZSAtIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCN0cmlhbmd1bGF0ZX0gaW5zdGVhZFxuICovXG5leHBvcnRzLnN3ZWVwID0ge1RyaWFuZ3VsYXRlOiBzd2VlcC50cmlhbmd1bGF0ZX07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHtcIi4uL2Rpc3QvdmVyc2lvbi5qc29uXCI6MSxcIi4vcG9pbnRcIjo0LFwiLi9wb2ludGVycm9yXCI6NSxcIi4vc3dlZXBcIjo3LFwiLi9zd2VlcGNvbnRleHRcIjo4LFwiLi90cmlhbmdsZVwiOjl9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbGF0ZWRlZjpub2Z1bmMsIG1heGNvbXBsZXhpdHk6OSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBUaGlzICdTd2VlcCcgbW9kdWxlIGlzIHByZXNlbnQgaW4gb3JkZXIgdG8ga2VlcCB0aGlzIEphdmFTY3JpcHQgdmVyc2lvblxuICogYXMgY2xvc2UgYXMgcG9zc2libGUgdG8gdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgZXZlbiB0aG91Z2ggYWxtb3N0IGFsbFxuICogZnVuY3Rpb25zIGNvdWxkIGJlIGRlY2xhcmVkIGFzIG1ldGhvZHMgb24gdGhlIHtAbGlua2NvZGUgbW9kdWxlOnN3ZWVwY29udGV4dH5Td2VlcENvbnRleHR9IG9iamVjdC5cbiAqIEBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIGFzc2VydCA9IF9kZXJlcV8oJy4vYXNzZXJ0Jyk7XG52YXIgUG9pbnRFcnJvciA9IF9kZXJlcV8oJy4vcG9pbnRlcnJvcicpO1xudmFyIFRyaWFuZ2xlID0gX2RlcmVxXygnLi90cmlhbmdsZScpO1xudmFyIE5vZGUgPSBfZGVyZXFfKCcuL2FkdmFuY2luZ2Zyb250JykuTm9kZTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS11dGlsc1xuXG52YXIgdXRpbHMgPSBfZGVyZXFfKCcuL3V0aWxzJyk7XG5cbi8qKiBAY29uc3QgKi9cbnZhciBFUFNJTE9OID0gdXRpbHMuRVBTSUxPTjtcblxuLyoqIEBjb25zdCAqL1xudmFyIE9yaWVudGF0aW9uID0gdXRpbHMuT3JpZW50YXRpb247XG4vKiogQGNvbnN0ICovXG52YXIgb3JpZW50MmQgPSB1dGlscy5vcmllbnQyZDtcbi8qKiBAY29uc3QgKi9cbnZhciBpblNjYW5BcmVhID0gdXRpbHMuaW5TY2FuQXJlYTtcbi8qKiBAY29uc3QgKi9cbnZhciBpc0FuZ2xlT2J0dXNlID0gdXRpbHMuaXNBbmdsZU9idHVzZTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Td2VlcFxuXG4vKipcbiAqIFRyaWFuZ3VsYXRlIHRoZSBwb2x5Z29uIHdpdGggaG9sZXMgYW5kIFN0ZWluZXIgcG9pbnRzLlxuICogRG8gdGhpcyBBRlRFUiB5b3UndmUgYWRkZWQgdGhlIHBvbHlsaW5lLCBob2xlcywgYW5kIFN0ZWluZXIgcG9pbnRzXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIHRyaWFuZ3VsYXRlKHRjeCkge1xuICAgIHRjeC5pbml0VHJpYW5ndWxhdGlvbigpO1xuICAgIHRjeC5jcmVhdGVBZHZhbmNpbmdGcm9udCgpO1xuICAgIC8vIFN3ZWVwIHBvaW50czsgYnVpbGQgbWVzaFxuICAgIHN3ZWVwUG9pbnRzKHRjeCk7XG4gICAgLy8gQ2xlYW4gdXBcbiAgICBmaW5hbGl6YXRpb25Qb2x5Z29uKHRjeCk7XG59XG5cbi8qKlxuICogU3RhcnQgc3dlZXBpbmcgdGhlIFktc29ydGVkIHBvaW50IHNldCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBzd2VlcFBvaW50cyh0Y3gpIHtcbiAgICB2YXIgaSwgbGVuID0gdGN4LnBvaW50Q291bnQoKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gdGN4LmdldFBvaW50KGkpO1xuICAgICAgICB2YXIgbm9kZSA9IHBvaW50RXZlbnQodGN4LCBwb2ludCk7XG4gICAgICAgIHZhciBlZGdlcyA9IHBvaW50Ll9wMnRfZWRnZV9saXN0O1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgZWRnZXMgJiYgaiA8IGVkZ2VzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICBlZGdlRXZlbnRCeUVkZ2UodGN4LCBlZGdlc1tqXSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGZpbmFsaXphdGlvblBvbHlnb24odGN4KSB7XG4gICAgLy8gR2V0IGFuIEludGVybmFsIHRyaWFuZ2xlIHRvIHN0YXJ0IHdpdGhcbiAgICB2YXIgdCA9IHRjeC5mcm9udCgpLmhlYWQoKS5uZXh0LnRyaWFuZ2xlO1xuICAgIHZhciBwID0gdGN4LmZyb250KCkuaGVhZCgpLm5leHQucG9pbnQ7XG4gICAgd2hpbGUgKCF0LmdldENvbnN0cmFpbmVkRWRnZUNXKHApKSB7XG4gICAgICAgIHQgPSB0Lm5laWdoYm9yQ0NXKHApO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgaW50ZXJpb3IgdHJpYW5nbGVzIGNvbnN0cmFpbmVkIGJ5IGVkZ2VzXG4gICAgdGN4Lm1lc2hDbGVhbih0KTtcbn1cblxuLyoqXG4gKiBGaW5kIGNsb3NlcyBub2RlIHRvIHRoZSBsZWZ0IG9mIHRoZSBuZXcgcG9pbnQgYW5kXG4gKiBjcmVhdGUgYSBuZXcgdHJpYW5nbGUuIElmIG5lZWRlZCBuZXcgaG9sZXMgYW5kIGJhc2luc1xuICogd2lsbCBiZSBmaWxsZWQgdG8uXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSB7IVhZfSBwb2ludCAgIFBvaW50XG4gKi9cbmZ1bmN0aW9uIHBvaW50RXZlbnQodGN4LCBwb2ludCkge1xuICAgIHZhciBub2RlID0gdGN4LmxvY2F0ZU5vZGUocG9pbnQpO1xuICAgIHZhciBuZXdfbm9kZSA9IG5ld0Zyb250VHJpYW5nbGUodGN4LCBwb2ludCwgbm9kZSk7XG5cbiAgICAvLyBPbmx5IG5lZWQgdG8gY2hlY2sgK2Vwc2lsb24gc2luY2UgcG9pbnQgbmV2ZXIgaGF2ZSBzbWFsbGVyXG4gICAgLy8geCB2YWx1ZSB0aGFuIG5vZGUgZHVlIHRvIGhvdyB3ZSBmZXRjaCBub2RlcyBmcm9tIHRoZSBmcm9udFxuICAgIGlmIChwb2ludC54IDw9IG5vZGUucG9pbnQueCArIChFUFNJTE9OKSkge1xuICAgICAgICBmaWxsKHRjeCwgbm9kZSk7XG4gICAgfVxuXG4gICAgLy90Y3guQWRkTm9kZShuZXdfbm9kZSk7XG5cbiAgICBmaWxsQWR2YW5jaW5nRnJvbnQodGN4LCBuZXdfbm9kZSk7XG4gICAgcmV0dXJuIG5ld19ub2RlO1xufVxuXG5mdW5jdGlvbiBlZGdlRXZlbnRCeUVkZ2UodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgdGN4LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZSA9IGVkZ2U7XG4gICAgdGN4LmVkZ2VfZXZlbnQucmlnaHQgPSAoZWRnZS5wLnggPiBlZGdlLnEueCk7XG5cbiAgICBpZiAoaXNFZGdlU2lkZU9mVHJpYW5nbGUobm9kZS50cmlhbmdsZSwgZWRnZS5wLCBlZGdlLnEpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGb3Igbm93IHdlIHdpbGwgZG8gYWxsIG5lZWRlZCBmaWxsaW5nXG4gICAgLy8gVE9ETzogaW50ZWdyYXRlIHdpdGggZmxpcCBwcm9jZXNzIG1pZ2h0IGdpdmUgc29tZSBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgICAvLyAgICAgICBidXQgZm9yIG5vdyB0aGlzIGF2b2lkIHRoZSBpc3N1ZSB3aXRoIGNhc2VzIHRoYXQgbmVlZHMgYm90aCBmbGlwcyBhbmQgZmlsbHNcbiAgICBmaWxsRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgZWRnZUV2ZW50QnlQb2ludHModGN4LCBlZGdlLnAsIGVkZ2UucSwgbm9kZS50cmlhbmdsZSwgZWRnZS5xKTtcbn1cblxuZnVuY3Rpb24gZWRnZUV2ZW50QnlQb2ludHModGN4LCBlcCwgZXEsIHRyaWFuZ2xlLCBwb2ludCkge1xuICAgIGlmIChpc0VkZ2VTaWRlT2ZUcmlhbmdsZSh0cmlhbmdsZSwgZXAsIGVxKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHAxID0gdHJpYW5nbGUucG9pbnRDQ1cocG9pbnQpO1xuICAgIHZhciBvMSA9IG9yaWVudDJkKGVxLCBwMSwgZXApO1xuICAgIGlmIChvMSA9PT0gT3JpZW50YXRpb24uQ09MTElORUFSKSB7XG4gICAgICAgIC8vIFRPRE8gaW50ZWdyYXRlIGhlcmUgY2hhbmdlcyBmcm9tIEMrKyB2ZXJzaW9uXG4gICAgICAgIC8vIChDKysgcmVwbyByZXZpc2lvbiAwOTg4MGE4NjkwOTUgZGF0ZWQgTWFyY2ggOCwgMjAxMSlcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoJ3BvbHkydHJpIEVkZ2VFdmVudDogQ29sbGluZWFyIG5vdCBzdXBwb3J0ZWQhJywgW2VxLCBwMSwgZXBdKTtcbiAgICB9XG5cbiAgICB2YXIgcDIgPSB0cmlhbmdsZS5wb2ludENXKHBvaW50KTtcbiAgICB2YXIgbzIgPSBvcmllbnQyZChlcSwgcDIsIGVwKTtcbiAgICBpZiAobzIgPT09IE9yaWVudGF0aW9uLkNPTExJTkVBUikge1xuICAgICAgICAvLyBUT0RPIGludGVncmF0ZSBoZXJlIGNoYW5nZXMgZnJvbSBDKysgdmVyc2lvblxuICAgICAgICAvLyAoQysrIHJlcG8gcmV2aXNpb24gMDk4ODBhODY5MDk1IGRhdGVkIE1hcmNoIDgsIDIwMTEpXG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKCdwb2x5MnRyaSBFZGdlRXZlbnQ6IENvbGxpbmVhciBub3Qgc3VwcG9ydGVkIScsIFtlcSwgcDIsIGVwXSk7XG4gICAgfVxuXG4gICAgaWYgKG8xID09PSBvMikge1xuICAgICAgICAvLyBOZWVkIHRvIGRlY2lkZSBpZiB3ZSBhcmUgcm90YXRpbmcgQ1cgb3IgQ0NXIHRvIGdldCB0byBhIHRyaWFuZ2xlXG4gICAgICAgIC8vIHRoYXQgd2lsbCBjcm9zcyBlZGdlXG4gICAgICAgIGlmIChvMSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIHRyaWFuZ2xlID0gdHJpYW5nbGUubmVpZ2hib3JDQ1cocG9pbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJpYW5nbGUgPSB0cmlhbmdsZS5uZWlnaGJvckNXKHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBlZGdlRXZlbnRCeVBvaW50cyh0Y3gsIGVwLCBlcSwgdHJpYW5nbGUsIHBvaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHRyaWFuZ2xlIGNyb3NzZXMgY29uc3RyYWludCBzbyBsZXRzIGZsaXBwaW4gc3RhcnQhXG4gICAgICAgIGZsaXBFZGdlRXZlbnQodGN4LCBlcCwgZXEsIHRyaWFuZ2xlLCBwb2ludCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0VkZ2VTaWRlT2ZUcmlhbmdsZSh0cmlhbmdsZSwgZXAsIGVxKSB7XG4gICAgdmFyIGluZGV4ID0gdHJpYW5nbGUuZWRnZUluZGV4KGVwLCBlcSk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0cmlhbmdsZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleChpbmRleCk7XG4gICAgICAgIHZhciB0ID0gdHJpYW5nbGUuZ2V0TmVpZ2hib3IoaW5kZXgpO1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgdC5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZXAsIGVxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZnJvbnQgdHJpYW5nbGUgYW5kIGxlZ2FsaXplIGl0XG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gbmV3RnJvbnRUcmlhbmdsZSh0Y3gsIHBvaW50LCBub2RlKSB7XG4gICAgdmFyIHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKHBvaW50LCBub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQpO1xuXG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUudHJpYW5nbGUpO1xuICAgIHRjeC5hZGRUb01hcCh0cmlhbmdsZSk7XG5cbiAgICB2YXIgbmV3X25vZGUgPSBuZXcgTm9kZShwb2ludCk7XG4gICAgbmV3X25vZGUubmV4dCA9IG5vZGUubmV4dDtcbiAgICBuZXdfbm9kZS5wcmV2ID0gbm9kZTtcbiAgICBub2RlLm5leHQucHJldiA9IG5ld19ub2RlO1xuICAgIG5vZGUubmV4dCA9IG5ld19ub2RlO1xuXG4gICAgaWYgKCFsZWdhbGl6ZSh0Y3gsIHRyaWFuZ2xlKSkge1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHRyaWFuZ2xlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3X25vZGU7XG59XG5cbi8qKlxuICogQWRkcyBhIHRyaWFuZ2xlIHRvIHRoZSBhZHZhbmNpbmcgZnJvbnQgdG8gZmlsbCBhIGhvbGUuXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBub2RlIC0gbWlkZGxlIG5vZGUsIHRoYXQgaXMgdGhlIGJvdHRvbSBvZiB0aGUgaG9sZVxuICovXG5mdW5jdGlvbiBmaWxsKHRjeCwgbm9kZSkge1xuICAgIHZhciB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZShub2RlLnByZXYucG9pbnQsIG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCk7XG5cbiAgICAvLyBUT0RPOiBzaG91bGQgY29weSB0aGUgY29uc3RyYWluZWRfZWRnZSB2YWx1ZSBmcm9tIG5laWdoYm9yIHRyaWFuZ2xlc1xuICAgIC8vICAgICAgIGZvciBub3cgY29uc3RyYWluZWRfZWRnZSB2YWx1ZXMgYXJlIGNvcGllZCBkdXJpbmcgdGhlIGxlZ2FsaXplXG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUucHJldi50cmlhbmdsZSk7XG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUudHJpYW5nbGUpO1xuXG4gICAgdGN4LmFkZFRvTWFwKHRyaWFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgYWR2YW5jaW5nIGZyb250XG4gICAgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHQ7XG4gICAgbm9kZS5uZXh0LnByZXYgPSBub2RlLnByZXY7XG5cblxuICAgIC8vIElmIGl0IHdhcyBsZWdhbGl6ZWQgdGhlIHRyaWFuZ2xlIGhhcyBhbHJlYWR5IGJlZW4gbWFwcGVkXG4gICAgaWYgKCFsZWdhbGl6ZSh0Y3gsIHRyaWFuZ2xlKSkge1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHRyaWFuZ2xlKTtcbiAgICB9XG5cbiAgICAvL3RjeC5yZW1vdmVOb2RlKG5vZGUpO1xufVxuXG4vKipcbiAqIEZpbGxzIGhvbGVzIGluIHRoZSBBZHZhbmNpbmcgRnJvbnRcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBmaWxsQWR2YW5jaW5nRnJvbnQodGN4LCBuKSB7XG4gICAgLy8gRmlsbCByaWdodCBob2xlc1xuICAgIHZhciBub2RlID0gbi5uZXh0O1xuICAgIHdoaWxlIChub2RlLm5leHQpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIGFjZjgxZjFmMTc2NCBkYXRlZCBBcHJpbCA3LCAyMDEyKVxuICAgICAgICBpZiAoaXNBbmdsZU9idHVzZShub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUucHJldi5wb2ludCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZpbGwodGN4LCBub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG5cbiAgICAvLyBGaWxsIGxlZnQgaG9sZXNcbiAgICBub2RlID0gbi5wcmV2O1xuICAgIHdoaWxlIChub2RlLnByZXYpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIGFjZjgxZjFmMTc2NCBkYXRlZCBBcHJpbCA3LCAyMDEyKVxuICAgICAgICBpZiAoaXNBbmdsZU9idHVzZShub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUucHJldi5wb2ludCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZpbGwodGN4LCBub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICB9XG5cbiAgICAvLyBGaWxsIHJpZ2h0IGJhc2luc1xuICAgIGlmIChuLm5leHQgJiYgbi5uZXh0Lm5leHQpIHtcbiAgICAgICAgaWYgKGlzQmFzaW5BbmdsZVJpZ2h0KG4pKSB7XG4gICAgICAgICAgICBmaWxsQmFzaW4odGN4LCBuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgYmFzaW4gYW5nbGUgaXMgZGVjaWRlZCBhZ2FpbnN0IHRoZSBob3Jpem9udGFsIGxpbmUgWzEsMF0uXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5nbGUgPCAzKs+ALzRcbiAqL1xuZnVuY3Rpb24gaXNCYXNpbkFuZ2xlUmlnaHQobm9kZSkge1xuICAgIHZhciBheCA9IG5vZGUucG9pbnQueCAtIG5vZGUubmV4dC5uZXh0LnBvaW50Lng7XG4gICAgdmFyIGF5ID0gbm9kZS5wb2ludC55IC0gbm9kZS5uZXh0Lm5leHQucG9pbnQueTtcbiAgICBhc3NlcnQoYXkgPj0gMCwgXCJ1bm9yZGVyZWQgeVwiKTtcbiAgICByZXR1cm4gKGF4ID49IDAgfHwgTWF0aC5hYnMoYXgpIDwgYXkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0cmlhbmdsZSB3YXMgbGVnYWxpemVkXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGxlZ2FsaXplKHRjeCwgdCkge1xuICAgIC8vIFRvIGxlZ2FsaXplIGEgdHJpYW5nbGUgd2Ugc3RhcnQgYnkgZmluZGluZyBpZiBhbnkgb2YgdGhlIHRocmVlIGVkZ2VzXG4gICAgLy8gdmlvbGF0ZSB0aGUgRGVsYXVuYXkgY29uZGl0aW9uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyArK2kpIHtcbiAgICAgICAgaWYgKHQuZGVsYXVuYXlfZWRnZVtpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG90ID0gdC5nZXROZWlnaGJvcihpKTtcbiAgICAgICAgaWYgKG90KSB7XG4gICAgICAgICAgICB2YXIgcCA9IHQuZ2V0UG9pbnQoaSk7XG4gICAgICAgICAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuICAgICAgICAgICAgdmFyIG9pID0gb3QuaW5kZXgob3ApO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgQ29uc3RyYWluZWQgRWRnZSBvciBhIERlbGF1bmF5IEVkZ2Uob25seSBkdXJpbmcgcmVjdXJzaXZlIGxlZ2FsaXphdGlvbilcbiAgICAgICAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIG5vdCB0cnkgdG8gbGVnYWxpemVcbiAgICAgICAgICAgIGlmIChvdC5jb25zdHJhaW5lZF9lZGdlW29pXSB8fCBvdC5kZWxhdW5heV9lZGdlW29pXSkge1xuICAgICAgICAgICAgICAgIHQuY29uc3RyYWluZWRfZWRnZVtpXSA9IG90LmNvbnN0cmFpbmVkX2VkZ2Vbb2ldO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5zaWRlID0gaW5DaXJjbGUocCwgdC5wb2ludENDVyhwKSwgdC5wb2ludENXKHApLCBvcCk7XG4gICAgICAgICAgICBpZiAoaW5zaWRlKSB7XG4gICAgICAgICAgICAgICAgLy8gTGV0cyBtYXJrIHRoaXMgc2hhcmVkIGVkZ2UgYXMgRGVsYXVuYXlcbiAgICAgICAgICAgICAgICB0LmRlbGF1bmF5X2VkZ2VbaV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIG90LmRlbGF1bmF5X2VkZ2Vbb2ldID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIExldHMgcm90YXRlIHNoYXJlZCBlZGdlIG9uZSB2ZXJ0ZXggQ1cgdG8gbGVnYWxpemUgaXRcbiAgICAgICAgICAgICAgICByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKTtcblxuICAgICAgICAgICAgICAgIC8vIFdlIG5vdyBnb3Qgb25lIHZhbGlkIERlbGF1bmF5IEVkZ2Ugc2hhcmVkIGJ5IHR3byB0cmlhbmdsZXNcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGdpdmVzIHVzIDQgbmV3IGVkZ2VzIHRvIGNoZWNrIGZvciBEZWxhdW5heVxuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdHJpYW5nbGUgdG8gbm9kZSBtYXBwaW5nIGlzIGRvbmUgb25seSBvbmUgdGltZSBmb3IgYSBzcGVjaWZpYyB0cmlhbmdsZVxuICAgICAgICAgICAgICAgIHZhciBub3RfbGVnYWxpemVkID0gIWxlZ2FsaXplKHRjeCwgdCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vdF9sZWdhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBub3RfbGVnYWxpemVkID0gIWxlZ2FsaXplKHRjeCwgb3QpO1xuICAgICAgICAgICAgICAgIGlmIChub3RfbGVnYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXMob3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgRGVsYXVuYXkgZWRnZXMsIHNpbmNlIHRoZXkgb25seSBhcmUgdmFsaWQgRGVsYXVuYXkgZWRnZXNcbiAgICAgICAgICAgICAgICAvLyB1bnRpbCB3ZSBhZGQgYSBuZXcgdHJpYW5nbGUgb3IgcG9pbnQuXG4gICAgICAgICAgICAgICAgLy8gWFhYOiBuZWVkIHRvIHRoaW5rIGFib3V0IHRoaXMuIENhbiB0aGVzZSBlZGdlcyBiZSB0cmllZCBhZnRlciB3ZVxuICAgICAgICAgICAgICAgIC8vICAgICAgcmV0dXJuIHRvIHByZXZpb3VzIHJlY3Vyc2l2ZSBsZXZlbD9cbiAgICAgICAgICAgICAgICB0LmRlbGF1bmF5X2VkZ2VbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvdC5kZWxhdW5heV9lZGdlW29pXSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdHJpYW5nbGUgaGF2ZSBiZWVuIGxlZ2FsaXplZCBubyBuZWVkIHRvIGNoZWNrIHRoZSBvdGhlciBlZGdlcyBzaW5jZVxuICAgICAgICAgICAgICAgIC8vIHRoZSByZWN1cnNpdmUgbGVnYWxpemF0aW9uIHdpbGwgaGFuZGxlcyB0aG9zZSBzbyB3ZSBjYW4gZW5kIGhlcmUuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIDxiPlJlcXVpcmVtZW50PC9iPjo8YnI+XG4gKiAxLiBhLGIgYW5kIGMgZm9ybSBhIHRyaWFuZ2xlLjxicj5cbiAqIDIuIGEgYW5kIGQgaXMga25vdyB0byBiZSBvbiBvcHBvc2l0ZSBzaWRlIG9mIGJjPGJyPlxuICogPHByZT5cbiAqICAgICAgICAgICAgICAgIGFcbiAqICAgICAgICAgICAgICAgICtcbiAqICAgICAgICAgICAgICAgLyBcXFxuICogICAgICAgICAgICAgIC8gICBcXFxuICogICAgICAgICAgICBiLyAgICAgXFxjXG4gKiAgICAgICAgICAgICstLS0tLS0tK1xuICogICAgICAgICAgIC8gICAgZCAgICBcXFxuICogICAgICAgICAgLyAgICAgICAgICAgXFxcbiAqIDwvcHJlPlxuICogPGI+RmFjdDwvYj46IGQgaGFzIHRvIGJlIGluIGFyZWEgQiB0byBoYXZlIGEgY2hhbmNlIHRvIGJlIGluc2lkZSB0aGUgY2lyY2xlIGZvcm1lZCBieVxuICogIGEsYiBhbmQgYzxicj5cbiAqICBkIGlzIG91dHNpZGUgQiBpZiBvcmllbnQyZChhLGIsZCkgb3Igb3JpZW50MmQoYyxhLGQpIGlzIENXPGJyPlxuICogIFRoaXMgcHJla25vd2xlZGdlIGdpdmVzIHVzIGEgd2F5IHRvIG9wdGltaXplIHRoZSBpbmNpcmNsZSB0ZXN0XG4gKiBAcGFyYW0gcGEgLSB0cmlhbmdsZSBwb2ludCwgb3Bwb3NpdGUgZFxuICogQHBhcmFtIHBiIC0gdHJpYW5nbGUgcG9pbnRcbiAqIEBwYXJhbSBwYyAtIHRyaWFuZ2xlIHBvaW50XG4gKiBAcGFyYW0gcGQgLSBwb2ludCBvcHBvc2l0ZSBhXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGQgaXMgaW5zaWRlIGNpcmNsZSwgZmFsc2UgaWYgb24gY2lyY2xlIGVkZ2VcbiAqL1xuZnVuY3Rpb24gaW5DaXJjbGUocGEsIHBiLCBwYywgcGQpIHtcbiAgICB2YXIgYWR4ID0gcGEueCAtIHBkLng7XG4gICAgdmFyIGFkeSA9IHBhLnkgLSBwZC55O1xuICAgIHZhciBiZHggPSBwYi54IC0gcGQueDtcbiAgICB2YXIgYmR5ID0gcGIueSAtIHBkLnk7XG5cbiAgICB2YXIgYWR4YmR5ID0gYWR4ICogYmR5O1xuICAgIHZhciBiZHhhZHkgPSBiZHggKiBhZHk7XG4gICAgdmFyIG9hYmQgPSBhZHhiZHkgLSBiZHhhZHk7XG4gICAgaWYgKG9hYmQgPD0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGNkeCA9IHBjLnggLSBwZC54O1xuICAgIHZhciBjZHkgPSBwYy55IC0gcGQueTtcblxuICAgIHZhciBjZHhhZHkgPSBjZHggKiBhZHk7XG4gICAgdmFyIGFkeGNkeSA9IGFkeCAqIGNkeTtcbiAgICB2YXIgb2NhZCA9IGNkeGFkeSAtIGFkeGNkeTtcbiAgICBpZiAob2NhZCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYmR4Y2R5ID0gYmR4ICogY2R5O1xuICAgIHZhciBjZHhiZHkgPSBjZHggKiBiZHk7XG5cbiAgICB2YXIgYWxpZnQgPSBhZHggKiBhZHggKyBhZHkgKiBhZHk7XG4gICAgdmFyIGJsaWZ0ID0gYmR4ICogYmR4ICsgYmR5ICogYmR5O1xuICAgIHZhciBjbGlmdCA9IGNkeCAqIGNkeCArIGNkeSAqIGNkeTtcblxuICAgIHZhciBkZXQgPSBhbGlmdCAqIChiZHhjZHkgLSBjZHhiZHkpICsgYmxpZnQgKiBvY2FkICsgY2xpZnQgKiBvYWJkO1xuICAgIHJldHVybiBkZXQgPiAwO1xufVxuXG4vKipcbiAqIFJvdGF0ZXMgYSB0cmlhbmdsZSBwYWlyIG9uZSB2ZXJ0ZXggQ1dcbiAqPHByZT5cbiAqICAgICAgIG4yICAgICAgICAgICAgICAgICAgICBuMlxuICogIFAgKy0tLS0tKyAgICAgICAgICAgICBQICstLS0tLStcbiAqICAgIHwgdCAgL3wgICAgICAgICAgICAgICB8XFwgIHQgfFxuICogICAgfCAgIC8gfCAgICAgICAgICAgICAgIHwgXFwgICB8XG4gKiAgbjF8ICAvICB8bjMgICAgICAgICAgIG4xfCAgXFwgIHxuM1xuICogICAgfCAvICAgfCAgICBhZnRlciBDVyAgIHwgICBcXCB8XG4gKiAgICB8LyBvVCB8ICAgICAgICAgICAgICAgfCBvVCBcXHxcbiAqICAgICstLS0tLSsgb1AgICAgICAgICAgICArLS0tLS0rXG4gKiAgICAgICBuNCAgICAgICAgICAgICAgICAgICAgbjRcbiAqIDwvcHJlPlxuICovXG5mdW5jdGlvbiByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKSB7XG4gICAgdmFyIG4xLCBuMiwgbjMsIG40O1xuICAgIG4xID0gdC5uZWlnaGJvckNDVyhwKTtcbiAgICBuMiA9IHQubmVpZ2hib3JDVyhwKTtcbiAgICBuMyA9IG90Lm5laWdoYm9yQ0NXKG9wKTtcbiAgICBuNCA9IG90Lm5laWdoYm9yQ1cob3ApO1xuXG4gICAgdmFyIGNlMSwgY2UyLCBjZTMsIGNlNDtcbiAgICBjZTEgPSB0LmdldENvbnN0cmFpbmVkRWRnZUNDVyhwKTtcbiAgICBjZTIgPSB0LmdldENvbnN0cmFpbmVkRWRnZUNXKHApO1xuICAgIGNlMyA9IG90LmdldENvbnN0cmFpbmVkRWRnZUNDVyhvcCk7XG4gICAgY2U0ID0gb3QuZ2V0Q29uc3RyYWluZWRFZGdlQ1cob3ApO1xuXG4gICAgdmFyIGRlMSwgZGUyLCBkZTMsIGRlNDtcbiAgICBkZTEgPSB0LmdldERlbGF1bmF5RWRnZUNDVyhwKTtcbiAgICBkZTIgPSB0LmdldERlbGF1bmF5RWRnZUNXKHApO1xuICAgIGRlMyA9IG90LmdldERlbGF1bmF5RWRnZUNDVyhvcCk7XG4gICAgZGU0ID0gb3QuZ2V0RGVsYXVuYXlFZGdlQ1cob3ApO1xuXG4gICAgdC5sZWdhbGl6ZShwLCBvcCk7XG4gICAgb3QubGVnYWxpemUob3AsIHApO1xuXG4gICAgLy8gUmVtYXAgZGVsYXVuYXlfZWRnZVxuICAgIG90LnNldERlbGF1bmF5RWRnZUNDVyhwLCBkZTEpO1xuICAgIHQuc2V0RGVsYXVuYXlFZGdlQ1cocCwgZGUyKTtcbiAgICB0LnNldERlbGF1bmF5RWRnZUNDVyhvcCwgZGUzKTtcbiAgICBvdC5zZXREZWxhdW5heUVkZ2VDVyhvcCwgZGU0KTtcblxuICAgIC8vIFJlbWFwIGNvbnN0cmFpbmVkX2VkZ2VcbiAgICBvdC5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cocCwgY2UxKTtcbiAgICB0LnNldENvbnN0cmFpbmVkRWRnZUNXKHAsIGNlMik7XG4gICAgdC5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cob3AsIGNlMyk7XG4gICAgb3Quc2V0Q29uc3RyYWluZWRFZGdlQ1cob3AsIGNlNCk7XG5cbiAgICAvLyBSZW1hcCBuZWlnaGJvcnNcbiAgICAvLyBYWFg6IG1pZ2h0IG9wdGltaXplIHRoZSBtYXJrTmVpZ2hib3IgYnkga2VlcGluZyB0cmFjayBvZlxuICAgIC8vICAgICAgd2hhdCBzaWRlIHNob3VsZCBiZSBhc3NpZ25lZCB0byB3aGF0IG5laWdoYm9yIGFmdGVyIHRoZVxuICAgIC8vICAgICAgcm90YXRpb24uIE5vdyBtYXJrIG5laWdoYm9yIGRvZXMgbG90cyBvZiB0ZXN0aW5nIHRvIGZpbmRcbiAgICAvLyAgICAgIHRoZSByaWdodCBzaWRlLlxuICAgIHQuY2xlYXJOZWlnaGJvcnMoKTtcbiAgICBvdC5jbGVhck5laWdoYm9ycygpO1xuICAgIGlmIChuMSkge1xuICAgICAgICBvdC5tYXJrTmVpZ2hib3IobjEpO1xuICAgIH1cbiAgICBpZiAobjIpIHtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3IobjIpO1xuICAgIH1cbiAgICBpZiAobjMpIHtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3IobjMpO1xuICAgIH1cbiAgICBpZiAobjQpIHtcbiAgICAgICAgb3QubWFya05laWdoYm9yKG40KTtcbiAgICB9XG4gICAgdC5tYXJrTmVpZ2hib3Iob3QpO1xufVxuXG4vKipcbiAqIEZpbGxzIGEgYmFzaW4gdGhhdCBoYXMgZm9ybWVkIG9uIHRoZSBBZHZhbmNpbmcgRnJvbnQgdG8gdGhlIHJpZ2h0XG4gKiBvZiBnaXZlbiBub2RlLjxicj5cbiAqIEZpcnN0IHdlIGRlY2lkZSBhIGxlZnQsYm90dG9tIGFuZCByaWdodCBub2RlIHRoYXQgZm9ybXMgdGhlXG4gKiBib3VuZGFyaWVzIG9mIHRoZSBiYXNpbi4gVGhlbiB3ZSBkbyBhIHJlcXVyc2l2ZSBmaWxsLlxuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG5vZGUgLSBzdGFydGluZyBub2RlLCB0aGlzIG9yIG5leHQgbm9kZSB3aWxsIGJlIGxlZnQgbm9kZVxuICovXG5mdW5jdGlvbiBmaWxsQmFzaW4odGN4LCBub2RlKSB7XG4gICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgdGN4LmJhc2luLmxlZnRfbm9kZSA9IG5vZGUubmV4dC5uZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRjeC5iYXNpbi5sZWZ0X25vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgYm90dG9tIGFuZCByaWdodCBub2RlXG4gICAgdGN4LmJhc2luLmJvdHRvbV9ub2RlID0gdGN4LmJhc2luLmxlZnRfbm9kZTtcbiAgICB3aGlsZSAodGN4LmJhc2luLmJvdHRvbV9ub2RlLm5leHQgJiYgdGN4LmJhc2luLmJvdHRvbV9ub2RlLnBvaW50LnkgPj0gdGN4LmJhc2luLmJvdHRvbV9ub2RlLm5leHQucG9pbnQueSkge1xuICAgICAgICB0Y3guYmFzaW4uYm90dG9tX25vZGUgPSB0Y3guYmFzaW4uYm90dG9tX25vZGUubmV4dDtcbiAgICB9XG4gICAgaWYgKHRjeC5iYXNpbi5ib3R0b21fbm9kZSA9PT0gdGN4LmJhc2luLmxlZnRfbm9kZSkge1xuICAgICAgICAvLyBObyB2YWxpZCBiYXNpblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGN4LmJhc2luLnJpZ2h0X25vZGUgPSB0Y3guYmFzaW4uYm90dG9tX25vZGU7XG4gICAgd2hpbGUgKHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQgJiYgdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueSA8IHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQucG9pbnQueSkge1xuICAgICAgICB0Y3guYmFzaW4ucmlnaHRfbm9kZSA9IHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQ7XG4gICAgfVxuICAgIGlmICh0Y3guYmFzaW4ucmlnaHRfbm9kZSA9PT0gdGN4LmJhc2luLmJvdHRvbV9ub2RlKSB7XG4gICAgICAgIC8vIE5vIHZhbGlkIGJhc2luc1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGN4LmJhc2luLndpZHRoID0gdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueCAtIHRjeC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueDtcbiAgICB0Y3guYmFzaW4ubGVmdF9oaWdoZXN0ID0gdGN4LmJhc2luLmxlZnRfbm9kZS5wb2ludC55ID4gdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueTtcblxuICAgIGZpbGxCYXNpblJlcSh0Y3gsIHRjeC5iYXNpbi5ib3R0b21fbm9kZSk7XG59XG5cbi8qKlxuICogUmVjdXJzaXZlIGFsZ29yaXRobSB0byBmaWxsIGEgQmFzaW4gd2l0aCB0cmlhbmdsZXNcbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBub2RlIC0gYm90dG9tX25vZGVcbiAqL1xuZnVuY3Rpb24gZmlsbEJhc2luUmVxKHRjeCwgbm9kZSkge1xuICAgIC8vIGlmIHNoYWxsb3cgc3RvcCBmaWxsaW5nXG4gICAgaWYgKGlzU2hhbGxvdyh0Y3gsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaWxsKHRjeCwgbm9kZSk7XG5cbiAgICB2YXIgbztcbiAgICBpZiAobm9kZS5wcmV2ID09PSB0Y3guYmFzaW4ubGVmdF9ub2RlICYmIG5vZGUubmV4dCA9PT0gdGN4LmJhc2luLnJpZ2h0X25vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAobm9kZS5wcmV2ID09PSB0Y3guYmFzaW4ubGVmdF9ub2RlKSB7XG4gICAgICAgIG8gPSBvcmllbnQyZChub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50KTtcbiAgICAgICAgaWYgKG8gPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9IGVsc2UgaWYgKG5vZGUubmV4dCA9PT0gdGN4LmJhc2luLnJpZ2h0X25vZGUpIHtcbiAgICAgICAgbyA9IG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQpO1xuICAgICAgICBpZiAobyA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBuZWlnaGJvciBub2RlIHdpdGggbG93ZXN0IFkgdmFsdWVcbiAgICAgICAgaWYgKG5vZGUucHJldi5wb2ludC55IDwgbm9kZS5uZXh0LnBvaW50LnkpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbEJhc2luUmVxKHRjeCwgbm9kZSk7XG59XG5cbmZ1bmN0aW9uIGlzU2hhbGxvdyh0Y3gsIG5vZGUpIHtcbiAgICB2YXIgaGVpZ2h0O1xuICAgIGlmICh0Y3guYmFzaW4ubGVmdF9oaWdoZXN0KSB7XG4gICAgICAgIGhlaWdodCA9IHRjeC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueSAtIG5vZGUucG9pbnQueTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWlnaHQgPSB0Y3guYmFzaW4ucmlnaHRfbm9kZS5wb2ludC55IC0gbm9kZS5wb2ludC55O1xuICAgIH1cblxuICAgIC8vIGlmIHNoYWxsb3cgc3RvcCBmaWxsaW5nXG4gICAgaWYgKHRjeC5iYXNpbi53aWR0aCA+IGhlaWdodCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBmaWxsRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmICh0Y3guZWRnZV9ldmVudC5yaWdodCkge1xuICAgICAgICBmaWxsUmlnaHRBYm92ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGxMZWZ0QWJvdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIHdoaWxlIChub2RlLm5leHQucG9pbnQueCA8IGVkZ2UucC54KSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5leHQgbm9kZSBpcyBiZWxvdyB0aGUgZWRnZVxuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLm5leHQucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgZmlsbFJpZ2h0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmIChub2RlLnBvaW50LnggPCBlZGdlLnAueCkge1xuICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICAgICAgZmlsbFJpZ2h0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udmV4XG4gICAgICAgICAgICBmaWxsUmlnaHRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIC8vIFJldHJ5IHRoaXMgb25lXG4gICAgICAgICAgICBmaWxsUmlnaHRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGZpbGwodGN4LCBub2RlLm5leHQpO1xuICAgIGlmIChub2RlLm5leHQucG9pbnQgIT09IGVkZ2UucCkge1xuICAgICAgICAvLyBOZXh0IGFib3ZlIG9yIGJlbG93IGVkZ2U/XG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUubmV4dC5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbmNhdmVcbiAgICAgICAgICAgICAgICBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29udmV4XG4gICAgICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbFJpZ2h0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIC8vIE5leHQgY29uY2F2ZSBvciBjb252ZXg/XG4gICAgaWYgKG9yaWVudDJkKG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5uZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb252ZXhcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLm5leHQubmV4dC5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgZmlsbFJpZ2h0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5uZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFib3ZlXG4gICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIHdoaWxlIChub2RlLnByZXYucG9pbnQueCA+IGVkZ2UucC54KSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5leHQgbm9kZSBpcyBiZWxvdyB0aGUgZWRnZVxuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmIChub2RlLnBvaW50LnggPiBlZGdlLnAueCkge1xuICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgICAgICBmaWxsTGVmdENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbnZleFxuICAgICAgICAgICAgZmlsbExlZnRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIC8vIFJldHJ5IHRoaXMgb25lXG4gICAgICAgICAgICBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIC8vIE5leHQgY29uY2F2ZSBvciBjb252ZXg/XG4gICAgaWYgKG9yaWVudDJkKG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnByZXYucG9pbnQpID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUucHJldik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udmV4XG4gICAgICAgIC8vIE5leHQgYWJvdmUgb3IgYmVsb3cgZWRnZT9cbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5wcmV2LnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgZmlsbExlZnRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlLnByZXYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWJvdmVcbiAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBmaWxsKHRjeCwgbm9kZS5wcmV2KTtcbiAgICBpZiAobm9kZS5wcmV2LnBvaW50ICE9PSBlZGdlLnApIHtcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQpID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29uY2F2ZVxuICAgICAgICAgICAgICAgIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbnZleFxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZsaXBFZGdlRXZlbnQodGN4LCBlcCwgZXEsIHQsIHApIHtcbiAgICB2YXIgb3QgPSB0Lm5laWdoYm9yQWNyb3NzKHApO1xuICAgIGFzc2VydChvdCwgXCJGTElQIGZhaWxlZCBkdWUgdG8gbWlzc2luZyB0cmlhbmdsZSFcIik7XG5cbiAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuXG4gICAgLy8gQWRkaXRpb25hbCBjaGVjayBmcm9tIEphdmEgdmVyc2lvbiAoc2VlIGlzc3VlICM4OClcbiAgICBpZiAodC5nZXRDb25zdHJhaW5lZEVkZ2VBY3Jvc3MocCkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdC5pbmRleChwKTtcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoXCJwb2x5MnRyaSBJbnRlcnNlY3RpbmcgQ29uc3RyYWludHNcIixcbiAgICAgICAgICAgICAgICBbcCwgb3AsIHQuZ2V0UG9pbnQoKGluZGV4ICsgMSkgJSAzKSwgdC5nZXRQb2ludCgoaW5kZXggKyAyKSAlIDMpXSk7XG4gICAgfVxuXG4gICAgaWYgKGluU2NhbkFyZWEocCwgdC5wb2ludENDVyhwKSwgdC5wb2ludENXKHApLCBvcCkpIHtcbiAgICAgICAgLy8gTGV0cyByb3RhdGUgc2hhcmVkIGVkZ2Ugb25lIHZlcnRleCBDV1xuICAgICAgICByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKTtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0KTtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhvdCk7XG5cbiAgICAgICAgLy8gWFhYOiBpbiB0aGUgb3JpZ2luYWwgQysrIGNvZGUgZm9yIHRoZSBuZXh0IDIgbGluZXMsIHdlIGFyZVxuICAgICAgICAvLyBjb21wYXJpbmcgcG9pbnQgdmFsdWVzIChhbmQgbm90IHBvaW50ZXJzKS4gSW4gdGhpcyBKYXZhU2NyaXB0XG4gICAgICAgIC8vIGNvZGUsIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcyAocG9pbnRlcnMpLiBUaGlzIHdvcmtzXG4gICAgICAgIC8vIGJlY2F1c2Ugd2UgY2FuJ3QgaGF2ZSAyIGRpZmZlcmVudCBwb2ludHMgd2l0aCB0aGUgc2FtZSB2YWx1ZXMuXG4gICAgICAgIC8vIEJ1dCB0byBiZSByZWFsbHkgZXF1aXZhbGVudCwgd2Ugc2hvdWxkIHVzZSBcIlBvaW50LmVxdWFsc1wiIGhlcmUuXG4gICAgICAgIGlmIChwID09PSBlcSAmJiBvcCA9PT0gZXApIHtcbiAgICAgICAgICAgIGlmIChlcSA9PT0gdGN4LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZS5xICYmIGVwID09PSB0Y3guZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlLnApIHtcbiAgICAgICAgICAgICAgICB0Lm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlcCwgZXEpO1xuICAgICAgICAgICAgICAgIG90Lm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlcCwgZXEpO1xuICAgICAgICAgICAgICAgIGxlZ2FsaXplKHRjeCwgdCk7XG4gICAgICAgICAgICAgICAgbGVnYWxpemUodGN4LCBvdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFhYWDogSSB0aGluayBvbmUgb2YgdGhlIHRyaWFuZ2xlcyBzaG91bGQgYmUgbGVnYWxpemVkIGhlcmU/XG4gICAgICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvID0gb3JpZW50MmQoZXEsIG9wLCBlcCk7XG4gICAgICAgICAgICB0ID0gbmV4dEZsaXBUcmlhbmdsZSh0Y3gsIG8sIHQsIG90LCBwLCBvcCk7XG4gICAgICAgICAgICBmbGlwRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0LCBwKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdQID0gbmV4dEZsaXBQb2ludChlcCwgZXEsIG90LCBvcCk7XG4gICAgICAgIGZsaXBTY2FuRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0LCBvdCwgbmV3UCk7XG4gICAgICAgIGVkZ2VFdmVudEJ5UG9pbnRzKHRjeCwgZXAsIGVxLCB0LCBwKTtcbiAgICB9XG59XG5cbi8qKlxuICogQWZ0ZXIgYSBmbGlwIHdlIGhhdmUgdHdvIHRyaWFuZ2xlcyBhbmQga25vdyB0aGF0IG9ubHkgb25lIHdpbGwgc3RpbGwgYmVcbiAqIGludGVyc2VjdGluZyB0aGUgZWRnZS4gU28gZGVjaWRlIHdoaWNoIHRvIGNvbnRpdW5lIHdpdGggYW5kIGxlZ2FsaXplIHRoZSBvdGhlclxuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG8gLSBzaG91bGQgYmUgdGhlIHJlc3VsdCBvZiBhbiBvcmllbnQyZCggZXEsIG9wLCBlcCApXG4gKiBAcGFyYW0gdCAtIHRyaWFuZ2xlIDFcbiAqIEBwYXJhbSBvdCAtIHRyaWFuZ2xlIDJcbiAqIEBwYXJhbSBwIC0gYSBwb2ludCBzaGFyZWQgYnkgYm90aCB0cmlhbmdsZXNcbiAqIEBwYXJhbSBvcCAtIGFub3RoZXIgcG9pbnQgc2hhcmVkIGJ5IGJvdGggdHJpYW5nbGVzXG4gKiBAcmV0dXJuIHJldHVybnMgdGhlIHRyaWFuZ2xlIHN0aWxsIGludGVyc2VjdGluZyB0aGUgZWRnZVxuICovXG5mdW5jdGlvbiBuZXh0RmxpcFRyaWFuZ2xlKHRjeCwgbywgdCwgb3QsIHAsIG9wKSB7XG4gICAgdmFyIGVkZ2VfaW5kZXg7XG4gICAgaWYgKG8gPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAvLyBvdCBpcyBub3QgY3Jvc3NpbmcgZWRnZSBhZnRlciBmbGlwXG4gICAgICAgIGVkZ2VfaW5kZXggPSBvdC5lZGdlSW5kZXgocCwgb3ApO1xuICAgICAgICBvdC5kZWxhdW5heV9lZGdlW2VkZ2VfaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgbGVnYWxpemUodGN4LCBvdCk7XG4gICAgICAgIG90LmNsZWFyRGVsYXVuYXlFZGdlcygpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9XG5cbiAgICAvLyB0IGlzIG5vdCBjcm9zc2luZyBlZGdlIGFmdGVyIGZsaXBcbiAgICBlZGdlX2luZGV4ID0gdC5lZGdlSW5kZXgocCwgb3ApO1xuXG4gICAgdC5kZWxhdW5heV9lZGdlW2VkZ2VfaW5kZXhdID0gdHJ1ZTtcbiAgICBsZWdhbGl6ZSh0Y3gsIHQpO1xuICAgIHQuY2xlYXJEZWxhdW5heUVkZ2VzKCk7XG4gICAgcmV0dXJuIG90O1xufVxuXG4vKipcbiAqIFdoZW4gd2UgbmVlZCB0byB0cmF2ZXJzZSBmcm9tIG9uZSB0cmlhbmdsZSB0byB0aGUgbmV4dCB3ZSBuZWVkXG4gKiB0aGUgcG9pbnQgaW4gY3VycmVudCB0cmlhbmdsZSB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBwb2ludCB0byB0aGUgbmV4dFxuICogdHJpYW5nbGUuXG4gKi9cbmZ1bmN0aW9uIG5leHRGbGlwUG9pbnQoZXAsIGVxLCBvdCwgb3ApIHtcbiAgICB2YXIgbzJkID0gb3JpZW50MmQoZXEsIG9wLCBlcCk7XG4gICAgaWYgKG8yZCA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgLy8gUmlnaHRcbiAgICAgICAgcmV0dXJuIG90LnBvaW50Q0NXKG9wKTtcbiAgICB9IGVsc2UgaWYgKG8yZCA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgIC8vIExlZnRcbiAgICAgICAgcmV0dXJuIG90LnBvaW50Q1cob3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKFwicG9seTJ0cmkgW1Vuc3VwcG9ydGVkXSBuZXh0RmxpcFBvaW50OiBvcHBvc2luZyBwb2ludCBvbiBjb25zdHJhaW5lZCBlZGdlIVwiLCBbZXEsIG9wLCBlcF0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTY2FuIHBhcnQgb2YgdGhlIEZsaXBTY2FuIGFsZ29yaXRobTxicj5cbiAqIFdoZW4gYSB0cmlhbmdsZSBwYWlyIGlzbid0IGZsaXBwYWJsZSB3ZSB3aWxsIHNjYW4gZm9yIHRoZSBuZXh0XG4gKiBwb2ludCB0aGF0IGlzIGluc2lkZSB0aGUgZmxpcCB0cmlhbmdsZSBzY2FuIGFyZWEuIFdoZW4gZm91bmRcbiAqIHdlIGdlbmVyYXRlIGEgbmV3IGZsaXBFZGdlRXZlbnRcbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBlcCAtIGxhc3QgcG9pbnQgb24gdGhlIGVkZ2Ugd2UgYXJlIHRyYXZlcnNpbmdcbiAqIEBwYXJhbSBlcSAtIGZpcnN0IHBvaW50IG9uIHRoZSBlZGdlIHdlIGFyZSB0cmF2ZXJzaW5nXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gZmxpcF90cmlhbmdsZSAtIHRoZSBjdXJyZW50IHRyaWFuZ2xlIHNoYXJpbmcgdGhlIHBvaW50IGVxIHdpdGggZWRnZVxuICogQHBhcmFtIHRcbiAqIEBwYXJhbSBwXG4gKi9cbmZ1bmN0aW9uIGZsaXBTY2FuRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCBmbGlwX3RyaWFuZ2xlLCB0LCBwKSB7XG4gICAgdmFyIG90ID0gdC5uZWlnaGJvckFjcm9zcyhwKTtcbiAgICBhc3NlcnQob3QsIFwiRkxJUCBmYWlsZWQgZHVlIHRvIG1pc3NpbmcgdHJpYW5nbGVcIik7XG5cbiAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuXG4gICAgaWYgKGluU2NhbkFyZWEoZXEsIGZsaXBfdHJpYW5nbGUucG9pbnRDQ1coZXEpLCBmbGlwX3RyaWFuZ2xlLnBvaW50Q1coZXEpLCBvcCkpIHtcbiAgICAgICAgLy8gZmxpcCB3aXRoIG5ldyBlZGdlIG9wLmVxXG4gICAgICAgIGZsaXBFZGdlRXZlbnQodGN4LCBlcSwgb3AsIG90LCBvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1AgPSBuZXh0RmxpcFBvaW50KGVwLCBlcSwgb3QsIG9wKTtcbiAgICAgICAgZmxpcFNjYW5FZGdlRXZlbnQodGN4LCBlcCwgZXEsIGZsaXBfdHJpYW5nbGUsIG90LCBuZXdQKTtcbiAgICB9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHNcblxuZXhwb3J0cy50cmlhbmd1bGF0ZSA9IHRyaWFuZ3VsYXRlO1xuXG59LHtcIi4vYWR2YW5jaW5nZnJvbnRcIjoyLFwiLi9hc3NlcnRcIjozLFwiLi9wb2ludGVycm9yXCI6NSxcIi4vdHJpYW5nbGVcIjo5LFwiLi91dGlsc1wiOjEwfV0sODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuLyoganNoaW50IG1heGNvbXBsZXhpdHk6NiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgUG9pbnRFcnJvciA9IF9kZXJlcV8oJy4vcG9pbnRlcnJvcicpO1xudmFyIFBvaW50ID0gX2RlcmVxXygnLi9wb2ludCcpO1xudmFyIFRyaWFuZ2xlID0gX2RlcmVxXygnLi90cmlhbmdsZScpO1xudmFyIHN3ZWVwID0gX2RlcmVxXygnLi9zd2VlcCcpO1xudmFyIEFkdmFuY2luZ0Zyb250ID0gX2RlcmVxXygnLi9hZHZhbmNpbmdmcm9udCcpO1xudmFyIE5vZGUgPSBBZHZhbmNpbmdGcm9udC5Ob2RlO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXV0aWxzXG5cbi8qKlxuICogSW5pdGlhbCB0cmlhbmdsZSBmYWN0b3IsIHNlZWQgdHJpYW5nbGUgd2lsbCBleHRlbmQgMzAlIG9mXG4gKiBQb2ludFNldCB3aWR0aCB0byBib3RoIGxlZnQgYW5kIHJpZ2h0LlxuICogQHByaXZhdGVcbiAqIEBjb25zdFxuICovXG52YXIga0FscGhhID0gMC4zO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FZGdlXG4vKipcbiAqIFJlcHJlc2VudHMgYSBzaW1wbGUgcG9seWdvbidzIGVkZ2VcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7UG9pbnR9IHAxXG4gKiBAcGFyYW0ge1BvaW50fSBwMlxuICogQHRocm93IHtQb2ludEVycm9yfSBpZiBwMSBpcyBzYW1lIGFzIHAyXG4gKi9cbnZhciBFZGdlID0gZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgdGhpcy5wID0gcDE7XG4gICAgdGhpcy5xID0gcDI7XG5cbiAgICBpZiAocDEueSA+IHAyLnkpIHtcbiAgICAgICAgdGhpcy5xID0gcDE7XG4gICAgICAgIHRoaXMucCA9IHAyO1xuICAgIH0gZWxzZSBpZiAocDEueSA9PT0gcDIueSkge1xuICAgICAgICBpZiAocDEueCA+IHAyLngpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IHAxO1xuICAgICAgICAgICAgdGhpcy5wID0gcDI7XG4gICAgICAgIH0gZWxzZSBpZiAocDEueCA9PT0gcDIueCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoJ3BvbHkydHJpIEludmFsaWQgRWRnZSBjb25zdHJ1Y3RvcjogcmVwZWF0ZWQgcG9pbnRzIScsIFtwMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnEuX3AydF9lZGdlX2xpc3QpIHtcbiAgICAgICAgdGhpcy5xLl9wMnRfZWRnZV9saXN0ID0gW107XG4gICAgfVxuICAgIHRoaXMucS5fcDJ0X2VkZ2VfbGlzdC5wdXNoKHRoaXMpO1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1CYXNpblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBCYXNpbiA9IGZ1bmN0aW9uKCkge1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLmxlZnRfbm9kZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMuYm90dG9tX25vZGUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLnJpZ2h0X25vZGUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIHRoaXMud2lkdGggPSAwLjA7XG4gICAgLyoqIEB0eXBlIHtib29sZWFufSAqL1xuICAgIHRoaXMubGVmdF9oaWdoZXN0ID0gZmFsc2U7XG59O1xuXG5CYXNpbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxlZnRfbm9kZSA9IG51bGw7XG4gICAgdGhpcy5ib3R0b21fbm9kZSA9IG51bGw7XG4gICAgdGhpcy5yaWdodF9ub2RlID0gbnVsbDtcbiAgICB0aGlzLndpZHRoID0gMC4wO1xuICAgIHRoaXMubGVmdF9oaWdoZXN0ID0gZmFsc2U7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUVkZ2VFdmVudFxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBFZGdlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAvKiogQHR5cGUge0VkZ2V9ICovXG4gICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlID0gbnVsbDtcbiAgICAvKiogQHR5cGUge2Jvb2xlYW59ICovXG4gICAgdGhpcy5yaWdodCA9IGZhbHNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVN3ZWVwQ29udGV4dCAocHVibGljIEFQSSlcbi8qKlxuICogU3dlZXBDb250ZXh0IGNvbnN0cnVjdG9yIG9wdGlvblxuICogQHR5cGVkZWYge09iamVjdH0gU3dlZXBDb250ZXh0T3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFuPX0gY2xvbmVBcnJheXMgLSBpZiA8Y29kZT50cnVlPC9jb2RlPiwgZG8gYSBzaGFsbG93IGNvcHkgb2YgdGhlIEFycmF5IHBhcmFtZXRlcnNcbiAqICAgICAgICAgICAgICAgICAgKGNvbnRvdXIsIGhvbGVzKS4gUG9pbnRzIGluc2lkZSBhcnJheXMgYXJlIG5ldmVyIGNvcGllZC5cbiAqICAgICAgICAgICAgICAgICAgRGVmYXVsdCBpcyA8Y29kZT5mYWxzZTwvY29kZT4gOiBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBhcnJheSBhcmd1bWVudHMsXG4gKiAgICAgICAgICAgICAgICAgIHdobyB3aWxsIGJlIG1vZGlmaWVkIGluIHBsYWNlLlxuICovXG4vKipcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgdHJpYW5ndWxhdGlvbiBjb250ZXh0LlxuICogSXQgYWNjZXB0cyBhIHNpbXBsZSBwb2x5bGluZSAod2l0aCBub24gcmVwZWF0aW5nIHBvaW50cyksIFxuICogd2hpY2ggZGVmaW5lcyB0aGUgY29uc3RyYWluZWQgZWRnZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgICAgIHZhciBjb250b3VyID0gW1xuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgxMDAsIDEwMCksXG4gKiAgICAgICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDEwMCwgMzAwKSxcbiAqICAgICAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMzAwLCAzMDApLFxuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDEwMClcbiAqICAgICAgICAgIF07XG4gKiAgICAgICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIsIHtjbG9uZUFycmF5czogdHJ1ZX0pO1xuICogQGV4YW1wbGVcbiAqICAgICAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDB9LCB7eDoxMDAsIHk6MzAwfSwge3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeToxMDB9XTtcbiAqICAgICAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91ciwge2Nsb25lQXJyYXlzOiB0cnVlfSk7XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPn0gY29udG91ciAtIGFycmF5IG9mIHBvaW50IG9iamVjdHMuIFRoZSBwb2ludHMgY2FuIGJlIGVpdGhlciB7QGxpbmtjb2RlIFBvaW50fSBpbnN0YW5jZXMsXG4gKiAgICAgICAgICBvciBhbnkgXCJQb2ludCBsaWtlXCIgY3VzdG9tIGNsYXNzIHdpdGggPGNvZGU+e3gsIHl9PC9jb2RlPiBhdHRyaWJ1dGVzLlxuICogQHBhcmFtIHtTd2VlcENvbnRleHRPcHRpb25zPX0gb3B0aW9ucyAtIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAqL1xudmFyIFN3ZWVwQ29udGV4dCA9IGZ1bmN0aW9uKGNvbnRvdXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRyaWFuZ2xlc18gPSBbXTtcbiAgICB0aGlzLm1hcF8gPSBbXTtcbiAgICB0aGlzLnBvaW50c18gPSAob3B0aW9ucy5jbG9uZUFycmF5cyA/IGNvbnRvdXIuc2xpY2UoMCkgOiBjb250b3VyKTtcbiAgICB0aGlzLmVkZ2VfbGlzdCA9IFtdO1xuXG4gICAgLy8gQm91bmRpbmcgYm94IG9mIGFsbCBwb2ludHMuIENvbXB1dGVkIGF0IHRoZSBzdGFydCBvZiB0aGUgdHJpYW5ndWxhdGlvbiwgXG4gICAgLy8gaXQgaXMgc3RvcmVkIGluIGNhc2UgaXQgaXMgbmVlZGVkIGJ5IHRoZSBjYWxsZXIuXG4gICAgdGhpcy5wbWluXyA9IHRoaXMucG1heF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQWR2YW5jaW5nIGZyb250XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QWR2YW5jaW5nRnJvbnR9XG4gICAgICovXG4gICAgdGhpcy5mcm9udF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogaGVhZCBwb2ludCB1c2VkIHdpdGggYWR2YW5jaW5nIGZyb250XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7UG9pbnR9XG4gICAgICovXG4gICAgdGhpcy5oZWFkXyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0YWlsIHBvaW50IHVzZWQgd2l0aCBhZHZhbmNpbmcgZnJvbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKi9cbiAgICB0aGlzLnRhaWxfID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICovXG4gICAgdGhpcy5hZl9oZWFkXyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgKi9cbiAgICB0aGlzLmFmX21pZGRsZV8gPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICovXG4gICAgdGhpcy5hZl90YWlsXyA9IG51bGw7XG5cbiAgICB0aGlzLmJhc2luID0gbmV3IEJhc2luKCk7XG4gICAgdGhpcy5lZGdlX2V2ZW50ID0gbmV3IEVkZ2VFdmVudCgpO1xuXG4gICAgdGhpcy5pbml0RWRnZXModGhpcy5wb2ludHNfKTtcbn07XG5cblxuLyoqXG4gKiBBZGQgYSBob2xlIHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIGhvbGUgPSBbXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyMDApLFxuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjUwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyNTAsIDI1MClcbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkSG9sZShob2xlKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LmFkZEhvbGUoW3t4OjIwMCwgeToyMDB9LCB7eDoyMDAsIHk6MjUwfSwge3g6MjUwLCB5OjI1MH1dKTtcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPn0gcG9seWxpbmUgLSBhcnJheSBvZiBcIlBvaW50IGxpa2VcIiBvYmplY3RzIHdpdGgge3gseX1cbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRIb2xlID0gZnVuY3Rpb24ocG9seWxpbmUpIHtcbiAgICB0aGlzLmluaXRFZGdlcyhwb2x5bGluZSk7XG4gICAgdmFyIGksIGxlbiA9IHBvbHlsaW5lLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdGhpcy5wb2ludHNfLnB1c2gocG9seWxpbmVbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCNhZGRIb2xlfSBpbnN0ZWFkXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuQWRkSG9sZSA9IFN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkSG9sZTtcblxuXG4vKipcbiAqIEFkZCBzZXZlcmFsIGhvbGVzIHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIGhvbGVzID0gW1xuICogICAgICAgICAgWyBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyMDApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyNTApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMjUwLCAyNTApIF0sXG4gKiAgICAgICAgICBbIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDMwMCksIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDM1MCksIG5ldyBwb2x5MnRyaS5Qb2ludCgzNTAsIDM1MCkgXVxuICogICAgICBdO1xuICogICAgICBzd2N0eC5hZGRIb2xlcyhob2xlcyk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgaG9sZXMgPSBbXG4gKiAgICAgICAgICBbe3g6MjAwLCB5OjIwMH0sIHt4OjIwMCwgeToyNTB9LCB7eDoyNTAsIHk6MjUwfV0sXG4gKiAgICAgICAgICBbe3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeTozNTB9LCB7eDozNTAsIHk6MzUwfV1cbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkSG9sZXMoaG9sZXMpO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPFhZPj59IGhvbGVzIC0gYXJyYXkgb2YgYXJyYXkgb2YgXCJQb2ludCBsaWtlXCIgb2JqZWN0cyB3aXRoIHt4LHl9XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRIb2xlcyA9IGZ1bmN0aW9uKGhvbGVzKSB7XG4gICAgdmFyIGksIGxlbiA9IGhvbGVzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdGhpcy5pbml0RWRnZXMoaG9sZXNbaV0pO1xuICAgIH1cbiAgICB0aGlzLnBvaW50c18gPSB0aGlzLnBvaW50c18uY29uY2F0LmFwcGx5KHRoaXMucG9pbnRzXywgaG9sZXMpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cblxuLyoqXG4gKiBBZGQgYSBTdGVpbmVyIHBvaW50IHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIHBvaW50ID0gbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnQocG9pbnQpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnQoe3g6MTUwLCB5OjE1MH0pO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtYWX0gcG9pbnQgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdGhpcy5wb2ludHNfLnB1c2gocG9pbnQpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I2FkZFBvaW50fSBpbnN0ZWFkXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuQWRkUG9pbnQgPSBTd2VlcENvbnRleHQucHJvdG90eXBlLmFkZFBvaW50O1xuXG5cbi8qKlxuICogQWRkIHNldmVyYWwgU3RlaW5lciBwb2ludHMgdG8gdGhlIGNvbnN0cmFpbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgcG9pbnRzID0gW1xuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDI1MCksXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjUwLCAyNTApXG4gKiAgICAgIF07XG4gKiAgICAgIHN3Y3R4LmFkZFBvaW50cyhwb2ludHMpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnRzKFt7eDoxNTAsIHk6MTUwfSwge3g6MjAwLCB5OjI1MH0sIHt4OjI1MCwgeToyNTB9XSk7XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0FycmF5LjxYWT59IHBvaW50cyAtIGFycmF5IG9mIFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRQb2ludHMgPSBmdW5jdGlvbihwb2ludHMpIHtcbiAgICB0aGlzLnBvaW50c18gPSB0aGlzLnBvaW50c18uY29uY2F0KHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuXG4vKipcbiAqIFRyaWFuZ3VsYXRlIHRoZSBwb2x5Z29uIHdpdGggaG9sZXMgYW5kIFN0ZWluZXIgcG9pbnRzLlxuICogRG8gdGhpcyBBRlRFUiB5b3UndmUgYWRkZWQgdGhlIHBvbHlsaW5lLCBob2xlcywgYW5kIFN0ZWluZXIgcG9pbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiBAcHVibGljXG4gKi9cbi8vIFNob3J0Y3V0IG1ldGhvZCBmb3Igc3dlZXAudHJpYW5ndWxhdGUoU3dlZXBDb250ZXh0KS5cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS50cmlhbmd1bGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHN3ZWVwLnRyaWFuZ3VsYXRlKHRoaXMpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cblxuLyoqXG4gKiBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgcHJvdmlkZWQgY29uc3RyYWludHMgKGNvbnRvdXIsIGhvbGVzIGFuZCBcbiAqIFN0ZWludGVyIHBvaW50cykuIFdhcm5pbmcgOiB0aGVzZSB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgaWYgdGhlIHRyaWFuZ3VsYXRpb24gXG4gKiBoYXMgbm90IGJlZW4gZG9uZSB5ZXQuXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7e21pbjpQb2ludCxtYXg6UG9pbnR9fSBvYmplY3Qgd2l0aCAnbWluJyBhbmQgJ21heCcgUG9pbnRcbiAqL1xuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldEJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHttaW46IHRoaXMucG1pbl8sIG1heDogdGhpcy5wbWF4X307XG59O1xuXG4vKipcbiAqIEdldCByZXN1bHQgb2YgdHJpYW5ndWxhdGlvbi5cbiAqIFRoZSBvdXRwdXQgdHJpYW5nbGVzIGhhdmUgdmVydGljZXMgd2hpY2ggYXJlIHJlZmVyZW5jZXNcbiAqIHRvIHRoZSBpbml0aWFsIGlucHV0IHBvaW50cyAobm90IGNvcGllcyk6IGFueSBjdXN0b20gZmllbGRzIGluIHRoZVxuICogaW5pdGlhbCBwb2ludHMgY2FuIGJlIHJldHJpZXZlZCBpbiB0aGUgb3V0cHV0IHRyaWFuZ2xlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDAsIGlkOjF9LCB7eDoxMDAsIHk6MzAwLCBpZDoyfSwge3g6MzAwLCB5OjMwMCwgaWQ6M31dO1xuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiAgICAgIHR5cGVvZiB0cmlhbmdsZXNbMF0uZ2V0UG9pbnQoMCkuaWRcbiAqICAgICAgLy8g4oaSIFwibnVtYmVyXCJcbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHthcnJheTxUcmlhbmdsZT59ICAgYXJyYXkgb2YgdHJpYW5nbGVzXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJpYW5nbGVzXztcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I2dldFRyaWFuZ2xlc30gaW5zdGVhZFxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLkdldFRyaWFuZ2xlcyA9IFN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVN3ZWVwQ29udGV4dCAocHJpdmF0ZSBBUEkpXG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5mcm9udCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmZyb250Xztcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5wb2ludENvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzXy5sZW5ndGg7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuaGVhZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWRfO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnNldEhlYWQgPSBmdW5jdGlvbihwMSkge1xuICAgIHRoaXMuaGVhZF8gPSBwMTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS50YWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuc2V0VGFpbCA9IGZ1bmN0aW9uKHAxKSB7XG4gICAgdGhpcy50YWlsXyA9IHAxO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuaW5pdFRyaWFuZ3VsYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeG1heCA9IHRoaXMucG9pbnRzX1swXS54O1xuICAgIHZhciB4bWluID0gdGhpcy5wb2ludHNfWzBdLng7XG4gICAgdmFyIHltYXggPSB0aGlzLnBvaW50c19bMF0ueTtcbiAgICB2YXIgeW1pbiA9IHRoaXMucG9pbnRzX1swXS55O1xuXG4gICAgLy8gQ2FsY3VsYXRlIGJvdW5kc1xuICAgIHZhciBpLCBsZW4gPSB0aGlzLnBvaW50c18ubGVuZ3RoO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgcCA9IHRoaXMucG9pbnRzX1tpXTtcbiAgICAgICAgLyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuICAgICAgICAocC54ID4geG1heCkgJiYgKHhtYXggPSBwLngpO1xuICAgICAgICAocC54IDwgeG1pbikgJiYgKHhtaW4gPSBwLngpO1xuICAgICAgICAocC55ID4geW1heCkgJiYgKHltYXggPSBwLnkpO1xuICAgICAgICAocC55IDwgeW1pbikgJiYgKHltaW4gPSBwLnkpO1xuICAgIH1cbiAgICB0aGlzLnBtaW5fID0gbmV3IFBvaW50KHhtaW4sIHltaW4pO1xuICAgIHRoaXMucG1heF8gPSBuZXcgUG9pbnQoeG1heCwgeW1heCk7XG5cbiAgICB2YXIgZHggPSBrQWxwaGEgKiAoeG1heCAtIHhtaW4pO1xuICAgIHZhciBkeSA9IGtBbHBoYSAqICh5bWF4IC0geW1pbik7XG4gICAgdGhpcy5oZWFkXyA9IG5ldyBQb2ludCh4bWF4ICsgZHgsIHltaW4gLSBkeSk7XG4gICAgdGhpcy50YWlsXyA9IG5ldyBQb2ludCh4bWluIC0gZHgsIHltaW4gLSBkeSk7XG5cbiAgICAvLyBTb3J0IHBvaW50cyBhbG9uZyB5LWF4aXNcbiAgICB0aGlzLnBvaW50c18uc29ydChQb2ludC5jb21wYXJlKTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5pbml0RWRnZXMgPSBmdW5jdGlvbihwb2x5bGluZSkge1xuICAgIHZhciBpLCBsZW4gPSBwb2x5bGluZS5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHRoaXMuZWRnZV9saXN0LnB1c2gobmV3IEVkZ2UocG9seWxpbmVbaV0sIHBvbHlsaW5lWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldFBvaW50ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfW2luZGV4XTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRUb01hcCA9IGZ1bmN0aW9uKHRyaWFuZ2xlKSB7XG4gICAgdGhpcy5tYXBfLnB1c2godHJpYW5nbGUpO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmxvY2F0ZU5vZGUgPSBmdW5jdGlvbihwb2ludCkge1xuICAgIHJldHVybiB0aGlzLmZyb250Xy5sb2NhdGVOb2RlKHBvaW50LngpO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmNyZWF0ZUFkdmFuY2luZ0Zyb250ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWQ7XG4gICAgdmFyIG1pZGRsZTtcbiAgICB2YXIgdGFpbDtcbiAgICAvLyBJbml0aWFsIHRyaWFuZ2xlXG4gICAgdmFyIHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKHRoaXMucG9pbnRzX1swXSwgdGhpcy50YWlsXywgdGhpcy5oZWFkXyk7XG5cbiAgICB0aGlzLm1hcF8ucHVzaCh0cmlhbmdsZSk7XG5cbiAgICBoZWFkID0gbmV3IE5vZGUodHJpYW5nbGUuZ2V0UG9pbnQoMSksIHRyaWFuZ2xlKTtcbiAgICBtaWRkbGUgPSBuZXcgTm9kZSh0cmlhbmdsZS5nZXRQb2ludCgwKSwgdHJpYW5nbGUpO1xuICAgIHRhaWwgPSBuZXcgTm9kZSh0cmlhbmdsZS5nZXRQb2ludCgyKSk7XG5cbiAgICB0aGlzLmZyb250XyA9IG5ldyBBZHZhbmNpbmdGcm9udChoZWFkLCB0YWlsKTtcblxuICAgIGhlYWQubmV4dCA9IG1pZGRsZTtcbiAgICBtaWRkbGUubmV4dCA9IHRhaWw7XG4gICAgbWlkZGxlLnByZXYgPSBoZWFkO1xuICAgIHRhaWwucHJldiA9IG1pZGRsZTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5yZW1vdmVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgICAvKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUubWFwVHJpYW5nbGVUb05vZGVzID0gZnVuY3Rpb24odCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgKytpKSB7XG4gICAgICAgIGlmICghdC5nZXROZWlnaGJvcihpKSkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLmZyb250Xy5sb2NhdGVQb2ludCh0LnBvaW50Q1codC5nZXRQb2ludChpKSkpO1xuICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICBuLnRyaWFuZ2xlID0gdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5yZW1vdmVGcm9tTWFwID0gZnVuY3Rpb24odHJpYW5nbGUpIHtcbiAgICB2YXIgaSwgbWFwID0gdGhpcy5tYXBfLCBsZW4gPSBtYXAubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobWFwW2ldID09PSB0cmlhbmdsZSkge1xuICAgICAgICAgICAgbWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBEbyBhIGRlcHRoIGZpcnN0IHRyYXZlcnNhbCB0byBjb2xsZWN0IHRyaWFuZ2xlc1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7VHJpYW5nbGV9IHRyaWFuZ2xlIHN0YXJ0XG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUubWVzaENsZWFuID0gZnVuY3Rpb24odHJpYW5nbGUpIHtcbiAgICAvLyBOZXcgaW1wbGVtZW50YXRpb24gYXZvaWRzIHJlY3Vyc2l2ZSBjYWxscyBhbmQgdXNlIGEgbG9vcCBpbnN0ZWFkLlxuICAgIC8vIENmLiBpc3N1ZXMgIyA1NywgNjUgYW5kIDY5LlxuICAgIHZhciB0cmlhbmdsZXMgPSBbdHJpYW5nbGVdLCB0LCBpO1xuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB3aGlsZSAodCA9IHRyaWFuZ2xlcy5wb3AoKSkge1xuICAgICAgICBpZiAoIXQuaXNJbnRlcmlvcigpKSB7XG4gICAgICAgICAgICB0LnNldEludGVyaW9yKHRydWUpO1xuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXNfLnB1c2godCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0LmNvbnN0cmFpbmVkX2VkZ2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2godC5nZXROZWlnaGJvcihpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHNcblxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcENvbnRleHQ7XG5cbn0se1wiLi9hZHZhbmNpbmdmcm9udFwiOjIsXCIuL3BvaW50XCI6NCxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3N3ZWVwXCI6NyxcIi4vdHJpYW5nbGVcIjo5fV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbWF4Y29tcGxleGl0eToxMCAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgeHkgPSBfZGVyZXFfKFwiLi94eVwiKTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1UcmlhbmdsZVxuLyoqXG4gKiBUcmlhbmdsZSBjbGFzcy48YnI+XG4gKiBUcmlhbmdsZS1iYXNlZCBkYXRhIHN0cnVjdHVyZXMgYXJlIGtub3duIHRvIGhhdmUgYmV0dGVyIHBlcmZvcm1hbmNlIHRoYW5cbiAqIHF1YWQtZWRnZSBzdHJ1Y3R1cmVzLlxuICogU2VlOiBKLiBTaGV3Y2h1aywgXCJUcmlhbmdsZTogRW5naW5lZXJpbmcgYSAyRCBRdWFsaXR5IE1lc2ggR2VuZXJhdG9yIGFuZFxuICogRGVsYXVuYXkgVHJpYW5ndWxhdG9yXCIsIFwiVHJpYW5ndWxhdGlvbnMgaW4gQ0dBTFwiXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0geyFYWX0gcGEgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGIgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGMgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cbnZhciBUcmlhbmdsZSA9IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAvKipcbiAgICAgKiBUcmlhbmdsZSBwb2ludHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48WFk+fVxuICAgICAqL1xuICAgIHRoaXMucG9pbnRzXyA9IFthLCBiLCBjXTtcblxuICAgIC8qKlxuICAgICAqIE5laWdoYm9yIGxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48VHJpYW5nbGU+fVxuICAgICAqL1xuICAgIHRoaXMubmVpZ2hib3JzXyA9IFtudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIEhhcyB0aGlzIHRyaWFuZ2xlIGJlZW4gbWFya2VkIGFzIGFuIGludGVyaW9yIHRyaWFuZ2xlP1xuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5pbnRlcmlvcl8gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEZsYWdzIHRvIGRldGVybWluZSBpZiBhbiBlZGdlIGlzIGEgQ29uc3RyYWluZWQgZWRnZVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5Ljxib29sZWFuPn1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2UgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XG5cbiAgICAvKipcbiAgICAgKiBGbGFncyB0byBkZXRlcm1pbmUgaWYgYW4gZWRnZSBpcyBhIERlbGF1bmV5IGVkZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48Ym9vbGVhbj59XG4gICAgICovXG4gICAgdGhpcy5kZWxhdW5heV9lZGdlID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdO1xufTtcblxudmFyIHAycyA9IHh5LnRvU3RyaW5nO1xuLyoqXG4gKiBGb3IgcHJldHR5IHByaW50aW5nIGV4LiA8Y29kZT5cIlsoNTs0MikoMTA7MjApKDIxOzMwKV1cIjwvY29kZT4uXG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXCJbXCIgKyBwMnModGhpcy5wb2ludHNfWzBdKSArIHAycyh0aGlzLnBvaW50c19bMV0pICsgcDJzKHRoaXMucG9pbnRzX1syXSkgKyBcIl1cIik7XG59O1xuXG4vKipcbiAqIEdldCBvbmUgdmVydGljZSBvZiB0aGUgdHJpYW5nbGUuXG4gKiBUaGUgb3V0cHV0IHRyaWFuZ2xlcyBvZiBhIHRyaWFuZ3VsYXRpb24gaGF2ZSB2ZXJ0aWNlcyB3aGljaCBhcmUgcmVmZXJlbmNlc1xuICogdG8gdGhlIGluaXRpYWwgaW5wdXQgcG9pbnRzIChub3QgY29waWVzKTogYW55IGN1c3RvbSBmaWVsZHMgaW4gdGhlXG4gKiBpbml0aWFsIHBvaW50cyBjYW4gYmUgcmV0cmlldmVkIGluIHRoZSBvdXRwdXQgdHJpYW5nbGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIGNvbnRvdXIgPSBbe3g6MTAwLCB5OjEwMCwgaWQ6MX0sIHt4OjEwMCwgeTozMDAsIGlkOjJ9LCB7eDozMDAsIHk6MzAwLCBpZDozfV07XG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqICAgICAgdHlwZW9mIHRyaWFuZ2xlc1swXS5nZXRQb2ludCgwKS5pZFxuICogICAgICAvLyDihpIgXCJudW1iZXJcIlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gdmVydGljZSBpbmRleDogMCwgMSBvciAyXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7WFl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzX1tpbmRleF07XG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFRyaWFuZ2xlI2dldFBvaW50fSBpbnN0ZWFkXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5HZXRQb2ludCA9IFRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludDtcblxuLyoqXG4gKiBHZXQgYWxsIDMgdmVydGljZXMgb2YgdGhlIHRyaWFuZ2xlIGFzIGFuIGFycmF5XG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHtBcnJheS48WFk+fVxuICovXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJucyB7P1RyaWFuZ2xlfVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3IgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19baW5kZXhdO1xufTtcblxuLyoqXG4gKiBUZXN0IGlmIHRoaXMgVHJpYW5nbGUgY29udGFpbnMgdGhlIFBvaW50IG9iamVjdCBnaXZlbiBhcyBwYXJhbWV0ZXIgYXMgb25lIG9mIGl0cyB2ZXJ0aWNlcy5cbiAqIE9ubHkgcG9pbnQgcmVmZXJlbmNlcyBhcmUgY29tcGFyZWQsIG5vdCB2YWx1ZXMuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge1hZfSBwb2ludCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSA8Y29kZT5UcnVlPC9jb2RlPiBpZiB0aGUgUG9pbnQgb2JqZWN0IGlzIG9mIHRoZSBUcmlhbmdsZSdzIHZlcnRpY2VzLFxuICogICAgICAgICA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIHJldHVybiAocG9pbnQgPT09IHBvaW50c1swXSB8fCBwb2ludCA9PT0gcG9pbnRzWzFdIHx8IHBvaW50ID09PSBwb2ludHNbMl0pO1xufTtcblxuLyoqXG4gKiBUZXN0IGlmIHRoaXMgVHJpYW5nbGUgY29udGFpbnMgdGhlIEVkZ2Ugb2JqZWN0IGdpdmVuIGFzIHBhcmFtZXRlciBhcyBpdHNcbiAqIGJvdW5kaW5nIGVkZ2VzLiBPbmx5IHBvaW50IHJlZmVyZW5jZXMgYXJlIGNvbXBhcmVkLCBub3QgdmFsdWVzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZVxuICogQHJldHVybiB7Ym9vbGVhbn0gPGNvZGU+VHJ1ZTwvY29kZT4gaWYgdGhlIEVkZ2Ugb2JqZWN0IGlzIG9mIHRoZSBUcmlhbmdsZSdzIGJvdW5kaW5nXG4gKiAgICAgICAgIGVkZ2VzLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNFZGdlID0gZnVuY3Rpb24oZWRnZSkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zUG9pbnQoZWRnZS5wKSAmJiB0aGlzLmNvbnRhaW5zUG9pbnQoZWRnZS5xKTtcbn07XG5cbi8qKlxuICogVGVzdCBpZiB0aGlzIFRyaWFuZ2xlIGNvbnRhaW5zIHRoZSB0d28gUG9pbnQgb2JqZWN0cyBnaXZlbiBhcyBwYXJhbWV0ZXJzIGFtb25nIGl0cyB2ZXJ0aWNlcy5cbiAqIE9ubHkgcG9pbnQgcmVmZXJlbmNlcyBhcmUgY29tcGFyZWQsIG5vdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge1hZfSBwMSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBwMiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNQb2ludHMgPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHAxKSAmJiB0aGlzLmNvbnRhaW5zUG9pbnQocDIpO1xufTtcblxuLyoqXG4gKiBIYXMgdGhpcyB0cmlhbmdsZSBiZWVuIG1hcmtlZCBhcyBhbiBpbnRlcmlvciB0cmlhbmdsZT9cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuaXNJbnRlcmlvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmludGVyaW9yXztcbn07XG5cbi8qKlxuICogTWFyayB0aGlzIHRyaWFuZ2xlIGFzIGFuIGludGVyaW9yIHRyaWFuZ2xlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBpbnRlcmlvclxuICogQHJldHVybnMge1RyaWFuZ2xlfSB0aGlzXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXRJbnRlcmlvciA9IGZ1bmN0aW9uKGludGVyaW9yKSB7XG4gICAgdGhpcy5pbnRlcmlvcl8gPSBpbnRlcmlvcjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVXBkYXRlIG5laWdoYm9yIHBvaW50ZXJzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAxIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHAyIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7VHJpYW5nbGV9IHQgVHJpYW5nbGUgb2JqZWN0LlxuICogQHRocm93cyB7RXJyb3J9IGlmIGNhbid0IGZpbmQgb2JqZWN0c1xuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya05laWdoYm9yUG9pbnRlcnMgPSBmdW5jdGlvbihwMSwgcDIsIHQpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKChwMSA9PT0gcG9pbnRzWzJdICYmIHAyID09PSBwb2ludHNbMV0pIHx8IChwMSA9PT0gcG9pbnRzWzFdICYmIHAyID09PSBwb2ludHNbMl0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IHQ7XG4gICAgfSBlbHNlIGlmICgocDEgPT09IHBvaW50c1swXSAmJiBwMiA9PT0gcG9pbnRzWzJdKSB8fCAocDEgPT09IHBvaW50c1syXSAmJiBwMiA9PT0gcG9pbnRzWzBdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMV0gPSB0O1xuICAgIH0gZWxzZSBpZiAoKHAxID09PSBwb2ludHNbMF0gJiYgcDIgPT09IHBvaW50c1sxXSkgfHwgKHAxID09PSBwb2ludHNbMV0gJiYgcDIgPT09IHBvaW50c1swXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzJdID0gdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgVHJpYW5nbGUubWFya05laWdoYm9yUG9pbnRlcnMoKSBjYWxsJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBFeGhhdXN0aXZlIHNlYXJjaCB0byB1cGRhdGUgbmVpZ2hib3IgcG9pbnRlcnNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gdFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya05laWdoYm9yID0gZnVuY3Rpb24odCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgaWYgKHQuY29udGFpbnNQb2ludHMocG9pbnRzWzFdLCBwb2ludHNbMl0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IHQ7XG4gICAgICAgIHQubWFya05laWdoYm9yUG9pbnRlcnMocG9pbnRzWzFdLCBwb2ludHNbMl0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodC5jb250YWluc1BvaW50cyhwb2ludHNbMF0sIHBvaW50c1syXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzFdID0gdDtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3JQb2ludGVycyhwb2ludHNbMF0sIHBvaW50c1syXSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh0LmNvbnRhaW5zUG9pbnRzKHBvaW50c1swXSwgcG9pbnRzWzFdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMl0gPSB0O1xuICAgICAgICB0Lm1hcmtOZWlnaGJvclBvaW50ZXJzKHBvaW50c1swXSwgcG9pbnRzWzFdLCB0aGlzKTtcbiAgICB9XG59O1xuXG5cblRyaWFuZ2xlLnByb3RvdHlwZS5jbGVhck5laWdoYm9ycyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IG51bGw7XG4gICAgdGhpcy5uZWlnaGJvcnNfWzFdID0gbnVsbDtcbiAgICB0aGlzLm5laWdoYm9yc19bMl0gPSBudWxsO1xufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmNsZWFyRGVsYXVuYXlFZGdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVswXSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsxXSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsyXSA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb2ludCBjbG9ja3dpc2UgdG8gdGhlIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUucG9pbnRDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHBvaW50c1swXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMF07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHBvaW50IGNvdW50ZXItY2xvY2t3aXNlIHRvIHRoZSBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLnBvaW50Q0NXID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMV07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1syXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1syXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmVpZ2hib3IgY2xvY2t3aXNlIHRvIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubmVpZ2hib3JDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1sxXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMF07XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZWlnaGJvciBjb3VudGVyLWNsb2Nrd2lzZSB0byBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm5laWdoYm9yQ0NXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1sxXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRDb25zdHJhaW5lZEVkZ2VDQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdO1xuICAgIH1cbn07XG5cbi8vIEFkZGl0aW9uYWwgY2hlY2sgZnJvbSBKYXZhIHZlcnNpb24gKHNlZSBpc3N1ZSAjODgpXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQWNyb3NzID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ1cgPSBmdW5jdGlvbihwLCBjZSkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV0gPSBjZTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl0gPSBjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF0gPSBjZTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ0NXID0gZnVuY3Rpb24ocCwgY2UpIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdID0gY2U7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdID0gY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdID0gY2U7XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmdldERlbGF1bmF5RWRnZUNXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzFdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVswXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0RGVsYXVuYXlFZGdlQ0NXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVsxXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0RGVsYXVuYXlFZGdlQ1cgPSBmdW5jdGlvbihwLCBlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsxXSA9IGU7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzJdID0gZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMF0gPSBlO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXREZWxhdW5heUVkZ2VDQ1cgPSBmdW5jdGlvbihwLCBlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsyXSA9IGU7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzBdID0gZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMV0gPSBlO1xuICAgIH1cbn07XG5cbi8qKlxuICogVGhlIG5laWdoYm9yIGFjcm9zcyB0byBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm5zIHtUcmlhbmdsZX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm5laWdoYm9yQWNyb3NzID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzBdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1syXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gdCBUcmlhbmdsZSBvYmplY3QuXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm9wcG9zaXRlUG9pbnQgPSBmdW5jdGlvbih0LCBwKSB7XG4gICAgdmFyIGN3ID0gdC5wb2ludENXKHApO1xuICAgIHJldHVybiB0aGlzLnBvaW50Q1coY3cpO1xufTtcblxuLyoqXG4gKiBMZWdhbGl6ZSB0cmlhbmdsZSBieSByb3RhdGluZyBjbG9ja3dpc2UgYXJvdW5kIG9Qb2ludFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IG9wb2ludCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBucG9pbnQgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHRocm93cyB7RXJyb3J9IGlmIG9Qb2ludCBjYW4gbm90IGJlIGZvdW5kXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5sZWdhbGl6ZSA9IGZ1bmN0aW9uKG9wb2ludCwgbnBvaW50KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChvcG9pbnQgPT09IHBvaW50c1swXSkge1xuICAgICAgICBwb2ludHNbMV0gPSBwb2ludHNbMF07XG4gICAgICAgIHBvaW50c1swXSA9IHBvaW50c1syXTtcbiAgICAgICAgcG9pbnRzWzJdID0gbnBvaW50O1xuICAgIH0gZWxzZSBpZiAob3BvaW50ID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcG9pbnRzWzJdID0gcG9pbnRzWzFdO1xuICAgICAgICBwb2ludHNbMV0gPSBwb2ludHNbMF07XG4gICAgICAgIHBvaW50c1swXSA9IG5wb2ludDtcbiAgICB9IGVsc2UgaWYgKG9wb2ludCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHBvaW50c1swXSA9IHBvaW50c1syXTtcbiAgICAgICAgcG9pbnRzWzJdID0gcG9pbnRzWzFdO1xuICAgICAgICBwb2ludHNbMV0gPSBucG9pbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIFRyaWFuZ2xlLmxlZ2FsaXplKCkgY2FsbCcpO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW5kZXggb2YgYSBwb2ludCBpbiB0aGUgdHJpYW5nbGUuIFxuICogVGhlIHBvaW50ICptdXN0KiBiZSBhIHJlZmVyZW5jZSB0byBvbmUgb2YgdGhlIHRyaWFuZ2xlJ3MgdmVydGljZXMuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCAwLCAxIG9yIDJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBwIGNhbiBub3QgYmUgZm91bmRcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5pbmRleCgpIGNhbGwnKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwMSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBwMiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluZGV4IDAsIDEgb3IgMiwgb3IgLTEgaWYgZXJycm9yXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5lZGdlSW5kZXggPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAxID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgaWYgKHAyID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHAyID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChwMSA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIGlmIChwMiA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIGlmIChwMiA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocDEgPT09IHBvaW50c1syXSkge1xuICAgICAgICBpZiAocDIgPT09IHBvaW50c1swXSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAocDIgPT09IHBvaW50c1sxXSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufTtcblxuLyoqXG4gKiBNYXJrIGFuIGVkZ2Ugb2YgdGhpcyB0cmlhbmdsZSBhcyBjb25zdHJhaW5lZC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBlZGdlIGluZGV4XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlW2luZGV4XSA9IHRydWU7XG59O1xuLyoqXG4gKiBNYXJrIGFuIGVkZ2Ugb2YgdGhpcyB0cmlhbmdsZSBhcyBjb25zdHJhaW5lZC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0VkZ2V9IGVkZ2UgaW5zdGFuY2VcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUVkZ2UgPSBmdW5jdGlvbihlZGdlKSB7XG4gICAgdGhpcy5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZWRnZS5wLCBlZGdlLnEpO1xufTtcbi8qKlxuICogTWFyayBhbiBlZGdlIG9mIHRoaXMgdHJpYW5nbGUgYXMgY29uc3RyYWluZWQuXG4gKiBUaGlzIG1ldGhvZCB0YWtlcyB0d28gUG9pbnQgaW5zdGFuY2VzIGRlZmluaW5nIHRoZSBlZGdlIG9mIHRoZSB0cmlhbmdsZS5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzID0gZnVuY3Rpb24ocCwgcSkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXMgICAgICAgIFxuICAgIGlmICgocSA9PT0gcG9pbnRzWzBdICYmIHAgPT09IHBvaW50c1sxXSkgfHwgKHEgPT09IHBvaW50c1sxXSAmJiBwID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICgocSA9PT0gcG9pbnRzWzBdICYmIHAgPT09IHBvaW50c1syXSkgfHwgKHEgPT09IHBvaW50c1syXSAmJiBwID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICgocSA9PT0gcG9pbnRzWzFdICYmIHAgPT09IHBvaW50c1syXSkgfHwgKHEgPT09IHBvaW50c1syXSAmJiBwID09PSBwb2ludHNbMV0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXSA9IHRydWU7XG4gICAgfVxufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzIChwdWJsaWMgQVBJKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xuXG59LHtcIi4veHlcIjoxMX1dLDEwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBQcmVjaXNpb24gdG8gZGV0ZWN0IHJlcGVhdGVkIG9yIGNvbGxpbmVhciBwb2ludHNcbiAqIEBwcml2YXRlXG4gKiBAY29uc3Qge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cbnZhciBFUFNJTE9OID0gMWUtMTI7XG5leHBvcnRzLkVQU0lMT04gPSBFUFNJTE9OO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAZW51bSB7bnVtYmVyfVxuICogQHJlYWRvbmx5XG4gKi9cbnZhciBPcmllbnRhdGlvbiA9IHtcbiAgICBcIkNXXCI6IDEsXG4gICAgXCJDQ1dcIjogLTEsXG4gICAgXCJDT0xMSU5FQVJcIjogMFxufTtcbmV4cG9ydHMuT3JpZW50YXRpb24gPSBPcmllbnRhdGlvbjtcblxuXG4vKipcbiAqIEZvcm11bGEgdG8gY2FsY3VsYXRlIHNpZ25lZCBhcmVhPGJyPlxuICogUG9zaXRpdmUgaWYgQ0NXPGJyPlxuICogTmVnYXRpdmUgaWYgQ1c8YnI+XG4gKiAwIGlmIGNvbGxpbmVhcjxicj5cbiAqIDxwcmU+XG4gKiBBW1AxLFAyLFAzXSAgPSAgKHgxKnkyIC0geTEqeDIpICsgKHgyKnkzIC0geTIqeDMpICsgKHgzKnkxIC0geTMqeDEpXG4gKiAgICAgICAgICAgICAgPSAgKHgxLXgzKSooeTIteTMpIC0gKHkxLXkzKSooeDIteDMpXG4gKiA8L3ByZT5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7T3JpZW50YXRpb259XG4gKi9cbmZ1bmN0aW9uIG9yaWVudDJkKHBhLCBwYiwgcGMpIHtcbiAgICB2YXIgZGV0bGVmdCA9IChwYS54IC0gcGMueCkgKiAocGIueSAtIHBjLnkpO1xuICAgIHZhciBkZXRyaWdodCA9IChwYS55IC0gcGMueSkgKiAocGIueCAtIHBjLngpO1xuICAgIHZhciB2YWwgPSBkZXRsZWZ0IC0gZGV0cmlnaHQ7XG4gICAgaWYgKHZhbCA+IC0oRVBTSUxPTikgJiYgdmFsIDwgKEVQU0lMT04pKSB7XG4gICAgICAgIHJldHVybiBPcmllbnRhdGlvbi5DT0xMSU5FQVI7XG4gICAgfSBlbHNlIGlmICh2YWwgPiAwKSB7XG4gICAgICAgIHJldHVybiBPcmllbnRhdGlvbi5DQ1c7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE9yaWVudGF0aW9uLkNXO1xuICAgIH1cbn1cbmV4cG9ydHMub3JpZW50MmQgPSBvcmllbnQyZDtcblxuXG4vKipcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBkICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaW5TY2FuQXJlYShwYSwgcGIsIHBjLCBwZCkge1xuICAgIHZhciBvYWRiID0gKHBhLnggLSBwYi54KSAqIChwZC55IC0gcGIueSkgLSAocGQueCAtIHBiLngpICogKHBhLnkgLSBwYi55KTtcbiAgICBpZiAob2FkYiA+PSAtRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9hZGMgPSAocGEueCAtIHBjLngpICogKHBkLnkgLSBwYy55KSAtIChwZC54IC0gcGMueCkgKiAocGEueSAtIHBjLnkpO1xuICAgIGlmIChvYWRjIDw9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaW5TY2FuQXJlYSA9IGluU2NhbkFyZWE7XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgYW5nbGUgYmV0d2VlbiAocGEscGIpIGFuZCAocGEscGMpIGlzIG9idHVzZSBpLmUuIChhbmdsZSA+IM+ALzIgfHwgYW5nbGUgPCAtz4AvMilcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhbmdsZSBpcyBvYnR1c2VcbiAqL1xuZnVuY3Rpb24gaXNBbmdsZU9idHVzZShwYSwgcGIsIHBjKSB7XG4gICAgdmFyIGF4ID0gcGIueCAtIHBhLng7XG4gICAgdmFyIGF5ID0gcGIueSAtIHBhLnk7XG4gICAgdmFyIGJ4ID0gcGMueCAtIHBhLng7XG4gICAgdmFyIGJ5ID0gcGMueSAtIHBhLnk7XG4gICAgcmV0dXJuIChheCAqIGJ4ICsgYXkgKiBieSkgPCAwO1xufVxuZXhwb3J0cy5pc0FuZ2xlT2J0dXNlID0gaXNBbmdsZU9idHVzZTtcblxuXG59LHt9XSwxMTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgb3BlcmF0ZSBvbiBcIlBvaW50XCIgb3IgYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9LFxuICogYXMgZGVmaW5lZCBieSB0aGUge0BsaW5rIFhZfSB0eXBlXG4gKiAoW2R1Y2sgdHlwaW5nXXtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0R1Y2tfdHlwaW5nfSkuXG4gKiBAbW9kdWxlXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogcG9seTJ0cmkuanMgc3VwcG9ydHMgdXNpbmcgY3VzdG9tIHBvaW50IGNsYXNzIGluc3RlYWQgb2Yge0BsaW5rY29kZSBQb2ludH0uXG4gKiBBbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGggPGNvZGU+e3gsIHl9PC9jb2RlPiBhdHRyaWJ1dGVzIGlzIHN1cHBvcnRlZFxuICogdG8gaW5pdGlhbGl6ZSB0aGUgU3dlZXBDb250ZXh0IHBvbHlsaW5lcyBhbmQgcG9pbnRzXG4gKiAoW2R1Y2sgdHlwaW5nXXtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0R1Y2tfdHlwaW5nfSkuXG4gKlxuICogcG9seTJ0cmkuanMgbWlnaHQgYWRkIGV4dHJhIGZpZWxkcyB0byB0aGUgcG9pbnQgb2JqZWN0cyB3aGVuIGNvbXB1dGluZyB0aGVcbiAqIHRyaWFuZ3VsYXRpb24gOiB0aGV5IGFyZSBwcmVmaXhlZCB3aXRoIDxjb2RlPl9wMnRfPC9jb2RlPiB0byBhdm9pZCBjb2xsaXNpb25zXG4gKiB3aXRoIGZpZWxkcyBpbiB0aGUgY3VzdG9tIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDB9LCB7eDoxMDAsIHk6MzAwfSwge3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeToxMDB9XTtcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBYWVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSB4IGNvb3JkaW5hdGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5IC0geSBjb29yZGluYXRlXG4gKi9cblxuXG4vKipcbiAqIFBvaW50IHByZXR0eSBwcmludGluZyA6IHByaW50cyB4IGFuZCB5IGNvb3JkaW5hdGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgeHkudG9TdHJpbmdCYXNlKHt4OjUsIHk6NDJ9KVxuICogICAgICAvLyDihpIgXCIoNTs0MilcIlxuICogQHByb3RlY3RlZFxuICogQHBhcmFtIHshWFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge3N0cmluZ30gPGNvZGU+XCIoeDt5KVwiPC9jb2RlPlxuICovXG5mdW5jdGlvbiB0b1N0cmluZ0Jhc2UocCkge1xuICAgIHJldHVybiAoXCIoXCIgKyBwLnggKyBcIjtcIiArIHAueSArIFwiKVwiKTtcbn1cblxuLyoqXG4gKiBQb2ludCBwcmV0dHkgcHJpbnRpbmcuIERlbGVnYXRlcyB0byB0aGUgcG9pbnQncyBjdXN0b20gXCJ0b1N0cmluZygpXCIgbWV0aG9kIGlmIGV4aXN0cyxcbiAqIGVsc2Ugc2ltcGx5IHByaW50cyB4IGFuZCB5IGNvb3JkaW5hdGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgeHkudG9TdHJpbmcoe3g6NSwgeTo0Mn0pXG4gKiAgICAgIC8vIOKGkiBcIig1OzQyKVwiXG4gKiBAZXhhbXBsZVxuICogICAgICB4eS50b1N0cmluZyh7eDo1LHk6NDIsdG9TdHJpbmc6ZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMueCtcIjpcIit0aGlzLnk7fX0pXG4gKiAgICAgIC8vIOKGkiBcIjU6NDJcIlxuICogQHBhcmFtIHshWFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge3N0cmluZ30gPGNvZGU+XCIoeDt5KVwiPC9jb2RlPlxuICovXG5mdW5jdGlvbiB0b1N0cmluZyhwKSB7XG4gICAgLy8gVHJ5IGEgY3VzdG9tIHRvU3RyaW5nIGZpcnN0LCBhbmQgZmFsbGJhY2sgdG8gb3duIGltcGxlbWVudGF0aW9uIGlmIG5vbmVcbiAgICB2YXIgcyA9IHAudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gKHMgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gdG9TdHJpbmdCYXNlKHApIDogcyk7XG59XG5cblxuLyoqXG4gKiBDb21wYXJlIHR3byBwb2ludHMgY29tcG9uZW50LXdpc2UuIE9yZGVyZWQgYnkgeSBheGlzIGZpcnN0LCB0aGVuIHggYXhpcy5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge251bWJlcn0gPGNvZGU+Jmx0OyAwPC9jb2RlPiBpZiA8Y29kZT5hICZsdDsgYjwvY29kZT4sXG4gKiAgICAgICAgIDxjb2RlPiZndDsgMDwvY29kZT4gaWYgPGNvZGU+YSAmZ3Q7IGI8L2NvZGU+LCBcbiAqICAgICAgICAgPGNvZGU+MDwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICBpZiAoYS55ID09PSBiLnkpIHtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYS55IC0gYi55O1xuICAgIH1cbn1cblxuLyoqXG4gKiBUZXN0IHR3byBQb2ludCBvYmplY3RzIGZvciBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPlRydWU8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRvU3RyaW5nOiB0b1N0cmluZyxcbiAgICB0b1N0cmluZ0Jhc2U6IHRvU3RyaW5nQmFzZSxcbiAgICBjb21wYXJlOiBjb21wYXJlLFxuICAgIGVxdWFsczogZXF1YWxzXG59O1xuXG59LHt9XX0se30sWzZdKVxuKDYpXG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRkZWZpbml0aW9uOiAxLFxuXHR3b3JsZFdpZHRoOiAyMCxcblx0c2ltUmVuZGVyRnJlcTogNTAsXG5cdGdyYXZpdHk6IFswLCAtOS44XSxcblx0Z3JvdXBzOlxuXHR7XG5cdFx0ZGVmYXVsdDpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICdwcmVjaXNlSGV4YUZpbGwnLFxuXHRcdFx0aW5uZXJTdHJ1Y3R1cmVEZWY6IDAuMDQsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRkaXN0YW5jZUNvbnN0cmFpbnQ6XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGlmZm5lc3M6IDUwMCxcblx0XHRcdFx0XHRyZWxheGF0aW9uOiAwLjFcblx0XHRcdFx0fSxcblx0XHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0XHRtYXNzOiAxXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsaW5lOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2xpbmUnLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RpZmZuZXNzOiA1MDAsXG5cdFx0XHRcdFx0cmVsYXhhdGlvbjogMC4xXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG5vZGVSYWRpdXM6IDAuMSxcblx0XHRcdFx0bWFzczogMVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0aGFyZDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRub0NvbGxpZGU6XG5cdFx0e1xuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0bWFzczogMSxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJyxcblx0XHRcdFx0bm9Db2xsaWRlOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjbG91ZDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRncmF2aXR5U2NhbGU6IDAsXG5cdFx0XHRcdGJvZHlUeXBlOiAnaGFyZCcsXG5cdFx0XHRcdG5vQ29sbGlkZTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bWV0YWw6XG5cdFx0e1xuXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxMCxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YmFsbG9vbjpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRncmF2aXR5U2NhbGU6IC0xLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzdGF0aWM6XG5cdFx0e1xuXHRcdFx0Zml4ZWQ6IHRydWUsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRnaG9zdDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRib2R5VHlwZTogJ2dob3N0J1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuIiwidmFyIEdyaWQgPVxue1xuXHRpbml0OiBmdW5jdGlvbiAoJGdyYXBoKVxuXHR7XG5cdFx0dGhpcy5fZ3JhcGggPSAkZ3JhcGg7XG5cdFx0dmFyIG5vZGVzQXJyYXkgPSB0aGlzLl9ub2Rlc0FycmF5ID0gW107XG5cdFx0dGhpcy5fZ3JhcGguZm9yRWFjaChmdW5jdGlvbiAoJGxpbmUpXG5cdFx0e1xuXHRcdFx0aWYgKCRsaW5lKVxuXHRcdFx0e1xuXHRcdFx0XHQkbGluZS5mb3JFYWNoKGZ1bmN0aW9uICgkbm9kZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgkbm9kZSkgeyBub2Rlc0FycmF5LnB1c2goJG5vZGUpOyB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGNyZWF0ZUZyb21Qb2x5Z29uOiBmdW5jdGlvbiAoJHBvbHlnb24sICRkZWYsICRoZXhhKVxuXHR7XG5cdFx0dmFyIGJvdW5kaW5nQm94ID0gJHBvbHlnb24uZ2V0Qm91bmRpbmdCb3goKTtcblxuXHRcdHZhciBkZWYgPSAkZGVmO1xuXHRcdC8vdmFyIGRlZiA9IHdpZHRoIC8gJGRlZjtcblx0XHR2YXIgdG9SZXR1cm4gPSBbXTtcblx0XHR2YXIgeUluYyA9ICRoZXhhID8gZGVmICogKE1hdGguc3FydCgzKSAvIDIpIDogZGVmO1xuXHRcdHZhciBoYWxmRGVmID0gZGVmICogMC41O1xuXHRcdGZvciAodmFyIHlQb3MgPSBib3VuZGluZ0JveFswXVsxXTsgeVBvcyA8PSBib3VuZGluZ0JveFsxXVsxXTsgeVBvcyArPSB5SW5jKVxuXHRcdHtcblx0XHRcdHZhciBsaW5lID0gW107XG5cdFx0XHQvL3ZhciBpbnRlcnNlY3Rpb25zID0gJHBvbHlnb24uZ2V0SW50ZXJzZWN0aW9uc0F0WSh5UG9zKTtcblx0XHRcdHZhciB4UG9zID0gYm91bmRpbmdCb3hbMF1bMF07XG5cdFx0XHR4UG9zID0gKCRoZXhhICYmIHRvUmV0dXJuLmxlbmd0aCAlIDIgIT09IDApID8geFBvcyArIGhhbGZEZWYgOiB4UG9zO1xuXHRcdFx0Zm9yICh4UG9zOyB4UG9zIDw9IGJvdW5kaW5nQm94WzFdWzBdICsgaGFsZkRlZjsgeFBvcyArPSBkZWYpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICgkcG9seWdvbi5pc0luc2lkZShbeFBvcywgeVBvc10pKSB7IGxpbmUucHVzaChbeFBvcywgeVBvc10pOyB9XG5cdFx0XHRcdGVsc2UgeyBsaW5lLnB1c2gobnVsbCk7IH1cblx0XHRcdH1cblx0XHRcdHRvUmV0dXJuLnB1c2gobGluZSk7XG5cdFx0fVxuXHRcdHJldHVybiBPYmplY3QuY3JlYXRlKEdyaWQpLmluaXQodG9SZXR1cm4pO1xuXHR9LFxuXG5cdGdldEdyYXBoOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9ncmFwaDsgfSxcblxuXHRnZXROb2Rlc0FycmF5OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9ub2Rlc0FycmF5OyB9LFxuXG5cdGdldENsb3Nlc3Q6IGZ1bmN0aW9uICgkeCwgJHksICRzaXplKVxuXHR7XG5cdFx0dmFyIHNpemUgPSAkc2l6ZSB8fCAxO1xuXHRcdHZhciBjbG9zZXN0ID0gdGhpcy5fbm9kZXNBcnJheS5jb25jYXQoKTtcblx0XHRjbG9zZXN0LnNvcnQoZnVuY3Rpb24gKCRhLCAkYilcblx0XHR7XG5cdFx0XHRpZiAoJGEgPT09IG51bGwgfHwgJGIgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdHZhciBzaWRlWDEgPSBNYXRoLmFicygkYVswXSAtICR4KTtcblx0XHRcdHZhciBzaWRlWTEgPSBNYXRoLmFicygkYVsxXSAtICR5KTtcblx0XHRcdHZhciBkaXN0MSA9IE1hdGguc3FydChzaWRlWDEgKiBzaWRlWDEgKyBzaWRlWTEgKiBzaWRlWTEpO1xuXG5cdFx0XHR2YXIgc2lkZVgyID0gTWF0aC5hYnMoJGJbMF0gLSAkeCk7XG5cdFx0XHR2YXIgc2lkZVkyID0gTWF0aC5hYnMoJGJbMV0gLSAkeSk7XG5cdFx0XHR2YXIgZGlzdDIgPSBNYXRoLnNxcnQoc2lkZVgyICogc2lkZVgyICsgc2lkZVkyICogc2lkZVkyKTtcblxuXHRcdFx0cmV0dXJuIGRpc3QxIC0gZGlzdDI7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGNsb3Nlc3Quc2xpY2UoMCwgc2l6ZSk7XG5cdH0sXG5cblx0Z2V0TmVpZ2hib3VyczogZnVuY3Rpb24gKCR4LCAkeSwgJHJldHVybkVtcHR5KVxuXHR7XG5cdFx0dmFyIHRvUmV0dXJuID0gW107XG5cdFx0dmFyIGdyYXBoID0gdGhpcy5fZ3JhcGg7XG5cdFx0dmFyIGV2ZW4gPSAkeSAlIDIgPiAwO1xuXHRcdHZhciBsZWZ0ID0gZXZlbiA/ICR4IDogJHggLSAxO1xuXHRcdHZhciByaWdodCA9IGV2ZW4gPyAkeCArIDEgOiAkeDtcblxuXHRcdHZhciBORSA9IGdyYXBoWyR5IC0gMV0gJiYgZ3JhcGhbJHkgLSAxXVtyaWdodF0gPyBncmFwaFskeSAtIDFdW3JpZ2h0XSA6IG51bGw7XG5cdFx0dmFyIEUgPSBncmFwaFskeSArIDBdICYmIGdyYXBoWyR5ICsgMF1bJHggKyAxXSA/IGdyYXBoWyR5XVskeCArIDFdIDogbnVsbDtcblx0XHR2YXIgU0UgPSBncmFwaFskeSArIDFdICYmIGdyYXBoWyR5ICsgMV1bcmlnaHRdID8gZ3JhcGhbJHkgKyAxXVtyaWdodF0gOiBudWxsO1xuXHRcdHZhciBTVyA9IGdyYXBoWyR5ICsgMV0gJiYgZ3JhcGhbJHkgKyAxXVtsZWZ0XSA/IGdyYXBoWyR5ICsgMV1bbGVmdF0gOiBudWxsO1xuXHRcdHZhciBXID0gZ3JhcGhbJHkgKyAwXSAmJiBncmFwaFskeSArIDBdWyR4IC0gMV0gPyBncmFwaFskeV1bJHggLSAxXSA6IG51bGw7XG5cdFx0dmFyIE5XID0gZ3JhcGhbJHkgLSAxXSAmJiBncmFwaFskeSAtIDFdW2xlZnRdID8gZ3JhcGhbJHkgLSAxXVtsZWZ0XSA6IG51bGw7XG5cblx0XHRpZiAoTkUgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goTkUpOyB9XG5cdFx0aWYgKEUgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goRSk7IH1cblx0XHRpZiAoU0UgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goU0UpOyB9XG5cdFx0aWYgKFNXIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKFNXKTsgfVxuXHRcdGlmIChXIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKFcpOyB9XG5cdFx0aWYgKE5XIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKE5XKTsgfVxuXG5cdFx0cmV0dXJuIHRvUmV0dXJuO1xuXHR9LFxuXG5cdGdldE5ldHdvcms6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHR2YXIgbmV0d29yayA9IFtdO1xuXHRcdHZhciB2aXNpdGVkID0gW107XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByb3dzTGVuZ3RoID0gZ3JhcGgubGVuZ3RoO1xuXHRcdGZvciAoaTsgaSA8IHJvd3NMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgayA9IDA7XG5cdFx0XHR2YXIgcG9pbnRzTGVuZ3RoID0gZ3JhcGhbaV0ubGVuZ3RoO1xuXHRcdFx0Zm9yIChrOyBrIDwgcG9pbnRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBjdXJyUG9pbnQgPSBncmFwaFtpXVtrXTtcblx0XHRcdFx0aWYgKGN1cnJQb2ludClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyUG9pbnROZWlnaGJvdXJzID0gdGhpcy5nZXROZWlnaGJvdXJzKGssIGkpO1xuXHRcdFx0XHRcdGZvciAodmFyIG0gPSAwLCBuZWlnaGJvdXJzTGVuZ3RoID0gY3VyclBvaW50TmVpZ2hib3Vycy5sZW5ndGg7IG0gPCBuZWlnaGJvdXJzTGVuZ3RoOyBtICs9IDEpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIGN1cnJOZWlnaCA9IGN1cnJQb2ludE5laWdoYm91cnNbbV07XG5cdFx0XHRcdFx0XHRpZiAoY3Vyck5laWdoICYmIHZpc2l0ZWQuaW5kZXhPZihjdXJyTmVpZ2gpID09PSAtMSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmV0d29yay5wdXNoKFtjdXJyUG9pbnQsIGN1cnJOZWlnaF0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2aXNpdGVkLnB1c2goY3VyclBvaW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV0d29yaztcblx0fSxcblxuXHRnZXRPdXRsaW5lOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLm91dGxpbmUpXG5cdFx0e1xuXHRcdFx0dmFyIGdyYXBoID0gdGhpcy5fZ3JhcGg7XG5cdFx0XHR2YXIgb3V0bGluZUdyYXBoID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgcm93c0xlbmd0aCA9IGdyYXBoLmxlbmd0aDsgaSA8IHJvd3NMZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0b3V0bGluZUdyYXBoW2ldID0gW107XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBwb2ludHNMZW5ndGggPSBncmFwaFtpXS5sZW5ndGg7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGdyYXBoW2ldW2tdO1xuXHRcdFx0XHRcdG91dGxpbmVHcmFwaFtpXVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0aWYgKHBvaW50KVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhciBpc0VkZ2UgPSB0aGlzLmdldE5laWdoYm91cnMoaywgaSkubGVuZ3RoIDwgNjtcblx0XHRcdFx0XHRcdGlmIChpc0VkZ2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG91dGxpbmVHcmFwaFtpXVtrXSA9IFtrLCBpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMub3V0bGluZSA9IE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdChvdXRsaW5lR3JhcGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLm91dGxpbmU7XG5cdH0sXG5cblx0Z2V0U2hhcGVQYXRoOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHBhdGggPSBbXTtcblx0XHR2YXIgY3VycmVudE91dGxpbmUgPSB0aGlzLmdldE91dGxpbmVzKClbMF07XG5cdFx0dmFyIG91dGxpbmVHcmFwaCA9IGN1cnJlbnRPdXRsaW5lLmdldEdyYXBoKCk7XG5cdFx0dmFyIGdldFN0YXJ0aW5nSW5kZXggPSBmdW5jdGlvbiAoKVxuXHRcdHtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvdXRsaW5lR3JhcGgubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghb3V0bGluZUdyYXBoW2ldKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBwb2ludHNMZW5ndGggPSBvdXRsaW5lR3JhcGhbaV0ubGVuZ3RoOyBrIDwgcG9pbnRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgY3VyclBvaW50ID0gb3V0bGluZUdyYXBoW2ldW2tdO1xuXHRcdFx0XHRcdGlmIChjdXJyUG9pbnQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coY3VyclBvaW50LCBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChjdXJyUG9pbnQgJiYgY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycyhjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSkubGVuZ3RoID09PSAyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBjdXJyUG9pbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciB2aXNpdGVkID0gW107XG5cdFx0dmFyIHN0YXJ0aW5nSW5kZXggPSBnZXRTdGFydGluZ0luZGV4LmNhbGwodGhpcyk7XG5cdFx0Y29uc29sZS5sb2coc3RhcnRpbmdJbmRleCk7XG5cdFx0ZGVidWdnZXI7XG5cdFx0aWYgKCFzdGFydGluZ0luZGV4KSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGdldEFuZ2xlID0gZnVuY3Rpb24gKCRpbmRleClcblx0XHR7XG5cdFx0XHR2YXIgYW5nbGUgPSAoJGluZGV4ICsgMSkgKiA2MDtcblx0XHRcdGFuZ2xlID0gYW5nbGUgPT09IDAgPyAzNjAgOiBhbmdsZTtcblx0XHRcdHJldHVybiBhbmdsZTtcblx0XHR9O1xuXHRcdHZhciBnZXROZWlnaGJvdXJJbmRleCA9IGZ1bmN0aW9uICgkcG9pbnQsICRuZWlnaGJvdXIpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoJHBvaW50WzBdLCAkcG9pbnRbMV0sIHRydWUpLmluZGV4T2YoJG5laWdoYm91cik7XG5cdFx0fTtcblxuXHRcdHZhciBuZXh0ID0gY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycyhzdGFydGluZ0luZGV4WzBdLCBzdGFydGluZ0luZGV4WzFdKVswXTtcblx0XHR2YXIgbGFzdEFuZ2xlID0gZ2V0QW5nbGUoZ2V0TmVpZ2hib3VySW5kZXgoc3RhcnRpbmdJbmRleCwgbmV4dCkpO1xuXHRcdHZhciBjdXJySW5kZXggPSBuZXh0O1xuXHRcdHBhdGgucHVzaCh0aGlzLl9ncmFwaFtzdGFydGluZ0luZGV4WzFdXVtzdGFydGluZ0luZGV4WzBdXSk7XG5cdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW25leHRbMV1dW25leHRbMF1dKTtcblx0XHR2aXNpdGVkLnB1c2goc3RhcnRpbmdJbmRleCk7XG5cblx0XHR2YXIgYmVzdDtcblx0XHR2YXIgbmVpZ2hib3Vycztcblx0XHR2YXIgYmVzdEFuZ2xlO1xuXHRcdHZhciBvdXRsaW5lTm9kZXNBcnJheSA9IGN1cnJlbnRPdXRsaW5lLmdldE5vZGVzQXJyYXkoKTtcblx0XHR2YXIgb3V0bGluZVBvaW50c0xlbmd0aCA9IG91dGxpbmVOb2Rlc0FycmF5Lmxlbmd0aDtcblxuXHRcdHdoaWxlICh2aXNpdGVkLmxlbmd0aCA8IG91dGxpbmVQb2ludHNMZW5ndGggLSAxKS8vY3VyckluZGV4ICE9PSBzdGFydGluZ0luZGV4KVxuXHRcdHtcblx0XHRcdG5laWdoYm91cnMgPSBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJJbmRleFswXSwgY3VyckluZGV4WzFdKTtcblx0XHRcdHZhciBiZXN0U2NvcmUgPSAwO1xuXHRcdFx0YmVzdCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5laWdoYm91cnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBjdXJyTmVpZ2ggPSBuZWlnaGJvdXJzW2ldO1xuXHRcdFx0XHR2YXIgY3VyclNjb3JlID0gMDtcblx0XHRcdFx0dmFyIGN1cnJBbmdsZSA9IGdldEFuZ2xlKGdldE5laWdoYm91ckluZGV4KGN1cnJJbmRleCwgY3Vyck5laWdoKSk7XG5cdFx0XHRcdGN1cnJTY29yZSA9IGN1cnJBbmdsZSAtIGxhc3RBbmdsZTtcblx0XHRcdFx0aWYgKGN1cnJTY29yZSA+IDE4MCkgeyBjdXJyU2NvcmUgPSBjdXJyU2NvcmUgLSAzNjA7IH1cblx0XHRcdFx0aWYgKGN1cnJTY29yZSA8IC0xODApIHsgY3VyclNjb3JlID0gY3VyclNjb3JlICsgMzYwOyB9XG5cdFx0XHRcdHZhciBuZWlnaEluZGV4ID0gdmlzaXRlZC5pbmRleE9mKGN1cnJOZWlnaCk7XG5cdFx0XHRcdGlmIChuZWlnaEluZGV4ICE9PSAtMSkgeyBjdXJyU2NvcmUgPSBuZWlnaEluZGV4IC8gdmlzaXRlZC5sZW5ndGggKiAxMDAwMCArIDEwMDAwICsgY3VyclNjb3JlOyB9XG5cdFx0XHRcdGlmICghYmVzdCB8fCBjdXJyU2NvcmUgPCBiZXN0U2NvcmUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiZXN0U2NvcmUgPSBjdXJyU2NvcmU7XG5cdFx0XHRcdFx0YmVzdCA9IGN1cnJOZWlnaDtcblx0XHRcdFx0XHRiZXN0QW5nbGUgPSBjdXJyQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxhc3RBbmdsZSA9IGJlc3RBbmdsZTtcblx0XHRcdGlmICh2aXNpdGVkLmluZGV4T2YoY3VyckluZGV4KSAhPT0gLTEpIHsgdmlzaXRlZC5zcGxpY2UodmlzaXRlZC5pbmRleE9mKGN1cnJJbmRleCksIDEpOyB9XG5cdFx0XHR2aXNpdGVkLnB1c2goY3VyckluZGV4KTtcblx0XHRcdGN1cnJJbmRleCA9IGJlc3Q7XG5cblx0XHRcdHBhdGgucHVzaCh0aGlzLl9ncmFwaFtjdXJySW5kZXhbMV1dW2N1cnJJbmRleFswXV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcGF0aDtcblx0fSxcblxuXHRnZXRPdXRsaW5lczogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciB0b1JldHVybiA9IFtdO1xuXHRcdHZhciBjdXJyZW50R3JhcGg7XG5cdFx0dmFyIG91dGxpbmUgPSB0aGlzLmdldE91dGxpbmUoKTtcblx0XHR2YXIgcmVtYWluaW5nID0gb3V0bGluZS5nZXROb2Rlc0FycmF5KCkuY29uY2F0KCk7XG5cblx0XHR2YXIgcmVjdXIgPSBmdW5jdGlvbiAoJHBvaW50KVxuXHRcdHtcblx0XHRcdGN1cnJlbnRHcmFwaFskcG9pbnRbMV1dID0gY3VycmVudEdyYXBoWyRwb2ludFsxXV0gfHwgW107XG5cdFx0XHRjdXJyZW50R3JhcGhbJHBvaW50WzFdXVskcG9pbnRbMF1dID0gJHBvaW50O1xuXHRcdFx0dmFyIG5laWdoYm91cnMgPSBvdXRsaW5lLmdldE5laWdoYm91cnMoJHBvaW50WzBdLCAkcG9pbnRbMV0pO1xuXHRcdFx0cmVtYWluaW5nLnNwbGljZShyZW1haW5pbmcuaW5kZXhPZigkcG9pbnQpLCAxKTtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBuZWlnaGJvdXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgbmVpZ2ggPSBuZWlnaGJvdXJzW2ldO1xuXHRcdFx0XHRpZiAocmVtYWluaW5nLmluZGV4T2YobmVpZ2gpICE9PSAtMSkgeyByZWN1cihuZWlnaCk7IH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2hpbGUgKHJlbWFpbmluZy5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0Y3VycmVudEdyYXBoID0gW107XG5cdFx0XHR2YXIgc3RhcnRpbmdQb2ludCA9IHJlbWFpbmluZ1swXTtcblx0XHRcdHJlY3VyKHN0YXJ0aW5nUG9pbnQpO1xuXHRcdFx0dG9SZXR1cm4ucHVzaChPYmplY3QuY3JlYXRlKEdyaWQpLmluaXQoY3VycmVudEdyYXBoKSk7XG5cdFx0fVxuXHRcdHJldHVybiB0b1JldHVybjtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkO1xuXG4iLCJ2YXIgUG9seWdvbiA9XG57XG5cdGluaXQ6IGZ1bmN0aW9uICgkcG9pbnRzKVxuXHR7XG5cdFx0dmFyIHBvbHlnb24gPSBPYmplY3QuY3JlYXRlKFBvbHlnb24pO1xuXHRcdHBvbHlnb24ucG9pbnRzID0gJHBvaW50cztcblx0XHRwb2x5Z29uLl9ib3VuZGluZ0JveCA9IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gcG9seWdvbjtcblx0fSxcblxuXHRnZXRBcmVhOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHN1bUEgPSAwO1xuXHRcdHZhciBzdW1CID0gMDtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5wb2ludHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJQb2ludCA9IHRoaXMucG9pbnRzW2ldO1xuXHRcdFx0dmFyIG5leHQgPSBpID09PSBsZW5ndGggLSAxID8gdGhpcy5wb2ludHNbMF0gOiB0aGlzLnBvaW50c1tpICsgMV07XG5cdFx0XHRzdW1BICs9IGN1cnJQb2ludFswXSAqIG5leHRbMV07XG5cdFx0XHRzdW1CICs9IGN1cnJQb2ludFsxXSAqIG5leHRbMF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1hdGguYWJzKChzdW1BIC0gc3VtQikgKiAwLjUpO1xuXHR9LFxuXG5cdGdldEJvdW5kaW5nQm94OiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl9ib3VuZGluZ0JveClcblx0XHR7XG5cdFx0XHR2YXIgbWluWCA9IHRoaXMucG9pbnRzWzBdWzBdO1xuXHRcdFx0dmFyIG1heFggPSBtaW5YO1xuXHRcdFx0dmFyIG1pblkgPSB0aGlzLnBvaW50c1swXVsxXTtcblx0XHRcdHZhciBtYXhZID0gbWluWTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcblx0XHRcdFx0bWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50WzBdKTtcblx0XHRcdFx0bWF4WCA9IE1hdGgubWF4KG1heFgsIHBvaW50WzBdKTtcblx0XHRcdFx0bWluWSA9IE1hdGgubWluKG1pblksIHBvaW50WzFdKTtcblx0XHRcdFx0bWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50WzFdKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2JvdW5kaW5nQm94ID0gW1ttaW5YLCBtaW5ZXSwgW21heFgsIG1heFldXTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kaW5nQm94O1xuXHR9LFxuXG5cdGdldFNlZ21lbnRzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHNlZ21lbnRzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aCAtIDE7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHRzZWdtZW50cy5wdXNoKFt0aGlzLnBvaW50c1tpXSwgdGhpcy5wb2ludHNbaSArIDFdXSk7XG5cdFx0fVxuXHRcdHNlZ21lbnRzLnB1c2goW3RoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLCB0aGlzLnBvaW50c1swXV0pO1xuXHRcdHJldHVybiBzZWdtZW50cztcblx0fSxcblxuXHRnZXRJbnRlcnNlY3Rpb25zQXRZOiBmdW5jdGlvbiAoJHRlc3RZKVxuXHR7XG5cdFx0dmFyIHNlZ21lbnRzID0gdGhpcy5nZXRTZWdtZW50cygpO1xuXHRcdHZhciBpbnRlcnNlY3Rpb25zID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyU2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuXHRcdFx0dmFyIHgxID0gY3VyclNlZ21lbnRbMF1bMF07XG5cdFx0XHR2YXIgeTEgPSBjdXJyU2VnbWVudFswXVsxXTtcblx0XHRcdHZhciB4MiA9IGN1cnJTZWdtZW50WzFdWzBdO1xuXHRcdFx0dmFyIHkyID0gY3VyclNlZ21lbnRbMV1bMV07XG5cdFx0XHR2YXIgc21hbGxZID0gTWF0aC5taW4oeTEsIHkyKTtcblx0XHRcdHZhciBiaWdZID0gTWF0aC5tYXgoeTEsIHkyKTtcblxuXHRcdFx0aWYgKCR0ZXN0WSA+IHNtYWxsWSAmJiAkdGVzdFkgPCBiaWdZKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcFkgPSB5MiAtICR0ZXN0WTtcblx0XHRcdFx0dmFyIHNlZ1kgPSB5MiAtIHkxO1xuXHRcdFx0XHR2YXIgc2VnWCA9IHgyIC0geDE7XG5cdFx0XHRcdHZhciBwWCA9IHBZICogc2VnWCAvIHNlZ1k7XG5cdFx0XHRcdGludGVyc2VjdGlvbnMucHVzaCh4MiAtIHBYKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGludGVyc2VjdGlvbnM7XG5cdH0sXG5cblx0aXNJbnNpZGU6IGZ1bmN0aW9uICgkcG9pbnQpXG5cdHtcblx0XHR2YXIgaW5mTnVtYmVyID0gMDtcblx0XHR2YXIgaW50ZXJzZWN0aW9ucyA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0F0WSgkcG9pbnRbMV0pO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdGlmICgkcG9pbnRbMF0gPCBpbnRlcnNlY3Rpb25zW2ldKSB7IGluZk51bWJlciArPSAxOyB9XG5cdFx0fVxuXHRcdHJldHVybiBpbmZOdW1iZXIgJSAyID4gMDtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb2x5Z29uO1xuXG4iLCJcbnZhciBTVkdQYXJzZXIgPSBmdW5jdGlvbiAoKSB7fTtcbi8vdmFyIGlzUG9seWdvbiA9IC9wb2x5Z29ufHJlY3QvaWc7XG52YXIgaXNMaW5lID0gL3BvbHlsaW5lfGxpbmV8cGF0aC9pZztcbnZhciBsaW5lVGFncyA9ICdwb2x5bGluZSwgbGluZSwgcGF0aCc7XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoJHdvcmxkLCAkU1ZHKVxue1xuXHR0aGlzLlNWRyA9ICRTVkc7XG5cdHRoaXMudmlld0JveFdpZHRoID0gTnVtYmVyKHRoaXMuU1ZHLmdldEF0dHJpYnV0ZSgndmlld0JveCcpLnNwbGl0KCcgJylbMl0pO1xuXHR0aGlzLnZpZXdCb3hIZWlnaHQgPSBOdW1iZXIodGhpcy5TVkcuZ2V0QXR0cmlidXRlKCd2aWV3Qm94Jykuc3BsaXQoJyAnKVszXSk7XG5cdHRoaXMucmF0aW8gPSAkd29ybGQuZ2V0V2lkdGgoKSAvIHRoaXMudmlld0JveFdpZHRoO1xuXHR0aGlzLndvcmxkID0gJHdvcmxkO1xuXHR0aGlzLndvcmxkLnNldEhlaWdodCh0aGlzLnZpZXdCb3hIZWlnaHQgKiB0aGlzLnJhdGlvKTtcblxuXHQvL3RlbXBcblx0dmFyIGVsZW1lbnRzUXVlcnkgPSAnKjpub3QoZyk6bm90KGxpbmVhckdyYWRpZW50KTpub3QocmFkaWFsR3JhZGllbnQpOm5vdChzdG9wKTpub3QoW2lkKj1cImpvaW50XCJdKTpub3QoW2lkKj1cImNvbnN0cmFpbnRcIl0pJztcblx0dmFyIGVsZW1SYXdzID0gdGhpcy5TVkcucXVlcnlTZWxlY3RvckFsbChlbGVtZW50c1F1ZXJ5KTtcblxuXHR2YXIgaSA9IDA7XG5cdHZhciByYXdHcm91cFBhaXJpbmdzID0gW107XG5cdHZhciBlbGVtc0xlbmd0aCA9IGVsZW1SYXdzLmxlbmd0aDtcblxuXHRmb3IgKGkgPSAwOyBpIDwgZWxlbXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciByYXdFbGVtZW50ID0gZWxlbVJhd3NbaV07XG5cdFx0Ly9pZiAocmF3RWxlbWVudC5ub2RlVHlwZSA9PT0gMykgeyBjb250aW51ZTsgfVxuXHRcdHZhciBncm91cEluZm9zID0gdGhpcy5nZXRHcm91cEluZm9zKHJhd0VsZW1lbnQpO1xuXHRcdHZhciBjdXJyR3JvdXAgPSAkd29ybGQuY3JlYXRlR3JvdXAoZ3JvdXBJbmZvcy50eXBlLCBncm91cEluZm9zLklEKTtcblxuXHRcdC8vdmFyIGVsZW1lbnRzID0gcmF3RWxlbWVudDtcblx0XHQvL3RoaXMucGFyc2VFbGVtZW50cyhlbGVtZW50cywgY3Vyckdyb3VwKTtcblxuXHRcdHZhciBlbGVtZW50ID0gdGhpcy5wYXJzZUVsZW1lbnQocmF3RWxlbWVudCk7XG5cdFx0dmFyIG5vZGVzVG9EcmF3ID0gY3Vyckdyb3VwLnN0cnVjdHVyZS5jcmVhdGUoZWxlbWVudCk7XG5cdFx0dGhpcy5zZXRHcmFwaGljSW5zdHJ1Y3Rpb25zKGN1cnJHcm91cCwgcmF3RWxlbWVudCwgbm9kZXNUb0RyYXcsIGVsZW1lbnQpO1xuXG5cdFx0Ly8gdmFyIGhhc0dyb3VwO1xuXHRcdC8vIGZvciAodmFyIGsgPSAwLCBsZW5ndGggPSByYXdHcm91cFBhaXJpbmdzLmxlbmd0aDsgayA8IGxlbmd0aDsgayArPSAxKVxuXHRcdC8vIHtcblx0XHQvLyBcdHZhciBjdXJyID0gcmF3R3JvdXBQYWlyaW5nc1trXTtcblx0XHQvLyBcdGlmIChjdXJyLmdyb3VwID09PSBjdXJyR3JvdXApXG5cdFx0Ly8gXHR7XG5cdFx0Ly8gXHRcdGhhc0dyb3VwID0gdHJ1ZTtcblx0XHQvLyBcdFx0YnJlYWs7XG5cdFx0Ly8gXHR9XG5cdFx0Ly8gfVxuXHRcdC8vIGlmICghaGFzR3JvdXApIHsgcmF3R3JvdXBQYWlyaW5ncy5wdXNoKHsgZ3JvdXA6IGN1cnJHcm91cCwgcmF3OiByYXdFbGVtZW50LnBhcmVudE5vZGUgfSk7IH1cblx0XHRyYXdHcm91cFBhaXJpbmdzLnB1c2goeyBncm91cDogY3Vyckdyb3VwLCByYXc6IHJhd0VsZW1lbnQucGFyZW50Tm9kZSB9KTtcblx0fVxuXG5cdHZhciBwYWlyaW5nc0xlbmd0aCA9IHJhd0dyb3VwUGFpcmluZ3MubGVuZ3RoO1xuXHRmb3IgKGkgPSAwOyBpIDwgcGFpcmluZ3NMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBwYWlyaW5nID0gcmF3R3JvdXBQYWlyaW5nc1tpXTtcblx0XHQvLyB0aGlzLnBhcnNlQW5jaG9ycyhwYWlyaW5nLnJhdywgcGFpcmluZy5ncm91cCk7XG5cdFx0dGhpcy5wYXJzZUNvbnN0cmFpbnRzKHBhaXJpbmcucmF3LCBwYWlyaW5nLmdyb3VwKTtcblx0XHR0aGlzLnBhcnNlQ3VzdG9tSm9pbnRzKHBhaXJpbmcucmF3LCBwYWlyaW5nLmdyb3VwKTtcblx0fVxuXG5cdHRoaXMud29ybGQuYWRkR3JvdXBzVG9Xb3JsZCgpO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRHcm91cEluZm9zID0gZnVuY3Rpb24gKCRyYXdHcm91cClcbntcblx0dmFyIGdyb3VwRWxlbWVudCA9ICEkcmF3R3JvdXAuaWQgJiYgJHJhd0dyb3VwLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ3N2ZycgPyAkcmF3R3JvdXAucGFyZW50Tm9kZSA6ICRyYXdHcm91cDtcblx0dmFyIHR5cGU7XG5cdHZhciBJRDtcblx0dmFyIHJlZ2V4ID0gLyhbYS16XFxkXSspXFx3Ki9pZ207XG5cdHZhciBmaXJzdCA9IHJlZ2V4LmV4ZWMoZ3JvdXBFbGVtZW50LmlkKTtcblx0dmFyIHNlY29uZCA9IHJlZ2V4LmV4ZWMoZ3JvdXBFbGVtZW50LmlkKTtcblx0Ly9pZiAoZmlyc3QpIHsgdHlwZSA9IHNlY29uZCA/IHNlY29uZFsxXSA6IGZpcnN0WzFdOyB9XG5cdC8vdmFyIGdyb3VwVHlwZSA9IGdyb3VwRWxlbWVudC5pZC5tYXRjaCgpO1xuXHQvL2lmIChncm91cFR5cGUpIHsgcmV0dXJuIGdyb3VwVHlwZVsxXSB8fCBncm91cFR5cGVbMF07IH1cblx0Ly9hdXRvbWF0aWMgZm9yIGxpbmVzXG5cdGlmICghZmlyc3QgJiYgKGdyb3VwRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGxpbmVUYWdzKS5sZW5ndGggPiAwIHx8IGdyb3VwRWxlbWVudC50YWdOYW1lLnNlYXJjaChpc0xpbmUpID4gLTEpKVxuXHR7XG5cdFx0dHlwZSA9ICdsaW5lJztcblx0fVxuXHR0eXBlID0gZmlyc3QgPyBmaXJzdFsxXSA6IHVuZGVmaW5lZDtcblx0SUQgPSBzZWNvbmQgPyBzZWNvbmRbMV0gOiBudWxsO1xuXG5cdHJldHVybiB7IElEOiBJRCwgdHlwZTogdHlwZSB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNvbnN0cmFpbnRzID0gZnVuY3Rpb24gKCRyYXdHcm91cCwgJGdyb3VwKVxue1xuXHR2YXIgY2hpbGRyZW4gPSAkcmF3R3JvdXAuY2hpbGROb2RlczsvLyRyYXdHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiY29uc3RyYWludFwiXScpO1xuXG5cdGZvciAodmFyIGkgPSAwLCBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHRpZiAoY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGNoaWxkcmVuW2ldLmlkLnNlYXJjaCgvY29uc3RyYWludC9pKSA8IDApIHsgY29udGludWU7IH1cblx0XHR2YXIgY3VyckNvbnN0cmFpbnQgPSBjaGlsZHJlbltpXTtcblx0XHR2YXIgcmVzdWx0ID0gL2NvbnN0cmFpbnQtKFthLXpcXGRdKikvaWcuZXhlYyhjdXJyQ29uc3RyYWludC5pZCk7XG5cblx0XHR2YXIgcGFyZW50R3JvdXBJRCA9IHJlc3VsdCA/IHJlc3VsdFsxXSA6IHVuZGVmaW5lZDtcblx0XHR2YXIgcGFyZW50R3JvdXAgPSBwYXJlbnRHcm91cElEID8gdGhpcy53b3JsZC5nZXRHcm91cEJ5SUQocGFyZW50R3JvdXBJRCkgOiB1bmRlZmluZWQ7XG5cdFx0dmFyIHBvaW50cyA9IHRoaXMucGFyc2VFbGVtZW50KGN1cnJDb25zdHJhaW50KS5wb2ludHM7XG5cdFx0Ly8gY29uc29sZS5sb2coJGdyb3VwLklELCBwYXJlbnRHcm91cCA/IHBhcmVudEdyb3VwLklEIDogdW5kZWZpbmVkKTtcblx0XHR0aGlzLndvcmxkLmNvbnN0cmFpbkdyb3VwcygkZ3JvdXAsIHBhcmVudEdyb3VwLCBwb2ludHMpO1xuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlRWxlbWVudHMgPSBmdW5jdGlvbiAoJGVsZW1lbnRzLCAkZ3JvdXApXG57XG5cdGZvciAodmFyIGkgPSAwLCBlbGVtZW50c0xlbmd0aCA9ICRlbGVtZW50cy5sZW5ndGg7IGkgPCBlbGVtZW50c0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIHJhd0VsZW1lbnQgPSAkZWxlbWVudHNbaV07XG5cblx0XHR2YXIgZWxlbWVudCA9IHRoaXMucGFyc2VFbGVtZW50KHJhd0VsZW1lbnQpO1xuXG5cdFx0dmFyIG5vZGVzVG9EcmF3ID0gJGdyb3VwLnN0cnVjdHVyZS5jcmVhdGUoZWxlbWVudCk7XG5cdFx0dGhpcy5zZXRHcmFwaGljSW5zdHJ1Y3Rpb25zKCRncm91cCwgcmF3RWxlbWVudCwgbm9kZXNUb0RyYXcsIGVsZW1lbnQpO1xuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlRWxlbWVudCA9IGZ1bmN0aW9uICgkcmF3RWxlbWVudClcbntcblx0dmFyIHRhZ05hbWUgPSAkcmF3RWxlbWVudC50YWdOYW1lO1xuXG5cdHN3aXRjaCAodGFnTmFtZSlcblx0e1xuXHRcdGNhc2UgJ2xpbmUnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VMaW5lKCRyYXdFbGVtZW50KTtcblx0XHRjYXNlICdyZWN0Jzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlUmVjdCgkcmF3RWxlbWVudCk7XG5cblx0XHRjYXNlICdwb2x5Z29uJzpcblx0XHRjYXNlICdwb2x5bGluZSc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVBvbHkoJHJhd0VsZW1lbnQpO1xuXG5cdFx0Y2FzZSAncGF0aCc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVBhdGgoJHJhd0VsZW1lbnQpO1xuXG5cdFx0Y2FzZSAnY2lyY2xlJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ2lyY2xlKCRyYXdFbGVtZW50KTtcblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5zZXRHcmFwaGljSW5zdHJ1Y3Rpb25zID0gZnVuY3Rpb24gKCRncm91cCwgJHJhd0VsZW1lbnQsICRub2Rlcylcbntcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9ICRub2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyTm9kZSA9ICRub2Rlc1tpXTtcblx0XHRjdXJyTm9kZS5kcmF3aW5nID0ge307XG5cdFx0JGdyb3VwLm5vZGVzLnNwbGljZSgkZ3JvdXAubm9kZXMuaW5kZXhPZihjdXJyTm9kZSksIDEpO1xuXHRcdCRncm91cC5ub2Rlcy5zcGxpY2UoaSwgMCwgY3Vyck5vZGUpO1xuXHRcdC8vIGNvbnNvbGUubG9nKCRncm91cC5ub2Rlcy5pbmRleE9mKGN1cnJOb2RlKSk7XG5cdFx0Ly8gZGVidWdnZXI7XG5cdH1cblx0dmFyIHN0YXJ0Tm9kZSA9ICRub2Rlc1swXTtcblx0dmFyIGVuZE5vZGUgPSAkbm9kZXNbJG5vZGVzLmxlbmd0aCAtIDFdO1xuXG5cdHZhciBmaWxsID0gJHJhd0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdmaWxsJykgfHwgJyMwMDAwMDAnO1xuXHR2YXIgc3Ryb2tlID0gJHJhd0VsZW1lbnQuZ2V0QXR0cmlidXRlKCdzdHJva2UnKSB8fCAnbm9uZSc7XG5cdHZhciBsaW5lV2lkdGggPSAkcmF3RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcpO1xuXHR2YXIgb3BhY2l0eSA9ICRyYXdFbGVtZW50LmdldEF0dHJpYnV0ZSgnb3BhY2l0eScpO1xuXHRzdGFydE5vZGUuZHJhd2luZy5maWxsID0gZmlsbDsvL2ZpbGwgPT09IHVuZGVmaW5lZCA/ICdub25lJyA6IGZpbGw7XG5cdHN0YXJ0Tm9kZS5kcmF3aW5nLnN0cm9rZSA9IHN0cm9rZTtcblx0c3RhcnROb2RlLmRyYXdpbmcucmFkaXVzID0gJGdyb3VwLnN0cnVjdHVyZVByb3BlcnRpZXMucmFkaXVzIC8gdGhpcy5yYXRpbztcblx0c3RhcnROb2RlLmRyYXdpbmcubGluZVdpZHRoID0gbGluZVdpZHRoICogdGhpcy5yYXRpbyB8fCAxICogdGhpcy5yYXRpbzsvL2xpbmVXaWR0aCA9PT0gdW5kZWZpbmVkID8gJ25vbmUnIDogbGluZVdpZHRoICogdGhpcy5yYXRpbztcblx0c3RhcnROb2RlLmRyYXdpbmcubGluZUNhcCA9ICRyYXdFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVjYXAnKSB8fCAncm91bmQnO1xuXHRzdGFydE5vZGUuZHJhd2luZy5saW5lSm9pbiA9ICRyYXdFbGVtZW50LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVqb2luJykgfHwgJ3JvdW5kJztcblx0c3RhcnROb2RlLmRyYXdpbmcub3BhY2l0eSA9IG9wYWNpdHkgPyBvcGFjaXR5IDogdW5kZWZpbmVkO1xuXHRzdGFydE5vZGUuZHJhd2luZy5jbG9zZVBhdGggPSAkZ3JvdXAudHlwZSAhPT0gJ2xpbmUnICYmICRncm91cC5zdHJ1Y3R1cmVQcm9wZXJ0aWVzLnJhZGl1cyA9PT0gdW5kZWZpbmVkO1xuXG5cdHN0YXJ0Tm9kZS5kcmF3aW5nLnN0cm9rZUdyYWRpZW50ID0gdGhpcy5nZXRHcmFkaWVudChzdHJva2UpO1xuXHRzdGFydE5vZGUuZHJhd2luZy5maWxsR3JhZGllbnQgPSB0aGlzLmdldEdyYWRpZW50KGZpbGwpO1xuXG5cdHN0YXJ0Tm9kZS5lbmROb2RlID0gZW5kTm9kZTtcblx0c3RhcnROb2RlLmlzU3RhcnQgPSB0cnVlO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRHcmFkaWVudCA9IGZ1bmN0aW9uICgkdmFsdWUpXG57XG5cdHZhciBncmFkaWVudElEID0gL3VybFxcKCMoLiopXFwpL2ltLmV4ZWMoJHZhbHVlKTtcblx0aWYgKGdyYWRpZW50SUQpXG5cdHtcblx0XHR2YXIgZ3JhZGllbnRFbGVtZW50ID0gdGhpcy5TVkcucXVlcnlTZWxlY3RvcignIycgKyBncmFkaWVudElEWzFdKTtcblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgIT09ICdsaW5lYXJHcmFkaWVudCcgJiYgZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgIT09ICdyYWRpYWxHcmFkaWVudCcpIHsgcmV0dXJuOyB9XG5cblx0XHR2YXIgZ3JhZGllbnQgPSB7IHN0b3BzOiBbXSwgdHlwZTogZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgfTtcblxuXHRcdGlmIChncmFkaWVudEVsZW1lbnQudGFnTmFtZSA9PT0gJ2xpbmVhckdyYWRpZW50Jylcblx0XHR7XG5cdFx0XHRncmFkaWVudC54MSA9IHRoaXMuZ2V0Q29vcmRYKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHRcdFx0Z3JhZGllbnQueTEgPSB0aGlzLmdldENvb3JkWChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCd5MScpKTtcblx0XHRcdGdyYWRpZW50LngyID0gdGhpcy5nZXRDb29yZFgoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdFx0XHRncmFkaWVudC55MiA9IHRoaXMuZ2V0Q29vcmRYKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXHRcdH1cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgPT09ICdyYWRpYWxHcmFkaWVudCcpXG5cdFx0e1xuXHRcdFx0Z3JhZGllbnQuY3ggPSB0aGlzLmdldENvb3JkWChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjeCcpKTtcblx0XHRcdGdyYWRpZW50LmN5ID0gdGhpcy5nZXRDb29yZFgoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnY3knKSk7XG5cdFx0XHRncmFkaWVudC5meCA9IHRoaXMuZ2V0Q29vcmRYKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Z4JykpO1xuXHRcdFx0Z3JhZGllbnQuZnkgPSB0aGlzLmdldENvb3JkWChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmeScpKTtcblx0XHRcdGdyYWRpZW50LnIgPSB0aGlzLmdldENvb3JkWChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdyJykpO1xuXHRcdH1cblxuXHRcdHZhciBzdG9wcyA9IGdyYWRpZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzdG9wJyk7XG5cdFx0Zm9yICh2YXIgayA9IDAsIHN0b3BMZW5ndGggPSBzdG9wcy5sZW5ndGg7IGsgPCBzdG9wTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJTdG9wID0gc3RvcHNba107XG5cdFx0XHR2YXIgb2Zmc2V0ID0gTnVtYmVyKGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnb2Zmc2V0JykpO1xuXHRcdFx0dmFyIGNvbG9yID0gL3N0b3AtY29sb3I6KCNbMC05QS1GXSspL2ltLmV4ZWMoY3VyclN0b3AuZ2V0QXR0cmlidXRlKCdzdHlsZScpKVsxXTtcblx0XHRcdGdyYWRpZW50LnN0b3BzLnB1c2goeyBvZmZzZXQ6IG9mZnNldCwgY29sb3I6IGNvbG9yIH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBncmFkaWVudDtcblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNpcmNsZSA9IGZ1bmN0aW9uICgkcmF3Q2lyY2xlKVxue1xuXHR2YXIgeFBvcyA9IHRoaXMuZ2V0Q29vcmRYKCRyYXdDaXJjbGUuZ2V0QXR0cmlidXRlKCdjeCcpKTtcblx0dmFyIHlQb3MgPSB0aGlzLmdldENvb3JkWSgkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgnY3knKSk7XG5cdHZhciByYWRpdXMgPSB0aGlzLmdldENvb3JkWCgkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgncicpKTtcblx0cmV0dXJuIHsgdHlwZTogJ2NpcmNsZScsIHBvaW50czogW1t4UG9zLCB5UG9zXV0sIHJhZGl1czogcmFkaXVzIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlTGluZSA9IGZ1bmN0aW9uICgkcmF3TGluZSlcbntcblx0dmFyIHgxID0gdGhpcy5nZXRDb29yZFgoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd4MScpKTtcblx0dmFyIHgyID0gdGhpcy5nZXRDb29yZFgoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd4MicpKTtcblx0dmFyIHkxID0gdGhpcy5nZXRDb29yZFgoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd5MScpKTtcblx0dmFyIHkyID0gdGhpcy5nZXRDb29yZFgoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd5MicpKTtcblx0dmFyIHBvaW50cyA9IFtdO1xuXHRwb2ludHMucHVzaChbeDEsIHkxXSk7XG5cdHBvaW50cy5wdXNoKFt4MiwgeTJdKTtcblx0dmFyIHRoaWNrbmVzcyA9IHRoaXMuZ2V0Q29vcmRYKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJykpO1xuXHRyZXR1cm4geyB0eXBlOiAnbGluZScsIHBvaW50czogcG9pbnRzLCB0aGlja25lc3M6IHRoaWNrbmVzcyB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZVJlY3QgPSBmdW5jdGlvbiAoJHJhd1JlY3QpXG57XG5cdHZhciB4MSA9ICRyYXdSZWN0LmdldEF0dHJpYnV0ZSgneCcpID8gdGhpcy5nZXRDb29yZFgoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd4JykpIDogMDtcblx0dmFyIHkxID0gJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd5JykgPyB0aGlzLmdldENvb3JkWSgkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3knKSkgOiAwO1xuXHR2YXIgeDIgPSB4MSArIHRoaXMuZ2V0Q29vcmRYKCRyYXdSZWN0LmdldEF0dHJpYnV0ZSgnd2lkdGgnKSk7XG5cdHZhciB5MiA9IHkxICsgdGhpcy5nZXRDb29yZFkoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG5cdHZhciBwb2ludHMgPSBbXTtcblx0cG9pbnRzLnB1c2goW3gxLCB5MV0pO1xuXHRwb2ludHMucHVzaChbeDEsIHkyXSk7XG5cdHBvaW50cy5wdXNoKFt4MiwgeTJdKTtcblx0cG9pbnRzLnB1c2goW3gyLCB5MV0pO1xuXG5cdHJldHVybiB7IHR5cGU6ICdwb2x5Z29uJywgcG9pbnRzOiBwb2ludHMgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VQb2x5ID0gZnVuY3Rpb24gKCRyYXdQb2x5KVxue1xuXHR2YXIgc3BsaXRzID0gJHJhd1BvbHkuZ2V0QXR0cmlidXRlKCdwb2ludHMnKS5zcGxpdCgnICcpO1xuXHR2YXIgcG9pbnRzID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDAsIHNwbGl0c0xlbmd0aCA9IHNwbGl0cy5sZW5ndGg7IGkgPCBzcGxpdHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyU3BsaXQgPSBzcGxpdHNbaV07XG5cblx0XHRpZiAoY3VyclNwbGl0ICE9PSAnJylcblx0XHR7XG5cdFx0XHR2YXIgcG9pbnQgPSBjdXJyU3BsaXQuc3BsaXQoJywnKTtcblx0XHRcdHZhciBwb2ludFggPSB0aGlzLmdldENvb3JkWChwb2ludFswXSk7XG5cdFx0XHR2YXIgcG9pbnRZID0gdGhpcy5nZXRDb29yZFkocG9pbnRbMV0pO1xuXHRcdFx0dmFyIGV4aXN0cyA9IGZhbHNlO1xuXHRcdFx0Zm9yICh2YXIgayA9IDAsIG90aGVyQ29vcmRzQXJyYXlMZW5ndGggPSBwb2ludHMubGVuZ3RoOyBrIDwgb3RoZXJDb29yZHNBcnJheUxlbmd0aDsgayArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgb3RoZXJQb2ludCA9IHBvaW50c1trXTtcblx0XHRcdFx0dmFyIG90aGVyWCA9IG90aGVyUG9pbnRbMF07XG5cdFx0XHRcdHZhciBvdGhlclkgPSBvdGhlclBvaW50WzFdO1xuXHRcdFx0XHRpZiAob3RoZXJYID09PSBwb2ludFggJiYgb3RoZXJZID09PSBwb2ludFkpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRleGlzdHMgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoZXhpc3RzID09PSBmYWxzZSlcblx0XHRcdHtcblx0XHRcdFx0cG9pbnRzLnB1c2goW3BvaW50WCwgcG9pbnRZXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0dmFyIHRoaWNrbmVzcyA9IHRoaXMuZ2V0Q29vcmRYKCRyYXdQb2x5LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJykpO1xuXHR2YXIgdHlwZSA9ICRyYXdQb2x5LnRhZ05hbWUgPT09ICdwb2x5bGluZScgPyAnbGluZScgOiAncG9seWdvbic7XG5cdHJldHVybiB7IHR5cGU6IHR5cGUsIHBvaW50czogcG9pbnRzLCB0aGlja25lc3M6IHRoaWNrbmVzcyB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBhdGggPSBmdW5jdGlvbiAoJHJhd1BhdGgpXG57XG5cdHZhciBkID0gJHJhd1BhdGguZ2V0QXR0cmlidXRlKCdkJyk7XG5cdHZhciBwYXRoUmVnID0gLyhbbWxzY3ZoXSkoLT9bXFxkXFwuXSpbLC1dK1tcXGRcXC5dKiksPygtP1tcXGRcXC5dKiw/LT9bXFxkXFwuXSopLD8oLT9bXFxkXFwuXSosPy0/W1xcZFxcLl0qKS9pZ207XG5cdHZhciBwb2ludHMgPSBbXTtcblx0dmFyIGxhc3RDb29yZFggPSB0aGlzLmdldENvb3JkWCgwKTtcblx0dmFyIGxhc3RDb29yZFkgPSB0aGlzLmdldENvb3JkWSgwKTtcblx0Zm9yICh2YXIgYXJyYXkgPSBwYXRoUmVnLmV4ZWMoZCk7IGFycmF5ICE9PSBudWxsOyBhcnJheSA9IHBhdGhSZWcuZXhlYyhkKSlcblx0e1xuXHRcdHZhciBjb29yZFN0cmluZztcblx0XHR2YXIgbnVtYmVyQ29vcmRYO1xuXHRcdHZhciBudW1iZXJDb29yZFk7XG5cdFx0aWYgKGFycmF5WzFdID09PSAndicpXG5cdFx0e1xuXHRcdFx0bnVtYmVyQ29vcmRYID0gbGFzdENvb3JkWDtcblx0XHRcdG51bWJlckNvb3JkWSA9IGxhc3RDb29yZFkgKyB0aGlzLmdldENvb3JkWShhcnJheVsyXSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGFycmF5WzFdID09PSAnaCcpXG5cdFx0e1xuXHRcdFx0bnVtYmVyQ29vcmRYID0gbGFzdENvb3JkWCArIHRoaXMuZ2V0Q29vcmRZKGFycmF5WzJdKTtcblx0XHRcdG51bWJlckNvb3JkWSA9IGxhc3RDb29yZFk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRpZiAoYXJyYXlbNF0gIT09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb29yZFN0cmluZyA9IGFycmF5WzRdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYXJyYXlbM10gIT09ICcnKVxuXHRcdFx0e1xuXHRcdFx0XHRjb29yZFN0cmluZyA9IGFycmF5WzNdO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRjb29yZFN0cmluZyA9IGFycmF5WzJdO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGNvb3JkUmVnID0gLygtP1xcZCtcXC4/XFxkKikvaWdtO1xuXHRcdFx0dmFyIGNvb3JkcyA9IGNvb3JkU3RyaW5nLm1hdGNoKGNvb3JkUmVnKTtcblxuXHRcdFx0bnVtYmVyQ29vcmRYID0gbGFzdENvb3JkWCArIHRoaXMuZ2V0Q29vcmRYKGNvb3Jkc1swXSk7XG5cdFx0XHRudW1iZXJDb29yZFkgPSBsYXN0Q29vcmRZICsgdGhpcy5nZXRDb29yZFkoY29vcmRzWzFdKTtcblx0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZyhudW1iZXJDb29yZFgsIG51bWJlckNvb3JkWSk7XG5cdFx0cG9pbnRzLnB1c2goW251bWJlckNvb3JkWCwgbnVtYmVyQ29vcmRZXSk7XG5cblx0XHRsYXN0Q29vcmRYID0gbnVtYmVyQ29vcmRYO1xuXHRcdGxhc3RDb29yZFkgPSBudW1iZXJDb29yZFk7XG5cdH1cblxuXHR2YXIgdGhpY2tuZXNzID0gdGhpcy5nZXRDb29yZFgoJHJhd1BhdGguZ2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnKSk7XG5cdHJldHVybiB7IHR5cGU6ICdsaW5lJywgcG9pbnRzOiBwb2ludHMsIHRoaWNrbmVzczogdGhpY2tuZXNzIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnJvdW5kID0gZnVuY3Rpb24gKCRudW1iZXIpXG57XG5cdC8vIHZhciBudW1iZXIgPSBOdW1iZXIoJG51bWJlcik7XG5cdC8vIHJldHVybiBNYXRoLmZsb29yKG51bWJlciAqIDEwMCkgLyAxMDA7XG5cdHJldHVybiAkbnVtYmVyO1xuXHQvL3JldHVybiBNYXRoLmZsb29yKE51bWJlcigkbnVtYmVyKSk7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldENvb3JkWCA9IGZ1bmN0aW9uICgkY29vcmRTVFIpXG57XG5cdHZhciBudW1iZXIgPSB0aGlzLnJvdW5kKCRjb29yZFNUUik7XG5cdHJldHVybiBudW1iZXIgKiB0aGlzLnJhdGlvO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRDb29yZFkgPSBmdW5jdGlvbiAoJGNvb3JkU1RSKVxue1xuXHR2YXIgbnVtYmVyID0gdGhpcy5yb3VuZCgkY29vcmRTVFIpO1xuXHQvL251bWJlciA9IHRoaXMudmlld0JveEhlaWdodCAtIG51bWJlcjtcblx0cmV0dXJuIG51bWJlciAqIHRoaXMucmF0aW87XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlQ3VzdG9tSm9pbnRzID0gZnVuY3Rpb24gKCRyYXdHcm91cCwgJGdyb3VwKVxue1xuXHR2YXIgY2hpbGRyZW4gPSAkcmF3R3JvdXAuY2hpbGROb2RlczsvLyRyYXdHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiY29uc3RyYWludFwiXScpO1xuXG5cdGZvciAodmFyIGkgPSAwLCBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHRpZiAoY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGNoaWxkcmVuW2ldLmlkLnNlYXJjaCgvam9pbnQvaSkgPCAwKSB7IGNvbnRpbnVlOyB9XG5cblx0XHR2YXIgY3VyclJhd0pvaW50ID0gY2hpbGRyZW5baV07XG5cdFx0dmFyIHAxeCA9IHRoaXMuZ2V0Q29vcmRYKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHRcdHZhciBwMXkgPSB0aGlzLmdldENvb3JkWShjdXJyUmF3Sm9pbnQuZ2V0QXR0cmlidXRlKCd5MScpKTtcblx0XHR2YXIgcDJ4ID0gdGhpcy5nZXRDb29yZFgoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdFx0dmFyIHAyeSA9IHRoaXMuZ2V0Q29vcmRZKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXG5cdFx0dmFyIG4xID0gJGdyb3VwLmdldE5vZGVBdFBvaW50KHAxeCwgcDF5KSB8fCAkZ3JvdXAuY3JlYXRlTm9kZShwMXgsIHAxeSk7XG5cdFx0dmFyIG4yID0gJGdyb3VwLmdldE5vZGVBdFBvaW50KHAyeCwgcDJ5KSB8fCAkZ3JvdXAuY3JlYXRlTm9kZShwMngsIHAyeSk7XG5cdFx0JGdyb3VwLmNyZWF0ZUpvaW50KG4xLCBuMik7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZHUGFyc2VyO1xuXG4iLCJ2YXIgU1ZKZWxseU5vZGUgPSByZXF1aXJlKCcuL1NWSmVsbHlOb2RlJyk7XG52YXIgU1ZKZWxseUpvaW50ID0gcmVxdWlyZSgnLi9TVkplbGx5Sm9pbnQnKTtcblxudmFyIFNWSmVsbHlHcm91cCA9IGZ1bmN0aW9uICgkdHlwZSwgJGNvbmYsICRJRClcbntcblx0dGhpcy5waHlzaWNzTWFuYWdlciA9IHVuZGVmaW5lZDtcblx0dGhpcy5zdHJ1Y3R1cmUgPSB1bmRlZmluZWQ7XG5cdHRoaXMuY29uZiA9ICRjb25mO1xuXHR0aGlzLnR5cGUgPSAkdHlwZTtcblx0dGhpcy5ub2RlcyA9IFtdO1xuXHR0aGlzLmpvaW50cyA9IFtdO1xuXHR0aGlzLklEID0gJElEO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5nZXROb2RlQXRQb2ludCA9IGZ1bmN0aW9uICgkeCwgJHkpXG57XG5cdGZvciAodmFyIGkgPSAwLCBub2Rlc0xlbmd0aCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbm9kZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcblxuXHRcdGlmIChub2RlLm9YID09PSAkeCAmJiBub2RlLm9ZID09PSAkeSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9XG5cdH1cbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uICgkcHgsICRweSwgJG9wdGlvbnMsICRvdmVyd3JpdGUpXG57XG5cdHZhciBub2RlID0gdGhpcy5nZXROb2RlQXRQb2ludCgkcHgsICRweSk7XG5cdGlmIChub2RlICE9PSB1bmRlZmluZWQgJiYgJG92ZXJ3cml0ZSlcblx0e1xuXHRcdG5vZGUuc2V0T3B0aW9ucygkb3B0aW9ucyk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0bm9kZSA9IG5ldyBTVkplbGx5Tm9kZSgkcHgsICRweSwgJG9wdGlvbnMpO1xuXHRcdHRoaXMubm9kZXMucHVzaChub2RlKTtcblx0fVxuXG5cdC8vdGhpcy5waHlzaWNzTWFuYWdlci5hZGROb2RlVG9Xb3JsZChub2RlKTtcblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Q2xvc2VzdFBvaW50ID0gZnVuY3Rpb24gKCRwb2ludHMsICRub2Rlcylcbntcblx0dmFyIG5vZGVzID0gJG5vZGVzIHx8IHRoaXMubm9kZXM7XG5cdHZhciBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xuXHR2YXIgY2xvc2VzdFBvaW50O1xuXHR2YXIgY2xvc2VzdE5vZGU7XG5cdHZhciBjbG9zZXN0T2Zmc2V0WDtcblx0dmFyIGNsb3Nlc3RPZmZzZXRZO1xuXG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSAkcG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0Zm9yICh2YXIgayA9IDAsIG5vZGVzTGVuZ3RoID0gbm9kZXMubGVuZ3RoOyBrIDwgbm9kZXNMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3Vyck5vZGUgPSBub2Rlc1trXTtcblx0XHRcdHZhciBvZmZzZXRYID0gY3VyclBvaW50WzBdIC0gY3Vyck5vZGUub1g7XG5cdFx0XHR2YXIgb2Zmc2V0WSA9IGN1cnJQb2ludFsxXSAtIGN1cnJOb2RlLm9ZO1xuXHRcdFx0dmFyIGNYID0gTWF0aC5hYnMob2Zmc2V0WCk7XG5cdFx0XHR2YXIgY1kgPSBNYXRoLmFicyhvZmZzZXRZKTtcblx0XHRcdHZhciBkaXN0ID0gTWF0aC5zcXJ0KGNYICogY1ggKyBjWSAqIGNZKTtcblx0XHRcdGlmIChkaXN0IDwgY2xvc2VzdERpc3QpXG5cdFx0XHR7XG5cdFx0XHRcdGNsb3Nlc3ROb2RlID0gY3Vyck5vZGU7XG5cdFx0XHRcdGNsb3Nlc3RQb2ludCA9IGN1cnJQb2ludDtcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0XHRjbG9zZXN0T2Zmc2V0WCA9IG9mZnNldFg7XG5cdFx0XHRcdGNsb3Nlc3RPZmZzZXRZID0gb2Zmc2V0WTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY2xvc2VzdFBvaW50O1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5nZXRDbG9zZXN0Tm9kZSA9IGZ1bmN0aW9uICgkY29vcmQsICRub2Rlcylcbntcblx0dmFyIG5vZGVzID0gJG5vZGVzIHx8IHRoaXMubm9kZXM7XG5cdHZhciBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xuXHR2YXIgY2xvc2VzdDtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSBub2Rlc1tpXTtcblx0XHR2YXIgb2Zmc2V0WCA9ICRjb29yZFswXSAtIG5vZGUub1g7XG5cdFx0dmFyIG9mZnNldFkgPSAkY29vcmRbMV0gLSBub2RlLm9ZO1xuXHRcdHZhciBjWCA9IE1hdGguYWJzKG9mZnNldFgpO1xuXHRcdHZhciBjWSA9IE1hdGguYWJzKG9mZnNldFkpO1xuXHRcdHZhciBkaXN0ID0gTWF0aC5zcXJ0KGNYICogY1ggKyBjWSAqIGNZKTtcblx0XHRpZiAoZGlzdCA8IGNsb3Nlc3REaXN0KVxuXHRcdHtcblx0XHRcdGNsb3Nlc3QgPSBub2RlO1xuXHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2xvc2VzdDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Tm9kZXNJbnNpZGUgPSBmdW5jdGlvbiAoJHBvaW50cylcbntcblx0dmFyIFBvbHlnb24gPSByZXF1aXJlKCcuL1BvbHlnb24nKTtcblx0dmFyIHRvUmV0dXJuID0gW107XG5cdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRwb2ludHMpO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcblx0XHRpZiAocG9seWdvbi5pc0luc2lkZShbbm9kZS5vWCwgbm9kZS5vWV0pKVxuXHRcdHtcblx0XHRcdHRvUmV0dXJuLnB1c2gobm9kZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0b1JldHVybjtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Qm91bmRpbmdCb3ggPSBmdW5jdGlvbiAoKVxue1xuXHR2YXIgbWluWDtcblx0dmFyIG1heFg7XG5cdHZhciBtaW5ZO1xuXHR2YXIgbWF4WTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XG5cdFx0bWluWCA9IG1pblggPiBub2RlLm9YIHx8IG1pblggPT09IHVuZGVmaW5lZCA/IG5vZGUub1ggOiBtaW5YO1xuXHRcdG1heFggPSBtYXhYIDwgbm9kZS5vWCB8fCBtYXhYID09PSB1bmRlZmluZWQgPyBub2RlLm9YIDogbWF4WDtcblx0XHRtaW5ZID0gbWluWSA+IG5vZGUub1kgfHwgbWluWSA9PT0gdW5kZWZpbmVkID8gbm9kZS5vWSA6IG1pblk7XG5cdFx0bWF4WSA9IG1heFkgPCBub2RlLm9ZIHx8IG1heFkgPT09IHVuZGVmaW5lZCA/IG5vZGUub1kgOiBtYXhZO1xuXHR9XG5cdHJldHVybiBbW21pblgsIG1pblldLCBbbWF4WCwgbWF4WV1dO1xufTtcblxuLy9UT0RPIDogdG8gcmVtb3ZlXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmhpdFRlc3QgPSBmdW5jdGlvbiAoJHBvaW50KVxue1xuXHR2YXIgY3VyclggPSAkcG9pbnRbMF07XG5cdHZhciBjdXJyWSA9ICRwb2ludFsxXTtcblx0dmFyIGJvdW5kaW5nID0gdGhpcy5nZXRCb3VuZGluZ0JveCgpO1xuXHRpZiAoY3VyclggPj0gYm91bmRpbmdbMF1bMF0gJiYgY3VyclggPD0gYm91bmRpbmdbMV1bMF0gJiZcblx0XHRjdXJyWSA+PSBib3VuZGluZ1swXVsxXSAmJiBjdXJyWSA8PSBib3VuZGluZ1sxXVsxXSlcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuY3JlYXRlSm9pbnQgPSBmdW5jdGlvbiAoJG5vZGUxLCAkbm9kZTIpXG57XG5cdGZvciAodmFyIGkgPSAwLCBqb2ludHNMZW5ndGggPSB0aGlzLmpvaW50cy5sZW5ndGg7IGkgPCBqb2ludHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJySm9pbnQgPSB0aGlzLmpvaW50c1tpXTtcblx0XHRpZiAoKGN1cnJKb2ludC5ub2RlMSA9PT0gJG5vZGUxICYmIGN1cnJKb2ludC5ub2RlMiA9PT0gJG5vZGUyKSB8fCAoY3VyckpvaW50Lm5vZGUyID09PSAkbm9kZTEgJiYgY3VyckpvaW50Lm5vZGUxID09PSAkbm9kZTIpKVxuXHRcdHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdH1cblxuXHR2YXIgam9pbnQgPSBuZXcgU1ZKZWxseUpvaW50KCRub2RlMSwgJG5vZGUyKTtcblxuXHR0aGlzLmpvaW50cy5wdXNoKGpvaW50KTtcblxuXHQvL3RoaXMucGh5c2ljc01hbmFnZXIuYWRkSm9pbnRUb1dvcmxkKGpvaW50KTtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuY3JlYXRlTm9kZXNGcm9tUG9pbnRzID0gZnVuY3Rpb24gKCRjb29yZHNBcnJheSlcbntcblx0dmFyIGNvb3Jkc0FycmF5TGVuZ3RoID0gJGNvb3Jkc0FycmF5Lmxlbmd0aDtcblx0dmFyIHRvUmV0dXJuID0gW107XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY29vcmRzQXJyYXlMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkY29vcmRzQXJyYXlbaV07XG5cdFx0dG9SZXR1cm4ucHVzaCh0aGlzLmNyZWF0ZU5vZGUoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0sIHVuZGVmaW5lZCwgZmFsc2UpKTtcblx0fVxuXHRyZXR1cm4gdG9SZXR1cm47XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldEJlc3RNYXRjaEZvckdyb3VwQ29uc3RyYWludCA9IGZ1bmN0aW9uICgkcG9pbnRzLCAkYW5jaG9yKVxue1xuXHRyZXR1cm4gdGhpcy5waHlzaWNzTWFuYWdlci5nZXRCZXN0TWF0Y2hGb3JHcm91cENvbnN0cmFpbnQoJHBvaW50cywgJGFuY2hvcik7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZUpvaW50c0Zyb21Qb2ludHMgPSBmdW5jdGlvbiAoJGNvb3Jkc0FycmF5LCAkbm9DbG9zZSlcbntcblx0dmFyIGNvb3Jkc0FycmF5TGVuZ3RoID0gJGNvb3Jkc0FycmF5Lmxlbmd0aDtcblx0Zm9yICh2YXIgaSA9IDE7IGkgPCBjb29yZHNBcnJheUxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRjb29yZHNBcnJheVtpXTtcblx0XHR2YXIgbGFzdFBvaW50ID0gJGNvb3Jkc0FycmF5W2kgLSAxXTtcblx0XHR2YXIgbGFzdE5vZGUgPSB0aGlzLmdldE5vZGVBdFBvaW50KGxhc3RQb2ludFswXSwgbGFzdFBvaW50WzFdKTtcblx0XHR2YXIgY3Vyck5vZGUgPSB0aGlzLmdldE5vZGVBdFBvaW50KGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKTtcblx0XHR0aGlzLmNyZWF0ZUpvaW50KGxhc3ROb2RlLCBjdXJyTm9kZSk7XG5cdFx0aWYgKGkgPT09IGNvb3Jkc0FycmF5TGVuZ3RoIC0gMSAmJiAkbm9DbG9zZSAhPT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHR2YXIgZmlyc3ROb2RlID0gdGhpcy5nZXROb2RlQXRQb2ludCgkY29vcmRzQXJyYXlbMF1bMF0sICRjb29yZHNBcnJheVswXVsxXSk7XG5cdFx0XHR0aGlzLmNyZWF0ZUpvaW50KGN1cnJOb2RlLCBmaXJzdE5vZGUpO1xuXHRcdH1cblx0fVxufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5hZGROb2Rlc1RvV29ybGQgPSBmdW5jdGlvbiAoKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZE5vZGVzVG9Xb3JsZCgpO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5hZGRKb2ludHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0dGhpcy5waHlzaWNzTWFuYWdlci5hZGRKb2ludHNUb1dvcmxkKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWSmVsbHlHcm91cDtcblxuIiwidmFyIFNWSmVsbHlKb2ludCA9IGZ1bmN0aW9uICgkbm9kZTEsICRub2RlMilcbntcblx0dGhpcy5ub2RlMSA9ICRub2RlMTtcblx0dGhpcy5ub2RlMiA9ICRub2RlMjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseUpvaW50O1xuXG4iLCJ2YXIgU1ZKZWxseU5vZGUgPSBmdW5jdGlvbiAoJG9YLCAkb1ksICRvcHRpb25zKVxue1xuXHR0aGlzLmpvaW50c0FycmF5ID0gW107XG5cdHRoaXMub1ggPSAkb1g7XG5cdHRoaXMub1kgPSAkb1k7XG5cdHRoaXMuZHJhd2luZyA9IHVuZGVmaW5lZDtcblx0dGhpcy5maXhlZCA9IGZhbHNlO1xuXHR0aGlzLmlzU3RhcnQgPSBmYWxzZTtcblx0dGhpcy5lbmROb2RlID0gdW5kZWZpbmVkO1xuXHR0aGlzLnNldE9wdGlvbnMoJG9wdGlvbnMpO1xufTtcblxuLy9yYWNjb3VyY2lcblNWSmVsbHlOb2RlLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKCRvcHRpb25zKVxue1xuXHRpZiAoJG9wdGlvbnMpXG5cdHtcblx0XHQvLyB2YXIgPSAkID09PSB1bmRlZmluZWQgPyB7fSA6ICRvcHRpb25zO1xuXHRcdGlmICgkb3B0aW9ucy5maXhlZCAhPT0gdW5kZWZpbmVkKSB7IHRoaXMuZml4ZWQgPSAkb3B0aW9ucy5maXhlZDsgfVxuXHR9XG59O1xuXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuc2V0Rml4ZWQgPSBmdW5jdGlvbiAoJGZpeGVkKVxue1xuXHR0aGlzLmZpeGVkID0gJGZpeGVkO1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyLnNldEZpeGVkKCRmaXhlZCk7XG59O1xuXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpXG57XG5cdHJldHVybiB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldFgoKTtcbn07XG5cbi8vcmFjY291cmNpXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXG57XG5cdHJldHVybiB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldFkoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseU5vZGU7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRleHRlbmQ6IGZ1bmN0aW9uICgkdG9FeHRlbmQsICRleHRlbnNpb24pXG5cdHtcblx0XHR2YXIgcmVjdXIgPSBmdW5jdGlvbiAoJG9iamVjdCwgJGV4dGVuZClcblx0XHR7XG5cdFx0XHRmb3IgKHZhciBuYW1lIGluICRleHRlbmQpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0eXBlb2YgJGV4dGVuZFtuYW1lXSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoJGV4dGVuZFtuYW1lXSkgJiYgJGV4dGVuZFtuYW1lXSAhPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgkb2JqZWN0W25hbWVdID09PSB1bmRlZmluZWQpIHsgJG9iamVjdFtuYW1lXSA9IHt9OyB9XG5cdFx0XHRcdFx0cmVjdXIoJG9iamVjdFtuYW1lXSwgJGV4dGVuZFtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JG9iamVjdFtuYW1lXSA9ICRleHRlbmRbbmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHJlY3VyKCR0b0V4dGVuZCwgJGV4dGVuc2lvbik7XG5cblx0XHRyZXR1cm4gJHRvRXh0ZW5kO1xuXHR9XG59O1xuXG4iLCJ2YXIgU1ZKZWxseUdyb3VwID0gcmVxdWlyZSgnLi9TVkplbGx5R3JvdXAnKTtcbnZhciBTdHJ1Y3R1cmUgPSByZXF1aXJlKCcuL1N0cnVjdHVyZScpO1xuXG52YXIgU1ZKZWxseVdvcmxkID0gZnVuY3Rpb24gKCRwaHlzaWNzTWFuYWdlciwgJGNvbmYpXG57XG5cdHRoaXMucGh5c2ljc01hbmFnZXIgPSAkcGh5c2ljc01hbmFnZXI7XG5cdHRoaXMuZ3JvdXBzQXJyYXkgPSBbXTtcblx0dGhpcy5jb25mID0gJGNvbmY7XG5cdHRoaXMud29ybGROb2RlcyA9IFtdO1xuXHR0aGlzLmdyb3VwQ29uc3RyYWludHMgPSBbXTtcblx0dGhpcy53b3JsZFdpZHRoID0gdGhpcy5waHlzaWNzTWFuYWdlci53b3JsZFdpZHRoID0gJGNvbmYud29ybGRXaWR0aDtcbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKCRoZWlnaHQpXG57XG5cdHRoaXMud29ybGRIZWlnaHQgPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLndvcmxkSGVpZ2h0ID0gJGhlaWdodDtcbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxue1xuXHRyZXR1cm4gdGhpcy53b3JsZFdpZHRoO1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5nZXRHcm91cEJ5SUQgPSBmdW5jdGlvbiAoJElEKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5ncm91cHNBcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyR3JvdXAgPSB0aGlzLmdyb3Vwc0FycmF5W2ldO1xuXHRcdGlmIChjdXJyR3JvdXAuSUQgPT09ICRJRCkgeyByZXR1cm4gY3Vyckdyb3VwOyB9XG5cdH1cbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuY3JlYXRlR3JvdXAgPSBmdW5jdGlvbiAoJHR5cGUsICRJRClcbntcblx0dmFyIHR5cGUgPSAkdHlwZSB8fCAnZGVmYXVsdCc7XG5cdHZhciBncm91cCA9IG5ldyBTVkplbGx5R3JvdXAodHlwZSwgdGhpcy5jb25mLmdyb3Vwc1t0eXBlXSwgJElEKTtcblx0Z3JvdXAucGh5c2ljc01hbmFnZXIgPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldEdyb3VwUGh5c2ljc01hbmFnZXIoZ3JvdXApO1xuXHRncm91cC5zdHJ1Y3R1cmUgPSBuZXcgU3RydWN0dXJlKGdyb3VwLCB0aGlzKTtcblx0dGhpcy5ncm91cHNBcnJheS5wdXNoKGdyb3VwKTtcblx0cmV0dXJuIGdyb3VwO1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5jb25zdHJhaW5Hcm91cHMgPSBmdW5jdGlvbiAoJGdyb3VwQSwgJGdyb3VwQiwgJHBvaW50cylcbntcblx0dmFyIHBvaW50cyA9ICRwb2ludHM7XG5cdHZhciBncm91cEEgPSAkZ3JvdXBBO1xuXHR2YXIgZ3JvdXBCID0gJGdyb3VwQjtcblxuXHRpZiAocG9pbnRzLmxlbmd0aCA8IDMpXG5cdHtcblx0XHR2YXIgYW5jaG9yQSA9IGdyb3VwQS5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JGcm9tTGluZShwb2ludHMpO1xuXHRcdHBvaW50cy5zcGxpY2UocG9pbnRzLmluZGV4T2YoYW5jaG9yQS5wb2ludCksIDEpO1xuXHRcdHZhciBhbmNob3JCID0gZ3JvdXBCID8gZ3JvdXBCLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUFuY2hvckZyb21Qb2ludChwb2ludHNbMF0pIDogdGhpcy5waHlzaWNzTWFuYWdlci5nZXRBbmNob3JQaHlzaWNzTWFuYWdlcihwb2ludHNbMF0pO1xuXHRcdHRoaXMuZ3JvdXBDb25zdHJhaW50cy5wdXNoKHsgYW5jaG9yQTogYW5jaG9yQSwgYW5jaG9yQjogYW5jaG9yQiB9KTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHR2YXIgYW5jaG9yc0EgPSBncm91cEEucGh5c2ljc01hbmFnZXIuY3JlYXRlQW5jaG9ycyhwb2ludHMpO1xuXHRcdC8vY29uc29sZS5sb2coJ0EnLCBncm91cEEuSUQsIGFuY2hvcnNBLmxlbmd0aCwgJ0InLCBncm91cEIgPyBncm91cEIuSUQgOiBncm91cEIpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBub2Rlc0xlbmd0aCA9IGFuY2hvcnNBLmxlbmd0aDsgaSA8IG5vZGVzTGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJBbmNob3JBID0gYW5jaG9yc0FbaV07XG5cdFx0XHRpZiAoIWdyb3VwQilcblx0XHRcdHtcblx0XHRcdFx0Y3VyckFuY2hvckEuc2V0Rml4ZWQodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBhbmNob3JzQiA9IGdyb3VwQi5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JzKHBvaW50cyk7XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBhbmNob3JzQkxlbmd0aCA9IGFuY2hvcnNCLmxlbmd0aDsgayA8IGFuY2hvcnNCTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgY3VyckFuY2hvckIgPSBhbmNob3JzQltrXTtcblx0XHRcdFx0XHR0aGlzLmdyb3VwQ29uc3RyYWludHMucHVzaCh7IGFuY2hvckE6IGN1cnJBbmNob3JBLCBhbmNob3JCOiBjdXJyQW5jaG9yQiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5hZGRHcm91cHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0Zm9yICh2YXIgaSA9IDAsIGdyb3Vwc0FycmF5TGVuZ3RoID0gdGhpcy5ncm91cHNBcnJheS5sZW5ndGg7IGkgPCBncm91cHNBcnJheUxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMuZ3JvdXBzQXJyYXlbaV07XG5cdFx0Y3Vyckdyb3VwLmFkZE5vZGVzVG9Xb3JsZCgpO1xuXHRcdGN1cnJHcm91cC5hZGRKb2ludHNUb1dvcmxkKCk7XG5cdFx0dGhpcy53b3JsZE5vZGVzID0gdGhpcy53b3JsZE5vZGVzLmNvbmNhdChjdXJyR3JvdXAubm9kZXMpO1xuXHR9XG5cblx0dmFyIHRvQ29uc3RyYWluTGVuZ3RoID0gdGhpcy5ncm91cENvbnN0cmFpbnRzLmxlbmd0aDtcblx0Zm9yIChpID0gMDsgaSA8IHRvQ29uc3RyYWluTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclRvQ29uc3RyYWluID0gdGhpcy5ncm91cENvbnN0cmFpbnRzW2ldO1xuXHRcdHRoaXMucGh5c2ljc01hbmFnZXIuY29uc3RyYWluR3JvdXBzKGN1cnJUb0NvbnN0cmFpbi5hbmNob3JBLCBjdXJyVG9Db25zdHJhaW4uYW5jaG9yQik7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseVdvcmxkO1xuXG4iLCJ2YXIgVHJpYW5ndWxhdG9yID0gcmVxdWlyZSgnLi9Ucmlhbmd1bGF0b3InKTtcbnZhciBQb2x5Z29uID0gcmVxdWlyZSgnLi9Qb2x5Z29uJyk7XG52YXIgR3JpZCA9IHJlcXVpcmUoJy4vR3JpZCcpO1xuXG52YXIgU3RydWN0dXJlID0gZnVuY3Rpb24gKCRncm91cCwgJHdvcmxkKVxue1xuXHR0aGlzLndvcmxkID0gJHdvcmxkO1xuXHR0aGlzLmdyb3VwID0gJGdyb3VwO1xuXHR0aGlzLmlubmVyU3RydWN0dXJlID0gdW5kZWZpbmVkO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoJHByb3BlcnRpZXMpXG57XG5cdHZhciBub2Rlc1RvRHJhdztcblx0dmFyIHBvaW50cyA9ICRwcm9wZXJ0aWVzLnBvaW50cztcblx0dGhpcy5ncm91cC5zdHJ1Y3R1cmVQcm9wZXJ0aWVzID0gJHByb3BlcnRpZXM7XG5cblx0aWYgKCRwcm9wZXJ0aWVzLnR5cGUgPT09ICdwb2x5Z29uJylcblx0e1xuXHRcdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KHBvaW50cyk7XG5cdFx0dGhpcy5ncm91cC5zdHJ1Y3R1cmVQcm9wZXJ0aWVzLmFyZWEgPSBwb2x5Z29uLmdldEFyZWEoKTtcblx0fVxuXHRlbHNlIGlmICgkcHJvcGVydGllcy50eXBlID09PSAnbGluZScpXG5cdHtcblx0XHR2YXIgYXJlYSA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDEsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyUG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcblx0XHRcdHZhciBsYXN0UG9pbnQgPSB0aGlzLnBvaW50c1tpIC0gMV07XG5cdFx0XHR2YXIgZFggPSBNYXRoLmFicyhjdXJyUG9pbnRbMF0gLSBsYXN0UG9pbnRbMF0pO1xuXHRcdFx0dmFyIGRZID0gTWF0aC5hYnMoY3VyclBvaW50WzFdIC0gbGFzdFBvaW50WzFdKTtcblx0XHRcdGFyZWEgKz0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcblx0XHR9XG5cdFx0dGhpcy5ncm91cC5zdHJ1Y3R1cmVQcm9wZXJ0aWVzLmFyZWEgPSBhcmVhO1xuXHR9XG5cdGVsc2UgaWYgKCRwcm9wZXJ0aWVzLnR5cGUgPT09ICdjaXJjbGUnKVxuXHR7XG5cdFx0dGhpcy5ncm91cC5zdHJ1Y3R1cmVQcm9wZXJ0aWVzLmFyZWEgPSBNYXRoLnBvdyhNYXRoLlBJICogJHByb3BlcnRpZXMucmFkaXVzLCAyKTtcblx0fVxuXG5cdHN3aXRjaCAodGhpcy5ncm91cC5jb25mLnN0cnVjdHVyZSlcblx0e1xuXHRcdGNhc2UgJ3RyaWFuZ3VsYXRlJzpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5ncm91cC5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMocG9pbnRzKTtcblx0XHRcdHRoaXMuY3JlYXRlSm9pbnRzRnJvbVRyaWFuZ2xlcyhwb2ludHMpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAnbGluZSc6XG5cdFx0XHRub2Rlc1RvRHJhdyA9IHRoaXMuZ3JvdXAuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHBvaW50cyk7XG5cdFx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50c0Zyb21Qb2ludHMocG9pbnRzLCB0cnVlKTtcblx0XHRcdC8vbm9kZXNUb0RyYXdbMF0uZml4ZWQgPSB0cnVlOy8vdG8gcmVtb3ZlIGxhdGVyIG1heWJlID9cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ3ByZWNpc2VIZXhhRmlsbCc6XG5cdFx0XHRub2Rlc1RvRHJhdyA9IHRoaXMuY3JlYXRlUHJlY2lzZUhleGFGaWxsU3RydWN0dXJlKHBvaW50cyk7XG5cdFx0XHQvLyBzdHJ1Y3R1cmVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uICgkZWxlbWVudCkgeyAkZWxlbWVudC5kcmF3aW5nID0geyBub3RUb0RyYXc6IHRydWUgfTsgfSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdoZXhhRmlsbCc6XG5cdFx0XHRub2Rlc1RvRHJhdyA9IHRoaXMuY3JlYXRlSGV4YUZpbGxTdHJ1Y3R1cmUocG9pbnRzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRub2Rlc1RvRHJhdyA9IHRoaXMuZ3JvdXAuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHBvaW50cyk7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHJldHVybiBub2Rlc1RvRHJhdztcbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlSGV4YUZpbGxTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJGNvb3Jkc0FycmF5KVxue1xuXHR0aGlzLmNyZWF0ZUlubmVyU3RydWN0dXJlKCRjb29yZHNBcnJheSk7XG5cdHZhciBwYXRoID0gdGhpcy5pbm5lclN0cnVjdHVyZS5nZXRTaGFwZVBhdGgoKTtcblx0dmFyIG5vZGVzVG9EcmF3ID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBwYXRoLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0bm9kZXNUb0RyYXcucHVzaCh0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KHBhdGhbaV1bMF0sIHBhdGhbaV1bMV0pKTtcblx0fVxuXHRyZXR1cm4gbm9kZXNUb0RyYXc7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZVByZWNpc2VIZXhhRmlsbFN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkY29vcmRzQXJyYXkpXG57XG5cdHZhciBub2Rlc1RvRHJhdyA9IHRoaXMuZ3JvdXAuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKCRjb29yZHNBcnJheSk7XG5cdHRoaXMuY3JlYXRlSW5uZXJTdHJ1Y3R1cmUoJGNvb3Jkc0FycmF5KTtcblxuXHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50c0Zyb21Qb2ludHMoJGNvb3Jkc0FycmF5LCBmYWxzZSk7XG5cdHZhciBpID0gMDtcblx0dmFyIGxlbmd0aCA9ICRjb29yZHNBcnJheS5sZW5ndGg7XG5cdGZvciAoaTsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRjb29yZHNBcnJheVtpXTtcblx0XHR2YXIgY2xvc2VzdCA9IHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0Q2xvc2VzdChjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSwgMik7XG5cdFx0Zm9yICh2YXIgayA9IDAsIGNsb3Nlc3RMZW5ndGggPSBjbG9zZXN0Lmxlbmd0aDsgayA8IGNsb3Nlc3RMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyckNsb3Nlc3QgPSBjbG9zZXN0W2tdO1xuXHRcdFx0dmFyIG4xID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSk7XG5cdFx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJDbG9zZXN0WzBdLCBjdXJyQ2xvc2VzdFsxXSk7XG5cdFx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50KG4xLCBuMik7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBub2Rlc1RvRHJhdztcbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlSm9pbnRzRnJvbVRyaWFuZ2xlcyA9IGZ1bmN0aW9uICgkY29vcmRzQXJyYXkpXG57XG5cdHZhciB0cmlhbmd1bGF0b3IgPSBuZXcgVHJpYW5ndWxhdG9yKCk7XG5cdHZhciB0cmlhbmdsZXMgPSB0cmlhbmd1bGF0b3IudHJpYW5ndWxhdGUoJGNvb3Jkc0FycmF5KTtcblxuXHR2YXIgdHJpYW5nbGVzTGVuZ3RoID0gdHJpYW5nbGVzLmxlbmd0aDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0cmlhbmdsZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyVHJpYW5nbGUgPSB0cmlhbmdsZXNbaV07XG5cdFx0dmFyIG4wID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyVHJpYW5nbGVbMF0ueCwgY3VyclRyaWFuZ2xlWzBdLnkpO1xuXHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclRyaWFuZ2xlWzFdLngsIGN1cnJUcmlhbmdsZVsxXS55KTtcblx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJUcmlhbmdsZVsyXS54LCBjdXJyVHJpYW5nbGVbMl0ueSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMCwgbjEpO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50KG4yLCBuMCk7XG5cdH1cbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlSW5uZXJTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJGNvb3Jkc0FycmF5KVxue1xuXHR2YXIgcG9seWdvbiA9IFBvbHlnb24uaW5pdCgkY29vcmRzQXJyYXkpO1xuXHR2YXIgZGlhbSA9IHRoaXMud29ybGQuZ2V0V2lkdGgoKSAqIHRoaXMuZ3JvdXAuY29uZi5pbm5lclN0cnVjdHVyZURlZjsvL3dpZHRoIC8gMTA7Ly90aGlzLndvcmxkLmdldFdpZHRoKCkgLyAzMDtcblx0dGhpcy5pbm5lclN0cnVjdHVyZSA9IEdyaWQuY3JlYXRlRnJvbVBvbHlnb24ocG9seWdvbiwgZGlhbSwgdHJ1ZSk7XG5cdHZhciBzdHJ1Y3R1cmVOb2RlcyA9IHRoaXMuZ3JvdXAuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0Tm9kZXNBcnJheSgpKTtcblxuXHR2YXIgbmV0d29yayA9IHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0TmV0d29yaygpO1xuXHR2YXIgaSA9IDA7XG5cdHZhciBsZW5ndGggPSBuZXR3b3JrLmxlbmd0aDtcblx0Zm9yIChpOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyckxpbmsgPSBuZXR3b3JrW2ldO1xuXHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyckxpbmtbMF1bMF0sIGN1cnJMaW5rWzBdWzFdKTtcblx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJMaW5rWzFdWzBdLCBjdXJyTGlua1sxXVsxXSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMSwgbjIpO1xuXHR9XG5cdHJldHVybiBzdHJ1Y3R1cmVOb2Rlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RydWN0dXJlO1xuXG4iLCJ2YXIgcG9seTJ0cmkgPSByZXF1aXJlKCcuLi8uLi9saWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmknKTtcblxudmFyIFRyaWFuZ3VsYXRvciA9IGZ1bmN0aW9uICgpXG57XG59O1xuXG5Ucmlhbmd1bGF0b3IucHJvdG90eXBlLnRyaWFuZ3VsYXRlID0gZnVuY3Rpb24gKCRjb29yZHMpXG57XG5cdHZhciBwb2x5MnRyaUNvbnRvdXIgPSBbXTtcblx0Ly9kZWJ1Z2dlcjtcblxuXHRmb3IgKHZhciBpID0gMCwgcG9pbnRzTGVuZ3RoID0gJGNvb3Jkcy5sZW5ndGg7IGkgPCBwb2ludHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBwb2ludCA9ICRjb29yZHNbaV07XG5cdFx0cG9seTJ0cmlDb250b3VyLnB1c2gobmV3IHBvbHkydHJpLlBvaW50KHBvaW50WzBdLCBwb2ludFsxXSkpO1xuXHR9XG5cblx0dmFyIHN3Y3R4O1xuXHR0cnlcblx0e1xuXHRcdC8vIHByZXBhcmUgU3dlZXBDb250ZXh0XG5cdFx0c3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KHBvbHkydHJpQ29udG91ciwgeyBjbG9uZUFycmF5czogdHJ1ZSB9KTtcblxuXHRcdC8vIHRyaWFuZ3VsYXRlXG5cdFx0c3djdHgudHJpYW5ndWxhdGUoKTtcblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXHRcdHRocm93IGU7XG5cdFx0Ly8gY29uc29sZS5sb2coZSk7XG5cdFx0Ly8gY29uc29sZS5sb2coZS5wb2ludHMpO1xuXHR9XG5cdHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcblxuXHR2YXIgcG9pbnRzQXJyYXkgPSBbXTtcblxuXHR2YXIgdHJpYW5nbGVzTGVuZ3RoID0gdHJpYW5nbGVzLmxlbmd0aDtcblx0Zm9yIChpID0gMDsgaSA8IHRyaWFuZ2xlc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUcmlhbmdsZSA9IHRyaWFuZ2xlc1tpXTtcblx0XHQvKmpzaGludCBjYW1lbGNhc2U6ZmFsc2UqL1xuXHRcdC8vanNjczpkaXNhYmxlIGRpc2FsbG93RGFuZ2xpbmdVbmRlcnNjb3Jlc1xuXHRcdHBvaW50c0FycmF5LnB1c2goY3VyclRyaWFuZ2xlLnBvaW50c18pO1xuXHRcdC8vanNjczplbmFibGUgZGlzYWxsb3dEYW5nbGluZ1VuZGVyc2NvcmVzXG5cdFx0Lypqc2hpbnQgY2FtZWxjYXNlOnRydWUqL1xuXHR9XG5cblx0cmV0dXJuIHBvaW50c0FycmF5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmd1bGF0b3I7XG5cbiIsIm1vZHVsZS5leHBvcnRzID1cbntcblx0Q29uZk9iamVjdDogcmVxdWlyZSgnLi9jb3JlL0NvbmZPYmplY3QnKSxcblx0R3JpZDogcmVxdWlyZSgnLi9jb3JlL0dyaWQnKSxcblx0UG9seWdvbjogcmVxdWlyZSgnLi9jb3JlL1BvbHlnb24nKSxcblx0U3RydWN0dXJlOiByZXF1aXJlKCcuL2NvcmUvU3RydWN0dXJlJyksXG5cdFNWR1BhcnNlcjogcmVxdWlyZSgnLi9jb3JlL1NWR1BhcnNlcicpLFxuXHRTVkplbGx5R3JvdXA6IHJlcXVpcmUoJy4vY29yZS9TVkplbGx5R3JvdXAnKSxcblx0U1ZKZWxseUpvaW50OiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseUpvaW50JyksXG5cdFNWSmVsbHlOb2RlOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseU5vZGUnKSxcblx0U1ZKZWxseVV0aWxzOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseVV0aWxzJyksXG5cdFNWSmVsbHlXb3JsZDogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlXb3JsZCcpLFxuXHRUcmlhbmd1bGF0b3I6IHJlcXVpcmUoJy4vY29yZS9Ucmlhbmd1bGF0b3InKVxufTtcblxuIl19
