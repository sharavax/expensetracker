package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.dto.ExpenseSummaryResponse;
import com.expensetracker.model.Expense;
import com.expensetracker.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Tag(name = "Expense Controller", description = "REST APIs for managing personal expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    @Operation(summary = "Get all expenses", description = "Retrieve expenses with optional filtering by category, search keywords, and date ranges")
    public ResponseEntity<List<Expense>> getExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<Expense> expenses = expenseService.getExpenses(category, search, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID", description = "Fetch a single expense by its unique identifier")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Expense expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    @PostMapping
    @Operation(summary = "Create a new expense", description = "Add a new expense with title, amount, category, date, and payment details")
    public ResponseEntity<Expense> createExpense(@Valid @RequestBody ExpenseRequest request) {
        Expense created = expenseService.createExpense(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense", description = "Update the details of an existing expense record")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody ExpenseRequest request) {
        Expense updated = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense", description = "Remove an expense permanently from the database")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    @Operation(summary = "Get spending summary & analytics", description = "Returns total spent, monthly spent, average, highest expense, and category breakdowns")
    public ResponseEntity<ExpenseSummaryResponse> getSummary() {
        ExpenseSummaryResponse summary = expenseService.getSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get list of categories", description = "Retrieve all available spending categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(expenseService.getAllCategories());
    }
}
