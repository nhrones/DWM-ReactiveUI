
import { eventBus } from '../main.ts'
import { Events } from '../deps.ts'

const id = 'player1'

export const state = {
   border: false,
   fill: true,
   fillColor: "snow",
   fontColor: "Brown",
   text: "Player1"
}

/** PlayerName ViewModel initialization
 *  Called from DiceGame Controller ctor */
export const init = () => {
   //hack: 
   eventBus.on("UpdatePlayer", "0", (data: { index: number, color: string, text: string }) => {
      //state.color = data.color
      state.text = data.text
      update()
   })

   update()
}

/** fires an update event with the current state */
export const update = () => {
   Events.fire('UpdateText', id, state)
}