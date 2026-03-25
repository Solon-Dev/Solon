"""
Sample Python module for testing Solon AI's Python support
This file contains intentional issues for Solon to detect
"""

def calculate_average(numbers):
    """Calculate average of a list of numbers"""
    # BUG: No handling for empty list
    return sum(numbers) / len(numbers)


def process_user_data(user_input):
    """Process user data - has security issues"""
    # SECURITY ISSUE: Direct eval usage
    result = eval(user_input)
    return result


class UserManager:
    """Manages user operations"""

    def __init__(self, db_connection):
        self.db = db_connection

    def get_user(self, user_id):
        """Get user by ID - has SQL injection vulnerability"""
        # SECURITY ISSUE: SQL injection vulnerability
        query = f"SELECT * FROM users WHERE id = {user_id}"
        return self.db.execute(query)

    def create_user(self, name, email, role="user"):
        """Create a new user"""
        # BUG: Mutable default argument
        if not hasattr(self, 'users'):
            self.users = []
        self.users.append({'name': name, 'email': email, 'role': role})
        return self.users[-1]


async def fetch_data(url):
    """Fetch data from URL"""
    # BUG: No error handling for network issues
    # BUG: No timeout specified
    import aiohttp
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()
