
import { activeNodes  } from '../render/activeNodes.ts'
import { Host, ctx, dwmWindow, hasVisiblePopup } from '../render/renderContext.ts'

import type { View } from '../types.ts';
import { Events } from './eventBus.ts'
import { logThis } from './logger.ts'
//==================================================
//                Sytem Events Module
//==================================================

// these values re-used repeatedly in event handlers
// we'll reuse them to reduce pressure on GC
let x = 0
let y = 0
let hit = false
let node: View | null = null
let hoveredNode: View | null = null
let focusedNode: View | null = null
const left = 0

/**
 * Initializes an environment for custom canvas mouse/touch event handlers.
 * 
 * Registers event handlers for:     
 *     WindowInputEvent 
 *     WindowKeyboardEvent
 *     mousedown + touchstart => handleClickOrTouch()    
 *     mousemove => handleMouseMove     
 */
export function initHostEvents( ): void {

   // handle any `WindowInputEvent` 
  addEventListener("input", (evt: any) => {
      // look for a focused node, if none, just ignore the event
      if (focusedNode !== null) {
         // we fire this event directly to the focused node only
         Events.send('WindowInput', focusedNode.name, evt)
      }
   })

   // handle enter backspace, delete, etc. 
   addEventListener('keydown', (evt: any) => {
      let focusNum = 0
      // handle Tab key
      if (evt.code === 'Tab') {
         if (focusedNode !== null) {
            const direction = (evt.shiftKey) ? -1 : +1
            focusNum = focusNext(focusedNode.tabOrder + direction, evt.shiftKey)
         } else {
            focusNum = focusNext(1, evt.shiftKey) // focus first
         }
         if (focusNum === 0) { // not found
            const last = (evt.shiftKey) ? 20 : 1
            focusNext(last, evt.shiftKey) // focus first
         }
         return
      }

      // handle Enter key
      if (evt.code === 'Enter') {
         if (hasVisiblePopup === true) {
            Events.send(`PopupReset`, "", null)
         } else if (focusedNode !== null) {
            focusedNode.touched()
         }
      }
      
      // look for focused node
      if (focusedNode !== null) {
         // again only to a node with focus
         Events.send('WindowKeyDown', focusedNode.name, evt)
      }
   })

   // register a handler for our canvas' mousedown event
   addEventListener('mousedown', (evt) => {
      evt.preventDefault()
      if (evt.button === left) {
         // go do hit-testing on activeElements 
         if (hasVisiblePopup === false) {
            handleClickOrTouch(evt.pageX, evt.pageY)
         } // a popup is open, just close it
         else {
            Events.send(`PopupReset`, "", null)
         }
      }
   }, false)

   // register a handler for our canvas' mousemove event
   addEventListener('mousemove', (evt) => {
      evt.preventDefault()
      // when a popup is open, don't bother with hover!
      if (hasVisiblePopup === false) {
         handleMouseMove(evt)
      }
   })
   
   addEventListener('scroll', (evt) => {
      evt.preventDefault();
      const y = (Math.sign(evt.scrollY));
      Events.send('Scroll', "", { deltaY: y })
   });

}


//                  event handlers 

/** 
 * Handles canvas mouse-move event.     
 * Provides logic to emulate 'onmouseenter', and        
 * 'onmouseleave' DOM events on our virtual elements.    
 * Uses the canvasContexts 'isPointInPath' method for hit-testing.    
 * @param {MouseEvent} evt - from canvas.mousemove event  
 */
function handleMouseMove(evt: any,) {

   x = evt.clientX
   y = evt.clientY

   // test for hovered
   node = null

   for (const element of activeNodes) {
      //@ts-ignore
      if (ctx.isPointInPath(element.path, x, y)) {
         // going from bottom to top, top-most object wins
         node = element
      }
   }

   // did we get a hover? 
   if (node !== null) {
      if (node !== hoveredNode) {
         clearHovered()          // clear any prior hover
         node.hovered = true     // set this nodes `hovered` flag
         node.update()           // command to update the hovered node
         hoveredNode = node      // register this node as currently hovered
         dwmWindow.setCursor("hand") // change the cursor
         Host.dirty()            // force a flush and swap
      }
   } else { // no node was hit
      if (hoveredNode !== null) {
         clearHovered()          // remove hovered state
         hoveredNode = null      // no node currently hover
      }
   }
}

/** 
 * Handles both, canvas-mouse-Click and canvas-Touch events.    
 * Uses the canvasContexts 'isPointInPath' method for hit-testing. 
 *     
 * If a hit is detected, we directly call the elements touched() method.    
 * When called, the elements `touched()` method will broadcast 
 * a `touched` event to any registered subscribers.   
 * 
 * @param {number} x - horizontal location of this event
 * @param {number} y - vertical location of this event
 */
function handleClickOrTouch(x: number, y: number) {

   hit = false
   for (const element of activeNodes) {
      if (!hit) { // short circuit once we get a hit
         // check each element (bottom to top), top-most object wins
         //@ts-ignore
         if (ctx.isPointInPath(element.path, x, y)) {
            // got one, call the elements touched method
            element.touched()
            // clear any currently focused view 
            clearFocused()
            // set this one as focused
            focusedNode = element
            // tell others about this newly focused element
            if (focusedNode)
            Events.send('Focused', focusedNode.name, true);
            hit = true
         }
      }
   }
   // nothing touched - clear the focused element
   if (!hit) clearFocused()
}

/** clear last focused object */
function clearFocused() {
   if (focusedNode !== null) {
      focusedNode.focused = false;
      focusedNode.hovered = false
      Events.send('Focused', focusedNode.name, focusedNode.focused);
      focusedNode.update();      // re-render the element
   }
}

/** clear last hovered object */
function clearHovered() {
   //dwmWindow.setCursor("arrow")
   if (hoveredNode !== null) {
      hoveredNode.hovered = false
      hoveredNode.update()       // re-render the element
   }
}

/** change focus to this tabOrder */
function focusNext(target: number, shift: boolean) {
   hit = false
   for (const element of activeNodes) {
      if (hit === false) { // short circuit once we get a hit
         if (element.tabOrder === target) {

            // clear any currently focused view 
            clearFocused()
            clearHovered()

            // set this one as focused
            focusedNode = element
            if (focusedNode) {
               focusedNode.focused = true;
               focusedNode.hovered = true

               // got one, call the elements update method
               focusedNode.update()

               // tell others about this newly focused element 
               Events.send('Focused', focusedNode.name, true)
            }
            hit = true
         }
      }
   }
   return (hit === false) ? 0 : target
}
