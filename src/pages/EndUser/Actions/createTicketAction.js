import axios from "../../../services/api";

/**
 * Action to handle ticket creation form submission
 * Called when the NewTicketModal form is submitted via useFetcher
 */
export async function createTicketAction({ request }) {
  try {
    // Get form data from the request
    const formData = await request.formData();
    const ticketData = Object.fromEntries(formData);

    console.log('Action received ticket data:', ticketData);

    // Prepare data for Laravel API
    const apiData = {
      title: ticketData.title,
      description: ticketData.description,
      category_id: parseInt(ticketData.category_id), // Convert to number
      priority: ticketData.priority,
      location_id: parseInt(ticketData.location), // Convert to number
      contact_phone: ticketData.contactPhone,
      patient_name: ticketData.patientName || null,
      equipment_details: ticketData.equipmentDetails || null,
      urgency_reason: ticketData.urgencyReason || null,
      department_id: parseInt(ticketData.department_id),
    };

    console.log('Sending to API:', apiData);

    // Make API request to create ticket
    const response = await axios.post('/tickets', apiData); 

    console.log('API Response:', response.data);

    // Return success response for the modal
    return {
      success: true,
      ticketNumber: response.data.data?.id || response.data.id,
      message: 'Ticket created successfully',
      ticket: response.data.data || response.data
    };

  } catch (error) {
    console.error('Create ticket error:', error);

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
          validationErrors: errorData.errors || {}
        };
      }

      if (status === 401) {
        // Unauthorized
        return {
          success: false,
          error: 'Your session has expired. Please log in again.'
        };
      }

      if (status >= 500) {
        // Server errors
        return {
          success: false,
          error: 'Server error occurred. Please try again later.'
        };
      }

      // Other client errors
      return {
        success: false,
        error: errorData.message || 'An error occurred while creating the ticket.'
      };

    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };

    } else {
      // Other errors
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }
}