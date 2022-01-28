import React, { useState } from 'react';
import { Modal, Button, Form }  from 'react-bootstrap';
import { toast } from 'react-toastify'

function AddProjectModal(props){

    const [projectName, setProjectName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('name', projectName);
        fetch('http://site.test/WebIMS/api/projects/types/create', {
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
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
                props.fetchData();
            },
            (error) => {
                toast.error('Error occured');
            }
        )
        props.handleModalClose();  // close modal
    }

    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header>
                    <Modal.Title>Add Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control value={projectName} onChange={(e) => setProjectName(e.target.value)} type="text"  maxLength="20" placeholder="Enter project name"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="secondary">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );

}

export default AddProjectModal;
