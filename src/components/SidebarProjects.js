import React, { Component } from 'react';
import {Link} from "react-router-dom";

class SidebarProjects extends Component {

	constructor(props) {
		super(props);
		this.projects = [];
		
		this.state = {
		  error: null,
		  isLoaded: false,
		};
	  }

	componentDidMount() {
		// fetch types
		fetch('http://site.test/WebIMS/api/projects/types/read', {
			method: 'GET',
			credentials: 'include'
		  })
			.then(res => res.json())
			.then(
				(projects) => {
					this.projects = projects;
					this.setState({
						isLoaded: true,
						});
				},			
				(error) => {
					this.setState({
						isLoaded: true,
						error
						});
				}
			)
	}

    render() {
		let elements = [];
        let els = [];
		const {error, isLoaded} = this.state;
		if (error) {
			console.log(error.message);
			return null;
		} else if (!(isLoaded)) {
			console.log("Loading...");
			return null;
		} else {

			// build elements
			this.projects.forEach((project) => {
                if (elements === undefined || elements.length === 0) {
                    elements.push(<li className="nav-header" key={Math.random()}>PROJECTS</li>);
                }
 
                els = [];
                let projectUrl = `/projects/${project.id}`;
                els.push(
					<Link to={projectUrl} className="nav-link" key={Math.random()}>
						<i className="far fa-circle nav-icon text-warning"></i>
						<p>{project.name}</p>
					</Link>                    
                );

                elements.push(
					<li className="nav-item" key={Math.random()}>
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


export default SidebarProjects;
