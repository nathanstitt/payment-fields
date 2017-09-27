export default function invert(obj) {
    const inverted = {};
    for (let prop in obj) { // eslint-disable-line
        inverted[obj[prop]] = prop;
    }
    return inverted;
}
