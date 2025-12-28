# Home Setup Solutions - Technical Documentation

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Backend | Lovable Cloud (Supabase) |
| Mobile | Capacitor |
| Animation | Framer Motion |
| State Management | TanStack Query |
| Routing | React Router v6 |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout
│   ├── sections/        # Page sections (Hero, Services, etc.)
│   ├── admin/           # Admin dashboard components
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   ├── use-toast.ts     # Toast notifications
│   └── use-mobile.tsx   # Mobile detection
├── integrations/
│   └── supabase/        # Supabase client and types
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   ├── Index.tsx        # Home page
│   ├── Book.tsx         # Booking page
│   ├── Admin.tsx        # Admin dashboard
│   ├── Auth.tsx         # Authentication page
│   ├── Documentation.tsx # Documentation page
│   └── Policy.tsx       # Privacy policy
└── main.tsx             # App entry point
```

---

## Database Schema

### appointments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| customer_id | UUID | Reference to customer |
| customer_name | TEXT | Customer name |
| customer_email | TEXT | Customer email |
| customer_phone | TEXT | Customer phone |
| service_name | TEXT | Service being provided |
| service_price | NUMERIC | Price of service |
| scheduled_at | TIMESTAMP | Appointment date/time |
| duration_minutes | INTEGER | Service duration |
| status | TEXT | pending/confirmed/completed/cancelled |
| address | TEXT | Service location |
| notes | TEXT | Additional notes |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Auth user reference |
| email | TEXT | User email |
| full_name | TEXT | Display name |
| phone | TEXT | Phone number |
| avatar_url | TEXT | Profile image URL |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### user_roles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Auth user reference |
| role | ENUM | admin/staff/customer |
| created_at | TIMESTAMP | Record creation time |

### call_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Staff member who handled call |
| customer_id | UUID | Associated customer |
| customer_name | TEXT | Customer name |
| phone_number | TEXT | Phone number |
| direction | TEXT | inbound/outbound |
| status | TEXT | Call status |
| duration_seconds | INTEGER | Call duration |
| notes | TEXT | Call notes |
| created_at | TIMESTAMP | Call timestamp |
| ended_at | TIMESTAMP | Call end time |

### staff_details
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Auth user reference |
| hourly_rate | NUMERIC | Staff hourly rate |
| availability | JSONB | Availability schedule |
| is_active | BOOLEAN | Active status |
| current_location | JSONB | GPS location data |

---

## Authentication

### Implementation
- Email/password authentication via Lovable Cloud
- Session-based authentication with secure cookies
- Role-based access control (RBAC)

### Roles
```typescript
type AppRole = "admin" | "staff" | "customer";
```

### Auth Hook Usage
```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, session, loading, isAdmin, signIn, signUp, signOut } = useAuth();
```

### Protected Routes
Admin routes check for authentication and admin role:
```typescript
useEffect(() => {
  if (!loading && !user) {
    navigate("/auth");
  }
  if (!loading && user && !isAdmin) {
    navigate("/");
  }
}, [user, loading, isAdmin]);
```

---

## API Endpoints

### REST API (via Lovable Cloud)

**Appointments**
```
GET    /rest/v1/appointments         # List appointments
POST   /rest/v1/appointments         # Create appointment
PATCH  /rest/v1/appointments?id=eq.{id}  # Update appointment
DELETE /rest/v1/appointments?id=eq.{id}  # Delete appointment
```

**Profiles**
```
GET    /rest/v1/profiles             # List profiles
POST   /rest/v1/profiles             # Create profile
PATCH  /rest/v1/profiles?id=eq.{id}  # Update profile
```

**Call Logs**
```
GET    /rest/v1/call_logs            # List call logs
POST   /rest/v1/call_logs            # Create call log
PATCH  /rest/v1/call_logs?id=eq.{id} # Update call log
```

### Edge Functions
```
GET/POST  /functions/v1/square-crm   # Square CRM integration
```

---

## Mobile App (Capacitor)

### Configuration
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.homesetupsolutions.app',
  appName: 'Home Setup Solutions',
  webDir: 'dist',
  server: {
    url: 'https://[project-id].lovableproject.com',
    cleartext: true
  }
};
```

### Build Commands
```bash
# Add platforms
npx cap add android
npx cap add ios

# Sync after changes
npx cap sync

# Run on device/emulator
npx cap run android
npx cap run ios

# Build release APK
cd android && ./gradlew assembleRelease
```

### App Store Deployment
1. Generate signing key
2. Configure signing in `android/app/build.gradle`
3. Build release bundle: `./gradlew bundleRelease`
4. Upload to Google Play Console / App Store Connect

---

## Security

### Row-Level Security (RLS)
All database tables have RLS policies ensuring:
- Users can only access their own data
- Admins have elevated access
- Public data is explicitly marked

### Environment Variables
```
VITE_SUPABASE_URL        # API URL
VITE_SUPABASE_PUBLISHABLE_KEY  # Public API key
VITE_SUPABASE_PROJECT_ID # Project identifier
```

---

## Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style
- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Tailwind CSS for styling

---

*For additional support, contact the development team.*
