function arrayEqualsArray(a, b) {
    if (a == null || b == null) {return false}
    if (a.length != b.length) {return false}

    for (let i = 0; i < a.length; i++){
        if (a[i] !== b[i]) {return false}
    };
    return true;
}

function isArrayInArray(a, b) {
    for (let i = 0; i < a.length; i++) {
        if (a[i][0] == b[0] && a[i][1] == b[1]) {
            return true;
        }
    }
    return false;
}

export {arrayEqualsArray, isArrayInArray}