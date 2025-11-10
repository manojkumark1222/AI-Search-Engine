"""Initialize database with default admin user"""
from database import init_db, SessionLocal
from models import User
from routers.auth import get_password_hash

def create_default_user():
    """Create a default admin user if it doesn't exist"""
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            # Create default admin user
            # Ensure password is not longer than 72 bytes (bcrypt limit)
            password = "admin"
            if len(password.encode('utf-8')) > 72:
                password = password[:72].encode('utf-8').decode('utf-8', errors='ignore')
            
            hashed_password = get_password_hash(password)
            admin = User(
                email="admin@example.com",
                hashed_password=hashed_password
            )
            db.add(admin)
            db.commit()
            print("[OK] Default admin user created:")
            print("  Email: admin@example.com")
            print("  Password: admin")
        else:
            print("[OK] Admin user already exists")
    except Exception as e:
        print(f"Error creating default user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("[OK] Database initialized")
    create_default_user()

