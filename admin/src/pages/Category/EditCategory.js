import React, { useState, useEffect } from 'react';
import CSS from './EditCategory.module.css';
import GridLayout from '../../components/GridLayout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { backendUrl, getAuthHeaders } from '../../apiUrl';

const EditCategory = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    axios
      .get(`${backendUrl}/api/getcategory`)
      .then((res) => {
        const sorted = Array.isArray(res.data) ? res.data : res.data.data || [];
        setCategories(sorted.sort((a, b) => a.categoryName.localeCompare(b.categoryName)));
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteCategory = (categoryId) => {
    axios
      .delete(`${backendUrl}/api/deletecategory/${categoryId}`, { headers: getAuthHeaders() })
      .then(() => {
        fetchData();
        toast.success("Category deleted Successfully");
      })
      .catch(() => toast.error("Error in deleting category"));
  };

  const handleEditCategory = (categoryId, currentName) => {
    const newName = window.prompt("Enter the new category name:", currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    axios
      .put(`${backendUrl}/api/editcategory/${categoryId}`, { categoryName: newName.trim() }, { headers: getAuthHeaders() })
      .then(() => {
        fetchData();
        toast.success("Category updated successfully");
      })
      .catch((err) => toast.error(err.response?.data?.message || "Error updating category"));
  };

  return (
    <GridLayout>
      <h1 className={CSS['addcategory-title']}>Edit your Category</h1>
      <table className={CSS['table']}>
        <thead>
          <tr>
            <th className={CSS['table-head-row']}>Category Name</th>
            <th className={CSS['table-head-row']}>Category Image</th>
            <th className={`${CSS['table-head-row']} ${CSS['table-head-btn']}`}>Edit Category</th>
            <th className={`${CSS['table-head-row']} ${CSS['table-head-btn']}`}>Delete Category</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((list) => (
            <tr key={list._id}>
              <td className={CSS['table-data']}>{list.categoryName}</td>
              <td className={CSS['table-data']}>
                <img src={list.categoryImage} alt={list.categoryName} width={'80px'} height={'80px'} />
              </td>
              <td className={CSS['table-data']}>
                <button className={CSS['table-data-edit-btn']} type='button' onClick={() => handleEditCategory(list._id, list.categoryName)}>
                  Edit
                </button>
              </td>
              <td className={CSS['table-data']}>
                <button className={CSS['table-data-delete-btn']} type='button' onClick={() => handleDeleteCategory(list._id)}>
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

export default EditCategory;
