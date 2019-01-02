const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (!process.env.SENDGRID_API_KEY || !process.env.HOME_URL) {
  throw new Error("Set SENDGRID_API_KEY and HOME_URL.");
}

function sendKehuToUnkownUser(receiverEmail, senderName, claimId) {
  const msg = {
    to: receiverEmail,
    from: "Kehu <noreply@kehu.com>",
    templateId: "d-82394d2e4522413ca8a8b566c0080cbe",
    dynamic_template_data: {
      claim_url: `${process.env.HOME_URL}/kehut/lisaa/${claimId}`,
      sender_name: senderName,
      service_url: process.env.HOME_URL
    }
  };
  sgMail.send(msg);
}

function sendKehuToKnownUser(receiverEmail, receiverName) {
  const msg = {
    to: receiverEmail,
    from: "Kehu <noreply@kehu.com>",
    templateId: "d-e5d654bc8c22490b9ad7a78f52d2efb8",
    dynamic_template_data: {
      first_name: receiverName,
      service_url: process.env.HOME_URL
    }
  };
  sgMail.send(msg);
}

module.exports = {
  sendKehuToKnownUser,
  sendKehuToUnkownUser
};
