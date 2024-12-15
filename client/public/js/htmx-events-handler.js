function register(eventListerersData) {
    Array.isArray(eventListerersData) ? eventListerersData.forEach(registerEventListener) : registerEventListener(eventListerersData);
}

function registerEventListener(eventListener) {
    eventListener.element.addEventListener(eventListener.event, eventListener.handler);
    document.body.addEventListener("htmx:beforeSwap", (e) => unregisterEventListener(e, eventListener));
}

function unregisterEventListener(e, eventListener) {
    if (e.target !== document.body) return;
    const { element, event, handler } = eventListener;
    element.removeEventListener(event, handler);
}

export default { register };
