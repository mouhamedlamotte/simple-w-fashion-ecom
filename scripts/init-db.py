import sqlite3
import os

# Create database file
db_path = os.path.join(os.path.dirname(__file__), '..', 'prisma', 'dev.db')
os.makedirs(os.path.dirname(db_path), exist_ok=True)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("Database initialized successfully!")
print(f"Database location: {db_path}")

conn.close()
