package com.expensetracker.service;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new expense
    public Expense createExpense(Expense expense, Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found!");
        }
        
        expense.setUser(userOpt.get());
        return expenseRepository.save(expense);
    }
    
    // Get all expenses for a user
    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserIdOrderByExpenseDateDesc(userId);
    }
    
    // Get expense by ID (only if it belongs to the user)
    public Optional<Expense> getExpenseByIdAndUserId(Long expenseId, Long userId) {
        return expenseRepository.findByIdAndUserId(expenseId, userId);
    }
    
    // Update expense
    public Expense updateExpense(Long expenseId, Expense updatedExpense, Long userId) {
        Optional<Expense> existingExpenseOpt = expenseRepository.findByIdAndUserId(expenseId, userId);
        
        if (existingExpenseOpt.isEmpty()) {
            throw new RuntimeException("Expense not found or access denied!");
        }
        
        Expense existingExpense = existingExpenseOpt.get();
        
        // Update fields
        existingExpense.setTitle(updatedExpense.getTitle());
        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setExpenseDate(updatedExpense.getExpenseDate());
        existingExpense.setCategory(updatedExpense.getCategory());
        
        return expenseRepository.save(existingExpense);
    }
    
    // Delete expense
    public void deleteExpense(Long expenseId, Long userId) {
        Optional<Expense> expenseOpt = expenseRepository.findByIdAndUserId(expenseId, userId);
        
        if (expenseOpt.isEmpty()) {
            throw new RuntimeException("Expense not found or access denied!");
        }
        
        expenseRepository.deleteById(expenseId);
    }
    
    // Get expenses by category
    public List<Expense> getExpensesByCategory(Long userId, String category) {
        return expenseRepository.findByUserIdAndCategoryOrderByExpenseDateDesc(userId, category);
    }
    
    // Get expenses within date range
    public List<Expense> getExpensesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
                userId, startDate, endDate);
    }
    
    // Get current month expenses
    public List<Expense> getCurrentMonthExpenses(Long userId) {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();
        
        return getExpensesByDateRange(userId, startDate, endDate);
    }
    
    // Get total expenses for user
    public BigDecimal getTotalExpenses(Long userId) {
        BigDecimal total = expenseRepository.getTotalExpensesByUserId(userId);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    // Get total expenses for current month
    public BigDecimal getCurrentMonthTotal(Long userId) {
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();
        
        BigDecimal total = expenseRepository.getTotalExpensesByUserIdAndDateRange(
                userId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    // Get expense statistics for dashboard
    public Map<String, Object> getExpenseStatistics(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        // Total expenses
        BigDecimal totalExpenses = getTotalExpenses(userId);
        stats.put("totalExpenses", totalExpenses);
        
        // Current month total
        BigDecimal currentMonthTotal = getCurrentMonthTotal(userId);
        stats.put("currentMonthTotal", currentMonthTotal);
        
        // Total count
        long totalCount = expenseRepository.countByUserId(userId);
        stats.put("totalCount", totalCount);
        
        // Average expense
        BigDecimal averageExpense = totalCount > 0 ? 
                totalExpenses.divide(BigDecimal.valueOf(totalCount), 2, BigDecimal.ROUND_HALF_UP) : 
                BigDecimal.ZERO;
        stats.put("averageExpense", averageExpense);
        
        return stats;
    }
    
    // Get expenses grouped by category (for charts)
    public Map<String, BigDecimal> getExpensesByCategory(Long userId) {
        List<Object[]> results = expenseRepository.getExpensesByCategoryForUser(userId);
        Map<String, BigDecimal> categoryExpenses = new HashMap<>();
        
        for (Object[] result : results) {
            String category = (String) result[0];
            BigDecimal amount = (BigDecimal) result[1];
            categoryExpenses.put(category, amount);
        }
        
        return categoryExpenses;
    }
    
    // Get monthly expenses (for charts)
    public Map<String, BigDecimal> getMonthlyExpenses(Long userId) {
        List<Object[]> results = expenseRepository.getMonthlyExpensesForUser(userId);
        Map<String, BigDecimal> monthlyExpenses = new LinkedHashMap<>();
        
        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Integer month = (Integer) result[1];
            BigDecimal amount = (BigDecimal) result[2];
            
            String monthYear = year + "-" + String.format("%02d", month);
            monthlyExpenses.put(monthYear, amount);
        }
        
        return monthlyExpenses;
    }
}
