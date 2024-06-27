import { sendPutRequest } from './requestQueue';

const registerStudent = async (email, image, latitude, longitude, accuracy) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body = { email: email, image: image, latitude: latitude, longitude: longitude, accuracy: accuracy };
		const response = await sendPutRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

export { registerStudent };
