import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

function SidebarProjects() {
// Local variables will get reset every render upon mutation whereas state will update
let isMounted = useRef(true); // mutable flag is changed in the cleanup callback, as soon as the component is unmounted
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
	fetch('http://site.test/WebIMS/api/projects/types/read', {
		method: 'GET',
		credentials: 'include'
		})
		.then(res => res.json())
		.then(
			(projects) => {
				if (isMounted) {
					setProjects(projects);
					setStates({
						isLoaded: true,
					});
				}
			},
			(error) => {
				if (isMounted) {
					setStates({
						isLoaded: true,
						error
					});
				}
			}
		)
	return () => { isMounted.current = false }; // toggle flag, if unmounted
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
                let projectUrl = `/projects/${project.id}`;
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