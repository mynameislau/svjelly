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

},{}],"/Users/Lau/www/svjelly/src/core/Commands.js":[function(require,module,exports){
module.exports = {
	MOVE_TO: 1,
	LINE_TO: 2,
	BEZIER_TO: 3,
	QUADRA_TO: 4,
	ARC: 5,
	ELLIPSE: 6
};

},{}],"/Users/Lau/www/svjelly/src/core/ConfObject.js":[function(require,module,exports){
module.exports = {

	definition: 1,
	worldWidth: 150,
	multiCanvas: true,
	wind: 5,
	debug: false,
	gravity: [0, -9.8],
	groups:
	{
		default: { fixed: true, physics: { bodyType: 'ghost' } },
		ghost: { fixed: true, physics: { bodyType: 'ghost' } },
		metal:
		{
			physics:
			{
				mass: 10,
				bodyType: 'hard'
			}
		},
		stone:
		{
			physics:
			{
				mass: 5,
				bodyType: 'hard'
			}
		},
		wood:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard'
			}
		},
		balloon:
		{
			physics:
			{
				mass: 0.01,
				gravityScale: -15,
				bodyType: 'hard'
			}
		},
		tree:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
			physics:
			{
				joints:
				{
					default:
					{
						distanceConstraint: null,
						lockConstraint:
						{
							stiffness: 10000,
							relaxation: 0.9
						}
					}
				},
				mass: 5,
				damping: 0.8,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		flora:
		{
			structure: 'line',
			nodeRadius: 0.1,
			physics:
			{
				joints:
				{
					default:
					{
						distanceConstraint: null,
						lockConstraint:
						{
							stiffness: 1000,
							relaxation: 1
						}
					}
				},
				mass: 0.1,
				structuralMassDecay: 3,
				bodyType: 'soft'
			}
		},
		rubber:
		{
			structure: 'triangulate',
			nodeRadius: 0.1,
			physics:
			{
				joints: {
					default: {
						distanceConstraint:
						{
							stiffness: 100000,
							relaxation: 1
						}
					}
				},
				mass: 1,
				bodyType: 'soft'
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			nodeRadius: 0.1,
			physics:
			{
				joints:
				{
					default:
					{
						distanceConstraint:
						{
							stiffness: 10000,
							relaxation: 30
						}
					}
				},
				mass: 1,
				bodyType: 'soft'
			}
		},
		liquid:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.02,
			nodeRadius: 0.8,
			drawNodesSeparately: true,
			physics:
			{
				joints:
				{
				},
				mass: 0.1,
				material: 'liquid',
				bodyType: 'soft'
			}
		},
		rope:
		{
			structure: 'line',
			nodeRadius: 0.1,
			physics:
			{
				joints:
				{
					default:
					{
						distanceConstraint:
						{
							stiffness: 1000,
							relaxation: 1
						}
					}
				},
				mass: 1,
				bodyType: 'soft'
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
		noCollide:
		{
			physics:
			{
				mass: 1,
				bodyType: 'hard',
				noCollide: true
			}
		},
		leaves:
		{
			physics:
			{
				mass: 0.001,
				gravityScale: 0,
				bodyType: 'hard',
				noCollide: true
			}
		}
	},
	materials:
	{
		default:
		{
			bounciness: 1,
			friction: 0.5
		},
		rubber:
		{
			bounciness: 0,
			friction: 100
		},
		liquid:
		{
			bounciness: 1000,
			friction: 0
		}
	},
	constraints:
	{
		default:
		{
			lockConstraint:
			{
				stiffness: 10000000000000,
				relaxation: 0,
				collideConnected: false
			}
		},
		axis:
		{
			revoluteConstraint:
			{
				stiffness: Infinity,
				relaxation: 0,
				motor: false,
				collideConnected: false
			}
		},
		wire:
		{
			distanceConstraint:
			{
				stiffness: 1000,
				relaxation: 1
			}
		},
		spring:
		{
			distanceConstraint:
			{
				stiffness: 100000,
				relaxation: 0
			}
		},
		continuousMotor:
		{
			revoluteConstraint:
			{
				motor: true,
				continuousMotor: true,
				motorPower: 4
			}
		}
	}
};


},{}],"/Users/Lau/www/svjelly/src/core/DrawingCommand.js":[function(require,module,exports){
var DrawingCommand = function ($name, $node, $instructions)
{
	this.node = $node;
	this.name = $name;
	if ($instructions)
	{
		this.point = $instructions.point;
		this.options = $instructions.options;
	}
	this.properties = {};
};

DrawingCommand.prototype.getX = function ()
{
	return this.node.physicsManager.getX();
};

DrawingCommand.prototype.getY = function ()
{
	return this.node.physicsManager.getY();
};

module.exports = DrawingCommand;

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
					// if (currPoint)
					// {
					// 	console.log(currPoint, currentOutline.getNeighbours(currPoint[0], currPoint[1]));
					// }
					if (currPoint && currentOutline.getNeighbours(currPoint[0], currPoint[1]).length === 2)
					{
						return currPoint;
					}
				}
			}
		};

		var visited = [];
		var startingIndex = getStartingIndex.call(this);
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


},{}],"/Users/Lau/www/svjelly/src/core/NodeGraph.js":[function(require,module,exports){
var NodeGraph = function ()
{
	this.vertices = [];
	this.edges = [];
};

NodeGraph.prototype.getVertex = function ($node)
{
	for (var i = 0, length = this.vertices.length; i < length; i += 1)
	{
		var vertex = this.vertices[i];
		if (vertex.node === $node)
		{
			return vertex;
		}
	}
};

NodeGraph.prototype.createVertex = function ($node)
{
	var vertex = { node: $node };
	this.vertices.push(vertex);
	return vertex;
};

NodeGraph.prototype.getEdgeWeight = function ($edge)
{
	var dX = Math.abs($edge.vertexA.node.oX - $edge.vertexB.node.oX);
	var dY = Math.abs($edge.vertexA.node.oY - $edge.vertexB.node.oY);
	var dist = Math.sqrt(dX * dX + dY * dY);
	return dist;
};

NodeGraph.prototype.getVertexEdges = function ($vertex)
{
	var toReturn = [];
	for (var i = 0, length = this.edges.length; i < length; i += 1)
	{
		var edge = this.edges[i];
		if (edge.vertexA === $vertex || edge.vertexB === $vertex)
		{
			toReturn.push(edge);
		}
	}
	return toReturn;
};

NodeGraph.prototype.connect = function ($ANode, $BNode)
{
	var vertexA = this.getVertex($ANode) || this.createVertex($ANode);
	var vertexB = this.getVertex($BNode) || this.createVertex($BNode);

	var exists = false;
	for (var i = 0, length = this.edges.length; i < length; i += 1)
	{
		var edge = this.edges[i];
		if ((edge.vertexA === vertexA &&
			edge.vertexB === vertexB) ||
			(edge.vertexA === vertexB &&
			edge.vertexB === vertexA))
		{
			exists = true;
		}
	}
	if (!exists)
	{
		this.edges.push({ vertexA: vertexA, vertexB: vertexB });
	}
};

NodeGraph.prototype.traverse = function ($startingVertices)
{
	var i;
	var openList = [];
	var edgesLength;
	var vertexEdges;
	var startingVerticesLength = $startingVertices.length;
	for (i = 0; i < startingVerticesLength; i += 1)
	{
		$startingVertices[i].mapValue = 0;
		$startingVertices[i].opened = true;
		openList.push($startingVertices[i]);
	}

	while (openList.length)
	{
		var closedVertex = openList.shift();
		closedVertex.closed = true;

		vertexEdges = this.getVertexEdges(closedVertex);
		edgesLength = vertexEdges.length;
		for (i = 0; i < edgesLength; i += 1)
		{
			var currEdge = vertexEdges[i];
			var otherVertex = currEdge.vertexA === closedVertex ? currEdge.vertexB : currEdge.vertexA;
			if (otherVertex.closed) { continue; }
			
			if (!otherVertex.opened)
			{
				otherVertex.opened = true;
				openList.push(otherVertex);
			}
			var val = closedVertex.mapValue + this.getEdgeWeight(currEdge);
			otherVertex.mapValue = otherVertex.mapValue < val ? otherVertex.mapValue : val; //works even if undefined
		}
	}
};

module.exports = NodeGraph;

},{}],"/Users/Lau/www/svjelly/src/core/ObjectDrawing.js":[function(require,module,exports){
var DrawingCommand = require('./DrawingCommand');
var Commands = require('./Commands');

var ObjectDrawing = function ($group)
{
	this.group = $group;
	this.commands = [];
	this.commandsLength = 0;
	this.properties = {};
};

ObjectDrawing.prototype.addCommand = function ($node, $commandProperties, $envelope)
{
	var commandName;
	var properties = $commandProperties;
	if ($envelope === false && !this.group.conf.drawNodesSeparately)
	{
		return;
	}
	if (properties) { commandName = properties.name; }
	else
	{
		if (this.group.conf.drawNodesSeparately)
		{
			commandName = Commands.ARC;
			properties = {};
			properties.options = [];
			properties.options[0] = this.group.conf.nodeRadius;
		}
		else
		{
			commandName = this.commandsLength === 0 ? Commands.MOVE_TO : Commands.LINE_TO;
		}
	}
	// commandName = Commands.ARC;
	// $properties.options[0] = 5;
	// $properties.options[1] = 5;
	var command = new DrawingCommand(commandName, $node, properties);
	this.commands.push(command);
	this.commands[0].endCommand = command;
	this.commandsLength += 1;
};

ObjectDrawing.prototype.getBoundingBox = function ()
{
	return this.group.physicsManager.getBoundingBox();
};

ObjectDrawing.prototype.isStatic = function ()
{
	return this.group.conf.fixed === true;
};

ObjectDrawing.prototype.willNotIntersect = function ()
{
	if (this.group.conf.physics.bodyType === 'hard')
	{
		return true;
	}
	return false;
};

ObjectDrawing.prototype.isSimpleDrawing = function ()
{
	if (this.group.conf.physics.bodyType === 'hard' || this.group.conf.physics.bodyType === 'soft')
	{
		return true;
	}
	return false;
};

module.exports = ObjectDrawing;

},{"./Commands":"/Users/Lau/www/svjelly/src/core/Commands.js","./DrawingCommand":"/Users/Lau/www/svjelly/src/core/DrawingCommand.js"}],"/Users/Lau/www/svjelly/src/core/Polygon.js":[function(require,module,exports){
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

	getCenter: function ()
	{
		var bounding = this.getBoundingBox();
		var x = bounding[0][0] + (bounding[1][0] - bounding[0][0]) / 2;
		var y = bounding[0][1] + (bounding[1][1] - bounding[0][1]) / 2;
		return [x, y];
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
var Commands = require('./Commands');
var ARC = Commands.ARC;
var LINE_TO = Commands.LINE_TO;
var MOVE_TO = Commands.MOVE_TO;
var BEZIER_TO = Commands.BEZIER_TO;
var QUADRA_TO = Commands.QUADRA_TO;
var ELLIPSE = Commands.ELLIPSE;

var SVGParser = function () {};
//var isPolygon = /polygon|rect/ig;
// var isLine = /polyline|line|path/ig;
// var lineTags = 'polyline, line, path';

SVGParser.prototype.parse = function ($world, $SVG)
{
	this.SVG = $SVG;
	var viewBoxAttr = this.SVG.getAttribute('viewBox');
	this.viewBoxWidth = viewBoxAttr ? Number(viewBoxAttr.split(' ')[2]) : Number(this.SVG.getAttribute('width'));
	this.viewBoxHeight = viewBoxAttr ? Number(viewBoxAttr.split(' ')[3]) : Number(this.SVG.getAttribute('height'));
	this.ratio = $world.getWidth() / this.viewBoxWidth;
	this.world = $world;
	this.world.setHeight(this.viewBoxHeight * this.ratio);

	//temp
	this.elementsQuery = '*:not(defs):not(g):not(title):not(linearGradient):not(radialGradient):not(stop):not([id*="joint"]):not([id*="constraint"])';
	var elemRaws = this.SVG.querySelectorAll(this.elementsQuery);

	var i = 0;
	var rawGroupPairings = [];
	var elemsLength = elemRaws.length;

	for (i = 0; i < elemsLength; i += 1)
	{
		var rawElement = elemRaws[i];
		//if (rawElement.nodeType === 3) { continue; }
		var groupInfos = this.getGroupInfos(rawElement);
		var currGroup = $world.createGroup(groupInfos.type, groupInfos.ID);
		currGroup.rawSVGElement = rawElement;

		var drawingCommands = this.parseElement(rawElement);
		currGroup.structure.create(drawingCommands);
		this.setGraphicInstructions(currGroup, rawElement, drawingCommands);

		rawGroupPairings.push({ group: currGroup, raw: rawElement.parentNode });
	}

	this.parseConstraints();
	this.parseCustomJoints();

	this.world.addGroupsToWorld();
};

SVGParser.prototype.getGroupInfos = function ($rawGroup)
{
	var groupElement = (!$rawGroup.id || $rawGroup.id.indexOf('svg') === 0) && $rawGroup.parentNode.tagName !== 'svg' ? $rawGroup.parentNode : $rawGroup;
	var type;
	var ID;
	var regex = /([a-z\d]+)\w*/igm;
	var first = regex.exec(groupElement.id);
	var second = regex.exec(groupElement.id);

	type = first ? first[1] : undefined;
	ID = second ? second[1] : null;
	var title = groupElement.querySelector('title');
	if (ID === null) { ID = title ? title.nodeValue : ID; }

	return { ID: ID, type: type };
};

SVGParser.prototype.getPoints = function ($pointCommands)
{
	var points = [];
	for (var i = 0, length = $pointCommands.length; i < length; i += 1)
	{
		var currPointCommand = $pointCommands[i];
		points.push(currPointCommand.point);
	}
	return points;
};

SVGParser.prototype.getGroupFromRawSVGElement = function ($raw)
{
	for (var i = 0, length = this.world.groups.length; i < length; i += 1)
	{
		var currGroup = this.world.groups[i];
		if (currGroup.rawSVGElement === $raw) { return currGroup; }
	}
};

SVGParser.prototype.parseConstraints = function ()
{
	var rawConstraints = this.SVG.querySelectorAll('[id*="constraint"]');
	for (var i = 0, length = rawConstraints.length; i < length; i += 1)
	{
		var currRawConstraint = rawConstraints[i];
		var rawElements = currRawConstraint.parentNode.querySelectorAll(this.elementsQuery);
		var points = this.getPoints(this.parseElement(currRawConstraint).pointCommands);
		var result = /constraint-([a-z\d]*)-?([a-z\d]*)?/ig.exec(currRawConstraint.id);
		var parentGroupID = result ? result[1] : undefined;
		if (parentGroupID === 'world') { parentGroupID = undefined; }
		var constraintType = result && result[2] ? result[2] : 'default';
		var parentGroup = parentGroupID ? this.world.getGroupByID(parentGroupID) : undefined;

		for (var k = 0, rawElementsLength = rawElements.length; k < rawElementsLength; k += 1)
		{
			var currRawElement = rawElements[k];
			var group = this.getGroupFromRawSVGElement(currRawElement);
			//console.log(group);
			this.world.constrainGroups(group, parentGroup, points, constraintType);
		}
	}
};

SVGParser.prototype.parseCustomJoints = function ()
{
	var rawJoint = this.SVG.querySelectorAll('[id*="joint"]');
	for (var i = 0, length = rawJoint.length; i < length; i += 1)
	{
		var currRawJoint = rawJoint[i];
		var rawElements = currRawJoint.parentNode.querySelectorAll(this.elementsQuery);
		var points = this.getPoints(this.parseElement(currRawJoint).pointCommands);
		var result = /joint-([a-z\d]*)/ig.exec(currRawJoint.id);
		var type = result ? result[1] : undefined;

		for (var k = 0, rawElementsLength = rawElements.length; k < rawElementsLength; k += 1)
		{
			var currRawElement = rawElements[k];
			var group = this.getGroupFromRawSVGElement(currRawElement);
			var nodeA = group.getNodeAtPoint(points[0][0], points[0][1]);
			var nodeB = group.getNodeAtPoint(points[1][0], points[1][1]);
			group.createJoint(nodeA, nodeB, type, true);
			//console.log(group);
			//this.world.constrainGroups(group, parentGroup, points);
		}
	}
	// var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	// for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	// {
	// 	if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/joint/i) < 0) { continue; }

	// 	var currRawJoint = children[i];
	// 	var p1x = this.getCoord(currRawJoint.getAttribute('x1'));
	// 	var p1y = this.getCoord(currRawJoint.getAttribute('y1'));
	// 	var p2x = this.getCoord(currRawJoint.getAttribute('x2'));
	// 	var p2y = this.getCoord(currRawJoint.getAttribute('y2'));

	// 	var n1 = $group.getNodeAtPoint(p1x, p1y) || $group.createNode(p1x, p1y);
	// 	var n2 = $group.getNodeAtPoint(p2x, p2y) || $group.createNode(p2x, p2y);
	// 	$group.createJoint(n1, n2);
	// }
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
		case 'ellipse':
			return this.parseCircle($rawElement);
	}
};

SVGParser.prototype.setGraphicInstructions = function ($group, $raw, $drawingCommands)
{
	var drawing = $group.drawing;
	//drawing.commands = $nodesToDraw;
	var props = drawing.properties;
	//sorting nodesToDraw so the path is drawn correctly
	// var start;
	// for (var i = 0, length = $nodesToDraw.length; i < length; i += 1)
	// {
	// 	var currNode = $nodesToDraw[i];
	// 	if (currNode.drawing.command === MOVE_TO || i === length - 1)
	// 	{
	// 		if (start) { start.drawing.endNode = currNode; }
	// 		start = currNode;
	// 	}

	// 	$group.nodes.splice($group.nodes.indexOf(currNode), 1);
	// 	$group.nodes.splice(i, 0, currNode);
	// }

	var rawFill = $raw.getAttribute('fill');
	var rawStroke = $raw.getAttribute('stroke');
	var rawLinecap = $raw.getAttribute('stroke-linecap');
	var rawLinejoin = $raw.getAttribute('stroke-linejoin');
	var rawOpacity = $raw.getAttribute('opacity');

	props.fill = rawFill || '#000000';
	props.lineWidth = this.getThickness($raw);//rawStrokeWidth * this.ratio || 0;
	props.stroke = rawStroke && props.lineWidth !== 0 ? rawStroke : 'none';
	props.lineCap = rawLinecap && rawLinecap !== 'null' ? rawLinecap : 'butt';
	props.lineJoin = rawLinejoin && rawLinejoin !== 'null' ? rawLinejoin : 'miter';
	props.opacity = rawOpacity !== null ? Number(rawOpacity) : 1;

	props.closePath = $drawingCommands.closePath;

	props.radiusX = $drawingCommands.radiusX;
	props.radiusY = $drawingCommands.radiusY;

	props.strokeGradient = this.getGradient(props.stroke);
	props.dynamicGradient = $group.conf.structure === 'line' && props.strokeGradient;
	props.fillGradient = this.getGradient(props.fill);
};

SVGParser.prototype.getGradient = function ($value)
{
	var gradientID = /url\(#(.*)\)/im.exec($value);
	if (gradientID)
	{
		var gradientElement = this.SVG.querySelector('#' + gradientID[1]);
		var m = this.getMatrix(gradientElement.getAttribute('gradientTransform'));

		if (gradientElement.tagName !== 'linearGradient' && gradientElement.tagName !== 'radialGradient') { return; }

		var gradient = { stops: [], type: gradientElement.tagName };

		if (gradientElement.tagName === 'linearGradient')
		{
			gradient.x1 = this.getCoord(gradientElement.getAttribute('x1'));
			gradient.y1 = this.getCoord(gradientElement.getAttribute('y1'));
			gradient.x2 = this.getCoord(gradientElement.getAttribute('x2'));
			gradient.y2 = this.getCoord(gradientElement.getAttribute('y2'));

			if (m)
			{
				var p1 = this.multiplyPointByMatrix([gradient.x1, gradient.y1], m);
				var p2 = this.multiplyPointByMatrix([gradient.x2, gradient.y2], m);

				gradient.x1 = p1[0];
				gradient.y1 = p1[1];
				gradient.x2 = p2[0];
				gradient.y2 = p2[1];
			}
		}
		if (gradientElement.tagName === 'radialGradient')
		{
			gradient.cx = this.getCoord(gradientElement.getAttribute('cx'));
			gradient.cy = this.getCoord(gradientElement.getAttribute('cy'));
			gradient.fx = gradientElement.getAttribute('fx') ? this.getCoord(gradientElement.getAttribute('fx')) : gradient.cx;
			gradient.fy = gradientElement.getAttribute('fy') ? this.getCoord(gradientElement.getAttribute('fy')) : gradient.cy;
			gradient.r = this.getCoord(gradientElement.getAttribute('r'));

			if (m)
			{
				var c = this.multiplyPointByMatrix([gradient.cx, gradient.cy], m);
				var f = this.multiplyPointByMatrix([gradient.fx, gradient.fy], m);

				gradient.cx = c[0];
				gradient.cy = c[1];
				gradient.fx = f[0];
				gradient.fy = f[1];
			}
		}

		var stops = gradientElement.querySelectorAll('stop');
		for (var k = 0, stopLength = stops.length; k < stopLength; k += 1)
		{
			var currStop = stops[k];
			var offset = Number(currStop.getAttribute('offset'));
			var colorRegexResult = /stop-color:(.+?)(;|$)/g.exec(currStop.getAttribute('style'));
			var color = currStop.getAttribute('stop-color') || (colorRegexResult ? colorRegexResult[1] : undefined);
			var opacityRegexResult = /stop-opacity:([\d.-]+)/g.exec(currStop.getAttribute('style'));
			var opacity = currStop.getAttribute('stop-opacity') || (opacityRegexResult ? opacityRegexResult[1] : 1);
			if (color.indexOf('#') > -1)
			{
				var R = parseInt(color.substr(1, 2), 16);
				var G = parseInt(color.substr(3, 2), 16);
				var B = parseInt(color.substr(5, 2), 16);
				color = 'rgba(' + R + ',' + G + ',' + B + ',' + opacity + ')';
			}
			if (color.indexOf('rgb(') > -1) { color = 'rgba' + color.substring(4, -1) + ',' + opacity + ')'; }
			if (color.indexOf('hsl(') > -1) { color = 'hsla' + color.substring(4, -1) + ',' + opacity + ')'; }
			gradient.stops.push({ offset: offset, color: color, opacity: opacity });
		}

		return gradient;
	}
};

SVGParser.prototype.parseCircle = function ($rawCircle)
{
	var xPos = this.getCoord($rawCircle.getAttribute('cx') || 0);
	var yPos = this.getCoord($rawCircle.getAttribute('cy') || 0);
	var radiusAttrX = $rawCircle.getAttribute('r') || $rawCircle.getAttribute('rx');
	var radiusAttrY = $rawCircle.getAttribute('ry');
	var radiusX = this.getCoord(radiusAttrX);
	var radiusY = this.getCoord(radiusAttrY) || radiusX;
	var rotation = this.getRotation($rawCircle.getAttribute('transform'));
	var pointCommands = [{ name: radiusY !== radiusX ? ELLIPSE : ARC, point: [xPos, yPos], options: [radiusX, radiusY, rotation] }];
	return { type: 'ellipse', pointCommands: pointCommands, radiusX: radiusX, radiusY: radiusY, closePath: false, thickness: this.getThickness($rawCircle) };
};

SVGParser.prototype.parseLine = function ($rawLine)
{
	var x1 = this.getCoord($rawLine.getAttribute('x1'));
	var x2 = this.getCoord($rawLine.getAttribute('x2'));
	var y1 = this.getCoord($rawLine.getAttribute('y1'));
	var y2 = this.getCoord($rawLine.getAttribute('y2'));
	var pointCommands = [];
	pointCommands.push({ name: MOVE_TO, point: [x1, y1], options: [] });
	pointCommands.push({ name: LINE_TO, point: [x2, y2], options: [] });
	return { type: 'line', pointCommands: pointCommands, closePath: false, thickness: this.getThickness($rawLine) };
};

SVGParser.prototype.parseRect = function ($rawRect)
{
	var x1 = $rawRect.getAttribute('x') ? this.getCoord($rawRect.getAttribute('x')) : 0;
	var y1 = $rawRect.getAttribute('y') ? this.getCoord($rawRect.getAttribute('y')) : 0;
	var x2 = x1 + this.getCoord($rawRect.getAttribute('width'));
	var y2 = y1 + this.getCoord($rawRect.getAttribute('height'));

	var points =
	[
		[x1, y1],
		[x1, y2],
		[x2, y2],
		[x2, y1]
	];

	var m = this.getMatrix($rawRect.getAttribute('transform'));
	if (m)
	{
		points =
		[
			this.multiplyPointByMatrix(points[0], m),
			this.multiplyPointByMatrix(points[1], m),
			this.multiplyPointByMatrix(points[2], m),
			this.multiplyPointByMatrix(points[3], m)
		];
	}

	var pointCommands = [];
	pointCommands.push({ name: MOVE_TO, point: points[0], options: [] });
	pointCommands.push({ name: LINE_TO, point: points[1], options: [] });
	pointCommands.push({ name: LINE_TO, point: points[2], options: [] });
	pointCommands.push({ name: LINE_TO, point: points[3], options: [] });

	return { type: 'polygon', pointCommands: pointCommands, closePath: true, thickness: this.getThickness($rawRect) };
};

SVGParser.prototype.parsePoly = function ($rawPoly)
{
	var regex = /([\-.\d]+)[, ]([\-.\d]+)/ig;
	var result = regex.exec($rawPoly.getAttribute('points'));
	var pointCommands = [];

	while (result)
	{
		var name = pointCommands.length === 0 ? MOVE_TO : LINE_TO;
		var point = [this.getCoord(result[1]), this.getCoord(result[2])];
		pointCommands.push({ name: name, point: point, options: [] });
		result = regex.exec($rawPoly.getAttribute('points'));
	}
	return { type: $rawPoly.tagName, pointCommands: pointCommands, closePath: $rawPoly.tagName !== 'polyline', thickness: this.getThickness($rawPoly) };
};

SVGParser.prototype.parsePath = function ($rawPath)
{
	var d = $rawPath.getAttribute('d');
	var pathReg = /([a-y])([.\-,\d]+)/igm;
	var result;
	var closePath = /z/igm.test(d);
	var coordsRegex = /-?[\d.]+/igm;
	var pointCommands = [];
	var lastX = this.getCoord(0);
	var lastY = this.getCoord(0);

	var that = this;
	var getPoint = function ($x, $y, $relative)
	{
		var x = $x === undefined ? lastX : that.getCoord($x);
		var y = $y === undefined ? lastY : that.getCoord($y);
		if ($relative)
		{
			x = $x === undefined ? x : lastX + x;
			y = $y === undefined ? y : lastY + y;
		}
		return [x, y];
	};

	var getRelativePoint = function ($point, $x, $y, $relative)
	{
		var x = that.getCoord($x);
		var y = that.getCoord($y);
		if ($relative)
		{
			x = lastX + x;
			y = lastY + y;
		}
		x = x - $point[0];
		y = y - $point[1];
		return [x, y];
	};

	var createPoint = function ($commandName, $point, $options)
	{
		var info = { name: $commandName, point: $point, options: $options || [] };
		lastX = info.point[0];
		lastY = info.point[1];
		pointCommands.push(info);
	};

	var point;
	var cubic1;
	var cubic2;
	var quadra1;

	result = pathReg.exec(d);

	while (result)
	{
		var instruction = result[1].toLowerCase();
		var coords = result[2].match(coordsRegex);
		var isLowserCase = /[a-z]/.test(result[1]);

		switch (instruction)
		{
			default:
			case 'm':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(MOVE_TO, point);
				break;
			case 'l':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'v':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(undefined, coords[0], isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'h':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], undefined, isLowserCase);
				createPoint(LINE_TO, point);
				break;
			case 'c':
				quadra1 = null;
				point = getPoint(coords[4], coords[5], isLowserCase);
				cubic1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic2 = getRelativePoint(point, coords[2], coords[3], isLowserCase);
				createPoint(BEZIER_TO, point, [cubic1, cubic2]);
				break;
			case 's':
				quadra1 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				cubic1 = cubic2 ? [lastX - cubic2[0] - point[0], lastY - cubic2[1] - point[1]] : undefined;
				cubic2 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic1 = cubic1 || [cubic2[0], cubic2[1]];
				createPoint(BEZIER_TO, point, [cubic1, cubic2]);
				break;
			case 'q':
				cubic2 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				quadra1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				createPoint(QUADRA_TO, point, [quadra1]);
				break;
			case 't':
				cubic2 = null;
				quadra1 = quadra1 ? quadra1 : point;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint(QUADRA_TO, point, [quadra1]);
				break;
			case 'a':
				cubic2 = null;
				quadra1 = null;
				point = getPoint(coords[5], coords[6], isLowserCase);
				createPoint('arcTo', point);
				console.warn('not supported');
				break;
		}

		result = pathReg.exec(d);
	}

	return { type: 'path', pointCommands: pointCommands, closePath: closePath, thickness: this.getThickness($rawPath) };
};

SVGParser.prototype.round = function ($number)
{
	// var number = Number($number);
	// return Math.floor(number * 100) / 100;
	return $number;
	//return Math.floor(Number($number));
};

SVGParser.prototype.getThickness = function ($raw)
{
	var rawThickness = $raw.getAttribute('stroke-width') || 1;
	return this.getCoord(rawThickness);
};

SVGParser.prototype.getMatrix = function ($attribute)
{
	if (!$attribute) { return null; }

	var TFType = $attribute.match(/([a-z]+)/igm)[0];
	var values = $attribute.match(/(-?[\d.]+)/igm);

	var matrices = [];
	var tX;
	var tY;
	var angle;

	if (TFType === 'matrix')
	{
		return [Number(values[0]), Number(values[2]), this.getCoord(values[4]), Number(values[1]), Number(values[3]), this.getCoord(values[5]), 0, 0, 1];
	}
	else if (TFType === 'rotate')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		tX = this.getCoord(Number(values[1] || 0));
		tY = this.getCoord(Number(values[2] || 0));
		var m1 = [1, 0, tX, 0, 1, tY, 0, 0, 1];
		var m2 = [Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1];
		var m3 = [1, 0, -tX, 0, 1, -tY, 0, 0, 1];

		matrices.push(m1, m2, m3);
		var p = m1;

		for (var i = 1, matricesLength = matrices.length; i < matricesLength; i += 1)
		{
			var currMat = matrices[i];
			var newP = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (var k = 0; k < 9; k += 1)
			{
				var row = Math.floor(k / 3);
				var col = k % 3;
				//var mVal = p[row * col - 1];
				for (var pos = 0; pos < 3; pos += 1)
				{
					newP[k] = newP[k] + p[row * 3 + pos] * currMat[pos * 3 + col];
				}
			}
			p = newP;
		}
		return p;
	}
	else if (TFType === 'translate')
	{
		tX = this.getCoord(Number(values[0] || 0));
		tY = this.getCoord(Number(values[1] || 0));
		return [1, 0, tX, 0, 1, tY, 0, 0, 1];
	}
	else if (TFType === 'scale')
	{
		var sX = this.getCoord(Number(values[0] || 0));
		var sY = this.getCoord(Number(values[1] || 0));
		return [sX, 0, 0, 0, sY, 0];
	}
	else if (TFType === 'skewX')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		return [1, Math.tan(angle), 0, 0, 1, 0, 0, 0, 1];
	}
	else if (TFType === 'skewY')
	{
		angle = Number(values[0]) * (Math.PI / 180);
		return [1, 0, 0, Math.tan(angle), 1, 0, 0, 0, 1];
	}
};

SVGParser.prototype.multiplyPointByMatrix = function ($point, m)
{
	var h = [$point[0], $point[1], 1];
	var p =
	[
		m[0] * h[0] + m[1] * h[1] + m[2] * h[2],
		m[3] * h[0] + m[4] * h[1] + m[5] * h[2],
		m[6] * h[0] + m[7] * h[1] + m[8] * h[2]
	];
	return [p[0] / p[2], p[1] / p[2]];
};

SVGParser.prototype.getRotation = function ($attribute)
{
	var matrix = this.getMatrix($attribute);
	if (matrix)
	{
		return Math.atan2(matrix[0], matrix[3]);
	}
	return 0;
};

SVGParser.prototype.getCoord = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

module.exports = SVGParser;


},{"./Commands":"/Users/Lau/www/svjelly/src/core/Commands.js"}],"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js":[function(require,module,exports){
var SVJellyNode = require('./SVJellyNode');
var SVJellyJoint = require('./SVJellyJoint');
var ObjectDrawing = require('./ObjectDrawing');

var SVJellyGroup = function ($type, $conf, $ID)
{
	this.physicsManager = undefined;
	this.drawing = new ObjectDrawing(this);
	this.structure = undefined;
	this.nodesLength = undefined;
	this.conf = $conf;
	this.fixed = this.conf.fixed;
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

	node.physicsManager = this.physicsManager.getNodePhysicsManager(node);
	//this.physicsManager.addNodeToWorld(node);

	this.nodesLength = this.nodes.length;

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

SVJellyGroup.prototype.createJoint = function ($nodeA, $nodeB, $type)
{
	for (var i = 0; i < this.joints.length; i += 1)
	{
		var currJoint = this.joints[i];
		if ((currJoint.nodeA === $nodeA && currJoint.nodeB === $nodeB) || (currJoint.nodeB === $nodeA && currJoint.nodeA === $nodeB))
		{
			//return;
			this.joints.splice(i, 1);
			i = i - 1;
		}
	}
	var joint = new SVJellyJoint($nodeA, $nodeB, $type);
	this.joints.push(joint);

	//this.physicsManager.addJointToWorld(joint);
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


},{"./ObjectDrawing":"/Users/Lau/www/svjelly/src/core/ObjectDrawing.js","./Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js"}],"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js":[function(require,module,exports){
var SVJellyJoint = function ($nodeA, $nodeB, $type)
{
	this.nodeA = $nodeA;
	this.nodeB = $nodeB;
	this.type = $type || 'default';
};

module.exports = SVJellyJoint;


},{}],"/Users/Lau/www/svjelly/src/core/SVJellyNode.js":[function(require,module,exports){
var SVJellyNode = function ($oX, $oY, $options)
{
	this.jointsArray = [];
	this.oX = $oX;
	this.oY = $oY;
	this.fixed = false;
	this.drawing = undefined;
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
	this.groups = [];
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
	for (var i = 0, length = this.groups.length; i < length; i += 1)
	{
		var currGroup = this.groups[i];
		if (currGroup.ID === $ID) { return currGroup; }
	}
};

SVJellyWorld.prototype.createGroup = function ($type, $ID)
{
	var conf = this.conf.groups[$type] || this.conf.groups.default;
	var group = new SVJellyGroup($type, conf, $ID);
	group.physicsManager = this.physicsManager.getGroupPhysicsManager(group);
	group.structure = new Structure(group, this);
	this.groups.push(group);
	return group;
};

//maybe split this into two different features, stuff for making bodies fixed, and constraints
SVJellyWorld.prototype.constrainGroups = function ($groupA, $groupB, $points, $type)
{
	var points = $points;
	var groupA = $groupA;
	var groupB = $groupB;

	if (points.length < 3)
	{
		var anchorA = groupA.physicsManager.createAnchorFromLine(points);
		points.splice(points.indexOf(anchorA.point), 1);
		var anchorB = groupB ? groupB.physicsManager.createAnchorFromPoint(points[0]) : this.physicsManager.createGhostAnchorFromPoint(points[0]);
		this.groupConstraints.push({ anchorA: anchorA, anchorB: anchorB, type: $type });
	}
	else
	{
		var anchorsA = groupA.physicsManager.createAnchors(points);
		var anchorsB = groupB ? groupB.physicsManager.createAnchors(points) : [];
		//console.log('A', groupA.ID, anchorsA.length, 'B', groupB ? groupB.ID : groupB);
		for (var i = 0, nodesLength = anchorsA.length; i < nodesLength; i += 1)
		{
			var currAnchorA = anchorsA[i];
			if (!groupB)
			{
				if ($type === 'default')
				{
					currAnchorA.setFixed(true);
				}
				else
				{
					var ghostAnchor = this.physicsManager.createGhostAnchorFromPoints(points);
					this.groupConstraints.push({ anchorA: currAnchorA, anchorB: ghostAnchor, type: $type });
				}
			}
			else
			{
				for (var k = 0, anchorsBLength = anchorsB.length; k < anchorsBLength; k += 1)
				{
					var currAnchorB = anchorsB[k];
					this.groupConstraints.push({ anchorA: currAnchorA, anchorB: currAnchorB, type: $type });
				}
			}
		}
	}
};

SVJellyWorld.prototype.addGroupsToWorld = function ()
{
	for (var i = 0, groupsLength = this.groups.length; i < groupsLength; i += 1)
	{
		var currGroup = this.groups[i];
		currGroup.addNodesToWorld();
		currGroup.addJointsToWorld();
		this.worldNodes = this.worldNodes.concat(currGroup.nodes);
	}

	var toConstrainLength = this.groupConstraints.length;
	for (i = 0; i < toConstrainLength; i += 1)
	{
		var currToConstrain = this.groupConstraints[i];
		this.physicsManager.constrainGroups(currToConstrain.anchorA, currToConstrain.anchorB, currToConstrain.type);
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

Structure.prototype.create = function ($drawingCommands)
{
	this.points = this.getPoints($drawingCommands);
	this.drawingCommands = $drawingCommands;

	this.envelope = undefined;
	this.fillNodes = undefined;

	// console.log('points', points.length, this.group.conf.structure);

	this.area = this.calculateArea(this.points, $drawingCommands);
	this.radiusX = $drawingCommands.radiusX;
	this.radiusY = $drawingCommands.radiusY;

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			this.removeDuplicates(this.drawingCommands);
			var triPoints = this.getPoints(this.drawingCommands);
			this.envelope = this.createNodesFromPoints(triPoints);
			this.setNodeDrawingCommands(this.envelope);
			this.createJointsFromTriangles(triPoints);
			break;
		case 'line':
			this.envelope = this.createNodesFromPoints(this.points);
			this.setNodeDrawingCommands(this.envelope);
			this.createJointsFromPoints(this.points, true);
			//envelope[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			this.envelope = this.createPreciseHexaFillStructure(this.points);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			this.envelope = this.createHexaFillStructure(this.points);
			break;
		case 'simple':
			this.envelope = this.createNodesFromPoints(this.points);
			this.createJointsFromPoints(this.points);
			this.setNodeDrawingCommands(this.envelope);
			break;
		default:
			this.envelope = this.createNodesFromPoints(this.points, true);
			this.setNodeDrawingCommands(this.envelope);
			break;
	}
};

Structure.prototype.calculateArea = function ($points, $drawingCommands)
{
	if ($drawingCommands.type === 'ellipse')
	{
		return Math.pow(Math.PI * $drawingCommands.radiusX, 2);
	}
	if (this.group.conf.structure !== 'line')
	{
		var polygon = Polygon.init($points);
		return polygon.getArea();
	}
	else
	{
		var area = 0;
		for (var i = 1, length = $points.length; i < length; i += 1)
		{
			var currPoint = $points[i];
			var lastPoint = $points[i - 1];
			var dX = Math.abs(currPoint[0] - lastPoint[0]);
			var dY = Math.abs(currPoint[1] - lastPoint[1]);
			area += Math.sqrt(dX * dX + dY * dY);
			area = area * 0.5 + area * $drawingCommands.thickness * 0.5;
		}
		return area;
	}
};

Structure.prototype.createHexaFillStructure = function ($points)
{
	this.fillNodes = this.createInnerStructure($points);
	var path = this.innerStructure.getShapePath();
	var envelope = [];
	for (var i = 0, length = path.length; i < length; i += 1)
	{
		var node = this.group.getNodeAtPoint(path[i][0], path[i][1]);
		envelope.push(node);
		this.group.drawing.addCommand(node, undefined, true);
	}
	return envelope;
};

Structure.prototype.setNodeDrawingCommands = function ($nodes)
{
	for (var i = 0, length = $nodes.length; i < length; i += 1)
	{
		var node = $nodes[i];
		var commandObject = this.drawingCommands.pointCommands[i];
		this.group.drawing.addCommand(node, commandObject, true);
	}
};

Structure.prototype.createPreciseHexaFillStructure = function ($points)
{
	var envelope = this.createNodesFromPoints($points);
	this.setNodeDrawingCommands(envelope);
	this.fillNodes = this.createInnerStructure($points);

	this.createJointsFromPoints($points, false);
	var i = 0;
	var length = $points.length;
	for (i; i < length; i += 1)
	{
		var currPoint = $points[i];
		var closest = this.innerStructure.getClosest(currPoint[0], currPoint[1], 2);
		for (var k = 0, closestLength = closest.length; k < closestLength; k += 1)
		{
			var currClosest = closest[k];
			var n1 = this.group.getNodeAtPoint(currPoint[0], currPoint[1]);
			var n2 = this.group.getNodeAtPoint(currClosest[0], currClosest[1]);
			this.group.createJoint(n1, n2);
		}
	}
	return envelope;
};

Structure.prototype.createJointsFromTriangles = function ($points)
{
	var triangulator = new Triangulator();
	var triangles = triangulator.triangulate($points);

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

Structure.prototype.getPoints = function ($drawingCommands)
{
	var points = [];
	for (var i = 0, length = $drawingCommands.pointCommands.length; i < length; i += 1)
	{
		var curr = $drawingCommands.pointCommands[i];
		points.push(curr.point);
	}
	return points;
};

Structure.prototype.createNodesFromPoints = function ($points, $overwrite)
{
	var pointsLength = $points.length;
	var toReturn = [];
	for (var i = 0; i < pointsLength; i += 1)
	{
		var currPoint = $points[i];
		var node = this.group.createNode(currPoint[0], currPoint[1], undefined, $overwrite);
		toReturn.push(node);
	}
	return toReturn;
};

Structure.prototype.removeDuplicates = function ($drawingCommands)
{
	var visitedPoints = [];
	var commands = $drawingCommands.pointCommands;
	for (var i = 0; i < commands.length; i += 1)
	{
		var point = commands[i].point;
		for (var k = 0; k < visitedPoints.length; k += 1)
		{
			var visited = visitedPoints[k];
			if (visited[0] === point[0] && visited[1] === point[1])
			{
				console.log(i, 'duplicate found !', visited[0], visited[1], point[0], point[1]);
				commands.splice(i, 1);
				i = i - 1;
			}
		}
		visitedPoints.push(point);
	}
};

Structure.prototype.createInnerStructure = function ($points)
{
	var polygon = Polygon.init($points);
	var diam = this.world.getWidth() * this.group.conf.innerStructureDef;//width / 10;//this.world.getWidth() / 30;
	this.innerRadius = this.group.conf.nodeRadius || diam / 2;
	this.innerStructure = Grid.createFromPolygon(polygon, diam, true);
	this.structureNodes = this.createNodesFromPoints(this.innerStructure.getNodesArray());

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
	length = this.structureNodes.length;
	for (i = 0; i < length; i += 1)
	{
		var node = this.structureNodes[i];
		this.group.drawing.addCommand(node, undefined, false);
	}

	return this.structureNodes;
};

Structure.prototype.createJointsFromPoints = function ($points, $noClose)
{
	var pointsLength = $points.length;
	for (var i = 1; i < pointsLength; i += 1)
	{
		var currPoint = $points[i];
		var lastPoint = $points[i - 1];
		var lastNode = this.group.getNodeAtPoint(lastPoint[0], lastPoint[1]);
		var currNode = this.group.getNodeAtPoint(currPoint[0], currPoint[1]);
		this.group.createJoint(lastNode, currNode);
		if (i === pointsLength - 1 && $noClose !== true)
		{
			var firstNode = this.group.getNodeAtPoint($points[0][0], $points[0][1]);
			this.group.createJoint(currNode, firstNode);
		}
	}
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
	Triangulator: require('./core/Triangulator'),
	NodeGraph: require('./core/NodeGraph'),
};


},{"./core/ConfObject":"/Users/Lau/www/svjelly/src/core/ConfObject.js","./core/Grid":"/Users/Lau/www/svjelly/src/core/Grid.js","./core/NodeGraph":"/Users/Lau/www/svjelly/src/core/NodeGraph.js","./core/Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./core/SVGParser":"/Users/Lau/www/svjelly/src/core/SVGParser.js","./core/SVJellyGroup":"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js","./core/SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./core/SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js","./core/SVJellyUtils":"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js","./core/SVJellyWorld":"/Users/Lau/www/svjelly/src/core/SVJellyWorld.js","./core/Structure":"/Users/Lau/www/svjelly/src/core/Structure.js","./core/Triangulator":"/Users/Lau/www/svjelly/src/core/Triangulator.js"}]},{},["/Users/Lau/www/svjelly/src/svjelly.js"])("/Users/Lau/www/svjelly/src/svjelly.js")
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmkuanMiLCJzcmMvY29yZS9Db21tYW5kcy5qcyIsInNyYy9jb3JlL0NvbmZPYmplY3QuanMiLCJzcmMvY29yZS9EcmF3aW5nQ29tbWFuZC5qcyIsInNyYy9jb3JlL0dyaWQuanMiLCJzcmMvY29yZS9Ob2RlR3JhcGguanMiLCJzcmMvY29yZS9PYmplY3REcmF3aW5nLmpzIiwic3JjL2NvcmUvUG9seWdvbi5qcyIsInNyYy9jb3JlL1NWR1BhcnNlci5qcyIsInNyYy9jb3JlL1NWSmVsbHlHcm91cC5qcyIsInNyYy9jb3JlL1NWSmVsbHlKb2ludC5qcyIsInNyYy9jb3JlL1NWSmVsbHlOb2RlLmpzIiwic3JjL2NvcmUvU1ZKZWxseVV0aWxzLmpzIiwic3JjL2NvcmUvU1ZKZWxseVdvcmxkLmpzIiwic3JjL2NvcmUvU3RydWN0dXJlLmpzIiwic3JjL2NvcmUvVHJpYW5ndWxhdG9yLmpzIiwic3JjL3N2amVsbHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2p4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKGUpO2Vsc2V7dmFyIGY7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz9mPXdpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2Y9Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmJiYoZj1zZWxmKSxmLnBvbHkydHJpPWUoKX19KGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xubW9kdWxlLmV4cG9ydHM9e1widmVyc2lvblwiOiBcIjEuMy41XCJ9XG59LHt9XSwyOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbWF4Y29tcGxleGl0eToxMSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Ob2RlXG5cbi8qKlxuICogQWR2YW5jaW5nIGZyb250IG5vZGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7IVhZfSBwIC0gUG9pbnRcbiAqIEBwYXJhbSB7VHJpYW5nbGU9fSB0IHRyaWFuZ2xlIChvcHRpb25hbClcbiAqL1xudmFyIE5vZGUgPSBmdW5jdGlvbihwLCB0KSB7XG4gICAgLyoqIEB0eXBlIHtYWX0gKi9cbiAgICB0aGlzLnBvaW50ID0gcDtcblxuICAgIC8qKiBAdHlwZSB7VHJpYW5nbGV8bnVsbH0gKi9cbiAgICB0aGlzLnRyaWFuZ2xlID0gdCB8fCBudWxsO1xuXG4gICAgLyoqIEB0eXBlIHtOb2RlfG51bGx9ICovXG4gICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAvKiogQHR5cGUge05vZGV8bnVsbH0gKi9cbiAgICB0aGlzLnByZXYgPSBudWxsO1xuXG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgdGhpcy52YWx1ZSA9IHAueDtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUFkdmFuY2luZ0Zyb250XG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHByaXZhdGVcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7Tm9kZX0gaGVhZFxuICogQHBhcmFtIHtOb2RlfSB0YWlsXG4gKi9cbnZhciBBZHZhbmNpbmdGcm9udCA9IGZ1bmN0aW9uKGhlYWQsIHRhaWwpIHtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy5oZWFkXyA9IGhlYWQ7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMudGFpbF8gPSB0YWlsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IGhlYWQ7XG59O1xuXG4vKiogQHJldHVybiB7Tm9kZX0gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5oZWFkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVhZF87XG59O1xuXG4vKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuc2V0SGVhZCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0aGlzLmhlYWRfID0gbm9kZTtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnRhaWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50YWlsXztcbn07XG5cbi8qKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZXRUYWlsID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMudGFpbF8gPSBub2RlO1xufTtcblxuLyoqIEByZXR1cm4ge05vZGV9ICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuc2VhcmNoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoX25vZGVfO1xufTtcblxuLyoqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnNldFNlYXJjaCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGU7XG59O1xuXG4vKiogQHJldHVybiB7Tm9kZX0gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5maW5kU2VhcmNoTm9kZSA9IGZ1bmN0aW9uKC8qeCovKSB7XG4gICAgLy8gVE9ETzogaW1wbGVtZW50IEJTVCBpbmRleFxuICAgIHJldHVybiB0aGlzLnNlYXJjaF9ub2RlXztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJ9IHggdmFsdWVcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5sb2NhdGVOb2RlID0gZnVuY3Rpb24oeCkge1xuICAgIHZhciBub2RlID0gdGhpcy5zZWFyY2hfbm9kZV87XG5cbiAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgaWYgKHggPCBub2RlLnZhbHVlKSB7XG4gICAgICAgIHdoaWxlIChub2RlID0gbm9kZS5wcmV2KSB7XG4gICAgICAgICAgICBpZiAoeCA+PSBub2RlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBub2RlO1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBub2RlLm5leHQpIHtcbiAgICAgICAgICAgIGlmICh4IDwgbm9kZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoX25vZGVfID0gbm9kZS5wcmV2O1xuICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnByZXY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7IVhZfSBwb2ludCAtIFBvaW50XG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUubG9jYXRlUG9pbnQgPSBmdW5jdGlvbihwb2ludCkge1xuICAgIHZhciBweCA9IHBvaW50Lng7XG4gICAgdmFyIG5vZGUgPSB0aGlzLmZpbmRTZWFyY2hOb2RlKHB4KTtcbiAgICB2YXIgbnggPSBub2RlLnBvaW50Lng7XG5cbiAgICBpZiAocHggPT09IG54KSB7XG4gICAgICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgICAgIGlmIChwb2ludCAhPT0gbm9kZS5wb2ludCkge1xuICAgICAgICAgICAgLy8gV2UgbWlnaHQgaGF2ZSB0d28gbm9kZXMgd2l0aCBzYW1lIHggdmFsdWUgZm9yIGEgc2hvcnQgdGltZVxuICAgICAgICAgICAgaWYgKHBvaW50ID09PSBub2RlLnByZXYucG9pbnQpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwb2ludCA9PT0gbm9kZS5uZXh0LnBvaW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIEFkdmFuY2luZ0Zyb250LmxvY2F0ZVBvaW50KCkgY2FsbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChweCA8IG54KSB7XG4gICAgICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICAgICAgd2hpbGUgKG5vZGUgPSBub2RlLnByZXYpIHtcbiAgICAgICAgICAgIGlmIChwb2ludCA9PT0gbm9kZS5wb2ludCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBub2RlLm5leHQpIHtcbiAgICAgICAgICAgIGlmIChwb2ludCA9PT0gbm9kZS5wb2ludCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUpIHtcbiAgICAgICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBub2RlO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHNcblxubW9kdWxlLmV4cG9ydHMgPSBBZHZhbmNpbmdGcm9udDtcbm1vZHVsZS5leHBvcnRzLk5vZGUgPSBOb2RlO1xuXG5cbn0se31dLDM6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKlxuICogRnVuY3Rpb24gYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcbiAqL1xuXG4vKipcbiAqIGFzc2VydCBhbmQgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmRpdGlvbiAgIHRoZSBjb25kaXRpb24gd2hpY2ggaXMgYXNzZXJ0ZWRcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlICAgICAgdGhlIG1lc3NhZ2Ugd2hpY2ggaXMgZGlzcGxheSBpcyBjb25kaXRpb24gaXMgZmFsc3lcbiAqL1xuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8IFwiQXNzZXJ0IEZhaWxlZFwiKTtcbiAgICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGFzc2VydDtcblxuXG5cbn0se31dLDQ6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cbnZhciB4eSA9IF9kZXJlcV8oJy4veHknKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tUG9pbnRcbi8qKlxuICogQ29uc3RydWN0IGEgcG9pbnRcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBwb2ludCA9IG5ldyBwb2x5MnRyaS5Qb2ludCgxNTAsIDE1MCk7XG4gKiBAcHVibGljXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7bnVtYmVyPX0geCAgICBjb29yZGluYXRlICgwIGlmIHVuZGVmaW5lZClcbiAqIEBwYXJhbSB7bnVtYmVyPX0geSAgICBjb29yZGluYXRlICgwIGlmIHVuZGVmaW5lZClcbiAqL1xudmFyIFBvaW50ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGV4cG9zZVxuICAgICAqL1xuICAgIHRoaXMueCA9ICt4IHx8IDA7XG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZXhwb3NlXG4gICAgICovXG4gICAgdGhpcy55ID0gK3kgfHwgMDtcblxuICAgIC8vIEFsbCBleHRyYSBmaWVsZHMgYWRkZWQgdG8gUG9pbnQgYXJlIHByZWZpeGVkIHdpdGggX3AydF9cbiAgICAvLyB0byBhdm9pZCBjb2xsaXNpb25zIGlmIGN1c3RvbSBQb2ludCBjbGFzcyBpcyB1c2VkLlxuXG4gICAgLyoqXG4gICAgICogVGhlIGVkZ2VzIHRoaXMgcG9pbnQgY29uc3RpdHV0ZXMgYW4gdXBwZXIgZW5kaW5nIHBvaW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgICAqL1xuICAgIHRoaXMuX3AydF9lZGdlX2xpc3QgPSBudWxsO1xufTtcblxuLyoqXG4gKiBGb3IgcHJldHR5IHByaW50aW5nXG4gKiBAZXhhbXBsZVxuICogICAgICBcInA9XCIgKyBuZXcgcG9seTJ0cmkuUG9pbnQoNSw0MilcbiAqICAgICAgLy8g4oaSIFwicD0oNTs0MilcIlxuICogQHJldHVybnMge3N0cmluZ30gPGNvZGU+XCIoeDt5KVwiPC9jb2RlPlxuICovXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geHkudG9TdHJpbmdCYXNlKHRoaXMpO1xufTtcblxuLyoqXG4gKiBKU09OIG91dHB1dCwgb25seSBjb29yZGluYXRlc1xuICogQGV4YW1wbGVcbiAqICAgICAgSlNPTi5zdHJpbmdpZnkobmV3IHBvbHkydHJpLlBvaW50KDEsMikpXG4gKiAgICAgIC8vIOKGkiAne1wieFwiOjEsXCJ5XCI6Mn0nXG4gKi9cblBvaW50LnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIFBvaW50IG9iamVjdC5cbiAqIEByZXR1cm4ge1BvaW50fSBuZXcgY2xvbmVkIHBvaW50XG4gKi9cblBvaW50LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQodGhpcy54LCB0aGlzLnkpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhpcyBQb2ludCBpbnN0YW5jZSB0byB0aGUgb3JpZ28uIDxjb2RlPigwOyAwKTwvY29kZT5cbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5zZXRfemVybyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IDAuMDtcbiAgICB0aGlzLnkgPSAwLjA7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGNvb3JkaW5hdGVzIG9mIHRoaXMgaW5zdGFuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0geCAgIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSB5ICAgY29vcmRpbmF0ZVxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICB0aGlzLnggPSAreCB8fCAwO1xuICAgIHRoaXMueSA9ICt5IHx8IDA7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBOZWdhdGUgdGhpcyBQb2ludCBpbnN0YW5jZS4gKGNvbXBvbmVudC13aXNlKVxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIEFkZCBhbm90aGVyIFBvaW50IG9iamVjdCB0byB0aGlzIGluc3RhbmNlLiAoY29tcG9uZW50LXdpc2UpXG4gKiBAcGFyYW0geyFQb2ludH0gbiAtIFBvaW50IG9iamVjdC5cbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihuKSB7XG4gICAgdGhpcy54ICs9IG4ueDtcbiAgICB0aGlzLnkgKz0gbi55O1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdGhpcyBQb2ludCBpbnN0YW5jZSB3aXRoIGFub3RoZXIgcG9pbnQgZ2l2ZW4uIChjb21wb25lbnQtd2lzZSlcbiAqIEBwYXJhbSB7IVBvaW50fSBuIC0gUG9pbnQgb2JqZWN0LlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLnN1YiA9IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLnggLT0gbi54O1xuICAgIHRoaXMueSAtPSBuLnk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSB0aGlzIFBvaW50IGluc3RhbmNlIGJ5IGEgc2NhbGFyLiAoY29tcG9uZW50LXdpc2UpXG4gKiBAcGFyYW0ge251bWJlcn0gcyAgIHNjYWxhci5cbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5tdWwgPSBmdW5jdGlvbihzKSB7XG4gICAgdGhpcy54ICo9IHM7XG4gICAgdGhpcy55ICo9IHM7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGRpc3RhbmNlIG9mIHRoaXMgUG9pbnQgaW5zdGFuY2UgZnJvbSB0aGUgb3JpZ28uXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGRpc3RhbmNlXG4gKi9cblBvaW50LnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG59O1xuXG4vKipcbiAqIE5vcm1hbGl6ZSB0aGlzIFBvaW50IGluc3RhbmNlIChhcyBhIHZlY3RvcikuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBvcmlnaW5hbCBkaXN0YW5jZSBvZiB0aGlzIGluc3RhbmNlIGZyb20gdGhlIG9yaWdvLlxuICovXG5Qb2ludC5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoKCk7XG4gICAgdGhpcy54IC89IGxlbjtcbiAgICB0aGlzLnkgLz0gbGVuO1xuICAgIHJldHVybiBsZW47XG59O1xuXG4vKipcbiAqIFRlc3QgdGhpcyBQb2ludCBvYmplY3Qgd2l0aCBhbm90aGVyIGZvciBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7IVhZfSBwIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSA8Y29kZT50cnVlPC9jb2RlPiBpZiBzYW1lIHggYW5kIHkgY29vcmRpbmF0ZXMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblBvaW50LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIHRoaXMueCA9PT0gcC54ICYmIHRoaXMueSA9PT0gcC55O1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVBvaW50IChcInN0YXRpY1wiIG1ldGhvZHMpXG5cbi8qKlxuICogTmVnYXRlIGEgcG9pbnQgY29tcG9uZW50LXdpc2UgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGEgbmV3IFBvaW50IG9iamVjdC5cbiAqIEBwYXJhbSB7IVhZfSBwIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhlIHJlc3VsdGluZyBQb2ludCBvYmplY3QuXG4gKi9cblBvaW50Lm5lZ2F0ZSA9IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KC1wLngsIC1wLnkpO1xufTtcblxuLyoqXG4gKiBBZGQgdHdvIHBvaW50cyBjb21wb25lbnQtd2lzZSBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYSBuZXcgUG9pbnQgb2JqZWN0LlxuICogQHBhcmFtIHshWFl9IGEgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhlIHJlc3VsdGluZyBQb2ludCBvYmplY3QuXG4gKi9cblBvaW50LmFkZCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KGEueCArIGIueCwgYS55ICsgYi55KTtcbn07XG5cbi8qKlxuICogU3VidHJhY3QgdHdvIHBvaW50cyBjb21wb25lbnQtd2lzZSBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYSBuZXcgUG9pbnQgb2JqZWN0LlxuICogQHBhcmFtIHshWFl9IGEgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhlIHJlc3VsdGluZyBQb2ludCBvYmplY3QuXG4gKi9cblBvaW50LnN1YiA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KGEueCAtIGIueCwgYS55IC0gYi55KTtcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgYSBwb2ludCBieSBhIHNjYWxhciBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYSBuZXcgUG9pbnQgb2JqZWN0LlxuICogQHBhcmFtIHtudW1iZXJ9IHMgLSB0aGUgc2NhbGFyXG4gKiBAcGFyYW0geyFYWX0gcCAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7UG9pbnR9IHRoZSByZXN1bHRpbmcgUG9pbnQgb2JqZWN0LlxuICovXG5Qb2ludC5tdWwgPSBmdW5jdGlvbihzLCBwKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChzICogcC54LCBzICogcC55KTtcbn07XG5cbi8qKlxuICogUGVyZm9ybSB0aGUgY3Jvc3MgcHJvZHVjdCBvbiBlaXRoZXIgdHdvIHBvaW50cyAodGhpcyBwcm9kdWNlcyBhIHNjYWxhcilcbiAqIG9yIGEgcG9pbnQgYW5kIGEgc2NhbGFyICh0aGlzIHByb2R1Y2VzIGEgcG9pbnQpLlxuICogVGhpcyBmdW5jdGlvbiByZXF1aXJlcyB0d28gcGFyYW1ldGVycywgZWl0aGVyIG1heSBiZSBhIFBvaW50IG9iamVjdCBvciBhXG4gKiBudW1iZXIuXG4gKiBAcGFyYW0gIHtYWXxudW1iZXJ9IGEgLSBQb2ludCBvYmplY3Qgb3Igc2NhbGFyLlxuICogQHBhcmFtICB7WFl8bnVtYmVyfSBiIC0gUG9pbnQgb2JqZWN0IG9yIHNjYWxhci5cbiAqIEByZXR1cm4ge1BvaW50fG51bWJlcn0gYSBQb2ludCBvYmplY3Qgb3IgYSBudW1iZXIsIGRlcGVuZGluZyBvbiB0aGUgcGFyYW1ldGVycy5cbiAqL1xuUG9pbnQuY3Jvc3MgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgaWYgKHR5cGVvZihhKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKHR5cGVvZihiKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBhICogYjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQoLWEgKiBiLnksIGEgKiBiLngpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZihiKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUG9pbnQoYiAqIGEueSwgLWIgKiBhLngpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGEueCAqIGIueSAtIGEueSAqIGIueDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIlBvaW50LUxpa2VcIlxuLypcbiAqIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG9wZXJhdGUgb24gXCJQb2ludFwiIG9yIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3QgXG4gKiB3aXRoIHt4LHl9IChkdWNrIHR5cGluZykuXG4gKi9cblxuUG9pbnQudG9TdHJpbmcgPSB4eS50b1N0cmluZztcblBvaW50LmNvbXBhcmUgPSB4eS5jb21wYXJlO1xuUG9pbnQuY21wID0geHkuY29tcGFyZTsgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuUG9pbnQuZXF1YWxzID0geHkuZXF1YWxzO1xuXG4vKipcbiAqIFBlZm9ybSB0aGUgZG90IHByb2R1Y3Qgb24gdHdvIHZlY3RvcnMuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0geyFYWX0gYSAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRvdCBwcm9kdWN0XG4gKi9cblBvaW50LmRvdCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55O1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzIChwdWJsaWMgQVBJKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50O1xuXG59LHtcIi4veHlcIjoxMX1dLDU6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKlxuICogQ2xhc3MgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcbiAqL1xuXG52YXIgeHkgPSBfZGVyZXFfKCcuL3h5Jyk7XG5cbi8qKlxuICogQ3VzdG9tIGV4Y2VwdGlvbiBjbGFzcyB0byBpbmRpY2F0ZSBpbnZhbGlkIFBvaW50IHZhbHVlc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcHVibGljXG4gKiBAZXh0ZW5kcyBFcnJvclxuICogQHN0cnVjdFxuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIC0gZXJyb3IgbWVzc2FnZVxuICogQHBhcmFtIHtBcnJheS48WFk+PX0gcG9pbnRzIC0gaW52YWxpZCBwb2ludHNcbiAqL1xudmFyIFBvaW50RXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlLCBwb2ludHMpIHtcbiAgICB0aGlzLm5hbWUgPSBcIlBvaW50RXJyb3JcIjtcbiAgICAvKipcbiAgICAgKiBJbnZhbGlkIHBvaW50c1xuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPFhZPn1cbiAgICAgKi9cbiAgICB0aGlzLnBvaW50cyA9IHBvaW50cyA9IHBvaW50cyB8fCBbXTtcbiAgICAvKipcbiAgICAgKiBFcnJvciBtZXNzYWdlXG4gICAgICogQHB1YmxpY1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZSB8fCBcIkludmFsaWQgUG9pbnRzIVwiO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSArPSBcIiBcIiArIHh5LnRvU3RyaW5nKHBvaW50c1tpXSk7XG4gICAgfVxufTtcblBvaW50RXJyb3IucHJvdG90eXBlID0gbmV3IEVycm9yKCk7XG5Qb2ludEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFBvaW50RXJyb3I7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludEVycm9yO1xuXG59LHtcIi4veHlcIjoxMX1dLDY6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuKGZ1bmN0aW9uIChnbG9iYWwpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICpcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbixcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbiAqXG4gKiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbiAqICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uXG4gKiAgIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuICogKiBOZWl0aGVyIHRoZSBuYW1lIG9mIFBvbHkyVHJpIG5vciB0aGUgbmFtZXMgb2YgaXRzIGNvbnRyaWJ1dG9ycyBtYXkgYmVcbiAqICAgdXNlZCB0byBlbmRvcnNlIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpY1xuICogICBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SU1xuICogXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVFxuICogTElNSVRFRCBUTywgVEhFIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MgRk9SXG4gKiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBPV05FUiBPUlxuICogQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsXG4gKiBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sXG4gKiBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1JcbiAqIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0ZcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HXG4gKiBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAqIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFB1YmxpYyBBUEkgZm9yIHBvbHkydHJpLmpzXG4gKiBAbW9kdWxlIHBvbHkydHJpXG4gKi9cblxuXG4vKipcbiAqIElmIHlvdSBhcmUgbm90IHVzaW5nIGEgbW9kdWxlIHN5c3RlbSAoZS5nLiBDb21tb25KUywgUmVxdWlyZUpTKSwgeW91IGNhbiBhY2Nlc3MgdGhpcyBsaWJyYXJ5XG4gKiBhcyBhIGdsb2JhbCB2YXJpYWJsZSA8Y29kZT5wb2x5MnRyaTwvY29kZT4gaS5lLiA8Y29kZT53aW5kb3cucG9seTJ0cmk8L2NvZGU+IGluIGEgYnJvd3Nlci5cbiAqIEBuYW1lIHBvbHkydHJpXG4gKiBAZ2xvYmFsXG4gKiBAcHVibGljXG4gKiBAdHlwZSB7bW9kdWxlOnBvbHkydHJpfVxuICovXG52YXIgcHJldmlvdXNQb2x5MnRyaSA9IGdsb2JhbC5wb2x5MnRyaTtcbi8qKlxuICogRm9yIEJyb3dzZXIgKyAmbHQ7c2NyaXB0Jmd0OyA6XG4gKiByZXZlcnRzIHRoZSB7QGxpbmtjb2RlIHBvbHkydHJpfSBnbG9iYWwgb2JqZWN0IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSxcbiAqIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBpbnN0YW5jZSBjYWxsZWQuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgICAgICAgICB2YXIgcCA9IHBvbHkydHJpLm5vQ29uZmxpY3QoKTtcbiAqIEBwdWJsaWNcbiAqIEByZXR1cm4ge21vZHVsZTpwb2x5MnRyaX0gaW5zdGFuY2UgY2FsbGVkXG4gKi9cbi8vICh0aGlzIGZlYXR1cmUgaXMgbm90IGF1dG9tYXRpY2FsbHkgcHJvdmlkZWQgYnkgYnJvd3NlcmlmeSkuXG5leHBvcnRzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICBnbG9iYWwucG9seTJ0cmkgPSBwcmV2aW91c1BvbHkydHJpO1xuICAgIHJldHVybiBleHBvcnRzO1xufTtcblxuLyoqXG4gKiBwb2x5MnRyaSBsaWJyYXJ5IHZlcnNpb25cbiAqIEBwdWJsaWNcbiAqIEBjb25zdCB7c3RyaW5nfVxuICovXG5leHBvcnRzLlZFUlNJT04gPSBfZGVyZXFfKCcuLi9kaXN0L3ZlcnNpb24uanNvbicpLnZlcnNpb247XG5cbi8qKlxuICogRXhwb3J0cyB0aGUge0BsaW5rY29kZSBQb2ludEVycm9yfSBjbGFzcy5cbiAqIEBwdWJsaWNcbiAqIEB0eXBlZGVmIHtQb2ludEVycm9yfSBtb2R1bGU6cG9seTJ0cmkuUG9pbnRFcnJvclxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydHMuUG9pbnRFcnJvciA9IF9kZXJlcV8oJy4vcG9pbnRlcnJvcicpO1xuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFBvaW50fSBjbGFzcy5cbiAqIEBwdWJsaWNcbiAqIEB0eXBlZGVmIHtQb2ludH0gbW9kdWxlOnBvbHkydHJpLlBvaW50XG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5Qb2ludCA9IF9kZXJlcV8oJy4vcG9pbnQnKTtcbi8qKlxuICogRXhwb3J0cyB0aGUge0BsaW5rY29kZSBUcmlhbmdsZX0gY2xhc3MuXG4gKiBAcHVibGljXG4gKiBAdHlwZWRlZiB7VHJpYW5nbGV9IG1vZHVsZTpwb2x5MnRyaS5UcmlhbmdsZVxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydHMuVHJpYW5nbGUgPSBfZGVyZXFfKCcuL3RyaWFuZ2xlJyk7XG4vKipcbiAqIEV4cG9ydHMgdGhlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0fSBjbGFzcy5cbiAqIEBwdWJsaWNcbiAqIEB0eXBlZGVmIHtTd2VlcENvbnRleHR9IG1vZHVsZTpwb2x5MnRyaS5Td2VlcENvbnRleHRcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnRzLlN3ZWVwQ29udGV4dCA9IF9kZXJlcV8oJy4vc3dlZXBjb250ZXh0Jyk7XG5cblxuLy8gQmFja3dhcmQgY29tcGF0aWJpbGl0eVxudmFyIHN3ZWVwID0gX2RlcmVxXygnLi9zd2VlcCcpO1xuLyoqXG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCN0cmlhbmd1bGF0ZX0gaW5zdGVhZFxuICovXG5leHBvcnRzLnRyaWFuZ3VsYXRlID0gc3dlZXAudHJpYW5ndWxhdGU7XG4vKipcbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCN0cmlhbmd1bGF0ZX0gaW5zdGVhZFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gVHJpYW5ndWxhdGUgLSB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjdHJpYW5ndWxhdGV9IGluc3RlYWRcbiAqL1xuZXhwb3J0cy5zd2VlcCA9IHtUcmlhbmd1bGF0ZTogc3dlZXAudHJpYW5ndWxhdGV9O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxufSx7XCIuLi9kaXN0L3ZlcnNpb24uanNvblwiOjEsXCIuL3BvaW50XCI6NCxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3N3ZWVwXCI6NyxcIi4vc3dlZXBjb250ZXh0XCI6OCxcIi4vdHJpYW5nbGVcIjo5fV0sNzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuLyoganNoaW50IGxhdGVkZWY6bm9mdW5jLCBtYXhjb21wbGV4aXR5OjkgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVGhpcyAnU3dlZXAnIG1vZHVsZSBpcyBwcmVzZW50IGluIG9yZGVyIHRvIGtlZXAgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb25cbiAqIGFzIGNsb3NlIGFzIHBvc3NpYmxlIHRvIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIGV2ZW4gdGhvdWdoIGFsbW9zdCBhbGxcbiAqIGZ1bmN0aW9ucyBjb3VsZCBiZSBkZWNsYXJlZCBhcyBtZXRob2RzIG9uIHRoZSB7QGxpbmtjb2RlIG1vZHVsZTpzd2VlcGNvbnRleHR+U3dlZXBDb250ZXh0fSBvYmplY3QuXG4gKiBAbW9kdWxlXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cbnZhciBhc3NlcnQgPSBfZGVyZXFfKCcuL2Fzc2VydCcpO1xudmFyIFBvaW50RXJyb3IgPSBfZGVyZXFfKCcuL3BvaW50ZXJyb3InKTtcbnZhciBUcmlhbmdsZSA9IF9kZXJlcV8oJy4vdHJpYW5nbGUnKTtcbnZhciBOb2RlID0gX2RlcmVxXygnLi9hZHZhbmNpbmdmcm9udCcpLk5vZGU7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tdXRpbHNcblxudmFyIHV0aWxzID0gX2RlcmVxXygnLi91dGlscycpO1xuXG4vKiogQGNvbnN0ICovXG52YXIgRVBTSUxPTiA9IHV0aWxzLkVQU0lMT047XG5cbi8qKiBAY29uc3QgKi9cbnZhciBPcmllbnRhdGlvbiA9IHV0aWxzLk9yaWVudGF0aW9uO1xuLyoqIEBjb25zdCAqL1xudmFyIG9yaWVudDJkID0gdXRpbHMub3JpZW50MmQ7XG4vKiogQGNvbnN0ICovXG52YXIgaW5TY2FuQXJlYSA9IHV0aWxzLmluU2NhbkFyZWE7XG4vKiogQGNvbnN0ICovXG52YXIgaXNBbmdsZU9idHVzZSA9IHV0aWxzLmlzQW5nbGVPYnR1c2U7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tU3dlZXBcblxuLyoqXG4gKiBUcmlhbmd1bGF0ZSB0aGUgcG9seWdvbiB3aXRoIGhvbGVzIGFuZCBTdGVpbmVyIHBvaW50cy5cbiAqIERvIHRoaXMgQUZURVIgeW91J3ZlIGFkZGVkIHRoZSBwb2x5bGluZSwgaG9sZXMsIGFuZCBTdGVpbmVyIHBvaW50c1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiB0cmlhbmd1bGF0ZSh0Y3gpIHtcbiAgICB0Y3guaW5pdFRyaWFuZ3VsYXRpb24oKTtcbiAgICB0Y3guY3JlYXRlQWR2YW5jaW5nRnJvbnQoKTtcbiAgICAvLyBTd2VlcCBwb2ludHM7IGJ1aWxkIG1lc2hcbiAgICBzd2VlcFBvaW50cyh0Y3gpO1xuICAgIC8vIENsZWFuIHVwXG4gICAgZmluYWxpemF0aW9uUG9seWdvbih0Y3gpO1xufVxuXG4vKipcbiAqIFN0YXJ0IHN3ZWVwaW5nIHRoZSBZLXNvcnRlZCBwb2ludCBzZXQgZnJvbSBib3R0b20gdG8gdG9wXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gc3dlZXBQb2ludHModGN4KSB7XG4gICAgdmFyIGksIGxlbiA9IHRjeC5wb2ludENvdW50KCk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHZhciBwb2ludCA9IHRjeC5nZXRQb2ludChpKTtcbiAgICAgICAgdmFyIG5vZGUgPSBwb2ludEV2ZW50KHRjeCwgcG9pbnQpO1xuICAgICAgICB2YXIgZWRnZXMgPSBwb2ludC5fcDJ0X2VkZ2VfbGlzdDtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGVkZ2VzICYmIGogPCBlZGdlcy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgZWRnZUV2ZW50QnlFZGdlKHRjeCwgZWRnZXNbal0sIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBmaW5hbGl6YXRpb25Qb2x5Z29uKHRjeCkge1xuICAgIC8vIEdldCBhbiBJbnRlcm5hbCB0cmlhbmdsZSB0byBzdGFydCB3aXRoXG4gICAgdmFyIHQgPSB0Y3guZnJvbnQoKS5oZWFkKCkubmV4dC50cmlhbmdsZTtcbiAgICB2YXIgcCA9IHRjeC5mcm9udCgpLmhlYWQoKS5uZXh0LnBvaW50O1xuICAgIHdoaWxlICghdC5nZXRDb25zdHJhaW5lZEVkZ2VDVyhwKSkge1xuICAgICAgICB0ID0gdC5uZWlnaGJvckNDVyhwKTtcbiAgICB9XG5cbiAgICAvLyBDb2xsZWN0IGludGVyaW9yIHRyaWFuZ2xlcyBjb25zdHJhaW5lZCBieSBlZGdlc1xuICAgIHRjeC5tZXNoQ2xlYW4odCk7XG59XG5cbi8qKlxuICogRmluZCBjbG9zZXMgbm9kZSB0byB0aGUgbGVmdCBvZiB0aGUgbmV3IHBvaW50IGFuZFxuICogY3JlYXRlIGEgbmV3IHRyaWFuZ2xlLiBJZiBuZWVkZWQgbmV3IGhvbGVzIGFuZCBiYXNpbnNcbiAqIHdpbGwgYmUgZmlsbGVkIHRvLlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0geyFYWX0gcG9pbnQgICBQb2ludFxuICovXG5mdW5jdGlvbiBwb2ludEV2ZW50KHRjeCwgcG9pbnQpIHtcbiAgICB2YXIgbm9kZSA9IHRjeC5sb2NhdGVOb2RlKHBvaW50KTtcbiAgICB2YXIgbmV3X25vZGUgPSBuZXdGcm9udFRyaWFuZ2xlKHRjeCwgcG9pbnQsIG5vZGUpO1xuXG4gICAgLy8gT25seSBuZWVkIHRvIGNoZWNrICtlcHNpbG9uIHNpbmNlIHBvaW50IG5ldmVyIGhhdmUgc21hbGxlclxuICAgIC8vIHggdmFsdWUgdGhhbiBub2RlIGR1ZSB0byBob3cgd2UgZmV0Y2ggbm9kZXMgZnJvbSB0aGUgZnJvbnRcbiAgICBpZiAocG9pbnQueCA8PSBub2RlLnBvaW50LnggKyAoRVBTSUxPTikpIHtcbiAgICAgICAgZmlsbCh0Y3gsIG5vZGUpO1xuICAgIH1cblxuICAgIC8vdGN4LkFkZE5vZGUobmV3X25vZGUpO1xuXG4gICAgZmlsbEFkdmFuY2luZ0Zyb250KHRjeCwgbmV3X25vZGUpO1xuICAgIHJldHVybiBuZXdfbm9kZTtcbn1cblxuZnVuY3Rpb24gZWRnZUV2ZW50QnlFZGdlKHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIHRjeC5lZGdlX2V2ZW50LmNvbnN0cmFpbmVkX2VkZ2UgPSBlZGdlO1xuICAgIHRjeC5lZGdlX2V2ZW50LnJpZ2h0ID0gKGVkZ2UucC54ID4gZWRnZS5xLngpO1xuXG4gICAgaWYgKGlzRWRnZVNpZGVPZlRyaWFuZ2xlKG5vZGUudHJpYW5nbGUsIGVkZ2UucCwgZWRnZS5xKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRm9yIG5vdyB3ZSB3aWxsIGRvIGFsbCBuZWVkZWQgZmlsbGluZ1xuICAgIC8vIFRPRE86IGludGVncmF0ZSB3aXRoIGZsaXAgcHJvY2VzcyBtaWdodCBnaXZlIHNvbWUgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgLy8gICAgICAgYnV0IGZvciBub3cgdGhpcyBhdm9pZCB0aGUgaXNzdWUgd2l0aCBjYXNlcyB0aGF0IG5lZWRzIGJvdGggZmxpcHMgYW5kIGZpbGxzXG4gICAgZmlsbEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgIGVkZ2VFdmVudEJ5UG9pbnRzKHRjeCwgZWRnZS5wLCBlZGdlLnEsIG5vZGUudHJpYW5nbGUsIGVkZ2UucSk7XG59XG5cbmZ1bmN0aW9uIGVkZ2VFdmVudEJ5UG9pbnRzKHRjeCwgZXAsIGVxLCB0cmlhbmdsZSwgcG9pbnQpIHtcbiAgICBpZiAoaXNFZGdlU2lkZU9mVHJpYW5nbGUodHJpYW5nbGUsIGVwLCBlcSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwMSA9IHRyaWFuZ2xlLnBvaW50Q0NXKHBvaW50KTtcbiAgICB2YXIgbzEgPSBvcmllbnQyZChlcSwgcDEsIGVwKTtcbiAgICBpZiAobzEgPT09IE9yaWVudGF0aW9uLkNPTExJTkVBUikge1xuICAgICAgICAvLyBUT0RPIGludGVncmF0ZSBoZXJlIGNoYW5nZXMgZnJvbSBDKysgdmVyc2lvblxuICAgICAgICAvLyAoQysrIHJlcG8gcmV2aXNpb24gMDk4ODBhODY5MDk1IGRhdGVkIE1hcmNoIDgsIDIwMTEpXG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKCdwb2x5MnRyaSBFZGdlRXZlbnQ6IENvbGxpbmVhciBub3Qgc3VwcG9ydGVkIScsIFtlcSwgcDEsIGVwXSk7XG4gICAgfVxuXG4gICAgdmFyIHAyID0gdHJpYW5nbGUucG9pbnRDVyhwb2ludCk7XG4gICAgdmFyIG8yID0gb3JpZW50MmQoZXEsIHAyLCBlcCk7XG4gICAgaWYgKG8yID09PSBPcmllbnRhdGlvbi5DT0xMSU5FQVIpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIDA5ODgwYTg2OTA5NSBkYXRlZCBNYXJjaCA4LCAyMDExKVxuICAgICAgICB0aHJvdyBuZXcgUG9pbnRFcnJvcigncG9seTJ0cmkgRWRnZUV2ZW50OiBDb2xsaW5lYXIgbm90IHN1cHBvcnRlZCEnLCBbZXEsIHAyLCBlcF0pO1xuICAgIH1cblxuICAgIGlmIChvMSA9PT0gbzIpIHtcbiAgICAgICAgLy8gTmVlZCB0byBkZWNpZGUgaWYgd2UgYXJlIHJvdGF0aW5nIENXIG9yIENDVyB0byBnZXQgdG8gYSB0cmlhbmdsZVxuICAgICAgICAvLyB0aGF0IHdpbGwgY3Jvc3MgZWRnZVxuICAgICAgICBpZiAobzEgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICB0cmlhbmdsZSA9IHRyaWFuZ2xlLm5laWdoYm9yQ0NXKHBvaW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyaWFuZ2xlID0gdHJpYW5nbGUubmVpZ2hib3JDVyhwb2ludCk7XG4gICAgICAgIH1cbiAgICAgICAgZWRnZUV2ZW50QnlQb2ludHModGN4LCBlcCwgZXEsIHRyaWFuZ2xlLCBwb2ludCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyB0cmlhbmdsZSBjcm9zc2VzIGNvbnN0cmFpbnQgc28gbGV0cyBmbGlwcGluIHN0YXJ0IVxuICAgICAgICBmbGlwRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0cmlhbmdsZSwgcG9pbnQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNFZGdlU2lkZU9mVHJpYW5nbGUodHJpYW5nbGUsIGVwLCBlcSkge1xuICAgIHZhciBpbmRleCA9IHRyaWFuZ2xlLmVkZ2VJbmRleChlcCwgZXEpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdHJpYW5nbGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5SW5kZXgoaW5kZXgpO1xuICAgICAgICB2YXIgdCA9IHRyaWFuZ2xlLmdldE5laWdoYm9yKGluZGV4KTtcbiAgICAgICAgaWYgKHQpIHtcbiAgICAgICAgICAgIHQubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzKGVwLCBlcSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZyb250IHRyaWFuZ2xlIGFuZCBsZWdhbGl6ZSBpdFxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIG5ld0Zyb250VHJpYW5nbGUodGN4LCBwb2ludCwgbm9kZSkge1xuICAgIHZhciB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZShwb2ludCwgbm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50KTtcblxuICAgIHRyaWFuZ2xlLm1hcmtOZWlnaGJvcihub2RlLnRyaWFuZ2xlKTtcbiAgICB0Y3guYWRkVG9NYXAodHJpYW5nbGUpO1xuXG4gICAgdmFyIG5ld19ub2RlID0gbmV3IE5vZGUocG9pbnQpO1xuICAgIG5ld19ub2RlLm5leHQgPSBub2RlLm5leHQ7XG4gICAgbmV3X25vZGUucHJldiA9IG5vZGU7XG4gICAgbm9kZS5uZXh0LnByZXYgPSBuZXdfbm9kZTtcbiAgICBub2RlLm5leHQgPSBuZXdfbm9kZTtcblxuICAgIGlmICghbGVnYWxpemUodGN4LCB0cmlhbmdsZSkpIHtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0cmlhbmdsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld19ub2RlO1xufVxuXG4vKipcbiAqIEFkZHMgYSB0cmlhbmdsZSB0byB0aGUgYWR2YW5jaW5nIGZyb250IHRvIGZpbGwgYSBob2xlLlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZSAtIG1pZGRsZSBub2RlLCB0aGF0IGlzIHRoZSBib3R0b20gb2YgdGhlIGhvbGVcbiAqL1xuZnVuY3Rpb24gZmlsbCh0Y3gsIG5vZGUpIHtcbiAgICB2YXIgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUobm9kZS5wcmV2LnBvaW50LCBub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQpO1xuXG4gICAgLy8gVE9ETzogc2hvdWxkIGNvcHkgdGhlIGNvbnN0cmFpbmVkX2VkZ2UgdmFsdWUgZnJvbSBuZWlnaGJvciB0cmlhbmdsZXNcbiAgICAvLyAgICAgICBmb3Igbm93IGNvbnN0cmFpbmVkX2VkZ2UgdmFsdWVzIGFyZSBjb3BpZWQgZHVyaW5nIHRoZSBsZWdhbGl6ZVxuICAgIHRyaWFuZ2xlLm1hcmtOZWlnaGJvcihub2RlLnByZXYudHJpYW5nbGUpO1xuICAgIHRyaWFuZ2xlLm1hcmtOZWlnaGJvcihub2RlLnRyaWFuZ2xlKTtcblxuICAgIHRjeC5hZGRUb01hcCh0cmlhbmdsZSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGFkdmFuY2luZyBmcm9udFxuICAgIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0O1xuICAgIG5vZGUubmV4dC5wcmV2ID0gbm9kZS5wcmV2O1xuXG5cbiAgICAvLyBJZiBpdCB3YXMgbGVnYWxpemVkIHRoZSB0cmlhbmdsZSBoYXMgYWxyZWFkeSBiZWVuIG1hcHBlZFxuICAgIGlmICghbGVnYWxpemUodGN4LCB0cmlhbmdsZSkpIHtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0cmlhbmdsZSk7XG4gICAgfVxuXG4gICAgLy90Y3gucmVtb3ZlTm9kZShub2RlKTtcbn1cblxuLyoqXG4gKiBGaWxscyBob2xlcyBpbiB0aGUgQWR2YW5jaW5nIEZyb250XG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZmlsbEFkdmFuY2luZ0Zyb250KHRjeCwgbikge1xuICAgIC8vIEZpbGwgcmlnaHQgaG9sZXNcbiAgICB2YXIgbm9kZSA9IG4ubmV4dDtcbiAgICB3aGlsZSAobm9kZS5uZXh0KSB7XG4gICAgICAgIC8vIFRPRE8gaW50ZWdyYXRlIGhlcmUgY2hhbmdlcyBmcm9tIEMrKyB2ZXJzaW9uXG4gICAgICAgIC8vIChDKysgcmVwbyByZXZpc2lvbiBhY2Y4MWYxZjE3NjQgZGF0ZWQgQXByaWwgNywgMjAxMilcbiAgICAgICAgaWYgKGlzQW5nbGVPYnR1c2Uobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLnByZXYucG9pbnQpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmaWxsKHRjeCwgbm9kZSk7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuXG4gICAgLy8gRmlsbCBsZWZ0IGhvbGVzXG4gICAgbm9kZSA9IG4ucHJldjtcbiAgICB3aGlsZSAobm9kZS5wcmV2KSB7XG4gICAgICAgIC8vIFRPRE8gaW50ZWdyYXRlIGhlcmUgY2hhbmdlcyBmcm9tIEMrKyB2ZXJzaW9uXG4gICAgICAgIC8vIChDKysgcmVwbyByZXZpc2lvbiBhY2Y4MWYxZjE3NjQgZGF0ZWQgQXByaWwgNywgMjAxMilcbiAgICAgICAgaWYgKGlzQW5nbGVPYnR1c2Uobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLnByZXYucG9pbnQpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBmaWxsKHRjeCwgbm9kZSk7XG4gICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgfVxuXG4gICAgLy8gRmlsbCByaWdodCBiYXNpbnNcbiAgICBpZiAobi5uZXh0ICYmIG4ubmV4dC5uZXh0KSB7XG4gICAgICAgIGlmIChpc0Jhc2luQW5nbGVSaWdodChuKSkge1xuICAgICAgICAgICAgZmlsbEJhc2luKHRjeCwgbik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogVGhlIGJhc2luIGFuZ2xlIGlzIGRlY2lkZWQgYWdhaW5zdCB0aGUgaG9yaXpvbnRhbCBsaW5lIFsxLDBdLlxuICogQHBhcmFtIHtOb2RlfSBub2RlXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGFuZ2xlIDwgMyrPgC80XG4gKi9cbmZ1bmN0aW9uIGlzQmFzaW5BbmdsZVJpZ2h0KG5vZGUpIHtcbiAgICB2YXIgYXggPSBub2RlLnBvaW50LnggLSBub2RlLm5leHQubmV4dC5wb2ludC54O1xuICAgIHZhciBheSA9IG5vZGUucG9pbnQueSAtIG5vZGUubmV4dC5uZXh0LnBvaW50Lnk7XG4gICAgYXNzZXJ0KGF5ID49IDAsIFwidW5vcmRlcmVkIHlcIik7XG4gICAgcmV0dXJuIChheCA+PSAwIHx8IE1hdGguYWJzKGF4KSA8IGF5KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdHJpYW5nbGUgd2FzIGxlZ2FsaXplZFxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBsZWdhbGl6ZSh0Y3gsIHQpIHtcbiAgICAvLyBUbyBsZWdhbGl6ZSBhIHRyaWFuZ2xlIHdlIHN0YXJ0IGJ5IGZpbmRpbmcgaWYgYW55IG9mIHRoZSB0aHJlZSBlZGdlc1xuICAgIC8vIHZpb2xhdGUgdGhlIERlbGF1bmF5IGNvbmRpdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgKytpKSB7XG4gICAgICAgIGlmICh0LmRlbGF1bmF5X2VkZ2VbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvdCA9IHQuZ2V0TmVpZ2hib3IoaSk7XG4gICAgICAgIGlmIChvdCkge1xuICAgICAgICAgICAgdmFyIHAgPSB0LmdldFBvaW50KGkpO1xuICAgICAgICAgICAgdmFyIG9wID0gb3Qub3Bwb3NpdGVQb2ludCh0LCBwKTtcbiAgICAgICAgICAgIHZhciBvaSA9IG90LmluZGV4KG9wKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIENvbnN0cmFpbmVkIEVkZ2Ugb3IgYSBEZWxhdW5heSBFZGdlKG9ubHkgZHVyaW5nIHJlY3Vyc2l2ZSBsZWdhbGl6YXRpb24pXG4gICAgICAgICAgICAvLyB0aGVuIHdlIHNob3VsZCBub3QgdHJ5IHRvIGxlZ2FsaXplXG4gICAgICAgICAgICBpZiAob3QuY29uc3RyYWluZWRfZWRnZVtvaV0gfHwgb3QuZGVsYXVuYXlfZWRnZVtvaV0pIHtcbiAgICAgICAgICAgICAgICB0LmNvbnN0cmFpbmVkX2VkZ2VbaV0gPSBvdC5jb25zdHJhaW5lZF9lZGdlW29pXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluc2lkZSA9IGluQ2lyY2xlKHAsIHQucG9pbnRDQ1cocCksIHQucG9pbnRDVyhwKSwgb3ApO1xuICAgICAgICAgICAgaWYgKGluc2lkZSkge1xuICAgICAgICAgICAgICAgIC8vIExldHMgbWFyayB0aGlzIHNoYXJlZCBlZGdlIGFzIERlbGF1bmF5XG4gICAgICAgICAgICAgICAgdC5kZWxhdW5heV9lZGdlW2ldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBvdC5kZWxhdW5heV9lZGdlW29pXSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAvLyBMZXRzIHJvdGF0ZSBzaGFyZWQgZWRnZSBvbmUgdmVydGV4IENXIHRvIGxlZ2FsaXplIGl0XG4gICAgICAgICAgICAgICAgcm90YXRlVHJpYW5nbGVQYWlyKHQsIHAsIG90LCBvcCk7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBub3cgZ290IG9uZSB2YWxpZCBEZWxhdW5heSBFZGdlIHNoYXJlZCBieSB0d28gdHJpYW5nbGVzXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBnaXZlcyB1cyA0IG5ldyBlZGdlcyB0byBjaGVjayBmb3IgRGVsYXVuYXlcblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRyaWFuZ2xlIHRvIG5vZGUgbWFwcGluZyBpcyBkb25lIG9ubHkgb25lIHRpbWUgZm9yIGEgc3BlY2lmaWMgdHJpYW5nbGVcbiAgICAgICAgICAgICAgICB2YXIgbm90X2xlZ2FsaXplZCA9ICFsZWdhbGl6ZSh0Y3gsIHQpO1xuICAgICAgICAgICAgICAgIGlmIChub3RfbGVnYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXModCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbm90X2xlZ2FsaXplZCA9ICFsZWdhbGl6ZSh0Y3gsIG90KTtcbiAgICAgICAgICAgICAgICBpZiAobm90X2xlZ2FsaXplZCkge1xuICAgICAgICAgICAgICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKG90KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgdGhlIERlbGF1bmF5IGVkZ2VzLCBzaW5jZSB0aGV5IG9ubHkgYXJlIHZhbGlkIERlbGF1bmF5IGVkZ2VzXG4gICAgICAgICAgICAgICAgLy8gdW50aWwgd2UgYWRkIGEgbmV3IHRyaWFuZ2xlIG9yIHBvaW50LlxuICAgICAgICAgICAgICAgIC8vIFhYWDogbmVlZCB0byB0aGluayBhYm91dCB0aGlzLiBDYW4gdGhlc2UgZWRnZXMgYmUgdHJpZWQgYWZ0ZXIgd2VcbiAgICAgICAgICAgICAgICAvLyAgICAgIHJldHVybiB0byBwcmV2aW91cyByZWN1cnNpdmUgbGV2ZWw/XG4gICAgICAgICAgICAgICAgdC5kZWxhdW5heV9lZGdlW2ldID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgb3QuZGVsYXVuYXlfZWRnZVtvaV0gPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRyaWFuZ2xlIGhhdmUgYmVlbiBsZWdhbGl6ZWQgbm8gbmVlZCB0byBjaGVjayB0aGUgb3RoZXIgZWRnZXMgc2luY2VcbiAgICAgICAgICAgICAgICAvLyB0aGUgcmVjdXJzaXZlIGxlZ2FsaXphdGlvbiB3aWxsIGhhbmRsZXMgdGhvc2Ugc28gd2UgY2FuIGVuZCBoZXJlLlxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiA8Yj5SZXF1aXJlbWVudDwvYj46PGJyPlxuICogMS4gYSxiIGFuZCBjIGZvcm0gYSB0cmlhbmdsZS48YnI+XG4gKiAyLiBhIGFuZCBkIGlzIGtub3cgdG8gYmUgb24gb3Bwb3NpdGUgc2lkZSBvZiBiYzxicj5cbiAqIDxwcmU+XG4gKiAgICAgICAgICAgICAgICBhXG4gKiAgICAgICAgICAgICAgICArXG4gKiAgICAgICAgICAgICAgIC8gXFxcbiAqICAgICAgICAgICAgICAvICAgXFxcbiAqICAgICAgICAgICAgYi8gICAgIFxcY1xuICogICAgICAgICAgICArLS0tLS0tLStcbiAqICAgICAgICAgICAvICAgIGQgICAgXFxcbiAqICAgICAgICAgIC8gICAgICAgICAgIFxcXG4gKiA8L3ByZT5cbiAqIDxiPkZhY3Q8L2I+OiBkIGhhcyB0byBiZSBpbiBhcmVhIEIgdG8gaGF2ZSBhIGNoYW5jZSB0byBiZSBpbnNpZGUgdGhlIGNpcmNsZSBmb3JtZWQgYnlcbiAqICBhLGIgYW5kIGM8YnI+XG4gKiAgZCBpcyBvdXRzaWRlIEIgaWYgb3JpZW50MmQoYSxiLGQpIG9yIG9yaWVudDJkKGMsYSxkKSBpcyBDVzxicj5cbiAqICBUaGlzIHByZWtub3dsZWRnZSBnaXZlcyB1cyBhIHdheSB0byBvcHRpbWl6ZSB0aGUgaW5jaXJjbGUgdGVzdFxuICogQHBhcmFtIHBhIC0gdHJpYW5nbGUgcG9pbnQsIG9wcG9zaXRlIGRcbiAqIEBwYXJhbSBwYiAtIHRyaWFuZ2xlIHBvaW50XG4gKiBAcGFyYW0gcGMgLSB0cmlhbmdsZSBwb2ludFxuICogQHBhcmFtIHBkIC0gcG9pbnQgb3Bwb3NpdGUgYVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBkIGlzIGluc2lkZSBjaXJjbGUsIGZhbHNlIGlmIG9uIGNpcmNsZSBlZGdlXG4gKi9cbmZ1bmN0aW9uIGluQ2lyY2xlKHBhLCBwYiwgcGMsIHBkKSB7XG4gICAgdmFyIGFkeCA9IHBhLnggLSBwZC54O1xuICAgIHZhciBhZHkgPSBwYS55IC0gcGQueTtcbiAgICB2YXIgYmR4ID0gcGIueCAtIHBkLng7XG4gICAgdmFyIGJkeSA9IHBiLnkgLSBwZC55O1xuXG4gICAgdmFyIGFkeGJkeSA9IGFkeCAqIGJkeTtcbiAgICB2YXIgYmR4YWR5ID0gYmR4ICogYWR5O1xuICAgIHZhciBvYWJkID0gYWR4YmR5IC0gYmR4YWR5O1xuICAgIGlmIChvYWJkIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBjZHggPSBwYy54IC0gcGQueDtcbiAgICB2YXIgY2R5ID0gcGMueSAtIHBkLnk7XG5cbiAgICB2YXIgY2R4YWR5ID0gY2R4ICogYWR5O1xuICAgIHZhciBhZHhjZHkgPSBhZHggKiBjZHk7XG4gICAgdmFyIG9jYWQgPSBjZHhhZHkgLSBhZHhjZHk7XG4gICAgaWYgKG9jYWQgPD0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGJkeGNkeSA9IGJkeCAqIGNkeTtcbiAgICB2YXIgY2R4YmR5ID0gY2R4ICogYmR5O1xuXG4gICAgdmFyIGFsaWZ0ID0gYWR4ICogYWR4ICsgYWR5ICogYWR5O1xuICAgIHZhciBibGlmdCA9IGJkeCAqIGJkeCArIGJkeSAqIGJkeTtcbiAgICB2YXIgY2xpZnQgPSBjZHggKiBjZHggKyBjZHkgKiBjZHk7XG5cbiAgICB2YXIgZGV0ID0gYWxpZnQgKiAoYmR4Y2R5IC0gY2R4YmR5KSArIGJsaWZ0ICogb2NhZCArIGNsaWZ0ICogb2FiZDtcbiAgICByZXR1cm4gZGV0ID4gMDtcbn1cblxuLyoqXG4gKiBSb3RhdGVzIGEgdHJpYW5nbGUgcGFpciBvbmUgdmVydGV4IENXXG4gKjxwcmU+XG4gKiAgICAgICBuMiAgICAgICAgICAgICAgICAgICAgbjJcbiAqICBQICstLS0tLSsgICAgICAgICAgICAgUCArLS0tLS0rXG4gKiAgICB8IHQgIC98ICAgICAgICAgICAgICAgfFxcICB0IHxcbiAqICAgIHwgICAvIHwgICAgICAgICAgICAgICB8IFxcICAgfFxuICogIG4xfCAgLyAgfG4zICAgICAgICAgICBuMXwgIFxcICB8bjNcbiAqICAgIHwgLyAgIHwgICAgYWZ0ZXIgQ1cgICB8ICAgXFwgfFxuICogICAgfC8gb1QgfCAgICAgICAgICAgICAgIHwgb1QgXFx8XG4gKiAgICArLS0tLS0rIG9QICAgICAgICAgICAgKy0tLS0tK1xuICogICAgICAgbjQgICAgICAgICAgICAgICAgICAgIG40XG4gKiA8L3ByZT5cbiAqL1xuZnVuY3Rpb24gcm90YXRlVHJpYW5nbGVQYWlyKHQsIHAsIG90LCBvcCkge1xuICAgIHZhciBuMSwgbjIsIG4zLCBuNDtcbiAgICBuMSA9IHQubmVpZ2hib3JDQ1cocCk7XG4gICAgbjIgPSB0Lm5laWdoYm9yQ1cocCk7XG4gICAgbjMgPSBvdC5uZWlnaGJvckNDVyhvcCk7XG4gICAgbjQgPSBvdC5uZWlnaGJvckNXKG9wKTtcblxuICAgIHZhciBjZTEsIGNlMiwgY2UzLCBjZTQ7XG4gICAgY2UxID0gdC5nZXRDb25zdHJhaW5lZEVkZ2VDQ1cocCk7XG4gICAgY2UyID0gdC5nZXRDb25zdHJhaW5lZEVkZ2VDVyhwKTtcbiAgICBjZTMgPSBvdC5nZXRDb25zdHJhaW5lZEVkZ2VDQ1cob3ApO1xuICAgIGNlNCA9IG90LmdldENvbnN0cmFpbmVkRWRnZUNXKG9wKTtcblxuICAgIHZhciBkZTEsIGRlMiwgZGUzLCBkZTQ7XG4gICAgZGUxID0gdC5nZXREZWxhdW5heUVkZ2VDQ1cocCk7XG4gICAgZGUyID0gdC5nZXREZWxhdW5heUVkZ2VDVyhwKTtcbiAgICBkZTMgPSBvdC5nZXREZWxhdW5heUVkZ2VDQ1cob3ApO1xuICAgIGRlNCA9IG90LmdldERlbGF1bmF5RWRnZUNXKG9wKTtcblxuICAgIHQubGVnYWxpemUocCwgb3ApO1xuICAgIG90LmxlZ2FsaXplKG9wLCBwKTtcblxuICAgIC8vIFJlbWFwIGRlbGF1bmF5X2VkZ2VcbiAgICBvdC5zZXREZWxhdW5heUVkZ2VDQ1cocCwgZGUxKTtcbiAgICB0LnNldERlbGF1bmF5RWRnZUNXKHAsIGRlMik7XG4gICAgdC5zZXREZWxhdW5heUVkZ2VDQ1cob3AsIGRlMyk7XG4gICAgb3Quc2V0RGVsYXVuYXlFZGdlQ1cob3AsIGRlNCk7XG5cbiAgICAvLyBSZW1hcCBjb25zdHJhaW5lZF9lZGdlXG4gICAgb3Quc2V0Q29uc3RyYWluZWRFZGdlQ0NXKHAsIGNlMSk7XG4gICAgdC5zZXRDb25zdHJhaW5lZEVkZ2VDVyhwLCBjZTIpO1xuICAgIHQuc2V0Q29uc3RyYWluZWRFZGdlQ0NXKG9wLCBjZTMpO1xuICAgIG90LnNldENvbnN0cmFpbmVkRWRnZUNXKG9wLCBjZTQpO1xuXG4gICAgLy8gUmVtYXAgbmVpZ2hib3JzXG4gICAgLy8gWFhYOiBtaWdodCBvcHRpbWl6ZSB0aGUgbWFya05laWdoYm9yIGJ5IGtlZXBpbmcgdHJhY2sgb2ZcbiAgICAvLyAgICAgIHdoYXQgc2lkZSBzaG91bGQgYmUgYXNzaWduZWQgdG8gd2hhdCBuZWlnaGJvciBhZnRlciB0aGVcbiAgICAvLyAgICAgIHJvdGF0aW9uLiBOb3cgbWFyayBuZWlnaGJvciBkb2VzIGxvdHMgb2YgdGVzdGluZyB0byBmaW5kXG4gICAgLy8gICAgICB0aGUgcmlnaHQgc2lkZS5cbiAgICB0LmNsZWFyTmVpZ2hib3JzKCk7XG4gICAgb3QuY2xlYXJOZWlnaGJvcnMoKTtcbiAgICBpZiAobjEpIHtcbiAgICAgICAgb3QubWFya05laWdoYm9yKG4xKTtcbiAgICB9XG4gICAgaWYgKG4yKSB7XG4gICAgICAgIHQubWFya05laWdoYm9yKG4yKTtcbiAgICB9XG4gICAgaWYgKG4zKSB7XG4gICAgICAgIHQubWFya05laWdoYm9yKG4zKTtcbiAgICB9XG4gICAgaWYgKG40KSB7XG4gICAgICAgIG90Lm1hcmtOZWlnaGJvcihuNCk7XG4gICAgfVxuICAgIHQubWFya05laWdoYm9yKG90KTtcbn1cblxuLyoqXG4gKiBGaWxscyBhIGJhc2luIHRoYXQgaGFzIGZvcm1lZCBvbiB0aGUgQWR2YW5jaW5nIEZyb250IHRvIHRoZSByaWdodFxuICogb2YgZ2l2ZW4gbm9kZS48YnI+XG4gKiBGaXJzdCB3ZSBkZWNpZGUgYSBsZWZ0LGJvdHRvbSBhbmQgcmlnaHQgbm9kZSB0aGF0IGZvcm1zIHRoZVxuICogYm91bmRhcmllcyBvZiB0aGUgYmFzaW4uIFRoZW4gd2UgZG8gYSByZXF1cnNpdmUgZmlsbC5cbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBub2RlIC0gc3RhcnRpbmcgbm9kZSwgdGhpcyBvciBuZXh0IG5vZGUgd2lsbCBiZSBsZWZ0IG5vZGVcbiAqL1xuZnVuY3Rpb24gZmlsbEJhc2luKHRjeCwgbm9kZSkge1xuICAgIGlmIChvcmllbnQyZChub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgIHRjeC5iYXNpbi5sZWZ0X25vZGUgPSBub2RlLm5leHQubmV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0Y3guYmFzaW4ubGVmdF9ub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIGJvdHRvbSBhbmQgcmlnaHQgbm9kZVxuICAgIHRjeC5iYXNpbi5ib3R0b21fbm9kZSA9IHRjeC5iYXNpbi5sZWZ0X25vZGU7XG4gICAgd2hpbGUgKHRjeC5iYXNpbi5ib3R0b21fbm9kZS5uZXh0ICYmIHRjeC5iYXNpbi5ib3R0b21fbm9kZS5wb2ludC55ID49IHRjeC5iYXNpbi5ib3R0b21fbm9kZS5uZXh0LnBvaW50LnkpIHtcbiAgICAgICAgdGN4LmJhc2luLmJvdHRvbV9ub2RlID0gdGN4LmJhc2luLmJvdHRvbV9ub2RlLm5leHQ7XG4gICAgfVxuICAgIGlmICh0Y3guYmFzaW4uYm90dG9tX25vZGUgPT09IHRjeC5iYXNpbi5sZWZ0X25vZGUpIHtcbiAgICAgICAgLy8gTm8gdmFsaWQgYmFzaW5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRjeC5iYXNpbi5yaWdodF9ub2RlID0gdGN4LmJhc2luLmJvdHRvbV9ub2RlO1xuICAgIHdoaWxlICh0Y3guYmFzaW4ucmlnaHRfbm9kZS5uZXh0ICYmIHRjeC5iYXNpbi5yaWdodF9ub2RlLnBvaW50LnkgPCB0Y3guYmFzaW4ucmlnaHRfbm9kZS5uZXh0LnBvaW50LnkpIHtcbiAgICAgICAgdGN4LmJhc2luLnJpZ2h0X25vZGUgPSB0Y3guYmFzaW4ucmlnaHRfbm9kZS5uZXh0O1xuICAgIH1cbiAgICBpZiAodGN4LmJhc2luLnJpZ2h0X25vZGUgPT09IHRjeC5iYXNpbi5ib3R0b21fbm9kZSkge1xuICAgICAgICAvLyBObyB2YWxpZCBiYXNpbnNcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRjeC5iYXNpbi53aWR0aCA9IHRjeC5iYXNpbi5yaWdodF9ub2RlLnBvaW50LnggLSB0Y3guYmFzaW4ubGVmdF9ub2RlLnBvaW50Lng7XG4gICAgdGN4LmJhc2luLmxlZnRfaGlnaGVzdCA9IHRjeC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueSA+IHRjeC5iYXNpbi5yaWdodF9ub2RlLnBvaW50Lnk7XG5cbiAgICBmaWxsQmFzaW5SZXEodGN4LCB0Y3guYmFzaW4uYm90dG9tX25vZGUpO1xufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZSBhbGdvcml0aG0gdG8gZmlsbCBhIEJhc2luIHdpdGggdHJpYW5nbGVzXG4gKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZSAtIGJvdHRvbV9ub2RlXG4gKi9cbmZ1bmN0aW9uIGZpbGxCYXNpblJlcSh0Y3gsIG5vZGUpIHtcbiAgICAvLyBpZiBzaGFsbG93IHN0b3AgZmlsbGluZ1xuICAgIGlmIChpc1NoYWxsb3codGN4LCBub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZmlsbCh0Y3gsIG5vZGUpO1xuXG4gICAgdmFyIG87XG4gICAgaWYgKG5vZGUucHJldiA9PT0gdGN4LmJhc2luLmxlZnRfbm9kZSAmJiBub2RlLm5leHQgPT09IHRjeC5iYXNpbi5yaWdodF9ub2RlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKG5vZGUucHJldiA9PT0gdGN4LmJhc2luLmxlZnRfbm9kZSkge1xuICAgICAgICBvID0gb3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCk7XG4gICAgICAgIGlmIChvID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgfSBlbHNlIGlmIChub2RlLm5leHQgPT09IHRjeC5iYXNpbi5yaWdodF9ub2RlKSB7XG4gICAgICAgIG8gPSBvcmllbnQyZChub2RlLnBvaW50LCBub2RlLnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnBvaW50KTtcbiAgICAgICAgaWYgKG8gPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgbmVpZ2hib3Igbm9kZSB3aXRoIGxvd2VzdCBZIHZhbHVlXG4gICAgICAgIGlmIChub2RlLnByZXYucG9pbnQueSA8IG5vZGUubmV4dC5wb2ludC55KSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxCYXNpblJlcSh0Y3gsIG5vZGUpO1xufVxuXG5mdW5jdGlvbiBpc1NoYWxsb3codGN4LCBub2RlKSB7XG4gICAgdmFyIGhlaWdodDtcbiAgICBpZiAodGN4LmJhc2luLmxlZnRfaGlnaGVzdCkge1xuICAgICAgICBoZWlnaHQgPSB0Y3guYmFzaW4ubGVmdF9ub2RlLnBvaW50LnkgLSBub2RlLnBvaW50Lnk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaGVpZ2h0ID0gdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueSAtIG5vZGUucG9pbnQueTtcbiAgICB9XG5cbiAgICAvLyBpZiBzaGFsbG93IHN0b3AgZmlsbGluZ1xuICAgIGlmICh0Y3guYmFzaW4ud2lkdGggPiBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZmlsbEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBpZiAodGN4LmVkZ2VfZXZlbnQucmlnaHQpIHtcbiAgICAgICAgZmlsbFJpZ2h0QWJvdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxsTGVmdEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsUmlnaHRBYm92ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5uZXh0LnBvaW50LnggPCBlZGdlLnAueCkge1xuICAgICAgICAvLyBDaGVjayBpZiBuZXh0IG5vZGUgaXMgYmVsb3cgdGhlIGVkZ2VcbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5uZXh0LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgIGZpbGxSaWdodEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsUmlnaHRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBpZiAobm9kZS5wb2ludC54IDwgZWRnZS5wLngpIHtcbiAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgIC8vIENvbmNhdmVcbiAgICAgICAgICAgIGZpbGxSaWdodENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbnZleFxuICAgICAgICAgICAgZmlsbFJpZ2h0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgICAgICAvLyBSZXRyeSB0aGlzIG9uZVxuICAgICAgICAgICAgZmlsbFJpZ2h0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbFJpZ2h0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBmaWxsKHRjeCwgbm9kZS5uZXh0KTtcbiAgICBpZiAobm9kZS5uZXh0LnBvaW50ICE9PSBlZGdlLnApIHtcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLm5leHQucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgLy8gQmVsb3dcbiAgICAgICAgICAgIGlmIChvcmllbnQyZChub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAgICAgLy8gTmV4dCBpcyBjb25jYXZlXG4gICAgICAgICAgICAgICAgZmlsbFJpZ2h0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbnZleFxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICAvLyBOZXh0IGNvbmNhdmUgb3IgY29udmV4P1xuICAgIGlmIChvcmllbnQyZChub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5uZXh0LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgIC8vIENvbmNhdmVcbiAgICAgICAgZmlsbFJpZ2h0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUubmV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udmV4XG4gICAgICAgIC8vIE5leHQgYWJvdmUgb3IgYmVsb3cgZWRnZT9cbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5uZXh0Lm5leHQucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgLy8gQmVsb3dcbiAgICAgICAgICAgIGZpbGxSaWdodENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUubmV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBYm92ZVxuICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbExlZnRBYm92ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICB3aGlsZSAobm9kZS5wcmV2LnBvaW50LnggPiBlZGdlLnAueCkge1xuICAgICAgICAvLyBDaGVjayBpZiBuZXh0IG5vZGUgaXMgYmVsb3cgdGhlIGVkZ2VcbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5wcmV2LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgZmlsbExlZnRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbExlZnRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBpZiAobm9kZS5wb2ludC54ID4gZWRnZS5wLngpIHtcbiAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQpID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICAgICAgZmlsbExlZnRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDb252ZXhcbiAgICAgICAgICAgIGZpbGxMZWZ0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgICAgICAvLyBSZXRyeSB0aGlzIG9uZVxuICAgICAgICAgICAgZmlsbExlZnRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICAvLyBOZXh0IGNvbmNhdmUgb3IgY29udmV4P1xuICAgIGlmIChvcmllbnQyZChub2RlLnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wcmV2LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICBmaWxsTGVmdENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlLnByZXYpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENvbnZleFxuICAgICAgICAvLyBOZXh0IGFib3ZlIG9yIGJlbG93IGVkZ2U/XG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUucHJldi5wcmV2LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgLy8gQmVsb3dcbiAgICAgICAgICAgIGZpbGxMZWZ0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5wcmV2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFib3ZlXG4gICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgZmlsbCh0Y3gsIG5vZGUucHJldik7XG4gICAgaWYgKG5vZGUucHJldi5wb2ludCAhPT0gZWRnZS5wKSB7XG4gICAgICAgIC8vIE5leHQgYWJvdmUgb3IgYmVsb3cgZWRnZT9cbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5wcmV2LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgLy8gQmVsb3dcbiAgICAgICAgICAgIGlmIChvcmllbnQyZChub2RlLnBvaW50LCBub2RlLnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbmNhdmVcbiAgICAgICAgICAgICAgICBmaWxsTGVmdENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTmV4dCBpcyBjb252ZXhcbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmbGlwRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0LCBwKSB7XG4gICAgdmFyIG90ID0gdC5uZWlnaGJvckFjcm9zcyhwKTtcbiAgICBhc3NlcnQob3QsIFwiRkxJUCBmYWlsZWQgZHVlIHRvIG1pc3NpbmcgdHJpYW5nbGUhXCIpO1xuXG4gICAgdmFyIG9wID0gb3Qub3Bwb3NpdGVQb2ludCh0LCBwKTtcblxuICAgIC8vIEFkZGl0aW9uYWwgY2hlY2sgZnJvbSBKYXZhIHZlcnNpb24gKHNlZSBpc3N1ZSAjODgpXG4gICAgaWYgKHQuZ2V0Q29uc3RyYWluZWRFZGdlQWNyb3NzKHApKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHQuaW5kZXgocCk7XG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKFwicG9seTJ0cmkgSW50ZXJzZWN0aW5nIENvbnN0cmFpbnRzXCIsXG4gICAgICAgICAgICAgICAgW3AsIG9wLCB0LmdldFBvaW50KChpbmRleCArIDEpICUgMyksIHQuZ2V0UG9pbnQoKGluZGV4ICsgMikgJSAzKV0pO1xuICAgIH1cblxuICAgIGlmIChpblNjYW5BcmVhKHAsIHQucG9pbnRDQ1cocCksIHQucG9pbnRDVyhwKSwgb3ApKSB7XG4gICAgICAgIC8vIExldHMgcm90YXRlIHNoYXJlZCBlZGdlIG9uZSB2ZXJ0ZXggQ1dcbiAgICAgICAgcm90YXRlVHJpYW5nbGVQYWlyKHQsIHAsIG90LCBvcCk7XG4gICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXModCk7XG4gICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXMob3QpO1xuXG4gICAgICAgIC8vIFhYWDogaW4gdGhlIG9yaWdpbmFsIEMrKyBjb2RlIGZvciB0aGUgbmV4dCAyIGxpbmVzLCB3ZSBhcmVcbiAgICAgICAgLy8gY29tcGFyaW5nIHBvaW50IHZhbHVlcyAoYW5kIG5vdCBwb2ludGVycykuIEluIHRoaXMgSmF2YVNjcmlwdFxuICAgICAgICAvLyBjb2RlLCB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMgKHBvaW50ZXJzKS4gVGhpcyB3b3Jrc1xuICAgICAgICAvLyBiZWNhdXNlIHdlIGNhbid0IGhhdmUgMiBkaWZmZXJlbnQgcG9pbnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzLlxuICAgICAgICAvLyBCdXQgdG8gYmUgcmVhbGx5IGVxdWl2YWxlbnQsIHdlIHNob3VsZCB1c2UgXCJQb2ludC5lcXVhbHNcIiBoZXJlLlxuICAgICAgICBpZiAocCA9PT0gZXEgJiYgb3AgPT09IGVwKSB7XG4gICAgICAgICAgICBpZiAoZXEgPT09IHRjeC5lZGdlX2V2ZW50LmNvbnN0cmFpbmVkX2VkZ2UucSAmJiBlcCA9PT0gdGN4LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZS5wKSB7XG4gICAgICAgICAgICAgICAgdC5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZXAsIGVxKTtcbiAgICAgICAgICAgICAgICBvdC5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZXAsIGVxKTtcbiAgICAgICAgICAgICAgICBsZWdhbGl6ZSh0Y3gsIHQpO1xuICAgICAgICAgICAgICAgIGxlZ2FsaXplKHRjeCwgb3QpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBYWFg6IEkgdGhpbmsgb25lIG9mIHRoZSB0cmlhbmdsZXMgc2hvdWxkIGJlIGxlZ2FsaXplZCBoZXJlP1xuICAgICAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbyA9IG9yaWVudDJkKGVxLCBvcCwgZXApO1xuICAgICAgICAgICAgdCA9IG5leHRGbGlwVHJpYW5nbGUodGN4LCBvLCB0LCBvdCwgcCwgb3ApO1xuICAgICAgICAgICAgZmxpcEVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgdCwgcCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3UCA9IG5leHRGbGlwUG9pbnQoZXAsIGVxLCBvdCwgb3ApO1xuICAgICAgICBmbGlwU2NhbkVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgdCwgb3QsIG5ld1ApO1xuICAgICAgICBlZGdlRXZlbnRCeVBvaW50cyh0Y3gsIGVwLCBlcSwgdCwgcCk7XG4gICAgfVxufVxuXG4vKipcbiAqIEFmdGVyIGEgZmxpcCB3ZSBoYXZlIHR3byB0cmlhbmdsZXMgYW5kIGtub3cgdGhhdCBvbmx5IG9uZSB3aWxsIHN0aWxsIGJlXG4gKiBpbnRlcnNlY3RpbmcgdGhlIGVkZ2UuIFNvIGRlY2lkZSB3aGljaCB0byBjb250aXVuZSB3aXRoIGFuZCBsZWdhbGl6ZSB0aGUgb3RoZXJcbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBvIC0gc2hvdWxkIGJlIHRoZSByZXN1bHQgb2YgYW4gb3JpZW50MmQoIGVxLCBvcCwgZXAgKVxuICogQHBhcmFtIHQgLSB0cmlhbmdsZSAxXG4gKiBAcGFyYW0gb3QgLSB0cmlhbmdsZSAyXG4gKiBAcGFyYW0gcCAtIGEgcG9pbnQgc2hhcmVkIGJ5IGJvdGggdHJpYW5nbGVzXG4gKiBAcGFyYW0gb3AgLSBhbm90aGVyIHBvaW50IHNoYXJlZCBieSBib3RoIHRyaWFuZ2xlc1xuICogQHJldHVybiByZXR1cm5zIHRoZSB0cmlhbmdsZSBzdGlsbCBpbnRlcnNlY3RpbmcgdGhlIGVkZ2VcbiAqL1xuZnVuY3Rpb24gbmV4dEZsaXBUcmlhbmdsZSh0Y3gsIG8sIHQsIG90LCBwLCBvcCkge1xuICAgIHZhciBlZGdlX2luZGV4O1xuICAgIGlmIChvID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgLy8gb3QgaXMgbm90IGNyb3NzaW5nIGVkZ2UgYWZ0ZXIgZmxpcFxuICAgICAgICBlZGdlX2luZGV4ID0gb3QuZWRnZUluZGV4KHAsIG9wKTtcbiAgICAgICAgb3QuZGVsYXVuYXlfZWRnZVtlZGdlX2luZGV4XSA9IHRydWU7XG4gICAgICAgIGxlZ2FsaXplKHRjeCwgb3QpO1xuICAgICAgICBvdC5jbGVhckRlbGF1bmF5RWRnZXMoKTtcbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgLy8gdCBpcyBub3QgY3Jvc3NpbmcgZWRnZSBhZnRlciBmbGlwXG4gICAgZWRnZV9pbmRleCA9IHQuZWRnZUluZGV4KHAsIG9wKTtcblxuICAgIHQuZGVsYXVuYXlfZWRnZVtlZGdlX2luZGV4XSA9IHRydWU7XG4gICAgbGVnYWxpemUodGN4LCB0KTtcbiAgICB0LmNsZWFyRGVsYXVuYXlFZGdlcygpO1xuICAgIHJldHVybiBvdDtcbn1cblxuLyoqXG4gKiBXaGVuIHdlIG5lZWQgdG8gdHJhdmVyc2UgZnJvbSBvbmUgdHJpYW5nbGUgdG8gdGhlIG5leHQgd2UgbmVlZFxuICogdGhlIHBvaW50IGluIGN1cnJlbnQgdHJpYW5nbGUgdGhhdCBpcyB0aGUgb3Bwb3NpdGUgcG9pbnQgdG8gdGhlIG5leHRcbiAqIHRyaWFuZ2xlLlxuICovXG5mdW5jdGlvbiBuZXh0RmxpcFBvaW50KGVwLCBlcSwgb3QsIG9wKSB7XG4gICAgdmFyIG8yZCA9IG9yaWVudDJkKGVxLCBvcCwgZXApO1xuICAgIGlmIChvMmQgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgIC8vIFJpZ2h0XG4gICAgICAgIHJldHVybiBvdC5wb2ludENDVyhvcCk7XG4gICAgfSBlbHNlIGlmIChvMmQgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAvLyBMZWZ0XG4gICAgICAgIHJldHVybiBvdC5wb2ludENXKG9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgUG9pbnRFcnJvcihcInBvbHkydHJpIFtVbnN1cHBvcnRlZF0gbmV4dEZsaXBQb2ludDogb3Bwb3NpbmcgcG9pbnQgb24gY29uc3RyYWluZWQgZWRnZSFcIiwgW2VxLCBvcCwgZXBdKTtcbiAgICB9XG59XG5cbi8qKlxuICogU2NhbiBwYXJ0IG9mIHRoZSBGbGlwU2NhbiBhbGdvcml0aG08YnI+XG4gKiBXaGVuIGEgdHJpYW5nbGUgcGFpciBpc24ndCBmbGlwcGFibGUgd2Ugd2lsbCBzY2FuIGZvciB0aGUgbmV4dFxuICogcG9pbnQgdGhhdCBpcyBpbnNpZGUgdGhlIGZsaXAgdHJpYW5nbGUgc2NhbiBhcmVhLiBXaGVuIGZvdW5kXG4gKiB3ZSBnZW5lcmF0ZSBhIG5ldyBmbGlwRWRnZUV2ZW50XG4gKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gZXAgLSBsYXN0IHBvaW50IG9uIHRoZSBlZGdlIHdlIGFyZSB0cmF2ZXJzaW5nXG4gKiBAcGFyYW0gZXEgLSBmaXJzdCBwb2ludCBvbiB0aGUgZWRnZSB3ZSBhcmUgdHJhdmVyc2luZ1xuICogQHBhcmFtIHshVHJpYW5nbGV9IGZsaXBfdHJpYW5nbGUgLSB0aGUgY3VycmVudCB0cmlhbmdsZSBzaGFyaW5nIHRoZSBwb2ludCBlcSB3aXRoIGVkZ2VcbiAqIEBwYXJhbSB0XG4gKiBAcGFyYW0gcFxuICovXG5mdW5jdGlvbiBmbGlwU2NhbkVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgZmxpcF90cmlhbmdsZSwgdCwgcCkge1xuICAgIHZhciBvdCA9IHQubmVpZ2hib3JBY3Jvc3MocCk7XG4gICAgYXNzZXJ0KG90LCBcIkZMSVAgZmFpbGVkIGR1ZSB0byBtaXNzaW5nIHRyaWFuZ2xlXCIpO1xuXG4gICAgdmFyIG9wID0gb3Qub3Bwb3NpdGVQb2ludCh0LCBwKTtcblxuICAgIGlmIChpblNjYW5BcmVhKGVxLCBmbGlwX3RyaWFuZ2xlLnBvaW50Q0NXKGVxKSwgZmxpcF90cmlhbmdsZS5wb2ludENXKGVxKSwgb3ApKSB7XG4gICAgICAgIC8vIGZsaXAgd2l0aCBuZXcgZWRnZSBvcC5lcVxuICAgICAgICBmbGlwRWRnZUV2ZW50KHRjeCwgZXEsIG9wLCBvdCwgb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdQID0gbmV4dEZsaXBQb2ludChlcCwgZXEsIG90LCBvcCk7XG4gICAgICAgIGZsaXBTY2FuRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCBmbGlwX3RyaWFuZ2xlLCBvdCwgbmV3UCk7XG4gICAgfVxufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzXG5cbmV4cG9ydHMudHJpYW5ndWxhdGUgPSB0cmlhbmd1bGF0ZTtcblxufSx7XCIuL2FkdmFuY2luZ2Zyb250XCI6MixcIi4vYXNzZXJ0XCI6MyxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3RyaWFuZ2xlXCI6OSxcIi4vdXRpbHNcIjoxMH1dLDg6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cbi8qIGpzaGludCBtYXhjb21wbGV4aXR5OjYgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIFBvaW50RXJyb3IgPSBfZGVyZXFfKCcuL3BvaW50ZXJyb3InKTtcbnZhciBQb2ludCA9IF9kZXJlcV8oJy4vcG9pbnQnKTtcbnZhciBUcmlhbmdsZSA9IF9kZXJlcV8oJy4vdHJpYW5nbGUnKTtcbnZhciBzd2VlcCA9IF9kZXJlcV8oJy4vc3dlZXAnKTtcbnZhciBBZHZhbmNpbmdGcm9udCA9IF9kZXJlcV8oJy4vYWR2YW5jaW5nZnJvbnQnKTtcbnZhciBOb2RlID0gQWR2YW5jaW5nRnJvbnQuTm9kZTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS11dGlsc1xuXG4vKipcbiAqIEluaXRpYWwgdHJpYW5nbGUgZmFjdG9yLCBzZWVkIHRyaWFuZ2xlIHdpbGwgZXh0ZW5kIDMwJSBvZlxuICogUG9pbnRTZXQgd2lkdGggdG8gYm90aCBsZWZ0IGFuZCByaWdodC5cbiAqIEBwcml2YXRlXG4gKiBAY29uc3RcbiAqL1xudmFyIGtBbHBoYSA9IDAuMztcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRWRnZVxuLyoqXG4gKiBSZXByZXNlbnRzIGEgc2ltcGxlIHBvbHlnb24ncyBlZGdlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1BvaW50fSBwMVxuICogQHBhcmFtIHtQb2ludH0gcDJcbiAqIEB0aHJvdyB7UG9pbnRFcnJvcn0gaWYgcDEgaXMgc2FtZSBhcyBwMlxuICovXG52YXIgRWRnZSA9IGZ1bmN0aW9uKHAxLCBwMikge1xuICAgIHRoaXMucCA9IHAxO1xuICAgIHRoaXMucSA9IHAyO1xuXG4gICAgaWYgKHAxLnkgPiBwMi55KSB7XG4gICAgICAgIHRoaXMucSA9IHAxO1xuICAgICAgICB0aGlzLnAgPSBwMjtcbiAgICB9IGVsc2UgaWYgKHAxLnkgPT09IHAyLnkpIHtcbiAgICAgICAgaWYgKHAxLnggPiBwMi54KSB7XG4gICAgICAgICAgICB0aGlzLnEgPSBwMTtcbiAgICAgICAgICAgIHRoaXMucCA9IHAyO1xuICAgICAgICB9IGVsc2UgaWYgKHAxLnggPT09IHAyLngpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIEVkZ2UgY29uc3RydWN0b3I6IHJlcGVhdGVkIHBvaW50cyEnLCBbcDFdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5xLl9wMnRfZWRnZV9saXN0KSB7XG4gICAgICAgIHRoaXMucS5fcDJ0X2VkZ2VfbGlzdCA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnEuX3AydF9lZGdlX2xpc3QucHVzaCh0aGlzKTtcbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQmFzaW5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgQmFzaW4gPSBmdW5jdGlvbigpIHtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy5sZWZ0X25vZGUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLmJvdHRvbV9ub2RlID0gbnVsbDtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy5yaWdodF9ub2RlID0gbnVsbDtcbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICB0aGlzLndpZHRoID0gMC4wO1xuICAgIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbiAgICB0aGlzLmxlZnRfaGlnaGVzdCA9IGZhbHNlO1xufTtcblxuQmFzaW4ucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sZWZ0X25vZGUgPSBudWxsO1xuICAgIHRoaXMuYm90dG9tX25vZGUgPSBudWxsO1xuICAgIHRoaXMucmlnaHRfbm9kZSA9IG51bGw7XG4gICAgdGhpcy53aWR0aCA9IDAuMDtcbiAgICB0aGlzLmxlZnRfaGlnaGVzdCA9IGZhbHNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FZGdlRXZlbnRcbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcHJpdmF0ZVxuICovXG52YXIgRWRnZUV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgLyoqIEB0eXBlIHtFZGdlfSAqL1xuICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtib29sZWFufSAqL1xuICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Td2VlcENvbnRleHQgKHB1YmxpYyBBUEkpXG4vKipcbiAqIFN3ZWVwQ29udGV4dCBjb25zdHJ1Y3RvciBvcHRpb25cbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN3ZWVwQ29udGV4dE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbj19IGNsb25lQXJyYXlzIC0gaWYgPGNvZGU+dHJ1ZTwvY29kZT4sIGRvIGEgc2hhbGxvdyBjb3B5IG9mIHRoZSBBcnJheSBwYXJhbWV0ZXJzXG4gKiAgICAgICAgICAgICAgICAgIChjb250b3VyLCBob2xlcykuIFBvaW50cyBpbnNpZGUgYXJyYXlzIGFyZSBuZXZlciBjb3BpZWQuXG4gKiAgICAgICAgICAgICAgICAgIERlZmF1bHQgaXMgPGNvZGU+ZmFsc2U8L2NvZGU+IDoga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgYXJyYXkgYXJndW1lbnRzLFxuICogICAgICAgICAgICAgICAgICB3aG8gd2lsbCBiZSBtb2RpZmllZCBpbiBwbGFjZS5cbiAqL1xuLyoqXG4gKiBDb25zdHJ1Y3RvciBmb3IgdGhlIHRyaWFuZ3VsYXRpb24gY29udGV4dC5cbiAqIEl0IGFjY2VwdHMgYSBzaW1wbGUgcG9seWxpbmUgKHdpdGggbm9uIHJlcGVhdGluZyBwb2ludHMpLCBcbiAqIHdoaWNoIGRlZmluZXMgdGhlIGNvbnN0cmFpbmVkIGVkZ2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgICAgICB2YXIgY29udG91ciA9IFtcbiAqICAgICAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMTAwLCAxMDApLFxuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgxMDAsIDMwMCksXG4gKiAgICAgICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDMwMCwgMzAwKSxcbiAqICAgICAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMzAwLCAxMDApXG4gKiAgICAgICAgICBdO1xuICogICAgICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyLCB7Y2xvbmVBcnJheXM6IHRydWV9KTtcbiAqIEBleGFtcGxlXG4gKiAgICAgICAgICB2YXIgY29udG91ciA9IFt7eDoxMDAsIHk6MTAwfSwge3g6MTAwLCB5OjMwMH0sIHt4OjMwMCwgeTozMDB9LCB7eDozMDAsIHk6MTAwfV07XG4gKiAgICAgICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIsIHtjbG9uZUFycmF5czogdHJ1ZX0pO1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcHVibGljXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0ge0FycmF5LjxYWT59IGNvbnRvdXIgLSBhcnJheSBvZiBwb2ludCBvYmplY3RzLiBUaGUgcG9pbnRzIGNhbiBiZSBlaXRoZXIge0BsaW5rY29kZSBQb2ludH0gaW5zdGFuY2VzLFxuICogICAgICAgICAgb3IgYW55IFwiUG9pbnQgbGlrZVwiIGN1c3RvbSBjbGFzcyB3aXRoIDxjb2RlPnt4LCB5fTwvY29kZT4gYXR0cmlidXRlcy5cbiAqIEBwYXJhbSB7U3dlZXBDb250ZXh0T3B0aW9ucz19IG9wdGlvbnMgLSBjb25zdHJ1Y3RvciBvcHRpb25zXG4gKi9cbnZhciBTd2VlcENvbnRleHQgPSBmdW5jdGlvbihjb250b3VyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy50cmlhbmdsZXNfID0gW107XG4gICAgdGhpcy5tYXBfID0gW107XG4gICAgdGhpcy5wb2ludHNfID0gKG9wdGlvbnMuY2xvbmVBcnJheXMgPyBjb250b3VyLnNsaWNlKDApIDogY29udG91cik7XG4gICAgdGhpcy5lZGdlX2xpc3QgPSBbXTtcblxuICAgIC8vIEJvdW5kaW5nIGJveCBvZiBhbGwgcG9pbnRzLiBDb21wdXRlZCBhdCB0aGUgc3RhcnQgb2YgdGhlIHRyaWFuZ3VsYXRpb24sIFxuICAgIC8vIGl0IGlzIHN0b3JlZCBpbiBjYXNlIGl0IGlzIG5lZWRlZCBieSB0aGUgY2FsbGVyLlxuICAgIHRoaXMucG1pbl8gPSB0aGlzLnBtYXhfID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEFkdmFuY2luZyBmcm9udFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FkdmFuY2luZ0Zyb250fVxuICAgICAqL1xuICAgIHRoaXMuZnJvbnRfID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIGhlYWQgcG9pbnQgdXNlZCB3aXRoIGFkdmFuY2luZyBmcm9udFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge1BvaW50fVxuICAgICAqL1xuICAgIHRoaXMuaGVhZF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogdGFpbCBwb2ludCB1c2VkIHdpdGggYWR2YW5jaW5nIGZyb250XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7UG9pbnR9XG4gICAgICovXG4gICAgdGhpcy50YWlsXyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqL1xuICAgIHRoaXMuYWZfaGVhZF8gPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICovXG4gICAgdGhpcy5hZl9taWRkbGVfID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqL1xuICAgIHRoaXMuYWZfdGFpbF8gPSBudWxsO1xuXG4gICAgdGhpcy5iYXNpbiA9IG5ldyBCYXNpbigpO1xuICAgIHRoaXMuZWRnZV9ldmVudCA9IG5ldyBFZGdlRXZlbnQoKTtcblxuICAgIHRoaXMuaW5pdEVkZ2VzKHRoaXMucG9pbnRzXyk7XG59O1xuXG5cbi8qKlxuICogQWRkIGEgaG9sZSB0byB0aGUgY29uc3RyYWludHNcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHZhciBob2xlID0gW1xuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjAwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDI1MCksXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjUwLCAyNTApXG4gKiAgICAgIF07XG4gKiAgICAgIHN3Y3R4LmFkZEhvbGUoaG9sZSk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC5hZGRIb2xlKFt7eDoyMDAsIHk6MjAwfSwge3g6MjAwLCB5OjI1MH0sIHt4OjI1MCwgeToyNTB9XSk7XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0FycmF5LjxYWT59IHBvbHlsaW5lIC0gYXJyYXkgb2YgXCJQb2ludCBsaWtlXCIgb2JqZWN0cyB3aXRoIHt4LHl9XG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkSG9sZSA9IGZ1bmN0aW9uKHBvbHlsaW5lKSB7XG4gICAgdGhpcy5pbml0RWRnZXMocG9seWxpbmUpO1xuICAgIHZhciBpLCBsZW4gPSBwb2x5bGluZS5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHRoaXMucG9pbnRzXy5wdXNoKHBvbHlsaW5lW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICogQGZ1bmN0aW9uXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjYWRkSG9sZX0gaW5zdGVhZFxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLkFkZEhvbGUgPSBTd2VlcENvbnRleHQucHJvdG90eXBlLmFkZEhvbGU7XG5cblxuLyoqXG4gKiBBZGQgc2V2ZXJhbCBob2xlcyB0byB0aGUgY29uc3RyYWludHNcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHZhciBob2xlcyA9IFtcbiAqICAgICAgICAgIFsgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjAwKSwgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjUwKSwgbmV3IHBvbHkydHJpLlBvaW50KDI1MCwgMjUwKSBdLFxuICogICAgICAgICAgWyBuZXcgcG9seTJ0cmkuUG9pbnQoMzAwLCAzMDApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMzAwLCAzNTApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMzUwLCAzNTApIF1cbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkSG9sZXMoaG9sZXMpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIGhvbGVzID0gW1xuICogICAgICAgICAgW3t4OjIwMCwgeToyMDB9LCB7eDoyMDAsIHk6MjUwfSwge3g6MjUwLCB5OjI1MH1dLFxuICogICAgICAgICAgW3t4OjMwMCwgeTozMDB9LCB7eDozMDAsIHk6MzUwfSwge3g6MzUwLCB5OjM1MH1dXG4gKiAgICAgIF07XG4gKiAgICAgIHN3Y3R4LmFkZEhvbGVzKGhvbGVzKTtcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7QXJyYXkuPEFycmF5LjxYWT4+fSBob2xlcyAtIGFycmF5IG9mIGFycmF5IG9mIFwiUG9pbnQgbGlrZVwiIG9iamVjdHMgd2l0aCB7eCx5fVxuICovXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkSG9sZXMgPSBmdW5jdGlvbihob2xlcykge1xuICAgIHZhciBpLCBsZW4gPSBob2xlcy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHRoaXMuaW5pdEVkZ2VzKGhvbGVzW2ldKTtcbiAgICB9XG4gICAgdGhpcy5wb2ludHNfID0gdGhpcy5wb2ludHNfLmNvbmNhdC5hcHBseSh0aGlzLnBvaW50c18sIGhvbGVzKTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG5cbi8qKlxuICogQWRkIGEgU3RlaW5lciBwb2ludCB0byB0aGUgY29uc3RyYWludHNcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHZhciBwb2ludCA9IG5ldyBwb2x5MnRyaS5Qb2ludCgxNTAsIDE1MCk7XG4gKiAgICAgIHN3Y3R4LmFkZFBvaW50KHBvaW50KTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LmFkZFBvaW50KHt4OjE1MCwgeToxNTB9KTtcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7WFl9IHBvaW50IC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkUG9pbnQgPSBmdW5jdGlvbihwb2ludCkge1xuICAgIHRoaXMucG9pbnRzXy5wdXNoKHBvaW50KTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCNhZGRQb2ludH0gaW5zdGVhZFxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLkFkZFBvaW50ID0gU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRQb2ludDtcblxuXG4vKipcbiAqIEFkZCBzZXZlcmFsIFN0ZWluZXIgcG9pbnRzIHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIHBvaW50cyA9IFtcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgxNTAsIDE1MCksXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyNTApLFxuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDI1MCwgMjUwKVxuICogICAgICBdO1xuICogICAgICBzd2N0eC5hZGRQb2ludHMocG9pbnRzKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LmFkZFBvaW50cyhbe3g6MTUwLCB5OjE1MH0sIHt4OjIwMCwgeToyNTB9LCB7eDoyNTAsIHk6MjUwfV0pO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtBcnJheS48WFk+fSBwb2ludHMgLSBhcnJheSBvZiBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkUG9pbnRzID0gZnVuY3Rpb24ocG9pbnRzKSB7XG4gICAgdGhpcy5wb2ludHNfID0gdGhpcy5wb2ludHNfLmNvbmNhdChwb2ludHMpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cblxuLyoqXG4gKiBUcmlhbmd1bGF0ZSB0aGUgcG9seWdvbiB3aXRoIGhvbGVzIGFuZCBTdGVpbmVyIHBvaW50cy5cbiAqIERvIHRoaXMgQUZURVIgeW91J3ZlIGFkZGVkIHRoZSBwb2x5bGluZSwgaG9sZXMsIGFuZCBTdGVpbmVyIHBvaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHgudHJpYW5ndWxhdGUoKTtcbiAqICAgICAgdmFyIHRyaWFuZ2xlcyA9IHN3Y3R4LmdldFRyaWFuZ2xlcygpO1xuICogQHB1YmxpY1xuICovXG4vLyBTaG9ydGN1dCBtZXRob2QgZm9yIHN3ZWVwLnRyaWFuZ3VsYXRlKFN3ZWVwQ29udGV4dCkuXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblN3ZWVwQ29udGV4dC5wcm90b3R5cGUudHJpYW5ndWxhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBzd2VlcC50cmlhbmd1bGF0ZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG5cbi8qKlxuICogR2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHByb3ZpZGVkIGNvbnN0cmFpbnRzIChjb250b3VyLCBob2xlcyBhbmQgXG4gKiBTdGVpbnRlciBwb2ludHMpLiBXYXJuaW5nIDogdGhlc2UgdmFsdWVzIGFyZSBub3QgYXZhaWxhYmxlIGlmIHRoZSB0cmlhbmd1bGF0aW9uIFxuICogaGFzIG5vdCBiZWVuIGRvbmUgeWV0LlxuICogQHB1YmxpY1xuICogQHJldHVybnMge3ttaW46UG9pbnQsbWF4OlBvaW50fX0gb2JqZWN0IHdpdGggJ21pbicgYW5kICdtYXgnIFBvaW50XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5nZXRCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7bWluOiB0aGlzLnBtaW5fLCBtYXg6IHRoaXMucG1heF99O1xufTtcblxuLyoqXG4gKiBHZXQgcmVzdWx0IG9mIHRyaWFuZ3VsYXRpb24uXG4gKiBUaGUgb3V0cHV0IHRyaWFuZ2xlcyBoYXZlIHZlcnRpY2VzIHdoaWNoIGFyZSByZWZlcmVuY2VzXG4gKiB0byB0aGUgaW5pdGlhbCBpbnB1dCBwb2ludHMgKG5vdCBjb3BpZXMpOiBhbnkgY3VzdG9tIGZpZWxkcyBpbiB0aGVcbiAqIGluaXRpYWwgcG9pbnRzIGNhbiBiZSByZXRyaWV2ZWQgaW4gdGhlIG91dHB1dCB0cmlhbmdsZXMuXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgY29udG91ciA9IFt7eDoxMDAsIHk6MTAwLCBpZDoxfSwge3g6MTAwLCB5OjMwMCwgaWQ6Mn0sIHt4OjMwMCwgeTozMDAsIGlkOjN9XTtcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHgudHJpYW5ndWxhdGUoKTtcbiAqICAgICAgdmFyIHRyaWFuZ2xlcyA9IHN3Y3R4LmdldFRyaWFuZ2xlcygpO1xuICogICAgICB0eXBlb2YgdHJpYW5nbGVzWzBdLmdldFBvaW50KDApLmlkXG4gKiAgICAgIC8vIOKGkiBcIm51bWJlclwiXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7YXJyYXk8VHJpYW5nbGU+fSAgIGFycmF5IG9mIHRyaWFuZ2xlc1xuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldFRyaWFuZ2xlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRyaWFuZ2xlc187XG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCNnZXRUcmlhbmdsZXN9IGluc3RlYWRcbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5HZXRUcmlhbmdsZXMgPSBTd2VlcENvbnRleHQucHJvdG90eXBlLmdldFRyaWFuZ2xlcztcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Td2VlcENvbnRleHQgKHByaXZhdGUgQVBJKVxuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZnJvbnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9udF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUucG9pbnRDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50c18ubGVuZ3RoO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkXztcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5zZXRIZWFkID0gZnVuY3Rpb24ocDEpIHtcbiAgICB0aGlzLmhlYWRfID0gcDE7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWxfO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnNldFRhaWwgPSBmdW5jdGlvbihwMSkge1xuICAgIHRoaXMudGFpbF8gPSBwMTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5nZXRNYXAgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXBfO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmluaXRUcmlhbmd1bGF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHhtYXggPSB0aGlzLnBvaW50c19bMF0ueDtcbiAgICB2YXIgeG1pbiA9IHRoaXMucG9pbnRzX1swXS54O1xuICAgIHZhciB5bWF4ID0gdGhpcy5wb2ludHNfWzBdLnk7XG4gICAgdmFyIHltaW4gPSB0aGlzLnBvaW50c19bMF0ueTtcblxuICAgIC8vIENhbGN1bGF0ZSBib3VuZHNcbiAgICB2YXIgaSwgbGVuID0gdGhpcy5wb2ludHNfLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIHAgPSB0aGlzLnBvaW50c19baV07XG4gICAgICAgIC8qIGpzaGludCBleHByOnRydWUgKi9cbiAgICAgICAgKHAueCA+IHhtYXgpICYmICh4bWF4ID0gcC54KTtcbiAgICAgICAgKHAueCA8IHhtaW4pICYmICh4bWluID0gcC54KTtcbiAgICAgICAgKHAueSA+IHltYXgpICYmICh5bWF4ID0gcC55KTtcbiAgICAgICAgKHAueSA8IHltaW4pICYmICh5bWluID0gcC55KTtcbiAgICB9XG4gICAgdGhpcy5wbWluXyA9IG5ldyBQb2ludCh4bWluLCB5bWluKTtcbiAgICB0aGlzLnBtYXhfID0gbmV3IFBvaW50KHhtYXgsIHltYXgpO1xuXG4gICAgdmFyIGR4ID0ga0FscGhhICogKHhtYXggLSB4bWluKTtcbiAgICB2YXIgZHkgPSBrQWxwaGEgKiAoeW1heCAtIHltaW4pO1xuICAgIHRoaXMuaGVhZF8gPSBuZXcgUG9pbnQoeG1heCArIGR4LCB5bWluIC0gZHkpO1xuICAgIHRoaXMudGFpbF8gPSBuZXcgUG9pbnQoeG1pbiAtIGR4LCB5bWluIC0gZHkpO1xuXG4gICAgLy8gU29ydCBwb2ludHMgYWxvbmcgeS1heGlzXG4gICAgdGhpcy5wb2ludHNfLnNvcnQoUG9pbnQuY29tcGFyZSk7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuaW5pdEVkZ2VzID0gZnVuY3Rpb24ocG9seWxpbmUpIHtcbiAgICB2YXIgaSwgbGVuID0gcG9seWxpbmUubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB0aGlzLmVkZ2VfbGlzdC5wdXNoKG5ldyBFZGdlKHBvbHlsaW5lW2ldLCBwb2x5bGluZVsoaSArIDEpICUgbGVuXSkpO1xuICAgIH1cbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzX1tpbmRleF07XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkVG9NYXAgPSBmdW5jdGlvbih0cmlhbmdsZSkge1xuICAgIHRoaXMubWFwXy5wdXNoKHRyaWFuZ2xlKTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5sb2NhdGVOb2RlID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICByZXR1cm4gdGhpcy5mcm9udF8ubG9jYXRlTm9kZShwb2ludC54KTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5jcmVhdGVBZHZhbmNpbmdGcm9udCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoZWFkO1xuICAgIHZhciBtaWRkbGU7XG4gICAgdmFyIHRhaWw7XG4gICAgLy8gSW5pdGlhbCB0cmlhbmdsZVxuICAgIHZhciB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZSh0aGlzLnBvaW50c19bMF0sIHRoaXMudGFpbF8sIHRoaXMuaGVhZF8pO1xuXG4gICAgdGhpcy5tYXBfLnB1c2godHJpYW5nbGUpO1xuXG4gICAgaGVhZCA9IG5ldyBOb2RlKHRyaWFuZ2xlLmdldFBvaW50KDEpLCB0cmlhbmdsZSk7XG4gICAgbWlkZGxlID0gbmV3IE5vZGUodHJpYW5nbGUuZ2V0UG9pbnQoMCksIHRyaWFuZ2xlKTtcbiAgICB0YWlsID0gbmV3IE5vZGUodHJpYW5nbGUuZ2V0UG9pbnQoMikpO1xuXG4gICAgdGhpcy5mcm9udF8gPSBuZXcgQWR2YW5jaW5nRnJvbnQoaGVhZCwgdGFpbCk7XG5cbiAgICBoZWFkLm5leHQgPSBtaWRkbGU7XG4gICAgbWlkZGxlLm5leHQgPSB0YWlsO1xuICAgIG1pZGRsZS5wcmV2ID0gaGVhZDtcbiAgICB0YWlsLnByZXYgPSBtaWRkbGU7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUucmVtb3ZlTm9kZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gICAgLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLm1hcFRyaWFuZ2xlVG9Ob2RlcyA9IGZ1bmN0aW9uKHQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICBpZiAoIXQuZ2V0TmVpZ2hib3IoaSkpIHtcbiAgICAgICAgICAgIHZhciBuID0gdGhpcy5mcm9udF8ubG9jYXRlUG9pbnQodC5wb2ludENXKHQuZ2V0UG9pbnQoaSkpKTtcbiAgICAgICAgICAgIGlmIChuKSB7XG4gICAgICAgICAgICAgICAgbi50cmlhbmdsZSA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUucmVtb3ZlRnJvbU1hcCA9IGZ1bmN0aW9uKHRyaWFuZ2xlKSB7XG4gICAgdmFyIGksIG1hcCA9IHRoaXMubWFwXywgbGVuID0gbWFwLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKG1hcFtpXSA9PT0gdHJpYW5nbGUpIHtcbiAgICAgICAgICAgIG1hcC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogRG8gYSBkZXB0aCBmaXJzdCB0cmF2ZXJzYWwgdG8gY29sbGVjdCB0cmlhbmdsZXNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1RyaWFuZ2xlfSB0cmlhbmdsZSBzdGFydFxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLm1lc2hDbGVhbiA9IGZ1bmN0aW9uKHRyaWFuZ2xlKSB7XG4gICAgLy8gTmV3IGltcGxlbWVudGF0aW9uIGF2b2lkcyByZWN1cnNpdmUgY2FsbHMgYW5kIHVzZSBhIGxvb3AgaW5zdGVhZC5cbiAgICAvLyBDZi4gaXNzdWVzICMgNTcsIDY1IGFuZCA2OS5cbiAgICB2YXIgdHJpYW5nbGVzID0gW3RyaWFuZ2xlXSwgdCwgaTtcbiAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgd2hpbGUgKHQgPSB0cmlhbmdsZXMucG9wKCkpIHtcbiAgICAgICAgaWYgKCF0LmlzSW50ZXJpb3IoKSkge1xuICAgICAgICAgICAgdC5zZXRJbnRlcmlvcih0cnVlKTtcbiAgICAgICAgICAgIHRoaXMudHJpYW5nbGVzXy5wdXNoKHQpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICghdC5jb25zdHJhaW5lZF9lZGdlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyaWFuZ2xlcy5wdXNoKHQuZ2V0TmVpZ2hib3IoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzXG5cbm1vZHVsZS5leHBvcnRzID0gU3dlZXBDb250ZXh0O1xuXG59LHtcIi4vYWR2YW5jaW5nZnJvbnRcIjoyLFwiLi9wb2ludFwiOjQsXCIuL3BvaW50ZXJyb3JcIjo1LFwiLi9zd2VlcFwiOjcsXCIuL3RyaWFuZ2xlXCI6OX1dLDk6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICpcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuLyoganNoaW50IG1heGNvbXBsZXhpdHk6MTAgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIHh5ID0gX2RlcmVxXyhcIi4veHlcIik7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tVHJpYW5nbGVcbi8qKlxuICogVHJpYW5nbGUgY2xhc3MuPGJyPlxuICogVHJpYW5nbGUtYmFzZWQgZGF0YSBzdHJ1Y3R1cmVzIGFyZSBrbm93biB0byBoYXZlIGJldHRlciBwZXJmb3JtYW5jZSB0aGFuXG4gKiBxdWFkLWVkZ2Ugc3RydWN0dXJlcy5cbiAqIFNlZTogSi4gU2hld2NodWssIFwiVHJpYW5nbGU6IEVuZ2luZWVyaW5nIGEgMkQgUXVhbGl0eSBNZXNoIEdlbmVyYXRvciBhbmRcbiAqIERlbGF1bmF5IFRyaWFuZ3VsYXRvclwiLCBcIlRyaWFuZ3VsYXRpb25zIGluIENHQUxcIlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG52YXIgVHJpYW5nbGUgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgLyoqXG4gICAgICogVHJpYW5nbGUgcG9pbnRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QXJyYXkuPFhZPn1cbiAgICAgKi9cbiAgICB0aGlzLnBvaW50c18gPSBbYSwgYiwgY107XG5cbiAgICAvKipcbiAgICAgKiBOZWlnaGJvciBsaXN0XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QXJyYXkuPFRyaWFuZ2xlPn1cbiAgICAgKi9cbiAgICB0aGlzLm5laWdoYm9yc18gPSBbbnVsbCwgbnVsbCwgbnVsbF07XG5cbiAgICAvKipcbiAgICAgKiBIYXMgdGhpcyB0cmlhbmdsZSBiZWVuIG1hcmtlZCBhcyBhbiBpbnRlcmlvciB0cmlhbmdsZT9cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuaW50ZXJpb3JfID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBGbGFncyB0byBkZXRlcm1pbmUgaWYgYW4gZWRnZSBpcyBhIENvbnN0cmFpbmVkIGVkZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48Ym9vbGVhbj59XG4gICAgICovXG4gICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdO1xuXG4gICAgLyoqXG4gICAgICogRmxhZ3MgdG8gZGV0ZXJtaW5lIGlmIGFuIGVkZ2UgaXMgYSBEZWxhdW5leSBlZGdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QXJyYXkuPGJvb2xlYW4+fVxuICAgICAqL1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTtcbn07XG5cbnZhciBwMnMgPSB4eS50b1N0cmluZztcbi8qKlxuICogRm9yIHByZXR0eSBwcmludGluZyBleC4gPGNvZGU+XCJbKDU7NDIpKDEwOzIwKSgyMTszMCldXCI8L2NvZGU+LlxuICogQHB1YmxpY1xuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFwiW1wiICsgcDJzKHRoaXMucG9pbnRzX1swXSkgKyBwMnModGhpcy5wb2ludHNfWzFdKSArIHAycyh0aGlzLnBvaW50c19bMl0pICsgXCJdXCIpO1xufTtcblxuLyoqXG4gKiBHZXQgb25lIHZlcnRpY2Ugb2YgdGhlIHRyaWFuZ2xlLlxuICogVGhlIG91dHB1dCB0cmlhbmdsZXMgb2YgYSB0cmlhbmd1bGF0aW9uIGhhdmUgdmVydGljZXMgd2hpY2ggYXJlIHJlZmVyZW5jZXNcbiAqIHRvIHRoZSBpbml0aWFsIGlucHV0IHBvaW50cyAobm90IGNvcGllcyk6IGFueSBjdXN0b20gZmllbGRzIGluIHRoZVxuICogaW5pdGlhbCBwb2ludHMgY2FuIGJlIHJldHJpZXZlZCBpbiB0aGUgb3V0cHV0IHRyaWFuZ2xlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDAsIGlkOjF9LCB7eDoxMDAsIHk6MzAwLCBpZDoyfSwge3g6MzAwLCB5OjMwMCwgaWQ6M31dO1xuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiAgICAgIHR5cGVvZiB0cmlhbmdsZXNbMF0uZ2V0UG9pbnQoMCkuaWRcbiAqICAgICAgLy8g4oaSIFwibnVtYmVyXCJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIHZlcnRpY2UgaW5kZXg6IDAsIDEgb3IgMlxuICogQHB1YmxpY1xuICogQHJldHVybnMge1hZfVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50c19baW5kZXhdO1xufTtcblxuLyoqXG4gKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICogQGZ1bmN0aW9uXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBUcmlhbmdsZSNnZXRQb2ludH0gaW5zdGVhZFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuR2V0UG9pbnQgPSBUcmlhbmdsZS5wcm90b3R5cGUuZ2V0UG9pbnQ7XG5cbi8qKlxuICogR2V0IGFsbCAzIHZlcnRpY2VzIG9mIHRoZSB0cmlhbmdsZSBhcyBhbiBhcnJheVxuICogQHB1YmxpY1xuICogQHJldHVybiB7QXJyYXkuPFhZPn1cbiAqL1xuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0UG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzXztcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICogQHJldHVybnMgez9UcmlhbmdsZX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmdldE5laWdoYm9yID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfW2luZGV4XTtcbn07XG5cbi8qKlxuICogVGVzdCBpZiB0aGlzIFRyaWFuZ2xlIGNvbnRhaW5zIHRoZSBQb2ludCBvYmplY3QgZ2l2ZW4gYXMgcGFyYW1ldGVyIGFzIG9uZSBvZiBpdHMgdmVydGljZXMuXG4gKiBPbmx5IHBvaW50IHJlZmVyZW5jZXMgYXJlIGNvbXBhcmVkLCBub3QgdmFsdWVzLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHtYWX0gcG9pbnQgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn0gPGNvZGU+VHJ1ZTwvY29kZT4gaWYgdGhlIFBvaW50IG9iamVjdCBpcyBvZiB0aGUgVHJpYW5nbGUncyB2ZXJ0aWNlcyxcbiAqICAgICAgICAgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmNvbnRhaW5zUG9pbnQgPSBmdW5jdGlvbihwb2ludCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICByZXR1cm4gKHBvaW50ID09PSBwb2ludHNbMF0gfHwgcG9pbnQgPT09IHBvaW50c1sxXSB8fCBwb2ludCA9PT0gcG9pbnRzWzJdKTtcbn07XG5cbi8qKlxuICogVGVzdCBpZiB0aGlzIFRyaWFuZ2xlIGNvbnRhaW5zIHRoZSBFZGdlIG9iamVjdCBnaXZlbiBhcyBwYXJhbWV0ZXIgYXMgaXRzXG4gKiBib3VuZGluZyBlZGdlcy4gT25seSBwb2ludCByZWZlcmVuY2VzIGFyZSBjb21wYXJlZCwgbm90IHZhbHVlcy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0VkZ2V9IGVkZ2VcbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPlRydWU8L2NvZGU+IGlmIHRoZSBFZGdlIG9iamVjdCBpcyBvZiB0aGUgVHJpYW5nbGUncyBib3VuZGluZ1xuICogICAgICAgICBlZGdlcywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmNvbnRhaW5zRWRnZSA9IGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KGVkZ2UucCkgJiYgdGhpcy5jb250YWluc1BvaW50KGVkZ2UucSk7XG59O1xuXG4vKipcbiAqIFRlc3QgaWYgdGhpcyBUcmlhbmdsZSBjb250YWlucyB0aGUgdHdvIFBvaW50IG9iamVjdHMgZ2l2ZW4gYXMgcGFyYW1ldGVycyBhbW9uZyBpdHMgdmVydGljZXMuXG4gKiBPbmx5IHBvaW50IHJlZmVyZW5jZXMgYXJlIGNvbXBhcmVkLCBub3QgdmFsdWVzLlxuICogQHBhcmFtIHtYWX0gcDEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtYWX0gcDIgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmNvbnRhaW5zUG9pbnRzID0gZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbnNQb2ludChwMSkgJiYgdGhpcy5jb250YWluc1BvaW50KHAyKTtcbn07XG5cbi8qKlxuICogSGFzIHRoaXMgdHJpYW5nbGUgYmVlbiBtYXJrZWQgYXMgYW4gaW50ZXJpb3IgdHJpYW5nbGU/XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmlzSW50ZXJpb3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbnRlcmlvcl87XG59O1xuXG4vKipcbiAqIE1hcmsgdGhpcyB0cmlhbmdsZSBhcyBhbiBpbnRlcmlvciB0cmlhbmdsZVxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50ZXJpb3JcbiAqIEByZXR1cm5zIHtUcmlhbmdsZX0gdGhpc1xuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0SW50ZXJpb3IgPSBmdW5jdGlvbihpbnRlcmlvcikge1xuICAgIHRoaXMuaW50ZXJpb3JfID0gaW50ZXJpb3I7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFVwZGF0ZSBuZWlnaGJvciBwb2ludGVycy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwMSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBwMiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1RyaWFuZ2xlfSB0IFRyaWFuZ2xlIG9iamVjdC5cbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBjYW4ndCBmaW5kIG9iamVjdHNcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtOZWlnaGJvclBvaW50ZXJzID0gZnVuY3Rpb24ocDEsIHAyLCB0KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmICgocDEgPT09IHBvaW50c1syXSAmJiBwMiA9PT0gcG9pbnRzWzFdKSB8fCAocDEgPT09IHBvaW50c1sxXSAmJiBwMiA9PT0gcG9pbnRzWzJdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMF0gPSB0O1xuICAgIH0gZWxzZSBpZiAoKHAxID09PSBwb2ludHNbMF0gJiYgcDIgPT09IHBvaW50c1syXSkgfHwgKHAxID09PSBwb2ludHNbMl0gJiYgcDIgPT09IHBvaW50c1swXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzFdID0gdDtcbiAgICB9IGVsc2UgaWYgKChwMSA9PT0gcG9pbnRzWzBdICYmIHAyID09PSBwb2ludHNbMV0pIHx8IChwMSA9PT0gcG9pbnRzWzFdICYmIHAyID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1syXSA9IHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIFRyaWFuZ2xlLm1hcmtOZWlnaGJvclBvaW50ZXJzKCkgY2FsbCcpO1xuICAgIH1cbn07XG5cbi8qKlxuICogRXhoYXVzdGl2ZSBzZWFyY2ggdG8gdXBkYXRlIG5laWdoYm9yIHBvaW50ZXJzXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshVHJpYW5nbGV9IHRcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtOZWlnaGJvciA9IGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIGlmICh0LmNvbnRhaW5zUG9pbnRzKHBvaW50c1sxXSwgcG9pbnRzWzJdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMF0gPSB0O1xuICAgICAgICB0Lm1hcmtOZWlnaGJvclBvaW50ZXJzKHBvaW50c1sxXSwgcG9pbnRzWzJdLCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHQuY29udGFpbnNQb2ludHMocG9pbnRzWzBdLCBwb2ludHNbMl0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1sxXSA9IHQ7XG4gICAgICAgIHQubWFya05laWdoYm9yUG9pbnRlcnMocG9pbnRzWzBdLCBwb2ludHNbMl0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodC5jb250YWluc1BvaW50cyhwb2ludHNbMF0sIHBvaW50c1sxXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzJdID0gdDtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3JQb2ludGVycyhwb2ludHNbMF0sIHBvaW50c1sxXSwgdGhpcyk7XG4gICAgfVxufTtcblxuXG5UcmlhbmdsZS5wcm90b3R5cGUuY2xlYXJOZWlnaGJvcnMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5laWdoYm9yc19bMF0gPSBudWxsO1xuICAgIHRoaXMubmVpZ2hib3JzX1sxXSA9IG51bGw7XG4gICAgdGhpcy5uZWlnaGJvcnNfWzJdID0gbnVsbDtcbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5jbGVhckRlbGF1bmF5RWRnZXMgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMF0gPSBmYWxzZTtcbiAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMV0gPSBmYWxzZTtcbiAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMl0gPSBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9pbnQgY2xvY2t3aXNlIHRvIHRoZSBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLnBvaW50Q1cgPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1syXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1sxXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzBdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb2ludCBjb3VudGVyLWNsb2Nrd2lzZSB0byB0aGUgZ2l2ZW4gcG9pbnQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5wb2ludENDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHBvaW50c1swXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzFdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMl07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5laWdoYm9yIGNsb2Nrd2lzZSB0byBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm5laWdoYm9yQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMV07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1syXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzBdO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmVpZ2hib3IgY291bnRlci1jbG9ja3dpc2UgdG8gZ2l2ZW4gcG9pbnQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5uZWlnaGJvckNDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1syXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMV07XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUNXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXTtcbiAgICB9XG59O1xuXG4vLyBBZGRpdGlvbmFsIGNoZWNrIGZyb20gSmF2YSB2ZXJzaW9uIChzZWUgaXNzdWUgIzg4KVxuVHJpYW5nbGUucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUFjcm9zcyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl07XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLnNldENvbnN0cmFpbmVkRWRnZUNXID0gZnVuY3Rpb24ocCwgY2UpIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdID0gY2U7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdID0gY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdID0gY2U7XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLnNldENvbnN0cmFpbmVkRWRnZUNDVyA9IGZ1bmN0aW9uKHAsIGNlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXSA9IGNlO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXSA9IGNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXSA9IGNlO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXREZWxhdW5heUVkZ2VDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVsxXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMF07XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmdldERlbGF1bmF5RWRnZUNDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVsyXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMV07XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLnNldERlbGF1bmF5RWRnZUNXID0gZnVuY3Rpb24ocCwgZSkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMV0gPSBlO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsyXSA9IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzBdID0gZTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0RGVsYXVuYXlFZGdlQ0NXID0gZnVuY3Rpb24ocCwgZSkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMl0gPSBlO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVswXSA9IGU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzFdID0gZTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFRoZSBuZWlnaGJvciBhY3Jvc3MgdG8gZ2l2ZW4gcG9pbnQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJucyB7VHJpYW5nbGV9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5uZWlnaGJvckFjcm9zcyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1swXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMl07XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshVHJpYW5nbGV9IHQgVHJpYW5nbGUgb2JqZWN0LlxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5vcHBvc2l0ZVBvaW50ID0gZnVuY3Rpb24odCwgcCkge1xuICAgIHZhciBjdyA9IHQucG9pbnRDVyhwKTtcbiAgICByZXR1cm4gdGhpcy5wb2ludENXKGN3KTtcbn07XG5cbi8qKlxuICogTGVnYWxpemUgdHJpYW5nbGUgYnkgcm90YXRpbmcgY2xvY2t3aXNlIGFyb3VuZCBvUG9pbnRcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBvcG9pbnQgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtYWX0gbnBvaW50IC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBvUG9pbnQgY2FuIG5vdCBiZSBmb3VuZFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubGVnYWxpemUgPSBmdW5jdGlvbihvcG9pbnQsIG5wb2ludCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAob3BvaW50ID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgcG9pbnRzWzFdID0gcG9pbnRzWzBdO1xuICAgICAgICBwb2ludHNbMF0gPSBwb2ludHNbMl07XG4gICAgICAgIHBvaW50c1syXSA9IG5wb2ludDtcbiAgICB9IGVsc2UgaWYgKG9wb2ludCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHBvaW50c1syXSA9IHBvaW50c1sxXTtcbiAgICAgICAgcG9pbnRzWzFdID0gcG9pbnRzWzBdO1xuICAgICAgICBwb2ludHNbMF0gPSBucG9pbnQ7XG4gICAgfSBlbHNlIGlmIChvcG9pbnQgPT09IHBvaW50c1syXSkge1xuICAgICAgICBwb2ludHNbMF0gPSBwb2ludHNbMl07XG4gICAgICAgIHBvaW50c1syXSA9IHBvaW50c1sxXTtcbiAgICAgICAgcG9pbnRzWzFdID0gbnBvaW50O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5sZWdhbGl6ZSgpIGNhbGwnKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGluZGV4IG9mIGEgcG9pbnQgaW4gdGhlIHRyaWFuZ2xlLiBcbiAqIFRoZSBwb2ludCAqbXVzdCogYmUgYSByZWZlcmVuY2UgdG8gb25lIG9mIHRoZSB0cmlhbmdsZSdzIHZlcnRpY2VzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge251bWJlcn0gaW5kZXggMCwgMSBvciAyXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgcCBjYW4gbm90IGJlIGZvdW5kXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5pbmRleCA9IGZ1bmN0aW9uKHApIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHBvaW50c1swXSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1sxXSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1syXSkge1xuICAgICAgICByZXR1cm4gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgVHJpYW5nbGUuaW5kZXgoKSBjYWxsJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcDEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtYWX0gcDIgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7bnVtYmVyfSBpbmRleCAwLCAxIG9yIDIsIG9yIC0xIGlmIGVycnJvclxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuZWRnZUluZGV4ID0gZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwMSA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIGlmIChwMiA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfSBlbHNlIGlmIChwMiA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocDEgPT09IHBvaW50c1sxXSkge1xuICAgICAgICBpZiAocDIgPT09IHBvaW50c1syXSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH0gZWxzZSBpZiAocDIgPT09IHBvaW50c1swXSkge1xuICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHAxID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgaWYgKHAyID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2UgaWYgKHAyID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn07XG5cbi8qKlxuICogTWFyayBhbiBlZGdlIG9mIHRoaXMgdHJpYW5nbGUgYXMgY29uc3RyYWluZWQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gZWRnZSBpbmRleFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5SW5kZXggPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVtpbmRleF0gPSB0cnVlO1xufTtcbi8qKlxuICogTWFyayBhbiBlZGdlIG9mIHRoaXMgdHJpYW5nbGUgYXMgY29uc3RyYWluZWQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtFZGdlfSBlZGdlIGluc3RhbmNlXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlFZGdlID0gZnVuY3Rpb24oZWRnZSkge1xuICAgIHRoaXMubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzKGVkZ2UucCwgZWRnZS5xKTtcbn07XG4vKipcbiAqIE1hcmsgYW4gZWRnZSBvZiB0aGlzIHRyaWFuZ2xlIGFzIGNvbnN0cmFpbmVkLlxuICogVGhpcyBtZXRob2QgdGFrZXMgdHdvIFBvaW50IGluc3RhbmNlcyBkZWZpbmluZyB0aGUgZWRnZSBvZiB0aGUgdHJpYW5nbGUuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBxIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyA9IGZ1bmN0aW9uKHAsIHEpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzICAgICAgICBcbiAgICBpZiAoKHEgPT09IHBvaW50c1swXSAmJiBwID09PSBwb2ludHNbMV0pIHx8IChxID09PSBwb2ludHNbMV0gJiYgcCA9PT0gcG9pbnRzWzBdKSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKHEgPT09IHBvaW50c1swXSAmJiBwID09PSBwb2ludHNbMl0pIHx8IChxID09PSBwb2ludHNbMl0gJiYgcCA9PT0gcG9pbnRzWzBdKSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV0gPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKHEgPT09IHBvaW50c1sxXSAmJiBwID09PSBwb2ludHNbMl0pIHx8IChxID09PSBwb2ludHNbMl0gJiYgcCA9PT0gcG9pbnRzWzFdKSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF0gPSB0cnVlO1xuICAgIH1cbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0cyAocHVibGljIEFQSSlcblxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmdsZTtcblxufSx7XCIuL3h5XCI6MTF9XSwxMDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUHJlY2lzaW9uIHRvIGRldGVjdCByZXBlYXRlZCBvciBjb2xsaW5lYXIgcG9pbnRzXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0IHtudW1iZXJ9XG4gKiBAZGVmYXVsdFxuICovXG52YXIgRVBTSUxPTiA9IDFlLTEyO1xuZXhwb3J0cy5FUFNJTE9OID0gRVBTSUxPTjtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGVudW0ge251bWJlcn1cbiAqIEByZWFkb25seVxuICovXG52YXIgT3JpZW50YXRpb24gPSB7XG4gICAgXCJDV1wiOiAxLFxuICAgIFwiQ0NXXCI6IC0xLFxuICAgIFwiQ09MTElORUFSXCI6IDBcbn07XG5leHBvcnRzLk9yaWVudGF0aW9uID0gT3JpZW50YXRpb247XG5cblxuLyoqXG4gKiBGb3JtdWxhIHRvIGNhbGN1bGF0ZSBzaWduZWQgYXJlYTxicj5cbiAqIFBvc2l0aXZlIGlmIENDVzxicj5cbiAqIE5lZ2F0aXZlIGlmIENXPGJyPlxuICogMCBpZiBjb2xsaW5lYXI8YnI+XG4gKiA8cHJlPlxuICogQVtQMSxQMixQM10gID0gICh4MSp5MiAtIHkxKngyKSArICh4Mip5MyAtIHkyKngzKSArICh4Myp5MSAtIHkzKngxKVxuICogICAgICAgICAgICAgID0gICh4MS14MykqKHkyLXkzKSAtICh5MS15MykqKHgyLXgzKVxuICogPC9wcmU+XG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVhZfSBwYSAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYiAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYyAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge09yaWVudGF0aW9ufVxuICovXG5mdW5jdGlvbiBvcmllbnQyZChwYSwgcGIsIHBjKSB7XG4gICAgdmFyIGRldGxlZnQgPSAocGEueCAtIHBjLngpICogKHBiLnkgLSBwYy55KTtcbiAgICB2YXIgZGV0cmlnaHQgPSAocGEueSAtIHBjLnkpICogKHBiLnggLSBwYy54KTtcbiAgICB2YXIgdmFsID0gZGV0bGVmdCAtIGRldHJpZ2h0O1xuICAgIGlmICh2YWwgPiAtKEVQU0lMT04pICYmIHZhbCA8IChFUFNJTE9OKSkge1xuICAgICAgICByZXR1cm4gT3JpZW50YXRpb24uQ09MTElORUFSO1xuICAgIH0gZWxzZSBpZiAodmFsID4gMCkge1xuICAgICAgICByZXR1cm4gT3JpZW50YXRpb24uQ0NXO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBPcmllbnRhdGlvbi5DVztcbiAgICB9XG59XG5leHBvcnRzLm9yaWVudDJkID0gb3JpZW50MmQ7XG5cblxuLyoqXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVhZfSBwYSAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYiAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYyAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwZCAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGluU2NhbkFyZWEocGEsIHBiLCBwYywgcGQpIHtcbiAgICB2YXIgb2FkYiA9IChwYS54IC0gcGIueCkgKiAocGQueSAtIHBiLnkpIC0gKHBkLnggLSBwYi54KSAqIChwYS55IC0gcGIueSk7XG4gICAgaWYgKG9hZGIgPj0gLUVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvYWRjID0gKHBhLnggLSBwYy54KSAqIChwZC55IC0gcGMueSkgLSAocGQueCAtIHBjLngpICogKHBhLnkgLSBwYy55KTtcbiAgICBpZiAob2FkYyA8PSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLmluU2NhbkFyZWEgPSBpblNjYW5BcmVhO1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGFuZ2xlIGJldHdlZW4gKHBhLHBiKSBhbmQgKHBhLHBjKSBpcyBvYnR1c2UgaS5lLiAoYW5nbGUgPiDPgC8yIHx8IGFuZ2xlIDwgLc+ALzIpXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVhZfSBwYSAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYiAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYyAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5nbGUgaXMgb2J0dXNlXG4gKi9cbmZ1bmN0aW9uIGlzQW5nbGVPYnR1c2UocGEsIHBiLCBwYykge1xuICAgIHZhciBheCA9IHBiLnggLSBwYS54O1xuICAgIHZhciBheSA9IHBiLnkgLSBwYS55O1xuICAgIHZhciBieCA9IHBjLnggLSBwYS54O1xuICAgIHZhciBieSA9IHBjLnkgLSBwYS55O1xuICAgIHJldHVybiAoYXggKiBieCArIGF5ICogYnkpIDwgMDtcbn1cbmV4cG9ydHMuaXNBbmdsZU9idHVzZSA9IGlzQW5nbGVPYnR1c2U7XG5cblxufSx7fV0sMTE6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG9wZXJhdGUgb24gXCJQb2ludFwiIG9yIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fSxcbiAqIGFzIGRlZmluZWQgYnkgdGhlIHtAbGluayBYWX0gdHlwZVxuICogKFtkdWNrIHR5cGluZ117QGxpbmsgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EdWNrX3R5cGluZ30pLlxuICogQG1vZHVsZVxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIHBvbHkydHJpLmpzIHN1cHBvcnRzIHVzaW5nIGN1c3RvbSBwb2ludCBjbGFzcyBpbnN0ZWFkIG9mIHtAbGlua2NvZGUgUG9pbnR9LlxuICogQW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIDxjb2RlPnt4LCB5fTwvY29kZT4gYXR0cmlidXRlcyBpcyBzdXBwb3J0ZWRcbiAqIHRvIGluaXRpYWxpemUgdGhlIFN3ZWVwQ29udGV4dCBwb2x5bGluZXMgYW5kIHBvaW50c1xuICogKFtkdWNrIHR5cGluZ117QGxpbmsgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9EdWNrX3R5cGluZ30pLlxuICpcbiAqIHBvbHkydHJpLmpzIG1pZ2h0IGFkZCBleHRyYSBmaWVsZHMgdG8gdGhlIHBvaW50IG9iamVjdHMgd2hlbiBjb21wdXRpbmcgdGhlXG4gKiB0cmlhbmd1bGF0aW9uIDogdGhleSBhcmUgcHJlZml4ZWQgd2l0aCA8Y29kZT5fcDJ0XzwvY29kZT4gdG8gYXZvaWQgY29sbGlzaW9uc1xuICogd2l0aCBmaWVsZHMgaW4gdGhlIGN1c3RvbSBjbGFzcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgY29udG91ciA9IFt7eDoxMDAsIHk6MTAwfSwge3g6MTAwLCB5OjMwMH0sIHt4OjMwMCwgeTozMDB9LCB7eDozMDAsIHk6MTAwfV07XG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKlxuICogQHR5cGVkZWYge09iamVjdH0gWFlcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB4IC0geCBjb29yZGluYXRlXG4gKiBAcHJvcGVydHkge251bWJlcn0geSAtIHkgY29vcmRpbmF0ZVxuICovXG5cblxuLyoqXG4gKiBQb2ludCBwcmV0dHkgcHJpbnRpbmcgOiBwcmludHMgeCBhbmQgeSBjb29yZGluYXRlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgIHh5LnRvU3RyaW5nQmFzZSh7eDo1LCB5OjQyfSlcbiAqICAgICAgLy8g4oaSIFwiKDU7NDIpXCJcbiAqIEBwcm90ZWN0ZWRcbiAqIEBwYXJhbSB7IVhZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm5zIHtzdHJpbmd9IDxjb2RlPlwiKHg7eSlcIjwvY29kZT5cbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmdCYXNlKHApIHtcbiAgICByZXR1cm4gKFwiKFwiICsgcC54ICsgXCI7XCIgKyBwLnkgKyBcIilcIik7XG59XG5cbi8qKlxuICogUG9pbnQgcHJldHR5IHByaW50aW5nLiBEZWxlZ2F0ZXMgdG8gdGhlIHBvaW50J3MgY3VzdG9tIFwidG9TdHJpbmcoKVwiIG1ldGhvZCBpZiBleGlzdHMsXG4gKiBlbHNlIHNpbXBseSBwcmludHMgeCBhbmQgeSBjb29yZGluYXRlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgIHh5LnRvU3RyaW5nKHt4OjUsIHk6NDJ9KVxuICogICAgICAvLyDihpIgXCIoNTs0MilcIlxuICogQGV4YW1wbGVcbiAqICAgICAgeHkudG9TdHJpbmcoe3g6NSx5OjQyLHRvU3RyaW5nOmZ1bmN0aW9uKCkge3JldHVybiB0aGlzLngrXCI6XCIrdGhpcy55O319KVxuICogICAgICAvLyDihpIgXCI1OjQyXCJcbiAqIEBwYXJhbSB7IVhZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm5zIHtzdHJpbmd9IDxjb2RlPlwiKHg7eSlcIjwvY29kZT5cbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcocCkge1xuICAgIC8vIFRyeSBhIGN1c3RvbSB0b1N0cmluZyBmaXJzdCwgYW5kIGZhbGxiYWNrIHRvIG93biBpbXBsZW1lbnRhdGlvbiBpZiBub25lXG4gICAgdmFyIHMgPSBwLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIChzID09PSAnW29iamVjdCBPYmplY3RdJyA/IHRvU3RyaW5nQmFzZShwKSA6IHMpO1xufVxuXG5cbi8qKlxuICogQ29tcGFyZSB0d28gcG9pbnRzIGNvbXBvbmVudC13aXNlLiBPcmRlcmVkIGJ5IHkgYXhpcyBmaXJzdCwgdGhlbiB4IGF4aXMuXG4gKiBAcGFyYW0geyFYWX0gYSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtudW1iZXJ9IDxjb2RlPiZsdDsgMDwvY29kZT4gaWYgPGNvZGU+YSAmbHQ7IGI8L2NvZGU+LFxuICogICAgICAgICA8Y29kZT4mZ3Q7IDA8L2NvZGU+IGlmIDxjb2RlPmEgJmd0OyBiPC9jb2RlPiwgXG4gKiAgICAgICAgIDxjb2RlPjA8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgaWYgKGEueSA9PT0gYi55KSB7XG4gICAgICAgIHJldHVybiBhLnggLSBiLng7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGEueSAtIGIueTtcbiAgICB9XG59XG5cbi8qKlxuICogVGVzdCB0d28gUG9pbnQgb2JqZWN0cyBmb3IgZXF1YWxpdHkuXG4gKiBAcGFyYW0geyFYWX0gYSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSA8Y29kZT5UcnVlPC9jb2RlPiBpZiA8Y29kZT5hID09IGI8L2NvZGU+LCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICB0b1N0cmluZzogdG9TdHJpbmcsXG4gICAgdG9TdHJpbmdCYXNlOiB0b1N0cmluZ0Jhc2UsXG4gICAgY29tcGFyZTogY29tcGFyZSxcbiAgICBlcXVhbHM6IGVxdWFsc1xufTtcblxufSx7fV19LHt9LFs2XSlcbig2KVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdE1PVkVfVE86IDEsXG5cdExJTkVfVE86IDIsXG5cdEJFWklFUl9UTzogMyxcblx0UVVBRFJBX1RPOiA0LFxuXHRBUkM6IDUsXG5cdEVMTElQU0U6IDZcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRkZWZpbml0aW9uOiAxLFxuXHR3b3JsZFdpZHRoOiAxNTAsXG5cdG11bHRpQ2FudmFzOiB0cnVlLFxuXHR3aW5kOiA1LFxuXHRkZWJ1ZzogZmFsc2UsXG5cdGdyYXZpdHk6IFswLCAtOS44XSxcblx0Z3JvdXBzOlxuXHR7XG5cdFx0ZGVmYXVsdDogeyBmaXhlZDogdHJ1ZSwgcGh5c2ljczogeyBib2R5VHlwZTogJ2dob3N0JyB9IH0sXG5cdFx0Z2hvc3Q6IHsgZml4ZWQ6IHRydWUsIHBoeXNpY3M6IHsgYm9keVR5cGU6ICdnaG9zdCcgfSB9LFxuXHRcdG1ldGFsOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDEwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzdG9uZTpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiA1LFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR3b29kOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDEsXG5cdFx0XHRcdGJvZHlUeXBlOiAnaGFyZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGJhbGxvb246XG5cdFx0e1xuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0bWFzczogMC4wMSxcblx0XHRcdFx0Z3Jhdml0eVNjYWxlOiAtMTUsXG5cdFx0XHRcdGJvZHlUeXBlOiAnaGFyZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRyZWU6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAndHJpYW5ndWxhdGUnLFxuXHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0am9pbnRzOlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkaXN0YW5jZUNvbnN0cmFpbnQ6IG51bGwsXG5cdFx0XHRcdFx0XHRsb2NrQ29uc3RyYWludDpcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwMCxcblx0XHRcdFx0XHRcdFx0cmVsYXhhdGlvbjogMC45XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiA1LFxuXHRcdFx0XHRkYW1waW5nOiAwLjgsXG5cdFx0XHRcdHN0cnVjdHVyYWxNYXNzRGVjYXk6IDMsXG5cdFx0XHRcdGJvZHlUeXBlOiAnc29mdCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdGZsb3JhOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2xpbmUnLFxuXHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0am9pbnRzOlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRkaXN0YW5jZUNvbnN0cmFpbnQ6IG51bGwsXG5cdFx0XHRcdFx0XHRsb2NrQ29uc3RyYWludDpcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRyZWxheGF0aW9uOiAxXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAwLjEsXG5cdFx0XHRcdHN0cnVjdHVyYWxNYXNzRGVjYXk6IDMsXG5cdFx0XHRcdGJvZHlUeXBlOiAnc29mdCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJ1YmJlcjpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICd0cmlhbmd1bGF0ZScsXG5cdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRqb2ludHM6IHtcblx0XHRcdFx0XHRkZWZhdWx0OiB7XG5cdFx0XHRcdFx0XHRkaXN0YW5jZUNvbnN0cmFpbnQ6XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHN0aWZmbmVzczogMTAwMDAwLFxuXHRcdFx0XHRcdFx0XHRyZWxheGF0aW9uOiAxXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ3NvZnQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRqZWxseTpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICdoZXhhRmlsbCcsXG5cdFx0XHRpbm5lclN0cnVjdHVyZURlZjogMC4wMSxcblx0XHRcdG5vZGVSYWRpdXM6IDAuMSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGpvaW50czpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzdGlmZm5lc3M6IDEwMDAwLFxuXHRcdFx0XHRcdFx0XHRyZWxheGF0aW9uOiAzMFxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0bWFzczogMSxcblx0XHRcdFx0Ym9keVR5cGU6ICdzb2Z0J1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bGlxdWlkOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2hleGFGaWxsJyxcblx0XHRcdGlubmVyU3RydWN0dXJlRGVmOiAwLjAyLFxuXHRcdFx0bm9kZVJhZGl1czogMC44LFxuXHRcdFx0ZHJhd05vZGVzU2VwYXJhdGVseTogdHJ1ZSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGpvaW50czpcblx0XHRcdFx0e1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAwLjEsXG5cdFx0XHRcdG1hdGVyaWFsOiAnbGlxdWlkJyxcblx0XHRcdFx0Ym9keVR5cGU6ICdzb2Z0J1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cm9wZTpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICdsaW5lJyxcblx0XHRcdG5vZGVSYWRpdXM6IDAuMSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGpvaW50czpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzdGlmZm5lc3M6IDEwMDAsXG5cdFx0XHRcdFx0XHRcdHJlbGF4YXRpb246IDFcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1hc3M6IDEsXG5cdFx0XHRcdGJvZHlUeXBlOiAnc29mdCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHN0YXRpYzpcblx0XHR7XG5cdFx0XHRmaXhlZDogdHJ1ZSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDAsXG5cdFx0XHRcdGJvZHlUeXBlOiAnaGFyZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdG5vQ29sbGlkZTpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnLFxuXHRcdFx0XHRub0NvbGxpZGU6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxlYXZlczpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAwLjAwMSxcblx0XHRcdFx0Z3Jhdml0eVNjYWxlOiAwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnLFxuXHRcdFx0XHRub0NvbGxpZGU6IHRydWVcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdG1hdGVyaWFsczpcblx0e1xuXHRcdGRlZmF1bHQ6XG5cdFx0e1xuXHRcdFx0Ym91bmNpbmVzczogMSxcblx0XHRcdGZyaWN0aW9uOiAwLjVcblx0XHR9LFxuXHRcdHJ1YmJlcjpcblx0XHR7XG5cdFx0XHRib3VuY2luZXNzOiAwLFxuXHRcdFx0ZnJpY3Rpb246IDEwMFxuXHRcdH0sXG5cdFx0bGlxdWlkOlxuXHRcdHtcblx0XHRcdGJvdW5jaW5lc3M6IDEwMDAsXG5cdFx0XHRmcmljdGlvbjogMFxuXHRcdH1cblx0fSxcblx0Y29uc3RyYWludHM6XG5cdHtcblx0XHRkZWZhdWx0OlxuXHRcdHtcblx0XHRcdGxvY2tDb25zdHJhaW50OlxuXHRcdFx0e1xuXHRcdFx0XHRzdGlmZm5lc3M6IDEwMDAwMDAwMDAwMDAwLFxuXHRcdFx0XHRyZWxheGF0aW9uOiAwLFxuXHRcdFx0XHRjb2xsaWRlQ29ubmVjdGVkOiBmYWxzZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0YXhpczpcblx0XHR7XG5cdFx0XHRyZXZvbHV0ZUNvbnN0cmFpbnQ6XG5cdFx0XHR7XG5cdFx0XHRcdHN0aWZmbmVzczogSW5maW5pdHksXG5cdFx0XHRcdHJlbGF4YXRpb246IDAsXG5cdFx0XHRcdG1vdG9yOiBmYWxzZSxcblx0XHRcdFx0Y29sbGlkZUNvbm5lY3RlZDogZmFsc2Vcblx0XHRcdH1cblx0XHR9LFxuXHRcdHdpcmU6XG5cdFx0e1xuXHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0e1xuXHRcdFx0XHRzdGlmZm5lc3M6IDEwMDAsXG5cdFx0XHRcdHJlbGF4YXRpb246IDFcblx0XHRcdH1cblx0XHR9LFxuXHRcdHNwcmluZzpcblx0XHR7XG5cdFx0XHRkaXN0YW5jZUNvbnN0cmFpbnQ6XG5cdFx0XHR7XG5cdFx0XHRcdHN0aWZmbmVzczogMTAwMDAwLFxuXHRcdFx0XHRyZWxheGF0aW9uOiAwXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRjb250aW51b3VzTW90b3I6XG5cdFx0e1xuXHRcdFx0cmV2b2x1dGVDb25zdHJhaW50OlxuXHRcdFx0e1xuXHRcdFx0XHRtb3RvcjogdHJ1ZSxcblx0XHRcdFx0Y29udGludW91c01vdG9yOiB0cnVlLFxuXHRcdFx0XHRtb3RvclBvd2VyOiA0XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJ2YXIgRHJhd2luZ0NvbW1hbmQgPSBmdW5jdGlvbiAoJG5hbWUsICRub2RlLCAkaW5zdHJ1Y3Rpb25zKVxue1xuXHR0aGlzLm5vZGUgPSAkbm9kZTtcblx0dGhpcy5uYW1lID0gJG5hbWU7XG5cdGlmICgkaW5zdHJ1Y3Rpb25zKVxuXHR7XG5cdFx0dGhpcy5wb2ludCA9ICRpbnN0cnVjdGlvbnMucG9pbnQ7XG5cdFx0dGhpcy5vcHRpb25zID0gJGluc3RydWN0aW9ucy5vcHRpb25zO1xuXHR9XG5cdHRoaXMucHJvcGVydGllcyA9IHt9O1xufTtcblxuRHJhd2luZ0NvbW1hbmQucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKVxue1xuXHRyZXR1cm4gdGhpcy5ub2RlLnBoeXNpY3NNYW5hZ2VyLmdldFgoKTtcbn07XG5cbkRyYXdpbmdDb21tYW5kLnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMubm9kZS5waHlzaWNzTWFuYWdlci5nZXRZKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERyYXdpbmdDb21tYW5kO1xuIiwidmFyIEdyaWQgPVxue1xuXHRpbml0OiBmdW5jdGlvbiAoJGdyYXBoKVxuXHR7XG5cdFx0dGhpcy5fZ3JhcGggPSAkZ3JhcGg7XG5cdFx0dmFyIG5vZGVzQXJyYXkgPSB0aGlzLl9ub2Rlc0FycmF5ID0gW107XG5cdFx0dGhpcy5fZ3JhcGguZm9yRWFjaChmdW5jdGlvbiAoJGxpbmUpXG5cdFx0e1xuXHRcdFx0aWYgKCRsaW5lKVxuXHRcdFx0e1xuXHRcdFx0XHQkbGluZS5mb3JFYWNoKGZ1bmN0aW9uICgkbm9kZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgkbm9kZSkgeyBub2Rlc0FycmF5LnB1c2goJG5vZGUpOyB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdGNyZWF0ZUZyb21Qb2x5Z29uOiBmdW5jdGlvbiAoJHBvbHlnb24sICRkZWYsICRoZXhhKVxuXHR7XG5cdFx0dmFyIGJvdW5kaW5nQm94ID0gJHBvbHlnb24uZ2V0Qm91bmRpbmdCb3goKTtcblxuXHRcdHZhciBkZWYgPSAkZGVmO1xuXHRcdC8vdmFyIGRlZiA9IHdpZHRoIC8gJGRlZjtcblx0XHR2YXIgdG9SZXR1cm4gPSBbXTtcblx0XHR2YXIgeUluYyA9ICRoZXhhID8gZGVmICogKE1hdGguc3FydCgzKSAvIDIpIDogZGVmO1xuXHRcdHZhciBoYWxmRGVmID0gZGVmICogMC41O1xuXHRcdGZvciAodmFyIHlQb3MgPSBib3VuZGluZ0JveFswXVsxXTsgeVBvcyA8PSBib3VuZGluZ0JveFsxXVsxXTsgeVBvcyArPSB5SW5jKVxuXHRcdHtcblx0XHRcdHZhciBsaW5lID0gW107XG5cdFx0XHQvL3ZhciBpbnRlcnNlY3Rpb25zID0gJHBvbHlnb24uZ2V0SW50ZXJzZWN0aW9uc0F0WSh5UG9zKTtcblx0XHRcdHZhciB4UG9zID0gYm91bmRpbmdCb3hbMF1bMF07XG5cdFx0XHR4UG9zID0gKCRoZXhhICYmIHRvUmV0dXJuLmxlbmd0aCAlIDIgIT09IDApID8geFBvcyArIGhhbGZEZWYgOiB4UG9zO1xuXHRcdFx0Zm9yICh4UG9zOyB4UG9zIDw9IGJvdW5kaW5nQm94WzFdWzBdICsgaGFsZkRlZjsgeFBvcyArPSBkZWYpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICgkcG9seWdvbi5pc0luc2lkZShbeFBvcywgeVBvc10pKSB7IGxpbmUucHVzaChbeFBvcywgeVBvc10pOyB9XG5cdFx0XHRcdGVsc2UgeyBsaW5lLnB1c2gobnVsbCk7IH1cblx0XHRcdH1cblx0XHRcdHRvUmV0dXJuLnB1c2gobGluZSk7XG5cdFx0fVxuXHRcdHJldHVybiBPYmplY3QuY3JlYXRlKEdyaWQpLmluaXQodG9SZXR1cm4pO1xuXHR9LFxuXG5cdGdldEdyYXBoOiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9ncmFwaDsgfSxcblxuXHRnZXROb2Rlc0FycmF5OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9ub2Rlc0FycmF5OyB9LFxuXG5cdGdldENsb3Nlc3Q6IGZ1bmN0aW9uICgkeCwgJHksICRzaXplKVxuXHR7XG5cdFx0dmFyIHNpemUgPSAkc2l6ZSB8fCAxO1xuXHRcdHZhciBjbG9zZXN0ID0gdGhpcy5fbm9kZXNBcnJheS5jb25jYXQoKTtcblx0XHRjbG9zZXN0LnNvcnQoZnVuY3Rpb24gKCRhLCAkYilcblx0XHR7XG5cdFx0XHRpZiAoJGEgPT09IG51bGwgfHwgJGIgPT09IG51bGwpIHsgcmV0dXJuIHRydWU7IH1cblx0XHRcdHZhciBzaWRlWDEgPSBNYXRoLmFicygkYVswXSAtICR4KTtcblx0XHRcdHZhciBzaWRlWTEgPSBNYXRoLmFicygkYVsxXSAtICR5KTtcblx0XHRcdHZhciBkaXN0MSA9IE1hdGguc3FydChzaWRlWDEgKiBzaWRlWDEgKyBzaWRlWTEgKiBzaWRlWTEpO1xuXG5cdFx0XHR2YXIgc2lkZVgyID0gTWF0aC5hYnMoJGJbMF0gLSAkeCk7XG5cdFx0XHR2YXIgc2lkZVkyID0gTWF0aC5hYnMoJGJbMV0gLSAkeSk7XG5cdFx0XHR2YXIgZGlzdDIgPSBNYXRoLnNxcnQoc2lkZVgyICogc2lkZVgyICsgc2lkZVkyICogc2lkZVkyKTtcblxuXHRcdFx0cmV0dXJuIGRpc3QxIC0gZGlzdDI7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGNsb3Nlc3Quc2xpY2UoMCwgc2l6ZSk7XG5cdH0sXG5cblx0Z2V0TmVpZ2hib3VyczogZnVuY3Rpb24gKCR4LCAkeSwgJHJldHVybkVtcHR5KVxuXHR7XG5cdFx0dmFyIHRvUmV0dXJuID0gW107XG5cdFx0dmFyIGdyYXBoID0gdGhpcy5fZ3JhcGg7XG5cdFx0dmFyIGV2ZW4gPSAkeSAlIDIgPiAwO1xuXHRcdHZhciBsZWZ0ID0gZXZlbiA/ICR4IDogJHggLSAxO1xuXHRcdHZhciByaWdodCA9IGV2ZW4gPyAkeCArIDEgOiAkeDtcblxuXHRcdHZhciBORSA9IGdyYXBoWyR5IC0gMV0gJiYgZ3JhcGhbJHkgLSAxXVtyaWdodF0gPyBncmFwaFskeSAtIDFdW3JpZ2h0XSA6IG51bGw7XG5cdFx0dmFyIEUgPSBncmFwaFskeSArIDBdICYmIGdyYXBoWyR5ICsgMF1bJHggKyAxXSA/IGdyYXBoWyR5XVskeCArIDFdIDogbnVsbDtcblx0XHR2YXIgU0UgPSBncmFwaFskeSArIDFdICYmIGdyYXBoWyR5ICsgMV1bcmlnaHRdID8gZ3JhcGhbJHkgKyAxXVtyaWdodF0gOiBudWxsO1xuXHRcdHZhciBTVyA9IGdyYXBoWyR5ICsgMV0gJiYgZ3JhcGhbJHkgKyAxXVtsZWZ0XSA/IGdyYXBoWyR5ICsgMV1bbGVmdF0gOiBudWxsO1xuXHRcdHZhciBXID0gZ3JhcGhbJHkgKyAwXSAmJiBncmFwaFskeSArIDBdWyR4IC0gMV0gPyBncmFwaFskeV1bJHggLSAxXSA6IG51bGw7XG5cdFx0dmFyIE5XID0gZ3JhcGhbJHkgLSAxXSAmJiBncmFwaFskeSAtIDFdW2xlZnRdID8gZ3JhcGhbJHkgLSAxXVtsZWZ0XSA6IG51bGw7XG5cblx0XHRpZiAoTkUgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goTkUpOyB9XG5cdFx0aWYgKEUgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goRSk7IH1cblx0XHRpZiAoU0UgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goU0UpOyB9XG5cdFx0aWYgKFNXIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKFNXKTsgfVxuXHRcdGlmIChXIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKFcpOyB9XG5cdFx0aWYgKE5XIHx8ICRyZXR1cm5FbXB0eSkgeyB0b1JldHVybi5wdXNoKE5XKTsgfVxuXG5cdFx0cmV0dXJuIHRvUmV0dXJuO1xuXHR9LFxuXG5cdGdldE5ldHdvcms6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHR2YXIgbmV0d29yayA9IFtdO1xuXHRcdHZhciB2aXNpdGVkID0gW107XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciByb3dzTGVuZ3RoID0gZ3JhcGgubGVuZ3RoO1xuXHRcdGZvciAoaTsgaSA8IHJvd3NMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgayA9IDA7XG5cdFx0XHR2YXIgcG9pbnRzTGVuZ3RoID0gZ3JhcGhbaV0ubGVuZ3RoO1xuXHRcdFx0Zm9yIChrOyBrIDwgcG9pbnRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBjdXJyUG9pbnQgPSBncmFwaFtpXVtrXTtcblx0XHRcdFx0aWYgKGN1cnJQb2ludClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyUG9pbnROZWlnaGJvdXJzID0gdGhpcy5nZXROZWlnaGJvdXJzKGssIGkpO1xuXHRcdFx0XHRcdGZvciAodmFyIG0gPSAwLCBuZWlnaGJvdXJzTGVuZ3RoID0gY3VyclBvaW50TmVpZ2hib3Vycy5sZW5ndGg7IG0gPCBuZWlnaGJvdXJzTGVuZ3RoOyBtICs9IDEpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIGN1cnJOZWlnaCA9IGN1cnJQb2ludE5laWdoYm91cnNbbV07XG5cdFx0XHRcdFx0XHRpZiAoY3Vyck5laWdoICYmIHZpc2l0ZWQuaW5kZXhPZihjdXJyTmVpZ2gpID09PSAtMSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmV0d29yay5wdXNoKFtjdXJyUG9pbnQsIGN1cnJOZWlnaF0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2aXNpdGVkLnB1c2goY3VyclBvaW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV0d29yaztcblx0fSxcblxuXHRnZXRPdXRsaW5lOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLm91dGxpbmUpXG5cdFx0e1xuXHRcdFx0dmFyIGdyYXBoID0gdGhpcy5fZ3JhcGg7XG5cdFx0XHR2YXIgb3V0bGluZUdyYXBoID0gW107XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgcm93c0xlbmd0aCA9IGdyYXBoLmxlbmd0aDsgaSA8IHJvd3NMZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0b3V0bGluZUdyYXBoW2ldID0gW107XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBwb2ludHNMZW5ndGggPSBncmFwaFtpXS5sZW5ndGg7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGdyYXBoW2ldW2tdO1xuXHRcdFx0XHRcdG91dGxpbmVHcmFwaFtpXVtrXSA9IG51bGw7XG5cdFx0XHRcdFx0aWYgKHBvaW50KVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHZhciBpc0VkZ2UgPSB0aGlzLmdldE5laWdoYm91cnMoaywgaSkubGVuZ3RoIDwgNjtcblx0XHRcdFx0XHRcdGlmIChpc0VkZ2UpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdG91dGxpbmVHcmFwaFtpXVtrXSA9IFtrLCBpXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMub3V0bGluZSA9IE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdChvdXRsaW5lR3JhcGgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLm91dGxpbmU7XG5cdH0sXG5cblx0Z2V0U2hhcGVQYXRoOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHBhdGggPSBbXTtcblx0XHR2YXIgY3VycmVudE91dGxpbmUgPSB0aGlzLmdldE91dGxpbmVzKClbMF07XG5cdFx0dmFyIG91dGxpbmVHcmFwaCA9IGN1cnJlbnRPdXRsaW5lLmdldEdyYXBoKCk7XG5cdFx0dmFyIGdldFN0YXJ0aW5nSW5kZXggPSBmdW5jdGlvbiAoKVxuXHRcdHtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvdXRsaW5lR3JhcGgubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICghb3V0bGluZUdyYXBoW2ldKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBwb2ludHNMZW5ndGggPSBvdXRsaW5lR3JhcGhbaV0ubGVuZ3RoOyBrIDwgcG9pbnRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgY3VyclBvaW50ID0gb3V0bGluZUdyYXBoW2ldW2tdO1xuXHRcdFx0XHRcdC8vIGlmIChjdXJyUG9pbnQpXG5cdFx0XHRcdFx0Ly8ge1xuXHRcdFx0XHRcdC8vIFx0Y29uc29sZS5sb2coY3VyclBvaW50LCBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKSk7XG5cdFx0XHRcdFx0Ly8gfVxuXHRcdFx0XHRcdGlmIChjdXJyUG9pbnQgJiYgY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycyhjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSkubGVuZ3RoID09PSAyKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHJldHVybiBjdXJyUG9pbnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciB2aXNpdGVkID0gW107XG5cdFx0dmFyIHN0YXJ0aW5nSW5kZXggPSBnZXRTdGFydGluZ0luZGV4LmNhbGwodGhpcyk7XG5cdFx0aWYgKCFzdGFydGluZ0luZGV4KSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGdldEFuZ2xlID0gZnVuY3Rpb24gKCRpbmRleClcblx0XHR7XG5cdFx0XHR2YXIgYW5nbGUgPSAoJGluZGV4ICsgMSkgKiA2MDtcblx0XHRcdGFuZ2xlID0gYW5nbGUgPT09IDAgPyAzNjAgOiBhbmdsZTtcblx0XHRcdHJldHVybiBhbmdsZTtcblx0XHR9O1xuXHRcdHZhciBnZXROZWlnaGJvdXJJbmRleCA9IGZ1bmN0aW9uICgkcG9pbnQsICRuZWlnaGJvdXIpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoJHBvaW50WzBdLCAkcG9pbnRbMV0sIHRydWUpLmluZGV4T2YoJG5laWdoYm91cik7XG5cdFx0fTtcblxuXHRcdHZhciBuZXh0ID0gY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycyhzdGFydGluZ0luZGV4WzBdLCBzdGFydGluZ0luZGV4WzFdKVswXTtcblx0XHR2YXIgbGFzdEFuZ2xlID0gZ2V0QW5nbGUoZ2V0TmVpZ2hib3VySW5kZXgoc3RhcnRpbmdJbmRleCwgbmV4dCkpO1xuXHRcdHZhciBjdXJySW5kZXggPSBuZXh0O1xuXHRcdHBhdGgucHVzaCh0aGlzLl9ncmFwaFtzdGFydGluZ0luZGV4WzFdXVtzdGFydGluZ0luZGV4WzBdXSk7XG5cdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW25leHRbMV1dW25leHRbMF1dKTtcblx0XHR2aXNpdGVkLnB1c2goc3RhcnRpbmdJbmRleCk7XG5cblx0XHR2YXIgYmVzdDtcblx0XHR2YXIgbmVpZ2hib3Vycztcblx0XHR2YXIgYmVzdEFuZ2xlO1xuXHRcdHZhciBvdXRsaW5lTm9kZXNBcnJheSA9IGN1cnJlbnRPdXRsaW5lLmdldE5vZGVzQXJyYXkoKTtcblx0XHR2YXIgb3V0bGluZVBvaW50c0xlbmd0aCA9IG91dGxpbmVOb2Rlc0FycmF5Lmxlbmd0aDtcblxuXHRcdHdoaWxlICh2aXNpdGVkLmxlbmd0aCA8IG91dGxpbmVQb2ludHNMZW5ndGggLSAxKS8vY3VyckluZGV4ICE9PSBzdGFydGluZ0luZGV4KVxuXHRcdHtcblx0XHRcdG5laWdoYm91cnMgPSBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJJbmRleFswXSwgY3VyckluZGV4WzFdKTtcblx0XHRcdHZhciBiZXN0U2NvcmUgPSAwO1xuXHRcdFx0YmVzdCA9IHVuZGVmaW5lZDtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5laWdoYm91cnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBjdXJyTmVpZ2ggPSBuZWlnaGJvdXJzW2ldO1xuXHRcdFx0XHR2YXIgY3VyclNjb3JlID0gMDtcblx0XHRcdFx0dmFyIGN1cnJBbmdsZSA9IGdldEFuZ2xlKGdldE5laWdoYm91ckluZGV4KGN1cnJJbmRleCwgY3Vyck5laWdoKSk7XG5cdFx0XHRcdGN1cnJTY29yZSA9IGN1cnJBbmdsZSAtIGxhc3RBbmdsZTtcblx0XHRcdFx0aWYgKGN1cnJTY29yZSA+IDE4MCkgeyBjdXJyU2NvcmUgPSBjdXJyU2NvcmUgLSAzNjA7IH1cblx0XHRcdFx0aWYgKGN1cnJTY29yZSA8IC0xODApIHsgY3VyclNjb3JlID0gY3VyclNjb3JlICsgMzYwOyB9XG5cdFx0XHRcdHZhciBuZWlnaEluZGV4ID0gdmlzaXRlZC5pbmRleE9mKGN1cnJOZWlnaCk7XG5cdFx0XHRcdGlmIChuZWlnaEluZGV4ICE9PSAtMSkgeyBjdXJyU2NvcmUgPSBuZWlnaEluZGV4IC8gdmlzaXRlZC5sZW5ndGggKiAxMDAwMCArIDEwMDAwICsgY3VyclNjb3JlOyB9XG5cdFx0XHRcdGlmICghYmVzdCB8fCBjdXJyU2NvcmUgPCBiZXN0U2NvcmUpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiZXN0U2NvcmUgPSBjdXJyU2NvcmU7XG5cdFx0XHRcdFx0YmVzdCA9IGN1cnJOZWlnaDtcblx0XHRcdFx0XHRiZXN0QW5nbGUgPSBjdXJyQW5nbGU7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxhc3RBbmdsZSA9IGJlc3RBbmdsZTtcblx0XHRcdGlmICh2aXNpdGVkLmluZGV4T2YoY3VyckluZGV4KSAhPT0gLTEpIHsgdmlzaXRlZC5zcGxpY2UodmlzaXRlZC5pbmRleE9mKGN1cnJJbmRleCksIDEpOyB9XG5cdFx0XHR2aXNpdGVkLnB1c2goY3VyckluZGV4KTtcblx0XHRcdGN1cnJJbmRleCA9IGJlc3Q7XG5cblx0XHRcdHBhdGgucHVzaCh0aGlzLl9ncmFwaFtjdXJySW5kZXhbMV1dW2N1cnJJbmRleFswXV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcGF0aDtcblx0fSxcblxuXHRnZXRPdXRsaW5lczogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciB0b1JldHVybiA9IFtdO1xuXHRcdHZhciBjdXJyZW50R3JhcGg7XG5cdFx0dmFyIG91dGxpbmUgPSB0aGlzLmdldE91dGxpbmUoKTtcblx0XHR2YXIgcmVtYWluaW5nID0gb3V0bGluZS5nZXROb2Rlc0FycmF5KCkuY29uY2F0KCk7XG5cblx0XHR2YXIgcmVjdXIgPSBmdW5jdGlvbiAoJHBvaW50KVxuXHRcdHtcblx0XHRcdGN1cnJlbnRHcmFwaFskcG9pbnRbMV1dID0gY3VycmVudEdyYXBoWyRwb2ludFsxXV0gfHwgW107XG5cdFx0XHRjdXJyZW50R3JhcGhbJHBvaW50WzFdXVskcG9pbnRbMF1dID0gJHBvaW50O1xuXHRcdFx0dmFyIG5laWdoYm91cnMgPSBvdXRsaW5lLmdldE5laWdoYm91cnMoJHBvaW50WzBdLCAkcG9pbnRbMV0pO1xuXHRcdFx0cmVtYWluaW5nLnNwbGljZShyZW1haW5pbmcuaW5kZXhPZigkcG9pbnQpLCAxKTtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBuZWlnaGJvdXJzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgbmVpZ2ggPSBuZWlnaGJvdXJzW2ldO1xuXHRcdFx0XHRpZiAocmVtYWluaW5nLmluZGV4T2YobmVpZ2gpICE9PSAtMSkgeyByZWN1cihuZWlnaCk7IH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0d2hpbGUgKHJlbWFpbmluZy5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0Y3VycmVudEdyYXBoID0gW107XG5cdFx0XHR2YXIgc3RhcnRpbmdQb2ludCA9IHJlbWFpbmluZ1swXTtcblx0XHRcdHJlY3VyKHN0YXJ0aW5nUG9pbnQpO1xuXHRcdFx0dG9SZXR1cm4ucHVzaChPYmplY3QuY3JlYXRlKEdyaWQpLmluaXQoY3VycmVudEdyYXBoKSk7XG5cdFx0fVxuXHRcdHJldHVybiB0b1JldHVybjtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkO1xuXG4iLCJ2YXIgTm9kZUdyYXBoID0gZnVuY3Rpb24gKClcbntcblx0dGhpcy52ZXJ0aWNlcyA9IFtdO1xuXHR0aGlzLmVkZ2VzID0gW107XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLmdldFZlcnRleCA9IGZ1bmN0aW9uICgkbm9kZSlcbntcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMudmVydGljZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgdmVydGV4ID0gdGhpcy52ZXJ0aWNlc1tpXTtcblx0XHRpZiAodmVydGV4Lm5vZGUgPT09ICRub2RlKVxuXHRcdHtcblx0XHRcdHJldHVybiB2ZXJ0ZXg7XG5cdFx0fVxuXHR9XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLmNyZWF0ZVZlcnRleCA9IGZ1bmN0aW9uICgkbm9kZSlcbntcblx0dmFyIHZlcnRleCA9IHsgbm9kZTogJG5vZGUgfTtcblx0dGhpcy52ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XG5cdHJldHVybiB2ZXJ0ZXg7XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLmdldEVkZ2VXZWlnaHQgPSBmdW5jdGlvbiAoJGVkZ2UpXG57XG5cdHZhciBkWCA9IE1hdGguYWJzKCRlZGdlLnZlcnRleEEubm9kZS5vWCAtICRlZGdlLnZlcnRleEIubm9kZS5vWCk7XG5cdHZhciBkWSA9IE1hdGguYWJzKCRlZGdlLnZlcnRleEEubm9kZS5vWSAtICRlZGdlLnZlcnRleEIubm9kZS5vWSk7XG5cdHZhciBkaXN0ID0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcblx0cmV0dXJuIGRpc3Q7XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLmdldFZlcnRleEVkZ2VzID0gZnVuY3Rpb24gKCR2ZXJ0ZXgpXG57XG5cdHZhciB0b1JldHVybiA9IFtdO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5lZGdlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBlZGdlID0gdGhpcy5lZGdlc1tpXTtcblx0XHRpZiAoZWRnZS52ZXJ0ZXhBID09PSAkdmVydGV4IHx8IGVkZ2UudmVydGV4QiA9PT0gJHZlcnRleClcblx0XHR7XG5cdFx0XHR0b1JldHVybi5wdXNoKGVkZ2UpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdG9SZXR1cm47XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiAoJEFOb2RlLCAkQk5vZGUpXG57XG5cdHZhciB2ZXJ0ZXhBID0gdGhpcy5nZXRWZXJ0ZXgoJEFOb2RlKSB8fCB0aGlzLmNyZWF0ZVZlcnRleCgkQU5vZGUpO1xuXHR2YXIgdmVydGV4QiA9IHRoaXMuZ2V0VmVydGV4KCRCTm9kZSkgfHwgdGhpcy5jcmVhdGVWZXJ0ZXgoJEJOb2RlKTtcblxuXHR2YXIgZXhpc3RzID0gZmFsc2U7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLmVkZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldO1xuXHRcdGlmICgoZWRnZS52ZXJ0ZXhBID09PSB2ZXJ0ZXhBICYmXG5cdFx0XHRlZGdlLnZlcnRleEIgPT09IHZlcnRleEIpIHx8XG5cdFx0XHQoZWRnZS52ZXJ0ZXhBID09PSB2ZXJ0ZXhCICYmXG5cdFx0XHRlZGdlLnZlcnRleEIgPT09IHZlcnRleEEpKVxuXHRcdHtcblx0XHRcdGV4aXN0cyA9IHRydWU7XG5cdFx0fVxuXHR9XG5cdGlmICghZXhpc3RzKVxuXHR7XG5cdFx0dGhpcy5lZGdlcy5wdXNoKHsgdmVydGV4QTogdmVydGV4QSwgdmVydGV4QjogdmVydGV4QiB9KTtcblx0fVxufTtcblxuTm9kZUdyYXBoLnByb3RvdHlwZS50cmF2ZXJzZSA9IGZ1bmN0aW9uICgkc3RhcnRpbmdWZXJ0aWNlcylcbntcblx0dmFyIGk7XG5cdHZhciBvcGVuTGlzdCA9IFtdO1xuXHR2YXIgZWRnZXNMZW5ndGg7XG5cdHZhciB2ZXJ0ZXhFZGdlcztcblx0dmFyIHN0YXJ0aW5nVmVydGljZXNMZW5ndGggPSAkc3RhcnRpbmdWZXJ0aWNlcy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCBzdGFydGluZ1ZlcnRpY2VzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHQkc3RhcnRpbmdWZXJ0aWNlc1tpXS5tYXBWYWx1ZSA9IDA7XG5cdFx0JHN0YXJ0aW5nVmVydGljZXNbaV0ub3BlbmVkID0gdHJ1ZTtcblx0XHRvcGVuTGlzdC5wdXNoKCRzdGFydGluZ1ZlcnRpY2VzW2ldKTtcblx0fVxuXG5cdHdoaWxlIChvcGVuTGlzdC5sZW5ndGgpXG5cdHtcblx0XHR2YXIgY2xvc2VkVmVydGV4ID0gb3Blbkxpc3Quc2hpZnQoKTtcblx0XHRjbG9zZWRWZXJ0ZXguY2xvc2VkID0gdHJ1ZTtcblxuXHRcdHZlcnRleEVkZ2VzID0gdGhpcy5nZXRWZXJ0ZXhFZGdlcyhjbG9zZWRWZXJ0ZXgpO1xuXHRcdGVkZ2VzTGVuZ3RoID0gdmVydGV4RWRnZXMubGVuZ3RoO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBlZGdlc0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyRWRnZSA9IHZlcnRleEVkZ2VzW2ldO1xuXHRcdFx0dmFyIG90aGVyVmVydGV4ID0gY3VyckVkZ2UudmVydGV4QSA9PT0gY2xvc2VkVmVydGV4ID8gY3VyckVkZ2UudmVydGV4QiA6IGN1cnJFZGdlLnZlcnRleEE7XG5cdFx0XHRpZiAob3RoZXJWZXJ0ZXguY2xvc2VkKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcblx0XHRcdGlmICghb3RoZXJWZXJ0ZXgub3BlbmVkKVxuXHRcdFx0e1xuXHRcdFx0XHRvdGhlclZlcnRleC5vcGVuZWQgPSB0cnVlO1xuXHRcdFx0XHRvcGVuTGlzdC5wdXNoKG90aGVyVmVydGV4KTtcblx0XHRcdH1cblx0XHRcdHZhciB2YWwgPSBjbG9zZWRWZXJ0ZXgubWFwVmFsdWUgKyB0aGlzLmdldEVkZ2VXZWlnaHQoY3VyckVkZ2UpO1xuXHRcdFx0b3RoZXJWZXJ0ZXgubWFwVmFsdWUgPSBvdGhlclZlcnRleC5tYXBWYWx1ZSA8IHZhbCA/IG90aGVyVmVydGV4Lm1hcFZhbHVlIDogdmFsOyAvL3dvcmtzIGV2ZW4gaWYgdW5kZWZpbmVkXG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGVHcmFwaDtcbiIsInZhciBEcmF3aW5nQ29tbWFuZCA9IHJlcXVpcmUoJy4vRHJhd2luZ0NvbW1hbmQnKTtcbnZhciBDb21tYW5kcyA9IHJlcXVpcmUoJy4vQ29tbWFuZHMnKTtcblxudmFyIE9iamVjdERyYXdpbmcgPSBmdW5jdGlvbiAoJGdyb3VwKVxue1xuXHR0aGlzLmdyb3VwID0gJGdyb3VwO1xuXHR0aGlzLmNvbW1hbmRzID0gW107XG5cdHRoaXMuY29tbWFuZHNMZW5ndGggPSAwO1xuXHR0aGlzLnByb3BlcnRpZXMgPSB7fTtcbn07XG5cbk9iamVjdERyYXdpbmcucHJvdG90eXBlLmFkZENvbW1hbmQgPSBmdW5jdGlvbiAoJG5vZGUsICRjb21tYW5kUHJvcGVydGllcywgJGVudmVsb3BlKVxue1xuXHR2YXIgY29tbWFuZE5hbWU7XG5cdHZhciBwcm9wZXJ0aWVzID0gJGNvbW1hbmRQcm9wZXJ0aWVzO1xuXHRpZiAoJGVudmVsb3BlID09PSBmYWxzZSAmJiAhdGhpcy5ncm91cC5jb25mLmRyYXdOb2Rlc1NlcGFyYXRlbHkpXG5cdHtcblx0XHRyZXR1cm47XG5cdH1cblx0aWYgKHByb3BlcnRpZXMpIHsgY29tbWFuZE5hbWUgPSBwcm9wZXJ0aWVzLm5hbWU7IH1cblx0ZWxzZVxuXHR7XG5cdFx0aWYgKHRoaXMuZ3JvdXAuY29uZi5kcmF3Tm9kZXNTZXBhcmF0ZWx5KVxuXHRcdHtcblx0XHRcdGNvbW1hbmROYW1lID0gQ29tbWFuZHMuQVJDO1xuXHRcdFx0cHJvcGVydGllcyA9IHt9O1xuXHRcdFx0cHJvcGVydGllcy5vcHRpb25zID0gW107XG5cdFx0XHRwcm9wZXJ0aWVzLm9wdGlvbnNbMF0gPSB0aGlzLmdyb3VwLmNvbmYubm9kZVJhZGl1cztcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGNvbW1hbmROYW1lID0gdGhpcy5jb21tYW5kc0xlbmd0aCA9PT0gMCA/IENvbW1hbmRzLk1PVkVfVE8gOiBDb21tYW5kcy5MSU5FX1RPO1xuXHRcdH1cblx0fVxuXHQvLyBjb21tYW5kTmFtZSA9IENvbW1hbmRzLkFSQztcblx0Ly8gJHByb3BlcnRpZXMub3B0aW9uc1swXSA9IDU7XG5cdC8vICRwcm9wZXJ0aWVzLm9wdGlvbnNbMV0gPSA1O1xuXHR2YXIgY29tbWFuZCA9IG5ldyBEcmF3aW5nQ29tbWFuZChjb21tYW5kTmFtZSwgJG5vZGUsIHByb3BlcnRpZXMpO1xuXHR0aGlzLmNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG5cdHRoaXMuY29tbWFuZHNbMF0uZW5kQ29tbWFuZCA9IGNvbW1hbmQ7XG5cdHRoaXMuY29tbWFuZHNMZW5ndGggKz0gMTtcbn07XG5cbk9iamVjdERyYXdpbmcucHJvdG90eXBlLmdldEJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMuZ3JvdXAucGh5c2ljc01hbmFnZXIuZ2V0Qm91bmRpbmdCb3goKTtcbn07XG5cbk9iamVjdERyYXdpbmcucHJvdG90eXBlLmlzU3RhdGljID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMuZ3JvdXAuY29uZi5maXhlZCA9PT0gdHJ1ZTtcbn07XG5cbk9iamVjdERyYXdpbmcucHJvdG90eXBlLndpbGxOb3RJbnRlcnNlY3QgPSBmdW5jdGlvbiAoKVxue1xuXHRpZiAodGhpcy5ncm91cC5jb25mLnBoeXNpY3MuYm9keVR5cGUgPT09ICdoYXJkJylcblx0e1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHJldHVybiBmYWxzZTtcbn07XG5cbk9iamVjdERyYXdpbmcucHJvdG90eXBlLmlzU2ltcGxlRHJhd2luZyA9IGZ1bmN0aW9uICgpXG57XG5cdGlmICh0aGlzLmdyb3VwLmNvbmYucGh5c2ljcy5ib2R5VHlwZSA9PT0gJ2hhcmQnIHx8IHRoaXMuZ3JvdXAuY29uZi5waHlzaWNzLmJvZHlUeXBlID09PSAnc29mdCcpXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdERyYXdpbmc7XG4iLCJ2YXIgUG9seWdvbiA9XG57XG5cdGluaXQ6IGZ1bmN0aW9uICgkcG9pbnRzKVxuXHR7XG5cdFx0dmFyIHBvbHlnb24gPSBPYmplY3QuY3JlYXRlKFBvbHlnb24pO1xuXHRcdHBvbHlnb24ucG9pbnRzID0gJHBvaW50cztcblx0XHRwb2x5Z29uLl9ib3VuZGluZ0JveCA9IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gcG9seWdvbjtcblx0fSxcblxuXHRnZXRBcmVhOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHN1bUEgPSAwO1xuXHRcdHZhciBzdW1CID0gMDtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5wb2ludHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJQb2ludCA9IHRoaXMucG9pbnRzW2ldO1xuXHRcdFx0dmFyIG5leHQgPSBpID09PSBsZW5ndGggLSAxID8gdGhpcy5wb2ludHNbMF0gOiB0aGlzLnBvaW50c1tpICsgMV07XG5cblx0XHRcdHN1bUEgKz0gY3VyclBvaW50WzBdICogbmV4dFsxXTtcblx0XHRcdHN1bUIgKz0gY3VyclBvaW50WzFdICogbmV4dFswXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gTWF0aC5hYnMoKHN1bUEgLSBzdW1CKSAqIDAuNSk7XG5cdH0sXG5cblx0Z2V0Qm91bmRpbmdCb3g6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHRpZiAoIXRoaXMuX2JvdW5kaW5nQm94KVxuXHRcdHtcblx0XHRcdHZhciBtaW5YID0gdGhpcy5wb2ludHNbMF1bMF07XG5cdFx0XHR2YXIgbWF4WCA9IG1pblg7XG5cdFx0XHR2YXIgbWluWSA9IHRoaXMucG9pbnRzWzBdWzFdO1xuXHRcdFx0dmFyIG1heFkgPSBtaW5ZO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5wb2ludHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBwb2ludCA9IHRoaXMucG9pbnRzW2ldO1xuXHRcdFx0XHRtaW5YID0gTWF0aC5taW4obWluWCwgcG9pbnRbMF0pO1xuXHRcdFx0XHRtYXhYID0gTWF0aC5tYXgobWF4WCwgcG9pbnRbMF0pO1xuXHRcdFx0XHRtaW5ZID0gTWF0aC5taW4obWluWSwgcG9pbnRbMV0pO1xuXHRcdFx0XHRtYXhZID0gTWF0aC5tYXgobWF4WSwgcG9pbnRbMV0pO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fYm91bmRpbmdCb3ggPSBbW21pblgsIG1pblldLCBbbWF4WCwgbWF4WV1dO1xuXHRcdH1cblx0XHRyZXR1cm4gdGhpcy5fYm91bmRpbmdCb3g7XG5cdH0sXG5cblx0Z2V0Q2VudGVyOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIGJvdW5kaW5nID0gdGhpcy5nZXRCb3VuZGluZ0JveCgpO1xuXHRcdHZhciB4ID0gYm91bmRpbmdbMF1bMF0gKyAoYm91bmRpbmdbMV1bMF0gLSBib3VuZGluZ1swXVswXSkgLyAyO1xuXHRcdHZhciB5ID0gYm91bmRpbmdbMF1bMV0gKyAoYm91bmRpbmdbMV1bMV0gLSBib3VuZGluZ1swXVsxXSkgLyAyO1xuXHRcdHJldHVybiBbeCwgeV07XG5cdH0sXG5cblx0Z2V0U2VnbWVudHM6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgc2VnbWVudHMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5wb2ludHMubGVuZ3RoIC0gMTsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHNlZ21lbnRzLnB1c2goW3RoaXMucG9pbnRzW2ldLCB0aGlzLnBvaW50c1tpICsgMV1dKTtcblx0XHR9XG5cdFx0c2VnbWVudHMucHVzaChbdGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoIC0gMV0sIHRoaXMucG9pbnRzWzBdXSk7XG5cdFx0cmV0dXJuIHNlZ21lbnRzO1xuXHR9LFxuXG5cdGdldEludGVyc2VjdGlvbnNBdFk6IGZ1bmN0aW9uICgkdGVzdFkpXG5cdHtcblx0XHR2YXIgc2VnbWVudHMgPSB0aGlzLmdldFNlZ21lbnRzKCk7XG5cdFx0dmFyIGludGVyc2VjdGlvbnMgPSBbXTtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJTZWdtZW50ID0gc2VnbWVudHNbaV07XG5cdFx0XHR2YXIgeDEgPSBjdXJyU2VnbWVudFswXVswXTtcblx0XHRcdHZhciB5MSA9IGN1cnJTZWdtZW50WzBdWzFdO1xuXHRcdFx0dmFyIHgyID0gY3VyclNlZ21lbnRbMV1bMF07XG5cdFx0XHR2YXIgeTIgPSBjdXJyU2VnbWVudFsxXVsxXTtcblx0XHRcdHZhciBzbWFsbFkgPSBNYXRoLm1pbih5MSwgeTIpO1xuXHRcdFx0dmFyIGJpZ1kgPSBNYXRoLm1heCh5MSwgeTIpO1xuXG5cdFx0XHRpZiAoJHRlc3RZID4gc21hbGxZICYmICR0ZXN0WSA8IGJpZ1kpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBwWSA9IHkyIC0gJHRlc3RZO1xuXHRcdFx0XHR2YXIgc2VnWSA9IHkyIC0geTE7XG5cdFx0XHRcdHZhciBzZWdYID0geDIgLSB4MTtcblx0XHRcdFx0dmFyIHBYID0gcFkgKiBzZWdYIC8gc2VnWTtcblx0XHRcdFx0aW50ZXJzZWN0aW9ucy5wdXNoKHgyIC0gcFgpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gaW50ZXJzZWN0aW9ucztcblx0fSxcblxuXHRpc0luc2lkZTogZnVuY3Rpb24gKCRwb2ludClcblx0e1xuXHRcdHZhciBpbmZOdW1iZXIgPSAwO1xuXHRcdHZhciBpbnRlcnNlY3Rpb25zID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zQXRZKCRwb2ludFsxXSk7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGludGVyc2VjdGlvbnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0aWYgKCRwb2ludFswXSA8IGludGVyc2VjdGlvbnNbaV0pIHsgaW5mTnVtYmVyICs9IDE7IH1cblx0XHR9XG5cdFx0cmV0dXJuIGluZk51bWJlciAlIDIgPiAwO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvbHlnb247XG5cbiIsInZhciBDb21tYW5kcyA9IHJlcXVpcmUoJy4vQ29tbWFuZHMnKTtcbnZhciBBUkMgPSBDb21tYW5kcy5BUkM7XG52YXIgTElORV9UTyA9IENvbW1hbmRzLkxJTkVfVE87XG52YXIgTU9WRV9UTyA9IENvbW1hbmRzLk1PVkVfVE87XG52YXIgQkVaSUVSX1RPID0gQ29tbWFuZHMuQkVaSUVSX1RPO1xudmFyIFFVQURSQV9UTyA9IENvbW1hbmRzLlFVQURSQV9UTztcbnZhciBFTExJUFNFID0gQ29tbWFuZHMuRUxMSVBTRTtcblxudmFyIFNWR1BhcnNlciA9IGZ1bmN0aW9uICgpIHt9O1xuLy92YXIgaXNQb2x5Z29uID0gL3BvbHlnb258cmVjdC9pZztcbi8vIHZhciBpc0xpbmUgPSAvcG9seWxpbmV8bGluZXxwYXRoL2lnO1xuLy8gdmFyIGxpbmVUYWdzID0gJ3BvbHlsaW5lLCBsaW5lLCBwYXRoJztcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uICgkd29ybGQsICRTVkcpXG57XG5cdHRoaXMuU1ZHID0gJFNWRztcblx0dmFyIHZpZXdCb3hBdHRyID0gdGhpcy5TVkcuZ2V0QXR0cmlidXRlKCd2aWV3Qm94Jyk7XG5cdHRoaXMudmlld0JveFdpZHRoID0gdmlld0JveEF0dHIgPyBOdW1iZXIodmlld0JveEF0dHIuc3BsaXQoJyAnKVsyXSkgOiBOdW1iZXIodGhpcy5TVkcuZ2V0QXR0cmlidXRlKCd3aWR0aCcpKTtcblx0dGhpcy52aWV3Qm94SGVpZ2h0ID0gdmlld0JveEF0dHIgPyBOdW1iZXIodmlld0JveEF0dHIuc3BsaXQoJyAnKVszXSkgOiBOdW1iZXIodGhpcy5TVkcuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG5cdHRoaXMucmF0aW8gPSAkd29ybGQuZ2V0V2lkdGgoKSAvIHRoaXMudmlld0JveFdpZHRoO1xuXHR0aGlzLndvcmxkID0gJHdvcmxkO1xuXHR0aGlzLndvcmxkLnNldEhlaWdodCh0aGlzLnZpZXdCb3hIZWlnaHQgKiB0aGlzLnJhdGlvKTtcblxuXHQvL3RlbXBcblx0dGhpcy5lbGVtZW50c1F1ZXJ5ID0gJyo6bm90KGRlZnMpOm5vdChnKTpub3QodGl0bGUpOm5vdChsaW5lYXJHcmFkaWVudCk6bm90KHJhZGlhbEdyYWRpZW50KTpub3Qoc3RvcCk6bm90KFtpZCo9XCJqb2ludFwiXSk6bm90KFtpZCo9XCJjb25zdHJhaW50XCJdKSc7XG5cdHZhciBlbGVtUmF3cyA9IHRoaXMuU1ZHLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5lbGVtZW50c1F1ZXJ5KTtcblxuXHR2YXIgaSA9IDA7XG5cdHZhciByYXdHcm91cFBhaXJpbmdzID0gW107XG5cdHZhciBlbGVtc0xlbmd0aCA9IGVsZW1SYXdzLmxlbmd0aDtcblxuXHRmb3IgKGkgPSAwOyBpIDwgZWxlbXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciByYXdFbGVtZW50ID0gZWxlbVJhd3NbaV07XG5cdFx0Ly9pZiAocmF3RWxlbWVudC5ub2RlVHlwZSA9PT0gMykgeyBjb250aW51ZTsgfVxuXHRcdHZhciBncm91cEluZm9zID0gdGhpcy5nZXRHcm91cEluZm9zKHJhd0VsZW1lbnQpO1xuXHRcdHZhciBjdXJyR3JvdXAgPSAkd29ybGQuY3JlYXRlR3JvdXAoZ3JvdXBJbmZvcy50eXBlLCBncm91cEluZm9zLklEKTtcblx0XHRjdXJyR3JvdXAucmF3U1ZHRWxlbWVudCA9IHJhd0VsZW1lbnQ7XG5cblx0XHR2YXIgZHJhd2luZ0NvbW1hbmRzID0gdGhpcy5wYXJzZUVsZW1lbnQocmF3RWxlbWVudCk7XG5cdFx0Y3Vyckdyb3VwLnN0cnVjdHVyZS5jcmVhdGUoZHJhd2luZ0NvbW1hbmRzKTtcblx0XHR0aGlzLnNldEdyYXBoaWNJbnN0cnVjdGlvbnMoY3Vyckdyb3VwLCByYXdFbGVtZW50LCBkcmF3aW5nQ29tbWFuZHMpO1xuXG5cdFx0cmF3R3JvdXBQYWlyaW5ncy5wdXNoKHsgZ3JvdXA6IGN1cnJHcm91cCwgcmF3OiByYXdFbGVtZW50LnBhcmVudE5vZGUgfSk7XG5cdH1cblxuXHR0aGlzLnBhcnNlQ29uc3RyYWludHMoKTtcblx0dGhpcy5wYXJzZUN1c3RvbUpvaW50cygpO1xuXG5cdHRoaXMud29ybGQuYWRkR3JvdXBzVG9Xb3JsZCgpO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRHcm91cEluZm9zID0gZnVuY3Rpb24gKCRyYXdHcm91cClcbntcblx0dmFyIGdyb3VwRWxlbWVudCA9ICghJHJhd0dyb3VwLmlkIHx8ICRyYXdHcm91cC5pZC5pbmRleE9mKCdzdmcnKSA9PT0gMCkgJiYgJHJhd0dyb3VwLnBhcmVudE5vZGUudGFnTmFtZSAhPT0gJ3N2ZycgPyAkcmF3R3JvdXAucGFyZW50Tm9kZSA6ICRyYXdHcm91cDtcblx0dmFyIHR5cGU7XG5cdHZhciBJRDtcblx0dmFyIHJlZ2V4ID0gLyhbYS16XFxkXSspXFx3Ki9pZ207XG5cdHZhciBmaXJzdCA9IHJlZ2V4LmV4ZWMoZ3JvdXBFbGVtZW50LmlkKTtcblx0dmFyIHNlY29uZCA9IHJlZ2V4LmV4ZWMoZ3JvdXBFbGVtZW50LmlkKTtcblxuXHR0eXBlID0gZmlyc3QgPyBmaXJzdFsxXSA6IHVuZGVmaW5lZDtcblx0SUQgPSBzZWNvbmQgPyBzZWNvbmRbMV0gOiBudWxsO1xuXHR2YXIgdGl0bGUgPSBncm91cEVsZW1lbnQucXVlcnlTZWxlY3RvcigndGl0bGUnKTtcblx0aWYgKElEID09PSBudWxsKSB7IElEID0gdGl0bGUgPyB0aXRsZS5ub2RlVmFsdWUgOiBJRDsgfVxuXG5cdHJldHVybiB7IElEOiBJRCwgdHlwZTogdHlwZSB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbiAoJHBvaW50Q29tbWFuZHMpXG57XG5cdHZhciBwb2ludHMgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9ICRwb2ludENvbW1hbmRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludENvbW1hbmQgPSAkcG9pbnRDb21tYW5kc1tpXTtcblx0XHRwb2ludHMucHVzaChjdXJyUG9pbnRDb21tYW5kLnBvaW50KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRHcm91cEZyb21SYXdTVkdFbGVtZW50ID0gZnVuY3Rpb24gKCRyYXcpXG57XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLndvcmxkLmdyb3Vwcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyR3JvdXAgPSB0aGlzLndvcmxkLmdyb3Vwc1tpXTtcblx0XHRpZiAoY3Vyckdyb3VwLnJhd1NWR0VsZW1lbnQgPT09ICRyYXcpIHsgcmV0dXJuIGN1cnJHcm91cDsgfVxuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlQ29uc3RyYWludHMgPSBmdW5jdGlvbiAoKVxue1xuXHR2YXIgcmF3Q29uc3RyYWludHMgPSB0aGlzLlNWRy5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiY29uc3RyYWludFwiXScpO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gcmF3Q29uc3RyYWludHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclJhd0NvbnN0cmFpbnQgPSByYXdDb25zdHJhaW50c1tpXTtcblx0XHR2YXIgcmF3RWxlbWVudHMgPSBjdXJyUmF3Q29uc3RyYWludC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5lbGVtZW50c1F1ZXJ5KTtcblx0XHR2YXIgcG9pbnRzID0gdGhpcy5nZXRQb2ludHModGhpcy5wYXJzZUVsZW1lbnQoY3VyclJhd0NvbnN0cmFpbnQpLnBvaW50Q29tbWFuZHMpO1xuXHRcdHZhciByZXN1bHQgPSAvY29uc3RyYWludC0oW2EtelxcZF0qKS0/KFthLXpcXGRdKik/L2lnLmV4ZWMoY3VyclJhd0NvbnN0cmFpbnQuaWQpO1xuXHRcdHZhciBwYXJlbnRHcm91cElEID0gcmVzdWx0ID8gcmVzdWx0WzFdIDogdW5kZWZpbmVkO1xuXHRcdGlmIChwYXJlbnRHcm91cElEID09PSAnd29ybGQnKSB7IHBhcmVudEdyb3VwSUQgPSB1bmRlZmluZWQ7IH1cblx0XHR2YXIgY29uc3RyYWludFR5cGUgPSByZXN1bHQgJiYgcmVzdWx0WzJdID8gcmVzdWx0WzJdIDogJ2RlZmF1bHQnO1xuXHRcdHZhciBwYXJlbnRHcm91cCA9IHBhcmVudEdyb3VwSUQgPyB0aGlzLndvcmxkLmdldEdyb3VwQnlJRChwYXJlbnRHcm91cElEKSA6IHVuZGVmaW5lZDtcblxuXHRcdGZvciAodmFyIGsgPSAwLCByYXdFbGVtZW50c0xlbmd0aCA9IHJhd0VsZW1lbnRzLmxlbmd0aDsgayA8IHJhd0VsZW1lbnRzTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJSYXdFbGVtZW50ID0gcmF3RWxlbWVudHNba107XG5cdFx0XHR2YXIgZ3JvdXAgPSB0aGlzLmdldEdyb3VwRnJvbVJhd1NWR0VsZW1lbnQoY3VyclJhd0VsZW1lbnQpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhncm91cCk7XG5cdFx0XHR0aGlzLndvcmxkLmNvbnN0cmFpbkdyb3Vwcyhncm91cCwgcGFyZW50R3JvdXAsIHBvaW50cywgY29uc3RyYWludFR5cGUpO1xuXHRcdH1cblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUN1c3RvbUpvaW50cyA9IGZ1bmN0aW9uICgpXG57XG5cdHZhciByYXdKb2ludCA9IHRoaXMuU1ZHLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZCo9XCJqb2ludFwiXScpO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gcmF3Sm9pbnQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclJhd0pvaW50ID0gcmF3Sm9pbnRbaV07XG5cdFx0dmFyIHJhd0VsZW1lbnRzID0gY3VyclJhd0pvaW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCh0aGlzLmVsZW1lbnRzUXVlcnkpO1xuXHRcdHZhciBwb2ludHMgPSB0aGlzLmdldFBvaW50cyh0aGlzLnBhcnNlRWxlbWVudChjdXJyUmF3Sm9pbnQpLnBvaW50Q29tbWFuZHMpO1xuXHRcdHZhciByZXN1bHQgPSAvam9pbnQtKFthLXpcXGRdKikvaWcuZXhlYyhjdXJyUmF3Sm9pbnQuaWQpO1xuXHRcdHZhciB0eXBlID0gcmVzdWx0ID8gcmVzdWx0WzFdIDogdW5kZWZpbmVkO1xuXG5cdFx0Zm9yICh2YXIgayA9IDAsIHJhd0VsZW1lbnRzTGVuZ3RoID0gcmF3RWxlbWVudHMubGVuZ3RoOyBrIDwgcmF3RWxlbWVudHNMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyclJhd0VsZW1lbnQgPSByYXdFbGVtZW50c1trXTtcblx0XHRcdHZhciBncm91cCA9IHRoaXMuZ2V0R3JvdXBGcm9tUmF3U1ZHRWxlbWVudChjdXJyUmF3RWxlbWVudCk7XG5cdFx0XHR2YXIgbm9kZUEgPSBncm91cC5nZXROb2RlQXRQb2ludChwb2ludHNbMF1bMF0sIHBvaW50c1swXVsxXSk7XG5cdFx0XHR2YXIgbm9kZUIgPSBncm91cC5nZXROb2RlQXRQb2ludChwb2ludHNbMV1bMF0sIHBvaW50c1sxXVsxXSk7XG5cdFx0XHRncm91cC5jcmVhdGVKb2ludChub2RlQSwgbm9kZUIsIHR5cGUsIHRydWUpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhncm91cCk7XG5cdFx0XHQvL3RoaXMud29ybGQuY29uc3RyYWluR3JvdXBzKGdyb3VwLCBwYXJlbnRHcm91cCwgcG9pbnRzKTtcblx0XHR9XG5cdH1cblx0Ly8gdmFyIGNoaWxkcmVuID0gJHJhd0dyb3VwLmNoaWxkTm9kZXM7Ly8kcmF3R3JvdXAucXVlcnlTZWxlY3RvckFsbCgnW2lkKj1cImNvbnN0cmFpbnRcIl0nKTtcblxuXHQvLyBmb3IgKHZhciBpID0gMCwgY2hpbGRyZW5MZW5ndGggPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBjaGlsZHJlbkxlbmd0aDsgaSArPSAxKVxuXHQvLyB7XG5cdC8vIFx0aWYgKGNoaWxkcmVuW2ldLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBjaGlsZHJlbltpXS5pZC5zZWFyY2goL2pvaW50L2kpIDwgMCkgeyBjb250aW51ZTsgfVxuXG5cdC8vIFx0dmFyIGN1cnJSYXdKb2ludCA9IGNoaWxkcmVuW2ldO1xuXHQvLyBcdHZhciBwMXggPSB0aGlzLmdldENvb3JkKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHQvLyBcdHZhciBwMXkgPSB0aGlzLmdldENvb3JkKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3kxJykpO1xuXHQvLyBcdHZhciBwMnggPSB0aGlzLmdldENvb3JkKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3gyJykpO1xuXHQvLyBcdHZhciBwMnkgPSB0aGlzLmdldENvb3JkKGN1cnJSYXdKb2ludC5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXG5cdC8vIFx0dmFyIG4xID0gJGdyb3VwLmdldE5vZGVBdFBvaW50KHAxeCwgcDF5KSB8fCAkZ3JvdXAuY3JlYXRlTm9kZShwMXgsIHAxeSk7XG5cdC8vIFx0dmFyIG4yID0gJGdyb3VwLmdldE5vZGVBdFBvaW50KHAyeCwgcDJ5KSB8fCAkZ3JvdXAuY3JlYXRlTm9kZShwMngsIHAyeSk7XG5cdC8vIFx0JGdyb3VwLmNyZWF0ZUpvaW50KG4xLCBuMik7XG5cdC8vIH1cbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VFbGVtZW50ID0gZnVuY3Rpb24gKCRyYXdFbGVtZW50KVxue1xuXHR2YXIgdGFnTmFtZSA9ICRyYXdFbGVtZW50LnRhZ05hbWU7XG5cblx0c3dpdGNoICh0YWdOYW1lKVxuXHR7XG5cdFx0Y2FzZSAnbGluZSc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUxpbmUoJHJhd0VsZW1lbnQpO1xuXHRcdGNhc2UgJ3JlY3QnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VSZWN0KCRyYXdFbGVtZW50KTtcblxuXHRcdGNhc2UgJ3BvbHlnb24nOlxuXHRcdGNhc2UgJ3BvbHlsaW5lJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlUG9seSgkcmF3RWxlbWVudCk7XG5cblx0XHRjYXNlICdwYXRoJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlUGF0aCgkcmF3RWxlbWVudCk7XG5cblx0XHRjYXNlICdjaXJjbGUnOlxuXHRcdGNhc2UgJ2VsbGlwc2UnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDaXJjbGUoJHJhd0VsZW1lbnQpO1xuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnNldEdyYXBoaWNJbnN0cnVjdGlvbnMgPSBmdW5jdGlvbiAoJGdyb3VwLCAkcmF3LCAkZHJhd2luZ0NvbW1hbmRzKVxue1xuXHR2YXIgZHJhd2luZyA9ICRncm91cC5kcmF3aW5nO1xuXHQvL2RyYXdpbmcuY29tbWFuZHMgPSAkbm9kZXNUb0RyYXc7XG5cdHZhciBwcm9wcyA9IGRyYXdpbmcucHJvcGVydGllcztcblx0Ly9zb3J0aW5nIG5vZGVzVG9EcmF3IHNvIHRoZSBwYXRoIGlzIGRyYXduIGNvcnJlY3RseVxuXHQvLyB2YXIgc3RhcnQ7XG5cdC8vIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSAkbm9kZXNUb0RyYXcubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdC8vIHtcblx0Ly8gXHR2YXIgY3Vyck5vZGUgPSAkbm9kZXNUb0RyYXdbaV07XG5cdC8vIFx0aWYgKGN1cnJOb2RlLmRyYXdpbmcuY29tbWFuZCA9PT0gTU9WRV9UTyB8fCBpID09PSBsZW5ndGggLSAxKVxuXHQvLyBcdHtcblx0Ly8gXHRcdGlmIChzdGFydCkgeyBzdGFydC5kcmF3aW5nLmVuZE5vZGUgPSBjdXJyTm9kZTsgfVxuXHQvLyBcdFx0c3RhcnQgPSBjdXJyTm9kZTtcblx0Ly8gXHR9XG5cblx0Ly8gXHQkZ3JvdXAubm9kZXMuc3BsaWNlKCRncm91cC5ub2Rlcy5pbmRleE9mKGN1cnJOb2RlKSwgMSk7XG5cdC8vIFx0JGdyb3VwLm5vZGVzLnNwbGljZShpLCAwLCBjdXJyTm9kZSk7XG5cdC8vIH1cblxuXHR2YXIgcmF3RmlsbCA9ICRyYXcuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XG5cdHZhciByYXdTdHJva2UgPSAkcmF3LmdldEF0dHJpYnV0ZSgnc3Ryb2tlJyk7XG5cdHZhciByYXdMaW5lY2FwID0gJHJhdy5nZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJyk7XG5cdHZhciByYXdMaW5lam9pbiA9ICRyYXcuZ2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWpvaW4nKTtcblx0dmFyIHJhd09wYWNpdHkgPSAkcmF3LmdldEF0dHJpYnV0ZSgnb3BhY2l0eScpO1xuXG5cdHByb3BzLmZpbGwgPSByYXdGaWxsIHx8ICcjMDAwMDAwJztcblx0cHJvcHMubGluZVdpZHRoID0gdGhpcy5nZXRUaGlja25lc3MoJHJhdyk7Ly9yYXdTdHJva2VXaWR0aCAqIHRoaXMucmF0aW8gfHwgMDtcblx0cHJvcHMuc3Ryb2tlID0gcmF3U3Ryb2tlICYmIHByb3BzLmxpbmVXaWR0aCAhPT0gMCA/IHJhd1N0cm9rZSA6ICdub25lJztcblx0cHJvcHMubGluZUNhcCA9IHJhd0xpbmVjYXAgJiYgcmF3TGluZWNhcCAhPT0gJ251bGwnID8gcmF3TGluZWNhcCA6ICdidXR0Jztcblx0cHJvcHMubGluZUpvaW4gPSByYXdMaW5lam9pbiAmJiByYXdMaW5lam9pbiAhPT0gJ251bGwnID8gcmF3TGluZWpvaW4gOiAnbWl0ZXInO1xuXHRwcm9wcy5vcGFjaXR5ID0gcmF3T3BhY2l0eSAhPT0gbnVsbCA/IE51bWJlcihyYXdPcGFjaXR5KSA6IDE7XG5cblx0cHJvcHMuY2xvc2VQYXRoID0gJGRyYXdpbmdDb21tYW5kcy5jbG9zZVBhdGg7XG5cblx0cHJvcHMucmFkaXVzWCA9ICRkcmF3aW5nQ29tbWFuZHMucmFkaXVzWDtcblx0cHJvcHMucmFkaXVzWSA9ICRkcmF3aW5nQ29tbWFuZHMucmFkaXVzWTtcblxuXHRwcm9wcy5zdHJva2VHcmFkaWVudCA9IHRoaXMuZ2V0R3JhZGllbnQocHJvcHMuc3Ryb2tlKTtcblx0cHJvcHMuZHluYW1pY0dyYWRpZW50ID0gJGdyb3VwLmNvbmYuc3RydWN0dXJlID09PSAnbGluZScgJiYgcHJvcHMuc3Ryb2tlR3JhZGllbnQ7XG5cdHByb3BzLmZpbGxHcmFkaWVudCA9IHRoaXMuZ2V0R3JhZGllbnQocHJvcHMuZmlsbCk7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldEdyYWRpZW50ID0gZnVuY3Rpb24gKCR2YWx1ZSlcbntcblx0dmFyIGdyYWRpZW50SUQgPSAvdXJsXFwoIyguKilcXCkvaW0uZXhlYygkdmFsdWUpO1xuXHRpZiAoZ3JhZGllbnRJRClcblx0e1xuXHRcdHZhciBncmFkaWVudEVsZW1lbnQgPSB0aGlzLlNWRy5xdWVyeVNlbGVjdG9yKCcjJyArIGdyYWRpZW50SURbMV0pO1xuXHRcdHZhciBtID0gdGhpcy5nZXRNYXRyaXgoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZ3JhZGllbnRUcmFuc2Zvcm0nKSk7XG5cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgIT09ICdsaW5lYXJHcmFkaWVudCcgJiYgZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgIT09ICdyYWRpYWxHcmFkaWVudCcpIHsgcmV0dXJuOyB9XG5cblx0XHR2YXIgZ3JhZGllbnQgPSB7IHN0b3BzOiBbXSwgdHlwZTogZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgfTtcblxuXHRcdGlmIChncmFkaWVudEVsZW1lbnQudGFnTmFtZSA9PT0gJ2xpbmVhckdyYWRpZW50Jylcblx0XHR7XG5cdFx0XHRncmFkaWVudC54MSA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneDEnKSk7XG5cdFx0XHRncmFkaWVudC55MSA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneTEnKSk7XG5cdFx0XHRncmFkaWVudC54MiA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdFx0XHRncmFkaWVudC55MiA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgneTInKSk7XG5cblx0XHRcdGlmIChtKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcDEgPSB0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChbZ3JhZGllbnQueDEsIGdyYWRpZW50LnkxXSwgbSk7XG5cdFx0XHRcdHZhciBwMiA9IHRoaXMubXVsdGlwbHlQb2ludEJ5TWF0cml4KFtncmFkaWVudC54MiwgZ3JhZGllbnQueTJdLCBtKTtcblxuXHRcdFx0XHRncmFkaWVudC54MSA9IHAxWzBdO1xuXHRcdFx0XHRncmFkaWVudC55MSA9IHAxWzFdO1xuXHRcdFx0XHRncmFkaWVudC54MiA9IHAyWzBdO1xuXHRcdFx0XHRncmFkaWVudC55MiA9IHAyWzFdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgPT09ICdyYWRpYWxHcmFkaWVudCcpXG5cdFx0e1xuXHRcdFx0Z3JhZGllbnQuY3ggPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2N4JykpO1xuXHRcdFx0Z3JhZGllbnQuY3kgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2N5JykpO1xuXHRcdFx0Z3JhZGllbnQuZnggPSBncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmeCcpID8gdGhpcy5nZXRDb29yZChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmeCcpKSA6IGdyYWRpZW50LmN4O1xuXHRcdFx0Z3JhZGllbnQuZnkgPSBncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmeScpID8gdGhpcy5nZXRDb29yZChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdmeScpKSA6IGdyYWRpZW50LmN5O1xuXHRcdFx0Z3JhZGllbnQuciA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgncicpKTtcblxuXHRcdFx0aWYgKG0pXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBjID0gdGhpcy5tdWx0aXBseVBvaW50QnlNYXRyaXgoW2dyYWRpZW50LmN4LCBncmFkaWVudC5jeV0sIG0pO1xuXHRcdFx0XHR2YXIgZiA9IHRoaXMubXVsdGlwbHlQb2ludEJ5TWF0cml4KFtncmFkaWVudC5meCwgZ3JhZGllbnQuZnldLCBtKTtcblxuXHRcdFx0XHRncmFkaWVudC5jeCA9IGNbMF07XG5cdFx0XHRcdGdyYWRpZW50LmN5ID0gY1sxXTtcblx0XHRcdFx0Z3JhZGllbnQuZnggPSBmWzBdO1xuXHRcdFx0XHRncmFkaWVudC5meSA9IGZbMV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHN0b3BzID0gZ3JhZGllbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N0b3AnKTtcblx0XHRmb3IgKHZhciBrID0gMCwgc3RvcExlbmd0aCA9IHN0b3BzLmxlbmd0aDsgayA8IHN0b3BMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyclN0b3AgPSBzdG9wc1trXTtcblx0XHRcdHZhciBvZmZzZXQgPSBOdW1iZXIoY3VyclN0b3AuZ2V0QXR0cmlidXRlKCdvZmZzZXQnKSk7XG5cdFx0XHR2YXIgY29sb3JSZWdleFJlc3VsdCA9IC9zdG9wLWNvbG9yOiguKz8pKDt8JCkvZy5leGVjKGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnc3R5bGUnKSk7XG5cdFx0XHR2YXIgY29sb3IgPSBjdXJyU3RvcC5nZXRBdHRyaWJ1dGUoJ3N0b3AtY29sb3InKSB8fCAoY29sb3JSZWdleFJlc3VsdCA/IGNvbG9yUmVnZXhSZXN1bHRbMV0gOiB1bmRlZmluZWQpO1xuXHRcdFx0dmFyIG9wYWNpdHlSZWdleFJlc3VsdCA9IC9zdG9wLW9wYWNpdHk6KFtcXGQuLV0rKS9nLmV4ZWMoY3VyclN0b3AuZ2V0QXR0cmlidXRlKCdzdHlsZScpKTtcblx0XHRcdHZhciBvcGFjaXR5ID0gY3VyclN0b3AuZ2V0QXR0cmlidXRlKCdzdG9wLW9wYWNpdHknKSB8fCAob3BhY2l0eVJlZ2V4UmVzdWx0ID8gb3BhY2l0eVJlZ2V4UmVzdWx0WzFdIDogMSk7XG5cdFx0XHRpZiAoY29sb3IuaW5kZXhPZignIycpID4gLTEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBSID0gcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEsIDIpLCAxNik7XG5cdFx0XHRcdHZhciBHID0gcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDMsIDIpLCAxNik7XG5cdFx0XHRcdHZhciBCID0gcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDUsIDIpLCAxNik7XG5cdFx0XHRcdGNvbG9yID0gJ3JnYmEoJyArIFIgKyAnLCcgKyBHICsgJywnICsgQiArICcsJyArIG9wYWNpdHkgKyAnKSc7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY29sb3IuaW5kZXhPZigncmdiKCcpID4gLTEpIHsgY29sb3IgPSAncmdiYScgKyBjb2xvci5zdWJzdHJpbmcoNCwgLTEpICsgJywnICsgb3BhY2l0eSArICcpJzsgfVxuXHRcdFx0aWYgKGNvbG9yLmluZGV4T2YoJ2hzbCgnKSA+IC0xKSB7IGNvbG9yID0gJ2hzbGEnICsgY29sb3Iuc3Vic3RyaW5nKDQsIC0xKSArICcsJyArIG9wYWNpdHkgKyAnKSc7IH1cblx0XHRcdGdyYWRpZW50LnN0b3BzLnB1c2goeyBvZmZzZXQ6IG9mZnNldCwgY29sb3I6IGNvbG9yLCBvcGFjaXR5OiBvcGFjaXR5IH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBncmFkaWVudDtcblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNpcmNsZSA9IGZ1bmN0aW9uICgkcmF3Q2lyY2xlKVxue1xuXHR2YXIgeFBvcyA9IHRoaXMuZ2V0Q29vcmQoJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ2N4JykgfHwgMCk7XG5cdHZhciB5UG9zID0gdGhpcy5nZXRDb29yZCgkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgnY3knKSB8fCAwKTtcblx0dmFyIHJhZGl1c0F0dHJYID0gJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ3InKSB8fCAkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgncngnKTtcblx0dmFyIHJhZGl1c0F0dHJZID0gJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ3J5Jyk7XG5cdHZhciByYWRpdXNYID0gdGhpcy5nZXRDb29yZChyYWRpdXNBdHRyWCk7XG5cdHZhciByYWRpdXNZID0gdGhpcy5nZXRDb29yZChyYWRpdXNBdHRyWSkgfHwgcmFkaXVzWDtcblx0dmFyIHJvdGF0aW9uID0gdGhpcy5nZXRSb3RhdGlvbigkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgndHJhbnNmb3JtJykpO1xuXHR2YXIgcG9pbnRDb21tYW5kcyA9IFt7IG5hbWU6IHJhZGl1c1kgIT09IHJhZGl1c1ggPyBFTExJUFNFIDogQVJDLCBwb2ludDogW3hQb3MsIHlQb3NdLCBvcHRpb25zOiBbcmFkaXVzWCwgcmFkaXVzWSwgcm90YXRpb25dIH1dO1xuXHRyZXR1cm4geyB0eXBlOiAnZWxsaXBzZScsIHBvaW50Q29tbWFuZHM6IHBvaW50Q29tbWFuZHMsIHJhZGl1c1g6IHJhZGl1c1gsIHJhZGl1c1k6IHJhZGl1c1ksIGNsb3NlUGF0aDogZmFsc2UsIHRoaWNrbmVzczogdGhpcy5nZXRUaGlja25lc3MoJHJhd0NpcmNsZSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VMaW5lID0gZnVuY3Rpb24gKCRyYXdMaW5lKVxue1xuXHR2YXIgeDEgPSB0aGlzLmdldENvb3JkKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgneDEnKSk7XG5cdHZhciB4MiA9IHRoaXMuZ2V0Q29vcmQoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd4MicpKTtcblx0dmFyIHkxID0gdGhpcy5nZXRDb29yZCgkcmF3TGluZS5nZXRBdHRyaWJ1dGUoJ3kxJykpO1xuXHR2YXIgeTIgPSB0aGlzLmdldENvb3JkKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgneTInKSk7XG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IG5hbWU6IE1PVkVfVE8sIHBvaW50OiBbeDEsIHkxXSwgb3B0aW9uczogW10gfSk7XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IG5hbWU6IExJTkVfVE8sIHBvaW50OiBbeDIsIHkyXSwgb3B0aW9uczogW10gfSk7XG5cdHJldHVybiB7IHR5cGU6ICdsaW5lJywgcG9pbnRDb21tYW5kczogcG9pbnRDb21tYW5kcywgY2xvc2VQYXRoOiBmYWxzZSwgdGhpY2tuZXNzOiB0aGlzLmdldFRoaWNrbmVzcygkcmF3TGluZSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VSZWN0ID0gZnVuY3Rpb24gKCRyYXdSZWN0KVxue1xuXHR2YXIgeDEgPSAkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3gnKSA/IHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd4JykpIDogMDtcblx0dmFyIHkxID0gJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd5JykgPyB0aGlzLmdldENvb3JkKCRyYXdSZWN0LmdldEF0dHJpYnV0ZSgneScpKSA6IDA7XG5cdHZhciB4MiA9IHgxICsgdGhpcy5nZXRDb29yZCgkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuXHR2YXIgeTIgPSB5MSArIHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG5cblx0dmFyIHBvaW50cyA9XG5cdFtcblx0XHRbeDEsIHkxXSxcblx0XHRbeDEsIHkyXSxcblx0XHRbeDIsIHkyXSxcblx0XHRbeDIsIHkxXVxuXHRdO1xuXG5cdHZhciBtID0gdGhpcy5nZXRNYXRyaXgoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nKSk7XG5cdGlmIChtKVxuXHR7XG5cdFx0cG9pbnRzID1cblx0XHRbXG5cdFx0XHR0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChwb2ludHNbMF0sIG0pLFxuXHRcdFx0dGhpcy5tdWx0aXBseVBvaW50QnlNYXRyaXgocG9pbnRzWzFdLCBtKSxcblx0XHRcdHRoaXMubXVsdGlwbHlQb2ludEJ5TWF0cml4KHBvaW50c1syXSwgbSksXG5cdFx0XHR0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChwb2ludHNbM10sIG0pXG5cdFx0XTtcblx0fVxuXG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IG5hbWU6IE1PVkVfVE8sIHBvaW50OiBwb2ludHNbMF0sIG9wdGlvbnM6IFtdIH0pO1xuXHRwb2ludENvbW1hbmRzLnB1c2goeyBuYW1lOiBMSU5FX1RPLCBwb2ludDogcG9pbnRzWzFdLCBvcHRpb25zOiBbXSB9KTtcblx0cG9pbnRDb21tYW5kcy5wdXNoKHsgbmFtZTogTElORV9UTywgcG9pbnQ6IHBvaW50c1syXSwgb3B0aW9uczogW10gfSk7XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IG5hbWU6IExJTkVfVE8sIHBvaW50OiBwb2ludHNbM10sIG9wdGlvbnM6IFtdIH0pO1xuXG5cdHJldHVybiB7IHR5cGU6ICdwb2x5Z29uJywgcG9pbnRDb21tYW5kczogcG9pbnRDb21tYW5kcywgY2xvc2VQYXRoOiB0cnVlLCB0aGlja25lc3M6IHRoaXMuZ2V0VGhpY2tuZXNzKCRyYXdSZWN0KSB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBvbHkgPSBmdW5jdGlvbiAoJHJhd1BvbHkpXG57XG5cdHZhciByZWdleCA9IC8oW1xcLS5cXGRdKylbLCBdKFtcXC0uXFxkXSspL2lnO1xuXHR2YXIgcmVzdWx0ID0gcmVnZXguZXhlYygkcmF3UG9seS5nZXRBdHRyaWJ1dGUoJ3BvaW50cycpKTtcblx0dmFyIHBvaW50Q29tbWFuZHMgPSBbXTtcblxuXHR3aGlsZSAocmVzdWx0KVxuXHR7XG5cdFx0dmFyIG5hbWUgPSBwb2ludENvbW1hbmRzLmxlbmd0aCA9PT0gMCA/IE1PVkVfVE8gOiBMSU5FX1RPO1xuXHRcdHZhciBwb2ludCA9IFt0aGlzLmdldENvb3JkKHJlc3VsdFsxXSksIHRoaXMuZ2V0Q29vcmQocmVzdWx0WzJdKV07XG5cdFx0cG9pbnRDb21tYW5kcy5wdXNoKHsgbmFtZTogbmFtZSwgcG9pbnQ6IHBvaW50LCBvcHRpb25zOiBbXSB9KTtcblx0XHRyZXN1bHQgPSByZWdleC5leGVjKCRyYXdQb2x5LmdldEF0dHJpYnV0ZSgncG9pbnRzJykpO1xuXHR9XG5cdHJldHVybiB7IHR5cGU6ICRyYXdQb2x5LnRhZ05hbWUsIHBvaW50Q29tbWFuZHM6IHBvaW50Q29tbWFuZHMsIGNsb3NlUGF0aDogJHJhd1BvbHkudGFnTmFtZSAhPT0gJ3BvbHlsaW5lJywgdGhpY2tuZXNzOiB0aGlzLmdldFRoaWNrbmVzcygkcmF3UG9seSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VQYXRoID0gZnVuY3Rpb24gKCRyYXdQYXRoKVxue1xuXHR2YXIgZCA9ICRyYXdQYXRoLmdldEF0dHJpYnV0ZSgnZCcpO1xuXHR2YXIgcGF0aFJlZyA9IC8oW2EteV0pKFsuXFwtLFxcZF0rKS9pZ207XG5cdHZhciByZXN1bHQ7XG5cdHZhciBjbG9zZVBhdGggPSAvei9pZ20udGVzdChkKTtcblx0dmFyIGNvb3Jkc1JlZ2V4ID0gLy0/W1xcZC5dKy9pZ207XG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHZhciBsYXN0WCA9IHRoaXMuZ2V0Q29vcmQoMCk7XG5cdHZhciBsYXN0WSA9IHRoaXMuZ2V0Q29vcmQoMCk7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZ2V0UG9pbnQgPSBmdW5jdGlvbiAoJHgsICR5LCAkcmVsYXRpdmUpXG5cdHtcblx0XHR2YXIgeCA9ICR4ID09PSB1bmRlZmluZWQgPyBsYXN0WCA6IHRoYXQuZ2V0Q29vcmQoJHgpO1xuXHRcdHZhciB5ID0gJHkgPT09IHVuZGVmaW5lZCA/IGxhc3RZIDogdGhhdC5nZXRDb29yZCgkeSk7XG5cdFx0aWYgKCRyZWxhdGl2ZSlcblx0XHR7XG5cdFx0XHR4ID0gJHggPT09IHVuZGVmaW5lZCA/IHggOiBsYXN0WCArIHg7XG5cdFx0XHR5ID0gJHkgPT09IHVuZGVmaW5lZCA/IHkgOiBsYXN0WSArIHk7XG5cdFx0fVxuXHRcdHJldHVybiBbeCwgeV07XG5cdH07XG5cblx0dmFyIGdldFJlbGF0aXZlUG9pbnQgPSBmdW5jdGlvbiAoJHBvaW50LCAkeCwgJHksICRyZWxhdGl2ZSlcblx0e1xuXHRcdHZhciB4ID0gdGhhdC5nZXRDb29yZCgkeCk7XG5cdFx0dmFyIHkgPSB0aGF0LmdldENvb3JkKCR5KTtcblx0XHRpZiAoJHJlbGF0aXZlKVxuXHRcdHtcblx0XHRcdHggPSBsYXN0WCArIHg7XG5cdFx0XHR5ID0gbGFzdFkgKyB5O1xuXHRcdH1cblx0XHR4ID0geCAtICRwb2ludFswXTtcblx0XHR5ID0geSAtICRwb2ludFsxXTtcblx0XHRyZXR1cm4gW3gsIHldO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVQb2ludCA9IGZ1bmN0aW9uICgkY29tbWFuZE5hbWUsICRwb2ludCwgJG9wdGlvbnMpXG5cdHtcblx0XHR2YXIgaW5mbyA9IHsgbmFtZTogJGNvbW1hbmROYW1lLCBwb2ludDogJHBvaW50LCBvcHRpb25zOiAkb3B0aW9ucyB8fCBbXSB9O1xuXHRcdGxhc3RYID0gaW5mby5wb2ludFswXTtcblx0XHRsYXN0WSA9IGluZm8ucG9pbnRbMV07XG5cdFx0cG9pbnRDb21tYW5kcy5wdXNoKGluZm8pO1xuXHR9O1xuXG5cdHZhciBwb2ludDtcblx0dmFyIGN1YmljMTtcblx0dmFyIGN1YmljMjtcblx0dmFyIHF1YWRyYTE7XG5cblx0cmVzdWx0ID0gcGF0aFJlZy5leGVjKGQpO1xuXG5cdHdoaWxlIChyZXN1bHQpXG5cdHtcblx0XHR2YXIgaW5zdHJ1Y3Rpb24gPSByZXN1bHRbMV0udG9Mb3dlckNhc2UoKTtcblx0XHR2YXIgY29vcmRzID0gcmVzdWx0WzJdLm1hdGNoKGNvb3Jkc1JlZ2V4KTtcblx0XHR2YXIgaXNMb3dzZXJDYXNlID0gL1thLXpdLy50ZXN0KHJlc3VsdFsxXSk7XG5cblx0XHRzd2l0Y2ggKGluc3RydWN0aW9uKVxuXHRcdHtcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRjYXNlICdtJzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KE1PVkVfVE8sIHBvaW50KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdsJzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KExJTkVfVE8sIHBvaW50KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd2Jzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQodW5kZWZpbmVkLCBjb29yZHNbMF0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KExJTkVfVE8sIHBvaW50KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdoJzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzBdLCB1bmRlZmluZWQsIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KExJTkVfVE8sIHBvaW50KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdjJzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzRdLCBjb29yZHNbNV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGN1YmljMSA9IGdldFJlbGF0aXZlUG9pbnQocG9pbnQsIGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjdWJpYzIgPSBnZXRSZWxhdGl2ZVBvaW50KHBvaW50LCBjb29yZHNbMl0sIGNvb3Jkc1szXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoQkVaSUVSX1RPLCBwb2ludCwgW2N1YmljMSwgY3ViaWMyXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncyc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjdWJpYzEgPSBjdWJpYzIgPyBbbGFzdFggLSBjdWJpYzJbMF0gLSBwb2ludFswXSwgbGFzdFkgLSBjdWJpYzJbMV0gLSBwb2ludFsxXV0gOiB1bmRlZmluZWQ7XG5cdFx0XHRcdGN1YmljMiA9IGdldFJlbGF0aXZlUG9pbnQocG9pbnQsIGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjdWJpYzEgPSBjdWJpYzEgfHwgW2N1YmljMlswXSwgY3ViaWMyWzFdXTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoQkVaSUVSX1RPLCBwb2ludCwgW2N1YmljMSwgY3ViaWMyXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncSc6XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdHF1YWRyYTEgPSBnZXRSZWxhdGl2ZVBvaW50KHBvaW50LCBjb29yZHNbMF0sIGNvb3Jkc1sxXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoUVVBRFJBX1RPLCBwb2ludCwgW3F1YWRyYTFdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd0Jzpcblx0XHRcdFx0Y3ViaWMyID0gbnVsbDtcblx0XHRcdFx0cXVhZHJhMSA9IHF1YWRyYTEgPyBxdWFkcmExIDogcG9pbnQ7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KFFVQURSQV9UTywgcG9pbnQsIFtxdWFkcmExXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnYSc6XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1s1XSwgY29vcmRzWzZdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgnYXJjVG8nLCBwb2ludCk7XG5cdFx0XHRcdGNvbnNvbGUud2Fybignbm90IHN1cHBvcnRlZCcpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXN1bHQgPSBwYXRoUmVnLmV4ZWMoZCk7XG5cdH1cblxuXHRyZXR1cm4geyB0eXBlOiAncGF0aCcsIHBvaW50Q29tbWFuZHM6IHBvaW50Q29tbWFuZHMsIGNsb3NlUGF0aDogY2xvc2VQYXRoLCB0aGlja25lc3M6IHRoaXMuZ2V0VGhpY2tuZXNzKCRyYXdQYXRoKSB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5yb3VuZCA9IGZ1bmN0aW9uICgkbnVtYmVyKVxue1xuXHQvLyB2YXIgbnVtYmVyID0gTnVtYmVyKCRudW1iZXIpO1xuXHQvLyByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIgKiAxMDApIC8gMTAwO1xuXHRyZXR1cm4gJG51bWJlcjtcblx0Ly9yZXR1cm4gTWF0aC5mbG9vcihOdW1iZXIoJG51bWJlcikpO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRUaGlja25lc3MgPSBmdW5jdGlvbiAoJHJhdylcbntcblx0dmFyIHJhd1RoaWNrbmVzcyA9ICRyYXcuZ2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnKSB8fCAxO1xuXHRyZXR1cm4gdGhpcy5nZXRDb29yZChyYXdUaGlja25lc3MpO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRNYXRyaXggPSBmdW5jdGlvbiAoJGF0dHJpYnV0ZSlcbntcblx0aWYgKCEkYXR0cmlidXRlKSB7IHJldHVybiBudWxsOyB9XG5cblx0dmFyIFRGVHlwZSA9ICRhdHRyaWJ1dGUubWF0Y2goLyhbYS16XSspL2lnbSlbMF07XG5cdHZhciB2YWx1ZXMgPSAkYXR0cmlidXRlLm1hdGNoKC8oLT9bXFxkLl0rKS9pZ20pO1xuXG5cdHZhciBtYXRyaWNlcyA9IFtdO1xuXHR2YXIgdFg7XG5cdHZhciB0WTtcblx0dmFyIGFuZ2xlO1xuXG5cdGlmIChURlR5cGUgPT09ICdtYXRyaXgnKVxuXHR7XG5cdFx0cmV0dXJuIFtOdW1iZXIodmFsdWVzWzBdKSwgTnVtYmVyKHZhbHVlc1syXSksIHRoaXMuZ2V0Q29vcmQodmFsdWVzWzRdKSwgTnVtYmVyKHZhbHVlc1sxXSksIE51bWJlcih2YWx1ZXNbM10pLCB0aGlzLmdldENvb3JkKHZhbHVlc1s1XSksIDAsIDAsIDFdO1xuXHR9XG5cdGVsc2UgaWYgKFRGVHlwZSA9PT0gJ3JvdGF0ZScpXG5cdHtcblx0XHRhbmdsZSA9IE51bWJlcih2YWx1ZXNbMF0pICogKE1hdGguUEkgLyAxODApO1xuXHRcdHRYID0gdGhpcy5nZXRDb29yZChOdW1iZXIodmFsdWVzWzFdIHx8IDApKTtcblx0XHR0WSA9IHRoaXMuZ2V0Q29vcmQoTnVtYmVyKHZhbHVlc1syXSB8fCAwKSk7XG5cdFx0dmFyIG0xID0gWzEsIDAsIHRYLCAwLCAxLCB0WSwgMCwgMCwgMV07XG5cdFx0dmFyIG0yID0gW01hdGguY29zKGFuZ2xlKSwgLU1hdGguc2luKGFuZ2xlKSwgMCwgTWF0aC5zaW4oYW5nbGUpLCBNYXRoLmNvcyhhbmdsZSksIDAsIDAsIDAsIDFdO1xuXHRcdHZhciBtMyA9IFsxLCAwLCAtdFgsIDAsIDEsIC10WSwgMCwgMCwgMV07XG5cblx0XHRtYXRyaWNlcy5wdXNoKG0xLCBtMiwgbTMpO1xuXHRcdHZhciBwID0gbTE7XG5cblx0XHRmb3IgKHZhciBpID0gMSwgbWF0cmljZXNMZW5ndGggPSBtYXRyaWNlcy5sZW5ndGg7IGkgPCBtYXRyaWNlc0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyTWF0ID0gbWF0cmljZXNbaV07XG5cdFx0XHR2YXIgbmV3UCA9IFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTtcblx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgOTsgayArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcm93ID0gTWF0aC5mbG9vcihrIC8gMyk7XG5cdFx0XHRcdHZhciBjb2wgPSBrICUgMztcblx0XHRcdFx0Ly92YXIgbVZhbCA9IHBbcm93ICogY29sIC0gMV07XG5cdFx0XHRcdGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IDM7IHBvcyArPSAxKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmV3UFtrXSA9IG5ld1Bba10gKyBwW3JvdyAqIDMgKyBwb3NdICogY3Vyck1hdFtwb3MgKiAzICsgY29sXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cCA9IG5ld1A7XG5cdFx0fVxuXHRcdHJldHVybiBwO1xuXHR9XG5cdGVsc2UgaWYgKFRGVHlwZSA9PT0gJ3RyYW5zbGF0ZScpXG5cdHtcblx0XHR0WCA9IHRoaXMuZ2V0Q29vcmQoTnVtYmVyKHZhbHVlc1swXSB8fCAwKSk7XG5cdFx0dFkgPSB0aGlzLmdldENvb3JkKE51bWJlcih2YWx1ZXNbMV0gfHwgMCkpO1xuXHRcdHJldHVybiBbMSwgMCwgdFgsIDAsIDEsIHRZLCAwLCAwLCAxXTtcblx0fVxuXHRlbHNlIGlmIChURlR5cGUgPT09ICdzY2FsZScpXG5cdHtcblx0XHR2YXIgc1ggPSB0aGlzLmdldENvb3JkKE51bWJlcih2YWx1ZXNbMF0gfHwgMCkpO1xuXHRcdHZhciBzWSA9IHRoaXMuZ2V0Q29vcmQoTnVtYmVyKHZhbHVlc1sxXSB8fCAwKSk7XG5cdFx0cmV0dXJuIFtzWCwgMCwgMCwgMCwgc1ksIDBdO1xuXHR9XG5cdGVsc2UgaWYgKFRGVHlwZSA9PT0gJ3NrZXdYJylcblx0e1xuXHRcdGFuZ2xlID0gTnVtYmVyKHZhbHVlc1swXSkgKiAoTWF0aC5QSSAvIDE4MCk7XG5cdFx0cmV0dXJuIFsxLCBNYXRoLnRhbihhbmdsZSksIDAsIDAsIDEsIDAsIDAsIDAsIDFdO1xuXHR9XG5cdGVsc2UgaWYgKFRGVHlwZSA9PT0gJ3NrZXdZJylcblx0e1xuXHRcdGFuZ2xlID0gTnVtYmVyKHZhbHVlc1swXSkgKiAoTWF0aC5QSSAvIDE4MCk7XG5cdFx0cmV0dXJuIFsxLCAwLCAwLCBNYXRoLnRhbihhbmdsZSksIDEsIDAsIDAsIDAsIDFdO1xuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLm11bHRpcGx5UG9pbnRCeU1hdHJpeCA9IGZ1bmN0aW9uICgkcG9pbnQsIG0pXG57XG5cdHZhciBoID0gWyRwb2ludFswXSwgJHBvaW50WzFdLCAxXTtcblx0dmFyIHAgPVxuXHRbXG5cdFx0bVswXSAqIGhbMF0gKyBtWzFdICogaFsxXSArIG1bMl0gKiBoWzJdLFxuXHRcdG1bM10gKiBoWzBdICsgbVs0XSAqIGhbMV0gKyBtWzVdICogaFsyXSxcblx0XHRtWzZdICogaFswXSArIG1bN10gKiBoWzFdICsgbVs4XSAqIGhbMl1cblx0XTtcblx0cmV0dXJuIFtwWzBdIC8gcFsyXSwgcFsxXSAvIHBbMl1dO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRSb3RhdGlvbiA9IGZ1bmN0aW9uICgkYXR0cmlidXRlKVxue1xuXHR2YXIgbWF0cml4ID0gdGhpcy5nZXRNYXRyaXgoJGF0dHJpYnV0ZSk7XG5cdGlmIChtYXRyaXgpXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5hdGFuMihtYXRyaXhbMF0sIG1hdHJpeFszXSk7XG5cdH1cblx0cmV0dXJuIDA7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldENvb3JkID0gZnVuY3Rpb24gKCRjb29yZFNUUilcbntcblx0dmFyIG51bWJlciA9IHRoaXMucm91bmQoJGNvb3JkU1RSKTtcblx0cmV0dXJuIG51bWJlciAqIHRoaXMucmF0aW87XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWR1BhcnNlcjtcblxuIiwidmFyIFNWSmVsbHlOb2RlID0gcmVxdWlyZSgnLi9TVkplbGx5Tm9kZScpO1xudmFyIFNWSmVsbHlKb2ludCA9IHJlcXVpcmUoJy4vU1ZKZWxseUpvaW50Jyk7XG52YXIgT2JqZWN0RHJhd2luZyA9IHJlcXVpcmUoJy4vT2JqZWN0RHJhd2luZycpO1xuXG52YXIgU1ZKZWxseUdyb3VwID0gZnVuY3Rpb24gKCR0eXBlLCAkY29uZiwgJElEKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyID0gdW5kZWZpbmVkO1xuXHR0aGlzLmRyYXdpbmcgPSBuZXcgT2JqZWN0RHJhd2luZyh0aGlzKTtcblx0dGhpcy5zdHJ1Y3R1cmUgPSB1bmRlZmluZWQ7XG5cdHRoaXMubm9kZXNMZW5ndGggPSB1bmRlZmluZWQ7XG5cdHRoaXMuY29uZiA9ICRjb25mO1xuXHR0aGlzLmZpeGVkID0gdGhpcy5jb25mLmZpeGVkO1xuXHR0aGlzLnR5cGUgPSAkdHlwZTtcblx0dGhpcy5ub2RlcyA9IFtdO1xuXHR0aGlzLmpvaW50cyA9IFtdO1xuXHR0aGlzLklEID0gJElEO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5nZXROb2RlQXRQb2ludCA9IGZ1bmN0aW9uICgkeCwgJHkpXG57XG5cdGZvciAodmFyIGkgPSAwLCBub2Rlc0xlbmd0aCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbm9kZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcblxuXHRcdGlmIChub2RlLm9YID09PSAkeCAmJiBub2RlLm9ZID09PSAkeSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gbm9kZTtcblx0XHR9XG5cdH1cbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuY3JlYXRlTm9kZSA9IGZ1bmN0aW9uICgkcHgsICRweSwgJG9wdGlvbnMsICRvdmVyd3JpdGUpXG57XG5cdHZhciBub2RlID0gdGhpcy5nZXROb2RlQXRQb2ludCgkcHgsICRweSk7XG5cdGlmIChub2RlICE9PSB1bmRlZmluZWQgJiYgJG92ZXJ3cml0ZSlcblx0e1xuXHRcdG5vZGUuc2V0T3B0aW9ucygkb3B0aW9ucyk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0bm9kZSA9IG5ldyBTVkplbGx5Tm9kZSgkcHgsICRweSwgJG9wdGlvbnMpO1xuXHRcdHRoaXMubm9kZXMucHVzaChub2RlKTtcblx0fVxuXG5cdG5vZGUucGh5c2ljc01hbmFnZXIgPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldE5vZGVQaHlzaWNzTWFuYWdlcihub2RlKTtcblx0Ly90aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZE5vZGVUb1dvcmxkKG5vZGUpO1xuXG5cdHRoaXMubm9kZXNMZW5ndGggPSB0aGlzLm5vZGVzLmxlbmd0aDtcblxuXHRyZXR1cm4gbm9kZTtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Q2xvc2VzdFBvaW50ID0gZnVuY3Rpb24gKCRwb2ludHMsICRub2Rlcylcbntcblx0dmFyIG5vZGVzID0gJG5vZGVzIHx8IHRoaXMubm9kZXM7XG5cdHZhciBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xuXHR2YXIgY2xvc2VzdFBvaW50O1xuXHR2YXIgY2xvc2VzdE5vZGU7XG5cdHZhciBjbG9zZXN0T2Zmc2V0WDtcblx0dmFyIGNsb3Nlc3RPZmZzZXRZO1xuXG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSAkcG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0Zm9yICh2YXIgayA9IDAsIG5vZGVzTGVuZ3RoID0gbm9kZXMubGVuZ3RoOyBrIDwgbm9kZXNMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3Vyck5vZGUgPSBub2Rlc1trXTtcblx0XHRcdHZhciBvZmZzZXRYID0gY3VyclBvaW50WzBdIC0gY3Vyck5vZGUub1g7XG5cdFx0XHR2YXIgb2Zmc2V0WSA9IGN1cnJQb2ludFsxXSAtIGN1cnJOb2RlLm9ZO1xuXHRcdFx0dmFyIGNYID0gTWF0aC5hYnMob2Zmc2V0WCk7XG5cdFx0XHR2YXIgY1kgPSBNYXRoLmFicyhvZmZzZXRZKTtcblx0XHRcdHZhciBkaXN0ID0gTWF0aC5zcXJ0KGNYICogY1ggKyBjWSAqIGNZKTtcblx0XHRcdGlmIChkaXN0IDwgY2xvc2VzdERpc3QpXG5cdFx0XHR7XG5cdFx0XHRcdGNsb3Nlc3ROb2RlID0gY3Vyck5vZGU7XG5cdFx0XHRcdGNsb3Nlc3RQb2ludCA9IGN1cnJQb2ludDtcblx0XHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdFx0XHRjbG9zZXN0T2Zmc2V0WCA9IG9mZnNldFg7XG5cdFx0XHRcdGNsb3Nlc3RPZmZzZXRZID0gb2Zmc2V0WTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY2xvc2VzdFBvaW50O1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5nZXRDbG9zZXN0Tm9kZSA9IGZ1bmN0aW9uICgkY29vcmQsICRub2Rlcylcbntcblx0dmFyIG5vZGVzID0gJG5vZGVzIHx8IHRoaXMubm9kZXM7XG5cdHZhciBjbG9zZXN0RGlzdCA9IEluZmluaXR5O1xuXHR2YXIgY2xvc2VzdDtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSBub2Rlc1tpXTtcblx0XHR2YXIgb2Zmc2V0WCA9ICRjb29yZFswXSAtIG5vZGUub1g7XG5cdFx0dmFyIG9mZnNldFkgPSAkY29vcmRbMV0gLSBub2RlLm9ZO1xuXHRcdHZhciBjWCA9IE1hdGguYWJzKG9mZnNldFgpO1xuXHRcdHZhciBjWSA9IE1hdGguYWJzKG9mZnNldFkpO1xuXHRcdHZhciBkaXN0ID0gTWF0aC5zcXJ0KGNYICogY1ggKyBjWSAqIGNZKTtcblx0XHRpZiAoZGlzdCA8IGNsb3Nlc3REaXN0KVxuXHRcdHtcblx0XHRcdGNsb3Nlc3QgPSBub2RlO1xuXHRcdFx0Y2xvc2VzdERpc3QgPSBkaXN0O1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gY2xvc2VzdDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Tm9kZXNJbnNpZGUgPSBmdW5jdGlvbiAoJHBvaW50cylcbntcblx0dmFyIFBvbHlnb24gPSByZXF1aXJlKCcuL1BvbHlnb24nKTtcblx0dmFyIHRvUmV0dXJuID0gW107XG5cdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRwb2ludHMpO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5ub2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gdGhpcy5ub2Rlc1tpXTtcblx0XHRpZiAocG9seWdvbi5pc0luc2lkZShbbm9kZS5vWCwgbm9kZS5vWV0pKVxuXHRcdHtcblx0XHRcdHRvUmV0dXJuLnB1c2gobm9kZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0b1JldHVybjtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuY3JlYXRlSm9pbnQgPSBmdW5jdGlvbiAoJG5vZGVBLCAkbm9kZUIsICR0eXBlKVxue1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuam9pbnRzLmxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJKb2ludCA9IHRoaXMuam9pbnRzW2ldO1xuXHRcdGlmICgoY3VyckpvaW50Lm5vZGVBID09PSAkbm9kZUEgJiYgY3VyckpvaW50Lm5vZGVCID09PSAkbm9kZUIpIHx8IChjdXJySm9pbnQubm9kZUIgPT09ICRub2RlQSAmJiBjdXJySm9pbnQubm9kZUEgPT09ICRub2RlQikpXG5cdFx0e1xuXHRcdFx0Ly9yZXR1cm47XG5cdFx0XHR0aGlzLmpvaW50cy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRpID0gaSAtIDE7XG5cdFx0fVxuXHR9XG5cdHZhciBqb2ludCA9IG5ldyBTVkplbGx5Sm9pbnQoJG5vZGVBLCAkbm9kZUIsICR0eXBlKTtcblx0dGhpcy5qb2ludHMucHVzaChqb2ludCk7XG5cblx0Ly90aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZEpvaW50VG9Xb3JsZChqb2ludCk7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmFkZE5vZGVzVG9Xb3JsZCA9IGZ1bmN0aW9uICgpXG57XG5cdHRoaXMucGh5c2ljc01hbmFnZXIuYWRkTm9kZXNUb1dvcmxkKCk7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmFkZEpvaW50c1RvV29ybGQgPSBmdW5jdGlvbiAoKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZEpvaW50c1RvV29ybGQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseUdyb3VwO1xuXG4iLCJ2YXIgU1ZKZWxseUpvaW50ID0gZnVuY3Rpb24gKCRub2RlQSwgJG5vZGVCLCAkdHlwZSlcbntcblx0dGhpcy5ub2RlQSA9ICRub2RlQTtcblx0dGhpcy5ub2RlQiA9ICRub2RlQjtcblx0dGhpcy50eXBlID0gJHR5cGUgfHwgJ2RlZmF1bHQnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkplbGx5Sm9pbnQ7XG5cbiIsInZhciBTVkplbGx5Tm9kZSA9IGZ1bmN0aW9uICgkb1gsICRvWSwgJG9wdGlvbnMpXG57XG5cdHRoaXMuam9pbnRzQXJyYXkgPSBbXTtcblx0dGhpcy5vWCA9ICRvWDtcblx0dGhpcy5vWSA9ICRvWTtcblx0dGhpcy5maXhlZCA9IGZhbHNlO1xuXHR0aGlzLmRyYXdpbmcgPSB1bmRlZmluZWQ7XG5cdHRoaXMuc2V0T3B0aW9ucygkb3B0aW9ucyk7XG59O1xuXG4vL3JhY2NvdXJjaVxuU1ZKZWxseU5vZGUucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAoJG9wdGlvbnMpXG57XG5cdGlmICgkb3B0aW9ucylcblx0e1xuXHRcdC8vIHZhciA9ICQgPT09IHVuZGVmaW5lZCA/IHt9IDogJG9wdGlvbnM7XG5cdFx0aWYgKCRvcHRpb25zLmZpeGVkICE9PSB1bmRlZmluZWQpIHsgdGhpcy5maXhlZCA9ICRvcHRpb25zLmZpeGVkOyB9XG5cdH1cbn07XG5cblNWSmVsbHlOb2RlLnByb3RvdHlwZS5zZXRGaXhlZCA9IGZ1bmN0aW9uICgkZml4ZWQpXG57XG5cdHRoaXMuZml4ZWQgPSAkZml4ZWQ7XG5cdHRoaXMucGh5c2ljc01hbmFnZXIuc2V0Rml4ZWQoJGZpeGVkKTtcbn07XG5cblNWSmVsbHlOb2RlLnByb3RvdHlwZS5nZXRYID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMucGh5c2ljc01hbmFnZXIuZ2V0WCgpO1xufTtcblxuLy9yYWNjb3VyY2lcblNWSmVsbHlOb2RlLnByb3RvdHlwZS5nZXRZID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMucGh5c2ljc01hbmFnZXIuZ2V0WSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkplbGx5Tm9kZTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGV4dGVuZDogZnVuY3Rpb24gKCR0b0V4dGVuZCwgJGV4dGVuc2lvbilcblx0e1xuXHRcdHZhciByZWN1ciA9IGZ1bmN0aW9uICgkb2JqZWN0LCAkZXh0ZW5kKVxuXHRcdHtcblx0XHRcdGZvciAodmFyIG5hbWUgaW4gJGV4dGVuZClcblx0XHRcdHtcblx0XHRcdFx0aWYgKHR5cGVvZiAkZXh0ZW5kW25hbWVdID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSgkZXh0ZW5kW25hbWVdKSAmJiAkZXh0ZW5kW25hbWVdICE9PSBudWxsKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKCRvYmplY3RbbmFtZV0gPT09IHVuZGVmaW5lZCkgeyAkb2JqZWN0W25hbWVdID0ge307IH1cblx0XHRcdFx0XHRyZWN1cigkb2JqZWN0W25hbWVdLCAkZXh0ZW5kW25hbWVdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkb2JqZWN0W25hbWVdID0gJGV4dGVuZFtuYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdFx0cmVjdXIoJHRvRXh0ZW5kLCAkZXh0ZW5zaW9uKTtcblxuXHRcdHJldHVybiAkdG9FeHRlbmQ7XG5cdH1cbn07XG5cbiIsInZhciBTVkplbGx5R3JvdXAgPSByZXF1aXJlKCcuL1NWSmVsbHlHcm91cCcpO1xudmFyIFN0cnVjdHVyZSA9IHJlcXVpcmUoJy4vU3RydWN0dXJlJyk7XG5cbnZhciBTVkplbGx5V29ybGQgPSBmdW5jdGlvbiAoJHBoeXNpY3NNYW5hZ2VyLCAkY29uZilcbntcblx0dGhpcy5waHlzaWNzTWFuYWdlciA9ICRwaHlzaWNzTWFuYWdlcjtcblx0dGhpcy5ncm91cHMgPSBbXTtcblx0dGhpcy5jb25mID0gJGNvbmY7XG5cdHRoaXMud29ybGROb2RlcyA9IFtdO1xuXHR0aGlzLmdyb3VwQ29uc3RyYWludHMgPSBbXTtcblx0dGhpcy53b3JsZFdpZHRoID0gdGhpcy5waHlzaWNzTWFuYWdlci53b3JsZFdpZHRoID0gJGNvbmYud29ybGRXaWR0aDtcbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuc2V0SGVpZ2h0ID0gZnVuY3Rpb24gKCRoZWlnaHQpXG57XG5cdHRoaXMud29ybGRIZWlnaHQgPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLndvcmxkSGVpZ2h0ID0gJGhlaWdodDtcbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuZ2V0V2lkdGggPSBmdW5jdGlvbiAoKVxue1xuXHRyZXR1cm4gdGhpcy53b3JsZFdpZHRoO1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5nZXRHcm91cEJ5SUQgPSBmdW5jdGlvbiAoJElEKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5ncm91cHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3Vyckdyb3VwID0gdGhpcy5ncm91cHNbaV07XG5cdFx0aWYgKGN1cnJHcm91cC5JRCA9PT0gJElEKSB7IHJldHVybiBjdXJyR3JvdXA7IH1cblx0fVxufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5jcmVhdGVHcm91cCA9IGZ1bmN0aW9uICgkdHlwZSwgJElEKVxue1xuXHR2YXIgY29uZiA9IHRoaXMuY29uZi5ncm91cHNbJHR5cGVdIHx8IHRoaXMuY29uZi5ncm91cHMuZGVmYXVsdDtcblx0dmFyIGdyb3VwID0gbmV3IFNWSmVsbHlHcm91cCgkdHlwZSwgY29uZiwgJElEKTtcblx0Z3JvdXAucGh5c2ljc01hbmFnZXIgPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldEdyb3VwUGh5c2ljc01hbmFnZXIoZ3JvdXApO1xuXHRncm91cC5zdHJ1Y3R1cmUgPSBuZXcgU3RydWN0dXJlKGdyb3VwLCB0aGlzKTtcblx0dGhpcy5ncm91cHMucHVzaChncm91cCk7XG5cdHJldHVybiBncm91cDtcbn07XG5cbi8vbWF5YmUgc3BsaXQgdGhpcyBpbnRvIHR3byBkaWZmZXJlbnQgZmVhdHVyZXMsIHN0dWZmIGZvciBtYWtpbmcgYm9kaWVzIGZpeGVkLCBhbmQgY29uc3RyYWludHNcblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuY29uc3RyYWluR3JvdXBzID0gZnVuY3Rpb24gKCRncm91cEEsICRncm91cEIsICRwb2ludHMsICR0eXBlKVxue1xuXHR2YXIgcG9pbnRzID0gJHBvaW50cztcblx0dmFyIGdyb3VwQSA9ICRncm91cEE7XG5cdHZhciBncm91cEIgPSAkZ3JvdXBCO1xuXG5cdGlmIChwb2ludHMubGVuZ3RoIDwgMylcblx0e1xuXHRcdHZhciBhbmNob3JBID0gZ3JvdXBBLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUFuY2hvckZyb21MaW5lKHBvaW50cyk7XG5cdFx0cG9pbnRzLnNwbGljZShwb2ludHMuaW5kZXhPZihhbmNob3JBLnBvaW50KSwgMSk7XG5cdFx0dmFyIGFuY2hvckIgPSBncm91cEIgPyBncm91cEIucGh5c2ljc01hbmFnZXIuY3JlYXRlQW5jaG9yRnJvbVBvaW50KHBvaW50c1swXSkgOiB0aGlzLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUdob3N0QW5jaG9yRnJvbVBvaW50KHBvaW50c1swXSk7XG5cdFx0dGhpcy5ncm91cENvbnN0cmFpbnRzLnB1c2goeyBhbmNob3JBOiBhbmNob3JBLCBhbmNob3JCOiBhbmNob3JCLCB0eXBlOiAkdHlwZSB9KTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHR2YXIgYW5jaG9yc0EgPSBncm91cEEucGh5c2ljc01hbmFnZXIuY3JlYXRlQW5jaG9ycyhwb2ludHMpO1xuXHRcdHZhciBhbmNob3JzQiA9IGdyb3VwQiA/IGdyb3VwQi5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JzKHBvaW50cykgOiBbXTtcblx0XHQvL2NvbnNvbGUubG9nKCdBJywgZ3JvdXBBLklELCBhbmNob3JzQS5sZW5ndGgsICdCJywgZ3JvdXBCID8gZ3JvdXBCLklEIDogZ3JvdXBCKTtcblx0XHRmb3IgKHZhciBpID0gMCwgbm9kZXNMZW5ndGggPSBhbmNob3JzQS5sZW5ndGg7IGkgPCBub2Rlc0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyQW5jaG9yQSA9IGFuY2hvcnNBW2ldO1xuXHRcdFx0aWYgKCFncm91cEIpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICgkdHlwZSA9PT0gJ2RlZmF1bHQnKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0Y3VyckFuY2hvckEuc2V0Rml4ZWQodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGdob3N0QW5jaG9yID0gdGhpcy5waHlzaWNzTWFuYWdlci5jcmVhdGVHaG9zdEFuY2hvckZyb21Qb2ludHMocG9pbnRzKTtcblx0XHRcdFx0XHR0aGlzLmdyb3VwQ29uc3RyYWludHMucHVzaCh7IGFuY2hvckE6IGN1cnJBbmNob3JBLCBhbmNob3JCOiBnaG9zdEFuY2hvciwgdHlwZTogJHR5cGUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIGFuY2hvcnNCTGVuZ3RoID0gYW5jaG9yc0IubGVuZ3RoOyBrIDwgYW5jaG9yc0JMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyQW5jaG9yQiA9IGFuY2hvcnNCW2tdO1xuXHRcdFx0XHRcdHRoaXMuZ3JvdXBDb25zdHJhaW50cy5wdXNoKHsgYW5jaG9yQTogY3VyckFuY2hvckEsIGFuY2hvckI6IGN1cnJBbmNob3JCLCB0eXBlOiAkdHlwZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5hZGRHcm91cHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0Zm9yICh2YXIgaSA9IDAsIGdyb3Vwc0xlbmd0aCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDsgaSA8IGdyb3Vwc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMuZ3JvdXBzW2ldO1xuXHRcdGN1cnJHcm91cC5hZGROb2Rlc1RvV29ybGQoKTtcblx0XHRjdXJyR3JvdXAuYWRkSm9pbnRzVG9Xb3JsZCgpO1xuXHRcdHRoaXMud29ybGROb2RlcyA9IHRoaXMud29ybGROb2Rlcy5jb25jYXQoY3Vyckdyb3VwLm5vZGVzKTtcblx0fVxuXG5cdHZhciB0b0NvbnN0cmFpbkxlbmd0aCA9IHRoaXMuZ3JvdXBDb25zdHJhaW50cy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCB0b0NvbnN0cmFpbkxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUb0NvbnN0cmFpbiA9IHRoaXMuZ3JvdXBDb25zdHJhaW50c1tpXTtcblx0XHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmNvbnN0cmFpbkdyb3VwcyhjdXJyVG9Db25zdHJhaW4uYW5jaG9yQSwgY3VyclRvQ29uc3RyYWluLmFuY2hvckIsIGN1cnJUb0NvbnN0cmFpbi50eXBlKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkplbGx5V29ybGQ7XG5cbiIsInZhciBUcmlhbmd1bGF0b3IgPSByZXF1aXJlKCcuL1RyaWFuZ3VsYXRvcicpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuL1BvbHlnb24nKTtcbnZhciBHcmlkID0gcmVxdWlyZSgnLi9HcmlkJyk7XG5cbnZhciBTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJGdyb3VwLCAkd29ybGQpXG57XG5cdHRoaXMud29ybGQgPSAkd29ybGQ7XG5cdHRoaXMuZ3JvdXAgPSAkZ3JvdXA7XG5cdHRoaXMuaW5uZXJTdHJ1Y3R1cmUgPSB1bmRlZmluZWQ7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgkZHJhd2luZ0NvbW1hbmRzKVxue1xuXHR0aGlzLnBvaW50cyA9IHRoaXMuZ2V0UG9pbnRzKCRkcmF3aW5nQ29tbWFuZHMpO1xuXHR0aGlzLmRyYXdpbmdDb21tYW5kcyA9ICRkcmF3aW5nQ29tbWFuZHM7XG5cblx0dGhpcy5lbnZlbG9wZSA9IHVuZGVmaW5lZDtcblx0dGhpcy5maWxsTm9kZXMgPSB1bmRlZmluZWQ7XG5cblx0Ly8gY29uc29sZS5sb2coJ3BvaW50cycsIHBvaW50cy5sZW5ndGgsIHRoaXMuZ3JvdXAuY29uZi5zdHJ1Y3R1cmUpO1xuXG5cdHRoaXMuYXJlYSA9IHRoaXMuY2FsY3VsYXRlQXJlYSh0aGlzLnBvaW50cywgJGRyYXdpbmdDb21tYW5kcyk7XG5cdHRoaXMucmFkaXVzWCA9ICRkcmF3aW5nQ29tbWFuZHMucmFkaXVzWDtcblx0dGhpcy5yYWRpdXNZID0gJGRyYXdpbmdDb21tYW5kcy5yYWRpdXNZO1xuXG5cdHN3aXRjaCAodGhpcy5ncm91cC5jb25mLnN0cnVjdHVyZSlcblx0e1xuXHRcdGNhc2UgJ3RyaWFuZ3VsYXRlJzpcblx0XHRcdHRoaXMucmVtb3ZlRHVwbGljYXRlcyh0aGlzLmRyYXdpbmdDb21tYW5kcyk7XG5cdFx0XHR2YXIgdHJpUG9pbnRzID0gdGhpcy5nZXRQb2ludHModGhpcy5kcmF3aW5nQ29tbWFuZHMpO1xuXHRcdFx0dGhpcy5lbnZlbG9wZSA9IHRoaXMuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHRyaVBvaW50cyk7XG5cdFx0XHR0aGlzLnNldE5vZGVEcmF3aW5nQ29tbWFuZHModGhpcy5lbnZlbG9wZSk7XG5cdFx0XHR0aGlzLmNyZWF0ZUpvaW50c0Zyb21UcmlhbmdsZXModHJpUG9pbnRzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2xpbmUnOlxuXHRcdFx0dGhpcy5lbnZlbG9wZSA9IHRoaXMuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHRoaXMucG9pbnRzKTtcblx0XHRcdHRoaXMuc2V0Tm9kZURyYXdpbmdDb21tYW5kcyh0aGlzLmVudmVsb3BlKTtcblx0XHRcdHRoaXMuY3JlYXRlSm9pbnRzRnJvbVBvaW50cyh0aGlzLnBvaW50cywgdHJ1ZSk7XG5cdFx0XHQvL2VudmVsb3BlWzBdLmZpeGVkID0gdHJ1ZTsvL3RvIHJlbW92ZSBsYXRlciBtYXliZSA/XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdwcmVjaXNlSGV4YUZpbGwnOlxuXHRcdFx0dGhpcy5lbnZlbG9wZSA9IHRoaXMuY3JlYXRlUHJlY2lzZUhleGFGaWxsU3RydWN0dXJlKHRoaXMucG9pbnRzKTtcblx0XHRcdC8vIHN0cnVjdHVyZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKCRlbGVtZW50KSB7ICRlbGVtZW50LmRyYXdpbmcgPSB7IG5vdFRvRHJhdzogdHJ1ZSB9OyB9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2hleGFGaWxsJzpcblx0XHRcdHRoaXMuZW52ZWxvcGUgPSB0aGlzLmNyZWF0ZUhleGFGaWxsU3RydWN0dXJlKHRoaXMucG9pbnRzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ3NpbXBsZSc6XG5cdFx0XHR0aGlzLmVudmVsb3BlID0gdGhpcy5jcmVhdGVOb2Rlc0Zyb21Qb2ludHModGhpcy5wb2ludHMpO1xuXHRcdFx0dGhpcy5jcmVhdGVKb2ludHNGcm9tUG9pbnRzKHRoaXMucG9pbnRzKTtcblx0XHRcdHRoaXMuc2V0Tm9kZURyYXdpbmdDb21tYW5kcyh0aGlzLmVudmVsb3BlKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHR0aGlzLmVudmVsb3BlID0gdGhpcy5jcmVhdGVOb2Rlc0Zyb21Qb2ludHModGhpcy5wb2ludHMsIHRydWUpO1xuXHRcdFx0dGhpcy5zZXROb2RlRHJhd2luZ0NvbW1hbmRzKHRoaXMuZW52ZWxvcGUpO1xuXHRcdFx0YnJlYWs7XG5cdH1cbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY2FsY3VsYXRlQXJlYSA9IGZ1bmN0aW9uICgkcG9pbnRzLCAkZHJhd2luZ0NvbW1hbmRzKVxue1xuXHRpZiAoJGRyYXdpbmdDb21tYW5kcy50eXBlID09PSAnZWxsaXBzZScpXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5wb3coTWF0aC5QSSAqICRkcmF3aW5nQ29tbWFuZHMucmFkaXVzWCwgMik7XG5cdH1cblx0aWYgKHRoaXMuZ3JvdXAuY29uZi5zdHJ1Y3R1cmUgIT09ICdsaW5lJylcblx0e1xuXHRcdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRwb2ludHMpO1xuXHRcdHJldHVybiBwb2x5Z29uLmdldEFyZWEoKTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHR2YXIgYXJlYSA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDEsIGxlbmd0aCA9ICRwb2ludHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0XHR2YXIgbGFzdFBvaW50ID0gJHBvaW50c1tpIC0gMV07XG5cdFx0XHR2YXIgZFggPSBNYXRoLmFicyhjdXJyUG9pbnRbMF0gLSBsYXN0UG9pbnRbMF0pO1xuXHRcdFx0dmFyIGRZID0gTWF0aC5hYnMoY3VyclBvaW50WzFdIC0gbGFzdFBvaW50WzFdKTtcblx0XHRcdGFyZWEgKz0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcblx0XHRcdGFyZWEgPSBhcmVhICogMC41ICsgYXJlYSAqICRkcmF3aW5nQ29tbWFuZHMudGhpY2tuZXNzICogMC41O1xuXHRcdH1cblx0XHRyZXR1cm4gYXJlYTtcblx0fVxufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVIZXhhRmlsbFN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkcG9pbnRzKVxue1xuXHR0aGlzLmZpbGxOb2RlcyA9IHRoaXMuY3JlYXRlSW5uZXJTdHJ1Y3R1cmUoJHBvaW50cyk7XG5cdHZhciBwYXRoID0gdGhpcy5pbm5lclN0cnVjdHVyZS5nZXRTaGFwZVBhdGgoKTtcblx0dmFyIGVudmVsb3BlID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBwYXRoLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KHBhdGhbaV1bMF0sIHBhdGhbaV1bMV0pO1xuXHRcdGVudmVsb3BlLnB1c2gobm9kZSk7XG5cdFx0dGhpcy5ncm91cC5kcmF3aW5nLmFkZENvbW1hbmQobm9kZSwgdW5kZWZpbmVkLCB0cnVlKTtcblx0fVxuXHRyZXR1cm4gZW52ZWxvcGU7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLnNldE5vZGVEcmF3aW5nQ29tbWFuZHMgPSBmdW5jdGlvbiAoJG5vZGVzKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gJG5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSAkbm9kZXNbaV07XG5cdFx0dmFyIGNvbW1hbmRPYmplY3QgPSB0aGlzLmRyYXdpbmdDb21tYW5kcy5wb2ludENvbW1hbmRzW2ldO1xuXHRcdHRoaXMuZ3JvdXAuZHJhd2luZy5hZGRDb21tYW5kKG5vZGUsIGNvbW1hbmRPYmplY3QsIHRydWUpO1xuXHR9XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZVByZWNpc2VIZXhhRmlsbFN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkcG9pbnRzKVxue1xuXHR2YXIgZW52ZWxvcGUgPSB0aGlzLmNyZWF0ZU5vZGVzRnJvbVBvaW50cygkcG9pbnRzKTtcblx0dGhpcy5zZXROb2RlRHJhd2luZ0NvbW1hbmRzKGVudmVsb3BlKTtcblx0dGhpcy5maWxsTm9kZXMgPSB0aGlzLmNyZWF0ZUlubmVyU3RydWN0dXJlKCRwb2ludHMpO1xuXG5cdHRoaXMuY3JlYXRlSm9pbnRzRnJvbVBvaW50cygkcG9pbnRzLCBmYWxzZSk7XG5cdHZhciBpID0gMDtcblx0dmFyIGxlbmd0aCA9ICRwb2ludHMubGVuZ3RoO1xuXHRmb3IgKGk7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkcG9pbnRzW2ldO1xuXHRcdHZhciBjbG9zZXN0ID0gdGhpcy5pbm5lclN0cnVjdHVyZS5nZXRDbG9zZXN0KGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdLCAyKTtcblx0XHRmb3IgKHZhciBrID0gMCwgY2xvc2VzdExlbmd0aCA9IGNsb3Nlc3QubGVuZ3RoOyBrIDwgY2xvc2VzdExlbmd0aDsgayArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyQ2xvc2VzdCA9IGNsb3Nlc3Rba107XG5cdFx0XHR2YXIgbjEgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKTtcblx0XHRcdHZhciBuMiA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyckNsb3Nlc3RbMF0sIGN1cnJDbG9zZXN0WzFdKTtcblx0XHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGVudmVsb3BlO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVKb2ludHNGcm9tVHJpYW5nbGVzID0gZnVuY3Rpb24gKCRwb2ludHMpXG57XG5cdHZhciB0cmlhbmd1bGF0b3IgPSBuZXcgVHJpYW5ndWxhdG9yKCk7XG5cdHZhciB0cmlhbmdsZXMgPSB0cmlhbmd1bGF0b3IudHJpYW5ndWxhdGUoJHBvaW50cyk7XG5cblx0dmFyIHRyaWFuZ2xlc0xlbmd0aCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdHJpYW5nbGVzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclRyaWFuZ2xlID0gdHJpYW5nbGVzW2ldO1xuXHRcdHZhciBuMCA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclRyaWFuZ2xlWzBdLngsIGN1cnJUcmlhbmdsZVswXS55KTtcblx0XHR2YXIgbjEgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJUcmlhbmdsZVsxXS54LCBjdXJyVHJpYW5nbGVbMV0ueSk7XG5cdFx0dmFyIG4yID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyVHJpYW5nbGVbMl0ueCwgY3VyclRyaWFuZ2xlWzJdLnkpO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjAsIG4xKTtcblx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50KG4xLCBuMik7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMiwgbjApO1xuXHR9XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmdldFBvaW50cyA9IGZ1bmN0aW9uICgkZHJhd2luZ0NvbW1hbmRzKVxue1xuXHR2YXIgcG9pbnRzID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSAkZHJhd2luZ0NvbW1hbmRzLnBvaW50Q29tbWFuZHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyciA9ICRkcmF3aW5nQ29tbWFuZHMucG9pbnRDb21tYW5kc1tpXTtcblx0XHRwb2ludHMucHVzaChjdXJyLnBvaW50KTtcblx0fVxuXHRyZXR1cm4gcG9pbnRzO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMgPSBmdW5jdGlvbiAoJHBvaW50cywgJG92ZXJ3cml0ZSlcbntcblx0dmFyIHBvaW50c0xlbmd0aCA9ICRwb2ludHMubGVuZ3RoO1xuXHR2YXIgdG9SZXR1cm4gPSBbXTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkcG9pbnRzW2ldO1xuXHRcdHZhciBub2RlID0gdGhpcy5ncm91cC5jcmVhdGVOb2RlKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdLCB1bmRlZmluZWQsICRvdmVyd3JpdGUpO1xuXHRcdHRvUmV0dXJuLnB1c2gobm9kZSk7XG5cdH1cblx0cmV0dXJuIHRvUmV0dXJuO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5yZW1vdmVEdXBsaWNhdGVzID0gZnVuY3Rpb24gKCRkcmF3aW5nQ29tbWFuZHMpXG57XG5cdHZhciB2aXNpdGVkUG9pbnRzID0gW107XG5cdHZhciBjb21tYW5kcyA9ICRkcmF3aW5nQ29tbWFuZHMucG9pbnRDb21tYW5kcztcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb21tYW5kcy5sZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBwb2ludCA9IGNvbW1hbmRzW2ldLnBvaW50O1xuXHRcdGZvciAodmFyIGsgPSAwOyBrIDwgdmlzaXRlZFBvaW50cy5sZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgdmlzaXRlZCA9IHZpc2l0ZWRQb2ludHNba107XG5cdFx0XHRpZiAodmlzaXRlZFswXSA9PT0gcG9pbnRbMF0gJiYgdmlzaXRlZFsxXSA9PT0gcG9pbnRbMV0pXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGksICdkdXBsaWNhdGUgZm91bmQgIScsIHZpc2l0ZWRbMF0sIHZpc2l0ZWRbMV0sIHBvaW50WzBdLCBwb2ludFsxXSk7XG5cdFx0XHRcdGNvbW1hbmRzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0aSA9IGkgLSAxO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2aXNpdGVkUG9pbnRzLnB1c2gocG9pbnQpO1xuXHR9XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZUlubmVyU3RydWN0dXJlID0gZnVuY3Rpb24gKCRwb2ludHMpXG57XG5cdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRwb2ludHMpO1xuXHR2YXIgZGlhbSA9IHRoaXMud29ybGQuZ2V0V2lkdGgoKSAqIHRoaXMuZ3JvdXAuY29uZi5pbm5lclN0cnVjdHVyZURlZjsvL3dpZHRoIC8gMTA7Ly90aGlzLndvcmxkLmdldFdpZHRoKCkgLyAzMDtcblx0dGhpcy5pbm5lclJhZGl1cyA9IHRoaXMuZ3JvdXAuY29uZi5ub2RlUmFkaXVzIHx8IGRpYW0gLyAyO1xuXHR0aGlzLmlubmVyU3RydWN0dXJlID0gR3JpZC5jcmVhdGVGcm9tUG9seWdvbihwb2x5Z29uLCBkaWFtLCB0cnVlKTtcblx0dGhpcy5zdHJ1Y3R1cmVOb2RlcyA9IHRoaXMuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0Tm9kZXNBcnJheSgpKTtcblxuXHR2YXIgbmV0d29yayA9IHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0TmV0d29yaygpO1xuXHR2YXIgaSA9IDA7XG5cdHZhciBsZW5ndGggPSBuZXR3b3JrLmxlbmd0aDtcblx0Zm9yIChpOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyckxpbmsgPSBuZXR3b3JrW2ldO1xuXHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyckxpbmtbMF1bMF0sIGN1cnJMaW5rWzBdWzFdKTtcblx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJMaW5rWzFdWzBdLCBjdXJyTGlua1sxXVsxXSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMSwgbjIpO1xuXHR9XG5cdGxlbmd0aCA9IHRoaXMuc3RydWN0dXJlTm9kZXMubGVuZ3RoO1xuXHRmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMuc3RydWN0dXJlTm9kZXNbaV07XG5cdFx0dGhpcy5ncm91cC5kcmF3aW5nLmFkZENvbW1hbmQobm9kZSwgdW5kZWZpbmVkLCBmYWxzZSk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5zdHJ1Y3R1cmVOb2Rlcztcbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlSm9pbnRzRnJvbVBvaW50cyA9IGZ1bmN0aW9uICgkcG9pbnRzLCAkbm9DbG9zZSlcbntcblx0dmFyIHBvaW50c0xlbmd0aCA9ICRwb2ludHMubGVuZ3RoO1xuXHRmb3IgKHZhciBpID0gMTsgaSA8IHBvaW50c0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0dmFyIGxhc3RQb2ludCA9ICRwb2ludHNbaSAtIDFdO1xuXHRcdHZhciBsYXN0Tm9kZSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQobGFzdFBvaW50WzBdLCBsYXN0UG9pbnRbMV0pO1xuXHRcdHZhciBjdXJyTm9kZSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0pO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobGFzdE5vZGUsIGN1cnJOb2RlKTtcblx0XHRpZiAoaSA9PT0gcG9pbnRzTGVuZ3RoIC0gMSAmJiAkbm9DbG9zZSAhPT0gdHJ1ZSlcblx0XHR7XG5cdFx0XHR2YXIgZmlyc3ROb2RlID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludCgkcG9pbnRzWzBdWzBdLCAkcG9pbnRzWzBdWzFdKTtcblx0XHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQoY3Vyck5vZGUsIGZpcnN0Tm9kZSk7XG5cdFx0fVxuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cnVjdHVyZTtcblxuIiwidmFyIHBvbHkydHJpID0gcmVxdWlyZSgnLi4vLi4vbGlicy9wb2x5MnRyaS9kaXN0L3BvbHkydHJpJyk7XG5cbnZhciBUcmlhbmd1bGF0b3IgPSBmdW5jdGlvbiAoKVxue1xufTtcblxuVHJpYW5ndWxhdG9yLnByb3RvdHlwZS50cmlhbmd1bGF0ZSA9IGZ1bmN0aW9uICgkY29vcmRzKVxue1xuXHR2YXIgcG9seTJ0cmlDb250b3VyID0gW107XG5cdC8vZGVidWdnZXI7XG5cblx0Zm9yICh2YXIgaSA9IDAsIHBvaW50c0xlbmd0aCA9ICRjb29yZHMubGVuZ3RoOyBpIDwgcG9pbnRzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgcG9pbnQgPSAkY29vcmRzW2ldO1xuXHRcdHBvbHkydHJpQ29udG91ci5wdXNoKG5ldyBwb2x5MnRyaS5Qb2ludChwb2ludFswXSwgcG9pbnRbMV0pKTtcblx0fVxuXG5cdHZhciBzd2N0eDtcblx0dHJ5XG5cdHtcblx0XHQvLyBwcmVwYXJlIFN3ZWVwQ29udGV4dFxuXHRcdHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChwb2x5MnRyaUNvbnRvdXIsIHsgY2xvbmVBcnJheXM6IHRydWUgfSk7XG5cblx0XHQvLyB0cmlhbmd1bGF0ZVxuXHRcdHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG5cdH1cblx0Y2F0Y2ggKGUpXG5cdHtcblx0XHR0aHJvdyBlO1xuXHRcdC8vIGNvbnNvbGUubG9nKGUpO1xuXHRcdC8vIGNvbnNvbGUubG9nKGUucG9pbnRzKTtcblx0fVxuXHR2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG5cblx0dmFyIHBvaW50c0FycmF5ID0gW107XG5cblx0dmFyIHRyaWFuZ2xlc0xlbmd0aCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCB0cmlhbmdsZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyVHJpYW5nbGUgPSB0cmlhbmdsZXNbaV07XG5cdFx0Lypqc2hpbnQgY2FtZWxjYXNlOmZhbHNlKi9cblx0XHQvL2pzY3M6ZGlzYWJsZSBkaXNhbGxvd0RhbmdsaW5nVW5kZXJzY29yZXNcblx0XHRwb2ludHNBcnJheS5wdXNoKGN1cnJUcmlhbmdsZS5wb2ludHNfKTtcblx0XHQvL2pzY3M6ZW5hYmxlIGRpc2FsbG93RGFuZ2xpbmdVbmRlcnNjb3Jlc1xuXHRcdC8qanNoaW50IGNhbWVsY2FzZTp0cnVlKi9cblx0fVxuXG5cdHJldHVybiBwb2ludHNBcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJpYW5ndWxhdG9yO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG57XG5cdENvbmZPYmplY3Q6IHJlcXVpcmUoJy4vY29yZS9Db25mT2JqZWN0JyksXG5cdEdyaWQ6IHJlcXVpcmUoJy4vY29yZS9HcmlkJyksXG5cdFBvbHlnb246IHJlcXVpcmUoJy4vY29yZS9Qb2x5Z29uJyksXG5cdFN0cnVjdHVyZTogcmVxdWlyZSgnLi9jb3JlL1N0cnVjdHVyZScpLFxuXHRTVkdQYXJzZXI6IHJlcXVpcmUoJy4vY29yZS9TVkdQYXJzZXInKSxcblx0U1ZKZWxseUdyb3VwOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseUdyb3VwJyksXG5cdFNWSmVsbHlKb2ludDogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlKb2ludCcpLFxuXHRTVkplbGx5Tm9kZTogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlOb2RlJyksXG5cdFNWSmVsbHlVdGlsczogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlVdGlscycpLFxuXHRTVkplbGx5V29ybGQ6IHJlcXVpcmUoJy4vY29yZS9TVkplbGx5V29ybGQnKSxcblx0VHJpYW5ndWxhdG9yOiByZXF1aXJlKCcuL2NvcmUvVHJpYW5ndWxhdG9yJyksXG5cdE5vZGVHcmFwaDogcmVxdWlyZSgnLi9jb3JlL05vZGVHcmFwaCcpLFxufTtcblxuIl19
