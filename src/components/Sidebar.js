import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import SidebarInventory from './SidebarInventory';
import SidebarProjects from './SidebarProjects';


function Sidebar() {
	const [userFullName, setUserFullName] = useState(null)

	useEffect(()=> {
		if ((localStorage.getItem('UserSession'))) {
			setUserFullName(JSON.parse(localStorage.getItem('UserSession')).fullName);
		} else {
			setUserFullName(null);
		}
	},[])

    return (
		<aside className="main-sidebar sidebar-dark-primary elevation-4">
			
			{/* Brand Logo */}
			<Link to="" className="brand-link">
			<img src="/images/logo.svg" alt="Logo" className="brand-image img-circle elevation-1"/>
			<span className="brand-text font-weight-light">WebIMS</span>
			</Link>

			{/* Sidebar */}
			<div className="sidebar">
			{/* Sidebar user panel (optional) */}
			<div className="user-panel mt-3 pb-3 mb-3 d-flex">
				<div className="image">
				<img src="/images/generic-user.png" className="img-circle elevation-2" alt=""/>
				</div>
				<div className="info">
				<Link to="#" className="d-block">{userFullName}</Link>
				</div>
			</div>

			{/* Sidebar Menu */}
			<nav className="mt-2">
				<ul className="nav nav-pills nav-sidebar flex-column nav-child-indent" data-widget="treeview" role="menu" data-accordion="false">
					<li className="nav-item">
					<Link to="" className="nav-link">
						<i className="nav-icon fas fa-tachometer-alt"></i>
						<p>
							Dashboard
						</p>
					</Link>
					</li>

					{<SidebarInventory />}

					<li className="nav-item has-treeview">
					<Link to="#" className="nav-link">
						<i className="nav-icon fas fa-tools"></i>
						<p>
							Fault Reports
							<i className="fas fa-angle-left right"></i>
						</p>
					</Link>
					<ul className="nav nav-treeview">
						<li className="nav-item">
							<Link to="reports/create" className="nav-link">
								<i className="fas fa-plus nav-icon"></i>
								<p>New report</p>
							</Link>
						</li>
						<li className="nav-item">
							<Link to="reports" className="nav-link">
								<i className="fas fa-circle nav-icon"></i>
								<p>All reports</p>
							</Link>
						</li>
					</ul>
					</li>
					<li className="nav-item has-treeview">
					</li>

					{<SidebarProjects />}						
					
				</ul>
			</nav>
			{/* /.sidebar-menu */}
			</div>
			{/* /.sidebar */}
		</aside>
	);
}

export default Sidebar;
