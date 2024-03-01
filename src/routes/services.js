import { sendPostRequest } from './requestQueue';

const registerStudent = async (email, image, latitude, longitude) => {
	try {
		const url = 'http://localhost:8000' + '/student';
		const body = { email: email, image: image, latitude: latitude, longitude: longitude };
		const response = sendPostRequest(url, body);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export { registerStudent };
