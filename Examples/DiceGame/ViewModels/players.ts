

import { eventBus } from '../main.ts'
import { App } from './diceGame.ts'

const MAXPLAYERS = 2

/** a type that describes a Player object */
export type Player = {
    id: string
    idx: number
    playerName: string
    color: string
    score: number
    lastScore: string
}

// deno-lint-ignore no-unused-vars
let game: App;
let thisColor = 'snow';
export const players: Set<Player> = new Set();

export const init = (thisgame: App, color: string) => {
    game = thisgame
    thisColor = color
    players.clear()

    thisPlayer = {
        id: "",
        idx: 0,
        playerName: '',
        color: 'brown',
        score: 0,
        lastScore: ''
    }
}

/** resets all players labels */
export const resetScoreLabels = () => {
    for (let i = 0; i < MAXPLAYERS; i++) {
        updatePlayer(i, thisColor, '')
    }
}

/** reset players state to initial game state */
export const resetPlayers = () => {
    for (const player of players) {
        player.score = 0
        updatePlayer(player.idx, player.color, player.playerName)
    }
}

/** add a score value for this player */
export const addScore = (player: Player, value: number) => {
    player.score += value
    const text = (player.score === 0) ? player.playerName : `${player.playerName} = ${player.score}`
    updatePlayer(player.idx, player.color, text)
}

/** broadcast an update message to the view element */
const updatePlayer = (index: number, color: string, text: string) => {
   eventBus.fire('UpdatePlayer', index.toString(), {
         index: index,
         color: color, 
         text: text
        }
    )
}

//================================================
//                 from server
//================================================

/** add a new player,  
 * broadcasts `UpdatePeers` (will ResetGame) 
 * @param {string} id - the id of the new player
 */
export const addPlayer = (id: string, playerName: string) => {
    if (playerName === 'Player') {
        const num = players.size + 1
        playerName = 'Player' + num;
    }
    if (thisPlayer.id === "") {
        thisPlayer.id = id
        thisPlayer.playerName = playerName
        players.add(thisPlayer)
    } else {
        players.add(
            {
                id: id,
                idx: players.size,
                playerName: playerName,
                color: playerColors[players.size],
                score: 0,
                lastScore: ''
            }
        )
    }
}

/** removes a Player    
 * called when the players webSocket has closed    
 * @param {string} id - the id of the player to be removed
 */
// deno-lint-ignore no-unused-vars
const removePlayer = (id: string) => {
    const p = getById(id)
    if (p) players.delete(p)
    refreshPlayerColors();
    setThisPlayer([...players][0])
}

const getById = (id: string): Player | null => {
    for (const player of players) {
        if (player.id === id) return player;
    }
    return null
}

export const getNextPlayer = (player: Player) => {
    let next = player.idx + 1
    if (next === players.size) {
        next = 0
    }
    return [...players][next]
}

/** reassigns index and unique color for each active player */
const refreshPlayerColors = () => {
    let i = 0
    for (const player of players) {
        player.idx = i;
        player.color = playerColors[i]
        i++
    }
}
//}

/** an array of player colors */
const playerColors = ["Brown", "Green", "RoyalBlue", "Red"]


export const setThisPlayer = (player: Player) => {
    thisPlayer = player
}

export let thisPlayer: Player = {
    id: "0",
    idx: 0,
    playerName: 'Nick',
    color: 'brown',
    score: 0,
    lastScore: ''
}

export let currentPlayer: Player = {
    id: "0",
    idx: 0,
    playerName: "Nick",
    color: 'brown',
    score: 0,
    lastScore: ''
}

export const setCurrentPlayer = (player: Player) => {
    currentPlayer = player
}
