import nodemailer from 'nodemailer';

const emailRegister = async (data) => {
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
        subject: "Check your APV account",
        text: "Check your APV account",
        html: `<p>Hi ${name}, check your APV account.</p>
                <p>Your account is ready, you just have to verify it in the following link:
                <a href="${process.env.FRONTEND_URL}/confirm/${token}"> check account</a> </p>
                
                <p>If you did not create this account, you can ignore this message`,
      });

      console.log("Message sent: %s", info.messageId)
      
};

export default emailRegister;