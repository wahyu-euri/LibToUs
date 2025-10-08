import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/users';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const AccountSettings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Profile form
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profile_picture: null
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: '' });

    try {
      const formData = new FormData();
      formData.append('username', profileData.username);
      formData.append('email', profileData.email);
      if (profileData.profile_picture) {
        formData.append('profile_picture', profileData.profile_picture);
      }

      const response = await userService.updateProfile(formData);
      updateUser(response.data);
      showAlert('Profile updated successfully!', 'success');
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to update profile', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, message: '', type: '' });

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      showAlert('New passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      await userService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation
      });
      
      showAlert('Password changed successfully!', 'success');
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    } catch (error) {
      showAlert(
        error.response?.data?.message || 'Failed to change password', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({
        ...prev,
        profile_picture: file
      }));
    }
  };

  const showAlert = (message, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  return (
    <div className="account-settings">
      <div className="page-header">
        <h1>Account Settings</h1>
        <p>Manage your account information and preferences</p>
      </div>

      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      <div className="settings-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Password
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="settings-form">
              <div className="form-section">
                <h3>Profile Information</h3>
                
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />

                <div className="form-group">
                  <label className="form-label">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="form-input"
                  />
                  {user?.profile_picture && !profileData.profile_picture && (
                    <div className="current-avatar">
                      <p>Current avatar:</p>
                      <img 
                        src={user.profile_picture} 
                        alt="Current avatar" 
                        className="avatar-preview"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="save-button"
              >
                Update Profile
              </Button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-section">
                <h3>Change Password</h3>
                
                <Input
                  label="Current Password"
                  type="password"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    current_password: e.target.value
                  }))}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    new_password: e.target.value
                  }))}
                  required
                  minLength="8"
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="new_password_confirmation"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    new_password_confirmation: e.target.value
                  }))}
                  required
                  minLength="8"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="save-button"
              >
                Change Password
              </Button>
            </form>
          )}
        </div>

        <div className="account-info">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user?.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user?.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;