# MY BUSINESS HUB AI backend

This backend keeps the OpenAI API key off the public GitHub Pages website.

## Files
- `server.js` - Express API
- `package.json` - dependencies
- `.env.example` - environment-variable template
- `.gitignore` - prevents `.env` and `node_modules` from being committed

## Environment variables
Create a file named `.env` from `.env.example` and set:

`OPENAI_API_KEY=...`

For a GitHub Pages site at `https://sujanraj9740.github.io`, set:

`ALLOWED_ORIGIN=https://sujanraj9740.github.io`

## Run locally

```bash
npm install
npm start
```

The API will be available at `http://localhost:3000/ask`.

## Connect the website

In `index.html`, replace:

`YOUR_BACKEND_URL/ask`

with your deployed backend URL, for example:

`https://your-backend-domain.example/ask`

Never put the OpenAI API key in `index.html` or commit `.env` to GitHub.
