# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a0e82fd2-cacb-4d06-a19d-532e845b0514

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a0e82fd2-cacb-4d06-a19d-532e845b0514) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up your environment variables.
# Copy the example environment file and add your OpenAI API key
cp .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=your-openai-api-key-here

# Step 5: Start the Next.js development server (includes both frontend and API)
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Next.js (Full-stack React framework)
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- OpenAI API (DALL-E 3 for image generation)

## API Configuration

The application uses OpenAI's DALL-E 3 API for image generation. To use the app:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `OPENAI_API_KEY=your-key-here`
3. The app will work in demo mode (showing placeholder images) if no API key is provided

**API Endpoints (Next.js API routes):**
- `POST /api/generate-image` - Generate an image from a text prompt
- `GET /api/health` - Health check endpoint

**Development:**
The app now runs on a single port with Next.js handling both frontend and API routes. No need for separate backend server!

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a0e82fd2-cacb-4d06-a19d-532e845b0514) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
