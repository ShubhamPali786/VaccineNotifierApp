import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL:'https://cdn-api.co-vin.in/api/v2'
});

export const axiosAPIInstance = axios.create({

});