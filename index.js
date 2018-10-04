const uuidv4 = require('uuid/v4');
const dicFunc = {};

export function getId() {
    return uuidv4();
}

export function addListener(event, idEvent = uuidv4(), cb) {
    if (!cb) return;
    if (!dicFunc[event]) dicFunc[event] = [];
    if (dicFunc[event].find(item => item.id === idEvent)) return;
    dicFunc[event].push({
        id: idEvent,
        func: cb
    });
    return idEvent;
};

export function emit(event, data) {
    if (!dicFunc[event]) return;
    dicFunc[event].map(item => item.func(data));
};

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
};

export function deleteEvent(event) {
    delete dicFunc[event];
};

export function deleteByIdEvent(idEvent) {
    if (!dicFunc) return;
    Object.keys(dicFunc).map(event => {
        deleteListener(event, idEvent);
    });
};
