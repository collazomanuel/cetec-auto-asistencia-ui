import axios from 'axios';
import { get } from 'svelte/store';
import { isConnected } from './stores';

const requestQueue: any = [];

async function performRequest(fn: any) {
	try {
		const response = await fn();
		return response.data;
	} catch (error) {
		console.error('Request failed', error);
	}
}

function queueRequest(fn: any) {
	requestQueue.push(fn);
}

async function sendGetRequest(url: string, params: any) {
	const axiosRequest = () => axios.get(url, { params: params ?? {} });
	if (typeof window !== 'undefined' && get(isConnected))
		return performRequest(axiosRequest);
	else queueRequest(axiosRequest);
}

async function sendPostRequest(url: string, body: any, userToken: string) {
	const axiosRequest = () => axios.post(url, body, {headers: {'Authorization': `Bearer ${userToken}`}});
	if (typeof window !== 'undefined' && get(isConnected))
		return performRequest(axiosRequest);
	else queueRequest(axiosRequest);
}

async function sendPutRequest(url: string, body: any, userToken: string) {
	const axiosRequest = () => axios.put(url, body, {headers: {'Authorization': `Bearer ${userToken}`}});
	if (typeof window !== 'undefined' && get(isConnected))
		return performRequest(axiosRequest);
	else queueRequest(axiosRequest);
}

function retryQueuedRequests() {
	while (requestQueue.length > 0) {
		const request = requestQueue.shift();
		performRequest(request);
	}
}

if (typeof window !== 'undefined')
	window.addEventListener('online', retryQueuedRequests);

export { sendGetRequest, sendPostRequest, sendPutRequest };
