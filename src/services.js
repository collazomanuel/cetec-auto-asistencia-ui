import { sendGetRequest, sendPostRequest, sendPutRequest } from './requestQueue';

const getExams = async () => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const response = await sendGetRequest(url);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addExam = async (email, name, start, length, margin) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body = { email: email, code: '', name: name, start: start, length: length, margin: margin };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const editExam = async (email, code, name, start, length, margin) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body = { email: email, code: code, name: name, start: start, length: length, margin: margin };
		const response = await sendPutRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addStudent = async (email, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body = { email: email, image: image };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addAttendance = async (email, code, latitude, longitude, accuracy, image) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/attendance';
		const body = { email: email, code: code, latitude: latitude, longitude: longitude, accuracy: accuracy, image: image };
		const response = await sendPostRequest(url, body);
		return response;
	} catch (error) {
		console.error(error);
	}
};

export { getExams, addExam, editExam, addStudent, addAttendance };
