const uuidv4 = require('uuid/v4');
const dicFunc = {};

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
    }
};

module.exports = Emitter;
