import React, { useState, useEffect, useRef } from 'react';
import ContentHeader from '../../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import Error404 from '../Error404';
import InventoryForm from './InventoryForm';
import UpdateButton from '../../UpdateButton';
import DeleteButton from '../../DeleteButton';

function EditInventoryItem() {
  const { id } = useParams();
  let navigate = useNavigate();
  let isMounted = useRef(true); // mutable flag is changed in the cleanup callback, as soon as the component is unmounted
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
  const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
  });

  useEffect(() => { 
    // fetch form data
    fetch(`http://site.test/WebIMS/api/inventory/read_single?id=${id}`, {
      headers: {
        'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
      },
      method: 'GET'
      })
      .then(res => res.json())
      .then(
        (response) => {
          if (isMounted.current) {
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
            setStates({
              isLoaded: true,
            });
          }
        },
        (error) => {
          if (isMounted.current) {
            setStates({
              isLoaded: true,
              error
            });
          }
        }
      )
    return () => { isMounted.current = false }; // toggle flag, if unmounted
  }, [id]);


  const deleteObject = () => {
    if (window.confirm("Are you sure you want to delete the item? You cannot delete Inventory items associated to any Fault Reports, Projects or Registry items!")) {
      let formData = new FormData();
      formData.append('id', id);
      fetch('http://site.test/WebIMS/api/inventory/delete', {
          headers: {
            'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
          },
          method: 'POST',
          body: formData
          })
          .then(res => res.json())
          .then(
            (response) => {
              if (response.status) {
                toast.success(values.SKU + ': ' + response.message);
                navigate("/inventory", { replace: true });
              } else {
                toast.error(response.message);  
              }
            },
            (error) => {
              toast.error('Error occured');
            }
          )
      }
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
      headers: {
        'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
      },  
      method: 'POST',    
      body: formData
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
                      <InventoryForm values={values} setValues={setValues}/>
                    </div>
                    {/* /.card-body */}
                    
                    <div className="card-footer">
                      <UpdateButton />
                      &nbsp;
                      <DeleteButton deleteObject={deleteObject}/>
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