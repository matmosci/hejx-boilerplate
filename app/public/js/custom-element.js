const template = document.createElement("template");
template.innerHTML = `
    <style>
        h1 {
            margin-bottom: 0;
        }
        div {
            margin-bottom: 1rem;
        }
    </style>
    <div>
        <h1></h1>
        <slot></slot>
    </div>
`;

class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        console.log("Custom element added to page.");
        const exampleAttributeValue = this.getAttribute("name");
        exampleAttributeValue && (this.shadowRoot.querySelector("h1").textContent = `Hello, ${exampleAttributeValue}`);
    }

    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }
}

customElements.define("custom-element", CustomElement);
