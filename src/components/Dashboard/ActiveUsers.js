import React, { useEffect, useState } from 'react';
import moment from 'moment';
import packageJson from '../../../package.json';

function ActiveUsers(){

    const [data, setData] = useState([]); // data from api
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    const fetchData = () => {
        fetch(`${packageJson.apihost}/api/user/read.php`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    // filter not to include current user ID and show first 4 elements only
                    setData(data.filter(user => user.id !== JSON.parse(localStorage.getItem('UserSession')).userId).slice(0, 4));
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
    };

    useEffect(() => {
        if (localStorage.getItem('UserSession')) {
            fetchData();
        }
	}, []);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!states.isLoaded) {
        console.log("Loading...");
        return null;
    } else {

        return (
            <>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Active Users</h3>
                        <div className="card-tools">      
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#" className="btn btn-tool btn-sm" onClick={fetchData}> <i className="fas fa-sync"></i></a> 
                        </div>
                    </div>
                
                    <div className="card-body p-0">
                        <ul className="users-list clearfix">

                            {data.map((user) => (
                                <li key={user.id}>
                                    <img src="images/default-user.svg" alt="User"/>
                                    <div className="users-list-name">{user.firstName + ' ' + user.lastName}</div>
                                    <span className="users-list-date">{moment(user.lastAvailable, "YYYY-MM-DD, h:mm:ss").fromNow()}</span>
                                </li>
                            ))}

                        </ul>
                    </div>
                </div>            
            </>
        );

    }

}

export default ActiveUsers;
