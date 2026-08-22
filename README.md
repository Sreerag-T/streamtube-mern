# StreamTube — YouTube Clone (MERN Stack)

A full-stack video-sharing app built for the "Develop a YouTube Clone Using the MERN Stack"
capstone project. Users can browse videos, search and filter by category, sign up / log in
with JWT-based auth, create a channel, upload/edit/delete their own videos, and add, edit or
delete comments on the video player page.

> Note on branding: the app is built and styled to match YouTube's layout and UX (header,
> collapsible sidebar, video grid, player page, channel page) as required by the brief, but
> ships under its own name/logo ("StreamTube") rather than using YouTube's actual trademarked
> name/logo, since this is an independent clone project, not an official YouTube product.

> Note on sign-in: the brief mentions sending users to "a new URL with a Google form to log in
> and register." Since the backend uses proper JWT authentication (as required elsewhere in the
> brief) rather than Google Forms, this was implemented as dedicated `/login` and `/register`
> routes/pages — a new URL with a real login/register form, built the same way any production
> MERN app would handle auth.

## Tech stack

- **Frontend:** React 18 (Vite), React Router v6, Axios, plain CSS (no UI framework)
- **Backend:** Node.js, Express.js, ES Modules
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing

## Project structure

```
youtube-clone/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, video, channel, comment logic
│   ├── middleware/         # protect (JWT), optionalAuth, error handler
│   ├── models/              # User, Video, Channel, Comment (Mongoose)
│   ├── routes/               # /api/auth, /api/videos, /api/channels, /api/comments
│   ├── utils/validators.js
│   ├── seed.js               # sample data loader
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js       # axios instance, auto-attaches JWT
        ├── context/AuthContext.jsx
        ├── components/         # Header, Sidebar, VideoCard, FilterBar, CommentSection
        └── pages/               # Home, Login, Register, VideoPlayer, Channel,
                                   CreateChannel, UploadVideo, EditVideo
```

## Getting started

### 1. Backend

```bash
cd backend
npm install

npm run seed
npm run dev                  # starts the API on http://localhost:5000
```

Sample seeded logins (email / password):

- `john@example.com` / `password123`
- `priya@example.com` / `password123`

### 2. Frontend

```bash
cd frontend
npm install
       # VITE_API_URL=http://localhost:5000/api
npm run dev                  # starts the app on http://localhost:5173
```

Open `http://localhost:5173`. Make sure the backend is running and MongoDB is reachable
(MongoDB Atlas or a local `mongod` instance) before starting the frontend.

## Features implemented

**Home page:** header with hamburger-toggle sidebar, 9 category filter chips (including "All"),
live search by title, responsive video grid with thumbnail / title / channel / views.

**Auth:** register (username, email, password) with client + server-side validation and inline
error messages; auto-redirect to `/login` after successful signup; JWT login; signed-in user's
name/avatar shown in the header with a dropdown for channel/upload/sign-out.

**Video player page:** HTML5 video player, title, description, channel info, like/dislike
(mutually exclusive, persisted per user), and a full comment CRUD (add / edit / delete),
with an "Up next" related-videos rail.

**Channel page:** create a channel (only when signed in), list of the channel's videos, and
CRUD access (edit/delete buttons) restricted to the channel owner.

**Search & filter:** search bar in the header filters by title (server-side regex match);
9 category filter buttons (exceeds the "at least 6" requirement) filter server-side by category.

**Responsive design:** sidebar collapses/hides and the grid re-flows down to mobile widths;
see the media queries at the bottom of `frontend/src/styles/index.css`.

## API reference

| Method | Route                         | Auth     | Description                       |
| ------ | ----------------------------- | -------- | --------------------------------- |
| POST   | /api/auth/register            | No       | Create a user                     |
| POST   | /api/auth/login               | No       | Log in, returns JWT + user        |
| GET    | /api/auth/me                  | Yes      | Current user profile              |
| GET    | /api/videos?search=&category= | No       | List/search/filter videos         |
| GET    | /api/videos/:id               | Optional | Video detail (+ view count)       |
| POST   | /api/videos                   | Yes      | Upload a video (must own channel) |
| PUT    | /api/videos/:id               | Yes      | Update a video (owner only)       |
| DELETE | /api/videos/:id               | Yes      | Delete a video (owner only)       |
| PUT    | /api/videos/:id/like          | Yes      | Toggle like                       |
| PUT    | /api/videos/:id/dislike       | Yes      | Toggle dislike                    |
| POST   | /api/channels                 | Yes      | Create a channel                  |
| GET    | /api/channels/:id             | No       | Channel detail + its videos       |
| GET    | /api/channels/mine/list       | Yes      | Channels owned by current user    |
| PUT    | /api/channels/:id             | Yes      | Update a channel (owner only)     |
| DELETE | /api/channels/:id             | Yes      | Delete a channel (owner only)     |
| GET    | /api/comments/video/:videoId  | No       | Comments for a video              |
| POST   | /api/comments                 | Yes      | Add a comment                     |
| PUT    | /api/comments/:id             | Yes      | Edit own comment                  |
| DELETE | /api/comments/:id             | Yes      | Delete own comment                |

## Notes for evaluators

- Run `npm run seed` in `backend/` to populate MongoDB with sample users, channels, videos and
  comments so all pages can be tested immediately without manual data entry.
- Sample video/thumbnail URLs use public placeholder services (`picsum.photos`, a public sample
  `.mp4` from w3schools) purely so the player and thumbnails render out of the box; real uploads
  use whatever `videoUrl` / `thumbnailUrl` you paste into the upload form (this project stores
  URLs, not binary files, per the brief's "store file metadata" requirement).

Username
codefuel05_db_user

Password
tQrYvp7HYVOz3NeS


### Github   

