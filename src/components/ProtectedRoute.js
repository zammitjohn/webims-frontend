import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import Preloader from './Preloader';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify'

function ProtectedRoute() {

	let navigate = useNavigate();
	const [loginstate, setLoginState] = useState(false);

	useEffect(() => {
		if (localStorage.getItem('UserSession')) {

			setLoginState(true);

			//check expiry
			const today = new Date()
			if ( (JSON.parse(localStorage.getItem('UserSession'))[0].expiry <= today.toISOString()) && (JSON.parse(localStorage.getItem('UserSession'))[0].expiry !== null) ){
				localStorage.removeItem('UserSession');
				localStorage.removeItem('Privileges');
				setLoginState(false);
				navigate(`/login?referrer=${window.location}`, { replace: true });

			} else {

				//validate session using API
				fetch('http://site.test/WebIMS/api/users/validate_session', {
					headers: {
						'Auth-Key': (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId),
					},
					method: 'GET',
					credentials: 'include',
					})
					.then(res => res.json())
					.then(
						(response) => {
							if (response.status) {

								let privilegesData = {
									canCreate : (response.canCreate.toString() === '1') ? true : false,
									canImport : (response.canImport.toString() === '1') ? true : false,
									canUpdate: (response.canUpdate.toString() === '1') ? true : false,
									canDelete: (response.canDelete.toString() === '1') ? true : false,
								}
								localStorage.setItem('Privileges', JSON.stringify([privilegesData]));
								setLoginState(true);
								
							} else {
								console.log("Session ID not valid or deleted remotely");
								localStorage.removeItem('UserSession');
								localStorage.removeItem('Privileges');
								setLoginState(false);
								navigate(`/login?referrer=${window.location}`, { replace: true });
							}
						},
						(error) => {
							console.log(error);
						}
					)
			}

		} else {
			localStorage.removeItem('UserSession');
			localStorage.removeItem('Privileges');
			setLoginState(false);
			navigate(`/login?referrer=${window.location}`, { replace: true });
		}
	}, [navigate]); // perform check whenever the current location changes

if (loginstate) {	
	return (
		<div className="wrapper">
			<Preloader />
			<Header />
			<Sidebar />
			<div className="content-wrapper">
				<ToastContainer />
				<Outlet />
			</div>
			<Footer />
		</div>
    );

} else {
	return (null);
}

}

export default ProtectedRoute;