import React, { useState } from 'react';
import { Table }  from 'react-bootstrap';
import packageJson from '../../../package.json';
import { downloadCSVFile } from '../../utils/common.js';

function TransactionList(){

    const [data, setData] = useState([]); // data from api

    const fetchData = () => {
        fetch(`${packageJson.apihost}/api/inventory/transaction/read.php`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
            })
            .then(res => res.json())
            .then(
                (data) => {
                    setData(data);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    return (
        <div className="card collapsed-card">
            <div className="card-header border-transparent">
                <h3 className="card-title">Inventory Transactions</h3>
                <div className="card-tools">      
                    <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={fetchData}>
                    <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <Table hover>
                        <tbody>
                            {data.map((transaction) => (
                                    <tr key={transaction.id}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <td><a href="#" className="text-muted" onClick={() => downloadCSVFile('/api/inventory/transaction/download.php', transaction.id, `transaction_${transaction.id}`)} title={`#${transaction.id}`}> <i className="fas fa-download"></i></a></td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.user_fullName}</td>
                                        <td>{transaction.date}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default TransactionList;
