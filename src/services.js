import { sendGetRequest, sendPostRequest } from './requestQueue';

const getExams = async () => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const response = await sendGetRequest(url);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const registerExam = async (email, name, start, length, margin) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body = { email: email, code: '', name: name, start: start, length: length, margin: margin };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const registerStudent = async (email, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body = { email: email, image: image };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const registerAttendance = async (email, code, latitude, longitude, accuracy, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/attendance';
		const body = { email: email, code: code, latitude: latitude, longitude: longitude, accuracy: accuracy, image: image };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

export { getExams, registerExam, registerStudent, registerAttendance };
