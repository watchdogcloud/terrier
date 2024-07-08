import { Application } from '../declarations';
import users from './users/users.service';
import keys from './keys/keys.service';
import otp from './otp/otp.service';
import sendOtp from './send-otp/send-otp.service';
import keysGenerate from './keys/generate/generate.service';
import version from './version/version.service';
import projects from './projects/projects.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(keys);
  app.configure(otp);
  app.configure(sendOtp);
  app.configure(keysGenerate);
  app.configure(version);
  app.configure(projects);
}
