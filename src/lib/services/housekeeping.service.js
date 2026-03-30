import { Token } from "../token";
import { ApiService } from "./api.service";

export class HousekeepingService extends Token {
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
    async getHKIssues(params) {
        const data = await this.apiService.makePostRequest(`/Get_HK_Issues`, params);
        return data.My_Result;
    }
}
