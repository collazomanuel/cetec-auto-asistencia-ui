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

async function sendPostRequest(url, body) {
	const axiosRequest = () => axios.post(url, body);

	if (typeof window !== 'undefined' && get(isConnected))
		return performRequest(axiosRequest); // Ensure window is defined before checking connectivity
	else queueRequest(axiosRequest);
}

function retryQueuedRequests() {
	while (requestQueue.length > 0) {
		const request = requestQueue.shift(); // Get the first request in the queue
		performRequest(request); // Execute it
	}
}

if (typeof window !== 'undefined')
  window.addEventListener('online', retryQueuedRequests); // Only listen for online/offline events in the browser

export { sendPostRequest };
