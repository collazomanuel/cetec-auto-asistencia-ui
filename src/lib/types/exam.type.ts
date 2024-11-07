
export type UserType = {
    email: string;
    image: string;
};

export type ExamType = {
    code: string;
    name: string;
    start: string;
    length: number;
    margin: number;
};

export type AttendanceType = {
    email: string;
    code: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    image: string;
};
