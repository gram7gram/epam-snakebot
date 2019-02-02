import {ELEMENT, MAP} from "../constants";
import PF from "pathfinding";
import {getDirection, getSurround, isSameVector} from "../utils";
import pathfinder from "../pathfinder";

export default (state) => {

    const {snake: {headPosition}} = state

    const walkingMatrix = createWalkMatrixFromBoard(state)

    const grid = new PF.Grid(walkingMatrix);

    let closestPath = null;
    let command = null

    getTargetsFromBoard(state).forEach(item => {

        let path = pathfinder(grid, headPosition, item.position);

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

function getTargetsFromBoard(state) {

    const {boardMatrix, enemies} = state

    const valuables = []

    enemies.forEach(enemy => {
        enemy.bodyPositions.forEach(body => {
            valuables.push({position: body.position, item: body.item})
        })
    })

    boardMatrix.forEach((row, y) => {

        row.forEach((col, x) => {

            switch (col) {

                case ELEMENT.START_FLOOR:
                case ELEMENT.STONE:
                case ELEMENT.WALL:
                case ELEMENT.OTHER:
                    valuables.push({position: {x, y}, item: col})
            }
        })
    })

    return valuables
}

function createWalkMatrixFromBoard(state) {
    const matrix = []

    const {boardMatrix, snake} = state

    boardMatrix.forEach((row, y) => {

        const matrixRow = []

        row.forEach((col, x) => {

            let currentValue = null

            if (snake.previousHeadPosition) {
                if (isSameVector(snake.previousHeadPosition, {x, y})) {
                    currentValue = MAP.BLOCKED
                }
            }

            if (currentValue === null) {
                currentValue = MAP.WALKABLE
            }

            matrixRow.push(currentValue)
        })

        matrix.push(matrixRow)
    })

    return matrix
}