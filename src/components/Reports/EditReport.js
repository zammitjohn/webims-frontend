import React, { useEffect, useState, useContext } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from "react-router-dom";
import UpdateButton from '../UpdateButton';
import { Form, Row, Container, Col, Button }  from 'react-bootstrap';
import ReportForm from './ReportForm';
import RegisterItemModal from '../Inventory/RegisterItemModal';
import { UserPrivilegesContext } from "../ProtectedRoute";
import Error404 from '../Error404';
import ReportComments from './ReportComments';

function EditReport() {
  // to hide and show buttons
  const privileges = useContext(UserPrivilegesContext);

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
    ticketNo: '',
    name: '',
    description: '',
    reportNo: '',
    assigneeUserId: '',
    faultySN: '',
    replacementSN: '',
    dateRequested: '',
    dateLeaving: '',
    dateDispatched: '',
    dateReturned: '',
    AWB: '',
    AWBreturn: '',
    RMA: '',
    notes: '',
    isRepairable: false
  }); 
  const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
  });

  useEffect(() => { 
    if (localStorage.getItem('UserSession')) {
      fetch(`/api/reports/read_single.php?id=${id}`, { // fetch form data
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
              ticketNo: (response.ticketNo) ? response.ticketNo : '',
              name: (response.name) ? response.name : '',
              description: (response.description) ? response.description : '',
              reportNo: (response.reportNo) ? response.reportNo : '',
              assigneeUserId: (response.assigneeUserId) ? response.assigneeUserId : '',
              faultySN: (response.faultySN) ? response.faultySN : '',
              replacementSN: (response.replacementSN) ? response.replacementSN : '',
              dateRequested: (response.dateRequested) ? response.dateRequested : '',
              dateLeaving: (response.dateLeaving) ? response.dateLeaving : '',
              dateDispatched: (response.dateDispatched) ? response.dateDispatched : '',
              dateReturned: (response.dateReturned) ? response.dateReturned : '',
              AWB: (response.AWB) ? response.AWB : '',
              AWBreturn: (response.AWBreturn) ? response.AWBreturn : '',
              RMA: (response.RMA) ? response.RMA : '',
              notes: (response.notes) ? response.notes : '',
              isRepairable: (response.isRepairable === '1') ? true : false
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

  const toggleRepairable = () => {
    let formData = new FormData();
    formData.append('id', id);
		fetch('/api/reports/toggle_repairable.php', {
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
                  const fieldValue = {isRepairable: !(values.isRepairable)};
                  setValues({
                    ...values,
                    ...fieldValue,
                  });
                }
            },
            (error) => {
                console.log(error);
            }
        )
  }


  const RenderRegistrationButton = () => {
    if (values.isRepairable){
      return (<Button disabled={!privileges.canUpdate} variant="danger" onClick={() => toggleRepairable()}>Mark as unrepairable</Button>);
    } else {
      return (<Button disabled={!privileges.canUpdate} variant="secondary" onClick={() => toggleRepairable()}>Mark as repairable</Button>);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append('id', id);
    formData.append('inventoryId', values.inventoryId);
    formData.append('ticketNo', values.ticketNo);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('reportNo', values.reportNo);
    formData.append('assigneeUserId', values.assigneeUserId);
    formData.append('faultySN', values.faultySN);
    formData.append('replacementSN', values.replacementSN);
    formData.append('dateRequested', values.dateRequested);
    formData.append('dateLeaving', values.dateLeaving);
    formData.append('dateDispatched', values.dateDispatched);
    formData.append('dateReturned', values.dateReturned);
    formData.append('AWB', values.AWB);
    formData.append('AWBreturn', values.AWBreturn);
    formData.append('RMA', values.RMA);
    formData.append('notes', values.notes);
    fetch('/api/reports/update.php', {
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

  if (states.error) {
    return <>{<Error404/>}</>;
  } else if (!(states.isLoaded)) {
    console.log("Loading...");
    return null;
  } else {
    return (
        <>
            <ContentHeader pageName={'Edit Report ' + values.name}/>
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
                            <UpdateButton />
                            &nbsp;
                            <RenderRegistrationButton />
                        </div>
                        </Form>
                    </div>
                    {/* /.card */}
                    <ReportComments reportId={id}/>
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
}

export default EditReport