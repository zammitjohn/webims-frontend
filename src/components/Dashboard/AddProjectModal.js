import React, { useRef } from 'react';
import { Modal, Form }  from 'react-bootstrap';
import { toast } from 'react-toastify'
import CreateButton from '../CreateButton';
import packageJson from '../../../package.json';
import { useNavigate } from "react-router-dom";

function AddProjectModal(props){
    let navigate = useNavigate();
    const projectNameRef = useRef(); // Reference projectName from DOM

    const handleSubmit = (event) => {
        event.preventDefault();
        let bodyData = {
            'name': projectNameRef.current.value
        };
        fetch(`${packageJson.apihost}/api/project/create.php`, {
        headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
        },
        method: 'POST',
        body: JSON.stringify(bodyData)
        })
        .then(res => res.json())
        .then(
            (response) => {
                if (response.status) {
                    toast.success(response.message);
                    navigate(`/project/${response.id}`, { replace: false });
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
                    <Form.Control ref={projectNameRef} type="text"  maxLength="20" placeholder="Enter project name"/>
                </Modal.Body>
                <Modal.Footer>
                    <CreateButton/>
                </Modal.Footer>
            </Form>
        </Modal>
    );

}

export default AddProjectModal;
