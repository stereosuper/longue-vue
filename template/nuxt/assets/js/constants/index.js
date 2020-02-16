<%_ if (packages.gsap) { _%>    
/**
 * NOTE: If you wanna use the CustomEase plugin you'll need to download GSAP with bonus.
 * 
 * To install it follow these steps:
 * 1. Download GSAP 3 with bonus files from your greensock dashboard.
 * 2. Unzip and open the freshly downloaded archive.
 * 3. Go to the folder npm-install-this.
 * 4. Copy gsap-bonus.tgz to ~/custom_modules in your Nuxt project.
 * 5. Uncompress gsap-bonus.tgz and rename the directory with gsap-with-bonus.
 * 6. Finally uncomment the following two lines and remove these comments.
 * 
*/
// Gsap with custom ease
// import { gsap } from 'gsap';
// import { CustomEase } from '../../../custom_modules/gsap-with-bonus/CustomEase';
// gsap.registerPlugin(CustomEase);
<%_ } _%>

// 🎨 Colors
export const colors = {
    black: '#000',
    white: '#fff'
};

// 📐 Layout
export const gutter = 35;
export const lineHeight = 22;
export const headerHeight = 88;

// 💫 Animations
export const duration = { short: 0.3, medium: 0.5, long: 0.7 };

export const ease = {
    <%_ if (packages.gsap) { _%>
    // easeOut: CustomEase.create('easeOut', 'M0,0,C0,0,0,0,1,1'),
    // easeIn: CustomEase.create('easeIn', 'M0,0,C0,0,0,0,1,1'),
    // easeInOut: CustomEase.create('easeInOut', 'M0,0,C0,0,0,0,1,1')
    <%_ } _%>
};
