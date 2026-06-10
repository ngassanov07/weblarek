import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Gallery extends Component<HTMLElement[]> {
    constructor(container: string | HTMLElement = '.gallery') {
        super(ensureElement<HTMLElement>(container));
    }

    render(items?: HTMLElement[]): HTMLElement {
        if (items) {
            this.container.replaceChildren(...items);
        }
        return this.container;
    }
}
