import React, { useState, useEffect } from 'react';
import { userService } from '../../services/users';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Input from '../../components/ui/Input';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, searchTerm, roleFilter]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (searchTerm) params.search = searchTerm;
      if (roleFilter !== 'all') params.role = roleFilter;

      const response = await userService.getUsers(params);
      const usersData = response.data.data || response.data;
      
      setUsers(usersData);
      setPagination({
        currentPage: response.data.current_page || page,
        totalPages: response.data.last_page || 1,
        totalItems: response.data.total || usersData.length
      });
    } catch (error) {
      showAlert('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userService.updateUser(userId, { role: newRole });
      showAlert('User role updated successfully', 'success');
      fetchUsers(pagination.currentPage);
    } catch (error) {
      showAlert('Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      showAlert('User deleted successfully', 'success');
      fetchUsers(pagination.currentPage);
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  const changePage = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>Manage library users and administrators</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Input
              type="text"
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </div>
        </form>

        <div className="filter-group">
          <label>Filter by Role:</label>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : (
        <>
          <div className="users-section">
            <div className="section-header">
              <h2>Users ({pagination.totalItems})</h2>
            </div>

            <div className="users-list">
              {users.length === 0 ? (
                <div className="no-data">
                  <p>No users found</p>
                </div>
              ) : (
                users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.profile_picture ? (
                          <img src={user.profile_picture} alt={user.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="user-details">
                        <h3>{user.username}</h3>
                        <p className="user-email">{user.email}</p>
                        <div className="user-meta">
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                          <span className="join-date">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="user-actions">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        disabled={user.id === JSON.parse(localStorage.getItem('user'))?.id}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={changePage}
                className="mt-4"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;