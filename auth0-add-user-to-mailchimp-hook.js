/**
Auth0 post-registration hook to add user to Mailchimp email list
Hooks are modified from https://manage.auth0.com/dashboard/eu/kehu/hooks

@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
module.exports = function(user, context, cb) {
  const axios = require("axios");

  const BASE_URL = "https://us16.api.mailchimp.com/3.0";
  const LIST_ID = "30c4f35bc7";

  const auth = {
    username: "kehu",
    password: context.webtask.secrets.MAILCHIMP_APIKEY
  };

  console.log(`Adding ${user.email} to Mailchimp`);

  axios
    .post(
      `${BASE_URL}/lists/${LIST_ID}/members`,
      {
        email_address: user.email,
        status: "subscribed"
      },
      { auth }
    )
    .then(res => {
      console.log(`User ${user.email} added to Mailchimp`);
      console.log((res || {}).data);
    })
    .catch(err => {
      console.log("Error when adding user to Mailchimp: " + err.message);
      console.log(((err || {}).response || {}).data);
    });
  cb();
};

// HOOK ENDS HERE
// Underneath is the request used to create the mail list where the users are
// added. Response for the request also included to save the information

// POST /lists
// JSON-body:
const body = {
  name: "KEHU-sivuston käyttäjät",
  contact: {
    company: "Tradenomiliitto TRAL",
    address1: "Ratavartijankatu 2",
    address2: "",
    city: "Helsinki",
    state: "",
    zip: "00520",
    country: "FI",
    phone: ""
  },
  permission_reminder:
    "Saat tämän viestin, sillä olet rekisteröitynyt KEHU-verkkopalveluun.",
  campaign_defaults: {
    from_name: "Tradenomiliitto TRAL",
    from_email: "tiedotus@tral.fi",
    subject: "",
    language: "en"
  },
  email_type_option: false
};

// Response
const response = {
  id: "30c4f35bc7",
  web_id: 180840,
  name: "KEHU-sivuston käyttäjät",
  contact: {
    company: "Tradenomiliitto TRAL",
    address1: "Ratavartijankatu 2",
    address2: "",
    city: "Helsinki",
    state: "",
    zip: "00520",
    country: "FI",
    phone: ""
  },
  permission_reminder:
    "Saat tämän viestin, sillä olet rekisteröitynyt KEHU-verkkopalveluun.",
  use_archive_bar: true,
  campaign_defaults: {
    from_name: "Tradenomiliitto TRAL",
    from_email: "tiedotus@tral.fi",
    subject: "",
    language: "en"
  },
  notify_on_subscribe: "",
  notify_on_unsubscribe: "",
  date_created: "2020-04-16T10:28:35+00:00",
  list_rating: 0,
  email_type_option: false,
  subscribe_url_short: "http://eepurl.com/gZ4Rcz",
  subscribe_url_long:
    "https://tradenomi.us16.list-manage.com/subscribe?u=5a75cb3098d9512cf2a8c4b53&id=30c4f35bc7",
  beamer_address: "us16-8bd95a3f63-ea08dcc022@inbound.mailchimp.com",
  visibility: "pub",
  double_optin: false,
  has_welcome: false,
  marketing_permissions: false,
  modules: [],
  stats: {
    member_count: 0,
    unsubscribe_count: 0,
    cleaned_count: 0,
    member_count_since_send: 0,
    unsubscribe_count_since_send: 0,
    cleaned_count_since_send: 0,
    campaign_count: 0,
    campaign_last_sent: "",
    merge_field_count: 4,
    avg_sub_rate: 0,
    avg_unsub_rate: 0,
    target_sub_rate: 0,
    open_rate: 0,
    click_rate: 0,
    last_sub_date: "",
    last_unsub_date: ""
  },
  _links: [
    {
      rel: "self",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Response.json"
    },
    {
      rel: "parent",
      href: "https://us16.api.mailchimp.com/3.0/lists",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists.json"
    },
    {
      rel: "update",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7",
      method: "PATCH",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Response.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/PATCH.json"
    },
    {
      rel: "batch-sub-unsub-members",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7",
      method: "POST",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/BatchPOST-Response.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/BatchPOST.json"
    },
    {
      rel: "delete",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7",
      method: "DELETE"
    },
    {
      rel: "abuse-reports",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/abuse-reports",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Abuse/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Abuse.json"
    },
    {
      rel: "activity",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/activity",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Activity/Response.json"
    },
    {
      rel: "clients",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/clients",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Clients/Response.json"
    },
    {
      rel: "growth-history",
      href:
        "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/growth-history",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Growth/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Growth.json"
    },
    {
      rel: "interest-categories",
      href:
        "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/interest-categories",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/InterestCategories/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/InterestCategories.json"
    },
    {
      rel: "members",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/members",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Members/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Members.json"
    },
    {
      rel: "merge-fields",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/merge-fields",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/MergeFields/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/MergeFields.json"
    },
    {
      rel: "segments",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/segments",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Segments/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Segments.json"
    },
    {
      rel: "webhooks",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/webhooks",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Webhooks/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Webhooks.json"
    },
    {
      rel: "signup-forms",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/signup-forms",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/SignupForms/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/SignupForms.json"
    },
    {
      rel: "locations",
      href: "https://us16.api.mailchimp.com/3.0/lists/30c4f35bc7/locations",
      method: "GET",
      targetSchema:
        "https://us16.api.mailchimp.com/schema/3.0/Definitions/Lists/Locations/CollectionResponse.json",
      schema:
        "https://us16.api.mailchimp.com/schema/3.0/CollectionLinks/Lists/Locations.json"
    }
  ]
};
