import axios from 'axios';
import { get } from 'svelte/store';
import { isConnected } from './stores';

const requestQueue = [];

async function performRequest(fn) {
	try {
		const response = await fn();
		return response.data;
	} catch (error) {
		console.error('Request failed', error);
	}
}

function queueRequest(fn) {
	requestQueue.push(fn);
}

async function sendPutRequest(url, body) {
	const axiosRequest = () => axios.put(url, body);

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

export { sendPutRequest };
