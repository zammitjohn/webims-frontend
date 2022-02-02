
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Alert }  from 'react-bootstrap';
import packageJson from '../../package.json';

function Login(props) {
    document.title = "Login";

    //DO NOT UNCOMMENT THE FOLLOWING IN PRODUCTION
    //localStorage.setItem('UserSession', JSON.stringify({userId:"1", sessionId:"test", "expiry":null}));

    // incorrect password alert
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [referrer, setReferrer] = useState(null);

    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
      });

    const handleChange = (event) => {
        setShowError(false);
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
        fetch(`${packageJson.apihost}/api/users/login.php`, {
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
                            userId: response.id,
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
                        setShowError(true);
                        setErrorMessage(response.message);
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
    }, [props.self]);

    // if already signed in 
    if (localStorage.getItem('UserSession')) {
        window.location.href = '/';
    }

    return (
        <div className="login-page">
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
                                <Form.Control value={values.email} onChange={handleChange} type="email" id="email" placeholder="Email" />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                    <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <Form.Control value={values.password} onChange={handleChange} type="password" id="password" placeholder="Password" />
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
                                    <Button type="submit" className="btn-block" variant="default">Log In</Button>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </div>
                {/* /.card */}
                &nbsp;
                <Alert variant="danger" show={showError}>
                    {errorMessage}
                </Alert>
            </div>
            {/* /.login-box */}
        </div>
    );
}

export default Login;