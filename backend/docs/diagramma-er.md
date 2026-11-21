# Diagramma ER

```mermaid
erDiagram
    ROLES ||--o{ USERS : assigns
    USERS ||--o{ BOOKINGS : makes
    EVENTS ||--o{ BOOKINGS : receives
    USERS ||--o{ FEEDBACK : writes
    EVENTS ||--o{ FEEDBACK : receives
    BOOKINGS ||--o| FEEDBACK : may_generate
    CATEGORIES ||--o{ WORKS : groups

    ROLES {
        int id PK
        string name
    }

    USERS {
        int id PK
        string first_name
        string last_name
        string email
        string password_hash
        boolean is_active
        datetime created_at
        int role_id FK
    }

    CATEGORIES {
        int id PK
        string name
        string description
    }

    WORKS {
        int id PK
        string title
        string author
        string description
        string image_url
        string status
        int category_id FK
    }

    EVENTS {
        int id PK
        string title
        string description
        string location
        datetime starts_at
        datetime ends_at
        int capacity
        string status
    }

    BOOKINGS {
        int id PK
        int user_id FK
        int event_id FK
        int seats
        string status
        datetime created_at
    }

    FEEDBACK {
        int id PK
        int user_id FK
        int event_id FK
        int booking_id FK
        int rating
        string comment
        string moderation_status
        datetime created_at
    }
```

`FEEDBACK.event_id` e `FEEDBACK.booking_id` sono nullable e il vincolo applicativo
impone che sia valorizzato uno solo dei due. La relazione con `BOOKINGS` è opzionale
dal punto di vista del feedback, mentre l’ownership della prenotazione è verificata
dal service.
