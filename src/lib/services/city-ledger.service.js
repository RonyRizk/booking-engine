import { ApiService } from './api.service';
import { Token } from '../token';

const DEFAULT_BASE_URL = 'https://gateway.igloorooms.com/IR';

export class CityLedgerService extends Token {
  constructor(baseUrl = DEFAULT_BASE_URL) {
    super();
    this.apiService = new ApiService(baseUrl);
  }

  setToken(token) {
    this.token = token;
    this.apiService.setToken(token);
  }

  setBaseUrl(url) {
    this.apiService.setBaseUrl(url);
  }
  async getExposedAgent({ id }) {
    const data = await this.apiService.makePostRequest("/Get_Exposed_Agent", { id });
    return data.My_Result
  }
  async fetchCL({ AGENCY_ID, START_ROW = 0, END_ROW = 1000, SEARCH_QUERY }) {
    const payload = { AGENCY_ID, START_ROW, END_ROW };
    if (SEARCH_QUERY !== undefined) payload.SEARCH_QUERY = SEARCH_QUERY;
    return this.apiService.makePostRequest('/Fetch_CL', payload);
  }

  async getCLStatement({ AGENCY_ID, CURRENCY_ID, START_DATE, END_DATE }) {
    const data = await this.apiService.makePostRequest('/Get_CL_Statement', {
      AGENCY_ID,
      CURRENCY_ID,
      START_DATE,
      END_DATE,
    });
    return data.My_Result ?? null;
  }

  async getFiscalDocuments({ AGENCY_ID, DOC_NUMBER, START_DATE, END_DATE, LIST_FD_TYPE_CODE }) {
    const payload = { AGENCY_ID };
    if (DOC_NUMBER !== undefined) payload.DOC_NUMBER = DOC_NUMBER;
    if (START_DATE !== undefined) payload.START_DATE = START_DATE;
    if (END_DATE !== undefined) payload.END_DATE = END_DATE;
    if (LIST_FD_TYPE_CODE !== undefined) payload.LIST_FD_TYPE_CODE = LIST_FD_TYPE_CODE;
    const data = await this.apiService.makePostRequest('/Get_Fiscal_Documents', payload);
    return data.My_Result ?? [];
  }

  async getPaymentMethods() {
    const data = await this.apiService.makePostRequest('/Get_Setup_Entries_By_TBL_NAME', {
      TBL_NAME: '_PAY_METHOD',
    });
    return data.My_Result ?? [];
  }
}


