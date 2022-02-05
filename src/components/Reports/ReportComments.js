import React, { useState, useEffect, useContext, useRef } from 'react';
import { Form, Button }  from 'react-bootstrap';
import moment from 'moment';
import { UserPrivilegesContext } from "../ProtectedRoute";
import packageJson from '../../../package.json';

function ReportComments(props){
    // to hide and show buttons
    const privileges = useContext(UserPrivilegesContext);

    const commentRef = useRef(); // Reference comment text from DOM

    const [data, setData] = useState([]); // data from api
    const [states, setStates] = useState({
        error: null,
        isLoaded: false,
    });

    const handlePost = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append('text', commentRef.current.value);
        formData.append('reportId', props.reportId);
        fetch(`${packageJson.apihost}/api/report/comment/create.php`, {
        headers: {
            'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
        },
        method: 'POST',
        body: formData
        })
        .then(res => res.json())
        .then(
            (response) => {
                if (response.status) {
                    commentRef.current.value = null;
                    fetchData();
                }
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const fetchData = () => {
        fetch(`${packageJson.apihost}/api/report/comment/read.php?reportId=${props.reportId}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    setData(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    if (states.error) {
        console.log(states.error.message);
        return null;
    } else if (!states.isLoaded) {
        console.log("Loading...");
        return null;
    } else {

        return(
            <div className="card direct-chat direct-chat-warning">
                <div className="card-header">
                    <h3 className="card-title">Comments</h3>
                </div>
                <div className="card-body">
                    <div className="direct-chat-messages">

                        {data.map((comment) => (
                            <div className="direct-chat-msg" key={comment.id}> 
                                <div className="direct-chat-infos clearfix"> 
                                    <span className="direct-chat-name float-left">{`${comment.firstName} ${comment.lastName}`}</span> 
                                    <span className="direct-chat-timestamp float-right">{moment(comment.timestamp, "YYYY-MM-DD, h:mm:ss").fromNow()}</span>
                                </div>
                                <img className="direct-chat-img" src="../../images/generic-user.png" alt="User"/>
                                <div className="direct-chat-text">
                                    {comment.text}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <div className="card-footer">
                    <Form onSubmit={handlePost}>
                        <div className="input-group">
                            <Form.Control ref={commentRef} type="text" name="message" placeholder="Write a comment..." />
                            <span className="input-group-append">
                                <Button disabled={!privileges.canUpdate} type="submit">Post</Button>
                            </span>
                        </div>
                    </Form>
                </div>
            </div>
        );

    }
}

export default ReportComments;