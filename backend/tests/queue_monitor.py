#!/usr/bin/env python3
"""
Queue Monitor - Sends requests and monitors queue state in real-time
Usage: python queue_monitor.py [--send] [--monitor] [--interval SECONDS]
"""

import requests
import json
import time
import argparse
import os
from pathlib import Path

BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5000')
REQUEST_FILE = Path(__file__).parent / "request.json"
QUEUE_FILE = Path(__file__).parent / "queue.json"


def send_request_from_file():
    """Send request using data from request.json"""
    try:
        with open(REQUEST_FILE, 'r') as f:
            data = json.load(f)
        
        print(f"📤 Sending request to {BASE_URL}/queue/enqueue...")
        print(f"   Data: {json.dumps(data, indent=2)}")
        
        response = requests.post(
            f"{BASE_URL}/queue/enqueue",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        
        result = response.json()
        
        if response.status_code in [200, 201]:
            print(f"✅ Success: {result.get('message', 'Person added')}")
            if 'data' in result:
                print(f"   Entry: {json.dumps(result['data'], indent=2)}")
        else:
            print(f"❌ Error ({response.status_code}): {result.get('message', 'Unknown error')}")
        
        return response.status_code in [200, 201]
        
    except FileNotFoundError:
        print(f"❌ Error: {REQUEST_FILE} not found")
        return False
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to {BASE_URL}. Is the server running?")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def fetch_queue():
    """Fetch current queue state"""
    try:
        response = requests.get(f"{BASE_URL}/queue")
        
        if response.status_code == 200:
            return response.json().get('data', {})
        else:
            print(f"❌ Error fetching queue: {response.status_code}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to {BASE_URL}")
        return None
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None


def update_queue_file():
    """Fetch queue and save to queue.json"""
    queue_data = fetch_queue()
    
    if queue_data is not None:
        with open(QUEUE_FILE, 'w') as f:
            json.dump(queue_data, f, indent=2)
        
        queue_length = queue_data.get('queue_length', 0)
        now_serving = queue_data.get('now_serving', {})
        
        print(f"\n📊 Queue State (saved to {QUEUE_FILE.name}):")
        print(f"   Length: {queue_length}")
        
        if now_serving:
            print(f"   Now Serving: {now_serving.get('name')} (Position {now_serving.get('position')})")
        else:
            print(f"   Now Serving: None (Queue empty)")
        
        if queue_length > 0:
            print(f"\n   Queue Entries:")
            for entry in queue_data.get('queue', []):
                priority_label = "HIGH" if entry['priority'] == 0 else "NORMAL"
                print(f"      {entry['position']}. {entry['name']} - Age {entry['age']} - Priority {priority_label} - Date {entry['preferred_date']}")
        
        return True
    return False


def monitor_queue(interval=2):
    """Continuously monitor and update queue"""
    print(f"\n🔄 Starting queue monitor (updating every {interval}s)")
    print("Press Ctrl+C to stop\n")
    
    try:
        while True:
            update_queue_file()
            time.sleep(interval)
    except KeyboardInterrupt:
        print("\n\n⏹️  Monitor stopped")


def main():
    parser = argparse.ArgumentParser(description='Queue Monitor - Send requests and monitor queue')
    parser.add_argument('--send', action='store_true', help='Send request from request.json')
    parser.add_argument('--monitor', action='store_true', help='Continuously monitor queue')
    parser.add_argument('--interval', type=int, default=2, help='Monitor interval in seconds (default: 2)')
    parser.add_argument('--once', action='store_true', help='Fetch queue once and update queue.json')
    
    args = parser.parse_args()
    
    # If no arguments, show help
    if not (args.send or args.monitor or args.once):
        parser.print_help()
        print("\n💡 Quick examples:")
        print("   Send request:           python queue_monitor.py --send")
        print("   Update queue once:      python queue_monitor.py --once")
        print("   Monitor continuously:   python queue_monitor.py --monitor")
        print("   Send + monitor:         python queue_monitor.py --send --monitor")
        return
    
    # Send request if requested
    if args.send:
        send_request_from_file()
        print()
    
    # Monitor continuously if requested
    if args.monitor:
        monitor_queue(args.interval)
    elif args.once or args.send:
        # Just update once
        update_queue_file()


if __name__ == "__main__":
    main()
