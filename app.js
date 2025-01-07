(function () {
  "use strict";

  //@ts-ignore
  document
    .querySelector("[name=signup]")
    .addEventListener("submit", function (event) {
      /** @type {HTMLFormElement} */
      //@ts-ignore
      let target = event.target;

      event.preventDefault();
      document.querySelector("button")?.setAttribute("disabled", "disabled");
      document.querySelector(".signup-msg")?.remove();

      /** @type {HTMLFormElement} */ //@ts-expect-error
      let $email = document.querySelector("[type='email']");
      let email = $email.value || "";
      email = email.trim();
      email = email.toLowerCase();

      /** @type {HTMLFormElement} */ //@ts-expect-error
      let $csrfToken = document.querySelector("[name='csrf-token']");
      let csrfToken = $csrfToken.value || "";

      let host = location.host || "localhost";
      if ("localhost" !== host) {
        host = `api.${host}`;
      }

      let url = `https://${host}/api/request-invite`;
      let request = { email: email, "csrf-token": csrfToken };
      let body = JSON.stringify(request, null, 2);

      let p;
      let yes = window.confirm(
        `Thanks, we'll send an automated message to confirm your email address.`,
      );
      if (yes) {
        p = window
          .fetch(url, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body,
          })
          .then(mustOk);
      } else {
        p = Promise.resolve();
      }
      p.then(showSuccess).catch(showFailure);

      /**
       * @param {string} msg
       * @param {string} [cls]
       */
      function msgHtml(msg, cls = "") {
        return `<h3 class="${["signup-msg", cls].join(" ")}">${msg}</h3>`;
      }

      async function showSuccess() {
        //let msg = `You're good to go and should receive a confirmation email shortly.`;
        let msg = `You're good to go. We'll reach out shortly.`;
        target.querySelector("fieldset")?.setAttribute("disabled", "disabled");
        target.insertAdjacentHTML("beforeend", msgHtml(msg, "good"));
      }

      /** @param {Error} err */
      async function showFailure(err) {
        console.error(`Failed to send request for invite`);
        console.error(err);

        let email = "bnnadotnet@therootcompany.com";
        let msg = `Whoops, looks like something went wrong.<br/>
          Email <a href="mailto:${email}">${email}</a> instead.`;
        target.insertAdjacentHTML("beforeend", msgHtml(msg, "warn"));
      }
    });

  /** @param {Response} resp */
  async function mustOk(resp) {
    let body = await resp.text();
    let result;

    try {
      result = JSON.parse(body);
    } catch (e) {
      //@ts-ignore
      e.code = "E_PARSE";
      //@ts-ignore
      e.body = body;
      //@ts-ignore
      e.response = resp;
      throw e;
    }

    if (!resp.ok) {
      let err = new Error(`did not get 200 OK`);
      //@ts-ignore
      err.code = "E_NOT_OK";
      //@ts-ignore
      err.result = result;
      //@ts-ignore
      err.response = resp;
      throw err;
    }
  }
})();
