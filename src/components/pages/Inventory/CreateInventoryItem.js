import React, { useState } from 'react';
import ContentHeader from '../../ContentHeader';
import LoadCategoriesDropdown from './LoadCategoriesDropdown';
import LoadTypesDropdown from './LoadTypesDropdown';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

function CreateInventoryItem() {
  const [submitted, setSubmitted] = useState(false); // submitted state
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

let navigate = useNavigate();

const handleChange = (event) => {
    const { id, value } = event.target;
    const fieldValue = { [id]: value };

    setValues({
      ...values,
      ...fieldValue,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    let formData = new FormData();
    formData.append('SKU', values.SKU);
    formData.append('category', values.category);
    formData.append('type', values.type);
    formData.append('description', values.description);
    formData.append('supplier', values.supplier);
    formData.append('qty', values.qty);
    formData.append('qtyIn', values.qtyIn);
    formData.append('qtyOut', values.qtyOut);
    formData.append('notes', values.notes);
    fetch('http://site.test/WebIMS/api/inventory/create', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      })
      .then(res => res.json())
      .then(
        (response) => {
          if (response.status) {
            toast.success(response.SKU + ': ' + response.message);
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
  return (
    <>
      <ContentHeader pageName={'Add Item'}/>
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
                          <select value={values.category} onChange={handleChange} id="category" className="form-control">
                            <LoadCategoriesDropdown/>
                          </select>
                        </div>
                        <div className="col-6 col-sm-3">
                          <label htmlFor="type">Type</label>
                          <select value={values.type} onChange={handleChange} id="type" className="form-control">
                            <LoadTypesDropdown category={values.category}/>
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
                    <button type="submit" className="btn btn-primary button_action_create">Submit</button>
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

export default CreateInventoryItem