<script lang="ts">
  import { slide } from "svelte/transition";

  import { kioskMode } from "$lib/stores/store";
  import { base_url } from "$lib/stores/env";
  import { strip_end, strip_start } from "$lib/utils";

  import Button from "$lib/components/Button.svelte";
  import Copyright from "$lib/components/Copyright.svelte";
  import PageTransition from "$lib/components/PageTransitionFly.svelte";
  import QrCodeDyn from "$lib/components/QrCodeDyn.svelte";

  // This json file was automatically generated with the package
  // https://www.npmjs.com/package/license-report and the command line:
  // npx license-report --output=json
  import projects_m from "./projects.json";


  const projects = projects_m as {
    department: string;
    relatedTo: string;
    name: string;
    licensePeriod: string;
    material: string;
    licenseType: string;
    licenseLink: string;  // new prop
    link: string;
    remoteVersion: string;
    installedVersion: string;
    definedVersion: string;
    author: string;
  }[];

  for (const project of projects) {
    project.licenseLink = "";

    // this license is not documented on npm for whatever reason, see https://github.com/ankurrsinghal/svelte-legos/blob/master/LICENSE.md
    if (project.name == "svelte-legos") {
      project.licenseType = "MIT";
    }

    if (project.name == "scss") {
      project.licenseType = "Modified MIT";
      project.licenseLink = "https://www.npmjs.com/package/scss#modified-mit-license";
    }

    project.licenseLink = project.licenseLink != "" ? project.licenseLink
      : `https://opensource.org/license/${project.licenseType}`;
  }


  const members = [
    {
      name: "Alec Ames",
      pic: "https://media.licdn.com/dms/image/D5603AQGBaGdxymdLTA/profile-displayphoto-shrink_800_800/0/1679545357267?e=1687392000&v=beta&t=tdCHXPorM-cBHk8URmvTgFk83c2wrhPRO0cd0wFu-OA",
      role: "Team Lead • Developer",
      github: "https://github.com/alecames",
      linkedin: "https://www.linkedin.com/in/alecames/",
    },
    {
      name: "Ibrahim Hashmi",
      pic: "https://media.licdn.com/dms/image/C4E03AQEr70AZWiDNWA/profile-displayphoto-shrink_800_800/0/1613092600500?e=1687392000&v=beta&t=eV5-BPVA_HLEox8wmFLj4MJSPUe2gToHJKCAQ-d8b_o",
      role: "Developer",
      github: "https://github.com/ibhashmi",
      linkedin: "https://www.linkedin.com/in/ibrahimh26/",
    },
    {
      name: "Francis Monwe",
      pic: "https://media.licdn.com/dms/image/C4E03AQFheKji8LLI2g/profile-displayphoto-shrink_800_800/0/1652670840391?e=1687392000&v=beta&t=rykL51jyTdCAXCFHrkmR1bJaELjel8D91hUmYMJk7K8",
      role: "Developer",
      github: "https://github.com/monwe-jr",
      linkedin: "https://www.linkedin.com/in/francis-monwe-674501198/",
    },
    {
      name: "Matthew Benson",
      pic: "https://media.licdn.com/dms/image/C4E03AQFk04BV0Phu4g/profile-displayphoto-shrink_800_800/0/1627429475282?e=1687392000&v=beta&t=8S9vHSFl1v565Hdm9EwftvrDOmUBH-1My5Neua5m5j8",
      role: "Developer",
      github: "https://github.com/MattMBenson",
      linkedin: "https://www.linkedin.com/in/matthew-benson-59b1a31b7/",
    },
    {
      name: "Tommy Pham",
      pic: "https://media.licdn.com/dms/image/C4D03AQFyO7qwiqBjXQ/profile-displayphoto-shrink_800_800/0/1566411354394?e=1687392000&v=beta&t=GEGLxQY6epG9fB6DymGQlPMlPUeObS-zA948WMsP_P0",
      role: "Developer",
      github: "https://github.com/tommyphamca",
      linkedin: "https://www.linkedin.com/in/tommyphamca/",
    },
    {
      name: "Abhijeet Prajapati",
      pic: "https://avatars.githubusercontent.com/u/68875359?v=4",
      role: "Developer",
      github: "https://github.com/TheDasher1",
      linkedin: "https://www.linkedin.com/in/abhijeet-prajapati-4a20a7164/",
    },
    {
      name: "Justin Stickel",
      pic: "https://media.licdn.com/dms/image/C5603AQHhT11yEwhjnw/profile-displayphoto-shrink_800_800/0/1608219438361?e=1687392000&v=beta&t=6zMLZCUaRMBFYvP4CSk_snY1a9PXHFpNOtcwlcD_0cw",
      role: "Scrum Master",
      github: "https://github.com/Stickelation",
      linkedin: "https://www.linkedin.com/in/justin-stickel/",
    },
    {
      name: "Haaris Yahya",
      pic: "https://avatars.githubusercontent.com/u/80646420?v=4",
      role: "Developer",
      github: "https://github.com/haarisyahya",
      linkedin: "https://www.linkedin.com/in/haaris-yahya-398ba9195/",
    },
  ];

