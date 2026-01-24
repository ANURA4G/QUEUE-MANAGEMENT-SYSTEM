# Queue System Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - React/Vue/HTML App                                 │  │
│  │  - Polling every 3 seconds                            │  │
│  │  - Display queue positions                            │  │
│  │  - Add/Remove operations                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL SERVERLESS                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    FLASK API                          │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌─────────────────────────────┐  │  │
│  │  │   app.py     │  │    routes/queue_routes.py    │  │  │
│  │  │              │  │                               │  │  │
│  │  │ - CORS       │  │  POST /queue/enqueue         │  │  │
│  │  │ - Error      │  │  GET  /queue                 │  │  │
│  │  │   Handlers   │  │  GET  /queue/entry/{cert}    │  │  │
│  │  │ - Health     │  │  POST /queue/dequeue         │  │  │
│  │  │   Check      │  │  DELETE /queue/entry/{cert}  │  │  │
│  │  │              │  │  GET  /queue/stats           │  │  │
│  │  │              │  │  POST /queue/clear           │  │  │
│  │  └──────────────┘  └─────────────────────────────┘  │  │
│  │                              │                        │  │
│  │                              ▼                        │  │
│  │               ┌──────────────────────────┐           │  │
│  │               │  queue_system/           │           │  │
│  │               │                          │           │  │
│  │               │  ┌────────────────────┐ │           │  │
│  │               │  │  manager.py        │ │           │  │
│  │               │  │  ─────────────────  │ │           │  │
│  │               │  │  QueueManager:     │ │           │  │
│  │               │  │  - _heap (priority)│ │           │  │
│  │               │  │  - _lock (thread)  │ │           │  │
│  │               │  │  - enqueue()       │ │           │  │
│  │               │  │  - dequeue()       │ │           │  │
│  │               │  │  - get_entry()     │ │           │  │
│  │               │  │  - remove_entry()  │ │           │  │
│  │               │  └────────────────────┘ │           │  │
│  │               │                          │           │  │
│  │               │  ┌────────────────────┐ │           │  │
│  │               │  │  models.py         │ │           │  │
│  │               │  │  ─────────────────  │ │           │  │
│  │               │  │  QueueEntry:       │ │           │  │
│  │               │  │  - priority        │ │           │  │
│  │               │  │  - sequence        │ │           │  │
│  │               │  │  - person data     │ │           │  │
│  │               │  │  - __lt__()        │ │           │  │
│  │               │  └────────────────────┘ │           │  │
│  │               │                          │           │  │
│  │               │  ┌────────────────────┐ │           │  │
│  │               │  │  utils.py          │ │           │  │
│  │               │  │  ─────────────────  │ │           │  │
│  │               │  │  - validate()      │ │           │  │
│  │               │  │  - calc_priority() │ │           │  │
│  │               │  └────────────────────┘ │           │  │
│  │               └──────────────────────────┘           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding a Person to Queue

```
Frontend Request
     │
     ▼
POST /queue/enqueue
     │
     ▼
┌─────────────────────┐
│ Validate Input      │
│ - Check all fields  │
│ - Format validation │
│ - Range validation  │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Calculate Priority  │
│ age >= 80 ? 0 : 1   │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Create QueueEntry   │
│ - Assign sequence   │
│ - Set timestamp     │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Add to Heap         │
│ - Thread-safe push  │
│ - Update tracking   │
│ - Set last_updated  │
└─────────────────────┘
     │
     ▼
Return JSON Response
```

### Getting Queue State

```
Frontend Request (every 3s)
     │
     ▼
GET /queue
     │
     ▼
┌─────────────────────┐
│ Acquire Lock        │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Sort Heap           │
│ - Priority order    │
│ - Date/Time order   │
│ - FIFO within same  │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Calculate Positions │
│ - Enumerate entries │
│ - Assign position # │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Build Response      │
│ - queue_length      │
│ - now_serving       │
│ - queue array       │
│ - last_updated      │
└─────────────────────┘
     │
     ▼
Return JSON Response
```

### Serving Next Person

```
Frontend Request
     │
     ▼
POST /queue/dequeue
     │
     ▼
┌─────────────────────┐
│ Acquire Lock        │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Check if Empty      │
│ - Return 404 if yes │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Pop from Heap       │
│ - Gets highest      │
│   priority person   │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Remove from Dict    │
│ - Delete entry      │
│ - Update timestamp  │
└─────────────────────┘
     │
     ▼
Return Served Person
```

## Priority Queue Mechanics

### Heap Structure

