import type {ElementDescriptor} from '../../Framework/types.ts'

/** This is the configuration object  */
export const cfg = {
   winCFG: {
      title: "DWM-GUI Todo Example",
      size: { width: 1000, height: 900 },
      location: { x: 500, y: 100 },
      radius: 30,
      containerColor: "snow",
      textColor: "black",
      resizable: false,
      removeDecorations: false,
      transparent: false
   },
   nodes: [
      {
         kind: "TextArea",
         id: "TextArea1",
         idx: 0,
         tabOrder: 1,
         location: { left: 300, top: 20 },
         size: { width: 400, height: 350 },
         text: `testing123`,
         color: "snow", 
         multiLine: true
      },      
      {
         kind: "Button",
         id: "addbutton",
         idx: 0,
         tabOrder: 2,
         location: { left: 400, top: 400 },
         size: { width: 200, height: 50 },
         text: "Add Todo",
         color: "brown"
      },
      {
         kind: "Text",
         id: "logger",
         bind: true,
         idx: 0,
         tabOrder: 5,
         location: { left: 20, top: 600 },
         size: { width: 960, height: 280 },
         text: "logger",
         color: "white",
         fontColor: "black",
         hasBoarder: true,
         fontSize: 24,
         textAlign: "left",
         textBaseline: "top",
         TextLocation: 'top',
      }
   ] as ElementDescriptor[]
}