</script>

<svelte:head>
  <title>About | Niagara-on-the-Lake Timeline</title>
  <meta name="description" content="About page" />
</svelte:head>

<PageTransition>
  <gap />
  <section class="page" in:slide>
    <div>
      <h1>About Niagara-on-the-Lake</h1>
      <img class="radius fright" src="$lib/assets/clock-tower.webp"
        alt="Clock Tower" style="max-width: 50%;" />
      <p>
        Niagara-on-the-Lake is a small town located in southern
        Ontario, Canada. Despite its size, it has a rich history dating back
        to the 19th century: the town was home to Fort George, which was built
        by the British to defend against American offensives in the 19th
        century.
        Today, Niagara-on-the-Lake is known for its beautiful flowers & trees,
        is home to the summer Shaw Festival, it’s old heritage downtown, and its
        iconic wineries.
      </p>

      <h1 class='fclear'>About the Museum</h1>
      <img class="radius fleft" src="$lib/assets/museum.jpg"
        alt="Niagara-on-the-Lake Museum Logo" style="max-width: 50%;"/>
      <p>
        The Niagara Historical Society was established in 1895 to foster an
        appreciation of Niagara-on-the-Lake’s rich heritage. Within a year, the
        Society had a significant collection of artefacts that it decided to
        open a Museum in the local Courthouse. In 1907, under the leadership of
        the Society’s President, Janet Carnochan, they opened Memorial Hall,
        Ontario’s first purpose-built Museum.
      </p>
      <p>
        The NOTL Museum is operated by the Niagara Historical
        Society and continues to preserve, present, and represent
        Niagara-on-the-Lake’s rich heritage.
        Containing artefacts from Indigenous settlement to the present day, the
        Museum is home to over 8,500 artefacts, 41,000 documents, 4,000
        photographs and 900 books.
      </p>
      {#if $kioskMode}
        <div class='fright'>
          <QrCodeDyn data="https://notlmuseum.ca/" size={200}></QrCodeDyn>
        </div>
      {/if}
      <p>
        The museum hosts a permanent exhibition called “Our Story,” which
        documents the local history of Niagara-on-the-Lake.
        It hosts several temporary exhibitions throughout the year, as well
        as over 80 engaging programs that are enjoyed by people from all walks of life.
      </p>
      {#if !$kioskMode}
        <p>Visit our website at <a href="https://www.notlmuseum.ca/" on:click|preventDefault>notlmuseum.ca</a> to learn about about the musuem, and to get involved in the Niagara Historical Society.</p>
      {:else}
        <p>Visit our website at <a href="https://www.notlmuseum.ca/" on:click|preventDefault>https://notlmuseum.ca</a> on your mobile device or scan the QR code to learn about about the musuem, and to get involved in the Niagara Historical Society.</p>
      {/if}
    </div>
    <div>
      <h1 id="about-this-timeline">About this Timeline</h1>
      <div>
        {#if $kioskMode}
          <div class='fleft'>
            <QrCodeDyn data={base_url.toString()} size={200}></QrCodeDyn>
          </div>
        {/if}
        {#if $kioskMode}
          <p>This timeline is also available as a website
            at <a href={base_url.toString()}>{base_url.toString()}</a>
            or scan the QR code to visit it on your mobile device.</p>
        {/if}
        <!-- we will need to actually update the app first -->
        <!-- <p>
          Want to download the app? Click the button below!
          <a
            href="https://play.google.com/store/apps/details?id=app.notltimeline.twa&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
            ><img
              width="250"
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" /></a>
        </p> -->
        <p>
          The Niagara-on-the-Lake Timeline is a project created by several teams
          of undergraduate software developers from Brock University for the
          Niagara-on-the-Lake Museum.
          It is an interactive timeline that documents, teaches, and presents
          the rich history of Niagara-on-the-Lake, and other historical events &
          artefacts from the musuem's collection.
        </p>
        <p>
          This project was graciously funded by ... through the ... grant,
          and was supported by Brock University in partnership with
          Niagara-on-the-Lake Museum.
        </p>
        <div class="row">
          <img src='$lib/assets/brock.png' alt='Brock University Logo'
            width=1268 height=768
            style="width: 100%; height: auto; max-width: 25rem;"/>
        </div>
        <p>This project would also not be possible without the use of the following open source libraries:</p>
        <ul class='col-list'>
          {#each projects as project}
            <li>
              <b><a
                href={strip_end(strip_start(project.link, "git+"), ".git")}
                >{project.name}</a></b>
              —
              <a href={project.licenseLink}
                >{project.licenseType}</a>
            </li>
          {/each}
        </ul>
        <p style="font-size: var(--font-size-smallish);"><Copyright/></p>
      </div>
    </div>
  </section>
  <big-gap />
</PageTransition>

<style>
  .container {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    margin: auto;
    gap: 2rem;
  }

  .member-card {
    flex: 1 8rem;
    min-width: 8rem;
    background: var(--color-bg-1);
    padding: 1rem;
    text-align: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border-radius: 1.5rem;
    border: var(--border);
    justify-items: space-evenly;
  }

  .member-card .avatar {
    display: inline-block;
    align-self: center;
    width: 50%;
    aspect-ratio: 1;
    margin-bottom: 0px;
    z-index: 1;
    position: relative;
  }

  .member-card .avatar::before {
    content: "";
    width: 100%;
    height: 0;
    border-radius: 100%;
    background: var(--color-theme-2);
    position: absolute;
    bottom: 135%;
    right: 0;
    left: 0;
    opacity: 0.2;
    transform: scale(3);
    transition: all 0.3s var(--curve);
  }

  .member-card:hover .avatar::before {
    height: 8rem;
  }

  .member-card .avatar img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    transform: scale(1);
    transition: all 0.5s var(--curve);
  }

  .member-card:hover .avatar img {
    box-shadow: 0 0 0 14px var(--color-theme-2);
    transform: scale(0.9);
  }

  /* .member-card .team-content {
     margin-bottom: 4rem;
  } */

  .member-card .title {
    font-size: var(--font-size-base);
  }

  .member-card .role {
    display: block;
    font-size: var(--font-size-small);
  }

  .member-card .social {
    width: 100%;
    padding: 0;
    margin: 0;
    background: var(--color-theme-2);
    position: absolute;
    bottom: -100px;
    left: 0;
    transition: all 0.5s var(--curve);
  }

  .member-card:hover .social {
    bottom: 0;
  }

  .member-card .social li {
    display: inline-block;
  }

  .member-card .social li a {
    text-decoration: none;
    display: inline-flex;
    padding: 0.7rem;
    font-size: var(--font-size-small);
    color: #fff;
    transition: all 0.3s var(--curve);
  }

  h1 {
    text-align: center;
  }

  section {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    max-width: 90ch;
    margin: 0 auto;
  }

  section .row p {
    flex: 1 1 50%;
    text-align: justify;
    display: flex;
    align-items: center;
    flex-flow: column;
    margin-left: auto;
    margin-right: auto;
  }

  section p {
    text-align: justify;
  }

  .col-list {
    columns: auto 25ch;
    font-size: var(--font-size-smallish);
  }

  .col-list li {
    font-size: var(--font-size-smallish);
  }

  .row > * {
    flex: 1 1 50%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 30rem;
  }

  .row {
    gap: 3rem;
  }

  .fright {
    float: right; margin: 0.5em 0 0.5em 2em;
  }
  .fleft {
    float: left; margin: 0.5em 2em 0.5em 0;
  }

  .fclear { clear: both; }
</style>
