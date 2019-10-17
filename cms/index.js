import axios from 'axios';
import { acfApiEndpoint, apiBase, customApiEndpoint, wpApiEndpoint } from './cms.config';

class WpApi {
    /**
     * @description Dynamically getting your template query file
     * @author Alban Mezino <alban@stereosuper.fr>
     * @param {string} rawTemplate
     * @returns {Object}
     * @memberof WpApi
     */
    async templateQuery(template) {
        // Replacing the file extension if not done yet
        //const template = rawTemplate.replace('.php', '');
        // Template data function dynamically imported
        const { default: getTemplateDataFunction } = await import(`./templates/${template}`);
        // Calling the function responsible for getting fetching the data
        return await getTemplateDataFunction();
    }

    cleanUrls(json) {
        let stringified = JSON.stringify(json);
        const cmsUrl = process.env.CMS_URL;

        if (cmsUrl) {
            let urls = stringified.match(/(http(s?):)([\/|.|\w|\s|-])*/g);

            if (urls) {
                urls.filter(u => u.indexOf(`${cmsUrl}/wp-content`) === -1).forEach(url => {
                    const newUrl = url.replace(cmsUrl, '');
                    stringified = stringified.replace(url, newUrl);
                });
            }
        }

        return JSON.parse(stringified);
    }

    /**
     * @description Generates head override for pages components. It needs a WP api page object as argument.
     * @author Alban Mezino <alban@stereosuper.fr>
     * @param {Object} data
     * @returns
     * @memberof WpApi
     */
    generateHead(data) {
        const seo = { title: '', meta: [] };
        if (data && data.yoast_meta) {
            const { yoast_wpseo_title: title, yoast_wpseo_metadesc: desc } = data.yoast_meta;

            seo.title = title;
            seo.meta.push({
                hid: 'description',
                name: 'description',
                content: desc,
            });
        }
        return seo;
    }

    /**
     * @description Get json datas from WP API
     * @author Elisabeth Hamel <elisabeth@stereosuper.fr>
     * @param {string} url
     * @returns {Object}
     * @memberof WpApi
     */
    async getDatas(url) {
        return await axios
            .get(url)
            .then(json => this.cleanUrls(json.data))
            .catch(error => ({ error }));
    }

    async settings() {
        return await this.getDatas(apiBase);
    }
    async options() {
        return await this.getDatas(`${acfApiEndpoint}/options/options`);
    }
    async menu() {
        return await this.getDatas(`${customApiEndpoint}/menu`);
    }
    async page(slug) {
        return await this.getDatas(`${wpApiEndpoint}/pages?slug=${slug}`);
    }
    async home() {
        return await this.getDatas(`${customApiEndpoint}/frontpage`);
    }
    async job(id) {
        return await this.getDatas(`${wpApiEndpoint}/jobs/${id}`);
    }
    async jobBySlug(slug) {
        return await this.getDatas(`${wpApiEndpoint}/jobs?slug=${slug}`);
    }
    async study(id) {
        return await this.getDatas(`${wpApiEndpoint}/study-case/${id}`);
    }
    async studyBySlug(slug) {
        return await this.getDatas(`${wpApiEndpoint}/study-case?slug=${slug}`);
    }
    async office(id) {
        return await this.getDatas(`${wpApiEndpoint}/offices/${id}`);
    }
    async officeBySlug(slug) {
        return await this.getDatas(`${wpApiEndpoint}/offices?slug=${slug}`);
    }
    async training(id) {
        return await this.getDatas(`${wpApiEndpoint}/trainings/${id}`);
    }
    async trainingBySlug(slug) {
        return await this.getDatas(`${wpApiEndpoint}/trainings?slug=${slug}`);
    }
}

const wp = new WpApi();

export default wp;
