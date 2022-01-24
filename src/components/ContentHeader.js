// ContentHeader.js: Content Header (Page header)
import { Link } from "react-router-dom";
import { Row, Col, Container }  from 'react-bootstrap';

function ContentHeader(props) {
    document.title = props.pageName;
    return (
        <section className="content-header">
            <Container fluid>
                <Row md={2}>
                    <Col sm={6}>
                        <h1>{props.pageName}</h1>
                    </Col>
                    <Col sm={6}>
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item active">{props.pageName}</li>
                        </ol>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default ContentHeader;
