import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import Preloader from './Preloader';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify'

function Layout() {

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
				navigate("/login", { replace: true });

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
									canCreate : (response.canCreate === 1) ? true : false,
									canImport : (response.canImport === 1) ? true : false,
									canUpdate: (response.canUpdate === 1) ? true : false,
									canDelete: (response.canDelete === 1) ? true : false,
								}
								localStorage.setItem('Privileges', JSON.stringify([privilegesData]));
								setLoginState(true);
								
							} else {
								console.log("Session ID not valid or deleted remotely");
								localStorage.removeItem('UserSession');
								localStorage.removeItem('Privileges');
								setLoginState(false);
								navigate("/login", { replace: true });
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
			navigate("/login", { replace: true });
		}
	}, []);

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

export default Layout;