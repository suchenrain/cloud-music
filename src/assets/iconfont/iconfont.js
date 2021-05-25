import { createGlobalStyle } from 'styled-components';

export const IconStyle = createGlobalStyle`
@font-face {
  font-family: "iconfont"; /* Project id 2570925 */
  src: url('iconfont.eot?t=1621941483240'); /* IE9 */
  src: url('iconfont.eot?t=1621941483240#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('iconfont.woff2?t=1621941483240') format('woff2'),
       url('iconfont.woff?t=1621941483240') format('woff'),
       url('iconfont.ttf?t=1621941483240') format('truetype'),
       url('iconfont.svg?t=1621941483240#iconfont') format('svg');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-auto:before {
  content: "\e6eb";
}

.icon-all:before {
  content: "\e6ef";
}

.icon-gift:before {
  content: "\e6f9";
}

.icon-play:before {
  content: "\e701";
}

.icon-favorites-fill:before {
  content: "\e721";
}
`;
