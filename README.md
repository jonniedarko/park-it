# Park-It: Parking Session Tracker

## Overview
Park-It is a proof-of-concept parking session tracking system built using Next.js, Firebase Firestore, TypeScript, and React. This system enables tracking and modification of parking sessions via a user-friendly frontend application.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

**Important notes** : I did not document firebase set up. Firebase is knew to me and not confident it is configuration right now, more time is needed to read through docs to understand it more. I also have a bug with how I am currently using Auth on client side (AuthContext) due to apiKey in process.env not being available on front end. I know I can add Env vars via next.config.js to the client side but I did not have enough time understanding the security implications and find the right solution. given it was a Bonus I elected to not explore any further for now. 

**Assumptions** : I made a number of assumptions that I would normally consult with product on :
 - session status didn't need to be persisted - we can figure that our from entry/exit timestamps. This make is less complex because we no longer have to keep it in sync
 - I attempted to introduce over optimisation or unneccessay abstractions e.g. datagrid and columns. This is something that I found can often be a trap for developers who try to make grids/tables reusable. In my experience most premature "engineering" leads to refactors later anyway.
 - I originally started with full grid editing, but in the end I decided to simply. when you create a session it uses current time , when you finish a session it also uses the current time. This means we don't have to worry about as much user error or bad data.
 - I adpated some pre-made templates for login/register from https://github.com/mui/material-ui/blob/v5.14.15/docs/data/material/getting-started/templates/

## Why Next.js?
Next.js provides features like server-side rendering and a set of APIs, making it a perfect fit for this project. I choose Next.js due to its popularity, amazing support by vercel and I am familure with it.I also used this to play with the new app directory set up, which is something I've been wanting to try for while

## Getting Started
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Copy `.env.example` to `.env` and fill in the required Firebase configurations.
4. To start the development serve run :
   ```bash
    npm run dev
   ```

## Directory Structure

### API Routes

#### Authentication
These APIs are simple endpoint wrappers for methods in our firebase config file
- `src/app/api/auth/login/route.ts`: Handles user login.  
- `src/app/api/auth/logout/route.ts`: Handles user logout. (no ui for this currently)
- `src/app/api/auth/register/route.ts`: Handles user registration.

#### Parking Sessions

- `src/app/api/parking_sessions/[id]/route.ts`: GET returns single session for the id, POST updates the session
- `src/app/api/parking_sessions/route.ts`: GET lists all sessions, POST adds new sessions
- `src/app/api/test/route.ts`: A test route. Quick way to add new sessions

### Frontend Pages
- `src/app/login/page.tsx`: Login page.
- `src/app/register/page.tsx`: Registration page.
- `src/app/dashboard/page.tsx`: The main dashboard to display parking sessions.
   The `DashboardPage` is the cornerstone of the Park-It application, serving as the central dashboard for managing and tracking parking sessions. This section dives into the intricacies of this component, breaking down its elements, functionalities, and interactions.

#### Building Blocks

1. **State Management**
    - `sessions`: An array that stores the parking session data.
    - `addModalOpen`: A boolean flag that controls the `NewSessionDialog` visibility.
    - `snack`: An object that manages the state for Snackbar notifications.

2. **UI Components**
    - `DataGrid`: Material UI's grid component that displays parking sessions.
    - `Snackbar`: Provides user feedback.
    - `NewSessionDialog`: A custom dialog component for adding new parking sessions.

3. **Utility Functions**
    - `getSessions` and `getSessionsFromRemote`: Responsible for fetching session data from the backend.
    - validations for the phone number and license plates (imported from `validators.ts` - simple regex/js functions


#### Column Definitions

The DataGrid relies on a set of column definitions stored in the `columns` array. Each column represents a different field in a parking session, such as the license plate number, phone number, and timestamps for entry and exit. Status is figure out from exit - entry and I used a checkmark for completed session and a `Car` icon with color `warning` to indicate session is still active.

#### Data Fetching and Transformation

When the component mounts (`useEffect`), it fetches the parking session data by calling `getSessionsFromRemote`, which internally uses `getSessions` to fetch data and `transformSessionsToGridFormat` to format it for the DataGrid.

#### User Interactions

1. **Adding a New Session**: Clicking the 'Add' button opens the `NewSessionDialog` where users can input new session details. The `addRecord` function then processes this data.
  
2. **Editing an Existing Session**: Sessions can be directly edited in the DataGrid. The `handleRowEditStop` and `processRowUpdate` functions manage these edits.

3. **Completing a Session**: An 'End Session' button appears next to active sessions. Clicking this button triggers `handleCompleteSessionClick`, which updates the session status.

#### User Feedback

The `Snackbar` component provides real-time feedback based on user actions, such as successfully adding or completing a session. It uses the `snack` state variable to control its behavior.

#### Routing and Authentication

The component uses `useEffect` to check if a user is authenticated through `useAuthContext`. If not, it redirects them to the login page using `useRouter`.
 
### Components

- `src/components/CenteredLoadingIndicator.tsx`: Loading indicator.
- `src/components/NewSessionDialog.tsx`: Dialog for new parking session. Validation is performed here prior to allowing creating
- `src/components/ProtectedRoute.tsx`: Route protection based on authentication.

### Context

- `src/context/AuthContext.tsx`: Provides authentication state throughout the app.

### Firebase

- `src/firebase/auth/login.ts`: Firebase login logic.
- `src/firebase/auth/logout.ts`: Firebase logout logic.
- `src/firebase/auth/register.ts`: Firebase registration logic.
- `src/firebase/config.ts`: Firebase configuration.

### Libraries

- `src/lib/transformers.ts`: Utility functions.
- `src/lib/validators.ts`: Validation functions.

### Middleware

- `src/middleware.ts`: Middleware for route protection.

## Prioritized Tasks to Meet Minimum Criteria

1. [x] Implement Firebase Firestore data model for parking sessions.
2. [x] Set up Material UI DataGrid to display parking sessions.
3. [x] Implement form validations for phone numbers and license plates.
4. [x] Create, update, and complete parking sessions via UI.
5. [x] Provide real-time user feedback and loading indicators.

## Not done:
- [ ] prevent multiple active sessions for same car

## Bonus Tasks

- [x] Basic styling for UI elements.
- [x] Implement backend API to separate writes to Firestore.
- [x] Add authentication via Firebase Auth.
- [ ] Implement data validation via a framework like `class-validator`.
- [ ] Add pagination for DataGrid.
- [ ] Write unit tests for critical functionalities.
- [ ] Deploy the application on Firebase hosting.

## Conclusion
TBD




