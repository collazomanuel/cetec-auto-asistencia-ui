import { sendGetRequest, sendPostRequest } from './requestQueue';

const getExams = async () => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const response = sendGetRequest(url);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

const registerStudent = async (email, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body = { email: email, image: image };
		const response = sendPostRequest(url, body);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

const registerAttendance = async (code, email, latitude, longitude, accuracy, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/attendance';
		const body = { code: code, email: email, latitude: latitude, longitude: longitude, accuracy: accuracy, image: image };
		const response = sendPostRequest(url, body);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};

export { getExams, registerStudent, registerAttendance };
