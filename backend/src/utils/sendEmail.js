const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        let transporter;

        // Use real SMTP if configured
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || "smtp.gmail.com",
                port: process.env.EMAIL_PORT || 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
        } else {
            // Fallback for development/testing: Ethereal Email
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user, 
                    pass: testAccount.pass, 
                },
            });
            console.log("Using Ethereal test account for sending emails.");
        }

        const mailOptions = {
            from: "PropFlow Support <support@propflow.com>",
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);

        if (!process.env.EMAIL_USER) {
            console.log("Email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;
