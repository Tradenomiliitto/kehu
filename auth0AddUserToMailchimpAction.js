const axios = require("axios");

const BASE_URL = "https://us16.api.mailchimp.com/3.0";
const LIST_ID = "30c4f35bc7";

/**
 * Handler that will be called during the execution of a PostUserRegistration flow.
 *
 * @param {Event} event - Details about the context and user that has registered.
 */
exports.onExecutePostUserRegistration = async (event) => {
  const auth = {
    username: "kehu",
    password: event.secrets.MAILCHIMP_APIKEY,
  };

  const { user } = event;

  // Don't add signups from tests to mail list
  if (user.email?.startsWith("nightwatch")) return;

  console.log(`Adding ${user.email} to Mailchimp`);

  try {
    const res = await axios.post(
      `${BASE_URL}/lists/${LIST_ID}/members`,
      {
        email_address: user.email,
        status: "subscribed",
        // On the contrary to API docs ISO string is not accepted
        timestamp_signup: new Date()
          .toISOString()
          .replace("T", " ")
          .substring(0, 19),
      },
      { auth }
    );

    console.log(`User ${user.email} added to Mailchimp`);
    console.log(res?.data);
  } catch (err) {
    console.log("Error when adding user to Mailchimp: " + err.message);
    console.log(err?.response?.data);
  }
};
