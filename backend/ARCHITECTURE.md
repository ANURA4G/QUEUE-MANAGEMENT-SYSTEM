# Queue System Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph Frontend["🌐 FRONTEND LAYER"]
        FE["📱 Client Application"]
        FE_UI["🎨 UI Components<br/>- Queue Display<br/>- Position Tracker<br/>- Real-time Updates"]
        FE_API["🔌 API Client<br/>- Axios/Fetch<br/>- Error Handling<br/>- Retry Logic"]
        FE_STATE["📊 State Management<br/>- Redux/Vuex<br/>- Local Cache<br/>- Polling Timer"]
        
        FE --> FE_UI
        FE --> FE_API
        FE --> FE_STATE
    end
    
    subgraph Vercel["☁️ VERCEL SERVERLESS PLATFORM"]
        EDGE["🌍 Edge Network<br/>- Global CDN<br/>- Auto Scaling<br/>- Load Balancing"]
        
        subgraph Flask["⚡ FLASK API LAYER"]
            APP["🏗️ app.py<br/>Main Application"]
            CONFIG["⚙️ config.py<br/>- Environment Vars<br/>- GPT-5.1 Config<br/>- CORS Settings"]
            MIDDLEWARE["🔒 Middleware<br/>- CORS Handler<br/>- Error Handler<br/>- Request Logger"]
            
            subgraph Routes["🛣️ ROUTES MODULE"]
                ROUTES["📡 queue_routes.py<br/>Blueprint Handler"]
                EP1["➕ POST /queue/enqueue<br/>Add to queue"]
                EP2["📋 GET /queue<br/>Get all entries"]
                EP3["🔍 GET /queue/entry/:cert<br/>Check position"]
                EP4["⏭️ POST /queue/dequeue<br/>Serve next"]
                EP5["❌ DELETE /queue/entry/:cert<br/>Remove entry"]
                EP6["📊 GET /queue/stats<br/>Statistics"]
                EP7["🗑️ POST /queue/clear<br/>Clear all"]
                
                ROUTES --> EP1
                ROUTES --> EP2
                ROUTES --> EP3
                ROUTES --> EP4
                ROUTES --> EP5
                ROUTES --> EP6
                ROUTES --> EP7
            end
            
            subgraph QueueSystem["🎯 QUEUE SYSTEM CORE"]
                MGR["🧠 manager.py<br/>QueueManager"]
                MGR_HEAP["📦 _heap<br/>Min-Heap Priority Queue"]
                MGR_LOCK["🔐 _lock<br/>Thread Lock"]
                MGR_DICT["🗂️ _entries_by_cert<br/>Fast Lookup Dict"]
                MGR_SEQ["🔢 _sequence_counter<br/>FIFO Order"]
                
                MODELS["📝 models.py<br/>QueueEntry"]
                MODEL_FIELDS["📋 Fields:<br/>- life_certificate_no<br/>- name, age, phone<br/>- priority, sequence<br/>- preferred_date/time<br/>- verification_mode"]
                MODEL_COMPARE["⚖️ __lt__()<br/>Comparison Logic"]
                
                UTILS["🛠️ utils.py<br/>Helper Functions"]
                UTIL_VAL["✅ validate()<br/>Input Validation"]
                UTIL_PRIOR["🎯 calc_priority()<br/>Priority Calculation"]
                
                MGR --> MGR_HEAP
                MGR --> MGR_LOCK
                MGR --> MGR_DICT
                MGR --> MGR_SEQ
                MODELS --> MODEL_FIELDS
                MODELS --> MODEL_COMPARE
                UTILS --> UTIL_VAL
                UTILS --> UTIL_PRIOR
            end
            
            APP --> CONFIG
            APP --> MIDDLEWARE
            APP --> ROUTES
            ROUTES --> MGR
            MGR --> MODELS
            MGR --> UTILS
        end
        
        EDGE --> Flask
    end
    
    FE_API -->|"🔄 HTTP/JSON<br/>Polling: 3s<br/>REST API"| EDGE
    
    classDef frontendStyle fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    classDef vercelStyle fill:#000,stroke:#fff,stroke-width:2px,color:#fff
    classDef flaskStyle fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff
    classDef routeStyle fill:#2d3748,stroke:#48bb78,stroke-width:2px,color:#fff
    classDef queueStyle fill:#1a365d,stroke:#63b3ed,stroke-width:2px,color:#fff
    classDef managerStyle fill:#22543d,stroke:#68d391,stroke-width:2px,color:#fff
    
    class FE,FE_UI,FE_API,FE_STATE frontendStyle
    class EDGE,Vercel vercelStyle
    class APP,CONFIG,MIDDLEWARE flaskStyle
    class ROUTES,EP1,EP2,EP3,EP4,EP5,EP6,EP7 routeStyle
    class MGR,MGR_HEAP,MGR_LOCK,MGR_DICT,MGR_SEQ managerStyle
    class MODELS,MODEL_FIELDS,MODEL_COMPARE,UTILS,UTIL_VAL,UTIL_PRIOR queueStyle
