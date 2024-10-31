import axios from "axios";
import { Token } from "../token";

export class CommonServices extends Token {
    constructor(baseUrl) {
        super()
        this.baseUrl = baseUrl;
    }
    getToken() {
        return this.token;
    }
    async getCountries(language) {
        const token = this.getToken();
        if (!token) {
            throw new Error('Missing Token');
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Exposed_Countries`, {
            language,
        }, {
            headers: {
                Authorization: token
            }
        });
        if (data.ExceptionMsg !== '') {
            throw new Error(data.ExceptionMsg);
        }
        return data.My_Result;
    }
    async fetchLanguage(code, sections = ['_PMS_FRONT']) {
        const token = this.getToken();
        if (!token) {
            throw new Error("Missing token")
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Exposed_Language`, { code, sections }, {
            headers: {
                Authorization: token
            }
        });
        if (data.ExceptionMsg !== '') {
            throw new Error(data.ExceptionMsg);
        }
        let entries = this.transformArrayToObject(data.My_Result.entries);
        return { entries, direction: data.My_Result.direction };
    }

    transformArrayToObject(data) {
        let object = {};
        for (const d of data) {
            object[d.code] = d.description;
        }
        return object;
    }

    async getExposedProperty(aName, language) {
        const token = this.getToken()
        if (!token) {
            throw new Error("Missing token")
        }
        const { data } = await axios.post(`${this.baseUrl}/Get_Exposed_Property`, { id: 1, aname: aName, language }, {
            headers: {
                Authorization: token
            }
        });

        if (data.ExceptionMsg !== '') {
            throw new Error(data.ExceptionMsg);
        }
        return data.My_Result
    }
}