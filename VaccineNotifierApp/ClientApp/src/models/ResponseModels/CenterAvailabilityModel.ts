export interface CenterAvailabilityModel {
	centers: Center[];
}

export interface Center {
	state_name: string;
	district_name: string;
    pincode: number,
    name:string,
    address:string
	sessions: Sessions[];
}

interface Sessions {
	min_age_limit: number;
	available_capacity_dose1: number;
	available_capacity_dose2: number;
	date: string;
	available_capacity: number;
	vaccine: string;
}
