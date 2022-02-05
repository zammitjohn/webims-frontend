import React, { useState } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import CreateButton from '../CreateButton';
import { Form, Row, Container, Col }  from 'react-bootstrap';
import ReportForm from './ReportForm';
import RegisterItemModal from '../Inventory/RegisterItemModal';
import packageJson from '../../../package.json';

function CreateReport() {
  // register modal props
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  // key to keep track of updates from modal -> componenet
  const [registryComponentKey, setRegistryComponentKey] = useState(0);

  let navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState({ // form values
    inventoryId: id,
    ticketNumber: '',
    name: '',
    description: '',
    reportNumber: '',
    assignee_userId: (localStorage.getItem('UserSession')) ? JSON.parse(localStorage.getItem('UserSession')).userId : '',
    faulty_registryId: '',
    replacement_registryId: '',
    dateRequested: '',
    dateLeaving: '',
    dateDispatched: '',
    dateReturned: '',
    AWB: '',
    AWBreturn: '',
    RMA: '',
    notes: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('inventoryId', values.inventoryId);
    formData.append('ticketNumber', values.ticketNumber);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('reportNumber', values.reportNumber);
    formData.append('assignee_userId', values.assignee_userId);
    formData.append('faulty_registryId', values.faulty_registryId);
    formData.append('replacement_registryId', values.replacement_registryId);
    formData.append('dateRequested', values.dateRequested);
    formData.append('dateLeaving', values.dateLeaving);
    formData.append('dateDispatched', values.dateDispatched);
    formData.append('dateReturned', values.dateReturned);
    formData.append('AWB', values.AWB);
    formData.append('AWBreturn', values.AWBreturn);
    formData.append('RMA', values.RMA);
    formData.append('notes', values.notes);
    fetch(`${packageJson.apihost}/api/report/create.php`, {
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
              navigate('/reports/', { replace: false });
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
      <ContentHeader pageName={'New Report'}/>
      <section className="content">
        <Container fluid>
          <Row>
            <Col>
              {/* general form elements */}
              <div className="card">

                {/* form start */}
                <Form id="item_form" onSubmit={handleSubmit}>
                  <div className="card-body">
                    <ReportForm 
                      values={values} 
                      setValues={setValues}
                      handleModalShow={handleModalShow}
                      key={registryComponentKey}
                    />
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
      <RegisterItemModal
        inventoryId={values.inventoryId}
        modalShow={modalShow}
        handleModalClose={handleModalClose}
        registryComponentKey={registryComponentKey}
        setRegistryComponentKey={setRegistryComponentKey}
      />           
    </>

  );
}

export default CreateReport