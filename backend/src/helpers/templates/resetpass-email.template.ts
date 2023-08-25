function generateResetPasswordTemplate(name: string, email: string, reset_link: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
        .img{
          width: 450px;
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
        </style>
      </head>
      <body>
        <div>
          <img class='img' src="https://img.freepik.com/free-photo/3d-mobile-phone-with-security-code-padlock_107791-16180.jpg?size=626&ext=jpg&ga=GA1.2.89321196.1688355984&semt=ais" alt="Task_Mng_System Reset Password Img" />
        </div>
        <div>
          <h2>Dear ${name},</h2>
          <p>Your email: ${email}</p>
          <p>Click the following link to reset your password:</p>
          <a href="${reset_link}">Your Reset Password Link</a>
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

export { generateResetPasswordTemplate };
