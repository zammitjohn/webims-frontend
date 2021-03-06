import React, { useState } from 'react';
import ContentHeader from '../ContentHeader';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InventoryForm from './InventoryForm';
import CreateButton from '../CreateButton';
import { Form, Row, Container, Col }  from 'react-bootstrap';
import packageJson from '../../../package.json';

function CreateInventoryItem() {
  let navigate = useNavigate();
  const [values, setValues] = useState({ // form values
    SKU: '',
    warehouseId: '',
    warehouse_categoryId: '',
    tag: '',
    description: '',
    supplier: '',
    qty: '',
    qtyIn: '',
    qtyOut: '',
    notes: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    let bodyData = {
      'SKU': values.SKU,
      'warehouse_categoryId': values.warehouse_categoryId,
      'tag': values.tag,
      'description': values.description,
      'supplier': values.supplier,
      'qty': values.qty,
      'qtyIn': values.qtyIn,
      'qtyOut': values.qtyOut,
      'notes': values.notes
    }
    fetch(`${packageJson.apihost}/api/inventory/create.php`, {
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
              toast.success(response.SKU + ': ' + response.message);
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
  return (
    <>
      <ContentHeader pageName={'Add Item'}/>
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

export default CreateInventoryItem