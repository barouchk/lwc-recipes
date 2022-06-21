import { LightningElement, track, api } from 'lwc'

export default class TestContainer extends LightningElement {

    @api recordId
    valueId = ''

    numbers = Array(10).keys()

    changeValue(event) {
        this.valueId = this.valueId ? '' : this.recordId
    }
}