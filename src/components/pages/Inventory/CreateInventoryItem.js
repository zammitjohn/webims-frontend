import React, { useState } from 'react';
import ContentHeader from '../../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InventoryForm from './InventoryForm';

function CreateInventoryItem() {
  let navigate = useNavigate();
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

  const handleSubmit = (event) => {
    event.preventDefault();
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
                    <InventoryForm values={values} setValues={setValues}/>
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Create</button>
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