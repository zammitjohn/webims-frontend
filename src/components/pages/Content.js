import {useLocation} from 'react-router-dom';
import ContentHeader from '../ContentHeader';

const Content = () => {
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

						<div className="card-tools">
						<button type="button" className="btn btn-tool" data-card-widget="collapse" title="Collapse">
							<i className="fas fa-minus"></i>
						</button>
						<button type="button" className="btn btn-tool" data-card-widget="remove" title="Remove">
							<i className="fas fa-times"></i>
						</button>
						</div>
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