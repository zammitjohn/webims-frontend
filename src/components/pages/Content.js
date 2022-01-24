import { useLocation } from 'react-router-dom';
import ContentHeader from '../ContentHeader';

function Content() {
	let location = useLocation();
	let pageName = '';

	if  (location.pathname.includes("inventory")) {
		pageName = 'Inventory';
	} else if  (location.pathname.includes("reports")) {
		pageName = 'Reports';
	} else if  (location.pathname.includes("projects")) {
		pageName = 'Projects';
	} else {
		pageName = 'Dashboard'
	}

        return (
			<>
				<ContentHeader pageName={pageName}/>
				<section className="content">
					{/*Default box */}
					<div className="card">
					<div className="card-header">
						<h3 className="card-title">Title { pageName }</h3>
					</div>
					<div className="card-body">
						Start creating your amazing application!
					</div>
					{/*/.card-body */}
					<div className="card-footer">
						Footer
					</div>
					{/*/.card-footer*/}
					</div>
					{/*/.card */}
				</section>
			</>
        )
    };
	
export default Content;