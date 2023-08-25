function generateTemporaryPasswordEmailTemplate(
  name: string,
  email: string,
  verificationLink: string,
  randomPassword: string
) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
        .img{
          width: 500px;
          height: auto;
          text-align: center;
        }
        
        .align-end{
          width: max-content;
          margin-left: auto;
        }

        .fw-bold{
          font-weight: bold;
        }

        .cta-button {
          display: inline-block;
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        </style>
      </head>
      <body>
        <div>
          <img class='img' src="https://img.freepik.com/free-photo/3d-render-secure-login-password-illustration_107791-16640.jpg?size=626&ext=jpg&ga=GA1.2.89321196.1688355984&semt=ais" alt="Task_Mng_System Email Verify Img" />
        </div>
        <div>
          <h2>Welcome ${name},</h2>
          <p>To complete your registration, please click the button below to verify your email address: ${email}</p>
            <a class="cta-button" href="${verificationLink}">Verify Email</a>
            <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
            <p>${verificationLink}</p>
            <p>Please note that your temporary password is: <strong>${randomPassword}</strong></p>
          <p>Please use this temporary password to log in to your account after verify your email. We recommend changing your password after logging in for security purposes.</p>
          <p>Have a great and productive day🚀!</p>
          <div class='align-end'>
            <p>Best regards,</p>
            <p class='fw-bold'>METATEAM MYANMAR</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export { generateTemporaryPasswordEmailTemplate };
