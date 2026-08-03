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
    setDefaultHeaders(headers) {
        this.apiService.setDefaultHeaders(headers);
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

    /**
     * @typedef {Object} AcExtraResult
     * @property {number} AC_EXTRA_ID - Unique identifier for the AC extra entry.
     * @property {number} AC_ID - Identifier of the associated AC.
     * @property {string} ENTRY_DATE - Entry date in `YYYY-MM-DD` format.
     * @property {number} ENTRY_USER_ID - Identifier of the user who created the entry.
     * @property {string} EXTRA_KEY - Name of the extra setting.
     * @property {string} EXTRA_VALUE - Stored value of the extra setting.
     * @property {unknown|null} My_Ac - Associated AC data, when available.
     * @property {unknown|null} My_Ac_extra_translation - Associated translation data, when available.
     * @property {number} OWNER_ID - Identifier of the owner.
     * @property {boolean|number|null} is_sync_ghs - Indicates whether the entry is synchronized with GHS.
    */

    /**
     * Gets an extra setting associated with an AC.
     *
     * @param {Object} params - Request parameters.
     * @param {number} params.AC_ID - Identifier of the AC.
     * @param {string} params.EXTRA_KEY - Key of the extra setting to retrieve.
     * @returns {Promise<AcExtraResult>} The AC extra setting data.
     */
    async getAcExtra({ AC_ID, EXTRA_KEY }) {
        const data = await this.apiService.makePostRequest("/Get_Ac_extra", {
            AC_ID,
            EXTRA_KEY
        });

        return data.My_Result;
    }

    async getExposedMpo() {
        const data = await this.apiService.makePostRequest(`/Get_Exposed_Mpo`, {});
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
