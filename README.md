# Codeboard

Codeboard is a prototype of a platform that helps you to go from an idea to a ship in no time. It's built with React Router v7, Vite, and Tailwind CSS.

_Found a bug? Want a new feature? [Create an issue!](https://github.com/CragglesG/codeboard/issues/new) (Please check for an existing one first to avoid duplicates!)_

_Want to contribute? You can find good first issues [here](https://github.com/CragglesG/codeboard/contribute)._

## Local Development

Run the following commands to clone, install, and run Codeboard locally:

```bash
git clone https://github.com/CragglesG/codeboard && cd codeboard
bun i
bun dev
```

To contribute back to Codeboard, fork the repository and create a PR with your changes.

## Key Features

Codeboard has 4 key features, each one seamlessly integrated with the next.

### Scribbles

Jot down ideas on-the-go in an editor supporting markdown, and soon, drawings and charts.

### Boards (Coming Soon)

Refine and develop your ideas with the help of specially designed AI (**not** chatbots) and NLP. Define processes with flowcharts that understand your idea, and define specifics like frameworks with extensive options. Use different data representations/charts depending on the type of information you are specifying, so you don't waste time ineffectively preserving ideas. Never forget specifics again.

### Jumpstarts (Coming Soon)

Get creating straight away with pre-configured dev environments ready just when you need them, with no need to wait for them to boot. Skip the boring stuff with boilerplate written by AI (once again, specially designed and not generalised).

### Prototypes (Coming Soon)

Tweak important features of your implementation and automatically create new versions that incorporate even more of your idea. Go from a rushed version 1 to a final ship in no time.

## Implementation

### Scribbles

Codeboard currently stores scribbles and images using Vercel Blob storage. Uploaded images are saved with randomised 20-character alphanumeric IDs as their filenames. Scribbles are saved in a folder specific to the user, also with randomised 20-character alphanumeric IDs for filenames. They utilise frontmatter to store data such as the title, which is displayed on the dashboard. Scribbles automatically save every 5 seconds if changes have been made, and will save on navigation away from the tab, in addition to saving when Ctrl+S is pressed.

### Dashboard

The dashboard uses the `/api/listmd` endpoint to list the scribbles files associated with a user, and then displays them as a list of links. Upon clicking on the `New Scribble` link, the user is redirected to `/newscribble`, where they can choose a title for their scribble.

### Backend

Codeboard currently uses Better Auth and Supabase to manage authentication, and React Router to manage navigation and state. Multiple API endpoints are exposed for client-side use, namely, `/api/auth`, `/api/images`, `/api/listmd`, and `/api/md`. All of these endpoints – with the exception of `/api/listmd` – support both GET and POST requests. Upon navigation, data is sent using states instead of URL parameters. This ensures cleaner URLs and uses React Router's built-in navigation and state retrieval utilities, but it makes it harder to share projects and create reproducible results (this will likely be fixed at some point in the future). The `/dashboard` and `/scribbles` routes are only accessible by authenticated users, and links to those pages and authentication pages will automatically redirect based on the authentication status.
