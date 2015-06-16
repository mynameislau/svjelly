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
	worldWidth: 60,
	wind: 1,
	debug: false,
	simRenderFreq: 50,
	gravity: [0, -9.8],
	groups:
	{
		default: { physics: { bodyType: 'ghost' } },
		ghost: { physics: { bodyType: 'ghost' } },
		soft:
		{
			structure: 'triangulate',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 100000,
					relaxation: 1
				},
				nodeRadius: 0.1,
				mass: 1
			}
		},
		tree:
		{
			structure: 'triangulate',
			physics:
			{
				distanceConstraint:null,
				lockConstraint:
				{
					stiffness: 1000000,
					relaxation: 0.9
				},
				mass: 10,
				damping: 0.8,
				nodeRadius: 0.1,
				structuralMassDecay: 6
			}
		},
		flora:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 100000,
					relaxation: 1
				},
				mass: 100,
				nodeRadius: 0.1,
				structuralMassDecay: true
			}
		},
		jelly:
		{
			structure: 'hexaFill',
			innerStructureDef: 0.01,
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 1000000,
					relaxation: 10
				},
				mass: 10
			}
		},
		line:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint: null,
				lockConstraint:
				{
					stiffness: 10,
					relaxation: 1
				},
				nodeRadius: 0.1,
				mass: 1
			}
		},
		rope:
		{
			structure: 'line',
			physics:
			{
				distanceConstraint:
				{
					stiffness: 1000,
					relaxation: 1
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
				mass: 0.1,
				gravityScale: 0,
				bodyType: 'hard',
				noCollide: true
			}
		},
		metal:
		{
			physics:
			{
				mass: 100,
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
				mass: 1,
				gravityScale: -10,
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
	var elementsQuery = '*:not(defs):not(g):not(title):not(linearGradient):not(radialGradient):not(stop):not([id*="joint"]):not([id*="constraint"])';
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

		var elementProperties = this.parseElement(rawElement);
		var nodesToDraw = currGroup.structure.create(elementProperties);
		this.setGraphicInstructions(currGroup, rawElement, nodesToDraw, elementProperties);

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
	var groupElement = (!$rawGroup.id || $rawGroup.id.indexOf('svg') === 0) && $rawGroup.parentNode.tagName !== 'svg' ? $rawGroup.parentNode : $rawGroup;
	var type;
	var ID;
	var regex = /([a-z\d]+)\w*/igm;
	var first = regex.exec(groupElement.id);
	var second = regex.exec(groupElement.id);
	//if (first) { type = second ? second[1] : first[1]; }
	//var groupType = groupElement.id.match();
	//if (groupType) { return groupType[1] || groupType[0]; }
	//automatic for lines
	// if (!first && (groupElement.querySelectorAll(lineTags).length > 0 || groupElement.tagName.search(isLine) > -1))
	// {
	// 	type = 'line';
	// }
	type = first ? first[1] : undefined;
	ID = second ? second[1] : null;
	var title = groupElement.querySelector('title');
	if (ID === null) { ID = title ? title.nodeValue : ID; }
	// if ($rawGroup.parentNode.id === 'tree-tree')
	// {
	// 	console.log($rawGroup, $rawGroup.id, type, ID);
	// 	debugger;
	// }

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

// SVGParser.prototype.parseElements = function ($elements, $group)
// {
// 	for (var i = 0, elementsLength = $elements.length; i < elementsLength; i += 1)
// 	{
// 		var rawElement = $elements[i];

// 		var element = this.parseElement(rawElement);

// 		var nodesToDraw = $group.structure.create(element);
// 		this.setGraphicInstructions($group, rawElement, nodesToDraw, element);
// 	}
// };

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

SVGParser.prototype.setGraphicInstructions = function ($group, $raw, $nodesToDraw, $elementProperties)
{
	var drawing = $group.drawing = {};
	drawing.nodes = $nodesToDraw;
	var props = drawing.properties = {};
	//ordering nodesToDraw so the path is drawn correctly
	for (var i = 0, length = $nodesToDraw.length; i < length; i += 1)
	{
		var currNode = $nodesToDraw[i];
		//currNode.drawing = {};
		currNode.drawing = $elementProperties.pointInfos[i];
		$group.nodes.splice($group.nodes.indexOf(currNode), 1);
		$group.nodes.splice(i, 0, currNode);
	}
	$nodesToDraw[0].drawing.isStart = true;
	$nodesToDraw[$nodesToDraw.length - 1].drawing.isEnd = true;
	$nodesToDraw[0].drawing.endNode = $nodesToDraw[$nodesToDraw.length - 1];

	var rawFill = $raw.getAttribute('fill');
	var rawStrokeWidth = $raw.getAttribute('stroke-width');
	var rawStroke = $raw.getAttribute('stroke');
	var rawLinecap = $raw.getAttribute('stroke-linecap');
	var rawLinejoin = $raw.getAttribute('stroke-linejoin');
	var rawOpacity = $raw.getAttribute('opacity');

	props.fill = rawFill || '#000000';
	props.lineWidth = rawStrokeWidth * this.ratio || 0;
	props.stroke = rawStroke && props.lineWidth !== 0 ? rawStroke : 'none';
	props.lineCap = rawLinecap && rawLinecap !== 'null' ? rawLinecap : 'butt';
	props.lineJoin = rawLinejoin && rawLinejoin !== 'null' ? rawLinejoin : 'miter';
	props.opacity = rawOpacity || 1;

	props.closePath = $group.conf.structure !== 'line' && $group.structure.radiusX === undefined;

	props.radiusX = $elementProperties.radiusX;
	props.radiusY = $elementProperties.radiusY;

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
		if (gradientElement.tagName !== 'linearGradient' && gradientElement.tagName !== 'radialGradient') { return; }

		var gradient = { stops: [], type: gradientElement.tagName };

		if (gradientElement.tagName === 'linearGradient')
		{
			gradient.x1 = this.getCoord(gradientElement.getAttribute('x1'));
			gradient.y1 = this.getCoord(gradientElement.getAttribute('y1'));
			gradient.x2 = this.getCoord(gradientElement.getAttribute('x2'));
			gradient.y2 = this.getCoord(gradientElement.getAttribute('y2'));
		}
		if (gradientElement.tagName === 'radialGradient')
		{
			gradient.cx = this.getCoord(gradientElement.getAttribute('cx'));
			gradient.cy = this.getCoord(gradientElement.getAttribute('cy'));
			gradient.fx = this.getCoord(gradientElement.getAttribute('fx'));
			gradient.fy = this.getCoord(gradientElement.getAttribute('fy'));
			gradient.r = this.getCoord(gradientElement.getAttribute('r'));
		}

		var stops = gradientElement.querySelectorAll('stop');
		for (var k = 0, stopLength = stops.length; k < stopLength; k += 1)
		{
			var currStop = stops[k];
			var offset = Number(currStop.getAttribute('offset'));
			var color = currStop.getAttribute('stop-color') || /stop-color:(#[0-9A-F]+)/im.exec(currStop.getAttribute('style'))[1];
			var opacity = currStop.getAttribute('stop-opacity');
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
	var radiusY = this.getCoord(radiusAttrY) || undefined;
	return { type: 'ellipse', points: [[xPos, yPos]], radiusX: radiusX, radiusY: radiusY };
};

SVGParser.prototype.parseLine = function ($rawLine)
{
	var x1 = this.getCoord($rawLine.getAttribute('x1'));
	var x2 = this.getCoord($rawLine.getAttribute('x2'));
	var y1 = this.getCoord($rawLine.getAttribute('y1'));
	var y2 = this.getCoord($rawLine.getAttribute('y2'));
	var points = [];
	points.push([x1, y1]);
	points.push([x2, y2]);
	var thickness = this.getCoord($rawLine.getAttribute('stroke-width'));
	return { type: 'line', points: points, thickness: thickness };
};

SVGParser.prototype.parseRect = function ($rawRect)
{
	var x1 = $rawRect.getAttribute('x') ? this.getCoord($rawRect.getAttribute('x')) : 0;
	var y1 = $rawRect.getAttribute('y') ? this.getCoord($rawRect.getAttribute('y')) : 0;
	var x2 = x1 + this.getCoord($rawRect.getAttribute('width'));
	var y2 = y1 + this.getCoord($rawRect.getAttribute('height'));
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
			var pointX = this.getCoord(point[0]);
			var pointY = this.getCoord(point[1]);
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

	var thickness = this.getCoord($rawPoly.getAttribute('stroke-width'));
	var type = $rawPoly.tagName === 'polyline' ? 'polyline' : 'polygon';
	return { type: type, points: points, thickness: thickness };
};

SVGParser.prototype.parsePath = function ($rawPath)
{
	var d = $rawPath.getAttribute('d');
	var pathReg = /([a-y])([.\-,\d]+)/igm;
	var result;
	var coordsRegex = /-?[\d.]+/igm;
	var pointInfos = [];
	var lastX = this.getCoord(0);
	var lastY = this.getCoord(0);

	var that = this;
	var getPoint = function ($x, $y, $relative)
	{
		var x = $x === undefined ? lastX : that.getCoord($x);
		var y = $y === undefined ? lastY : that.getCoord($y);
		if ($relative)
		{
			x = lastX + x;
			y = lastY + y;
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
		var info = { command: $command, point: $point, options: $options };
		lastX = info.point[0];
		lastY = info.point[1];
		pointInfos.push(info);
	};

	var point;
	var cubic1;
	var cubic2;
	var quadra1;

	do
	{
		result = pathReg.exec(d);
		if (result === null)
		{
			break;
		}
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
				createPoint('moveTo', point);
				break;
			case 'l':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint('lineTo', point);
				break;
			case 'v':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(undefined, coords[0], isLowserCase);
				createPoint('lineTo', point);
				break;
			case 'h':
				quadra1 = null;
				cubic2 = null;
				point = getPoint(coords[0], undefined, isLowserCase);
				createPoint('lineTo', point);
				break;
			case 'c':
				quadra1 = null;
				point = getPoint(coords[4], coords[5], isLowserCase);
				cubic1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic2 = getRelativePoint(point, coords[2], coords[3], isLowserCase);
				createPoint('bezierCurveTo', point, [cubic1, cubic2]);
				break;
			case 's':
				quadra1 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				cubic1 = cubic2 ? [lastX - cubic2[0] - point[0], lastY - cubic2[1] - point[1]] : undefined;
				cubic2 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				cubic1 = cubic1 || [cubic2[0], cubic2[1]];
				createPoint('bezierCurveTo', point, [cubic1, cubic2]);
				break;
			case 'q':
				cubic2 = null;
				point = getPoint(coords[2], coords[3], isLowserCase);
				quadra1 = getRelativePoint(point, coords[0], coords[1], isLowserCase);
				createPoint('quadraticCurveTo', point, [quadra1]);
				break;
			case 't':
				cubic2 = null;
				quadra1 = quadra1 ? quadra1 : point;
				point = getPoint(coords[0], coords[1], isLowserCase);
				createPoint('quadraticCurveTo', point, [quadra1]);
				break;
			case 'a':
				cubic2 = null;
				quadra1 = null;
				point = getPoint(coords[5], coords[6], isLowserCase);
				createPoint('arcTo', point);
				console.warn('not supported');
				break;
		}
	}

	while (result);

	// for (var i = 0, length = pointInfos.length; i < length; i += 1)
	// {
	// 	var curr = pointInfos[i];
	// 	curr.point[0] = curr.point[0] / this.ratio;
	// 	curr.point[1] = curr.point[1] / this.ratio;
	// 	if (curr.options)
	// 	{
	// 		if (curr.options[0]) { curr.options[0][0] = curr.options[0][0] / this.ratio; }
	// 		if (curr.options[0]) { curr.options[0][1] = curr.options[0][1] / this.ratio; }
	// 		if (curr.options[1]) { curr.options[1][0] = curr.options[1][0] / this.ratio; }
	// 		if (curr.options[1]) { curr.options[1][1] = curr.options[1][1] / this.ratio; }
	// 		if (curr.options[2]) { curr.options[2][0] = curr.options[2][0] / this.ratio; }
	// 		if (curr.options[2]) { curr.options[2][1] = curr.options[2][1] / this.ratio; }
	// 	}
	// }
	// console.log(pointInfos);
	// debugger;

	return { type: 'path', pointInfos: pointInfos };
	//var points =
	// var pathReg = /([mlscvh])(-?[\d\.]*[,-]+[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*),?(-?[\d\.]*,?-?[\d\.]*)/igm;
	// var points = [];
	// var lastCoordX = this.getCoord(0);
	// var lastCoordY = this.getCoord(0);
	// console.log(pathReg.exec(d));
	// debugger;
	// for (var array = pathReg.exec(d); array !== null; array = pathReg.exec(d))
	// {
	// 	var coordString;
	// 	var numberCoordX;
	// 	var numberCoordY;
	// 	if (array[1] === 'v')
	// 	{
	// 		numberCoordX = lastCoordX;
	// 		numberCoordY = lastCoordY + this.getCoord(array[2]);
	// 	}
	// 	else if (array[1] === 'h')
	// 	{
	// 		numberCoordX = lastCoordX + this.getCoord(array[2]);
	// 		numberCoordY = lastCoordY;
	// 	}
	// 	else
	// 	{
	// 		if (array[4] !== '')
	// 		{
	// 			coordString = array[4];
	// 		}
	// 		else if (array[3] !== '')
	// 		{
	// 			coordString = array[3];
	// 		}
	// 		else
	// 		{
	// 			coordString = array[2];
	// 		}
	// 		var coordReg = /(-?\d+\.?\d*)/igm;
	// 		var coords = coordString.match(coordReg);

	// 		numberCoordX = lastCoordX + this.getCoord(coords[0]);
	// 		numberCoordY = lastCoordY + this.getCoord(coords[1]);
	// 	}
	// 	//console.log(numberCoordX, numberCoordY);
	// 	points.push([numberCoordX, numberCoordY]);

	// 	lastCoordX = numberCoordX;
	// 	lastCoordY = numberCoordY;
	// }
	// console.log(points);
	// debugger;

	// var thickness = this.getCoord($rawPath.getAttribute('stroke-width'));
	// return { type: 'path', points: points, thickness: thickness };
};

SVGParser.prototype.round = function ($number)
{
	// var number = Number($number);
	// return Math.floor(number * 100) / 100;
	return $number;
	//return Math.floor(Number($number));
};

SVGParser.prototype.getCoord = function ($coordSTR)
{
	var number = this.round($coordSTR);
	return number * this.ratio;
};

SVGParser.prototype.parseCustomJoints = function ($rawGroup, $group)
{
	var children = $rawGroup.childNodes;//$rawGroup.querySelectorAll('[id*="constraint"]');

	for (var i = 0, childrenLength = children.length; i < childrenLength; i += 1)
	{
		if (children[i].nodeType === Node.TEXT_NODE || children[i].id.search(/joint/i) < 0) { continue; }

		var currRawJoint = children[i];
		var p1x = this.getCoord(currRawJoint.getAttribute('x1'));
		var p1y = this.getCoord(currRawJoint.getAttribute('y1'));
		var p2x = this.getCoord(currRawJoint.getAttribute('x2'));
		var p2y = this.getCoord(currRawJoint.getAttribute('y2'));

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

SVJellyWorld.prototype.constrainGroups = function ($groupA, $groupB, $points)
{
	var points = $points;
	var groupA = $groupA;
	var groupB = $groupB;

	if (points.length < 3)
	{
		var anchorA = groupA.physicsManager.createAnchorFromLine(points);
		points.splice(points.indexOf(anchorA.point), 1);
		var anchorB = groupB ? groupB.physicsManager.createAnchorFromPoint(points[0]) : this.physicsManager.createGhostAnchorFromPoint(points[0]);
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
	var points = [];
	for (var i = 0, length = $properties.pointInfos.length; i < length; i += 1)
	{
		var curr = $properties.pointInfos[i];
		points.push(curr.point);
	}

	this.area = this.calculateArea(points, $properties);
	this.radiusX = $properties.radiusX;
	this.radiusY = $properties.radiusY;

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

Structure.prototype.calculateArea = function ($points, $properties)
{
	if ($properties.type === 'ellipse')
	{
		return Math.pow(Math.PI * $properties.radiusX, 2);
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
		}
		return area;
	}
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
	this.innerRadius = diam / 2;
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
	Triangulator: require('./core/Triangulator'),
	NodeGraph: require('./core/NodeGraph'),
};


},{"./core/ConfObject":"/Users/Lau/www/svjelly/src/core/ConfObject.js","./core/Grid":"/Users/Lau/www/svjelly/src/core/Grid.js","./core/NodeGraph":"/Users/Lau/www/svjelly/src/core/NodeGraph.js","./core/Polygon":"/Users/Lau/www/svjelly/src/core/Polygon.js","./core/SVGParser":"/Users/Lau/www/svjelly/src/core/SVGParser.js","./core/SVJellyGroup":"/Users/Lau/www/svjelly/src/core/SVJellyGroup.js","./core/SVJellyJoint":"/Users/Lau/www/svjelly/src/core/SVJellyJoint.js","./core/SVJellyNode":"/Users/Lau/www/svjelly/src/core/SVJellyNode.js","./core/SVJellyUtils":"/Users/Lau/www/svjelly/src/core/SVJellyUtils.js","./core/SVJellyWorld":"/Users/Lau/www/svjelly/src/core/SVJellyWorld.js","./core/Structure":"/Users/Lau/www/svjelly/src/core/Structure.js","./core/Triangulator":"/Users/Lau/www/svjelly/src/core/Triangulator.js"}]},{},["/Users/Lau/www/svjelly/src/svjelly.js"])("/Users/Lau/www/svjelly/src/svjelly.js")
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWJzL3BvbHkydHJpL2Rpc3QvcG9seTJ0cmkuanMiLCJzcmMvY29yZS9Db25mT2JqZWN0LmpzIiwic3JjL2NvcmUvR3JpZC5qcyIsInNyYy9jb3JlL05vZGVHcmFwaC5qcyIsInNyYy9jb3JlL1BvbHlnb24uanMiLCJzcmMvY29yZS9TVkdQYXJzZXIuanMiLCJzcmMvY29yZS9TVkplbGx5R3JvdXAuanMiLCJzcmMvY29yZS9TVkplbGx5Sm9pbnQuanMiLCJzcmMvY29yZS9TVkplbGx5Tm9kZS5qcyIsInNyYy9jb3JlL1NWSmVsbHlVdGlscy5qcyIsInNyYy9jb3JlL1NWSmVsbHlXb3JsZC5qcyIsInNyYy9jb3JlL1N0cnVjdHVyZS5qcyIsInNyYy9jb3JlL1RyaWFuZ3VsYXRvci5qcyIsInNyYy9zdmplbGx5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoZSk7ZWxzZXt2YXIgZjtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P2Y9d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Zj1nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGYmJihmPXNlbGYpLGYucG9seTJ0cmk9ZSgpfX0oZnVuY3Rpb24oKXt2YXIgZGVmaW5lLG1vZHVsZSxleHBvcnRzO3JldHVybiAoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG5tb2R1bGUuZXhwb3J0cz17XCJ2ZXJzaW9uXCI6IFwiMS4zLjVcIn1cbn0se31dLDI6W2Z1bmN0aW9uKF9kZXJlcV8sbW9kdWxlLGV4cG9ydHMpe1xuLypcbiAqIFBvbHkyVHJpIENvcHlyaWdodCAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9wb2x5MnRyaS9cbiAqIFxuICogcG9seTJ0cmkuanMgKEphdmFTY3JpcHQgcG9ydCkgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwczovL2dpdGh1Yi5jb20vcjNtaS9wb2x5MnRyaS5qc1xuICogXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogXG4gKiBEaXN0cmlidXRlZCB1bmRlciB0aGUgMy1jbGF1c2UgQlNEIExpY2Vuc2UsIHNlZSBMSUNFTlNFLnR4dFxuICovXG5cbi8qIGpzaGludCBtYXhjb21wbGV4aXR5OjExICovXG5cblwidXNlIHN0cmljdFwiO1xuXG5cbi8qXG4gKiBOb3RlXG4gKiA9PT09XG4gKiB0aGUgc3RydWN0dXJlIG9mIHRoaXMgSmF2YVNjcmlwdCB2ZXJzaW9uIG9mIHBvbHkydHJpIGludGVudGlvbmFsbHkgZm9sbG93c1xuICogYXMgY2xvc2VseSBhcyBwb3NzaWJsZSB0aGUgc3RydWN0dXJlIG9mIHRoZSByZWZlcmVuY2UgQysrIHZlcnNpb24sIHRvIG1ha2UgaXQgXG4gKiBlYXNpZXIgdG8ga2VlcCB0aGUgMiB2ZXJzaW9ucyBpbiBzeW5jLlxuICovXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLU5vZGVcblxuLyoqXG4gKiBBZHZhbmNpbmcgZnJvbnQgbm9kZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHN0cnVjdFxuICogQHBhcmFtIHshWFl9IHAgLSBQb2ludFxuICogQHBhcmFtIHtUcmlhbmdsZT19IHQgdHJpYW5nbGUgKG9wdGlvbmFsKVxuICovXG52YXIgTm9kZSA9IGZ1bmN0aW9uKHAsIHQpIHtcbiAgICAvKiogQHR5cGUge1hZfSAqL1xuICAgIHRoaXMucG9pbnQgPSBwO1xuXG4gICAgLyoqIEB0eXBlIHtUcmlhbmdsZXxudWxsfSAqL1xuICAgIHRoaXMudHJpYW5nbGUgPSB0IHx8IG51bGw7XG5cbiAgICAvKiogQHR5cGUge05vZGV8bnVsbH0gKi9cbiAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZXxudWxsfSAqL1xuICAgIHRoaXMucHJldiA9IG51bGw7XG5cbiAgICAvKiogQHR5cGUge251bWJlcn0gKi9cbiAgICB0aGlzLnZhbHVlID0gcC54O1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQWR2YW5jaW5nRnJvbnRcbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHN0cnVjdFxuICogQHBhcmFtIHtOb2RlfSBoZWFkXG4gKiBAcGFyYW0ge05vZGV9IHRhaWxcbiAqL1xudmFyIEFkdmFuY2luZ0Zyb250ID0gZnVuY3Rpb24oaGVhZCwgdGFpbCkge1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLmhlYWRfID0gaGVhZDtcbiAgICAvKiogQHR5cGUge05vZGV9ICovXG4gICAgdGhpcy50YWlsXyA9IHRhaWw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMuc2VhcmNoX25vZGVfID0gaGVhZDtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmhlYWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkXztcbn07XG5cbi8qKiBAcGFyYW0ge05vZGV9IG5vZGUgKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZXRIZWFkID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMuaGVhZF8gPSBub2RlO1xufTtcblxuLyoqIEByZXR1cm4ge05vZGV9ICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUudGFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRhaWxfO1xufTtcblxuLyoqIEBwYXJhbSB7Tm9kZX0gbm9kZSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLnNldFRhaWwgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgdGhpcy50YWlsXyA9IG5vZGU7XG59O1xuXG4vKiogQHJldHVybiB7Tm9kZX0gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5zZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hfbm9kZV87XG59O1xuXG4vKiogQHBhcmFtIHtOb2RlfSBub2RlICovXG5BZHZhbmNpbmdGcm9udC5wcm90b3R5cGUuc2V0U2VhcmNoID0gZnVuY3Rpb24obm9kZSkge1xuICAgIHRoaXMuc2VhcmNoX25vZGVfID0gbm9kZTtcbn07XG5cbi8qKiBAcmV0dXJuIHtOb2RlfSAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmZpbmRTZWFyY2hOb2RlID0gZnVuY3Rpb24oLyp4Ki8pIHtcbiAgICAvLyBUT0RPOiBpbXBsZW1lbnQgQlNUIGluZGV4XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoX25vZGVfO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcn0geCB2YWx1ZVxuICogQHJldHVybiB7Tm9kZX1cbiAqL1xuQWR2YW5jaW5nRnJvbnQucHJvdG90eXBlLmxvY2F0ZU5vZGUgPSBmdW5jdGlvbih4KSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzLnNlYXJjaF9ub2RlXztcblxuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICBpZiAoeCA8IG5vZGUudmFsdWUpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUgPSBub2RlLnByZXYpIHtcbiAgICAgICAgICAgIGlmICh4ID49IG5vZGUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUubmV4dCkge1xuICAgICAgICAgICAgaWYgKHggPCBub2RlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hfbm9kZV8gPSBub2RlLnByZXY7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUucHJldjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHshWFl9IHBvaW50IC0gUG9pbnRcbiAqIEByZXR1cm4ge05vZGV9XG4gKi9cbkFkdmFuY2luZ0Zyb250LnByb3RvdHlwZS5sb2NhdGVQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdmFyIHB4ID0gcG9pbnQueDtcbiAgICB2YXIgbm9kZSA9IHRoaXMuZmluZFNlYXJjaE5vZGUocHgpO1xuICAgIHZhciBueCA9IG5vZGUucG9pbnQueDtcblxuICAgIGlmIChweCA9PT0gbngpIHtcbiAgICAgICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICAgICAgaWYgKHBvaW50ICE9PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAvLyBXZSBtaWdodCBoYXZlIHR3byBub2RlcyB3aXRoIHNhbWUgeCB2YWx1ZSBmb3IgYSBzaG9ydCB0aW1lXG4gICAgICAgICAgICBpZiAocG9pbnQgPT09IG5vZGUucHJldi5wb2ludCkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBvaW50ID09PSBub2RlLm5leHQucG9pbnQpIHtcbiAgICAgICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgQWR2YW5jaW5nRnJvbnQubG9jYXRlUG9pbnQoKSBjYWxsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHB4IDwgbngpIHtcbiAgICAgICAgLyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUucHJldikge1xuICAgICAgICAgICAgaWYgKHBvaW50ID09PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAobm9kZSA9IG5vZGUubmV4dCkge1xuICAgICAgICAgICAgaWYgKHBvaW50ID09PSBub2RlLnBvaW50KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSkge1xuICAgICAgICB0aGlzLnNlYXJjaF9ub2RlXyA9IG5vZGU7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tRXhwb3J0c1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFkdmFuY2luZ0Zyb250O1xubW9kdWxlLmV4cG9ydHMuTm9kZSA9IE5vZGU7XG5cblxufSx7fV0sMzpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICpcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gKiBGdW5jdGlvbiBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuICovXG5cbi8qKlxuICogYXNzZXJ0IGFuZCB0aHJvdyBhbiBleGNlcHRpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZGl0aW9uICAgdGhlIGNvbmRpdGlvbiB3aGljaCBpcyBhc3NlcnRlZFxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgICAgICB0aGUgbWVzc2FnZSB3aGljaCBpcyBkaXNwbGF5IGlzIGNvbmRpdGlvbiBpcyBmYWxzeVxuICovXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtZXNzYWdlKSB7XG4gICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgXCJBc3NlcnQgRmFpbGVkXCIpO1xuICAgIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0O1xuXG5cblxufSx7fV0sNDpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIHh5ID0gX2RlcmVxXygnLi94eScpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Qb2ludFxuLyoqXG4gKiBDb25zdHJ1Y3QgYSBwb2ludFxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHBvaW50ID0gbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKTtcbiAqIEBwdWJsaWNcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHBhcmFtIHtudW1iZXI9fSB4ICAgIGNvb3JkaW5hdGUgKDAgaWYgdW5kZWZpbmVkKVxuICogQHBhcmFtIHtudW1iZXI9fSB5ICAgIGNvb3JkaW5hdGUgKDAgaWYgdW5kZWZpbmVkKVxuICovXG52YXIgUG9pbnQgPSBmdW5jdGlvbih4LCB5KSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAZXhwb3NlXG4gICAgICovXG4gICAgdGhpcy54ID0gK3ggfHwgMDtcbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBleHBvc2VcbiAgICAgKi9cbiAgICB0aGlzLnkgPSAreSB8fCAwO1xuXG4gICAgLy8gQWxsIGV4dHJhIGZpZWxkcyBhZGRlZCB0byBQb2ludCBhcmUgcHJlZml4ZWQgd2l0aCBfcDJ0X1xuICAgIC8vIHRvIGF2b2lkIGNvbGxpc2lvbnMgaWYgY3VzdG9tIFBvaW50IGNsYXNzIGlzIHVzZWQuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgZWRnZXMgdGhpcyBwb2ludCBjb25zdGl0dXRlcyBhbiB1cHBlciBlbmRpbmcgcG9pbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48RWRnZT59XG4gICAgICovXG4gICAgdGhpcy5fcDJ0X2VkZ2VfbGlzdCA9IG51bGw7XG59O1xuXG4vKipcbiAqIEZvciBwcmV0dHkgcHJpbnRpbmdcbiAqIEBleGFtcGxlXG4gKiAgICAgIFwicD1cIiArIG5ldyBwb2x5MnRyaS5Qb2ludCg1LDQyKVxuICogICAgICAvLyDihpIgXCJwPSg1OzQyKVwiXG4gKiBAcmV0dXJucyB7c3RyaW5nfSA8Y29kZT5cIih4O3kpXCI8L2NvZGU+XG4gKi9cblBvaW50LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB4eS50b1N0cmluZ0Jhc2UodGhpcyk7XG59O1xuXG4vKipcbiAqIEpTT04gb3V0cHV0LCBvbmx5IGNvb3JkaW5hdGVzXG4gKiBAZXhhbXBsZVxuICogICAgICBKU09OLnN0cmluZ2lmeShuZXcgcG9seTJ0cmkuUG9pbnQoMSwyKSlcbiAqICAgICAgLy8g4oaSICd7XCJ4XCI6MSxcInlcIjoyfSdcbiAqL1xuUG9pbnQucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IHg6IHRoaXMueCwgeTogdGhpcy55IH07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgUG9pbnQgb2JqZWN0LlxuICogQHJldHVybiB7UG9pbnR9IG5ldyBjbG9uZWQgcG9pbnRcbiAqL1xuUG9pbnQucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLngsIHRoaXMueSk7XG59O1xuXG4vKipcbiAqIFNldCB0aGlzIFBvaW50IGluc3RhbmNlIHRvIHRoZSBvcmlnby4gPGNvZGU+KDA7IDApPC9jb2RlPlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLnNldF96ZXJvID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gMC4wO1xuICAgIHRoaXMueSA9IDAuMDtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIFNldCB0aGUgY29vcmRpbmF0ZXMgb2YgdGhpcyBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSB4ICAgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IHkgICBjb29yZGluYXRlXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oeCwgeSkge1xuICAgIHRoaXMueCA9ICt4IHx8IDA7XG4gICAgdGhpcy55ID0gK3kgfHwgMDtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIE5lZ2F0ZSB0aGlzIFBvaW50IGluc3RhbmNlLiAoY29tcG9uZW50LXdpc2UpXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUubmVnYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogQWRkIGFub3RoZXIgUG9pbnQgb2JqZWN0IHRvIHRoaXMgaW5zdGFuY2UuIChjb21wb25lbnQtd2lzZSlcbiAqIEBwYXJhbSB7IVBvaW50fSBuIC0gUG9pbnQgb2JqZWN0LlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG4pIHtcbiAgICB0aGlzLnggKz0gbi54O1xuICAgIHRoaXMueSArPSBuLnk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0aGlzIFBvaW50IGluc3RhbmNlIHdpdGggYW5vdGhlciBwb2ludCBnaXZlbi4gKGNvbXBvbmVudC13aXNlKVxuICogQHBhcmFtIHshUG9pbnR9IG4gLSBQb2ludCBvYmplY3QuXG4gKiBAcmV0dXJuIHtQb2ludH0gdGhpcyAoZm9yIGNoYWluaW5nKVxuICovXG5Qb2ludC5wcm90b3R5cGUuc3ViID0gZnVuY3Rpb24obikge1xuICAgIHRoaXMueCAtPSBuLng7XG4gICAgdGhpcy55IC09IG4ueTtcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIE11bHRpcGx5IHRoaXMgUG9pbnQgaW5zdGFuY2UgYnkgYSBzY2FsYXIuIChjb21wb25lbnQtd2lzZSlcbiAqIEBwYXJhbSB7bnVtYmVyfSBzICAgc2NhbGFyLlxuICogQHJldHVybiB7UG9pbnR9IHRoaXMgKGZvciBjaGFpbmluZylcbiAqL1xuUG9pbnQucHJvdG90eXBlLm11bCA9IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnggKj0gcztcbiAgICB0aGlzLnkgKj0gcztcbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgZGlzdGFuY2Ugb2YgdGhpcyBQb2ludCBpbnN0YW5jZSBmcm9tIHRoZSBvcmlnby5cbiAqIEByZXR1cm4ge251bWJlcn0gZGlzdGFuY2VcbiAqL1xuUG9pbnQucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIHRoaXMgUG9pbnQgaW5zdGFuY2UgKGFzIGEgdmVjdG9yKS5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG9yaWdpbmFsIGRpc3RhbmNlIG9mIHRoaXMgaW5zdGFuY2UgZnJvbSB0aGUgb3JpZ28uXG4gKi9cblBvaW50LnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGgoKTtcbiAgICB0aGlzLnggLz0gbGVuO1xuICAgIHRoaXMueSAvPSBsZW47XG4gICAgcmV0dXJuIGxlbjtcbn07XG5cbi8qKlxuICogVGVzdCB0aGlzIFBvaW50IG9iamVjdCB3aXRoIGFub3RoZXIgZm9yIGVxdWFsaXR5LlxuICogQHBhcmFtIHshWFl9IHAgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPnRydWU8L2NvZGU+IGlmIHNhbWUgeCBhbmQgeSBjb29yZGluYXRlcywgPGNvZGU+ZmFsc2U8L2NvZGU+IG90aGVyd2lzZS5cbiAqL1xuUG9pbnQucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gdGhpcy54ID09PSBwLnggJiYgdGhpcy55ID09PSBwLnk7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tUG9pbnQgKFwic3RhdGljXCIgbWV0aG9kcylcblxuLyoqXG4gKiBOZWdhdGUgYSBwb2ludCBjb21wb25lbnQtd2lzZSBhbmQgcmV0dXJuIHRoZSByZXN1bHQgYXMgYSBuZXcgUG9pbnQgb2JqZWN0LlxuICogQHBhcmFtIHshWFl9IHAgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQubmVnYXRlID0gZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoLXAueCwgLXAueSk7XG59O1xuXG4vKipcbiAqIEFkZCB0d28gcG9pbnRzIGNvbXBvbmVudC13aXNlIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0geyFYWX0gYSAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQuYWRkID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBuZXcgUG9pbnQoYS54ICsgYi54LCBhLnkgKyBiLnkpO1xufTtcblxuLyoqXG4gKiBTdWJ0cmFjdCB0d28gcG9pbnRzIGNvbXBvbmVudC13aXNlIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0geyFYWX0gYSAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IGIgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge1BvaW50fSB0aGUgcmVzdWx0aW5nIFBvaW50IG9iamVjdC5cbiAqL1xuUG9pbnQuc3ViID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBuZXcgUG9pbnQoYS54IC0gYi54LCBhLnkgLSBiLnkpO1xufTtcblxuLyoqXG4gKiBNdWx0aXBseSBhIHBvaW50IGJ5IGEgc2NhbGFyIGFuZCByZXR1cm4gdGhlIHJlc3VsdCBhcyBhIG5ldyBQb2ludCBvYmplY3QuXG4gKiBAcGFyYW0ge251bWJlcn0gcyAtIHRoZSBzY2FsYXJcbiAqIEBwYXJhbSB7IVhZfSBwIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtQb2ludH0gdGhlIHJlc3VsdGluZyBQb2ludCBvYmplY3QuXG4gKi9cblBvaW50Lm11bCA9IGZ1bmN0aW9uKHMsIHApIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KHMgKiBwLngsIHMgKiBwLnkpO1xufTtcblxuLyoqXG4gKiBQZXJmb3JtIHRoZSBjcm9zcyBwcm9kdWN0IG9uIGVpdGhlciB0d28gcG9pbnRzICh0aGlzIHByb2R1Y2VzIGEgc2NhbGFyKVxuICogb3IgYSBwb2ludCBhbmQgYSBzY2FsYXIgKHRoaXMgcHJvZHVjZXMgYSBwb2ludCkuXG4gKiBUaGlzIGZ1bmN0aW9uIHJlcXVpcmVzIHR3byBwYXJhbWV0ZXJzLCBlaXRoZXIgbWF5IGJlIGEgUG9pbnQgb2JqZWN0IG9yIGFcbiAqIG51bWJlci5cbiAqIEBwYXJhbSAge1hZfG51bWJlcn0gYSAtIFBvaW50IG9iamVjdCBvciBzY2FsYXIuXG4gKiBAcGFyYW0gIHtYWXxudW1iZXJ9IGIgLSBQb2ludCBvYmplY3Qgb3Igc2NhbGFyLlxuICogQHJldHVybiB7UG9pbnR8bnVtYmVyfSBhIFBvaW50IG9iamVjdCBvciBhIG51bWJlciwgZGVwZW5kaW5nIG9uIHRoZSBwYXJhbWV0ZXJzLlxuICovXG5Qb2ludC5jcm9zcyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBpZiAodHlwZW9mKGEpID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAodHlwZW9mKGIpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGEgKiBiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludCgtYSAqIGIueSwgYSAqIGIueCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mKGIpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQb2ludChiICogYS55LCAtYiAqIGEueCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiUG9pbnQtTGlrZVwiXG4vKlxuICogVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgb3BlcmF0ZSBvbiBcIlBvaW50XCIgb3IgYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCBcbiAqIHdpdGgge3gseX0gKGR1Y2sgdHlwaW5nKS5cbiAqL1xuXG5Qb2ludC50b1N0cmluZyA9IHh5LnRvU3RyaW5nO1xuUG9pbnQuY29tcGFyZSA9IHh5LmNvbXBhcmU7XG5Qb2ludC5jbXAgPSB4eS5jb21wYXJlOyAvLyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5Qb2ludC5lcXVhbHMgPSB4eS5lcXVhbHM7XG5cbi8qKlxuICogUGVmb3JtIHRoZSBkb3QgcHJvZHVjdCBvbiB0d28gdmVjdG9ycy5cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7IVhZfSBhIC0gYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gYiAtIGFueSBcIlBvaW50IGxpa2VcIiBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgZG90IHByb2R1Y3RcbiAqL1xuUG9pbnQuZG90ID0gZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnk7XG59O1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHMgKHB1YmxpYyBBUEkpXG5cbm1vZHVsZS5leHBvcnRzID0gUG9pbnQ7XG5cbn0se1wiLi94eVwiOjExfV0sNTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gKiBDbGFzcyBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuICovXG5cbnZhciB4eSA9IF9kZXJlcV8oJy4veHknKTtcblxuLyoqXG4gKiBDdXN0b20gZXhjZXB0aW9uIGNsYXNzIHRvIGluZGljYXRlIGludmFsaWQgUG9pbnQgdmFsdWVzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBleHRlbmRzIEVycm9yXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0ge3N0cmluZz19IG1lc3NhZ2UgLSBlcnJvciBtZXNzYWdlXG4gKiBAcGFyYW0ge0FycmF5LjxYWT49fSBwb2ludHMgLSBpbnZhbGlkIHBvaW50c1xuICovXG52YXIgUG9pbnRFcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHBvaW50cykge1xuICAgIHRoaXMubmFtZSA9IFwiUG9pbnRFcnJvclwiO1xuICAgIC8qKlxuICAgICAqIEludmFsaWQgcG9pbnRzXG4gICAgICogQHB1YmxpY1xuICAgICAqIEB0eXBlIHtBcnJheS48WFk+fVxuICAgICAqL1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzID0gcG9pbnRzIHx8IFtdO1xuICAgIC8qKlxuICAgICAqIEVycm9yIG1lc3NhZ2VcbiAgICAgKiBAcHVibGljXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlIHx8IFwiSW52YWxpZCBQb2ludHMhXCI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlICs9IFwiIFwiICsgeHkudG9TdHJpbmcocG9pbnRzW2ldKTtcbiAgICB9XG59O1xuUG9pbnRFcnJvci5wcm90b3R5cGUgPSBuZXcgRXJyb3IoKTtcblBvaW50RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUG9pbnRFcnJvcjtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50RXJyb3I7XG5cbn0se1wiLi94eVwiOjExfV0sNjpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBSZWRpc3RyaWJ1dGlvbiBhbmQgdXNlIGluIHNvdXJjZSBhbmQgYmluYXJ5IGZvcm1zLCB3aXRoIG9yIHdpdGhvdXQgbW9kaWZpY2F0aW9uLFxuICogYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuICpcbiAqICogUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLFxuICogICB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogKiBSZWRpc3RyaWJ1dGlvbnMgaW4gYmluYXJ5IGZvcm0gbXVzdCByZXByb2R1Y2UgdGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UsXG4gKiAgIHRoaXMgbGlzdCBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb25cbiAqICAgYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKiAqIE5laXRoZXIgdGhlIG5hbWUgb2YgUG9seTJUcmkgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZVxuICogICB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljXG4gKiAgIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTXG4gKiBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UXG4gKiBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1JcbiAqIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFSRSBESVNDTEFJTUVELiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQ09QWVJJR0hUIE9XTkVSIE9SXG4gKiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcbiAqIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTyxcbiAqIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUlxuICogUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcbiAqIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJU1xuICogU09GVFdBUkUsIEVWRU4gSUYgQURWSVNFRCBPRiBUSEUgUE9TU0lCSUxJVFkgT0YgU1VDSCBEQU1BR0UuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogUHVibGljIEFQSSBmb3IgcG9seTJ0cmkuanNcbiAqIEBtb2R1bGUgcG9seTJ0cmlcbiAqL1xuXG5cbi8qKlxuICogSWYgeW91IGFyZSBub3QgdXNpbmcgYSBtb2R1bGUgc3lzdGVtIChlLmcuIENvbW1vbkpTLCBSZXF1aXJlSlMpLCB5b3UgY2FuIGFjY2VzcyB0aGlzIGxpYnJhcnlcbiAqIGFzIGEgZ2xvYmFsIHZhcmlhYmxlIDxjb2RlPnBvbHkydHJpPC9jb2RlPiBpLmUuIDxjb2RlPndpbmRvdy5wb2x5MnRyaTwvY29kZT4gaW4gYSBicm93c2VyLlxuICogQG5hbWUgcG9seTJ0cmlcbiAqIEBnbG9iYWxcbiAqIEBwdWJsaWNcbiAqIEB0eXBlIHttb2R1bGU6cG9seTJ0cml9XG4gKi9cbnZhciBwcmV2aW91c1BvbHkydHJpID0gZ2xvYmFsLnBvbHkydHJpO1xuLyoqXG4gKiBGb3IgQnJvd3NlciArICZsdDtzY3JpcHQmZ3Q7IDpcbiAqIHJldmVydHMgdGhlIHtAbGlua2NvZGUgcG9seTJ0cml9IGdsb2JhbCBvYmplY3QgdG8gaXRzIHByZXZpb3VzIHZhbHVlLFxuICogYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIGluc3RhbmNlIGNhbGxlZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICAgICAgICAgIHZhciBwID0gcG9seTJ0cmkubm9Db25mbGljdCgpO1xuICogQHB1YmxpY1xuICogQHJldHVybiB7bW9kdWxlOnBvbHkydHJpfSBpbnN0YW5jZSBjYWxsZWRcbiAqL1xuLy8gKHRoaXMgZmVhdHVyZSBpcyBub3QgYXV0b21hdGljYWxseSBwcm92aWRlZCBieSBicm93c2VyaWZ5KS5cbmV4cG9ydHMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGdsb2JhbC5wb2x5MnRyaSA9IHByZXZpb3VzUG9seTJ0cmk7XG4gICAgcmV0dXJuIGV4cG9ydHM7XG59O1xuXG4vKipcbiAqIHBvbHkydHJpIGxpYnJhcnkgdmVyc2lvblxuICogQHB1YmxpY1xuICogQGNvbnN0IHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuVkVSU0lPTiA9IF9kZXJlcV8oJy4uL2Rpc3QvdmVyc2lvbi5qc29uJykudmVyc2lvbjtcblxuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFBvaW50RXJyb3J9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1BvaW50RXJyb3J9IG1vZHVsZTpwb2x5MnRyaS5Qb2ludEVycm9yXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5Qb2ludEVycm9yID0gX2RlcmVxXygnLi9wb2ludGVycm9yJyk7XG4vKipcbiAqIEV4cG9ydHMgdGhlIHtAbGlua2NvZGUgUG9pbnR9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1BvaW50fSBtb2R1bGU6cG9seTJ0cmkuUG9pbnRcbiAqIEBmdW5jdGlvblxuICovXG5leHBvcnRzLlBvaW50ID0gX2RlcmVxXygnLi9wb2ludCcpO1xuLyoqXG4gKiBFeHBvcnRzIHRoZSB7QGxpbmtjb2RlIFRyaWFuZ2xlfSBjbGFzcy5cbiAqIEBwdWJsaWNcbiAqIEB0eXBlZGVmIHtUcmlhbmdsZX0gbW9kdWxlOnBvbHkydHJpLlRyaWFuZ2xlXG4gKiBAZnVuY3Rpb25cbiAqL1xuZXhwb3J0cy5UcmlhbmdsZSA9IF9kZXJlcV8oJy4vdHJpYW5nbGUnKTtcbi8qKlxuICogRXhwb3J0cyB0aGUge0BsaW5rY29kZSBTd2VlcENvbnRleHR9IGNsYXNzLlxuICogQHB1YmxpY1xuICogQHR5cGVkZWYge1N3ZWVwQ29udGV4dH0gbW9kdWxlOnBvbHkydHJpLlN3ZWVwQ29udGV4dFxuICogQGZ1bmN0aW9uXG4gKi9cbmV4cG9ydHMuU3dlZXBDb250ZXh0ID0gX2RlcmVxXygnLi9zd2VlcGNvbnRleHQnKTtcblxuXG4vLyBCYWNrd2FyZCBjb21wYXRpYmlsaXR5XG52YXIgc3dlZXAgPSBfZGVyZXFfKCcuL3N3ZWVwJyk7XG4vKipcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I3RyaWFuZ3VsYXRlfSBpbnN0ZWFkXG4gKi9cbmV4cG9ydHMudHJpYW5ndWxhdGUgPSBzd2VlcC50cmlhbmd1bGF0ZTtcbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I3RyaWFuZ3VsYXRlfSBpbnN0ZWFkXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBUcmlhbmd1bGF0ZSAtIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCN0cmlhbmd1bGF0ZX0gaW5zdGVhZFxuICovXG5leHBvcnRzLnN3ZWVwID0ge1RyaWFuZ3VsYXRlOiBzd2VlcC50cmlhbmd1bGF0ZX07XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG59LHtcIi4uL2Rpc3QvdmVyc2lvbi5qc29uXCI6MSxcIi4vcG9pbnRcIjo0LFwiLi9wb2ludGVycm9yXCI6NSxcIi4vc3dlZXBcIjo3LFwiLi9zd2VlcGNvbnRleHRcIjo4LFwiLi90cmlhbmdsZVwiOjl9XSw3OltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbGF0ZWRlZjpub2Z1bmMsIG1heGNvbXBsZXhpdHk6OSAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBUaGlzICdTd2VlcCcgbW9kdWxlIGlzIHByZXNlbnQgaW4gb3JkZXIgdG8ga2VlcCB0aGlzIEphdmFTY3JpcHQgdmVyc2lvblxuICogYXMgY2xvc2UgYXMgcG9zc2libGUgdG8gdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgZXZlbiB0aG91Z2ggYWxtb3N0IGFsbFxuICogZnVuY3Rpb25zIGNvdWxkIGJlIGRlY2xhcmVkIGFzIG1ldGhvZHMgb24gdGhlIHtAbGlua2NvZGUgbW9kdWxlOnN3ZWVwY29udGV4dH5Td2VlcENvbnRleHR9IG9iamVjdC5cbiAqIEBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cblxuLypcbiAqIE5vdGVcbiAqID09PT1cbiAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBKYXZhU2NyaXB0IHZlcnNpb24gb2YgcG9seTJ0cmkgaW50ZW50aW9uYWxseSBmb2xsb3dzXG4gKiBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIHJlZmVyZW5jZSBDKysgdmVyc2lvbiwgdG8gbWFrZSBpdCBcbiAqIGVhc2llciB0byBrZWVwIHRoZSAyIHZlcnNpb25zIGluIHN5bmMuXG4gKi9cblxudmFyIGFzc2VydCA9IF9kZXJlcV8oJy4vYXNzZXJ0Jyk7XG52YXIgUG9pbnRFcnJvciA9IF9kZXJlcV8oJy4vcG9pbnRlcnJvcicpO1xudmFyIFRyaWFuZ2xlID0gX2RlcmVxXygnLi90cmlhbmdsZScpO1xudmFyIE5vZGUgPSBfZGVyZXFfKCcuL2FkdmFuY2luZ2Zyb250JykuTm9kZTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS11dGlsc1xuXG52YXIgdXRpbHMgPSBfZGVyZXFfKCcuL3V0aWxzJyk7XG5cbi8qKiBAY29uc3QgKi9cbnZhciBFUFNJTE9OID0gdXRpbHMuRVBTSUxPTjtcblxuLyoqIEBjb25zdCAqL1xudmFyIE9yaWVudGF0aW9uID0gdXRpbHMuT3JpZW50YXRpb247XG4vKiogQGNvbnN0ICovXG52YXIgb3JpZW50MmQgPSB1dGlscy5vcmllbnQyZDtcbi8qKiBAY29uc3QgKi9cbnZhciBpblNjYW5BcmVhID0gdXRpbHMuaW5TY2FuQXJlYTtcbi8qKiBAY29uc3QgKi9cbnZhciBpc0FuZ2xlT2J0dXNlID0gdXRpbHMuaXNBbmdsZU9idHVzZTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1Td2VlcFxuXG4vKipcbiAqIFRyaWFuZ3VsYXRlIHRoZSBwb2x5Z29uIHdpdGggaG9sZXMgYW5kIFN0ZWluZXIgcG9pbnRzLlxuICogRG8gdGhpcyBBRlRFUiB5b3UndmUgYWRkZWQgdGhlIHBvbHlsaW5lLCBob2xlcywgYW5kIFN0ZWluZXIgcG9pbnRzXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIHRyaWFuZ3VsYXRlKHRjeCkge1xuICAgIHRjeC5pbml0VHJpYW5ndWxhdGlvbigpO1xuICAgIHRjeC5jcmVhdGVBZHZhbmNpbmdGcm9udCgpO1xuICAgIC8vIFN3ZWVwIHBvaW50czsgYnVpbGQgbWVzaFxuICAgIHN3ZWVwUG9pbnRzKHRjeCk7XG4gICAgLy8gQ2xlYW4gdXBcbiAgICBmaW5hbGl6YXRpb25Qb2x5Z29uKHRjeCk7XG59XG5cbi8qKlxuICogU3RhcnQgc3dlZXBpbmcgdGhlIFktc29ydGVkIHBvaW50IHNldCBmcm9tIGJvdHRvbSB0byB0b3BcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBzd2VlcFBvaW50cyh0Y3gpIHtcbiAgICB2YXIgaSwgbGVuID0gdGN4LnBvaW50Q291bnQoKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgdmFyIHBvaW50ID0gdGN4LmdldFBvaW50KGkpO1xuICAgICAgICB2YXIgbm9kZSA9IHBvaW50RXZlbnQodGN4LCBwb2ludCk7XG4gICAgICAgIHZhciBlZGdlcyA9IHBvaW50Ll9wMnRfZWRnZV9saXN0O1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgZWRnZXMgJiYgaiA8IGVkZ2VzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICBlZGdlRXZlbnRCeUVkZ2UodGN4LCBlZGdlc1tqXSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHshU3dlZXBDb250ZXh0fSB0Y3ggLSBTd2VlcENvbnRleHQgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGZpbmFsaXphdGlvblBvbHlnb24odGN4KSB7XG4gICAgLy8gR2V0IGFuIEludGVybmFsIHRyaWFuZ2xlIHRvIHN0YXJ0IHdpdGhcbiAgICB2YXIgdCA9IHRjeC5mcm9udCgpLmhlYWQoKS5uZXh0LnRyaWFuZ2xlO1xuICAgIHZhciBwID0gdGN4LmZyb250KCkuaGVhZCgpLm5leHQucG9pbnQ7XG4gICAgd2hpbGUgKCF0LmdldENvbnN0cmFpbmVkRWRnZUNXKHApKSB7XG4gICAgICAgIHQgPSB0Lm5laWdoYm9yQ0NXKHApO1xuICAgIH1cblxuICAgIC8vIENvbGxlY3QgaW50ZXJpb3IgdHJpYW5nbGVzIGNvbnN0cmFpbmVkIGJ5IGVkZ2VzXG4gICAgdGN4Lm1lc2hDbGVhbih0KTtcbn1cblxuLyoqXG4gKiBGaW5kIGNsb3NlcyBub2RlIHRvIHRoZSBsZWZ0IG9mIHRoZSBuZXcgcG9pbnQgYW5kXG4gKiBjcmVhdGUgYSBuZXcgdHJpYW5nbGUuIElmIG5lZWRlZCBuZXcgaG9sZXMgYW5kIGJhc2luc1xuICogd2lsbCBiZSBmaWxsZWQgdG8uXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSB7IVhZfSBwb2ludCAgIFBvaW50XG4gKi9cbmZ1bmN0aW9uIHBvaW50RXZlbnQodGN4LCBwb2ludCkge1xuICAgIHZhciBub2RlID0gdGN4LmxvY2F0ZU5vZGUocG9pbnQpO1xuICAgIHZhciBuZXdfbm9kZSA9IG5ld0Zyb250VHJpYW5nbGUodGN4LCBwb2ludCwgbm9kZSk7XG5cbiAgICAvLyBPbmx5IG5lZWQgdG8gY2hlY2sgK2Vwc2lsb24gc2luY2UgcG9pbnQgbmV2ZXIgaGF2ZSBzbWFsbGVyXG4gICAgLy8geCB2YWx1ZSB0aGFuIG5vZGUgZHVlIHRvIGhvdyB3ZSBmZXRjaCBub2RlcyBmcm9tIHRoZSBmcm9udFxuICAgIGlmIChwb2ludC54IDw9IG5vZGUucG9pbnQueCArIChFUFNJTE9OKSkge1xuICAgICAgICBmaWxsKHRjeCwgbm9kZSk7XG4gICAgfVxuXG4gICAgLy90Y3guQWRkTm9kZShuZXdfbm9kZSk7XG5cbiAgICBmaWxsQWR2YW5jaW5nRnJvbnQodGN4LCBuZXdfbm9kZSk7XG4gICAgcmV0dXJuIG5ld19ub2RlO1xufVxuXG5mdW5jdGlvbiBlZGdlRXZlbnRCeUVkZ2UodGN4LCBlZGdlLCBub2RlKSB7XG4gICAgdGN4LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZSA9IGVkZ2U7XG4gICAgdGN4LmVkZ2VfZXZlbnQucmlnaHQgPSAoZWRnZS5wLnggPiBlZGdlLnEueCk7XG5cbiAgICBpZiAoaXNFZGdlU2lkZU9mVHJpYW5nbGUobm9kZS50cmlhbmdsZSwgZWRnZS5wLCBlZGdlLnEpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGb3Igbm93IHdlIHdpbGwgZG8gYWxsIG5lZWRlZCBmaWxsaW5nXG4gICAgLy8gVE9ETzogaW50ZWdyYXRlIHdpdGggZmxpcCBwcm9jZXNzIG1pZ2h0IGdpdmUgc29tZSBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgICAvLyAgICAgICBidXQgZm9yIG5vdyB0aGlzIGF2b2lkIHRoZSBpc3N1ZSB3aXRoIGNhc2VzIHRoYXQgbmVlZHMgYm90aCBmbGlwcyBhbmQgZmlsbHNcbiAgICBmaWxsRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgZWRnZUV2ZW50QnlQb2ludHModGN4LCBlZGdlLnAsIGVkZ2UucSwgbm9kZS50cmlhbmdsZSwgZWRnZS5xKTtcbn1cblxuZnVuY3Rpb24gZWRnZUV2ZW50QnlQb2ludHModGN4LCBlcCwgZXEsIHRyaWFuZ2xlLCBwb2ludCkge1xuICAgIGlmIChpc0VkZ2VTaWRlT2ZUcmlhbmdsZSh0cmlhbmdsZSwgZXAsIGVxKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHAxID0gdHJpYW5nbGUucG9pbnRDQ1cocG9pbnQpO1xuICAgIHZhciBvMSA9IG9yaWVudDJkKGVxLCBwMSwgZXApO1xuICAgIGlmIChvMSA9PT0gT3JpZW50YXRpb24uQ09MTElORUFSKSB7XG4gICAgICAgIC8vIFRPRE8gaW50ZWdyYXRlIGhlcmUgY2hhbmdlcyBmcm9tIEMrKyB2ZXJzaW9uXG4gICAgICAgIC8vIChDKysgcmVwbyByZXZpc2lvbiAwOTg4MGE4NjkwOTUgZGF0ZWQgTWFyY2ggOCwgMjAxMSlcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoJ3BvbHkydHJpIEVkZ2VFdmVudDogQ29sbGluZWFyIG5vdCBzdXBwb3J0ZWQhJywgW2VxLCBwMSwgZXBdKTtcbiAgICB9XG5cbiAgICB2YXIgcDIgPSB0cmlhbmdsZS5wb2ludENXKHBvaW50KTtcbiAgICB2YXIgbzIgPSBvcmllbnQyZChlcSwgcDIsIGVwKTtcbiAgICBpZiAobzIgPT09IE9yaWVudGF0aW9uLkNPTExJTkVBUikge1xuICAgICAgICAvLyBUT0RPIGludGVncmF0ZSBoZXJlIGNoYW5nZXMgZnJvbSBDKysgdmVyc2lvblxuICAgICAgICAvLyAoQysrIHJlcG8gcmV2aXNpb24gMDk4ODBhODY5MDk1IGRhdGVkIE1hcmNoIDgsIDIwMTEpXG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKCdwb2x5MnRyaSBFZGdlRXZlbnQ6IENvbGxpbmVhciBub3Qgc3VwcG9ydGVkIScsIFtlcSwgcDIsIGVwXSk7XG4gICAgfVxuXG4gICAgaWYgKG8xID09PSBvMikge1xuICAgICAgICAvLyBOZWVkIHRvIGRlY2lkZSBpZiB3ZSBhcmUgcm90YXRpbmcgQ1cgb3IgQ0NXIHRvIGdldCB0byBhIHRyaWFuZ2xlXG4gICAgICAgIC8vIHRoYXQgd2lsbCBjcm9zcyBlZGdlXG4gICAgICAgIGlmIChvMSA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgICAgIHRyaWFuZ2xlID0gdHJpYW5nbGUubmVpZ2hib3JDQ1cocG9pbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJpYW5nbGUgPSB0cmlhbmdsZS5uZWlnaGJvckNXKHBvaW50KTtcbiAgICAgICAgfVxuICAgICAgICBlZGdlRXZlbnRCeVBvaW50cyh0Y3gsIGVwLCBlcSwgdHJpYW5nbGUsIHBvaW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIHRyaWFuZ2xlIGNyb3NzZXMgY29uc3RyYWludCBzbyBsZXRzIGZsaXBwaW4gc3RhcnQhXG4gICAgICAgIGZsaXBFZGdlRXZlbnQodGN4LCBlcCwgZXEsIHRyaWFuZ2xlLCBwb2ludCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0VkZ2VTaWRlT2ZUcmlhbmdsZSh0cmlhbmdsZSwgZXAsIGVxKSB7XG4gICAgdmFyIGluZGV4ID0gdHJpYW5nbGUuZWRnZUluZGV4KGVwLCBlcSk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICB0cmlhbmdsZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleChpbmRleCk7XG4gICAgICAgIHZhciB0ID0gdHJpYW5nbGUuZ2V0TmVpZ2hib3IoaW5kZXgpO1xuICAgICAgICBpZiAodCkge1xuICAgICAgICAgICAgdC5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZXAsIGVxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZnJvbnQgdHJpYW5nbGUgYW5kIGxlZ2FsaXplIGl0XG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gbmV3RnJvbnRUcmlhbmdsZSh0Y3gsIHBvaW50LCBub2RlKSB7XG4gICAgdmFyIHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKHBvaW50LCBub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQpO1xuXG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUudHJpYW5nbGUpO1xuICAgIHRjeC5hZGRUb01hcCh0cmlhbmdsZSk7XG5cbiAgICB2YXIgbmV3X25vZGUgPSBuZXcgTm9kZShwb2ludCk7XG4gICAgbmV3X25vZGUubmV4dCA9IG5vZGUubmV4dDtcbiAgICBuZXdfbm9kZS5wcmV2ID0gbm9kZTtcbiAgICBub2RlLm5leHQucHJldiA9IG5ld19ub2RlO1xuICAgIG5vZGUubmV4dCA9IG5ld19ub2RlO1xuXG4gICAgaWYgKCFsZWdhbGl6ZSh0Y3gsIHRyaWFuZ2xlKSkge1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHRyaWFuZ2xlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3X25vZGU7XG59XG5cbi8qKlxuICogQWRkcyBhIHRyaWFuZ2xlIHRvIHRoZSBhZHZhbmNpbmcgZnJvbnQgdG8gZmlsbCBhIGhvbGUuXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBub2RlIC0gbWlkZGxlIG5vZGUsIHRoYXQgaXMgdGhlIGJvdHRvbSBvZiB0aGUgaG9sZVxuICovXG5mdW5jdGlvbiBmaWxsKHRjeCwgbm9kZSkge1xuICAgIHZhciB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZShub2RlLnByZXYucG9pbnQsIG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCk7XG5cbiAgICAvLyBUT0RPOiBzaG91bGQgY29weSB0aGUgY29uc3RyYWluZWRfZWRnZSB2YWx1ZSBmcm9tIG5laWdoYm9yIHRyaWFuZ2xlc1xuICAgIC8vICAgICAgIGZvciBub3cgY29uc3RyYWluZWRfZWRnZSB2YWx1ZXMgYXJlIGNvcGllZCBkdXJpbmcgdGhlIGxlZ2FsaXplXG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUucHJldi50cmlhbmdsZSk7XG4gICAgdHJpYW5nbGUubWFya05laWdoYm9yKG5vZGUudHJpYW5nbGUpO1xuXG4gICAgdGN4LmFkZFRvTWFwKHRyaWFuZ2xlKTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgYWR2YW5jaW5nIGZyb250XG4gICAgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHQ7XG4gICAgbm9kZS5uZXh0LnByZXYgPSBub2RlLnByZXY7XG5cblxuICAgIC8vIElmIGl0IHdhcyBsZWdhbGl6ZWQgdGhlIHRyaWFuZ2xlIGhhcyBhbHJlYWR5IGJlZW4gbWFwcGVkXG4gICAgaWYgKCFsZWdhbGl6ZSh0Y3gsIHRyaWFuZ2xlKSkge1xuICAgICAgICB0Y3gubWFwVHJpYW5nbGVUb05vZGVzKHRyaWFuZ2xlKTtcbiAgICB9XG5cbiAgICAvL3RjeC5yZW1vdmVOb2RlKG5vZGUpO1xufVxuXG4vKipcbiAqIEZpbGxzIGhvbGVzIGluIHRoZSBBZHZhbmNpbmcgRnJvbnRcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICovXG5mdW5jdGlvbiBmaWxsQWR2YW5jaW5nRnJvbnQodGN4LCBuKSB7XG4gICAgLy8gRmlsbCByaWdodCBob2xlc1xuICAgIHZhciBub2RlID0gbi5uZXh0O1xuICAgIHdoaWxlIChub2RlLm5leHQpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIGFjZjgxZjFmMTc2NCBkYXRlZCBBcHJpbCA3LCAyMDEyKVxuICAgICAgICBpZiAoaXNBbmdsZU9idHVzZShub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUucHJldi5wb2ludCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZpbGwodGN4LCBub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG5cbiAgICAvLyBGaWxsIGxlZnQgaG9sZXNcbiAgICBub2RlID0gbi5wcmV2O1xuICAgIHdoaWxlIChub2RlLnByZXYpIHtcbiAgICAgICAgLy8gVE9ETyBpbnRlZ3JhdGUgaGVyZSBjaGFuZ2VzIGZyb20gQysrIHZlcnNpb25cbiAgICAgICAgLy8gKEMrKyByZXBvIHJldmlzaW9uIGFjZjgxZjFmMTc2NCBkYXRlZCBBcHJpbCA3LCAyMDEyKVxuICAgICAgICBpZiAoaXNBbmdsZU9idHVzZShub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUucHJldi5wb2ludCkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGZpbGwodGN4LCBub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICB9XG5cbiAgICAvLyBGaWxsIHJpZ2h0IGJhc2luc1xuICAgIGlmIChuLm5leHQgJiYgbi5uZXh0Lm5leHQpIHtcbiAgICAgICAgaWYgKGlzQmFzaW5BbmdsZVJpZ2h0KG4pKSB7XG4gICAgICAgICAgICBmaWxsQmFzaW4odGN4LCBuKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBUaGUgYmFzaW4gYW5nbGUgaXMgZGVjaWRlZCBhZ2FpbnN0IHRoZSBob3Jpem9udGFsIGxpbmUgWzEsMF0uXG4gKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgYW5nbGUgPCAzKs+ALzRcbiAqL1xuZnVuY3Rpb24gaXNCYXNpbkFuZ2xlUmlnaHQobm9kZSkge1xuICAgIHZhciBheCA9IG5vZGUucG9pbnQueCAtIG5vZGUubmV4dC5uZXh0LnBvaW50Lng7XG4gICAgdmFyIGF5ID0gbm9kZS5wb2ludC55IC0gbm9kZS5uZXh0Lm5leHQucG9pbnQueTtcbiAgICBhc3NlcnQoYXkgPj0gMCwgXCJ1bm9yZGVyZWQgeVwiKTtcbiAgICByZXR1cm4gKGF4ID49IDAgfHwgTWF0aC5hYnMoYXgpIDwgYXkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0cmlhbmdsZSB3YXMgbGVnYWxpemVkXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGxlZ2FsaXplKHRjeCwgdCkge1xuICAgIC8vIFRvIGxlZ2FsaXplIGEgdHJpYW5nbGUgd2Ugc3RhcnQgYnkgZmluZGluZyBpZiBhbnkgb2YgdGhlIHRocmVlIGVkZ2VzXG4gICAgLy8gdmlvbGF0ZSB0aGUgRGVsYXVuYXkgY29uZGl0aW9uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyArK2kpIHtcbiAgICAgICAgaWYgKHQuZGVsYXVuYXlfZWRnZVtpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG90ID0gdC5nZXROZWlnaGJvcihpKTtcbiAgICAgICAgaWYgKG90KSB7XG4gICAgICAgICAgICB2YXIgcCA9IHQuZ2V0UG9pbnQoaSk7XG4gICAgICAgICAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuICAgICAgICAgICAgdmFyIG9pID0gb3QuaW5kZXgob3ApO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgQ29uc3RyYWluZWQgRWRnZSBvciBhIERlbGF1bmF5IEVkZ2Uob25seSBkdXJpbmcgcmVjdXJzaXZlIGxlZ2FsaXphdGlvbilcbiAgICAgICAgICAgIC8vIHRoZW4gd2Ugc2hvdWxkIG5vdCB0cnkgdG8gbGVnYWxpemVcbiAgICAgICAgICAgIGlmIChvdC5jb25zdHJhaW5lZF9lZGdlW29pXSB8fCBvdC5kZWxhdW5heV9lZGdlW29pXSkge1xuICAgICAgICAgICAgICAgIHQuY29uc3RyYWluZWRfZWRnZVtpXSA9IG90LmNvbnN0cmFpbmVkX2VkZ2Vbb2ldO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5zaWRlID0gaW5DaXJjbGUocCwgdC5wb2ludENDVyhwKSwgdC5wb2ludENXKHApLCBvcCk7XG4gICAgICAgICAgICBpZiAoaW5zaWRlKSB7XG4gICAgICAgICAgICAgICAgLy8gTGV0cyBtYXJrIHRoaXMgc2hhcmVkIGVkZ2UgYXMgRGVsYXVuYXlcbiAgICAgICAgICAgICAgICB0LmRlbGF1bmF5X2VkZ2VbaV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIG90LmRlbGF1bmF5X2VkZ2Vbb2ldID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIC8vIExldHMgcm90YXRlIHNoYXJlZCBlZGdlIG9uZSB2ZXJ0ZXggQ1cgdG8gbGVnYWxpemUgaXRcbiAgICAgICAgICAgICAgICByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKTtcblxuICAgICAgICAgICAgICAgIC8vIFdlIG5vdyBnb3Qgb25lIHZhbGlkIERlbGF1bmF5IEVkZ2Ugc2hhcmVkIGJ5IHR3byB0cmlhbmdsZXNcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGdpdmVzIHVzIDQgbmV3IGVkZ2VzIHRvIGNoZWNrIGZvciBEZWxhdW5heVxuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdHJpYW5nbGUgdG8gbm9kZSBtYXBwaW5nIGlzIGRvbmUgb25seSBvbmUgdGltZSBmb3IgYSBzcGVjaWZpYyB0cmlhbmdsZVxuICAgICAgICAgICAgICAgIHZhciBub3RfbGVnYWxpemVkID0gIWxlZ2FsaXplKHRjeCwgdCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vdF9sZWdhbGl6ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBub3RfbGVnYWxpemVkID0gIWxlZ2FsaXplKHRjeCwgb3QpO1xuICAgICAgICAgICAgICAgIGlmIChub3RfbGVnYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRjeC5tYXBUcmlhbmdsZVRvTm9kZXMob3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0aGUgRGVsYXVuYXkgZWRnZXMsIHNpbmNlIHRoZXkgb25seSBhcmUgdmFsaWQgRGVsYXVuYXkgZWRnZXNcbiAgICAgICAgICAgICAgICAvLyB1bnRpbCB3ZSBhZGQgYSBuZXcgdHJpYW5nbGUgb3IgcG9pbnQuXG4gICAgICAgICAgICAgICAgLy8gWFhYOiBuZWVkIHRvIHRoaW5rIGFib3V0IHRoaXMuIENhbiB0aGVzZSBlZGdlcyBiZSB0cmllZCBhZnRlciB3ZVxuICAgICAgICAgICAgICAgIC8vICAgICAgcmV0dXJuIHRvIHByZXZpb3VzIHJlY3Vyc2l2ZSBsZXZlbD9cbiAgICAgICAgICAgICAgICB0LmRlbGF1bmF5X2VkZ2VbaV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBvdC5kZWxhdW5heV9lZGdlW29pXSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gSWYgdHJpYW5nbGUgaGF2ZSBiZWVuIGxlZ2FsaXplZCBubyBuZWVkIHRvIGNoZWNrIHRoZSBvdGhlciBlZGdlcyBzaW5jZVxuICAgICAgICAgICAgICAgIC8vIHRoZSByZWN1cnNpdmUgbGVnYWxpemF0aW9uIHdpbGwgaGFuZGxlcyB0aG9zZSBzbyB3ZSBjYW4gZW5kIGhlcmUuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIDxiPlJlcXVpcmVtZW50PC9iPjo8YnI+XG4gKiAxLiBhLGIgYW5kIGMgZm9ybSBhIHRyaWFuZ2xlLjxicj5cbiAqIDIuIGEgYW5kIGQgaXMga25vdyB0byBiZSBvbiBvcHBvc2l0ZSBzaWRlIG9mIGJjPGJyPlxuICogPHByZT5cbiAqICAgICAgICAgICAgICAgIGFcbiAqICAgICAgICAgICAgICAgICtcbiAqICAgICAgICAgICAgICAgLyBcXFxuICogICAgICAgICAgICAgIC8gICBcXFxuICogICAgICAgICAgICBiLyAgICAgXFxjXG4gKiAgICAgICAgICAgICstLS0tLS0tK1xuICogICAgICAgICAgIC8gICAgZCAgICBcXFxuICogICAgICAgICAgLyAgICAgICAgICAgXFxcbiAqIDwvcHJlPlxuICogPGI+RmFjdDwvYj46IGQgaGFzIHRvIGJlIGluIGFyZWEgQiB0byBoYXZlIGEgY2hhbmNlIHRvIGJlIGluc2lkZSB0aGUgY2lyY2xlIGZvcm1lZCBieVxuICogIGEsYiBhbmQgYzxicj5cbiAqICBkIGlzIG91dHNpZGUgQiBpZiBvcmllbnQyZChhLGIsZCkgb3Igb3JpZW50MmQoYyxhLGQpIGlzIENXPGJyPlxuICogIFRoaXMgcHJla25vd2xlZGdlIGdpdmVzIHVzIGEgd2F5IHRvIG9wdGltaXplIHRoZSBpbmNpcmNsZSB0ZXN0XG4gKiBAcGFyYW0gcGEgLSB0cmlhbmdsZSBwb2ludCwgb3Bwb3NpdGUgZFxuICogQHBhcmFtIHBiIC0gdHJpYW5nbGUgcG9pbnRcbiAqIEBwYXJhbSBwYyAtIHRyaWFuZ2xlIHBvaW50XG4gKiBAcGFyYW0gcGQgLSBwb2ludCBvcHBvc2l0ZSBhXG4gKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGQgaXMgaW5zaWRlIGNpcmNsZSwgZmFsc2UgaWYgb24gY2lyY2xlIGVkZ2VcbiAqL1xuZnVuY3Rpb24gaW5DaXJjbGUocGEsIHBiLCBwYywgcGQpIHtcbiAgICB2YXIgYWR4ID0gcGEueCAtIHBkLng7XG4gICAgdmFyIGFkeSA9IHBhLnkgLSBwZC55O1xuICAgIHZhciBiZHggPSBwYi54IC0gcGQueDtcbiAgICB2YXIgYmR5ID0gcGIueSAtIHBkLnk7XG5cbiAgICB2YXIgYWR4YmR5ID0gYWR4ICogYmR5O1xuICAgIHZhciBiZHhhZHkgPSBiZHggKiBhZHk7XG4gICAgdmFyIG9hYmQgPSBhZHhiZHkgLSBiZHhhZHk7XG4gICAgaWYgKG9hYmQgPD0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGNkeCA9IHBjLnggLSBwZC54O1xuICAgIHZhciBjZHkgPSBwYy55IC0gcGQueTtcblxuICAgIHZhciBjZHhhZHkgPSBjZHggKiBhZHk7XG4gICAgdmFyIGFkeGNkeSA9IGFkeCAqIGNkeTtcbiAgICB2YXIgb2NhZCA9IGNkeGFkeSAtIGFkeGNkeTtcbiAgICBpZiAob2NhZCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYmR4Y2R5ID0gYmR4ICogY2R5O1xuICAgIHZhciBjZHhiZHkgPSBjZHggKiBiZHk7XG5cbiAgICB2YXIgYWxpZnQgPSBhZHggKiBhZHggKyBhZHkgKiBhZHk7XG4gICAgdmFyIGJsaWZ0ID0gYmR4ICogYmR4ICsgYmR5ICogYmR5O1xuICAgIHZhciBjbGlmdCA9IGNkeCAqIGNkeCArIGNkeSAqIGNkeTtcblxuICAgIHZhciBkZXQgPSBhbGlmdCAqIChiZHhjZHkgLSBjZHhiZHkpICsgYmxpZnQgKiBvY2FkICsgY2xpZnQgKiBvYWJkO1xuICAgIHJldHVybiBkZXQgPiAwO1xufVxuXG4vKipcbiAqIFJvdGF0ZXMgYSB0cmlhbmdsZSBwYWlyIG9uZSB2ZXJ0ZXggQ1dcbiAqPHByZT5cbiAqICAgICAgIG4yICAgICAgICAgICAgICAgICAgICBuMlxuICogIFAgKy0tLS0tKyAgICAgICAgICAgICBQICstLS0tLStcbiAqICAgIHwgdCAgL3wgICAgICAgICAgICAgICB8XFwgIHQgfFxuICogICAgfCAgIC8gfCAgICAgICAgICAgICAgIHwgXFwgICB8XG4gKiAgbjF8ICAvICB8bjMgICAgICAgICAgIG4xfCAgXFwgIHxuM1xuICogICAgfCAvICAgfCAgICBhZnRlciBDVyAgIHwgICBcXCB8XG4gKiAgICB8LyBvVCB8ICAgICAgICAgICAgICAgfCBvVCBcXHxcbiAqICAgICstLS0tLSsgb1AgICAgICAgICAgICArLS0tLS0rXG4gKiAgICAgICBuNCAgICAgICAgICAgICAgICAgICAgbjRcbiAqIDwvcHJlPlxuICovXG5mdW5jdGlvbiByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKSB7XG4gICAgdmFyIG4xLCBuMiwgbjMsIG40O1xuICAgIG4xID0gdC5uZWlnaGJvckNDVyhwKTtcbiAgICBuMiA9IHQubmVpZ2hib3JDVyhwKTtcbiAgICBuMyA9IG90Lm5laWdoYm9yQ0NXKG9wKTtcbiAgICBuNCA9IG90Lm5laWdoYm9yQ1cob3ApO1xuXG4gICAgdmFyIGNlMSwgY2UyLCBjZTMsIGNlNDtcbiAgICBjZTEgPSB0LmdldENvbnN0cmFpbmVkRWRnZUNDVyhwKTtcbiAgICBjZTIgPSB0LmdldENvbnN0cmFpbmVkRWRnZUNXKHApO1xuICAgIGNlMyA9IG90LmdldENvbnN0cmFpbmVkRWRnZUNDVyhvcCk7XG4gICAgY2U0ID0gb3QuZ2V0Q29uc3RyYWluZWRFZGdlQ1cob3ApO1xuXG4gICAgdmFyIGRlMSwgZGUyLCBkZTMsIGRlNDtcbiAgICBkZTEgPSB0LmdldERlbGF1bmF5RWRnZUNDVyhwKTtcbiAgICBkZTIgPSB0LmdldERlbGF1bmF5RWRnZUNXKHApO1xuICAgIGRlMyA9IG90LmdldERlbGF1bmF5RWRnZUNDVyhvcCk7XG4gICAgZGU0ID0gb3QuZ2V0RGVsYXVuYXlFZGdlQ1cob3ApO1xuXG4gICAgdC5sZWdhbGl6ZShwLCBvcCk7XG4gICAgb3QubGVnYWxpemUob3AsIHApO1xuXG4gICAgLy8gUmVtYXAgZGVsYXVuYXlfZWRnZVxuICAgIG90LnNldERlbGF1bmF5RWRnZUNDVyhwLCBkZTEpO1xuICAgIHQuc2V0RGVsYXVuYXlFZGdlQ1cocCwgZGUyKTtcbiAgICB0LnNldERlbGF1bmF5RWRnZUNDVyhvcCwgZGUzKTtcbiAgICBvdC5zZXREZWxhdW5heUVkZ2VDVyhvcCwgZGU0KTtcblxuICAgIC8vIFJlbWFwIGNvbnN0cmFpbmVkX2VkZ2VcbiAgICBvdC5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cocCwgY2UxKTtcbiAgICB0LnNldENvbnN0cmFpbmVkRWRnZUNXKHAsIGNlMik7XG4gICAgdC5zZXRDb25zdHJhaW5lZEVkZ2VDQ1cob3AsIGNlMyk7XG4gICAgb3Quc2V0Q29uc3RyYWluZWRFZGdlQ1cob3AsIGNlNCk7XG5cbiAgICAvLyBSZW1hcCBuZWlnaGJvcnNcbiAgICAvLyBYWFg6IG1pZ2h0IG9wdGltaXplIHRoZSBtYXJrTmVpZ2hib3IgYnkga2VlcGluZyB0cmFjayBvZlxuICAgIC8vICAgICAgd2hhdCBzaWRlIHNob3VsZCBiZSBhc3NpZ25lZCB0byB3aGF0IG5laWdoYm9yIGFmdGVyIHRoZVxuICAgIC8vICAgICAgcm90YXRpb24uIE5vdyBtYXJrIG5laWdoYm9yIGRvZXMgbG90cyBvZiB0ZXN0aW5nIHRvIGZpbmRcbiAgICAvLyAgICAgIHRoZSByaWdodCBzaWRlLlxuICAgIHQuY2xlYXJOZWlnaGJvcnMoKTtcbiAgICBvdC5jbGVhck5laWdoYm9ycygpO1xuICAgIGlmIChuMSkge1xuICAgICAgICBvdC5tYXJrTmVpZ2hib3IobjEpO1xuICAgIH1cbiAgICBpZiAobjIpIHtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3IobjIpO1xuICAgIH1cbiAgICBpZiAobjMpIHtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3IobjMpO1xuICAgIH1cbiAgICBpZiAobjQpIHtcbiAgICAgICAgb3QubWFya05laWdoYm9yKG40KTtcbiAgICB9XG4gICAgdC5tYXJrTmVpZ2hib3Iob3QpO1xufVxuXG4vKipcbiAqIEZpbGxzIGEgYmFzaW4gdGhhdCBoYXMgZm9ybWVkIG9uIHRoZSBBZHZhbmNpbmcgRnJvbnQgdG8gdGhlIHJpZ2h0XG4gKiBvZiBnaXZlbiBub2RlLjxicj5cbiAqIEZpcnN0IHdlIGRlY2lkZSBhIGxlZnQsYm90dG9tIGFuZCByaWdodCBub2RlIHRoYXQgZm9ybXMgdGhlXG4gKiBib3VuZGFyaWVzIG9mIHRoZSBiYXNpbi4gVGhlbiB3ZSBkbyBhIHJlcXVyc2l2ZSBmaWxsLlxuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG5vZGUgLSBzdGFydGluZyBub2RlLCB0aGlzIG9yIG5leHQgbm9kZSB3aWxsIGJlIGxlZnQgbm9kZVxuICovXG5mdW5jdGlvbiBmaWxsQmFzaW4odGN4LCBub2RlKSB7XG4gICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgdGN4LmJhc2luLmxlZnRfbm9kZSA9IG5vZGUubmV4dC5uZXh0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRjeC5iYXNpbi5sZWZ0X25vZGUgPSBub2RlLm5leHQ7XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgYm90dG9tIGFuZCByaWdodCBub2RlXG4gICAgdGN4LmJhc2luLmJvdHRvbV9ub2RlID0gdGN4LmJhc2luLmxlZnRfbm9kZTtcbiAgICB3aGlsZSAodGN4LmJhc2luLmJvdHRvbV9ub2RlLm5leHQgJiYgdGN4LmJhc2luLmJvdHRvbV9ub2RlLnBvaW50LnkgPj0gdGN4LmJhc2luLmJvdHRvbV9ub2RlLm5leHQucG9pbnQueSkge1xuICAgICAgICB0Y3guYmFzaW4uYm90dG9tX25vZGUgPSB0Y3guYmFzaW4uYm90dG9tX25vZGUubmV4dDtcbiAgICB9XG4gICAgaWYgKHRjeC5iYXNpbi5ib3R0b21fbm9kZSA9PT0gdGN4LmJhc2luLmxlZnRfbm9kZSkge1xuICAgICAgICAvLyBObyB2YWxpZCBiYXNpblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGN4LmJhc2luLnJpZ2h0X25vZGUgPSB0Y3guYmFzaW4uYm90dG9tX25vZGU7XG4gICAgd2hpbGUgKHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQgJiYgdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueSA8IHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQucG9pbnQueSkge1xuICAgICAgICB0Y3guYmFzaW4ucmlnaHRfbm9kZSA9IHRjeC5iYXNpbi5yaWdodF9ub2RlLm5leHQ7XG4gICAgfVxuICAgIGlmICh0Y3guYmFzaW4ucmlnaHRfbm9kZSA9PT0gdGN4LmJhc2luLmJvdHRvbV9ub2RlKSB7XG4gICAgICAgIC8vIE5vIHZhbGlkIGJhc2luc1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGN4LmJhc2luLndpZHRoID0gdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueCAtIHRjeC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueDtcbiAgICB0Y3guYmFzaW4ubGVmdF9oaWdoZXN0ID0gdGN4LmJhc2luLmxlZnRfbm9kZS5wb2ludC55ID4gdGN4LmJhc2luLnJpZ2h0X25vZGUucG9pbnQueTtcblxuICAgIGZpbGxCYXNpblJlcSh0Y3gsIHRjeC5iYXNpbi5ib3R0b21fbm9kZSk7XG59XG5cbi8qKlxuICogUmVjdXJzaXZlIGFsZ29yaXRobSB0byBmaWxsIGEgQmFzaW4gd2l0aCB0cmlhbmdsZXNcbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBub2RlIC0gYm90dG9tX25vZGVcbiAqL1xuZnVuY3Rpb24gZmlsbEJhc2luUmVxKHRjeCwgbm9kZSkge1xuICAgIC8vIGlmIHNoYWxsb3cgc3RvcCBmaWxsaW5nXG4gICAgaWYgKGlzU2hhbGxvdyh0Y3gsIG5vZGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmaWxsKHRjeCwgbm9kZSk7XG5cbiAgICB2YXIgbztcbiAgICBpZiAobm9kZS5wcmV2ID09PSB0Y3guYmFzaW4ubGVmdF9ub2RlICYmIG5vZGUubmV4dCA9PT0gdGN4LmJhc2luLnJpZ2h0X25vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAobm9kZS5wcmV2ID09PSB0Y3guYmFzaW4ubGVmdF9ub2RlKSB7XG4gICAgICAgIG8gPSBvcmllbnQyZChub2RlLnBvaW50LCBub2RlLm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0LnBvaW50KTtcbiAgICAgICAgaWYgKG8gPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9IGVsc2UgaWYgKG5vZGUubmV4dCA9PT0gdGN4LmJhc2luLnJpZ2h0X25vZGUpIHtcbiAgICAgICAgbyA9IG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQpO1xuICAgICAgICBpZiAobyA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucHJldjtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBuZWlnaGJvciBub2RlIHdpdGggbG93ZXN0IFkgdmFsdWVcbiAgICAgICAgaWYgKG5vZGUucHJldi5wb2ludC55IDwgbm9kZS5uZXh0LnBvaW50LnkpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnByZXY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbEJhc2luUmVxKHRjeCwgbm9kZSk7XG59XG5cbmZ1bmN0aW9uIGlzU2hhbGxvdyh0Y3gsIG5vZGUpIHtcbiAgICB2YXIgaGVpZ2h0O1xuICAgIGlmICh0Y3guYmFzaW4ubGVmdF9oaWdoZXN0KSB7XG4gICAgICAgIGhlaWdodCA9IHRjeC5iYXNpbi5sZWZ0X25vZGUucG9pbnQueSAtIG5vZGUucG9pbnQueTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWlnaHQgPSB0Y3guYmFzaW4ucmlnaHRfbm9kZS5wb2ludC55IC0gbm9kZS5wb2ludC55O1xuICAgIH1cblxuICAgIC8vIGlmIHNoYWxsb3cgc3RvcCBmaWxsaW5nXG4gICAgaWYgKHRjeC5iYXNpbi53aWR0aCA+IGhlaWdodCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBmaWxsRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmICh0Y3guZWRnZV9ldmVudC5yaWdodCkge1xuICAgICAgICBmaWxsUmlnaHRBYm92ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbGxMZWZ0QWJvdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIHdoaWxlIChub2RlLm5leHQucG9pbnQueCA8IGVkZ2UucC54KSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5leHQgbm9kZSBpcyBiZWxvdyB0aGUgZWRnZVxuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLm5leHQucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgZmlsbFJpZ2h0QmVsb3dFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxSaWdodEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmIChub2RlLnBvaW50LnggPCBlZGdlLnAueCkge1xuICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5uZXh0LnBvaW50LCBub2RlLm5leHQubmV4dC5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICAgICAgZmlsbFJpZ2h0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udmV4XG4gICAgICAgICAgICBmaWxsUmlnaHRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIC8vIFJldHJ5IHRoaXMgb25lXG4gICAgICAgICAgICBmaWxsUmlnaHRCZWxvd0VkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGZpbGwodGN4LCBub2RlLm5leHQpO1xuICAgIGlmIChub2RlLm5leHQucG9pbnQgIT09IGVkZ2UucCkge1xuICAgICAgICAvLyBOZXh0IGFib3ZlIG9yIGJlbG93IGVkZ2U/XG4gICAgICAgIGlmIChvcmllbnQyZChlZGdlLnEsIG5vZGUubmV4dC5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbmNhdmVcbiAgICAgICAgICAgICAgICBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29udmV4XG4gICAgICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsbFJpZ2h0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIC8vIE5leHQgY29uY2F2ZSBvciBjb252ZXg/XG4gICAgaWYgKG9yaWVudDJkKG5vZGUubmV4dC5wb2ludCwgbm9kZS5uZXh0Lm5leHQucG9pbnQsIG5vZGUubmV4dC5uZXh0Lm5leHQucG9pbnQpID09PSBPcmllbnRhdGlvbi5DQ1cpIHtcbiAgICAgICAgLy8gQ29uY2F2ZVxuICAgICAgICBmaWxsUmlnaHRDb25jYXZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5uZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBDb252ZXhcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLm5leHQubmV4dC5wb2ludCwgZWRnZS5wKSA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgZmlsbFJpZ2h0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZS5uZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFib3ZlXG4gICAgICAgICAgICAvKiBqc2hpbnQgbm9lbXB0eTpmYWxzZSAqL1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdEFib3ZlRWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIHdoaWxlIChub2RlLnByZXYucG9pbnQueCA+IGVkZ2UucC54KSB7XG4gICAgICAgIC8vIENoZWNrIGlmIG5leHQgbm9kZSBpcyBiZWxvdyB0aGUgZWRnZVxuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5wcmV2O1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIGlmIChub2RlLnBvaW50LnggPiBlZGdlLnAueCkge1xuICAgICAgICBpZiAob3JpZW50MmQobm9kZS5wb2ludCwgbm9kZS5wcmV2LnBvaW50LCBub2RlLnByZXYucHJldi5wb2ludCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgICAgICBmaWxsTGVmdENvbmNhdmVFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvbnZleFxuICAgICAgICAgICAgZmlsbExlZnRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlKTtcbiAgICAgICAgICAgIC8vIFJldHJ5IHRoaXMgb25lXG4gICAgICAgICAgICBmaWxsTGVmdEJlbG93RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0Q29udmV4RWRnZUV2ZW50KHRjeCwgZWRnZSwgbm9kZSkge1xuICAgIC8vIE5leHQgY29uY2F2ZSBvciBjb252ZXg/XG4gICAgaWYgKG9yaWVudDJkKG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQsIG5vZGUucHJldi5wcmV2LnByZXYucG9pbnQpID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAvLyBDb25jYXZlXG4gICAgICAgIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUucHJldik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQ29udmV4XG4gICAgICAgIC8vIE5leHQgYWJvdmUgb3IgYmVsb3cgZWRnZT9cbiAgICAgICAgaWYgKG9yaWVudDJkKGVkZ2UucSwgbm9kZS5wcmV2LnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgZmlsbExlZnRDb252ZXhFZGdlRXZlbnQodGN4LCBlZGdlLCBub2RlLnByZXYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQWJvdmVcbiAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpIHtcbiAgICBmaWxsKHRjeCwgbm9kZS5wcmV2KTtcbiAgICBpZiAobm9kZS5wcmV2LnBvaW50ICE9PSBlZGdlLnApIHtcbiAgICAgICAgLy8gTmV4dCBhYm92ZSBvciBiZWxvdyBlZGdlP1xuICAgICAgICBpZiAob3JpZW50MmQoZWRnZS5xLCBub2RlLnByZXYucG9pbnQsIGVkZ2UucCkgPT09IE9yaWVudGF0aW9uLkNXKSB7XG4gICAgICAgICAgICAvLyBCZWxvd1xuICAgICAgICAgICAgaWYgKG9yaWVudDJkKG5vZGUucG9pbnQsIG5vZGUucHJldi5wb2ludCwgbm9kZS5wcmV2LnByZXYucG9pbnQpID09PSBPcmllbnRhdGlvbi5DVykge1xuICAgICAgICAgICAgICAgIC8vIE5leHQgaXMgY29uY2F2ZVxuICAgICAgICAgICAgICAgIGZpbGxMZWZ0Q29uY2F2ZUVkZ2VFdmVudCh0Y3gsIGVkZ2UsIG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOZXh0IGlzIGNvbnZleFxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBub2VtcHR5OmZhbHNlICovXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZsaXBFZGdlRXZlbnQodGN4LCBlcCwgZXEsIHQsIHApIHtcbiAgICB2YXIgb3QgPSB0Lm5laWdoYm9yQWNyb3NzKHApO1xuICAgIGFzc2VydChvdCwgXCJGTElQIGZhaWxlZCBkdWUgdG8gbWlzc2luZyB0cmlhbmdsZSFcIik7XG5cbiAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuXG4gICAgLy8gQWRkaXRpb25hbCBjaGVjayBmcm9tIEphdmEgdmVyc2lvbiAoc2VlIGlzc3VlICM4OClcbiAgICBpZiAodC5nZXRDb25zdHJhaW5lZEVkZ2VBY3Jvc3MocCkpIHtcbiAgICAgICAgdmFyIGluZGV4ID0gdC5pbmRleChwKTtcbiAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoXCJwb2x5MnRyaSBJbnRlcnNlY3RpbmcgQ29uc3RyYWludHNcIixcbiAgICAgICAgICAgICAgICBbcCwgb3AsIHQuZ2V0UG9pbnQoKGluZGV4ICsgMSkgJSAzKSwgdC5nZXRQb2ludCgoaW5kZXggKyAyKSAlIDMpXSk7XG4gICAgfVxuXG4gICAgaWYgKGluU2NhbkFyZWEocCwgdC5wb2ludENDVyhwKSwgdC5wb2ludENXKHApLCBvcCkpIHtcbiAgICAgICAgLy8gTGV0cyByb3RhdGUgc2hhcmVkIGVkZ2Ugb25lIHZlcnRleCBDV1xuICAgICAgICByb3RhdGVUcmlhbmdsZVBhaXIodCwgcCwgb3QsIG9wKTtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2Rlcyh0KTtcbiAgICAgICAgdGN4Lm1hcFRyaWFuZ2xlVG9Ob2RlcyhvdCk7XG5cbiAgICAgICAgLy8gWFhYOiBpbiB0aGUgb3JpZ2luYWwgQysrIGNvZGUgZm9yIHRoZSBuZXh0IDIgbGluZXMsIHdlIGFyZVxuICAgICAgICAvLyBjb21wYXJpbmcgcG9pbnQgdmFsdWVzIChhbmQgbm90IHBvaW50ZXJzKS4gSW4gdGhpcyBKYXZhU2NyaXB0XG4gICAgICAgIC8vIGNvZGUsIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcyAocG9pbnRlcnMpLiBUaGlzIHdvcmtzXG4gICAgICAgIC8vIGJlY2F1c2Ugd2UgY2FuJ3QgaGF2ZSAyIGRpZmZlcmVudCBwb2ludHMgd2l0aCB0aGUgc2FtZSB2YWx1ZXMuXG4gICAgICAgIC8vIEJ1dCB0byBiZSByZWFsbHkgZXF1aXZhbGVudCwgd2Ugc2hvdWxkIHVzZSBcIlBvaW50LmVxdWFsc1wiIGhlcmUuXG4gICAgICAgIGlmIChwID09PSBlcSAmJiBvcCA9PT0gZXApIHtcbiAgICAgICAgICAgIGlmIChlcSA9PT0gdGN4LmVkZ2VfZXZlbnQuY29uc3RyYWluZWRfZWRnZS5xICYmIGVwID09PSB0Y3guZWRnZV9ldmVudC5jb25zdHJhaW5lZF9lZGdlLnApIHtcbiAgICAgICAgICAgICAgICB0Lm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlcCwgZXEpO1xuICAgICAgICAgICAgICAgIG90Lm1hcmtDb25zdHJhaW5lZEVkZ2VCeVBvaW50cyhlcCwgZXEpO1xuICAgICAgICAgICAgICAgIGxlZ2FsaXplKHRjeCwgdCk7XG4gICAgICAgICAgICAgICAgbGVnYWxpemUodGN4LCBvdCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFhYWDogSSB0aGluayBvbmUgb2YgdGhlIHRyaWFuZ2xlcyBzaG91bGQgYmUgbGVnYWxpemVkIGhlcmU/XG4gICAgICAgICAgICAgICAgLyoganNoaW50IG5vZW1wdHk6ZmFsc2UgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvID0gb3JpZW50MmQoZXEsIG9wLCBlcCk7XG4gICAgICAgICAgICB0ID0gbmV4dEZsaXBUcmlhbmdsZSh0Y3gsIG8sIHQsIG90LCBwLCBvcCk7XG4gICAgICAgICAgICBmbGlwRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0LCBwKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdQID0gbmV4dEZsaXBQb2ludChlcCwgZXEsIG90LCBvcCk7XG4gICAgICAgIGZsaXBTY2FuRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCB0LCBvdCwgbmV3UCk7XG4gICAgICAgIGVkZ2VFdmVudEJ5UG9pbnRzKHRjeCwgZXAsIGVxLCB0LCBwKTtcbiAgICB9XG59XG5cbi8qKlxuICogQWZ0ZXIgYSBmbGlwIHdlIGhhdmUgdHdvIHRyaWFuZ2xlcyBhbmQga25vdyB0aGF0IG9ubHkgb25lIHdpbGwgc3RpbGwgYmVcbiAqIGludGVyc2VjdGluZyB0aGUgZWRnZS4gU28gZGVjaWRlIHdoaWNoIHRvIGNvbnRpdW5lIHdpdGggYW5kIGxlZ2FsaXplIHRoZSBvdGhlclxuICpcbiAqIEBwYXJhbSB7IVN3ZWVwQ29udGV4dH0gdGN4IC0gU3dlZXBDb250ZXh0IG9iamVjdFxuICogQHBhcmFtIG8gLSBzaG91bGQgYmUgdGhlIHJlc3VsdCBvZiBhbiBvcmllbnQyZCggZXEsIG9wLCBlcCApXG4gKiBAcGFyYW0gdCAtIHRyaWFuZ2xlIDFcbiAqIEBwYXJhbSBvdCAtIHRyaWFuZ2xlIDJcbiAqIEBwYXJhbSBwIC0gYSBwb2ludCBzaGFyZWQgYnkgYm90aCB0cmlhbmdsZXNcbiAqIEBwYXJhbSBvcCAtIGFub3RoZXIgcG9pbnQgc2hhcmVkIGJ5IGJvdGggdHJpYW5nbGVzXG4gKiBAcmV0dXJuIHJldHVybnMgdGhlIHRyaWFuZ2xlIHN0aWxsIGludGVyc2VjdGluZyB0aGUgZWRnZVxuICovXG5mdW5jdGlvbiBuZXh0RmxpcFRyaWFuZ2xlKHRjeCwgbywgdCwgb3QsIHAsIG9wKSB7XG4gICAgdmFyIGVkZ2VfaW5kZXg7XG4gICAgaWYgKG8gPT09IE9yaWVudGF0aW9uLkNDVykge1xuICAgICAgICAvLyBvdCBpcyBub3QgY3Jvc3NpbmcgZWRnZSBhZnRlciBmbGlwXG4gICAgICAgIGVkZ2VfaW5kZXggPSBvdC5lZGdlSW5kZXgocCwgb3ApO1xuICAgICAgICBvdC5kZWxhdW5heV9lZGdlW2VkZ2VfaW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgbGVnYWxpemUodGN4LCBvdCk7XG4gICAgICAgIG90LmNsZWFyRGVsYXVuYXlFZGdlcygpO1xuICAgICAgICByZXR1cm4gdDtcbiAgICB9XG5cbiAgICAvLyB0IGlzIG5vdCBjcm9zc2luZyBlZGdlIGFmdGVyIGZsaXBcbiAgICBlZGdlX2luZGV4ID0gdC5lZGdlSW5kZXgocCwgb3ApO1xuXG4gICAgdC5kZWxhdW5heV9lZGdlW2VkZ2VfaW5kZXhdID0gdHJ1ZTtcbiAgICBsZWdhbGl6ZSh0Y3gsIHQpO1xuICAgIHQuY2xlYXJEZWxhdW5heUVkZ2VzKCk7XG4gICAgcmV0dXJuIG90O1xufVxuXG4vKipcbiAqIFdoZW4gd2UgbmVlZCB0byB0cmF2ZXJzZSBmcm9tIG9uZSB0cmlhbmdsZSB0byB0aGUgbmV4dCB3ZSBuZWVkXG4gKiB0aGUgcG9pbnQgaW4gY3VycmVudCB0cmlhbmdsZSB0aGF0IGlzIHRoZSBvcHBvc2l0ZSBwb2ludCB0byB0aGUgbmV4dFxuICogdHJpYW5nbGUuXG4gKi9cbmZ1bmN0aW9uIG5leHRGbGlwUG9pbnQoZXAsIGVxLCBvdCwgb3ApIHtcbiAgICB2YXIgbzJkID0gb3JpZW50MmQoZXEsIG9wLCBlcCk7XG4gICAgaWYgKG8yZCA9PT0gT3JpZW50YXRpb24uQ1cpIHtcbiAgICAgICAgLy8gUmlnaHRcbiAgICAgICAgcmV0dXJuIG90LnBvaW50Q0NXKG9wKTtcbiAgICB9IGVsc2UgaWYgKG8yZCA9PT0gT3JpZW50YXRpb24uQ0NXKSB7XG4gICAgICAgIC8vIExlZnRcbiAgICAgICAgcmV0dXJuIG90LnBvaW50Q1cob3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBQb2ludEVycm9yKFwicG9seTJ0cmkgW1Vuc3VwcG9ydGVkXSBuZXh0RmxpcFBvaW50OiBvcHBvc2luZyBwb2ludCBvbiBjb25zdHJhaW5lZCBlZGdlIVwiLCBbZXEsIG9wLCBlcF0pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTY2FuIHBhcnQgb2YgdGhlIEZsaXBTY2FuIGFsZ29yaXRobTxicj5cbiAqIFdoZW4gYSB0cmlhbmdsZSBwYWlyIGlzbid0IGZsaXBwYWJsZSB3ZSB3aWxsIHNjYW4gZm9yIHRoZSBuZXh0XG4gKiBwb2ludCB0aGF0IGlzIGluc2lkZSB0aGUgZmxpcCB0cmlhbmdsZSBzY2FuIGFyZWEuIFdoZW4gZm91bmRcbiAqIHdlIGdlbmVyYXRlIGEgbmV3IGZsaXBFZGdlRXZlbnRcbiAqXG4gKiBAcGFyYW0geyFTd2VlcENvbnRleHR9IHRjeCAtIFN3ZWVwQ29udGV4dCBvYmplY3RcbiAqIEBwYXJhbSBlcCAtIGxhc3QgcG9pbnQgb24gdGhlIGVkZ2Ugd2UgYXJlIHRyYXZlcnNpbmdcbiAqIEBwYXJhbSBlcSAtIGZpcnN0IHBvaW50IG9uIHRoZSBlZGdlIHdlIGFyZSB0cmF2ZXJzaW5nXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gZmxpcF90cmlhbmdsZSAtIHRoZSBjdXJyZW50IHRyaWFuZ2xlIHNoYXJpbmcgdGhlIHBvaW50IGVxIHdpdGggZWRnZVxuICogQHBhcmFtIHRcbiAqIEBwYXJhbSBwXG4gKi9cbmZ1bmN0aW9uIGZsaXBTY2FuRWRnZUV2ZW50KHRjeCwgZXAsIGVxLCBmbGlwX3RyaWFuZ2xlLCB0LCBwKSB7XG4gICAgdmFyIG90ID0gdC5uZWlnaGJvckFjcm9zcyhwKTtcbiAgICBhc3NlcnQob3QsIFwiRkxJUCBmYWlsZWQgZHVlIHRvIG1pc3NpbmcgdHJpYW5nbGVcIik7XG5cbiAgICB2YXIgb3AgPSBvdC5vcHBvc2l0ZVBvaW50KHQsIHApO1xuXG4gICAgaWYgKGluU2NhbkFyZWEoZXEsIGZsaXBfdHJpYW5nbGUucG9pbnRDQ1coZXEpLCBmbGlwX3RyaWFuZ2xlLnBvaW50Q1coZXEpLCBvcCkpIHtcbiAgICAgICAgLy8gZmxpcCB3aXRoIG5ldyBlZGdlIG9wLmVxXG4gICAgICAgIGZsaXBFZGdlRXZlbnQodGN4LCBlcSwgb3AsIG90LCBvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5ld1AgPSBuZXh0RmxpcFBvaW50KGVwLCBlcSwgb3QsIG9wKTtcbiAgICAgICAgZmxpcFNjYW5FZGdlRXZlbnQodGN4LCBlcCwgZXEsIGZsaXBfdHJpYW5nbGUsIG90LCBuZXdQKTtcbiAgICB9XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHNcblxuZXhwb3J0cy50cmlhbmd1bGF0ZSA9IHRyaWFuZ3VsYXRlO1xuXG59LHtcIi4vYWR2YW5jaW5nZnJvbnRcIjoyLFwiLi9hc3NlcnRcIjozLFwiLi9wb2ludGVycm9yXCI6NSxcIi4vdHJpYW5nbGVcIjo5LFwiLi91dGlsc1wiOjEwfV0sODpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuLyoganNoaW50IG1heGNvbXBsZXhpdHk6NiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgUG9pbnRFcnJvciA9IF9kZXJlcV8oJy4vcG9pbnRlcnJvcicpO1xudmFyIFBvaW50ID0gX2RlcmVxXygnLi9wb2ludCcpO1xudmFyIFRyaWFuZ2xlID0gX2RlcmVxXygnLi90cmlhbmdsZScpO1xudmFyIHN3ZWVwID0gX2RlcmVxXygnLi9zd2VlcCcpO1xudmFyIEFkdmFuY2luZ0Zyb250ID0gX2RlcmVxXygnLi9hZHZhbmNpbmdmcm9udCcpO1xudmFyIE5vZGUgPSBBZHZhbmNpbmdGcm9udC5Ob2RlO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXV0aWxzXG5cbi8qKlxuICogSW5pdGlhbCB0cmlhbmdsZSBmYWN0b3IsIHNlZWQgdHJpYW5nbGUgd2lsbCBleHRlbmQgMzAlIG9mXG4gKiBQb2ludFNldCB3aWR0aCB0byBib3RoIGxlZnQgYW5kIHJpZ2h0LlxuICogQHByaXZhdGVcbiAqIEBjb25zdFxuICovXG52YXIga0FscGhhID0gMC4zO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FZGdlXG4vKipcbiAqIFJlcHJlc2VudHMgYSBzaW1wbGUgcG9seWdvbidzIGVkZ2VcbiAqIEBjb25zdHJ1Y3RvclxuICogQHN0cnVjdFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7UG9pbnR9IHAxXG4gKiBAcGFyYW0ge1BvaW50fSBwMlxuICogQHRocm93IHtQb2ludEVycm9yfSBpZiBwMSBpcyBzYW1lIGFzIHAyXG4gKi9cbnZhciBFZGdlID0gZnVuY3Rpb24ocDEsIHAyKSB7XG4gICAgdGhpcy5wID0gcDE7XG4gICAgdGhpcy5xID0gcDI7XG5cbiAgICBpZiAocDEueSA+IHAyLnkpIHtcbiAgICAgICAgdGhpcy5xID0gcDE7XG4gICAgICAgIHRoaXMucCA9IHAyO1xuICAgIH0gZWxzZSBpZiAocDEueSA9PT0gcDIueSkge1xuICAgICAgICBpZiAocDEueCA+IHAyLngpIHtcbiAgICAgICAgICAgIHRoaXMucSA9IHAxO1xuICAgICAgICAgICAgdGhpcy5wID0gcDI7XG4gICAgICAgIH0gZWxzZSBpZiAocDEueCA9PT0gcDIueCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFBvaW50RXJyb3IoJ3BvbHkydHJpIEludmFsaWQgRWRnZSBjb25zdHJ1Y3RvcjogcmVwZWF0ZWQgcG9pbnRzIScsIFtwMV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnEuX3AydF9lZGdlX2xpc3QpIHtcbiAgICAgICAgdGhpcy5xLl9wMnRfZWRnZV9saXN0ID0gW107XG4gICAgfVxuICAgIHRoaXMucS5fcDJ0X2VkZ2VfbGlzdC5wdXNoKHRoaXMpO1xufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1CYXNpblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBCYXNpbiA9IGZ1bmN0aW9uKCkge1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLmxlZnRfbm9kZSA9IG51bGw7XG4gICAgLyoqIEB0eXBlIHtOb2RlfSAqL1xuICAgIHRoaXMuYm90dG9tX25vZGUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7Tm9kZX0gKi9cbiAgICB0aGlzLnJpZ2h0X25vZGUgPSBudWxsO1xuICAgIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICAgIHRoaXMud2lkdGggPSAwLjA7XG4gICAgLyoqIEB0eXBlIHtib29sZWFufSAqL1xuICAgIHRoaXMubGVmdF9oaWdoZXN0ID0gZmFsc2U7XG59O1xuXG5CYXNpbi5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxlZnRfbm9kZSA9IG51bGw7XG4gICAgdGhpcy5ib3R0b21fbm9kZSA9IG51bGw7XG4gICAgdGhpcy5yaWdodF9ub2RlID0gbnVsbDtcbiAgICB0aGlzLndpZHRoID0gMC4wO1xuICAgIHRoaXMubGVmdF9oaWdoZXN0ID0gZmFsc2U7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUVkZ2VFdmVudFxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBzdHJ1Y3RcbiAqIEBwcml2YXRlXG4gKi9cbnZhciBFZGdlRXZlbnQgPSBmdW5jdGlvbigpIHtcbiAgICAvKiogQHR5cGUge0VkZ2V9ICovXG4gICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlID0gbnVsbDtcbiAgICAvKiogQHR5cGUge2Jvb2xlYW59ICovXG4gICAgdGhpcy5yaWdodCA9IGZhbHNlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVN3ZWVwQ29udGV4dCAocHVibGljIEFQSSlcbi8qKlxuICogU3dlZXBDb250ZXh0IGNvbnN0cnVjdG9yIG9wdGlvblxuICogQHR5cGVkZWYge09iamVjdH0gU3dlZXBDb250ZXh0T3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFuPX0gY2xvbmVBcnJheXMgLSBpZiA8Y29kZT50cnVlPC9jb2RlPiwgZG8gYSBzaGFsbG93IGNvcHkgb2YgdGhlIEFycmF5IHBhcmFtZXRlcnNcbiAqICAgICAgICAgICAgICAgICAgKGNvbnRvdXIsIGhvbGVzKS4gUG9pbnRzIGluc2lkZSBhcnJheXMgYXJlIG5ldmVyIGNvcGllZC5cbiAqICAgICAgICAgICAgICAgICAgRGVmYXVsdCBpcyA8Y29kZT5mYWxzZTwvY29kZT4gOiBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBhcnJheSBhcmd1bWVudHMsXG4gKiAgICAgICAgICAgICAgICAgIHdobyB3aWxsIGJlIG1vZGlmaWVkIGluIHBsYWNlLlxuICovXG4vKipcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgdHJpYW5ndWxhdGlvbiBjb250ZXh0LlxuICogSXQgYWNjZXB0cyBhIHNpbXBsZSBwb2x5bGluZSAod2l0aCBub24gcmVwZWF0aW5nIHBvaW50cyksIFxuICogd2hpY2ggZGVmaW5lcyB0aGUgY29uc3RyYWluZWQgZWRnZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgICAgIHZhciBjb250b3VyID0gW1xuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgxMDAsIDEwMCksXG4gKiAgICAgICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDEwMCwgMzAwKSxcbiAqICAgICAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMzAwLCAzMDApLFxuICogICAgICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDEwMClcbiAqICAgICAgICAgIF07XG4gKiAgICAgICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIsIHtjbG9uZUFycmF5czogdHJ1ZX0pO1xuICogQGV4YW1wbGVcbiAqICAgICAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDB9LCB7eDoxMDAsIHk6MzAwfSwge3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeToxMDB9XTtcbiAqICAgICAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91ciwge2Nsb25lQXJyYXlzOiB0cnVlfSk7XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBzdHJ1Y3RcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPn0gY29udG91ciAtIGFycmF5IG9mIHBvaW50IG9iamVjdHMuIFRoZSBwb2ludHMgY2FuIGJlIGVpdGhlciB7QGxpbmtjb2RlIFBvaW50fSBpbnN0YW5jZXMsXG4gKiAgICAgICAgICBvciBhbnkgXCJQb2ludCBsaWtlXCIgY3VzdG9tIGNsYXNzIHdpdGggPGNvZGU+e3gsIHl9PC9jb2RlPiBhdHRyaWJ1dGVzLlxuICogQHBhcmFtIHtTd2VlcENvbnRleHRPcHRpb25zPX0gb3B0aW9ucyAtIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAqL1xudmFyIFN3ZWVwQ29udGV4dCA9IGZ1bmN0aW9uKGNvbnRvdXIsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLnRyaWFuZ2xlc18gPSBbXTtcbiAgICB0aGlzLm1hcF8gPSBbXTtcbiAgICB0aGlzLnBvaW50c18gPSAob3B0aW9ucy5jbG9uZUFycmF5cyA/IGNvbnRvdXIuc2xpY2UoMCkgOiBjb250b3VyKTtcbiAgICB0aGlzLmVkZ2VfbGlzdCA9IFtdO1xuXG4gICAgLy8gQm91bmRpbmcgYm94IG9mIGFsbCBwb2ludHMuIENvbXB1dGVkIGF0IHRoZSBzdGFydCBvZiB0aGUgdHJpYW5ndWxhdGlvbiwgXG4gICAgLy8gaXQgaXMgc3RvcmVkIGluIGNhc2UgaXQgaXMgbmVlZGVkIGJ5IHRoZSBjYWxsZXIuXG4gICAgdGhpcy5wbWluXyA9IHRoaXMucG1heF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQWR2YW5jaW5nIGZyb250XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7QWR2YW5jaW5nRnJvbnR9XG4gICAgICovXG4gICAgdGhpcy5mcm9udF8gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogaGVhZCBwb2ludCB1c2VkIHdpdGggYWR2YW5jaW5nIGZyb250XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7UG9pbnR9XG4gICAgICovXG4gICAgdGhpcy5oZWFkXyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiB0YWlsIHBvaW50IHVzZWQgd2l0aCBhZHZhbmNpbmcgZnJvbnRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtQb2ludH1cbiAgICAgKi9cbiAgICB0aGlzLnRhaWxfID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICovXG4gICAgdGhpcy5hZl9oZWFkXyA9IG51bGw7XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7Tm9kZX1cbiAgICAgKi9cbiAgICB0aGlzLmFmX21pZGRsZV8gPSBudWxsO1xuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICovXG4gICAgdGhpcy5hZl90YWlsXyA9IG51bGw7XG5cbiAgICB0aGlzLmJhc2luID0gbmV3IEJhc2luKCk7XG4gICAgdGhpcy5lZGdlX2V2ZW50ID0gbmV3IEVkZ2VFdmVudCgpO1xuXG4gICAgdGhpcy5pbml0RWRnZXModGhpcy5wb2ludHNfKTtcbn07XG5cblxuLyoqXG4gKiBBZGQgYSBob2xlIHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIGhvbGUgPSBbXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyMDApLFxuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDIwMCwgMjUwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyNTAsIDI1MClcbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkSG9sZShob2xlKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LmFkZEhvbGUoW3t4OjIwMCwgeToyMDB9LCB7eDoyMDAsIHk6MjUwfSwge3g6MjUwLCB5OjI1MH1dKTtcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSB7QXJyYXkuPFhZPn0gcG9seWxpbmUgLSBhcnJheSBvZiBcIlBvaW50IGxpa2VcIiBvYmplY3RzIHdpdGgge3gseX1cbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRIb2xlID0gZnVuY3Rpb24ocG9seWxpbmUpIHtcbiAgICB0aGlzLmluaXRFZGdlcyhwb2x5bGluZSk7XG4gICAgdmFyIGksIGxlbiA9IHBvbHlsaW5lLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdGhpcy5wb2ludHNfLnB1c2gocG9seWxpbmVbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpczsgLy8gZm9yIGNoYWluaW5nXG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFN3ZWVwQ29udGV4dCNhZGRIb2xlfSBpbnN0ZWFkXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuQWRkSG9sZSA9IFN3ZWVwQ29udGV4dC5wcm90b3R5cGUuYWRkSG9sZTtcblxuXG4vKipcbiAqIEFkZCBzZXZlcmFsIGhvbGVzIHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIGhvbGVzID0gW1xuICogICAgICAgICAgWyBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyMDApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMjAwLCAyNTApLCBuZXcgcG9seTJ0cmkuUG9pbnQoMjUwLCAyNTApIF0sXG4gKiAgICAgICAgICBbIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDMwMCksIG5ldyBwb2x5MnRyaS5Qb2ludCgzMDAsIDM1MCksIG5ldyBwb2x5MnRyaS5Qb2ludCgzNTAsIDM1MCkgXVxuICogICAgICBdO1xuICogICAgICBzd2N0eC5hZGRIb2xlcyhob2xlcyk7XG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgaG9sZXMgPSBbXG4gKiAgICAgICAgICBbe3g6MjAwLCB5OjIwMH0sIHt4OjIwMCwgeToyNTB9LCB7eDoyNTAsIHk6MjUwfV0sXG4gKiAgICAgICAgICBbe3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeTozNTB9LCB7eDozNTAsIHk6MzUwfV1cbiAqICAgICAgXTtcbiAqICAgICAgc3djdHguYWRkSG9sZXMoaG9sZXMpO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtBcnJheS48QXJyYXkuPFhZPj59IGhvbGVzIC0gYXJyYXkgb2YgYXJyYXkgb2YgXCJQb2ludCBsaWtlXCIgb2JqZWN0cyB3aXRoIHt4LHl9XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRIb2xlcyA9IGZ1bmN0aW9uKGhvbGVzKSB7XG4gICAgdmFyIGksIGxlbiA9IGhvbGVzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdGhpcy5pbml0RWRnZXMoaG9sZXNbaV0pO1xuICAgIH1cbiAgICB0aGlzLnBvaW50c18gPSB0aGlzLnBvaW50c18uY29uY2F0LmFwcGx5KHRoaXMucG9pbnRzXywgaG9sZXMpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cblxuLyoqXG4gKiBBZGQgYSBTdGVpbmVyIHBvaW50IHRvIHRoZSBjb25zdHJhaW50c1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgdmFyIHBvaW50ID0gbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnQocG9pbnQpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnQoe3g6MTUwLCB5OjE1MH0pO1xuICogQHB1YmxpY1xuICogQHBhcmFtIHtYWX0gcG9pbnQgLSBhbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdGhpcy5wb2ludHNfLnB1c2gocG9pbnQpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I2FkZFBvaW50fSBpbnN0ZWFkXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuQWRkUG9pbnQgPSBTd2VlcENvbnRleHQucHJvdG90eXBlLmFkZFBvaW50O1xuXG5cbi8qKlxuICogQWRkIHNldmVyYWwgU3RlaW5lciBwb2ludHMgdG8gdGhlIGNvbnN0cmFpbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICB2YXIgcG9pbnRzID0gW1xuICogICAgICAgICAgbmV3IHBvbHkydHJpLlBvaW50KDE1MCwgMTUwKSxcbiAqICAgICAgICAgIG5ldyBwb2x5MnRyaS5Qb2ludCgyMDAsIDI1MCksXG4gKiAgICAgICAgICBuZXcgcG9seTJ0cmkuUG9pbnQoMjUwLCAyNTApXG4gKiAgICAgIF07XG4gKiAgICAgIHN3Y3R4LmFkZFBvaW50cyhwb2ludHMpO1xuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqICAgICAgc3djdHguYWRkUG9pbnRzKFt7eDoxNTAsIHk6MTUwfSwge3g6MjAwLCB5OjI1MH0sIHt4OjI1MCwgeToyNTB9XSk7XG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge0FycmF5LjxYWT59IHBvaW50cyAtIGFycmF5IG9mIFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRQb2ludHMgPSBmdW5jdGlvbihwb2ludHMpIHtcbiAgICB0aGlzLnBvaW50c18gPSB0aGlzLnBvaW50c18uY29uY2F0KHBvaW50cyk7XG4gICAgcmV0dXJuIHRoaXM7IC8vIGZvciBjaGFpbmluZ1xufTtcblxuXG4vKipcbiAqIFRyaWFuZ3VsYXRlIHRoZSBwb2x5Z29uIHdpdGggaG9sZXMgYW5kIFN0ZWluZXIgcG9pbnRzLlxuICogRG8gdGhpcyBBRlRFUiB5b3UndmUgYWRkZWQgdGhlIHBvbHlsaW5lLCBob2xlcywgYW5kIFN0ZWluZXIgcG9pbnRzXG4gKiBAZXhhbXBsZVxuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiBAcHVibGljXG4gKi9cbi8vIFNob3J0Y3V0IG1ldGhvZCBmb3Igc3dlZXAudHJpYW5ndWxhdGUoU3dlZXBDb250ZXh0KS5cbi8vIE1ldGhvZCBhZGRlZCBpbiB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uICh3YXMgbm90IHByZXNlbnQgaW4gdGhlIGMrKyB2ZXJzaW9uKVxuU3dlZXBDb250ZXh0LnByb3RvdHlwZS50cmlhbmd1bGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHN3ZWVwLnRyaWFuZ3VsYXRlKHRoaXMpO1xuICAgIHJldHVybiB0aGlzOyAvLyBmb3IgY2hhaW5pbmdcbn07XG5cblxuLyoqXG4gKiBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgcHJvdmlkZWQgY29uc3RyYWludHMgKGNvbnRvdXIsIGhvbGVzIGFuZCBcbiAqIFN0ZWludGVyIHBvaW50cykuIFdhcm5pbmcgOiB0aGVzZSB2YWx1ZXMgYXJlIG5vdCBhdmFpbGFibGUgaWYgdGhlIHRyaWFuZ3VsYXRpb24gXG4gKiBoYXMgbm90IGJlZW4gZG9uZSB5ZXQuXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7e21pbjpQb2ludCxtYXg6UG9pbnR9fSBvYmplY3Qgd2l0aCAnbWluJyBhbmQgJ21heCcgUG9pbnRcbiAqL1xuLy8gTWV0aG9kIGFkZGVkIGluIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gKHdhcyBub3QgcHJlc2VudCBpbiB0aGUgYysrIHZlcnNpb24pXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldEJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHttaW46IHRoaXMucG1pbl8sIG1heDogdGhpcy5wbWF4X307XG59O1xuXG4vKipcbiAqIEdldCByZXN1bHQgb2YgdHJpYW5ndWxhdGlvbi5cbiAqIFRoZSBvdXRwdXQgdHJpYW5nbGVzIGhhdmUgdmVydGljZXMgd2hpY2ggYXJlIHJlZmVyZW5jZXNcbiAqIHRvIHRoZSBpbml0aWFsIGlucHV0IHBvaW50cyAobm90IGNvcGllcyk6IGFueSBjdXN0b20gZmllbGRzIGluIHRoZVxuICogaW5pdGlhbCBwb2ludHMgY2FuIGJlIHJldHJpZXZlZCBpbiB0aGUgb3V0cHV0IHRyaWFuZ2xlcy5cbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDAsIGlkOjF9LCB7eDoxMDAsIHk6MzAwLCBpZDoyfSwge3g6MzAwLCB5OjMwMCwgaWQ6M31dO1xuICogICAgICB2YXIgc3djdHggPSBuZXcgcG9seTJ0cmkuU3dlZXBDb250ZXh0KGNvbnRvdXIpO1xuICogICAgICBzd2N0eC50cmlhbmd1bGF0ZSgpO1xuICogICAgICB2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG4gKiAgICAgIHR5cGVvZiB0cmlhbmdsZXNbMF0uZ2V0UG9pbnQoMCkuaWRcbiAqICAgICAgLy8g4oaSIFwibnVtYmVyXCJcbiAqIEBwdWJsaWNcbiAqIEByZXR1cm5zIHthcnJheTxUcmlhbmdsZT59ICAgYXJyYXkgb2YgdHJpYW5nbGVzXG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJpYW5nbGVzXztcbn07XG5cbi8qKlxuICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAqIEBmdW5jdGlvblxuICogQGRlcHJlY2F0ZWQgdXNlIHtAbGlua2NvZGUgU3dlZXBDb250ZXh0I2dldFRyaWFuZ2xlc30gaW5zdGVhZFxuICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLkdldFRyaWFuZ2xlcyA9IFN3ZWVwQ29udGV4dC5wcm90b3R5cGUuZ2V0VHJpYW5nbGVzO1xuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVN3ZWVwQ29udGV4dCAocHJpdmF0ZSBBUEkpXG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5mcm9udCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmZyb250Xztcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5wb2ludENvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzXy5sZW5ndGg7XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuaGVhZCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhlYWRfO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLnNldEhlYWQgPSBmdW5jdGlvbihwMSkge1xuICAgIHRoaXMuaGVhZF8gPSBwMTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS50YWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGFpbF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuc2V0VGFpbCA9IGZ1bmN0aW9uKHAxKSB7XG4gICAgdGhpcy50YWlsXyA9IHAxO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcF87XG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUuaW5pdFRyaWFuZ3VsYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgeG1heCA9IHRoaXMucG9pbnRzX1swXS54O1xuICAgIHZhciB4bWluID0gdGhpcy5wb2ludHNfWzBdLng7XG4gICAgdmFyIHltYXggPSB0aGlzLnBvaW50c19bMF0ueTtcbiAgICB2YXIgeW1pbiA9IHRoaXMucG9pbnRzX1swXS55O1xuXG4gICAgLy8gQ2FsY3VsYXRlIGJvdW5kc1xuICAgIHZhciBpLCBsZW4gPSB0aGlzLnBvaW50c18ubGVuZ3RoO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgcCA9IHRoaXMucG9pbnRzX1tpXTtcbiAgICAgICAgLyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuICAgICAgICAocC54ID4geG1heCkgJiYgKHhtYXggPSBwLngpO1xuICAgICAgICAocC54IDwgeG1pbikgJiYgKHhtaW4gPSBwLngpO1xuICAgICAgICAocC55ID4geW1heCkgJiYgKHltYXggPSBwLnkpO1xuICAgICAgICAocC55IDwgeW1pbikgJiYgKHltaW4gPSBwLnkpO1xuICAgIH1cbiAgICB0aGlzLnBtaW5fID0gbmV3IFBvaW50KHhtaW4sIHltaW4pO1xuICAgIHRoaXMucG1heF8gPSBuZXcgUG9pbnQoeG1heCwgeW1heCk7XG5cbiAgICB2YXIgZHggPSBrQWxwaGEgKiAoeG1heCAtIHhtaW4pO1xuICAgIHZhciBkeSA9IGtBbHBoYSAqICh5bWF4IC0geW1pbik7XG4gICAgdGhpcy5oZWFkXyA9IG5ldyBQb2ludCh4bWF4ICsgZHgsIHltaW4gLSBkeSk7XG4gICAgdGhpcy50YWlsXyA9IG5ldyBQb2ludCh4bWluIC0gZHgsIHltaW4gLSBkeSk7XG5cbiAgICAvLyBTb3J0IHBvaW50cyBhbG9uZyB5LWF4aXNcbiAgICB0aGlzLnBvaW50c18uc29ydChQb2ludC5jb21wYXJlKTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5pbml0RWRnZXMgPSBmdW5jdGlvbihwb2x5bGluZSkge1xuICAgIHZhciBpLCBsZW4gPSBwb2x5bGluZS5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIHRoaXMuZWRnZV9saXN0LnB1c2gobmV3IEVkZ2UocG9seWxpbmVbaV0sIHBvbHlsaW5lWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmdldFBvaW50ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfW2luZGV4XTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5hZGRUb01hcCA9IGZ1bmN0aW9uKHRyaWFuZ2xlKSB7XG4gICAgdGhpcy5tYXBfLnB1c2godHJpYW5nbGUpO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmxvY2F0ZU5vZGUgPSBmdW5jdGlvbihwb2ludCkge1xuICAgIHJldHVybiB0aGlzLmZyb250Xy5sb2NhdGVOb2RlKHBvaW50LngpO1xufTtcblxuLyoqIEBwcml2YXRlICovXG5Td2VlcENvbnRleHQucHJvdG90eXBlLmNyZWF0ZUFkdmFuY2luZ0Zyb250ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWQ7XG4gICAgdmFyIG1pZGRsZTtcbiAgICB2YXIgdGFpbDtcbiAgICAvLyBJbml0aWFsIHRyaWFuZ2xlXG4gICAgdmFyIHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKHRoaXMucG9pbnRzX1swXSwgdGhpcy50YWlsXywgdGhpcy5oZWFkXyk7XG5cbiAgICB0aGlzLm1hcF8ucHVzaCh0cmlhbmdsZSk7XG5cbiAgICBoZWFkID0gbmV3IE5vZGUodHJpYW5nbGUuZ2V0UG9pbnQoMSksIHRyaWFuZ2xlKTtcbiAgICBtaWRkbGUgPSBuZXcgTm9kZSh0cmlhbmdsZS5nZXRQb2ludCgwKSwgdHJpYW5nbGUpO1xuICAgIHRhaWwgPSBuZXcgTm9kZSh0cmlhbmdsZS5nZXRQb2ludCgyKSk7XG5cbiAgICB0aGlzLmZyb250XyA9IG5ldyBBZHZhbmNpbmdGcm9udChoZWFkLCB0YWlsKTtcblxuICAgIGhlYWQubmV4dCA9IG1pZGRsZTtcbiAgICBtaWRkbGUubmV4dCA9IHRhaWw7XG4gICAgbWlkZGxlLnByZXYgPSBoZWFkO1xuICAgIHRhaWwucHJldiA9IG1pZGRsZTtcbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5yZW1vdmVOb2RlID0gZnVuY3Rpb24obm9kZSkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgICAvKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG59O1xuXG4vKiogQHByaXZhdGUgKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUubWFwVHJpYW5nbGVUb05vZGVzID0gZnVuY3Rpb24odCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgKytpKSB7XG4gICAgICAgIGlmICghdC5nZXROZWlnaGJvcihpKSkge1xuICAgICAgICAgICAgdmFyIG4gPSB0aGlzLmZyb250Xy5sb2NhdGVQb2ludCh0LnBvaW50Q1codC5nZXRQb2ludChpKSkpO1xuICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICBuLnRyaWFuZ2xlID0gdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKiBAcHJpdmF0ZSAqL1xuU3dlZXBDb250ZXh0LnByb3RvdHlwZS5yZW1vdmVGcm9tTWFwID0gZnVuY3Rpb24odHJpYW5nbGUpIHtcbiAgICB2YXIgaSwgbWFwID0gdGhpcy5tYXBfLCBsZW4gPSBtYXAubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobWFwW2ldID09PSB0cmlhbmdsZSkge1xuICAgICAgICAgICAgbWFwLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBEbyBhIGRlcHRoIGZpcnN0IHRyYXZlcnNhbCB0byBjb2xsZWN0IHRyaWFuZ2xlc1xuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7VHJpYW5nbGV9IHRyaWFuZ2xlIHN0YXJ0XG4gKi9cblN3ZWVwQ29udGV4dC5wcm90b3R5cGUubWVzaENsZWFuID0gZnVuY3Rpb24odHJpYW5nbGUpIHtcbiAgICAvLyBOZXcgaW1wbGVtZW50YXRpb24gYXZvaWRzIHJlY3Vyc2l2ZSBjYWxscyBhbmQgdXNlIGEgbG9vcCBpbnN0ZWFkLlxuICAgIC8vIENmLiBpc3N1ZXMgIyA1NywgNjUgYW5kIDY5LlxuICAgIHZhciB0cmlhbmdsZXMgPSBbdHJpYW5nbGVdLCB0LCBpO1xuICAgIC8qIGpzaGludCBib3NzOnRydWUgKi9cbiAgICB3aGlsZSAodCA9IHRyaWFuZ2xlcy5wb3AoKSkge1xuICAgICAgICBpZiAoIXQuaXNJbnRlcmlvcigpKSB7XG4gICAgICAgICAgICB0LnNldEludGVyaW9yKHRydWUpO1xuICAgICAgICAgICAgdGhpcy50cmlhbmdsZXNfLnB1c2godCk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0LmNvbnN0cmFpbmVkX2VkZ2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdHJpYW5nbGVzLnB1c2godC5nZXROZWlnaGJvcihpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUV4cG9ydHNcblxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcENvbnRleHQ7XG5cbn0se1wiLi9hZHZhbmNpbmdmcm9udFwiOjIsXCIuL3BvaW50XCI6NCxcIi4vcG9pbnRlcnJvclwiOjUsXCIuL3N3ZWVwXCI6NyxcIi4vdHJpYW5nbGVcIjo5fV0sOTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG4vKiBqc2hpbnQgbWF4Y29tcGxleGl0eToxMCAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuXG4vKlxuICogTm90ZVxuICogPT09PVxuICogdGhlIHN0cnVjdHVyZSBvZiB0aGlzIEphdmFTY3JpcHQgdmVyc2lvbiBvZiBwb2x5MnRyaSBpbnRlbnRpb25hbGx5IGZvbGxvd3NcbiAqIGFzIGNsb3NlbHkgYXMgcG9zc2libGUgdGhlIHN0cnVjdHVyZSBvZiB0aGUgcmVmZXJlbmNlIEMrKyB2ZXJzaW9uLCB0byBtYWtlIGl0IFxuICogZWFzaWVyIHRvIGtlZXAgdGhlIDIgdmVyc2lvbnMgaW4gc3luYy5cbiAqL1xuXG52YXIgeHkgPSBfZGVyZXFfKFwiLi94eVwiKTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1UcmlhbmdsZVxuLyoqXG4gKiBUcmlhbmdsZSBjbGFzcy48YnI+XG4gKiBUcmlhbmdsZS1iYXNlZCBkYXRhIHN0cnVjdHVyZXMgYXJlIGtub3duIHRvIGhhdmUgYmV0dGVyIHBlcmZvcm1hbmNlIHRoYW5cbiAqIHF1YWQtZWRnZSBzdHJ1Y3R1cmVzLlxuICogU2VlOiBKLiBTaGV3Y2h1aywgXCJUcmlhbmdsZTogRW5naW5lZXJpbmcgYSAyRCBRdWFsaXR5IE1lc2ggR2VuZXJhdG9yIGFuZFxuICogRGVsYXVuYXkgVHJpYW5ndWxhdG9yXCIsIFwiVHJpYW5ndWxhdGlvbnMgaW4gQ0dBTFwiXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAc3RydWN0XG4gKiBAcGFyYW0geyFYWX0gcGEgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGIgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0geyFYWX0gcGMgIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKi9cbnZhciBUcmlhbmdsZSA9IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAvKipcbiAgICAgKiBUcmlhbmdsZSBwb2ludHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48WFk+fVxuICAgICAqL1xuICAgIHRoaXMucG9pbnRzXyA9IFthLCBiLCBjXTtcblxuICAgIC8qKlxuICAgICAqIE5laWdoYm9yIGxpc3RcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48VHJpYW5nbGU+fVxuICAgICAqL1xuICAgIHRoaXMubmVpZ2hib3JzXyA9IFtudWxsLCBudWxsLCBudWxsXTtcblxuICAgIC8qKlxuICAgICAqIEhhcyB0aGlzIHRyaWFuZ2xlIGJlZW4gbWFya2VkIGFzIGFuIGludGVyaW9yIHRyaWFuZ2xlP1xuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5pbnRlcmlvcl8gPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIEZsYWdzIHRvIGRldGVybWluZSBpZiBhbiBlZGdlIGlzIGEgQ29uc3RyYWluZWQgZWRnZVxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0FycmF5Ljxib29sZWFuPn1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2UgPSBbZmFsc2UsIGZhbHNlLCBmYWxzZV07XG5cbiAgICAvKipcbiAgICAgKiBGbGFncyB0byBkZXRlcm1pbmUgaWYgYW4gZWRnZSBpcyBhIERlbGF1bmV5IGVkZ2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtBcnJheS48Ym9vbGVhbj59XG4gICAgICovXG4gICAgdGhpcy5kZWxhdW5heV9lZGdlID0gW2ZhbHNlLCBmYWxzZSwgZmFsc2VdO1xufTtcblxudmFyIHAycyA9IHh5LnRvU3RyaW5nO1xuLyoqXG4gKiBGb3IgcHJldHR5IHByaW50aW5nIGV4LiA8Y29kZT5cIlsoNTs0MikoMTA7MjApKDIxOzMwKV1cIjwvY29kZT4uXG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXCJbXCIgKyBwMnModGhpcy5wb2ludHNfWzBdKSArIHAycyh0aGlzLnBvaW50c19bMV0pICsgcDJzKHRoaXMucG9pbnRzX1syXSkgKyBcIl1cIik7XG59O1xuXG4vKipcbiAqIEdldCBvbmUgdmVydGljZSBvZiB0aGUgdHJpYW5nbGUuXG4gKiBUaGUgb3V0cHV0IHRyaWFuZ2xlcyBvZiBhIHRyaWFuZ3VsYXRpb24gaGF2ZSB2ZXJ0aWNlcyB3aGljaCBhcmUgcmVmZXJlbmNlc1xuICogdG8gdGhlIGluaXRpYWwgaW5wdXQgcG9pbnRzIChub3QgY29waWVzKTogYW55IGN1c3RvbSBmaWVsZHMgaW4gdGhlXG4gKiBpbml0aWFsIHBvaW50cyBjYW4gYmUgcmV0cmlldmVkIGluIHRoZSBvdXRwdXQgdHJpYW5nbGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgdmFyIGNvbnRvdXIgPSBbe3g6MTAwLCB5OjEwMCwgaWQ6MX0sIHt4OjEwMCwgeTozMDAsIGlkOjJ9LCB7eDozMDAsIHk6MzAwLCBpZDozfV07XG4gKiAgICAgIHZhciBzd2N0eCA9IG5ldyBwb2x5MnRyaS5Td2VlcENvbnRleHQoY29udG91cik7XG4gKiAgICAgIHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG4gKiAgICAgIHZhciB0cmlhbmdsZXMgPSBzd2N0eC5nZXRUcmlhbmdsZXMoKTtcbiAqICAgICAgdHlwZW9mIHRyaWFuZ2xlc1swXS5nZXRQb2ludCgwKS5pZFxuICogICAgICAvLyDihpIgXCJudW1iZXJcIlxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gdmVydGljZSBpbmRleDogMCwgMSBvciAyXG4gKiBAcHVibGljXG4gKiBAcmV0dXJucyB7WFl9XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRzX1tpbmRleF07XG59O1xuXG4vKipcbiAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gKiBAZnVuY3Rpb25cbiAqIEBkZXByZWNhdGVkIHVzZSB7QGxpbmtjb2RlIFRyaWFuZ2xlI2dldFBvaW50fSBpbnN0ZWFkXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5HZXRQb2ludCA9IFRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludDtcblxuLyoqXG4gKiBHZXQgYWxsIDMgdmVydGljZXMgb2YgdGhlIHRyaWFuZ2xlIGFzIGFuIGFycmF5XG4gKiBAcHVibGljXG4gKiBAcmV0dXJuIHtBcnJheS48WFk+fVxuICovXG4vLyBNZXRob2QgYWRkZWQgaW4gdGhlIEphdmFTY3JpcHQgdmVyc2lvbiAod2FzIG5vdCBwcmVzZW50IGluIHRoZSBjKysgdmVyc2lvbilcblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludHNfO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XG4gKiBAcmV0dXJucyB7P1RyaWFuZ2xlfVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3IgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19baW5kZXhdO1xufTtcblxuLyoqXG4gKiBUZXN0IGlmIHRoaXMgVHJpYW5nbGUgY29udGFpbnMgdGhlIFBvaW50IG9iamVjdCBnaXZlbiBhcyBwYXJhbWV0ZXIgYXMgb25lIG9mIGl0cyB2ZXJ0aWNlcy5cbiAqIE9ubHkgcG9pbnQgcmVmZXJlbmNlcyBhcmUgY29tcGFyZWQsIG5vdCB2YWx1ZXMuXG4gKiBAcHVibGljXG4gKiBAcGFyYW0ge1hZfSBwb2ludCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufSA8Y29kZT5UcnVlPC9jb2RlPiBpZiB0aGUgUG9pbnQgb2JqZWN0IGlzIG9mIHRoZSBUcmlhbmdsZSdzIHZlcnRpY2VzLFxuICogICAgICAgICA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNQb2ludCA9IGZ1bmN0aW9uKHBvaW50KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIHJldHVybiAocG9pbnQgPT09IHBvaW50c1swXSB8fCBwb2ludCA9PT0gcG9pbnRzWzFdIHx8IHBvaW50ID09PSBwb2ludHNbMl0pO1xufTtcblxuLyoqXG4gKiBUZXN0IGlmIHRoaXMgVHJpYW5nbGUgY29udGFpbnMgdGhlIEVkZ2Ugb2JqZWN0IGdpdmVuIGFzIHBhcmFtZXRlciBhcyBpdHNcbiAqIGJvdW5kaW5nIGVkZ2VzLiBPbmx5IHBvaW50IHJlZmVyZW5jZXMgYXJlIGNvbXBhcmVkLCBub3QgdmFsdWVzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RWRnZX0gZWRnZVxuICogQHJldHVybiB7Ym9vbGVhbn0gPGNvZGU+VHJ1ZTwvY29kZT4gaWYgdGhlIEVkZ2Ugb2JqZWN0IGlzIG9mIHRoZSBUcmlhbmdsZSdzIGJvdW5kaW5nXG4gKiAgICAgICAgIGVkZ2VzLCA8Y29kZT5mYWxzZTwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNFZGdlID0gZnVuY3Rpb24oZWRnZSkge1xuICAgIHJldHVybiB0aGlzLmNvbnRhaW5zUG9pbnQoZWRnZS5wKSAmJiB0aGlzLmNvbnRhaW5zUG9pbnQoZWRnZS5xKTtcbn07XG5cbi8qKlxuICogVGVzdCBpZiB0aGlzIFRyaWFuZ2xlIGNvbnRhaW5zIHRoZSB0d28gUG9pbnQgb2JqZWN0cyBnaXZlbiBhcyBwYXJhbWV0ZXJzIGFtb25nIGl0cyB2ZXJ0aWNlcy5cbiAqIE9ubHkgcG9pbnQgcmVmZXJlbmNlcyBhcmUgY29tcGFyZWQsIG5vdCB2YWx1ZXMuXG4gKiBAcGFyYW0ge1hZfSBwMSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBwMiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuY29udGFpbnNQb2ludHMgPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICByZXR1cm4gdGhpcy5jb250YWluc1BvaW50KHAxKSAmJiB0aGlzLmNvbnRhaW5zUG9pbnQocDIpO1xufTtcblxuLyoqXG4gKiBIYXMgdGhpcyB0cmlhbmdsZSBiZWVuIG1hcmtlZCBhcyBhbiBpbnRlcmlvciB0cmlhbmdsZT9cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUuaXNJbnRlcmlvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmludGVyaW9yXztcbn07XG5cbi8qKlxuICogTWFyayB0aGlzIHRyaWFuZ2xlIGFzIGFuIGludGVyaW9yIHRyaWFuZ2xlXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBpbnRlcmlvclxuICogQHJldHVybnMge1RyaWFuZ2xlfSB0aGlzXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXRJbnRlcmlvciA9IGZ1bmN0aW9uKGludGVyaW9yKSB7XG4gICAgdGhpcy5pbnRlcmlvcl8gPSBpbnRlcmlvcjtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVXBkYXRlIG5laWdoYm9yIHBvaW50ZXJzLlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAxIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHAyIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7VHJpYW5nbGV9IHQgVHJpYW5nbGUgb2JqZWN0LlxuICogQHRocm93cyB7RXJyb3J9IGlmIGNhbid0IGZpbmQgb2JqZWN0c1xuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya05laWdoYm9yUG9pbnRlcnMgPSBmdW5jdGlvbihwMSwgcDIsIHQpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKChwMSA9PT0gcG9pbnRzWzJdICYmIHAyID09PSBwb2ludHNbMV0pIHx8IChwMSA9PT0gcG9pbnRzWzFdICYmIHAyID09PSBwb2ludHNbMl0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IHQ7XG4gICAgfSBlbHNlIGlmICgocDEgPT09IHBvaW50c1swXSAmJiBwMiA9PT0gcG9pbnRzWzJdKSB8fCAocDEgPT09IHBvaW50c1syXSAmJiBwMiA9PT0gcG9pbnRzWzBdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMV0gPSB0O1xuICAgIH0gZWxzZSBpZiAoKHAxID09PSBwb2ludHNbMF0gJiYgcDIgPT09IHBvaW50c1sxXSkgfHwgKHAxID09PSBwb2ludHNbMV0gJiYgcDIgPT09IHBvaW50c1swXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzJdID0gdDtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BvbHkydHJpIEludmFsaWQgVHJpYW5nbGUubWFya05laWdoYm9yUG9pbnRlcnMoKSBjYWxsJyk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBFeGhhdXN0aXZlIHNlYXJjaCB0byB1cGRhdGUgbmVpZ2hib3IgcG9pbnRlcnNcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gdFxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya05laWdoYm9yID0gZnVuY3Rpb24odCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgaWYgKHQuY29udGFpbnNQb2ludHMocG9pbnRzWzFdLCBwb2ludHNbMl0pKSB7XG4gICAgICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IHQ7XG4gICAgICAgIHQubWFya05laWdoYm9yUG9pbnRlcnMocG9pbnRzWzFdLCBwb2ludHNbMl0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodC5jb250YWluc1BvaW50cyhwb2ludHNbMF0sIHBvaW50c1syXSkpIHtcbiAgICAgICAgdGhpcy5uZWlnaGJvcnNfWzFdID0gdDtcbiAgICAgICAgdC5tYXJrTmVpZ2hib3JQb2ludGVycyhwb2ludHNbMF0sIHBvaW50c1syXSwgdGhpcyk7XG4gICAgfSBlbHNlIGlmICh0LmNvbnRhaW5zUG9pbnRzKHBvaW50c1swXSwgcG9pbnRzWzFdKSkge1xuICAgICAgICB0aGlzLm5laWdoYm9yc19bMl0gPSB0O1xuICAgICAgICB0Lm1hcmtOZWlnaGJvclBvaW50ZXJzKHBvaW50c1swXSwgcG9pbnRzWzFdLCB0aGlzKTtcbiAgICB9XG59O1xuXG5cblRyaWFuZ2xlLnByb3RvdHlwZS5jbGVhck5laWdoYm9ycyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmVpZ2hib3JzX1swXSA9IG51bGw7XG4gICAgdGhpcy5uZWlnaGJvcnNfWzFdID0gbnVsbDtcbiAgICB0aGlzLm5laWdoYm9yc19bMl0gPSBudWxsO1xufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmNsZWFyRGVsYXVuYXlFZGdlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVswXSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsxXSA9IGZhbHNlO1xuICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsyXSA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwb2ludCBjbG9ja3dpc2UgdG8gdGhlIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUucG9pbnRDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHBvaW50c1swXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMF07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1sxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHBvaW50IGNvdW50ZXItY2xvY2t3aXNlIHRvIHRoZSBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLnBvaW50Q0NXID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHJldHVybiBwb2ludHNbMV07XG4gICAgfSBlbHNlIGlmIChwID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcmV0dXJuIHBvaW50c1syXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHBvaW50c1syXSkge1xuICAgICAgICByZXR1cm4gcG9pbnRzWzBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbmVpZ2hib3IgY2xvY2t3aXNlIHRvIGdpdmVuIHBvaW50LlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubmVpZ2hib3JDVyA9IGZ1bmN0aW9uKHApIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1sxXTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzJdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMF07XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBuZWlnaGJvciBjb3VudGVyLWNsb2Nrd2lzZSB0byBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm5laWdoYm9yQ0NXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1sxXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5nZXRDb25zdHJhaW5lZEVkZ2VDQ1cgPSBmdW5jdGlvbihwKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl07XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdO1xuICAgIH1cbn07XG5cbi8vIEFkZGl0aW9uYWwgY2hlY2sgZnJvbSBKYXZhIHZlcnNpb24gKHNlZSBpc3N1ZSAjODgpXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0Q29uc3RyYWluZWRFZGdlQWNyb3NzID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ1cgPSBmdW5jdGlvbihwLCBjZSkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMV0gPSBjZTtcbiAgICB9IGVsc2UgaWYgKHAgPT09IHRoaXMucG9pbnRzX1sxXSkge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMl0gPSBjZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbmVkX2VkZ2VbMF0gPSBjZTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0Q29uc3RyYWluZWRFZGdlQ0NXID0gZnVuY3Rpb24ocCwgY2UpIHtcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChwID09PSB0aGlzLnBvaW50c19bMF0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzJdID0gY2U7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzBdID0gY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlWzFdID0gY2U7XG4gICAgfVxufTtcblxuVHJpYW5nbGUucHJvdG90eXBlLmdldERlbGF1bmF5RWRnZUNXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzFdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMl07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVswXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuZ2V0RGVsYXVuYXlFZGdlQ0NXID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWxhdW5heV9lZGdlWzJdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlbGF1bmF5X2VkZ2VbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVsYXVuYXlfZWRnZVsxXTtcbiAgICB9XG59O1xuXG5UcmlhbmdsZS5wcm90b3R5cGUuc2V0RGVsYXVuYXlFZGdlQ1cgPSBmdW5jdGlvbihwLCBlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsxXSA9IGU7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzJdID0gZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMF0gPSBlO1xuICAgIH1cbn07XG5cblRyaWFuZ2xlLnByb3RvdHlwZS5zZXREZWxhdW5heUVkZ2VDQ1cgPSBmdW5jdGlvbihwLCBlKSB7XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzBdKSB7XG4gICAgICAgIHRoaXMuZGVsYXVuYXlfZWRnZVsyXSA9IGU7XG4gICAgfSBlbHNlIGlmIChwID09PSB0aGlzLnBvaW50c19bMV0pIHtcbiAgICAgICAgdGhpcy5kZWxhdW5heV9lZGdlWzBdID0gZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlbGF1bmF5X2VkZ2VbMV0gPSBlO1xuICAgIH1cbn07XG5cbi8qKlxuICogVGhlIG5laWdoYm9yIGFjcm9zcyB0byBnaXZlbiBwb2ludC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm5zIHtUcmlhbmdsZX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm5laWdoYm9yQWNyb3NzID0gZnVuY3Rpb24ocCkge1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAgPT09IHRoaXMucG9pbnRzX1swXSkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcnNfWzBdO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gdGhpcy5wb2ludHNfWzFdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yc19bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JzX1syXTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyFUcmlhbmdsZX0gdCBUcmlhbmdsZSBvYmplY3QuXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm9wcG9zaXRlUG9pbnQgPSBmdW5jdGlvbih0LCBwKSB7XG4gICAgdmFyIGN3ID0gdC5wb2ludENXKHApO1xuICAgIHJldHVybiB0aGlzLnBvaW50Q1coY3cpO1xufTtcblxuLyoqXG4gKiBMZWdhbGl6ZSB0cmlhbmdsZSBieSByb3RhdGluZyBjbG9ja3dpc2UgYXJvdW5kIG9Qb2ludFxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7WFl9IG9wb2ludCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBucG9pbnQgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHRocm93cyB7RXJyb3J9IGlmIG9Qb2ludCBjYW4gbm90IGJlIGZvdW5kXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5sZWdhbGl6ZSA9IGZ1bmN0aW9uKG9wb2ludCwgbnBvaW50KSB7XG4gICAgdmFyIHBvaW50cyA9IHRoaXMucG9pbnRzXztcbiAgICAvLyBIZXJlIHdlIGFyZSBjb21wYXJpbmcgcG9pbnQgcmVmZXJlbmNlcywgbm90IHZhbHVlc1xuICAgIGlmIChvcG9pbnQgPT09IHBvaW50c1swXSkge1xuICAgICAgICBwb2ludHNbMV0gPSBwb2ludHNbMF07XG4gICAgICAgIHBvaW50c1swXSA9IHBvaW50c1syXTtcbiAgICAgICAgcG9pbnRzWzJdID0gbnBvaW50O1xuICAgIH0gZWxzZSBpZiAob3BvaW50ID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgcG9pbnRzWzJdID0gcG9pbnRzWzFdO1xuICAgICAgICBwb2ludHNbMV0gPSBwb2ludHNbMF07XG4gICAgICAgIHBvaW50c1swXSA9IG5wb2ludDtcbiAgICB9IGVsc2UgaWYgKG9wb2ludCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHBvaW50c1swXSA9IHBvaW50c1syXTtcbiAgICAgICAgcG9pbnRzWzJdID0gcG9pbnRzWzFdO1xuICAgICAgICBwb2ludHNbMV0gPSBucG9pbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwb2x5MnRyaSBJbnZhbGlkIFRyaWFuZ2xlLmxlZ2FsaXplKCkgY2FsbCcpO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgaW5kZXggb2YgYSBwb2ludCBpbiB0aGUgdHJpYW5nbGUuIFxuICogVGhlIHBvaW50ICptdXN0KiBiZSBhIHJlZmVyZW5jZSB0byBvbmUgb2YgdGhlIHRyaWFuZ2xlJ3MgdmVydGljZXMuXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtYWX0gcCAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCAwLCAxIG9yIDJcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBwIGNhbiBub3QgYmUgZm91bmRcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24ocCkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXNcbiAgICBpZiAocCA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAocCA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgIHJldHVybiAyO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncG9seTJ0cmkgSW52YWxpZCBUcmlhbmdsZS5pbmRleCgpIGNhbGwnKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwMSAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcGFyYW0ge1hZfSBwMiAtIHBvaW50IG9iamVjdCB3aXRoIHt4LHl9XG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluZGV4IDAsIDEgb3IgMiwgb3IgLTEgaWYgZXJycm9yXG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5lZGdlSW5kZXggPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICB2YXIgcG9pbnRzID0gdGhpcy5wb2ludHNfO1xuICAgIC8vIEhlcmUgd2UgYXJlIGNvbXBhcmluZyBwb2ludCByZWZlcmVuY2VzLCBub3QgdmFsdWVzXG4gICAgaWYgKHAxID09PSBwb2ludHNbMF0pIHtcbiAgICAgICAgaWYgKHAyID09PSBwb2ludHNbMV0pIHtcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICB9IGVsc2UgaWYgKHAyID09PSBwb2ludHNbMl0pIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChwMSA9PT0gcG9pbnRzWzFdKSB7XG4gICAgICAgIGlmIChwMiA9PT0gcG9pbnRzWzJdKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSBlbHNlIGlmIChwMiA9PT0gcG9pbnRzWzBdKSB7XG4gICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAocDEgPT09IHBvaW50c1syXSkge1xuICAgICAgICBpZiAocDIgPT09IHBvaW50c1swXSkge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSBpZiAocDIgPT09IHBvaW50c1sxXSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufTtcblxuLyoqXG4gKiBNYXJrIGFuIGVkZ2Ugb2YgdGhpcyB0cmlhbmdsZSBhcyBjb25zdHJhaW5lZC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBlZGdlIGluZGV4XG4gKi9cblRyaWFuZ2xlLnByb3RvdHlwZS5tYXJrQ29uc3RyYWluZWRFZGdlQnlJbmRleCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdGhpcy5jb25zdHJhaW5lZF9lZGdlW2luZGV4XSA9IHRydWU7XG59O1xuLyoqXG4gKiBNYXJrIGFuIGVkZ2Ugb2YgdGhpcyB0cmlhbmdsZSBhcyBjb25zdHJhaW5lZC5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0VkZ2V9IGVkZ2UgaW5zdGFuY2VcbiAqL1xuVHJpYW5nbGUucHJvdG90eXBlLm1hcmtDb25zdHJhaW5lZEVkZ2VCeUVkZ2UgPSBmdW5jdGlvbihlZGdlKSB7XG4gICAgdGhpcy5tYXJrQ29uc3RyYWluZWRFZGdlQnlQb2ludHMoZWRnZS5wLCBlZGdlLnEpO1xufTtcbi8qKlxuICogTWFyayBhbiBlZGdlIG9mIHRoaXMgdHJpYW5nbGUgYXMgY29uc3RyYWluZWQuXG4gKiBUaGlzIG1ldGhvZCB0YWtlcyB0d28gUG9pbnQgaW5zdGFuY2VzIGRlZmluaW5nIHRoZSBlZGdlIG9mIHRoZSB0cmlhbmdsZS5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge1hZfSBwIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7WFl9IHEgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICovXG5UcmlhbmdsZS5wcm90b3R5cGUubWFya0NvbnN0cmFpbmVkRWRnZUJ5UG9pbnRzID0gZnVuY3Rpb24ocCwgcSkge1xuICAgIHZhciBwb2ludHMgPSB0aGlzLnBvaW50c187XG4gICAgLy8gSGVyZSB3ZSBhcmUgY29tcGFyaW5nIHBvaW50IHJlZmVyZW5jZXMsIG5vdCB2YWx1ZXMgICAgICAgIFxuICAgIGlmICgocSA9PT0gcG9pbnRzWzBdICYmIHAgPT09IHBvaW50c1sxXSkgfHwgKHEgPT09IHBvaW50c1sxXSAmJiBwID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsyXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICgocSA9PT0gcG9pbnRzWzBdICYmIHAgPT09IHBvaW50c1syXSkgfHwgKHEgPT09IHBvaW50c1syXSAmJiBwID09PSBwb2ludHNbMF0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVsxXSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICgocSA9PT0gcG9pbnRzWzFdICYmIHAgPT09IHBvaW50c1syXSkgfHwgKHEgPT09IHBvaW50c1syXSAmJiBwID09PSBwb2ludHNbMV0pKSB7XG4gICAgICAgIHRoaXMuY29uc3RyYWluZWRfZWRnZVswXSA9IHRydWU7XG4gICAgfVxufTtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1FeHBvcnRzIChwdWJsaWMgQVBJKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWFuZ2xlO1xuXG59LHtcIi4veHlcIjoxMX1dLDEwOltmdW5jdGlvbihfZGVyZXFfLG1vZHVsZSxleHBvcnRzKXtcbi8qXG4gKiBQb2x5MlRyaSBDb3B5cmlnaHQgKGMpIDIwMDktMjAxNCwgUG9seTJUcmkgQ29udHJpYnV0b3JzXG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvcG9seTJ0cmkvXG4gKiBcbiAqIHBvbHkydHJpLmpzIChKYXZhU2NyaXB0IHBvcnQpIChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cHM6Ly9naXRodWIuY29tL3IzbWkvcG9seTJ0cmkuanNcbiAqIFxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFxuICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIDMtY2xhdXNlIEJTRCBMaWNlbnNlLCBzZWUgTElDRU5TRS50eHRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBQcmVjaXNpb24gdG8gZGV0ZWN0IHJlcGVhdGVkIG9yIGNvbGxpbmVhciBwb2ludHNcbiAqIEBwcml2YXRlXG4gKiBAY29uc3Qge251bWJlcn1cbiAqIEBkZWZhdWx0XG4gKi9cbnZhciBFUFNJTE9OID0gMWUtMTI7XG5leHBvcnRzLkVQU0lMT04gPSBFUFNJTE9OO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAZW51bSB7bnVtYmVyfVxuICogQHJlYWRvbmx5XG4gKi9cbnZhciBPcmllbnRhdGlvbiA9IHtcbiAgICBcIkNXXCI6IDEsXG4gICAgXCJDQ1dcIjogLTEsXG4gICAgXCJDT0xMSU5FQVJcIjogMFxufTtcbmV4cG9ydHMuT3JpZW50YXRpb24gPSBPcmllbnRhdGlvbjtcblxuXG4vKipcbiAqIEZvcm11bGEgdG8gY2FsY3VsYXRlIHNpZ25lZCBhcmVhPGJyPlxuICogUG9zaXRpdmUgaWYgQ0NXPGJyPlxuICogTmVnYXRpdmUgaWYgQ1c8YnI+XG4gKiAwIGlmIGNvbGxpbmVhcjxicj5cbiAqIDxwcmU+XG4gKiBBW1AxLFAyLFAzXSAgPSAgKHgxKnkyIC0geTEqeDIpICsgKHgyKnkzIC0geTIqeDMpICsgKHgzKnkxIC0geTMqeDEpXG4gKiAgICAgICAgICAgICAgPSAgKHgxLXgzKSooeTIteTMpIC0gKHkxLXkzKSooeDIteDMpXG4gKiA8L3ByZT5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7T3JpZW50YXRpb259XG4gKi9cbmZ1bmN0aW9uIG9yaWVudDJkKHBhLCBwYiwgcGMpIHtcbiAgICB2YXIgZGV0bGVmdCA9IChwYS54IC0gcGMueCkgKiAocGIueSAtIHBjLnkpO1xuICAgIHZhciBkZXRyaWdodCA9IChwYS55IC0gcGMueSkgKiAocGIueCAtIHBjLngpO1xuICAgIHZhciB2YWwgPSBkZXRsZWZ0IC0gZGV0cmlnaHQ7XG4gICAgaWYgKHZhbCA+IC0oRVBTSUxPTikgJiYgdmFsIDwgKEVQU0lMT04pKSB7XG4gICAgICAgIHJldHVybiBPcmllbnRhdGlvbi5DT0xMSU5FQVI7XG4gICAgfSBlbHNlIGlmICh2YWwgPiAwKSB7XG4gICAgICAgIHJldHVybiBPcmllbnRhdGlvbi5DQ1c7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE9yaWVudGF0aW9uLkNXO1xuICAgIH1cbn1cbmV4cG9ydHMub3JpZW50MmQgPSBvcmllbnQyZDtcblxuXG4vKipcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBkICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaW5TY2FuQXJlYShwYSwgcGIsIHBjLCBwZCkge1xuICAgIHZhciBvYWRiID0gKHBhLnggLSBwYi54KSAqIChwZC55IC0gcGIueSkgLSAocGQueCAtIHBiLngpICogKHBhLnkgLSBwYi55KTtcbiAgICBpZiAob2FkYiA+PSAtRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9hZGMgPSAocGEueCAtIHBjLngpICogKHBkLnkgLSBwYy55KSAtIChwZC54IC0gcGMueCkgKiAocGEueSAtIHBjLnkpO1xuICAgIGlmIChvYWRjIDw9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuaW5TY2FuQXJlYSA9IGluU2NhbkFyZWE7XG5cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgYW5nbGUgYmV0d2VlbiAocGEscGIpIGFuZCAocGEscGMpIGlzIG9idHVzZSBpLmUuIChhbmdsZSA+IM+ALzIgfHwgYW5nbGUgPCAtz4AvMilcbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHshWFl9IHBhICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBiICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHBhcmFtIHshWFl9IHBjICBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiBhbmdsZSBpcyBvYnR1c2VcbiAqL1xuZnVuY3Rpb24gaXNBbmdsZU9idHVzZShwYSwgcGIsIHBjKSB7XG4gICAgdmFyIGF4ID0gcGIueCAtIHBhLng7XG4gICAgdmFyIGF5ID0gcGIueSAtIHBhLnk7XG4gICAgdmFyIGJ4ID0gcGMueCAtIHBhLng7XG4gICAgdmFyIGJ5ID0gcGMueSAtIHBhLnk7XG4gICAgcmV0dXJuIChheCAqIGJ4ICsgYXkgKiBieSkgPCAwO1xufVxuZXhwb3J0cy5pc0FuZ2xlT2J0dXNlID0gaXNBbmdsZU9idHVzZTtcblxuXG59LHt9XSwxMTpbZnVuY3Rpb24oX2RlcmVxXyxtb2R1bGUsZXhwb3J0cyl7XG4vKlxuICogUG9seTJUcmkgQ29weXJpZ2h0IChjKSAyMDA5LTIwMTQsIFBvbHkyVHJpIENvbnRyaWJ1dG9yc1xuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3BvbHkydHJpL1xuICogXG4gKiBwb2x5MnRyaS5qcyAoSmF2YVNjcmlwdCBwb3J0KSAoYykgMjAwOS0yMDE0LCBQb2x5MlRyaSBDb250cmlidXRvcnNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9yM21pL3BvbHkydHJpLmpzXG4gKiBcbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBcbiAqIERpc3RyaWJ1dGVkIHVuZGVyIHRoZSAzLWNsYXVzZSBCU0QgTGljZW5zZSwgc2VlIExJQ0VOU0UudHh0XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgb3BlcmF0ZSBvbiBcIlBvaW50XCIgb3IgYW55IFwiUG9pbnQgbGlrZVwiIG9iamVjdCB3aXRoIHt4LHl9LFxuICogYXMgZGVmaW5lZCBieSB0aGUge0BsaW5rIFhZfSB0eXBlXG4gKiAoW2R1Y2sgdHlwaW5nXXtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0R1Y2tfdHlwaW5nfSkuXG4gKiBAbW9kdWxlXG4gKiBAcHJpdmF0ZVxuICovXG5cbi8qKlxuICogcG9seTJ0cmkuanMgc3VwcG9ydHMgdXNpbmcgY3VzdG9tIHBvaW50IGNsYXNzIGluc3RlYWQgb2Yge0BsaW5rY29kZSBQb2ludH0uXG4gKiBBbnkgXCJQb2ludCBsaWtlXCIgb2JqZWN0IHdpdGggPGNvZGU+e3gsIHl9PC9jb2RlPiBhdHRyaWJ1dGVzIGlzIHN1cHBvcnRlZFxuICogdG8gaW5pdGlhbGl6ZSB0aGUgU3dlZXBDb250ZXh0IHBvbHlsaW5lcyBhbmQgcG9pbnRzXG4gKiAoW2R1Y2sgdHlwaW5nXXtAbGluayBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0R1Y2tfdHlwaW5nfSkuXG4gKlxuICogcG9seTJ0cmkuanMgbWlnaHQgYWRkIGV4dHJhIGZpZWxkcyB0byB0aGUgcG9pbnQgb2JqZWN0cyB3aGVuIGNvbXB1dGluZyB0aGVcbiAqIHRyaWFuZ3VsYXRpb24gOiB0aGV5IGFyZSBwcmVmaXhlZCB3aXRoIDxjb2RlPl9wMnRfPC9jb2RlPiB0byBhdm9pZCBjb2xsaXNpb25zXG4gKiB3aXRoIGZpZWxkcyBpbiB0aGUgY3VzdG9tIGNsYXNzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgIHZhciBjb250b3VyID0gW3t4OjEwMCwgeToxMDB9LCB7eDoxMDAsIHk6MzAwfSwge3g6MzAwLCB5OjMwMH0sIHt4OjMwMCwgeToxMDB9XTtcbiAqICAgICAgdmFyIHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChjb250b3VyKTtcbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBYWVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHggLSB4IGNvb3JkaW5hdGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5IC0geSBjb29yZGluYXRlXG4gKi9cblxuXG4vKipcbiAqIFBvaW50IHByZXR0eSBwcmludGluZyA6IHByaW50cyB4IGFuZCB5IGNvb3JkaW5hdGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgeHkudG9TdHJpbmdCYXNlKHt4OjUsIHk6NDJ9KVxuICogICAgICAvLyDihpIgXCIoNTs0MilcIlxuICogQHByb3RlY3RlZFxuICogQHBhcmFtIHshWFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge3N0cmluZ30gPGNvZGU+XCIoeDt5KVwiPC9jb2RlPlxuICovXG5mdW5jdGlvbiB0b1N0cmluZ0Jhc2UocCkge1xuICAgIHJldHVybiAoXCIoXCIgKyBwLnggKyBcIjtcIiArIHAueSArIFwiKVwiKTtcbn1cblxuLyoqXG4gKiBQb2ludCBwcmV0dHkgcHJpbnRpbmcuIERlbGVnYXRlcyB0byB0aGUgcG9pbnQncyBjdXN0b20gXCJ0b1N0cmluZygpXCIgbWV0aG9kIGlmIGV4aXN0cyxcbiAqIGVsc2Ugc2ltcGx5IHByaW50cyB4IGFuZCB5IGNvb3JkaW5hdGVzLlxuICogQGV4YW1wbGVcbiAqICAgICAgeHkudG9TdHJpbmcoe3g6NSwgeTo0Mn0pXG4gKiAgICAgIC8vIOKGkiBcIig1OzQyKVwiXG4gKiBAZXhhbXBsZVxuICogICAgICB4eS50b1N0cmluZyh7eDo1LHk6NDIsdG9TdHJpbmc6ZnVuY3Rpb24oKSB7cmV0dXJuIHRoaXMueCtcIjpcIit0aGlzLnk7fX0pXG4gKiAgICAgIC8vIOKGkiBcIjU6NDJcIlxuICogQHBhcmFtIHshWFl9IHAgLSBwb2ludCBvYmplY3Qgd2l0aCB7eCx5fVxuICogQHJldHVybnMge3N0cmluZ30gPGNvZGU+XCIoeDt5KVwiPC9jb2RlPlxuICovXG5mdW5jdGlvbiB0b1N0cmluZyhwKSB7XG4gICAgLy8gVHJ5IGEgY3VzdG9tIHRvU3RyaW5nIGZpcnN0LCBhbmQgZmFsbGJhY2sgdG8gb3duIGltcGxlbWVudGF0aW9uIGlmIG5vbmVcbiAgICB2YXIgcyA9IHAudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gKHMgPT09ICdbb2JqZWN0IE9iamVjdF0nID8gdG9TdHJpbmdCYXNlKHApIDogcyk7XG59XG5cblxuLyoqXG4gKiBDb21wYXJlIHR3byBwb2ludHMgY29tcG9uZW50LXdpc2UuIE9yZGVyZWQgYnkgeSBheGlzIGZpcnN0LCB0aGVuIHggYXhpcy5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge251bWJlcn0gPGNvZGU+Jmx0OyAwPC9jb2RlPiBpZiA8Y29kZT5hICZsdDsgYjwvY29kZT4sXG4gKiAgICAgICAgIDxjb2RlPiZndDsgMDwvY29kZT4gaWYgPGNvZGU+YSAmZ3Q7IGI8L2NvZGU+LCBcbiAqICAgICAgICAgPGNvZGU+MDwvY29kZT4gb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICBpZiAoYS55ID09PSBiLnkpIHtcbiAgICAgICAgcmV0dXJuIGEueCAtIGIueDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYS55IC0gYi55O1xuICAgIH1cbn1cblxuLyoqXG4gKiBUZXN0IHR3byBQb2ludCBvYmplY3RzIGZvciBlcXVhbGl0eS5cbiAqIEBwYXJhbSB7IVhZfSBhIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEBwYXJhbSB7IVhZfSBiIC0gcG9pbnQgb2JqZWN0IHdpdGgge3gseX1cbiAqIEByZXR1cm4ge2Jvb2xlYW59IDxjb2RlPlRydWU8L2NvZGU+IGlmIDxjb2RlPmEgPT0gYjwvY29kZT4sIDxjb2RlPmZhbHNlPC9jb2RlPiBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGVxdWFscyhhLCBiKSB7XG4gICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRvU3RyaW5nOiB0b1N0cmluZyxcbiAgICB0b1N0cmluZ0Jhc2U6IHRvU3RyaW5nQmFzZSxcbiAgICBjb21wYXJlOiBjb21wYXJlLFxuICAgIGVxdWFsczogZXF1YWxzXG59O1xuXG59LHt9XX0se30sWzZdKVxuKDYpXG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRkZWZpbml0aW9uOiAxLFxuXHR3b3JsZFdpZHRoOiA2MCxcblx0d2luZDogMSxcblx0ZGVidWc6IGZhbHNlLFxuXHRzaW1SZW5kZXJGcmVxOiA1MCxcblx0Z3Jhdml0eTogWzAsIC05LjhdLFxuXHRncm91cHM6XG5cdHtcblx0XHRkZWZhdWx0OiB7IHBoeXNpY3M6IHsgYm9keVR5cGU6ICdnaG9zdCcgfSB9LFxuXHRcdGdob3N0OiB7IHBoeXNpY3M6IHsgYm9keVR5cGU6ICdnaG9zdCcgfSB9LFxuXHRcdHNvZnQ6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAndHJpYW5ndWxhdGUnLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwMDAsXG5cdFx0XHRcdFx0cmVsYXhhdGlvbjogMVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRcdG1hc3M6IDFcblx0XHRcdH1cblx0XHR9LFxuXHRcdHRyZWU6XG5cdFx0e1xuXHRcdFx0c3RydWN0dXJlOiAndHJpYW5ndWxhdGUnLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50Om51bGwsXG5cdFx0XHRcdGxvY2tDb25zdHJhaW50OlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwMDAwLFxuXHRcdFx0XHRcdHJlbGF4YXRpb246IDAuOVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAxMCxcblx0XHRcdFx0ZGFtcGluZzogMC44LFxuXHRcdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRcdHN0cnVjdHVyYWxNYXNzRGVjYXk6IDZcblx0XHRcdH1cblx0XHR9LFxuXHRcdGZsb3JhOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2xpbmUnLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OiBudWxsLFxuXHRcdFx0XHRsb2NrQ29uc3RyYWludDpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0aWZmbmVzczogMTAwMDAwLFxuXHRcdFx0XHRcdHJlbGF4YXRpb246IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bWFzczogMTAwLFxuXHRcdFx0XHRub2RlUmFkaXVzOiAwLjEsXG5cdFx0XHRcdHN0cnVjdHVyYWxNYXNzRGVjYXk6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdGplbGx5OlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2hleGFGaWxsJyxcblx0XHRcdGlubmVyU3RydWN0dXJlRGVmOiAwLjAxLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OiBudWxsLFxuXHRcdFx0XHRsb2NrQ29uc3RyYWludDpcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHN0aWZmbmVzczogMTAwMDAwMCxcblx0XHRcdFx0XHRyZWxheGF0aW9uOiAxMFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXNzOiAxMFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bGluZTpcblx0XHR7XG5cdFx0XHRzdHJ1Y3R1cmU6ICdsaW5lJyxcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdGRpc3RhbmNlQ29uc3RyYWludDogbnVsbCxcblx0XHRcdFx0bG9ja0NvbnN0cmFpbnQ6XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGlmZm5lc3M6IDEwLFxuXHRcdFx0XHRcdHJlbGF4YXRpb246IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0XHRtYXNzOiAxXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyb3BlOlxuXHRcdHtcblx0XHRcdHN0cnVjdHVyZTogJ2xpbmUnLFxuXHRcdFx0cGh5c2ljczpcblx0XHRcdHtcblx0XHRcdFx0ZGlzdGFuY2VDb25zdHJhaW50OlxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RpZmZuZXNzOiAxMDAwLFxuXHRcdFx0XHRcdHJlbGF4YXRpb246IDFcblx0XHRcdFx0fSxcblx0XHRcdFx0bm9kZVJhZGl1czogMC4xLFxuXHRcdFx0XHRtYXNzOiAxXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYXJkOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDEsXG5cdFx0XHRcdGJvZHlUeXBlOiAnaGFyZCdcblx0XHRcdH1cblx0XHR9LFxuXHRcdG5vQ29sbGlkZTpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnLFxuXHRcdFx0XHRub0NvbGxpZGU6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdGNsb3VkOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDAuMSxcblx0XHRcdFx0Z3Jhdml0eVNjYWxlOiAwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnLFxuXHRcdFx0XHRub0NvbGxpZGU6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdG1ldGFsOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDEwMCxcblx0XHRcdFx0Ym9keVR5cGU6ICdoYXJkJ1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0d29vZDpcblx0XHR7XG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAxLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRiYWxsb29uOlxuXHRcdHtcblx0XHRcdHBoeXNpY3M6XG5cdFx0XHR7XG5cdFx0XHRcdG1hc3M6IDEsXG5cdFx0XHRcdGdyYXZpdHlTY2FsZTogLTEwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzdGF0aWM6XG5cdFx0e1xuXHRcdFx0Zml4ZWQ6IHRydWUsXG5cdFx0XHRwaHlzaWNzOlxuXHRcdFx0e1xuXHRcdFx0XHRtYXNzOiAwLFxuXHRcdFx0XHRib2R5VHlwZTogJ2hhcmQnXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG4iLCJ2YXIgR3JpZCA9XG57XG5cdGluaXQ6IGZ1bmN0aW9uICgkZ3JhcGgpXG5cdHtcblx0XHR0aGlzLl9ncmFwaCA9ICRncmFwaDtcblx0XHR2YXIgbm9kZXNBcnJheSA9IHRoaXMuX25vZGVzQXJyYXkgPSBbXTtcblx0XHR0aGlzLl9ncmFwaC5mb3JFYWNoKGZ1bmN0aW9uICgkbGluZSlcblx0XHR7XG5cdFx0XHRpZiAoJGxpbmUpXG5cdFx0XHR7XG5cdFx0XHRcdCRsaW5lLmZvckVhY2goZnVuY3Rpb24gKCRub2RlKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKCRub2RlKSB7IG5vZGVzQXJyYXkucHVzaCgkbm9kZSk7IH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH0sXG5cblx0Y3JlYXRlRnJvbVBvbHlnb246IGZ1bmN0aW9uICgkcG9seWdvbiwgJGRlZiwgJGhleGEpXG5cdHtcblx0XHR2YXIgYm91bmRpbmdCb3ggPSAkcG9seWdvbi5nZXRCb3VuZGluZ0JveCgpO1xuXG5cdFx0dmFyIGRlZiA9ICRkZWY7XG5cdFx0Ly92YXIgZGVmID0gd2lkdGggLyAkZGVmO1xuXHRcdHZhciB0b1JldHVybiA9IFtdO1xuXHRcdHZhciB5SW5jID0gJGhleGEgPyBkZWYgKiAoTWF0aC5zcXJ0KDMpIC8gMikgOiBkZWY7XG5cdFx0dmFyIGhhbGZEZWYgPSBkZWYgKiAwLjU7XG5cdFx0Zm9yICh2YXIgeVBvcyA9IGJvdW5kaW5nQm94WzBdWzFdOyB5UG9zIDw9IGJvdW5kaW5nQm94WzFdWzFdOyB5UG9zICs9IHlJbmMpXG5cdFx0e1xuXHRcdFx0dmFyIGxpbmUgPSBbXTtcblx0XHRcdC8vdmFyIGludGVyc2VjdGlvbnMgPSAkcG9seWdvbi5nZXRJbnRlcnNlY3Rpb25zQXRZKHlQb3MpO1xuXHRcdFx0dmFyIHhQb3MgPSBib3VuZGluZ0JveFswXVswXTtcblx0XHRcdHhQb3MgPSAoJGhleGEgJiYgdG9SZXR1cm4ubGVuZ3RoICUgMiAhPT0gMCkgPyB4UG9zICsgaGFsZkRlZiA6IHhQb3M7XG5cdFx0XHRmb3IgKHhQb3M7IHhQb3MgPD0gYm91bmRpbmdCb3hbMV1bMF0gKyBoYWxmRGVmOyB4UG9zICs9IGRlZilcblx0XHRcdHtcblx0XHRcdFx0aWYgKCRwb2x5Z29uLmlzSW5zaWRlKFt4UG9zLCB5UG9zXSkpIHsgbGluZS5wdXNoKFt4UG9zLCB5UG9zXSk7IH1cblx0XHRcdFx0ZWxzZSB7IGxpbmUucHVzaChudWxsKTsgfVxuXHRcdFx0fVxuXHRcdFx0dG9SZXR1cm4ucHVzaChsaW5lKTtcblx0XHR9XG5cdFx0cmV0dXJuIE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdCh0b1JldHVybik7XG5cdH0sXG5cblx0Z2V0R3JhcGg6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2dyYXBoOyB9LFxuXG5cdGdldE5vZGVzQXJyYXk6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX25vZGVzQXJyYXk7IH0sXG5cblx0Z2V0Q2xvc2VzdDogZnVuY3Rpb24gKCR4LCAkeSwgJHNpemUpXG5cdHtcblx0XHR2YXIgc2l6ZSA9ICRzaXplIHx8IDE7XG5cdFx0dmFyIGNsb3Nlc3QgPSB0aGlzLl9ub2Rlc0FycmF5LmNvbmNhdCgpO1xuXHRcdGNsb3Nlc3Quc29ydChmdW5jdGlvbiAoJGEsICRiKVxuXHRcdHtcblx0XHRcdGlmICgkYSA9PT0gbnVsbCB8fCAkYiA9PT0gbnVsbCkgeyByZXR1cm4gdHJ1ZTsgfVxuXHRcdFx0dmFyIHNpZGVYMSA9IE1hdGguYWJzKCRhWzBdIC0gJHgpO1xuXHRcdFx0dmFyIHNpZGVZMSA9IE1hdGguYWJzKCRhWzFdIC0gJHkpO1xuXHRcdFx0dmFyIGRpc3QxID0gTWF0aC5zcXJ0KHNpZGVYMSAqIHNpZGVYMSArIHNpZGVZMSAqIHNpZGVZMSk7XG5cblx0XHRcdHZhciBzaWRlWDIgPSBNYXRoLmFicygkYlswXSAtICR4KTtcblx0XHRcdHZhciBzaWRlWTIgPSBNYXRoLmFicygkYlsxXSAtICR5KTtcblx0XHRcdHZhciBkaXN0MiA9IE1hdGguc3FydChzaWRlWDIgKiBzaWRlWDIgKyBzaWRlWTIgKiBzaWRlWTIpO1xuXG5cdFx0XHRyZXR1cm4gZGlzdDEgLSBkaXN0Mjtcblx0XHR9KTtcblx0XHRyZXR1cm4gY2xvc2VzdC5zbGljZSgwLCBzaXplKTtcblx0fSxcblxuXHRnZXROZWlnaGJvdXJzOiBmdW5jdGlvbiAoJHgsICR5LCAkcmV0dXJuRW1wdHkpXG5cdHtcblx0XHR2YXIgdG9SZXR1cm4gPSBbXTtcblx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHR2YXIgZXZlbiA9ICR5ICUgMiA+IDA7XG5cdFx0dmFyIGxlZnQgPSBldmVuID8gJHggOiAkeCAtIDE7XG5cdFx0dmFyIHJpZ2h0ID0gZXZlbiA/ICR4ICsgMSA6ICR4O1xuXG5cdFx0dmFyIE5FID0gZ3JhcGhbJHkgLSAxXSAmJiBncmFwaFskeSAtIDFdW3JpZ2h0XSA/IGdyYXBoWyR5IC0gMV1bcmlnaHRdIDogbnVsbDtcblx0XHR2YXIgRSA9IGdyYXBoWyR5ICsgMF0gJiYgZ3JhcGhbJHkgKyAwXVskeCArIDFdID8gZ3JhcGhbJHldWyR4ICsgMV0gOiBudWxsO1xuXHRcdHZhciBTRSA9IGdyYXBoWyR5ICsgMV0gJiYgZ3JhcGhbJHkgKyAxXVtyaWdodF0gPyBncmFwaFskeSArIDFdW3JpZ2h0XSA6IG51bGw7XG5cdFx0dmFyIFNXID0gZ3JhcGhbJHkgKyAxXSAmJiBncmFwaFskeSArIDFdW2xlZnRdID8gZ3JhcGhbJHkgKyAxXVtsZWZ0XSA6IG51bGw7XG5cdFx0dmFyIFcgPSBncmFwaFskeSArIDBdICYmIGdyYXBoWyR5ICsgMF1bJHggLSAxXSA/IGdyYXBoWyR5XVskeCAtIDFdIDogbnVsbDtcblx0XHR2YXIgTlcgPSBncmFwaFskeSAtIDFdICYmIGdyYXBoWyR5IC0gMV1bbGVmdF0gPyBncmFwaFskeSAtIDFdW2xlZnRdIDogbnVsbDtcblxuXHRcdGlmIChORSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChORSk7IH1cblx0XHRpZiAoRSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChFKTsgfVxuXHRcdGlmIChTRSB8fCAkcmV0dXJuRW1wdHkpIHsgdG9SZXR1cm4ucHVzaChTRSk7IH1cblx0XHRpZiAoU1cgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goU1cpOyB9XG5cdFx0aWYgKFcgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goVyk7IH1cblx0XHRpZiAoTlcgfHwgJHJldHVybkVtcHR5KSB7IHRvUmV0dXJuLnB1c2goTlcpOyB9XG5cblx0XHRyZXR1cm4gdG9SZXR1cm47XG5cdH0sXG5cblx0Z2V0TmV0d29yazogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBncmFwaCA9IHRoaXMuX2dyYXBoO1xuXHRcdHZhciBuZXR3b3JrID0gW107XG5cdFx0dmFyIHZpc2l0ZWQgPSBbXTtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHJvd3NMZW5ndGggPSBncmFwaC5sZW5ndGg7XG5cdFx0Zm9yIChpOyBpIDwgcm93c0xlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBrID0gMDtcblx0XHRcdHZhciBwb2ludHNMZW5ndGggPSBncmFwaFtpXS5sZW5ndGg7XG5cdFx0XHRmb3IgKGs7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGN1cnJQb2ludCA9IGdyYXBoW2ldW2tdO1xuXHRcdFx0XHRpZiAoY3VyclBvaW50KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIGN1cnJQb2ludE5laWdoYm91cnMgPSB0aGlzLmdldE5laWdoYm91cnMoaywgaSk7XG5cdFx0XHRcdFx0Zm9yICh2YXIgbSA9IDAsIG5laWdoYm91cnNMZW5ndGggPSBjdXJyUG9pbnROZWlnaGJvdXJzLmxlbmd0aDsgbSA8IG5laWdoYm91cnNMZW5ndGg7IG0gKz0gMSlcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR2YXIgY3Vyck5laWdoID0gY3VyclBvaW50TmVpZ2hib3Vyc1ttXTtcblx0XHRcdFx0XHRcdGlmIChjdXJyTmVpZ2ggJiYgdmlzaXRlZC5pbmRleE9mKGN1cnJOZWlnaCkgPT09IC0xKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRuZXR3b3JrLnB1c2goW2N1cnJQb2ludCwgY3Vyck5laWdoXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZpc2l0ZWQucHVzaChjdXJyUG9pbnQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBuZXR3b3JrO1xuXHR9LFxuXG5cdGdldE91dGxpbmU6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHRpZiAoIXRoaXMub3V0bGluZSlcblx0XHR7XG5cdFx0XHR2YXIgZ3JhcGggPSB0aGlzLl9ncmFwaDtcblx0XHRcdHZhciBvdXRsaW5lR3JhcGggPSBbXTtcblx0XHRcdGZvciAodmFyIGkgPSAwLCByb3dzTGVuZ3RoID0gZ3JhcGgubGVuZ3RoOyBpIDwgcm93c0xlbmd0aDsgaSArPSAxKVxuXHRcdFx0e1xuXHRcdFx0XHRvdXRsaW5lR3JhcGhbaV0gPSBbXTtcblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIHBvaW50c0xlbmd0aCA9IGdyYXBoW2ldLmxlbmd0aDsgayA8IHBvaW50c0xlbmd0aDsgayArPSAxKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dmFyIHBvaW50ID0gZ3JhcGhbaV1ba107XG5cdFx0XHRcdFx0b3V0bGluZUdyYXBoW2ldW2tdID0gbnVsbDtcblx0XHRcdFx0XHRpZiAocG9pbnQpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dmFyIGlzRWRnZSA9IHRoaXMuZ2V0TmVpZ2hib3VycyhrLCBpKS5sZW5ndGggPCA2O1xuXHRcdFx0XHRcdFx0aWYgKGlzRWRnZSlcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0b3V0bGluZUdyYXBoW2ldW2tdID0gW2ssIGldO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5vdXRsaW5lID0gT2JqZWN0LmNyZWF0ZShHcmlkKS5pbml0KG91dGxpbmVHcmFwaCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMub3V0bGluZTtcblx0fSxcblxuXHRnZXRTaGFwZVBhdGg6IGZ1bmN0aW9uICgpXG5cdHtcblx0XHR2YXIgcGF0aCA9IFtdO1xuXHRcdHZhciBjdXJyZW50T3V0bGluZSA9IHRoaXMuZ2V0T3V0bGluZXMoKVswXTtcblx0XHR2YXIgb3V0bGluZUdyYXBoID0gY3VycmVudE91dGxpbmUuZ2V0R3JhcGgoKTtcblx0XHR2YXIgZ2V0U3RhcnRpbmdJbmRleCA9IGZ1bmN0aW9uICgpXG5cdFx0e1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG91dGxpbmVHcmFwaC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0aWYgKCFvdXRsaW5lR3JhcGhbaV0pIHsgY29udGludWU7IH1cblx0XHRcdFx0Zm9yICh2YXIgayA9IDAsIHBvaW50c0xlbmd0aCA9IG91dGxpbmVHcmFwaFtpXS5sZW5ndGg7IGsgPCBwb2ludHNMZW5ndGg7IGsgKz0gMSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHZhciBjdXJyUG9pbnQgPSBvdXRsaW5lR3JhcGhbaV1ba107XG5cdFx0XHRcdFx0Ly8gaWYgKGN1cnJQb2ludClcblx0XHRcdFx0XHQvLyB7XG5cdFx0XHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhjdXJyUG9pbnQsIGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoY3VyclBvaW50WzBdLCBjdXJyUG9pbnRbMV0pKTtcblx0XHRcdFx0XHQvLyB9XG5cdFx0XHRcdFx0aWYgKGN1cnJQb2ludCAmJiBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKS5sZW5ndGggPT09IDIpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0cmV0dXJuIGN1cnJQb2ludDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIHZpc2l0ZWQgPSBbXTtcblx0XHR2YXIgc3RhcnRpbmdJbmRleCA9IGdldFN0YXJ0aW5nSW5kZXguY2FsbCh0aGlzKTtcblx0XHRpZiAoIXN0YXJ0aW5nSW5kZXgpIHsgcmV0dXJuOyB9XG5cblx0XHR2YXIgZ2V0QW5nbGUgPSBmdW5jdGlvbiAoJGluZGV4KVxuXHRcdHtcblx0XHRcdHZhciBhbmdsZSA9ICgkaW5kZXggKyAxKSAqIDYwO1xuXHRcdFx0YW5nbGUgPSBhbmdsZSA9PT0gMCA/IDM2MCA6IGFuZ2xlO1xuXHRcdFx0cmV0dXJuIGFuZ2xlO1xuXHRcdH07XG5cdFx0dmFyIGdldE5laWdoYm91ckluZGV4ID0gZnVuY3Rpb24gKCRwb2ludCwgJG5laWdoYm91cilcblx0XHR7XG5cdFx0XHRyZXR1cm4gY3VycmVudE91dGxpbmUuZ2V0TmVpZ2hib3VycygkcG9pbnRbMF0sICRwb2ludFsxXSwgdHJ1ZSkuaW5kZXhPZigkbmVpZ2hib3VyKTtcblx0XHR9O1xuXG5cdFx0dmFyIG5leHQgPSBjdXJyZW50T3V0bGluZS5nZXROZWlnaGJvdXJzKHN0YXJ0aW5nSW5kZXhbMF0sIHN0YXJ0aW5nSW5kZXhbMV0pWzBdO1xuXHRcdHZhciBsYXN0QW5nbGUgPSBnZXRBbmdsZShnZXROZWlnaGJvdXJJbmRleChzdGFydGluZ0luZGV4LCBuZXh0KSk7XG5cdFx0dmFyIGN1cnJJbmRleCA9IG5leHQ7XG5cdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW3N0YXJ0aW5nSW5kZXhbMV1dW3N0YXJ0aW5nSW5kZXhbMF1dKTtcblx0XHRwYXRoLnB1c2godGhpcy5fZ3JhcGhbbmV4dFsxXV1bbmV4dFswXV0pO1xuXHRcdHZpc2l0ZWQucHVzaChzdGFydGluZ0luZGV4KTtcblxuXHRcdHZhciBiZXN0O1xuXHRcdHZhciBuZWlnaGJvdXJzO1xuXHRcdHZhciBiZXN0QW5nbGU7XG5cdFx0dmFyIG91dGxpbmVOb2Rlc0FycmF5ID0gY3VycmVudE91dGxpbmUuZ2V0Tm9kZXNBcnJheSgpO1xuXHRcdHZhciBvdXRsaW5lUG9pbnRzTGVuZ3RoID0gb3V0bGluZU5vZGVzQXJyYXkubGVuZ3RoO1xuXG5cdFx0d2hpbGUgKHZpc2l0ZWQubGVuZ3RoIDwgb3V0bGluZVBvaW50c0xlbmd0aCAtIDEpLy9jdXJySW5kZXggIT09IHN0YXJ0aW5nSW5kZXgpXG5cdFx0e1xuXHRcdFx0bmVpZ2hib3VycyA9IGN1cnJlbnRPdXRsaW5lLmdldE5laWdoYm91cnMoY3VyckluZGV4WzBdLCBjdXJySW5kZXhbMV0pO1xuXHRcdFx0dmFyIGJlc3RTY29yZSA9IDA7XG5cdFx0XHRiZXN0ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbmVpZ2hib3Vycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIGN1cnJOZWlnaCA9IG5laWdoYm91cnNbaV07XG5cdFx0XHRcdHZhciBjdXJyU2NvcmUgPSAwO1xuXHRcdFx0XHR2YXIgY3VyckFuZ2xlID0gZ2V0QW5nbGUoZ2V0TmVpZ2hib3VySW5kZXgoY3VyckluZGV4LCBjdXJyTmVpZ2gpKTtcblx0XHRcdFx0Y3VyclNjb3JlID0gY3VyckFuZ2xlIC0gbGFzdEFuZ2xlO1xuXHRcdFx0XHRpZiAoY3VyclNjb3JlID4gMTgwKSB7IGN1cnJTY29yZSA9IGN1cnJTY29yZSAtIDM2MDsgfVxuXHRcdFx0XHRpZiAoY3VyclNjb3JlIDwgLTE4MCkgeyBjdXJyU2NvcmUgPSBjdXJyU2NvcmUgKyAzNjA7IH1cblx0XHRcdFx0dmFyIG5laWdoSW5kZXggPSB2aXNpdGVkLmluZGV4T2YoY3Vyck5laWdoKTtcblx0XHRcdFx0aWYgKG5laWdoSW5kZXggIT09IC0xKSB7IGN1cnJTY29yZSA9IG5laWdoSW5kZXggLyB2aXNpdGVkLmxlbmd0aCAqIDEwMDAwICsgMTAwMDAgKyBjdXJyU2NvcmU7IH1cblx0XHRcdFx0aWYgKCFiZXN0IHx8IGN1cnJTY29yZSA8IGJlc3RTY29yZSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJlc3RTY29yZSA9IGN1cnJTY29yZTtcblx0XHRcdFx0XHRiZXN0ID0gY3Vyck5laWdoO1xuXHRcdFx0XHRcdGJlc3RBbmdsZSA9IGN1cnJBbmdsZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGFzdEFuZ2xlID0gYmVzdEFuZ2xlO1xuXHRcdFx0aWYgKHZpc2l0ZWQuaW5kZXhPZihjdXJySW5kZXgpICE9PSAtMSkgeyB2aXNpdGVkLnNwbGljZSh2aXNpdGVkLmluZGV4T2YoY3VyckluZGV4KSwgMSk7IH1cblx0XHRcdHZpc2l0ZWQucHVzaChjdXJySW5kZXgpO1xuXHRcdFx0Y3VyckluZGV4ID0gYmVzdDtcblxuXHRcdFx0cGF0aC5wdXNoKHRoaXMuX2dyYXBoW2N1cnJJbmRleFsxXV1bY3VyckluZGV4WzBdXSk7XG5cdFx0fVxuXHRcdHJldHVybiBwYXRoO1xuXHR9LFxuXG5cdGdldE91dGxpbmVzOiBmdW5jdGlvbiAoKVxuXHR7XG5cdFx0dmFyIHRvUmV0dXJuID0gW107XG5cdFx0dmFyIGN1cnJlbnRHcmFwaDtcblx0XHR2YXIgb3V0bGluZSA9IHRoaXMuZ2V0T3V0bGluZSgpO1xuXHRcdHZhciByZW1haW5pbmcgPSBvdXRsaW5lLmdldE5vZGVzQXJyYXkoKS5jb25jYXQoKTtcblxuXHRcdHZhciByZWN1ciA9IGZ1bmN0aW9uICgkcG9pbnQpXG5cdFx0e1xuXHRcdFx0Y3VycmVudEdyYXBoWyRwb2ludFsxXV0gPSBjdXJyZW50R3JhcGhbJHBvaW50WzFdXSB8fCBbXTtcblx0XHRcdGN1cnJlbnRHcmFwaFskcG9pbnRbMV1dWyRwb2ludFswXV0gPSAkcG9pbnQ7XG5cdFx0XHR2YXIgbmVpZ2hib3VycyA9IG91dGxpbmUuZ2V0TmVpZ2hib3VycygkcG9pbnRbMF0sICRwb2ludFsxXSk7XG5cdFx0XHRyZW1haW5pbmcuc3BsaWNlKHJlbWFpbmluZy5pbmRleE9mKCRwb2ludCksIDEpO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG5laWdoYm91cnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBuZWlnaCA9IG5laWdoYm91cnNbaV07XG5cdFx0XHRcdGlmIChyZW1haW5pbmcuaW5kZXhPZihuZWlnaCkgIT09IC0xKSB7IHJlY3VyKG5laWdoKTsgfVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR3aGlsZSAocmVtYWluaW5nLmxlbmd0aClcblx0XHR7XG5cdFx0XHRjdXJyZW50R3JhcGggPSBbXTtcblx0XHRcdHZhciBzdGFydGluZ1BvaW50ID0gcmVtYWluaW5nWzBdO1xuXHRcdFx0cmVjdXIoc3RhcnRpbmdQb2ludCk7XG5cdFx0XHR0b1JldHVybi5wdXNoKE9iamVjdC5jcmVhdGUoR3JpZCkuaW5pdChjdXJyZW50R3JhcGgpKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRvUmV0dXJuO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyaWQ7XG5cbiIsInZhciBOb2RlR3JhcGggPSBmdW5jdGlvbiAoKVxue1xuXHR0aGlzLnZlcnRpY2VzID0gW107XG5cdHRoaXMuZWRnZXMgPSBbXTtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0VmVydGV4ID0gZnVuY3Rpb24gKCRub2RlKVxue1xuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciB2ZXJ0ZXggPSB0aGlzLnZlcnRpY2VzW2ldO1xuXHRcdGlmICh2ZXJ0ZXgubm9kZSA9PT0gJG5vZGUpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHZlcnRleDtcblx0XHR9XG5cdH1cbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuY3JlYXRlVmVydGV4ID0gZnVuY3Rpb24gKCRub2RlKVxue1xuXHR2YXIgdmVydGV4ID0geyBub2RlOiAkbm9kZSB9O1xuXHR0aGlzLnZlcnRpY2VzLnB1c2godmVydGV4KTtcblx0cmV0dXJuIHZlcnRleDtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0RWRnZVdlaWdodCA9IGZ1bmN0aW9uICgkZWRnZSlcbntcblx0dmFyIGRYID0gTWF0aC5hYnMoJGVkZ2UudmVydGV4QS5ub2RlLm9YIC0gJGVkZ2UudmVydGV4Qi5ub2RlLm9YKTtcblx0dmFyIGRZID0gTWF0aC5hYnMoJGVkZ2UudmVydGV4QS5ub2RlLm9ZIC0gJGVkZ2UudmVydGV4Qi5ub2RlLm9ZKTtcblx0dmFyIGRpc3QgPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xuXHRyZXR1cm4gZGlzdDtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuZ2V0VmVydGV4RWRnZXMgPSBmdW5jdGlvbiAoJHZlcnRleClcbntcblx0dmFyIHRvUmV0dXJuID0gW107XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLmVkZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldO1xuXHRcdGlmIChlZGdlLnZlcnRleEEgPT09ICR2ZXJ0ZXggfHwgZWRnZS52ZXJ0ZXhCID09PSAkdmVydGV4KVxuXHRcdHtcblx0XHRcdHRvUmV0dXJuLnB1c2goZWRnZSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0b1JldHVybjtcbn07XG5cbk5vZGVHcmFwaC5wcm90b3R5cGUuY29ubmVjdCA9IGZ1bmN0aW9uICgkQU5vZGUsICRCTm9kZSlcbntcblx0dmFyIHZlcnRleEEgPSB0aGlzLmdldFZlcnRleCgkQU5vZGUpIHx8IHRoaXMuY3JlYXRlVmVydGV4KCRBTm9kZSk7XG5cdHZhciB2ZXJ0ZXhCID0gdGhpcy5nZXRWZXJ0ZXgoJEJOb2RlKSB8fCB0aGlzLmNyZWF0ZVZlcnRleCgkQk5vZGUpO1xuXG5cdHZhciBleGlzdHMgPSBmYWxzZTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMuZWRnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgZWRnZSA9IHRoaXMuZWRnZXNbaV07XG5cdFx0aWYgKChlZGdlLnZlcnRleEEgPT09IHZlcnRleEEgJiZcblx0XHRcdGVkZ2UudmVydGV4QiA9PT0gdmVydGV4QikgfHxcblx0XHRcdChlZGdlLnZlcnRleEEgPT09IHZlcnRleEIgJiZcblx0XHRcdGVkZ2UudmVydGV4QiA9PT0gdmVydGV4QSkpXG5cdFx0e1xuXHRcdFx0ZXhpc3RzID0gdHJ1ZTtcblx0XHR9XG5cdH1cblx0aWYgKCFleGlzdHMpXG5cdHtcblx0XHR0aGlzLmVkZ2VzLnB1c2goeyB2ZXJ0ZXhBOiB2ZXJ0ZXhBLCB2ZXJ0ZXhCOiB2ZXJ0ZXhCIH0pO1xuXHR9XG59O1xuXG5Ob2RlR3JhcGgucHJvdG90eXBlLnRyYXZlcnNlID0gZnVuY3Rpb24gKCRzdGFydGluZ1ZlcnRpY2VzKVxue1xuXHR2YXIgaTtcblx0dmFyIG9wZW5MaXN0ID0gW107XG5cdHZhciBlZGdlc0xlbmd0aDtcblx0dmFyIHZlcnRleEVkZ2VzO1xuXHR2YXIgc3RhcnRpbmdWZXJ0aWNlc0xlbmd0aCA9ICRzdGFydGluZ1ZlcnRpY2VzLmxlbmd0aDtcblx0Zm9yIChpID0gMDsgaSA8IHN0YXJ0aW5nVmVydGljZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdCRzdGFydGluZ1ZlcnRpY2VzW2ldLm1hcFZhbHVlID0gMDtcblx0XHQkc3RhcnRpbmdWZXJ0aWNlc1tpXS5vcGVuZWQgPSB0cnVlO1xuXHRcdG9wZW5MaXN0LnB1c2goJHN0YXJ0aW5nVmVydGljZXNbaV0pO1xuXHR9XG5cblx0d2hpbGUgKG9wZW5MaXN0Lmxlbmd0aClcblx0e1xuXHRcdHZhciBjbG9zZWRWZXJ0ZXggPSBvcGVuTGlzdC5zaGlmdCgpO1xuXHRcdGNsb3NlZFZlcnRleC5jbG9zZWQgPSB0cnVlO1xuXG5cdFx0dmVydGV4RWRnZXMgPSB0aGlzLmdldFZlcnRleEVkZ2VzKGNsb3NlZFZlcnRleCk7XG5cdFx0ZWRnZXNMZW5ndGggPSB2ZXJ0ZXhFZGdlcy5sZW5ndGg7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGVkZ2VzTGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJFZGdlID0gdmVydGV4RWRnZXNbaV07XG5cdFx0XHR2YXIgb3RoZXJWZXJ0ZXggPSBjdXJyRWRnZS52ZXJ0ZXhBID09PSBjbG9zZWRWZXJ0ZXggPyBjdXJyRWRnZS52ZXJ0ZXhCIDogY3VyckVkZ2UudmVydGV4QTtcblx0XHRcdGlmIChvdGhlclZlcnRleC5jbG9zZWQpIHsgY29udGludWU7IH1cblx0XHRcdFxuXHRcdFx0aWYgKCFvdGhlclZlcnRleC5vcGVuZWQpXG5cdFx0XHR7XG5cdFx0XHRcdG90aGVyVmVydGV4Lm9wZW5lZCA9IHRydWU7XG5cdFx0XHRcdG9wZW5MaXN0LnB1c2gob3RoZXJWZXJ0ZXgpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHZhbCA9IGNsb3NlZFZlcnRleC5tYXBWYWx1ZSArIHRoaXMuZ2V0RWRnZVdlaWdodChjdXJyRWRnZSk7XG5cdFx0XHRvdGhlclZlcnRleC5tYXBWYWx1ZSA9IG90aGVyVmVydGV4Lm1hcFZhbHVlIDwgdmFsID8gb3RoZXJWZXJ0ZXgubWFwVmFsdWUgOiB2YWw7IC8vd29ya3MgZXZlbiBpZiB1bmRlZmluZWRcblx0XHR9XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZUdyYXBoO1xuIiwidmFyIFBvbHlnb24gPVxue1xuXHRpbml0OiBmdW5jdGlvbiAoJHBvaW50cylcblx0e1xuXHRcdHZhciBwb2x5Z29uID0gT2JqZWN0LmNyZWF0ZShQb2x5Z29uKTtcblx0XHRwb2x5Z29uLnBvaW50cyA9ICRwb2ludHM7XG5cdFx0cG9seWdvbi5fYm91bmRpbmdCb3ggPSB1bmRlZmluZWQ7XG5cdFx0cmV0dXJuIHBvbHlnb247XG5cdH0sXG5cblx0Z2V0QXJlYTogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBzdW1BID0gMDtcblx0XHR2YXIgc3VtQiA9IDA7XG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMucG9pbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyUG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcblx0XHRcdHZhciBuZXh0ID0gaSA9PT0gbGVuZ3RoIC0gMSA/IHRoaXMucG9pbnRzWzBdIDogdGhpcy5wb2ludHNbaSArIDFdO1xuXHRcdFx0c3VtQSArPSBjdXJyUG9pbnRbMF0gKiBuZXh0WzFdO1xuXHRcdFx0c3VtQiArPSBjdXJyUG9pbnRbMV0gKiBuZXh0WzBdO1xuXHRcdH1cblxuXHRcdHJldHVybiBNYXRoLmFicygoc3VtQSAtIHN1bUIpICogMC41KTtcblx0fSxcblxuXHRnZXRCb3VuZGluZ0JveDogZnVuY3Rpb24gKClcblx0e1xuXHRcdGlmICghdGhpcy5fYm91bmRpbmdCb3gpXG5cdFx0e1xuXHRcdFx0dmFyIG1pblggPSB0aGlzLnBvaW50c1swXVswXTtcblx0XHRcdHZhciBtYXhYID0gbWluWDtcblx0XHRcdHZhciBtaW5ZID0gdGhpcy5wb2ludHNbMF1bMV07XG5cdFx0XHR2YXIgbWF4WSA9IG1pblk7XG5cblx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLnBvaW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIHBvaW50ID0gdGhpcy5wb2ludHNbaV07XG5cdFx0XHRcdG1pblggPSBNYXRoLm1pbihtaW5YLCBwb2ludFswXSk7XG5cdFx0XHRcdG1heFggPSBNYXRoLm1heChtYXhYLCBwb2ludFswXSk7XG5cdFx0XHRcdG1pblkgPSBNYXRoLm1pbihtaW5ZLCBwb2ludFsxXSk7XG5cdFx0XHRcdG1heFkgPSBNYXRoLm1heChtYXhZLCBwb2ludFsxXSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9ib3VuZGluZ0JveCA9IFtbbWluWCwgbWluWV0sIFttYXhYLCBtYXhZXV07XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLl9ib3VuZGluZ0JveDtcblx0fSxcblxuXHRnZXRTZWdtZW50czogZnVuY3Rpb24gKClcblx0e1xuXHRcdHZhciBzZWdtZW50cyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLnBvaW50cy5sZW5ndGggLSAxOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0c2VnbWVudHMucHVzaChbdGhpcy5wb2ludHNbaV0sIHRoaXMucG9pbnRzW2kgKyAxXV0pO1xuXHRcdH1cblx0XHRzZWdtZW50cy5wdXNoKFt0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGggLSAxXSwgdGhpcy5wb2ludHNbMF1dKTtcblx0XHRyZXR1cm4gc2VnbWVudHM7XG5cdH0sXG5cblx0Z2V0SW50ZXJzZWN0aW9uc0F0WTogZnVuY3Rpb24gKCR0ZXN0WSlcblx0e1xuXHRcdHZhciBzZWdtZW50cyA9IHRoaXMuZ2V0U2VnbWVudHMoKTtcblx0XHR2YXIgaW50ZXJzZWN0aW9ucyA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyclNlZ21lbnQgPSBzZWdtZW50c1tpXTtcblx0XHRcdHZhciB4MSA9IGN1cnJTZWdtZW50WzBdWzBdO1xuXHRcdFx0dmFyIHkxID0gY3VyclNlZ21lbnRbMF1bMV07XG5cdFx0XHR2YXIgeDIgPSBjdXJyU2VnbWVudFsxXVswXTtcblx0XHRcdHZhciB5MiA9IGN1cnJTZWdtZW50WzFdWzFdO1xuXHRcdFx0dmFyIHNtYWxsWSA9IE1hdGgubWluKHkxLCB5Mik7XG5cdFx0XHR2YXIgYmlnWSA9IE1hdGgubWF4KHkxLCB5Mik7XG5cblx0XHRcdGlmICgkdGVzdFkgPiBzbWFsbFkgJiYgJHRlc3RZIDwgYmlnWSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIHBZID0geTIgLSAkdGVzdFk7XG5cdFx0XHRcdHZhciBzZWdZID0geTIgLSB5MTtcblx0XHRcdFx0dmFyIHNlZ1ggPSB4MiAtIHgxO1xuXHRcdFx0XHR2YXIgcFggPSBwWSAqIHNlZ1ggLyBzZWdZO1xuXHRcdFx0XHRpbnRlcnNlY3Rpb25zLnB1c2goeDIgLSBwWCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBpbnRlcnNlY3Rpb25zO1xuXHR9LFxuXG5cdGlzSW5zaWRlOiBmdW5jdGlvbiAoJHBvaW50KVxuXHR7XG5cdFx0dmFyIGluZk51bWJlciA9IDA7XG5cdFx0dmFyIGludGVyc2VjdGlvbnMgPSB0aGlzLmdldEludGVyc2VjdGlvbnNBdFkoJHBvaW50WzFdKTtcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gaW50ZXJzZWN0aW9ucy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHRpZiAoJHBvaW50WzBdIDwgaW50ZXJzZWN0aW9uc1tpXSkgeyBpbmZOdW1iZXIgKz0gMTsgfVxuXHRcdH1cblx0XHRyZXR1cm4gaW5mTnVtYmVyICUgMiA+IDA7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9seWdvbjtcblxuIiwiXG52YXIgU1ZHUGFyc2VyID0gZnVuY3Rpb24gKCkge307XG4vL3ZhciBpc1BvbHlnb24gPSAvcG9seWdvbnxyZWN0L2lnO1xuLy8gdmFyIGlzTGluZSA9IC9wb2x5bGluZXxsaW5lfHBhdGgvaWc7XG4vLyB2YXIgbGluZVRhZ3MgPSAncG9seWxpbmUsIGxpbmUsIHBhdGgnO1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKCR3b3JsZCwgJFNWRylcbntcblx0dGhpcy5TVkcgPSAkU1ZHO1xuXHR2YXIgdmlld0JveEF0dHIgPSB0aGlzLlNWRy5nZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnKTtcblx0dGhpcy52aWV3Qm94V2lkdGggPSB2aWV3Qm94QXR0ciA/IE51bWJlcih2aWV3Qm94QXR0ci5zcGxpdCgnICcpWzJdKSA6IE51bWJlcih0aGlzLlNWRy5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuXHR0aGlzLnZpZXdCb3hIZWlnaHQgPSB2aWV3Qm94QXR0ciA/IE51bWJlcih2aWV3Qm94QXR0ci5zcGxpdCgnICcpWzNdKSA6IE51bWJlcih0aGlzLlNWRy5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpKTtcblx0dGhpcy5yYXRpbyA9ICR3b3JsZC5nZXRXaWR0aCgpIC8gdGhpcy52aWV3Qm94V2lkdGg7XG5cdHRoaXMud29ybGQgPSAkd29ybGQ7XG5cdHRoaXMud29ybGQuc2V0SGVpZ2h0KHRoaXMudmlld0JveEhlaWdodCAqIHRoaXMucmF0aW8pO1xuXG5cdC8vdGVtcFxuXHR2YXIgZWxlbWVudHNRdWVyeSA9ICcqOm5vdChkZWZzKTpub3QoZyk6bm90KHRpdGxlKTpub3QobGluZWFyR3JhZGllbnQpOm5vdChyYWRpYWxHcmFkaWVudCk6bm90KHN0b3ApOm5vdChbaWQqPVwiam9pbnRcIl0pOm5vdChbaWQqPVwiY29uc3RyYWludFwiXSknO1xuXHR2YXIgZWxlbVJhd3MgPSB0aGlzLlNWRy5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzUXVlcnkpO1xuXG5cdHZhciBpID0gMDtcblx0dmFyIHJhd0dyb3VwUGFpcmluZ3MgPSBbXTtcblx0dmFyIGVsZW1zTGVuZ3RoID0gZWxlbVJhd3MubGVuZ3RoO1xuXG5cdGZvciAoaSA9IDA7IGkgPCBlbGVtc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIHJhd0VsZW1lbnQgPSBlbGVtUmF3c1tpXTtcblx0XHQvL2lmIChyYXdFbGVtZW50Lm5vZGVUeXBlID09PSAzKSB7IGNvbnRpbnVlOyB9XG5cdFx0dmFyIGdyb3VwSW5mb3MgPSB0aGlzLmdldEdyb3VwSW5mb3MocmF3RWxlbWVudCk7XG5cdFx0dmFyIGN1cnJHcm91cCA9ICR3b3JsZC5jcmVhdGVHcm91cChncm91cEluZm9zLnR5cGUsIGdyb3VwSW5mb3MuSUQpO1xuXG5cdFx0Ly92YXIgZWxlbWVudHMgPSByYXdFbGVtZW50O1xuXHRcdC8vdGhpcy5wYXJzZUVsZW1lbnRzKGVsZW1lbnRzLCBjdXJyR3JvdXApO1xuXG5cdFx0dmFyIGVsZW1lbnRQcm9wZXJ0aWVzID0gdGhpcy5wYXJzZUVsZW1lbnQocmF3RWxlbWVudCk7XG5cdFx0dmFyIG5vZGVzVG9EcmF3ID0gY3Vyckdyb3VwLnN0cnVjdHVyZS5jcmVhdGUoZWxlbWVudFByb3BlcnRpZXMpO1xuXHRcdHRoaXMuc2V0R3JhcGhpY0luc3RydWN0aW9ucyhjdXJyR3JvdXAsIHJhd0VsZW1lbnQsIG5vZGVzVG9EcmF3LCBlbGVtZW50UHJvcGVydGllcyk7XG5cblx0XHQvLyB2YXIgaGFzR3JvdXA7XG5cdFx0Ly8gZm9yICh2YXIgayA9IDAsIGxlbmd0aCA9IHJhd0dyb3VwUGFpcmluZ3MubGVuZ3RoOyBrIDwgbGVuZ3RoOyBrICs9IDEpXG5cdFx0Ly8ge1xuXHRcdC8vIFx0dmFyIGN1cnIgPSByYXdHcm91cFBhaXJpbmdzW2tdO1xuXHRcdC8vIFx0aWYgKGN1cnIuZ3JvdXAgPT09IGN1cnJHcm91cClcblx0XHQvLyBcdHtcblx0XHQvLyBcdFx0aGFzR3JvdXAgPSB0cnVlO1xuXHRcdC8vIFx0XHRicmVhaztcblx0XHQvLyBcdH1cblx0XHQvLyB9XG5cdFx0Ly8gaWYgKCFoYXNHcm91cCkgeyByYXdHcm91cFBhaXJpbmdzLnB1c2goeyBncm91cDogY3Vyckdyb3VwLCByYXc6IHJhd0VsZW1lbnQucGFyZW50Tm9kZSB9KTsgfVxuXHRcdHJhd0dyb3VwUGFpcmluZ3MucHVzaCh7IGdyb3VwOiBjdXJyR3JvdXAsIHJhdzogcmF3RWxlbWVudC5wYXJlbnROb2RlIH0pO1xuXHR9XG5cblx0dmFyIHBhaXJpbmdzTGVuZ3RoID0gcmF3R3JvdXBQYWlyaW5ncy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCBwYWlyaW5nc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIHBhaXJpbmcgPSByYXdHcm91cFBhaXJpbmdzW2ldO1xuXHRcdC8vIHRoaXMucGFyc2VBbmNob3JzKHBhaXJpbmcucmF3LCBwYWlyaW5nLmdyb3VwKTtcblx0XHR0aGlzLnBhcnNlQ29uc3RyYWludHMocGFpcmluZy5yYXcsIHBhaXJpbmcuZ3JvdXApO1xuXHRcdHRoaXMucGFyc2VDdXN0b21Kb2ludHMocGFpcmluZy5yYXcsIHBhaXJpbmcuZ3JvdXApO1xuXHR9XG5cblx0dGhpcy53b3JsZC5hZGRHcm91cHNUb1dvcmxkKCk7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldEdyb3VwSW5mb3MgPSBmdW5jdGlvbiAoJHJhd0dyb3VwKVxue1xuXHR2YXIgZ3JvdXBFbGVtZW50ID0gKCEkcmF3R3JvdXAuaWQgfHwgJHJhd0dyb3VwLmlkLmluZGV4T2YoJ3N2ZycpID09PSAwKSAmJiAkcmF3R3JvdXAucGFyZW50Tm9kZS50YWdOYW1lICE9PSAnc3ZnJyA/ICRyYXdHcm91cC5wYXJlbnROb2RlIDogJHJhd0dyb3VwO1xuXHR2YXIgdHlwZTtcblx0dmFyIElEO1xuXHR2YXIgcmVnZXggPSAvKFthLXpcXGRdKylcXHcqL2lnbTtcblx0dmFyIGZpcnN0ID0gcmVnZXguZXhlYyhncm91cEVsZW1lbnQuaWQpO1xuXHR2YXIgc2Vjb25kID0gcmVnZXguZXhlYyhncm91cEVsZW1lbnQuaWQpO1xuXHQvL2lmIChmaXJzdCkgeyB0eXBlID0gc2Vjb25kID8gc2Vjb25kWzFdIDogZmlyc3RbMV07IH1cblx0Ly92YXIgZ3JvdXBUeXBlID0gZ3JvdXBFbGVtZW50LmlkLm1hdGNoKCk7XG5cdC8vaWYgKGdyb3VwVHlwZSkgeyByZXR1cm4gZ3JvdXBUeXBlWzFdIHx8IGdyb3VwVHlwZVswXTsgfVxuXHQvL2F1dG9tYXRpYyBmb3IgbGluZXNcblx0Ly8gaWYgKCFmaXJzdCAmJiAoZ3JvdXBFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwobGluZVRhZ3MpLmxlbmd0aCA+IDAgfHwgZ3JvdXBFbGVtZW50LnRhZ05hbWUuc2VhcmNoKGlzTGluZSkgPiAtMSkpXG5cdC8vIHtcblx0Ly8gXHR0eXBlID0gJ2xpbmUnO1xuXHQvLyB9XG5cdHR5cGUgPSBmaXJzdCA/IGZpcnN0WzFdIDogdW5kZWZpbmVkO1xuXHRJRCA9IHNlY29uZCA/IHNlY29uZFsxXSA6IG51bGw7XG5cdHZhciB0aXRsZSA9IGdyb3VwRWxlbWVudC5xdWVyeVNlbGVjdG9yKCd0aXRsZScpO1xuXHRpZiAoSUQgPT09IG51bGwpIHsgSUQgPSB0aXRsZSA/IHRpdGxlLm5vZGVWYWx1ZSA6IElEOyB9XG5cdC8vIGlmICgkcmF3R3JvdXAucGFyZW50Tm9kZS5pZCA9PT0gJ3RyZWUtdHJlZScpXG5cdC8vIHtcblx0Ly8gXHRjb25zb2xlLmxvZygkcmF3R3JvdXAsICRyYXdHcm91cC5pZCwgdHlwZSwgSUQpO1xuXHQvLyBcdGRlYnVnZ2VyO1xuXHQvLyB9XG5cblx0cmV0dXJuIHsgSUQ6IElELCB0eXBlOiB0eXBlIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlQ29uc3RyYWludHMgPSBmdW5jdGlvbiAoJHJhd0dyb3VwLCAkZ3JvdXApXG57XG5cdHZhciBjaGlsZHJlbiA9ICRyYXdHcm91cC5jaGlsZE5vZGVzOy8vJHJhd0dyb3VwLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZCo9XCJjb25zdHJhaW50XCJdJyk7XG5cblx0Zm9yICh2YXIgaSA9IDAsIGNoaWxkcmVuTGVuZ3RoID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgY2hpbGRyZW5MZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdGlmIChjaGlsZHJlbltpXS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHwgY2hpbGRyZW5baV0uaWQuc2VhcmNoKC9jb25zdHJhaW50L2kpIDwgMCkgeyBjb250aW51ZTsgfVxuXHRcdHZhciBjdXJyQ29uc3RyYWludCA9IGNoaWxkcmVuW2ldO1xuXHRcdHZhciByZXN1bHQgPSAvY29uc3RyYWludC0oW2EtelxcZF0qKS9pZy5leGVjKGN1cnJDb25zdHJhaW50LmlkKTtcblxuXHRcdHZhciBwYXJlbnRHcm91cElEID0gcmVzdWx0ID8gcmVzdWx0WzFdIDogdW5kZWZpbmVkO1xuXHRcdHZhciBwYXJlbnRHcm91cCA9IHBhcmVudEdyb3VwSUQgPyB0aGlzLndvcmxkLmdldEdyb3VwQnlJRChwYXJlbnRHcm91cElEKSA6IHVuZGVmaW5lZDtcblx0XHR2YXIgcG9pbnRzID0gdGhpcy5wYXJzZUVsZW1lbnQoY3VyckNvbnN0cmFpbnQpLnBvaW50cztcblx0XHQvLyBjb25zb2xlLmxvZygkZ3JvdXAuSUQsIHBhcmVudEdyb3VwID8gcGFyZW50R3JvdXAuSUQgOiB1bmRlZmluZWQpO1xuXHRcdHRoaXMud29ybGQuY29uc3RyYWluR3JvdXBzKCRncm91cCwgcGFyZW50R3JvdXAsIHBvaW50cyk7XG5cdH1cbn07XG5cbi8vIFNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VFbGVtZW50cyA9IGZ1bmN0aW9uICgkZWxlbWVudHMsICRncm91cClcbi8vIHtcbi8vIFx0Zm9yICh2YXIgaSA9IDAsIGVsZW1lbnRzTGVuZ3RoID0gJGVsZW1lbnRzLmxlbmd0aDsgaSA8IGVsZW1lbnRzTGVuZ3RoOyBpICs9IDEpXG4vLyBcdHtcbi8vIFx0XHR2YXIgcmF3RWxlbWVudCA9ICRlbGVtZW50c1tpXTtcblxuLy8gXHRcdHZhciBlbGVtZW50ID0gdGhpcy5wYXJzZUVsZW1lbnQocmF3RWxlbWVudCk7XG5cbi8vIFx0XHR2YXIgbm9kZXNUb0RyYXcgPSAkZ3JvdXAuc3RydWN0dXJlLmNyZWF0ZShlbGVtZW50KTtcbi8vIFx0XHR0aGlzLnNldEdyYXBoaWNJbnN0cnVjdGlvbnMoJGdyb3VwLCByYXdFbGVtZW50LCBub2Rlc1RvRHJhdywgZWxlbWVudCk7XG4vLyBcdH1cbi8vIH07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VFbGVtZW50ID0gZnVuY3Rpb24gKCRyYXdFbGVtZW50KVxue1xuXHR2YXIgdGFnTmFtZSA9ICRyYXdFbGVtZW50LnRhZ05hbWU7XG5cblx0c3dpdGNoICh0YWdOYW1lKVxuXHR7XG5cdFx0Y2FzZSAnbGluZSc6XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUxpbmUoJHJhd0VsZW1lbnQpO1xuXHRcdGNhc2UgJ3JlY3QnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VSZWN0KCRyYXdFbGVtZW50KTtcblxuXHRcdGNhc2UgJ3BvbHlnb24nOlxuXHRcdGNhc2UgJ3BvbHlsaW5lJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlUG9seSgkcmF3RWxlbWVudCk7XG5cblx0XHRjYXNlICdwYXRoJzpcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlUGF0aCgkcmF3RWxlbWVudCk7XG5cblx0XHRjYXNlICdjaXJjbGUnOlxuXHRcdGNhc2UgJ2VsbGlwc2UnOlxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDaXJjbGUoJHJhd0VsZW1lbnQpO1xuXHR9XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnNldEdyYXBoaWNJbnN0cnVjdGlvbnMgPSBmdW5jdGlvbiAoJGdyb3VwLCAkcmF3LCAkbm9kZXNUb0RyYXcsICRlbGVtZW50UHJvcGVydGllcylcbntcblx0dmFyIGRyYXdpbmcgPSAkZ3JvdXAuZHJhd2luZyA9IHt9O1xuXHRkcmF3aW5nLm5vZGVzID0gJG5vZGVzVG9EcmF3O1xuXHR2YXIgcHJvcHMgPSBkcmF3aW5nLnByb3BlcnRpZXMgPSB7fTtcblx0Ly9vcmRlcmluZyBub2Rlc1RvRHJhdyBzbyB0aGUgcGF0aCBpcyBkcmF3biBjb3JyZWN0bHlcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9ICRub2Rlc1RvRHJhdy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyTm9kZSA9ICRub2Rlc1RvRHJhd1tpXTtcblx0XHQvL2N1cnJOb2RlLmRyYXdpbmcgPSB7fTtcblx0XHRjdXJyTm9kZS5kcmF3aW5nID0gJGVsZW1lbnRQcm9wZXJ0aWVzLnBvaW50SW5mb3NbaV07XG5cdFx0JGdyb3VwLm5vZGVzLnNwbGljZSgkZ3JvdXAubm9kZXMuaW5kZXhPZihjdXJyTm9kZSksIDEpO1xuXHRcdCRncm91cC5ub2Rlcy5zcGxpY2UoaSwgMCwgY3Vyck5vZGUpO1xuXHR9XG5cdCRub2Rlc1RvRHJhd1swXS5kcmF3aW5nLmlzU3RhcnQgPSB0cnVlO1xuXHQkbm9kZXNUb0RyYXdbJG5vZGVzVG9EcmF3Lmxlbmd0aCAtIDFdLmRyYXdpbmcuaXNFbmQgPSB0cnVlO1xuXHQkbm9kZXNUb0RyYXdbMF0uZHJhd2luZy5lbmROb2RlID0gJG5vZGVzVG9EcmF3WyRub2Rlc1RvRHJhdy5sZW5ndGggLSAxXTtcblxuXHR2YXIgcmF3RmlsbCA9ICRyYXcuZ2V0QXR0cmlidXRlKCdmaWxsJyk7XG5cdHZhciByYXdTdHJva2VXaWR0aCA9ICRyYXcuZ2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnKTtcblx0dmFyIHJhd1N0cm9rZSA9ICRyYXcuZ2V0QXR0cmlidXRlKCdzdHJva2UnKTtcblx0dmFyIHJhd0xpbmVjYXAgPSAkcmF3LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVjYXAnKTtcblx0dmFyIHJhd0xpbmVqb2luID0gJHJhdy5nZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lam9pbicpO1xuXHR2YXIgcmF3T3BhY2l0eSA9ICRyYXcuZ2V0QXR0cmlidXRlKCdvcGFjaXR5Jyk7XG5cblx0cHJvcHMuZmlsbCA9IHJhd0ZpbGwgfHwgJyMwMDAwMDAnO1xuXHRwcm9wcy5saW5lV2lkdGggPSByYXdTdHJva2VXaWR0aCAqIHRoaXMucmF0aW8gfHwgMDtcblx0cHJvcHMuc3Ryb2tlID0gcmF3U3Ryb2tlICYmIHByb3BzLmxpbmVXaWR0aCAhPT0gMCA/IHJhd1N0cm9rZSA6ICdub25lJztcblx0cHJvcHMubGluZUNhcCA9IHJhd0xpbmVjYXAgJiYgcmF3TGluZWNhcCAhPT0gJ251bGwnID8gcmF3TGluZWNhcCA6ICdidXR0Jztcblx0cHJvcHMubGluZUpvaW4gPSByYXdMaW5lam9pbiAmJiByYXdMaW5lam9pbiAhPT0gJ251bGwnID8gcmF3TGluZWpvaW4gOiAnbWl0ZXInO1xuXHRwcm9wcy5vcGFjaXR5ID0gcmF3T3BhY2l0eSB8fCAxO1xuXG5cdHByb3BzLmNsb3NlUGF0aCA9ICRncm91cC5jb25mLnN0cnVjdHVyZSAhPT0gJ2xpbmUnICYmICRncm91cC5zdHJ1Y3R1cmUucmFkaXVzWCA9PT0gdW5kZWZpbmVkO1xuXG5cdHByb3BzLnJhZGl1c1ggPSAkZWxlbWVudFByb3BlcnRpZXMucmFkaXVzWDtcblx0cHJvcHMucmFkaXVzWSA9ICRlbGVtZW50UHJvcGVydGllcy5yYWRpdXNZO1xuXG5cdHByb3BzLnN0cm9rZUdyYWRpZW50ID0gdGhpcy5nZXRHcmFkaWVudChwcm9wcy5zdHJva2UpO1xuXHRwcm9wcy5keW5hbWljR3JhZGllbnQgPSAkZ3JvdXAuY29uZi5zdHJ1Y3R1cmUgPT09ICdsaW5lJyAmJiBwcm9wcy5zdHJva2VHcmFkaWVudDtcblx0cHJvcHMuZmlsbEdyYWRpZW50ID0gdGhpcy5nZXRHcmFkaWVudChwcm9wcy5maWxsKTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUuZ2V0R3JhZGllbnQgPSBmdW5jdGlvbiAoJHZhbHVlKVxue1xuXHR2YXIgZ3JhZGllbnRJRCA9IC91cmxcXCgjKC4qKVxcKS9pbS5leGVjKCR2YWx1ZSk7XG5cdGlmIChncmFkaWVudElEKVxuXHR7XG5cdFx0dmFyIGdyYWRpZW50RWxlbWVudCA9IHRoaXMuU1ZHLnF1ZXJ5U2VsZWN0b3IoJyMnICsgZ3JhZGllbnRJRFsxXSk7XG5cdFx0aWYgKGdyYWRpZW50RWxlbWVudC50YWdOYW1lICE9PSAnbGluZWFyR3JhZGllbnQnICYmIGdyYWRpZW50RWxlbWVudC50YWdOYW1lICE9PSAncmFkaWFsR3JhZGllbnQnKSB7IHJldHVybjsgfVxuXG5cdFx0dmFyIGdyYWRpZW50ID0geyBzdG9wczogW10sIHR5cGU6IGdyYWRpZW50RWxlbWVudC50YWdOYW1lIH07XG5cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgPT09ICdsaW5lYXJHcmFkaWVudCcpXG5cdFx0e1xuXHRcdFx0Z3JhZGllbnQueDEgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHRcdFx0Z3JhZGllbnQueTEgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kxJykpO1xuXHRcdFx0Z3JhZGllbnQueDIgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3gyJykpO1xuXHRcdFx0Z3JhZGllbnQueTIgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXHRcdH1cblx0XHRpZiAoZ3JhZGllbnRFbGVtZW50LnRhZ05hbWUgPT09ICdyYWRpYWxHcmFkaWVudCcpXG5cdFx0e1xuXHRcdFx0Z3JhZGllbnQuY3ggPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2N4JykpO1xuXHRcdFx0Z3JhZGllbnQuY3kgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2N5JykpO1xuXHRcdFx0Z3JhZGllbnQuZnggPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Z4JykpO1xuXHRcdFx0Z3JhZGllbnQuZnkgPSB0aGlzLmdldENvb3JkKGdyYWRpZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2Z5JykpO1xuXHRcdFx0Z3JhZGllbnQuciA9IHRoaXMuZ2V0Q29vcmQoZ3JhZGllbnRFbGVtZW50LmdldEF0dHJpYnV0ZSgncicpKTtcblx0XHR9XG5cblx0XHR2YXIgc3RvcHMgPSBncmFkaWVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnc3RvcCcpO1xuXHRcdGZvciAodmFyIGsgPSAwLCBzdG9wTGVuZ3RoID0gc3RvcHMubGVuZ3RoOyBrIDwgc3RvcExlbmd0aDsgayArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyU3RvcCA9IHN0b3BzW2tdO1xuXHRcdFx0dmFyIG9mZnNldCA9IE51bWJlcihjdXJyU3RvcC5nZXRBdHRyaWJ1dGUoJ29mZnNldCcpKTtcblx0XHRcdHZhciBjb2xvciA9IGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnc3RvcC1jb2xvcicpIHx8IC9zdG9wLWNvbG9yOigjWzAtOUEtRl0rKS9pbS5leGVjKGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnc3R5bGUnKSlbMV07XG5cdFx0XHR2YXIgb3BhY2l0eSA9IGN1cnJTdG9wLmdldEF0dHJpYnV0ZSgnc3RvcC1vcGFjaXR5Jyk7XG5cdFx0XHRncmFkaWVudC5zdG9wcy5wdXNoKHsgb2Zmc2V0OiBvZmZzZXQsIGNvbG9yOiBjb2xvciwgb3BhY2l0eTogb3BhY2l0eSB9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZ3JhZGllbnQ7XG5cdH1cbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VDaXJjbGUgPSBmdW5jdGlvbiAoJHJhd0NpcmNsZSlcbntcblx0dmFyIHhQb3MgPSB0aGlzLmdldENvb3JkKCRyYXdDaXJjbGUuZ2V0QXR0cmlidXRlKCdjeCcpIHx8IDApO1xuXHR2YXIgeVBvcyA9IHRoaXMuZ2V0Q29vcmQoJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ2N5JykgfHwgMCk7XG5cdHZhciByYWRpdXNBdHRyWCA9ICRyYXdDaXJjbGUuZ2V0QXR0cmlidXRlKCdyJykgfHwgJHJhd0NpcmNsZS5nZXRBdHRyaWJ1dGUoJ3J4Jyk7XG5cdHZhciByYWRpdXNBdHRyWSA9ICRyYXdDaXJjbGUuZ2V0QXR0cmlidXRlKCdyeScpO1xuXHR2YXIgcmFkaXVzWCA9IHRoaXMuZ2V0Q29vcmQocmFkaXVzQXR0clgpO1xuXHR2YXIgcmFkaXVzWSA9IHRoaXMuZ2V0Q29vcmQocmFkaXVzQXR0clkpIHx8IHVuZGVmaW5lZDtcblx0cmV0dXJuIHsgdHlwZTogJ2VsbGlwc2UnLCBwb2ludHM6IFtbeFBvcywgeVBvc11dLCByYWRpdXNYOiByYWRpdXNYLCByYWRpdXNZOiByYWRpdXNZIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlTGluZSA9IGZ1bmN0aW9uICgkcmF3TGluZSlcbntcblx0dmFyIHgxID0gdGhpcy5nZXRDb29yZCgkcmF3TGluZS5nZXRBdHRyaWJ1dGUoJ3gxJykpO1xuXHR2YXIgeDIgPSB0aGlzLmdldENvb3JkKCRyYXdMaW5lLmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdHZhciB5MSA9IHRoaXMuZ2V0Q29vcmQoJHJhd0xpbmUuZ2V0QXR0cmlidXRlKCd5MScpKTtcblx0dmFyIHkyID0gdGhpcy5nZXRDb29yZCgkcmF3TGluZS5nZXRBdHRyaWJ1dGUoJ3kyJykpO1xuXHR2YXIgcG9pbnRzID0gW107XG5cdHBvaW50cy5wdXNoKFt4MSwgeTFdKTtcblx0cG9pbnRzLnB1c2goW3gyLCB5Ml0pO1xuXHR2YXIgdGhpY2tuZXNzID0gdGhpcy5nZXRDb29yZCgkcmF3TGluZS5nZXRBdHRyaWJ1dGUoJ3N0cm9rZS13aWR0aCcpKTtcblx0cmV0dXJuIHsgdHlwZTogJ2xpbmUnLCBwb2ludHM6IHBvaW50cywgdGhpY2tuZXNzOiB0aGlja25lc3MgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VSZWN0ID0gZnVuY3Rpb24gKCRyYXdSZWN0KVxue1xuXHR2YXIgeDEgPSAkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3gnKSA/IHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd4JykpIDogMDtcblx0dmFyIHkxID0gJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCd5JykgPyB0aGlzLmdldENvb3JkKCRyYXdSZWN0LmdldEF0dHJpYnV0ZSgneScpKSA6IDA7XG5cdHZhciB4MiA9IHgxICsgdGhpcy5nZXRDb29yZCgkcmF3UmVjdC5nZXRBdHRyaWJ1dGUoJ3dpZHRoJykpO1xuXHR2YXIgeTIgPSB5MSArIHRoaXMuZ2V0Q29vcmQoJHJhd1JlY3QuZ2V0QXR0cmlidXRlKCdoZWlnaHQnKSk7XG5cdHZhciBwb2ludHMgPSBbXTtcblx0cG9pbnRzLnB1c2goW3gxLCB5MV0pO1xuXHRwb2ludHMucHVzaChbeDEsIHkyXSk7XG5cdHBvaW50cy5wdXNoKFt4MiwgeTJdKTtcblx0cG9pbnRzLnB1c2goW3gyLCB5MV0pO1xuXG5cdHJldHVybiB7IHR5cGU6ICdwb2x5Z29uJywgcG9pbnRzOiBwb2ludHMgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VQb2x5ID0gZnVuY3Rpb24gKCRyYXdQb2x5KVxue1xuXHR2YXIgc3BsaXRzID0gJHJhd1BvbHkuZ2V0QXR0cmlidXRlKCdwb2ludHMnKS5zcGxpdCgnICcpO1xuXHR2YXIgcG9pbnRzID0gW107XG5cblx0Zm9yICh2YXIgaSA9IDAsIHNwbGl0c0xlbmd0aCA9IHNwbGl0cy5sZW5ndGg7IGkgPCBzcGxpdHNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyU3BsaXQgPSBzcGxpdHNbaV07XG5cblx0XHRpZiAoY3VyclNwbGl0ICE9PSAnJylcblx0XHR7XG5cdFx0XHR2YXIgcG9pbnQgPSBjdXJyU3BsaXQuc3BsaXQoJywnKTtcblx0XHRcdHZhciBwb2ludFggPSB0aGlzLmdldENvb3JkKHBvaW50WzBdKTtcblx0XHRcdHZhciBwb2ludFkgPSB0aGlzLmdldENvb3JkKHBvaW50WzFdKTtcblx0XHRcdHZhciBleGlzdHMgPSBmYWxzZTtcblx0XHRcdGZvciAodmFyIGsgPSAwLCBvdGhlckNvb3Jkc0FycmF5TGVuZ3RoID0gcG9pbnRzLmxlbmd0aDsgayA8IG90aGVyQ29vcmRzQXJyYXlMZW5ndGg7IGsgKz0gMSlcblx0XHRcdHtcblx0XHRcdFx0dmFyIG90aGVyUG9pbnQgPSBwb2ludHNba107XG5cdFx0XHRcdHZhciBvdGhlclggPSBvdGhlclBvaW50WzBdO1xuXHRcdFx0XHR2YXIgb3RoZXJZID0gb3RoZXJQb2ludFsxXTtcblx0XHRcdFx0aWYgKG90aGVyWCA9PT0gcG9pbnRYICYmIG90aGVyWSA9PT0gcG9pbnRZKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0ZXhpc3RzID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGV4aXN0cyA9PT0gZmFsc2UpXG5cdFx0XHR7XG5cdFx0XHRcdHBvaW50cy5wdXNoKFtwb2ludFgsIHBvaW50WV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHZhciB0aGlja25lc3MgPSB0aGlzLmdldENvb3JkKCRyYXdQb2x5LmdldEF0dHJpYnV0ZSgnc3Ryb2tlLXdpZHRoJykpO1xuXHR2YXIgdHlwZSA9ICRyYXdQb2x5LnRhZ05hbWUgPT09ICdwb2x5bGluZScgPyAncG9seWxpbmUnIDogJ3BvbHlnb24nO1xuXHRyZXR1cm4geyB0eXBlOiB0eXBlLCBwb2ludHM6IHBvaW50cywgdGhpY2tuZXNzOiB0aGlja25lc3MgfTtcbn07XG5cblNWR1BhcnNlci5wcm90b3R5cGUucGFyc2VQYXRoID0gZnVuY3Rpb24gKCRyYXdQYXRoKVxue1xuXHR2YXIgZCA9ICRyYXdQYXRoLmdldEF0dHJpYnV0ZSgnZCcpO1xuXHR2YXIgcGF0aFJlZyA9IC8oW2EteV0pKFsuXFwtLFxcZF0rKS9pZ207XG5cdHZhciByZXN1bHQ7XG5cdHZhciBjb29yZHNSZWdleCA9IC8tP1tcXGQuXSsvaWdtO1xuXHR2YXIgcG9pbnRJbmZvcyA9IFtdO1xuXHR2YXIgbGFzdFggPSB0aGlzLmdldENvb3JkKDApO1xuXHR2YXIgbGFzdFkgPSB0aGlzLmdldENvb3JkKDApO1xuXG5cdHZhciB0aGF0ID0gdGhpcztcblx0dmFyIGdldFBvaW50ID0gZnVuY3Rpb24gKCR4LCAkeSwgJHJlbGF0aXZlKVxuXHR7XG5cdFx0dmFyIHggPSAkeCA9PT0gdW5kZWZpbmVkID8gbGFzdFggOiB0aGF0LmdldENvb3JkKCR4KTtcblx0XHR2YXIgeSA9ICR5ID09PSB1bmRlZmluZWQgPyBsYXN0WSA6IHRoYXQuZ2V0Q29vcmQoJHkpO1xuXHRcdGlmICgkcmVsYXRpdmUpXG5cdFx0e1xuXHRcdFx0eCA9IGxhc3RYICsgeDtcblx0XHRcdHkgPSBsYXN0WSArIHk7XG5cdFx0fVxuXHRcdHJldHVybiBbeCwgeV07XG5cdH07XG5cblx0dmFyIGdldFJlbGF0aXZlUG9pbnQgPSBmdW5jdGlvbiAoJHBvaW50LCAkeCwgJHksICRyZWxhdGl2ZSlcblx0e1xuXHRcdHZhciB4ID0gdGhhdC5nZXRDb29yZCgkeCk7XG5cdFx0dmFyIHkgPSB0aGF0LmdldENvb3JkKCR5KTtcblx0XHRpZiAoJHJlbGF0aXZlKVxuXHRcdHtcblx0XHRcdHggPSBsYXN0WCArIHg7XG5cdFx0XHR5ID0gbGFzdFkgKyB5O1xuXHRcdH1cblx0XHR4ID0geCAtICRwb2ludFswXTtcblx0XHR5ID0geSAtICRwb2ludFsxXTtcblx0XHRyZXR1cm4gW3gsIHldO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVQb2ludCA9IGZ1bmN0aW9uICgkY29tbWFuZCwgJHBvaW50LCAkb3B0aW9ucylcblx0e1xuXHRcdHZhciBpbmZvID0geyBjb21tYW5kOiAkY29tbWFuZCwgcG9pbnQ6ICRwb2ludCwgb3B0aW9uczogJG9wdGlvbnMgfTtcblx0XHRsYXN0WCA9IGluZm8ucG9pbnRbMF07XG5cdFx0bGFzdFkgPSBpbmZvLnBvaW50WzFdO1xuXHRcdHBvaW50SW5mb3MucHVzaChpbmZvKTtcblx0fTtcblxuXHR2YXIgcG9pbnQ7XG5cdHZhciBjdWJpYzE7XG5cdHZhciBjdWJpYzI7XG5cdHZhciBxdWFkcmExO1xuXG5cdGRvXG5cdHtcblx0XHRyZXN1bHQgPSBwYXRoUmVnLmV4ZWMoZCk7XG5cdFx0aWYgKHJlc3VsdCA9PT0gbnVsbClcblx0XHR7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0dmFyIGluc3RydWN0aW9uID0gcmVzdWx0WzFdLnRvTG93ZXJDYXNlKCk7XG5cdFx0dmFyIGNvb3JkcyA9IHJlc3VsdFsyXS5tYXRjaChjb29yZHNSZWdleCk7XG5cdFx0dmFyIGlzTG93c2VyQ2FzZSA9IC9bYS16XS8udGVzdChyZXN1bHRbMV0pO1xuXG5cdFx0c3dpdGNoIChpbnN0cnVjdGlvbilcblx0XHR7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0Y2FzZSAnbSc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgnbW92ZVRvJywgcG9pbnQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2wnOlxuXHRcdFx0XHRxdWFkcmExID0gbnVsbDtcblx0XHRcdFx0Y3ViaWMyID0gbnVsbDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoJ2xpbmVUbycsIHBvaW50KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICd2Jzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdGN1YmljMiA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQodW5kZWZpbmVkLCBjb29yZHNbMF0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KCdsaW5lVG8nLCBwb2ludCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnaCc6XG5cdFx0XHRcdHF1YWRyYTEgPSBudWxsO1xuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRwb2ludCA9IGdldFBvaW50KGNvb3Jkc1swXSwgdW5kZWZpbmVkLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgnbGluZVRvJywgcG9pbnQpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2MnOlxuXHRcdFx0XHRxdWFkcmExID0gbnVsbDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbNF0sIGNvb3Jkc1s1XSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3ViaWMxID0gZ2V0UmVsYXRpdmVQb2ludChwb2ludCwgY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGN1YmljMiA9IGdldFJlbGF0aXZlUG9pbnQocG9pbnQsIGNvb3Jkc1syXSwgY29vcmRzWzNdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgnYmV6aWVyQ3VydmVUbycsIHBvaW50LCBbY3ViaWMxLCBjdWJpYzJdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdzJzpcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzJdLCBjb29yZHNbM10sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGN1YmljMSA9IGN1YmljMiA/IFtsYXN0WCAtIGN1YmljMlswXSAtIHBvaW50WzBdLCBsYXN0WSAtIGN1YmljMlsxXSAtIHBvaW50WzFdXSA6IHVuZGVmaW5lZDtcblx0XHRcdFx0Y3ViaWMyID0gZ2V0UmVsYXRpdmVQb2ludChwb2ludCwgY29vcmRzWzBdLCBjb29yZHNbMV0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGN1YmljMSA9IGN1YmljMSB8fCBbY3ViaWMyWzBdLCBjdWJpYzJbMV1dO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgnYmV6aWVyQ3VydmVUbycsIHBvaW50LCBbY3ViaWMxLCBjdWJpYzJdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdxJzpcblx0XHRcdFx0Y3ViaWMyID0gbnVsbDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbMl0sIGNvb3Jkc1szXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0cXVhZHJhMSA9IGdldFJlbGF0aXZlUG9pbnQocG9pbnQsIGNvb3Jkc1swXSwgY29vcmRzWzFdLCBpc0xvd3NlckNhc2UpO1xuXHRcdFx0XHRjcmVhdGVQb2ludCgncXVhZHJhdGljQ3VydmVUbycsIHBvaW50LCBbcXVhZHJhMV0pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ3QnOlxuXHRcdFx0XHRjdWJpYzIgPSBudWxsO1xuXHRcdFx0XHRxdWFkcmExID0gcXVhZHJhMSA/IHF1YWRyYTEgOiBwb2ludDtcblx0XHRcdFx0cG9pbnQgPSBnZXRQb2ludChjb29yZHNbMF0sIGNvb3Jkc1sxXSwgaXNMb3dzZXJDYXNlKTtcblx0XHRcdFx0Y3JlYXRlUG9pbnQoJ3F1YWRyYXRpY0N1cnZlVG8nLCBwb2ludCwgW3F1YWRyYTFdKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdhJzpcblx0XHRcdFx0Y3ViaWMyID0gbnVsbDtcblx0XHRcdFx0cXVhZHJhMSA9IG51bGw7XG5cdFx0XHRcdHBvaW50ID0gZ2V0UG9pbnQoY29vcmRzWzVdLCBjb29yZHNbNl0sIGlzTG93c2VyQ2FzZSk7XG5cdFx0XHRcdGNyZWF0ZVBvaW50KCdhcmNUbycsIHBvaW50KTtcblx0XHRcdFx0Y29uc29sZS53YXJuKCdub3Qgc3VwcG9ydGVkJyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHdoaWxlIChyZXN1bHQpO1xuXG5cdC8vIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBwb2ludEluZm9zLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHQvLyB7XG5cdC8vIFx0dmFyIGN1cnIgPSBwb2ludEluZm9zW2ldO1xuXHQvLyBcdGN1cnIucG9pbnRbMF0gPSBjdXJyLnBvaW50WzBdIC8gdGhpcy5yYXRpbztcblx0Ly8gXHRjdXJyLnBvaW50WzFdID0gY3Vyci5wb2ludFsxXSAvIHRoaXMucmF0aW87XG5cdC8vIFx0aWYgKGN1cnIub3B0aW9ucylcblx0Ly8gXHR7XG5cdC8vIFx0XHRpZiAoY3Vyci5vcHRpb25zWzBdKSB7IGN1cnIub3B0aW9uc1swXVswXSA9IGN1cnIub3B0aW9uc1swXVswXSAvIHRoaXMucmF0aW87IH1cblx0Ly8gXHRcdGlmIChjdXJyLm9wdGlvbnNbMF0pIHsgY3Vyci5vcHRpb25zWzBdWzFdID0gY3Vyci5vcHRpb25zWzBdWzFdIC8gdGhpcy5yYXRpbzsgfVxuXHQvLyBcdFx0aWYgKGN1cnIub3B0aW9uc1sxXSkgeyBjdXJyLm9wdGlvbnNbMV1bMF0gPSBjdXJyLm9wdGlvbnNbMV1bMF0gLyB0aGlzLnJhdGlvOyB9XG5cdC8vIFx0XHRpZiAoY3Vyci5vcHRpb25zWzFdKSB7IGN1cnIub3B0aW9uc1sxXVsxXSA9IGN1cnIub3B0aW9uc1sxXVsxXSAvIHRoaXMucmF0aW87IH1cblx0Ly8gXHRcdGlmIChjdXJyLm9wdGlvbnNbMl0pIHsgY3Vyci5vcHRpb25zWzJdWzBdID0gY3Vyci5vcHRpb25zWzJdWzBdIC8gdGhpcy5yYXRpbzsgfVxuXHQvLyBcdFx0aWYgKGN1cnIub3B0aW9uc1syXSkgeyBjdXJyLm9wdGlvbnNbMl1bMV0gPSBjdXJyLm9wdGlvbnNbMl1bMV0gLyB0aGlzLnJhdGlvOyB9XG5cdC8vIFx0fVxuXHQvLyB9XG5cdC8vIGNvbnNvbGUubG9nKHBvaW50SW5mb3MpO1xuXHQvLyBkZWJ1Z2dlcjtcblxuXHRyZXR1cm4geyB0eXBlOiAncGF0aCcsIHBvaW50SW5mb3M6IHBvaW50SW5mb3MgfTtcblx0Ly92YXIgcG9pbnRzID1cblx0Ly8gdmFyIHBhdGhSZWcgPSAvKFttbHNjdmhdKSgtP1tcXGRcXC5dKlssLV0rW1xcZFxcLl0qKSw/KC0/W1xcZFxcLl0qLD8tP1tcXGRcXC5dKiksPygtP1tcXGRcXC5dKiw/LT9bXFxkXFwuXSopL2lnbTtcblx0Ly8gdmFyIHBvaW50cyA9IFtdO1xuXHQvLyB2YXIgbGFzdENvb3JkWCA9IHRoaXMuZ2V0Q29vcmQoMCk7XG5cdC8vIHZhciBsYXN0Q29vcmRZID0gdGhpcy5nZXRDb29yZCgwKTtcblx0Ly8gY29uc29sZS5sb2cocGF0aFJlZy5leGVjKGQpKTtcblx0Ly8gZGVidWdnZXI7XG5cdC8vIGZvciAodmFyIGFycmF5ID0gcGF0aFJlZy5leGVjKGQpOyBhcnJheSAhPT0gbnVsbDsgYXJyYXkgPSBwYXRoUmVnLmV4ZWMoZCkpXG5cdC8vIHtcblx0Ly8gXHR2YXIgY29vcmRTdHJpbmc7XG5cdC8vIFx0dmFyIG51bWJlckNvb3JkWDtcblx0Ly8gXHR2YXIgbnVtYmVyQ29vcmRZO1xuXHQvLyBcdGlmIChhcnJheVsxXSA9PT0gJ3YnKVxuXHQvLyBcdHtcblx0Ly8gXHRcdG51bWJlckNvb3JkWCA9IGxhc3RDb29yZFg7XG5cdC8vIFx0XHRudW1iZXJDb29yZFkgPSBsYXN0Q29vcmRZICsgdGhpcy5nZXRDb29yZChhcnJheVsyXSk7XG5cdC8vIFx0fVxuXHQvLyBcdGVsc2UgaWYgKGFycmF5WzFdID09PSAnaCcpXG5cdC8vIFx0e1xuXHQvLyBcdFx0bnVtYmVyQ29vcmRYID0gbGFzdENvb3JkWCArIHRoaXMuZ2V0Q29vcmQoYXJyYXlbMl0pO1xuXHQvLyBcdFx0bnVtYmVyQ29vcmRZID0gbGFzdENvb3JkWTtcblx0Ly8gXHR9XG5cdC8vIFx0ZWxzZVxuXHQvLyBcdHtcblx0Ly8gXHRcdGlmIChhcnJheVs0XSAhPT0gJycpXG5cdC8vIFx0XHR7XG5cdC8vIFx0XHRcdGNvb3JkU3RyaW5nID0gYXJyYXlbNF07XG5cdC8vIFx0XHR9XG5cdC8vIFx0XHRlbHNlIGlmIChhcnJheVszXSAhPT0gJycpXG5cdC8vIFx0XHR7XG5cdC8vIFx0XHRcdGNvb3JkU3RyaW5nID0gYXJyYXlbM107XG5cdC8vIFx0XHR9XG5cdC8vIFx0XHRlbHNlXG5cdC8vIFx0XHR7XG5cdC8vIFx0XHRcdGNvb3JkU3RyaW5nID0gYXJyYXlbMl07XG5cdC8vIFx0XHR9XG5cdC8vIFx0XHR2YXIgY29vcmRSZWcgPSAvKC0/XFxkK1xcLj9cXGQqKS9pZ207XG5cdC8vIFx0XHR2YXIgY29vcmRzID0gY29vcmRTdHJpbmcubWF0Y2goY29vcmRSZWcpO1xuXG5cdC8vIFx0XHRudW1iZXJDb29yZFggPSBsYXN0Q29vcmRYICsgdGhpcy5nZXRDb29yZChjb29yZHNbMF0pO1xuXHQvLyBcdFx0bnVtYmVyQ29vcmRZID0gbGFzdENvb3JkWSArIHRoaXMuZ2V0Q29vcmQoY29vcmRzWzFdKTtcblx0Ly8gXHR9XG5cdC8vIFx0Ly9jb25zb2xlLmxvZyhudW1iZXJDb29yZFgsIG51bWJlckNvb3JkWSk7XG5cdC8vIFx0cG9pbnRzLnB1c2goW251bWJlckNvb3JkWCwgbnVtYmVyQ29vcmRZXSk7XG5cblx0Ly8gXHRsYXN0Q29vcmRYID0gbnVtYmVyQ29vcmRYO1xuXHQvLyBcdGxhc3RDb29yZFkgPSBudW1iZXJDb29yZFk7XG5cdC8vIH1cblx0Ly8gY29uc29sZS5sb2cocG9pbnRzKTtcblx0Ly8gZGVidWdnZXI7XG5cblx0Ly8gdmFyIHRoaWNrbmVzcyA9IHRoaXMuZ2V0Q29vcmQoJHJhd1BhdGguZ2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnKSk7XG5cdC8vIHJldHVybiB7IHR5cGU6ICdwYXRoJywgcG9pbnRzOiBwb2ludHMsIHRoaWNrbmVzczogdGhpY2tuZXNzIH07XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnJvdW5kID0gZnVuY3Rpb24gKCRudW1iZXIpXG57XG5cdC8vIHZhciBudW1iZXIgPSBOdW1iZXIoJG51bWJlcik7XG5cdC8vIHJldHVybiBNYXRoLmZsb29yKG51bWJlciAqIDEwMCkgLyAxMDA7XG5cdHJldHVybiAkbnVtYmVyO1xuXHQvL3JldHVybiBNYXRoLmZsb29yKE51bWJlcigkbnVtYmVyKSk7XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLmdldENvb3JkID0gZnVuY3Rpb24gKCRjb29yZFNUUilcbntcblx0dmFyIG51bWJlciA9IHRoaXMucm91bmQoJGNvb3JkU1RSKTtcblx0cmV0dXJuIG51bWJlciAqIHRoaXMucmF0aW87XG59O1xuXG5TVkdQYXJzZXIucHJvdG90eXBlLnBhcnNlQ3VzdG9tSm9pbnRzID0gZnVuY3Rpb24gKCRyYXdHcm91cCwgJGdyb3VwKVxue1xuXHR2YXIgY2hpbGRyZW4gPSAkcmF3R3JvdXAuY2hpbGROb2RlczsvLyRyYXdHcm91cC5xdWVyeVNlbGVjdG9yQWxsKCdbaWQqPVwiY29uc3RyYWludFwiXScpO1xuXG5cdGZvciAodmFyIGkgPSAwLCBjaGlsZHJlbkxlbmd0aCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHRpZiAoY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFIHx8IGNoaWxkcmVuW2ldLmlkLnNlYXJjaCgvam9pbnQvaSkgPCAwKSB7IGNvbnRpbnVlOyB9XG5cblx0XHR2YXIgY3VyclJhd0pvaW50ID0gY2hpbGRyZW5baV07XG5cdFx0dmFyIHAxeCA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneDEnKSk7XG5cdFx0dmFyIHAxeSA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneTEnKSk7XG5cdFx0dmFyIHAyeCA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneDInKSk7XG5cdFx0dmFyIHAyeSA9IHRoaXMuZ2V0Q29vcmQoY3VyclJhd0pvaW50LmdldEF0dHJpYnV0ZSgneTInKSk7XG5cblx0XHR2YXIgbjEgPSAkZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocDF4LCBwMXkpIHx8ICRncm91cC5jcmVhdGVOb2RlKHAxeCwgcDF5KTtcblx0XHR2YXIgbjIgPSAkZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocDJ4LCBwMnkpIHx8ICRncm91cC5jcmVhdGVOb2RlKHAyeCwgcDJ5KTtcblx0XHQkZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkdQYXJzZXI7XG5cbiIsInZhciBTVkplbGx5Tm9kZSA9IHJlcXVpcmUoJy4vU1ZKZWxseU5vZGUnKTtcbnZhciBTVkplbGx5Sm9pbnQgPSByZXF1aXJlKCcuL1NWSmVsbHlKb2ludCcpO1xuXG52YXIgU1ZKZWxseUdyb3VwID0gZnVuY3Rpb24gKCR0eXBlLCAkY29uZiwgJElEKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyID0gdW5kZWZpbmVkO1xuXHR0aGlzLmRyYXdpbmcgPSB1bmRlZmluZWQ7XG5cdHRoaXMuc3RydWN0dXJlID0gdW5kZWZpbmVkO1xuXHR0aGlzLmNvbmYgPSAkY29uZjtcblx0dGhpcy5maXhlZCA9IHRoaXMuY29uZi5maXhlZDtcblx0dGhpcy50eXBlID0gJHR5cGU7XG5cdHRoaXMubm9kZXMgPSBbXTtcblx0dGhpcy5qb2ludHMgPSBbXTtcblx0dGhpcy5JRCA9ICRJRDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Tm9kZUF0UG9pbnQgPSBmdW5jdGlvbiAoJHgsICR5KVxue1xuXHRmb3IgKHZhciBpID0gMCwgbm9kZXNMZW5ndGggPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IG5vZGVzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XG5cblx0XHRpZiAobm9kZS5vWCA9PT0gJHggJiYgbm9kZS5vWSA9PT0gJHkpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIG5vZGU7XG5cdFx0fVxuXHR9XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZU5vZGUgPSBmdW5jdGlvbiAoJHB4LCAkcHksICRvcHRpb25zLCAkb3ZlcndyaXRlKVxue1xuXHR2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUF0UG9pbnQoJHB4LCAkcHkpO1xuXHRpZiAobm9kZSAhPT0gdW5kZWZpbmVkICYmICRvdmVyd3JpdGUpXG5cdHtcblx0XHRub2RlLnNldE9wdGlvbnMoJG9wdGlvbnMpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdG5vZGUgPSBuZXcgU1ZKZWxseU5vZGUoJHB4LCAkcHksICRvcHRpb25zKTtcblx0XHR0aGlzLm5vZGVzLnB1c2gobm9kZSk7XG5cdH1cblxuXHQvL3RoaXMucGh5c2ljc01hbmFnZXIuYWRkTm9kZVRvV29ybGQobm9kZSk7XG5cblx0cmV0dXJuIG5vZGU7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldENsb3Nlc3RQb2ludCA9IGZ1bmN0aW9uICgkcG9pbnRzLCAkbm9kZXMpXG57XG5cdHZhciBub2RlcyA9ICRub2RlcyB8fCB0aGlzLm5vZGVzO1xuXHR2YXIgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNsb3Nlc3RQb2ludDtcblx0dmFyIGNsb3Nlc3ROb2RlO1xuXHR2YXIgY2xvc2VzdE9mZnNldFg7XG5cdHZhciBjbG9zZXN0T2Zmc2V0WTtcblxuXHRmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkcG9pbnRzW2ldO1xuXHRcdGZvciAodmFyIGsgPSAwLCBub2Rlc0xlbmd0aCA9IG5vZGVzLmxlbmd0aDsgayA8IG5vZGVzTGVuZ3RoOyBrICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJOb2RlID0gbm9kZXNba107XG5cdFx0XHR2YXIgb2Zmc2V0WCA9IGN1cnJQb2ludFswXSAtIGN1cnJOb2RlLm9YO1xuXHRcdFx0dmFyIG9mZnNldFkgPSBjdXJyUG9pbnRbMV0gLSBjdXJyTm9kZS5vWTtcblx0XHRcdHZhciBjWCA9IE1hdGguYWJzKG9mZnNldFgpO1xuXHRcdFx0dmFyIGNZID0gTWF0aC5hYnMob2Zmc2V0WSk7XG5cdFx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChjWCAqIGNYICsgY1kgKiBjWSk7XG5cdFx0XHRpZiAoZGlzdCA8IGNsb3Nlc3REaXN0KVxuXHRcdFx0e1xuXHRcdFx0XHRjbG9zZXN0Tm9kZSA9IGN1cnJOb2RlO1xuXHRcdFx0XHRjbG9zZXN0UG9pbnQgPSBjdXJyUG9pbnQ7XG5cdFx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcblx0XHRcdFx0Y2xvc2VzdE9mZnNldFggPSBvZmZzZXRYO1xuXHRcdFx0XHRjbG9zZXN0T2Zmc2V0WSA9IG9mZnNldFk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGNsb3Nlc3RQb2ludDtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuZ2V0Q2xvc2VzdE5vZGUgPSBmdW5jdGlvbiAoJGNvb3JkLCAkbm9kZXMpXG57XG5cdHZhciBub2RlcyA9ICRub2RlcyB8fCB0aGlzLm5vZGVzO1xuXHR2YXIgY2xvc2VzdERpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNsb3Nlc3Q7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBub2Rlcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBub2RlID0gbm9kZXNbaV07XG5cdFx0dmFyIG9mZnNldFggPSAkY29vcmRbMF0gLSBub2RlLm9YO1xuXHRcdHZhciBvZmZzZXRZID0gJGNvb3JkWzFdIC0gbm9kZS5vWTtcblx0XHR2YXIgY1ggPSBNYXRoLmFicyhvZmZzZXRYKTtcblx0XHR2YXIgY1kgPSBNYXRoLmFicyhvZmZzZXRZKTtcblx0XHR2YXIgZGlzdCA9IE1hdGguc3FydChjWCAqIGNYICsgY1kgKiBjWSk7XG5cdFx0aWYgKGRpc3QgPCBjbG9zZXN0RGlzdClcblx0XHR7XG5cdFx0XHRjbG9zZXN0ID0gbm9kZTtcblx0XHRcdGNsb3Nlc3REaXN0ID0gZGlzdDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGNsb3Nlc3Q7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldE5vZGVzSW5zaWRlID0gZnVuY3Rpb24gKCRwb2ludHMpXG57XG5cdHZhciBQb2x5Z29uID0gcmVxdWlyZSgnLi9Qb2x5Z29uJyk7XG5cdHZhciB0b1JldHVybiA9IFtdO1xuXHR2YXIgcG9seWdvbiA9IFBvbHlnb24uaW5pdCgkcG9pbnRzKTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMubm9kZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZXNbaV07XG5cdFx0aWYgKHBvbHlnb24uaXNJbnNpZGUoW25vZGUub1gsIG5vZGUub1ldKSlcblx0XHR7XG5cdFx0XHR0b1JldHVybi5wdXNoKG5vZGUpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdG9SZXR1cm47XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmdldEJvdW5kaW5nQm94ID0gZnVuY3Rpb24gKClcbntcblx0dmFyIG1pblg7XG5cdHZhciBtYXhYO1xuXHR2YXIgbWluWTtcblx0dmFyIG1heFk7XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLm5vZGVzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGVzW2ldO1xuXHRcdG1pblggPSBtaW5YID4gbm9kZS5vWCB8fCBtaW5YID09PSB1bmRlZmluZWQgPyBub2RlLm9YIDogbWluWDtcblx0XHRtYXhYID0gbWF4WCA8IG5vZGUub1ggfHwgbWF4WCA9PT0gdW5kZWZpbmVkID8gbm9kZS5vWCA6IG1heFg7XG5cdFx0bWluWSA9IG1pblkgPiBub2RlLm9ZIHx8IG1pblkgPT09IHVuZGVmaW5lZCA/IG5vZGUub1kgOiBtaW5ZO1xuXHRcdG1heFkgPSBtYXhZIDwgbm9kZS5vWSB8fCBtYXhZID09PSB1bmRlZmluZWQgPyBub2RlLm9ZIDogbWF4WTtcblx0fVxuXHRyZXR1cm4gW1ttaW5YLCBtaW5ZXSwgW21heFgsIG1heFldXTtcbn07XG5cbi8vVE9ETyA6IHRvIHJlbW92ZVxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5oaXRUZXN0ID0gZnVuY3Rpb24gKCRwb2ludClcbntcblx0dmFyIGN1cnJYID0gJHBvaW50WzBdO1xuXHR2YXIgY3VyclkgPSAkcG9pbnRbMV07XG5cdHZhciBib3VuZGluZyA9IHRoaXMuZ2V0Qm91bmRpbmdCb3goKTtcblx0aWYgKGN1cnJYID49IGJvdW5kaW5nWzBdWzBdICYmIGN1cnJYIDw9IGJvdW5kaW5nWzFdWzBdICYmXG5cdFx0Y3VyclkgPj0gYm91bmRpbmdbMF1bMV0gJiYgY3VyclkgPD0gYm91bmRpbmdbMV1bMV0pXG5cdHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZUpvaW50ID0gZnVuY3Rpb24gKCRub2RlMSwgJG5vZGUyKVxue1xuXHRmb3IgKHZhciBpID0gMCwgam9pbnRzTGVuZ3RoID0gdGhpcy5qb2ludHMubGVuZ3RoOyBpIDwgam9pbnRzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyckpvaW50ID0gdGhpcy5qb2ludHNbaV07XG5cdFx0aWYgKChjdXJySm9pbnQubm9kZTEgPT09ICRub2RlMSAmJiBjdXJySm9pbnQubm9kZTIgPT09ICRub2RlMikgfHwgKGN1cnJKb2ludC5ub2RlMiA9PT0gJG5vZGUxICYmIGN1cnJKb2ludC5ub2RlMSA9PT0gJG5vZGUyKSlcblx0XHR7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cblx0dmFyIGpvaW50ID0gbmV3IFNWSmVsbHlKb2ludCgkbm9kZTEsICRub2RlMik7XG5cblx0dGhpcy5qb2ludHMucHVzaChqb2ludCk7XG5cblx0Ly90aGlzLnBoeXNpY3NNYW5hZ2VyLmFkZEpvaW50VG9Xb3JsZChqb2ludCk7XG59O1xuXG5TVkplbGx5R3JvdXAucHJvdG90eXBlLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyA9IGZ1bmN0aW9uICgkY29vcmRzQXJyYXkpXG57XG5cdHZhciBjb29yZHNBcnJheUxlbmd0aCA9ICRjb29yZHNBcnJheS5sZW5ndGg7XG5cdHZhciB0b1JldHVybiA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGNvb3Jkc0FycmF5TGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclBvaW50ID0gJGNvb3Jkc0FycmF5W2ldO1xuXHRcdHRvUmV0dXJuLnB1c2godGhpcy5jcmVhdGVOb2RlKGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdLCB1bmRlZmluZWQsIGZhbHNlKSk7XG5cdH1cblx0cmV0dXJuIHRvUmV0dXJuO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5nZXRCZXN0TWF0Y2hGb3JHcm91cENvbnN0cmFpbnQgPSBmdW5jdGlvbiAoJHBvaW50cywgJGFuY2hvcilcbntcblx0cmV0dXJuIHRoaXMucGh5c2ljc01hbmFnZXIuZ2V0QmVzdE1hdGNoRm9yR3JvdXBDb25zdHJhaW50KCRwb2ludHMsICRhbmNob3IpO1xufTtcblxuU1ZKZWxseUdyb3VwLnByb3RvdHlwZS5jcmVhdGVKb2ludHNGcm9tUG9pbnRzID0gZnVuY3Rpb24gKCRjb29yZHNBcnJheSwgJG5vQ2xvc2UpXG57XG5cdHZhciBjb29yZHNBcnJheUxlbmd0aCA9ICRjb29yZHNBcnJheS5sZW5ndGg7XG5cdGZvciAodmFyIGkgPSAxOyBpIDwgY29vcmRzQXJyYXlMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyUG9pbnQgPSAkY29vcmRzQXJyYXlbaV07XG5cdFx0dmFyIGxhc3RQb2ludCA9ICRjb29yZHNBcnJheVtpIC0gMV07XG5cdFx0dmFyIGxhc3ROb2RlID0gdGhpcy5nZXROb2RlQXRQb2ludChsYXN0UG9pbnRbMF0sIGxhc3RQb2ludFsxXSk7XG5cdFx0dmFyIGN1cnJOb2RlID0gdGhpcy5nZXROb2RlQXRQb2ludChjdXJyUG9pbnRbMF0sIGN1cnJQb2ludFsxXSk7XG5cdFx0dGhpcy5jcmVhdGVKb2ludChsYXN0Tm9kZSwgY3Vyck5vZGUpO1xuXHRcdGlmIChpID09PSBjb29yZHNBcnJheUxlbmd0aCAtIDEgJiYgJG5vQ2xvc2UgIT09IHRydWUpXG5cdFx0e1xuXHRcdFx0dmFyIGZpcnN0Tm9kZSA9IHRoaXMuZ2V0Tm9kZUF0UG9pbnQoJGNvb3Jkc0FycmF5WzBdWzBdLCAkY29vcmRzQXJyYXlbMF1bMV0pO1xuXHRcdFx0dGhpcy5jcmVhdGVKb2ludChjdXJyTm9kZSwgZmlyc3ROb2RlKTtcblx0XHR9XG5cdH1cbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuYWRkTm9kZXNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0dGhpcy5waHlzaWNzTWFuYWdlci5hZGROb2Rlc1RvV29ybGQoKTtcbn07XG5cblNWSmVsbHlHcm91cC5wcm90b3R5cGUuYWRkSm9pbnRzVG9Xb3JsZCA9IGZ1bmN0aW9uICgpXG57XG5cdHRoaXMucGh5c2ljc01hbmFnZXIuYWRkSm9pbnRzVG9Xb3JsZCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTVkplbGx5R3JvdXA7XG5cbiIsInZhciBTVkplbGx5Sm9pbnQgPSBmdW5jdGlvbiAoJG5vZGUxLCAkbm9kZTIpXG57XG5cdHRoaXMubm9kZTEgPSAkbm9kZTE7XG5cdHRoaXMubm9kZTIgPSAkbm9kZTI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWSmVsbHlKb2ludDtcblxuIiwidmFyIFNWSmVsbHlOb2RlID0gZnVuY3Rpb24gKCRvWCwgJG9ZLCAkb3B0aW9ucylcbntcblx0dGhpcy5qb2ludHNBcnJheSA9IFtdO1xuXHR0aGlzLm9YID0gJG9YO1xuXHR0aGlzLm9ZID0gJG9ZO1xuXHR0aGlzLmRyYXdpbmcgPSB1bmRlZmluZWQ7XG5cdHRoaXMuZml4ZWQgPSBmYWxzZTtcblx0dGhpcy5pc1N0YXJ0ID0gZmFsc2U7XG5cdHRoaXMuZW5kTm9kZSA9IHVuZGVmaW5lZDtcblx0dGhpcy5zZXRPcHRpb25zKCRvcHRpb25zKTtcbn07XG5cbi8vcmFjY291cmNpXG5TVkplbGx5Tm9kZS5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uICgkb3B0aW9ucylcbntcblx0aWYgKCRvcHRpb25zKVxuXHR7XG5cdFx0Ly8gdmFyID0gJCA9PT0gdW5kZWZpbmVkID8ge30gOiAkb3B0aW9ucztcblx0XHRpZiAoJG9wdGlvbnMuZml4ZWQgIT09IHVuZGVmaW5lZCkgeyB0aGlzLmZpeGVkID0gJG9wdGlvbnMuZml4ZWQ7IH1cblx0fVxufTtcblxuU1ZKZWxseU5vZGUucHJvdG90eXBlLnNldEZpeGVkID0gZnVuY3Rpb24gKCRmaXhlZClcbntcblx0dGhpcy5maXhlZCA9ICRmaXhlZDtcblx0dGhpcy5waHlzaWNzTWFuYWdlci5zZXRGaXhlZCgkZml4ZWQpO1xufTtcblxuU1ZKZWxseU5vZGUucHJvdG90eXBlLmdldFggPSBmdW5jdGlvbiAoKVxue1xuXHRyZXR1cm4gdGhpcy5waHlzaWNzTWFuYWdlci5nZXRYKCk7XG59O1xuXG4vL3JhY2NvdXJjaVxuU1ZKZWxseU5vZGUucHJvdG90eXBlLmdldFkgPSBmdW5jdGlvbiAoKVxue1xuXHRyZXR1cm4gdGhpcy5waHlzaWNzTWFuYWdlci5nZXRZKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWSmVsbHlOb2RlO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0ZXh0ZW5kOiBmdW5jdGlvbiAoJHRvRXh0ZW5kLCAkZXh0ZW5zaW9uKVxuXHR7XG5cdFx0dmFyIHJlY3VyID0gZnVuY3Rpb24gKCRvYmplY3QsICRleHRlbmQpXG5cdFx0e1xuXHRcdFx0Zm9yICh2YXIgbmFtZSBpbiAkZXh0ZW5kKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAodHlwZW9mICRleHRlbmRbbmFtZV0gPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KCRleHRlbmRbbmFtZV0pICYmICRleHRlbmRbbmFtZV0gIT09IG51bGwpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoJG9iamVjdFtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7ICRvYmplY3RbbmFtZV0gPSB7fTsgfVxuXHRcdFx0XHRcdHJlY3VyKCRvYmplY3RbbmFtZV0sICRleHRlbmRbbmFtZV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCRvYmplY3RbbmFtZV0gPSAkZXh0ZW5kW25hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRyZWN1cigkdG9FeHRlbmQsICRleHRlbnNpb24pO1xuXG5cdFx0cmV0dXJuICR0b0V4dGVuZDtcblx0fVxufTtcblxuIiwidmFyIFNWSmVsbHlHcm91cCA9IHJlcXVpcmUoJy4vU1ZKZWxseUdyb3VwJyk7XG52YXIgU3RydWN0dXJlID0gcmVxdWlyZSgnLi9TdHJ1Y3R1cmUnKTtcblxudmFyIFNWSmVsbHlXb3JsZCA9IGZ1bmN0aW9uICgkcGh5c2ljc01hbmFnZXIsICRjb25mKVxue1xuXHR0aGlzLnBoeXNpY3NNYW5hZ2VyID0gJHBoeXNpY3NNYW5hZ2VyO1xuXHR0aGlzLmdyb3VwcyA9IFtdO1xuXHR0aGlzLmNvbmYgPSAkY29uZjtcblx0dGhpcy53b3JsZE5vZGVzID0gW107XG5cdHRoaXMuZ3JvdXBDb25zdHJhaW50cyA9IFtdO1xuXHR0aGlzLndvcmxkV2lkdGggPSB0aGlzLnBoeXNpY3NNYW5hZ2VyLndvcmxkV2lkdGggPSAkY29uZi53b3JsZFdpZHRoO1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5zZXRIZWlnaHQgPSBmdW5jdGlvbiAoJGhlaWdodClcbntcblx0dGhpcy53b3JsZEhlaWdodCA9IHRoaXMucGh5c2ljc01hbmFnZXIud29ybGRIZWlnaHQgPSAkaGVpZ2h0O1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5nZXRXaWR0aCA9IGZ1bmN0aW9uICgpXG57XG5cdHJldHVybiB0aGlzLndvcmxkV2lkdGg7XG59O1xuXG5TVkplbGx5V29ybGQucHJvdG90eXBlLmdldEdyb3VwQnlJRCA9IGZ1bmN0aW9uICgkSUQpXG57XG5cdGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLmdyb3Vwcy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyR3JvdXAgPSB0aGlzLmdyb3Vwc1tpXTtcblx0XHRpZiAoY3Vyckdyb3VwLklEID09PSAkSUQpIHsgcmV0dXJuIGN1cnJHcm91cDsgfVxuXHR9XG59O1xuXG5TVkplbGx5V29ybGQucHJvdG90eXBlLmNyZWF0ZUdyb3VwID0gZnVuY3Rpb24gKCR0eXBlLCAkSUQpXG57XG5cdHZhciBjb25mID0gdGhpcy5jb25mLmdyb3Vwc1skdHlwZV0gfHwgdGhpcy5jb25mLmdyb3Vwcy5kZWZhdWx0O1xuXHR2YXIgZ3JvdXAgPSBuZXcgU1ZKZWxseUdyb3VwKCR0eXBlLCBjb25mLCAkSUQpO1xuXHRncm91cC5waHlzaWNzTWFuYWdlciA9IHRoaXMucGh5c2ljc01hbmFnZXIuZ2V0R3JvdXBQaHlzaWNzTWFuYWdlcihncm91cCk7XG5cdGdyb3VwLnN0cnVjdHVyZSA9IG5ldyBTdHJ1Y3R1cmUoZ3JvdXAsIHRoaXMpO1xuXHR0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcblx0cmV0dXJuIGdyb3VwO1xufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5jb25zdHJhaW5Hcm91cHMgPSBmdW5jdGlvbiAoJGdyb3VwQSwgJGdyb3VwQiwgJHBvaW50cylcbntcblx0dmFyIHBvaW50cyA9ICRwb2ludHM7XG5cdHZhciBncm91cEEgPSAkZ3JvdXBBO1xuXHR2YXIgZ3JvdXBCID0gJGdyb3VwQjtcblxuXHRpZiAocG9pbnRzLmxlbmd0aCA8IDMpXG5cdHtcblx0XHR2YXIgYW5jaG9yQSA9IGdyb3VwQS5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JGcm9tTGluZShwb2ludHMpO1xuXHRcdHBvaW50cy5zcGxpY2UocG9pbnRzLmluZGV4T2YoYW5jaG9yQS5wb2ludCksIDEpO1xuXHRcdHZhciBhbmNob3JCID0gZ3JvdXBCID8gZ3JvdXBCLnBoeXNpY3NNYW5hZ2VyLmNyZWF0ZUFuY2hvckZyb21Qb2ludChwb2ludHNbMF0pIDogdGhpcy5waHlzaWNzTWFuYWdlci5jcmVhdGVHaG9zdEFuY2hvckZyb21Qb2ludChwb2ludHNbMF0pO1xuXHRcdHRoaXMuZ3JvdXBDb25zdHJhaW50cy5wdXNoKHsgYW5jaG9yQTogYW5jaG9yQSwgYW5jaG9yQjogYW5jaG9yQiB9KTtcblx0fVxuXHRlbHNlXG5cdHtcblx0XHR2YXIgYW5jaG9yc0EgPSBncm91cEEucGh5c2ljc01hbmFnZXIuY3JlYXRlQW5jaG9ycyhwb2ludHMpO1xuXHRcdC8vY29uc29sZS5sb2coJ0EnLCBncm91cEEuSUQsIGFuY2hvcnNBLmxlbmd0aCwgJ0InLCBncm91cEIgPyBncm91cEIuSUQgOiBncm91cEIpO1xuXHRcdGZvciAodmFyIGkgPSAwLCBub2Rlc0xlbmd0aCA9IGFuY2hvcnNBLmxlbmd0aDsgaSA8IG5vZGVzTGVuZ3RoOyBpICs9IDEpXG5cdFx0e1xuXHRcdFx0dmFyIGN1cnJBbmNob3JBID0gYW5jaG9yc0FbaV07XG5cdFx0XHRpZiAoIWdyb3VwQilcblx0XHRcdHtcblx0XHRcdFx0Y3VyckFuY2hvckEuc2V0Rml4ZWQodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBhbmNob3JzQiA9IGdyb3VwQi5waHlzaWNzTWFuYWdlci5jcmVhdGVBbmNob3JzKHBvaW50cyk7XG5cdFx0XHRcdGZvciAodmFyIGsgPSAwLCBhbmNob3JzQkxlbmd0aCA9IGFuY2hvcnNCLmxlbmd0aDsgayA8IGFuY2hvcnNCTGVuZ3RoOyBrICs9IDEpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgY3VyckFuY2hvckIgPSBhbmNob3JzQltrXTtcblx0XHRcdFx0XHR0aGlzLmdyb3VwQ29uc3RyYWludHMucHVzaCh7IGFuY2hvckE6IGN1cnJBbmNob3JBLCBhbmNob3JCOiBjdXJyQW5jaG9yQiB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuU1ZKZWxseVdvcmxkLnByb3RvdHlwZS5hZGRHcm91cHNUb1dvcmxkID0gZnVuY3Rpb24gKClcbntcblx0Zm9yICh2YXIgaSA9IDAsIGdyb3Vwc0xlbmd0aCA9IHRoaXMuZ3JvdXBzLmxlbmd0aDsgaSA8IGdyb3Vwc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJHcm91cCA9IHRoaXMuZ3JvdXBzW2ldO1xuXHRcdGN1cnJHcm91cC5hZGROb2Rlc1RvV29ybGQoKTtcblx0XHRjdXJyR3JvdXAuYWRkSm9pbnRzVG9Xb3JsZCgpO1xuXHRcdHRoaXMud29ybGROb2RlcyA9IHRoaXMud29ybGROb2Rlcy5jb25jYXQoY3Vyckdyb3VwLm5vZGVzKTtcblx0fVxuXG5cdHZhciB0b0NvbnN0cmFpbkxlbmd0aCA9IHRoaXMuZ3JvdXBDb25zdHJhaW50cy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCB0b0NvbnN0cmFpbkxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUb0NvbnN0cmFpbiA9IHRoaXMuZ3JvdXBDb25zdHJhaW50c1tpXTtcblx0XHR0aGlzLnBoeXNpY3NNYW5hZ2VyLmNvbnN0cmFpbkdyb3VwcyhjdXJyVG9Db25zdHJhaW4uYW5jaG9yQSwgY3VyclRvQ29uc3RyYWluLmFuY2hvckIpO1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNWSmVsbHlXb3JsZDtcblxuIiwidmFyIFRyaWFuZ3VsYXRvciA9IHJlcXVpcmUoJy4vVHJpYW5ndWxhdG9yJyk7XG52YXIgUG9seWdvbiA9IHJlcXVpcmUoJy4vUG9seWdvbicpO1xudmFyIEdyaWQgPSByZXF1aXJlKCcuL0dyaWQnKTtcblxudmFyIFN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkZ3JvdXAsICR3b3JsZClcbntcblx0dGhpcy53b3JsZCA9ICR3b3JsZDtcblx0dGhpcy5ncm91cCA9ICRncm91cDtcblx0dGhpcy5pbm5lclN0cnVjdHVyZSA9IHVuZGVmaW5lZDtcbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKCRwcm9wZXJ0aWVzKVxue1xuXHR2YXIgbm9kZXNUb0RyYXc7XG5cdHZhciBwb2ludHMgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9ICRwcm9wZXJ0aWVzLnBvaW50SW5mb3MubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyciA9ICRwcm9wZXJ0aWVzLnBvaW50SW5mb3NbaV07XG5cdFx0cG9pbnRzLnB1c2goY3Vyci5wb2ludCk7XG5cdH1cblxuXHR0aGlzLmFyZWEgPSB0aGlzLmNhbGN1bGF0ZUFyZWEocG9pbnRzLCAkcHJvcGVydGllcyk7XG5cdHRoaXMucmFkaXVzWCA9ICRwcm9wZXJ0aWVzLnJhZGl1c1g7XG5cdHRoaXMucmFkaXVzWSA9ICRwcm9wZXJ0aWVzLnJhZGl1c1k7XG5cblx0c3dpdGNoICh0aGlzLmdyb3VwLmNvbmYuc3RydWN0dXJlKVxuXHR7XG5cdFx0Y2FzZSAndHJpYW5ndWxhdGUnOlxuXHRcdFx0bm9kZXNUb0RyYXcgPSB0aGlzLmdyb3VwLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyhwb2ludHMpO1xuXHRcdFx0dGhpcy5jcmVhdGVKb2ludHNGcm9tVHJpYW5nbGVzKHBvaW50cyk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlICdsaW5lJzpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5ncm91cC5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMocG9pbnRzKTtcblx0XHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnRzRnJvbVBvaW50cyhwb2ludHMsIHRydWUpO1xuXHRcdFx0Ly9ub2Rlc1RvRHJhd1swXS5maXhlZCA9IHRydWU7Ly90byByZW1vdmUgbGF0ZXIgbWF5YmUgP1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAncHJlY2lzZUhleGFGaWxsJzpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5jcmVhdGVQcmVjaXNlSGV4YUZpbGxTdHJ1Y3R1cmUocG9pbnRzKTtcblx0XHRcdC8vIHN0cnVjdHVyZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKCRlbGVtZW50KSB7ICRlbGVtZW50LmRyYXdpbmcgPSB7IG5vdFRvRHJhdzogdHJ1ZSB9OyB9KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgJ2hleGFGaWxsJzpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5jcmVhdGVIZXhhRmlsbFN0cnVjdHVyZShwb2ludHMpO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdG5vZGVzVG9EcmF3ID0gdGhpcy5ncm91cC5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMocG9pbnRzKTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0cmV0dXJuIG5vZGVzVG9EcmF3O1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jYWxjdWxhdGVBcmVhID0gZnVuY3Rpb24gKCRwb2ludHMsICRwcm9wZXJ0aWVzKVxue1xuXHRpZiAoJHByb3BlcnRpZXMudHlwZSA9PT0gJ2VsbGlwc2UnKVxuXHR7XG5cdFx0cmV0dXJuIE1hdGgucG93KE1hdGguUEkgKiAkcHJvcGVydGllcy5yYWRpdXNYLCAyKTtcblx0fVxuXHRpZiAodGhpcy5ncm91cC5jb25mLnN0cnVjdHVyZSAhPT0gJ2xpbmUnKVxuXHR7XG5cdFx0dmFyIHBvbHlnb24gPSBQb2x5Z29uLmluaXQoJHBvaW50cyk7XG5cdFx0cmV0dXJuIHBvbHlnb24uZ2V0QXJlYSgpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHZhciBhcmVhID0gMDtcblx0XHRmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gJHBvaW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkgKz0gMSlcblx0XHR7XG5cdFx0XHR2YXIgY3VyclBvaW50ID0gJHBvaW50c1tpXTtcblx0XHRcdHZhciBsYXN0UG9pbnQgPSAkcG9pbnRzW2kgLSAxXTtcblx0XHRcdHZhciBkWCA9IE1hdGguYWJzKGN1cnJQb2ludFswXSAtIGxhc3RQb2ludFswXSk7XG5cdFx0XHR2YXIgZFkgPSBNYXRoLmFicyhjdXJyUG9pbnRbMV0gLSBsYXN0UG9pbnRbMV0pO1xuXHRcdFx0YXJlYSArPSBNYXRoLnNxcnQoZFggKiBkWCArIGRZICogZFkpO1xuXHRcdH1cblx0XHRyZXR1cm4gYXJlYTtcblx0fVxufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVIZXhhRmlsbFN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkY29vcmRzQXJyYXkpXG57XG5cdHRoaXMuY3JlYXRlSW5uZXJTdHJ1Y3R1cmUoJGNvb3Jkc0FycmF5KTtcblx0dmFyIHBhdGggPSB0aGlzLmlubmVyU3RydWN0dXJlLmdldFNoYXBlUGF0aCgpO1xuXHR2YXIgbm9kZXNUb0RyYXcgPSBbXTtcblx0Zm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHBhdGgubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHRub2Rlc1RvRHJhdy5wdXNoKHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQocGF0aFtpXVswXSwgcGF0aFtpXVsxXSkpO1xuXHR9XG5cdHJldHVybiBub2Rlc1RvRHJhdztcbn07XG5cblN0cnVjdHVyZS5wcm90b3R5cGUuY3JlYXRlUHJlY2lzZUhleGFGaWxsU3RydWN0dXJlID0gZnVuY3Rpb24gKCRjb29yZHNBcnJheSlcbntcblx0dmFyIG5vZGVzVG9EcmF3ID0gdGhpcy5ncm91cC5jcmVhdGVOb2Rlc0Zyb21Qb2ludHMoJGNvb3Jkc0FycmF5KTtcblx0dGhpcy5jcmVhdGVJbm5lclN0cnVjdHVyZSgkY29vcmRzQXJyYXkpO1xuXG5cdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnRzRnJvbVBvaW50cygkY29vcmRzQXJyYXksIGZhbHNlKTtcblx0dmFyIGkgPSAwO1xuXHR2YXIgbGVuZ3RoID0gJGNvb3Jkc0FycmF5Lmxlbmd0aDtcblx0Zm9yIChpOyBpIDwgbGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgY3VyclBvaW50ID0gJGNvb3Jkc0FycmF5W2ldO1xuXHRcdHZhciBjbG9zZXN0ID0gdGhpcy5pbm5lclN0cnVjdHVyZS5nZXRDbG9zZXN0KGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdLCAyKTtcblx0XHRmb3IgKHZhciBrID0gMCwgY2xvc2VzdExlbmd0aCA9IGNsb3Nlc3QubGVuZ3RoOyBrIDwgY2xvc2VzdExlbmd0aDsgayArPSAxKVxuXHRcdHtcblx0XHRcdHZhciBjdXJyQ2xvc2VzdCA9IGNsb3Nlc3Rba107XG5cdFx0XHR2YXIgbjEgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJQb2ludFswXSwgY3VyclBvaW50WzFdKTtcblx0XHRcdHZhciBuMiA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyckNsb3Nlc3RbMF0sIGN1cnJDbG9zZXN0WzFdKTtcblx0XHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG5vZGVzVG9EcmF3O1xufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVKb2ludHNGcm9tVHJpYW5nbGVzID0gZnVuY3Rpb24gKCRjb29yZHNBcnJheSlcbntcblx0dmFyIHRyaWFuZ3VsYXRvciA9IG5ldyBUcmlhbmd1bGF0b3IoKTtcblx0dmFyIHRyaWFuZ2xlcyA9IHRyaWFuZ3VsYXRvci50cmlhbmd1bGF0ZSgkY29vcmRzQXJyYXkpO1xuXG5cdHZhciB0cmlhbmdsZXNMZW5ndGggPSB0cmlhbmdsZXMubGVuZ3RoO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRyaWFuZ2xlc0xlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJUcmlhbmdsZSA9IHRyaWFuZ2xlc1tpXTtcblx0XHR2YXIgbjAgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJUcmlhbmdsZVswXS54LCBjdXJyVHJpYW5nbGVbMF0ueSk7XG5cdFx0dmFyIG4xID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyVHJpYW5nbGVbMV0ueCwgY3VyclRyaWFuZ2xlWzFdLnkpO1xuXHRcdHZhciBuMiA9IHRoaXMuZ3JvdXAuZ2V0Tm9kZUF0UG9pbnQoY3VyclRyaWFuZ2xlWzJdLngsIGN1cnJUcmlhbmdsZVsyXS55KTtcblx0XHR0aGlzLmdyb3VwLmNyZWF0ZUpvaW50KG4wLCBuMSk7XG5cdFx0dGhpcy5ncm91cC5jcmVhdGVKb2ludChuMSwgbjIpO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjIsIG4wKTtcblx0fVxufTtcblxuU3RydWN0dXJlLnByb3RvdHlwZS5jcmVhdGVJbm5lclN0cnVjdHVyZSA9IGZ1bmN0aW9uICgkY29vcmRzQXJyYXkpXG57XG5cdHZhciBwb2x5Z29uID0gUG9seWdvbi5pbml0KCRjb29yZHNBcnJheSk7XG5cdHZhciBkaWFtID0gdGhpcy53b3JsZC5nZXRXaWR0aCgpICogdGhpcy5ncm91cC5jb25mLmlubmVyU3RydWN0dXJlRGVmOy8vd2lkdGggLyAxMDsvL3RoaXMud29ybGQuZ2V0V2lkdGgoKSAvIDMwO1xuXHR0aGlzLmlubmVyUmFkaXVzID0gZGlhbSAvIDI7XG5cdHRoaXMuaW5uZXJTdHJ1Y3R1cmUgPSBHcmlkLmNyZWF0ZUZyb21Qb2x5Z29uKHBvbHlnb24sIGRpYW0sIHRydWUpO1xuXHR2YXIgc3RydWN0dXJlTm9kZXMgPSB0aGlzLmdyb3VwLmNyZWF0ZU5vZGVzRnJvbVBvaW50cyh0aGlzLmlubmVyU3RydWN0dXJlLmdldE5vZGVzQXJyYXkoKSk7XG5cblx0dmFyIG5ldHdvcmsgPSB0aGlzLmlubmVyU3RydWN0dXJlLmdldE5ldHdvcmsoKTtcblx0dmFyIGkgPSAwO1xuXHR2YXIgbGVuZ3RoID0gbmV0d29yay5sZW5ndGg7XG5cdGZvciAoaTsgaSA8IGxlbmd0aDsgaSArPSAxKVxuXHR7XG5cdFx0dmFyIGN1cnJMaW5rID0gbmV0d29ya1tpXTtcblx0XHR2YXIgbjEgPSB0aGlzLmdyb3VwLmdldE5vZGVBdFBvaW50KGN1cnJMaW5rWzBdWzBdLCBjdXJyTGlua1swXVsxXSk7XG5cdFx0dmFyIG4yID0gdGhpcy5ncm91cC5nZXROb2RlQXRQb2ludChjdXJyTGlua1sxXVswXSwgY3VyckxpbmtbMV1bMV0pO1xuXHRcdHRoaXMuZ3JvdXAuY3JlYXRlSm9pbnQobjEsIG4yKTtcblx0fVxuXHRyZXR1cm4gc3RydWN0dXJlTm9kZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cnVjdHVyZTtcblxuIiwidmFyIHBvbHkydHJpID0gcmVxdWlyZSgnLi4vLi4vbGlicy9wb2x5MnRyaS9kaXN0L3BvbHkydHJpJyk7XG5cbnZhciBUcmlhbmd1bGF0b3IgPSBmdW5jdGlvbiAoKVxue1xufTtcblxuVHJpYW5ndWxhdG9yLnByb3RvdHlwZS50cmlhbmd1bGF0ZSA9IGZ1bmN0aW9uICgkY29vcmRzKVxue1xuXHR2YXIgcG9seTJ0cmlDb250b3VyID0gW107XG5cdC8vZGVidWdnZXI7XG5cblx0Zm9yICh2YXIgaSA9IDAsIHBvaW50c0xlbmd0aCA9ICRjb29yZHMubGVuZ3RoOyBpIDwgcG9pbnRzTGVuZ3RoOyBpICs9IDEpXG5cdHtcblx0XHR2YXIgcG9pbnQgPSAkY29vcmRzW2ldO1xuXHRcdHBvbHkydHJpQ29udG91ci5wdXNoKG5ldyBwb2x5MnRyaS5Qb2ludChwb2ludFswXSwgcG9pbnRbMV0pKTtcblx0fVxuXG5cdHZhciBzd2N0eDtcblx0dHJ5XG5cdHtcblx0XHQvLyBwcmVwYXJlIFN3ZWVwQ29udGV4dFxuXHRcdHN3Y3R4ID0gbmV3IHBvbHkydHJpLlN3ZWVwQ29udGV4dChwb2x5MnRyaUNvbnRvdXIsIHsgY2xvbmVBcnJheXM6IHRydWUgfSk7XG5cblx0XHQvLyB0cmlhbmd1bGF0ZVxuXHRcdHN3Y3R4LnRyaWFuZ3VsYXRlKCk7XG5cdH1cblx0Y2F0Y2ggKGUpXG5cdHtcblx0XHR0aHJvdyBlO1xuXHRcdC8vIGNvbnNvbGUubG9nKGUpO1xuXHRcdC8vIGNvbnNvbGUubG9nKGUucG9pbnRzKTtcblx0fVxuXHR2YXIgdHJpYW5nbGVzID0gc3djdHguZ2V0VHJpYW5nbGVzKCk7XG5cblx0dmFyIHBvaW50c0FycmF5ID0gW107XG5cblx0dmFyIHRyaWFuZ2xlc0xlbmd0aCA9IHRyaWFuZ2xlcy5sZW5ndGg7XG5cdGZvciAoaSA9IDA7IGkgPCB0cmlhbmdsZXNMZW5ndGg7IGkgKz0gMSlcblx0e1xuXHRcdHZhciBjdXJyVHJpYW5nbGUgPSB0cmlhbmdsZXNbaV07XG5cdFx0Lypqc2hpbnQgY2FtZWxjYXNlOmZhbHNlKi9cblx0XHQvL2pzY3M6ZGlzYWJsZSBkaXNhbGxvd0RhbmdsaW5nVW5kZXJzY29yZXNcblx0XHRwb2ludHNBcnJheS5wdXNoKGN1cnJUcmlhbmdsZS5wb2ludHNfKTtcblx0XHQvL2pzY3M6ZW5hYmxlIGRpc2FsbG93RGFuZ2xpbmdVbmRlcnNjb3Jlc1xuXHRcdC8qanNoaW50IGNhbWVsY2FzZTp0cnVlKi9cblx0fVxuXG5cdHJldHVybiBwb2ludHNBcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJpYW5ndWxhdG9yO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9XG57XG5cdENvbmZPYmplY3Q6IHJlcXVpcmUoJy4vY29yZS9Db25mT2JqZWN0JyksXG5cdEdyaWQ6IHJlcXVpcmUoJy4vY29yZS9HcmlkJyksXG5cdFBvbHlnb246IHJlcXVpcmUoJy4vY29yZS9Qb2x5Z29uJyksXG5cdFN0cnVjdHVyZTogcmVxdWlyZSgnLi9jb3JlL1N0cnVjdHVyZScpLFxuXHRTVkdQYXJzZXI6IHJlcXVpcmUoJy4vY29yZS9TVkdQYXJzZXInKSxcblx0U1ZKZWxseUdyb3VwOiByZXF1aXJlKCcuL2NvcmUvU1ZKZWxseUdyb3VwJyksXG5cdFNWSmVsbHlKb2ludDogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlKb2ludCcpLFxuXHRTVkplbGx5Tm9kZTogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlOb2RlJyksXG5cdFNWSmVsbHlVdGlsczogcmVxdWlyZSgnLi9jb3JlL1NWSmVsbHlVdGlscycpLFxuXHRTVkplbGx5V29ybGQ6IHJlcXVpcmUoJy4vY29yZS9TVkplbGx5V29ybGQnKSxcblx0VHJpYW5ndWxhdG9yOiByZXF1aXJlKCcuL2NvcmUvVHJpYW5ndWxhdG9yJyksXG5cdE5vZGVHcmFwaDogcmVxdWlyZSgnLi9jb3JlL05vZGVHcmFwaCcpLFxufTtcblxuIl19
