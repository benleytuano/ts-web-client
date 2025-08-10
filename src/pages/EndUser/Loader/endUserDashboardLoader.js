
import axios from "../../../services/api"

/**
 * Simple loader that fetches categories from the backend
 */
export async function endUserDashboardLoader() {
  try {
    // Make API request to get categories
    const response = await axios.get('/categories')
    
    console.log('Categories API Response:', response.data)
    
    // Extract categories from response
    // Assuming your Laravel API returns: { success: true, data: [...], message: "..." }
    const categories = response.data.success ? response.data.data : []
    
    return {
      categories: categories,
      loading: false,
      error: null
    }
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    return {
      categories: [],
      loading: false,
      error: error.message || 'Failed to fetch categories'
    }
  }
}