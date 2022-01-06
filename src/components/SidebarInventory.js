import React, { Component } from 'react';
import {Link} from "react-router-dom";

class SidebarInventory extends Component {

	constructor(props) {
		super(props);
		this.categories = [];
		this.types = [];
		
		this.state = {
		  error: null,
		  isCategoriesLoaded: false,
		  isTypesLoaded: false,
		};
	  }

	componentDidMount() {
		// Note: it's important to handle errors here
		// instead of a catch() block so that we don't swallow
		// exceptions from actual bugs in components.		

		// fetch categories
		fetch('http://site.test/WebIMS/api/inventory/categories/read', {
			method: 'GET',
			credentials: 'include'
		  })
			.then(res => res.json())
			.then(
				(categories) => {
					this.categories = categories;
					this.setState({
						isCategoriesLoaded: true,
						});
				},
				(error) => {
					this.setState({
						isCategoriesLoaded: true,
						error
						});
				}
			)
		// fetch types
		fetch('http://site.test/WebIMS/api/inventory/types/read', {
			method: 'GET',
			credentials: 'include'
		  })
			.then(res => res.json())
			.then(
				(types) => {
					this.types = types;
					this.setState({
						isTypesLoaded: true,
						});
				},			
				(error) => {
					this.setState({
						isTypesLoaded: true,
						error
						});
				}
			)
	}

    render() {
		let elements = [];
		const {error, isCategoriesLoaded, isTypesLoaded} = this.state;
		if (error) {
			console.log(error.message);
			return null;
		} else if (!(isCategoriesLoaded && isTypesLoaded)) {
			console.log("Loading...");
			return null;
		} else {


			// build elements
			this.categories.forEach((category) => {
				let els = [];
				let categoryUrl = `inventory/category/${category.id}`;

				els.push(
					<Link to="#" className="nav-link"  key={Math.random()}>
						<i className="far fa-dot-circle nav-icon"></i>
						<p>{category.name}<i className="right fas fa-angle-left"></i></p>
					</Link>
				);
				els.push(
					<ul className="nav nav-treeview" key={Math.random()}>
						<li className="nav-item">
						<Link to={categoryUrl} className="nav-link">
							<i className="fas fa-circle nav-icon"></i>
							<p>All items</p>
						</Link>
						</li>
					</ul>
				);

				
				// loop types
				this.types.forEach((type) => {
					if (category.id === type.type_category) {
						let typeUrl = `inventory/type/${type.id}`;
						
						els.push(
							<ul className="nav nav-treeview" key={Math.random()}>
								<li className="nav-item">
								<Link to={typeUrl} className="nav-link">
									<i className="far fa-circle nav-icon"></i>
									<p>{type.name}</p>
								</Link>
								</li>
							</ul>
						);
					}
				});

				elements.push(
					<li className="nav-item has-treeview" key={Math.random()}>
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
}

export default SidebarInventory;