<script lang="ts">
  import PageTransitionFly from "$lib/components/PageTransitionFly.svelte";
</script>


<PageTransitionFly>
  <section class=page>
    <h1>Privacy Policy</h1>

    <p>Last updated: January 2nd, 2024</p>

    <p>
      This Privacy Policy explains how "We" (Niagara-on-the-Lake Museum employees and contractors) handle "Your" (the User) personal information when You use Our Niagara-on-the-Lake Interactive
      Timeline Application ("the Application").
    </p>

    <h2>Website Logs</h2>
    <p>
      The Application collects standard website logs that records IP addresses, web browser details, and page request information when You nagivate and use the Application.

      We use this information for the sole purposes of: preventing abuse, monitoring the stability and performance of the Application, and generating general statistics about the web browsers that use the Application.

      Information collected this way is retained for at most 31 days; it is automatically erased by standard log rotation.

      We do not share this information with any third parties, except as required by law.
    </p>


    <h2>Invite-Only Access</h2>
    <p>
      Access to certain features of the Application, including (but not limited to) signing in and account access, is
      available on an Invite-Only Access basis for Our staff and administrators.
    </p>

    <p>
      The Application stores email addresses and authentication data required to verify user identity.
      We use this information to verify user identity to grant You access to these Invite-Only Access features.
      We do not share this information with any third parties, except as required by law.
      This information is retained as long as You have an active account with us, except as required by law.
    </p>


    <h2>Security</h2>
    <p>
      We take reasonable measures to protect the security of the information that is collected by the Application. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee the absolute security of your information.
    </p>


    <h2>Changes to This Privacy Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. We will notify you of
      any changes by posting the new Privacy Policy on this page and updating the
      "Last updated" date at the top of this policy. You are advised to review
      this Privacy Policy periodically for any changes.
    </p>

    <h2>Other Terms</h2>
    All personal information collected above is stored on servers managed by Lunanode. The <a href="https://www.lunanode.com/data_privacy_agreement.pdf">Lunanode Data Privacy Agreement</a> applies to all personal information stored by Lunanode.

    <h2>Contact Us</h2>
    <p>
      If you have any questions about this Privacy Policy, please contact us by
      email at <a href="mailto:contact@nhsm.ca">contact@nhsm.ca</a>.
    </p>
  </section>
</PageTransitionFly>


<style>
  section {
    max-width: 50rem;
    margin: 0 auto;
    padding: 2rem;
    background: var(--color-bg-1);
    border-radius:1rem;
    border:var(--border);
  }

  @media (max-width: 1000px) {
    section {
      margin: 0 -3rem;
    }
  }

  p {
    font-size: var(--font-size-small);
  }


</style>
