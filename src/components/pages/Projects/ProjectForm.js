import React, { useEffect, useState } from 'react';

function ProjectForm(props) {    
    const [inventoryItems, setInventoryItems] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {

            // populate inventory dropdown
            fetch(`http://site.test/webims/api/inventory/read`, {
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
            fetch('http://site.test/WebIMS/api/projects/types/read', {
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
            <div className="form-group">
                <label htmlFor="inventoryId">Inventory Item</label>
                <select value={props.values.inventoryId} onChange={handleChange} id="inventoryId" className="form-control">
                    <option value='null'>Select Inventory Item</option>
                    {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                        {item.SKU + " (" + item.category_name + ") "}
                        </option>
                    ))}
                </select>
            </div>        

            <div className="form-group">
                <label htmlFor="typeId">Project</label>
                <select value={props.values.typeId} onChange={handleChange} id="typeId" className="form-control">
                    <option value='null'>Select Project</option>
                    {types.map(type => (
                            <option key={type.id} value={type.id}>
                            {type.name}
                            </option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input value={props.values.description} onChange={handleChange} type="text" maxLength="255" className="form-control" id="description" placeholder="Enter description"/>
            </div>
            
            <div className="form-group">
                <label htmlFor="qty">Quantity</label>
                <input value={props.values.qty} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qty" placeholder="Enter quantity"/>
            </div>
            
            <div className="form-group">
                <label htmlFor="notes">Miscellaneous</label>
                <input value={props.values.notes} onChange={handleChange} type="text" maxLength="255" className="form-control" id="notes" placeholder="Notes"/>
            </div>           
        </>
   );

}

export default ProjectForm;