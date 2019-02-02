
import lust from '../../decision/lust';
import {getBoardAsMatrix, getHeadPosition, getSnakeLength} from "../../utils";
import {COMMANDS} from "../../constants";

describe("lust", () => {

    it("should return direction to snake body part, tail or enemy if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼╔╗    ☼' +
            '☼☼║║    ☼' +
            '☼☼▼║    ☼' +
            '☼☼╘╝    ☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x, y: head.y - 1},
            },
        }

        const res = lust(state);

        expect(res).not.toBe(null);

        expect([COMMANDS.DOWN, COMMANDS.RIGHT].indexOf(res)).not.toBe(-1);
    });

    it("should return RIGHT direction to snake body part if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼╔╗    ☼' +
            '☼☼▼╙    ☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x, y: head.y - 1},
            },
        }

        const res = lust(state);

        expect(res).toBe(COMMANDS.RIGHT);
    });

    it("should return LEFT direction to snake body part if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼    ╔╗☼' +
            '☼☼    ╙▼☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x, y: head.y - 1},
            },
        }

        const res = lust(state);

        expect(res).toBe(COMMANDS.LEFT);
    });

    it("should return UP direction to snake body part if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼    ╔╕☼' +
            '☼☼    ╚►☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x - 1, y: head.y},
            },
        }

        const res = lust(state);

        expect(res).toBe(COMMANDS.UP);
    });

    it("should return DOWN direction to snake body part if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼    ╔►☼' +
            '☼☼    ╚╕☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x - 1, y: head.y},
            },
        }

        const res = lust(state);

        expect(res).toBe(COMMANDS.DOWN);
    });

    it("should return direction to enemy if surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼æ     ☼' +
            '☼☼│     ☼' +
            '☼☼└───> ☼' +
            '☼☼▲●    ☼' +
            '☼☼║●    ☼' +
            '☼☼╙●    ☼' +
            '☼☼      ☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x, y: head.y + 1},
            },
        }

        const res = lust(state);

        expect(res).toBe(COMMANDS.UP);
    });

    it("should not return direction if not surrounded", ()=> {
        const board =
            '☼☼☼☼☼☼☼☼☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼      ☼' +
            '☼☼╔╗    ☼' +
            '☼☼║║    ☼' +
            '☼☼▼╙    ☼' +
            '☼☼      ☼' +
            '☼☼☼☼☼☼☼☼☼';

        const head = getHeadPosition(board)

        const state = {
            board,
            boardMatrix: getBoardAsMatrix(board),
            snake: {
                snakeLength: getSnakeLength(board),
                headPosition: head,
                previousHeadPosition: {x: head.x, y: head.y - 1},
            },
        }

        const res = lust(state);

        expect(res).toBe(null);
    });
});
