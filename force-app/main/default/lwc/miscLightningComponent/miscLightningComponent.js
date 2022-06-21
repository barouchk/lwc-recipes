import { LightningComponent } from 'c/lightningComponent';

export default class MiscLightningComponent extends LightningComponent {

    connectedCallback() {
        console.log('state before >> ', this.state)
        this.handleError('test message');
        this.setState({ isLoading: true })
        console.log('state after>> ', this.state)
    }
}