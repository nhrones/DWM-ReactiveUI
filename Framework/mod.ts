//=================================================
//    Component Deps
//=================================================
export * from '../Components/mod.ts'



//======================================
//      host 
//======================================

/* hostWindow.ts */
export { HostWindow } from './host/hostWindow.ts'

/* uiContainer.ts */
export { 
   addElement,
   containerInit, 
   hydrateUI, 
   render, 
} from './host/uiContainer.ts'

//======================================
//      render 
//======================================

/* activeNodes.ts */
export { 
   activeNodes, 
   addNode, 
   renderNodes 
} from './render/activeNodes.ts'

/* renderContext.ts */
export { 
   canvas,
   ctx,
   dwmWindow,
   elementDescriptors, 
   fontColor,
   getFactories, 
   hasVisiblePopup,
   Host,
   incrementTickCount,
   initCFG, 
   refreshCanvasContext,
   setHasVisiblePopup,
   setupRenderContext,
   tickCount,
   windowCFG 
} from './render/renderContext.ts'

//======================================
//      coms 
//======================================

export { Events, buildEventBus } from './events/eventBus.ts'
export { logThis } from './events/logger.ts'
export { initHostEvents } from './events/systemEvents.ts'
export type { CoreEvents } from './events/coreEventTypes.ts'
export * from './types.ts'


//======================================
//      External Dependencies
//======================================

/* 
 * Deno Windows Manager library 
 */
export {   
   DwmWindow,
   createWindow,
   mainloop,
   WindowKeyboardEvent,
   WindowInputEvent,
   WindowClosedEvent,
   WindowFramebufferSizeEvent
} from "https://deno.land/x/dwm@0.3.6/mod.ts"

export type { 
   Size, 
   CreateWindowOptions 
} from "https://deno.land/x/dwm@0.3.6/mod.ts"

/* 
 * skia-canvas library
 */
export { 
   Path2D,
   Canvas,
   createCanvas,
   CanvasRenderingContext2D,
   ImageData 
} from "https://deno.land/x/skia_canvas@0.5.8/mod.ts"

export type { Rect } from "https://deno.land/x/skia_canvas@0.5.8/mod.ts"


