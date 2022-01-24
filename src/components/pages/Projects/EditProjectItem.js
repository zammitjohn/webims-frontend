import React, { useEffect, useState } from 'react';
import ContentHeader from '../../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import Error404 from '../Error404';
import ProjectForm from './ProjectForm';
import UpdateButton from '../../UpdateButton';
import DeleteButton from '../../DeleteButton';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';

function EditProjectItem() {
  const { id } = useParams();
  let navigate = useNavigate();
  const [values, setValues] = useState({ // form values
    inventoryId: '',
    type: '',
    description: '',
    qty: '',
    notes: '',
  });
  const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
  });


  useEffect(() => { 
    if (localStorage.getItem('UserSession')) {
      fetch(`http://site.test/WebIMS/api/projects/read_single?id=${id}`, { // fetch form data
        headers: {
          'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
        },
        method: 'GET'
        })
        .then(res => res.json())
        .then(
          (response) => {
            setValues(values => ({ 
              inventoryId: (response.inventoryId) ? response.inventoryId : '',
              type: (response.type) ? response.type : '',
              description: (response.description) ? response.description : '',
              qty: (response.qty) ? response.qty : '',
              notes: (response.notes) ? response.notes : '',
            }));
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
    }
  }, [id]);

  const deleteObject = () => {
    if (window.confirm("Are you sure you want to delete the item?")) {
      let formData = new FormData();
      formData.append('id', id);
      fetch('http://site.test/WebIMS/api/projects/delete', {
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
                navigate(`../${values.type}`, { replace: true });
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
    formData.append('id',id);
    formData.append('inventoryId', values.inventoryId);
    formData.append('type', values.type);
    formData.append('description', values.description);
    formData.append('qty', values.qty);
    formData.append('notes', values.notes);
    fetch('http://site.test/WebIMS/api/projects/update', {
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
              navigate(`/projects/${values.type}`, { replace: false });
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
        <ContentHeader pageName={'Edit Project Item'}/>
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
                      <ButtonToolbar>
                        <ButtonGroup>
                          <UpdateButton />
                        </ButtonGroup>
                        &nbsp;
                        <ButtonGroup>
                          <DeleteButton deleteObject={deleteObject}/>
                        </ButtonGroup>
                      </ButtonToolbar>
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

export default EditProjectItem