package com.expensetracker.config;

import com.expensetracker.model.Expense;
import com.expensetracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(ExpenseRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                log.info("Database is empty. Seeding initial demo expenses...");

                LocalDate today = LocalDate.now();

                List<Expense> seedExpenses = Arrays.asList(
                        new Expense("Organic Groceries at Trader Joe's", new BigDecimal("74.50"), "Food & Dining", today.minusDays(1), "Credit Card", "Fresh vegetables, fruits, and weekly essentials"),
                        new Expense("Monthly Metro & Transit Pass", new BigDecimal("45.00"), "Travel & Transport", today.minusDays(2), "Debit Card", "Subway commuter card reload"),
                        new Expense("Ergonomic Wireless Mouse", new BigDecimal("69.99"), "Shopping", today.minusDays(3), "Credit Card", "Logitech MX Master 3S for home office setup"),
                        new Expense("Electricity & High-speed Internet Bill", new BigDecimal("112.30"), "Bills & Utilities", today.minusDays(5), "Bank Transfer", "Power utility and fiber optic subscription"),
                        new Expense("Cinema Tickets & Popcorn Combo", new BigDecimal("32.50"), "Entertainment", today.minusDays(7), "Credit Card", "Weekend movie night with friends"),
                        new Expense("Gym Membership Monthly Dues", new BigDecimal("55.00"), "Health & Fitness", today.minusDays(10), "Debit Card", "Monthly club access and locker fee"),
                        new Expense("Artisan Coffee & Croissant", new BigDecimal("9.75"), "Food & Dining", today, "UPI", "Morning espresso and bakery breakfast"),
                        new Expense("Software Architecture Masterclass Book", new BigDecimal("42.00"), "Education", today.minusDays(14), "Credit Card", "Technical reference book")
                );

                repository.saveAll(seedExpenses);
                log.info("Successfully seeded {} sample expenses into persistent database.", seedExpenses.size());
            } else {
                log.info("Database already contains {} expenses. Skipping initial seed.", repository.count());
            }
        };
    }
}
