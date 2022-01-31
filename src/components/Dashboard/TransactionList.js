import React, { useState } from 'react';
import { Table }  from 'react-bootstrap';
import { toast } from 'react-toastify'

function TransactionList(){

    const [data, setData] = useState([]); // data from api

    const download = (id) => {
        fetch(`http://site.test/api/transactions/download.php?id=${id}`, {
            headers: {
                'Auth-Key': JSON.parse(localStorage.getItem('UserSession')).sessionId
            },
            method: 'GET'
        })
        .then(response => response.blob())
        .then(blob => {
            toast.info("Downloading");
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `transaction_${id}.csv`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();    
            a.remove();  //afterwards we remove the element again         
        },
        (error) => {
            toast.error("Error occured");
            console.log(error);
        });
    }

    const fetchData = () => {
        fetch('http://site.test/api/transactions/read.php', {
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
                <h3 className="card-title">Transactions</h3>
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
                                        <td><a href="#" className="text-muted" onClick={() => download(transaction.id)} title={`#${transaction.id}`}> <i className="fas fa-download"></i></a></td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.user_fullname}</td>
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
