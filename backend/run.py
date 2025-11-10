"""Run script for the backend server"""
import uvicorn
from main import app

if __name__ == "__main__":
    port = 8888
    print("=" * 50)
    print("Starting Data Visualizer & Analyzer Tool API...")
    print("=" * 50)
    print(f"API will be available at: http://127.0.0.1:{port}")
    print(f"API Documentation: http://127.0.0.1:{port}/docs")
    print("=" * 50)
    print("\nKeep this window open while using the application!")
    print("Press CTRL+C to stop the server\n")
    try:
        uvicorn.run(app, host="127.0.0.1", port=port, reload=True)
    except Exception as e:
        print(f"\nERROR: Failed to start server: {e}")
        print("\nPossible solutions:")
        print("1. Port 8888 might be in use - close other applications")
        print("2. Try running as Administrator")
        print("3. Check Windows Firewall settings")
        input("\nPress Enter to exit...")

