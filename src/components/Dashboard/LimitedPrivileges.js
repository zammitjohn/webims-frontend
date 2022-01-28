import React, { useContext } from 'react';
import { UserPrivilegesContext } from "../ProtectedRoute";
import { Alert }  from 'react-bootstrap';

function LimitedPrivileges(){
    const privileges = useContext(UserPrivilegesContext);
    if (privileges.canUpdate && privileges.canCreate && privileges.canDelete && privileges.canImport) {
        return (null);
    } else {
        return(
            <Alert variant="warning">
                <Alert.Heading><i className="icon fas fa-lock"></i>Resticted access</Alert.Heading>
                <p>
                    Your account has limited permissions. You may not have access to some features. Please contact your administrator.
                </p>
            </Alert>
        );
    }
}

export default LimitedPrivileges;
