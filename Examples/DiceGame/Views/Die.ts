
import { ctx } from '../deps.ts'
import { eventBus } from '../main.ts'
import {
   //CanvasRenderingContext2D, 
   //createCanvas,
   ElementDescriptor,
   Location,
   View,
   Path2D,
   ImageData
} from '../deps.ts'

import type { } from '../deps.ts'

import { DieIndex } from '../diceGameTypes.ts'
import { DIE_CFG } from '../cfg.ts'
import { buildDieFaces } from '../ViewModels/dieFactory.ts'

let needToBuild = true

/** a class that creates instances of virtual Die    
 *  elements that are to be rendered to a canvas */
export default class Die implements View {

   id = 0 // assigned by activeViews.add()    
   index = 0
   activeView = true
   zOrder = 0
   tabOrder = 0
   name: string
   enabled = true
   hovered = false
   focused = false
   path: Path2D
   location: Location
   size: { height: number, width: number }
   left: number
   top: number
   width: number
   height: number
   color: string
   frozen = false
   value = 0
   static frozenFaces: ImageData[]
   static faces: ImageData[]

   /** ctor that instantiates a new vitual Die view  and faces*/
   constructor(el: ElementDescriptor) {
      // build die face images
      if (needToBuild) {
         const { faces, frozenFaces } = buildDieFaces()
         Die.faces = faces
         Die.frozenFaces = frozenFaces
         needToBuild = false
      }
      this.index = el.idx
      this.tabOrder = el.tabOrder || 0
      this.name = el.id
      this.enabled = true

      this.size = DIE_CFG.size
      this.width = this.size.width
      this.height = this.size.height

      this.location = el.location
      this.top = el.location.top
      this.left = el.location.left

      this.color = 'transparent'
      this.path = this.buildPath(DIE_CFG.radius)
      this.render()

      //================================================
      //                bind events
      //================================================

      eventBus.on('UpdateDie', this.index.toString(), (
         data: {
            index: number,
            value: number,
            frozen: boolean
         }) => {
         this.frozen = data.frozen
         this.value = data.value
         this.render()
      })
   }

   buildPath(radius: number) {
      const path = new Path2D
      path.roundRect(this.left, this.top, this.width, this.height, radius)
      return path
   }

   /** called from Surface/canvasEvents when this element has been touched */
   touched() {
      // inform Dice with index data
      eventBus.fire(`DieTouched`, "", ({ index: this.index as DieIndex }))
   }

   update() {
      this.render()
   }

   render() {
      ctx.save()
      const image: ImageData = (this.frozen)
         ? Die.frozenFaces[this.value]
         : Die.faces[this.value]

      ctx.putImageData(image, this.left, this.top)
      ctx.lineWidth = 2
      if (this.hovered) {
         ctx.strokeStyle = 'orange';
         ctx.lineWidth = 2
      } else {
         ctx.strokeStyle = 'silver'
         ctx.lineWidth = 2
      }
      ctx.stroke(this.path)
      ctx.restore()
   }
}

/** A set of Die face images */
Die.faces = [
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1)
]

/** A set of frozen Die face images */
Die.frozenFaces = [
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1),
   new ImageData(1, 1)
]
