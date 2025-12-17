"""
Python utility functions for data processing
This module demonstrates Python code that Solon AI should review
"""

import os
import pickle


def calculate_statistics(data):
    """Calculate mean and median from a list of numbers"""
    # BUG: No validation for empty list
    mean = sum(data) / len(data)

    sorted_data = sorted(data)
    n = len(sorted_data)

    # BUG: Integer division issue in Python 3
    if n % 2 == 0:
        median = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2
    else:
        median = sorted_data[n//2]

    return {"mean": mean, "median": median}


def load_user_config(config_file):
    """Load user configuration from file"""
    # SECURITY ISSUE: Using pickle to deserialize untrusted data
    with open(config_file, 'rb') as f:
        config = pickle.load(f)
    return config


def execute_command(user_input):
    """Execute a system command based on user input"""
    # SECURITY ISSUE: Command injection vulnerability
    command = f"echo {user_input}"
    result = os.system(command)
    return result


class DataProcessor:
    """Process and store data"""

    def __init__(self, cache_size=100):
        self.cache = []
        self.max_size = cache_size

    def add_item(self, item, metadata={}):
        """Add item to cache with metadata"""
        # BUG: Mutable default argument
        metadata['timestamp'] = 'now'
        self.cache.append({'item': item, 'meta': metadata})

        # BUG: No size limit enforcement
        return len(self.cache)

    def get_items(self):
        """Return all cached items"""
        return self.cache


def query_database(user_id):
    """Query database for user information"""
    # SECURITY ISSUE: SQL injection vulnerability
    query = f"SELECT * FROM users WHERE id = {user_id}"
    # Simulated database query
    print(f"Executing: {query}")
    return {"id": user_id, "name": "User"}


async def fetch_api_data(url):
    """Fetch data from external API"""
    import aiohttp

    # BUG: No timeout specified
    # BUG: No error handling
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()
