/**
 *
 * Priorities:
 * 1. Money
 * 2. Surrounding valuables
 * 3. Most valuable sector
 *
 * TODO
 * 1. Avoid fury enemy
 *
 */

import * as DecisionManager from './decision/manager'

import {
    getBoardAsMatrix,
    getEnemies,
    getHeadPosition,
    getSnakeLength,
    isFlying,
    isFury,
    isGameOver,
    isSleep
} from './utils';


const state = {
    stepCount: 0,
    prevDecision: null,
    snake: {
        snakeLength: 0,
        canEatStone: false,
        isFury: false,
        isFlying: false,
        isSleep: false,
        headPosition: null,
        previousHeadPosition: null,
    },
    isGameOver: false,
    boardMatrix: null,
    board: null,
    enemies: []
}

export function getNextSnakeMove(board) {

    ++state.stepCount

    state.board = board
    state.boardMatrix = getBoardAsMatrix(board)
    state.isGameOver = isGameOver(state.board)
    state.enemies = getEnemies(state)

    state.snake = {
        ...state.snake,
        headPosition: getHeadPosition(state.board),
        snakeLength: getSnakeLength(state.board),
        isFury: isFury(state.board),
        isFlying: isFlying(state.board),
        isSleep: isSleep(state.board),
    }

    if (state.isGameOver || state.snake.isSleep || !state.snake.headPosition) {
        return '';
    }

    const command = DecisionManager.decide(state)

    if (!command) {
        console.error('No command for state', JSON.parse(JSON.stringify(state)))
    }

    state.snake.previousHeadPosition = state.snake.headPosition
    state.prevDecision = command

    return command;
}


// let mostValuableSector
//recalculate most valuable sector every 20 steps
// if (!mostValuableSector || stepCount % 20 === 0) {
//     const sectors = objectValues(
//         splitBoardInSectors(board, boardMatrix)
//     ).sort((a, b) => {
//         if (a.value < b.value) return 1
//         if (a.value > b.value) return -1
//         return 0
//     })
//
//     mostValuableSector = sectors[0].sector
//
//     console.log(mostValuableSector, sectors);
// }

// function getCellValue(board, cell) {
//     let currentValue = 0
//
//     const snakeLength = getSnakeLength(board)
//
//     switch (cell) {
//         case ELEMENT.FURY_PILL:
//         case ELEMENT.FLYING_PILL:
//
//             currentValue = 1;
//
//             break;
//         case ELEMENT.APPLE:
//
//             currentValue = 2;
//
//             break;
//         case ELEMENT.GOLD:
//
//             currentValue = 3;
//
//             break;
//         case ELEMENT.STONE:
//
//             if (canEatStone(snakeLength)) {
//                 currentValue = 4;
//             }
//
//             break;
//     }
//
//     if (currentValue < 3) {
//
//         if (isFury(board)) {
//
//             switch (cell) {
//
//                 case ELEMENT.ENEMY_HEAD_DOWN:
//                 case ELEMENT.ENEMY_HEAD_LEFT:
//                 case ELEMENT.ENEMY_HEAD_RIGHT:
//                 case ELEMENT.ENEMY_HEAD_UP:
//                 case ELEMENT.ENEMY_HEAD_DEAD:
//                 case ELEMENT.ENEMY_HEAD_SLEEP:
//                 case ELEMENT.ENEMY_TAIL_END_DOWN:
//                 case ELEMENT.ENEMY_TAIL_END_LEFT:
//                 case ELEMENT.ENEMY_TAIL_END_UP:
//                 case ELEMENT.ENEMY_TAIL_END_RIGHT:
//                 case ELEMENT.ENEMY_TAIL_INACTIVE:
//                 case ELEMENT.ENEMY_BODY_HORIZONTAL:
//                 case ELEMENT.ENEMY_BODY_VERTICAL:
//                 case ELEMENT.ENEMY_BODY_LEFT_DOWN:
//                 case ELEMENT.ENEMY_BODY_LEFT_UP:
//                 case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
//                 case ELEMENT.ENEMY_BODY_RIGHT_UP:
//
//                     currentValue = 2;
//
//                     break;
//             }
//         }
//
//     }
//
//     return currentValue
// }

// function splitBoardInSectors(board, boardMatrix) {
//
//     const sectors = {
//         [SECTORS.BOTTOM_LEFT]: {
//             sector: SECTORS.BOTTOM_LEFT,
//             value: 0,
//         },
//         [SECTORS.BOTTOM_RIGHT]: {
//             sector: SECTORS.BOTTOM_RIGHT,
//             value: 0,
//         },
//         [SECTORS.TOP_LEFT]: {
//             sector: SECTORS.TOP_LEFT,
//             value: 0,
//         },
//         [SECTORS.TOP_RIGHT]: {
//             sector: SECTORS.TOP_RIGHT,
//             value: 0,
//         },
//     }
//
//     boardMatrix.forEach((row, y) => {
//         row.forEach((cell, x) => {
//
//             const value = getCellValue(board, cell)
//
//             const currentSector = getCellSector(boardMatrix, {x, y})
//
//             sectors[currentSector].value += value
//         })
//     })
//
//     return sectors
// }

// function getCellSector(boardMatrix, position) {
//
//     const yCenter = Math.ceil(boardMatrix.length / 2)
//     const xCenter = Math.ceil(boardMatrix[0].length / 2)
//
//     if (position.y < yCenter) {
//         if (position.x < xCenter) {
//             return SECTORS.BOTTOM_LEFT
//         } else {
//             return SECTORS.BOTTOM_RIGHT
//         }
//     } else {
//         if (position.x < xCenter) {
//             return SECTORS.TOP_LEFT
//         } else {
//             return SECTORS.TOP_RIGHT
//         }
//     }
// }
