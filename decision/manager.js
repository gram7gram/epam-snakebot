import gluttony from './gluttony'
import wrath from './wrath'
import greed from './greed'
import lust from './lust'
import pride from './pride'
import {COMMANDS} from "../constants";

const behaviors = {
    lust,
    greed,
    wrath,
    gluttony,
    pride,
}

export function decide(state) {

    let decision = null;

    Object.keys(behaviors).forEach(name => {

        if (!decision) {

            const behavior = behaviors[name]

            decision = behavior(state)

            if (decision) {
                console.log(name, decision)

                if (!validate(state, decision)) {
                    console.error(`Invalid ${name} decision`, decision, JSON.parse(JSON.stringify(state)))
                }

                return false
            }

        }
    })

    return decision
}

const validate = (state, decision) => {

    switch (state.prevDecision) {
        case COMMANDS.RIGHT:
            return [COMMANDS.UP, COMMANDS.DOWN, COMMANDS.RIGHT, COMMANDS.DIE].indexOf(decision) !== -1
        case COMMANDS.UP:
            return [COMMANDS.UP, COMMANDS.RIGHT, COMMANDS.LEFT, COMMANDS.DIE].indexOf(decision) !== -1
        case COMMANDS.DOWN:
            return [COMMANDS.RIGHT, COMMANDS.DOWN, COMMANDS.LEFT, COMMANDS.DIE].indexOf(decision) !== -1
        case COMMANDS.LEFT:
            return [COMMANDS.LEFT, COMMANDS.DOWN, COMMANDS.UP, COMMANDS.DIE].indexOf(decision) !== -1
    }

    return true
}