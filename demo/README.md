# MFCHF Demo

This is a demo of the multi-factor credential hashing function (MFCHF), which incorporates HOTP into the password hash to improve resistance to brute-force attacks (mfchf-pbkdf2-hotp6). It features support for account recovery if either factor is lost, as well as support for an HOTP window and factor persistence.

 The frontend uses React.js and is hosted using Cloudflare Pages, with the backend using Cloudflare Workers. You can access important sections of the source code using the following links:

- Frontend: /src
- Backend:
  - Register: /functions/api/register.js
  - Login: /functions/api/login.js
  - Password Recovery: /functions/api/recoverPassword.js
  - HOTP Recovery: /functions/api/recoverHOTP.js
