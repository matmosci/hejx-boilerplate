const clearEventListener = {
    element: document,
    event: "htmx:beforeSwap",
    handler: unregisterEventListeners
};

const events = [];

function register(eventListenersData) {
    Array.isArray(eventListenersData) ? eventListenersData.forEach(e => events.push(e)) : events.push(eventListenersData);
    events.push(clearEventListener);
    events.forEach(({ element, event, handler }) => element.addEventListener(event, handler));
}

function unregisterEventListeners(e) {
    if (e.target !== document.body) return;
    events.forEach(({ element, event, handler }) => element.removeEventListener(event, handler));
    events.length = 0;
}

export default { register };
