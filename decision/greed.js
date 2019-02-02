import PF from "pathfinding";
import pathfinder from "../pathfinder";
import {getDirection, getSurround, isSameVector, objectValues} from "../utils";
import {COMMANDS, ELEMENT, MAP} from "../constants";

export default (state) => {

    const {board, snake: {headPosition}} = state

    state.snake.canEatStone = canEatStone(state)

    const walkingMatrix = createWalkMatrixFromBoard(state)

    const grid = new PF.Grid(walkingMatrix);

    let closestPath = null;
    let command = null

    const valuablesInSurrounds = getValuablesFromSurrounds(state, getSurround(board, headPosition))

    valuablesInSurrounds.forEach(item => {

        let path = pathfinder(grid, headPosition, {x: item.x, y: item.y});

        if (path.length > 1) {

            if (!closestPath || path.length < closestPath.length) {
                closestPath = path
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
                case ELEMENT.ENEMY_TAIL_INACTIVE:
                case ELEMENT.ENEMY_HEAD_SLEEP:
                case ELEMENT.ENEMY_HEAD_DEAD:
                case ELEMENT.ENEMY_HEAD_UP:
                case ELEMENT.ENEMY_HEAD_DOWN:
                case ELEMENT.ENEMY_HEAD_LEFT:
                case ELEMENT.ENEMY_HEAD_RIGHT:

                    currentValue = MAP.BLOCKED

                    break;
                case ELEMENT.NONE:
                case ELEMENT.APPLE:
                case ELEMENT.GOLD:
                case ELEMENT.FURY_PILL:
                case ELEMENT.FLYING_PILL:

                    currentValue = MAP.WALKABLE;

                    break;
            }

            if (currentValue === null) {
                if (snake.canEatStone) {
                    switch (col) {
                        case ELEMENT.STONE:

                            currentValue = MAP.WALKABLE;

                            break;
                    }
                }
            }

            if (currentValue === null) {

                if (snake.isFury) {
                    switch (col) {
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

                            //enemy can also be fury?

                            currentValue = MAP.WALKABLE;

                            break;
                    }
                }
            }

            if (currentValue === null) {
                if (snake.isFlying) {
                    switch (col) {
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

                            //enemy can also be flying?

                            currentValue = MAP.WALKABLE;

                            break;
                    }
                }
            }

            if (getEnemiesInSurroundings(state, {x, y}).length > 0) {
                currentValue = MAP.BLOCKED
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

function getValuablesFromSurrounds(state, surrounds) {
    const valuables = []

    const {board, enemies} = state

    surrounds.forEach(surround => {

        if (isCellValuable(state, surround.item, surround.position)) {

            let canAdd = true

            getSurround(board, surround.position).forEach(item => {

                const enemy = enemies.find(enemy => isSameVector(enemy.headPosition, item.position))
                if (enemy) {
                    if (enemy.isFury) {
                        canAdd = false
                    }
                }

            })

            if (canAdd) {
                valuables.push({
                    ...surround.position,
                    item: surround.item
                })
            }
        }
    })

    return valuables
}

function canEatStone(state) {

    const {snake, enemies} = state

    return snake.snakeLength >= 5

    // const nextSnakeLength = snake.snakeLength - 3
    //
    // const longerEnemy = enemies
    //     .filter(enemy => !enemy.isDead && !enemy.isSleep)
    //     .find(enemy => enemy.snakeLength >= nextSnakeLength)
    //
    // return !longerEnemy;
}

function isCellValuable(state, cell, cellPosition) {

    const {board} = state

    switch (cell) {
        case ELEMENT.STONE:

            if (state.snake.canEatStone) {
                return isCellNotSurrounded(board, cellPosition)
            }

            break;

        case ELEMENT.APPLE:
        case ELEMENT.GOLD:
        // case ELEMENT.FURY_PILL:
        // case ELEMENT.FLYING_PILL:

            return isCellNotSurrounded(board, cellPosition)
    }

    return false
}

function isCellNotSurrounded(board, cellPosition) {
    //check is valuable is not surrounded by stones
    let surroundedItems = []

    if (cellPosition) {
        getSurround(board, cellPosition).forEach(position => {
            switch (position.item) {
                case ELEMENT.STONE:
                case ELEMENT.ENEMY_HEAD_EVIL:
                case ELEMENT.OTHER:
                case ELEMENT.WALL:
                    surroundedItems.push(position.direction)
                    break
            }
        })
    }

    // *******
    // ** X <= Prevent tunnels!
    // *******

    if (surroundedItems.length <= 2) {

        const isSurroundedOnLeftRight = surroundedItems.indexOf(COMMANDS.RIGHT) !== -1
            && surroundedItems.indexOf(COMMANDS.LEFT) !== -1

        const isSurroundedOnTopBottom = surroundedItems.indexOf(COMMANDS.DOWN) !== -1
            && surroundedItems.indexOf(COMMANDS.UP) !== -1

        return !isSurroundedOnLeftRight && !isSurroundedOnTopBottom
    }

    return false
}

export function getEnemiesInSurroundings(state, position) {

    const {board, enemies, snake: {isFury, snakeLength}} = state

    const potentialEnemies = enemies.filter(enemy =>
        !(enemy.isDead || enemy.isSleep || enemy.isFlying)
    )

    const actualEnemies = {}

    getSurround(board, position).forEach(item => {

        const currentEnemy = potentialEnemies.find(enemy =>
            !!enemy.bodyPositions.find(body =>
                isSameVector(body.position, item.position)
            )
        )

        if (currentEnemy) {
            if (isFury) {
                if (currentEnemy.isFury) {
                    if (currentEnemy.snakeLength >= snakeLength) {
                        actualEnemies[currentEnemy.cid] = currentEnemy
                    }
                } else {
                    actualEnemies[currentEnemy.cid] = currentEnemy
                }
            } else {
                if (currentEnemy.snakeLength >= snakeLength) {
                    actualEnemies[currentEnemy.cid] = currentEnemy
                }
            }
        }
    })

    return objectValues(actualEnemies)
}