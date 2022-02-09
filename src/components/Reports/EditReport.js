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
import packageJson from '../../../package.json';

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
    ticketNumber: '',
    name: '',
    description: '',
    reportNumber: '',
    assignee_userId: '',
    faulty_registryId: '',
    replacement_registryId: '',
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
      fetch(`${packageJson.apihost}/api/report/read_single.php?id=${id}`, { // fetch form data
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
              ticketNumber: (response.ticketNumber) ? response.ticketNumber : '',
              name: (response.name) ? response.name : '',
              description: (response.description) ? response.description : '',
              reportNumber: (response.reportNumber) ? response.reportNumber : '',
              assignee_userId: (response.assignee_userId) ? response.assignee_userId : '',
              faulty_registryId: (response.faulty_registryId) ? response.faulty_registryId : '',
              replacement_registryId: (response.replacement_registryId) ? response.replacement_registryId : '',
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
    let bodyData = {
      'id': id
    }
		fetch(`${packageJson.apihost}/api/report/toggle_repairable.php`, {
			headers: {
				'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
			},
        method: 'PATCH',
        body: JSON.stringify(bodyData)
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
    let bodyData = {
      'id': id,
      'inventoryId': values.inventoryId,
      'ticketNumber': values.ticketNumber,
      'name': values.name,
      'description': values.description,
      'reportNumber': values.reportNumber,
      'assignee_userId': values.assignee_userId,
      'faulty_registryId': values.faulty_registryId,
      'replacement_registryId': values.replacement_registryId,
      'dateRequested': values.dateRequested,
      'dateLeaving': values.dateLeaving,
      'dateDispatched': values.dateDispatched,
      'dateReturned': values.dateReturned,
      'AWB': values.AWB,
      'AWBreturn': values.AWBreturn,
      'RMA': values.RMA,
      'notes': values.notes
    };
    fetch(`${packageJson.apihost}/api/report/update.php`, {
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