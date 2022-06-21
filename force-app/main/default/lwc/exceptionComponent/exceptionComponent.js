/**
 * Created by bkandov on 07/10/2020.
 */

import {LightningComponent} from 'c/lightningComponent'

import callApex from '@salesforce/apex/ApexCalloutController.callApex'
import callApexException from '@salesforce/apex/ApexCalloutController.callApexException'
import {showToast} from "c/toastService";

export default class ExceptionComponent extends LightningComponent {

    fetchApexCall(isSuccess) {
        callApex({isSuccess})
            .then(this.handleApexCallResponse.bind(this))
            .catch(error => {
                console.log('callApex error >> ', error)
                this.handleError(error.body.message)
            })
            .finally(() => {
                this.setState({isLoading: false})
            })
    }

    handleApexCallResponse(res) {
        console.log('callApex response >> ', res)

        const {success, data, message} = res
        if (success) {
            console.log('data >> ', data)
            if (message) {
                showToast.call(this, 'title', message, 'success')
            }
        } else {
            showToast.call(this, 'title', message, 'warning', 'sticky')
        }
    }

    fetchApexCallException() {
        callApexException()
            .then(data => {
                console.log('callApexException data >> ', data)
            })
            .catch(error => {
                console.log('callApexException error >> ', error)
                this.handleError(error.body.message)
            })
            .finally(() => {
                this.setState({isLoading: false})
            })
    }

    handleButtonSuccessClicked() {
        this.setState({isLoading: true})
        this.fetchApexCall(true)
    }

    handleButtonErrorClicked() {
        this.setState({isLoading: true})
        this.fetchApexCall(false)
    }

    handleButtonExceptionClicked() {
        this.setState({isLoading: true})
        this.fetchApexCallException()
    }

}