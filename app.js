(function () {
  "use strict";

  let formSuccess = false;

  //@ts-ignore
  document
    .querySelector("[name=signup]")
    .addEventListener("submit", function (event) {
      /** @type {HTMLFormElement} */
      //@ts-ignore
      let target = event.target;

      event.preventDefault();
      document.querySelector(".signup-msg")?.remove();

      console.log("do something on form submit", formSuccess);

      let msg = `<h3 class="signup-msg warn">Whoops, looks like something went wrong</h3>`;

      if (formSuccess) {
        msg = `<h3 class="signup-msg good">You're good to go and should receive a confirmation email shortly.</h3>`;
        target.querySelector("fieldset")?.setAttribute("disabled", "disabled");
      }

      target.insertAdjacentHTML("beforeend", msg);

      formSuccess = !formSuccess;
    });
})();
