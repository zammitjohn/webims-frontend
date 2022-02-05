import { Form, Button, Modal, ButtonToolbar, ButtonGroup, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'
import packageJson from '../../../package.json';

function ProjectsImportModal(props) {

    const [selectedFilename, setSelectedFilename] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedValues, setSelectedValues] = useState({ // form values
        warehouseId: '',
        warehouse_categoryId: '',
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
        formData.append('id', props.id);
        formData.append('warehouse_categoryId', selectedValues.warehouse_categoryId);
        formData.append('file', selectedValues.file);

        fetch(`${packageJson.apihost}/api/project/import.php`, {
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

    const handleWarehouseChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            warehouseId : value,
            warehouse_categoryId : '',
        };
        setSelectedValues({
            ...selectedValues,
            ...fieldValue,
        });
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            warehouse_categoryId : value,
        };
        setSelectedValues({
            ...selectedValues,
            ...fieldValue,
        });
    };

    useEffect(() => { // trigger the following on warehouse change
        if (localStorage.getItem('UserSession')) {
            let warehouseId = (selectedValues.warehouseId) ? selectedValues.warehouseId : null;
            fetch(`${packageJson.apihost}/api/warehouse/category/read.php?warehouseId=${warehouseId}`, {
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
    }, [selectedValues.warehouseId])

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            //populate warehouses
            fetch(`${packageJson.apihost}/api/warehouse/read.php`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (response) => {
                        setWarehouses(response);
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }, []);

    return(
        <Modal show={props.modalShow} onHide={props.handleModalClose} centered>
            <Modal.Header>
                <Modal.Title>Import</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Select CSV data file to import. Data file must use the following format: <i>SKU,description,quantity,notes</i> (header and blank lines are ignored).</p>
                <b>Allocate items from:</b>
                <Form.Group className="mb-3">
                    <Row>
                        <Col md="7">
                            <Form.Select value={selectedValues.warehouseId} onChange={handleWarehouseChange} id="warehouseId" className="form-control">
                                <option value='null'>Select Warehouse</option>
                                {warehouses.map(warehouse => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                    {warehouse.name}
                                    </option>
                                ))}    
                            </Form.Select>  
                        </Col>
                        <Col md="5">
                            <Form.Select value={selectedValues.warehouse_categoryId} onChange={handleCategoryChange} id="warehouse_categoryId" className="form-control">
                                <option value='null'>Select Category</option>
                                {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
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