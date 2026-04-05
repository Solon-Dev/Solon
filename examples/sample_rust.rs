/// Sample Rust module for testing Solon AI's Rust support
/// This file contains intentional issues for Solon to detect

use std::collections::HashMap;

/// Calculate average of a vector of numbers
pub fn calculate_average(numbers: Vec<f64>) -> f64 {
    // BUG: No handling for empty vector - will panic on division by zero
    let sum: f64 = numbers.iter().sum();
    sum / numbers.len() as f64
}

/// Process user input - has potential issues
pub fn process_user_input(input: String) -> Result<i32, std::num::ParseIntError> {
    // ISSUE: No validation of input range
    input.parse::<i32>()
}

/// User manager struct
pub struct UserManager {
    users: HashMap<u64, String>,
}

impl UserManager {
    /// Create a new UserManager
    pub fn new() -> Self {
        UserManager {
            users: HashMap::new(),
        }
    }

    /// Get user by ID - has potential panic
    pub fn get_user(&self, id: u64) -> &String {
        // BUG: Will panic if user doesn't exist
        &self.users[&id]
    }

    /// Add user to the manager
    pub fn add_user(&mut self, id: u64, name: String) {
        self.users.insert(id, name);
    }

    /// Unsafe operation example
    pub fn get_user_raw(&self, id: u64) -> *const String {
        // ISSUE: Returning raw pointer without clear lifetime contract
        if let Some(user) = self.users.get(&id) {
            user as *const String
        } else {
            std::ptr::null()
        }
    }
}

/// Read file contents - missing error handling
pub fn read_file_contents(path: &str) -> String {
    // BUG: Using unwrap() - will panic on file errors
    std::fs::read_to_string(path).unwrap()
}

/// Concurrent counter - potential race condition
pub struct Counter {
    count: u64,
}

impl Counter {
    pub fn new() -> Self {
        Counter { count: 0 }
    }

    // ISSUE: Not thread-safe, missing Sync/Send consideration
    pub fn increment(&mut self) {
        self.count += 1;
    }

    pub fn get(&self) -> u64 {
        self.count
    }
}
