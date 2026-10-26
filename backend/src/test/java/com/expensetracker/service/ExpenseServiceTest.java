package com.expensetracker.service;

import com.expensetracker.dto.ExpenseRequest;
import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private Expense sampleExpense;

    @BeforeEach
    void setUp() {
        sampleExpense = new Expense("Groceries", new BigDecimal("50.00"), "Food & Dining", LocalDate.now(), "Cash", "Vegetables");
        sampleExpense.setId(1L);
    }

    @Test
    void testGetExpenseById_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(sampleExpense));

        Expense result = expenseService.getExpenseById(1L);

        assertNotNull(result);
        assertEquals("Groceries", result.getTitle());
        assertEquals(new BigDecimal("50.00"), result.getAmount());
        verify(expenseRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateExpense_Success() {
        ExpenseRequest request = new ExpenseRequest("Lunch", new BigDecimal("15.50"), "Food & Dining", LocalDate.now(), "UPI", "Restaurant lunch");
        when(expenseRepository.save(any(Expense.class))).thenAnswer(invocation -> {
            Expense e = invocation.getArgument(0);
            e.setId(2L);
            return e;
        });

        Expense created = expenseService.createExpense(request);

        assertNotNull(created);
        assertEquals("Lunch", created.getTitle());
        assertEquals(new BigDecimal("15.50"), created.getAmount());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void testDeleteExpense_Success() {
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(sampleExpense));
        doNothing().when(expenseRepository).delete(sampleExpense);

        assertDoesNotThrow(() -> expenseService.deleteExpense(1L));
        verify(expenseRepository, times(1)).delete(sampleExpense);
    }
}
