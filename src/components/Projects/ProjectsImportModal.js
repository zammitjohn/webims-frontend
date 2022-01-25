import { Form, Button, Modal, ButtonToolbar, ButtonGroup, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'

function ProjectsImportModal(props) {

    const [selectedFilename, setSelectedFilename] = useState('');
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedValues, setSelectedValues] = useState({ // form values
        category: '',
        type: '',
        file: []
      });

    const handleSelectedFile = event => {
        setSelectedFilename(event.target.files[0].name);
        const fieldValue = { 
            file : event.target.files[0],
        };    
        setSelectedValues({
            ...selectedValues,
            ...fieldValue,
        });
    }

    // file upload
    const handleFileUpload = event => {
        event.preventDefault();

        toast.info('Importing data'); // show toast
        let formData = new FormData();
        formData.append('type', props.type);
        formData.append('inventory_category', selectedValues.category);
        formData.append('inventory_type', selectedValues.type);
        formData.append('file', selectedValues.file);

        fetch('http://site.test/WebIMS/api/projects/import', {
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

                toast.success("Added " + response.created_count + " items.");
                if (response.notfound_count){
                  toast.warning(response.additional_info + "not in inventory! First create item to inventory and then add to project.");
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

    const populateTypes = (category) => { // fetch types dropdown data
        fetch(`http://site.test/WebIMS/api/inventory/types/read?category=${category}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json()) 
            .then(
            (response) => {
                setTypes(response);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            category : value,
            type : '',
        };    
        populateTypes(value);
        setSelectedValues({
            ...selectedValues,
            ...fieldValue,
        });
    };

    const handleTypeChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            type : value,
        };
        setSelectedValues({
            ...selectedValues,
            ...fieldValue,
        });
    };


    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            //populate categories
            fetch('http://site.test/WebIMS/api/inventory/categories/read', {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setCategories(response);
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose}>
            <Modal.Header>
                <Modal.Title>Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Select CSV data file to import. Data file must use the following format: <i>SKU,description,quantity,notes</i> (header and blank lines are ignored).</p>
                <Form.Group>
                    <b>Allocate items from:</b>
                    <Row>
                        <Col md="8">
                            <Form.Select onChange={handleCategoryChange} value={selectedValues.category} className="form-control">
                                <option value='null'>Select Category</option>
                                {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                                ))}    
                            </Form.Select>
                        </Col>
                        <Col md="4">
                            <Form.Select onChange={handleTypeChange} value={selectedValues.type} className="form-control">
                                <option value='null'>Select Type</option>
                                {types.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                                ))}  
                            </Form.Select>
                        </Col>
                    </Row>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Form method="post" encType="multipart/form-data"  onSubmit={handleFileUpload}>
                    <ButtonToolbar>
                        <ButtonGroup> 
                            <div className="custom-file">
                                <Form.Control type="file" onChange={handleSelectedFile} className="custom-file-input" name="file" accept=".csv"/>
                                <Form.Label className="custom-file-label" htmlFor="file">{selectedFilename}</Form.Label>
                            </div>
                            <Button type="submit" variant="primary" onClick={handleFileUpload}>Upload</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
              </Form>
            </Modal.Footer>
        </Modal>    
    );

}

export default ProjectsImportModal