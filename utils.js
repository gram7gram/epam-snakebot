import {COMMANDS, ELEMENT} from './constants';

export function getBoardAsString(board) {
    return getBoardAsArray(board).join("\n");
}

export function getBoardAsArray(board) {
    const size = getBoardSize(board);
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(board.substring(i * size, (i + 1) * size));
    }
    return result;
}

export function getBoardAsMatrix(board) {
    const size = getBoardSize(board);
    var result = [];
    for (var i = 0; i < size; i++) {
        result.push(board.substring(i * size, (i + 1) * size).split(''));
    }
    return result;
}

export function getBoardSize(board) {
    return Math.sqrt(board.length);
}

export function isGameOver(board) {
    return board.indexOf(ELEMENT.HEAD_DEAD) !== -1;
}

export function getSnakeLength(board) {

    const boardString = getBoardAsString(board)

    return countElementsOnBoard(boardString, ELEMENT.HEAD_DOWN)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_LEFT)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_RIGHT)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_UP)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_DEAD)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_EVIL)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_FLY)
        + countElementsOnBoard(boardString, ELEMENT.HEAD_SLEEP)
        + countElementsOnBoard(boardString, ELEMENT.TAIL_END_DOWN)
        + countElementsOnBoard(boardString, ELEMENT.TAIL_END_LEFT)
        + countElementsOnBoard(boardString, ELEMENT.TAIL_END_UP)
        + countElementsOnBoard(boardString, ELEMENT.TAIL_END_RIGHT)
        + countElementsOnBoard(boardString, ELEMENT.TAIL_INACTIVE)
        + countElementsOnBoard(boardString, ELEMENT.BODY_HORIZONTAL)
        + countElementsOnBoard(boardString, ELEMENT.BODY_VERTICAL)
        + countElementsOnBoard(boardString, ELEMENT.BODY_LEFT_DOWN)
        + countElementsOnBoard(boardString, ELEMENT.BODY_LEFT_UP)
        + countElementsOnBoard(boardString, ELEMENT.BODY_RIGHT_DOWN)
        + countElementsOnBoard(boardString, ELEMENT.BODY_RIGHT_UP)
}

function countElementsOnBoard(board, element) {
    return (board.match(new RegExp(element, 'g')) || []).length
}

export function isSleep(board) {
    return board.indexOf(ELEMENT.HEAD_SLEEP) !== -1;
}

export function isFury(board) {
    return board.indexOf(ELEMENT.HEAD_EVIL) !== -1;
}

export function isFlying(board) {
    return board.indexOf(ELEMENT.HEAD_FLY) !== -1;
}

export function isAt(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return false;
    }
    return getAt(board, x, y) === element;
}

export function getAt(board, x, y) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }
    return getElementByXY(board, {x, y});
}

export function isNear(board, x, y, element) {
    if (isOutOf(board, x, y)) {
        return ELEMENT.WALL;
    }

    return isAt(board, x + 1, y, element) ||
        isAt(board, x - 1, y, element) ||
        isAt(board, x, y + 1, element) ||
        isAt(board, x, y - 1, element);
}

export function isOutOf(board, x, y) {
    const boardSize = getBoardSize(board);
    return x >= boardSize || y >= boardSize || x < 0 || y < 0;
}

export function getHeadPosition(board) {
    return getFirstPositionOf(board, [
        ELEMENT.HEAD_DOWN,
        ELEMENT.HEAD_LEFT,
        ELEMENT.HEAD_RIGHT,
        ELEMENT.HEAD_UP,
        ELEMENT.HEAD_DEAD,
        ELEMENT.HEAD_EVIL,
        ELEMENT.HEAD_FLY,
        ELEMENT.HEAD_SLEEP,
    ]);
}

export function getFirstPositionOf(board, elements) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var position = board.indexOf(element);
        if (position !== -1) {
            return getXYByPosition(board, position);
        }
    }
    return null;
}

export function getXYByPosition(board, position) {
    if (position === -1) {
        return null;
    }

    const size = getBoardSize(board);
    return {
        x: position % size,
        y: (position - (position % size)) / size
    };
}

export function getElementByXY(board, position) {
    const size = getBoardSize(board);
    return board[size * position.y + position.x];
}

export function objectValues(obj) {
    return Object.keys(obj).map(key => obj[key])
}

export function getDirection(vector1, vector2) {
    if (vector1.x > vector2.x) return COMMANDS.LEFT
    if (vector1.x < vector2.x) return COMMANDS.RIGHT
    if (vector1.y < vector2.y) return COMMANDS.DOWN
    if (vector1.y > vector2.y) return COMMANDS.UP
    return null
}

