import { Outlet } from "react-router-dom";
import Preloader from './Preloader';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify'

function Layout() {
	return (
		<div>
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
}

export default Layout;