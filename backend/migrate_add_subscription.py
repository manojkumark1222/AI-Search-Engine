"""
Migration script to add subscription plan fields to users table
Run this after updating models.py to add plan and subscription_expires_at columns
"""
import sqlite3
from datetime import datetime

def migrate_database():
    """Add subscription plan columns to users table"""
    db_path = "data_analyzer.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if plan column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add plan column if it doesn't exist
        if 'plan' not in columns:
            print("Adding 'plan' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN plan VARCHAR DEFAULT 'free'")
            # Update all existing users to free plan
            cursor.execute("UPDATE users SET plan = 'free' WHERE plan IS NULL")
            print("✓ Added 'plan' column")
        else:
            print("✓ 'plan' column already exists")
        
        # Add subscription_expires_at column if it doesn't exist
        if 'subscription_expires_at' not in columns:
            print("Adding 'subscription_expires_at' column to users table...")
            cursor.execute("ALTER TABLE users ADD COLUMN subscription_expires_at DATETIME")
            print("✓ Added 'subscription_expires_at' column")
        else:
            print("✓ 'subscription_expires_at' column already exists")
        
        # Create team_members table if it doesn't exist
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='team_members'
        """)
        if not cursor.fetchone():
            print("Creating 'team_members' table...")
            cursor.execute("""
                CREATE TABLE team_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    member_email VARCHAR NOT NULL,
                    role VARCHAR DEFAULT 'member',
                    invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    joined_at DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            print("✓ Created 'team_members' table")
        else:
            print("✓ 'team_members' table already exists")
        
        # Create scheduled_reports table if it doesn't exist
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='scheduled_reports'
        """)
        if not cursor.fetchone():
            print("Creating 'scheduled_reports' table...")
            cursor.execute("""
                CREATE TABLE scheduled_reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    name VARCHAR NOT NULL,
                    query_text TEXT NOT NULL,
                    schedule VARCHAR NOT NULL,
                    email_recipients TEXT,
                    last_run DATETIME,
                    next_run DATETIME,
                    is_active INTEGER DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            print("✓ Created 'scheduled_reports' table")
        else:
            print("✓ 'scheduled_reports' table already exists")
        
        # Create api_keys table if it doesn't exist
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='api_keys'
        """)
        if not cursor.fetchone():
            print("Creating 'api_keys' table...")
            cursor.execute("""
                CREATE TABLE api_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    key_name VARCHAR NOT NULL,
                    api_key VARCHAR UNIQUE NOT NULL,
                    is_active INTEGER DEFAULT 1,
                    last_used DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            """)
            print("✓ Created 'api_keys' table")
        else:
            print("✓ 'api_keys' table already exists")
        
        conn.commit()
        conn.close()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        raise

if __name__ == "__main__":
    print("Starting database migration...")
    print("=" * 50)
    migrate_database()
    print("=" * 50)

