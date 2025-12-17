/// Rust utility functions for data processing
/// This module demonstrates Rust code that Solon AI should review

use std::collections::HashMap;
use std::fs::File;
use std::io::Read;

/// Calculate the average of a vector of numbers
pub fn calculate_average(numbers: Vec<f64>) -> f64 {
    // BUG: Panics on empty vector (division by zero)
    let sum: f64 = numbers.iter().sum();
    sum / numbers.len() as f64
}

/// Find the maximum value in a vector
pub fn find_max(numbers: &[i32]) -> i32 {
    // BUG: Panics on empty slice
    *numbers.iter().max().unwrap()
}

/// User data structure
#[derive(Debug, Clone)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
}

/// User database manager
pub struct UserDatabase {
    users: HashMap<u64, User>,
}

impl UserDatabase {
    /// Create a new user database
    pub fn new() -> Self {
        UserDatabase {
            users: HashMap::new(),
        }
    }

    /// Get a user by ID
    pub fn get_user(&self, id: u64) -> &User {
        // BUG: Panics if user doesn't exist
        &self.users[&id]
    }

    /// Add a user to the database
    pub fn add_user(&mut self, user: User) {
        self.users.insert(user.id, user);
    }

    /// Get a raw pointer to user data
    pub fn get_user_ptr(&self, id: u64) -> *const User {
        // ISSUE: Returning raw pointer with unclear lifetime
        if let Some(user) = self.users.get(&id) {
            user as *const User
        } else {
            std::ptr::null()
        }
    }
}

/// Read file contents into a string
pub fn read_file(path: &str) -> String {
    // BUG: Using unwrap - will panic on errors
    let mut file = File::open(path).unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    contents
}

/// Parse integer from string
pub fn parse_number(input: &str) -> i32 {
    // BUG: Unwrap without proper error handling
    input.parse::<i32>().unwrap()
}

/// Unsafe memory operation
pub fn unsafe_buffer_access(index: usize) -> u8 {
    let buffer = vec![1, 2, 3, 4, 5];

    // ISSUE: Unsafe block without proper bounds checking justification
    unsafe {
        // BUG: No bounds checking - undefined behavior if index >= 5
        *buffer.as_ptr().add(index)
    }
}

/// Counter for concurrent access
pub struct Counter {
    count: u64,
}

impl Counter {
    pub fn new() -> Self {
        Counter { count: 0 }
    }

    // ISSUE: Not thread-safe - missing Sync/Send consideration
    pub fn increment(&mut self) {
        self.count += 1;
    }

    pub fn value(&self) -> u64 {
        self.count
    }
}

/// Division operation
pub fn divide(a: i32, b: i32) -> i32 {
    // BUG: No check for division by zero
    // ISSUE: Integer overflow not considered
    a / b
}
