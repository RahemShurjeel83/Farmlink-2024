import React, { useState, useEffect } from 'react';
import GridLayout from '../../components/GridLayout';
import CSS from './UserQuery.module.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const UserQuery = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    axios
      .get(`${backendUrl}/api/getcontactus`, { headers: getAuthHeaders() })
      .then((res) => setQueries(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => toast.error('Error in Data Fetching'));
  };

  const handleDeleteQuery = (queryId) => {
    axios
      .delete(`${backendUrl}/api/deletecontactus/${queryId}`, { headers: getAuthHeaders() })
      .then(() => {
        fetchData();
        toast.success('Successfully Deleted Query');
      })
      .catch(() => toast.error('Error in Deleting Query'));
  };

  return (
    <GridLayout>
      <h1 className={CSS['addproduct-title']}>User Query List</h1>
      <table className={CSS['table']}>
        <thead>
          <tr>
            <th className={CSS['table-head-row']}>Name</th>
            <th className={CSS['table-head-row']}>Subject</th>
            <th className={CSS['table-head-row']}>Email</th>
            <th className={CSS['table-head-row']}>Message</th>
            <th className={`${CSS['table-head-row']} ${CSS['table-head-btn']}`}>Delete Query</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query) => (
            <tr key={query._id}>
              <td className={CSS['table-data']}>{query.name}</td>
              <td className={CSS['table-data']}>{query.subject}</td>
              <td className={CSS['table-data']}>{query.email}</td>
              <td className={CSS['table-data']}>{query.message}</td>
              <td className={CSS['table-data']}>
                <button className={CSS['table-data-delete-btn']} type='button' onClick={() => handleDeleteQuery(query._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </GridLayout>
  );
};

export default UserQuery;
