import {ELEMENT, MAP} from "../constants";
import PF from "pathfinding";
import {getDirection, isSameVector, objectValues} from "../utils";
import pathfinder from "../pathfinder";

export default (state) => {

    const {snake: {headPosition, snakeLength, isFury}, enemies} = state

    if (!isFury) return null

    if (snakeLength < 10) {
        if (enemies.length === 1) {
            const lastEnemy = enemies[0]

            if (!canHuntSnake(state, lastEnemy)) {
                return null
            }
        } else {
            return null
        }
    }

    const walkingMatrix = createWalkMatrixFromBoard(state)

    const grid = new PF.Grid(walkingMatrix);

    let closestPath = null;
    let command = null

    const targets = enemies.filter(enemy => canHuntSnake(state, enemy))

    targets.forEach(enemy => {

        const body = enemy.bodyPositions.filter(body => ELEMENT.ENEMY_HEADS.indexOf(body.item) === -1)

        const neckOrTail = body[0]

        if (neckOrTail) {
            let path = pathfinder(grid, headPosition, neckOrTail.position);

            if (path.length > 1) {

                if (!closestPath || path.length < closestPath.length) {
                    closestPath = path
                }
            }
        }
    })

    if (closestPath) {

        const step = closestPath[1]

        const path = {x: step[0], y: step[1]}

        command = getDirection(
            headPosition,
            path
        )
    }

    return command
}

function canHuntSnake(state, enemy) {

    const {snake: {snakeLength}} = state

    if (enemy.isDead || enemy.isSleep || enemy.isFlying) return false

    return !enemy.isFury && enemy.snakeLength < snakeLength
}

function createWalkMatrixFromBoard(state) {
    const matrix = []

    const {boardMatrix, snake} = state

    boardMatrix.forEach((row, y) => {

        const matrixRow = []

        row.forEach((col, x) => {

            let currentValue = null

            switch (col) {
                case ELEMENT.OTHER:
                case ELEMENT.START_FLOOR:

                case ELEMENT.ENEMY_HEAD_DOWN:
                case ELEMENT.ENEMY_HEAD_LEFT:
                case ELEMENT.ENEMY_HEAD_RIGHT:
                case ELEMENT.ENEMY_HEAD_UP:
                case ELEMENT.ENEMY_HEAD_DEAD:
                case ELEMENT.ENEMY_HEAD_SLEEP:

                    currentValue = MAP.BLOCKED

                    break;
                case ELEMENT.NONE:
                case ELEMENT.APPLE:
                case ELEMENT.GOLD:
                case ELEMENT.FURY_PILL:
                case ELEMENT.FLYING_PILL:

                case ELEMENT.ENEMY_TAIL_END_DOWN:
                case ELEMENT.ENEMY_TAIL_END_LEFT:
                case ELEMENT.ENEMY_TAIL_END_UP:
                case ELEMENT.ENEMY_TAIL_END_RIGHT:
                case ELEMENT.ENEMY_TAIL_INACTIVE:
                case ELEMENT.ENEMY_BODY_HORIZONTAL:
                case ELEMENT.ENEMY_BODY_VERTICAL:
                case ELEMENT.ENEMY_BODY_LEFT_DOWN:
                case ELEMENT.ENEMY_BODY_LEFT_UP:
                case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
                case ELEMENT.ENEMY_BODY_RIGHT_UP:

                    currentValue = MAP.WALKABLE;

                    break;
            }

            if (currentValue === null) {

                if (snake.snakeLength > 2) {

                    //eat yourself

                    switch (col) {
                        case ELEMENT.TAIL_END_DOWN:
                        case ELEMENT.TAIL_END_LEFT:
                        case ELEMENT.TAIL_END_UP:
                        case ELEMENT.TAIL_END_RIGHT:
                        case ELEMENT.BODY_HORIZONTAL:
                        case ELEMENT.BODY_VERTICAL:
                        case ELEMENT.BODY_LEFT_DOWN:
                        case ELEMENT.BODY_LEFT_UP:
                        case ELEMENT.BODY_RIGHT_DOWN:
                        case ELEMENT.BODY_RIGHT_UP:

                            currentValue = MAP.WALKABLE;

                            break;
                    }
                }
            }

            if (snake.previousHeadPosition) {
                if (isSameVector(snake.previousHeadPosition, {x, y})) {
                    currentValue = MAP.BLOCKED
                }
            }

            if (currentValue === null) {
                currentValue = MAP.BLOCKED
            }

            matrixRow.push(currentValue)
        })

        matrix.push(matrixRow)
    })

    return matrix
}