import expenseService from '../expenseService';
import api from '../api';

// Mock the api module
jest.mock('../api');

describe('ExpenseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllExpenses', () => {
    it('should fetch all expenses successfully', async () => {
      const mockExpenses = [
        { id: 1, title: 'Coffee', amount: 5.50, category: 'Food' },
        { id: 2, title: 'Gas', amount: 40.00, category: 'Transportation' }
      ];

      api.get.mockResolvedValue({ data: mockExpenses });

      const result = await expenseService.getAllExpenses();

      expect(api.get).toHaveBeenCalledWith('/expenses');
      expect(result).toEqual(mockExpenses);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      api.get.mockRejectedValue({
        response: { data: { error: errorMessage } }
      });

      await expect(expenseService.getAllExpenses()).rejects.toThrow(errorMessage);
    });
  });

  describe('createExpense', () => {
    it('should create expense successfully', async () => {
      const newExpense = { title: 'Lunch', amount: 12.50, category: 'Food' };
      const createdExpense = { id: 1, ...newExpense };

      api.post.mockResolvedValue({ data: createdExpense });

      const result = await expenseService.createExpense(newExpense);

      expect(api.post).toHaveBeenCalledWith('/expenses', newExpense);
      expect(result).toEqual(createdExpense);
    });
  });

  describe('handleError', () => {
    it('should handle response errors with error field', () => {
      const error = {
        response: {
          data: { error: 'Custom error message' }
        }
      };

      const result = expenseService.handleError(error);
      expect(result.message).toBe('Custom error message');
    });

    it('should handle unknown errors', () => {
      const error = {};

      const result = expenseService.handleError(error);
      expect(result.message).toBe('An unexpected error occurred');
    });
  });
});
