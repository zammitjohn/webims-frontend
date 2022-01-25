import React, { useState } from 'react';
import { Modal, Form }  from 'react-bootstrap';
import CreateButton from '../CreateButton';
import { toast } from 'react-toastify'

function RegisterItemModal(props){

    const [values, setValues] = useState({ // form values
        serialNumber: '',
        datePurchased: '',
    });

    const handleChange = (event) => {
        const { id, value } = event.target;
        const fieldValue = { [id]: value };

            setValues({
                ...values,
                ...fieldValue,
            });
    };

    const handleCreate = event => {
        event.preventDefault();

        let formData = new FormData();
        formData.append('inventoryId', props.inventoryId);
        formData.append('serialNumber', values.serialNumber);
        formData.append('datePurchased', values.datePurchased);

        fetch('http://site.test/WebIMS/api/registry/create', {
          headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
          },  
          method: 'POST',    
          body: formData
          })
          .then(res => res.json())
          .then(
            (response) => {
              if (response.status) {
                toast.success(response.serialNumber + ": "  + response.message);
                props.setRegistryComponentKey(props.registryComponentKey+1); // to update parent's child compoenent
              } else {
                toast.error(response.message);  
              }
            },
            (error) => {
              toast.error('Error occured');
            }
          )

        props.handleModalClose(); // close modal
    }


    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose}>
            <Modal.Header>
                <Modal.Title>Register Item</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleCreate}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="serialNumber">Serial Number</Form.Label>
                        <Form.Control value={values.serialNumber} onChange={handleChange} type="text" maxLength="255" id="serialNumber" placeholder="Enter serial number"/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="datePurchased">Date Purchased</Form.Label>
                        <Form.Control value={values.datePurchased} onChange={handleChange} type="date" id="datePurchased"/>
                    </Form.Group>  
                </Modal.Body>
                <Modal.Footer>
                    <CreateButton />
                </Modal.Footer>
            </Form>

        </Modal>    
    );



}

export default RegisterItemModal;