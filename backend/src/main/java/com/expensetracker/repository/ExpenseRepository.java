package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByDateDescCreatedAtDesc();

    List<Expense> findByCategoryIgnoreCaseOrderByDateDesc(String category);

    @Query("SELECT e FROM Expense e WHERE " +
           "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.notes) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:startDate IS NULL OR e.date >= :startDate) AND " +
           "(:endDate IS NULL OR e.date <= :endDate) " +
           "ORDER BY e.date DESC, e.createdAt DESC")
    List<Expense> searchExpenses(
            @Param("category") String category,
            @Param("search") String search,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT e.category FROM Expense e ORDER BY e.category ASC")
    List<String> findDistinctCategories();
}
