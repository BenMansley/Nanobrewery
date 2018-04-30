const sendgridMail = require("@sendgrid/mail");
const fs = require("fs");

function verify(name, email, token) {
  sendgridMail.setApiKey(process.env.SENDGRID_KEY);

  let template = fs.readFileSync(`${__dirname}/templates/verify.html`, { encoding: "UTF-8" }).slice();
  const link = "http://localhost:3000/verify?t=" + token;
  template = template.slice(0);
  template = template.replace("{{name}}", name);
  template = template.replace("{{link}}", link);

  const msg = {
    to: email,
    from: "noreply@nanobrewery.com",
    subject: "Verify Your Nanobrewery Account",
    html: template
  };

  return new Promise((resolve, reject) => {
    sendgridMail.send(msg, false)
      .then(_ => resolve())
      .catch(err => reject(err.toString()));
  });
}

function reset(name, email, exists, token) {
  sendgridMail.setApiKey(process.env.SENDGRID_KEY);
  let template;

  if (exists) {
    template = fs.readFileSync(`${__dirname}/templates/reset-exists.html`, { encoding: "UTF-8" });
    const link = "http://localhost:3000/authentication/password-reset?t=" + token;
    template = template.slice(0);
    template = template.replace("{{name}}", name);
    template = template.replace("{{link}}", link);
  } else {
    template = fs.readFileSync(`${__dirname}/templates/reset-not-exists.html`, { encoding: "UTF-8" });
    template = template.slice(0);
    template = template.replace("{{email}}", email);
  }

  const msg = {
    to: email,
    from: "noreply@nanobrewery.com",
    subject: "Reset Your Nanobrewery Password",
    html: template
  };

  return new Promise((resolve, reject) => {
    sendgridMail.send(msg, false)
      .then(_ => resolve())
      .catch(err => reject(err.toString()));
  });
}

module.exports = {
  verify,
  reset
};
