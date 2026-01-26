from flask import Blueprint, request, jsonify
from queue_system import QueueManager

queue_bp = Blueprint('queue', __name__, url_prefix='/queue')
queue_manager = QueueManager()

@queue_bp.route('/enqueue', methods=['POST'])
def enqueue():
    if not request.is_json:
        return jsonify({'success': False, 'message': 'Invalid content type'}), 400
    
    person_data = request.get_json()
    success, message, entry = queue_manager.enqueue(person_data)
    
    if success:
        return jsonify({'success': True, 'message': message, 'data': entry}), 201
    else:
        return jsonify({'success': False, 'message': message}), 400

@queue_bp.route('', methods=['GET'])
def get_queue():
    queue_state = queue_manager.get_queue_state()
    return jsonify({'success': True, 'data': queue_state}), 200

@queue_bp.route('/dequeue', methods=['POST'])
def dequeue():
    success, message, entry = queue_manager.dequeue()
    
    if success:
        return jsonify({'success': True, 'message': message, 'data': entry}), 200
    else:
        return jsonify({'success': False, 'message': message}), 404

@queue_bp.route('/clear', methods=['POST'])
def clear_queue():
    queue_manager.clear_queue()
    return jsonify({'success': True, 'message': 'Queue cleared'}), 200

@queue_bp.route('/entry/<cert_no>', methods=['GET'])
def get_entry(cert_no):
    """Get specific person's position and info in queue"""
    success, message, entry = queue_manager.get_entry_by_cert(cert_no)
    
    if success:
        return jsonify({'success': True, 'message': message, 'data': entry}), 200
    else:
        return jsonify({'success': False, 'message': message}), 404

@queue_bp.route('/entry/<cert_no>', methods=['DELETE'])
def remove_entry(cert_no):
    """Remove specific person from queue"""
    success, message, entry = queue_manager.remove_entry_by_cert(cert_no)
    
    if success:
        return jsonify({'success': True, 'message': message, 'data': entry}), 200
    else:
        return jsonify({'success': False, 'message': message}), 404

@queue_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get queue statistics"""
    queue_state = queue_manager.get_queue_state()
    queue_list = queue_state.get('queue', [])
    
    # Count by priority
    priority_0_count = sum(1 for entry in queue_list if entry.get('priority') == 0)
    priority_1_count = sum(1 for entry in queue_list if entry.get('priority') == 1)
    
    # Count by mode
    presence_count = sum(1 for entry in queue_list if entry.get('verification_mode') == 'presence')
    online_count = sum(1 for entry in queue_list if entry.get('verification_mode') == 'online')
    
    # Calculate average age
    ages = [entry.get('age', 0) for entry in queue_list]
    avg_age = sum(ages) / len(ages) if ages else 0
    
    # Estimate wait time (5 minutes per person)
    estimated_wait = queue_state['queue_length'] * 5
    
    stats = {
        'total_in_queue': queue_state['queue_length'],
        'priority_0_count': priority_0_count,
        'priority_1_count': priority_1_count,
        'presence_mode_count': presence_count,
        'online_mode_count': online_count,
        'average_age': round(avg_age, 1),
        'estimated_wait_time_minutes': estimated_wait,
        'now_serving': queue_state['now_serving']['life_certificate_no'] if queue_state['now_serving'] else None,
        'last_updated': queue_state['last_updated'],
        'queue_empty': queue_state['queue_length'] == 0
    }
    
    return jsonify({'success': True, 'data': stats}), 200
