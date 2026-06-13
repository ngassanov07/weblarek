import { Component } from '../base/Component';

export class Gallery extends Component<object> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(items?: HTMLElement[]): HTMLElement {
        if (items) {
            this.container.replaceChildren(...items);
        }
        return this.container;
    }
}
