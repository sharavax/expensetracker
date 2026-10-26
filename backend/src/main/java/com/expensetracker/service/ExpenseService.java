package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.exception.ResourceNotFoundException;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public List<Expense> getExpenses(String category, String search, LocalDate startDate, LocalDate endDate) {
        String cleanCategory = (category != null && !category.trim().equalsIgnoreCase("all") && !category.trim().isEmpty())
                ? category.trim()
                : null;
        String cleanSearch = (search != null && !search.trim().isEmpty())
                ? search.trim()
                : null;

        return expenseRepository.searchExpenses(cleanCategory, cleanSearch, startDate, endDate);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
    }

    public Expense createExpense(ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().trim() : "Other");
        expense.setNotes(request.getNotes() != null ? request.getNotes().trim() : "");

        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, ExpenseRequest request) {
        Expense existing = getExpenseById(id);

        existing.setTitle(request.getTitle());
        existing.setAmount(request.getAmount());
        existing.setCategory(request.getCategory());
        existing.setDate(request.getDate());
        existing.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod().trim() : "Other");
        existing.setNotes(request.getNotes() != null ? request.getNotes().trim() : "");

        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        Expense existing = getExpenseById(id);
        expenseRepository.delete(existing);
    }

    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getSummary() {
        List<Expense> all = expenseRepository.findAll();
        ExpenseSummaryResponse summary = new ExpenseSummaryResponse();

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal thisMonth = BigDecimal.ZERO;
        BigDecimal today = BigDecimal.ZERO;
        Expense highest = null;

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

        Map<String, BigDecimal> categoryMap = new TreeMap<>();
        Map<String, Long> categoryCount = new TreeMap<>();
        Map<String, BigDecimal> monthlyMap = new TreeMap<>();

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (Expense exp : all) {
            BigDecimal amt = exp.getAmount();
            total = total.add(amt);

            // Today's total
            if (exp.getDate().isEqual(now)) {
                today = today.add(amt);
            }

            // This month's total
            if (exp.getDate().getYear() == currentYear && exp.getDate().getMonthValue() == currentMonth) {
                thisMonth = thisMonth.add(amt);
            }

            // Highest single expense
            if (highest == null || amt.compareTo(highest.getAmount()) > 0) {
                highest = exp;
            }

            // Category breakdown
            String cat = exp.getCategory();
            categoryMap.put(cat, categoryMap.getOrDefault(cat, BigDecimal.ZERO).add(amt));
            categoryCount.put(cat, categoryCount.getOrDefault(cat, 0L) + 1);

            // Monthly breakdown
            String monthKey = exp.getDate().format(monthFormatter);
            monthlyMap.put(monthKey, monthlyMap.getOrDefault(monthKey, BigDecimal.ZERO).add(amt));
        }

        summary.setTotalAmount(total);
        summary.setTotalCount(all.size());
        summary.setThisMonthAmount(thisMonth);
        summary.setTodayAmount(today);
        summary.setHighestExpense(highest);

        if (!all.isEmpty()) {
            summary.setAverageAmount(total.divide(BigDecimal.valueOf(all.size()), 2, RoundingMode.HALF_UP));
        } else {
            summary.setAverageAmount(BigDecimal.ZERO);
        }

        summary.setCategoryBreakdown(categoryMap);
        summary.setCategoryCount(categoryCount);
        summary.setMonthlyBreakdown(monthlyMap);

        return summary;
    }

    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        Set<String> categories = new LinkedHashSet<>(Arrays.asList(
                "Food & Dining",
                "Travel & Transport",
                "Shopping",
                "Bills & Utilities",
                "Entertainment",
                "Health & Fitness",
                "Education",
                "Other"
        ));
        categories.addAll(expenseRepository.findDistinctCategories());
        return new ArrayList<>(categories);
    }
}
