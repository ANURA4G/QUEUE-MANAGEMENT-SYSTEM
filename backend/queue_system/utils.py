from datetime import datetime

def calculate_priority(age: int) -> int:
    return 0 if age >= 80 else 1

def validate_person_data(data: dict) -> tuple[bool, str]:
    required_fields = [
        'life_certificate_no',
        'name',
        'age',
        'phone',
        'proof_guardian_name',
        'verification_mode',
        'preferred_date',
        'preferred_time'
    ]
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
        if not data[field]:
            return False, f"Field cannot be empty: {field}"
    
    # Validate age
    try:
        age = int(data['age'])
        if age < 0 or age > 150:
            return False, "Age must be between 0 and 150"
    except (ValueError, TypeError):
        return False, "Age must be a valid integer"
    
    # Validate verification_mode
    valid_modes = ['presence', 'online']
    if data['verification_mode'] not in valid_modes:
        return False, f"verification_mode must be 'presence' or 'online'"
    
    # Validate life_certificate_no format (non-empty string)
    if not isinstance(data['life_certificate_no'], str) or len(str(data['life_certificate_no']).strip()) == 0:
        return False, "life_certificate_no must be a non-empty string"
    
    # Validate preferred_date format (YYYY-MM-DD)
    try:
        datetime.strptime(data['preferred_date'], '%Y-%m-%d')
    except (ValueError, TypeError):
        return False, "preferred_date must be in YYYY-MM-DD format (e.g., 2026-01-25)"
    
    # Validate preferred_time format (HH:MM)
    try:
        datetime.strptime(data['preferred_time'], '%H:%M')
    except (ValueError, TypeError):
        return False, "preferred_time must be in HH:MM format (e.g., 09:30 or 14:00)"
    
    # Validate phone (10 digits)
    phone = str(data['phone']).strip()
    if not phone.isdigit() or len(phone) != 10:
        return False, "phone must be a 10-digit number"
    
    return True, ""