```

## Data Flow

### Adding a Person to Queue

```mermaid
flowchart TD
    START(["👤 User Action<br/>Submit Form"])
    REQ["📤 Frontend Request<br/>Prepare Payload"]
    
    API["🌐 POST /queue/enqueue<br/>API Endpoint Hit"]
    
    AUTH{"🔐 Authentication<br/>& Authorization"}
    AUTH_FAIL["❌ 401 Unauthorized"]
    
    VALIDATE["✅ Validate Input<br/>utils.validate()"]
    VAL_CERT["📋 Check Certificate No<br/>Format: LC[0-9]+"]
    VAL_AGE["🎂 Validate Age<br/>Range: 0-120"]
    VAL_PHONE["📱 Validate Phone<br/>10 digits"]
    VAL_DATE["📅 Validate Date<br/>Not in past"]
    VAL_TIME["⏰ Validate Time<br/>Business hours"]
    
    VAL_FAIL{"❌ Validation Failed?"}
    VAL_ERR["🚫 400 Bad Request<br/>Return errors"]
    
    DUP_CHECK{"🔍 Duplicate Check<br/>Certificate exists?"}
    DUP_ERR["⚠️ 409 Conflict<br/>Already in queue"]
    
    PRIORITY["🎯 Calculate Priority<br/>utils.calc_priority()"]
    PRI_SENIOR["👵 Age ≥ 80<br/>Priority: 0"]
    PRI_NORMAL["🧑 Age < 80<br/>Priority: 1"]
    
    CREATE["📝 Create QueueEntry<br/>models.QueueEntry()"]
    CREATE_SEQ["🔢 Assign Sequence<br/>Counter increment"]
    CREATE_TIME["⏱️ Set Timestamp<br/>ISO 8601 UTC"]
    CREATE_STATUS["📊 Set Status<br/>'waiting'"]
    
    LOCK["🔒 Acquire Thread Lock<br/>_lock.__enter__()"]
    
    HEAP["📦 Add to Heap<br/>heapq.heappush()"]
    HEAP_SORT["↕️ Auto-sort by<br/>priority, date, time"]
    
    DICT["🗂️ Add to Dictionary<br/>_entries_by_cert"]
    DICT_INDEX["⚡ O(1) Lookup<br/>Fast access"]
    
    UPDATE["🔄 Update Metadata<br/>last_updated = now()"]
    
    UNLOCK["🔓 Release Lock<br/>_lock.__exit__()"]
    
    RESPONSE["✅ 201 Created<br/>Return entry data"]
    RESP_DATA["📋 Response includes:<br/>- position<br/>- priority<br/>- created_at<br/>- status"]
    
    END(["🎉 Success<br/>User notified"])
    
    START --> REQ
    REQ --> API
    API --> AUTH
    AUTH -->|"✅ Valid"| VALIDATE
    AUTH -->|"❌ Invalid"| AUTH_FAIL
    AUTH_FAIL --> END
    
    VALIDATE --> VAL_CERT
    VALIDATE --> VAL_AGE
    VALIDATE --> VAL_PHONE
    VALIDATE --> VAL_DATE
    VALIDATE --> VAL_TIME
    
    VAL_CERT --> VAL_FAIL
    VAL_AGE --> VAL_FAIL
    VAL_PHONE --> VAL_FAIL
    VAL_DATE --> VAL_FAIL
    VAL_TIME --> VAL_FAIL
    
    VAL_FAIL -->|"❌ Yes"| VAL_ERR
    VAL_FAIL -->|"✅ No"| DUP_CHECK
    VAL_ERR --> END
    
    DUP_CHECK -->|"✅ Unique"| PRIORITY
    DUP_CHECK -->|"❌ Exists"| DUP_ERR
    DUP_ERR --> END
    
    PRIORITY --> PRI_SENIOR
    PRIORITY --> PRI_NORMAL
    PRI_SENIOR --> CREATE
    PRI_NORMAL --> CREATE
    
    CREATE --> CREATE_SEQ
    CREATE --> CREATE_TIME
    CREATE --> CREATE_STATUS
    CREATE_SEQ --> LOCK
    CREATE_TIME --> LOCK
    CREATE_STATUS --> LOCK
    
    LOCK --> HEAP
    HEAP --> HEAP_SORT
    HEAP_SORT --> DICT
    DICT --> DICT_INDEX
    DICT_INDEX --> UPDATE
    UPDATE --> UNLOCK
    UNLOCK --> RESPONSE
    RESPONSE --> RESP_DATA
    RESP_DATA --> END
    
    classDef startStyle fill:#667eea,stroke:#764ba2,stroke-width:4px,color:#fff
    classDef processStyle fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#742a2a,stroke:#fc8181,stroke-width:3px,color:#fff
    classDef errorStyle fill:#c53030,stroke:#feb2b2,stroke-width:2px,color:#fff
    classDef successStyle fill:#22543d,stroke:#68d391,stroke-width:2px,color:#fff
    classDef dataStyle fill:#1a365d,stroke:#63b3ed,stroke-width:2px,color:#fff
    
    class START,END startStyle
    class REQ,API,VALIDATE,PRIORITY,CREATE,LOCK,HEAP,DICT,UPDATE,UNLOCK processStyle
    class VAL_CERT,VAL_AGE,VAL_PHONE,VAL_DATE,VAL_TIME,CREATE_SEQ,CREATE_TIME,CREATE_STATUS,HEAP_SORT,DICT_INDEX,RESP_DATA dataStyle
    class AUTH,VAL_FAIL,DUP_CHECK decisionStyle
    class AUTH_FAIL,VAL_ERR,DUP_ERR errorStyle
    class PRI_SENIOR,PRI_NORMAL,RESPONSE successStyle
