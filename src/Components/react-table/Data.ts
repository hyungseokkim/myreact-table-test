export interface Data {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: string;
    subRows?: Data[];
}