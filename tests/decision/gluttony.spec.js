
import {
    getEnemiesInSurroundings,
} from '../../decision/gluttony';
import {getBoardAsMatrix, getEnemies} from "../../utils";

describe("gluttony", () => {

    describe("getEnemiesInSurroundings", ()=> {
        it("should return 1 enemy when there is enemy in surroundings", ()=> {
            const board =
                '☼☼☼☼☼☼' +
                '☼ ┌♣ ☼' +
                '☼ │○ ☼' +
                '☼ │  ☼' +
                '☼ ¤  ☼' +
                '☼☼☼☼☼☼';

            const state = {
                board,
                boardMatrix: getBoardAsMatrix(board),
                snake: {
                    snakeLength: 2,
                    canEatStone: false,
                    isFury: false,
                    isFlying: false,
                    isSleep: false,
                    headPosition: null,
                    previousHeadPosition: null,
                },
            }

            state.enemies = getEnemies(state)

            const res = getEnemiesInSurroundings(state, {x: 3, y: 2}); //○
            expect(res.length).toEqual(1);
        });

        it("should return 3 enemies when there is enemy in surroundings", ()=> {
            const board =
                '☼☼☼☼☼☼' +
                '☼ æ♣ ☼' +
                '☼ ˄○˄☼' +
                '☼ ¤ ¤☼' +
                '☼    ☼' +
                '☼☼☼☼☼☼';

            const state = {
                board,
                boardMatrix: getBoardAsMatrix(board),
                snake: {
                    snakeLength: 2,
                    canEatStone: false,
                    isFury: false,
                    isFlying: false,
                    isSleep: false,
                    headPosition: null,
                    previousHeadPosition: null,
                },
            }

            state.enemies = getEnemies(state)

            const res = getEnemiesInSurroundings(state, {x: 3, y: 2}); //○
            expect(res.length).toEqual(3);
        });

        it("should return [] when there is no enemy in surroundings", ()=> {
            const board =
                '☼☼☼☼☼☼' +
                '☼○   ☼' +
                '☼    ☼' +
                '☼ ┌♣ ☼' +
                '☼ ¤  ☼' +
                '☼☼☼☼☼☼';

            const state = {
                board,
                boardMatrix: getBoardAsMatrix(board),
                snake: {
                    snakeLength: 2,
                    canEatStone: false,
                    isFury: false,
                    isFlying: false,
                    isSleep: false,
                    headPosition: null,
                    previousHeadPosition: null,
                },
            }

            state.enemies = getEnemies(state)

            const res = getEnemiesInSurroundings(state, {x: 1, y: 1}); //○
            expect(res.length).toEqual(0);
        });
    })
});
