import gluttony from './gluttony'
import wrath from './wrath'
import greed from './greed'
import {COMMANDS} from "../constants";

export function decide(state) {

    let decision = greed(state)
    if (decision) {
        console.log('greed', decision)

        if (!validate(state, decision)) {
            console.error('Invalid greed decision', decision, JSON.parse(JSON.stringify(state)))
        }
    }

    if (!decision) {
        decision = wrath(state)
        if (decision) {
            console.log('wrath', decision)

            if (!validate(state, decision)) {
                console.error('Invalid wrath decision', decision, JSON.parse(JSON.stringify(state)))
            }
        }
    }

    if (!decision) {
        decision = gluttony(state)
        if (decision) {
            console.log('gluttony', decision)

            if (!validate(state, decision)) {
                console.error('Invalid gluttony decision', decision, JSON.parse(JSON.stringify(state)))
            }
        }
    }

    return decision
}

const validate = (state, decision) => {

    switch (state.prevDecision) {
        case COMMANDS.RIGHT:
            return [COMMANDS.UP, COMMANDS.DOWN, COMMANDS.RIGHT].indexOf(decision) !== -1
        case COMMANDS.UP:
            return [COMMANDS.UP, COMMANDS.RIGHT, COMMANDS.LEFT].indexOf(decision) !== -1
        case COMMANDS.DOWN:
            return [COMMANDS.RIGHT, COMMANDS.DOWN, COMMANDS.LEFT].indexOf(decision) !== -1
        case COMMANDS.LEFT:
            return [COMMANDS.LEFT, COMMANDS.DOWN, COMMANDS.UP].indexOf(decision) !== -1
    }

    return true
}