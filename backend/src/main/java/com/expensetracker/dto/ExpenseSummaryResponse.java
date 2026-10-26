package com.expensetracker.dto;

import com.expensetracker.model.Expense;
import java.math.BigDecimal;
import java.util.Map;

public class ExpenseSummaryResponse {
    private BigDecimal totalAmount;
    private long totalCount;
    private BigDecimal thisMonthAmount;
    private BigDecimal todayAmount;
    private BigDecimal averageAmount;
    private Expense highestExpense;
    private Map<String, BigDecimal> categoryBreakdown;
    private Map<String, Long> categoryCount;
    private Map<String, BigDecimal> monthlyBreakdown;

    public ExpenseSummaryResponse() {
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(long totalCount) {
        this.totalCount = totalCount;
    }

    public BigDecimal getThisMonthAmount() {
        return thisMonthAmount;
    }

    public void setThisMonthAmount(BigDecimal thisMonthAmount) {
        this.thisMonthAmount = thisMonthAmount;
    }

    public BigDecimal getTodayAmount() {
        return todayAmount;
    }

    public void setTodayAmount(BigDecimal todayAmount) {
        this.todayAmount = todayAmount;
    }

    public BigDecimal getAverageAmount() {
        return averageAmount;
    }

    public void setAverageAmount(BigDecimal averageAmount) {
        this.averageAmount = averageAmount;
    }

    public Expense getHighestExpense() {
        return highestExpense;
    }

    public void setHighestExpense(Expense highestExpense) {
        this.highestExpense = highestExpense;
    }

    public Map<String, BigDecimal> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public Map<String, Long> getCategoryCount() {
        return categoryCount;
    }

    public void setCategoryCount(Map<String, Long> categoryCount) {
        this.categoryCount = categoryCount;
    }

    public Map<String, BigDecimal> getMonthlyBreakdown() {
        return monthlyBreakdown;
    }

    public void setMonthlyBreakdown(Map<String, BigDecimal> monthlyBreakdown) {
        this.monthlyBreakdown = monthlyBreakdown;
    }
}