```

### Getting Queue State

```mermaid
flowchart TD
    TIMER(["⏰ Polling Timer<br/>Every 3 seconds"])
    REQ["📤 Frontend Request<br/>GET /queue"]
    
    API["🌐 API Endpoint<br/>/queue handler"]
    
    CACHE{"💾 Check Cache<br/>Modified since last?"}
    CACHE_HIT["⚡ 304 Not Modified<br/>Use client cache"]
    
    LOCK["🔒 Acquire Thread Lock<br/>Prevent race conditions"]
    
    EMPTY{"📭 Queue Empty?"}
    EMPTY_RESP["📋 Empty Response<br/>queue_length: 0"]
    
    COPY["📦 Copy Heap<br/>Create snapshot"]
    COPY_SAFE["🛡️ Thread-safe copy<br/>No modification"]
    
    SORT["↕️ Sort Heap<br/>sorted() function"]
    SORT_P0["👵 Priority 0 first<br/>Seniors age ≥ 80"]
    SORT_P1["🧑 Priority 1 next<br/>Others age < 80"]
    SORT_DATE["📅 Then by Date<br/>Earlier dates first"]
    SORT_TIME["⏰ Then by Time<br/>Earlier times first"]
    SORT_SEQ["🔢 Then by Sequence<br/>FIFO tiebreaker"]
    
    POS["📍 Calculate Positions<br/>enumerate(start=1)"]
    POS_ITER["🔄 Iterate entries<br/>Position counter"]
    POS_ASSIGN["🏷️ Assign position<br/>entry['position'] = i"]
    
    BUILD["🏗️ Build Response Object"]
    BUILD_LEN["📊 queue_length<br/>Total entries"]
    BUILD_SERVE["⏭️ now_serving<br/>First entry or null"]
    BUILD_ARRAY["📋 queue<br/>Array of entries"]
    BUILD_TIME["⏱️ last_updated<br/>ISO 8601 timestamp"]
    BUILD_STATS["📈 statistics<br/>- avg_wait<br/>- priority_split"]
    
    ENRICH["✨ Enrich Data<br/>Add computed fields"]
    ENRICH_WAIT["⏳ estimated_wait<br/>Calculate ETA"]
    ENRICH_STATUS["📊 queue_status<br/>busy/normal/quiet"]
    
    UNLOCK["🔓 Release Lock<br/>Free resources"]
    
    CACHE_SET["💾 Set Cache Headers<br/>ETag & Last-Modified"]
    
    RESPONSE["✅ 200 OK<br/>Return JSON"]
    RESP_COMPRESS["🗜️ Gzip Compression<br/>Reduce bandwidth"]
    
    END(["📱 Update UI<br/>Display queue"])
    
    TIMER --> REQ
    REQ --> API
    API --> CACHE
    
    CACHE -->|"✅ Not modified"| CACHE_HIT
    CACHE -->|"🔄 Modified"| LOCK
    CACHE_HIT --> END
    
    LOCK --> EMPTY
    
    EMPTY -->|"✅ Yes"| EMPTY_RESP
    EMPTY -->|"❌ No"| COPY
    EMPTY_RESP --> UNLOCK
    
    COPY --> COPY_SAFE
    COPY_SAFE --> SORT
    
    SORT --> SORT_P0
    SORT --> SORT_P1
    SORT_P0 --> SORT_DATE
    SORT_P1 --> SORT_DATE
    SORT_DATE --> SORT_TIME
    SORT_TIME --> SORT_SEQ
    
    SORT_SEQ --> POS
    POS --> POS_ITER
    POS_ITER --> POS_ASSIGN
    
    POS_ASSIGN --> BUILD
    BUILD --> BUILD_LEN
    BUILD --> BUILD_SERVE
    BUILD --> BUILD_ARRAY
    BUILD --> BUILD_TIME
    BUILD --> BUILD_STATS
    
    BUILD_LEN --> ENRICH
    BUILD_SERVE --> ENRICH
    BUILD_ARRAY --> ENRICH
    BUILD_TIME --> ENRICH
    BUILD_STATS --> ENRICH
    
    ENRICH --> ENRICH_WAIT
    ENRICH --> ENRICH_STATUS
    
    ENRICH_WAIT --> UNLOCK
    ENRICH_STATUS --> UNLOCK
    
    UNLOCK --> CACHE_SET
    CACHE_SET --> RESPONSE
    RESPONSE --> RESP_COMPRESS
    RESP_COMPRESS --> END
    
    classDef timerStyle fill:#667eea,stroke:#764ba2,stroke-width:4px,color:#fff
    classDef processStyle fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#742a2a,stroke:#fc8181,stroke-width:3px,color:#fff
    classDef sortStyle fill:#2c5282,stroke:#63b3ed,stroke-width:2px,color:#fff
    classDef buildStyle fill:#22543d,stroke:#68d391,stroke-width:2px,color:#fff
    classDef dataStyle fill:#1a365d,stroke:#90cdf4,stroke-width:2px,color:#fff
    
    class TIMER,END timerStyle
    class REQ,API,LOCK,COPY,SORT,POS,BUILD,ENRICH,UNLOCK,CACHE_SET,RESPONSE processStyle
    class CACHE,EMPTY decisionStyle
    class SORT_P0,SORT_P1,SORT_DATE,SORT_TIME,SORT_SEQ sortStyle
    class BUILD_LEN,BUILD_SERVE,BUILD_ARRAY,BUILD_TIME,BUILD_STATS buildStyle
    class COPY_SAFE,POS_ITER,POS_ASSIGN,ENRICH_WAIT,ENRICH_STATUS,RESP_COMPRESS,CACHE_HIT,EMPTY_RESP dataStyle
