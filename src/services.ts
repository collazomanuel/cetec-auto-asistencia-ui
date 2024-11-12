
import { sendGetRequest, sendPostRequest, sendPutRequest } from './requestQueue';

import type { UserType, ExamType, AttendanceType } from '$lib/types/exam.type';

const getExams = async (filter : boolean) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const response = await sendGetRequest(url, { filter: filter });
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addExam = async (exam : ExamType, auth : string) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body = { code: '', name: exam?.name, start: exam?.start, length: exam?.length, margin: exam?.margin };
		const response = await sendPostRequest(url, body, auth);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const editExam = async (exam : ExamType, auth : string) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body = { code: exam?.code, name: exam?.name, start: exam?.start, length: exam?.length, margin: exam?.margin };
		const response = await sendPutRequest(url, body, auth);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addStudent = async (user : UserType, auth : string) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body = { email: user?.email, image: user?.image };
		const response = await sendPostRequest(url, body, auth);
		return response;
	} catch (error) {
		console.error(error);
	}
};

const addAttendance = async (attendance : AttendanceType, auth : string) => {
	try {
		const url = import.meta.env.VITE_API_URL + '/attendance';
		const body = { email: attendance?.email, code: attendance?.code, latitude: attendance?.latitude, longitude: attendance?.longitude, accuracy: attendance?.accuracy, image: attendance?.image };
		const response = await sendPostRequest(url, body, auth);
		return response;
	} catch (error) {
		console.error(error);
	}
};

export { getExams, addExam, editExam, addStudent, addAttendance };
