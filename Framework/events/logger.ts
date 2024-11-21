
import { Events } from "../mod.ts"
let logTxt = ""
/**
 *  log msg to 'logger' static text element
 */
export const logThis = (thisMsg: string, from?: string, clear = false) => {

   if (clear) {
      logTxt = ""
   }

   let newTxt = ( from ) 
      ? from + " -- " + thisMsg
      : thisMsg

   logTxt = newTxt + `
${logTxt}` 
   let maxChars = 600
   if (logTxt.length > maxChars) logTxt = logTxt.substring(0, maxChars)

   Events.send("UpdateText", "logger",
      {
         border: true,
         fill: true,
         fillColor: 'white',
         fontColor: "black",
         text: logTxt
      })
}
