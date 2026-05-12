const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "alaminkhandj8899@gmail.com",
    pass: "qvbqmsbmlekyvory",
  },
});

let mailVerification = async(token)=>{
    try {
  const info = await transporter.sendMail({
    from: 'alaminkhandj8899@gmail.com', // sender address
    to: email, // list of recipients
    subject: "please verify your email", // subject line
   
    html: `<body style=margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif><table cellpadding=0 cellspacing=0 style="padding:40px 0"align=center width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 style=background:#fff;border-radius:10px;overflow:hidden width=600><tr><td align=center style=background:#16a34a;padding:30px><h1 style=color:#fff;margin:0>EcoBazar</h1><tr><td style="padding:40px 30px;color:#333"><h2 style=margin-top:0>Verify Your Email Address</h2><p style=font-size:16px;line-height:1.7>Helle User <p style=font-size:16px;line-height:1.7>Thank you for creating an account with <strong>EcoBazar</strong>.<p style=font-size:16px;line-height:1.7>Please click the button below to verify your email address and activate your account.<table cellpadding=0 cellspacing=0 style="margin:30px auto"align=center><tr><td align=center style=border-radius:6px bgcolor=#16a34a><a href="http://localhost:5173/verifyemail/${token}" style="display:inline-block;padding:14px 30px;color:#fff;text-decoration:none;font-size:16px;font-weight:700"target=_blank>Verify Email</a></table><p style=font-size:14px;color:#666;line-height:1.6>If the button doesn't work, copy and paste the link below into your browser:<p style=word-break:break-all;font-size:14px;color:#16a34a>http://localhost:5173/verifyemail/${token}<p style=font-size:14px;color:#666;margin-top:30px>If you did not create this account, you can safely ignore this email.<tr><td align=center style=background:#f0fdf4;padding:20px;color:#666;font-size:13px>© 2026 EcoBazar. All rights reserved.</table></table> `// HTML body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview URL is only available when using an Ethereal test account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
}
module.exports = {mailVerification }