import authConfig from "../auth_config.json";

const MAX_RETRIES = 4;

function buildApiUrl(params) {
    if (!Array.isArray(params)) {
        throw new Error("expected to have an arraylike parameter")
    }
    return authConfig.apiBase + "/" + params.join('/')
}

export class DataService {
    constructor(auth) {
        this.auth = auth
        this.retries = 0;
    }
    // get from the api
    async get(params) {
        const url = buildApiUrl(params);
        const accessToken = await this.auth.getAccessToken();
        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'Application/json'
            }
        });
        // Automatically retry the request if it is a 5xx series error
        if (result.status >= 500 && result.status < 600 && this.retries < MAX_RETRIES) {
            console.info('DataService: retrying API request for', params);
            this.retries += 1;
            return await this.get(params)
        }
        const body = await result.json()
        // handle non error 
        if (body.status !== 'success') {
            const msg = 'DataService: api responded ok, but there was an error'
            const err = new Error(msg)
            err.body = body;
            console.error(msg, body)
            throw err;
        }
        return body.data;
    }
}

export function roundNumber(score) {
    return Math.round(score * 1000) / 1000;
}