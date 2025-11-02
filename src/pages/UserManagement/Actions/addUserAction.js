import axios from "../../../services/api";

/**
 * Action to handle add user form submission
 * Called when the Add User modal form is submitted via useFetcher
 */
export async function addUserAction({ request }) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const userData = Object.fromEntries(formData);

    console.log('Action received user data:', userData);

    // Prepare data for Laravel API
    const apiData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password,
      role_id: parseInt(userData.role_id),
      department_id: parseInt(userData.department_id),
    };

    console.log('Sending to API:', apiData);

    // Make API request to register user
    const response = await axios.post('/auth/register', apiData);

    console.log('API Response:', response.data);

    // Return success response
    return {
      success: true,
      userId: response.data.user?.id,
      message: 'User created successfully',
      user: response.data.user,
    };

  } catch (error) {
    console.error('Add user error:', error);

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 422) {
        // Validation errors
        return {
          success: false,
          error: 'Please check your input and try again.',
          validationErrors: errorData.errors || {},
        };
      }

      if (status === 401) {
        // Unauthorized
        return {
          success: false,
          error: 'Your session has expired. Please log in again.',
        };
      }

      if (status >= 500) {
        // Server errors
        return {
          success: false,
          error: 'Server error occurred. Please try again later.',
        };
      }

      // Other client errors
      return {
        success: false,
        error: errorData.message || 'An error occurred while creating the user.',
      };

    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };

    } else {
      // Other errors
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }
}

