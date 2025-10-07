# Software Frameworks Documentation

## Instructions

> **Default Seeded User Credentials:**  
> - **Username:** `test1`  
> - **Password:** `1234`

---

## Section 1) Git Repository Organisation

My Git repository utilises **branches** to test and develop additional features that might need to be rolled back or drastically altered during development. 

When a particular feature is complete, it is **merged into the main branch**. Most of the development took place on the `main` branch, with only significant features (larger in scope or codebase coverage) tested in **safe feature branches** away from `main`.

---

## Section 1) Git Repository Organisation

My Git repository utilises **branches** to test and develop additional features that might need to be rolled back or drastically altered during development. 

When a particular feature is complete, it is **merged into the main branch**. Most of the development took place on the `main` branch, with only significant features (larger in scope or codebase coverage) tested in **safe feature branches** away from `main`.

---

## Section 2) Data Structures Used (Client & Server)

### `User()`
The `User` class contains all relevant information needing to be stored in the database:

- `username`
- `email`
- `password`
- `birthdate`
- `role`
- `groups[]` (Array of groups the user is part of)

### `Group()`
The `Group` class stores all necessary data related to a group:

- `creatorUsername`
- `groupName`
- `members[]`
- `channels[]`
- `waitlist[]`

### `Message()`
The `Message` class represents a single chat message:

- `sender`
- `timestamp`
- `message`
- `prfofilePicture`

### `Channel()`
The `Channel` class contains information about a single group channel:

- `channelName`
- `creator`
- `messageHistory[]`

---

## Section 3) Angular Architecture

I structured Angular components to mostly represent **entire pages**, while segmenting specific UI/logic tasks into **child components**.

### Services

- **`ApiService`**: Handles all API routes connected to the Node server. Ensures safe data flow between frontend and backend.
- **`SocketService`**: Manages socket-related events. Handles:
  - Real-time channel and group creation/deletion
  - Chat messaging
  - Join/leave notifications

---

## Section 4) REST API / Socket Routes

### User Routes

#### `CreateUserRoute()`
- **@params**: `username`, `email`, `password` (via request body)  
- **@returns**: `success` (boolean), `message` (string)  
Creates a new user if the username is not already in the database.

#### `removeUserRoute()`
- **@params**: `username` (via URL params)  
- **@returns**: `success`, `message`  
Deletes user and removes them from all group memberships.

#### `updateProfileRoute()`
- **@params**: `username`, `email`, `age`, `birthdate` (via body), token via `Authorization` header  
- **@returns**: `success`, `message`  
Updates user profile information.

#### `updateUserRole()`
- **@params**: `username` (via URL), `role` (via body)  
- **@returns**: `success`, `message`  
Updates user role in the database.

#### `userLoginRoute()`
- **@params**: `username`, `password` (via body)  
- **@returns**: `success`, `message`, `token`  
Authenticates user and returns a JWT containing encrypted user ID.

#### `getUsersRoute()`
- **@params**: `page`, `limit` (via query params)  
- **@returns**: `success`, `usernames`, `userIds`, `userRoles`, `pageLimit`  
Returns paginated user data for display.

---

### Group Routes

#### `CreateGroupRoute()`
- **@params**: `groupName`, `username` (via body)  
- **@returns**: `valid` (boolean)  
Creates a new group and emits a socket event for UI update.

#### `DeleteGroupRoute()`
- **@params**: `groupID` (via URL param)  
- **@returns**: `success`, `message`  
Deletes a group and emits a socket event.

#### `getGroupsRoute()`
- **@params**: `page`, `limit`, `username`, `useCase`  
- **@returns**: All group-related fields: IDs, members, waitlist, channels, creator  
Filters data based on `useCase` for either admin or user dashboard.

#### `addUserToGroupRoute()`
- **@params**: `groupID`, `username` (via URL params)  
- **@returns**: `success`, `message`  
Moves user from waitlist to group member list.

#### `addUserToWaitlistRoute()`
- **@params**: `username`, `groupID` (via URL params)  
- **@returns**: `valid`, `message`  
Adds user to group's waitlist for approval.

---

### Channel Routes

#### `createChannelRoute()`
- **@params**: `username`, `groupID`, `channelName`  
- **@returns**: `valid` (boolean)  
Creates a new channel and emits socket event.

#### `deleteChannelRoute()`
- **@params**: `channelName`, `groupName`, `username`  
- **@returns**: `valid`, `message`  
Deletes a channel from a group.

#### `getChannelMessagesRoute()`
- **@params**: `groupName`, `channelName`  
- **@returns**: `valid`, `messages[]`  
Returns all messages in a channel.

---

### Utility Routes

#### `verifyTokenRoute()`
- **@params**: Token via `Authorization` header  
- **@returns**: `valid`, user info (excluding password)  
Verifies a user's JWT and returns their data for use in frontend logic/UI rendering.

---

### Real-Time Messaging via Sockets

Each user has a **unique socket connection**. This socket is joined to:

- A **room for every group** the user is part of.
- One (or none) **channel room**, depending on the channel they are currently active in.

This structure enables **real-time UI updates** when actions occur—such as on the admin dashboard or within chat rooms.

#### Message Flow

1. **Sending a Message:**
   - When a user presses **Send** in the chatbox, the content is:
     - Formatted into an instance of the `Message` class.
     - Emitted to the server using the socket event: `'SendMessage'`.

2. **Server-Side Handling:**
   - The server receives the message via `'SendMessage'`.
   - It formats the message and re-emits it using: `'ReceiveMessage'`.
   - This event targets **all sockets** connected to the relevant **channel room**.

3. **Receiving Messages (Client-Side):**
   - Clients listening to `'ReceiveMessage'` will:
     - Append the received message to their **messages array** for that channel.
     - Trigger a UI update to show the new message in real-time.

4. **Persistence:**
   - The message is also saved to the **channel's message history array** on the backend, ensuring persistence across sessions.
