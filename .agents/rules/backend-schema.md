# Hadramout Modern Hospital - Backend API Specification (OpenAPI 3.1.0)

This reference contains the complete endpoint contracts, request schemas, parameters, and response structures for the backend API (`/api/v1`).

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/signup`
- **Description**: Register a new patient account as pending; a verification code is sent to their phone.
- **Request Body**: `SignupRequest`
  ```json
  {
    "full_name": "string (Required)",
    "gender": "string (Required)",
    "date_of_birth": "YYYY-MM-DD (Required)",
    "phone": "string (Required)",
    "email": "string (Required)",
    "password": "string (Required)"
  }
  ```
- **Response `201`**: `SignupResponse`
  ```json
  {
    "status": "string",
    "message": "string",
    "data": {
      "user_id": "string",
      "patient_id": "string | null",
      "email": "string",
      "role": "string",
      "role_type": "string | null",
      "full_name": "string",
      "phone": "string"
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Description**: Authenticate a user and return JWT tokens.
- **Request Body**: `LoginRequest`
  ```json
  {
    "email": "string (Required)",
    "password": "string (Required)"
  }
  ```
- **Response `200`**: `LoginResponse`
  ```json
  {
    "status": "string",
    "message": "string",
    "data": {
      "access_token": "string",
      "refresh_token": "string",
      "token_type": "bearer"
    }
  }
  ```

### `POST /api/v1/auth/otp/send`
- **Description**: Resend the verification code for a pending signup.
- **Request Body**: `OtpSendRequest`
  ```json
  {
    "phone": "string (Required)"
  }
  ```
- **Response `200`**: `OtpSendResponse`
  ```json
  {
    "status": "string",
    "message": "string",
    "data": {
      "otp_id": "string",
      "phone": "string",
      "expires_at": "date-time",
      "resend_after_seconds": 0
    }
  }
  ```

### `POST /api/v1/auth/otp/verify`
- **Description**: Validate the code, activate the pending account, and return auth tokens.
- **Request Body**: `OtpVerifyRequest`
  ```json
  {
    "phone": "string (Required)",
    "code": "string (Required)"
  }
  ```
- **Response `200`**: `OtpVerifyResponse`
  ```json
  {
    "status": "string",
    "message": "string",
    "data": {
      "access_token": "string",
      "refresh_token": "string",
      "token_type": "bearer"
    }
  }
  ```

### `POST /api/v1/auth/refresh`
- **Request Body**: `RefreshRequest`
  ```json
  {
    "refresh_token": "string (Required)"
  }
  ```
- **Response `200`**: `RefreshResponse` (`access_token`, `refresh_token`, `token_type`)

### `POST /api/v1/auth/logout` (Bearer Auth)
- **Request Body**: `LogoutRequest`
  ```json
  {
    "refresh_token": "string (Required)"
  }
  ```

### `GET /api/v1/auth/me` (Bearer Auth)
- **Response `200`**: `MeResponse` (`UserProfile`)

---

## 2. Specialties Endpoints (`/api/v1/specialties`)

### `GET /api/v1/specialties` (Public)
- **Response `200`**: `SpecialtyListResponse`
  - Array of items: `{ specialty_id, name_en, name_ar, default_capacity }`

### `POST /api/v1/specialties` (Admin Only)
- **Request Body**: `{ name_en, name_ar, default_capacity }`

### `GET /api/v1/specialties/{specialty_id}`
### `PUT /api/v1/specialties/{specialty_id}`
### `DELETE /api/v1/specialties/{specialty_id}`

---

## 3. Doctors Endpoints (`/api/v1/doctors`)

### `GET /api/v1/doctors` (Public)
- **Query Parameters**:
  - `specialty_id` (string, optional)
  - `status` (string: "active" / "inactive", optional)
  - `building` (string: "new" / "old", optional)
  - `limit` (int, default: 20)
  - `offset` (int, default: 0)
- **Response `200`**: `DoctorListResponse`
  ```json
  {
    "status": "success",
    "message": "string",
    "total": 20,
    "limit": 20,
    "offset": 0,
    "data": [
      {
        "doctor_id": "string",
        "full_name_en": "string",
        "full_name_ar": "string",
        "specialty_name_en": "string",
        "specialty_name_ar": "string",
        "specialty_id": "string",
        "capacity_override": 25,
        "phone": "string | null",
        "status": "active",
        "building": "new",
        "image": "string | null",
        "schedule": [
          {
            "schedule_id": "string",
            "day_of_week": "Sun",
            "period": "Morning | Evening",
            "is_active": true
          }
        ]
      }
    ]
  }
  ```

### `GET /api/v1/doctors/{doctor_id}` (Public)
### `POST /api/v1/doctors` (Admin Only)
- **Request Body**: `DoctorCreateRequest`
  - Required: `specialty_id`, `full_name_en`, `full_name_ar`
  - Optional: `capacity_override`, `phone`, `status`, `building`

### `PUT /api/v1/doctors/{doctor_id}` (Admin Only)
### `DELETE /api/v1/doctors/{doctor_id}` (Admin Only)

### `GET /api/v1/doctors/{doctor_id}/schedule` (Public)
- **Response `200`**: `DoctorScheduleListResponse`

### `POST /api/v1/doctors/{doctor_id}/schedule` (Admin Only)
- **Request Body**: `DoctorScheduleUpdateRequest` (`schedule: [{ day_of_week, period, is_active }]`)

### `GET /api/v1/doctors/{doctor_id}/availability` (Public)
- **Query Parameters**:
  - `date`: `YYYY-MM-DD` (Required)
  - `period`: `"morning"` or `"evening"` (Required)
- **Response `200`**: `DoctorAvailabilityResponse`
  ```json
  {
    "status": "success",
    "message": "string",
    "data": {
      "doctor_id": "string",
      "date": "2026-08-15",
      "period": "evening",
      "day_of_week": "Sat",
      "is_active": true,
      "is_working": true,
      "capacity": 25,
      "booked": 3,
      "remaining": 22,
      "is_available": true
    }
  }
  ```

---

## 4. Appointments Endpoints (`/api/v1/appointments`)

### `POST /api/v1/appointments` (Online Booking - Patient Bearer Auth)
- **Request Body**: `AppointmentCreateRequest`
  ```json
  {
    "doctor_id": "string (Required)",
    "date": "YYYY-MM-DD (Required)",
    "period": "morning | evening (Required)"
  }
  ```
- **Response `201`**: `AppointmentResponse`

### `GET /api/v1/appointments` (Bearer Auth)
- **Query Parameters**: `doctor_id`, `date`, `status` (staff filter; patients see only their own)
- **Response `200`**: `AppointmentListResponse`

### `POST /api/v1/appointments/reception` (Reception Only)
- **Request Body**: `AppointmentReceptionCreateRequest`
  - `patient_id` (optional if new patient)
  - `new_patient`: `{ full_name, gender, date_of_birth, phone, whatsapp_opt_in }`
  - `doctor_id`, `date`, `period`

### `GET /api/v1/appointments/{appointment_id}` (Owner/Staff)
### `DELETE /api/v1/appointments/{appointment_id}` (Owner/Staff)

### `PATCH /api/v1/appointments/{appointment_id}/status`
- **Request Body**: `{ "status": "pending" | "confirmed" | "rejected" | "cancelled" | "no_show" | "completed" }`

### `PATCH /api/v1/appointments/{appointment_id}/reschedule`
- **Request Body**: `{ "date": "YYYY-MM-DD", "period": "morning | evening" }`

---

## 5. Patients Endpoints (`/api/v1/patients`)

### `GET /api/v1/patients` (Reception/Admin Only)
- **Query Parameter**: `search` (Search by full name or phone)

### `GET /api/v1/patients/{patient_id}` (Reception/Admin Only)

---

## 6. Staff Endpoints (`/api/v1/staff`) (Admin Only)

### `GET /api/v1/staff`
### `POST /api/v1/staff`
### `GET /api/v1/staff/{staff_id}`
### `PUT /api/v1/staff/{staff_id}`
### `DELETE /api/v1/staff/{staff_id}`

---

## 7. Raw OpenAPI Specification Reference
```json
{"openapi":"3.1.0","info":{"title":"Hadramout Modern Hospital - Backend","version":"0.1.0"},"paths":{"/api/v1/auth/signup":{"post":{"tags":["Auth"],"summary":"Signup","description":"Register a new patient account as pending; a verification code is sent to their phone.","operationId":"signup_api_v1_auth_signup_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/SignupRequest"}}},"required":true},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SignupResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/auth/login":{"post":{"tags":["Auth"],"summary":"Login","description":"Authenticate a user and return JWT tokens.","operationId":"login_api_v1_auth_login_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/LoginRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/LoginResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/auth/refresh":{"post":{"tags":["Auth"],"summary":"Refresh","description":"Issue a new access token using a valid refresh token.","operationId":"refresh_api_v1_auth_refresh_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/RefreshRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/RefreshResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/auth/logout":{"post":{"tags":["Auth"],"summary":"Logout","description":"Invalidate the current session.","operationId":"logout_api_v1_auth_logout_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/LogoutRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/LogoutResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}},"security":[{"OAuth2PasswordBearer":[]}]}},"/api/v1/auth/otp/send":{"post":{"tags":["Auth"],"summary":"Send Otp","description":"Resend the verification code for a pending signup. Test mode: code is printed in the backend log.","operationId":"send_otp_api_v1_auth_otp_send_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/OtpSendRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/OtpSendResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/auth/otp/verify":{"post":{"tags":["Auth"],"summary":"Verify Otp","description":"Validate the code, activate the pending account, and return auth tokens.","operationId":"verify_otp_api_v1_auth_otp_verify_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/OtpVerifyRequest"}}},"required":true},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/OtpVerifyResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/auth/me":{"get":{"tags":["Auth"],"summary":"Me","description":"Retrieve the authenticated user's profile.","operationId":"me_api_v1_auth_me_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/MeResponse"}}}}},"security":[{"OAuth2PasswordBearer":[]}]}},"/api/v1/doctors":{"get":{"tags":["Doctors"],"summary":"List Doctors","description":"Retrieve a list of doctors with optional filters.","operationId":"list_doctors_api_v1_doctors_get","parameters":[{"name":"specialty_id","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Filter by specialty ID","title":"Specialty Id"},"description":"Filter by specialty ID"},{"name":"status","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Filter by status (active/inactive)","title":"Status"},"description":"Filter by status (active/inactive)"},{"name":"building","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Filter by building (new/old)","title":"Building"},"description":"Filter by building (new/old)"},{"name":"limit","in":"query","required":false,"schema":{"type":"integer","maximum":100,"minimum":1,"description":"Max doctors per page","default":20,"title":"Limit"},"description":"Max doctors per page"},{"name":"offset","in":"query","required":false,"schema":{"type":"integer","minimum":0,"description":"Number of doctors to skip","default":0,"title":"Offset"},"description":"Number of doctors to skip"}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorListResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"post":{"tags":["Doctors"],"summary":"Create Doctor Endpoint","description":"Create a new doctor (admin only).","operationId":"create_doctor_endpoint_api_v1_doctors_post","security":[{"OAuth2PasswordBearer":[]}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorCreateRequest"}}}},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/doctors/{doctor_id}":{"get":{"tags":["Doctors"],"summary":"Get Doctor","description":"Retrieve a single doctor by ID.","operationId":"get_doctor_api_v1_doctors__doctor_id__get","parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"put":{"tags":["Doctors"],"summary":"Update Doctor Endpoint","description":"Update a doctor's details (admin only).","operationId":"update_doctor_endpoint_api_v1_doctors__doctor_id__put","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorUpdateRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"delete":{"tags":["Doctors"],"summary":"Delete Doctor Endpoint","description":"Delete a doctor (admin only).","operationId":"delete_doctor_endpoint_api_v1_doctors__doctor_id__delete","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}}],"responses":{"204":{"description":"Successful Response"},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/doctors/{doctor_id}/schedule":{"get":{"tags":["Doctors"],"summary":"Get Schedule","description":"Get a doctor's weekly working periods (public).","operationId":"get_schedule_api_v1_doctors__doctor_id__schedule_get","parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorScheduleListResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"post":{"tags":["Doctors"],"summary":"Update Schedule","description":"Set/update a doctor's weekly working periods (admin only).","operationId":"update_schedule_api_v1_doctors__doctor_id__schedule_post","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorScheduleUpdateRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorScheduleListResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/doctors/{doctor_id}/availability":{"get":{"tags":["Doctors"],"summary":"Get Availability","description":"Get a doctor's remaining capacity for a date and period (public).","operationId":"get_availability_api_v1_doctors__doctor_id__availability_get","parameters":[{"name":"doctor_id","in":"path","required":true,"schema":{"type":"string","title":"Doctor Id"}},{"name":"date","in":"query","required":true,"schema":{"type":"string","format":"date","description":"Appointment date (YYYY-MM-DD)","title":"Date"},"description":"Appointment date (YYYY-MM-DD)"},{"name":"period","in":"query","required":true,"schema":{"type":"string","description":"Period: morning or evening","title":"Period"},"description":"Period: morning or evening"}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/DoctorAvailabilityResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/staff":{"get":{"tags":["Staff"],"summary":"List Staff","description":"Retrieve all staff members (admin only).","operationId":"list_staff_api_v1_staff_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffListResponse"}}}}},"security":[{"OAuth2PasswordBearer":[]}]},"post":{"tags":["Staff"],"summary":"Create Staff Endpoint","description":"Create a new staff member (admin only).","operationId":"create_staff_endpoint_api_v1_staff_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffCreateRequest"}}},"required":true},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}},"security":[{"OAuth2PasswordBearer":[]}]}},"/api/v1/staff/{staff_id}":{"get":{"tags":["Staff"],"summary":"Get Staff Endpoint","description":"Retrieve a single staff member by ID (admin only).","operationId":"get_staff_endpoint_api_v1_staff__staff_id__get","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"staff_id","in":"path","required":true,"schema":{"type":"string","title":"Staff Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"put":{"tags":["Staff"],"summary":"Update Staff Endpoint","description":"Update a staff member's details (admin only).","operationId":"update_staff_endpoint_api_v1_staff__staff_id__put","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"staff_id","in":"path","required":true,"schema":{"type":"string","title":"Staff Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffUpdateRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/StaffResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"delete":{"tags":["Staff"],"summary":"Delete Staff Endpoint","description":"Delete a staff member (admin only).","operationId":"delete_staff_endpoint_api_v1_staff__staff_id__delete","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"staff_id","in":"path","required":true,"schema":{"type":"string","title":"Staff Id"}}],"responses":{"204":{"description":"Successful Response"},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/patients":{"get":{"tags":["Patients"],"summary":"List Patients Endpoint","description":"Retrieve a list of patients (reception/admin only).","operationId":"list_patients_endpoint_api_v1_patients_get","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"search","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Search by full name, or phone","title":"Search"},"description":"Search by full name, or phone"}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/PatientListResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/patients/{patient_id}":{"get":{"tags":["Patients"],"summary":"Get Patient","description":"Retrieve a single patient by ID (reception/admin only).","operationId":"get_patient_api_v1_patients__patient_id__get","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"patient_id","in":"path","required":true,"schema":{"type":"string","title":"Patient Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/PatientSingleResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/specialties":{"get":{"tags":["Specialties"],"summary":"List Specialties","description":"Retrieve all specialties.","operationId":"list_specialties_api_v1_specialties_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyListResponse"}}}}}},"post":{"tags":["Specialties"],"summary":"Create Specialty Endpoint","description":"Create a new specialty (admin only).","operationId":"create_specialty_endpoint_api_v1_specialties_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyCreateRequest"}}},"required":true},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}},"security":[{"OAuth2PasswordBearer":[]}]}},"/api/v1/specialties/{specialty_id}":{"get":{"tags":["Specialties"],"summary":"Get Specialty","description":"Retrieve a single specialty by ID.","operationId":"get_specialty_api_v1_specialties__specialty_id__get","parameters":[{"name":"specialty_id","in":"path","required":true,"schema":{"type":"string","title":"Specialty Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"put":{"tags":["Specialties"],"summary":"Update Specialty Endpoint","description":"Update a specialty's details (admin only).","operationId":"update_specialty_endpoint_api_v1_specialties__specialty_id__put","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"specialty_id","in":"path","required":true,"schema":{"type":"string","title":"Specialty Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyUpdateRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/SpecialtyResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"delete":{"tags":["Specialties"],"summary":"Delete Specialty Endpoint","description":"Delete a specialty (admin only). Raises an error if doctors are linked to it.","operationId":"delete_specialty_endpoint_api_v1_specialties__specialty_id__delete","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"specialty_id","in":"path","required":true,"schema":{"type":"string","title":"Specialty Id"}}],"responses":{"204":{"description":"Successful Response"},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/appointments":{"post":{"tags":["Appointments"],"summary":"Book Online","description":"Patient books online using their JWT patient_id.","operationId":"book_online_api_v1_appointments_post","security":[{"OAuth2PasswordBearer":[]}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentCreateRequest"}}}},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"get":{"tags":["Appointments"],"summary":"Get Appointments","description":"List appointments. Patients only see their own. Staff can filter.","operationId":"get_appointments_api_v1_appointments_get","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"doctor_id","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Filter by doctor ID (staff only)","title":"Doctor Id"},"description":"Filter by doctor ID (staff only)"},{"name":"date","in":"query","required":false,"schema":{"anyOf":[{"type":"string","format":"date"},{"type":"null"}],"description":"Filter by date (staff only)","title":"Date"},"description":"Filter by date (staff only)"},{"name":"status","in":"query","required":false,"schema":{"anyOf":[{"type":"string"},{"type":"null"}],"description":"Filter by status (staff only)","title":"Status"},"description":"Filter by status (staff only)"}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentListResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/appointments/reception":{"post":{"tags":["Appointments"],"summary":"Book Reception","description":"Reception books on behalf of a patient using an existing patient ID or by creating a new patient.","operationId":"book_reception_api_v1_appointments_reception_post","requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentReceptionCreateRequest"}}},"required":true},"responses":{"201":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}},"security":[{"OAuth2PasswordBearer":[]}]}},"/api/v1/appointments/{appointment_id}":{"get":{"tags":["Appointments"],"summary":"Get Appointment","description":"Get detailed view of a single appointment (Staff or Owner only).","operationId":"get_appointment_api_v1_appointments__appointment_id__get","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"appointment_id","in":"path","required":true,"schema":{"type":"string","title":"Appointment Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}},"delete":{"tags":["Appointments"],"summary":"Delete Appt","description":"Delete appointment (Staff or Owner only).","operationId":"delete_appt_api_v1_appointments__appointment_id__delete","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"appointment_id","in":"path","required":true,"schema":{"type":"string","title":"Appointment Id"}}],"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/appointments/{appointment_id}/status":{"patch":{"tags":["Appointments"],"summary":"Patch Status","description":"Update appointment status (pending/confirmed/rejected/cancelled/no_show/completed).","operationId":"patch_status_api_v1_appointments__appointment_id__status_patch","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"appointment_id","in":"path","required":true,"schema":{"type":"string","title":"Appointment Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentStatusUpdateRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/api/v1/appointments/{appointment_id}/reschedule":{"patch":{"tags":["Appointments"],"summary":"Patch Reschedule","description":"Reschedule date/period of an appointment (Staff or Owner only).","operationId":"patch_reschedule_api_v1_appointments__appointment_id__reschedule_patch","security":[{"OAuth2PasswordBearer":[]}],"parameters":[{"name":"appointment_id","in":"path","required":true,"schema":{"type":"string","title":"Appointment Id"}}],"requestBody":{"required":true,"content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentRescheduleRequest"}}}},"responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{"$ref":"#/components/schemas/AppointmentResponse"}}}},"422":{"description":"Validation Error","content":{"application/json":{"schema":{"$ref":"#/components/schemas/HTTPValidationError"}}}}}}},"/health":{"get":{"summary":"Health Check","operationId":"health_check_health_get","responses":{"200":{"description":"Successful Response","content":{"application/json":{"schema":{}}}}}}}}}
```
