import React, { useState } from 'react';
import { Modal, Form }  from 'react-bootstrap';
import { toast } from 'react-toastify'
import CreateButton from '../CreateButton';
import packageJson from '../../../package.json';

function AddProjectModal(props){

    const [projectName, setProjectName] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('name', projectName);
        fetch(`${packageJson.apihost}/api/projects/types/create.php`, {
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
                    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
                    toast.success(<div>{response.message} <a href="">Please reload</a></div>);
                } else {
                    toast.error(response.message);
                }
                props.fetchData();
            },
            (error) => {
                toast.error('Error occured');
                console.log(error);
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
                    <CreateButton/>
                </Modal.Footer>
            </Form>
        </Modal>
    );

}

export default AddProjectModal;
