const sgMail = require("@sendgrid/mail");
const moment = require("moment");
const Kehu = require("../models/Kehu");
const logger = require("../logger");

if (process.env.SENDGRID_API_KEY)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (!process.env.HOME_URL) {
  throw new Error("Set SENDGRID_API_KEY and HOME_URL.");
}

async function sendEmailToUnkownUser(receiver, claim_id, kehu_id, t) {
  const kehu = await getKehu(kehu_id, t);
  const msg = {
    to: receiver.receiver_email,
    from: "Kehu <noreply@mykehu.fi>",
    templateId: "d-82394d2e4522413ca8a8b566c0080cbe",
    dynamic_template_data: {
      claim_url: `${process.env.HOME_URL}/kehut/lisaa/${claim_id}`,
      date_given: moment(kehu.date_given).format("D.M.YYYY"),
      first_name: receiver.receiver_name,
      kehu_url: `${process.env.HOME_URL}/kehut/`,
      root_url: process.env.HOME_URL,
      sender: await getSender(kehu),
      situations: getItems(kehu.situations),
      tags: getItems(kehu.tags),
      text: kehu.text,
    },
  };
  await sendEmailUsingSendgrid(msg);
}

async function sendEmailToKnownUser(user, kehu_id, t) {
  const kehu = await getKehu(kehu_id, t);
  const msg = {
    to: user.email,
    from: "Kehu <noreply@mykehu.fi>",
    templateId: "d-e5d654bc8c22490b9ad7a78f52d2efb8",
    dynamic_template_data: {
      date_given: moment(kehu.date_given).format("D.M.YYYY"),
      first_name: user.first_name,
      kehu_url: `${process.env.HOME_URL}/kehut/`,
      root_url: process.env.HOME_URL,
      sender: await getSender(kehu),
      situations: getItems(kehu.situations),
      tags: getItems(kehu.tags),
      text: kehu.text,
    },
  };
  await sendEmailUsingSendgrid(msg);
}

async function sendInvitationEmail({ email, firstName, groupName, type }) {
  const TEMPLATE_IDS = {
    KNOWN_USER: "d-2cf0ce5cb9f64fe6a62384dee9848201",
    UNKNOWN_USER: "d-4b7f6c97bd7145729af930e1aa745418",
  };
  const templateId = TEMPLATE_IDS[type];

  if (!templateId) {
    throw new Error("Invalid type: " + type);
  }

  const msg = {
    to: email,
    from: "Kehu <noreply@mykehu.fi>",
    templateId,
    dynamic_template_data: {
      first_name: firstName,
      kehu_url: process.env.HOME_URL,
      root_url: process.env.HOME_URL,
      group_name: groupName,
    },
  };
  await sendEmailUsingSendgrid(msg);
}

async function sendEmailUsingSendgrid(msg) {
  if (!process.env.SENDGRID_API_KEY) {
    logger.warn("SendGrid API key not set, unable to send email to " + msg.to);
    return;
  }

  logger.info("Sending email to " + msg.to);
  try {
    await sgMail.send(msg);
  } catch (err) {
    logger.error("Error sending email to " + msg.to, err);
  }
}

async function getKehu(kehu_id, t) {
  return await Kehu.query()
    .context({ t })
    .findById(kehu_id)
    .withGraphFetched("[role, situations, tags]")
    .first();
}

function getItems(items) {
  if (items && items.length) {
    return items.map((it) => it.text).join(", ");
  }
  return "";
}

async function getSender(kehu) {
  if (kehu.role && kehu.role.role) {
    return `${kehu.giver_name}, ${kehu.role.role}`;
  }
  return kehu.giver_name;
}

module.exports = {
  sendEmailToKnownUser,
  sendEmailToUnkownUser,
  sendInvitationEmail,
};
