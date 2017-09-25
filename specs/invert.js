export default function invert(obj) {
    var inverted = {};
    for (var prop in obj) {
        inverted[obj[prop]] = prop;
    }
    return inverted;
};
