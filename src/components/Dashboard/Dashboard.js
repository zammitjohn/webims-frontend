import { Row, Col, Container }  from 'react-bootstrap';
import ContentHeader from '../ContentHeader';
import LimitedPrivileges from './LimitedPrivileges';
import MyPendingReports from './MyPendingReports';
import MyProjects from './MyProjects';
import ActiveUsers from './ActiveUsers';
import TransactionList from './TransactionList';


function Dashboard(){

    return(
        <>
            <ContentHeader pageName={'Dashboard'}/>
            <section className="content">
                <Container fluid>

                    <LimitedPrivileges/>

                    <Row>
                        <Col md="8">
                            <MyPendingReports/>   
                            <MyProjects/>
                        </Col>
                        <Col md="4">
                            <ActiveUsers/>                
                        </Col>
                    </Row>
            
                    <hr/>
                
                    <TransactionList/>
            
                </Container>
             </section>
        </>
  );

}

export default Dashboard;