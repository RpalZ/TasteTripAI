# Frontend Integration Checklist for TasteTrip AI

This checklist ensures your frontend (e.g., Bolt.new) integrates smoothly with the backend API.

---

## 1. Authentication
- [ ] Use Supabase Auth for user sign-in/sign-up.
- [ ] Retrieve the user's Supabase session access token after login.
- [ ] For every API request, set the `Authorization` header:
  ```http
  Authorization: Bearer <supabase-access-token>
  ```
- [ ] Handle 401 Unauthorized errors by prompting the user to re-authenticate.

## 2. API Endpoints
- [ ] Use the following endpoints:
  - `POST   /api/taste`           — Store user taste input
  - `GET    /api/taste/similar`   — Find similar tastes (requires `id` param)
  - `POST   /api/recommend`       — Get recommendations (requires `embedding_id`)
  - `POST   /api/booking`         — Google Maps search (requires `query`)
- [ ] Follow the request/response shapes in `docs/backend-api.md`.
- [ ] Always include the JWT in the `Authorization` header for all endpoints.

## 3. Environment & Config
- [ ] Confirm the backend API base URL (e.g., `http://localhost:4000` or production URL).
- [ ] Set up CORS if developing locally (the backend already uses CORS middleware).

## 4. Error Handling
- [ ] Handle and display errors from the backend (e.g., 400, 401, 500).
- [ ] Show user-friendly messages for auth errors and API failures.

## 5. Testing
- [ ] Test all endpoints with valid and invalid tokens.
- [ ] Test edge cases (e.g., missing input, expired session).
- [ ] Use Postman/Thunderclient for manual API testing if needed.

## 6. Documentation
- [ ] Reference `docs/backend-api.md` for endpoint details.
- [ ] Reference `docs/setup.md` for environment/config info.
- [ ] Reference `docs/PRD.md` for product/security requirements.

---

**If you encounter any issues or need backend tweaks, contact the backend team!** 