// deno-lint-ignore-file no-explicit-any

import type { Configuration, 
   ElementDescriptor,
   FactoryType, 
} from '../types.ts'

import { renderNodes, addNode } from '../render/activeNodes.ts'

import {
   elementDescriptors,
   getFactories,
   initCFG,
   setupRenderContext,
   windowCFG
} from '../render/renderContext.ts'

import { Host } from '../render/renderContext.ts'

import { HostWindow, } from "./hostWindow.ts";

import { initHostEvents } from '../events/systemEvents.ts'

// our view factories
let factories: Map<string, FactoryType>

/**  
 * create our app (window) 
 */
export function containerInit(
   cfg: Configuration,
   manifest: any
) {
   // initialize our execution context  
   initCFG(cfg, manifest)

   /** our main Window with a canvas */
   const host = new HostWindow({
      title: windowCFG.title,
      width: windowCFG.size.width,
      height: windowCFG.size.height,
      resizable: windowCFG.resizable,
      removeDecorations: windowCFG.removeDecorations,
      transparent: windowCFG.transparent
   });

   // setup our global context object    
   host.makeContextCurrent();

   const dwmWindow = host.window
   dwmWindow.position = windowCFG.location
   dwmWindow.setCursor("hand")

   // sets shared host member references 
   setupRenderContext(host)

   // initialize the canvas UI event handlers
   initHostEvents()
}

/** 
 * central render function 
 */
export const render = () => {
   // refresh the view - render views
   renderNodes()
   // flush pending ops
   Host.flush();
}

/* 
  Build all virtual UI elements from ElementDescriptors    
  contained in cfg.json.  
     
  Once we have elementDescriptors parsed as 'nodes', we proceed    
  to hydrate each as an active viewElement object. We place each    
  in an 'activeNodes' collection.
     
  Each viewElement contains a Path2D object. This path is used to     
  render and 'hit-test' the vitual UI View in mouseEvents.     
  mouseEvents (SEE: ./coms/systemEvents.ts). 
*/
export const hydrateUI = () => {

   // get our view factories from our auto-generated `/views_manifest.ts`
   factories = getFactories()

   // loop over each elementDescriptor  
   for (const el of elementDescriptors) {
      addElement(el)
   }
}

export function addElement(el: ElementDescriptor) {
   // get the `kind` of the view being requested
   const thisKind = el.kind.toLowerCase()

   // test if we have a registered factory for this kind
   if (factories.has(thisKind)) {
      // to hydrate the View-element,
      // we get the registered constructor
      const View = factories?.get(thisKind)?.component

      // instantiate an instance, and add it to our activeNodes collection
      addNode(new View(el))

   } // sorry, that kind was not found
   else {
      const errMsg = `No view named ${el.kind} was found! 
Make sure your view_manifest is up to date!`
      console.error(errMsg)
      throw new Error(errMsg);
   }
}