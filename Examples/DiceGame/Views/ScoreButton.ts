import {
   Text,
   windowCFG,
   ctx,
   ElementDescriptor,
   Location,
   Path2D,
   View
} from '../deps.ts'

import { eventBus } from '../main.ts'

import { SCORE_CFG, PossibleColor } from '../cfg.ts'

import { buildRightScore, buildLeftScore } from '../ViewModels/pathFactory.ts'

/** A virtual ScoreButton view class */
export default class ScoreButton implements View {

   id = 0 // assigned by activeViews.add()   
   zOrder = 0   
   tabOrder = 0
   name: string
   index: number
   activeView = true
   enabled = true
   hovered = false
   focused = false
   path: Path2D = new Path2D()
   size: { height: number, width: number }
   location: Location
   text: string
   color = 'black'
   isLeftHanded: boolean
   scoreText = ''
   available = false
   tooltip = ""

   upperText = ""
   lowerText = ""
   upperName: Text.default | null = null;
   lowerName: Text.default | null = null;
   scoreBox: Text.default | null = null;

   /** Creates an instance of a virtual ScoreButton. */
   constructor(el: ElementDescriptor) {

      this.index = el.idx
      this.tabOrder = el.tabOrder  || 0
      this.name = el.id
      this.text = el.text || ''
      this.tooltip = `${this.name} available`
      this.enabled = true
      this.hovered = false
      this.focused = false
      this.size = SCORE_CFG.size
      this.location = el.location
      this.upperText = this.text.split(' ')[0]
      this.lowerText = this.text.split(' ')[1] || ''
      this.isLeftHanded = (el.idx % 2 === 1) // isLeft = index is odd/even 
      this.buildPath()
      
      //================================================
      //                bind events
      //================================================

      eventBus.on('UpdateScoreElement', this.index.toString(),
         (data: {
            index: number,
            renderAll: boolean,
            fillColor: string,
            value: string,
            available: boolean
         }
         ) => {
               if (data.renderAll) {
                  this.color = data.fillColor
                  this.render()
               }
               this.available = data.available
               this.scoreText = data.value
               this.renderScore(data.value, data.available)
            
         })
   }

   
   
   
   /** build the correct (left/right) path and Txt locations */
   buildPath() {
      // deno-lint-ignore no-this-alias
      const s = this
      const { left, top } = s.location
      
      // rightside scores
      if (this.isLeftHanded) { // twos fours sixs
         s.path = buildRightScore(s.location, s.size)
        
         s.upperName = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-upperText', text: s.upperText, 
         location: { left: left + 40, top: top + 10 }, 
         size: { width: 55, height: 30 }, color: s.color, bind: false })
         
         s.lowerName = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-lowerText', text: s.lowerText, 
         location: { left: left + 40, top: top + 40 }, 
         size: { width: 55, height: 30 }, color: s.color, bind: false })
         
         s.scoreBox = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-score', text: '', 
         location: { left: left + 5 , top: top + 50 }, 
         size: { width: 24, height: 24 }, color: s.color, padding: 10, bind: false })
         
      } 
      // left side scores
      else { // ones threes fives
         s.path = buildLeftScore(s.location, s.size)
         
         s.upperName = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-upperText', text: s.upperText, 
         location: { left: left + 10, top: top + 10 }, 
         size: { width: 55, height: 30 }, color: s.color, bind: false })
         
         s.lowerName = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-lowerText', text: s.lowerText, 
         location: { left: left + 10, top: top + 40 }, 
         size: { width: 55, height: 30 }, color: s.color, bind: false })
         
         s.scoreBox = new Text.default({ kind: 'text', idx: -1, tabOrder: 0, id: s.name + '-score', text: '', 
         location: { left: left + 70 , top: top + 3 }, 
         size: { width: 24, height: 24 }, color: s.color, padding: 10, bind: false })
      }
   }

   /** called from Surface/canvasEvents when this element has been touched */
   touched() {
      eventBus.fire('ScoreButtonTouched', this.index.toString(), this.index)
   }

   /** 
    * updates and renders the virtual ScoreButton view 
    * Caution: called 60fps - keep it clean
   */
   update() {
      this.render()
      this.renderScore(this.scoreText, this.available)
   }

   /** render this vitual ScoreButtons shape (path) onto the canvas */
   render() {
      ctx.save()
      ctx.lineWidth = 5
      ctx.strokeStyle = (this.hovered === true) ? 'orange' : this.color
      ctx.stroke(this.path)
      ctx.restore()
      ctx.fillStyle = this.color
      ctx.fill(this.path)
      if (this.upperName) {
         this.upperName.fillColor = this.color
         this.upperName.fontColor = windowCFG.containerColor
         this.upperName.text = this.upperText
         this.upperName.update()
      }
      if (this.lowerName) {
         this.lowerName.fillColor = this.color
         this.lowerName.fontColor = windowCFG.containerColor
         this.lowerName.text = this.lowerText
         this.lowerName.update()
      }
   }

   /** renders the score value inside the vitual ScoreButton view */
   renderScore(scoretext: string, available: boolean) {
      let scoreColor = (available) ? PossibleColor : windowCFG.containerColor
      if (scoretext === '') {
         scoreColor = this.color
      }
      if (this.scoreBox !== null) {
         this.scoreBox.fontColor = scoreColor
         this.scoreBox.fillColor = this.color
         this.scoreBox.text = scoretext
         this.scoreBox.update()
      }
   }
}
