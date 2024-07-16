import Twig from 'twig';
import alerts from './alerts';
import forgotPass from './forgotPass';
// import fs from 'fs';

// require.extensions['.twig'] = function (module, filename) {
// 	module.exports = fs.readFileSync(filename, 'utf8');
// };

// // @ts-ignore
// import en from './en/forgot-password.html.twig';
// // @ts-ignore
// import fr from './fr/forgot-password.html.twig';

/**
 * @todo keeping the twigfiles here due to build issues,
 * @todo: find a way to get the templates dir in build
*/    

export default {
  alerts,
  forgotPass,
};