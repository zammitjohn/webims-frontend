import React, { useEffect, useState } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import Error404 from '../Error404';
import ProjectForm from './ProjectForm';
import UpdateButton from '../UpdateButton';
import DeleteButton from '../DeleteButton';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Form, Row, Container, Col }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function EditProjectItem() {
  const { id } = useParams();
  let navigate = useNavigate();
  const [values, setValues] = useState({ // form values
    inventoryId: '',
    projectId: '',
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
      fetch(`${packageJson.apihost}/api/project/item/read_single.php?id=${id}`, { // fetch form data
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
              projectId: (response.projectId) ? response.projectId : '',
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
      let bodyData = {
        'id': id
      }
      fetch(`${packageJson.apihost}/api/project/item/delete.php`, {
          headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
          },
          method: 'DELETE',
          body: JSON.stringify(bodyData)
          })
          .then(res => res.json())
          .then(
            (response) => {
              if (response.status) {
                toast.success(response.message);
                navigate(`../${values.projectId}`, { replace: true });
              } else {
                toast.error(response.message);  
              }
            },
            (error) => {
              toast.error('Error occured');
              console.log(error);
            }
          )
      }
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    let bodyData = {
      'id': id,
      'inventoryId': values.inventoryId,
      'projectId': values.projectId,
      'description': values.description,
      'qty': values.qty,
      'notes': values.notes
    };
    fetch(`${packageJson.apihost}/api/project/item/update.php`, {
      headers: {
        'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
      },
      method: 'PUT',
      body: JSON.stringify(bodyData)
      })
      .then(res => res.json())
      .then(
          (response) => {
            if (response.status) {
              toast.success(response.message);
              navigate(`/project/${values.projectId}`, { replace: false });
            } else {
              toast.error(response.message);  
            }
          },
          (error) => {
            toast.error('Error occured');
            console.log(error);
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
          <Container fluid>
            <Row>
              <Col>
                {/* general form elements */}
                <div className="card">

                  {/* form start */}
                  <Form id="item_form" onSubmit={handleSubmit}>
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
                  </Form>
                </div>
                {/* /.card */}
              </Col>
            </Row>
          </Container>
        </section>      
      </>

    );
  }
}

export default EditProjectItem