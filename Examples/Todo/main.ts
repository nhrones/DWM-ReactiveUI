
import {
   logThis,
   mainloop, 
   containerInit, 
   hydrateUI,
   initCloseButton,
   initCheckbox,
   render,
   TextEditor,
   Events
} from "./deps.ts";

import { addTodo } from './addButton.ts'

import * as DeleteButton from './deleteButton.ts'

// Unpack Configuration Files
import { cfg } from "./cfg.ts";
import manifest from './view_manifest.ts'

// Initialize the Host Container 
containerInit( // REQUIRED - must be first call  
   cfg,
   manifest,
)

/** initialize the close button */
initCloseButton('closebutton')

/** initialize the checkbox button */
initCheckbox('CheckBox1')

/** initialize the delete button */
DeleteButton.init('deletebutton')

const _textEditor = new TextEditor( 'TextArea1', `First line.
Second line.` )

// Build and Display the Apps GUI
hydrateUI() // REQUIRED - after the App is initialized

// kickstart our editor session
Events.fire('Focused', "TextArea1", false)
// clear the log
logThis("", "", true) 

let row = 0

Events.on('ButtonTouched',"addbutton", () => {
   logThis("addbutton", "ButtonTouched")
   row++
   addTodo(row, 470 + (row * 32))
})



// Main Render Loop
await mainloop(render) // MUST be the LAST call in main.ts
