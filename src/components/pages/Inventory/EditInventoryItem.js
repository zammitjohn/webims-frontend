import React, { useState, useEffect } from 'react';
import ContentHeader from '../../ContentHeader';
import { getInventoryCategories, getInventoryTypes } from '../../../functions/getInventoryTypesCategories';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import Error404 from '../Error404';

function EditInventoryItem() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
  });
  const [values, setValues] = useState({ // form values
    SKU: '',
    category: '',
    type: '',
    description: '',
    supplier: '',
    qty: '',
    qtyIn: '',
    qtyOut: '',
    notes: '',
  });
  const { id } = useParams();
  let navigate = useNavigate();

  const dropdownData = (category) => { // fetch dropdown data
    getInventoryTypes(category) //types
    .then(
      (response) => {
        setTypes(response);
      },
      (error) => {
        console.log(error);
      }
    )
    getInventoryCategories() //categories
    .then(
      (response) => {
        setCategories(response);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  useEffect(() => { 
    // fetch form data
    fetch(`http://site.test/WebIMS/api/inventory/read_single?id=${id}`, {
      method: 'GET',
      credentials: 'include',
      })
      .then(res => res.json())
      .then(
        (response) => {
          setValues(values => ({ 
            SKU: (response.SKU) ? response.SKU : '',
            category: (response.category) ? response.category : '',
            type: (response.type) ? response.type : '',
            description: (response.description) ? response.description : '',
            supplier: (response.supplier) ? response.supplier : '',
            qty: (response.qty) ? response.qty : '',
            qtyIn: (response.qtyIn) ? response.qtyIn : '',
            qtyOut: (response.qtyOut) ? response.qtyOut : '',
            notes: (response.notes) ? response.notes : '',
          }));

          dropdownData((response.category) ? response.category : '');

          setStates({
            isLoaded: true,
          });
        },
        (error) => {
          setStates({
            isLoaded: true,
            error
          });
        }
      )
  }, [id]);

  const handleChange = (event) => {
      const { id, value } = event.target;
      const fieldValue = { [id]: value };

      setValues({
        ...values,
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

    setValues({
      ...values,
      ...fieldValue,
    });
  };
    
  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('id', id);
    formData.append('SKU', values.SKU);
    formData.append('category', values.category);
    formData.append('type', values.type);
    formData.append('description', values.description);
    formData.append('supplier', values.supplier);
    formData.append('qty', values.qty);
    formData.append('qtyIn', values.qtyIn);
    formData.append('qtyOut', values.qtyOut);
    formData.append('notes', values.notes);
    fetch('http://site.test/WebIMS/api/inventory/update', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      })
      .then(res => res.json())
      .then(
        (response) => {
          if (response.status) {
            toast.success(values.SKU + ': ' + response.message);
            navigate("/inventory", { replace: false });
          } else {
            toast.error(response.message);  
          }
        },
        (error) => {
          toast.error('Error occured');
        }
      )
  };

  if (states.error) {
    return <>{<Error404/>}</>;
  } else if (!(states.isLoaded)) {
    console.log("Loading...");
    return null;
  } else {
    return (
      <>
        <ContentHeader pageName={'Edit Item ' + values.SKU}/>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                {/* general form elements */}
                <div className="card">

                  {/* form start */}
                  <form id="item_form" onSubmit={handleSubmit}>
                    <div className="card-body">

                      <div className="form-group">
                        <label htmlFor="SKU">SKU</label>
                        <input value={values.SKU} onChange={handleChange} type="text" maxLength="255" className="form-control" id="SKU" placeholder="Enter SKU"/>
                      </div>
                      
                      <div className="form-group">
                        <div className="row">
                          <div className="col-6 col-sm-3">
                            <label htmlFor="category">Category</label>
                            <select value={values.category} onChange={handleCategoryChange} id="category" className="form-control">
                              {categories.map(category => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}    
                            </select>                          
                          </div>
                          <div className="col-6 col-sm-3">
                            <label htmlFor="type">Type</label>
                            <select value={values.type} onChange={handleChange} id="type" className="form-control">
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
                        <input value={values.description} onChange={handleChange} type="text" maxLength="255" className="form-control" id="description" placeholder="Enter description"/>
                      </div>

                      <div className="form-group">
                        <label htmlFor="supplier">Supplier</label>
                        <input value={values.supplier} onChange={handleChange} type="text" maxLength="255" className="form-control" id="supplier" placeholder="Enter supplier"/>
                      </div>              

                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <label htmlFor="qty">Quantity</label>
                            <input value={values.qty} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qty" placeholder="Enter quantity"/>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group">
                            <label htmlFor="qtyIn">Provisional In</label>
                            <input value={values.qtyIn} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qtyIn" placeholder="Enter quantity"/>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-group">
                          <label htmlFor="qtyOut">Provisional Out</label>
                          <input value={values.qtyOut} onChange={handleChange} type="number" min="0" max="9999" className="form-control" id="qtyOut" placeholder="Enter quantity"/>
                          </div>
                        </div>
                      </div>
                        
                      <div className="form-group">
                        <label htmlFor="notes">Miscellaneous</label>
                        <input value={values.notes} onChange={handleChange} type="text" maxLength="255" className="form-control" id="notes" placeholder="Notes"/>
                      </div>

                    </div>
                    {/* /.card-body */}
                    
                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                  </form>
                </div>
                {/* /.card */}
              </div>
            </div>
            {/* /.row */}
          </div>{/* /.container-fluid */}
        </section>      
      </>
    );
  }
}

export default EditInventoryItem