const jibbaFiles = {
    iframe: document.createElement("iframe"),
    responseResolve: null,
    currentToken: localStorage.getItem("jibba-files-api-token"),

    message(data) {
        setTimeout(() => jibbaFiles.iframe.contentWindow.postMessage(data), 0);
    },

    twoWayMessage(data) {
        jibbaFiles.message(data);
        return new Promise(resolve =>
            jibbaFiles.responseResolve = resolve
        );
    },

    filesApiCall(action, data) {
        return jibbaFiles.twoWayMessage({
            action: action,
            data: data,
            token: jibbaFiles.currentToken,
        });
    },


    async registerAppWithPermissions(appName, override=false) {
        if (jibbaFiles.currentToken && !override) return jibbaFiles.currentToken;

        jibbaFiles.iframe.style.display = "initial";
        setTimeout(() => {
            jibbaFiles.iframe.style.opacity = "1";
        }, 1);

        const token = await jibbaFiles.filesApiCall("registerAppWithPermissions", ["Fluent"]);

        setTimeout(() => {
            jibbaFiles.iframe.style.opacity = "0";
            setTimeout(() => jibbaFiles.iframe.style.display = "none", 250);
        }, 300);

        jibbaFiles.currentToken = token;
        localStorage.setItem("jibba-files-api-token", jibbaFiles.currentToken);
        return token;
    },
};

jibbaFiles.iframe.src = "http://localhost:63342/files/embed.html";
document.body.appendChild(jibbaFiles.iframe);

jibbaFiles.iframe.style.position = "fixed";
jibbaFiles.iframe.style.top = "0";
jibbaFiles.iframe.style.left = "0";
jibbaFiles.iframe.style.width = "100vw";
jibbaFiles.iframe.style.height = "100vh";
jibbaFiles.iframe.style.border = "none";
jibbaFiles.iframe.style.display = "none";
jibbaFiles.iframe.style.opacity = "0";
jibbaFiles.iframe.style.transition = "opacity .4s";
jibbaFiles.iframe.style.zIndex = "999999999999";

jibbaFiles.iframe.sandbox.add("allow-scripts");

window.onmessage = e => {
    jibbaFiles.responseResolve(e.data);
};

function waitForApiReady() {
    return new Promise(resolve => {
        jibbaFiles.responseResolve = resolve;
    })
}







































