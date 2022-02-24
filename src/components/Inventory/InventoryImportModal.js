import { Form, Button, Modal, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import React, { useState } from 'react';
import { toast } from 'react-toastify'
import packageJson from '../../../package.json';

function InventoryImportModal(props) {
    const [selectedFile, setSelectedFile] = useState([{ // form values
        name: '',
        file: []
    }]);

    const fileToBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleSelectedFile = event => {
        fileToBase64(event.target.files[0]).then((value) => {
          const newFile = { 
              name : event.target.files[0].name,
              file : value.split(',')[1] // splits the string into an array of strings with the first item (index 0) containing file type and the second item (index 1) containing the base64 encoded data
          };    
          setSelectedFile(newFile);
        })
    }

    // file upload
    const handleFileUpload = event => {
        event.preventDefault();

        toast.info('Importing data');
        let bodyData = {
          'warehouseId': props.warehouseId,
          'file': selectedFile.file
        };      
        fetch(`${packageJson.apihost}/api/inventory/import.php`, {
          headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
          },  
          method: 'PUT',    
          body: JSON.stringify(bodyData)
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