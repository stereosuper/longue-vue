
<%_ if (gsap) { _%>
import { CustomEase } from '~/assets/js/plugins/CustomEase';
<%_ } _%>

export const gutter = 35;
export const lineHeight = 22;

export const headerHeight = 88;

export const duration = { short: 0.3, medium: 0.5, long: 0.7 };

export const ease = {
    <%_ if (gsap) { _%>
    easeOut: CustomEase.create('custom', 'M0,0,C0,0,0,0,1,1'),
    easeIn: CustomEase.create('custom', 'M0,0,C0,0,0,0,1,1'),
    easeInOut: CustomEase.create('custom', 'M0,0,C0,0,0,0,1,1')
    <%_ } _%>
};

export const colors = {
    black: '#000',
    white: '#fff'
};
