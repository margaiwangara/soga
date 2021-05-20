export default function baseTemplate(children: string) {
  return /* html */ `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Soga | Reset Your Password</title>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style>
          :root {
            --teal: #1d4044;
            --gray: #edf2f7;
            --darkerGray: #a0aec0;
            --white: #ffffff;
          }
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
    
          body {
            width: 100%;
            font-family: "Poppins", Arial, Helvetica, sans-serif;
          }
    
          .table-wrapper {
            width: 100%;
            padding: 16px;
          }
    
          .main-table {
            width: 100%;
          }
    
          .logo {
            color: #1d4044;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 30px;
            padding: 2px 10px;
            text-align: center;
            background-color: #edf2f7;
            display: inline-block;
            border-radius: 5px;
          }
    
          .splitter {
            width: 100%;
            display: block;
            border: solid 1px #edf2f7;
            margin: 16px 0;
          }
    
          .content {
            text-align: center;
            line-height: 2;
          }
    
          .content p {
            font-size: 14px;
          }
    
          .content p span {
            display: block;
          }
    
          .text-link,
          .button-link {
            text-decoration: none;
          }
    
          .text-link:hover,
          .button-link:hover {
            opacity: 0.75;
          }
    
          .text-link {
            color: #1d4044;
            font-size: 16px;
          }
    
          .button-link {
            padding: 14px 10px;
            background-color: #1d4044;
            border-radius: 5px;
            min-width: 100px;
            color: #ffffff;
            font-weight: 400;
          }
    
          .user-action {
            padding: 16px 5px;
            margin: 8px 0;
          }
    
          .footer {
            text-align: center;
            padding: 0 8px 10px 8px;
          }
    
          .footer .copyright-text {
            font-size: 11px;
            color: #a0aec0;
            font-weight: 500;
            letter-spacing: 0.1px;
          }
          
          .salute {
              margin: 10px 0;
              color: #a0aec0;
              font-size: 20px;
            }
        </style>
      </head>
      <body>
        <div class="table-wrapper">
          <table class="main-table">
            <tbody>
              <tr>
                <td style="text-align: center;">
                  <h1 class="logo">
                    soga
                  </h1>
                </td>
              </tr>
              <tr>
                <td>
                  <span class="splitter"></span>
                </td>
              </tr>
              ${children}
              <tr>
                <td>
                  <span class="splitter"></span>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="footer">
                    <h6 class="copyright-text">
                      &copy; <span class="date">2021</span> Soga. All Rights
                      Reserved.
                    </h6>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;
}
