# MediCare 🩺🔐

> **Your health, on time. Privately.**
> A privacy-first, cross-platform medical support & reminder app.
> Built by a cybersecurity professional — your health data is encrypted, never sold, never shared.

MediCare reminds people to take their medicines, drink water, walk, test their
sugar/BP, visit the doctor and refill prescriptions — based on each user's
personal schedule and conditions.

---

## ✨ Tech stack

| Layer            | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | **React Native + Expo (SDK 52)**         |
| Language         | **TypeScript** (strict)                  |
| Routing          | **Expo Router** (file-based, typed)      |
| State            | **Zustand**                              |
| Backend          | **Supabase** (Auth + Postgres + Storage) |
| Local secure store | **expo-secure-store** (Keychain/Keystore) |
| Notifications    | **expo-notifications** (local + FCM/APNs)|
| Biometrics       | **expo-local-authentication**            |
| Validation       | **zod**                                  |

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure Supabase
cp .env.example .env
#    then fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY

# 3. Create the database
#    Open the Supabase SQL editor and run supabase/schema.sql

# 4. Run the app
npm start          # then press i / a / w for iOS / Android / web
```

> **Type-check anytime:** `npm run typecheck`

---

## 📁 Project structure

```
medicare/
├── app/                        # Expo Router routes (screens)
│   ├── _layout.tsx             # Root: providers + auth gate
│   ├── index.tsx               # Entry redirect
│   ├── (auth)/                 # Login / Signup / Forgot password
│   └── (tabs)/                 # Main app (5 tabs)
│       ├── index.tsx           # 🏠 Dashboard
│       ├── medications/        # 💊 List + Add
│       ├── vitals/             # 📈 List + Add
│       ├── appointments/       # 📅 List + Add
│       └── profile/            # 👤 Profile, Conditions, Settings, Security
├── src/
│   ├── components/ui/          # Reusable UI kit (Button, Card, Input, …)
│   ├── constants/theme.ts      # Design tokens
│   ├── theme/ThemeProvider.tsx # Light/dark theme context
│   ├── lib/                    # supabase, secure-storage, notifications, biometrics
│   ├── services/               # Data access (Supabase) per domain
│   ├── store/                  # Zustand stores (auth, health)
│   ├── types/models.ts         # Domain models
│   └── utils/                  # date, adherence, schedule helpers
├── supabase/
│   └── schema.sql              # Full Postgres schema + Row-Level Security
└── assets/                     # Icons & splash (placeholders — replace)
```

---

## 🔐 Security highlights

- **Row-Level Security** on every table — a user can only ever touch their own rows.
- **Secure session storage** in the device Keychain/Keystore (not AsyncStorage).
- **Client-side encryption** for sensitive fields (allergies, contacts, notes).
- **Biometric unlock** (fingerprint / Face ID).
- **Quiet hours**, escalation and offline-first local reminders.
- Privacy by design: no ads, no data selling, full export & delete anytime.

See the project description for the full 8-layer security architecture.

---

## 🗺️ Status

This is the **MVP foundation + core features** scaffold:

- ✅ Auth (sign up / log in / forgot password) via Supabase
- ✅ Dashboard with today's doses & 7-day adherence
- ✅ Medications + schedules + local reminder scheduling
- ✅ Vitals logging (sugar, BP, weight, …)
- ✅ Appointments
- ✅ Health conditions, Settings (theme/lang), Security (biometrics, privacy)
- ⏳ Next: PDF/CSV reports, caregiver mode, prescription OCR, charts, server push

> ⚠️ **Disclaimer:** MediCare is a reminder and tracking tool, **not** a medical
> device and **not** a substitute for professional medical advice.
