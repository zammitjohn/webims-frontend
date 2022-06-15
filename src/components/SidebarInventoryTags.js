import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import packageJson from '../../package.json';

function SidebarInventoryTags() {
// Local variables will get reset every render upon mutation whereas state will update
let navigate = useNavigate();
let elements = [];
let key = 0;
const [tags, setTags] = useState([]);
const [states, setStates] = useState({ // fetch states
	error: null,
	isLoaded: false,
});

useEffect(() => {
	// Note: it's important to handle errors here
	// instead of a catch() block so that we don't swallow
	// exceptions from actual bugs in components.		

	// fetch tags
	if (localStorage.getItem('UserSession')) {
		fetch(`${packageJson.apihost}/api/inventory/read_tags.php`, {
			headers: {
				'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
			},
			method: 'GET'
			})
			.then(res => res.json())
			.then(
				(tags) => {
					setTags(tags);
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
}, [navigate]); // reload contents on page navigate

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
			tags.forEach((tag) => {
 
                els = [];
                els.push(
                    <Link to={`inventory?tag=${tag.name}`} className="nav-link" key={key++}>
                        <i className="fas fa-hashtag nav-icon"></i>
                        <p>{tag.name}</p>
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

export default SidebarInventoryTags