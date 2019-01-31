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
