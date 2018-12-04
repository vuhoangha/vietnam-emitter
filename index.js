const uuidv4 = require('uuid/v4');
const dicFunc = {};
const dicPTC = {};

export function getId() {
    return uuidv4();
}

export function addListener(event, id, cb) {
    if (!cb) return;
    if (!dicFunc[event]) dicFunc[event] = [];
    const idEvent = id || getId();
    if (dicFunc[event].find(item => item.id === idEvent)) return;
    dicFunc[event].push({
        id: idEvent,
        func: cb
    });
    return idEvent;
}

export function emit(event, data) {
    if (!dicFunc[event]) return;
    dicFunc[event].map(item => item.func(data));
}

export function deleteListener(event, idEvent) {
    if (!dicFunc[event]) return;
    let index = -1;
    for (let i = 0; i < dicFunc[event].length; i++) {
        if (dicFunc[event][i].id === idEvent) {
            index = i;
            break;
        }
    }
    if (index !== -1) dicFunc[event].splice(index, 1);
}

export function deleteEvent(event) {
    delete dicFunc[event];
}

export function deleteByIdEvent(idEvent) {
    if (!dicFunc) return;
    Object.keys(dicFunc).map(event => {
        deleteListener(event, idEvent);
    });
}

export function addChildPTC(parentID, childID, func) {
    dicPTC[parentID] = dicPTC[parentID] || [];
    if (dicPTC[parentID].find(a => a.childID === childID)) return;
    dicPTC[parentID].push({
        childID,
        func
    });
}

export function parentEmitPTC(parentID, param = {}, isPromise) {
    return new Promise(resolve => {
        if (!dicPTC[parentID]) return resolve();
        const listResul = dicPTC[parentID].map(item => item.func(param));
        return isPromise
            ? Promise.all(listResul).then(resolve)
            : resolve(listResul);
    });
}

export function removeChildPTC(parentID, childID) {
    if (!dicPTC || !dicPTC[parentID]) return;

    let index = -1;
    for (let i = 0; i < dicPTC[parentID].length; i++) {
        if (dicPTC[parentID][i].childID === childID) {
            index = i;
            break;
        }
    }
    if (index !== -1) dicPTC[parentID].splice(index, 1);
}
