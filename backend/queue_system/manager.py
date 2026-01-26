import heapq
from threading import Lock
from datetime import datetime
from typing import List, Dict, Any, Optional
from .models import QueueEntry
from .utils import calculate_priority, validate_person_data

class QueueManager:
    def __init__(self):
        self._lock = Lock()
        self._heap = []
        self._sequence_counter = 0
        self._entries_by_cert = {}
        self._last_updated = datetime.utcnow().isoformat() + "Z"
    
    def enqueue(self, person_data: dict) -> tuple[bool, str, Optional[Dict[str, Any]]]:
        is_valid, error_msg = validate_person_data(person_data)
        if not is_valid:
            return False, error_msg, None
        
        with self._lock:
            cert_no = person_data['life_certificate_no']
            if cert_no in self._entries_by_cert:
                return False, f"Person with life_certificate_no {cert_no} already in queue", None
            
            age = int(person_data['age'])
            priority = calculate_priority(age)
            
            entry = QueueEntry(
                life_certificate_no=cert_no,
                name=person_data['name'],
                age=age,
                phone=person_data['phone'],
                proof_guardian_name=person_data['proof_guardian_name'],
                verification_mode=person_data['verification_mode'],
                priority=priority,
                sequence=self._sequence_counter,
                preferred_date=person_data['preferred_date'],
                preferred_time=person_data['preferred_time']
            )
            
            self._sequence_counter += 1
            
            heapq.heappush(self._heap, entry)
            self._entries_by_cert[cert_no] = entry
            self._last_updated = datetime.utcnow().isoformat() + "Z"
            
            return True, "Person added to queue successfully", entry.to_dict()
    
    def dequeue(self) -> tuple[bool, str, Optional[Dict[str, Any]]]:
        with self._lock:
            if not self._heap:
                return False, "Queue is empty", None
            
            entry = heapq.heappop(self._heap)
            del self._entries_by_cert[entry.life_certificate_no]
            self._last_updated = datetime.utcnow().isoformat() + "Z"
            
            return True, "Person dequeued successfully", entry.to_dict()
    
    def get_queue_state(self) -> Dict[str, Any]:
        with self._lock:
            sorted_entries = sorted(self._heap)
            
            queue_list = []
            for position, entry in enumerate(sorted_entries, start=1):
                entry_dict = entry.to_dict()
                entry_dict['position'] = position
                queue_list.append(entry_dict)
            
            response = {
                'queue_length': len(sorted_entries),
                'now_serving': queue_list[0] if queue_list else None,
                'last_updated': self._last_updated,
                'queue': queue_list
            }
            
            return response
    
    def clear_queue(self):
        with self._lock:
            self._heap.clear()
            self._entries_by_cert.clear()
            self._sequence_counter = 0
            self._last_updated = datetime.utcnow().isoformat() + "Z"
    
    def get_entry_by_cert(self, cert_no: str) -> tuple[bool, str, Optional[Dict[str, Any]]]:
        """Get specific person's queue information by certificate number"""
        with self._lock:
            if cert_no not in self._entries_by_cert:
                return False, f"Person with certificate {cert_no} not found in queue", None
            
            entry = self._entries_by_cert[cert_no]
            sorted_entries = sorted(self._heap)
            
            # Find position in queue
            position = next((i + 1 for i, e in enumerate(sorted_entries) if e.life_certificate_no == cert_no), None)
            
            entry_dict = entry.to_dict()
            entry_dict['position'] = position
            entry_dict['people_ahead'] = position - 1 if position else 0
            
            return True, "Entry found", entry_dict
    
    def remove_entry_by_cert(self, cert_no: str) -> tuple[bool, str, Optional[Dict[str, Any]]]:
        """Remove specific person from queue by certificate number"""
        with self._lock:
            if cert_no not in self._entries_by_cert:
                return False, f"Person with certificate {cert_no} not found in queue", None
            
            entry = self._entries_by_cert[cert_no]
            del self._entries_by_cert[cert_no]
            
            # Remove from heap
            self._heap.remove(entry)
            heapq.heapify(self._heap)
            self._last_updated = datetime.utcnow().isoformat() + "Z"
            
            return True, "Person removed from queue successfully", entry.to_dict()
