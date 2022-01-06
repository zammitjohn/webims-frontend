const Error404 = () => {
        return (
			  <div className="content-wrapper">
				{/* Content Header (Page header) */}
				<section className="content-header">
				</section>

				{/* Main content */}
				<section className="content">
				  <div className="error-page">
					<h2 className="headline text-warning"> 404</h2>

					<div className="error-content">
					  <h3><i className="fas fa-exclamation-triangle text-warning"></i> Oops! Page not found.</h3>

						We could not find the page you were looking for.
						Meanwhile, you may return to dashboard.
					  
					</div>
					{/* /.error-content */}
				  </div>
				  {/* /.error-page */}
				</section>
				{/* /.content */}
			  </div>
        )
    };

export default Error404;