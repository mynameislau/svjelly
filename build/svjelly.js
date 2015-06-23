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
	constraints:
	{
		default:
		{
			lockConstraint: {}
		},
		wire:
		{
			distanceConstraint:
			{
				stiffness: 1000,
				relaxation: 1
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
		var nodesToDraw = currGroup.structure.create(drawingCommands);
		this.setGraphicInstructions(currGroup, rawElement, nodesToDraw, drawingCommands);

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

SVGParser.prototype.setGraphicInstructions = function ($group, $raw, $nodesToDraw, $drawingCommands)
{
	var drawing = $group.drawing = {};
	drawing.nodes = $nodesToDraw;
	var props = drawing.properties = {};
	//sorting nodesToDraw so the path is drawn correctly
	var start;
	for (var i = 0, length = $nodesToDraw.length; i < length; i += 1)
	{
		var currNode = $nodesToDraw[i];
		if (currNode.drawing.command === MOVE_TO || i === length - 1)
		{
			if (start) { start.drawing.endNode = currNode; }
			start = currNode;
		}

		$group.nodes.splice($group.nodes.indexOf(currNode), 1);
		$group.nodes.splice(i, 0, currNode);
	}

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
	props.opacity = rawOpacity || 1;

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
			var color = currStop.getAttribute('stop-color') || colorRegexResult ? colorRegexResult[1] : undefined;
			var opacityRegexResult = /stop-opacity:([\d.-]+)/g.exec(currStop.getAttribute('style'));
			var opacity = currStop.getAttribute('stop-opacity') || opacityRegexResult ? opacityRegexResult[1] : 1;
			if (color.startsWith('#'))
			{
				var R = parseInt(color.substr(1, 2), 16);
				var G = parseInt(color.substr(3, 2), 16);
				var B = parseInt(color.substr(5, 2), 16);
				color = 'rgba(' + R + ',' + G + ',' + B + ',' + opacity + ')';
			}
			if (color.startsWith('rgb(')) { color = 'rgba' + color.substring(4, -1) + ',' + opacity + ')'; }
			if (color.startsWith('hsl(')) { color = 'hsla' + color.substring(4, -1) + ',' + opacity + ')'; }
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
	var pointCommands = [{ command: radiusY !== radiusX ? ELLIPSE : ARC, point: [xPos, yPos], options: [radiusX, radiusY, rotation] }];
	return { type: 'ellipse', pointCommands: pointCommands, radiusX: radiusX, radiusY: radiusY, closePath: false, thickness: this.getThickness($rawCircle) };
};

SVGParser.prototype.parseLine = function ($rawLine)
{
	var x1 = this.getCoord($rawLine.getAttribute('x1'));
	var x2 = this.getCoord($rawLine.getAttribute('x2'));
	var y1 = this.getCoord($rawLine.getAttribute('y1'));
	var y2 = this.getCoord($rawLine.getAttribute('y2'));
	var pointCommands = [];
	pointCommands.push({ command: MOVE_TO, point: [x1, y1], options: [] });
	pointCommands.push({ command: LINE_TO, point: [x2, y2], options: [] });
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
	pointCommands.push({ command: MOVE_TO, point: points[0], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[1], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[2], options: [] });
	pointCommands.push({ command: LINE_TO, point: points[3], options: [] });

	return { type: 'polygon', pointCommands: pointCommands, closePath: true, thickness: this.getThickness($rawRect) };
};

SVGParser.prototype.parsePoly = function ($rawPoly)
{
	var regex = /([\-.\d]+)[, ]([\-.\d]+)/ig;
	var result = regex.exec($rawPoly.getAttribute('points'));
	var pointCommands = [];

	while (result)
	{
		var command = pointCommands.length === 0 ? MOVE_TO : LINE_TO;
		var point = [this.getCoord(result[1]), this.getCoord(result[2])];
		pointCommands.push({ command: command, point: point, options: [] });
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

	var createPoint = function ($command, $point, $options)
	{
		var info = { command: $command, point: $point, options: $options || [] };
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

var SVJellyGroup = function ($type, $conf, $ID)
{
	this.physicsManager = undefined;
	this.drawing = undefined;
	this.structure = undefined;
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


},{"./Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js"}],"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js":[function(require,module,exports){
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
				currAnchorA.setFixed(true);
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
var Commands = require('./Commands');

var Structure = function ($group, $world)
{
	this.world = $world;
	this.group = $group;
	this.innerStructure = undefined;
};

Structure.prototype.create = function ($drawingCommands)
{
	var nodesToDraw;

	this.points = this.getPoints($drawingCommands);
	this.drawingCommands = $drawingCommands;

	// console.log('points', points.length, this.group.conf.structure);

	this.area = this.calculateArea(this.points, $drawingCommands);
	this.radiusX = $drawingCommands.radiusX;
	this.radiusY = $drawingCommands.radiusY;

	switch (this.group.conf.structure)
	{
		case 'triangulate':
			this.removeDuplicates(this.drawingCommands);
			var triPoints = this.getPoints(this.drawingCommands);
			nodesToDraw = this.createNodesFromPoints(triPoints);
			this.setNodeDrawingCommands(nodesToDraw);
			this.createJointsFromTriangles(triPoints);
			break;
		case 'line':
			nodesToDraw = this.createNodesFromPoints(this.points);
			this.setNodeDrawingCommands(nodesToDraw);
			this.createJointsFromPoints(this.points, true);
			//nodesToDraw[0].fixed = true;//to remove later maybe ?
			break;
		case 'preciseHexaFill':
			nodesToDraw = this.createPreciseHexaFillStructure(this.points);
			// structureNodes.forEach(function ($element) { $element.drawing = { notToDraw: true }; });
			break;
		case 'hexaFill':
			nodesToDraw = this.createHexaFillStructure(this.points);
			break;
		case 'simple':
			nodesToDraw = this.createNodesFromPoints(this.points);
			this.createJointsFromPoints(this.points);
			this.setNodeDrawingCommands(nodesToDraw);
		break;
		default:
			nodesToDraw = this.createNodesFromPoints(this.points);
			this.setNodeDrawingCommands(nodesToDraw);
			break;
	}

	return nodesToDraw;
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
	this.createInnerStructure($points);
	var path = this.innerStructure.getShapePath();
	var nodesToDraw = [];
	for (var i = 0, length = path.length; i < length; i += 1)
	{
		var node = this.group.getNodeAtPoint(path[i][0], path[i][1]);
		nodesToDraw.push(node);
		node.drawing = {};
		node.drawing.command = i === 0 ? Commands.MOVE_TO : Commands.LINE_TO;
		node.drawing.point = [path[i][0], path[i][1]];
		node.drawing.options = [];
	}
	return nodesToDraw;
};

Structure.prototype.setNodeDrawingCommands = function ($nodes)
{
	for (var i = 0, length = $nodes.length; i < length; i += 1)
	{
		var node = $nodes[i];
		node.drawing = this.drawingCommands.pointCommands[i];
	}
};

Structure.prototype.createPreciseHexaFillStructure = function ($points)
{
	var nodesToDraw = this.createNodesFromPoints($points);
	this.setNodeDrawingCommands(nodesToDraw);
	this.createInnerStructure($points);

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
	return nodesToDraw;
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

Structure.prototype.createNodesFromPoints = function ($points)
{
	var pointsLength = $points.length;
	var toReturn = [];
	for (var i = 0; i < pointsLength; i += 1)
	{
		var currPoint = $points[i];
		var node = this.group.createNode(currPoint[0], currPoint[1], undefined, false);
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


},{"./Commands":"/Users/Lau/www/svjelly/src/core/Commands.js","./Grid":"/Users/Lau/www/svjelly/src/core/Grid.js","./Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./Triangulator":"/Users/Lau/www/svjelly/src/core/Triangulator.js"}],"/Users/Lau/www/svjelly/src/core/Triangulator.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmkuanMiLCJzcmMvY29yZS9Db21tYW5kcy5qcyIsInNyYy9jb3JlL0NvbmZPYmplY3QuanMiLCJzcmMvY29yZS9HcmlkLmpzIiwic3JjL2NvcmUvTm9kZUdyYXBoLmpzIiwic3JjL2NvcmUvUG9seWdvbi5qcyIsInNyYy9jb3JlL1NWR1BhcnNlci5qcyIsInNyYy9jb3JlL1NWSmVsbHlHcm91cC5qcyIsInNyYy9jb3JlL1NWSmVsbHlKb2ludC5qcyIsInNyYy9jb3JlL1NWSmVsbHlOb2RlLmpzIiwic3JjL2NvcmUvU1ZKZWxseVV0aWxzLmpzIiwic3JjL2NvcmUvU1ZKZWxseVdvcmxkLmpzIiwic3JjL2NvcmUvU3RydWN0dXJlLmpzIiwic3JjL2NvcmUvVHJpYW5ndWxhdG9yLmpzIiwic3JjL3N2amVsbHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2p4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdG1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIhZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShlKTtlbHNle3ZhciBmO1widW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/Zj13aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9mPWdsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZiYmKGY9c2VsZiksZi5wb2x5MnRyaT1lKCl9fShmdW5jdGlvbigpe3ZhciBkZWZpbmUsbW9kdWxlLGV4cG9ydHM7cmV0dXJuIChmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pKHsxOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbm1vZHVsZS5leHBvcnRzPXtcInZlcnNpb25cIjogXCIxLjMuNVwifVxufSx7fV0sMjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuLyoganNoaW50IG1heGNvbXBsZXhpdHk6MTEgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tTm9kZVxuXG4vKipcbiAqIEFkdmFuY2luZyBmcm9udCBub2RlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0geyFYWX0gcCAtIFBvaW50XG4gKiBAcGFyYW0ge1RyaWFuZ2xlPX0gdCB0cmlhbmdsZSAob3B0aW9uYWwpXG4gKi9cbnZhciBOb2RlID0gZnVuY3Rpb24ocCwgdCkge1xuICAgIC8qKiBAdHlwZSB7WFl9ICovXG4gICAgdGhpcy5wb2ludCA9IHA7XG5cbiAgICAvKiogQHR5cGUge1RyaWFuZ2xlfG51bGx9ICovXG4gICAgdGhpcy50cmlhbmdsZSA9IHQgfHwgbnVsbDtcblxuICAgIC8qKiBAdHlwZSB7Tm9kZXxudWxsfSAqL1xuICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfG51bGx9ICovXG4gICAgdGhpcy5wcmV2ID0gbnVsbDtcblxuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIHRoaXMudmFsdWUgPSBwLng7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1BZHZhbmNpbmdGcm9udFxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0ge05vZGV9IGhlYWRcbiAqIEBwYXJhbSB7Tm9kZX0gdGFpbFxuICovXG52YXIgQWR2YW5jaW5nRnJvbnQgPSBmdW5jdGlvbihoZWFkLCB0YWlsKSB7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMuaGVhZF8gPSBoZWFkO1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLnRhaWxfID0gdGFpbDtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBoZWFkO1xufTtcblxuLyoqIEByZXR1cm4ge05vZGV9ICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuaGVhZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWRfO1xufTtcblxuLyoqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnNldEhlYWQgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdGhpcy5oZWFkXyA9IG5vZGU7XG59O1xuXG4vKiogQHJldHVybiB7Tm9kZX0gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS50YWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbF87XG59O1xuXG4vKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuc2V0VGFpbCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0aGlzLnRhaWxfID0gbm9kZTtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnNlYXJjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnNlYXJjaF9ub2RlXztcbn07XG5cbi8qKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZXRTZWFyY2ggPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBub2RlO1xufTtcblxuLyoqIEByZXR1cm4ge05vZGV9ICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuZmluZFNlYXJjaE5vZGUgPSBmdW5jdGlvbigvKngqLykge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBCU1QgaW5kZXhcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hfbm9kZV87XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyfSB4IHZhbHVlXG4gKiBAcmV0dXJuIHtOb2RlfVxuICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUubG9jYXRlTm9kZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXMuc2VhcmNoX25vZGVfO1xuXG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIGlmICh4IDwgbm9kZS52YWx1ZSkge1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUucHJldikge1xuICAgICAgICAgICAgaWYgKHggPj0gbm9kZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoX25vZGVfID0gbm9kZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChub2RlID0gbm9kZS5uZXh0KSB7XG4gICAgICAgICAgICBpZiAoeCA8IG5vZGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGUucHJldjtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5wcmV2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufTtcblxuLyoqXG4gKiBAcGFyYW0geyFYWX0gcG9pbnQgLSBQb2ludFxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmxvY2F0ZVBvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICB2YXIgcHggPSBwb2ludC54O1xuICAgIHZhciBub2RlID0gdGhpcy5maW5kU2VhcmNoTm9kZShweCk7XG4gICAgdmFyIG54ID0gbm9kZS5wb2ludC54O1xuXG4gICAgaWYgKHB4ID09PSBueCkge1xuICAgICAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgICAgICBpZiAocG9pbnQgIT09IG5vZGUucG9pbnQpIHtcbiAgICAgICAgICAgIC8vIFdlIG1pZ2h0IGhhdmUgdHdvIG5vZGVzIHdpdGggc2FtZSB4IHZhbHVlIGZvciBhIHNob3J0IHRpbWVcbiAgICAgICAgICAgIGlmIChwb2ludCA9PT0gbm9kZS5wcmV2LnBvaW50KSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocG9pbnQgPT09IG5vZGUubmV4dC5wb2ludCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seTJ0cmkgSW52YWxpZCBBZHZhbmNpbmdGcm9udC5sb2NhdGVQb2ludCgpIGNhbGwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocHggPCBueCkge1xuICAgICAgICAvKiBqc2hpbnQgYm9zczp0cnVlICovXG4gICAgICAgIHdoaWxlIChub2RlID0gbm9kZS5wcmV2KSB7XG4gICAgICAgICAgICBpZiAocG9pbnQgPT09IG5vZGUucG9pbnQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChub2RlID0gbm9kZS5uZXh0KSB7XG4gICAgICAgICAgICBpZiAocG9pbnQgPT09IG5vZGUucG9pbnQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlKSB7XG4gICAgICAgIHRoaXMuc2VhcmNoX25vZGVfID0gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzXG5cbm1vZHVsZS5leHBvcnRzID0gQWR2YW5jaW5nRnJvbnQ7XG5tb2R1bGUuZXhwb3J0cy5Ob2RlID0gTm9kZTtcblxuXG59LHt9XSwzOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKlxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICpcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLypcbiAqIEZ1bmN0aW9uIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG4gKi9cblxuLyoqXG4gKiBhc3NlcnQgYW5kIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBjb25kaXRpb24gICB0aGUgY29uZGl0aW9uIHdoaWNoIGlzIGFzc2VydGVkXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAgICAgIHRoZSBtZXNzYWdlIHdoaWNoIGlzIGRpc3BsYXkgaXMgY29uZGl0aW9uIGlzIGZhbHN5XG4gKi9cbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCBcIkFzc2VydCBGYWlsZWRcIik7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7XG5cblxuXG59LHt9XSw0OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgeHkgPSBfZGVyZXFfKCcuL3h5Jyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVBvaW50XG4vKipcbiAqIENvbnN0cnVjdCBhIHBvaW50XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgcG9pbnQgPSBuZXcgcG9seTJ0cmkuUG9pbnQoMTUwLCAxNTApO1xuICogQHB1YmxpY1xuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0ge251bWJlcj19IHggICAgY29vcmRpbmF0ZSAoMCBpZiB1bmRlZmluZWQpXG4gKiBAcGFyYW0ge251bWJlcj19IHkgICAgY29vcmRpbmF0ZSAoMCBpZiB1bmRlZmluZWQpXG4gKi9cbnZhciBQb2ludCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBleHBvc2VcbiAgICAgKi9cbiAgICB0aGlzLnggPSAreCB8fCAwO1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQGV4cG9zZVxuICAgICAqL1xuICAgIHRoaXMueSA9ICt5IHx8IDA7XG5cbiAgICAvLyBBbGwgZXh0cmEgZmllbGRzIGFkZGVkIHRvIFBvaW50IGFyZSBwcmVmaXhlZCB3aXRoIF9wMnRfXG4gICAgLy8gdG8gYXZvaWQgY29sbGlzaW9ucyBpZiBjdXN0b20gUG9pbnQgY2xhc3MgaXMgdXNlZC5cblxuICAgIC8qKlxuICAgICAqIFRoZSBlZGdlcyB0aGlzIHBvaW50IGNvbnN0aXR1dGVzIGFuIHVwcGVyIGVuZGluZyBwb2ludFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5LjxFZGdlPn1cbiAgICAgKi9cbiAgICB0aGlzLl9wMnRfZWRnZV9saXN0ID0gbnVsbDtcbn07XG5cbi8qKlxuICogRm9yIHByZXR0eSBwcmludGluZ1xuICogQGV4YW1wbGVcbiAqICAgICAgXCJwPVwiICsgbmV3IHBvbHkydHJpLlBvaW50KDUsNDIpXG4gKiAgICAgIC8vIOKGkiBcInA9KDU7NDIpXCJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IDxjb2RlPlwiKHg7eSlcIjwvY29kZT5cbiAqL1xuUG9pbnQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHh5LnRvU3RyaW5nQmFzZSh0aGlzKTtcbn07XG5cbi8qKlxuICogSlNPTiBvdXRwdXQsIG9ubHkgY29vcmRpbmF0ZXNcbiAqIEBleGFtcGxlXG4gKiAgICAgIEpTT04uc3RyaW5naWZ5KG5ldyBwb2x5MnRyaS5Qb2ludCgxLDIpKVxuICogICAgICAvLyDihpIgJ3tcInhcIjoxLFwieVwiOjJ9J1xuICovXG5Qb2ludC5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBQb2ludCBvYmplY3QuXG4gKiBAcmV0dXJuIHtQb2ludH0gbmV3IGNsb25lZCBwb2ludFxuICovXG5Qb2ludC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHRoaXMueCwgdGhpcy55KTtcbn07XG5cbi8qKlxuICogU2V0IHRoaXMgUG9pbnQgaW5zdGFuY2UgdG8gdGhlIG9yaWdvLiA8Y29kZT4oMDsgMCk8L2NvZGU+XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuc2V0X3plcm8gPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSAwLjA7XG4gICAgdGhpcy55ID0gMC4wO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogU2V0IHRoZSBjb29yZGluYXRlcyBvZiB0aGlzIGluc3RhbmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IHggICBjb29yZGluYXRlXG4gKiBAcGFyYW0ge251bWJlcn0geSAgIGNvb3JkaW5hdGVcbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgdGhpcy54ID0gK3ggfHwgMDtcbiAgICB0aGlzLnkgPSAreSB8fCAwO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogTmVnYXRlIHRoaXMgUG9pbnQgaW5zdGFuY2UuIChjb21wb25lbnQtd2lzZSlcbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5uZWdhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgIHRoaXMueSA9IC10aGlzLnk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBBZGQgYW5vdGhlciBQb2ludCBvYmplY3QgdG8gdGhpcyBpbnN0YW5jZS4gKGNvbXBvbmVudC13aXNlKVxuICogQHBhcmFtIHshUG9pbnR9IG4gLSBQb2ludCBvYmplY3QuXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obikge1xuICAgIHRoaXMueCArPSBuLng7XG4gICAgdGhpcy55ICs9IG4ueTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHRoaXMgUG9pbnQgaW5zdGFuY2Ugd2l0aCBhbm90aGVyIHBvaW50IGdpdmVuLiAoY29tcG9uZW50LXdpc2UpXG4gKiBAcGFyYW0geyFQb2ludH0gbiAtIFBvaW50IG9iamVjdC5cbiAqIEByZXR1cm4ge1BvaW50fSB0aGlzIChmb3IgY2hhaW5pbmcpXG4gKi9cblBvaW50LnByb3RvdHlwZS5zdWIgPSBmdW5jdGlvbihuKSB7XG4gICAgdGhpcy54IC09IG4ueDtcbiAgICB0aGlzLnkgLT0gbi55O1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogTXVsdGlwbHkgdGhpcyBQb2ludCBpbnN0YW5jZSBieSBhIHNjYWxhci4gKGNvbXBvbmVudC13aXNlKVxuICogQHBhcmFtIHtudW1iZXJ9IHMgICBzY2FsYXIuXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUubXVsID0gZnVuY3Rpb24ocykge1xuICAgIHRoaXMueCAqPSBzO1xuICAgIHRoaXMueSAqPSBzO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBkaXN0YW5jZSBvZiB0aGlzIFBvaW50IGluc3RhbmNlIGZyb20gdGhlIG9yaWdvLlxuICogQHJldHVybiB7bnVtYmVyfSBkaXN0YW5jZVxuICovXG5Qb2ludC5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgdGhpcyBQb2ludCBpbnN0YW5jZSAoYXMgYSB2ZWN0b3IpLlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgb3JpZ2luYWwgZGlzdGFuY2Ugb2YgdGhpcyBpbnN0YW5jZSBmcm9tIHRoZSBvcmlnby5cbiAqL1xuUG9pbnQucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aCgpO1xuICAgIHRoaXMueCAvPSBsZW47XG4gICAgdGhpcy55IC89IGxlbjtcbiAgICByZXR1cm4gbGVuO1xufTtcblxuLyoqXG4gKiBUZXN0IHRoaXMgUG9pbnQgb2JqZWN0IHdpdGggYW5vdGhlciBmb3IgZXF1YWxpdHkuXG4gKiBAcGFyYW0geyFYWX0gcCAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn0gPGNvZGU+dHJ1ZTwvY29kZT4gaWYgc2FtZSB4IGFuZCB5IGNvb3JkaW5hdGVzLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5Qb2ludC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiB0aGlzLnggPT09IHAueCAmJiB0aGlzLnkgPT09IHAueTtcbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Qb2ludCAoXCJzdGF0aWNcIiBtZXRob2RzKVxuXG4vKipcbiAqIE5lZ2F0ZSBhIHBvaW50IGNvbXBvbmVudC13aXNlIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0geyFYWX0gcCAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7UG9pbnR9IHRoZSByZXN1bHRpbmcgUG9pbnQgb2JqZWN0LlxuICovXG5Qb2ludC5uZWdhdGUgPSBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCgtcC54LCAtcC55KTtcbn07XG5cbi8qKlxuICogQWRkIHR3byBwb2ludHMgY29tcG9uZW50LXdpc2UgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGEgbmV3IFBvaW50IG9iamVjdC5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7UG9pbnR9IHRoZSByZXN1bHRpbmcgUG9pbnQgb2JqZWN0LlxuICovXG5Qb2ludC5hZGQgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChhLnggKyBiLngsIGEueSArIGIueSk7XG59O1xuXG4vKipcbiAqIFN1YnRyYWN0IHR3byBwb2ludHMgY29tcG9uZW50LXdpc2UgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGEgbmV3IFBvaW50IG9iamVjdC5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7UG9pbnR9IHRoZSByZXN1bHRpbmcgUG9pbnQgb2JqZWN0LlxuICovXG5Qb2ludC5zdWIgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludChhLnggLSBiLngsIGEueSAtIGIueSk7XG59O1xuXG4vKipcbiAqIE11bHRpcGx5IGEgcG9pbnQgYnkgYSBzY2FsYXIgYW5kIHJldHVybiB0aGUgcmVzdWx0IGFzIGEgbmV3IFBvaW50IG9iamVjdC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzIC0gdGhlIHNjYWxhclxuICogQHBhcmFtIHshWFl9IHAgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQubXVsID0gZnVuY3Rpb24ocywgcCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQocyAqIHAueCwgcyAqIHAueSk7XG59O1xuXG4vKipcbiAqIFBlcmZvcm0gdGhlIGNyb3NzIHByb2R1Y3Qgb24gZWl0aGVyIHR3byBwb2ludHMgKHRoaXMgcHJvZHVjZXMgYSBzY2FsYXIpXG4gKiBvciBhIHBvaW50IGFuZCBhIHNjYWxhciAodGhpcyBwcm9kdWNlcyBhIHBvaW50KS5cbiAqIFRoaXMgZnVuY3Rpb24gcmVxdWlyZXMgdHdvIHBhcmFtZXRlcnMsIGVpdGhlciBtYXkgYmUgYSBQb2ludCBvYmplY3Qgb3IgYVxuICogbnVtYmVyLlxuICogQHBhcmFtICB7WFl8bnVtYmVyfSBhIC0gUG9pbnQgb2JqZWN0IG9yIHNjYWxhci5cbiAqIEBwYXJhbSAge1hZfG51bWJlcn0gYiAtIFBvaW50IG9iamVjdCBvciBzY2FsYXIuXG4gKiBAcmV0dXJuIHtQb2ludHxudW1iZXJ9IGEgUG9pbnQgb2JqZWN0IG9yIGEgbnVtYmVyLCBkZXBlbmRpbmcgb24gdGhlIHBhcmFtZXRlcnMuXG4gKi9cblBvaW50LmNyb3NzID0gZnVuY3Rpb24oYSwgYikge1xuICAgIGlmICh0eXBlb2YoYSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmICh0eXBlb2YoYikgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gYSAqIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50KC1hICogYi55LCBhICogYi54KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YoYikgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFBvaW50KGIgKiBhLnksIC1iICogYS54KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBhLnggKiBiLnkgLSBhLnkgKiBiLng7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCJQb2ludC1MaWtlXCJcbi8qXG4gKiBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBvcGVyYXRlIG9uIFwiUG9pbnRcIiBvciBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IFxuICogd2l0aCB7eCx5fSAoZHVjayB0eXBpbmcpLlxuICovXG5cblBvaW50LnRvU3RyaW5nID0geHkudG9TdHJpbmc7XG5Qb2ludC5jb21wYXJlID0geHkuY29tcGFyZTtcblBvaW50LmNtcCA9IHh5LmNvbXBhcmU7IC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblBvaW50LmVxdWFscyA9IHh5LmVxdWFscztcblxuLyoqXG4gKiBQZWZvcm0gdGhlIGRvdCBwcm9kdWN0IG9uIHR3byB2ZWN0b3JzLlxuICogQHB1YmxpY1xuICogQHBhcmFtIHshWFl9IGEgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBkb3QgcHJvZHVjdFxuICovXG5Qb2ludC5kb3QgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbn07XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0cyAocHVibGljIEFQSSlcblxubW9kdWxlLmV4cG9ydHMgPSBQb2ludDtcblxufSx7XCIuL3h5XCI6MTF9XSw1OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLypcbiAqIENsYXNzIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG4gKi9cblxudmFyIHh5ID0gX2RlcmVxXygnLi94eScpO1xuXG4vKipcbiAqIEN1c3RvbSBleGNlcHRpb24gY2xhc3MgdG8gaW5kaWNhdGUgaW52YWxpZCBQb2ludCB2YWx1ZXNcbiAqIEBjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQGV4dGVuZHMgRXJyb3JcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbWVzc2FnZSAtIGVycm9yIG1lc3NhZ2VcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPj19IHBvaW50cyAtIGludmFsaWQgcG9pbnRzXG4gKi9cbnZhciBQb2ludEVycm9yID0gZnVuY3Rpb24obWVzc2FnZSwgcG9pbnRzKSB7XG4gICAgdGhpcy5uYW1lID0gXCJQb2ludEVycm9yXCI7XG4gICAgLyoqXG4gICAgICogSW52YWxpZCBwb2ludHNcbiAgICAgKiBAcHVibGljXG4gICAgICogQHR5cGUge0FycmF5LjxYWT59XG4gICAgICovXG4gICAgdGhpcy5wb2ludHMgPSBwb2ludHMgPSBwb2ludHMgfHwgW107XG4gICAgLyoqXG4gICAgICogRXJyb3IgbWVzc2FnZVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2UgfHwgXCJJbnZhbGlkIFBvaW50cyFcIjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgKz0gXCIgXCIgKyB4eS50b1N0cmluZyhwb2ludHNbaV0pO1xuICAgIH1cbn07XG5Qb2ludEVycm9yLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuUG9pbnRFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQb2ludEVycm9yO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnRFcnJvcjtcblxufSx7XCIuL3h5XCI6MTF9XSw2OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sXG4gKiBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gKlxuICogKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXG4gKiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSxcbiAqICAgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvblxuICogICBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbiAqICogTmVpdGhlciB0aGUgbmFtZSBvZiBQb2x5MlRyaSBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlXG4gKiAgIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWNcbiAqICAgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuICpcbiAqIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlNcbiAqIFwiQVMgSVNcIiBBTkQgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1RcbiAqIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUlxuICogQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgT1dORVIgT1JcbiAqIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLFxuICogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLFxuICogUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SXG4gKiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVCBMSUFCSUxJVFksIE9SIFRPUlQgKElOQ0xVRElOR1xuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTXG4gKiBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBQdWJsaWMgQVBJIGZvciBwb2x5MnRyaS5qc1xuICogQG1vZHVsZSBwb2x5MnRyaVxuICovXG5cblxuLyoqXG4gKiBJZiB5b3UgYXJlIG5vdCB1c2luZyBhIG1vZHVsZSBzeXN0ZW0gKGUuZy4gQ29tbW9uSlMsIFJlcXVpcmVKUyksIHlvdSBjYW4gYWNjZXNzIHRoaXMgbGlicmFyeVxuICogYXMgYSBnbG9iYWwgdmFyaWFibGUgPGNvZGU+cG9seTJ0cmk8L2NvZGU+IGkuZS4gPGNvZGU+d2luZG93LnBvbHkydHJpPC9jb2RlPiBpbiBhIGJyb3dzZXIuXG4gKiBAbmFtZSBwb2x5MnRyaVxuICogQGdsb2JhbFxuICogQHB1YmxpY1xuICogQHR5cGUge21vZHVsZTpwb2x5MnRyaX1cbiAqL1xudmFyIHByZXZpb3VzUG9seTJ0cmkgPSBnbG9iYWwucG9seTJ0cmk7XG4vKipcbiAqIEZvciBCcm93c2VyICsgJmx0O3NjcmlwdCZndDsgOlxuICogcmV2ZXJ0cyB0aGUge0BsaW5rY29kZSBwb2x5MnRyaX0gZ2xvYmFsIG9iamVjdCB0byBpdHMgcHJldmlvdXMgdmFsdWUsXG4gKiBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgaW5zdGFuY2UgY2FsbGVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgICAgICAgICAgdmFyIHAgPSBwb2x5MnRyaS5ub0NvbmZsaWN0KCk7XG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHttb2R1bGU6cG9seTJ0cml9IGluc3RhbmNlIGNhbGxlZFxuICovXG4vLyAodGhpcyBmZWF0dXJlIGlzIG5vdCBhdXRvbWF0aWNhbGx5IHByb3ZpZGVkIGJ5IGJyb3dzZXJpZnkpLlxuZXhwb3J0cy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgZ2xvYmFsLnBvbHkydHJpID0gcHJldmlvdXNQb2x5MnRyaTtcbiAgICByZXR1cm4gZXhwb3J0cztcbn07XG5cbi8qKlxuICogcG9seTJ0cmkgbGlicmFyeSB2ZXJzaW9uXG4gKiBAcHVibGljXG4gKiBAY29uc3Qge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5WRVJTSU9OID0gX2RlcmVxXygnLi4vZGlzdC92ZXJzaW9uLmpzb24nKS52ZXJzaW9uO1xuXG4vKipcbiAqIEV4cG9ydHMgdGhlIHtAbGlua2NvZGUgUG9pbnRFcnJvcn0gY2xhc3MuXG4gKiBAcHVibGljXG4gKiBAdHlwZWRlZiB7UG9pbnRFcnJvcn0gbW9kdWxlOnBvbHkydHJpLlBvaW50RXJyb3JcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnRzLlBvaW50RXJyb3IgPSBfZGVyZXFfKCcuL3BvaW50ZXJyb3InKTtcbi8qKlxuICogRXhwb3J0cyB0aGUge0BsaW5rY29kZSBQb2ludH0gY2xhc3MuXG4gKiBAcHVibGljXG4gKiBAdHlwZWRlZiB7UG9pbnR9IG1vZHVsZTpwb2x5MnRyaS5Qb2ludFxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydHMuUG9pbnQgPSBfZGVyZXFfKCcuL3BvaW50Jyk7XG4vKipcbiAqIEV4cG9ydHMgdGhlIHtAbGlua2NvZGUgVHJpYW5nbGV9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1RyaWFuZ2xlfSBtb2R1bGU6cG9seTJ0cmkuVHJpYW5nbGVcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnRzLlRyaWFuZ2xlID0gX2RlcmVxXygnLi90cmlhbmdsZScpO1xuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dH0gY2xhc3MuXG4gKiBAcHVibGljXG4gKiBAdHlwZWRlZiB7U3dlZXBDb250ZXh0fSBtb2R1bGU6cG9seTJ0cmkuU3dlZXBDb250ZXh0XG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5Td2VlcENvbnRleHQgPSBfZGVyZXFfKCcuL3N3ZWVwY29udGV4dCcpO1xuXG5cbi8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbnZhciBzd2VlcCA9IF9kZXJlcV8oJy4vc3dlZXAnKTtcbi8qKlxuICogQGZ1bmN0aW9uXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjdHJpYW5ndWxhdGV9IGluc3RlYWRcbiAqL1xuZXhwb3J0cy50cmlhbmd1bGF0ZSA9IHN3ZWVwLnRyaWFuZ3VsYXRlO1xuLyoqXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjdHJpYW5ndWxhdGV9IGluc3RlYWRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IFRyaWFuZ3VsYXRlIC0gdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I3RyaWFuZ3VsYXRlfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydHMuc3dlZXAgPSB7VHJpYW5ndWxhdGU6IHN3ZWVwLnRyaWFuZ3VsYXRlfTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbn0se1wiLi4vZGlzdC92ZXJzaW9uLmpzb25cIjoxLFwiLi9wb2ludFwiOjQsXCIuL3BvaW50ZXJyb3JcIjo1LFwiLi9zd2VlcFwiOjcsXCIuL3N3ZWVwY29udGV4dFwiOjgsXCIuL3RyaWFuZ2xlXCI6OX1dLDc6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cbi8qIGpzaGludCBsYXRlZGVmOm5vZnVuYywgbWF4Y29tcGxleGl0eTo5ICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFRoaXMgJ1N3ZWVwJyBtb2R1bGUgaXMgcHJlc2VudCBpbiBvcmRlciB0byBrZWVwIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uXG4gKiBhcyBjbG9zZSBhcyBwb3NzaWJsZSB0byB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCBldmVuIHRob3VnaCBhbG1vc3QgYWxsXG4gKiBmdW5jdGlvbnMgY291bGQgYmUgZGVjbGFyZWQgYXMgbWV0aG9kcyBvbiB0aGUge0BsaW5rY29kZSBtb2R1bGU6c3dlZXBjb250ZXh0flN3ZWVwQ29udGV4dH0gb2JqZWN0LlxuICogQG1vZHVsZVxuICogQHByaXZhdGVcbiAqL1xuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgYXNzZXJ0ID0gX2RlcmVxXygnLi9hc3NlcnQnKTtcbnZhciBQb2ludEVycm9yID0gX2RlcmVxXygnLi9wb2ludGVycm9yJyk7XG52YXIgVHJpYW5nbGUgPSBfZGVyZXFfKCcuL3RyaWFuZ2xlJyk7XG52YXIgTm9kZSA9IF9kZXJlcV8oJy4vYWR2YW5jaW5nZnJvbnQnKS5Ob2RlO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXV0aWxzXG5cbnZhciB1dGlscyA9IF9kZXJlcV8oJy4vdXRpbHMnKTtcblxuLyoqIEBjb25zdCAqL1xudmFyIEVQU0lMT04gPSB1dGlscy5FUFNJTE9OO1xuXG4vKiogQGNvbnN0ICovXG52YXIgT3JpZW50YXRpb24gPSB1dGlscy5PcmllbnRhdGlvbjtcbi8qKiBAY29uc3QgKi9cbnZhciBvcmllbnQyZCA9IHV0aWxzLm9yaWVudDJkO1xuLyoqIEBjb25zdCAqL1xudmFyIGluU2NhbkFyZWEgPSB1dGlscy5pblNjYW5BcmVhO1xuLyoqIEBjb25zdCAqL1xudmFyIGlzQW5nbGVPYnR1c2UgPSB1dGlscy5pc0FuZ2xlT2J0dXNlO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVN3ZWVwXG5cbi8qKlxuICogVHJpYW5ndWxhdGUgdGhlIHBvbHlnb24gd2l0aCBob2xlcyBhbmQgU3RlaW5lciBwb2ludHMuXG4gKiBEbyB0aGlzIEFGVEVSIHlvdSd2ZSBhZGRlZCB0aGUgcG9seWxpbmUsIGhvbGVzLCBhbmQgU3RlaW5lciBwb2ludHNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gdHJpYW5ndWxhdGUodGN4KSB7XG4gICAgdGN4LmluaXRUcmlhbmd1bGF0aW9uKCk7XG4gICAgdGN4LmNyZWF0ZUFkdmFuY2luZ0Zyb250KCk7XG4gICAgLy8gU3dlZXAgcG9pbnRzOyBidWlsZCBtZXNoXG4gICAgc3dlZXBQb2ludHModGN4KTtcbiAgICAvLyBDbGVhbiB1cFxuICAgIGZpbmFsaXphdGlvblBvbHlnb24odGN4KTtcbn1cblxuLyoqXG4gKiBTdGFydCBzd2VlcGluZyB0aGUgWS1zb3J0ZWQgcG9pbnQgc2V0IGZyb20gYm90dG9tIHRvIHRvcFxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIHN3ZWVwUG9pbnRzKHRjeCkge1xuICAgIHZhciBpLCBsZW4gPSB0Y3gucG9pbnRDb3VudCgpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47ICsraSkge1xuICAgICAgICB2YXIgcG9pbnQgPSB0Y3guZ2V0UG9pbnQoaSk7XG4gICAgICAgIHZhciBub2RlID0gcG9pbnRFdmVudCh0Y3gsIHBvaW50KTtcbiAgICAgICAgdmFyIGVkZ2VzID0gcG9pbnQuX3AydF9lZGdlX2xpc3Q7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBlZGdlcyAmJiBqIDwgZWRnZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGVkZ2VFdmVudEJ5RWRnZSh0Y3gsIGVkZ2VzW2pdLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gZmluYWxpemF0aW9uUG9seWdvbih0Y3gpIHtcbiAgICAvLyBHZXQgYW4gSW50ZXJuYWwgdHJpYW5nbGUgdG8gc3RhcnQgd2l0aFxuICAgIHZhciB0ID0gdGN4LmZyb250KCkuaGVhZCgpLm5leHQudHJpYW5nbGU7XG4gICAgdmFyIHAgPSB0Y3guZnJvbnQoKS5oZWFkKCkubmV4dC5wb2ludDtcbiAgICB3aGlsZSAoIXQuZ2V0Q29uc3RyYWluZWRFZGdlQ1cocCkpIHtcbiAgICAgICAgdCA9IHQubmVpZ2hib3JDQ1cocCk7XG4gICAgfVxuXG4gICAgLy8gQ29sbGVjdCBpbnRlcmlvciB0cmlhbmdsZXMgY29uc3RyYWluZWQgYnkgZWRnZXNcbiAgICB0Y3gubWVzaENsZWFuKHQpO1xufVxuXG4vKipcbiAqIEZpbmQgY2xvc2VzIG5vZGUgdG8gdGhlIGxlZnQgb2YgdGhlIG5ldyBwb2ludCBhbmRcbiAqIGNyZWF0ZSBhIG5ldyB0cmlhbmdsZS4gSWYgbmVlZGVkIG5ldyBob2xlcyBhbmQgYmFzaW5zXG4gKiB3aWxsIGJlIGZpbGxlZCB0by5cbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIHshWFl9IHBvaW50ICAgUG9pbnRcbiAqL1xuZnVuY3Rpb24gcG9pbnRFdmVudCh0Y3gsIHBvaW50KSB7XG4gICAgdmFyIG5vZGUgPSB0Y3gubG9jYXRlTm9kZShwb2ludCk7XG4gICAgdmFyIG5ld19ub2RlID0gbmV3RnJvbnRUcmlhbmdsZSh0Y3gsIHBvaW50LCBub2RlKTtcblxuICAgIC8vIE9ubHkgbmVlZCB0byBjaGVjayArZXBzaWxvbiBzaW5jZSBwb2ludCBuZXZlciBoYXZlIHNtYWxsZXJcbiAgICAvLyB4IHZhbHVlIHRoYW4gbm9kZSBkdWUgdG8gaG93IHdlIGZldGNoIG5vZGVzIGZyb20gdGhlIGZyb250XG4gICAgaWYgKHBvaW50LnggPD0gbm9kZS5wb2ludC54ICsgKEVQU0lMT04pKSB7XG4gICAgICAgIGZpbGwodGN4LCBub2RlKTtcbiAgICB9XG5cbiAgICAvL3RjeC5BZGROb2RlKG5ld19ub2RlKTtcblxuICAgIGZpbGxBZHZhbmNpbmdGcm9udCh0Y3gsIG5ld19ub2RlKTtcbiAgICByZXR1cm4gbmV3X25vZGU7XG59XG5cbmZ1bmN0aW9uIGVkZ2VFdmVudEJ5RWRnZSh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICB0Y3guZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlID0gZWRnZTtcbiAgICB0Y3guZWRnZV9ldmVudC5yaWdodCA9IChlZGdlLnAueCA+IGVkZ2UucS54KTtcblxuICAgIGlmIChpc0VkZ2VTaWRlT2ZUcmlhbmdsZShub2RlLnRyaWFuZ2xlLCBlZGdlLnAsIGVkZ2UucSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZvciBub3cgd2Ugd2lsbCBkbyBhbGwgbmVlZGVkIGZpbGxpbmdcbiAgICAvLyBUT0RPOiBpbnRlZ3JhdGUgd2l0aCBmbGlwIHByb2Nlc3MgbWlnaHQgZ2l2ZSBzb21lIGJldHRlciBwZXJmb3JtYW5jZVxuICAgIC8vICAgICAgIGJ1dCBmb3Igbm93IHRoaXMgYXZvaWQgdGhlIGlzc3VlIHdpdGggY2FzZXMgdGhhdCBuZWVkcyBib3RoIGZsaXBzIGFuZCBmaWxsc1xuICAgIGZpbGxFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICBlZGdlRXZlbnRCeVBvaW50cyh0Y3gsIGVkZ2UucCwgZWRnZS5xLCBub2RlLnRyaWFuZ2xlLCBlZGdlLnEpO1xufVxuXG5mdW5jdGlvbiBlZGdlRXZlbnRCeVBvaW50cyh0Y3gsIGVwLCBlcSwgdHJpYW5nbGUsIHBvaW50KSB7XG4gICAgaWYgKGlzRWRnZVNpZGVPZlRyaWFuZ2xlKHRyaWFuZ2xlLCBlcCwgZXEpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcDEgPSB0cmlhbmdsZS5wb2ludENDVyhwb2ludCk7XG4gICAgdmFyIG8xID0gb3JpZW50MmQoZXEsIHAxLCBlcCk7XG4gICAgaWYgKG8xID09PSBPcmllbnRhdGlvbi5DT0xMSU5FQVIpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIDA5ODgwYTg2OTA5NSBkYXRlZCBNYXJjaCA4LCAyMDExKVxuICAgICAgICB0aHJvdyBuZXcgUG9pbnRFcnJvcigncG9seTJ0cmkgRWRnZUV2ZW50OiBDb2xsaW5lYXIgbm90IHN1cHBvcnRlZCEnLCBbZXEsIHAxLCBlcF0pO1xuICAgIH1cblxuICAgIHZhciBwMiA9IHRyaWFuZ2xlLnBvaW50Q1cocG9pbnQpO1xuICAgIHZhciBvMiA9IG9yaWVudDJkKGVxLCBwMiwgZXApO1xuICAgIGlmIChvMiA9PT0gT3JpZW50YXRpb24uQ09MTElORUFSKSB7XG4gICAgICAgIC8vIFRPRE8gaW50ZWdyYXRlIGhlcmUgY2hhbmdlcyBmcm9tIEMrKyB2ZXJzaW9uXG4gICAgICAgIC8vIChDKysgcmVwbyByZXZpc2lvbiAwOTg4MGE4NjkwOTUgZGF0ZWQgTWFyY2ggOCwgMjAxMSlcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoJ3BvbHkydHJpIEVkZ2VFdmVudDogQ29sbGluZWFyIG5vdCBzdXBwb3J0ZWQhJywgW2VxLCBwMiwgZXBdKTtcbiAgICB9XG5cbiAgICBpZiAobzEgPT09IG8yKSB7XG4gICAgICAgIC8vIE5lZWQgdG8gZGVjaWRlIGlmIHdlIGFyZSByb3RhdGluZyBDVyBvciBDQ1cgdG8gZ2V0IHRvIGEgdHJpYW5nbGVcbiAgICAgICAgLy8gdGhhdCB3aWxsIGNyb3NzIGVkZ2VcbiAgICAgICAgaWYgKG8xID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgdHJpYW5nbGUgPSB0cmlhbmdsZS5uZWlnaGJvckNDVyhwb2ludCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmlhbmdsZSA9IHRyaWFuZ2xlLm5laWdoYm9yQ1cocG9pbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVkZ2VFdmVudEJ5UG9pbnRzKHRjeCwgZXAsIGVxLCB0cmlhbmdsZSwgcG9pbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgdHJpYW5nbGUgY3Jvc3NlcyBjb25zdHJhaW50IHNvIGxldHMgZmxpcHBpbiBzdGFydCFcbiAgICAgICAgZmxpcEVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgdHJpYW5nbGUsIHBvaW50KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzRWRnZVNpZGVPZlRyaWFuZ2xlKHRyaWFuZ2xlLCBlcCwgZXEpIHtcbiAgICB2YXIgaW5kZXggPSB0cmlhbmdsZS5lZGdlSW5kZXgoZXAsIGVxKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRyaWFuZ2xlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUluZGV4KGluZGV4KTtcbiAgICAgICAgdmFyIHQgPSB0cmlhbmdsZS5nZXROZWlnaGJvcihpbmRleCk7XG4gICAgICAgIGlmICh0KSB7XG4gICAgICAgICAgICB0Lm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlcCwgZXEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBmcm9udCB0cmlhbmdsZSBhbmQgbGVnYWxpemUgaXRcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBuZXdGcm9udFRyaWFuZ2xlKHRjeCwgcG9pbnQsIG5vZGUpIHtcbiAgICB2YXIgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUocG9pbnQsIG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCk7XG5cbiAgICB0cmlhbmdsZS5tYXJrTmVpZ2hib3Iobm9kZS50cmlhbmdsZSk7XG4gICAgdGN4LmFkZFRvTWFwKHRyaWFuZ2xlKTtcblxuICAgIHZhciBuZXdfbm9kZSA9IG5ldyBOb2RlKHBvaW50KTtcbiAgICBuZXdfbm9kZS5uZXh0ID0gbm9kZS5uZXh0O1xuICAgIG5ld19ub2RlLnByZXYgPSBub2RlO1xuICAgIG5vZGUubmV4dC5wcmV2ID0gbmV3X25vZGU7XG4gICAgbm9kZS5uZXh0ID0gbmV3X25vZGU7XG5cbiAgICBpZiAoIWxlZ2FsaXplKHRjeCwgdHJpYW5nbGUpKSB7XG4gICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXModHJpYW5nbGUpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdfbm9kZTtcbn1cblxuLyoqXG4gKiBBZGRzIGEgdHJpYW5nbGUgdG8gdGhlIGFkdmFuY2luZyBmcm9udCB0byBmaWxsIGEgaG9sZS5cbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG5vZGUgLSBtaWRkbGUgbm9kZSwgdGhhdCBpcyB0aGUgYm90dG9tIG9mIHRoZSBob2xlXG4gKi9cbmZ1bmN0aW9uIGZpbGwodGN4LCBub2RlKSB7XG4gICAgdmFyIHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKG5vZGUucHJldi5wb2ludCwgbm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50KTtcblxuICAgIC8vIFRPRE86IHNob3VsZCBjb3B5IHRoZSBjb25zdHJhaW5lZF9lZGdlIHZhbHVlIGZyb20gbmVpZ2hib3IgdHJpYW5nbGVzXG4gICAgLy8gICAgICAgZm9yIG5vdyBjb25zdHJhaW5lZF9lZGdlIHZhbHVlcyBhcmUgY29waWVkIGR1cmluZyB0aGUgbGVnYWxpemVcbiAgICB0cmlhbmdsZS5tYXJrTmVpZ2hib3Iobm9kZS5wcmV2LnRyaWFuZ2xlKTtcbiAgICB0cmlhbmdsZS5tYXJrTmVpZ2hib3Iobm9kZS50cmlhbmdsZSk7XG5cbiAgICB0Y3guYWRkVG9NYXAodHJpYW5nbGUpO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBhZHZhbmNpbmcgZnJvbnRcbiAgICBub2RlLnByZXYubmV4dCA9IG5vZGUubmV4dDtcbiAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcblxuXG4gICAgLy8gSWYgaXQgd2FzIGxlZ2FsaXplZCB0aGUgdHJpYW5nbGUgaGFzIGFscmVhZHkgYmVlbiBtYXBwZWRcbiAgICBpZiAoIWxlZ2FsaXplKHRjeCwgdHJpYW5nbGUpKSB7XG4gICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXModHJpYW5nbGUpO1xuICAgIH1cblxuICAgIC8vdGN4LnJlbW92ZU5vZGUobm9kZSk7XG59XG5cbi8qKlxuICogRmlsbHMgaG9sZXMgaW4gdGhlIEFkdmFuY2luZyBGcm9udFxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGZpbGxBZHZhbmNpbmdGcm9udCh0Y3gsIG4pIHtcbiAgICAvLyBGaWxsIHJpZ2h0IGhvbGVzXG4gICAgdmFyIG5vZGUgPSBuLm5leHQ7XG4gICAgd2hpbGUgKG5vZGUubmV4dCkge1xuICAgICAgICAvLyBUT0RPIGludGVncmF0ZSBoZXJlIGNoYW5nZXMgZnJvbSBDKysgdmVyc2lvblxuICAgICAgICAvLyAoQysrIHJlcG8gcmV2aXNpb24gYWNmODFmMWYxNzY0IGRhdGVkIEFwcmlsIDcsIDIwMTIpXG4gICAgICAgIGlmIChpc0FuZ2xlT2J0dXNlKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5wcmV2LnBvaW50KSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZmlsbCh0Y3gsIG5vZGUpO1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cblxuICAgIC8vIEZpbGwgbGVmdCBob2xlc1xuICAgIG5vZGUgPSBuLnByZXY7XG4gICAgd2hpbGUgKG5vZGUucHJldikge1xuICAgICAgICAvLyBUT0RPIGludGVncmF0ZSBoZXJlIGNoYW5nZXMgZnJvbSBDKysgdmVyc2lvblxuICAgICAgICAvLyAoQysrIHJlcG8gcmV2aXNpb24gYWNmODFmMWYxNzY0IGRhdGVkIEFwcmlsIDcsIDIwMTIpXG4gICAgICAgIGlmIChpc0FuZ2xlT2J0dXNlKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5wcmV2LnBvaW50KSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZmlsbCh0Y3gsIG5vZGUpO1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgIH1cblxuICAgIC8vIEZpbGwgcmlnaHQgYmFzaW5zXG4gICAgaWYgKG4ubmV4dCAmJiBuLm5leHQubmV4dCkge1xuICAgICAgICBpZiAoaXNCYXNpbkFuZ2xlUmlnaHQobikpIHtcbiAgICAgICAgICAgIGZpbGxCYXNpbih0Y3gsIG4pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSBiYXNpbiBhbmdsZSBpcyBkZWNpZGVkIGFnYWluc3QgdGhlIGhvcml6b250YWwgbGluZSBbMSwwXS5cbiAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhbmdsZSA8IDMqz4AvNFxuICovXG5mdW5jdGlvbiBpc0Jhc2luQW5nbGVSaWdodChub2RlKSB7XG4gICAgdmFyIGF4ID0gbm9kZS5wb2ludC54IC0gbm9kZS5uZXh0Lm5leHQucG9pbnQueDtcbiAgICB2YXIgYXkgPSBub2RlLnBvaW50LnkgLSBub2RlLm5leHQubmV4dC5wb2ludC55O1xuICAgIGFzc2VydChheSA+PSAwLCBcInVub3JkZXJlZCB5XCIpO1xuICAgIHJldHVybiAoYXggPj0gMCB8fCBNYXRoLmFicyhheCkgPCBheSk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRyaWFuZ2xlIHdhcyBsZWdhbGl6ZWRcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gbGVnYWxpemUodGN4LCB0KSB7XG4gICAgLy8gVG8gbGVnYWxpemUgYSB0cmlhbmdsZSB3ZSBzdGFydCBieSBmaW5kaW5nIGlmIGFueSBvZiB0aGUgdGhyZWUgZWRnZXNcbiAgICAvLyB2aW9sYXRlIHRoZSBEZWxhdW5heSBjb25kaXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDM7ICsraSkge1xuICAgICAgICBpZiAodC5kZWxhdW5heV9lZGdlW2ldKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3QgPSB0LmdldE5laWdoYm9yKGkpO1xuICAgICAgICBpZiAob3QpIHtcbiAgICAgICAgICAgIHZhciBwID0gdC5nZXRQb2ludChpKTtcbiAgICAgICAgICAgIHZhciBvcCA9IG90Lm9wcG9zaXRlUG9pbnQodCwgcCk7XG4gICAgICAgICAgICB2YXIgb2kgPSBvdC5pbmRleChvcCk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBDb25zdHJhaW5lZCBFZGdlIG9yIGEgRGVsYXVuYXkgRWRnZShvbmx5IGR1cmluZyByZWN1cnNpdmUgbGVnYWxpemF0aW9uKVxuICAgICAgICAgICAgLy8gdGhlbiB3ZSBzaG91bGQgbm90IHRyeSB0byBsZWdhbGl6ZVxuICAgICAgICAgICAgaWYgKG90LmNvbnN0cmFpbmVkX2VkZ2Vbb2ldIHx8IG90LmRlbGF1bmF5X2VkZ2Vbb2ldKSB7XG4gICAgICAgICAgICAgICAgdC5jb25zdHJhaW5lZF9lZGdlW2ldID0gb3QuY29uc3RyYWluZWRfZWRnZVtvaV07XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbnNpZGUgPSBpbkNpcmNsZShwLCB0LnBvaW50Q0NXKHApLCB0LnBvaW50Q1cocCksIG9wKTtcbiAgICAgICAgICAgIGlmIChpbnNpZGUpIHtcbiAgICAgICAgICAgICAgICAvLyBMZXRzIG1hcmsgdGhpcyBzaGFyZWQgZWRnZSBhcyBEZWxhdW5heVxuICAgICAgICAgICAgICAgIHQuZGVsYXVuYXlfZWRnZVtpXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgb3QuZGVsYXVuYXlfZWRnZVtvaV0gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLy8gTGV0cyByb3RhdGUgc2hhcmVkIGVkZ2Ugb25lIHZlcnRleCBDVyB0byBsZWdhbGl6ZSBpdFxuICAgICAgICAgICAgICAgIHJvdGF0ZVRyaWFuZ2xlUGFpcih0LCBwLCBvdCwgb3ApO1xuXG4gICAgICAgICAgICAgICAgLy8gV2Ugbm93IGdvdCBvbmUgdmFsaWQgRGVsYXVuYXkgRWRnZSBzaGFyZWQgYnkgdHdvIHRyaWFuZ2xlc1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgZ2l2ZXMgdXMgNCBuZXcgZWRnZXMgdG8gY2hlY2sgZm9yIERlbGF1bmF5XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB0cmlhbmdsZSB0byBub2RlIG1hcHBpbmcgaXMgZG9uZSBvbmx5IG9uZSB0aW1lIGZvciBhIHNwZWNpZmljIHRyaWFuZ2xlXG4gICAgICAgICAgICAgICAgdmFyIG5vdF9sZWdhbGl6ZWQgPSAhbGVnYWxpemUodGN4LCB0KTtcbiAgICAgICAgICAgICAgICBpZiAobm90X2xlZ2FsaXplZCkge1xuICAgICAgICAgICAgICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG5vdF9sZWdhbGl6ZWQgPSAhbGVnYWxpemUodGN4LCBvdCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vdF9sZWdhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhvdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBEZWxhdW5heSBlZGdlcywgc2luY2UgdGhleSBvbmx5IGFyZSB2YWxpZCBEZWxhdW5heSBlZGdlc1xuICAgICAgICAgICAgICAgIC8vIHVudGlsIHdlIGFkZCBhIG5ldyB0cmlhbmdsZSBvciBwb2ludC5cbiAgICAgICAgICAgICAgICAvLyBYWFg6IG5lZWQgdG8gdGhpbmsgYWJvdXQgdGhpcy4gQ2FuIHRoZXNlIGVkZ2VzIGJlIHRyaWVkIGFmdGVyIHdlXG4gICAgICAgICAgICAgICAgLy8gICAgICByZXR1cm4gdG8gcHJldmlvdXMgcmVjdXJzaXZlIGxldmVsP1xuICAgICAgICAgICAgICAgIHQuZGVsYXVuYXlfZWRnZVtpXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG90LmRlbGF1bmF5X2VkZ2Vbb2ldID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB0cmlhbmdsZSBoYXZlIGJlZW4gbGVnYWxpemVkIG5vIG5lZWQgdG8gY2hlY2sgdGhlIG90aGVyIGVkZ2VzIHNpbmNlXG4gICAgICAgICAgICAgICAgLy8gdGhlIHJlY3Vyc2l2ZSBsZWdhbGl6YXRpb24gd2lsbCBoYW5kbGVzIHRob3NlIHNvIHdlIGNhbiBlbmQgaGVyZS5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogPGI+UmVxdWlyZW1lbnQ8L2I+Ojxicj5cbiAqIDEuIGEsYiBhbmQgYyBmb3JtIGEgdHJpYW5nbGUuPGJyPlxuICogMi4gYSBhbmQgZCBpcyBrbm93IHRvIGJlIG9uIG9wcG9zaXRlIHNpZGUgb2YgYmM8YnI+XG4gKiA8cHJlPlxuICogICAgICAgICAgICAgICAgYVxuICogICAgICAgICAgICAgICAgK1xuICogICAgICAgICAgICAgICAvIFxcXG4gKiAgICAgICAgICAgICAgLyAgIFxcXG4gKiAgICAgICAgICAgIGIvICAgICBcXGNcbiAqICAgICAgICAgICAgKy0tLS0tLS0rXG4gKiAgICAgICAgICAgLyAgICBkICAgIFxcXG4gKiAgICAgICAgICAvICAgICAgICAgICBcXFxuICogPC9wcmU+XG4gKiA8Yj5GYWN0PC9iPjogZCBoYXMgdG8gYmUgaW4gYXJlYSBCIHRvIGhhdmUgYSBjaGFuY2UgdG8gYmUgaW5zaWRlIHRoZSBjaXJjbGUgZm9ybWVkIGJ5XG4gKiAgYSxiIGFuZCBjPGJyPlxuICogIGQgaXMgb3V0c2lkZSBCIGlmIG9yaWVudDJkKGEsYixkKSBvciBvcmllbnQyZChjLGEsZCkgaXMgQ1c8YnI+XG4gKiAgVGhpcyBwcmVrbm93bGVkZ2UgZ2l2ZXMgdXMgYSB3YXkgdG8gb3B0aW1pemUgdGhlIGluY2lyY2xlIHRlc3RcbiAqIEBwYXJhbSBwYSAtIHRyaWFuZ2xlIHBvaW50LCBvcHBvc2l0ZSBkXG4gKiBAcGFyYW0gcGIgLSB0cmlhbmdsZSBwb2ludFxuICogQHBhcmFtIHBjIC0gdHJpYW5nbGUgcG9pbnRcbiAqIEBwYXJhbSBwZCAtIHBvaW50IG9wcG9zaXRlIGFcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgZCBpcyBpbnNpZGUgY2lyY2xlLCBmYWxzZSBpZiBvbiBjaXJjbGUgZWRnZVxuICovXG5mdW5jdGlvbiBpbkNpcmNsZShwYSwgcGIsIHBjLCBwZCkge1xuICAgIHZhciBhZHggPSBwYS54IC0gcGQueDtcbiAgICB2YXIgYWR5ID0gcGEueSAtIHBkLnk7XG4gICAgdmFyIGJkeCA9IHBiLnggLSBwZC54O1xuICAgIHZhciBiZHkgPSBwYi55IC0gcGQueTtcblxuICAgIHZhciBhZHhiZHkgPSBhZHggKiBiZHk7XG4gICAgdmFyIGJkeGFkeSA9IGJkeCAqIGFkeTtcbiAgICB2YXIgb2FiZCA9IGFkeGJkeSAtIGJkeGFkeTtcbiAgICBpZiAob2FiZCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgY2R4ID0gcGMueCAtIHBkLng7XG4gICAgdmFyIGNkeSA9IHBjLnkgLSBwZC55O1xuXG4gICAgdmFyIGNkeGFkeSA9IGNkeCAqIGFkeTtcbiAgICB2YXIgYWR4Y2R5ID0gYWR4ICogY2R5O1xuICAgIHZhciBvY2FkID0gY2R4YWR5IC0gYWR4Y2R5O1xuICAgIGlmIChvY2FkIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBiZHhjZHkgPSBiZHggKiBjZHk7XG4gICAgdmFyIGNkeGJkeSA9IGNkeCAqIGJkeTtcblxuICAgIHZhciBhbGlmdCA9IGFkeCAqIGFkeCArIGFkeSAqIGFkeTtcbiAgICB2YXIgYmxpZnQgPSBiZHggKiBiZHggKyBiZHkgKiBiZHk7XG4gICAgdmFyIGNsaWZ0ID0gY2R4ICogY2R4ICsgY2R5ICogY2R5O1xuXG4gICAgdmFyIGRldCA9IGFsaWZ0ICogKGJkeGNkeSAtIGNkeGJkeSkgKyBibGlmdCAqIG9jYWQgKyBjbGlmdCAqIG9hYmQ7XG4gICAgcmV0dXJuIGRldCA+IDA7XG59XG5cbi8qKlxuICogUm90YXRlcyBhIHRyaWFuZ2xlIHBhaXIgb25lIHZlcnRleCBDV1xuICo8cHJlPlxuICogICAgICAgbjIgICAgICAgICAgICAgICAgICAgIG4yXG4gKiAgUCArLS0tLS0rICAgICAgICAgICAgIFAgKy0tLS0tK1xuICogICAgfCB0ICAvfCAgICAgICAgICAgICAgIHxcXCAgdCB8XG4gKiAgICB8ICAgLyB8ICAgICAgICAgICAgICAgfCBcXCAgIHxcbiAqICBuMXwgIC8gIHxuMyAgICAgICAgICAgbjF8ICBcXCAgfG4zXG4gKiAgICB8IC8gICB8ICAgIGFmdGVyIENXICAgfCAgIFxcIHxcbiAqICAgIHwvIG9UIHwgICAgICAgICAgICAgICB8IG9UIFxcfFxuICogICAgKy0tLS0tKyBvUCAgICAgICAgICAgICstLS0tLStcbiAqICAgICAgIG40ICAgICAgICAgICAgICAgICAgICBuNFxuICogPC9wcmU+XG4gKi9cbmZ1bmN0aW9uIHJvdGF0ZVRyaWFuZ2xlUGFpcih0LCBwLCBvdCwgb3ApIHtcbiAgICB2YXIgbjEsIG4yLCBuMywgbjQ7XG4gICAgbjEgPSB0Lm5laWdoYm9yQ0NXKHApO1xuICAgIG4yID0gdC5uZWlnaGJvckNXKHApO1xuICAgIG4zID0gb3QubmVpZ2hib3JDQ1cob3ApO1xuICAgIG40ID0gb3QubmVpZ2hib3JDVyhvcCk7XG5cbiAgICB2YXIgY2UxLCBjZTIsIGNlMywgY2U0O1xuICAgIGNlMSA9IHQuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXKHApO1xuICAgIGNlMiA9IHQuZ2V0Q29uc3RyYWluZWRFZGdlQ1cocCk7XG4gICAgY2UzID0gb3QuZ2V0Q29uc3RyYWluZWRFZGdlQ0NXKG9wKTtcbiAgICBjZTQgPSBvdC5nZXRDb25zdHJhaW5lZEVkZ2VDVyhvcCk7XG5cbiAgICB2YXIgZGUxLCBkZTIsIGRlMywgZGU0O1xuICAgIGRlMSA9IHQuZ2V0RGVsYXVuYXlFZGdlQ0NXKHApO1xuICAgIGRlMiA9IHQuZ2V0RGVsYXVuYXlFZGdlQ1cocCk7XG4gICAgZGUzID0gb3QuZ2V0RGVsYXVuYXlFZGdlQ0NXKG9wKTtcbiAgICBkZTQgPSBvdC5nZXREZWxhdW5heUVkZ2VDVyhvcCk7XG5cbiAgICB0LmxlZ2FsaXplKHAsIG9wKTtcbiAgICBvdC5sZWdhbGl6ZShvcCwgcCk7XG5cbiAgICAvLyBSZW1hcCBkZWxhdW5heV9lZGdlXG4gICAgb3Quc2V0RGVsYXVuYXlFZGdlQ0NXKHAsIGRlMSk7XG4gICAgdC5zZXREZWxhdW5heUVkZ2VDVyhwLCBkZTIpO1xuICAgIHQuc2V0RGVsYXVuYXlFZGdlQ0NXKG9wLCBkZTMpO1xuICAgIG90LnNldERlbGF1bmF5RWRnZUNXKG9wLCBkZTQpO1xuXG4gICAgLy8gUmVtYXAgY29uc3RyYWluZWRfZWRnZVxuICAgIG90LnNldENvbnN0cmFpbmVkRWRnZUNDVyhwLCBjZTEpO1xuICAgIHQuc2V0Q29uc3RyYWluZWRFZGdlQ1cocCwgY2UyKTtcbiAgICB0LnNldENvbnN0cmFpbmVkRWRnZUNDVyhvcCwgY2UzKTtcbiAgICBvdC5zZXRDb25zdHJhaW5lZEVkZ2VDVyhvcCwgY2U0KTtcblxuICAgIC8vIFJlbWFwIG5laWdoYm9yc1xuICAgIC8vIFhYWDogbWlnaHQgb3B0aW1pemUgdGhlIG1hcmtOZWlnaGJvciBieSBrZWVwaW5nIHRyYWNrIG9mXG4gICAgLy8gICAgICB3aGF0IHNpZGUgc2hvdWxkIGJlIGFzc2lnbmVkIHRvIHdoYXQgbmVpZ2hib3IgYWZ0ZXIgdGhlXG4gICAgLy8gICAgICByb3RhdGlvbi4gTm93IG1hcmsgbmVpZ2hib3IgZG9lcyBsb3RzIG9mIHRlc3RpbmcgdG8gZmluZFxuICAgIC8vICAgICAgdGhlIHJpZ2h0IHNpZGUuXG4gICAgdC5jbGVhck5laWdoYm9ycygpO1xuICAgIG90LmNsZWFyTmVpZ2hib3JzKCk7XG4gICAgaWYgKG4xKSB7XG4gICAgICAgIG90Lm1hcmtOZWlnaGJvcihuMSk7XG4gICAgfVxuICAgIGlmIChuMikge1xuICAgICAgICB0Lm1hcmtOZWlnaGJvcihuMik7XG4gICAgfVxuICAgIGlmIChuMykge1xuICAgICAgICB0Lm1hcmtOZWlnaGJvcihuMyk7XG4gICAgfVxuICAgIGlmIChuNCkge1xuICAgICAgICBvdC5tYXJrTmVpZ2hib3IobjQpO1xuICAgIH1cbiAgICB0Lm1hcmtOZWlnaGJvcihvdCk7XG59XG5cbi8qKlxuICogRmlsbHMgYSBiYXNpbiB0aGF0IGhhcyBmb3JtZWQgb24gdGhlIEFkdmFuY2luZyBGcm9udCB0byB0aGUgcmlnaHRcbiAqIG9mIGdpdmVuIG5vZGUuPGJyPlxuICogRmlyc3Qgd2UgZGVjaWRlIGEgbGVmdCxib3R0b20gYW5kIHJpZ2h0IG5vZGUgdGhhdCBmb3JtcyB0aGVcbiAqIGJvdW5kYXJpZXMgb2YgdGhlIGJhc2luLiBUaGVuIHdlIGRvIGEgcmVxdXJzaXZlIGZpbGwuXG4gKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZSAtIHN0YXJ0aW5nIG5vZGUsIHRoaXMgb3IgbmV4dCBub2RlIHdpbGwgYmUgbGVmdCBub2RlXG4gKi9cbmZ1bmN0aW9uIGZpbGxCYXNpbih0Y3gsIG5vZGUpIHtcbiAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICB0Y3guYmFzaW4ubGVmdF9ub2RlID0gbm9kZS5uZXh0Lm5leHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGN4LmJhc2luLmxlZnRfbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSBib3R0b20gYW5kIHJpZ2h0IG5vZGVcbiAgICB0Y3guYmFzaW4uYm90dG9tX25vZGUgPSB0Y3guYmFzaW4ubGVmdF9ub2RlO1xuICAgIHdoaWxlICh0Y3guYmFzaW4uYm90dG9tX25vZGUubmV4dCAmJiB0Y3guYmFzaW4uYm90dG9tX25vZGUucG9pbnQueSA+PSB0Y3guYmFzaW4uYm90dG9tX25vZGUubmV4dC5wb2ludC55KSB7XG4gICAgICAgIHRjeC5iYXNpbi5ib3R0b21fbm9kZSA9IHRjeC5iYXNpbi5ib3R0b21fbm9kZS5uZXh0O1xuICAgIH1cbiAgICBpZiAodGN4LmJhc2luLmJvdHRvbV9ub2RlID09PSB0Y3guYmFzaW4ubGVmdF9ub2RlKSB7XG4gICAgICAgIC8vIE5vIHZhbGlkIGJhc2luXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0Y3guYmFzaW4ucmlnaHRfbm9kZSA9IHRjeC5iYXNpbi5ib3R0b21fbm9kZTtcbiAgICB3aGlsZSAodGN4LmJhc2luLnJpZ2h0X25vZGUubmV4dCAmJiB0Y3guYmFzaW4ucmlnaHRfbm9kZS5wb2ludC55IDwgdGN4LmJhc2luLnJpZ2h0X25vZGUubmV4dC5wb2ludC55KSB7XG4gICAgICAgIHRjeC5iYXNpbi5yaWdodF9ub2RlID0gdGN4LmJhc2luLnJpZ2h0X25vZGUubmV4dDtcbiAgICB9XG4gICAgaWYgKHRjeC5iYXNpbi5yaWdodF9ub2RlID09PSB0Y3guYmFzaW4uYm90dG9tX25vZGUpIHtcbiAgICAgICAgLy8gTm8gdmFsaWQgYmFzaW5zXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0Y3guYmFzaW4ud2lkdGggPSB0Y3guYmFzaW4ucmlnaHRfbm9kZS5wb2ludC54IC0gdGN4LmJhc2luLmxlZnRfbm9kZS5wb2ludC54O1xuICAgIHRjeC5iYXNpbi5sZWZ0X2hpZ2hlc3QgPSB0Y3guYmFzaW4ubGVmdF9ub2RlLnBvaW50LnkgPiB0Y3guYmFzaW4ucmlnaHRfbm9kZS5wb2ludC55O1xuXG4gICAgZmlsbEJhc2luUmVxKHRjeCwgdGN4LmJhc2luLmJvdHRvbV9ub2RlKTtcbn1cblxuLyoqXG4gKiBSZWN1cnNpdmUgYWxnb3JpdGhtIHRvIGZpbGwgYSBCYXNpbiB3aXRoIHRyaWFuZ2xlc1xuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG5vZGUgLSBib3R0b21fbm9kZVxuICovXG5mdW5jdGlvbiBmaWxsQmFzaW5SZXEodGN4LCBub2RlKSB7XG4gICAgLy8gaWYgc2hhbGxvdyBzdG9wIGZpbGxpbmdcbiAgICBpZiAoaXNTaGFsbG93KHRjeCwgbm9kZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZpbGwodGN4LCBub2RlKTtcblxuICAgIHZhciBvO1xuICAgIGlmIChub2RlLnByZXYgPT09IHRjeC5iYXNpbi5sZWZ0X25vZGUgJiYgbm9kZS5uZXh0ID09PSB0Y3guYmFzaW4ucmlnaHRfbm9kZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChub2RlLnByZXYgPT09IHRjeC5iYXNpbi5sZWZ0X25vZGUpIHtcbiAgICAgICAgbyA9IG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpO1xuICAgICAgICBpZiAobyA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0ID09PSB0Y3guYmFzaW4ucmlnaHRfbm9kZSkge1xuICAgICAgICBvID0gb3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wb2ludCk7XG4gICAgICAgIGlmIChvID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIG5laWdoYm9yIG5vZGUgd2l0aCBsb3dlc3QgWSB2YWx1ZVxuICAgICAgICBpZiAobm9kZS5wcmV2LnBvaW50LnkgPCBub2RlLm5leHQucG9pbnQueSkge1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaWxsQmFzaW5SZXEodGN4LCBub2RlKTtcbn1cblxuZnVuY3Rpb24gaXNTaGFsbG93KHRjeCwgbm9kZSkge1xuICAgIHZhciBoZWlnaHQ7XG4gICAgaWYgKHRjeC5iYXNpbi5sZWZ0X2hpZ2hlc3QpIHtcbiAgICAgICAgaGVpZ2h0ID0gdGN4LmJhc2luLmxlZnRfbm9kZS5wb2ludC55IC0gbm9kZS5wb2ludC55O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhlaWdodCA9IHRjeC5iYXNpbi5yaWdodF9ub2RlLnBvaW50LnkgLSBub2RlLnBvaW50Lnk7XG4gICAgfVxuXG4gICAgLy8gaWYgc2hhbGxvdyBzdG9wIGZpbGxpbmdcbiAgICBpZiAodGN4LmJhc2luLndpZHRoID4gaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGZpbGxFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgaWYgKHRjeC5lZGdlX2V2ZW50LnJpZ2h0KSB7XG4gICAgICAgIGZpbGxSaWdodEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsbExlZnRBYm92ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbFJpZ2h0QWJvdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUubmV4dC5wb2ludC54IDwgZWRnZS5wLngpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgbmV4dCBub2RlIGlzIGJlbG93IHRoZSBlZGdlXG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUubmV4dC5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICBmaWxsUmlnaHRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbFJpZ2h0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgaWYgKG5vZGUucG9pbnQueCA8IGVkZ2UucC54KSB7XG4gICAgICAgIGlmIChvcmllbnQyZChub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgICAgICBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBDb252ZXhcbiAgICAgICAgICAgIGZpbGxSaWdodENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICAgICAgLy8gUmV0cnkgdGhpcyBvbmVcbiAgICAgICAgICAgIGZpbGxSaWdodEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgZmlsbCh0Y3gsIG5vZGUubmV4dCk7XG4gICAgaWYgKG5vZGUubmV4dC5wb2ludCAhPT0gZWRnZS5wKSB7XG4gICAgICAgIC8vIE5leHQgYWJvdmUgb3IgYmVsb3cgZWRnZT9cbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5uZXh0LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgIC8vIEJlbG93XG4gICAgICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29uY2F2ZVxuICAgICAgICAgICAgICAgIGZpbGxSaWdodENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gTmV4dCBpcyBjb252ZXhcbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsUmlnaHRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgLy8gTmV4dCBjb25jYXZlIG9yIGNvbnZleD9cbiAgICBpZiAob3JpZW50MmQobm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQubmV4dC5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgIGZpbGxSaWdodENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlLm5leHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENvbnZleFxuICAgICAgICAvLyBOZXh0IGFib3ZlIG9yIGJlbG93IGVkZ2U/XG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUubmV4dC5uZXh0LnBvaW50LCBlZGdlLnApID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgIC8vIEJlbG93XG4gICAgICAgICAgICBmaWxsUmlnaHRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlLm5leHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWJvdmVcbiAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0QWJvdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgd2hpbGUgKG5vZGUucHJldi5wb2ludC54ID4gZWRnZS5wLngpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgbmV4dCBub2RlIGlzIGJlbG93IHRoZSBlZGdlXG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUucHJldi5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIGZpbGxMZWZ0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgaWYgKG5vZGUucG9pbnQueCA+IGVkZ2UucC54KSB7XG4gICAgICAgIGlmIChvcmllbnQyZChub2RlLnBvaW50LCBub2RlLnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnBvaW50KSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIC8vIENvbmNhdmVcbiAgICAgICAgICAgIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udmV4XG4gICAgICAgICAgICBmaWxsTGVmdENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICAgICAgLy8gUmV0cnkgdGhpcyBvbmVcbiAgICAgICAgICAgIGZpbGxMZWZ0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbExlZnRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgLy8gTmV4dCBjb25jYXZlIG9yIGNvbnZleD9cbiAgICBpZiAob3JpZW50MmQobm9kZS5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucHJldi5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgIC8vIENvbmNhdmVcbiAgICAgICAgZmlsbExlZnRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5wcmV2KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb252ZXhcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLnByZXYucHJldi5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIC8vIEJlbG93XG4gICAgICAgICAgICBmaWxsTGVmdENvbnZleEVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUucHJldik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBYm92ZVxuICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbExlZnRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGZpbGwodGN4LCBub2RlLnByZXYpO1xuICAgIGlmIChub2RlLnByZXYucG9pbnQgIT09IGVkZ2UucCkge1xuICAgICAgICAvLyBOZXh0IGFib3ZlIG9yIGJlbG93IGVkZ2U/XG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUucHJldi5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIC8vIEJlbG93XG4gICAgICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAgICAgLy8gTmV4dCBpcyBjb25jYXZlXG4gICAgICAgICAgICAgICAgZmlsbExlZnRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29udmV4XG4gICAgICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmxpcEVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgdCwgcCkge1xuICAgIHZhciBvdCA9IHQubmVpZ2hib3JBY3Jvc3MocCk7XG4gICAgYXNzZXJ0KG90LCBcIkZMSVAgZmFpbGVkIGR1ZSB0byBtaXNzaW5nIHRyaWFuZ2xlIVwiKTtcblxuICAgIHZhciBvcCA9IG90Lm9wcG9zaXRlUG9pbnQodCwgcCk7XG5cbiAgICAvLyBBZGRpdGlvbmFsIGNoZWNrIGZyb20gSmF2YSB2ZXJzaW9uIChzZWUgaXNzdWUgIzg4KVxuICAgIGlmICh0LmdldENvbnN0cmFpbmVkRWRnZUFjcm9zcyhwKSkge1xuICAgICAgICB2YXIgaW5kZXggPSB0LmluZGV4KHApO1xuICAgICAgICB0aHJvdyBuZXcgUG9pbnRFcnJvcihcInBvbHkydHJpIEludGVyc2VjdGluZyBDb25zdHJhaW50c1wiLFxuICAgICAgICAgICAgICAgIFtwLCBvcCwgdC5nZXRQb2ludCgoaW5kZXggKyAxKSAlIDMpLCB0LmdldFBvaW50KChpbmRleCArIDIpICUgMyldKTtcbiAgICB9XG5cbiAgICBpZiAoaW5TY2FuQXJlYShwLCB0LnBvaW50Q0NXKHApLCB0LnBvaW50Q1cocCksIG9wKSkge1xuICAgICAgICAvLyBMZXRzIHJvdGF0ZSBzaGFyZWQgZWRnZSBvbmUgdmVydGV4IENXXG4gICAgICAgIHJvdGF0ZVRyaWFuZ2xlUGFpcih0LCBwLCBvdCwgb3ApO1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHQpO1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKG90KTtcblxuICAgICAgICAvLyBYWFg6IGluIHRoZSBvcmlnaW5hbCBDKysgY29kZSBmb3IgdGhlIG5leHQgMiBsaW5lcywgd2UgYXJlXG4gICAgICAgIC8vIGNvbXBhcmluZyBwb2ludCB2YWx1ZXMgKGFuZCBub3QgcG9pbnRlcnMpLiBJbiB0aGlzIEphdmFTY3JpcHRcbiAgICAgICAgLy8gY29kZSwgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzIChwb2ludGVycykuIFRoaXMgd29ya3NcbiAgICAgICAgLy8gYmVjYXVzZSB3ZSBjYW4ndCBoYXZlIDIgZGlmZmVyZW50IHBvaW50cyB3aXRoIHRoZSBzYW1lIHZhbHVlcy5cbiAgICAgICAgLy8gQnV0IHRvIGJlIHJlYWxseSBlcXVpdmFsZW50LCB3ZSBzaG91bGQgdXNlIFwiUG9pbnQuZXF1YWxzXCIgaGVyZS5cbiAgICAgICAgaWYgKHAgPT09IGVxICYmIG9wID09PSBlcCkge1xuICAgICAgICAgICAgaWYgKGVxID09PSB0Y3guZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlLnEgJiYgZXAgPT09IHRjeC5lZGdlX2V2ZW50LmNvbnN0cmFpbmVkX2VkZ2UucCkge1xuICAgICAgICAgICAgICAgIHQubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzKGVwLCBlcSk7XG4gICAgICAgICAgICAgICAgb3QubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzKGVwLCBlcSk7XG4gICAgICAgICAgICAgICAgbGVnYWxpemUodGN4LCB0KTtcbiAgICAgICAgICAgICAgICBsZWdhbGl6ZSh0Y3gsIG90KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gWFhYOiBJIHRoaW5rIG9uZSBvZiB0aGUgdHJpYW5nbGVzIHNob3VsZCBiZSBsZWdhbGl6ZWQgaGVyZT9cbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG8gPSBvcmllbnQyZChlcSwgb3AsIGVwKTtcbiAgICAgICAgICAgIHQgPSBuZXh0RmxpcFRyaWFuZ2xlKHRjeCwgbywgdCwgb3QsIHAsIG9wKTtcbiAgICAgICAgICAgIGZsaXBFZGdlRXZlbnQodGN4LCBlcCwgZXEsIHQsIHApO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1AgPSBuZXh0RmxpcFBvaW50KGVwLCBlcSwgb3QsIG9wKTtcbiAgICAgICAgZmxpcFNjYW5FZGdlRXZlbnQodGN4LCBlcCwgZXEsIHQsIG90LCBuZXdQKTtcbiAgICAgICAgZWRnZUV2ZW50QnlQb2ludHModGN4LCBlcCwgZXEsIHQsIHApO1xuICAgIH1cbn1cblxuLyoqXG4gKiBBZnRlciBhIGZsaXAgd2UgaGF2ZSB0d28gdHJpYW5nbGVzIGFuZCBrbm93IHRoYXQgb25seSBvbmUgd2lsbCBzdGlsbCBiZVxuICogaW50ZXJzZWN0aW5nIHRoZSBlZGdlLiBTbyBkZWNpZGUgd2hpY2ggdG8gY29udGl1bmUgd2l0aCBhbmQgbGVnYWxpemUgdGhlIG90aGVyXG4gKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKiBAcGFyYW0gbyAtIHNob3VsZCBiZSB0aGUgcmVzdWx0IG9mIGFuIG9yaWVudDJkKCBlcSwgb3AsIGVwIClcbiAqIEBwYXJhbSB0IC0gdHJpYW5nbGUgMVxuICogQHBhcmFtIG90IC0gdHJpYW5nbGUgMlxuICogQHBhcmFtIHAgLSBhIHBvaW50IHNoYXJlZCBieSBib3RoIHRyaWFuZ2xlc1xuICogQHBhcmFtIG9wIC0gYW5vdGhlciBwb2ludCBzaGFyZWQgYnkgYm90aCB0cmlhbmdsZXNcbiAqIEByZXR1cm4gcmV0dXJucyB0aGUgdHJpYW5nbGUgc3RpbGwgaW50ZXJzZWN0aW5nIHRoZSBlZGdlXG4gKi9cbmZ1bmN0aW9uIG5leHRGbGlwVHJpYW5nbGUodGN4LCBvLCB0LCBvdCwgcCwgb3ApIHtcbiAgICB2YXIgZWRnZV9pbmRleDtcbiAgICBpZiAobyA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgIC8vIG90IGlzIG5vdCBjcm9zc2luZyBlZGdlIGFmdGVyIGZsaXBcbiAgICAgICAgZWRnZV9pbmRleCA9IG90LmVkZ2VJbmRleChwLCBvcCk7XG4gICAgICAgIG90LmRlbGF1bmF5X2VkZ2VbZWRnZV9pbmRleF0gPSB0cnVlO1xuICAgICAgICBsZWdhbGl6ZSh0Y3gsIG90KTtcbiAgICAgICAgb3QuY2xlYXJEZWxhdW5heUVkZ2VzKCk7XG4gICAgICAgIHJldHVybiB0O1xuICAgIH1cblxuICAgIC8vIHQgaXMgbm90IGNyb3NzaW5nIGVkZ2UgYWZ0ZXIgZmxpcFxuICAgIGVkZ2VfaW5kZXggPSB0LmVkZ2VJbmRleChwLCBvcCk7XG5cbiAgICB0LmRlbGF1bmF5X2VkZ2VbZWRnZV9pbmRleF0gPSB0cnVlO1xuICAgIGxlZ2FsaXplKHRjeCwgdCk7XG4gICAgdC5jbGVhckRlbGF1bmF5RWRnZXMoKTtcbiAgICByZXR1cm4gb3Q7XG59XG5cbi8qKlxuICogV2hlbiB3ZSBuZWVkIHRvIHRyYXZlcnNlIGZyb20gb25lIHRyaWFuZ2xlIHRvIHRoZSBuZXh0IHdlIG5lZWRcbiAqIHRoZSBwb2ludCBpbiBjdXJyZW50IHRyaWFuZ2xlIHRoYXQgaXMgdGhlIG9wcG9zaXRlIHBvaW50IHRvIHRoZSBuZXh0XG4gKiB0cmlhbmdsZS5cbiAqL1xuZnVuY3Rpb24gbmV4dEZsaXBQb2ludChlcCwgZXEsIG90LCBvcCkge1xuICAgIHZhciBvMmQgPSBvcmllbnQyZChlcSwgb3AsIGVwKTtcbiAgICBpZiAobzJkID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAvLyBSaWdodFxuICAgICAgICByZXR1cm4gb3QucG9pbnRDQ1cob3ApO1xuICAgIH0gZWxzZSBpZiAobzJkID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgLy8gTGVmdFxuICAgICAgICByZXR1cm4gb3QucG9pbnRDVyhvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoXCJwb2x5MnRyaSBbVW5zdXBwb3J0ZWRdIG5leHRGbGlwUG9pbnQ6IG9wcG9zaW5nIHBvaW50IG9uIGNvbnN0cmFpbmVkIGVkZ2UhXCIsIFtlcSwgb3AsIGVwXSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFNjYW4gcGFydCBvZiB0aGUgRmxpcFNjYW4gYWxnb3JpdGhtPGJyPlxuICogV2hlbiBhIHRyaWFuZ2xlIHBhaXIgaXNuJ3QgZmxpcHBhYmxlIHdlIHdpbGwgc2NhbiBmb3IgdGhlIG5leHRcbiAqIHBvaW50IHRoYXQgaXMgaW5zaWRlIHRoZSBmbGlwIHRyaWFuZ2xlIHNjYW4gYXJlYS4gV2hlbiBmb3VuZFxuICogd2UgZ2VuZXJhdGUgYSBuZXcgZmxpcEVkZ2VFdmVudFxuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIGVwIC0gbGFzdCBwb2ludCBvbiB0aGUgZWRnZSB3ZSBhcmUgdHJhdmVyc2luZ1xuICogQHBhcmFtIGVxIC0gZmlyc3QgcG9pbnQgb24gdGhlIGVkZ2Ugd2UgYXJlIHRyYXZlcnNpbmdcbiAqIEBwYXJhbSB7IVRyaWFuZ2xlfSBmbGlwX3RyaWFuZ2xlIC0gdGhlIGN1cnJlbnQgdHJpYW5nbGUgc2hhcmluZyB0aGUgcG9pbnQgZXEgd2l0aCBlZGdlXG4gKiBAcGFyYW0gdFxuICogQHBhcmFtIHBcbiAqL1xuZnVuY3Rpb24gZmxpcFNjYW5FZGdlRXZlbnQodGN4LCBlcCwgZXEsIGZsaXBfdHJpYW5nbGUsIHQsIHApIHtcbiAgICB2YXIgb3QgPSB0Lm5laWdoYm9yQWNyb3NzKHApO1xuICAgIGFzc2VydChvdCwgXCJGTElQIGZhaWxlZCBkdWUgdG8gbWlzc2luZyB0cmlhbmdsZVwiKTtcblxuICAgIHZhciBvcCA9IG90Lm9wcG9zaXRlUG9pbnQodCwgcCk7XG5cbiAgICBpZiAoaW5TY2FuQXJlYShlcSwgZmxpcF90cmlhbmdsZS5wb2ludENDVyhlcSksIGZsaXBfdHJpYW5nbGUucG9pbnRDVyhlcSksIG9wKSkge1xuICAgICAgICAvLyBmbGlwIHdpdGggbmV3IGVkZ2Ugb3AuZXFcbiAgICAgICAgZmxpcEVkZ2VFdmVudCh0Y3gsIGVxLCBvcCwgb3QsIG9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3UCA9IG5leHRGbGlwUG9pbnQoZXAsIGVxLCBvdCwgb3ApO1xuICAgICAgICBmbGlwU2NhbkVkZ2VFdmVudCh0Y3gsIGVwLCBlcSwgZmxpcF90cmlhbmdsZSwgb3QsIG5ld1ApO1xuICAgIH1cbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0c1xuXG5leHBvcnRzLnRyaWFuZ3VsYXRlID0gdHJpYW5ndWxhdGU7XG5cbn0se1wiLi9hZHZhbmNpbmdmcm9udFwiOjIsXCIuL2Fzc2VydFwiOjMsXCIuL3BvaW50ZXJyb3JcIjo1LFwiLi90cmlhbmdsZVwiOjksXCIuL3V0aWxzXCI6MTB9XSw4OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbWF4Y29tcGxleGl0eTo2ICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cbnZhciBQb2ludEVycm9yID0gX2RlcmVxXygnLi9wb2ludGVycm9yJyk7XG52YXIgUG9pbnQgPSBfZGVyZXFfKCcuL3BvaW50Jyk7XG52YXIgVHJpYW5nbGUgPSBfZGVyZXFfKCcuL3RyaWFuZ2xlJyk7XG52YXIgc3dlZXAgPSBfZGVyZXFfKCcuL3N3ZWVwJyk7XG52YXIgQWR2YW5jaW5nRnJvbnQgPSBfZGVyZXFfKCcuL2FkdmFuY2luZ2Zyb250Jyk7XG52YXIgTm9kZSA9IEFkdmFuY2luZ0Zyb250Lk5vZGU7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tdXRpbHNcblxuLyoqXG4gKiBJbml0aWFsIHRyaWFuZ2xlIGZhY3Rvciwgc2VlZCB0cmlhbmdsZSB3aWxsIGV4dGVuZCAzMCUgb2ZcbiAqIFBvaW50U2V0IHdpZHRoIHRvIGJvdGggbGVmdCBhbmQgcmlnaHQuXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0XG4gKi9cbnZhciBrQWxwaGEgPSAwLjM7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUVkZ2Vcbi8qKlxuICogUmVwcmVzZW50cyBhIHNpbXBsZSBwb2x5Z29uJ3MgZWRnZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtQb2ludH0gcDFcbiAqIEBwYXJhbSB7UG9pbnR9IHAyXG4gKiBAdGhyb3cge1BvaW50RXJyb3J9IGlmIHAxIGlzIHNhbWUgYXMgcDJcbiAqL1xudmFyIEVkZ2UgPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICB0aGlzLnAgPSBwMTtcbiAgICB0aGlzLnEgPSBwMjtcblxuICAgIGlmIChwMS55ID4gcDIueSkge1xuICAgICAgICB0aGlzLnEgPSBwMTtcbiAgICAgICAgdGhpcy5wID0gcDI7XG4gICAgfSBlbHNlIGlmIChwMS55ID09PSBwMi55KSB7XG4gICAgICAgIGlmIChwMS54ID4gcDIueCkge1xuICAgICAgICAgICAgdGhpcy5xID0gcDE7XG4gICAgICAgICAgICB0aGlzLnAgPSBwMjtcbiAgICAgICAgfSBlbHNlIGlmIChwMS54ID09PSBwMi54KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUG9pbnRFcnJvcigncG9seTJ0cmkgSW52YWxpZCBFZGdlIGNvbnN0cnVjdG9yOiByZXBlYXRlZCBwb2ludHMhJywgW3AxXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucS5fcDJ0X2VkZ2VfbGlzdCkge1xuICAgICAgICB0aGlzLnEuX3AydF9lZGdlX2xpc3QgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5xLl9wMnRfZWRnZV9saXN0LnB1c2godGhpcyk7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUJhc2luXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHByaXZhdGVcbiAqL1xudmFyIEJhc2luID0gZnVuY3Rpb24oKSB7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMubGVmdF9ub2RlID0gbnVsbDtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy5ib3R0b21fbm9kZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMucmlnaHRfbm9kZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtudW1iZXJ9ICovXG4gICAgdGhpcy53aWR0aCA9IDAuMDtcbiAgICAvKiogQHR5cGUge2Jvb2xlYW59ICovXG4gICAgdGhpcy5sZWZ0X2hpZ2hlc3QgPSBmYWxzZTtcbn07XG5cbkJhc2luLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGVmdF9ub2RlID0gbnVsbDtcbiAgICB0aGlzLmJvdHRvbV9ub2RlID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0X25vZGUgPSBudWxsO1xuICAgIHRoaXMud2lkdGggPSAwLjA7XG4gICAgdGhpcy5sZWZ0X2hpZ2hlc3QgPSBmYWxzZTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRWRnZUV2ZW50XG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHByaXZhdGVcbiAqL1xudmFyIEVkZ2VFdmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIC8qKiBAdHlwZSB7RWRnZX0gKi9cbiAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2UgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9cbiAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tU3dlZXBDb250ZXh0IChwdWJsaWMgQVBJKVxuLyoqXG4gKiBTd2VlcENvbnRleHQgY29uc3RydWN0b3Igb3B0aW9uXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTd2VlcENvbnRleHRPcHRpb25zXG4gKiBAcHJvcGVydHkge2Jvb2xlYW49fSBjbG9uZUFycmF5cyAtIGlmIDxjb2RlPnRydWU8L2NvZGU+LCBkbyBhIHNoYWxsb3cgY29weSBvZiB0aGUgQXJyYXkgcGFyYW1ldGVyc1xuICogICAgICAgICAgICAgICAgICAoY29udG91ciwgaG9sZXMpLiBQb2ludHMgaW5zaWRlIGFycmF5cyBhcmUgbmV2ZXIgY29waWVkLlxuICogICAgICAgICAgICAgICAgICBEZWZhdWx0IGlzIDxjb2RlPmZhbHNlPC9jb2RlPiA6IGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIGFycmF5IGFyZ3VtZW50cyxcbiAqICAgICAgICAgICAgICAgICAgd2hvIHdpbGwgYmUgbW9kaWZpZWQgaW4gcGxhY2UuXG4gKi9cbi8qKlxuICogQ29uc3RydWN0b3IgZm9yIHRoZSB0cmlhbmd1bGF0aW9uIGNvbnRleHQuXG4gKiBJdCBhY2NlcHRzIGEgc2ltcGxlIHBvbHlsaW5lICh3aXRoIG5vbiByZXBlYXRpbmcgcG9pbnRzKSwgXG4gKiB3aGljaCBkZWZpbmVzIHRoZSBjb25zdHJhaW5lZCBlZGdlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICAgICAgdmFyIGNvbnRvdXIgPSBbXG4gKiAgICAgICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDEwMCwgMTAwKSxcbiAqICAgICAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMTAwLCAzMDApLFxuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDMwMCksXG4gKiAgICAgICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDMwMCwgMTAwKVxuICogICAgICAgICAgXTtcbiAqICAgICAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91ciwge2Nsb25lQXJyYXlzOiB0cnVlfSk7XG4gKiBAZXhhbXBsZVxuICogICAgICAgICAgdmFyIGNvbnRvdXIgPSBbe3g6MTAwLCB5OjEwMH0sIHt4OjEwMCwgeTozMDB9LCB7eDozMDAsIHk6MzAwfSwge3g6MzAwLCB5OjEwMH1dO1xuICogICAgICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyLCB7Y2xvbmVBcnJheXM6IHRydWV9KTtcbiAqIEBjb25zdHJ1Y3RvclxuICogQHB1YmxpY1xuICogQHN0cnVjdFxuICogQHBhcmFtIHtBcnJheS48WFk+fSBjb250b3VyIC0gYXJyYXkgb2YgcG9pbnQgb2JqZWN0cy4gVGhlIHBvaW50cyBjYW4gYmUgZWl0aGVyIHtAbGlua2NvZGUgUG9pbnR9IGluc3RhbmNlcyxcbiAqICAgICAgICAgIG9yIGFueSBcIlBvaW50IGxpa2VcIiBjdXN0b20gY2xhc3Mgd2l0aCA8Y29kZT57eCwgeX08L2NvZGU+IGF0dHJpYnV0ZXMuXG4gKiBAcGFyYW0ge1N3ZWVwQ29udGV4dE9wdGlvbnM9fSBvcHRpb25zIC0gY29uc3RydWN0b3Igb3B0aW9uc1xuICovXG52YXIgU3dlZXBDb250ZXh0ID0gZnVuY3Rpb24oY29udG91ciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMudHJpYW5nbGVzXyA9IFtdO1xuICAgIHRoaXMubWFwXyA9IFtdO1xuICAgIHRoaXMucG9pbnRzXyA9IChvcHRpb25zLmNsb25lQXJyYXlzID8gY29udG91ci5zbGljZSgwKSA6IGNvbnRvdXIpO1xuICAgIHRoaXMuZWRnZV9saXN0ID0gW107XG5cbiAgICAvLyBCb3VuZGluZyBib3ggb2YgYWxsIHBvaW50cy4gQ29tcHV0ZWQgYXQgdGhlIHN0YXJ0IG9mIHRoZSB0cmlhbmd1bGF0aW9uLCBcbiAgICAvLyBpdCBpcyBzdG9yZWQgaW4gY2FzZSBpdCBpcyBuZWVkZWQgYnkgdGhlIGNhbGxlci5cbiAgICB0aGlzLnBtaW5fID0gdGhpcy5wbWF4XyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBBZHZhbmNpbmcgZnJvbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBZHZhbmNpbmdGcm9udH1cbiAgICAgKi9cbiAgICB0aGlzLmZyb250XyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBoZWFkIHBvaW50IHVzZWQgd2l0aCBhZHZhbmNpbmcgZnJvbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKi9cbiAgICB0aGlzLmhlYWRfID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIHRhaWwgcG9pbnQgdXNlZCB3aXRoIGFkdmFuY2luZyBmcm9udFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge1BvaW50fVxuICAgICAqL1xuICAgIHRoaXMudGFpbF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgKi9cbiAgICB0aGlzLmFmX2hlYWRfID0gbnVsbDtcbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqL1xuICAgIHRoaXMuYWZfbWlkZGxlXyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgKi9cbiAgICB0aGlzLmFmX3RhaWxfID0gbnVsbDtcblxuICAgIHRoaXMuYmFzaW4gPSBuZXcgQmFzaW4oKTtcbiAgICB0aGlzLmVkZ2VfZXZlbnQgPSBuZXcgRWRnZUV2ZW50KCk7XG5cbiAgICB0aGlzLmluaXRFZGdlcyh0aGlzLnBvaW50c18pO1xufTtcblxuXG4vKipcbiAqIEFkZCBhIGhvbGUgdG8gdGhlIGNvbnN0cmFpbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgaG9sZSA9IFtcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDIwMCksXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyNTApLFxuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDI1MCwgMjUwKVxuICogICAgICBdO1xuICogICAgICBzd2N0eC5hZGRIb2xlKGhvbGUpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHguYWRkSG9sZShbe3g6MjAwLCB5OjIwMH0sIHt4OjIwMCwgeToyNTB9LCB7eDoyNTAsIHk6MjUwfV0pO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtBcnJheS48WFk+fSBwb2x5bGluZSAtIGFycmF5IG9mIFwiUG9pbnQgbGlrZVwiIG9iamVjdHMgd2l0aCB7eCx5fVxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmFkZEhvbGUgPSBmdW5jdGlvbihwb2x5bGluZSkge1xuICAgIHRoaXMuaW5pdEVkZ2VzKHBvbHlsaW5lKTtcbiAgICB2YXIgaSwgbGVuID0gcG9seWxpbmUubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0aGlzLnBvaW50c18ucHVzaChwb2x5bGluZVtpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I2FkZEhvbGV9IGluc3RlYWRcbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5BZGRIb2xlID0gU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRIb2xlO1xuXG5cbi8qKlxuICogQWRkIHNldmVyYWwgaG9sZXMgdG8gdGhlIGNvbnN0cmFpbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgaG9sZXMgPSBbXG4gKiAgICAgICAgICBbIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDIwMCksIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDI1MCksIG5ldyBwb2x5MnRyaS5Qb2ludCgyNTAsIDI1MCkgXSxcbiAqICAgICAgICAgIFsgbmV3IHBvbHkydHJpLlBvaW50KDMwMCwgMzAwKSwgbmV3IHBvbHkydHJpLlBvaW50KDMwMCwgMzUwKSwgbmV3IHBvbHkydHJpLlBvaW50KDM1MCwgMzUwKSBdXG4gKiAgICAgIF07XG4gKiAgICAgIHN3Y3R4LmFkZEhvbGVzKGhvbGVzKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHZhciBob2xlcyA9IFtcbiAqICAgICAgICAgIFt7eDoyMDAsIHk6MjAwfSwge3g6MjAwLCB5OjI1MH0sIHt4OjI1MCwgeToyNTB9XSxcbiAqICAgICAgICAgIFt7eDozMDAsIHk6MzAwfSwge3g6MzAwLCB5OjM1MH0sIHt4OjM1MCwgeTozNTB9XVxuICogICAgICBdO1xuICogICAgICBzd2N0eC5hZGRIb2xlcyhob2xlcyk7XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0FycmF5LjxBcnJheS48WFk+Pn0gaG9sZXMgLSBhcnJheSBvZiBhcnJheSBvZiBcIlBvaW50IGxpa2VcIiBvYmplY3RzIHdpdGgge3gseX1cbiAqL1xuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmFkZEhvbGVzID0gZnVuY3Rpb24oaG9sZXMpIHtcbiAgICB2YXIgaSwgbGVuID0gaG9sZXMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0aGlzLmluaXRFZGdlcyhob2xlc1tpXSk7XG4gICAgfVxuICAgIHRoaXMucG9pbnRzXyA9IHRoaXMucG9pbnRzXy5jb25jYXQuYXBwbHkodGhpcy5wb2ludHNfLCBob2xlcyk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuXG4vKipcbiAqIEFkZCBhIFN0ZWluZXIgcG9pbnQgdG8gdGhlIGNvbnN0cmFpbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgcG9pbnQgPSBuZXcgcG9seTJ0cmkuUG9pbnQoMTUwLCAxNTApO1xuICogICAgICBzd2N0eC5hZGRQb2ludChwb2ludCk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC5hZGRQb2ludCh7eDoxNTAsIHk6MTUwfSk7XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge1hZfSBwb2ludCAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmFkZFBvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICB0aGlzLnBvaW50c18ucHVzaChwb2ludCk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICogQGZ1bmN0aW9uXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjYWRkUG9pbnR9IGluc3RlYWRcbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5BZGRQb2ludCA9IFN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkUG9pbnQ7XG5cblxuLyoqXG4gKiBBZGQgc2V2ZXJhbCBTdGVpbmVyIHBvaW50cyB0byB0aGUgY29uc3RyYWludHNcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHZhciBwb2ludHMgPSBbXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMTUwLCAxNTApLFxuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjUwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyNTAsIDI1MClcbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkUG9pbnRzKHBvaW50cyk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC5hZGRQb2ludHMoW3t4OjE1MCwgeToxNTB9LCB7eDoyMDAsIHk6MjUwfSwge3g6MjUwLCB5OjI1MH1dKTtcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPn0gcG9pbnRzIC0gYXJyYXkgb2YgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmFkZFBvaW50cyA9IGZ1bmN0aW9uKHBvaW50cykge1xuICAgIHRoaXMucG9pbnRzXyA9IHRoaXMucG9pbnRzXy5jb25jYXQocG9pbnRzKTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG5cbi8qKlxuICogVHJpYW5ndWxhdGUgdGhlIHBvbHlnb24gd2l0aCBob2xlcyBhbmQgU3RlaW5lciBwb2ludHMuXG4gKiBEbyB0aGlzIEFGVEVSIHlvdSd2ZSBhZGRlZCB0aGUgcG9seWxpbmUsIGhvbGVzLCBhbmQgU3RlaW5lciBwb2ludHNcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqIEBwdWJsaWNcbiAqL1xuLy8gU2hvcnRjdXQgbWV0aG9kIGZvciBzd2VlcC50cmlhbmd1bGF0ZShTd2VlcENvbnRleHQpLlxuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnRyaWFuZ3VsYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgc3dlZXAudHJpYW5ndWxhdGUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuXG4vKipcbiAqIEdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBwcm92aWRlZCBjb25zdHJhaW50cyAoY29udG91ciwgaG9sZXMgYW5kIFxuICogU3RlaW50ZXIgcG9pbnRzKS4gV2FybmluZyA6IHRoZXNlIHZhbHVlcyBhcmUgbm90IGF2YWlsYWJsZSBpZiB0aGUgdHJpYW5ndWxhdGlvbiBcbiAqIGhhcyBub3QgYmVlbiBkb25lIHlldC5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHt7bWluOlBvaW50LG1heDpQb2ludH19IG9iamVjdCB3aXRoICdtaW4nIGFuZCAnbWF4JyBQb2ludFxuICovXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0Qm91bmRpbmdCb3ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge21pbjogdGhpcy5wbWluXywgbWF4OiB0aGlzLnBtYXhffTtcbn07XG5cbi8qKlxuICogR2V0IHJlc3VsdCBvZiB0cmlhbmd1bGF0aW9uLlxuICogVGhlIG91dHB1dCB0cmlhbmdsZXMgaGF2ZSB2ZXJ0aWNlcyB3aGljaCBhcmUgcmVmZXJlbmNlc1xuICogdG8gdGhlIGluaXRpYWwgaW5wdXQgcG9pbnRzIChub3QgY29waWVzKTogYW55IGN1c3RvbSBmaWVsZHMgaW4gdGhlXG4gKiBpbml0aWFsIHBvaW50cyBjYW4gYmUgcmV0cmlldmVkIGluIHRoZSBvdXRwdXQgdHJpYW5nbGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHgudHJpYW5ndWxhdGUoKTtcbiAqICAgICAgdmFyIHRyaWFuZ2xlcyA9IHN3Y3R4LmdldFRyaWFuZ2xlcygpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIGNvbnRvdXIgPSBbe3g6MTAwLCB5OjEwMCwgaWQ6MX0sIHt4OjEwMCwgeTozMDAsIGlkOjJ9LCB7eDozMDAsIHk6MzAwLCBpZDozfV07XG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqICAgICAgdHlwZW9mIHRyaWFuZ2xlc1swXS5nZXRQb2ludCgwKS5pZFxuICogICAgICAvLyDihpIgXCJudW1iZXJcIlxuICogQHB1YmxpY1xuICogQHJldHVybnMge2FycmF5PFRyaWFuZ2xlPn0gICBhcnJheSBvZiB0cmlhbmdsZXNcbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5nZXRUcmlhbmdsZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50cmlhbmdsZXNfO1xufTtcblxuLyoqXG4gKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICogQGZ1bmN0aW9uXG4gKiBAZGVwcmVjYXRlZCB1c2Uge0BsaW5rY29kZSBTd2VlcENvbnRleHQjZ2V0VHJpYW5nbGVzfSBpbnN0ZWFkXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuR2V0VHJpYW5nbGVzID0gU3dlZXBDb250ZXh0LnByb3RvdHlwZS5nZXRUcmlhbmdsZXM7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tU3dlZXBDb250ZXh0IChwcml2YXRlIEFQSSlcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmZyb250ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbnRfO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnBvaW50Q291bnQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfLmxlbmd0aDtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5oZWFkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVhZF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuc2V0SGVhZCA9IGZ1bmN0aW9uKHAxKSB7XG4gICAgdGhpcy5oZWFkXyA9IHAxO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnRhaWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50YWlsXztcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5zZXRUYWlsID0gZnVuY3Rpb24ocDEpIHtcbiAgICB0aGlzLnRhaWxfID0gcDE7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwXztcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5pbml0VHJpYW5ndWxhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB4bWF4ID0gdGhpcy5wb2ludHNfWzBdLng7XG4gICAgdmFyIHhtaW4gPSB0aGlzLnBvaW50c19bMF0ueDtcbiAgICB2YXIgeW1heCA9IHRoaXMucG9pbnRzX1swXS55O1xuICAgIHZhciB5bWluID0gdGhpcy5wb2ludHNfWzBdLnk7XG5cbiAgICAvLyBDYWxjdWxhdGUgYm91bmRzXG4gICAgdmFyIGksIGxlbiA9IHRoaXMucG9pbnRzXy5sZW5ndGg7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciBwID0gdGhpcy5wb2ludHNfW2ldO1xuICAgICAgICAvKiBqc2hpbnQgZXhwcjp0cnVlICovXG4gICAgICAgIChwLnggPiB4bWF4KSAmJiAoeG1heCA9IHAueCk7XG4gICAgICAgIChwLnggPCB4bWluKSAmJiAoeG1pbiA9IHAueCk7XG4gICAgICAgIChwLnkgPiB5bWF4KSAmJiAoeW1heCA9IHAueSk7XG4gICAgICAgIChwLnkgPCB5bWluKSAmJiAoeW1pbiA9IHAueSk7XG4gICAgfVxuICAgIHRoaXMucG1pbl8gPSBuZXcgUG9pbnQoeG1pbiwgeW1pbik7XG4gICAgdGhpcy5wbWF4XyA9IG5ldyBQb2ludCh4bWF4LCB5bWF4KTtcblxuICAgIHZhciBkeCA9IGtBbHBoYSAqICh4bWF4IC0geG1pbik7XG4gICAgdmFyIGR5ID0ga0FscGhhICogKHltYXggLSB5bWluKTtcbiAgICB0aGlzLmhlYWRfID0gbmV3IFBvaW50KHhtYXggKyBkeCwgeW1pbiAtIGR5KTtcbiAgICB0aGlzLnRhaWxfID0gbmV3IFBvaW50KHhtaW4gLSBkeCwgeW1pbiAtIGR5KTtcblxuICAgIC8vIFNvcnQgcG9pbnRzIGFsb25nIHktYXhpc1xuICAgIHRoaXMucG9pbnRzXy5zb3J0KFBvaW50LmNvbXBhcmUpO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmluaXRFZGdlcyA9IGZ1bmN0aW9uKHBvbHlsaW5lKSB7XG4gICAgdmFyIGksIGxlbiA9IHBvbHlsaW5lLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdGhpcy5lZGdlX2xpc3QucHVzaChuZXcgRWRnZShwb2x5bGluZVtpXSwgcG9seWxpbmVbKGkgKyAxKSAlIGxlbl0pKTtcbiAgICB9XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0UG9pbnQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50c19baW5kZXhdO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmFkZFRvTWFwID0gZnVuY3Rpb24odHJpYW5nbGUpIHtcbiAgICB0aGlzLm1hcF8ucHVzaCh0cmlhbmdsZSk7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUubG9jYXRlTm9kZSA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbnRfLmxvY2F0ZU5vZGUocG9pbnQueCk7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuY3JlYXRlQWR2YW5jaW5nRnJvbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaGVhZDtcbiAgICB2YXIgbWlkZGxlO1xuICAgIHZhciB0YWlsO1xuICAgIC8vIEluaXRpYWwgdHJpYW5nbGVcbiAgICB2YXIgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUodGhpcy5wb2ludHNfWzBdLCB0aGlzLnRhaWxfLCB0aGlzLmhlYWRfKTtcblxuICAgIHRoaXMubWFwXy5wdXNoKHRyaWFuZ2xlKTtcblxuICAgIGhlYWQgPSBuZXcgTm9kZSh0cmlhbmdsZS5nZXRQb2ludCgxKSwgdHJpYW5nbGUpO1xuICAgIG1pZGRsZSA9IG5ldyBOb2RlKHRyaWFuZ2xlLmdldFBvaW50KDApLCB0cmlhbmdsZSk7XG4gICAgdGFpbCA9IG5ldyBOb2RlKHRyaWFuZ2xlLmdldFBvaW50KDIpKTtcblxuICAgIHRoaXMuZnJvbnRfID0gbmV3IEFkdmFuY2luZ0Zyb250KGhlYWQsIHRhaWwpO1xuXG4gICAgaGVhZC5uZXh0ID0gbWlkZGxlO1xuICAgIG1pZGRsZS5uZXh0ID0gdGFpbDtcbiAgICBtaWRkbGUucHJldiA9IGhlYWQ7XG4gICAgdGFpbC5wcmV2ID0gbWlkZGxlO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnJlbW92ZU5vZGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICAgIC8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5tYXBUcmlhbmdsZVRvTm9kZXMgPSBmdW5jdGlvbih0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyArK2kpIHtcbiAgICAgICAgaWYgKCF0LmdldE5laWdoYm9yKGkpKSB7XG4gICAgICAgICAgICB2YXIgbiA9IHRoaXMuZnJvbnRfLmxvY2F0ZVBvaW50KHQucG9pbnRDVyh0LmdldFBvaW50KGkpKSk7XG4gICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgIG4udHJpYW5nbGUgPSB0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnJlbW92ZUZyb21NYXAgPSBmdW5jdGlvbih0cmlhbmdsZSkge1xuICAgIHZhciBpLCBtYXAgPSB0aGlzLm1hcF8sIGxlbiA9IG1hcC5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChtYXBbaV0gPT09IHRyaWFuZ2xlKSB7XG4gICAgICAgICAgICBtYXAuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIERvIGEgZGVwdGggZmlyc3QgdHJhdmVyc2FsIHRvIGNvbGxlY3QgdHJpYW5nbGVzXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtUcmlhbmdsZX0gdHJpYW5nbGUgc3RhcnRcbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5tZXNoQ2xlYW4gPSBmdW5jdGlvbih0cmlhbmdsZSkge1xuICAgIC8vIE5ldyBpbXBsZW1lbnRhdGlvbiBhdm9pZHMgcmVjdXJzaXZlIGNhbGxzIGFuZCB1c2UgYSBsb29wIGluc3RlYWQuXG4gICAgLy8gQ2YuIGlzc3VlcyAjIDU3LCA2NSBhbmQgNjkuXG4gICAgdmFyIHRyaWFuZ2xlcyA9IFt0cmlhbmdsZV0sIHQsIGk7XG4gICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgIHdoaWxlICh0ID0gdHJpYW5nbGVzLnBvcCgpKSB7XG4gICAgICAgIGlmICghdC5pc0ludGVyaW9yKCkpIHtcbiAgICAgICAgICAgIHQuc2V0SW50ZXJpb3IodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnRyaWFuZ2xlc18ucHVzaCh0KTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoIXQuY29uc3RyYWluZWRfZWRnZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICB0cmlhbmdsZXMucHVzaCh0LmdldE5laWdoYm9yKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN3ZWVwQ29udGV4dDtcblxufSx7XCIuL2FkdmFuY2luZ2Zyb250XCI6MixcIi4vcG9pbnRcIjo0LFwiLi9wb2ludGVycm9yXCI6NSxcIi4vc3dlZXBcIjo3LFwiLi90cmlhbmdsZVwiOjl9XSw5OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cbi8qIGpzaGludCBtYXhjb21wbGV4aXR5OjEwICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cbnZhciB4eSA9IF9kZXJlcV8oXCIuL3h5XCIpO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVRyaWFuZ2xlXG4vKipcbiAqIFRyaWFuZ2xlIGNsYXNzLjxicj5cbiAqIFRyaWFuZ2xlLWJhc2VkIGRhdGEgc3RydWN0dXJlcyBhcmUga25vd24gdG8gaGF2ZSBiZXR0ZXIgcGVyZm9ybWFuY2UgdGhhblxuICogcXVhZC1lZGdlIHN0cnVjdHVyZXMuXG4gKiBTZWU6IEouIFNoZXdjaHVrLCBcIlRyaWFuZ2xlOiBFbmdpbmVlcmluZyBhIDJEIFF1YWxpdHkgTWVzaCBHZW5lcmF0b3IgYW5kXG4gKiBEZWxhdW5heSBUcmlhbmd1bGF0b3JcIiwgXCJUcmlhbmd1bGF0aW9ucyBpbiBDR0FMXCJcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7IVhZfSBwYSAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYiAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBwYyAgcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xudmFyIFRyaWFuZ2xlID0gZnVuY3Rpb24oYSwgYiwgYykge1xuICAgIC8qKlxuICAgICAqIFRyaWFuZ2xlIHBvaW50c1xuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5LjxYWT59XG4gICAgICovXG4gICAgdGhpcy5wb2ludHNfID0gW2EsIGIsIGNdO1xuXG4gICAgLyoqXG4gICAgICogTmVpZ2hib3IgbGlzdFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5LjxUcmlhbmdsZT59XG4gICAgICovXG4gICAgdGhpcy5uZWlnaGJvcnNfID0gW251bGwsIG51bGwsIG51bGxdO1xuXG4gICAgLyoqXG4gICAgICogSGFzIHRoaXMgdHJpYW5nbGUgYmVlbiBtYXJrZWQgYXMgYW4gaW50ZXJpb3IgdHJpYW5nbGU/XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmludGVyaW9yXyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogRmxhZ3MgdG8gZGV0ZXJtaW5lIGlmIGFuIGVkZ2UgaXMgYSBDb25zdHJhaW5lZCBlZGdlXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QXJyYXkuPGJvb2xlYW4+fVxuICAgICAqL1xuICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZSA9IFtmYWxzZSwgZmFsc2UsIGZhbHNlXTtcblxuICAgIC8qKlxuICAgICAqIEZsYWdzIHRvIGRldGVybWluZSBpZiBhbiBlZGdlIGlzIGEgRGVsYXVuZXkgZWRnZVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5Ljxib29sZWFuPn1cbiAgICAgKi9cbiAgICB0aGlzLmRlbGF1bmF5X2VkZ2UgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XG59O1xuXG52YXIgcDJzID0geHkudG9TdHJpbmc7XG4vKipcbiAqIEZvciBwcmV0dHkgcHJpbnRpbmcgZXguIDxjb2RlPlwiWyg1OzQyKSgxMDsyMCkoMjE7MzApXVwiPC9jb2RlPi5cbiAqIEBwdWJsaWNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcIltcIiArIHAycyh0aGlzLnBvaW50c19bMF0pICsgcDJzKHRoaXMucG9pbnRzX1sxXSkgKyBwMnModGhpcy5wb2ludHNfWzJdKSArIFwiXVwiKTtcbn07XG5cbi8qKlxuICogR2V0IG9uZSB2ZXJ0aWNlIG9mIHRoZSB0cmlhbmdsZS5cbiAqIFRoZSBvdXRwdXQgdHJpYW5nbGVzIG9mIGEgdHJpYW5ndWxhdGlvbiBoYXZlIHZlcnRpY2VzIHdoaWNoIGFyZSByZWZlcmVuY2VzXG4gKiB0byB0aGUgaW5pdGlhbCBpbnB1dCBwb2ludHMgKG5vdCBjb3BpZXMpOiBhbnkgY3VzdG9tIGZpZWxkcyBpbiB0aGVcbiAqIGluaXRpYWwgcG9pbnRzIGNhbiBiZSByZXRyaWV2ZWQgaW4gdGhlIG91dHB1dCB0cmlhbmdsZXMuXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgY29udG91ciA9IFt7eDoxMDAsIHk6MTAwLCBpZDoxfSwge3g6MTAwLCB5OjMwMCwgaWQ6Mn0sIHt4OjMwMCwgeTozMDAsIGlkOjN9XTtcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHgudHJpYW5ndWxhdGUoKTtcbiAqICAgICAgdmFyIHRyaWFuZ2xlcyA9IHN3Y3R4LmdldFRyaWFuZ2xlcygpO1xuICogICAgICB0eXBlb2YgdHJpYW5nbGVzWzBdLmdldFBvaW50KDApLmlkXG4gKiAgICAgIC8vIOKGkiBcIm51bWJlclwiXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSB2ZXJ0aWNlIGluZGV4OiAwLCAxIG9yIDJcbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHtYWX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmdldFBvaW50ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfW2luZGV4XTtcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgVHJpYW5nbGUjZ2V0UG9pbnR9IGluc3RlYWRcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLkdldFBvaW50ID0gVHJpYW5nbGUucHJvdG90eXBlLmdldFBvaW50O1xuXG4vKipcbiAqIEdldCBhbGwgMyB2ZXJ0aWNlcyBvZiB0aGUgdHJpYW5nbGUgYXMgYW4gYXJyYXlcbiAqIEBwdWJsaWNcbiAqIEByZXR1cm4ge0FycmF5LjxYWT59XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuVHJpYW5nbGUucHJvdG90eXBlLmdldFBvaW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50c187XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAqIEByZXR1cm5zIHs/VHJpYW5nbGV9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXROZWlnaGJvciA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1tpbmRleF07XG59O1xuXG4vKipcbiAqIFRlc3QgaWYgdGhpcyBUcmlhbmdsZSBjb250YWlucyB0aGUgUG9pbnQgb2JqZWN0IGdpdmVuIGFzIHBhcmFtZXRlciBhcyBvbmUgb2YgaXRzIHZlcnRpY2VzLlxuICogT25seSBwb2ludCByZWZlcmVuY2VzIGFyZSBjb21wYXJlZCwgbm90IHZhbHVlcy5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7WFl9IHBvaW50IC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPlRydWU8L2NvZGU+IGlmIHRoZSBQb2ludCBvYmplY3QgaXMgb2YgdGhlIFRyaWFuZ2xlJ3MgdmVydGljZXMsXG4gKiAgICAgICAgIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5jb250YWluc1BvaW50ID0gZnVuY3Rpb24ocG9pbnQpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgcmV0dXJuIChwb2ludCA9PT0gcG9pbnRzWzBdIHx8IHBvaW50ID09PSBwb2ludHNbMV0gfHwgcG9pbnQgPT09IHBvaW50c1syXSk7XG59O1xuXG4vKipcbiAqIFRlc3QgaWYgdGhpcyBUcmlhbmdsZSBjb250YWlucyB0aGUgRWRnZSBvYmplY3QgZ2l2ZW4gYXMgcGFyYW1ldGVyIGFzIGl0c1xuICogYm91bmRpbmcgZWRnZXMuIE9ubHkgcG9pbnQgcmVmZXJlbmNlcyBhcmUgY29tcGFyZWQsIG5vdCB2YWx1ZXMuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtFZGdlfSBlZGdlXG4gKiBAcmV0dXJuIHtib29sZWFufSA8Y29kZT5UcnVlPC9jb2RlPiBpZiB0aGUgRWRnZSBvYmplY3QgaXMgb2YgdGhlIFRyaWFuZ2xlJ3MgYm91bmRpbmdcbiAqICAgICAgICAgZWRnZXMsIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5jb250YWluc0VkZ2UgPSBmdW5jdGlvbihlZGdlKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGFpbnNQb2ludChlZGdlLnApICYmIHRoaXMuY29udGFpbnNQb2ludChlZGdlLnEpO1xufTtcblxuLyoqXG4gKiBUZXN0IGlmIHRoaXMgVHJpYW5nbGUgY29udGFpbnMgdGhlIHR3byBQb2ludCBvYmplY3RzIGdpdmVuIGFzIHBhcmFtZXRlcnMgYW1vbmcgaXRzIHZlcnRpY2VzLlxuICogT25seSBwb2ludCByZWZlcmVuY2VzIGFyZSBjb21wYXJlZCwgbm90IHZhbHVlcy5cbiAqIEBwYXJhbSB7WFl9IHAxIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHAyIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5jb250YWluc1BvaW50cyA9IGZ1bmN0aW9uKHAxLCBwMikge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zUG9pbnQocDEpICYmIHRoaXMuY29udGFpbnNQb2ludChwMik7XG59O1xuXG4vKipcbiAqIEhhcyB0aGlzIHRyaWFuZ2xlIGJlZW4gbWFya2VkIGFzIGFuIGludGVyaW9yIHRyaWFuZ2xlP1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5pc0ludGVyaW9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJpb3JfO1xufTtcblxuLyoqXG4gKiBNYXJrIHRoaXMgdHJpYW5nbGUgYXMgYW4gaW50ZXJpb3IgdHJpYW5nbGVcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGludGVyaW9yXG4gKiBAcmV0dXJucyB7VHJpYW5nbGV9IHRoaXNcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLnNldEludGVyaW9yID0gZnVuY3Rpb24oaW50ZXJpb3IpIHtcbiAgICB0aGlzLmludGVyaW9yXyA9IGludGVyaW9yO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgbmVpZ2hib3IgcG9pbnRlcnMuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcDEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtYWX0gcDIgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtUcmlhbmdsZX0gdCBUcmlhbmdsZSBvYmplY3QuXG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgY2FuJ3QgZmluZCBvYmplY3RzXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrTmVpZ2hib3JQb2ludGVycyA9IGZ1bmN0aW9uKHAxLCBwMiwgdCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAoKHAxID09PSBwb2ludHNbMl0gJiYgcDIgPT09IHBvaW50c1sxXSkgfHwgKHAxID09PSBwb2ludHNbMV0gJiYgcDIgPT09IHBvaW50c1syXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzBdID0gdDtcbiAgICB9IGVsc2UgaWYgKChwMSA9PT0gcG9pbnRzWzBdICYmIHAyID09PSBwb2ludHNbMl0pIHx8IChwMSA9PT0gcG9pbnRzWzJdICYmIHAyID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1sxXSA9IHQ7XG4gICAgfSBlbHNlIGlmICgocDEgPT09IHBvaW50c1swXSAmJiBwMiA9PT0gcG9pbnRzWzFdKSB8fCAocDEgPT09IHBvaW50c1sxXSAmJiBwMiA9PT0gcG9pbnRzWzBdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMl0gPSB0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5tYXJrTmVpZ2hib3JQb2ludGVycygpIGNhbGwnKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEV4aGF1c3RpdmUgc2VhcmNoIHRvIHVwZGF0ZSBuZWlnaGJvciBwb2ludGVyc1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVRyaWFuZ2xlfSB0XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrTmVpZ2hib3IgPSBmdW5jdGlvbih0KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICBpZiAodC5jb250YWluc1BvaW50cyhwb2ludHNbMV0sIHBvaW50c1syXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzBdID0gdDtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3JQb2ludGVycyhwb2ludHNbMV0sIHBvaW50c1syXSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh0LmNvbnRhaW5zUG9pbnRzKHBvaW50c1swXSwgcG9pbnRzWzJdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMV0gPSB0O1xuICAgICAgICB0Lm1hcmtOZWlnaGJvclBvaW50ZXJzKHBvaW50c1swXSwgcG9pbnRzWzJdLCB0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHQuY29udGFpbnNQb2ludHMocG9pbnRzWzBdLCBwb2ludHNbMV0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1syXSA9IHQ7XG4gICAgICAgIHQubWFya05laWdoYm9yUG9pbnRlcnMocG9pbnRzWzBdLCBwb2ludHNbMV0sIHRoaXMpO1xuICAgIH1cbn07XG5cblxuVHJpYW5nbGUucHJvdG90eXBlLmNsZWFyTmVpZ2hib3JzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5uZWlnaGJvcnNfWzBdID0gbnVsbDtcbiAgICB0aGlzLm5laWdoYm9yc19bMV0gPSBudWxsO1xuICAgIHRoaXMubmVpZ2hib3JzX1syXSA9IG51bGw7XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuY2xlYXJEZWxhdW5heUVkZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5kZWxhdW5heV9lZGdlWzBdID0gZmFsc2U7XG4gICAgdGhpcy5kZWxhdW5heV9lZGdlWzFdID0gZmFsc2U7XG4gICAgdGhpcy5kZWxhdW5heV9lZGdlWzJdID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHBvaW50IGNsb2Nrd2lzZSB0byB0aGUgZ2l2ZW4gcG9pbnQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5wb2ludENXID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMl07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1swXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1syXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9pbnQgY291bnRlci1jbG9ja3dpc2UgdG8gdGhlIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUucG9pbnRDQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1sxXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1sxXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZWlnaGJvciBjbG9ja3dpc2UgdG8gZ2l2ZW4gcG9pbnQuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5uZWlnaGJvckNXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzFdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1swXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG5laWdoYm9yIGNvdW50ZXItY2xvY2t3aXNlIHRvIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubmVpZ2hib3JDQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMl07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzFdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRDb25zdHJhaW5lZEVkZ2VDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF07XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmdldENvbnN0cmFpbmVkRWRnZUNDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV07XG4gICAgfVxufTtcblxuLy8gQWRkaXRpb25hbCBjaGVjayBmcm9tIEphdmEgdmVyc2lvbiAoc2VlIGlzc3VlICM4OClcblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRDb25zdHJhaW5lZEVkZ2VBY3Jvc3MgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXRDb25zdHJhaW5lZEVkZ2VDVyA9IGZ1bmN0aW9uKHAsIGNlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXSA9IGNlO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXSA9IGNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXSA9IGNlO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cgPSBmdW5jdGlvbihwLCBjZSkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl0gPSBjZTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF0gPSBjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV0gPSBjZTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0RGVsYXVuYXlFZGdlQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMV07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzBdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXREZWxhdW5heUVkZ2VDQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMl07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzFdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXREZWxhdW5heUVkZ2VDVyA9IGZ1bmN0aW9uKHAsIGUpIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzFdID0gZTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMl0gPSBlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVswXSA9IGU7XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLnNldERlbGF1bmF5RWRnZUNDVyA9IGZ1bmN0aW9uKHAsIGUpIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzJdID0gZTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMF0gPSBlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsxXSA9IGU7XG4gICAgfVxufTtcblxuLyoqXG4gKiBUaGUgbmVpZ2hib3IgYWNyb3NzIHRvIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge1RyaWFuZ2xlfVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubmVpZ2hib3JBY3Jvc3MgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMF07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzJdO1xuICAgIH1cbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7IVRyaWFuZ2xlfSB0IFRyaWFuZ2xlIG9iamVjdC5cbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUub3Bwb3NpdGVQb2ludCA9IGZ1bmN0aW9uKHQsIHApIHtcbiAgICB2YXIgY3cgPSB0LnBvaW50Q1cocCk7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRDVyhjdyk7XG59O1xuXG4vKipcbiAqIExlZ2FsaXplIHRyaWFuZ2xlIGJ5IHJvdGF0aW5nIGNsb2Nrd2lzZSBhcm91bmQgb1BvaW50XG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gb3BvaW50IC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IG5wb2ludCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAdGhyb3dzIHtFcnJvcn0gaWYgb1BvaW50IGNhbiBub3QgYmUgZm91bmRcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmxlZ2FsaXplID0gZnVuY3Rpb24ob3BvaW50LCBucG9pbnQpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKG9wb2ludCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHBvaW50c1sxXSA9IHBvaW50c1swXTtcbiAgICAgICAgcG9pbnRzWzBdID0gcG9pbnRzWzJdO1xuICAgICAgICBwb2ludHNbMl0gPSBucG9pbnQ7XG4gICAgfSBlbHNlIGlmIChvcG9pbnQgPT09IHBvaW50c1sxXSkge1xuICAgICAgICBwb2ludHNbMl0gPSBwb2ludHNbMV07XG4gICAgICAgIHBvaW50c1sxXSA9IHBvaW50c1swXTtcbiAgICAgICAgcG9pbnRzWzBdID0gbnBvaW50O1xuICAgIH0gZWxzZSBpZiAob3BvaW50ID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgcG9pbnRzWzBdID0gcG9pbnRzWzJdO1xuICAgICAgICBwb2ludHNbMl0gPSBwb2ludHNbMV07XG4gICAgICAgIHBvaW50c1sxXSA9IG5wb2ludDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgVHJpYW5nbGUubGVnYWxpemUoKSBjYWxsJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBpbmRleCBvZiBhIHBvaW50IGluIHRoZSB0cmlhbmdsZS4gXG4gKiBUaGUgcG9pbnQgKm11c3QqIGJlIGEgcmVmZXJlbmNlIHRvIG9uZSBvZiB0aGUgdHJpYW5nbGUncyB2ZXJ0aWNlcy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IDAsIDEgb3IgMlxuICogQHRocm93cyB7RXJyb3J9IGlmIHAgY2FuIG5vdCBiZSBmb3VuZFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuaW5kZXggPSBmdW5jdGlvbihwKSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgcmV0dXJuIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIFRyaWFuZ2xlLmluZGV4KCkgY2FsbCcpO1xuICAgIH1cbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAxIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHAyIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge251bWJlcn0gaW5kZXggMCwgMSBvciAyLCBvciAtMSBpZiBlcnJyb3JcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmVkZ2VJbmRleCA9IGZ1bmN0aW9uKHAxLCBwMikge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocDEgPT09IHBvaW50c1swXSkge1xuICAgICAgICBpZiAocDIgPT09IHBvaW50c1sxXSkge1xuICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgIH0gZWxzZSBpZiAocDIgPT09IHBvaW50c1syXSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHAxID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgaWYgKHAyID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9IGVsc2UgaWYgKHAyID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChwMSA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIGlmIChwMiA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSBlbHNlIGlmIChwMiA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59O1xuXG4vKipcbiAqIE1hcmsgYW4gZWRnZSBvZiB0aGlzIHRyaWFuZ2xlIGFzIGNvbnN0cmFpbmVkLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGVkZ2UgaW5kZXhcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUluZGV4ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbaW5kZXhdID0gdHJ1ZTtcbn07XG4vKipcbiAqIE1hcmsgYW4gZWRnZSBvZiB0aGlzIHRyaWFuZ2xlIGFzIGNvbnN0cmFpbmVkLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZSBpbnN0YW5jZVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5RWRnZSA9IGZ1bmN0aW9uKGVkZ2UpIHtcbiAgICB0aGlzLm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlZGdlLnAsIGVkZ2UucSk7XG59O1xuLyoqXG4gKiBNYXJrIGFuIGVkZ2Ugb2YgdGhpcyB0cmlhbmdsZSBhcyBjb25zdHJhaW5lZC5cbiAqIFRoaXMgbWV0aG9kIHRha2VzIHR3byBQb2ludCBpbnN0YW5jZXMgZGVmaW5pbmcgdGhlIGVkZ2Ugb2YgdGhlIHRyaWFuZ2xlLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHtYWX0gcSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMgPSBmdW5jdGlvbihwLCBxKSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlcyAgICAgICAgXG4gICAgaWYgKChxID09PSBwb2ludHNbMF0gJiYgcCA9PT0gcG9pbnRzWzFdKSB8fCAocSA9PT0gcG9pbnRzWzFdICYmIHAgPT09IHBvaW50c1swXSkpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKChxID09PSBwb2ludHNbMF0gJiYgcCA9PT0gcG9pbnRzWzJdKSB8fCAocSA9PT0gcG9pbnRzWzJdICYmIHAgPT09IHBvaW50c1swXSkpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKChxID09PSBwb2ludHNbMV0gJiYgcCA9PT0gcG9pbnRzWzJdKSB8fCAocSA9PT0gcG9pbnRzWzJdICYmIHAgPT09IHBvaW50c1sxXSkpIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdID0gdHJ1ZTtcbiAgICB9XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHMgKHB1YmxpYyBBUEkpXG5cbm1vZHVsZS5leHBvcnRzID0gVHJpYW5nbGU7XG5cbn0se1wiLi94eVwiOjExfV0sMTA6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIFByZWNpc2lvbiB0byBkZXRlY3QgcmVwZWF0ZWQgb3IgY29sbGluZWFyIHBvaW50c1xuICogQHByaXZhdGVcbiAqIEBjb25zdCB7bnVtYmVyfVxuICogQGRlZmF1bHRcbiAqL1xudmFyIEVQU0lMT04gPSAxZS0xMjtcbmV4cG9ydHMuRVBTSUxPTiA9IEVQU0lMT047XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBlbnVtIHtudW1iZXJ9XG4gKiBAcmVhZG9ubHlcbiAqL1xudmFyIE9yaWVudGF0aW9uID0ge1xuICAgIFwiQ1dcIjogMSxcbiAgICBcIkNDV1wiOiAtMSxcbiAgICBcIkNPTExJTkVBUlwiOiAwXG59O1xuZXhwb3J0cy5PcmllbnRhdGlvbiA9IE9yaWVudGF0aW9uO1xuXG5cbi8qKlxuICogRm9ybXVsYSB0byBjYWxjdWxhdGUgc2lnbmVkIGFyZWE8YnI+XG4gKiBQb3NpdGl2ZSBpZiBDQ1c8YnI+XG4gKiBOZWdhdGl2ZSBpZiBDVzxicj5cbiAqIDAgaWYgY29sbGluZWFyPGJyPlxuICogPHByZT5cbiAqIEFbUDEsUDIsUDNdICA9ICAoeDEqeTIgLSB5MSp4MikgKyAoeDIqeTMgLSB5Mip4MykgKyAoeDMqeTEgLSB5Myp4MSlcbiAqICAgICAgICAgICAgICA9ICAoeDEteDMpKih5Mi15MykgLSAoeTEteTMpKih4Mi14MylcbiAqIDwvcHJlPlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFYWX0gcGEgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGIgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGMgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtPcmllbnRhdGlvbn1cbiAqL1xuZnVuY3Rpb24gb3JpZW50MmQocGEsIHBiLCBwYykge1xuICAgIHZhciBkZXRsZWZ0ID0gKHBhLnggLSBwYy54KSAqIChwYi55IC0gcGMueSk7XG4gICAgdmFyIGRldHJpZ2h0ID0gKHBhLnkgLSBwYy55KSAqIChwYi54IC0gcGMueCk7XG4gICAgdmFyIHZhbCA9IGRldGxlZnQgLSBkZXRyaWdodDtcbiAgICBpZiAodmFsID4gLShFUFNJTE9OKSAmJiB2YWwgPCAoRVBTSUxPTikpIHtcbiAgICAgICAgcmV0dXJuIE9yaWVudGF0aW9uLkNPTExJTkVBUjtcbiAgICB9IGVsc2UgaWYgKHZhbCA+IDApIHtcbiAgICAgICAgcmV0dXJuIE9yaWVudGF0aW9uLkNDVztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gT3JpZW50YXRpb24uQ1c7XG4gICAgfVxufVxuZXhwb3J0cy5vcmllbnQyZCA9IG9yaWVudDJkO1xuXG5cbi8qKlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFYWX0gcGEgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGIgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGMgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGQgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpblNjYW5BcmVhKHBhLCBwYiwgcGMsIHBkKSB7XG4gICAgdmFyIG9hZGIgPSAocGEueCAtIHBiLngpICogKHBkLnkgLSBwYi55KSAtIChwZC54IC0gcGIueCkgKiAocGEueSAtIHBiLnkpO1xuICAgIGlmIChvYWRiID49IC1FUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb2FkYyA9IChwYS54IC0gcGMueCkgKiAocGQueSAtIHBjLnkpIC0gKHBkLnggLSBwYy54KSAqIChwYS55IC0gcGMueSk7XG4gICAgaWYgKG9hZGMgPD0gRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5pblNjYW5BcmVhID0gaW5TY2FuQXJlYTtcblxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSBhbmdsZSBiZXR3ZWVuIChwYSxwYikgYW5kIChwYSxwYykgaXMgb2J0dXNlIGkuZS4gKGFuZ2xlID4gz4AvMiB8fCBhbmdsZSA8IC3PgC8yKVxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFYWX0gcGEgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGIgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGMgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGFuZ2xlIGlzIG9idHVzZVxuICovXG5mdW5jdGlvbiBpc0FuZ2xlT2J0dXNlKHBhLCBwYiwgcGMpIHtcbiAgICB2YXIgYXggPSBwYi54IC0gcGEueDtcbiAgICB2YXIgYXkgPSBwYi55IC0gcGEueTtcbiAgICB2YXIgYnggPSBwYy54IC0gcGEueDtcbiAgICB2YXIgYnkgPSBwYy55IC0gcGEueTtcbiAgICByZXR1cm4gKGF4ICogYnggKyBheSAqIGJ5KSA8IDA7XG59XG5leHBvcnRzLmlzQW5nbGVPYnR1c2UgPSBpc0FuZ2xlT2J0dXNlO1xuXG5cbn0se31dLDExOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBvcGVyYXRlIG9uIFwiUG9pbnRcIiBvciBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX0sXG4gKiBhcyBkZWZpbmVkIGJ5IHRoZSB7QGxpbmsgWFl9IHR5cGVcbiAqIChbZHVjayB0eXBpbmdde0BsaW5rIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRHVja190eXBpbmd9KS5cbiAqIEBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cblxuLyoqXG4gKiBwb2x5MnRyaS5qcyBzdXBwb3J0cyB1c2luZyBjdXN0b20gcG9pbnQgY2xhc3MgaW5zdGVhZCBvZiB7QGxpbmtjb2RlIFBvaW50fS5cbiAqIEFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCA8Y29kZT57eCwgeX08L2NvZGU+IGF0dHJpYnV0ZXMgaXMgc3VwcG9ydGVkXG4gKiB0byBpbml0aWFsaXplIHRoZSBTd2VlcENvbnRleHQgcG9seWxpbmVzIGFuZCBwb2ludHNcbiAqIChbZHVjayB0eXBpbmdde0BsaW5rIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRHVja190eXBpbmd9KS5cbiAqXG4gKiBwb2x5MnRyaS5qcyBtaWdodCBhZGQgZXh0cmEgZmllbGRzIHRvIHRoZSBwb2ludCBvYmplY3RzIHdoZW4gY29tcHV0aW5nIHRoZVxuICogdHJpYW5ndWxhdGlvbiA6IHRoZXkgYXJlIHByZWZpeGVkIHdpdGggPGNvZGU+X3AydF88L2NvZGU+IHRvIGF2b2lkIGNvbGxpc2lvbnNcbiAqIHdpdGggZmllbGRzIGluIHRoZSBjdXN0b20gY2xhc3MuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIGNvbnRvdXIgPSBbe3g6MTAwLCB5OjEwMH0sIHt4OjEwMCwgeTozMDB9LCB7eDozMDAsIHk6MzAwfSwge3g6MzAwLCB5OjEwMH1dO1xuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFhZXG4gKiBAcHJvcGVydHkge251bWJlcn0geCAtIHggY29vcmRpbmF0ZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHkgLSB5IGNvb3JkaW5hdGVcbiAqL1xuXG5cbi8qKlxuICogUG9pbnQgcHJldHR5IHByaW50aW5nIDogcHJpbnRzIHggYW5kIHkgY29vcmRpbmF0ZXMuXG4gKiBAZXhhbXBsZVxuICogICAgICB4eS50b1N0cmluZ0Jhc2Uoe3g6NSwgeTo0Mn0pXG4gKiAgICAgIC8vIOKGkiBcIig1OzQyKVwiXG4gKiBAcHJvdGVjdGVkXG4gKiBAcGFyYW0geyFYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJucyB7c3RyaW5nfSA8Y29kZT5cIih4O3kpXCI8L2NvZGU+XG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nQmFzZShwKSB7XG4gICAgcmV0dXJuIChcIihcIiArIHAueCArIFwiO1wiICsgcC55ICsgXCIpXCIpO1xufVxuXG4vKipcbiAqIFBvaW50IHByZXR0eSBwcmludGluZy4gRGVsZWdhdGVzIHRvIHRoZSBwb2ludCdzIGN1c3RvbSBcInRvU3RyaW5nKClcIiBtZXRob2QgaWYgZXhpc3RzLFxuICogZWxzZSBzaW1wbHkgcHJpbnRzIHggYW5kIHkgY29vcmRpbmF0ZXMuXG4gKiBAZXhhbXBsZVxuICogICAgICB4eS50b1N0cmluZyh7eDo1LCB5OjQyfSlcbiAqICAgICAgLy8g4oaSIFwiKDU7NDIpXCJcbiAqIEBleGFtcGxlXG4gKiAgICAgIHh5LnRvU3RyaW5nKHt4OjUseTo0Mix0b1N0cmluZzpmdW5jdGlvbigpIHtyZXR1cm4gdGhpcy54K1wiOlwiK3RoaXMueTt9fSlcbiAqICAgICAgLy8g4oaSIFwiNTo0MlwiXG4gKiBAcGFyYW0geyFYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJucyB7c3RyaW5nfSA8Y29kZT5cIih4O3kpXCI8L2NvZGU+XG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHApIHtcbiAgICAvLyBUcnkgYSBjdXN0b20gdG9TdHJpbmcgZmlyc3QsIGFuZCBmYWxsYmFjayB0byBvd24gaW1wbGVtZW50YXRpb24gaWYgbm9uZVxuICAgIHZhciBzID0gcC50b1N0cmluZygpO1xuICAgIHJldHVybiAocyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyB0b1N0cmluZ0Jhc2UocCkgOiBzKTtcbn1cblxuXG4vKipcbiAqIENvbXBhcmUgdHdvIHBvaW50cyBjb21wb25lbnQtd2lzZS4gT3JkZXJlZCBieSB5IGF4aXMgZmlyc3QsIHRoZW4geCBheGlzLlxuICogQHBhcmFtIHshWFl9IGEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7bnVtYmVyfSA8Y29kZT4mbHQ7IDA8L2NvZGU+IGlmIDxjb2RlPmEgJmx0OyBiPC9jb2RlPixcbiAqICAgICAgICAgPGNvZGU+Jmd0OyAwPC9jb2RlPiBpZiA8Y29kZT5hICZndDsgYjwvY29kZT4sIFxuICogICAgICAgICA8Y29kZT4wPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgIGlmIChhLnkgPT09IGIueSkge1xuICAgICAgICByZXR1cm4gYS54IC0gYi54O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhLnkgLSBiLnk7XG4gICAgfVxufVxuXG4vKipcbiAqIFRlc3QgdHdvIFBvaW50IG9iamVjdHMgZm9yIGVxdWFsaXR5LlxuICogQHBhcmFtIHshWFl9IGEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn0gPGNvZGU+VHJ1ZTwvY29kZT4gaWYgPGNvZGU+YSA9PSBiPC9jb2RlPiwgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICByZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgdG9TdHJpbmc6IHRvU3RyaW5nLFxuICAgIHRvU3RyaW5nQmFzZTogdG9TdHJpbmdCYXNlLFxuICAgIGNvbXBhcmU6IGNvbXBhcmUsXG4gICAgZXF1YWxzOiBlcXVhbHNcbn07XG5cbn0se31dfSx7fSxbNl0pXG4oNilcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRNT1ZFX1RPOiAxLFxuXHRMSU5FX1RPOiAyLFxuXHRCRVpJRVJfVE86IDMsXG5cdFFVQURSQV9UTzogNCxcblx0QVJDOiA1LFxuXHRFTExJUFNFOiA2XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0ZGVmaW5pdGlvbjogMSxcblx0d29ybGRXaWR0aDogMTUwLFxuXHRtdWx0aUNhbnZhczogdHJ1ZSxcblx0d2luZDogNSxcblx0ZGVidWc6IGZhbHNlLFxuXHRncmF2aXR5OiBbMCwgLTkuOF0sXG5cdGdyb3Vwczpcblx0e1xuXHRcdGRlZmF1bHQ6IHsgZml4ZWQ6IHRydWUsIHBoeXNpY3M6IHsgYm9keVR5cGU6ICdnaG9zdCcgfSB9LFxuXHRcdGdob3N0OiB7IGZpeGVkOiB0cnVlLCBwaHlzaWNzOiB7IGJvZHlUeXBlOiAnZ2hvc3QnIH0gfSxcblx0XHRtZXRhbDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxMCxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0c3RvbmU6XG5cdFx0e1xuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0bWFzczogNSxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d29vZDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRiYWxsb29uOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDAuMDEsXG5cdFx0XHRcdGdyYXZpdHlTY2FsZTogLTE1LFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR0cmVlOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ3RyaWFuZ3VsYXRlJyxcblx0XHRcdG5vZGVSYWRpdXM6IDAuMSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGpvaW50czpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OiBudWxsLFxuXHRcdFx0XHRcdFx0bG9ja0NvbnN0cmFpbnQ6XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHN0aWZmbmVzczogMTAwMDAsXG5cdFx0XHRcdFx0XHRcdHJlbGF4YXRpb246IDAuOVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0bWFzczogNSxcblx0XHRcdFx0ZGFtcGluZzogMC44LFxuXHRcdFx0XHRzdHJ1Y3R1cmFsTWFzc0RlY2F5OiAzLFxuXHRcdFx0XHRib2R5VHlwZTogJ3NvZnQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRmbG9yYTpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICdsaW5lJyxcblx0XHRcdG5vZGVSYWRpdXM6IDAuMSxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGpvaW50czpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OiBudWxsLFxuXHRcdFx0XHRcdFx0bG9ja0NvbnN0cmFpbnQ6XG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHN0aWZmbmVzczogMTAwMCxcblx0XHRcdFx0XHRcdFx0cmVsYXhhdGlvbjogMVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0bWFzczogMC4xLFxuXHRcdFx0XHRzdHJ1Y3R1cmFsTWFzc0RlY2F5OiAzLFxuXHRcdFx0XHRib2R5VHlwZTogJ3NvZnQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRydWJiZXI6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAndHJpYW5ndWxhdGUnLFxuXHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0am9pbnRzOiB7XG5cdFx0XHRcdFx0ZGVmYXVsdDoge1xuXHRcdFx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRzdGlmZm5lc3M6IDEwMDAwMCxcblx0XHRcdFx0XHRcdFx0cmVsYXhhdGlvbjogMVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0bWFzczogMSxcblx0XHRcdFx0Ym9keVR5cGU6ICdzb2Z0J1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0amVsbHk6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAnaGV4YUZpbGwnLFxuXHRcdFx0aW5uZXJTdHJ1Y3R1cmVEZWY6IDAuMDEsXG5cdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRqb2ludHM6XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGRpc3RhbmNlQ29uc3RyYWludDpcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwMCxcblx0XHRcdFx0XHRcdFx0cmVsYXhhdGlvbjogMzBcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1hc3M6IDEsXG5cdFx0XHRcdGJvZHlUeXBlOiAnc29mdCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJvcGU6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAnbGluZScsXG5cdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRqb2ludHM6XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGRpc3RhbmNlQ29uc3RyYWludDpcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwLFxuXHRcdFx0XHRcdFx0XHRyZWxheGF0aW9uOiAxXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ3NvZnQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzdGF0aWM6XG5cdFx0e1xuXHRcdFx0Zml4ZWQ6IHRydWUsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRub0NvbGxpZGU6XG5cdFx0e1xuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0bWFzczogMSxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJyxcblx0XHRcdFx0bm9Db2xsaWRlOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRsZWF2ZXM6XG5cdFx0e1xuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0bWFzczogMC4wMDEsXG5cdFx0XHRcdGdyYXZpdHlTY2FsZTogMCxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJyxcblx0XHRcdFx0bm9Db2xsaWRlOiB0cnVlXG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRjb25zdHJhaW50czpcblx0e1xuXHRcdGRlZmF1bHQ6XG5cdFx0e1xuXHRcdFx0bG9ja0NvbnN0cmFpbnQ6IHt9XG5cdFx0fSxcblx0XHR3aXJlOlxuXHRcdHtcblx0XHRcdGRpc3RhbmNlQ29uc3RyYWludDpcblx0XHRcdHtcblx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwLFxuXHRcdFx0XHRyZWxheGF0aW9uOiAxXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJ2YXIgR3JpZCA9XG57XG5cdGluaXQ6IGZ1bmN0aW9uICgkZ3JhcGgpXG5cdHtcblx0XHR0aGlzLl9ncmFwaCA9ICRncmFwaDtcblx0XHR2YXIgbm9kZXNBcnJheSA9IHRoaXMuX25vZGVzQXJyYXkgPSBbXTtcblx0XHR0aGlzLl9ncmFwaC5mb3JFYWNoKGZ1bmN0aW9uICgkbGluZSlcblx0XHR7XG5cdFx0XHRpZiAoJGxpbmUpXG5cdFx0XHR7XG5cdFx0XHRcdCRsaW5lLmZvckVhY2goZnVuY3Rpb24gKCRub2RlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKCRub2RlKSB7IG5vZGVzQXJyYXkucHVzaCgkbm9kZSk7IH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Y3JlYXRlRnJvbVBvbHlnb246IGZ1bmN0aW9uICgkcG9seWdvbiwgJGRlZiwgJGhleGEpXG5cdHtcblx0XHR2YXIgYm91bmRpbmdCb3ggPSAkcG9seWdvbi5nZXRCb3VuZGluZ0JveCgpO1xuXG5cdFx0dmFyIGRlZiA9ICRkZWY7XG5cdFx0Ly92YXIgZGVmID0gd2lkdGggLyAkZGVmO1xuXHRcdHZhciB0b1JldHVybiA9IFtdO1xuXHRcdHZhciB5SW5jID0gJGhleGEgPyBkZWYgKiAoTWF0aC5zcXJ0KDMpIC8gMikgOiBkZWY7XG5cdFx0dmFyIGhhbGZEZWYgPSBkZWYgKiAwLjU7XG5cdFx0Zm9yICh2YXIgeVBvcyA9IGJvdW5kaW5nQm94WzBdWzFdOyB5UG9zIDw9IGJvdW5kaW5nQm94WzFdWzFdOyB5UG9zICs9IHlJbmMpXG5cdFx0e1xuXHRcdFx0dmFyIGxpbmUgPSBbXTtcblx0XHRcdC8vdmFyIGludGVyc2VjdGlvbnMgPSAkcG9seWdvbi5nZXRJbnRlcnNlY3Rpb25zQXRZKHlQb3MpO1xuXHRcdFx0dmFyIHhQb3MgPSBib3VuZGluZ0JveFswXVswXTtcblx0XHRcdHhQb3MgPSAoJGhleGEgJiYgdG9SZXR1cm4ubGVuZ3RoICUgMiAhPT0gMCkgPyB4UG9zICsgaGFsZkRlZiA6IHhQb3M7XG5cdFx0XHRmb3IgKHhQb3M7IHhQb3MgPD0gYm91bmRpbmdCb3hbMV1bMF0gKyBoYWxmRGVmOyB4UG9zICs9IGRlZilcblx0XHRcdHtcblx0XHRcdFx0aWYgKCRwb2x5Z29uLmlzSW5zaWRlKFt4UG9zLCB5UG9zXSkpIHsgbGluZS5wdXNoKFt4UG9zLCB5UG9zXSk7IH1cblx0XHRcdFx0ZWxzZSB7IGxpbmUucHVzaChudWxsKTsgfVxuXHRcdFx0fVxuXHRcdFx0dG9SZXR1cm4ucHVzaChsaW5lKTtcblx0XHR9XG5cdFx0cmV0dXJuIE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdCh0b1JldHVybik7XG5cdH0sXG5cblx0Z2V0R3JhcGg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2dyYXBoOyB9LFxuXG5cdGdldE5vZGVzQXJyYXk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX25vZGVzQXJyYXk7IH0sXG5cblx0Z2V0Q2xvc2VzdDogZnVuY3Rpb24gKCR4LCAkeSwgJHNpemUpXG5cdHtcblx0XHR2YXIgc2l6ZSA9ICRzaXplIHx8IDE7XG5cdFx0dmFyIGNsb3Nlc3QgPSB0aGlzLl9ub2Rlc0FycmF5LmNvbmNhdCgpO1xuXHRcdGNsb3Nlc3Quc29ydChmdW5jdGlvbiAoJGEsICRiKVxuXHRcdHtcblx0XHRcdGlmICgkYSA9PT0gbnVsbCB8fCAkYiA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0dmFyIHNpZGVYMSA9IE1hdGguYWJzKCRhWzBdIC0gJHgpO1xuXHRcdFx0dmFyIHNpZGVZMSA9IE1hdGguYWJzKCRhWzFdIC0gJHkpO1xuXHRcdFx0dmFyIGRpc3QxID0gTWF0aC5zcXJ0KHNpZGVYMSAqIHNpZGVYMSArIHNpZGVZMSAqIHNpZGVZMSk7XG5cblx0XHRcdHZhciBzaWRlWDIgPSBNYXRoLmFicygkYlswXSAtICR4KTtcblx0XHRcdHZhciBzaWRlWTIgPSBNYXRoLmFicygkYlsxXSAtICR5KTtcblx0XHRcdHZhciBkaXN0MiA9IE1hdGguc3FydChzaWRlWDIgKiBzaWRlWDIgKyBzaWRlWTIgKiBzaWRlWTIpO1xuXG5cdFx0XHRyZXR1cm4gZGlzdDEgLSBkaXN0Mjtcblx0XHR9KTtcblx0XHRyZXR1cm4gY2xvc2VzdC5zbGljZSgwLCBzaXplKTtcblx0fSxcblxuXHRnZXROZWlnaGJvdXJzOiBmdW5jdGlvbiAoJHgsICR5LCAkcmV0dXJuRW1wdHkpXG5cdHtcblx0XHR2YXIgdG9SZXR1cm4gPSBbXTtcblx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHR2YXIgZXZlbiA9ICR5ICUgMiA+IDA7XG5cdFx0dmFyIGxlZnQgPSBldmVuID8gJHggOiAkeCAtIDE7XG5cdFx0dmFyIHJpZ2h0ID0gZXZlbiA/ICR4ICsgMSA6ICR4O1xuXG5cdFx0dmFyIE5FID0gZ3JhcGhbJHkgLSAxXSAmJiBncmFwaFskeSAtIDFdW3JpZ2h0XSA/IGdyYXBoWyR5IC0gMV1bcmlnaHRdIDogbnVsbDtcblx0XHR2YXIgRSA9IGdyYXBoWyR5ICsgMF0gJiYgZ3JhcGhbJHkgKyAwXVskeCArIDFdID8gZ3JhcGhbJHldWyR4ICsgMV0gOiBudWxsO1xuXHRcdHZhciBTRSA9IGdyYXBoWyR5ICsgMV0gJiYgZ3JhcGhbJHkgKyAxXVtyaWdodF0gPyBncmFwaFskeSArIDFdW3JpZ2h0XSA6IG51bGw7XG5cdFx0dmFyIFNXID0gZ3JhcGhbJHkgKyAxXSAmJiBncmFwaFskeSArIDFdW2xlZnRdID8gZ3JhcGhbJHkgKyAxXVtsZWZ0XSA6IG51bGw7XG5cdFx0dmFyIFcgPSBncmFwaFskeSArIDBdICYmIGdyYXBoWyR5ICsgMF1bJHggLSAxXSA/IGdyYXBoWyR5XVskeCAtIDFdIDogbnVsbDtcblx0XHR2YXIgTlcgPSBncmFwaFskeSAtIDFdICYmIGdyYXBoWyR5IC0gMV1bbGVmdF0gPyBncmFwaFskeSAtIDFdW2xlZnRdIDogbnVsbDtcblxuXHRcdGlmIChORSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChORSk7IH1cblx0XHRpZiAoRSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChFKTsgfVxuXHRcdGlmIChTRSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChTRSk7IH1cblx0XHRpZiAoU1cgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goU1cpOyB9XG5cdFx0aWYgKFcgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goVyk7IH1cblx0XHRpZiAoTlcgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goTlcpOyB9XG5cblx0XHRyZXR1cm4gdG9SZXR1cm47XG5cdH0sXG5cblx0Z2V0TmV0d29yazogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBncmFwaCA9IHRoaXMuX2dyYXBoO1xuXHRcdHZhciBuZXR3b3JrID0gW107XG5cdFx0dmFyIHZpc2l0ZWQgPSBbXTtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJvd3NMZW5ndGggPSBncmFwaC5sZW5ndGg7XG5cdFx0Zm9yIChpOyBpIDwgcm93c0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBrID0gMDtcblx0XHRcdHZhciBwb2ludHNMZW5ndGggPSBncmFwaFtpXS5sZW5ndGg7XG5cdFx0XHRmb3IgKGs7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGN1cnJQb2ludCA9IGdyYXBoW2ldW2tdO1xuXHRcdFx0XHRpZiAoY3VyclBvaW50KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGN1cnJQb2ludE5laWdoYm91cnMgPSB0aGlzLmdldE5laWdoYm91cnMoaywgaSk7XG5cdFx0XHRcdFx0Zm9yICh2YXIgbSA9IDAsIG5laWdoYm91cnNMZW5ndGggPSBjdXJyUG9pbnROZWlnaGJvdXJzLmxlbmd0aDsgbSA8IG5laWdoYm91cnNMZW5ndGg7IG0gKz0gMSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YXIgY3Vyck5laWdoID0gY3VyclBvaW50TmVpZ2hib3Vyc1ttXTtcblx0XHRcdFx0XHRcdGlmIChjdXJyTmVpZ2ggJiYgdmlzaXRlZC5pbmRleE9mKGN1cnJOZWlnaCkgPT09IC0xKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuZXR3b3JrLnB1c2goW2N1cnJQb2ludCwgY3Vyck5laWdoXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZpc2l0ZWQucHVzaChjdXJyUG9pbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBuZXR3b3JrO1xuXHR9LFxuXG5cdGdldE91dGxpbmU6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHRpZiAoIXRoaXMub3V0bGluZSlcblx0XHR7XG5cdFx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHRcdHZhciBvdXRsaW5lR3JhcGggPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAwLCByb3dzTGVuZ3RoID0gZ3JhcGgubGVuZ3RoOyBpIDwgcm93c0xlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHRvdXRsaW5lR3JhcGhbaV0gPSBbXTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIHBvaW50c0xlbmd0aCA9IGdyYXBoW2ldLmxlbmd0aDsgayA8IHBvaW50c0xlbmd0aDsgayArPSAxKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIHBvaW50ID0gZ3JhcGhbaV1ba107XG5cdFx0XHRcdFx0b3V0bGluZUdyYXBoW2ldW2tdID0gbnVsbDtcblx0XHRcdFx0XHRpZiAocG9pbnQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIGlzRWRnZSA9IHRoaXMuZ2V0TmVpZ2hib3VycyhrLCBpKS5sZW5ndGggPCA2O1xuXHRcdFx0XHRcdFx0aWYgKGlzRWRnZSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0b3V0bGluZUdyYXBoW2ldW2tdID0gW2ssIGldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5vdXRsaW5lID0gT2JqZWN0LmNyZWF0ZShHcmlkKS5pbml0KG91dGxpbmVHcmFwaCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMub3V0bGluZTtcblx0fSxcblxuXHRnZXRTaGFwZVBhdGg6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgcGF0aCA9IFtdO1xuXHRcdHZhciBjdXJyZW50T3V0bGluZSA9IHRoaXMuZ2V0T3V0bGluZXMoKVswXTtcblx0XHR2YXIgb3V0bGluZUdyYXBoID0gY3VycmVudE91dGxpbmUuZ2V0R3JhcGgoKTtcblx0XHR2YXIgZ2V0U3RhcnRpbmdJbmRleCA9IGZ1bmN0aW9uICgpXG5cdFx0e1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG91dGxpbmVHcmFwaC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKCFvdXRsaW5lR3JhcGhbaV0pIHsgY29udGludWU7IH1cblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIHBvaW50c0xlbmd0aCA9IG91dGxpbmVHcmFwaFtpXS5sZW5ndGg7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyUG9pbnQgPSBvdXRsaW5lR3JhcGhbaV1ba107XG5cdFx0XHRcdFx0Ly8gaWYgKGN1cnJQb2ludClcblx0XHRcdFx0XHQvLyB7XG5cdFx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhjdXJyUG9pbnQsIGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0pKTtcblx0XHRcdFx0XHQvLyB9XG5cdFx0XHRcdFx0aWYgKGN1cnJQb2ludCAmJiBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKS5sZW5ndGggPT09IDIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGN1cnJQb2ludDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIHZpc2l0ZWQgPSBbXTtcblx0XHR2YXIgc3RhcnRpbmdJbmRleCA9IGdldFN0YXJ0aW5nSW5kZXguY2FsbCh0aGlzKTtcblx0XHRpZiAoIXN0YXJ0aW5nSW5kZXgpIHsgcmV0dXJuOyB9XG5cblx0XHR2YXIgZ2V0QW5nbGUgPSBmdW5jdGlvbiAoJGluZGV4KVxuXHRcdHtcblx0XHRcdHZhciBhbmdsZSA9ICgkaW5kZXggKyAxKSAqIDYwO1xuXHRcdFx0YW5nbGUgPSBhbmdsZSA9PT0gMCA/IDM2MCA6IGFuZ2xlO1xuXHRcdFx0cmV0dXJuIGFuZ2xlO1xuXHRcdH07XG5cdFx0dmFyIGdldE5laWdoYm91ckluZGV4ID0gZnVuY3Rpb24gKCRwb2ludCwgJG5laWdoYm91cilcblx0XHR7XG5cdFx0XHRyZXR1cm4gY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycygkcG9pbnRbMF0sICRwb2ludFsxXSwgdHJ1ZSkuaW5kZXhPZigkbmVpZ2hib3VyKTtcblx0XHR9O1xuXG5cdFx0dmFyIG5leHQgPSBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKHN0YXJ0aW5nSW5kZXhbMF0sIHN0YXJ0aW5nSW5kZXhbMV0pWzBdO1xuXHRcdHZhciBsYXN0QW5nbGUgPSBnZXRBbmdsZShnZXROZWlnaGJvdXJJbmRleChzdGFydGluZ0luZGV4LCBuZXh0KSk7XG5cdFx0dmFyIGN1cnJJbmRleCA9IG5leHQ7XG5cdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW3N0YXJ0aW5nSW5kZXhbMV1dW3N0YXJ0aW5nSW5kZXhbMF1dKTtcblx0XHRwYXRoLnB1c2godGhpcy5fZ3JhcGhbbmV4dFsxXV1bbmV4dFswXV0pO1xuXHRcdHZpc2l0ZWQucHVzaChzdGFydGluZ0luZGV4KTtcblxuXHRcdHZhciBiZXN0O1xuXHRcdHZhciBuZWlnaGJvdXJzO1xuXHRcdHZhciBiZXN0QW5nbGU7XG5cdFx0dmFyIG91dGxpbmVOb2Rlc0FycmF5ID0gY3VycmVudE91dGxpbmUuZ2V0Tm9kZXNBcnJheSgpO1xuXHRcdHZhciBvdXRsaW5lUG9pbnRzTGVuZ3RoID0gb3V0bGluZU5vZGVzQXJyYXkubGVuZ3RoO1xuXG5cdFx0d2hpbGUgKHZpc2l0ZWQubGVuZ3RoIDwgb3V0bGluZVBvaW50c0xlbmd0aCAtIDEpLy9jdXJySW5kZXggIT09IHN0YXJ0aW5nSW5kZXgpXG5cdFx0e1xuXHRcdFx0bmVpZ2hib3VycyA9IGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoY3VyckluZGV4WzBdLCBjdXJySW5kZXhbMV0pO1xuXHRcdFx0dmFyIGJlc3RTY29yZSA9IDA7XG5cdFx0XHRiZXN0ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbmVpZ2hib3Vycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGN1cnJOZWlnaCA9IG5laWdoYm91cnNbaV07XG5cdFx0XHRcdHZhciBjdXJyU2NvcmUgPSAwO1xuXHRcdFx0XHR2YXIgY3VyckFuZ2xlID0gZ2V0QW5nbGUoZ2V0TmVpZ2hib3VySW5kZXgoY3VyckluZGV4LCBjdXJyTmVpZ2gpKTtcblx0XHRcdFx0Y3VyclNjb3JlID0gY3VyckFuZ2xlIC0gbGFzdEFuZ2xlO1xuXHRcdFx0XHRpZiAoY3VyclNjb3JlID4gMTgwKSB7IGN1cnJTY29yZSA9IGN1cnJTY29yZSAtIDM2MDsgfVxuXHRcdFx0XHRpZiAoY3VyclNjb3JlIDwgLTE4MCkgeyBjdXJyU2NvcmUgPSBjdXJyU2NvcmUgKyAzNjA7IH1cblx0XHRcdFx0dmFyIG5laWdoSW5kZXggPSB2aXNpdGVkLmluZGV4T2YoY3Vyck5laWdoKTtcblx0XHRcdFx0aWYgKG5laWdoSW5kZXggIT09IC0xKSB7IGN1cnJTY29yZSA9IG5laWdoSW5kZXggLyB2aXNpdGVkLmxlbmd0aCAqIDEwMDAwICsgMTAwMDAgKyBjdXJyU2NvcmU7IH1cblx0XHRcdFx0aWYgKCFiZXN0IHx8IGN1cnJTY29yZSA8IGJlc3RTY29yZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJlc3RTY29yZSA9IGN1cnJTY29yZTtcblx0XHRcdFx0XHRiZXN0ID0gY3Vyck5laWdoO1xuXHRcdFx0XHRcdGJlc3RBbmdsZSA9IGN1cnJBbmdsZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGFzdEFuZ2xlID0gYmVzdEFuZ2xlO1xuXHRcdFx0aWYgKHZpc2l0ZWQuaW5kZXhPZihjdXJySW5kZXgpICE9PSAtMSkgeyB2aXNpdGVkLnNwbGljZSh2aXNpdGVkLmluZGV4T2YoY3VyckluZGV4KSwgMSk7IH1cblx0XHRcdHZpc2l0ZWQucHVzaChjdXJySW5kZXgpO1xuXHRcdFx0Y3VyckluZGV4ID0gYmVzdDtcblxuXHRcdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW2N1cnJJbmRleFsxXV1bY3VyckluZGV4WzBdXSk7XG5cdFx0fVxuXHRcdHJldHVybiBwYXRoO1xuXHR9LFxuXG5cdGdldE91dGxpbmVzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHRvUmV0dXJuID0gW107XG5cdFx0dmFyIGN1cnJlbnRHcmFwaDtcblx0XHR2YXIgb3V0bGluZSA9IHRoaXMuZ2V0T3V0bGluZSgpO1xuXHRcdHZhciByZW1haW5pbmcgPSBvdXRsaW5lLmdldE5vZGVzQXJyYXkoKS5jb25jYXQoKTtcblxuXHRcdHZhciByZWN1ciA9IGZ1bmN0aW9uICgkcG9pbnQpXG5cdFx0e1xuXHRcdFx0Y3VycmVudEdyYXBoWyRwb2ludFsxXV0gPSBjdXJyZW50R3JhcGhbJHBvaW50WzFdXSB8fCBbXTtcblx0XHRcdGN1cnJlbnRHcmFwaFskcG9pbnRbMV1dWyRwb2ludFswXV0gPSAkcG9pbnQ7XG5cdFx0XHR2YXIgbmVpZ2hib3VycyA9IG91dGxpbmUuZ2V0TmVpZ2hib3VycygkcG9pbnRbMF0sICRwb2ludFsxXSk7XG5cdFx0XHRyZW1haW5pbmcuc3BsaWNlKHJlbWFpbmluZy5pbmRleE9mKCRwb2ludCksIDEpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5laWdoYm91cnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBuZWlnaCA9IG5laWdoYm91cnNbaV07XG5cdFx0XHRcdGlmIChyZW1haW5pbmcuaW5kZXhPZihuZWlnaCkgIT09IC0xKSB7IHJlY3VyKG5laWdoKTsgfVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aGlsZSAocmVtYWluaW5nLmxlbmd0aClcblx0XHR7XG5cdFx0XHRjdXJyZW50R3JhcGggPSBbXTtcblx0XHRcdHZhciBzdGFydGluZ1BvaW50ID0gcmVtYWluaW5nWzBdO1xuXHRcdFx0cmVjdXIoc3RhcnRpbmdQb2ludCk7XG5cdFx0XHR0b1JldHVybi5wdXNoKE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdChjdXJyZW50R3JhcGgpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRvUmV0dXJuO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyaWQ7XG5cbiIsInZhciBOb2RlR3JhcGggPSBmdW5jdGlvbiAoKVxue1xuXHR0aGlzLnZlcnRpY2VzID0gW107XG5cdHRoaXMuZWRnZXMgPSBbXTtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0VmVydGV4ID0gZnVuY3Rpb24gKCRub2RlKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciB2ZXJ0ZXggPSB0aGlzLnZlcnRpY2VzW2ldO1xuXHRcdGlmICh2ZXJ0ZXgubm9kZSA9PT0gJG5vZGUpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHZlcnRleDtcblx0XHR9XG5cdH1cbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuY3JlYXRlVmVydGV4ID0gZnVuY3Rpb24gKCRub2RlKVxue1xuXHR2YXIgdmVydGV4ID0geyBub2RlOiAkbm9kZSB9O1xuXHR0aGlzLnZlcnRpY2VzLnB1c2godmVydGV4KTtcblx0cmV0dXJuIHZlcnRleDtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0RWRnZVdlaWdodCA9IGZ1bmN0aW9uICgkZWRnZSlcbntcblx0dmFyIGRYID0gTWF0aC5hYnMoJGVkZ2UudmVydGV4QS5ub2RlLm9YIC0gJGVkZ2UudmVydGV4Qi5ub2RlLm9YKTtcblx0dmFyIGRZID0gTWF0aC5hYnMoJGVkZ2UudmVydGV4QS5ub2RlLm9ZIC0gJGVkZ2UudmVydGV4Qi5ub2RlLm9ZKTtcblx0dmFyIGRpc3QgPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xuXHRyZXR1cm4gZGlzdDtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0VmVydGV4RWRnZXMgPSBmdW5jdGlvbiAoJHZlcnRleClcbntcblx0dmFyIHRvUmV0dXJuID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLmVkZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldO1xuXHRcdGlmIChlZGdlLnZlcnRleEEgPT09ICR2ZXJ0ZXggfHwgZWRnZS52ZXJ0ZXhCID09PSAkdmVydGV4KVxuXHRcdHtcblx0XHRcdHRvUmV0dXJuLnB1c2goZWRnZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0b1JldHVybjtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uICgkQU5vZGUsICRCTm9kZSlcbntcblx0dmFyIHZlcnRleEEgPSB0aGlzLmdldFZlcnRleCgkQU5vZGUpIHx8IHRoaXMuY3JlYXRlVmVydGV4KCRBTm9kZSk7XG5cdHZhciB2ZXJ0ZXhCID0gdGhpcy5nZXRWZXJ0ZXgoJEJOb2RlKSB8fCB0aGlzLmNyZWF0ZVZlcnRleCgkQk5vZGUpO1xuXG5cdHZhciBleGlzdHMgPSBmYWxzZTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMuZWRnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgZWRnZSA9IHRoaXMuZWRnZXNbaV07XG5cdFx0aWYgKChlZGdlLnZlcnRleEEgPT09IHZlcnRleEEgJiZcblx0XHRcdGVkZ2UudmVydGV4QiA9PT0gdmVydGV4QikgfHxcblx0XHRcdChlZGdlLnZlcnRleEEgPT09IHZlcnRleEIgJiZcblx0XHRcdGVkZ2UudmVydGV4QiA9PT0gdmVydGV4QSkpXG5cdFx0e1xuXHRcdFx0ZXhpc3RzID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0aWYgKCFleGlzdHMpXG5cdHtcblx0XHR0aGlzLmVkZ2VzLnB1c2goeyB2ZXJ0ZXhBOiB2ZXJ0ZXhBLCB2ZXJ0ZXhCOiB2ZXJ0ZXhCIH0pO1xuXHR9XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLnRyYXZlcnNlID0gZnVuY3Rpb24gKCRzdGFydGluZ1ZlcnRpY2VzKVxue1xuXHR2YXIgaTtcblx0dmFyIG9wZW5MaXN0ID0gW107XG5cdHZhciBlZGdlc0xlbmd0aDtcblx0dmFyIHZlcnRleEVkZ2VzO1xuXHR2YXIgc3RhcnRpbmdWZXJ0aWNlc0xlbmd0aCA9ICRzdGFydGluZ1ZlcnRpY2VzLmxlbmd0aDtcblx0Zm9yIChpID0gMDsgaSA8IHN0YXJ0aW5nVmVydGljZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdCRzdGFydGluZ1ZlcnRpY2VzW2ldLm1hcFZhbHVlID0gMDtcblx0XHQkc3RhcnRpbmdWZXJ0aWNlc1tpXS5vcGVuZWQgPSB0cnVlO1xuXHRcdG9wZW5MaXN0LnB1c2goJHN0YXJ0aW5nVmVydGljZXNbaV0pO1xuXHR9XG5cblx0d2hpbGUgKG9wZW5MaXN0Lmxlbmd0aClcblx0e1xuXHRcdHZhciBjbG9zZWRWZXJ0ZXggPSBvcGVuTGlzdC5zaGlmdCgpO1xuXHRcdGNsb3NlZFZlcnRleC5jbG9zZWQgPSB0cnVlO1xuXG5cdFx0dmVydGV4RWRnZXMgPSB0aGlzLmdldFZlcnRleEVkZ2VzKGNsb3NlZFZlcnRleCk7XG5cdFx0ZWRnZXNMZW5ndGggPSB2ZXJ0ZXhFZGdlcy5sZW5ndGg7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGVkZ2VzTGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJFZGdlID0gdmVydGV4RWRnZXNbaV07XG5cdFx0XHR2YXIgb3RoZXJWZXJ0ZXggPSBjdXJyRWRnZS52ZXJ0ZXhBID09PSBjbG9zZWRWZXJ0ZXggPyBjdXJyRWRnZS52ZXJ0ZXhCIDogY3VyckVkZ2UudmVydGV4QTtcblx0XHRcdGlmIChvdGhlclZlcnRleC5jbG9zZWQpIHsgY29udGludWU7IH1cblx0XHRcdFxuXHRcdFx0aWYgKCFvdGhlclZlcnRleC5vcGVuZWQpXG5cdFx0XHR7XG5cdFx0XHRcdG90aGVyVmVydGV4Lm9wZW5lZCA9IHRydWU7XG5cdFx0XHRcdG9wZW5MaXN0LnB1c2gob3RoZXJWZXJ0ZXgpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHZhbCA9IGNsb3NlZFZlcnRleC5tYXBWYWx1ZSArIHRoaXMuZ2V0RWRnZVdlaWdodChjdXJyRWRnZSk7XG5cdFx0XHRvdGhlclZlcnRleC5tYXBWYWx1ZSA9IG90aGVyVmVydGV4Lm1hcFZhbHVlIDwgdmFsID8gb3RoZXJWZXJ0ZXgubWFwVmFsdWUgOiB2YWw7IC8vd29ya3MgZXZlbiBpZiB1bmRlZmluZWRcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZUdyYXBoO1xuIiwidmFyIFBvbHlnb24gPVxue1xuXHRpbml0OiBmdW5jdGlvbiAoJHBvaW50cylcblx0e1xuXHRcdHZhciBwb2x5Z29uID0gT2JqZWN0LmNyZWF0ZShQb2x5Z29uKTtcblx0XHRwb2x5Z29uLnBvaW50cyA9ICRwb2ludHM7XG5cdFx0cG9seWdvbi5fYm91bmRpbmdCb3ggPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHBvbHlnb247XG5cdH0sXG5cblx0Z2V0QXJlYTogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBzdW1BID0gMDtcblx0XHR2YXIgc3VtQiA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyUG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcblx0XHRcdHZhciBuZXh0ID0gaSA9PT0gbGVuZ3RoIC0gMSA/IHRoaXMucG9pbnRzWzBdIDogdGhpcy5wb2ludHNbaSArIDFdO1xuXG5cdFx0XHRzdW1BICs9IGN1cnJQb2ludFswXSAqIG5leHRbMV07XG5cdFx0XHRzdW1CICs9IGN1cnJQb2ludFsxXSAqIG5leHRbMF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIE1hdGguYWJzKChzdW1BIC0gc3VtQikgKiAwLjUpO1xuXHR9LFxuXG5cdGdldEJvdW5kaW5nQm94OiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0aWYgKCF0aGlzLl9ib3VuZGluZ0JveClcblx0XHR7XG5cdFx0XHR2YXIgbWluWCA9IHRoaXMucG9pbnRzWzBdWzBdO1xuXHRcdFx0dmFyIG1heFggPSBtaW5YO1xuXHRcdFx0dmFyIG1pblkgPSB0aGlzLnBvaW50c1swXVsxXTtcblx0XHRcdHZhciBtYXhZID0gbWluWTtcblxuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcblx0XHRcdFx0bWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50WzBdKTtcblx0XHRcdFx0bWF4WCA9IE1hdGgubWF4KG1heFgsIHBvaW50WzBdKTtcblx0XHRcdFx0bWluWSA9IE1hdGgubWluKG1pblksIHBvaW50WzFdKTtcblx0XHRcdFx0bWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50WzFdKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2JvdW5kaW5nQm94ID0gW1ttaW5YLCBtaW5ZXSwgW21heFgsIG1heFldXTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2JvdW5kaW5nQm94O1xuXHR9LFxuXG5cdGdldFNlZ21lbnRzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHNlZ21lbnRzID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aCAtIDE7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHRzZWdtZW50cy5wdXNoKFt0aGlzLnBvaW50c1tpXSwgdGhpcy5wb2ludHNbaSArIDFdXSk7XG5cdFx0fVxuXHRcdHNlZ21lbnRzLnB1c2goW3RoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aCAtIDFdLCB0aGlzLnBvaW50c1swXV0pO1xuXHRcdHJldHVybiBzZWdtZW50cztcblx0fSxcblxuXHRnZXRJbnRlcnNlY3Rpb25zQXRZOiBmdW5jdGlvbiAoJHRlc3RZKVxuXHR7XG5cdFx0dmFyIHNlZ21lbnRzID0gdGhpcy5nZXRTZWdtZW50cygpO1xuXHRcdHZhciBpbnRlcnNlY3Rpb25zID0gW107XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyU2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuXHRcdFx0dmFyIHgxID0gY3VyclNlZ21lbnRbMF1bMF07XG5cdFx0XHR2YXIgeTEgPSBjdXJyU2VnbWVudFswXVsxXTtcblx0XHRcdHZhciB4MiA9IGN1cnJTZWdtZW50WzFdWzBdO1xuXHRcdFx0dmFyIHkyID0gY3VyclNlZ21lbnRbMV1bMV07XG5cdFx0XHR2YXIgc21hbGxZID0gTWF0aC5taW4oeTEsIHkyKTtcblx0XHRcdHZhciBiaWdZID0gTWF0aC5tYXgoeTEsIHkyKTtcblxuXHRcdFx0aWYgKCR0ZXN0WSA+IHNtYWxsWSAmJiAkdGVzdFkgPCBiaWdZKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgcFkgPSB5MiAtICR0ZXN0WTtcblx0XHRcdFx0dmFyIHNlZ1kgPSB5MiAtIHkxO1xuXHRcdFx0XHR2YXIgc2VnWCA9IHgyIC0geDE7XG5cdFx0XHRcdHZhciBwWCA9IHBZICogc2VnWCAvIHNlZ1k7XG5cdFx0XHRcdGludGVyc2VjdGlvbnMucHVzaCh4MiAtIHBYKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGludGVyc2VjdGlvbnM7XG5cdH0sXG5cblx0aXNJbnNpZGU6IGZ1bmN0aW9uICgkcG9pbnQpXG5cdHtcblx0XHR2YXIgaW5mTnVtYmVyID0gMDtcblx0XHR2YXIgaW50ZXJzZWN0aW9ucyA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0F0WSgkcG9pbnRbMV0pO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBpbnRlcnNlY3Rpb25zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdGlmICgkcG9pbnRbMF0gPCBpbnRlcnNlY3Rpb25zW2ldKSB7IGluZk51bWJlciArPSAxOyB9XG5cdFx0fVxuXHRcdHJldHVybiBpbmZOdW1iZXIgJSAyID4gMDtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb2x5Z29uO1xuXG4iLCJ2YXIgQ29tbWFuZHMgPSByZXF1aXJlKCcuL0NvbW1hbmRzJyk7XG52YXIgQVJDID0gQ29tbWFuZHMuQVJDO1xudmFyIExJTkVfVE8gPSBDb21tYW5kcy5MSU5FX1RPO1xudmFyIE1PVkVfVE8gPSBDb21tYW5kcy5NT1ZFX1RPO1xudmFyIEJFWklFUl9UTyA9IENvbW1hbmRzLkJFWklFUl9UTztcbnZhciBRVUFEUkFfVE8gPSBDb21tYW5kcy5RVUFEUkFfVE87XG52YXIgRUxMSVBTRSA9IENvbW1hbmRzLkVMTElQU0U7XG5cbnZhciBTVkdQYXJzZXIgPSBmdW5jdGlvbiAoKSB7fTtcbi8vdmFyIGlzUG9seWdvbiA9IC9wb2x5Z29ufHJlY3QvaWc7XG4vLyB2YXIgaXNMaW5lID0gL3BvbHlsaW5lfGxpbmV8cGF0aC9pZztcbi8vIHZhciBsaW5lVGFncyA9ICdwb2x5bGluZSwgbGluZSwgcGF0aCc7XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoJHdvcmxkLCAkU1ZHKVxue1xuXHR0aGlzLlNWRyA9ICRTVkc7XG5cdHZhciB2aWV3Qm94QXR0ciA9IHRoaXMuU1ZHLmdldEF0dHJpYnV0ZSgndmlld0JveCcpO1xuXHR0aGlzLnZpZXdCb3hXaWR0aCA9IHZpZXdCb3hBdHRyID8gTnVtYmVyKHZpZXdCb3hBdHRyLnNwbGl0KCcgJylbMl0pIDogTnVtYmVyKHRoaXMuU1ZHLmdldEF0dHJpYnV0ZSgnd2lkdGgnKSk7XG5cdHRoaXMudmlld0JveEhlaWdodCA9IHZpZXdCb3hBdHRyID8gTnVtYmVyKHZpZXdCb3hBdHRyLnNwbGl0KCcgJylbM10pIDogTnVtYmVyKHRoaXMuU1ZHLmdldEF0dHJpYnV0ZSgnaGVpZ2h0JykpO1xuXHR0aGlzLnJhdGlvID0gJHdvcmxkLmdldFdpZHRoKCkgLyB0aGlzLnZpZXdCb3hXaWR0aDtcblx0dGhpcy53b3JsZCA9ICR3b3JsZDtcblx0dGhpcy53b3JsZC5zZXRIZWlnaHQodGhpcy52aWV3Qm94SGVpZ2h0ICogdGhpcy5yYXRpbyk7XG5cblx0Ly90ZW1wXG5cdHRoaXMuZWxlbWVudHNRdWVyeSA9ICcqOm5vdChkZWZzKTpub3QoZyk6bm90KHRpdGxlKTpub3QobGluZWFyR3JhZGllbnQpOm5vdChyYWRpYWxHcmFkaWVudCk6bm90KHN0b3ApOm5vdChbaWQqPVwiam9pbnRcIl0pOm5vdChbaWQqPVwiY29uc3RyYWludFwiXSknO1xuXHR2YXIgZWxlbVJhd3MgPSB0aGlzLlNWRy5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZWxlbWVudHNRdWVyeSk7XG5cblx0dmFyIGkgPSAwO1xuXHR2YXIgcmF3R3JvdXBQYWlyaW5ncyA9IFtdO1xuXHR2YXIgZWxlbXNMZW5ndGggPSBlbGVtUmF3cy5sZW5ndGg7XG5cblx0Zm9yIChpID0gMDsgaSA8IGVsZW1zTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgcmF3RWxlbWVudCA9IGVsZW1SYXdzW2ldO1xuXHRcdC8vaWYgKHJhd0VsZW1lbnQubm9kZVR5cGUgPT09IDMpIHsgY29udGludWU7IH1cblx0XHR2YXIgZ3JvdXBJbmZvcyA9IHRoaXMuZ2V0R3JvdXBJbmZvcyhyYXdFbGVtZW50KTtcblx0XHR2YXIgY3Vyckdyb3VwID0gJHdvcmxkLmNyZWF0ZUdyb3VwKGdyb3VwSW5mb3MudHlwZSwgZ3JvdXBJbmZvcy5JRCk7XG5cdFx0Y3Vyckdyb3VwLnJhd1NWR0VsZW1lbnQgPSByYXdFbGVtZW50O1xuXG5cdFx0dmFyIGRyYXdpbmdDb21tYW5kcyA9IHRoaXMucGFyc2VFbGVtZW50KHJhd0VsZW1lbnQpO1xuXHRcdHZhciBub2Rlc1RvRHJhdyA9IGN1cnJHcm91cC5zdHJ1Y3R1cmUuY3JlYXRlKGRyYXdpbmdDb21tYW5kcyk7XG5cdFx0dGhpcy5zZXRHcmFwaGljSW5zdHJ1Y3Rpb25zKGN1cnJHcm91cCwgcmF3RWxlbWVudCwgbm9kZXNUb0RyYXcsIGRyYXdpbmdDb21tYW5kcyk7XG5cblx0XHRyYXdHcm91cFBhaXJpbmdzLnB1c2goeyBncm91cDogY3Vyckdyb3VwLCByYXc6IHJhd0VsZW1lbnQucGFyZW50Tm9kZSB9KTtcblx0fVxuXG5cdHRoaXMucGFyc2VDb25zdHJhaW50cygpO1xuXHR0aGlzLnBhcnNlQ3VzdG9tSm9pbnRzKCk7XG5cblx0dGhpcy53b3JsZC5hZGRHcm91cHNUb1dvcmxkKCk7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldEdyb3VwSW5mb3MgPSBmdW5jdGlvbiAoJHJhd0dyb3VwKVxue1xuXHR2YXIgZ3JvdXBFbGVtZW50ID0gKCEkcmF3R3JvdXAuaWQgfHwgJHJhd0dyb3VwLmlkLmluZGV4T2YoJ3N2ZycpID09PSAwKSAmJiAkcmF3R3JvdXAucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnc3ZnJyA/ICRyYXdHcm91cC5wYXJlbnROb2RlIDogJHJhd0dyb3VwO1xuXHR2YXIgdHlwZTtcblx0dmFyIElEO1xuXHR2YXIgcmVnZXggPSAvKFthLXpcXGRdKylcXHcqL2lnbTtcblx0dmFyIGZpcnN0ID0gcmVnZXguZXhlYyhncm91cEVsZW1lbnQuaWQpO1xuXHR2YXIgc2Vjb25kID0gcmVnZXguZXhlYyhncm91cEVsZW1lbnQuaWQpO1xuXG5cdHR5cGUgPSBmaXJzdCA/IGZpcnN0WzFdIDogdW5kZWZpbmVkO1xuXHRJRCA9IHNlY29uZCA/IHNlY29uZFsxXSA6IG51bGw7XG5cdHZhciB0aXRsZSA9IGdyb3VwRWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0aXRsZScpO1xuXHRpZiAoSUQgPT09IG51bGwpIHsgSUQgPSB0aXRsZSA/IHRpdGxlLm5vZGVWYWx1ZSA6IElEOyB9XG5cblx0cmV0dXJuIHsgSUQ6IElELCB0eXBlOiB0eXBlIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldFBvaW50cyA9IGZ1bmN0aW9uICgkcG9pbnRDb21tYW5kcylcbntcblx0dmFyIHBvaW50cyA9IFtdO1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gJHBvaW50Q29tbWFuZHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclBvaW50Q29tbWFuZCA9ICRwb2ludENvbW1hbmRzW2ldO1xuXHRcdHBvaW50cy5wdXNoKGN1cnJQb2ludENvbW1hbmQucG9pbnQpO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldEdyb3VwRnJvbVJhd1NWR0VsZW1lbnQgPSBmdW5jdGlvbiAoJHJhdylcbntcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMud29ybGQuZ3JvdXBzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMud29ybGQuZ3JvdXBzW2ldO1xuXHRcdGlmIChjdXJyR3JvdXAucmF3U1ZHRWxlbWVudCA9PT0gJHJhdykgeyByZXR1cm4gY3Vyckdyb3VwOyB9XG5cdH1cbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VDb25zdHJhaW50cyA9IGZ1bmN0aW9uICgpXG57XG5cdHZhciByYXdDb25zdHJhaW50cyA9IHRoaXMuU1ZHLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZCo9XCJjb25zdHJhaW50XCJdJyk7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSByYXdDb25zdHJhaW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUmF3Q29uc3RyYWludCA9IHJhd0NvbnN0cmFpbnRzW2ldO1xuXHRcdHZhciByYXdFbGVtZW50cyA9IGN1cnJSYXdDb25zdHJhaW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCh0aGlzLmVsZW1lbnRzUXVlcnkpO1xuXHRcdHZhciBwb2ludHMgPSB0aGlzLmdldFBvaW50cyh0aGlzLnBhcnNlRWxlbWVudChjdXJyUmF3Q29uc3RyYWludCkucG9pbnRDb21tYW5kcyk7XG5cdFx0dmFyIHJlc3VsdCA9IC9jb25zdHJhaW50LShbYS16XFxkXSopLT8oW2EtelxcZF0qKT8vaWcuZXhlYyhjdXJyUmF3Q29uc3RyYWludC5pZCk7XG5cdFx0dmFyIHBhcmVudEdyb3VwSUQgPSByZXN1bHQgPyByZXN1bHRbMV0gOiB1bmRlZmluZWQ7XG5cdFx0aWYgKHBhcmVudEdyb3VwSUQgPT09ICd3b3JsZCcpIHsgcGFyZW50R3JvdXBJRCA9IHVuZGVmaW5lZDsgfVxuXHRcdHZhciBjb25zdHJhaW50VHlwZSA9IHJlc3VsdCAmJiByZXN1bHRbMl0gPyByZXN1bHRbMl0gOiAnZGVmYXVsdCc7XG5cdFx0dmFyIHBhcmVudEdyb3VwID0gcGFyZW50R3JvdXBJRCA/IHRoaXMud29ybGQuZ2V0R3JvdXBCeUlEKHBhcmVudEdyb3VwSUQpIDogdW5kZWZpbmVkO1xuXG5cdFx0Zm9yICh2YXIgayA9IDAsIHJhd0VsZW1lbnRzTGVuZ3RoID0gcmF3RWxlbWVudHMubGVuZ3RoOyBrIDwgcmF3RWxlbWVudHNMZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyclJhd0VsZW1lbnQgPSByYXdFbGVtZW50c1trXTtcblx0XHRcdHZhciBncm91cCA9IHRoaXMuZ2V0R3JvdXBGcm9tUmF3U1ZHRWxlbWVudChjdXJyUmF3RWxlbWVudCk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGdyb3VwKTtcblx0XHRcdHRoaXMud29ybGQuY29uc3RyYWluR3JvdXBzKGdyb3VwLCBwYXJlbnRHcm91cCwgcG9pbnRzLCBjb25zdHJhaW50VHlwZSk7XG5cdFx0fVxuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlQ3VzdG9tSm9pbnRzID0gZnVuY3Rpb24gKClcbntcblx0dmFyIHJhd0pvaW50ID0gdGhpcy5TVkcucXVlcnlTZWxlY3RvckFsbCgnW2lkKj1cImpvaW50XCJdJyk7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSByYXdKb2ludC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUmF3Sm9pbnQgPSByYXdKb2ludFtpXTtcblx0XHR2YXIgcmF3RWxlbWVudHMgPSBjdXJyUmF3Sm9pbnQucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuZWxlbWVudHNRdWVyeSk7XG5cdFx0dmFyIHBvaW50cyA9IHRoaXMuZ2V0UG9pbnRzKHRoaXMucGFyc2VFbGVtZW50KGN1cnJSYXdKb2ludCkucG9pbnRDb21tYW5kcyk7XG5cdFx0dmFyIHJlc3VsdCA9IC9qb2ludC0oW2EtelxcZF0qKS9pZy5leGVjKGN1cnJSYXdKb2ludC5pZCk7XG5cdFx0dmFyIHR5cGUgPSByZXN1bHQgPyByZXN1bHRbMV0gOiB1bmRlZmluZWQ7XG5cblx0XHRmb3IgKHZhciBrID0gMCwgcmF3RWxlbWVudHNMZW5ndGggPSByYXdFbGVtZW50cy5sZW5ndGg7IGsgPCByYXdFbGVtZW50c0xlbmd0aDsgayArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyUmF3RWxlbWVudCA9IHJhd0VsZW1lbnRzW2tdO1xuXHRcdFx0dmFyIGdyb3VwID0gdGhpcy5nZXRHcm91cEZyb21SYXdTVkdFbGVtZW50KGN1cnJSYXdFbGVtZW50KTtcblx0XHRcdHZhciBub2RlQSA9IGdyb3VwLmdldE5vZGVBdFBvaW50KHBvaW50c1swXVswXSwgcG9pbnRzWzBdWzFdKTtcblx0XHRcdHZhciBub2RlQiA9IGdyb3VwLmdldE5vZGVBdFBvaW50KHBvaW50c1sxXVswXSwgcG9pbnRzWzFdWzFdKTtcblx0XHRcdGdyb3VwLmNyZWF0ZUpvaW50KG5vZGVBLCBub2RlQiwgdHlwZSwgdHJ1ZSk7XG5cdFx0XHQvL2NvbnNvbGUubG9nKGdyb3VwKTtcblx0XHRcdC8vdGhpcy53b3JsZC5jb25zdHJhaW5Hcm91cHMoZ3JvdXAsIHBhcmVudEdyb3VwLCBwb2ludHMpO1xuXHRcdH1cblx0fVxuXHQvLyB2YXIgY2hpbGRyZW4gPSAkcmF3R3JvdXAuY2hpbGROb2RlczsvLyRyYXdHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiY29uc3RyYWludFwiXScpO1xuXG5cdC8vIGZvciAodmFyIGkgPSAwLCBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpICs9IDEpXG5cdC8vIHtcblx0Ly8gXHRpZiAoY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGNoaWxkcmVuW2ldLmlkLnNlYXJjaCgvam9pbnQvaSkgPCAwKSB7IGNvbnRpbnVlOyB9XG5cblx0Ly8gXHR2YXIgY3VyclJhd0pvaW50ID0gY2hpbGRyZW5baV07XG5cdC8vIFx0dmFyIHAxeCA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneDEnKSk7XG5cdC8vIFx0dmFyIHAxeSA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneTEnKSk7XG5cdC8vIFx0dmFyIHAyeCA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdC8vIFx0dmFyIHAyeSA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneTInKSk7XG5cblx0Ly8gXHR2YXIgbjEgPSAkZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocDF4LCBwMXkpIHx8ICRncm91cC5jcmVhdGVOb2RlKHAxeCwgcDF5KTtcblx0Ly8gXHR2YXIgbjIgPSAkZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocDJ4LCBwMnkpIHx8ICRncm91cC5jcmVhdGVOb2RlKHAyeCwgcDJ5KTtcblx0Ly8gXHQkZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0Ly8gfVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUVsZW1lbnQgPSBmdW5jdGlvbiAoJHJhd0VsZW1lbnQpXG57XG5cdHZhciB0YWdOYW1lID0gJHJhd0VsZW1lbnQudGFnTmFtZTtcblxuXHRzd2l0Y2ggKHRhZ05hbWUpXG5cdHtcblx0XHRjYXNlICdsaW5lJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlTGluZSgkcmF3RWxlbWVudCk7XG5cdFx0Y2FzZSAncmVjdCc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVJlY3QoJHJhd0VsZW1lbnQpO1xuXG5cdFx0Y2FzZSAncG9seWdvbic6XG5cdFx0Y2FzZSAncG9seWxpbmUnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VQb2x5KCRyYXdFbGVtZW50KTtcblxuXHRcdGNhc2UgJ3BhdGgnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VQYXRoKCRyYXdFbGVtZW50KTtcblxuXHRcdGNhc2UgJ2NpcmNsZSc6XG5cdFx0Y2FzZSAnZWxsaXBzZSc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNpcmNsZSgkcmF3RWxlbWVudCk7XG5cdH1cbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUuc2V0R3JhcGhpY0luc3RydWN0aW9ucyA9IGZ1bmN0aW9uICgkZ3JvdXAsICRyYXcsICRub2Rlc1RvRHJhdywgJGRyYXdpbmdDb21tYW5kcylcbntcblx0dmFyIGRyYXdpbmcgPSAkZ3JvdXAuZHJhd2luZyA9IHt9O1xuXHRkcmF3aW5nLm5vZGVzID0gJG5vZGVzVG9EcmF3O1xuXHR2YXIgcHJvcHMgPSBkcmF3aW5nLnByb3BlcnRpZXMgPSB7fTtcblx0Ly9zb3J0aW5nIG5vZGVzVG9EcmF3IHNvIHRoZSBwYXRoIGlzIGRyYXduIGNvcnJlY3RseVxuXHR2YXIgc3RhcnQ7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSAkbm9kZXNUb0RyYXcubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3Vyck5vZGUgPSAkbm9kZXNUb0RyYXdbaV07XG5cdFx0aWYgKGN1cnJOb2RlLmRyYXdpbmcuY29tbWFuZCA9PT0gTU9WRV9UTyB8fCBpID09PSBsZW5ndGggLSAxKVxuXHRcdHtcblx0XHRcdGlmIChzdGFydCkgeyBzdGFydC5kcmF3aW5nLmVuZE5vZGUgPSBjdXJyTm9kZTsgfVxuXHRcdFx0c3RhcnQgPSBjdXJyTm9kZTtcblx0XHR9XG5cblx0XHQkZ3JvdXAubm9kZXMuc3BsaWNlKCRncm91cC5ub2Rlcy5pbmRleE9mKGN1cnJOb2RlKSwgMSk7XG5cdFx0JGdyb3VwLm5vZGVzLnNwbGljZShpLCAwLCBjdXJyTm9kZSk7XG5cdH1cblxuXHR2YXIgcmF3RmlsbCA9ICRyYXcuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XG5cdHZhciByYXdTdHJva2UgPSAkcmF3LmdldEF0dHJpYnV0ZSgnc3Ryb2tlJyk7XG5cdHZhciByYXdMaW5lY2FwID0gJHJhdy5nZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJyk7XG5cdHZhciByYXdMaW5lam9pbiA9ICRyYXcuZ2V0QXR0cmlidXRlKCdzdHJva2UtbGluZWpvaW4nKTtcblx0dmFyIHJhd09wYWNpdHkgPSAkcmF3LmdldEF0dHJpYnV0ZSgnb3BhY2l0eScpO1xuXG5cdHByb3BzLmZpbGwgPSByYXdGaWxsIHx8ICcjMDAwMDAwJztcblx0cHJvcHMubGluZVdpZHRoID0gdGhpcy5nZXRUaGlja25lc3MoJHJhdyk7Ly9yYXdTdHJva2VXaWR0aCAqIHRoaXMucmF0aW8gfHwgMDtcblx0cHJvcHMuc3Ryb2tlID0gcmF3U3Ryb2tlICYmIHByb3BzLmxpbmVXaWR0aCAhPT0gMCA/IHJhd1N0cm9rZSA6ICdub25lJztcblx0cHJvcHMubGluZUNhcCA9IHJhd0xpbmVjYXAgJiYgcmF3TGluZWNhcCAhPT0gJ251bGwnID8gcmF3TGluZWNhcCA6ICdidXR0Jztcblx0cHJvcHMubGluZUpvaW4gPSByYXdMaW5lam9pbiAmJiByYXdMaW5lam9pbiAhPT0gJ251bGwnID8gcmF3TGluZWpvaW4gOiAnbWl0ZXInO1xuXHRwcm9wcy5vcGFjaXR5ID0gcmF3T3BhY2l0eSB8fCAxO1xuXG5cdHByb3BzLmNsb3NlUGF0aCA9ICRkcmF3aW5nQ29tbWFuZHMuY2xvc2VQYXRoO1xuXG5cdHByb3BzLnJhZGl1c1ggPSAkZHJhd2luZ0NvbW1hbmRzLnJhZGl1c1g7XG5cdHByb3BzLnJhZGl1c1kgPSAkZHJhd2luZ0NvbW1hbmRzLnJhZGl1c1k7XG5cblx0cHJvcHMuc3Ryb2tlR3JhZGllbnQgPSB0aGlzLmdldEdyYWRpZW50KHByb3BzLnN0cm9rZSk7XG5cdHByb3BzLmR5bmFtaWNHcmFkaWVudCA9ICRncm91cC5jb25mLnN0cnVjdHVyZSA9PT0gJ2xpbmUnICYmIHByb3BzLnN0cm9rZUdyYWRpZW50O1xuXHRwcm9wcy5maWxsR3JhZGllbnQgPSB0aGlzLmdldEdyYWRpZW50KHByb3BzLmZpbGwpO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRHcmFkaWVudCA9IGZ1bmN0aW9uICgkdmFsdWUpXG57XG5cdHZhciBncmFkaWVudElEID0gL3VybFxcKCMoLiopXFwpL2ltLmV4ZWMoJHZhbHVlKTtcblx0aWYgKGdyYWRpZW50SUQpXG5cdHtcblx0XHR2YXIgZ3JhZGllbnRFbGVtZW50ID0gdGhpcy5TVkcucXVlcnlTZWxlY3RvcignIycgKyBncmFkaWVudElEWzFdKTtcblx0XHR2YXIgbSA9IHRoaXMuZ2V0TWF0cml4KGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2dyYWRpZW50VHJhbnNmb3JtJykpO1xuXG5cdFx0aWYgKGdyYWRpZW50RWxlbWVudC50YWdOYW1lICE9PSAnbGluZWFyR3JhZGllbnQnICYmIGdyYWRpZW50RWxlbWVudC50YWdOYW1lICE9PSAncmFkaWFsR3JhZGllbnQnKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGdyYWRpZW50ID0geyBzdG9wczogW10sIHR5cGU6IGdyYWRpZW50RWxlbWVudC50YWdOYW1lIH07XG5cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgPT09ICdsaW5lYXJHcmFkaWVudCcpXG5cdFx0e1xuXHRcdFx0Z3JhZGllbnQueDEgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHRcdFx0Z3JhZGllbnQueTEgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kxJykpO1xuXHRcdFx0Z3JhZGllbnQueDIgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gyJykpO1xuXHRcdFx0Z3JhZGllbnQueTIgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXG5cdFx0XHRpZiAobSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIHAxID0gdGhpcy5tdWx0aXBseVBvaW50QnlNYXRyaXgoW2dyYWRpZW50LngxLCBncmFkaWVudC55MV0sIG0pO1xuXHRcdFx0XHR2YXIgcDIgPSB0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChbZ3JhZGllbnQueDIsIGdyYWRpZW50LnkyXSwgbSk7XG5cblx0XHRcdFx0Z3JhZGllbnQueDEgPSBwMVswXTtcblx0XHRcdFx0Z3JhZGllbnQueTEgPSBwMVsxXTtcblx0XHRcdFx0Z3JhZGllbnQueDIgPSBwMlswXTtcblx0XHRcdFx0Z3JhZGllbnQueTIgPSBwMlsxXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGdyYWRpZW50RWxlbWVudC50YWdOYW1lID09PSAncmFkaWFsR3JhZGllbnQnKVxuXHRcdHtcblx0XHRcdGdyYWRpZW50LmN4ID0gdGhpcy5nZXRDb29yZChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjeCcpKTtcblx0XHRcdGdyYWRpZW50LmN5ID0gdGhpcy5nZXRDb29yZChncmFkaWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjeScpKTtcblx0XHRcdGdyYWRpZW50LmZ4ID0gZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZngnKSA/IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZngnKSkgOiBncmFkaWVudC5jeDtcblx0XHRcdGdyYWRpZW50LmZ5ID0gZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZnknKSA/IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZnknKSkgOiBncmFkaWVudC5jeTtcblx0XHRcdGdyYWRpZW50LnIgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3InKSk7XG5cblx0XHRcdGlmIChtKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgYyA9IHRoaXMubXVsdGlwbHlQb2ludEJ5TWF0cml4KFtncmFkaWVudC5jeCwgZ3JhZGllbnQuY3ldLCBtKTtcblx0XHRcdFx0dmFyIGYgPSB0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChbZ3JhZGllbnQuZngsIGdyYWRpZW50LmZ5XSwgbSk7XG5cblx0XHRcdFx0Z3JhZGllbnQuY3ggPSBjWzBdO1xuXHRcdFx0XHRncmFkaWVudC5jeSA9IGNbMV07XG5cdFx0XHRcdGdyYWRpZW50LmZ4ID0gZlswXTtcblx0XHRcdFx0Z3JhZGllbnQuZnkgPSBmWzFdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBzdG9wcyA9IGdyYWRpZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzdG9wJyk7XG5cdFx0Zm9yICh2YXIgayA9IDAsIHN0b3BMZW5ndGggPSBzdG9wcy5sZW5ndGg7IGsgPCBzdG9wTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJTdG9wID0gc3RvcHNba107XG5cdFx0XHR2YXIgb2Zmc2V0ID0gTnVtYmVyKGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnb2Zmc2V0JykpO1xuXHRcdFx0dmFyIGNvbG9yUmVnZXhSZXN1bHQgPSAvc3RvcC1jb2xvcjooLis/KSg7fCQpL2cuZXhlYyhjdXJyU3RvcC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJykpO1xuXHRcdFx0dmFyIGNvbG9yID0gY3VyclN0b3AuZ2V0QXR0cmlidXRlKCdzdG9wLWNvbG9yJykgfHwgY29sb3JSZWdleFJlc3VsdCA/IGNvbG9yUmVnZXhSZXN1bHRbMV0gOiB1bmRlZmluZWQ7XG5cdFx0XHR2YXIgb3BhY2l0eVJlZ2V4UmVzdWx0ID0gL3N0b3Atb3BhY2l0eTooW1xcZC4tXSspL2cuZXhlYyhjdXJyU3RvcC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJykpO1xuXHRcdFx0dmFyIG9wYWNpdHkgPSBjdXJyU3RvcC5nZXRBdHRyaWJ1dGUoJ3N0b3Atb3BhY2l0eScpIHx8IG9wYWNpdHlSZWdleFJlc3VsdCA/IG9wYWNpdHlSZWdleFJlc3VsdFsxXSA6IDE7XG5cdFx0XHRpZiAoY29sb3Iuc3RhcnRzV2l0aCgnIycpKVxuXHRcdFx0e1xuXHRcdFx0XHR2YXIgUiA9IHBhcnNlSW50KGNvbG9yLnN1YnN0cigxLCAyKSwgMTYpO1xuXHRcdFx0XHR2YXIgRyA9IHBhcnNlSW50KGNvbG9yLnN1YnN0cigzLCAyKSwgMTYpO1xuXHRcdFx0XHR2YXIgQiA9IHBhcnNlSW50KGNvbG9yLnN1YnN0cig1LCAyKSwgMTYpO1xuXHRcdFx0XHRjb2xvciA9ICdyZ2JhKCcgKyBSICsgJywnICsgRyArICcsJyArIEIgKyAnLCcgKyBvcGFjaXR5ICsgJyknO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNvbG9yLnN0YXJ0c1dpdGgoJ3JnYignKSkgeyBjb2xvciA9ICdyZ2JhJyArIGNvbG9yLnN1YnN0cmluZyg0LCAtMSkgKyAnLCcgKyBvcGFjaXR5ICsgJyknOyB9XG5cdFx0XHRpZiAoY29sb3Iuc3RhcnRzV2l0aCgnaHNsKCcpKSB7IGNvbG9yID0gJ2hzbGEnICsgY29sb3Iuc3Vic3RyaW5nKDQsIC0xKSArICcsJyArIG9wYWNpdHkgKyAnKSc7IH1cblx0XHRcdGdyYWRpZW50LnN0b3BzLnB1c2goeyBvZmZzZXQ6IG9mZnNldCwgY29sb3I6IGNvbG9yLCBvcGFjaXR5OiBvcGFjaXR5IH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBncmFkaWVudDtcblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZUNpcmNsZSA9IGZ1bmN0aW9uICgkcmF3Q2lyY2xlKVxue1xuXHR2YXIgeFBvcyA9IHRoaXMuZ2V0Q29vcmQoJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ2N4JykgfHwgMCk7XG5cdHZhciB5UG9zID0gdGhpcy5nZXRDb29yZCgkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgnY3knKSB8fCAwKTtcblx0dmFyIHJhZGl1c0F0dHJYID0gJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ3InKSB8fCAkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgncngnKTtcblx0dmFyIHJhZGl1c0F0dHJZID0gJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ3J5Jyk7XG5cdHZhciByYWRpdXNYID0gdGhpcy5nZXRDb29yZChyYWRpdXNBdHRyWCk7XG5cdHZhciByYWRpdXNZID0gdGhpcy5nZXRDb29yZChyYWRpdXNBdHRyWSkgfHwgcmFkaXVzWDtcblx0dmFyIHJvdGF0aW9uID0gdGhpcy5nZXRSb3RhdGlvbigkcmF3Q2lyY2xlLmdldEF0dHJpYnV0ZSgndHJhbnNmb3JtJykpO1xuXHR2YXIgcG9pbnRDb21tYW5kcyA9IFt7IGNvbW1hbmQ6IHJhZGl1c1kgIT09IHJhZGl1c1ggPyBFTExJUFNFIDogQVJDLCBwb2ludDogW3hQb3MsIHlQb3NdLCBvcHRpb25zOiBbcmFkaXVzWCwgcmFkaXVzWSwgcm90YXRpb25dIH1dO1xuXHRyZXR1cm4geyB0eXBlOiAnZWxsaXBzZScsIHBvaW50Q29tbWFuZHM6IHBvaW50Q29tbWFuZHMsIHJhZGl1c1g6IHJhZGl1c1gsIHJhZGl1c1k6IHJhZGl1c1ksIGNsb3NlUGF0aDogZmFsc2UsIHRoaWNrbmVzczogdGhpcy5nZXRUaGlja25lc3MoJHJhd0NpcmNsZSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VMaW5lID0gZnVuY3Rpb24gKCRyYXdMaW5lKVxue1xuXHR2YXIgeDEgPSB0aGlzLmdldENvb3JkKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgneDEnKSk7XG5cdHZhciB4MiA9IHRoaXMuZ2V0Q29vcmQoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd4MicpKTtcblx0dmFyIHkxID0gdGhpcy5nZXRDb29yZCgkcmF3TGluZS5nZXRBdHRyaWJ1dGUoJ3kxJykpO1xuXHR2YXIgeTIgPSB0aGlzLmdldENvb3JkKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgneTInKSk7XG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IGNvbW1hbmQ6IE1PVkVfVE8sIHBvaW50OiBbeDEsIHkxXSwgb3B0aW9uczogW10gfSk7XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IGNvbW1hbmQ6IExJTkVfVE8sIHBvaW50OiBbeDIsIHkyXSwgb3B0aW9uczogW10gfSk7XG5cdHJldHVybiB7IHR5cGU6ICdsaW5lJywgcG9pbnRDb21tYW5kczogcG9pbnRDb21tYW5kcywgY2xvc2VQYXRoOiBmYWxzZSwgdGhpY2tuZXNzOiB0aGlzLmdldFRoaWNrbmVzcygkcmF3TGluZSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VSZWN0ID0gZnVuY3Rpb24gKCRyYXdSZWN0KVxue1xuXHR2YXIgeDEgPSAkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3gnKSA/IHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd4JykpIDogMDtcblx0dmFyIHkxID0gJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd5JykgPyB0aGlzLmdldENvb3JkKCRyYXdSZWN0LmdldEF0dHJpYnV0ZSgneScpKSA6IDA7XG5cdHZhciB4MiA9IHgxICsgdGhpcy5nZXRDb29yZCgkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuXHR2YXIgeTIgPSB5MSArIHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG5cblx0dmFyIHBvaW50cyA9XG5cdFtcblx0XHRbeDEsIHkxXSxcblx0XHRbeDEsIHkyXSxcblx0XHRbeDIsIHkyXSxcblx0XHRbeDIsIHkxXVxuXHRdO1xuXG5cdHZhciBtID0gdGhpcy5nZXRNYXRyaXgoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nKSk7XG5cdGlmIChtKVxuXHR7XG5cdFx0cG9pbnRzID1cblx0XHRbXG5cdFx0XHR0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChwb2ludHNbMF0sIG0pLFxuXHRcdFx0dGhpcy5tdWx0aXBseVBvaW50QnlNYXRyaXgocG9pbnRzWzFdLCBtKSxcblx0XHRcdHRoaXMubXVsdGlwbHlQb2ludEJ5TWF0cml4KHBvaW50c1syXSwgbSksXG5cdFx0XHR0aGlzLm11bHRpcGx5UG9pbnRCeU1hdHJpeChwb2ludHNbM10sIG0pXG5cdFx0XTtcblx0fVxuXG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IGNvbW1hbmQ6IE1PVkVfVE8sIHBvaW50OiBwb2ludHNbMF0sIG9wdGlvbnM6IFtdIH0pO1xuXHRwb2ludENvbW1hbmRzLnB1c2goeyBjb21tYW5kOiBMSU5FX1RPLCBwb2ludDogcG9pbnRzWzFdLCBvcHRpb25zOiBbXSB9KTtcblx0cG9pbnRDb21tYW5kcy5wdXNoKHsgY29tbWFuZDogTElORV9UTywgcG9pbnQ6IHBvaW50c1syXSwgb3B0aW9uczogW10gfSk7XG5cdHBvaW50Q29tbWFuZHMucHVzaCh7IGNvbW1hbmQ6IExJTkVfVE8sIHBvaW50OiBwb2ludHNbM10sIG9wdGlvbnM6IFtdIH0pO1xuXG5cdHJldHVybiB7IHR5cGU6ICdwb2x5Z29uJywgcG9pbnRDb21tYW5kczogcG9pbnRDb21tYW5kcywgY2xvc2VQYXRoOiB0cnVlLCB0aGlja25lc3M6IHRoaXMuZ2V0VGhpY2tuZXNzKCRyYXdSZWN0KSB9O1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5wYXJzZVBvbHkgPSBmdW5jdGlvbiAoJHJhd1BvbHkpXG57XG5cdHZhciByZWdleCA9IC8oW1xcLS5cXGRdKylbLCBdKFtcXC0uXFxkXSspL2lnO1xuXHR2YXIgcmVzdWx0ID0gcmVnZXguZXhlYygkcmF3UG9seS5nZXRBdHRyaWJ1dGUoJ3BvaW50cycpKTtcblx0dmFyIHBvaW50Q29tbWFuZHMgPSBbXTtcblxuXHR3aGlsZSAocmVzdWx0KVxuXHR7XG5cdFx0dmFyIGNvbW1hbmQgPSBwb2ludENvbW1hbmRzLmxlbmd0aCA9PT0gMCA/IE1PVkVfVE8gOiBMSU5FX1RPO1xuXHRcdHZhciBwb2ludCA9IFt0aGlzLmdldENvb3JkKHJlc3VsdFsxXSksIHRoaXMuZ2V0Q29vcmQocmVzdWx0WzJdKV07XG5cdFx0cG9pbnRDb21tYW5kcy5wdXNoKHsgY29tbWFuZDogY29tbWFuZCwgcG9pbnQ6IHBvaW50LCBvcHRpb25zOiBbXSB9KTtcblx0XHRyZXN1bHQgPSByZWdleC5leGVjKCRyYXdQb2x5LmdldEF0dHJpYnV0ZSgncG9pbnRzJykpO1xuXHR9XG5cdHJldHVybiB7IHR5cGU6ICRyYXdQb2x5LnRhZ05hbWUsIHBvaW50Q29tbWFuZHM6IHBvaW50Q29tbWFuZHMsIGNsb3NlUGF0aDogJHJhd1BvbHkudGFnTmFtZSAhPT0gJ3BvbHlsaW5lJywgdGhpY2tuZXNzOiB0aGlzLmdldFRoaWNrbmVzcygkcmF3UG9seSkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VQYXRoID0gZnVuY3Rpb24gKCRyYXdQYXRoKVxue1xuXHR2YXIgZCA9ICRyYXdQYXRoLmdldEF0dHJpYnV0ZSgnZCcpO1xuXHR2YXIgcGF0aFJlZyA9IC8oW2EteV0pKFsuXFwtLFxcZF0rKS9pZ207XG5cdHZhciByZXN1bHQ7XG5cdHZhciBjbG9zZVBhdGggPSAvei9pZ20udGVzdChkKTtcblx0dmFyIGNvb3Jkc1JlZ2V4ID0gLy0/W1xcZC5dKy9pZ207XG5cdHZhciBwb2ludENvbW1hbmRzID0gW107XG5cdHZhciBsYXN0WCA9IHRoaXMuZ2V0Q29vcmQoMCk7XG5cdHZhciBsYXN0WSA9IHRoaXMuZ2V0Q29vcmQoMCk7XG5cblx0dmFyIHRoYXQgPSB0aGlzO1xuXHR2YXIgZ2V0UG9pbnQgPSBmdW5jdGlvbiAoJHgsICR5LCAkcmVsYXRpdmUpXG5cdHtcblx0XHR2YXIgeCA9ICR4ID09PSB1bmRlZmluZWQgPyBsYXN0WCA6IHRoYXQuZ2V0Q29vcmQoJHgpO1xuXHRcdHZhciB5ID0gJHkgPT09IHVuZGVmaW5lZCA/IGxhc3RZIDogdGhhdC5nZXRDb29yZCgkeSk7XG5cdFx0aWYgKCRyZWxhdGl2ZSlcblx0XHR7XG5cdFx0XHR4ID0gJHggPT09IHVuZGVmaW5lZCA/IHggOiBsYXN0WCArIHg7XG5cdFx0XHR5ID0gJHkgPT09IHVuZGVmaW5lZCA/IHkgOiBsYXN0WSArIHk7XG5cdFx0fVxuXHRcdHJldHVybiBbeCwgeV07XG5cdH07XG5cblx0dmFyIGdldFJlbGF0aXZlUG9pbnQgPSBmdW5jdGlvbiAoJHBvaW50LCAkeCwgJHksICRyZWxhdGl2ZSlcblx0e1xuXHRcdHZhciB4ID0gdGhhdC5nZXRDb29yZCgkeCk7XG5cdFx0dmFyIHkgPSB0aGF0LmdldENvb3JkKCR5KTtcblx0XHRpZiAoJHJlbGF0aXZlKVxuXHRcdHtcblx0XHRcdHggPSBsYXN0WCArIHg7XG5cdFx0XHR5ID0gbGFzdFkgKyB5O1xuXHRcdH1cblx0XHR4ID0geCAtICRwb2ludFswXTtcblx0XHR5ID0geSAtICRwb2ludFsxXTtcblx0XHRyZXR1cm4gW3gsIHldO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVQb2ludCA9IGZ1bmN0aW9uICgkY29tbWFuZCwgJHBvaW50LCAkb3B0aW9ucylcblx0e1xuXHRcdHZhciBpbmZvID0geyBjb21tYW5kOiAkY29tbWFuZCwgcG9pbnQ6ICRwb2ludCwgb3B0aW9uczogJG9wdGlvbnMgfHwgW10gfTtcblx0XHRsYXN0WCA9IGluZm8ucG9pbnRbMF07XG5cdFx0bGFzdFkgPSBpbmZvLnBvaW50WzFdO1xuXHRcdHBvaW50Q29tbWFuZHMucHVzaChpbmZvKTtcblx0fTtcblxuXHR2YXIgcG9pbnQ7XG5cdHZhciBjdWJpYzE7XG5cdHZhciBjdWJpYzI7XG5cdHZhciBxdWFkcmExO1xuXG5cdHJlc3VsdCA9IHBhdGhSZWcuZXhlYyhkKTtcblxuXHR3aGlsZSAocmVzdWx0KVxuXHR7XG5cdFx0dmFyIGluc3RydWN0aW9uID0gcmVzdWx0WzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0dmFyIGNvb3JkcyA9IHJlc3VsdFsyXS5tYXRjaChjb29yZHNSZWdleCk7XG5cdFx0dmFyIGlzTG93c2VyQ2FzZSA9IC9bYS16XS8udGVzdChyZXN1bHRbMV0pO1xuXG5cdFx0c3dpdGNoIChpbnN0cnVjdGlvbilcblx0XHR7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0Y2FzZSAnbSc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludChNT1ZFX1RPLCBwb2ludCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbCc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludChMSU5FX1RPLCBwb2ludCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAndic6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KHVuZGVmaW5lZCwgY29vcmRzWzBdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludChMSU5FX1RPLCBwb2ludCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnaCc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgdW5kZWZpbmVkLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludChMSU5FX1RPLCBwb2ludCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnYyc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1s0XSwgY29vcmRzWzVdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjdWJpYzEgPSBnZXRSZWxhdGl2ZVBvaW50KHBvaW50LCBjb29yZHNbMF0sIGNvb3Jkc1sxXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3ViaWMyID0gZ2V0UmVsYXRpdmVQb2ludChwb2ludCwgY29vcmRzWzJdLCBjb29yZHNbM10sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KEJFWklFUl9UTywgcG9pbnQsIFtjdWJpYzEsIGN1YmljMl0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3MnOlxuXHRcdFx0XHRxdWFkcmExID0gbnVsbDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3ViaWMxID0gY3ViaWMyID8gW2xhc3RYIC0gY3ViaWMyWzBdIC0gcG9pbnRbMF0sIGxhc3RZIC0gY3ViaWMyWzFdIC0gcG9pbnRbMV1dIDogdW5kZWZpbmVkO1xuXHRcdFx0XHRjdWJpYzIgPSBnZXRSZWxhdGl2ZVBvaW50KHBvaW50LCBjb29yZHNbMF0sIGNvb3Jkc1sxXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3ViaWMxID0gY3ViaWMxIHx8IFtjdWJpYzJbMF0sIGN1YmljMlsxXV07XG5cdFx0XHRcdGNyZWF0ZVBvaW50KEJFWklFUl9UTywgcG9pbnQsIFtjdWJpYzEsIGN1YmljMl0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3EnOlxuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1syXSwgY29vcmRzWzNdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRxdWFkcmExID0gZ2V0UmVsYXRpdmVQb2ludChwb2ludCwgY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KFFVQURSQV9UTywgcG9pbnQsIFtxdWFkcmExXSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAndCc6XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHF1YWRyYTEgPSBxdWFkcmExID8gcXVhZHJhMSA6IHBvaW50O1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludChRVUFEUkFfVE8sIHBvaW50LCBbcXVhZHJhMV0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2EnOlxuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRxdWFkcmExID0gbnVsbDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbNV0sIGNvb3Jkc1s2XSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoJ2FyY1RvJywgcG9pbnQpO1xuXHRcdFx0XHRjb25zb2xlLndhcm4oJ25vdCBzdXBwb3J0ZWQnKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0cmVzdWx0ID0gcGF0aFJlZy5leGVjKGQpO1xuXHR9XG5cblx0cmV0dXJuIHsgdHlwZTogJ3BhdGgnLCBwb2ludENvbW1hbmRzOiBwb2ludENvbW1hbmRzLCBjbG9zZVBhdGg6IGNsb3NlUGF0aCwgdGhpY2tuZXNzOiB0aGlzLmdldFRoaWNrbmVzcygkcmF3UGF0aCkgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucm91bmQgPSBmdW5jdGlvbiAoJG51bWJlcilcbntcblx0Ly8gdmFyIG51bWJlciA9IE51bWJlcigkbnVtYmVyKTtcblx0Ly8gcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyICogMTAwKSAvIDEwMDtcblx0cmV0dXJuICRudW1iZXI7XG5cdC8vcmV0dXJuIE1hdGguZmxvb3IoTnVtYmVyKCRudW1iZXIpKTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUuZ2V0VGhpY2tuZXNzID0gZnVuY3Rpb24gKCRyYXcpXG57XG5cdHZhciByYXdUaGlja25lc3MgPSAkcmF3LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJykgfHwgMTtcblx0cmV0dXJuIHRoaXMuZ2V0Q29vcmQocmF3VGhpY2tuZXNzKTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUuZ2V0TWF0cml4ID0gZnVuY3Rpb24gKCRhdHRyaWJ1dGUpXG57XG5cdGlmICghJGF0dHJpYnV0ZSkgeyByZXR1cm4gbnVsbDsgfVxuXG5cdHZhciBURlR5cGUgPSAkYXR0cmlidXRlLm1hdGNoKC8oW2Etel0rKS9pZ20pWzBdO1xuXHR2YXIgdmFsdWVzID0gJGF0dHJpYnV0ZS5tYXRjaCgvKC0/W1xcZC5dKykvaWdtKTtcblxuXHR2YXIgbWF0cmljZXMgPSBbXTtcblx0dmFyIHRYO1xuXHR2YXIgdFk7XG5cdHZhciBhbmdsZTtcblxuXHRpZiAoVEZUeXBlID09PSAnbWF0cml4Jylcblx0e1xuXHRcdHJldHVybiBbTnVtYmVyKHZhbHVlc1swXSksIE51bWJlcih2YWx1ZXNbMl0pLCB0aGlzLmdldENvb3JkKHZhbHVlc1s0XSksIE51bWJlcih2YWx1ZXNbMV0pLCBOdW1iZXIodmFsdWVzWzNdKSwgdGhpcy5nZXRDb29yZCh2YWx1ZXNbNV0pLCAwLCAwLCAxXTtcblx0fVxuXHRlbHNlIGlmIChURlR5cGUgPT09ICdyb3RhdGUnKVxuXHR7XG5cdFx0YW5nbGUgPSBOdW1iZXIodmFsdWVzWzBdKSAqIChNYXRoLlBJIC8gMTgwKTtcblx0XHR0WCA9IHRoaXMuZ2V0Q29vcmQoTnVtYmVyKHZhbHVlc1sxXSB8fCAwKSk7XG5cdFx0dFkgPSB0aGlzLmdldENvb3JkKE51bWJlcih2YWx1ZXNbMl0gfHwgMCkpO1xuXHRcdHZhciBtMSA9IFsxLCAwLCB0WCwgMCwgMSwgdFksIDAsIDAsIDFdO1xuXHRcdHZhciBtMiA9IFtNYXRoLmNvcyhhbmdsZSksIC1NYXRoLnNpbihhbmdsZSksIDAsIE1hdGguc2luKGFuZ2xlKSwgTWF0aC5jb3MoYW5nbGUpLCAwLCAwLCAwLCAxXTtcblx0XHR2YXIgbTMgPSBbMSwgMCwgLXRYLCAwLCAxLCAtdFksIDAsIDAsIDFdO1xuXG5cdFx0bWF0cmljZXMucHVzaChtMSwgbTIsIG0zKTtcblx0XHR2YXIgcCA9IG0xO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDEsIG1hdHJpY2VzTGVuZ3RoID0gbWF0cmljZXMubGVuZ3RoOyBpIDwgbWF0cmljZXNMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3Vyck1hdCA9IG1hdHJpY2VzW2ldO1xuXHRcdFx0dmFyIG5ld1AgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG5cdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IDk7IGsgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIHJvdyA9IE1hdGguZmxvb3IoayAvIDMpO1xuXHRcdFx0XHR2YXIgY29sID0gayAlIDM7XG5cdFx0XHRcdC8vdmFyIG1WYWwgPSBwW3JvdyAqIGNvbCAtIDFdO1xuXHRcdFx0XHRmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCAzOyBwb3MgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5ld1Bba10gPSBuZXdQW2tdICsgcFtyb3cgKiAzICsgcG9zXSAqIGN1cnJNYXRbcG9zICogMyArIGNvbF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHAgPSBuZXdQO1xuXHRcdH1cblx0XHRyZXR1cm4gcDtcblx0fVxuXHRlbHNlIGlmIChURlR5cGUgPT09ICd0cmFuc2xhdGUnKVxuXHR7XG5cdFx0dFggPSB0aGlzLmdldENvb3JkKE51bWJlcih2YWx1ZXNbMF0gfHwgMCkpO1xuXHRcdHRZID0gdGhpcy5nZXRDb29yZChOdW1iZXIodmFsdWVzWzFdIHx8IDApKTtcblx0XHRyZXR1cm4gWzEsIDAsIHRYLCAwLCAxLCB0WSwgMCwgMCwgMV07XG5cdH1cblx0ZWxzZSBpZiAoVEZUeXBlID09PSAnc2NhbGUnKVxuXHR7XG5cdFx0dmFyIHNYID0gdGhpcy5nZXRDb29yZChOdW1iZXIodmFsdWVzWzBdIHx8IDApKTtcblx0XHR2YXIgc1kgPSB0aGlzLmdldENvb3JkKE51bWJlcih2YWx1ZXNbMV0gfHwgMCkpO1xuXHRcdHJldHVybiBbc1gsIDAsIDAsIDAsIHNZLCAwXTtcblx0fVxuXHRlbHNlIGlmIChURlR5cGUgPT09ICdza2V3WCcpXG5cdHtcblx0XHRhbmdsZSA9IE51bWJlcih2YWx1ZXNbMF0pICogKE1hdGguUEkgLyAxODApO1xuXHRcdHJldHVybiBbMSwgTWF0aC50YW4oYW5nbGUpLCAwLCAwLCAxLCAwLCAwLCAwLCAxXTtcblx0fVxuXHRlbHNlIGlmIChURlR5cGUgPT09ICdza2V3WScpXG5cdHtcblx0XHRhbmdsZSA9IE51bWJlcih2YWx1ZXNbMF0pICogKE1hdGguUEkgLyAxODApO1xuXHRcdHJldHVybiBbMSwgMCwgMCwgTWF0aC50YW4oYW5nbGUpLCAxLCAwLCAwLCAwLCAxXTtcblx0fVxufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5tdWx0aXBseVBvaW50QnlNYXRyaXggPSBmdW5jdGlvbiAoJHBvaW50LCBtKVxue1xuXHR2YXIgaCA9IFskcG9pbnRbMF0sICRwb2ludFsxXSwgMV07XG5cdHZhciBwID1cblx0W1xuXHRcdG1bMF0gKiBoWzBdICsgbVsxXSAqIGhbMV0gKyBtWzJdICogaFsyXSxcblx0XHRtWzNdICogaFswXSArIG1bNF0gKiBoWzFdICsgbVs1XSAqIGhbMl0sXG5cdFx0bVs2XSAqIGhbMF0gKyBtWzddICogaFsxXSArIG1bOF0gKiBoWzJdXG5cdF07XG5cdHJldHVybiBbcFswXSAvIHBbMl0sIHBbMV0gLyBwWzJdXTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUuZ2V0Um90YXRpb24gPSBmdW5jdGlvbiAoJGF0dHJpYnV0ZSlcbntcblx0dmFyIG1hdHJpeCA9IHRoaXMuZ2V0TWF0cml4KCRhdHRyaWJ1dGUpO1xuXHRpZiAobWF0cml4KVxuXHR7XG5cdFx0cmV0dXJuIE1hdGguYXRhbjIobWF0cml4WzBdLCBtYXRyaXhbM10pO1xuXHR9XG5cdHJldHVybiAwO1xufTtcblxuU1ZHUGFyc2VyLnByb3RvdHlwZS5nZXRDb29yZCA9IGZ1bmN0aW9uICgkY29vcmRTVFIpXG57XG5cdHZhciBudW1iZXIgPSB0aGlzLnJvdW5kKCRjb29yZFNUUik7XG5cdHJldHVybiBudW1iZXIgKiB0aGlzLnJhdGlvO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkdQYXJzZXI7XG5cbiIsInZhciBTVkplbGx5Tm9kZSA9IHJlcXVpcmUoJy4vU1ZKZWxseU5vZGUnKTtcbnZhciBTVkplbGx5Sm9pbnQgPSByZXF1aXJlKCcuL1NWSmVsbHlKb2ludCcpO1xuXG52YXIgU1ZKZWxseUdyb3VwID0gZnVuY3Rpb24gKCR0eXBlLCAkY29uZiwgJElEKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyID0gdW5kZWZpbmVkO1xuXHR0aGlzLmRyYXdpbmcgPSB1bmRlZmluZWQ7XG5cdHRoaXMuc3RydWN0dXJlID0gdW5kZWZpbmVkO1xuXHR0aGlzLmNvbmYgPSAkY29uZjtcblx0dGhpcy5maXhlZCA9IHRoaXMuY29uZi5maXhlZDtcblx0dGhpcy50eXBlID0gJHR5cGU7XG5cdHRoaXMubm9kZXMgPSBbXTtcblx0dGhpcy5qb2ludHMgPSBbXTtcblx0dGhpcy5JRCA9ICRJRDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Tm9kZUF0UG9pbnQgPSBmdW5jdGlvbiAoJHgsICR5KVxue1xuXHRmb3IgKHZhciBpID0gMCwgbm9kZXNMZW5ndGggPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IG5vZGVzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XG5cblx0XHRpZiAobm9kZS5vWCA9PT0gJHggJiYgbm9kZS5vWSA9PT0gJHkpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXHR9XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoJHB4LCAkcHksICRvcHRpb25zLCAkb3ZlcndyaXRlKVxue1xuXHR2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUF0UG9pbnQoJHB4LCAkcHkpO1xuXHRpZiAobm9kZSAhPT0gdW5kZWZpbmVkICYmICRvdmVyd3JpdGUpXG5cdHtcblx0XHRub2RlLnNldE9wdGlvbnMoJG9wdGlvbnMpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdG5vZGUgPSBuZXcgU1ZKZWxseU5vZGUoJHB4LCAkcHksICRvcHRpb25zKTtcblx0XHR0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG5cdH1cblxuXHQvL3RoaXMucGh5c2ljc01hbmFnZXIuYWRkTm9kZVRvV29ybGQobm9kZSk7XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldENsb3Nlc3RQb2ludCA9IGZ1bmN0aW9uICgkcG9pbnRzLCAkbm9kZXMpXG57XG5cdHZhciBub2RlcyA9ICRub2RlcyB8fCB0aGlzLm5vZGVzO1xuXHR2YXIgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNsb3Nlc3RQb2ludDtcblx0dmFyIGNsb3Nlc3ROb2RlO1xuXHR2YXIgY2xvc2VzdE9mZnNldFg7XG5cdHZhciBjbG9zZXN0T2Zmc2V0WTtcblxuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkcG9pbnRzW2ldO1xuXHRcdGZvciAodmFyIGsgPSAwLCBub2Rlc0xlbmd0aCA9IG5vZGVzLmxlbmd0aDsgayA8IG5vZGVzTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJOb2RlID0gbm9kZXNba107XG5cdFx0XHR2YXIgb2Zmc2V0WCA9IGN1cnJQb2ludFswXSAtIGN1cnJOb2RlLm9YO1xuXHRcdFx0dmFyIG9mZnNldFkgPSBjdXJyUG9pbnRbMV0gLSBjdXJyTm9kZS5vWTtcblx0XHRcdHZhciBjWCA9IE1hdGguYWJzKG9mZnNldFgpO1xuXHRcdFx0dmFyIGNZID0gTWF0aC5hYnMob2Zmc2V0WSk7XG5cdFx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChjWCAqIGNYICsgY1kgKiBjWSk7XG5cdFx0XHRpZiAoZGlzdCA8IGNsb3Nlc3REaXN0KVxuXHRcdFx0e1xuXHRcdFx0XHRjbG9zZXN0Tm9kZSA9IGN1cnJOb2RlO1xuXHRcdFx0XHRjbG9zZXN0UG9pbnQgPSBjdXJyUG9pbnQ7XG5cdFx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcblx0XHRcdFx0Y2xvc2VzdE9mZnNldFggPSBvZmZzZXRYO1xuXHRcdFx0XHRjbG9zZXN0T2Zmc2V0WSA9IG9mZnNldFk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNsb3Nlc3RQb2ludDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Q2xvc2VzdE5vZGUgPSBmdW5jdGlvbiAoJGNvb3JkLCAkbm9kZXMpXG57XG5cdHZhciBub2RlcyA9ICRub2RlcyB8fCB0aGlzLm5vZGVzO1xuXHR2YXIgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNsb3Nlc3Q7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gbm9kZXNbaV07XG5cdFx0dmFyIG9mZnNldFggPSAkY29vcmRbMF0gLSBub2RlLm9YO1xuXHRcdHZhciBvZmZzZXRZID0gJGNvb3JkWzFdIC0gbm9kZS5vWTtcblx0XHR2YXIgY1ggPSBNYXRoLmFicyhvZmZzZXRYKTtcblx0XHR2YXIgY1kgPSBNYXRoLmFicyhvZmZzZXRZKTtcblx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChjWCAqIGNYICsgY1kgKiBjWSk7XG5cdFx0aWYgKGRpc3QgPCBjbG9zZXN0RGlzdClcblx0XHR7XG5cdFx0XHRjbG9zZXN0ID0gbm9kZTtcblx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsb3Nlc3Q7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldE5vZGVzSW5zaWRlID0gZnVuY3Rpb24gKCRwb2ludHMpXG57XG5cdHZhciBQb2x5Z29uID0gcmVxdWlyZSgnLi9Qb2x5Z29uJyk7XG5cdHZhciB0b1JldHVybiA9IFtdO1xuXHR2YXIgcG9seWdvbiA9IFBvbHlnb24uaW5pdCgkcG9pbnRzKTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XG5cdFx0aWYgKHBvbHlnb24uaXNJbnNpZGUoW25vZGUub1gsIG5vZGUub1ldKSlcblx0XHR7XG5cdFx0XHR0b1JldHVybi5wdXNoKG5vZGUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdG9SZXR1cm47XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldEJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKClcbntcblx0dmFyIG1pblg7XG5cdHZhciBtYXhYO1xuXHR2YXIgbWluWTtcblx0dmFyIG1heFk7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xuXHRcdG1pblggPSBtaW5YID4gbm9kZS5vWCB8fCBtaW5YID09PSB1bmRlZmluZWQgPyBub2RlLm9YIDogbWluWDtcblx0XHRtYXhYID0gbWF4WCA8IG5vZGUub1ggfHwgbWF4WCA9PT0gdW5kZWZpbmVkID8gbm9kZS5vWCA6IG1heFg7XG5cdFx0bWluWSA9IG1pblkgPiBub2RlLm9ZIHx8IG1pblkgPT09IHVuZGVmaW5lZCA/IG5vZGUub1kgOiBtaW5ZO1xuXHRcdG1heFkgPSBtYXhZIDwgbm9kZS5vWSB8fCBtYXhZID09PSB1bmRlZmluZWQgPyBub2RlLm9ZIDogbWF4WTtcblx0fVxuXHRyZXR1cm4gW1ttaW5YLCBtaW5ZXSwgW21heFgsIG1heFldXTtcbn07XG5cbi8vVE9ETyA6IHRvIHJlbW92ZVxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5oaXRUZXN0ID0gZnVuY3Rpb24gKCRwb2ludClcbntcblx0dmFyIGN1cnJYID0gJHBvaW50WzBdO1xuXHR2YXIgY3VyclkgPSAkcG9pbnRbMV07XG5cdHZhciBib3VuZGluZyA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goKTtcblx0aWYgKGN1cnJYID49IGJvdW5kaW5nWzBdWzBdICYmIGN1cnJYIDw9IGJvdW5kaW5nWzFdWzBdICYmXG5cdFx0Y3VyclkgPj0gYm91bmRpbmdbMF1bMV0gJiYgY3VyclkgPD0gYm91bmRpbmdbMV1bMV0pXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZUpvaW50ID0gZnVuY3Rpb24gKCRub2RlQSwgJG5vZGVCLCAkdHlwZSlcbntcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmpvaW50cy5sZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJySm9pbnQgPSB0aGlzLmpvaW50c1tpXTtcblx0XHRpZiAoKGN1cnJKb2ludC5ub2RlQSA9PT0gJG5vZGVBICYmIGN1cnJKb2ludC5ub2RlQiA9PT0gJG5vZGVCKSB8fCAoY3VyckpvaW50Lm5vZGVCID09PSAkbm9kZUEgJiYgY3VyckpvaW50Lm5vZGVBID09PSAkbm9kZUIpKVxuXHRcdHtcblx0XHRcdC8vcmV0dXJuO1xuXHRcdFx0dGhpcy5qb2ludHMuc3BsaWNlKGksIDEpO1xuXHRcdFx0aSA9IGkgLSAxO1xuXHRcdH1cblx0fVxuXHR2YXIgam9pbnQgPSBuZXcgU1ZKZWxseUpvaW50KCRub2RlQSwgJG5vZGVCLCAkdHlwZSk7XG5cdHRoaXMuam9pbnRzLnB1c2goam9pbnQpO1xuXG5cdC8vdGhpcy5waHlzaWNzTWFuYWdlci5hZGRKb2ludFRvV29ybGQoam9pbnQpO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5hZGROb2Rlc1RvV29ybGQgPSBmdW5jdGlvbiAoKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZE5vZGVzVG9Xb3JsZCgpO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5hZGRKb2ludHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0dGhpcy5waHlzaWNzTWFuYWdlci5hZGRKb2ludHNUb1dvcmxkKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWSmVsbHlHcm91cDtcblxuIiwidmFyIFNWSmVsbHlKb2ludCA9IGZ1bmN0aW9uICgkbm9kZUEsICRub2RlQiwgJHR5cGUpXG57XG5cdHRoaXMubm9kZUEgPSAkbm9kZUE7XG5cdHRoaXMubm9kZUIgPSAkbm9kZUI7XG5cdHRoaXMudHlwZSA9ICR0eXBlIHx8ICdkZWZhdWx0Jztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseUpvaW50O1xuXG4iLCJ2YXIgU1ZKZWxseU5vZGUgPSBmdW5jdGlvbiAoJG9YLCAkb1ksICRvcHRpb25zKVxue1xuXHR0aGlzLmpvaW50c0FycmF5ID0gW107XG5cdHRoaXMub1ggPSAkb1g7XG5cdHRoaXMub1kgPSAkb1k7XG5cdHRoaXMuZHJhd2luZyA9IHVuZGVmaW5lZDtcblx0dGhpcy5maXhlZCA9IGZhbHNlO1xuXHR0aGlzLmlzU3RhcnQgPSBmYWxzZTtcblx0dGhpcy5lbmROb2RlID0gdW5kZWZpbmVkO1xuXHR0aGlzLnNldE9wdGlvbnMoJG9wdGlvbnMpO1xufTtcblxuLy9yYWNjb3VyY2lcblNWSmVsbHlOb2RlLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKCRvcHRpb25zKVxue1xuXHRpZiAoJG9wdGlvbnMpXG5cdHtcblx0XHQvLyB2YXIgPSAkID09PSB1bmRlZmluZWQgPyB7fSA6ICRvcHRpb25zO1xuXHRcdGlmICgkb3B0aW9ucy5maXhlZCAhPT0gdW5kZWZpbmVkKSB7IHRoaXMuZml4ZWQgPSAkb3B0aW9ucy5maXhlZDsgfVxuXHR9XG59O1xuXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuc2V0Rml4ZWQgPSBmdW5jdGlvbiAoJGZpeGVkKVxue1xuXHR0aGlzLmZpeGVkID0gJGZpeGVkO1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyLnNldEZpeGVkKCRmaXhlZCk7XG59O1xuXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuZ2V0WCA9IGZ1bmN0aW9uICgpXG57XG5cdHJldHVybiB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldFgoKTtcbn07XG5cbi8vcmFjY291cmNpXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuZ2V0WSA9IGZ1bmN0aW9uICgpXG57XG5cdHJldHVybiB0aGlzLnBoeXNpY3NNYW5hZ2VyLmdldFkoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU1ZKZWxseU5vZGU7XG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRleHRlbmQ6IGZ1bmN0aW9uICgkdG9FeHRlbmQsICRleHRlbnNpb24pXG5cdHtcblx0XHR2YXIgcmVjdXIgPSBmdW5jdGlvbiAoJG9iamVjdCwgJGV4dGVuZClcblx0XHR7XG5cdFx0XHRmb3IgKHZhciBuYW1lIGluICRleHRlbmQpXG5cdFx0XHR7XG5cdFx0XHRcdGlmICh0eXBlb2YgJGV4dGVuZFtuYW1lXSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoJGV4dGVuZFtuYW1lXSkgJiYgJGV4dGVuZFtuYW1lXSAhPT0gbnVsbClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgkb2JqZWN0W25hbWVdID09PSB1bmRlZmluZWQpIHsgJG9iamVjdFtuYW1lXSA9IHt9OyB9XG5cdFx0XHRcdFx0cmVjdXIoJG9iamVjdFtuYW1lXSwgJGV4dGVuZFtuYW1lXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JG9iamVjdFtuYW1lXSA9ICRleHRlbmRbbmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdHJlY3VyKCR0b0V4dGVuZCwgJGV4dGVuc2lvbik7XG5cblx0XHRyZXR1cm4gJHRvRXh0ZW5kO1xuXHR9XG59O1xuXG4iLCJ2YXIgU1ZKZWxseUdyb3VwID0gcmVxdWlyZSgnLi9TVkplbGx5R3JvdXAnKTtcbnZhciBTdHJ1Y3R1cmUgPSByZXF1aXJlKCcuL1N0cnVjdHVyZScpO1xuXG52YXIgU1ZKZWxseVdvcmxkID0gZnVuY3Rpb24gKCRwaHlzaWNzTWFuYWdlciwgJGNvbmYpXG57XG5cdHRoaXMucGh5c2ljc01hbmFnZXIgPSAkcGh5c2ljc01hbmFnZXI7XG5cdHRoaXMuZ3JvdXBzID0gW107XG5cdHRoaXMuY29uZiA9ICRjb25mO1xuXHR0aGlzLndvcmxkTm9kZXMgPSBbXTtcblx0dGhpcy5ncm91cENvbnN0cmFpbnRzID0gW107XG5cdHRoaXMud29ybGRXaWR0aCA9IHRoaXMucGh5c2ljc01hbmFnZXIud29ybGRXaWR0aCA9ICRjb25mLndvcmxkV2lkdGg7XG59O1xuXG5TVkplbGx5V29ybGQucHJvdG90eXBlLnNldEhlaWdodCA9IGZ1bmN0aW9uICgkaGVpZ2h0KVxue1xuXHR0aGlzLndvcmxkSGVpZ2h0ID0gdGhpcy5waHlzaWNzTWFuYWdlci53b3JsZEhlaWdodCA9ICRoZWlnaHQ7XG59O1xuXG5TVkplbGx5V29ybGQucHJvdG90eXBlLmdldFdpZHRoID0gZnVuY3Rpb24gKClcbntcblx0cmV0dXJuIHRoaXMud29ybGRXaWR0aDtcbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuZ2V0R3JvdXBCeUlEID0gZnVuY3Rpb24gKCRJRClcbntcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMuZ3JvdXBzW2ldO1xuXHRcdGlmIChjdXJyR3JvdXAuSUQgPT09ICRJRCkgeyByZXR1cm4gY3Vyckdyb3VwOyB9XG5cdH1cbn07XG5cblNWSmVsbHlXb3JsZC5wcm90b3R5cGUuY3JlYXRlR3JvdXAgPSBmdW5jdGlvbiAoJHR5cGUsICRJRClcbntcblx0dmFyIGNvbmYgPSB0aGlzLmNvbmYuZ3JvdXBzWyR0eXBlXSB8fCB0aGlzLmNvbmYuZ3JvdXBzLmRlZmF1bHQ7XG5cdHZhciBncm91cCA9IG5ldyBTVkplbGx5R3JvdXAoJHR5cGUsIGNvbmYsICRJRCk7XG5cdGdyb3VwLnBoeXNpY3NNYW5hZ2VyID0gdGhpcy5waHlzaWNzTWFuYWdlci5nZXRHcm91cFBoeXNpY3NNYW5hZ2VyKGdyb3VwKTtcblx0Z3JvdXAuc3RydWN0dXJlID0gbmV3IFN0cnVjdHVyZShncm91cCwgdGhpcyk7XG5cdHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xuXHRyZXR1cm4gZ3JvdXA7XG59O1xuXG5TVkplbGx5V29ybGQucHJvdG90eXBlLmNvbnN0cmFpbkdyb3VwcyA9IGZ1bmN0aW9uICgkZ3JvdXBBLCAkZ3JvdXBCLCAkcG9pbnRzLCAkdHlwZSlcbntcblx0dmFyIHBvaW50cyA9ICRwb2ludHM7XG5cdHZhciBncm91cEEgPSAkZ3JvdXBBO1xuXHR2YXIgZ3JvdXBCID0gJGdyb3VwQjtcblxuXHRpZiAocG9pbnRzLmxlbmd0aCA8IDMpXG5cdHtcblx0XHR2YXIgYW5jaG9yQSA9IGdyb3VwQS5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JGcm9tTGluZShwb2ludHMpO1xuXHRcdHBvaW50cy5zcGxpY2UocG9pbnRzLmluZGV4T2YoYW5jaG9yQS5wb2ludCksIDEpO1xuXHRcdHZhciBhbmNob3JCID0gZ3JvdXBCID8gZ3JvdXBCLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUFuY2hvckZyb21Qb2ludChwb2ludHNbMF0pIDogdGhpcy5waHlzaWNzTWFuYWdlci5jcmVhdGVHaG9zdEFuY2hvckZyb21Qb2ludChwb2ludHNbMF0pO1xuXHRcdHRoaXMuZ3JvdXBDb25zdHJhaW50cy5wdXNoKHsgYW5jaG9yQTogYW5jaG9yQSwgYW5jaG9yQjogYW5jaG9yQiwgdHlwZTogJHR5cGUgfSk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0dmFyIGFuY2hvcnNBID0gZ3JvdXBBLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUFuY2hvcnMocG9pbnRzKTtcblx0XHR2YXIgYW5jaG9yc0IgPSBncm91cEIgPyBncm91cEIucGh5c2ljc01hbmFnZXIuY3JlYXRlQW5jaG9ycyhwb2ludHMpIDogW107XG5cdFx0Ly9jb25zb2xlLmxvZygnQScsIGdyb3VwQS5JRCwgYW5jaG9yc0EubGVuZ3RoLCAnQicsIGdyb3VwQiA/IGdyb3VwQi5JRCA6IGdyb3VwQik7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIG5vZGVzTGVuZ3RoID0gYW5jaG9yc0EubGVuZ3RoOyBpIDwgbm9kZXNMZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyckFuY2hvckEgPSBhbmNob3JzQVtpXTtcblx0XHRcdGlmICghZ3JvdXBCKVxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyQW5jaG9yQS5zZXRGaXhlZCh0cnVlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIGFuY2hvcnNCTGVuZ3RoID0gYW5jaG9yc0IubGVuZ3RoOyBrIDwgYW5jaG9yc0JMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyQW5jaG9yQiA9IGFuY2hvcnNCW2tdO1xuXHRcdFx0XHRcdHRoaXMuZ3JvdXBDb25zdHJhaW50cy5wdXNoKHsgYW5jaG9yQTogY3VyckFuY2hvckEsIGFuY2hvckI6IGN1cnJBbmNob3JCLCB0eXBlOiAkdHlwZSB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5hZGRHcm91cHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0Zm9yICh2YXIgaSA9IDAsIGdyb3Vwc0xlbmd0aCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDsgaSA8IGdyb3Vwc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMuZ3JvdXBzW2ldO1xuXHRcdGN1cnJHcm91cC5hZGROb2Rlc1RvV29ybGQoKTtcblx0XHRjdXJyR3JvdXAuYWRkSm9pbnRzVG9Xb3JsZCgpO1xuXHRcdHRoaXMud29ybGROb2RlcyA9IHRoaXMud29ybGROb2Rlcy5jb25jYXQoY3Vyckdyb3VwLm5vZGVzKTtcblx0fVxuXG5cdHZhciB0b0NvbnN0cmFpbkxlbmd0aCA9IHRoaXMuZ3JvdXBDb25zdHJhaW50cy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCB0b0NvbnN0cmFpbkxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUb0NvbnN0cmFpbiA9IHRoaXMuZ3JvdXBDb25zdHJhaW50c1tpXTtcblx0XHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmNvbnN0cmFpbkdyb3VwcyhjdXJyVG9Db25zdHJhaW4uYW5jaG9yQSwgY3VyclRvQ29uc3RyYWluLmFuY2hvckIsIGN1cnJUb0NvbnN0cmFpbi50eXBlKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkplbGx5V29ybGQ7XG5cbiIsInZhciBUcmlhbmd1bGF0b3IgPSByZXF1aXJlKCcuL1RyaWFuZ3VsYXRvcicpO1xudmFyIFBvbHlnb24gPSByZXF1aXJlKCcuL1BvbHlnb24nKTtcbnZhciBHcmlkID0gcmVxdWlyZSgnLi9HcmlkJyk7XG52YXIgQ29tbWFuZHMgPSByZXF1aXJlKCcuL0NvbW1hbmRzJyk7XG5cbnZhciBTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJGdyb3VwLCAkd29ybGQpXG57XG5cdHRoaXMud29ybGQgPSAkd29ybGQ7XG5cdHRoaXMuZ3JvdXAgPSAkZ3JvdXA7XG5cdHRoaXMuaW5uZXJTdHJ1Y3R1cmUgPSB1bmRlZmluZWQ7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uICgkZHJhd2luZ0NvbW1hbmRzKVxue1xuXHR2YXIgbm9kZXNUb0RyYXc7XG5cblx0dGhpcy5wb2ludHMgPSB0aGlzLmdldFBvaW50cygkZHJhd2luZ0NvbW1hbmRzKTtcblx0dGhpcy5kcmF3aW5nQ29tbWFuZHMgPSAkZHJhd2luZ0NvbW1hbmRzO1xuXG5cdC8vIGNvbnNvbGUubG9nKCdwb2ludHMnLCBwb2ludHMubGVuZ3RoLCB0aGlzLmdyb3VwLmNvbmYuc3RydWN0dXJlKTtcblxuXHR0aGlzLmFyZWEgPSB0aGlzLmNhbGN1bGF0ZUFyZWEodGhpcy5wb2ludHMsICRkcmF3aW5nQ29tbWFuZHMpO1xuXHR0aGlzLnJhZGl1c1ggPSAkZHJhd2luZ0NvbW1hbmRzLnJhZGl1c1g7XG5cdHRoaXMucmFkaXVzWSA9ICRkcmF3aW5nQ29tbWFuZHMucmFkaXVzWTtcblxuXHRzd2l0Y2ggKHRoaXMuZ3JvdXAuY29uZi5zdHJ1Y3R1cmUpXG5cdHtcblx0XHRjYXNlICd0cmlhbmd1bGF0ZSc6XG5cdFx0XHR0aGlzLnJlbW92ZUR1cGxpY2F0ZXModGhpcy5kcmF3aW5nQ29tbWFuZHMpO1xuXHRcdFx0dmFyIHRyaVBvaW50cyA9IHRoaXMuZ2V0UG9pbnRzKHRoaXMuZHJhd2luZ0NvbW1hbmRzKTtcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5jcmVhdGVOb2Rlc0Zyb21Qb2ludHModHJpUG9pbnRzKTtcblx0XHRcdHRoaXMuc2V0Tm9kZURyYXdpbmdDb21tYW5kcyhub2Rlc1RvRHJhdyk7XG5cdFx0XHR0aGlzLmNyZWF0ZUpvaW50c0Zyb21UcmlhbmdsZXModHJpUG9pbnRzKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2xpbmUnOlxuXHRcdFx0bm9kZXNUb0RyYXcgPSB0aGlzLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyh0aGlzLnBvaW50cyk7XG5cdFx0XHR0aGlzLnNldE5vZGVEcmF3aW5nQ29tbWFuZHMobm9kZXNUb0RyYXcpO1xuXHRcdFx0dGhpcy5jcmVhdGVKb2ludHNGcm9tUG9pbnRzKHRoaXMucG9pbnRzLCB0cnVlKTtcblx0XHRcdC8vbm9kZXNUb0RyYXdbMF0uZml4ZWQgPSB0cnVlOy8vdG8gcmVtb3ZlIGxhdGVyIG1heWJlID9cblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ3ByZWNpc2VIZXhhRmlsbCc6XG5cdFx0XHRub2Rlc1RvRHJhdyA9IHRoaXMuY3JlYXRlUHJlY2lzZUhleGFGaWxsU3RydWN0dXJlKHRoaXMucG9pbnRzKTtcblx0XHRcdC8vIHN0cnVjdHVyZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKCRlbGVtZW50KSB7ICRlbGVtZW50LmRyYXdpbmcgPSB7IG5vdFRvRHJhdzogdHJ1ZSB9OyB9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2hleGFGaWxsJzpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5jcmVhdGVIZXhhRmlsbFN0cnVjdHVyZSh0aGlzLnBvaW50cyk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdzaW1wbGUnOlxuXHRcdFx0bm9kZXNUb0RyYXcgPSB0aGlzLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyh0aGlzLnBvaW50cyk7XG5cdFx0XHR0aGlzLmNyZWF0ZUpvaW50c0Zyb21Qb2ludHModGhpcy5wb2ludHMpO1xuXHRcdFx0dGhpcy5zZXROb2RlRHJhd2luZ0NvbW1hbmRzKG5vZGVzVG9EcmF3KTtcblx0XHRicmVhaztcblx0XHRkZWZhdWx0OlxuXHRcdFx0bm9kZXNUb0RyYXcgPSB0aGlzLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyh0aGlzLnBvaW50cyk7XG5cdFx0XHR0aGlzLnNldE5vZGVEcmF3aW5nQ29tbWFuZHMobm9kZXNUb0RyYXcpO1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHRyZXR1cm4gbm9kZXNUb0RyYXc7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNhbGN1bGF0ZUFyZWEgPSBmdW5jdGlvbiAoJHBvaW50cywgJGRyYXdpbmdDb21tYW5kcylcbntcblx0aWYgKCRkcmF3aW5nQ29tbWFuZHMudHlwZSA9PT0gJ2VsbGlwc2UnKVxuXHR7XG5cdFx0cmV0dXJuIE1hdGgucG93KE1hdGguUEkgKiAkZHJhd2luZ0NvbW1hbmRzLnJhZGl1c1gsIDIpO1xuXHR9XG5cdGlmICh0aGlzLmdyb3VwLmNvbmYuc3RydWN0dXJlICE9PSAnbGluZScpXG5cdHtcblx0XHR2YXIgcG9seWdvbiA9IFBvbHlnb24uaW5pdCgkcG9pbnRzKTtcblx0XHRyZXR1cm4gcG9seWdvbi5nZXRBcmVhKCk7XG5cdH1cblx0ZWxzZVxuXHR7XG5cdFx0dmFyIGFyZWEgPSAwO1xuXHRcdGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSAkcG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyUG9pbnQgPSAkcG9pbnRzW2ldO1xuXHRcdFx0dmFyIGxhc3RQb2ludCA9ICRwb2ludHNbaSAtIDFdO1xuXHRcdFx0dmFyIGRYID0gTWF0aC5hYnMoY3VyclBvaW50WzBdIC0gbGFzdFBvaW50WzBdKTtcblx0XHRcdHZhciBkWSA9IE1hdGguYWJzKGN1cnJQb2ludFsxXSAtIGxhc3RQb2ludFsxXSk7XG5cdFx0XHRhcmVhICs9IE1hdGguc3FydChkWCAqIGRYICsgZFkgKiBkWSk7XG5cdFx0XHRhcmVhID0gYXJlYSAqIDAuNSArIGFyZWEgKiAkZHJhd2luZ0NvbW1hbmRzLnRoaWNrbmVzcyAqIDAuNTtcblx0XHR9XG5cdFx0cmV0dXJuIGFyZWE7XG5cdH1cbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlSGV4YUZpbGxTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJHBvaW50cylcbntcblx0dGhpcy5jcmVhdGVJbm5lclN0cnVjdHVyZSgkcG9pbnRzKTtcblx0dmFyIHBhdGggPSB0aGlzLmlubmVyU3RydWN0dXJlLmdldFNoYXBlUGF0aCgpO1xuXHR2YXIgbm9kZXNUb0RyYXcgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHBhdGgubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocGF0aFtpXVswXSwgcGF0aFtpXVsxXSk7XG5cdFx0bm9kZXNUb0RyYXcucHVzaChub2RlKTtcblx0XHRub2RlLmRyYXdpbmcgPSB7fTtcblx0XHRub2RlLmRyYXdpbmcuY29tbWFuZCA9IGkgPT09IDAgPyBDb21tYW5kcy5NT1ZFX1RPIDogQ29tbWFuZHMuTElORV9UTztcblx0XHRub2RlLmRyYXdpbmcucG9pbnQgPSBbcGF0aFtpXVswXSwgcGF0aFtpXVsxXV07XG5cdFx0bm9kZS5kcmF3aW5nLm9wdGlvbnMgPSBbXTtcblx0fVxuXHRyZXR1cm4gbm9kZXNUb0RyYXc7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLnNldE5vZGVEcmF3aW5nQ29tbWFuZHMgPSBmdW5jdGlvbiAoJG5vZGVzKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gJG5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSAkbm9kZXNbaV07XG5cdFx0bm9kZS5kcmF3aW5nID0gdGhpcy5kcmF3aW5nQ29tbWFuZHMucG9pbnRDb21tYW5kc1tpXTtcblx0fVxufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVQcmVjaXNlSGV4YUZpbGxTdHJ1Y3R1cmUgPSBmdW5jdGlvbiAoJHBvaW50cylcbntcblx0dmFyIG5vZGVzVG9EcmF3ID0gdGhpcy5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMoJHBvaW50cyk7XG5cdHRoaXMuc2V0Tm9kZURyYXdpbmdDb21tYW5kcyhub2Rlc1RvRHJhdyk7XG5cdHRoaXMuY3JlYXRlSW5uZXJTdHJ1Y3R1cmUoJHBvaW50cyk7XG5cblx0dGhpcy5jcmVhdGVKb2ludHNGcm9tUG9pbnRzKCRwb2ludHMsIGZhbHNlKTtcblx0dmFyIGkgPSAwO1xuXHR2YXIgbGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7XG5cdGZvciAoaTsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0dmFyIGNsb3Nlc3QgPSB0aGlzLmlubmVyU3RydWN0dXJlLmdldENsb3Nlc3QoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0sIDIpO1xuXHRcdGZvciAodmFyIGsgPSAwLCBjbG9zZXN0TGVuZ3RoID0gY2xvc2VzdC5sZW5ndGg7IGsgPCBjbG9zZXN0TGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJDbG9zZXN0ID0gY2xvc2VzdFtrXTtcblx0XHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0pO1xuXHRcdFx0dmFyIG4yID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyQ2xvc2VzdFswXSwgY3VyckNsb3Nlc3RbMV0pO1xuXHRcdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMSwgbjIpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbm9kZXNUb0RyYXc7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZUpvaW50c0Zyb21UcmlhbmdsZXMgPSBmdW5jdGlvbiAoJHBvaW50cylcbntcblx0dmFyIHRyaWFuZ3VsYXRvciA9IG5ldyBUcmlhbmd1bGF0b3IoKTtcblx0dmFyIHRyaWFuZ2xlcyA9IHRyaWFuZ3VsYXRvci50cmlhbmd1bGF0ZSgkcG9pbnRzKTtcblxuXHR2YXIgdHJpYW5nbGVzTGVuZ3RoID0gdHJpYW5nbGVzLmxlbmd0aDtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0cmlhbmdsZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyVHJpYW5nbGUgPSB0cmlhbmdsZXNbaV07XG5cdFx0dmFyIG4wID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyVHJpYW5nbGVbMF0ueCwgY3VyclRyaWFuZ2xlWzBdLnkpO1xuXHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclRyaWFuZ2xlWzFdLngsIGN1cnJUcmlhbmdsZVsxXS55KTtcblx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJUcmlhbmdsZVsyXS54LCBjdXJyVHJpYW5nbGVbMl0ueSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMCwgbjEpO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50KG4yLCBuMCk7XG5cdH1cbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuZ2V0UG9pbnRzID0gZnVuY3Rpb24gKCRkcmF3aW5nQ29tbWFuZHMpXG57XG5cdHZhciBwb2ludHMgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9ICRkcmF3aW5nQ29tbWFuZHMucG9pbnRDb21tYW5kcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyID0gJGRyYXdpbmdDb21tYW5kcy5wb2ludENvbW1hbmRzW2ldO1xuXHRcdHBvaW50cy5wdXNoKGN1cnIucG9pbnQpO1xuXHR9XG5cdHJldHVybiBwb2ludHM7XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyA9IGZ1bmN0aW9uICgkcG9pbnRzKVxue1xuXHR2YXIgcG9pbnRzTGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7XG5cdHZhciB0b1JldHVybiA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBvaW50c0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJQb2ludCA9ICRwb2ludHNbaV07XG5cdFx0dmFyIG5vZGUgPSB0aGlzLmdyb3VwLmNyZWF0ZU5vZGUoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0sIHVuZGVmaW5lZCwgZmFsc2UpO1xuXHRcdHRvUmV0dXJuLnB1c2gobm9kZSk7XG5cdH1cblx0cmV0dXJuIHRvUmV0dXJuO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5yZW1vdmVEdXBsaWNhdGVzID0gZnVuY3Rpb24gKCRkcmF3aW5nQ29tbWFuZHMpXG57XG5cdHZhciB2aXNpdGVkUG9pbnRzID0gW107XG5cdHZhciBjb21tYW5kcyA9ICRkcmF3aW5nQ29tbWFuZHMucG9pbnRDb21tYW5kcztcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb21tYW5kcy5sZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBwb2ludCA9IGNvbW1hbmRzW2ldLnBvaW50O1xuXHRcdGZvciAodmFyIGsgPSAwOyBrIDwgdmlzaXRlZFBvaW50cy5sZW5ndGg7IGsgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgdmlzaXRlZCA9IHZpc2l0ZWRQb2ludHNba107XG5cdFx0XHRpZiAodmlzaXRlZFswXSA9PT0gcG9pbnRbMF0gJiYgdmlzaXRlZFsxXSA9PT0gcG9pbnRbMV0pXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGksICdkdXBsaWNhdGUgZm91bmQgIScsIHZpc2l0ZWRbMF0sIHZpc2l0ZWRbMV0sIHBvaW50WzBdLCBwb2ludFsxXSk7XG5cdFx0XHRcdGNvbW1hbmRzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0aSA9IGkgLSAxO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2aXNpdGVkUG9pbnRzLnB1c2gocG9pbnQpO1xuXHR9XG59O1xuXG5TdHJ1Y3R1cmUucHJvdG90eXBlLmNyZWF0ZUlubmVyU3RydWN0dXJlID0gZnVuY3Rpb24gKCRwb2ludHMpXG57XG5cdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRwb2ludHMpO1xuXHR2YXIgZGlhbSA9IHRoaXMud29ybGQuZ2V0V2lkdGgoKSAqIHRoaXMuZ3JvdXAuY29uZi5pbm5lclN0cnVjdHVyZURlZjsvL3dpZHRoIC8gMTA7Ly90aGlzLndvcmxkLmdldFdpZHRoKCkgLyAzMDtcblx0dGhpcy5pbm5lclJhZGl1cyA9IHRoaXMuZ3JvdXAuY29uZi5ub2RlUmFkaXVzIHx8IGRpYW0gLyAyO1xuXHR0aGlzLmlubmVyU3RydWN0dXJlID0gR3JpZC5jcmVhdGVGcm9tUG9seWdvbihwb2x5Z29uLCBkaWFtLCB0cnVlKTtcblx0dGhpcy5zdHJ1Y3R1cmVOb2RlcyA9IHRoaXMuY3JlYXRlTm9kZXNGcm9tUG9pbnRzKHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0Tm9kZXNBcnJheSgpKTtcblxuXHR2YXIgbmV0d29yayA9IHRoaXMuaW5uZXJTdHJ1Y3R1cmUuZ2V0TmV0d29yaygpO1xuXHR2YXIgaSA9IDA7XG5cdHZhciBsZW5ndGggPSBuZXR3b3JrLmxlbmd0aDtcblx0Zm9yIChpOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyckxpbmsgPSBuZXR3b3JrW2ldO1xuXHRcdHZhciBuMSA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyckxpbmtbMF1bMF0sIGN1cnJMaW5rWzBdWzFdKTtcblx0XHR2YXIgbjIgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJMaW5rWzFdWzBdLCBjdXJyTGlua1sxXVsxXSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMSwgbjIpO1xuXHR9XG5cdHJldHVybiB0aGlzLnN0cnVjdHVyZU5vZGVzO1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVKb2ludHNGcm9tUG9pbnRzID0gZnVuY3Rpb24gKCRwb2ludHMsICRub0Nsb3NlKVxue1xuXHR2YXIgcG9pbnRzTGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7XG5cdGZvciAodmFyIGkgPSAxOyBpIDwgcG9pbnRzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclBvaW50ID0gJHBvaW50c1tpXTtcblx0XHR2YXIgbGFzdFBvaW50ID0gJHBvaW50c1tpIC0gMV07XG5cdFx0dmFyIGxhc3ROb2RlID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChsYXN0UG9pbnRbMF0sIGxhc3RQb2ludFsxXSk7XG5cdFx0dmFyIGN1cnJOb2RlID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChsYXN0Tm9kZSwgY3Vyck5vZGUpO1xuXHRcdGlmIChpID09PSBwb2ludHNMZW5ndGggLSAxICYmICRub0Nsb3NlICE9PSB0cnVlKVxuXHRcdHtcblx0XHRcdHZhciBmaXJzdE5vZGUgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KCRwb2ludHNbMF1bMF0sICRwb2ludHNbMF1bMV0pO1xuXHRcdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChjdXJyTm9kZSwgZmlyc3ROb2RlKTtcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RydWN0dXJlO1xuXG4iLCJ2YXIgcG9seTJ0cmkgPSByZXF1aXJlKCcuLi8uLi9saWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmknKTtcblxudmFyIFRyaWFuZ3VsYXRvciA9IGZ1bmN0aW9uICgpXG57XG59O1xuXG5Ucmlhbmd1bGF0b3IucHJvdG90eXBlLnRyaWFuZ3VsYXRlID0gZnVuY3Rpb24gKCRjb29yZHMpXG57XG5cdHZhciBwb2x5MnRyaUNvbnRvdXIgPSBbXTtcblx0Ly9kZWJ1Z2dlcjtcblxuXHRmb3IgKHZhciBpID0gMCwgcG9pbnRzTGVuZ3RoID0gJGNvb3Jkcy5sZW5ndGg7IGkgPCBwb2ludHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBwb2ludCA9ICRjb29yZHNbaV07XG5cdFx0cG9seTJ0cmlDb250b3VyLnB1c2gobmV3IHBvbHkydHJpLlBvaW50KHBvaW50WzBdLCBwb2ludFsxXSkpO1xuXHR9XG5cblx0dmFyIHN3Y3R4O1xuXHR0cnlcblx0e1xuXHRcdC8vIHByZXBhcmUgU3dlZXBDb250ZXh0XG5cdFx0c3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KHBvbHkydHJpQ29udG91ciwgeyBjbG9uZUFycmF5czogdHJ1ZSB9KTtcblxuXHRcdC8vIHRyaWFuZ3VsYXRlXG5cdFx0c3djdHgudHJpYW5ndWxhdGUoKTtcblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXHRcdHRocm93IGU7XG5cdFx0Ly8gY29uc29sZS5sb2coZSk7XG5cdFx0Ly8gY29uc29sZS5sb2coZS5wb2ludHMpO1xuXHR9XG5cdHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcblxuXHR2YXIgcG9pbnRzQXJyYXkgPSBbXTtcblxuXHR2YXIgdHJpYW5nbGVzTGVuZ3RoID0gdHJpYW5nbGVzLmxlbmd0aDtcblx0Zm9yIChpID0gMDsgaSA8IHRyaWFuZ2xlc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUcmlhbmdsZSA9IHRyaWFuZ2xlc1tpXTtcblx0XHQvKmpzaGludCBjYW1lbGNhc2U6ZmFsc2UqL1xuXHRcdC8vanNjczpkaXNhYmxlIGRpc2FsbG93RGFuZ2xpbmdVbmRlcnNjb3Jlc1xuXHRcdHBvaW50c0FycmF5LnB1c2goY3VyclRyaWFuZ2xlLnBvaW50c18pO1xuXHRcdC8vanNjczplbmFibGUgZGlzYWxsb3dEYW5nbGluZ1VuZGVyc2NvcmVzXG5cdFx0Lypqc2hpbnQgY2FtZWxjYXNlOnRydWUqL1xuXHR9XG5cblx0cmV0dXJuIHBvaW50c0FycmF5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmlhbmd1bGF0b3I7XG5cbiIsIm1vZHVsZS5leHBvcnRzID1cbntcblx0Q29uZk9iamVjdDogcmVxdWlyZSgnLi9jb3JlL0NvbmZPYmplY3QnKSxcblx0R3JpZDogcmVxdWlyZSgnLi9jb3JlL0dyaWQnKSxcblx0UG9seWdvbjogcmVxdWlyZSgnLi9jb3JlL1BvbHlnb24nKSxcblx0U3RydWN0dXJlOiByZXF1aXJlKCcuL2NvcmUvU3RydWN0dXJlJyksXG5cdFNWR1BhcnNlcjogcmVxdWlyZSgnLi9jb3JlL1NWR1BhcnNlcicpLFxuXHRTVkplbGx5R3JvdXA6IHJlcXVpcmUoJy4vY29yZS9TVkplbGx5R3JvdXAnKSxcblx0U1ZKZWxseUpvaW50OiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseUpvaW50JyksXG5cdFNWSmVsbHlOb2RlOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseU5vZGUnKSxcblx0U1ZKZWxseVV0aWxzOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseVV0aWxzJyksXG5cdFNWSmVsbHlXb3JsZDogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlXb3JsZCcpLFxuXHRUcmlhbmd1bGF0b3I6IHJlcXVpcmUoJy4vY29yZS9Ucmlhbmd1bGF0b3InKSxcblx0Tm9kZUdyYXBoOiByZXF1aXJlKCcuL2NvcmUvTm9kZUdyYXBoJyksXG59O1xuXG4iXX0=
