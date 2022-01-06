import {useLocation, Link} from 'react-router-dom';

const Content = () => {
	let location = useLocation();
	let pageName = 'Dashboard';

	if  (location.pathname.includes("inventory")) {
		pageName = 'Inventory';
	} else if  (location.pathname.includes("reports")) {
		pageName = 'Reports';
	} else if  (location.pathname.includes("projects")) {
		pageName = 'Projects';

	}

        return (
			  <div className="content-wrapper">
				{/*Content Header (Page header) */}
				<section className="content-header">
				  <div className="container-fluid">
					<div className="row mb-2">
					  <div className="col-sm-6">
						<h1>{pageName}</h1>
					  </div>
					  <div className="col-sm-6">
						<ol className="breadcrumb float-sm-right">
						  <li className="breadcrumb-item"><Link to="/">Home</Link></li>
						  <li className="breadcrumb-item active">{ pageName }</li>
						</ol>
					  </div>
					</div>
				  </div>{/*/.container-fluid */}
				</section>

				{/*Main content */}
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
				{/*/.content */}
			  </div>
        )
    };
	
export default Content;