document.addEventListener('DOMContentLoaded', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', window.location.href, true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            const newUrl = xhr.getResponseHeader('X-Set-Url');
            if (newUrl) {
                history.pushState(null, '', newUrl);
            }
        }
    };
    xhr.send();
});