```

### Serving Next Person

```mermaid
flowchart TD
    START(["👨‍💼 Staff Action<br/>Call Next Person"])
    REQ["📤 Frontend Request<br/>Serve button click"]
    
    API["🌐 POST /queue/dequeue<br/>Dequeue endpoint"]
    
    AUTH{"🔐 Staff Authorization<br/>Admin access?"}
    AUTH_FAIL["❌ 403 Forbidden<br/>Unauthorized"]
    
    LOCK["🔒 Acquire Thread Lock<br/>Critical section"]
    
    EMPTY{"📭 Queue Empty?<br/>Length == 0"}
    EMPTY_RESP["⚠️ 404 Not Found<br/>No one in queue"]
    EMPTY_LOG["📝 Log Event<br/>Empty dequeue attempt"]
    
    PEEK["👀 Peek First Entry<br/>Check priority"]
    PEEK_INFO["ℹ️ Entry Details:<br/>- Name<br/>- Certificate No<br/>- Priority<br/>- Wait time"]
    
    POP["⏭️ Pop from Heap<br/>heapq.heappop()"]
    POP_REORG["🔄 Heap Reorganize<br/>O(log n) operation"]
    POP_NEXT["📋 Next person bubbles up<br/>Auto-sorted"]
    
    REMOVE["🗑️ Remove from Dict<br/>_entries_by_cert"]
    REMOVE_KEY["🔑 Delete by cert_no<br/>O(1) operation"]
    
    HISTORY["📜 Add to History<br/>Served log"]
    HIST_TIME["⏱️ Service timestamp<br/>ISO 8601 UTC"]
    HIST_WAIT["⏳ Calculate wait time<br/>created_at vs now"]
    HIST_STAFF["👤 Staff ID<br/>Who served"]
    
    METRICS["📊 Update Metrics"]
    METRIC_COUNT["🔢 Total served<br/>Increment counter"]
    METRIC_AVG["⏰ Average wait<br/>Rolling average"]
    METRIC_PEAK["📈 Peak hours<br/>Time tracking"]
    
    UPDATE["🔄 Update Metadata<br/>last_updated = now()"]
    
    NOTIFY["📢 Send Notification?"]
    NOTIFY_SMS["📱 SMS Alert<br/>To person's phone"]
    NOTIFY_DISPLAY["📺 Display Board<br/>Show number"]
    NOTIFY_APP["🔔 Push Notification<br/>Mobile app alert"]
    
    UNLOCK["🔓 Release Lock<br/>Free resources"]
    
    BROADCAST["📡 Broadcast Update<br/>WebSocket event"]
    BROADCAST_ALL["🌐 Notify all clients<br/>Queue state changed"]
    
    RESPONSE["✅ 200 OK<br/>Return served person"]
    RESP_DATA["📋 Response includes:<br/>- Served person data<br/>- Next in queue<br/>- Updated queue length<br/>- Service timestamp"]
    
    LOG["📝 Audit Log<br/>Record transaction"]
    LOG_DB["💾 Persist to DB<br/>Compliance record"]
    
    END(["🎉 Person Served<br/>Next in line ready"])
    
    START --> REQ
    REQ --> API
    API --> AUTH
    
    AUTH -->|"✅ Authorized"| LOCK
    AUTH -->|"❌ Unauthorized"| AUTH_FAIL
    AUTH_FAIL --> END
    
    LOCK --> EMPTY
    
    EMPTY -->|"✅ Yes"| EMPTY_RESP
    EMPTY -->|"❌ No"| PEEK
    
    EMPTY_RESP --> EMPTY_LOG
    EMPTY_LOG --> UNLOCK
    
    PEEK --> PEEK_INFO
    PEEK_INFO --> POP
    
    POP --> POP_REORG
    POP_REORG --> POP_NEXT
    POP_NEXT --> REMOVE
    
    REMOVE --> REMOVE_KEY
    REMOVE_KEY --> HISTORY
    
    HISTORY --> HIST_TIME
    HISTORY --> HIST_WAIT
    HISTORY --> HIST_STAFF
    
    HIST_TIME --> METRICS
    HIST_WAIT --> METRICS
    HIST_STAFF --> METRICS
    
    METRICS --> METRIC_COUNT
    METRICS --> METRIC_AVG
    METRICS --> METRIC_PEAK
    
    METRIC_COUNT --> UPDATE
    METRIC_AVG --> UPDATE
    METRIC_PEAK --> UPDATE
    
    UPDATE --> NOTIFY
    
    NOTIFY --> NOTIFY_SMS
    NOTIFY --> NOTIFY_DISPLAY
    NOTIFY --> NOTIFY_APP
    
    NOTIFY_SMS --> UNLOCK
    NOTIFY_DISPLAY --> UNLOCK
    NOTIFY_APP --> UNLOCK
    
    UNLOCK --> BROADCAST
    BROADCAST --> BROADCAST_ALL
    BROADCAST_ALL --> RESPONSE
    
    RESPONSE --> RESP_DATA
    RESP_DATA --> LOG
    LOG --> LOG_DB
    LOG_DB --> END
    
    classDef startStyle fill:#667eea,stroke:#764ba2,stroke-width:4px,color:#fff
    classDef processStyle fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff
    classDef decisionStyle fill:#742a2a,stroke:#fc8181,stroke-width:3px,color:#fff
    classDef errorStyle fill:#c53030,stroke:#feb2b2,stroke-width:2px,color:#fff
    classDef successStyle fill:#22543d,stroke:#68d391,stroke-width:2px,color:#fff
    classDef dataStyle fill:#1a365d,stroke:#63b3ed,stroke-width:2px,color:#fff
    classDef notifyStyle fill:#553c9a,stroke:#b794f4,stroke-width:2px,color:#fff
    
    class START,END startStyle
    class REQ,API,LOCK,PEEK,POP,REMOVE,HISTORY,METRICS,UPDATE,UNLOCK,BROADCAST,LOG processStyle
    class AUTH,EMPTY,NOTIFY decisionStyle
    class AUTH_FAIL,EMPTY_RESP,EMPTY_LOG errorStyle
    class RESPONSE successStyle
    class PEEK_INFO,POP_REORG,POP_NEXT,REMOVE_KEY,HIST_TIME,HIST_WAIT,HIST_STAFF,METRIC_COUNT,METRIC_AVG,METRIC_PEAK,RESP_DATA,LOG_DB,BROADCAST_ALL dataStyle
    class NOTIFY_SMS,NOTIFY_DISPLAY,NOTIFY_APP notifyStyle
