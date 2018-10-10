const uuidv4 = require('uuid/v4');
const dicFunc = {};
const dicPTC = {};

const Emitter = {
    getId: () => {
        return uuidv4();
    },
    addListener: (event, id, cb) => {
        if (!cb) return;
        if (!dicFunc[event]) dicFunc[event] = [];
        const idEvent = id || Emitter.getId();
        if (dicFunc[event].find(item => item.id === idEvent)) return;
        dicFunc[event].push({
            id: idEvent,
            func: cb
        });
        return idEvent;
    },
    emit: (event, data) => {
        if (!dicFunc[event]) return;
        dicFunc[event].map(item => item.func(data));
    },
    deleteListener: (event, idEvent) => {
        if (!dicFunc[event]) return;
        let index = -1;
        for (let i = 0; i < dicFunc[event].length; i++) {
            if (dicFunc[event][i].id === idEvent) {
                index = i;
                break;
            }
        }
        if (index !== -1) dicFunc[event].splice(index, 1);
    },
    deleteEvent: event => {
        delete dicFunc[event];
    },
    deleteByIdEvent: idEvent => {
        if (!dicFunc) return;
        Object.keys(dicFunc).map(event => {
            Emitter.deleteListener(event, idEvent);
        });
    },
    addChildPTC: (parentID, childID, func) => {
        dicPTC[parentID] = dicPTC[parentID] || [];
        if (dicPTC[parentID].find(a => a.childID === childID)) return;
        dicPTC[parentID].push({
            childID,
            func
        });
    },
    parentEmitPTC: (parentID, param = {}, isPromise) => {
        return new Promise(resolve => {
            if (!dicPTC[parentID]) return resolve();
            const listResul = dicPTC[parentID].map(item => item.func(param));
            return isPromise
                ? Promise.all(listResul).then(resolve)
                : resolve(listResul);
        });
    },
    removeChildPTC: (parentID, childID) => {
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
};

module.exports = Emitter;
