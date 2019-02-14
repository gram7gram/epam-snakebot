/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import {objectValues} from "./utils";

export const ELEMENT = {
    NONE: ' ',
    WALL: '☼',
    START_FLOOR: '#',
    OTHER: '?',

    APPLE: '○',
    STONE: '●',
    FLYING_PILL: '©',
    FURY_PILL: '®',
    GOLD: '$',

    // игрок
    HEAD_DOWN: '▼',
    HEAD_LEFT: '◄',
    HEAD_RIGHT: '►',
    HEAD_UP: '▲',
    HEAD_DEAD: '☻',
    HEAD_EVIL: '♥',
    HEAD_FLY: '♠',
    HEAD_SLEEP: '&',

    BODY_HORIZONTAL: '═',
    BODY_VERTICAL: '║',
    BODY_LEFT_DOWN: '╗',
    BODY_LEFT_UP: '╝',
    BODY_RIGHT_DOWN: '╔',
    BODY_RIGHT_UP: '╚',
    
    SNAKE_BODIES: {
        BODY_HORIZONTAL: '═',
        BODY_VERTICAL: '║',
        BODY_LEFT_DOWN: '╗',
        BODY_LEFT_UP: '╝',
        BODY_RIGHT_DOWN: '╔',
        BODY_RIGHT_UP: '╚',
    },

    TAIL_END_DOWN: '╙',
    TAIL_END_LEFT: '╘',
    TAIL_END_UP: '╓',
    TAIL_END_RIGHT: '╕',
    TAIL_INACTIVE: '~',

    SNAKE_TAILS: {
        TAIL_END_DOWN: '╙',
        TAIL_END_LEFT: '╘',
        TAIL_END_UP: '╓',
        TAIL_END_RIGHT: '╕',
        TAIL_INACTIVE: '~',
    },

    // противник
    ENEMY_HEADS: {
        ENEMY_HEAD_DOWN: '˅',
        ENEMY_HEAD_LEFT: '<',
        ENEMY_HEAD_RIGHT: '>',
        ENEMY_HEAD_UP: '˄',
        ENEMY_HEAD_DEAD: '☺',
        ENEMY_HEAD_EVIL: '♣',
        ENEMY_HEAD_FLY: '♦',
        ENEMY_HEAD_SLEEP: 'ø',
    },

    ENEMY_HEAD_DOWN: '˅',
    ENEMY_HEAD_LEFT: '<',
    ENEMY_HEAD_RIGHT: '>',
    ENEMY_HEAD_UP: '˄',
    ENEMY_HEAD_DEAD: '☺',
    ENEMY_HEAD_EVIL: '♣',
    ENEMY_HEAD_FLY: '♦',
    ENEMY_HEAD_SLEEP: 'ø',

    ENEMY_BODIES: {
        ENEMY_BODY_HORIZONTAL: '─',
        ENEMY_BODY_VERTICAL: '│',
        ENEMY_BODY_LEFT_DOWN: '┐',
        ENEMY_BODY_LEFT_UP: '┘',
        ENEMY_BODY_RIGHT_DOWN: '┌',
        ENEMY_BODY_RIGHT_UP: '└'
    },

    ENEMY_BODY_HORIZONTAL: '─',
    ENEMY_BODY_VERTICAL: '│',
    ENEMY_BODY_LEFT_DOWN: '┐',
    ENEMY_BODY_LEFT_UP: '┘',
    ENEMY_BODY_RIGHT_DOWN: '┌',
    ENEMY_BODY_RIGHT_UP: '└',

    ENEMY_TAILS: {
        ENEMY_TAIL_END_DOWN: '¤',
        ENEMY_TAIL_END_LEFT: '×',
        ENEMY_TAIL_END_UP: 'æ',
        ENEMY_TAIL_END_RIGHT: 'ö',
        ENEMY_TAIL_INACTIVE: '*',
    },

    ENEMY_TAIL_END_DOWN: '¤',
    ENEMY_TAIL_END_LEFT: '×',
    ENEMY_TAIL_END_UP: 'æ',
    ENEMY_TAIL_END_RIGHT: 'ö',
    ENEMY_TAIL_INACTIVE: '*',
};

ELEMENT.ENEMY_HEADS = objectValues(ELEMENT.ENEMY_HEADS)
ELEMENT.ENEMY_BODIES = objectValues(ELEMENT.ENEMY_BODIES)
ELEMENT.ENEMY_TAILS = objectValues(ELEMENT.ENEMY_TAILS)
ELEMENT.SNAKE_BODIES = objectValues(ELEMENT.SNAKE_BODIES)
ELEMENT.SNAKE_TAILS = objectValues(ELEMENT.SNAKE_TAILS)

export const COMMANDS = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    ACT: 'ACT', // drop stone if any
    DIE: 'ACT(0)',
};

export const SECTORS = {
    TOP_LEFT: 'TOP_LEFT',
    TOP_RIGHT: 'TOP_RIGHT',
    BOTTOM_LEFT: 'BOTTOM_LEFT',
    BOTTOM_RIGHT: 'BOTTOM_RIGHT',
};

export const MAP = {
    WALKABLE: 0,
    BLOCKED: 1,
};
