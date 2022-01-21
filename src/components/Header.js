function Header() {

	const handleLogOut = () => {
		fetch('http://site.test/WebIMS/api/users/logout', {
			headers: {
				'Auth-Key': (localStorage.getItem('UserSession')) ? (JSON.parse(localStorage.getItem('UserSession'))[0].sessionId) : null,
			},
            method: 'POST'
            })
            .then(res => res.json())
            .then(
                (response) => {
                    if (response.status) {
						localStorage.removeItem('UserSession');
						localStorage.removeItem('Privileges');
						window.location.href = '/login';

                    } else {
                        alert(response.message); 
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
	  };

	return (
		<nav className="main-header navbar navbar-expand navbar-light">
		   {/* Left navbar links */}
		   <ul className="navbar-nav">
			  <li className="nav-item">
				 {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
				 <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
			  </li>
			  <li className="nav-item d-none d-sm-inline-block">
				 <a href="https://github.com/zammitjohn/WebIMS" className="nav-link" target="_blank" rel="noreferrer"><i className="fab fa-github"></i></a>
			  </li>
		   </ul>
		   {/* Right navbar links */}
		   <ul className="navbar-nav ml-auto">
			  <li className="nav-item">
				{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
			  	<a className="nav-link" onClick={handleLogOut} style={{cursor:'pointer'}}><i className="fas fa-sign-out-alt"></i></a>
			  </li>
		   </ul>
		</nav>
   );

}

export default Header;