import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import packageJson from '../../package.json';

function SidebarProjects() {
// Local variables will get reset every render upon mutation whereas state will update
let elements = [];
let key = 0;
const [projects, setProjects] = useState([]);
const [states, setStates] = useState({ // fetch states
	error: null,
	isLoaded: false,
});

useEffect(() => {
	// Note: it's important to handle errors here
	// instead of a catch() block so that we don't swallow
	// exceptions from actual bugs in components.		

	// fetch projects
	if (localStorage.getItem('UserSession')) {
		fetch(`${packageJson.apihost}/api/project/read.php`, {
			headers: {
				'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
			},
			method: 'GET'
			})
			.then(res => res.json())
			.then(
				(projects) => {
					setProjects(projects);
					setStates({
						isLoaded: true,
					});
				},
				(error) => {
					setStates({
						isLoaded: true,
						error
					});
				}
			)
	}
  }, []);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!(states.isLoaded)) {
        console.log("Loading...");
        return null;
    } else {
        let els = [];
		if (states.error) {
			console.log(states.error.message);
			return null;
		} else if (!(states.isLoaded)) {
			console.log("Loading...");
			return null;
		} else {

			// build elements
			projects.forEach((project) => {
                if (elements === undefined || elements.length === 0) {
                    elements.push(<li className="nav-header" key={key++}>PROJECTS</li>);
                }
 
                els = [];
                let projectUrl = `/project/${project.id}`;
                els.push(
					<Link to={projectUrl} className="nav-link" key={key++}>
						<i className="far fa-circle nav-icon text-warning"></i>
						<p>{project.name}</p>
					</Link>                    
                );

                elements.push(
					<li className="nav-item" key={key++}>
						{els}
					</li>
				);

			  });

			}

		return (
			<>
				{elements}
			</>
		);
    }
}

export default SidebarProjects