```

## Priority Queue Mechanics

### Heap Structure

```mermaid
graph TD
    Root["🧓 ROOT NODE<br/>🎯 Priority: 0<br/>🎂 Age: 85<br/>📅 Date: 2026-01-24<br/>⏰ Time: 09:00 AM<br/>🔢 Sequence: 1"]
    
    L1["👵 LEVEL 1 - LEFT<br/>🎯 Priority: 0<br/>🎂 Age: 82<br/>📅 Date: 2026-01-24<br/>⏰ Time: 10:00 AM<br/>🔢 Sequence: 3"]
    
    R1["👴 LEVEL 1 - RIGHT<br/>🎯 Priority: 0<br/>🎂 Age: 80<br/>📅 Date: 2026-01-24<br/>⏰ Time: 02:00 PM<br/>🔢 Sequence: 5"]
    
    L2["🧑 LEVEL 2 - LL<br/>🎯 Priority: 1<br/>🎂 Age: 75<br/>📅 Date: 2026-01-24<br/>⏰ Time: 09:00 AM<br/>🔢 Sequence: 2"]
    
    R2["👨 LEVEL 2 - LR<br/>🎯 Priority: 1<br/>🎂 Age: 70<br/>📅 Date: 2026-01-24<br/>⏰ Time: 11:00 AM<br/>🔢 Sequence: 4"]
    
    L3["👩 LEVEL 2 - RL<br/>🎯 Priority: 1<br/>🎂 Age: 68<br/>📅 Date: 2026-01-25<br/>⏰ Time: 09:00 AM<br/>🔢 Sequence: 6"]
    
    R3["🧔 LEVEL 2 - RR<br/>🎯 Priority: 1<br/>🎂 Age: 65<br/>📅 Date: 2026-01-25<br/>⏰ Time: 10:00 AM<br/>🔢 Sequence: 7"]
    
    Root -->|"⬅️ Lower priority<br/>by time"| L1
    Root -->|"➡️ Lower priority<br/>by time"| R1
    L1 -->|"⬇️ Priority 1<br/>branch"| L2
    L1 -->|"⬇️ Priority 1<br/>branch"| R2
    R1 -->|"⬇️ Next day<br/>entries"| L3
    R1 -->|"⬇️ Later time<br/>entries"| R3
    
    LEGEND["📊 SORTING ORDER:<br/>1️⃣ Priority (0 < 1)<br/>2️⃣ Date (Earlier first)<br/>3️⃣ Time (Earlier first)<br/>4️⃣ Sequence (FIFO)"]
    
    classDef rootStyle fill:#c53030,stroke:#feb2b2,stroke-width:4px,color:#fff,font-weight:bold
    classDef priority0Style fill:#dd6b20,stroke:#fbd38d,stroke-width:3px,color:#fff
    classDef priority1Style fill:#2c5282,stroke:#90cdf4,stroke-width:3px,color:#fff
    classDef legendStyle fill:#1a202c,stroke:#4299e1,stroke-width:2px,color:#fff,font-size:11px
    
    class Root rootStyle
    class L1,R1 priority0Style
    class L2,R2,L3,R3 priority1Style
    class LEGEND legendStyle
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

