import axios from "axios";

export class ApiError extends Error {
    constructor(message, statusCode = null, errorCode = null, originalError = null) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.originalError = originalError;
        this.timestamp = new Date().toISOString();

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    // Check if error is a network error
    isNetworkError() {
        return this.errorCode === 'NETWORK_ERROR';
    }

    // Check if error is a server error (5xx)
    isServerError() {
        return this.statusCode >= 500 && this.statusCode < 600;
    }

    // Check if error is a client error (4xx)
    isClientError() {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    // Check if error is an authentication error
    isAuthError() {
        return this.statusCode === 401 || this.statusCode === 403;
    }

    // Convert to JSON for logging
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            errorCode: this.errorCode,
            timestamp: this.timestamp,
            stack: this.stack
        };
    }
}

export class ApiService {
    constructor(baseUrl, token = null) {
        axios.defaults.baseURL = baseUrl;
        this.token = token;
    }
    setBaseUrl(url) {
        axios.defaults.baseURL = url;
    }
    // Set or update the token
    setToken(token) {
        this.token = token;
    }

    // Get the current token
    getToken() {
        return this.token;
    }

    async makePostRequest(endpoint, payload, customHeaders = {}) {
        const token = this.getToken();
        if (!token) {
            throw new ApiError('Missing Token', null, 'MISSING_TOKEN');
        }
        try {
            const { data } = await axios.post(`${endpoint}`, payload, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                    ...customHeaders
                }
            });
            if (data.ExceptionMsg && data.ExceptionMsg !== '') {
                throw new ApiError(data.ExceptionMsg, 200, 'EXCEPTION_MSG');
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            if (error.response) {
                const { status, data: responseData, statusText } = error.response;
                const errorMessage = responseData?.message || responseData?.error || statusText || 'Request failed';

                throw new ApiError(
                    `Request failed with status ${status}: ${errorMessage}`,
                    status,
                    'HTTP_ERROR',
                    error
                );
            } else if (error.request) {
                throw new ApiError(
                    'No response received from server',
                    null,
                    'NETWORK_ERROR',
                    error
                );
            } else {
                throw new ApiError(
                    error.message || 'Unknown error occurred',
                    null,
                    'UNKNOWN_ERROR',
                    error
                );
            }
        }
    }
}
