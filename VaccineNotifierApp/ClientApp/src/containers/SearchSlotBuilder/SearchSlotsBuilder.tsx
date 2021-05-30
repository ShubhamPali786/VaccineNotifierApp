import React from 'react';
import { axiosInstance } from '../../AxiosBase';
import { SlotAvailabilityPage } from '../../components/SlotAvailabilityPage/SlotAvailabilityPage';
import { Center, CenterAvailabilityModel } from '../../models/ResponseModels/CenterAvailabilityModel';
import { DistrictModel } from '../../models/ResponseModels/DistrictModel';
import { StateModel } from '../../models/ResponseModels/StateModel';
import './styles.css';
interface SearchSlotProps {
	districtId: number;
	state_name: string;
	district_name: string;
	state_id:number;
	notifyMe: boolean;
	backButtonClick: () => void;
}
interface SearchSlotState {
	stateList: StateModel[];
	districtList: DistrictModel[];
	selectedState: string;
	selectedDistrict: string;
	allCentersList: CenterAvailabilityModel;
	centerAvailabilityModel: CenterAvailabilityModel;
	ageFilters: {
		label: string;
		key: string;
		selected: boolean;
	}[];
	isAnySlotAvailable: boolean;
}

export class SearchSlotBuilder extends React.Component<SearchSlotProps, SearchSlotState> {
	state: SearchSlotState = {
		centerAvailabilityModel: {
			centers: [this.getDefaultCenterData()],
		},
		allCentersList: {
			centers: [],
		},
		ageFilters: [
			{
				label: '18-44',
				selected: false,
				key: '18plus',
			},
			{
				label: '45+',
				selected: false,
				key: '45plus',
			},
		],
		isAnySlotAvailable: false,
		stateList: [],
		districtList: [],
		selectedDistrict: '',
		selectedState: '',
	};

	componentDidMount() {
		this.setVaccinationList(this.props.districtId);
		this.setState({
			selectedState:this.props.state_name,
			selectedDistrict:this.props.district_name
		});
		axiosInstance.get('admin/location/states').then((res) => this.setState({ stateList: res.data.states }));

		axiosInstance.get(`admin/location/districts/${this.props.state_id}`).then((res) =>
			this.setState({
				districtList: res.data.districts,
			})
		);
	}

	setVaccinationList = (district_id: number) => {
		var dateObj = new Date();
		var currentDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;
		axiosInstance
			.get(`/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=${currentDate}`)
			.then((res) => {
				res.data.centers.push(this.getDefaultCenterData());
				var centers: Center[] = res.data.centers;
				var isAnySlotAvailable =
					centers.length > 0
						? centers.some((item) =>
								item.sessions.some(
									(item) =>
										item.available_capacity > 0 ||
										item.available_capacity_dose1 > 0 ||
										item.available_capacity_dose2 > 0
								)
						  )
						: false;
				this.setState({
					centerAvailabilityModel: res.data,
					allCentersList: res.data,
					isAnySlotAvailable: isAnySlotAvailable,
				});
			});
	};

	onStateChange = (state_id: number) => {
		const stateName = this.state.stateList.find(item=>item.state_id===state_id)!.state_name;
		this.setState({selectedState:stateName});
		axiosInstance.get(`admin/location/districts/${state_id}`).then((res) =>{
			this.setState({
				districtList: res.data.districts,
				selectedDistrict:res.data.districts[0].district_name
			});
			this.setVaccinationList(res.data.districts[0].district_id);
		});
	};

	onDistrictChange = (district_id: number) => {
		const districtName = this.state.districtList.find(item=>item.district_id===district_id)!.district_name;
		this.setState({selectedDistrict:districtName});
		this.setVaccinationList(district_id);
	};

	getDefaultCenterData() {
		return {
			state_name: this.props.state_name,
			district_name: this.props.district_name,
			address: '',
			name: '',
			pincode: 0,
			sessions: [],
		};
	}

	onFilterClick = (key: string, selected: boolean) => {
		var filters = [...this.state.ageFilters];
		filters.map((item) => {
			if (item.key === key) {
				item.selected = !selected;
			} else item.selected = false;
			return item;
		});
		this.setState({ ageFilters: filters });

		var centers = [...this.state.allCentersList.centers];
		var is45plusSelected = [...filters].find((item) => item.selected)?.key === '45plus';
		var filteredCenters: Center[] = [];
		if (filters.find((item) => item.selected)) {
			centers.forEach((item) => {
				var sessions = [...item.sessions];
				var isSlotAvailable = false;
				if (is45plusSelected)
					isSlotAvailable = sessions.some((item) => item.min_age_limit >= 45 && item.available_capacity > 0);
				else
					isSlotAvailable = sessions.some(
						(item) => item.min_age_limit >= 18 && item.min_age_limit <= 44 && item.available_capacity > 0
					);
				if (!isSlotAvailable) return;
				filteredCenters.push(item);
			});
		} else filteredCenters = [...centers];
		filteredCenters.push(this.getDefaultCenterData());
		this.setState({ centerAvailabilityModel: { centers: filteredCenters } });
	};

	render() {
		if (this.state.centerAvailabilityModel.centers.length > 0) {
			return (
				<div style={{ width: '100%' }}>
					<SlotAvailabilityPage
						stateList={this.state.stateList}
						districtList={this.state.districtList}
						onStateChange={(stateid:number)=>this.onStateChange(stateid)}
						onDistrictChange={(districtId:number)=>this.onDistrictChange(districtId)}
						isAnySlotAvailable={this.state.isAnySlotAvailable}
						backButtonClick={() => this.props.backButtonClick()}
						ageFilters={this.state.ageFilters}
						onFilterSelection={(key: string, selected: boolean) => this.onFilterClick(key, selected)}
						centerAvailabilityModel={this.state.centerAvailabilityModel}
						notifyMe={this.props.notifyMe}
						selectedState={this.state.selectedState} selectedDistrict={this.state.selectedDistrict}
					/>
				</div>
			);
		}
		return <p className="loading-text">Loading...</p>;
	}
}
