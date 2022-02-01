import React, { useEffect, useState } from 'react';
import { Form }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function ProjectForm(props) {    
    const [inventoryItems, setInventoryItems] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            // populate inventory dropdown
            fetch(`${packageJson.apihost}/api/inventory/read.php`, {
                headers: {
                    'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
                },
                method: 'GET'
                })
                .then(res => res.json())
                .then(
                    (data) => {
                        setInventoryItems(data);
                    },
                    (error) => {            
                        console.log(error);
                    }
                )

            //populate types
            fetch(`${packageJson.apihost}/api/projects/types/read.php`, {
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
    }, []);


    const handleChange = (event) => {
    const { id, value } = event.target;
    const fieldValue = { [id]: value };

        props.setValues({
            ...props.values,
            ...fieldValue,
        });
    };

	return (
        <>                  
            <Form.Group className="mb-3">
                <Form.Label htmlFor="inventoryId">Inventory Item</Form.Label>
                <Form.Select value={props.values.inventoryId} onChange={handleChange} id="inventoryId" className="form-control">
                    <option value='null'>Select Inventory Item</option>
                    {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                    {item.SKU + " (" + item.category_name + ") "}
                    </option>
                    ))}
                </Form.Select>
            </Form.Group>        

            <Form.Group className="mb-3">
                <Form.Label htmlFor="type">Project</Form.Label>
                <Form.Select value={props.values.type} onChange={handleChange} id="type" className="form-control">
                    <option value='null'>Select Project</option>
                    {types.map(type => (
                    <option key={type.id} value={type.id}>
                    {type.name}
                    </option>
                    ))}
                </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control value={props.values.description} onChange={handleChange} type="text" maxLength="255" id="description" placeholder="Enter description"/>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label htmlFor="qty">Quantity</Form.Label>
                <Form.Control value={props.values.qty} onChange={handleChange} type="number" min="0" max="9999" id="qty" placeholder="Enter quantity"/>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label htmlFor="notes">Miscellaneous</Form.Label>
                <Form.Control value={props.values.notes} onChange={handleChange} type="text" maxLength="255" id="notes" placeholder="Notes"/>
            </Form.Group>           
        </>
   );

}

export default ProjectForm;