export function getEnemyLength(state, head) {

    let count = 1, items = [head], visitedPositions = [];

    const findBodyOrTail = (currentPosition) => {

        const enemy = {
            body: [],
            tail: null
        }

        const validSurroundings = getSurround(state.board, currentPosition.position)
            .filter(surround => !visitedPositions.find(({x, y}) => x === surround.position.x && y === surround.position.y))
            .filter(surround => {

                let isValidNextSurround = true

                switch (surround.direction) {
                    case COMMANDS.UP:

                        switch (currentPosition.item) {
                            case ELEMENT.ENEMY_HEAD_EVIL:
                            case ELEMENT.ENEMY_HEAD_FLY:
                            case ELEMENT.ENEMY_HEAD_SLEEP:
                            case ELEMENT.ENEMY_HEAD_DEAD:
                            case ELEMENT.ENEMY_HEAD_DOWN:
                            case ELEMENT.ENEMY_BODY_RIGHT_UP:
                            case ELEMENT.ENEMY_BODY_LEFT_UP:
                            case ELEMENT.ENEMY_BODY_VERTICAL:

                                isValidNextSurround = [
                                    ELEMENT.ENEMY_BODY_VERTICAL,
                                    ELEMENT.ENEMY_BODY_LEFT_DOWN,
                                    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
                                    ELEMENT.ENEMY_TAIL_END_UP,
                                    ELEMENT.ENEMY_TAIL_INACTIVE,
                                ].indexOf(surround.item) !== -1

                                break;
                            default:
                                isValidNextSurround = false

                        }

                        break
                    case COMMANDS.DOWN:

                        switch (currentPosition.item) {
                            case ELEMENT.ENEMY_HEAD_EVIL:
                            case ELEMENT.ENEMY_HEAD_FLY:
                            case ELEMENT.ENEMY_HEAD_SLEEP:
                            case ELEMENT.ENEMY_HEAD_DEAD:
                            case ELEMENT.ENEMY_HEAD_UP:
                            case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
                            case ELEMENT.ENEMY_BODY_LEFT_DOWN:
                            case ELEMENT.ENEMY_BODY_VERTICAL:

                                isValidNextSurround = [
                                    ELEMENT.ENEMY_BODY_VERTICAL,
                                    ELEMENT.ENEMY_BODY_LEFT_UP,
                                    ELEMENT.ENEMY_BODY_RIGHT_UP,
                                    ELEMENT.ENEMY_TAIL_END_DOWN,
                                    ELEMENT.ENEMY_TAIL_INACTIVE,
                                ].indexOf(surround.item) !== -1

                                break;
                            default:
                                isValidNextSurround = false

                        }

                        break
                    case COMMANDS.LEFT:

                        switch (currentPosition.item) {
                            case ELEMENT.ENEMY_HEAD_EVIL:
                            case ELEMENT.ENEMY_HEAD_FLY:
                            case ELEMENT.ENEMY_HEAD_SLEEP:
                            case ELEMENT.ENEMY_HEAD_DEAD:
                            case ELEMENT.ENEMY_HEAD_RIGHT:
                            case ELEMENT.ENEMY_BODY_LEFT_DOWN:
                            case ELEMENT.ENEMY_BODY_LEFT_UP:
                            case ELEMENT.ENEMY_BODY_HORIZONTAL:

                                isValidNextSurround = [
                                    ELEMENT.ENEMY_BODY_HORIZONTAL,
                                    ELEMENT.ENEMY_BODY_RIGHT_UP,
                                    ELEMENT.ENEMY_BODY_RIGHT_DOWN,
                                    ELEMENT.ENEMY_TAIL_END_LEFT,
                                    ELEMENT.ENEMY_TAIL_INACTIVE,
                                ].indexOf(surround.item) !== -1

                                break;
                            default:
                                isValidNextSurround = false

                        }

                        break
                    case COMMANDS.RIGHT:

                        switch (currentPosition.item) {
                            case ELEMENT.ENEMY_HEAD_EVIL:
                            case ELEMENT.ENEMY_HEAD_FLY:
                            case ELEMENT.ENEMY_HEAD_SLEEP:
                            case ELEMENT.ENEMY_HEAD_DEAD:
                            case ELEMENT.ENEMY_HEAD_LEFT:
                            case ELEMENT.ENEMY_BODY_RIGHT_UP:
                            case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
                            case ELEMENT.ENEMY_BODY_HORIZONTAL:

                                isValidNextSurround = [
                                    ELEMENT.ENEMY_BODY_HORIZONTAL,
                                    ELEMENT.ENEMY_BODY_LEFT_DOWN,
                                    ELEMENT.ENEMY_BODY_LEFT_UP,
                                    ELEMENT.ENEMY_TAIL_END_RIGHT,
                                    ELEMENT.ENEMY_TAIL_INACTIVE,
                                ].indexOf(surround.item) !== -1

                                break;
                            default:
                                isValidNextSurround = false

                        }

                        break

                }

                return isValidNextSurround
            })

        validSurroundings.forEach(surround => {

                switch (surround.item) {
                    case ELEMENT.ENEMY_TAIL_END_DOWN:
                    case ELEMENT.ENEMY_TAIL_END_LEFT:
                    case ELEMENT.ENEMY_TAIL_END_UP:
                    case ELEMENT.ENEMY_TAIL_END_RIGHT:
                    case ELEMENT.ENEMY_TAIL_INACTIVE:

                        ++count

                        enemy.tail = surround

                        visitedPositions.push(surround.position)

                        break;
                    case ELEMENT.ENEMY_BODY_HORIZONTAL:
                    case ELEMENT.ENEMY_BODY_VERTICAL:
                    case ELEMENT.ENEMY_BODY_LEFT_DOWN:
                    case ELEMENT.ENEMY_BODY_LEFT_UP:
                    case ELEMENT.ENEMY_BODY_RIGHT_DOWN:
                    case ELEMENT.ENEMY_BODY_RIGHT_UP:

                        ++count

                        enemy.body.push(surround)

                        visitedPositions.push(surround.position)

                        break;

                }
            })

        enemy.body.forEach(item => {
            items.push(item)
        })

        if (enemy.tail) {
            items.push(enemy.tail)
        }

        enemy.body.forEach(findBodyOrTail)
    }

    try {
        findBodyOrTail(head)
    } catch (e) {
        console.error(e);
    }

    let first = items[0].item
    let last = items[items.length - 1].item
    if (objectValues(ELEMENT.ENEMY_HEADS).indexOf(first) === -1 || objectValues(ELEMENT.ENEMY_TAILS).indexOf(last) === -1) {
        console.error('Invalid enemy ' + items.map(item => item.item).join(''))
    }

    return {
        positions: items,
        count
    }
}

