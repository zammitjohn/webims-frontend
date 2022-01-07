// Layout.js

import React, {Component} from 'react';
import {Outlet} from "react-router-dom";
import Preloader from './Preloader';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

class Layout extends Component {

  render() {
    return (
		<div>
			<Preloader />
			<Header />
			<Sidebar />
			<div className="content-wrapper">
				<Outlet />
			</div>
			<Footer />
		</div>
    );
  }
}

export default Layout;