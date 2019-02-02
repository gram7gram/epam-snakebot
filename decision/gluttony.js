import PF from "pathfinding";
import pathfinder from "../pathfinder";
import {getDirection, getSurround, isSameVector, objectValues} from "../utils";
import {COMMANDS, ELEMENT, MAP} from "../constants";

export default (state) => {

    const {snake: {headPosition, snakeLength}} = state

    state.snake.canEatStone = canEatStone(state)

    const walkingMatrix = createWalkMatrixFromBoard(state)

    const grid = new PF.Grid(walkingMatrix);

    let closestPath = null;
    let command = null

    const valuables = getValuablesFromBoard(state)

    if (state.snake.canEatStone) {

        valuables.filter(item => item.item === ELEMENT.STONE).forEach(item => {
            let path = pathfinder(grid, headPosition, {x: item.x, y: item.y});

            if (path.length > 1) {
                if (path.length < 10) {

                    if (!closestPath || path.length < closestPath.length) {
                        closestPath = path
                    }
                }
            }
        })
    }

    if (!closestPath) {
        if (snakeLength > 5) {

            valuables.filter(item => item.item === ELEMENT.GOLD).forEach(item => {
                let path = pathfinder(grid, headPosition, {x: item.x, y: item.y});

                if (path.length > 1) {
                    // first half of the game is full  of noobs. do not bother with gold if it is too far
                    if (path.length < 20) {

                        if (!closestPath || path.length < closestPath.length) {
                            closestPath = path
                        }
                    }
                }
            })
        }

    }

    if (!closestPath) {
        valuables.forEach(item => {

            let path = pathfinder(grid, headPosition, {x: item.x, y: item.y});

            if (path.length > 1) {

                if (!closestPath || path.length < closestPath.length) {
                    closestPath = path
                }
            }
        })
    }

    if (!closestPath && valuables.length > 0) {
        const item = valuables[0]

        let path = pathfinder(grid, headPosition, {x: item.x, y: item.y});

        if (path.length > 1) {
            closestPath = path
        }
    }

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
                        case ELEMENT.ENEMY_HEAD_DOWN:
                        case ELEMENT.ENEMY_HEAD_LEFT:
                        case ELEMENT.ENEMY_HEAD_RIGHT:
                        case ELEMENT.ENEMY_HEAD_UP:
                        case ELEMENT.ENEMY_HEAD_DEAD:
                        case ELEMENT.ENEMY_HEAD_SLEEP:
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
                        case ELEMENT.ENEMY_HEAD_DOWN:
                        case ELEMENT.ENEMY_HEAD_LEFT:
                        case ELEMENT.ENEMY_HEAD_RIGHT:
                        case ELEMENT.ENEMY_HEAD_UP:
                        case ELEMENT.ENEMY_HEAD_DEAD:
                        case ELEMENT.ENEMY_HEAD_SLEEP:
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

            // if (currentValue === null) {
            //
            //     if (snake.snakeLength > 2) {
            //
            //         //eat yourself
            //
            //         switch (col) {
            //             case ELEMENT.TAIL_END_DOWN:
            //             case ELEMENT.TAIL_END_LEFT:
            //             case ELEMENT.TAIL_END_UP:
            //             case ELEMENT.TAIL_END_RIGHT:
            //             case ELEMENT.BODY_HORIZONTAL:
            //             case ELEMENT.BODY_VERTICAL:
            //             case ELEMENT.BODY_LEFT_DOWN:
            //             case ELEMENT.BODY_LEFT_UP:
            //             case ELEMENT.BODY_RIGHT_DOWN:
            //             case ELEMENT.BODY_RIGHT_UP:
            //
            //                 currentValue = MAP.WALKABLE;
            //
            //                 break;
            //         }
            //     }
            // }

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

function getValuablesFromBoard(state) {
    const valuables = []

    const {board, boardMatrix, enemies} = state

    boardMatrix.forEach((row, y) => {

        row.forEach((col, x) => {

            if (isCellValuable(state, col, {x, y})) {

                let canAdd = true

                getSurround(board, {x, y}).forEach(item => {

                    const enemy = enemies.find(enemy => isSameVector(enemy.headPosition, item.position))
                    if (enemy) {
                        if (enemy.isFury) {
                            canAdd = false
                        }
                    }

                })

                if (canAdd) {
                    valuables.push({x, y, item: col})
                }

            }
        })
    })

    return valuables
}

function canEatStone(state) {
    const {snake, enemies} = state

    if (snake.snakeLength < 5) return false

    const nextSnakeLength = snake.snakeLength - 3

    const longerEnemy = enemies
        .filter(enemy => !enemy.isDead && !enemy.isSleep)
        .find(enemy => enemy.snakeLength >= nextSnakeLength)

    return !longerEnemy;
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
        case ELEMENT.FURY_PILL:
        case ELEMENT.FLYING_PILL:

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