package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.security.CustomUserDetailsService;
import com.expensetracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
   
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        System.out.println("Authentication: " + authentication);
        System.out.println("Username from auth: " + username);
        
        return userDetailsService.getUserByUsername(username).getId();
    }
    
    
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseService.getExpensesByUserId(userId);
        return ResponseEntity.ok(expenses);
    }
    
   
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            Optional<Expense> expense = expenseService.getExpenseByIdAndUserId(id, userId);
            
            if (expense.isPresent()) {
                return ResponseEntity.ok(expense.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Expense not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
   
    @PostMapping
    public ResponseEntity<?> createExpense(@Valid @RequestBody Expense expense) {
        try {
            Long userId = getCurrentUserId();
            Expense savedExpense = expenseService.createExpense(expense, userId);
            return ResponseEntity.ok(savedExpense);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, 
                                          @Valid @RequestBody Expense expense) {
        try {
            Long userId = getCurrentUserId();
            Expense updatedExpense = expenseService.updateExpense(id, expense, userId);
            return ResponseEntity.ok(updatedExpense);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            expenseService.deleteExpense(id, userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expense deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(@PathVariable String category) {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseService.getExpensesByCategory(userId, category);
        return ResponseEntity.ok(expenses);
    }
    

    @GetMapping("/date-range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseService.getExpensesByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }
    
   
    @GetMapping("/current-month")
    public ResponseEntity<List<Expense>> getCurrentMonthExpenses() {
        Long userId = getCurrentUserId();
        List<Expense> expenses = expenseService.getCurrentMonthExpenses(userId);
        return ResponseEntity.ok(expenses);
    }
    

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getExpenseStatistics() {
        Long userId = getCurrentUserId();
        Map<String, Object> stats = expenseService.getExpenseStatistics(userId);
        return ResponseEntity.ok(stats);
    }
    
    
    @GetMapping("/chart/category")
    public ResponseEntity<Map<String, BigDecimal>> getExpensesByCategory() {
        Long userId = getCurrentUserId();
        Map<String, BigDecimal> categoryData = expenseService.getExpensesByCategory(userId);
        return ResponseEntity.ok(categoryData);
    }
    
    @GetMapping("/chart/monthly")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyExpenses() {
        Long userId = getCurrentUserId();
        Map<String, BigDecimal> monthlyData = expenseService.getMonthlyExpenses(userId);
        return ResponseEntity.ok(monthlyData);
    }
}
