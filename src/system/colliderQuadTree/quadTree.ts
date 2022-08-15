/**
 * quadtree-js
 * @version 1.2.5
 * @license MIT
 * @author Timo Hausmann
 */

/* https://github.com/timohausmann/quadtree-js.git v1.2.4 */

/*
Copyright © 2012-2021 Timo Hausmann
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

/**
 * The QuadTree uses rectangle objects for all areas ("Rect").
 * All rectangles require the properties x, y, width, height
 * @typedef {Object} Rect
 * @property {number} x         X-Position
 * @property {number} y         Y-Position
 * @property {number} width     Width
 * @property {number} height    Height
 */

/**
 * QuadTree Constructor
 * @class QuadTree
 * @param {Rect} bounds                 bounds of the node ({ x, y, width, height })
 * @param {number} [max_objects=10]     (optional) max objects a node can hold before splitting into 4 subnodes (default: 10)
 * @param {number} [max_levels=4]       (optional) total max levels inside root QuadTree (default: 4)
 * @param {number} [level=0]            (optional) depth level, required for subnodes (default: 0)
 */
export function QuadTree(
  this: any,
  {
    bounds,
    max_objects,
    max_levels,
    level,
  }: { bounds: Rect; max_objects?: number; max_levels?: number; level?: number },
) {
  this.max_objects = max_objects || 10
  this.max_levels = max_levels || 4

  this.level = level || 0
  this.bounds = bounds

  this.objects = []
  this.nodes = []
}

/**
 * Split the node into 4 subnodes
 * @memberof QuadTree
 */
QuadTree.prototype.split = function () {
  const nextLevel = this.level + 1
  const subWidth = this.bounds.width / 2
  const subHeight = this.bounds.height / 2
  const x = this.bounds.x
  const y = this.bounds.y

  //top right node
  this.nodes[0] = new (QuadTree as any)({
    bounds: {
      x: x + subWidth,
      y: y,
      width: subWidth,
      height: subHeight,
    },
    max_objects: this.max_objects,
    max_levels: this.max_levels,
    nextLevel,
  })

  //top left node
  this.nodes[1] = new (QuadTree as any)({
    bounds: {
      x: x,
      y: y,
      width: subWidth,
      height: subHeight,
    },
    max_objects: this.max_objects,
    max_levels: this.max_levels,
    nextLevel,
  })

  //bottom left node
  this.nodes[2] = new (QuadTree as any)({
    bounds: {
      x: x,
      y: y + subHeight,
      width: subWidth,
      height: subHeight,
    },
    max_objects: this.max_objects,
    max_levels: this.max_levels,
    nextLevel,
  })

  //bottom right node
  this.nodes[3] = new (QuadTree as any)({
    bounds: {
      x: x + subWidth,
      y: y + subHeight,
      width: subWidth,
      height: subHeight,
    },
    max_objects: this.max_objects,
    max_levels: this.max_levels,
    nextLevel,
  })
}

/**
 * Determine which node the object belongs to
 * @param {Rect} pRect      bounds of the area to be checked ({ x, y, width, height })
 * @return {number[]}       an array of indexes of the intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right / ne, nw, sw, se)
 * @memberof QuadTree
 */
QuadTree.prototype.getIndex = function (pRect: Rect) {
  const indexes = []
  const verticalMidpoint = this.bounds.x + this.bounds.width / 2
  const horizontalMidpoint = this.bounds.y + this.bounds.height / 2

  const startIsNorth = pRect.y < horizontalMidpoint
  const startIsWest = pRect.x < verticalMidpoint
  const endIsEast = pRect.x + pRect.width > verticalMidpoint
  const endIsSouth = pRect.y + pRect.height > horizontalMidpoint

  //top-right quad
  if (startIsNorth && endIsEast) {
    indexes.push(0)
  }

  //top-left quad
  if (startIsWest && startIsNorth) {
    indexes.push(1)
  }

  //bottom-left quad
  if (startIsWest && endIsSouth) {
    indexes.push(2)
  }

  //bottom-right quad
  if (endIsEast && endIsSouth) {
    indexes.push(3)
  }

  return indexes
}

/**
 * Insert the object into the node. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding subnodes.
 * @param {Rect} pRect      bounds of the object to be added ({ x, y, width, height })
 * @memberof QuadTree
 */
QuadTree.prototype.insert = function (pRect: Rect) {
  let i = 0
  let indexes

  //if we have subnodes, call insert on matching subnodes
  if (this.nodes.length) {
    indexes = this.getIndex(pRect)

    for (i = 0; i < indexes.length; i++) {
      this.nodes[indexes[i]].insert(pRect)
    }
    return
  }

  //otherwise, store object here
  this.objects.push(pRect)

  //max_objects reached
  if (this.objects.length > this.max_objects && this.level < this.max_levels) {
    //split if we don't already have subnodes
    if (!this.nodes.length) {
      this.split()
    }

    //add all objects to their corresponding subnode
    for (i = 0; i < this.objects.length; i++) {
      indexes = this.getIndex(this.objects[i])
      for (let k = 0; k < indexes.length; k++) {
        this.nodes[indexes[k]].insert(this.objects[i])
      }
    }

    //clean up this node
    this.objects = []
  }
}

/**
 * Return all objects that could collide with the given object
 * @param {Rect} pRect      bounds of the object to be checked ({ x, y, width, height })
 * @return {Rect[]}         array with all detected objects
 * @memberof QuadTree
 */
QuadTree.prototype.retrieve = function (pRect: Rect): Rect[] {
  const indexes = this.getIndex(pRect)
  let returnObjects = this.objects

  //if we have subnodes, retrieve their objects
  if (this.nodes.length) {
    for (let i = 0; i < indexes.length; i++) {
      returnObjects = returnObjects.concat(
        this.nodes[indexes[i]].retrieve(pRect),
      )
    }
  }

  //remove duplicates
  returnObjects = returnObjects.filter(function (item: any, index: any) {
    return returnObjects.indexOf(item) >= index
  })

  return returnObjects
}

/**
 * Clear the quadtree
 * @memberof QuadTree
 */
QuadTree.prototype.clear = function () {
  this.objects = []

  for (let i = 0; i < this.nodes.length; i++) {
    if (this.nodes.length) {
      this.nodes[i].clear()
    }
  }

  this.nodes = []
}

// //export for commonJS or browser
// if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
//   module.exports = QuadTree
// } else {
//   window.QuadTree = QuadTree
// }