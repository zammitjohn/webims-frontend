import React, { useEffect, useState } from 'react';
import ContentHeader from '../../ContentHeader';
import { getInventoryCategories, getInventoryTypes } from '../../../functions/getInventoryTypesCategories';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InventoryForm from './InventoryForm';

function CreateInventoryItem() {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
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
    dropdownData(null);  
  }, []);

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
                    <InventoryForm values={values} handleCategoryChange={handleCategoryChange} handleChange={handleChange} categories={categories} types={types}/>
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