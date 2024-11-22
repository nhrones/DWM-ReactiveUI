import { addElement, Events, logThis, } from "./deps.ts";

// let row = 0
// let top = 470 + (row * 32)

// Events.when('ButtonTouched',"addbutton", () => {
//    logThis("ButtonTouched", "addbutton")
//    addTodo(row++, top)
// })


/**
 * Add a Todo to this list
 * @param {number} index - the index of this row
 * @param {number} top - the top of this row
 */
export function addTodo(index: number, top: number ) {
   const thisID = `row${index}`
   logThis(`Top: ${top}`, `adding ${thisID}`)
     
   addElement( {
      kind: "Text",
      id: thisID,
      bind: true,
      idx: 0,
      tabOrder: 6,
      location: { left: 20, top: top },
      size: { width: 860, height: 36 },
      text: "",
      color: "white",
      fontColor: "black",
      hasBoarder: true,
      fontSize: 24,
      textAlign: "left",
      textBaseline: "top",
      TextLocation: 'top',
   })
   
   addElement( {
      kind: "CheckBox",
      id: thisID,
      idx: 0,
      tabOrder: 3,
      location: { left: 890, top: top + 2 },
      size: { width: 32, height: 32 },
      text: "  ",
      color: "green",
      fontColor: "black",
      fontSize: 32,
      hasBoarder: false,
      boarderWidth: 0
   })
   
   addElement( {
      kind: "Button",
      id: thisID,
      idx: 0,
      tabOrder: 4,
      location: { left: 940, top: top },
      size: { width: 32, height: 32 },
      text: " ❌",
      color: "white",
      fontColor: "black",
      fontSize: 32,
      hasBoarder: false,
      boarderWidth: 0
   }) 
      
   Events.on("CheckBoxTouched", thisID, (checked) => {
      logThis(`checked:${checked.checked}`, `Checkbox touched: ${thisID}`)
   })
   
   Events.on("ButtonTouched", thisID, (_id) => {
      logThis(`DeleteRow!`, `Delete Row Touched: ${thisID}`)
   })
}