import PF from "pathfinding";
import pathfinder from "../pathfinder";
import {getDirection, getSurround, isSameVector} from "../utils";
import {ELEMENT, MAP} from "../constants";

/**
 * Eat yourself if trapped
 *
 * @param state
 * @returns string
 */
export default (state) => {

    const {snake: {headPosition}} = state

    const unwalkable = getUnwalkableSurroundings(state)

    if (unwalkable.length < 4) return null

    const item = getPossibleExit(state, unwalkable)

    if (!item) return null

    const walkingMatrix = createWalkMatrixFromBoard(state, item)

    const grid = new PF.Grid(walkingMatrix);

    let closestPath = null;
    let command = null

    const path = pathfinder(grid, headPosition, item.position);

    if (path.length > 1) {
        closestPath = path
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


function createWalkMatrixFromBoard(state, possibleExit) {
    const matrix = []

    const {boardMatrix, snake} = state

    boardMatrix.forEach((row, y) => {

        const matrixRow = []

        row.forEach((col, x) => {

            let currentValue = null

            switch (col) {
                case ELEMENT.OTHER:
                case ELEMENT.START_FLOOR:

                    currentValue = MAP.BLOCKED

                    break;
            }

            if (isSameVector(possibleExit.position, {x, y})) {
                currentValue = MAP.WALKABLE
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

function getPossibleExit(state, surroundings) {

    const {snake: {previousHeadPosition}} = state

    return surroundings.find(item => {

        if (previousHeadPosition) {
            if (isSameVector(previousHeadPosition, item.position)) {
                return false
            }
        }

        const canEatYourself = ELEMENT.SNAKE_BODIES.indexOf(item.item) !== -1
            || ELEMENT.SNAKE_TAILS.indexOf(item.item) !== -1

        const canBiteAndDie = ELEMENT.ENEMY_BODIES.indexOf(item.item) !== -1
            || ELEMENT.ENEMY_TAILS.indexOf(item.item) !== -1

        return canEatYourself || canBiteAndDie
    })
}

function getUnwalkableSurroundings(state) {
    const {board, snake} = state

    return getSurround(board, snake.headPosition).filter(item => {

        switch (item.item) {
            case ELEMENT.NONE:
            case ELEMENT.APPLE:
            case ELEMENT.GOLD:
            case ELEMENT.FURY_PILL:
            case ELEMENT.FLYING_PILL:
                return false
        }

        if (snake.isFury) {

            if (ELEMENT.ENEMY_BODIES.indexOf(item.item) !== -1) {
                return false
            }

            if (ELEMENT.ENEMY_TAILS.indexOf(item.item) !== -1) {
                return false
            }
        }

        if (snake.isFlying) {

            if (item.item === ELEMENT.STONE) {
                return false
            }

            if (ELEMENT.ENEMY_BODIES.indexOf(item.item) !== -1) {
                return false
            }

            if (ELEMENT.ENEMY_TAILS.indexOf(item.item) !== -1) {
                return false
            }
        }

        return true
    })
}