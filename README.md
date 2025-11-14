
# Mobile Health App – README

## 📱 Overview

The **Mobile Health App** is a modern, location‑based healthcare platform built specifically for South Africa (Mpumalanga and other provinces). It connects patients, doctors, and administrators through appointment booking, virtual consultations, medical records, and doctor management.

This application includes three core systems:

* **Patient Mobile App / Web App**
* **Doctor Dashboard**
* **Admin Dashboard**

The goal is to simplify healthcare access, improve communication, and provide a centralized platform for medical services.

---

## 🧩 Key Features

### ✅ **1. User Authentication & Profiles**

* Secure Login & Signup for **patients**, **doctors**, and **admin**.
* Firebase Authentication (Email & Password).
* Patients provide additional medical details:

  * Age
  * Medical history
  * Chronic illnesses
  * Allergies
  * Blood type
  * General health information
* Doctors have a specialized signup form:

  * Medical specialty
  * Practice location
  * Years of experience
  * Qualifications

---

## 🏥 **2. Patient Features**

### 🗓 **Appointment Booking System**

* Search for doctors by **specialty** and **location**.
* Book available time slots.
* Choose **physical** or **virtual consultation**.
* View upcoming and past appointments.
* Receive automatic notifications for:

  * Booking confirmation
  * Booking changes
  * Appointment reminders

### 🔄 **Rescheduling System**

* Patients can reschedule appointments with available doctor time slots.
* Doctor receives a notification of any changes.

### 👨‍⚕️ **Doctor Profiles**

* View full doctor details:

  * Specialty
  * Location
  * Ratings (if included later)
  * Experience

### 📋 **Medical Records**

* Patients can view their medical profile.
* Doctors can access the patient’s medical background during appointments.

### 💻 **Virtual Consultations**

* Secure video conferencing link generated for online appointments.
* Patients can join via in‑app link.

---

## 👨‍⚕️ **3. Doctor Dashboard Features**

### 📊 **Doctor Overview Dashboard**

Includes summaries of:

* Total patients
* Upcoming appointments
* Appointment history
* Notifications

### 📅 **Appointment Management**

* View and manage all bookings.
* Accept/Reject/Modify appointments.
* Mark appointments as completed.

### 🧑‍⚕️ **Patient Profiles**

* Access detailed patient medical history:

  * Age
  * Previous appointments
  * Medication history
  * Blood type
  * Health conditions

### 🔍 **Prescription Writing**

* Doctors can write prescriptions for a patient.
* Automatically sent to the patient.

### ✏️ **Doctor Profile Section**

* Manage profile details.
* Update available times.
* Modify location and specialty info.

---

## 🛠 **4. Admin Dashboard Features**

### 🌍 **System Overview**

* Total number of doctors
* Total number of patients
* All appointments in the system
* Activity and logs

### 🧑‍💼 **User Management**

* Add, remove, or modify users (patients & doctors).
* Approve new doctors.
* Assign or modify roles.

### 📅 **Appointments Oversight**

* View all appointments created by patients.
* Monitor cancellations and reschedules.

### ⚙️ **Platform Configuration**

* Manage specialties
* Manage regions/provinces
* Control general system settings

---

## 📍 **5. Location‑Based System**

The app uses **South African provinces**, focusing first on **Mpumalanga**, to:

* Find doctors near the patient
* Let doctors register their area
* Organize doctor categories by region

---

## 🔔 **6. Notification System**

Automatic notifications for:

* New appointment bookings
* Cancellations
* Rescheduling
* Upcoming appointment reminders
* New prescription issued

Implemented using:

* Firebase Cloud Messaging
* Real‑time updates

---

## 🎥 **7. Virtual Appointments (Video Link System)**

* Automatically generates a video session link.
* Patient and doctor receive a join link.
* Works with preferred provider (e.g., Jitsi, Google Meet, Zoom API).

---

## 🧿 **8. Tech Stack**

### 🖥 Frontend

* **Flutter / React Native** (depending on build)
* HTML/CSS/JS for dashboards (Web)

### 🔥 Backend / Cloud

* Firebase Authentication
* Firebase Firestore Database
* Firebase Storage
* Firebase Cloud Messaging (notifications)

### 🎥 Video

* Jitsi API or Zoom API

---

## 🗂 **9. Database Structure (Firestore)**

### **Collections:**

#### 📌 **users**

Stores all users (patients, doctors, admins).

