import { Token } from "../token";
import { ApiService } from "./api.service";

export class CommonServices extends Token {
    constructor(baseUrl) {
        super()
        this.apiService = new ApiService(baseUrl)
    }
    setToken(token) {
        this.token = token;
        this.apiService.setToken(token)
    }
    setBaseUrl(url) {
        this.apiService.setBaseUrl(url);
    }
    getToken() {
        return this.token;
    }

    async getCountries(language) {
        const data = await this.apiService.makePostRequest(`/Get_Exposed_Countries`, {
            language,
        });
        return data.My_Result;
    }

    async fetchLanguage(code, sections = ['_PMS_FRONT']) {
        const data = await this.apiService.makePostRequest(`/Get_Exposed_Language`, { code, sections });
        let entries = this._transformArrayToObject(data.My_Result.entries);
        return { entries, direction: data.My_Result.direction };
    }

    async getSetupEntriesByTBLNameMulti(tables = [], language = en) {
        const data = await this.apiService.makePostRequest(`/Get_Setup_Entries_By_TBL_NAME_Multi`, {
            TBL_NAMES: tables,
        });
        return this._groupTables(data.My_Result, language);
    }

    async getExposedProperty(aName, language) {
        const data = await this.apiService.makePostRequest(`/Get_Exposed_Property`, { id: 1, aname: aName, language });
        return data.My_Result
    }

    _transformArrayToObject(data) {
        let object = {};
        for (const d of data) {
            object[d.code] = d.description;
        }
        return object;
    }
    _groupTables(data, lang) {
        const m = new Map();
        for (const d of data) {
            const prev = m.get(d.TBL_NAME) ?? {}
            const value = d[`CODE_VALUE_${lang?.toUpperCase()}`] ?? d["CODE_VALUE_EN"]
            m.set(d.TBL_NAME, { ...prev, [d.CODE_NAME]: value })
        }
        return Object.fromEntries(m)
    }
}
