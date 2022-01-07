import React, { Component } from 'react';
import {Link} from "react-router-dom";

class SidebarProjects extends Component {

	constructor(props) {
		super(props);
		this.projects = [];
		this.keyCount = 0;
		this.getKey = this.getKey.bind(this);
		
		this.state = {
		  error: null,
		  isLoaded: false,
		};
	}

	getKey() {
		return this.keyCount++;
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
                    elements.push(<li className="nav-header" key={this.getKey()}>PROJECTS</li>);
                }
 
                els = [];
                let projectUrl = `/projects/${project.id}`;
                els.push(
					<Link to={projectUrl} className="nav-link" key={this.getKey()}>
						<i className="far fa-circle nav-icon text-warning"></i>
						<p>{project.name}</p>
					</Link>                    
                );

                elements.push(
					<li className="nav-item" key={this.getKey()}>
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
