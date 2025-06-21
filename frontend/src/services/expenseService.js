import api from './api';

class ExpenseService {
  // Get all expenses for current user
  async getAllExpenses() {
    try {
      const response = await api.get('/expenses');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get expense by ID
  async getExpenseById(id) {
    try {
      const response = await api.get(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new expense
  async createExpense(expenseData) {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update expense
  async updateExpense(id, expenseData) {
    try {
      const response = await api.put(`/expenses/${id}`, expenseData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete expense
  async deleteExpense(id) {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get expense statistics
  async getStatistics() {
    try {
      const response = await api.get('/expenses/statistics');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get category chart data
  async getCategoryChartData() {
    try {
      const response = await api.get('/expenses/chart/category');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get monthly chart data
  async getMonthlyChartData() {
    try {
      const response = await api.get('/expenses/chart/monthly');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current month expenses
  async getCurrentMonthExpenses() {
    try {
      const response = await api.get('/expenses/current-month');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred';
    return new Error(message);
  }
}

export default new ExpenseService();