```
userId
└── name
└── email
└── role (patient | doctor | admin)
└── createdAt
```

#### 📌 **patients**

```
patientId
└── userId
└── age
└── medicalHistory: []
└── allergies
└── bloodType
└── chronicIllnesses
```

#### 📌 **doctors**

```
doctorId
└── userId
└── specialty
└── location
└── availability: []
└── yearsOfExperience
└── qualifications
```

#### 📌 **appointments**

```
apptId
└── patientId
└── doctorId
└── date
└── time
└── type (physical | virtual)
└── status (pending | confirmed | completed | cancelled)
└── videoLink
```

#### 📌 **prescriptions**

```
prescriptionId
└── doctorId
└── patientId
└── medications: []
└── notes
└── createdAt
```

---

## 🔗 **10. API Structure (REST + Firebase)**

Although Firebase is mostly serverless, the system can use Cloud Functions or an Express API where needed.

### **Base URL (if using Cloud Functions):**

```
https://<region>-<project>.cloudfunctions.net/api
```

---

### **🔐 Authentication Endpoints**

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| POST   | `/auth/register`       | Register user (patient or doctor) |
| POST   | `/auth/login`          | User login                        |
| POST   | `/auth/update-profile` | Update user profile               |

---

### **👨‍⚕️ Doctor Endpoints**

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| GET    | `/doctors`            | List all doctors        |
| GET    | `/doctors/:id`        | Get doctor profile      |
| POST   | `/doctors/update/:id` | Edit doctor information |

---

### **📅 Appointment Endpoints**

| Method | Endpoint                       | Description              |
| ------ | ------------------------------ | ------------------------ |
| POST   | `/appointments/book`           | Book an appointment      |
| POST   | `/appointments/reschedule/:id` | Reschedule appointment   |
| GET    | `/appointments/user/:id`       | Get patient appointments |
| GET    | `/appointments/doctor/:id`     | Get doctor appointments  |

---

### **💊 Prescription Endpoints**

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/prescriptions/create`      | Create prescription        |
| GET    | `/prescriptions/patient/:id` | View patient prescriptions |

---

### **🛠 Admin Endpoints**

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| GET    | `/admin/users`              | View all users         |
| POST   | `/admin/approve-doctor/:id` | Approve doctor account |
| DELETE | `/admin/delete-user/:id`    | Remove a user          |

---

## 🚀 Installation & Setup

Follow these steps to set up the full Mobile Health App system (Patient App, Doctor Dashboard, Admin Dashboard).

### **1. Prerequisites**

* Node.js (v18+)
* Flutter SDK **or** React Native CLI (depending on your chosen mobile build)
* Firebase Project
* Android Studio / Xcode
* Git
* VS Code / Android Studio / IntelliJ

---

### **2. Clone the Repository**

```bash
git clone https://github.com/
cd mobile-health-app
```

---

### **3. Install Dependencies**

#### **For Patient Mobile App (React Native example):**

```bash
npm install
npx pod-install ios   # For iOS
```

---

### **4. Firebase Configuration (IMPORTANT)**

Create a Firebase Project and enable:

* Authentication
* Firestore Database
* Storage
* Cloud Messaging
* Hosting (optional)

### Add the required Firebase files:

* **Android:** place `google-services.json` in `/app/`
* **iOS:** place `GoogleService-Info.plist` in `/ios/Runner/`
* **Web Dashboards:** create `.env` with Firebase keys

Example `.env`:

---

### **5. Run the App**

#### **React Native:**

```bash
npx react-native run-android
npx react-native run-ios
```


#### **Admin/Doctor Web Dashboards:**

```bash
npm run dev
```

---

### **6. Build for Production**

#### **Mobile App:**

```bash

npx react-native build-android
```

#### **Web Dashboards:**

```bash
npm run build
```

---

### **7. Deploy (Optional)**

* Use Firebase Hosting, Vercel, or Netlify for dashboards.
* Use Play Store / App Store for mobile deployment.

---

## 🧪 Testing

* Test all appointment flows
* Test virtual appointments
* Check notifications
* Ensure location-based filtering works correctly

---

## 📌 Future Enhancements

* Online pharmacy ordering
* Medical aid insurance integration
* In‑app payments
* AI‑based symptom checker

---

## 🏁 Conclusion

The Mobile Health App is designed to digitalize and simplify healthcare access across South Africa. With booking, online consultations, notifications, medical history, and admin management, the system ensures reliable and efficient healthcare delivery.

---
