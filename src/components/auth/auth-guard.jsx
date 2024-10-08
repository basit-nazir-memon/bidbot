import * as React from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { paths } from 'paths';  // Adjust or replace this import as needed for React routing

export function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = React.useState(true);
  const [error, setError] = React.useState(null);

  const checkAuthToken = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setError('No auth token found. Redirecting to sign in.');
      navigate(paths.auth.signIn);  // Use react-router's navigate for redirection
    } else {
      setIsChecking(false);
    }
  };

  React.useEffect(() => {
    checkAuthToken();
  }, []);

  if (isChecking) {
    return null; // or you can show a loading spinner here
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <>{children}</>;
}

// Define PropTypes for the component
AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,  // children is required and should be a valid React node
};
