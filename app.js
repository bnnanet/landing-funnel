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

      /** @type {HTMLFormElement} */
      //@ts-ignore
      let $email = document.querySelector("[type='email']");
      let email = $email?.value || "";
      email = email.trim();
      email = email.toLowerCase();

      let host = location.host || "localhost";
      if ("localhost" !== host) {
        host = `api.${host}`;
      }

      let url = `https://${host}/api/request-invite`;
      let request = { email };
      let body = JSON.stringify(request, null, 2);

      window
        .fetch(url, {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body,
        })
        .then(mustOk)
        .then(showSuccess)
        .catch(showFailure);

      async function showSuccess() {
        //let msg = `You're good to go and should receive a confirmation email shortly.`;
        let msg = `You're good to go. We'll reach out shortly.`;
        let msgHtml = `<h3 class="signup-msg good">${msg}</h3>`;
        target.querySelector("fieldset")?.setAttribute("disabled", "disabled");
        target.insertAdjacentHTML("beforeend", msgHtml);
      }

      /** @param {Error} err */
      async function showFailure(err) {
        console.error(`Failed to send request for invite`);
        console.error(err);

        let msgHtml = `<h3 class="signup-msg warn">Whoops, looks like something went wrong. <br/>Email <a href="mailto:bnnadotnet@therootcompany.com">bnnadotnet@therootcompany.com</a> instead.</h3>`;
        target.insertAdjacentHTML("beforeend", msgHtml);
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
