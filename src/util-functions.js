import faker from 'faker';

export function RANGE(start, stop, step = 1) {
    if (stop === undefined) {
        return RANGE(0, start);
    }
    const count = Math.max(Math.ceil((stop - start) / step), 0);
    return [...Array(count).keys()].map(x => x * step + start);
}

export function CHOICE(enumList) {
    return faker.helpers.randomize(enumList);
}

export function RANDINT(minValue, maxValue) {
    return faker.random.number({ min: minValue, max: maxValue });
}

export function FAKE(mustache) {
    return faker.fake(mustache);
}

export function RECURSIVE_REPLACE(
    obj,
    target = [],
    filterCond = value => value === null
) {
    if (filterCond(obj)) return target;
    if (typeof obj === 'object')
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = RECURSIVE_REPLACE(obj[key], target, filterCond);
            }
        }
    return obj;
}
