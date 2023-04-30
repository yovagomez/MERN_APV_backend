import nodemailer from 'nodemailer';

const emailForgetPassword = async (data) => {
    // Credential creation
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const { email, name, token } = data;

      // Send email
      const info = await transporter.sendMail({
        from: "APV - Vet patients manager",
        to: email,
        subject: "Reset your password",
        text: "Reset your password",
        html: `<p>Hi ${name}, you have requested reset your password.</p>
                <p>Follow the link below to generate a new password
                <a href="${process.env.FRONTEND_URL}/forget-password/${token}"> reset password</a> </p>
                
                <p>If you did not create this account, you can ignore this message`,
      });

      console.log("Message sent: %s", info.messageId)
      
};

export default emailForgetPassword;