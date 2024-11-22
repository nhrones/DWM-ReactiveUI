import type {
   CoreEvents
} from './coreEventTypes.ts'

import type {
   EventBus, 
   EventContract, 
   EventHandler 
} from '../types.ts'



/** 
 * A factory function that returns a generic strongly-typed EventBus instance 
 * @typeParam T - type that extends EventContract\<T\>
 * @returns EventBus<T> - a strongly-typed EventBus object with the following two methods:   
 * @method on - registers a callback function to be called when the named event is fired (emmited). 
 * @method fire - fires (emmits) the named event, triggering the execution of any registered callback functions 
 */
export function buildEventBus<T extends EventContract<T>>(): EventBus<T> {

   /** 
    * holds an array of event handler for each registered event name 
    */
   const eventSubscriptions: Map<string, EventHandler[]> = new Map()

   const newEventBus: EventBus<T> = {

      /** 
       * Subscribe to event
       * on - registers a handler function to be executed when an event is fired
       *  
       * @param {key} eventName - event name (one of `TypedEvents` only)!
       * @param {string} id - id of a target element (may be an empty string)
       * @param {Handler} handler - event handler callback function
       */
      on<EventName extends keyof T>(
         eventName: EventName,
         id: string,
         handler: EventHandler<T[EventName]>
      ): void {
         // create a keyName that combines the eventName and the target element id (if any)
         const keyName = eventName as string + '-' + id

         // if this keyName has already been registered
         if (eventSubscriptions.has(keyName)) {
            const handlers = eventSubscriptions.get(keyName)!
            // push this new handler to it. 
            handlers.push(handler)
         }
         // keyName needs to be registered
         else {
            // if first subscription - create it with this handler
            eventSubscriptions.set(keyName, [handler])
         }

      },

      /** 
       * Publish an event
       * execute all registered handlers for a named event
       * @param {key} eventName - event name - one of `TypedEvents` only!
       * @param {string} id - id of a target element (may be an empty string)
       * @param {TypedEvents[key]} data - data payload, typed for this category of event
       */
      fire<EventName extends keyof T>(
         eventName: EventName,
         id: string,
         data: T[EventName]
      ): void {
         // create a keyName that combines the eventName and the target element id (if any)
         const keyName = eventName as string + '-' + id

         // check for any registered handlers for this unique keyName
         const handlers = eventSubscriptions!.get(keyName);
         if (handlers) {
            // callback all registered handlers with any data payload
            for (const handler of handlers) {
               // call it!
               handler(data)
            }
         }
      }
      
   }
   return newEventBus
}


/** 
 * Use a factory function to create a new EventBus service. 
 * use an intersection type from `Base` and `Local` types. 
 */
export const Events = buildEventBus<CoreEvents>()
