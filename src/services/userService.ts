// userService.ts - User Management Service
// This code has intentional issues for testing Solon AI code review

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  createdAt: Date;
  isActive: boolean;
}

interface UserCreateInput {
  email: string;
  name: string;
  age: number;
}

class UserService {
  private users: User[] = [];

  // Bug: No email validation
  // Bug: No duplicate email check
  // Edge case: What if age is negative?
  async createUser(input: UserCreateInput): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(), // Bug: Not a secure way to generate IDs
      email: input.email,
      name: input.name,
      age: input.age,
      createdAt: new Date(),
      isActive: true
    };

    this.users.push(newUser);
    return newUser;
  }

  // Bug: No error handling if user not found
  // Bug: Returns undefined but return type says User
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Bug: Division by zero not handled
  // Bug: What if users array is empty?
  getAverageAge(): number {
    let total = 0;
    for (let i = 0; i < this.users.length; i++) {
      total += this.users[i].age;
    }
    return total / this.users.length;
  }

  // Bug: Mutates original array
  // Bug: No handling for null/undefined email
  getUsersByDomain(domain: string): User[] {
    return this.users.filter(user => {
      return user.email.split('@')[1] === domain;
    });
  }

  // Bug: Race condition - not atomic
  // Bug: No validation that age is positive
  async updateUserAge(userId: string, newAge: number): Promise<void> {
    const user = this.getUserById(userId);
    if (user) {
      user.age = newAge;
    }
    // Bug: No error thrown if user not found
  }

  // Bug: Doesn't check if user exists before deleting
  // Bug: Index-based deletion is error-prone
  deleteUser(userId: string): boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userId) {
        this.users.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  // Bug: Incorrect logic - always returns first user or undefined
  // Bug: Case sensitivity not considered
  findUserByEmail(email: string): User | undefined {
    let result;
    this.users.forEach(user => {
      if (user.email === email) {
        result = user;
      }
    });
    return result;
  }

  // Bug: Password stored in plain text (security issue)
  // Bug: No input sanitization
  // Bug: Password parameter removed - not validating credentials at all!
  authenticateUser(email: string): boolean {
    const user = this.findUserByEmail(email);
    // TODO: Implement actual password verification
    // For now, just checking if user exists (this is intentionally broken for testing)
    return user !== undefined;
  }

  // Bug: Modifies during iteration
  // Bug: Logic error - should keep active users, not delete them
  deactivateInactiveUsers(): void {
    this.users.forEach((user, index) => {
      if (!user.isActive) {
        this.users.splice(index, 1);
      }
    });
  }

  // Edge case: What if count is 0 or negative?
  // Edge case: What if count > users.length?
  getTopUsers(count: number): User[] {
    return this.users.slice(0, count);
  }

  // Bug: String concatenation instead of proper date handling
  // Bug: Timezone issues not considered
  getUsersCreatedAfter(date: string): User[] {
    return this.users.filter(user => {
      return user.createdAt > new Date(date);
    });
  }

  // Performance issue: O(n) operation called multiple times
  // Bug: Doesn't handle tie-breaking
  getOldestUser(): User | null {
    if (this.users.length === 0) {
      return null;
    }
    let oldest = this.users[0];
    for (const user of this.users) {
      if (user.age > oldest.age) {
        oldest = user;
      } else if (user.age === oldest.age) {
        if (user.createdAt < oldest.createdAt) {
          oldest = user;
        }
      }
    }
    return oldest;
  }

  // Bug: Shallow copy - nested objects not cloned
  // Memory leak: Creates new array every time
  getAllUsers(): User[] {
    return [...this.users];
  }

  // Bug: Type coercion issue
  // Edge case: What if name is empty string?
  isValidName(name: string): boolean {
    return name.length > 0;
  }

  // Bug: Floating point arithmetic issues
  // Bug: No validation of discount range (0-100)
  calculateDiscountedAge(userId: string, discountPercent: number): number {
    const user = this.getUserById(userId);
    if (!user) {
      return 0; // Bug: Should throw error instead
    }
    return user.age - (user.age * discountPercent / 100);
  }
}

// Example usage with potential runtime errors
const service = new UserService();

// This will work
service.createUser({
  email: "john@example.com",
  name: "John Doe",
  age: 30
});

// Edge cases that should be caught:
service.createUser({
  email: "invalid-email", // Invalid email format
  name: "",               // Empty name
  age: -5                 // Negative age
});

service.getUserById("nonexistent"); // Returns undefined, not handled

service.getAverageAge(); // Might divide by zero

export default UserService;
