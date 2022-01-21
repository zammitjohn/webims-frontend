import React, { useEffect, useState, useRef } from 'react';

function InventoryForm(props) {    
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    let isMounted = useRef(true); // mutable flag is changed in the cleanup callback, as soon as the component is unmounted

    const populateTypes = (category) => { // fetch types dropdown data

        if (category) {
            let url = `http://site.test/WebIMS/api/inventory/types/read?category=${category}`;

            fetch(url, {
                headers: {
                    'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
                },
                method: 'GET'
                })
                .then(res => res.json()) 
                .then(
                (response) => {
                    if (isMounted.current) {
                        setTypes(response);
                    }
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
        //populate categories
        fetch('http://site.test/WebIMS/api/inventory/categories/read', {
            headers: {
                'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (response) => {
                    if (isMounted.current) {
                        setCategories(response);
                    }
                },
                (error) => {
                    console.log(error);
                }
            )

        if (props.values.category){ // if edit
            populateTypes(props.values.category);
        }

        return () => { isMounted.current = false }; // toggle flag, if unmounted
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
            <div className="form-group">
                <label htmlFor="SKU">SKU</label>
                <input value={props.values.SKU} onChange={handleChange} type="text" maxLength="255" className="form-control" id="SKU" placeholder="Enter SKU"/>
            </div>

            <div className="form-group">
                <div className="row">
                    <div className="col-6 col-sm-3">
                    <label htmlFor="category">Category</label>
                    <select value={props.values.category} onChange={handleCategoryChange} id="category" className="form-control">
                        <option value='null'>Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                            {category.name}
                            </option>
                        ))}    
                    </select>                          
                    </div>
                    <div className="col-6 col-sm-3">
                    <label htmlFor="type">Type</label>
                    <select value={props.values.type} onChange={handleChange} id="type" className="form-control">
                        <option value='null'>Select Type</option>
                        {types.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                        ))}  
                    </select>
                    </div>
                </div>
                </div>                   

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input value={props.values.description} onChange={handleChange} type="text" maxLength="255" className="form-control" id="description" placeholder="Enter description"/>
            </div>

            <div className="form-group">
                <label htmlFor="supplier">Supplier</label>
                <input value={props.values.supplier} onChange={handleChange} type="text" maxLength="255" className="form-control" id="supplier" placeholder="Enter supplier"/>
            </div>              

            <div className="row">
                <div className="col-sm-6">
                <div className="form-group">
                    <label htmlFor="qty">Quantity</label>
                    <input value={props.values.qty} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qty" placeholder="Enter quantity"/>
                </div>
                </div>
                <div className="col-sm-3">
                <div className="form-group">
                    <label htmlFor="qtyIn">Provisional In</label>
                    <input value={props.values.qtyIn} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qtyIn" placeholder="Enter quantity"/>
                </div>
                </div>
                <div className="col-sm-3">
                <div className="form-group">
                <label htmlFor="qtyOut">Provisional Out</label>
                <input value={props.values.qtyOut} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qtyOut" placeholder="Enter quantity"/>
                </div>
                </div>
            </div>
                
            <div className="form-group">
                <label htmlFor="notes">Miscellaneous</label>
                <input value={props.values.notes} onChange={handleChange} type="text" maxLength="255" className="form-control" id="notes" placeholder="Notes"/>
            </div>            
        </>
   );

}

export default InventoryForm;