export function getEnemies(state) {

    const {boardMatrix} = state;
    const enemies = {};

    boardMatrix.forEach((row, y) => {
        row.forEach((col, x) => {

            const key = x + ';' + y

            switch (col) {
                case ELEMENT.ENEMY_HEAD_DOWN:
                case ELEMENT.ENEMY_HEAD_LEFT:
                case ELEMENT.ENEMY_HEAD_RIGHT:
                case ELEMENT.ENEMY_HEAD_UP:
                case ELEMENT.ENEMY_HEAD_EVIL:
                case ELEMENT.ENEMY_HEAD_FLY:
                case ELEMENT.ENEMY_HEAD_SLEEP:
                case ELEMENT.ENEMY_HEAD_DEAD:

                    const head = {position: {x, y}, item: col}
                    const enemyPositions = getEnemyLength(state, head)

                    enemies[key] = {
                        snakeLength: enemyPositions.count,
                        bodyPositions: enemyPositions.positions,
                        isSleep: false,
                        isDead: false,
                        isFury: false,
                        isFlying: false,
                        headPosition: head.position
                    }
                    break
            }

            if (enemies[key] !== undefined) {
                switch (col) {
                    case ELEMENT.ENEMY_HEAD_SLEEP:
                        enemies[key].isSleep = true
                        break;
                    case ELEMENT.ENEMY_HEAD_DEAD:
                        enemies[key].isDead = true
                        break;
                    case ELEMENT.ENEMY_HEAD_EVIL:
                        enemies[key].isFury = true
                        break;
                    case ELEMENT.ENEMY_HEAD_FLY:
                        enemies[key].isFlying = true
                        break;
                }
            }
        })
    })

    return objectValues(enemies)
}

export function getSurround(board, position) {
    return [
        {
            direction: COMMANDS.LEFT,
            item: getElementByXY(board, {x: position.x - 1, y: position.y}),
            position: {x: position.x - 1, y: position.y}
        },
        {
            direction: COMMANDS.UP,
            item: getElementByXY(board, {x: position.x, y: position.y - 1}),
            position: {x: position.x, y: position.y - 1}
        },
        {
            direction: COMMANDS.RIGHT,
            item: getElementByXY(board, {x: position.x + 1, y: position.y}),
            position: {x: position.x + 1, y: position.y}
        },
        {
            direction: COMMANDS.DOWN,
            item: getElementByXY(board, {x: position.x, y: position.y + 1}),
            position: {x: position.x, y: position.y + 1}
        },
    ];
}

export function isSameVector(vec1, vec2) {
    return vec1.x === vec2.x && vec1.y === vec2.y
}