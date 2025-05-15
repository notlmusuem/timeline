<div align="center"><img width="96px" src="https://user-images.githubusercontent.com/18179415/222605007-66a06286-3f5a-4903-a837-d4c1e8c5147f.png"/></div>
<br>

<div align=center><h1>Niagara-on-the-Lake Timeline</h1></div>

The Niagara-on-the-Lake Timeline is a project created by several teams of software developers from Brock University for the Niagara-on-the-Lake Museum. It is an interactive timeline that documents, teaches, and presents the rich history of Niagara-on-the-Lake, and other historical events & artefacts from the musuem's collection.

This project was graciously funded by [Gatta Homes Inc](https://gattahomes.com/), and through the [VPMI](https://brocku.ca/vpmi/)/[FedDev](https://feddev-ontario.canada.ca/en) grant. It was developed by Brock University students in partnership with the Niagara-on-the-Lake Museum.

## Setup

1. Ensure [Node.js](https://nodejs.org/en) and npm are installed
2. Clone the repository:
```bash
git clone https://github.com/notlmusuem/timeline.git
cd timeline/timeline
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

5. [Setup a supabase selfhosted environment](https://supabase.com/docs/guides/getting-started/local-development):
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


## Technology Stack

<img src="https://skillicons.dev/icons?i=svelte,supabase,vite"/>

The project uses the following technologies:

- [SvelteKit](https://kit.svelte.dev): Web application framework built on top of Svelte
- [Svelte](https://svelte.dev): Reactive front-end framework
- [Supabase](https://supabase.com): Backend service with Postgres database and authentication
- [Vite](https://vitejs.dev/): Hosting and deployment service

## License

Copyright (c) 2023-2025 Brock University and The Project Contributors (Alec Ames, Ibrahim Hashmi, Francis Monwe, Matthew Benson, Tommy Pham, Abhijeet Prajapati, Justin Stickel, Haaris Yahya, Muhammed Bilal, and Michael Boulet).

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.
