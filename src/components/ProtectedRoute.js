import React, { useEffect, useState, createContext  } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import Login from './Login';
import packageJson from '../../package.json';

export const UserPrivilegesContext = createContext(null);

function ProtectedRoute() {

	let navigate = useNavigate();
	const [loginstate, setLoginState] = useState(true);	
	const [privileges, setPrivileges] = useState({ // user privileges state for context provider
		firstName: '',
		lastName: '',
		canCreate: false,
		canImport: false,
		canUpdate: false,
		canDelete: false,
	})

	useEffect(() => {

		if (localStorage.getItem('UserSession')) {
			//check expiry
			const today = new Date()
			if ( (JSON.parse(localStorage.getItem('UserSession')).expiry <= today.toISOString()) && (JSON.parse(localStorage.getItem('UserSession')).expiry !== null) ){
				localStorage.removeItem('UserSession');
				setLoginState(false);

			} else {
				//validate session using API
				fetch(`${packageJson.apihost}/api/user/validate_session.php`, {
					headers: {
						'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId,
					},
					method: 'GET',
					})
					.then(res => res.json())
					.then(
						(response) => {
							if (response.status) {

								setPrivileges({
									firstName: (response.firstName),
									lastName: (response.lastName),
									canCreate: (response.canCreate.toString() === '1') ? true : false,
									canImport: (response.canImport.toString() === '1') ? true : false,
									canUpdate: (response.canUpdate.toString() === '1') ? true : false,
									canDelete: (response.canDelete.toString() === '1') ? true : false
								});
				
							} else {
								console.log("Session ID not valid or deleted remotely");
								localStorage.removeItem('UserSession');
								setLoginState(false);
							}
						},
						(error) => {
							console.log(error);
							localStorage.removeItem('UserSession');
							setLoginState(false);
						}
					)
			}

		} else {
			localStorage.removeItem('UserSession');
			setLoginState(false);
		}
	}, [navigate]); // perform check whenever the current location changes

	if (loginstate) {	
		return (
			<UserPrivilegesContext.Provider value={privileges}>
				<Outlet/>
			</UserPrivilegesContext.Provider>
		);

	} else {
		return (
		<Login self={true} />
			
		);
	}

}

export default ProtectedRoute;