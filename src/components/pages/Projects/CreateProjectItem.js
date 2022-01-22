import React, { useState } from 'react';
import ContentHeader from '../../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from './ProjectForm';
import CreateButton from '../../CreateButton';

function CreateProjectItem() {

  let navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ // form values
    inventoryId: id,
    typeId: '',
    description: '',
    qty: '',
    notes: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('inventoryId', values.inventoryId);
    formData.append('type', values.typeId);
    formData.append('description', values.description);
    formData.append('qty', values.qty);
    formData.append('notes', values.notes);
    fetch('http://site.test/WebIMS/api/projects/create', {
      headers: {
        'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
      },
      method: 'POST',
      body: formData
      })
      .then(res => res.json())
      .then(
          (response) => {
            if (response.status) {
              toast.success(response.message);
              navigate(`/projects/${values.typeId}`, { replace: false });
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
                    <ProjectForm values={values} setValues={setValues}/>
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <CreateButton />
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

export default CreateProjectItem