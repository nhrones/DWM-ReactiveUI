
import {
   Canvas,
   CanvasRenderingContext2D,
   DwmWindow
} from "../mod.ts";

import baseManifest from '../../Components/base_manifest.ts'

import type {
   Configuration,
   ElementDescriptor,
   FactoryType,
   Manifest,
   WinCFG,
} from '../types.ts'

import { HostWindow } from "../host/hostWindow.ts";

/** 
 * Give access to the current window configuration 
 */
export let windowCFG: WinCFG = {
   title: "",
   size: { height: 500, width: 500 },
   location: { x: 0, y: 0 },
   containerColor: "snow",
   textColor: "black",
   resizable: false,
   removeDecorations: false,
   transparent: false
};

/** 
 * Expose the element descriptor collection 
 */
export let elementDescriptors: ElementDescriptor[];

/** 
 * To hold our application View-Manifest 
 */
let appManifest: Manifest

/** 
 * Initialize our configuration 
 */
export const initCFG = (cfg: Configuration, applicationManifest: Manifest) => {
   windowCFG = cfg.winCFG
   elementDescriptors = cfg.nodes
   appManifest = applicationManifest;
}

export const fontColor = 'white'


/** 
 * Build a set of View factories from both 
 * the `baseManifest` and the `appManifest.
 * `
 * This will add each View_constructor function to 
 * a Map to be used later to construct View instances.
 */
export const getFactories = (): Map<string, FactoryType> => {

   // Get the view_Manifest' base URL.
   const baseUrl = new URL("./", appManifest.baseUrl).href;
   const factories: Map<string, FactoryType> = new Map()

   //add base frameWork component constructors first
   for (const [self, module] of Object.entries(baseManifest.Views)) {
      const url = new URL(self, baseUrl).href;
      const path = url.substring(baseUrl.length).substring("Views".length);
      const baseRoute = path.substring(1, path.length - 3);
      const name = sanitizeName(baseRoute);
      const id = name.toLowerCase();
      //const newView = { id, name, url, component: module.default }
      factories.set(id, { id, name, url, component: module.default })
   }

   // add any custom components from the application
   if (appManifest.Views) {
      for (const [self, module] of Object.entries(appManifest.Views)) {
         const url = new URL(self, baseUrl).href;
         const path = url.substring(baseUrl.length).substring("Views".length);
         const baseRoute = path.substring(1, path.length - 3);
         const name = sanitizeName(baseRoute);
         const id = name.toLowerCase();
         //let newView = { id, name, url, component: module.default }
         factories.set(id, { id, name, url, component: module.default })
      }
   }
   // return the View_constructors collection (Map) 
   return factories
}

/** 
 * Popup is being shown flag 
 */
export let hasVisiblePopup = false
export const setHasVisiblePopup = (val: boolean) => hasVisiblePopup = val

/** 
 * A counter used to blink the caret (cursor) 
 */
export let tickCount = 0

/**  
 *  we use this tickcounter (0-60) to drive a blinking caret 
 */
export const incrementTickCount = () => {
   tickCount++;
   if (tickCount > 60) tickCount = 0
}


// window
export let dwmWindow: DwmWindow;

/** 
 *  Expose our canvas
 */
export let canvas: Canvas

/** 
 *  Expose our context2D from canvas
 */
export let ctx: CanvasRenderingContext2D

export let Host: HostWindow

export const setupRenderContext = (host: HostWindow) => {
   Host = host
   dwmWindow = Host.window
   dwmWindow.position = windowCFG.location
   dwmWindow.setCursor("hand")
   canvas = Host.canvas
   ctx = Host.ctx
   Host.makeContextCurrent()
   refreshCanvasContext()
}


export const refreshCanvasContext = () => {
   ctx = Host.ctx
   ctx.lineWidth = 1
   ctx.strokeStyle = windowCFG.containerColor
   ctx.fillStyle = windowCFG.containerColor
   ctx.font = "28px Tahoma, Verdana, sans-serif";
   ctx.textAlign = 'center'
   ctx.scale(
      Host.window.framebufferSize.width / Host.window.size.width,
      Host.window.framebufferSize.height / Host.window.size.height
   )
}

/**
 *  Converts a string to pascal casing
 */
function toPascalCase(text: string): string {
   return text.replace(
      /(^\w|-\w)/g,
      (substring) => substring.replace(/-/, "").toUpperCase(),
   );
}

/**
 *  sanitize a file-name string
 */
function sanitizeName(name: string): string {
   const fileName = name.replace("/", "");
   return toPascalCase(fileName);
}
