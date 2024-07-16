import Twig from 'twig';
import LocaleEnum from '../../constants/locales-support';
// import fs from 'fs';

// require.extensions['.twig'] = function (module, filename) {
// 	module.exports = fs.readFileSync(filename, 'utf8');
// };

// // @ts-ignore
// import en from './en/forgot-password.html.twig';

/**
 * @todo keeping the twigfiles here due to build issues,
 * @todo: find a way to get the templates dir in build
*/    

const en = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Alert Notification</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #111;
            margin: 0;
            padding: 0;
            color: #fff;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #1a1a1a;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .header {
            background-color: #000;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 0 0 15px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #888;
        }
        .button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WatchdogCloud Alert</h1>
        </div>
        <div class="content">
            <p>Dear recipient,</p>
            <p>This is to notify you that the <strong>{{ component }}</strong> has exceeded the defined threshold.</p>
            <p><strong>Alert Type:</strong> {{ alertType }}</p>
            <p><strong>Component:</strong> {{ component }}</p>
            <p><strong>Value:</strong> {{ cumulativeOrSpikeVal }}</p>
            <p><strong>Threshold:</strong> {{ threshold }}</p>
            <p><strong>Incident Time:</strong> {{ incidentTime }}</p>
            <p>Please take the necessary actions to resolve this issue.</p>
            <p>Sent from WatchdogCloud.</p>
            <a href="https://your-action-link.com" class="button">Take Action</a>
        </div>
        <div class="footer">
            <p>&copy; {{ "now"|date("Y") }} WatchdogCloud - A Free Software.</p>
        </div>
    </div>
</body>
</html>`;


export default {
  [LocaleEnum.EN]: Twig.twig({
    data: en,
  }),
  // more locales... 
};