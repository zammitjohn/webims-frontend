import React, { useEffect, useState } from 'react';
import { Form, Col, Row }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function InventoryForm(props) {    
    const [warehouses, setWarehouses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => { // trigger the following on warehouse change
        if (localStorage.getItem('UserSession')) {
            let warehouseId = (props.values.warehouseId) ? props.values.warehouseId : null;
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
    }, [props.values.warehouseId])

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

    const handleChange = (event) => {
        const { id, value } = event.target;
        const fieldValue = { [id]: value };

            props.setValues({
                ...props.values,
                ...fieldValue,
            });
    };

    const handleWarehouseChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            warehouseId : value,
            warehouse_categoryId : '',
        };
        
        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    };

	return (
        <>                  
            <Form.Group className="mb-3">
                <Form.Label htmlFor="SKU">SKU</Form.Label>
                <Form.Control value={props.values.SKU} onChange={handleChange} type="text" maxLength="255" id="SKU" placeholder="Enter SKU"/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Row>
                    <Col sm={3}>
                    <Form.Label htmlFor="warehouseId">Warehouse</Form.Label>
                    <Form.Select value={props.values.warehouseId} onChange={handleWarehouseChange} id="warehouseId" className="form-control">
                        <option value='null'>Select Warehouse</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                            </option>
                        ))}    
                    </Form.Select>                          
                    </Col>
                    <Col sm={3}>
                        <Form.Label htmlFor="warehouse_categoryId">Category</Form.Label>
                        <Form.Select value={props.values.warehouse_categoryId} onChange={handleChange} id="warehouse_categoryId" className="form-control">
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

            <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control value={props.values.description} onChange={handleChange} type="text" maxLength="255" id="description" placeholder="Enter description"/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="supplier">Supplier</Form.Label>
                <Form.Control value={props.values.supplier} onChange={handleChange} type="text" maxLength="255" id="supplier" placeholder="Enter supplier"/>
            </Form.Group>              

            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="qty">Quantity</Form.Label>
                        <Form.Control value={props.values.qty} onChange={handleChange} type="number" min="0" max="9999" id="qty" placeholder="Enter quantity"/>
                    </Form.Group> 
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="qtyIn">Provisional In</Form.Label>
                        <Form.Control value={props.values.qtyIn} onChange={handleChange} type="number" min="0" max="9999" id="qtyIn" placeholder="Enter quantity"/>
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="qtyOut">Provisional Out</Form.Label>
                        <Form.Control value={props.values.qtyOut} onChange={handleChange} type="number" min="0" max="9999" id="qtyOut" placeholder="Enter quantity"/>
                    </Form.Group>
                </Col>
            </Row>    
       
            <Form.Group className="mb-3">
                <Form.Label htmlFor="notes">Miscellaneous</Form.Label>
                <Form.Control value={props.values.notes} onChange={handleChange} type="text" maxLength="255" id="notes" placeholder="Notes"/>
            </Form.Group>            
        </>
   );

}

export default InventoryForm;