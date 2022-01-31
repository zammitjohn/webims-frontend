import { Form, Button, Modal, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import { toast } from 'react-toastify'

function InventoryImportModal(props) {
    const [selectedFile, setSelectedFile] = useState([{ // form values
        name: '',
        file: []
    }]);

    const handleSelectedFile = event => {
        const newFile = { 
            name : event.target.files[0].name,
            file : event.target.files[0]
        };    
        setSelectedFile({
            ...selectedFile,
            ...newFile,
        });
    }

    // file upload
    const handleFileUpload = event => {
        event.preventDefault();

        toast.info('Importing data');
        let formData = new FormData();
        formData.append('category', props.category);
        formData.append('file', selectedFile.file);

        fetch('/api/inventory/import.php', {
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

                toast.success("Created: " + response.created_count + " items. Matched: " + response.updated_count + " items.");
                if (response.conflict_count){
                  toast.warning(response.conflict_count + " conflicts merged.");
                }
                if (response.deleted_count){
                  toast.warning(response.deleted_count + " old items deleted.");
                }
                props.fetchData();

              } else {
                toast.error("No data imported");  
              }
            },
            (error) => {
              toast.error('Error occured');
              console.log(error);
            }
          )

        props.handleModalClose(); // close modal
    }

    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose}>
            <Modal.Header>
                <Modal.Title>Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Select CSV data file to import. Data file must use the following format: <i>Date,Type,SKU,Description,Quantity,,QuantityIN,QuantityOUT,Supplier</i> (header and blank lines are ignored).</p>
            </Modal.Body>
            <Modal.Footer>
                <Form method="post" encType="multipart/form-data"  onSubmit={handleFileUpload}>
                    <ButtonToolbar>
                        <ButtonGroup> 
                            <div className="custom-file">
                                <Form.Control type="file" onChange={handleSelectedFile} className="custom-file-input" name="file" accept=".csv"/>
                                <Form.Label className="custom-file-label" htmlFor="file">{selectedFile.name}</Form.Label>
                            </div>
                            <Button type="submit" variant="primary" onClick={handleFileUpload}>Upload</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
              </Form>
            </Modal.Footer>
        </Modal>    
    );

}

export default InventoryImportModal