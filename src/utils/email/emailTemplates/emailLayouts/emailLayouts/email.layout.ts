export const getEmailLayout = (
    header: string,
    title: string,
    body: string,
): string => {
    return `
      <!doctype html>
      <html lang="en">
  
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Poppins',Arial, sans-serif;
              background-color: #1c1c1c;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #1c1c1c;
              padding-left: 20px;
              padding-right: 20px;
            }
            .header,
            .footer {
              text-align: center;
              padding: 20px;
              color: white;
            }
            .header {
              background-color: #1c1c1c;
            }
            .body {
              padding: 40px;
              background-color: #1c1c1c;
              color: white;
            }
              @media only screen and (max-width: 600px) {
              .body {
                padding: 20px;
              }
            }
            .profile-img {
              border-radius: 50%;
              width: 80px;
              height: 80px;
            }
            .main-image {
              width: 100%;
              height: auto;
              margin: 20px 0;
            }
            .credentials {
              text-align: center;
              margin-top: 20px;
              color: white;
              margin:20px;
              padding-right: 40px;
              padding-left: 40px;
              font-size: 14px;
            }
            .credentials p {
              margin: 10px 0;
            }
            .app-buttons {
              margin-top: 20px;
              text-align: center;
            }
            .app-buttons img {
              margin: 0 10px;
              width: 120px;
            }
            .title {
              text-align: center;
            }
  
            .divider{
              margin-top: 20px;
              margin-bottom: 20px;
              height: 0.7px;
              margin-left: 70px;
              margin-right: 70px;
            }
            h1,
            h2,
            h3 {
              margin: 10px 0;
            }
            h2 {
              color: white;
            }
          </style>
        </head>
        
        <body>
          <table class="container" cellpadding="0" cellspacing="0">
          
            <!-- Header Section -->
            <tr class="header">
              <td style="padding-top:56px;">
                ${header}
                <p>Welcome to the Phlex City.</p>
              </td>
            </tr>
        
            <!-- Body Section -->
            <tr class="body">
              <td>
                // <img
                //   src="https://phlexit-dev.s3.amazonaws.com/banner-3.png"
                //   alt="Main Image"
                //   class="main-image"
                // />
                <div class="title">
                  <h2>${title}</h2>
                </div>
  
                ${body}
  
                <hr class="divider">
                // <div class="title">
                //   <h3 style="font-weight: 500;">Get My Phlex IT App</h3>
                // </div>
        
                // <p class="title">
                //   Get the most of My Phlex IT app by installing the mobile app.
                // </p>
        
                // <hr class="divider">
                // <div class="app-buttons">
                //   <a href="https://play.google.com/store/apps/details?id=com.phlex.partners" target="_blank" rel="noopener noreferrer">
                //     <img
                //       src="https://phlexit-dev.s3.amazonaws.com/GooglePlaystore.png"
                //       alt="Google Play"
                //     />
                //   </a>
                // </div>
              </td>
            </tr>
        
  
            <tr class="footer">
              <td>
                <p>Cospace!</p>
                <p>&copy; 2024 Cospace. All Rights Reserved.</p>
              </td>
            </tr>
          </table>
        </body>
  
      </html>
    `;
};

export const getEmailHeader = (name: string): string => {
    return `
        <h1>Hi ${name},</h1>
     `;
};
