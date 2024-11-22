
import { 
   buildEventBus, 
   //Manifest 
} from "./deps.ts"
import { initCloseButton, mainloop, containerInit, hydrateUI, render } from "./deps.ts";
import { App, appInstance } from './ViewModels/diceGame.ts';
import * as Players from './ViewModels/players.ts';
import type { DiceEvents } from "./diceGameTypes.ts";

// Unpack configuration files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'
 

/** 
 * Use a factory function to create a new EventBus service 
 * using an intersection type from `Base` and `Local` types. 
 */
export const eventBus = buildEventBus<DiceEvents>()

/** initialize the button */
initCloseButton('closebutton')


// REQUIRED - must be first call
// Initialize the Host Container 
containerInit( // REQUIRED - must be first call in main.ts
    cfg, 
    manifest
) 
    
// Initialize our App (main viewmodel) 
App.init();

// Load hydrate, and display the Apps GUI
hydrateUI() // REQUIRED - after the App is initialized

// Add our single player 
const id = '1'
const name = "Player1"
Players.thisPlayer.id = id
Players.thisPlayer.playerName = name
Players.setThisPlayer(Players.thisPlayer)
Players.setCurrentPlayer(Players.thisPlayer)
Players.addPlayer(id, name)

// Reset for a fresh start 
appInstance.resetTurn()
      
// Main Render Loop (MUST be the LAST call in main.ts)
// REQUIRED by the framework (called ~ every 16ms)
await mainloop(render)

