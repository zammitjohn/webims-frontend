import React, { useEffect, useState } from 'react';
import { Form, Col, Row }  from 'react-bootstrap';

function InventoryForm(props) {    
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    const populateTypes = (category) => { // fetch types dropdown data

        if (category) {
            let url = `http://site.test/api/inventory/types/read.php?category=${category}`;

            fetch(url, {
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

        } else {
            setTypes([])
        }

    }

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            //populate categories
            fetch('http://site.test/api/inventory/categories/read.php', {
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

            if (props.values.category){ // if edit
                populateTypes(props.values.category);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleChange = (event) => {
        const { id, value } = event.target;
        const fieldValue = { [id]: value };

            props.setValues({
                ...props.values,
                ...fieldValue,
            });
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        const fieldValue = { 
            category : value,
            type : '',
        };
        
        populateTypes(value);

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
                    <Form.Label htmlFor="category">Category</Form.Label>
                        <Form.Select value={props.values.category} onChange={handleCategoryChange} id="category" className="form-control">
                            <option value='null'>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                {category.name}
                                </option>
                            ))}    
                        </Form.Select>                          
                    </Col>
                    <Col sm={3}>
                        <Form.Label htmlFor="type">Type</Form.Label>
                        <Form.Select value={props.values.type} onChange={handleChange} id="type" className="form-control">
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