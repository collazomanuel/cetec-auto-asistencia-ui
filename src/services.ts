import {
	sendGetRequest,
	sendPostRequest,
	sendPutRequest
} from './requestQueue';

import type { UserType, ExamType, AttendanceType } from '$lib/types';

const getExams = async (filter: boolean): Promise<ExamType[] | undefined> => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const response = await sendGetRequest(url, { filter });
		return response as ExamType[];
	} catch (error) {
		console.error(error);
	}
};

const addExam = async (
	exam: ExamType,
	userToken: string
): Promise<string | undefined> => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body: Partial<ExamType> = {
			code: '',
			name: exam.name,
			start: exam.start,
			length: exam.length,
			margin: exam.margin
		};
		const response = await sendPostRequest(url, body, userToken);
		return response as string;
	} catch (error) {
		console.error(error);
	}
};

const editExam = async (
	exam: ExamType,
	userToken: string
): Promise<string | undefined> => {
	try {
		const url = import.meta.env.VITE_API_URL + '/exam';
		const body: Partial<ExamType> = {
			code: exam.code,
			name: exam.name,
			start: exam.start,
			length: exam.length,
			margin: exam.margin
		};
		const response = await sendPutRequest(url, body, userToken);
		return response as string;
	} catch (error) {
		console.error(error);
	}
};

const addStudent = async (
	user: UserType,
	userToken: string
): Promise<string | undefined> => {
	try {
		const url = import.meta.env.VITE_API_URL + '/student';
		const body: Partial<UserType> = { email: user.email, image: user.image };
		const response = await sendPostRequest(url, body, userToken);
		return response as string;
	} catch (error) {
		console.error(error);
	}
};

const addAttendance = async (
	attendance: AttendanceType,
	userToken: string
): Promise<string | undefined> => {
	try {
		const url = import.meta.env.VITE_API_URL + '/attendance';
		const body: Partial<AttendanceType> = {
			email: '',
			code: attendance.code,
			latitude: attendance.latitude,
			longitude: attendance.longitude,
			accuracy: attendance.accuracy,
			image: attendance.image
		};
		const response = await sendPostRequest(url, body, userToken);
		return response as string;
	} catch (error) {
		console.error(error);
	}
};

export { getExams, addExam, editExam, addStudent, addAttendance };
