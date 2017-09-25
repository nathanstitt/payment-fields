export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelCase(str) {
    return str.replace(/-([a-z])/gi, (s, c, i) => (0 === i ? c : c.toUpperCase()));
}

export function camelCaseKeys(src) {
    if (!src) return {};
    const dest = {};
    const keys = Object.keys(src);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        dest[camelCase(key)] = src[key];
    }
    return dest;
}
