// App.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Error404 from "./components/pages/Error404";
import Content from "./components/pages/Content";
import CreateInventoryItem from './components/pages/Inventory/CreateInventoryItem';
import EditInventoryItem from './components/pages/Inventory/EditInventoryItem';
import AllInventoryItems from './components/pages/Inventory/AllInventoryItems';
import CategoryInventoryItems from "./components/pages/Inventory/CategoryInventoryItems";
import TypeInventoryItems from "./components/pages/Inventory/TypeInventoryItems";
import Login from "./components/Login";

function App() {

	// useEffect(()=> {

	// 	if (localStorage.getItem('UserSession')) {

	// 		//check expiry
	// 		const today = new Date()
	// 		if ( (JSON.parse(localStorage.getItem('UserSession'))[0].expiry <= today.toISOString()) && (JSON.parse(localStorage.getItem('UserSession'))[0].expiry !== null) ){
	// 			localStorage.removeItem('UserSession');
	// 			localStorage.removeItem('Privileges');
	// 			window.location.reload();
	// 		}

	// 		//validate session using API
	// 		fetch('http://site.test/WebIMS/api/users/validate_session', {
	// 			method: 'GET',
	// 			credentials: 'include',
	// 			})
	// 			.then(res => res.json())
	// 			.then(
	// 				(response) => {
	// 					if (response.status) {

	// 						let privilegesData = {
	// 							canCreate : (response.canCreate) ? true : false,
	// 							canImport : (response.canImport) ? true : false,
	// 							canUpdate: (response.canUpdate) ? true : false,
	// 							canDelete: (response.canDelete) ? true : false,
	// 						}
	// 						localStorage.setItem('Privileges', JSON.stringify([privilegesData]));

	// 					} else {
	// 						console.log("Session ID not valid or deleted remotely");
	// 						localStorage.removeItem('UserSession');
	// 						localStorage.removeItem('Privileges');
	// 						//window.location.reload();
	// 					}
	// 				},
	// 				(error) => {
	// 					console.log(error);
	// 				}
	// 			)
	
	// 	} else {
	// 		//window.location.reload();
	// 	}

	// },[])


	return (
		<>
			<BrowserRouter>
			<Routes>
				<Route path="login" element={<Login/>} />
				<Route path="/" element={<Layout />}>
				<Route index element={<Content/>} />

				<Route path="dashboard" element={<Content/>} />
				<Route path="webims" element={<Content/>} />
				
				<Route path="inventory">
					<Route path='' element={<AllInventoryItems/>} />
					<Route path='category/:id' element={<CategoryInventoryItems/>} />
					<Route path='type/:id' element={<TypeInventoryItems/>} />
					<Route path='create' element={<CreateInventoryItem/>} />
					<Route path='edit/:id' element={<EditInventoryItem/>} />
				</Route>

				<Route path="reports">
					<Route path='' element={<Content/>} />
					<Route path='create' element={<Content/>} />
					<Route path='edit/:id' element={<Content/>} />
				</Route>

				<Route path="projects">
					<Route path='edit/:id' element={<Content/>} />
					<Route path='create' element={<Content/>} />
					<Route path=':id' element={<Content/>} />
				</Route>

				<Route path="registry">
					<Route path='create' element={<Content/>} />
					<Route path=':id' element={<Content/>} />
				</Route>

				<Route path="*" element={<Error404 />} />
				</Route>
			</Routes>
			</BrowserRouter>
		</>
	);
  }
  
  export default App;