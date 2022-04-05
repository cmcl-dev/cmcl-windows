//https://www.cnblogs.com/soonK/p/15073778.html
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let index = 0; index < keys1.length; index++) {
        const val1 = object1[keys1[index]];
        const val2 = object2[keys2[index]];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2) {
            return false;
        }
    }

    return true;
}
function Unique(arr) {
    let newArr = []
    for (let i = 0, l = arr.length; i < l; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
            newArr.push(arr[i])
        }
    }
    return newArr;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}
function defaultDeepCopy(target) {
    const newTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
        if (typeof target[key] === "object" && target[key] !== null) {
            newTarget[key] = defaultDeepCopy(target[key]);
        } else {
            newTarget[key] = target[key];
        }
    }
    return newTarget;
}
module.exports = function fullDeepCopy(target, ...args) {
    let NewTarget = defaultDeepCopy(target);
    for (const i in args) {
        for (const key in args[i]) {
            if (args[i][key].constructor == Array) {
                //Combine
                if (NewTarget[key] && NewTarget[key].constructor == Array) {
                    NewTarget[key] = NewTarget[key].concat(args[i][key]);
                }
                else {
                    NewTarget[key] = args[i][key];
                }

            }
            else if (typeof args[i][key] === "object" && args[i][key] !== null) {
                if (typeof NewTarget[key] === "object" && NewTarget[key] !== null) {
                    NewTarget[key] = fullDeepCopy(NewTarget[key], args[i][key]);
                }
                else {
                    NewTarget[key] = args[i][key];
                }
            }
            else {
                NewTarget[key] = args[i][key];
            }
        }
    }
    return NewTarget;
}
module.exports.defaultDeepCopy=defaultDeepCopy;
//fullDeepCopy([1,2],[3,4])=
//fullDeepCopy([1,2],3)