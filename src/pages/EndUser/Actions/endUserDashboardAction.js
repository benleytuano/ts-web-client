import axios from "../../../services/api";

/**
 * Combined action handler for EndUserDashboard
 * Routes requests to appropriate action based on form data
 */
export async function endUserDashboardAction({ request }) {
  try {
    const formData = await request.formData();

    // Check if this is a profile update request (has email field)
    if (formData.has("email")) {
      return await handleProfileUpdate(formData);
    }

    // Otherwise, treat as ticket creation
    return await handleTicketCreation(formData);
  } catch (error) {
    console.error("Dashboard action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again."
    };
  }
}

/**
 * Handle profile update
 */
async function handleProfileUpdate(formData) {
  try {
    const apiData = {
      email: formData.get("email"),
    };

    // Only include password if it's being changed
    if (formData.get("password") && formData.get("password").trim()) {
      apiData.password = formData.get("password");
      apiData.password_confirmation = formData.get("password_confirmation");
    }

    console.log('Sending profile update to API:', apiData);

    const response = await axios.post('/auth/update-profile', apiData);

    console.log('API Response:', response.data);

    return {
      success: true,
      message: response.data.message || 'Profile updated successfully',
      user: response.data.user,
    };
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 422) {
        return {
          success: false,
          error: 'Please check your input and try again.',
          validationErrors: errorData.errors || {}
        };
      }

      if (status === 401) {
        return {
          success: false,
          error: 'Your session has expired. Please log in again.'
        };
      }

      if (status >= 500) {
        return {
          success: false,
          error: 'Server error occurred. Please try again later.'
        };
      }

      return {
        success: false,
        error: errorData.message || 'An error occurred while updating your profile.'
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    } else {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}

/**
 * Handle ticket creation
 */
async function handleTicketCreation(formData) {
  try {
    const ticketData = Object.fromEntries(formData);

    console.log('Action received ticket data:', ticketData);
    console.log('contactPhone value:', ticketData.contactPhone);
    console.log('All form keys:', Object.keys(ticketData));

    const apiData = {
      title: ticketData.title,
      description: ticketData.description,
      category_id: parseInt(ticketData.category_id),
      priority: ticketData.priority,
      location_id: parseInt(ticketData.location),
      contact_number: ticketData.contact_number,
      patient_name: ticketData.patientName || null,
      equipment_details: ticketData.equipmentDetails || null,
      urgency_reason: ticketData.urgencyReason || null,
      department_id: parseInt(ticketData.department_id),
    };

    console.log('Sending to API:', apiData);

    const response = await axios.post('/tickets', apiData);

    console.log('API Response:', response.data);

    return {
      success: true,
      ticketNumber: response.data.data?.id || response.data.id,
      message: 'Ticket created successfully',
      ticket: response.data.data || response.data
    };
  } catch (error) {
    console.error('Create ticket error:', error);

    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 422) {
        return {
          success: false,
          error: 'Please check your input and try again.',
          validationErrors: errorData.errors || {}
        };
      }

      if (status === 401) {
        return {
          success: false,
          error: 'Your session has expired. Please log in again.'
        };
      }

      if (status >= 500) {
        return {
          success: false,
          error: 'Server error occurred. Please try again later.'
        };
      }

      return {
        success: false,
        error: errorData.message || 'An error occurred while creating the ticket.'
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    } else {
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}

