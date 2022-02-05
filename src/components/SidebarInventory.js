import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import packageJson from '../../package.json';

function SidebarInventory() {
// Local variables will get reset every render upon mutation whereas state will update
let elements = [];
let key = 0;
const [categories, setCategories] = useState([]);
const [warehouses, setWarehouses] = useState([]);
const [states, setStates] = useState({ // fetch states
	error: null,
	isWarehousesLoaded: false,
	isCategoriesLoaded: false,
});

useEffect(() => {
	// Note: it's important to handle errors here
	// instead of a catch() block so that we don't swallow
	// exceptions from actual bugs in components.	

	// fetch warehouses
	if (localStorage.getItem('UserSession')) {
		fetch(`${packageJson.apihost}/api/warehouse/read.php`, {
			headers: {
				'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
			},
			method: 'GET'
			})
			.then(res => res.json()) 
			.then(
				(warehouses) => {
					setWarehouses(warehouses);
					setStates(prevState => ({
						...prevState,
						isWarehousesLoaded: true,
					}));
				},
				(error) => {
					setStates(prevState => ({
						...prevState,
						isWarehousesLoaded: true,
						error
					}));
				}
			)	
	
		// fetch categories
		fetch(`${packageJson.apihost}/api/warehouse/category/read.php`, {
			headers: {
				'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
			},
			method: 'GET'
			})
			.then(res => res.json()) 
			.then(
				(categories) => {
					setCategories(categories);
					setStates(prevState => ({
						...prevState,
						isCategoriesLoaded: true,
					}));
				},			
				(error) => {
					setStates(prevState => ({
						...prevState,
						isCategoriesLoaded: true,
						error
					}));
				}
			)
	}
  }, []);

if (states.error) {
	console.log(states.error.message);
	return null;
} else if (!(states.isWarehousesLoaded && states.isCategoriesLoaded)) {
	console.log("Loading...");
	return null;
} else {
	// build elements
	warehouses.forEach((warehouse) => {
		let els = [];

		els.push(
			<Link to="#" className="nav-link" key={key++}>
				<i className="far fa-dot-circle nav-icon"></i>
				<p>{warehouse.name}<i className="right fas fa-angle-left"></i></p>
			</Link>
		);
		els.push(
			<ul className="nav nav-treeview" key={key++}>
				<li className="nav-item">
				<Link to={`inventory/warehouse/${warehouse.id}`} className="nav-link">
					<i className="fas fa-circle nav-icon"></i>
					<p>All items</p>
				</Link>
				</li>
			</ul>
		);

		
		// loop categories
		categories.forEach((category) => {
			if (warehouse.id === category.warehouseId) {
				
				els.push(
					<ul className="nav nav-treeview" key={key++}>
						<li className="nav-item">
						<Link to={`inventory/category/${category.id}`} className="nav-link">
							<i className="far fa-circle nav-icon"></i>
							<p>{category.name}</p>
						</Link>
						</li>
					</ul>
				);
			}
		});

		elements.push(
			<li className="nav-item has-treeview" key={key++}>
				{els}
			</li>
		);

	});

	  return (
		<li className="nav-item has-treeview">
			<Link to="#" className="nav-link">
				<i className="nav-icon fas fa-book"></i>
				<p>
					Inventory
					<i className="fas fa-angle-left right"></i>
				</p>
			</Link>
			<ul className="nav nav-treeview">
				<li className="nav-item">
					<Link to="inventory/create" className="nav-link">
						<i className="fas fa-plus nav-icon"></i>
						<p>Add item</p>
					</Link>
				</li>
				<li className="nav-item">
					<Link to="inventory" className="nav-link">
						<i className="fas fa-circle nav-icon"></i>
						<p>All items</p>
					</Link>
				</li>

				{elements}

			</ul>
		</li>
		);	
	}
}

export default SidebarInventory