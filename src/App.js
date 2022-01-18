// App.js
import React, { useState, useEffect } from 'react';
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

	const [loginstate, setLoginState] = useState(false)

	function getLoginState() {
		if (localStorage.getItem('UserSession')) {

			//check expiry
			const today = new Date()
			if ( (JSON.parse(localStorage.getItem('UserSession'))[0].expiry <= today) && (JSON.parse(localStorage.getItem('UserSession'))[0].expiry !== null) ){
				localStorage.removeItem('UserSession');
				return false;
			}
			
			//validate session using API




			return true;
		} else {
			return false;
		}
	}

	useEffect(()=> {
		setLoginState(getLoginState());
		//event local storage value changes
		function handleChangeStorage() {
			setLoginState(getLoginState());
		}
		window.addEventListener('storage', handleChangeStorage);
		return () => window.removeEventListener('storage', handleChangeStorage)

	},[])

	if (loginstate) {
		document.body.classList.remove("login-page");
		return (
			<>
				<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
					<Route index element={<Content/>} />

					<Route path="dashboard" element={<Content/>} />
					
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
	} else {
		return <Login />
	}
  }
  
  export default App;