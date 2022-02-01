import React, { useState, useEffect } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import Error404 from '../Error404';
import InventoryForm from './InventoryForm';
import UpdateButton from '../UpdateButton';
import DeleteButton from '../DeleteButton';
import { Dropdown, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { Form, Row, Container, Col }  from 'react-bootstrap';
import ProjectAllocations from '../Projects/ProjectAllocations';
import RegisterItemModal from './RegisterItemModal';
import RegisteredItems from './RegisteredItems';
import packageJson from '../../../package.json';

function EditInventoryItem() {
  
  // register modal props
  const [modalShow, setModalShow] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  // key to keep track of updates from modal -> componenet
  const [registryComponentKey, setRegistryComponentKey] = useState(0);

  const { id } = useParams();
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
  const [states, setStates] = useState({ // form values
    error: null,
    isLoaded: false,
  });

  useEffect(() => { 
    if (localStorage.getItem('UserSession')) {
      fetch(`${packageJson.apihost}/api/inventory/read_single.php?id=${id}`, { // fetch form data
        headers: {
          'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
        },
        method: 'GET'
        })
        .then(res => res.json())
        .then(
          (response) => {
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
    if (window.confirm("Are you sure you want to delete the item? You cannot delete Inventory items associated to any Fault Reports, Projects or Registry items!")) {
      let formData = new FormData();
      formData.append('id', id);
      fetch(`${packageJson.apihost}/api/inventory/delete.php`, {
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
                toast.success(values.SKU + ': ' + response.message);
                navigate("/inventory", { replace: true });
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
    fetch(`${packageJson.apihost}/api/inventory/update.php`, {
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
            toast.success(values.SKU + ': ' + response.message);
            navigate("/inventory", { replace: false });
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
        <ContentHeader pageName={'Edit Item ' + values.SKU}/>
        <section className="content">
          <Container fluid>
            <Row>
              <Col>
                {/* general form elements */}
                <div className="card">

                  {/* form start */}
                  <Form id="item_form" onSubmit={handleSubmit}>
                    <div className="card-body">
                      <InventoryForm values={values} setValues={setValues}/>
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
                      &nbsp;
                      <ButtonGroup>
                        <Dropdown drop="up">
                          <Dropdown.Toggle variant="default">
                            Add to...
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ margin: 0 }}>
                            <Dropdown.Item as={Link} to={"../../projects/create/"+id}>Projects</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleModalShow()} href="#">Registry</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={Link} to={"../../reports/create/"+id}>New Fault Report</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> 
                      </ButtonGroup>                                            
                    </ButtonToolbar>
                    </div>
                  </Form>
                </div>
                {/* /.card */}
              </Col>
            </Row>
            <RegisterItemModal
              inventoryId={id}
              modalShow={modalShow}
              handleModalClose={handleModalClose}
              registryComponentKey={registryComponentKey}
              setRegistryComponentKey={setRegistryComponentKey}
            />
            <hr/>
            <RegisteredItems 
              key={registryComponentKey}
              inventoryId={id}
            />
            <ProjectAllocations inventoryId={id}/>
          </Container>
        </section>      
      </>
    );
  }
}

export default EditInventoryItem