```
                  ┌─────────────┐
                  │  Priority 0  │
                  │   Age 85     │
                  │  09:00 AM    │
                  └─────────────┘
                       /    \
                      /      \
              ┌─────────┐  ┌─────────┐
              │Priority 0│  │Priority 0│
              │  Age 82  │  │  Age 80  │
              │ 10:00 AM │  │ 02:00 PM │
              └─────────┘  └─────────┘
                /    \
               /      \
       ┌─────────┐  ┌─────────┐
       │Priority 1│  │Priority 1│
       │  Age 75  │  │  Age 70  │
       │ 09:00 AM │  │ 11:00 AM │
       └─────────┘  └─────────┘
```

### Comparison Logic

```python
def __lt__(self, other):
    # Lower values = higher priority (served first)
    
    if self.priority != other.priority:
        return self.priority < other.priority  # 0 before 1
    
    if self.preferred_date != other.preferred_date:
        return self.preferred_date < other.preferred_date  # Earlier dates first
    
    if self.preferred_time != other.preferred_time:
        return self.preferred_time < other.preferred_time  # Earlier times first
    
    return self.sequence < other.sequence  # FIFO as tiebreaker
```

## Thread Safety

### Lock Mechanism

```
Thread 1: Add Person          Thread 2: Get Queue
     │                              │
     ▼                              ▼
Acquire Lock ───────────────────────┤
     │                              │
     ▼                              │ (Waiting...)
Add to Heap                         │
     │                              │
     ▼                              │
Release Lock                        │
     │                              ▼
     └─────────────────────► Acquire Lock
                                    │
                                    ▼
                              Read Queue
                                    │
                                    ▼
                              Release Lock
```

## Request/Response Flow

### Example: Add Person

```
REQUEST:
POST /queue/enqueue
Content-Type: application/json

{
  "life_certificate_no": "LC123456",
  "name": "John Doe",
  "age": 85,
  "phone": "9876543210",
  "proof_guardian_name": "Jane Doe",
  "verification_mode": "presence",
  "preferred_date": "2026-01-25",
  "preferred_time": "10:00"
}

RESPONSE (201):
{
  "success": true,
  "message": "Person added to queue successfully",
  "data": {
    "life_certificate_no": "LC123456",
    "name": "John Doe",
    "age": 85,
    "priority": 0,
    "status": "waiting",
    "created_at": "2026-01-24T10:30:45.123456Z"
  }
}
```

## Deployment Architecture

```
┌──────────────────┐
│  GitHub Repo     │
│  (Your Code)     │
└──────────────────┘
         │
         │ git push
         ▼
┌──────────────────┐
│  Vercel CI/CD    │
│  Auto Deploy     │
└──────────────────┘
         │
         ▼
┌───────────────────────────────┐
│   Vercel Edge Network         │
│                               │
│  ┌─────────────────────────┐ │
│  │  Mumbai Region (bom1)    │ │
│  │                          │ │
│  │  ┌────────────────────┐ │ │
│  │  │ Flask App Instance │ │ │
│  │  │ (Serverless)       │ │ │
│  │  └────────────────────┘ │ │
│  └─────────────────────────┘ │
└───────────────────────────────┘
         │
         │ HTTPS
         ▼
┌──────────────────┐
│  Frontend App    │
│  (Polling API)   │
└──────────────────┘
```

## Performance Characteristics

| Operation | Time Complexity | Thread Safe |
|-----------|----------------|-------------|
| enqueue() | O(log n) | ✅ Yes |
| dequeue() | O(log n) | ✅ Yes |
| get_queue_state() | O(n log n) | ✅ Yes |
| get_entry_by_cert() | O(n) | ✅ Yes |
| remove_entry_by_cert() | O(n) | ✅ Yes |

## Memory Usage

```
Per QueueEntry: ~200 bytes
1000 people: ~200 KB
10000 people: ~2 MB

Vercel Limits:
- Hobby: 1024 MB (can handle ~5M entries theoretically)
- Pro: 3009 MB (can handle ~15M entries theoretically)

Practical limit: ~50K-100K entries for optimal performance
```

## API Endpoints Summary

```
┌──────────┬─────────────────────────────┬──────────────────┐
│ Method   │ Endpoint                    │ Purpose          │
├──────────┼─────────────────────────────┼──────────────────┤
│ GET      │ /health                     │ Health check     │
│ POST     │ /queue/enqueue              │ Add person       │
│ GET      │ /queue                      │ Get full queue   │
│ GET      │ /queue/entry/{cert_no}      │ Check position   │
│ POST     │ /queue/dequeue              │ Serve next       │
│ DELETE   │ /queue/entry/{cert_no}      │ Remove person    │
│ GET      │ /queue/stats                │ Get statistics   │
│ POST     │ /queue/clear                │ Clear all        │
└──────────┴─────────────────────────────┴──────────────────┘
```

---

**This architecture provides:**
- ✅ Thread-safe operations
- ✅ O(log n) queue operations
- ✅ Real-time updates via polling
- ✅ Scalable serverless deployment
- ✅ Automatic HTTPS and CDN
- ✅ Global availability
