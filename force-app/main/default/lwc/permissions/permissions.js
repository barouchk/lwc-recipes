/**
 * Created by bkandov on 01/02/2021.
 */

import {LightningElement, wire, track} from 'lwc';
import getObjectPermissions from '@salesforce/apex/PermissionSetController.getObjectPermissions'
import getFieldPermissions from '@salesforce/apex/PermissionSetController.getFieldPermissions'

export default class Permissions extends LightningElement {

    @track columns = []
    @track fieldPermissions

    @track objects = []
    @track selectedObject = ''

    @track isLoading = true

    @wire(getObjectPermissions, {})
    wiredObjectPermissions({data, error}) {
        console.log('test')
        if (data) {
            for (let column of data) {
                this.objects.push({label: column.SobjectType, value: column.SobjectType})
            }
            console.log('objects >> ', this.objects)
            this.isLoading = false
        } else if (error) {
            console.log('error >> ', error)
            this.isLoading = false
        }
    }

    @wire(getFieldPermissions, {sobjectType: '$selectedObject'})
    wiredFieldPermissions({data, error}) {
        console.log('test1')
        if (data) {
            if (data.length > 0) {

                this.columns = [
                    {label: 'Field', fieldName: 'Field'}]



                let columnsSet = []
                for (let fieldPer of data) {
                    let profileId = fieldPer.ParentId
                    if (!columnsSet.includes(profileId)) {
                        columnsSet.push(profileId)
                        this.columns.push({
                            label: profileId,
                            fieldName: profileId
                        })
                    }
                }

                console.log('columns >> ', this.columns)

            }
            this.isLoading = false
        } else if (error) {
            console.log('error >> ', error)
        }

    }

    handleChange(event) {
        const {value} = event.detail
        this.selectedObject = value
        this.isLoading = true
    }

}