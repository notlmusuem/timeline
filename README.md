<div align="center"><img width="96px" src="https://user-images.githubusercontent.com/18179415/222605007-66a06286-3f5a-4903-a837-d4c1e8c5147f.png"/></div>
<br>

<div align=center><img src="https://img.shields.io/github/contributors/SWE-2023/COSC-4P02-Project?style=flat-square"/><img src="https://img.shields.io/github/issues/SWE-2023/COSC-4P02-Project?style=flat-square"/></div>

<div align=center><h1>Niagara-on-the-Lake Timeline</h1></div>

## COSC 4P02 Team Project

This is a web application to present historical events on a visual timeline for the Niagara-on-the-Lake museum.

View original project documents in the documents branch.


## Accessing the Project

- Visit the site live on the Vercel deployment at [museumtimeline.vercel.app](https://museumtimeline.vercel.app)
- Download the application from the [Google Play](https://play.google.com/store/apps/details?id=app.notltimeline.twa) store

<a href='https://play.google.com/store/apps/details?id=app.notltimeline.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img width=200 alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>

Alternatively, you can clone the repository and run it locally:

1. Ensure [Node.js](https://nodejs.org/en) and npm are installed
2. Clone the repository:
```bash
git clone https://github.com/notlmusuem/timeline.git
cd timeline\timeline
```

3. Install npm dependencies and development dependencies:
```bash
npm install
```

4. Configure environment variables by creating a `.env` file alongside `vite.config.js`:
```ini
VITE_SUPABASE_URL=http://localhost:8000/
VITE_SUPABASE_ANON_KEY=the_key_that_you_setup_from_the_supabase_guide
```

5. [Setup supabase selfhosting](https://supabase.com/docs/guides/getting-started/local-development):
```bash
npx supabase init
npx supabase start
```

6. Connect to the supabase web UI and manually apply migrations, or run the migration command:
```bash
npx supabase db reset
```

7. On the supabase studio web UI, create a new user account for yourself, and check auto confirm. This will be the account and password used to login to the website's staff interface.

8. With supabase started, run the project. Note that this command is also responsible for generating sveltekit types on the fly.
```bash
npm run dev
```

9. Press 'O' on the terminal or CTRL+Click the local URL provided by Vite to open the locally-served application in your browser.


## Testing
1. Check that sveltekit reports no errors.
```bash
npm run check
# npm run check:watch is also available for live checking
```

2. Test the build. This will catch some infrequent vite and bundler errors not caught by the dev server.
```bash
npm run build
```


## Project Description 📝
The goal of this project is to create an interactive timeline web application that will allow visitors to explore the history of Niagara-on-the-Lake.

## Technology Stack

<img src="https://skillicons.dev/icons?i=svelte,supabase,vite"/>

The project uses the following technologies:

- [SvelteKit](https://kit.svelte.dev): Web application framework built on top of Svelte
- [Svelte](https://svelte.dev): Reactive front-end framework
- [Supabase](https://supabase.com): Backend service with Postgres database and authentication
- [Vite](https://vitejs.dev/): Hosting and deployment service

## Team Members 👥

| Name | Student Number|
|------|---------------|
| [Alec Ames](https://github.com/alecames) - *Team Leader* | 6843577 |
| [Matthew Benson](https://github.com/MattMBenson)| 6729388 |
| [Ibrahim Hashmi](https://github.com/ibhashmi)| 6352926 |
| [Francis Monwe](https://github.com/monwe-jr)| 6724355 |
| [Tommy Pham](https://github.com/tommyphamca)| 6733646 |
| [Abhijeet Prajapati](https://github.com/TheDasher1)| 5987722 |
| [Justin Stickel](https://github.com/Stickelation) - *Scrum Master*| 6718704 |
| [Haaris Yahya](https://github.com/haarisyahya)| 7054984 |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
