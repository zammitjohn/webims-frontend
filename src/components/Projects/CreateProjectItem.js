import React, { useState } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from './ProjectForm';
import CreateButton from '../CreateButton';
import { Form, Row, Container, Col }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function CreateProjectItem() {

  let navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ // form values
    inventoryId: id,
    projectId: '',
    description: '',
    qty: '',
    notes: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let bodyData = {
      'inventoryId': values.inventoryId,
      'projectId': values.projectId,
      'description': values.description,
      'qty': values.qty,
      'notes': values.notes
    }
    fetch(`${packageJson.apihost}/api/project/item/create.php`, {
      headers: {
        'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
      },
      method: 'POST',
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
  return (
    <>
      <ContentHeader pageName={'Add Project Item'}/>
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
                    <CreateButton />
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

export default CreateProjectItem