import _ from 'lodash';
import cycle2 from './cyclic2.st'

const EXAMPLES = [
    {name: "Empty", content: ""},
    {name: "Cycle2", content: cycle2}
]

export function getExample(str) {
    return _.find(EXAMPLES, (ex) => (ex.name === str))
}

export function getExamples() {
    return EXAMPLES
}