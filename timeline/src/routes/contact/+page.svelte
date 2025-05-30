<script lang="ts">
  import { type PostgrestError } from "@supabase/supabase-js";
  import { toast } from "@zerodevx/svelte-toast";
  import supabase from "$lib/supabaseClient";

  import Button from "$lib/components/Button.svelte";
  import PageTransition from "$lib/components/PageTransitionFly.svelte";
  import Socials from "$lib/components/Socials.svelte";

  import { validatePhone, validateEmail } from "$lib/utils";

  export let inquiry = {
    name: "",
    phone: "",
    email: "",
    type: "",
    message: "",
  };

  const submitInquiry = async () => {
    if (
      Object.values(inquiry).every(
        (value, index) => value.length != 0 || index === 1 || index === 2
      )
    ) {
      if (!validateEmail(inquiry.email)) {
        toast.push("<b>Error</b><br>Please enter a valid email address.");
        return;
      }
      if (!validatePhone(inquiry.phone)) {
        toast.push("<b>Error</b><br>Please enter a valid phone number.");
        return;
      }
      try {
        const { data, error } = await supabase.from("inquiries").insert([
          {
            submitter_name: inquiry.name,
            phone: inquiry.phone,
            email: inquiry.email,
            inquiry_type: inquiry.type,
            message: inquiry.message,
          },
        ]);
        // RESET FORM FIELDS
        inquiry.name = "";
        inquiry.phone = "";
        inquiry.email = "";
        inquiry.type = "";
        inquiry.message = "";

        if (error) {
          throw error;
        }
        toast.push("<b>Inquiry Submitted</b>");
      } catch (error) {
        toast.push(`<b>Query Error</b><br>${(error as PostgrestError).message}`);
      }
    } else {
      toast.push(
        "<b>Error</b><br>Please fill out all fields before submitting."
      );
    }
  };
</script>

<svelte:head>
  <title>Contact | Niagara-on-the-Lake Timeline</title>
  <meta name="description" content="Contact page" />
</svelte:head>

<PageTransition>
  <section>
    <h1 class="title">Contact Us</h1>

    <div class="container">
      <div class="embedded-map">
        <iframe
          title="Map of Niagara-on-the-Lake Museum"
          loading="lazy"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11623.863995681377!2d-79.0716183!3d43.2521344!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf975dbf3ff67d6c0!2sNiagara-on-the-Lake%20Museum!5e0!3m2!1sen!2sca!4v1614106500408!5m2!1sen!2sca"
          style="border:0;"
          width="600"
          height="450" />


          <hr >

        <!-- ADDRESS -->
        <div class="address-container">
          <div class="contact-flex-item">
            <span
              ><span class="material-symbols-rounded i">location_on</span
              >&nbsp;&nbsp;Address</span>
            <p>
              43 Castlereagh Street<br />
              PO Box 208<br />
              Niagara-on-the-Lake, ON<br />
              L0S 1J0<br />
              Canada<br />
            </p>
          </div>

          <!-- CONTACT INFO -->
          <div class="contact-flex-item">
            <table>
              <tr>
                <td
                  ><span class="material-symbols-rounded i">phone</span
                  >&nbsp;&nbsp;Phone</td>
                <td><a href="tel:9054683912">(905) 468-3912</a></td>
              </tr>
              <tr>
                <td
                  ><span class="material-symbols-rounded i">fax</span
                  >&nbsp;&nbsp;Fax</td>
                <td><a href="tel:9054681728">(905) 468-1728</a></td>
              </tr>
              <tr>
                <td
                  ><span class="material-symbols-rounded i">email</span
                  >&nbsp;&nbsp;Email</td>
                <td><a href="mailto:contact@nhsm.ca">contact@nhsm.ca</a></td>
              </tr>
              <tr class="socials-row">
                <td
                  ><span class="material-symbols-rounded i">thumb_up</span
                  >&nbsp;&nbsp;Socials</td>
                <td>
                  <Socials />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

      <div class="form-container">
        <h2 id="inquiry-title">We'd love to hear from you:</h2>
        <div class="row">
          <form class="notify" id="inquiry-form">
            <input
              id="name"
              class="text required"
              placeholder="Name"
              type="text"
              bind:value={inquiry.name} />
            <input
              id="phone"
              placeholder="Phone"
              type="text"
              maxlength="10"
              bind:value={inquiry.phone} />
            <input
              id="email"
              class="text required"
              placeholder="Email"
              type="text"
              bind:value={inquiry.email} />
            <select id="type" bind:value={inquiry.type}>
              <option value="" disabled selected>Select an inquiry type</option>
              <option value="About the timeline">About the timeline</option>
              <option value="About the museum">About the museum</option>
              <option value="About the project"
                >About Niagara-on-the-Lake</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              id="message"
              placeholder="Message"
              bind:value={inquiry.message} />
            <div id="submit-btn">
              <Button alt on:click={submitInquiry}>Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</PageTransition>

<style>
  * {
    box-sizing: border-box;
  }

  hr {
    margin: 1rem 0;
    border: none;
    border-bottom: var(--border);
  }

  .title {
    text-align: center;
  }

  iframe {
    width: 100%;
    border-radius: 1rem;
    border: var(--border);
  }

  #inquiry-title {
    text-transform: uppercase;
  }

  .container {
    margin-top: 2rem;
    display: flex;
    flex-flow: row wrap;
    align-content: center;
    gap: 2rem;
  }

  .embedded-map {
    flex: 1;
  }

  .contact-flex-item {
    display: flex;
    flex: 1;
    flex-flow: column;
  }

  input,
  select {
    flex: 1 1 33%;
    width: 100%;
  }

  @media (max-width: 768px) {
    input,
    select {
      flex: 1 1 100%;
    }
  }

  textarea {
    flex: 1 1 100%;
    width: 100%;
    min-height: 7rem;
    height: 14rem;
    max-height: 20rem;
    resize: vertical;
  }

  .form-container {
    flex: 1;
    height: 100%;
    padding: 1rem;
    margin: 0;
    text-align: center;
    background: var(--color-bg-1);
    border-radius: 1rem;
    border: var(--border);
  }

  .notify {
    flex: 1 1 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    gap: 1rem;
  }

  .socials-row {
    vertical-align: middle;
  }

  .address-container {
    padding: 1rem;
    display: flex;
    font-size: var(--font-size-small);
    flex-flow: row wrap;
    align-items: baseline;
  }
</style>
