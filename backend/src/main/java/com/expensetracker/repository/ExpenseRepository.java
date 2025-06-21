package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId ORDER BY e.expenseDate DESC")
    List<Expense> findByUserIdOrderByExpenseDateDesc(@Param("userId") Long userId);
    
    @Query("SELECT e FROM Expense e WHERE e.id = :id AND e.user.id = :userId")
    Optional<Expense> findByIdAndUserId(@Param("id") Long id, @Param("userId") Long userId);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.category = :category ORDER BY e.expenseDate DESC")
    List<Expense> findByUserIdAndCategoryOrderByExpenseDateDesc(@Param("userId") Long userId, @Param("category") String category);
    
    @Query("SELECT e FROM Expense e WHERE e.user.id = :userId AND e.expenseDate BETWEEN :startDate AND :endDate ORDER BY e.expenseDate DESC")
    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            @Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId")
    BigDecimal getTotalExpensesByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByUserIdAndDateRange(
            @Param("userId") Long userId, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate);
    
   @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId " +
           "GROUP BY e.category ORDER BY SUM(e.amount) DESC")
    List<Object[]> getExpensesByCategoryForUser(@Param("userId") Long userId);
    
    @Query("SELECT YEAR(e.expenseDate), MONTH(e.expenseDate), SUM(e.amount) " +
           "FROM Expense e WHERE e.user.id = :userId " +
           "GROUP BY YEAR(e.expenseDate), MONTH(e.expenseDate) " +
           "ORDER BY YEAR(e.expenseDate), MONTH(e.expenseDate)")
    List<Object[]> getMonthlyExpensesForUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}