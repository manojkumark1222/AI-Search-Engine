"""
Database migration script to add new columns to Connection model.
Run this script once to update existing databases with new fields:
- status
- last_used
- last_tested
"""
import sqlite3
import sys
from pathlib import Path

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

def migrate_database():
    """Add new columns to connections table if they don't exist"""
    # Check for database file in current directory
    db_path = Path("data_analyzer.db")
    
    if not db_path.exists():
        print(f"Database file '{db_path}' not found in current directory.")
        print("Checking if database exists elsewhere...")
        # Try to find it
        import os
        if os.path.exists("data_analyzer.db"):
            db_path = Path("data_analyzer.db")
        else:
            print("ERROR: Database file not found!")
            print("The database will be created automatically when the server starts.")
            print("However, you need to run this migration AFTER the database is created.")
            return
    
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()
    
    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(connections)")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Add status column if it doesn't exist
        if 'status' not in columns:
            print("Adding 'status' column to connections table...")
            cursor.execute("ALTER TABLE connections ADD COLUMN status VARCHAR DEFAULT 'active'")
            print("[OK] Added 'status' column")
        else:
            print("[OK] 'status' column already exists")
        
        # Add last_used column if it doesn't exist
        if 'last_used' not in columns:
            print("Adding 'last_used' column to connections table...")
            cursor.execute("ALTER TABLE connections ADD COLUMN last_used TIMESTAMP")
            print("[OK] Added 'last_used' column")
        else:
            print("[OK] 'last_used' column already exists")
        
        # Add last_tested column if it doesn't exist
        if 'last_tested' not in columns:
            print("Adding 'last_tested' column to connections table...")
            cursor.execute("ALTER TABLE connections ADD COLUMN last_tested TIMESTAMP")
            print("[OK] Added 'last_tested' column")
        else:
            print("[OK] 'last_tested' column already exists")
        
        conn.commit()
        print("\n[SUCCESS] Database migration completed successfully!")
        
    except Exception as e:
        print(f"[ERROR] Error during migration: {e}")
        import traceback
        traceback.print_exc()
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("=" * 50)
    print("Database Migration Script")
    print("=" * 50)
    print()
    migrate_database()
    print()
    print("=" * 50)

