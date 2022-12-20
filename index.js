const axios = require("axios");

const getApps = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    let axiosResponse0 = await axios.get(
        'https://app.koyeb.com/v1/apps',
        config
    );
    return axiosResponse0.data
}
const listActivities = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    let axiosResponse0 = await axios.get(
        'https://app.koyeb.com/v1/activities',
        config
    );
    return axiosResponse0.data
}
const getAppInfo = async (appName, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    let axiosResponse0 = await axios.get(
        'https://app.koyeb.com/v1/apps',
        config
    );
    const app_id = axiosResponse0.data.apps.filter(e => e.name == appName.trim())[0].id
    let axiosResponse1 = await axios.get(
        'https://app.koyeb.com/v1/apps/' + app_id,
        config
    );
    return axiosResponse1.data
}
const getServices = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    let axiosResponse0 = await axios.get(
        'https://app.koyeb.com/v1/services',
        config
    );
    return axiosResponse0.data
}
const getServiceInfo = async (service_id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    let axiosResponse0 = await axios.get(
        'https://app.koyeb.com/v1/services/' + service_id,
        config
    );
    return axiosResponse0.data
}
const reDeploy = async (appName, token) => {
    if (!appName) throw new Error('Need app name!')
    if (!token) throw new Error('Koyeb API Key not found!')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    try {
        let axiosResponse0 = await axios.get(
            'https://app.koyeb.com/v1/services',
            config
        );
        const service_id = axiosResponse0.data.services.filter(e => e.name == appName.trim())[0].id
        let axiosResponse1 = await axios.get(
            'https://app.koyeb.com/v1/deployments?service_id=' + service_id,
            config
        );
        let {
            definition
        } = axiosResponse1.data.deployments[0]
        await axios.patch(
            'https://app.koyeb.com/v1/services/' + (service_id), {
                "definition": definition
            },
            config
        );
        return true;
    } catch (error) {
        throw new Error(error.message)
    }
}
const pauseService = async (appName, token) => {
    if (!appName) throw new Error('Need app name!')
    if (!token) throw new Error('Koyeb API Key not found!')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    try {
        let axiosResponse0 = await axios.get(
            'https://app.koyeb.com/v1/services',
            config
        );
        const service_id = axiosResponse0.data.services.filter(e => e.name == appName.trim())[0].id
         await axios.post(
            `https://app.koyeb.com/v1/services/${service_id}/pause`,
            config
        );
        return true;
    } catch (error) {
        throw new Error(error.message)
    }
}
const update = async (key, value, token, appName) => {
    if (!key || !value) throw new Error('Need key & value!')
    if (!token) throw new Error('Koyeb API Key not found!')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    try {
        let axiosResponse0 = await axios.get(
            'https://app.koyeb.com/v1/services',
            config
        );
        const service_id = axiosResponse0.data.services.filter(e => e.name == appName.trim())[0].id
        let axiosResponse1 = await axios.get(
            'https://app.koyeb.com/v1/deployments?service_id=' + service_id,
            config
        );
        let {
            definition
        } = axiosResponse1.data.deployments[0]
        let envVars = axiosResponse1.data.deployments[0]?.definition?.env || []
        let matched = envVars.filter(e => e.key === key)
        if (matched.length) {
            if (envVars[envVars.indexOf(matched[0])]['value'] == value) return true;
            envVars[envVars.indexOf(matched[0])]['value'] = value
        } else {
            envVars.push({
                scopes: envVars[0].scopes,
                key,
                value
            })
        }
        await axios.patch(
            'https://app.koyeb.com/v1/services/' + (service_id), {
                "definition": definition
            },
            config
        );
        return true;
    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = class Koyeb {
    constructor(token) {
        if (!token) throw "API token not found!"
        /** Add/update environment variables. All params are required
         * ```
         * Koyeb.setEnv({Var:"PORT",value:"3000",serviceName:"my-service-name"})
         * ``` */
        this.setEnv = ({
            Var,
            value,
            serviceName
        }) => update(Var, value, token, serviceName);
        /** Redeploy service using service name (required)
         * ```
         * Koyeb.reDeploy("my-service")
         * ``` */
        this.reDeploy = (serviceName) => reDeploy(serviceName, token)
        this.getApps = () => getApps(token)
        this.getServices = () => getServices(token)
        this.listActivities = () => listActivities(token)
        this.getAppInfo = (appName) => getAppInfo(appName, token)
        this.getServiceInfo = (service_id) => getServiceInfo(service_id, token)
        this.pauseService = (serviceName) => pauseService(serviceName,token)
    }
}
