
import React, { useState } from 'react';

function Login(props) {
    // page specific styling
    document.body.classList.add("login-page");
    document.body.style.height = "";

    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false,
      });

    const handleChange = (event) => {
        const { id, value } = event.target;
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
                            window.location.reload();
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

    return (
        <>
        <div className="login-box">
            {/* /.login-logo */}
            <div className="card card-outline card-warning">
                <div className="card-header text-center">
                <a href="../" className="h1"><b>Web</b>IMS</a>
                </div>
                <div className="card-body">
                <p className="login-box-msg">Log in with your corporate account</p>
                <form id="login_form" onSubmit={handleLogin}>
                    <div className="input-group mb-3">
                    <input value={values.email} onChange={handleChange} type="email" id="email" className="form-control" placeholder="Email" />
                    <div className="input-group-append">
                        <div className="input-group-text">
                        <span className="fas fa-envelope" />
                        </div>
                    </div>
                    </div>
                    <div className="input-group mb-3">
                    <input value={values.password} onChange={handleChange} type="password" id="password" className="form-control" placeholder="Password" />
                    <div className="input-group-append">
                        <div className="input-group-text">
                        <span className="fas fa-lock" />
                        </div>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-8">
                        <div className="icheck-primary">
                        <input value={values.remember} onChange={handleChange} type="checkbox" id="remember" />
                        &nbsp;
                        <label htmlFor="remember">
                            Remember Me
                        </label>
                        </div>
                    </div>
                    {/* /.col */}
                    <div className="col-4">
                        <button type="submit" className="btn btn-default btn-block">Log In</button>
                    </div>
                    {/* /.col */}
                    </div>
                </form>
                </div>
                {/* /.card-body */}
            </div>
            {/* /.card */}
        </div>
        {/* /.login-box */}
        </>
    );
}

export default Login;