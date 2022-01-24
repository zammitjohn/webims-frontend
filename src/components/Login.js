
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button }  from 'react-bootstrap';

function Login(props) {
    // page specific styling
    document.body.classList.add("login-page");
    document.body.style.height = "";
    document.title = "Login";


    const [referrer, setReferrer] = useState(null);
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
      });

    const handleChange = (event) => {
        const target = event.target;
        const value = (target.type === 'checkbox') ? target.checked : target.value;
        const id = target.id;
        const fieldValue = { [id]: value };
        setValues({
            ...values,
            ...fieldValue,
        });
    };

    const handleLogin = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('username', values.email);
        formData.append('password', values.password);
        formData.append('remember', values.remember);
        fetch('http://site.test/WebIMS/api/users/login', {
            method: 'POST',
            body: formData,
            })
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status) {
                        const today = new Date()
                        const tomorrow = new Date(today)
                        tomorrow.setDate(tomorrow.getDate() + 1)

                        let userSessionData = {
                            fullName: response.firstname + ' ' + response.lastname ,
                            sessionId: response.sessionId,
                            expiry: (values.remember) ? null : tomorrow.toISOString()
                        }

                        localStorage.setItem('UserSession', JSON.stringify(userSessionData));
                    
                        if (!(props.self)) {
                            window.location.href = '/';
                        } else {
                            window.location.href = referrer;
                        }

                    } else {
                        alert(response.message); 
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
    };


    useEffect(() => {
        setReferrer(window.location.href);
        if (props.self) {
            window.history.replaceState(null, '', '/login?referrer='+window.location.href);
        }
    }, []);

    return (
        <>
        <div className="login-box">
            {/* /.login-logo */}
            <div className="card card-outline card-warning">
                <div className="card-header text-center">
                <a href="../" className="h1"><b>Web</b>IMS</a>
                </div>
                <Form id="login_form" onSubmit={handleLogin}>
                    <div className="card-body">
                        <p className="login-box-msg">Log in with your corporate account</p>
                        
                        <div className="input-group mb-3">
                            <Form.Control value={values.email} onChange={handleChange} type="email" id="email" className="form-control" placeholder="Email" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <span className="fas fa-envelope" />
                                </div>
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <Form.Control value={values.password} onChange={handleChange} type="password" id="password" className="form-control" placeholder="Password" />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                <span className="fas fa-lock" />
                                </div>
                            </div>
                        </div>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Check checked={values.remember} onChange={handleChange} type="checkbox" id="remember" label="Remember Me" />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    <div className="card-footer">
                        <Row style={{textAlign: 'center'}}>
                            <Col>
                                <Button type="submit" variant="default">Log In</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>


            </div>
            {/* /.card */}
        </div>
        {/* /.login-box */}
        </>
    );
}

export default Login;