#!/usr/bin/env python3
"""
Quick test script to verify the Queue API functionality
"""

import requests
import json
import time
import os

BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5000')

def print_response(title, response):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))

def test_api():
    print("\n🚀 Starting Queue API Tests...\n")
    
    # Test 1: Health Check
    print("\n📌 Test 1: Health Check")
    response = requests.get(f"{BASE_URL}/health")
    print_response("Health Check", response)
    
    # Test 2: Clear Queue (start fresh)
    print("\n📌 Test 2: Clear Queue")
    response = requests.post(f"{BASE_URL}/queue/clear")
    print_response("Clear Queue", response)
    
    # Test 3: Add person with high priority (age 85)
    print("\n📌 Test 3: Add High Priority Person (age 85)")
    person1 = {
        "life_certificate_no": "LC001",
        "name": "Elderly Person",
        "age": 85,
        "phone": "9876543210",
        "proof_guardian_name": "Guardian One",
        "verification_mode": "presence",
        "preferred_date": "2026-01-25",
        "preferred_time": "10:00"
    }
    response = requests.post(f"{BASE_URL}/queue/enqueue", json=person1)
    print_response("Add High Priority Person", response)
    
    # Test 4: Add person with normal priority (age 65)
    print("\n📌 Test 4: Add Normal Priority Person (age 65)")
    person2 = {
        "life_certificate_no": "LC002",
        "name": "Middle Age Person",
        "age": 65,
        "phone": "9876543211",
        "proof_guardian_name": "Guardian Two",
        "verification_mode": "online",
        "preferred_date": "2026-01-25",
        "preferred_time": "09:00"
    }
    response = requests.post(f"{BASE_URL}/queue/enqueue", json=person2)
    print_response("Add Normal Priority Person", response)
    
    # Test 5: Add another person (age 70)
    print("\n📌 Test 5: Add Another Person (age 70)")
    person3 = {
        "life_certificate_no": "LC003",
        "name": "Senior Person",
        "age": 70,
        "phone": "9876543212",
        "proof_guardian_name": "Guardian Three",
        "verification_mode": "presence",
        "preferred_date": "2026-01-25",
        "preferred_time": "11:00"
    }
    response = requests.post(f"{BASE_URL}/queue/enqueue", json=person3)
    print_response("Add Another Person", response)
    
    # Test 6: Get Full Queue
    print("\n📌 Test 6: Get Full Queue State")
    response = requests.get(f"{BASE_URL}/queue")
    print_response("Full Queue State", response)
    
    # Test 7: Get Queue Statistics
    print("\n📌 Test 7: Get Queue Statistics")
    response = requests.get(f"{BASE_URL}/queue/stats")
    print_response("Queue Statistics", response)
    
    # Test 8: Check Specific Person's Position
    print("\n📌 Test 8: Check Person LC002's Position")
    response = requests.get(f"{BASE_URL}/queue/entry/LC002")
    print_response("Person Position", response)
    
    # Test 9: Dequeue (Serve Next Person)
    print("\n📌 Test 9: Serve Next Person")
    response = requests.post(f"{BASE_URL}/queue/dequeue")
    print_response("Dequeue Person", response)
    
    # Test 10: Get Updated Queue
    print("\n📌 Test 10: Get Updated Queue")
    response = requests.get(f"{BASE_URL}/queue")
    print_response("Updated Queue", response)
    
    # Test 11: Remove Specific Person
    print("\n📌 Test 11: Remove Person LC003")
    response = requests.delete(f"{BASE_URL}/queue/entry/LC003")
    print_response("Remove Person", response)
    
    # Test 12: Final Queue State
    print("\n📌 Test 12: Final Queue State")
    response = requests.get(f"{BASE_URL}/queue")
    print_response("Final Queue", response)
    
    # Test 13: Try to add duplicate
    print("\n📌 Test 13: Try Adding Duplicate (Should Fail)")
    response = requests.post(f"{BASE_URL}/queue/enqueue", json=person2)
    print_response("Add Duplicate (Should Fail)", response)
    
    # Test 14: Invalid data
    print("\n📌 Test 14: Try Invalid Data (Should Fail)")
    invalid_person = {
        "life_certificate_no": "LC999",
        "name": "Invalid Person",
        "age": 200,  # Invalid age
        "phone": "123",  # Invalid phone
        "proof_guardian_name": "Guardian",
        "verification_mode": "invalid",  # Invalid mode
        "preferred_date": "2026-01-25",
        "preferred_time": "10:00"
    }
    response = requests.post(f"{BASE_URL}/queue/enqueue", json=invalid_person)
    print_response("Invalid Data (Should Fail)", response)
    
    print("\n✅ All Tests Completed!\n")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to server!")
        print("Make sure the Flask server is running: python app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
