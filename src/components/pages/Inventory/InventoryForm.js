import React, { useEffect, useState, useRef } from 'react';

function InventoryForm(props) {    
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    let isMounted = useRef(true); // mutable flag is changed in the cleanup callback, as soon as the component is unmounted

    const dropdownData = (category) => { // fetch dropdown data

        // form types fetch URL
        let url = '';
        if (category === undefined){
          url = `http://site.test/WebIMS/api/inventory/types/read`;
        } else {
          url = `http://site.test/WebIMS/api/inventory/types/read?category=${category}`;
        }

        //types
        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json()) 
        .then(
          (response) => {
              if (isMounted) {
                setTypes(response);
              }
          },
          (error) => {
            console.log(error);
          }
        )

        //categories
        fetch('http://site.test/WebIMS/api/inventory/categories/read', {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
          (response) => {
              if (isMounted) {
                setCategories(response);
              }
          },
          (error) => {
            console.log(error);
          }
        )
    }

    useEffect(() => {
        if (props.values.category){ // if edit
            dropdownData(props.values.category);
        } else { // if create
            dropdownData(null);  
        }
        return () => { isMounted.current = false }; // toggle flag, if unmounted
    }, [props.values.category]);


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
    
    dropdownData(value);

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