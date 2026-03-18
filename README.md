# LEDA College Fit Finder

An interactive questionnaire that helps LEDA scholars discover what matters most to them in a college and generates personalized search terms.

## Deploy to Vercel (Free, ~10 minutes)

### What you need
- A GitHub account (free at github.com)
- A Vercel account (free at vercel.com — sign up with your GitHub)
- An Anthropic API key (for the AI-powered search term suggestions)

### Step-by-step

#### 1. Get API keys
- **Anthropic** (for AI search term suggestions): Go to https://console.anthropic.com, create an API key
- **Resend** (for emailing results to scholars): Go to https://resend.com, sign up free, create an API key. Free tier = 100 emails/day.

#### 2. Push this project to GitHub
- Go to github.com and create a new repository (e.g. "leda-college-fit-finder")
- Make it Private if you prefer
- Upload all the files from this folder to that repository
- Or use the command line:
  ```
  cd leda-fit-finder
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/leda-college-fit-finder.git
  git push -u origin main
  ```

#### 3. Connect to Vercel
- Go to vercel.com and click "Add New Project"
- Import your GitHub repository
- Vercel will auto-detect it as a Vite project

#### 4. Configure the build
- Framework Preset: Vite (should be auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Click Deploy

#### 5. Add your API keys
- In your Vercel project dashboard, go to Settings → Environment Variables
- Add two variables:
  - Name: `ANTHROPIC_API_KEY` / Value: your Anthropic key
  - Name: `RESEND_API_KEY` / Value: your Resend key
- Make sure all three checkboxes (Production, Preview, Development) are checked for each
- Click Save
- Redeploy (go to Deployments tab, click the three dots on the latest, "Redeploy")

#### 6. You're live!
- Vercel gives you a URL like `leda-college-fit-finder.vercel.app`
- You can add a custom domain in Settings → Domains (e.g. `fitfinder.ledascholars.org`)
- Share the link with scholars!

### Optional: Custom domain
If LEDA owns a domain, you can point a subdomain to Vercel:
1. In Vercel Settings → Domains, add your domain
2. Follow the DNS instructions Vercel provides
3. SSL is automatic

## Development

To run locally:
```
npm install
npm run dev
```
Open http://localhost:5173

## How it works

- **No backend needed** for the questionnaire itself — it's all client-side React
- **PDF download** uses jsPDF to generate a real PDF on the client — no server needed
- **Email results** calls a Vercel serverless function at `/api/send-results`, which sends via Resend
- **The AI feature** (turning open-ended comments into search terms) calls a Vercel serverless function at `/api/suggest-terms`, which proxies to the Anthropic API
- **If you skip the API keys**, the questionnaire and PDF download still work — email and AI suggestions won't
- **Student data is never stored** — everything lives in the browser session and disappears when they close the tab

## Files

```
leda-fit-finder/
├── api/
│   └── suggest-terms.js    ← Serverless function (AI proxy)
├── public/                  ← Static assets
├── src/
│   ├── App.jsx             ← The questionnaire component
│   └── main.jsx            ← React entry point
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```
