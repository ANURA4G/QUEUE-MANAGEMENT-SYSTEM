from datetime import datetime
from typing import Dict, Any

class QueueEntry:
    def __init__(
        self,
        life_certificate_no: str,
        name: str,
        age: int,
        phone: str,
        proof_guardian_name: str,
        verification_mode: str,
        priority: int,
        sequence: int,
        preferred_date: str,
        preferred_time: str
    ):
        self.life_certificate_no = life_certificate_no
        self.name = name
        self.age = age
        self.phone = phone
        self.proof_guardian_name = proof_guardian_name
        self.verification_mode = verification_mode
        self.priority = priority
        self.sequence = sequence
        self.preferred_date = preferred_date
        self.preferred_time = preferred_time
        self.created_at = datetime.utcnow().isoformat() + "Z"
        self.status = "waiting"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'life_certificate_no': self.life_certificate_no,
            'name': self.name,
            'age': self.age,
            'phone': self.phone,
            'proof_guardian_name': self.proof_guardian_name,
            'preferred_date': self.preferred_date,
            'preferred_time': self.preferred_time,
            'verification_mode': self.verification_mode,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at
        }
    
    def __lt__(self, other):
        """Compare entries for priority queue ordering
        Lower values have higher priority (served first)
        """
        if self.priority != other.priority:
            return self.priority < other.priority
        if self.preferred_date != other.preferred_date:
            return self.preferred_date < other.preferred_date
        if self.preferred_time != other.preferred_time:
            return self.preferred_time < other.preferred_time
        return self.sequence < other.sequence
    
    def __eq__(self, other):
        """Equality based on life certificate number"""
        return self.life_certificate_no == other.life_certificate_no
