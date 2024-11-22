import { Events, logThis } from "./deps.ts"

// used to recognize events from a (decoupled) view
let thisID: string;

const txt = " ❌"

/**  
 * call from main viewmodel init 
 */
export const init = (id: string) => {
   thisID = id

   // listens for a touch event from this buttom 
   Events.on('ButtonTouched', thisID, () => {
      const A = true
      if (A) logThis("touched!", thisID + ' ButtonTouched!')
      Events.fire('UpdateButton', thisID,
         { text: txt, color: "white", enabled: true }
      )
   })

}