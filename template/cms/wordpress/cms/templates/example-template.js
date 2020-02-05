// NOTE: Remove templates directory if it's not a wp project

/**
 * @description Get test-template.php specific data here
 * @author Alban Mezino <alban@stereosuper.fr>
 * @returns {Object}
 */
export const getTestTemplateData = async () => {
    // You can get your template data with await in here 👌

    // Here, return your template specific data
    return {
        // Your wp menu,
        // Your five first custom post type items
    };
};

export default getTestTemplateData;
