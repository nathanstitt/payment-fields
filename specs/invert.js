export default function invert(obj) {
    return Object.keys(obj).reduce((inverted, key) => {
        inverted[obj[key]] = key; // eslint-disable-line no-param-reassign
        return inverted;
    }, {});
}
