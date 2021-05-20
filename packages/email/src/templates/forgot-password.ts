import baseTemplate from './base';
import { env as baseEnv } from '@soga/shared';

export default function forgotPasswordTemplate(name: string, token: string) {
  const path = `${baseEnv.CLIENT_URL}/${baseEnv.RESET_PASSWORD_PATH}/${token}`;

  return /* html */ `
        ${baseTemplate(/* html */ `
          <tr>
            <td>
              <div class="content">
                <p class="salute">Hello, ${name}</p>
                <p class="content-text-normal">
                  You are receiving this email because you requested to change
                  your password. To change your password, click on the button
                  below or copy the link below and open it in your browser.
                  <span>
                    <a href="${path}" class="text-link">${path}</a>
                  </span>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <div class="user-action">
                <a href="${path}" class="button-link">Reset Password</a>
              </div>
            </td>
          </tr>
        `)}
  `;
}
