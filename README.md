<div align="center"><a href="https://museumtimeline.vercel.app"><img width="96px" src="https://user-images.githubusercontent.com/18179415/222605007-66a06286-3f5a-4903-a837-d4c1e8c5147f.png"/></div>
<br>

<div align=center><img src="https://img.shields.io/github/contributors/SWE-2023/COSC-4P02-Project?style=flat-square"/><img src="https://img.shields.io/github/issues/SWE-2023/COSC-4P02-Project?style=flat-square"/></div>

<div align=center><h1>Niagara-on-the-Lake Timeline</h1></div>

## COSC 4P02 Team Project

This is a course project for COSC 4P02 Software Engineering II taught by Professor Naser Ezzati-Jivan at Brock University.

View our project documents in the [documents](documents) folder.

## Accessing the Project

- Visit the site live on the Vercel deployment at [museumtimeline.vercel.app](https://museumtimeline.vercel.app)
- Download the application from the [Google Play](https://play.google.com/store/apps/details?id=app.notltimeline.twa) store

<a href='https://play.google.com/store/apps/details?id=app.notltimeline.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img width=200 alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>

Alternatively, you can clone the repository and run it locally:

1. Ensure [Node.js](https://nodejs.org/en) and npm are installed
2. Ensure [Supabase is installed and running locally](https://supabase.com/docs/guides/self-hosting)
3. Clone the repository:
```bash
git clone https://github.com/SWE-2023/COSC-4P02-Project.git
```

4. Change directory to the `timeline` directory within the repo
```bash
cd COSC-4P02-Project\timeline
```

5. Install the project dependencies:
```bash
npm install
```

6. Configure environment variables by creating a `.env` file alongside `vite.config.js`:
```ini
VITE_SUPABASE_URL=http://localhost:8000/
VITE_SUPABASE_ANON_KEY=the_key_that_you_setup_from_the_supabase_guide
```

7. Connect to the supabase web UI and create the necessary tables by manually applying the `0_init_tables.sql` migration, and optionally setup access permissions at http://localhost:3000/

8. Run the project in the local dev server:

```bash
npx vite
```

9. Press 'O' on the terminal or CTRL+Click the local URL provided by Vite to open the locally-served web application in your browser.

## Project Description 📝
The goal of this project is to create an interactive timeline web application that will allow visitors to explore the history of Niagara-on-the-Lake.

## Technology Stack

<img src="https://skillicons.dev/icons?i=svelte,supabase,vercel"/>

Our project uses the following technologies:

- [SvelteKit](https://kit.svelte.dev): Web application framework built on top of Svelte
- [Svelte](https://svelte.dev): Reactive front-end framework
- [Supabase](https://supabase.com): Backend service with Postgres database and authentication
- [Vercel](https://vercel.com/): Hosting and deployment service

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

## Contact

If you have any questions, please reach out to the [product owner](mailto:dev@alecames.com).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