```mermaid
sequenceDiagram
    participant T1 as Thread 1: Add Person
    participant Lock as Lock
    participant T2 as Thread 2: Get Queue
    
    T1->>Lock: Acquire Lock
    activate Lock
    Note over T1,Lock: Lock acquired
    T2->>Lock: Try Acquire Lock
    Note over T2,Lock: Waiting...
    T1->>T1: Add to Heap
    T1->>Lock: Release Lock
    deactivate Lock
    Note over Lock,T2: Lock available
    T2->>Lock: Acquire Lock
    activate Lock
    T2->>T2: Read Queue
    T2->>Lock: Release Lock
    deactivate Lock
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

```mermaid
graph TB
    subgraph DEV["👨‍💻 DEVELOPMENT ENVIRONMENT"]
        LOCAL["💻 Local Machine<br/>- VS Code<br/>- Python 3.11+<br/>- Flask Dev Server"]
        TEST["🧪 Testing<br/>- Unit Tests<br/>- Integration Tests<br/>- Manual Testing"]
        LOCAL --> TEST
    end
    
    subgraph VCS["📦 VERSION CONTROL"]
        GIT["🔀 Git Operations"]
        BRANCH["🌱 Branches<br/>- main (production)<br/>- develop<br/>- feature/*"]
        COMMIT["📝 Commit & Push<br/>- Code changes<br/>- Triggers CI/CD"]
        GIT --> BRANCH
        BRANCH --> COMMIT
    end
    
    REPO["📦 GitHub Repository<br/>NEURA-QUEST-EVENT<br/>🔒 Private/Public"]
    
    subgraph CICD["⚙️ CI/CD PIPELINE"]
        VERCEL_CI["▶️ Vercel CI<br/>Auto-triggered"]
        
        BUILD["🔨 Build Phase"]
        BUILD_DEPS["📦 Install Dependencies<br/>pip install -r requirements.txt"]
        BUILD_CHECK["✅ Code Quality<br/>- Linting<br/>- Type checking"]
        BUILD_TEST["🧪 Run Tests<br/>pytest suite"]
        
        DEPLOY_PREP["🎯 Deploy Preparation"]
        DEPLOY_ENV["🌍 Environment Variables<br/>- Secrets<br/>- Config<br/>- API Keys"]
        DEPLOY_REGION["🗺️ Region Selection<br/>Mumbai (bom1)"]
        
        VERCEL_CI --> BUILD
        BUILD --> BUILD_DEPS
        BUILD --> BUILD_CHECK
        BUILD --> BUILD_TEST
        BUILD_DEPS --> DEPLOY_PREP
        BUILD_CHECK --> DEPLOY_PREP
        BUILD_TEST --> DEPLOY_PREP
        DEPLOY_PREP --> DEPLOY_ENV
        DEPLOY_PREP --> DEPLOY_REGION
    end
    
    subgraph PROD["☁️ PRODUCTION ENVIRONMENT"]
        EDGE["🌍 Vercel Edge Network<br/>Global CDN<br/>- Auto-scaling<br/>- Load balancing<br/>- DDoS protection"]
        
        subgraph REGION["🇳 Mumbai Region (bom1)"]
            SERVERLESS["⚡ Serverless Functions"]
            
            INSTANCE1["📦 Instance 1<br/>Flask App<br/>Active"]
            INSTANCE2["📦 Instance 2<br/>Flask App<br/>Standby"]
            INSTANCE3["📦 Instance 3<br/>Flask App<br/>Auto-scale"]
            
            LB["⚖️ Load Balancer<br/>Round-robin<br/>Health checks"]
            
            SERVERLESS --> LB
            LB --> INSTANCE1
            LB --> INSTANCE2
            LB --> INSTANCE3
        end
        
        EDGE --> SERVERLESS
        
        CACHE["💾 Edge Cache<br/>- Static assets<br/>- API responses<br/>- TTL: 60s"]
        
        EDGE --> CACHE
    end
    
    subgraph MONITOR["📊 MONITORING & ANALYTICS"]
        LOGS["📝 Vercel Logs<br/>- Request logs<br/>- Error tracking<br/>- Performance"]
        METRICS["📈 Metrics<br/>- Response time<br/>- Request count<br/>- Error rate"]
        ALERTS["🔔 Alerts<br/>- Downtime<br/>- High latency<br/>- Error spike"]
        
        LOGS --> METRICS
        METRICS --> ALERTS
    end
    
    subgraph CLIENT["📱 CLIENT APPLICATIONS"]
        WEB["🌐 Web App<br/>Browser-based<br/>Responsive UI"]
        MOBILE["📱 Mobile App<br/>iOS/Android<br/>Native/PWA"]
        ADMIN["👨‍💼 Admin Panel<br/>Staff interface<br/>Queue management"]
    end
    
    TEST -->|"🚀 Passed"| VCS
    VCS --> REPO
    REPO -->|"🔄 Webhook"| CICD
    CICD -->|"✅ Success"| PROD
    CICD -.->|"❌ Failed"| ALERTS
    
    PROD --> MONITOR
    
    EDGE -->|"🔒 HTTPS<br/>TLS 1.3"| CLIENT
    
    WEB -->|"🔄 Poll: 3s<br/>REST API"| EDGE
    MOBILE -->|"🔔 Push + Poll<br/>WebSocket"| EDGE
    ADMIN -->|"🔐 Authenticated<br/>Admin API"| EDGE
    
    classDef devStyle fill:#667eea,stroke:#764ba2,stroke-width:3px,color:#fff
    classDef vcsStyle fill:#24292e,stroke:#fff,stroke-width:2px,color:#fff
    classDef cicdStyle fill:#2188ff,stroke:#79b8ff,stroke-width:2px,color:#fff
    classDef prodStyle fill:#000,stroke:#4299e1,stroke-width:3px,color:#fff
    classDef regionStyle fill:#1a202c,stroke:#48bb78,stroke-width:2px,color:#fff
    classDef instanceStyle fill:#2d3748,stroke:#68d391,stroke-width:2px,color:#fff
    classDef monitorStyle fill:#742a2a,stroke:#fc8181,stroke-width:2px,color:#fff
    classDef clientStyle fill:#553c9a,stroke:#b794f4,stroke-width:3px,color:#fff
    
    class LOCAL,TEST devStyle
    class GIT,BRANCH,COMMIT,REPO vcsStyle
    class VERCEL_CI,BUILD,BUILD_DEPS,BUILD_CHECK,BUILD_TEST,DEPLOY_PREP,DEPLOY_ENV,DEPLOY_REGION cicdStyle
    class EDGE,SERVERLESS,LB,CACHE prodStyle
    class REGION regionStyle
    class INSTANCE1,INSTANCE2,INSTANCE3 instanceStyle
    class LOGS,METRICS,ALERTS monitorStyle
    class WEB,MOBILE,ADMIN clientStyle
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
