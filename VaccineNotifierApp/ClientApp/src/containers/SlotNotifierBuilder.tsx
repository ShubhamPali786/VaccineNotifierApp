import React from 'react';
import { axiosAPIInstance, axiosInstance } from '../AxiosBase';
import { LandingPage } from '../components/LandingPage/LandingPage';
import { SlotNotifierForm } from '../components/SlotNotifierForm/SlotNotifierForm';
import { UnsubscribeForm } from '../components/UnsubscribeEmails/UnsubscribeForm';
import { DistrictModel } from '../models/ResponseModels/DistrictModel';
import { StateModel } from '../models/ResponseModels/StateModel';
import { SearchSlotBuilder } from './SearchSlotBuilder/SearchSlotsBuilder';
import './styles.css';

interface slotNotifierProps {}
interface slotNotifierState {
	stateList: StateModel[];
	districtList: DistrictModel[];
	ageGroup: {
		labelTxt: string;
		checked: boolean;
		name: string;
	}[];
	name: string;
	email: string;
	navigateToSearchPage: boolean;
	renderUnsubscribeComponent: boolean;
	invalidFields: {
		state: boolean;
		distrct: boolean;
		agegroup: boolean;
	};
	notifyMe:boolean;
}
class SlotNotifierBuilder extends React.Component<slotNotifierProps, slotNotifierState> {
	state: slotNotifierState = {
		stateList: [
			{
				state_id: 0,
				state_name: '- Select State -',
				selected: true,
			},
		],
		districtList: [
			{
				district_id: 0,
				district_name: '- Select District -',
				selected: true,
			},
		],
		ageGroup: [
			{
				checked: true,
				labelTxt: '18-45',
				name: '18plus',
			},
			{
				checked: false,
				labelTxt: '45+',
				name: '45plus',
			},
			{
				checked: false,
				labelTxt: 'Both Age Group',
				name: 'allagegroup',
			},
		],
		name: '',
		email: '',
		navigateToSearchPage: false,
		renderUnsubscribeComponent: false,
		invalidFields: {
			agegroup: false,
			distrct: false,	
			state: false,
		},
		notifyMe:true
	};

	componentDidMount() {
		axiosInstance
			.get('admin/location/states')
			.then((res) => this.setState({ stateList: [...this.state.stateList.concat(res.data.states)] }));
	}
	setUnsubscribe = () => {
		this.setState({
			renderUnsubscribeComponent: !this.state.renderUnsubscribeComponent,
		});
	};
	onStateChange = (state_id: number) => {
		var stateList = [...this.state.stateList];
		stateList.map((item) => {
			item.selected = item.state_id === state_id;
			return item;
		});
		var invalidState = stateList.find((item) => item.selected)?.state_id === 0;
		this.setState({
			stateList: stateList,
			invalidFields: {
				...this.state.invalidFields,
				state: invalidState,
			},
		});
		axiosInstance.get(`admin/location/districts/${state_id}`).then((res) =>
			this.setState({
				districtList: [
					{
						district_id: 0,
						district_name: '- Select District -',
						selected: true,
					},
					...res.data.districts,
				],
			})
		);
	};

	onDistrictChange = (district_id: number) => {
		var districtList = [...this.state.districtList];
		districtList.map((item) => {
			item.selected = item.district_id === district_id;
			return item;
		});
		var invalidDistrict = districtList.find((item) => item.selected)?.district_id === 0;
		this.setState({
			districtList: districtList,
			invalidFields: {
				...this.state.invalidFields,
				distrct: invalidDistrict,
			},
		});
	};

	onCheckboxChecked = (name: string, checked: boolean) => {
		var ageGroup = [...this.state.ageGroup];
		ageGroup.map((item) => {
			if (name === 'allagegroup' && checked) item.checked = true;
			else if (name === 'allagegroup' && !checked) item.checked = false;
			else item.checked = item.name === name ? checked : item.checked;

			if (item.name === 'allagegroup' && name != 'allagegroup') {
				item.checked = item.checked ? checked : item.checked;
			}
			return item;
		});

		var validCheckbox = ageGroup.some((item) => item.checked);
		this.setState({
			ageGroup: ageGroup,
			invalidFields: {
				...this.state.invalidFields,
				agegroup: !validCheckbox,
			},
		});
	};

	onSubmitClick = (e: any, notifyme: boolean) => {
		e.preventDefault();
		var validagegroup = this.state.ageGroup.some((item) => item.checked);
		var invalidDistrict = this.state.districtList.find((item) => item.selected)?.district_id === 0;
		var invalidState = this.state.stateList.find((item) => item.selected)?.state_id === 0;
		if (!validagegroup || invalidState || invalidDistrict) {
			this.setState({
				invalidFields: {
					agegroup: !validagegroup,
					state: invalidState,
					distrct: invalidDistrict,
					
				}
			});
			return;
		}
		this.setState({ navigateToSearchPage: !this.state.navigateToSearchPage,notifyMe:notifyme });
		axiosAPIInstance.post('/api/SlotBooking', {
			name: this.state.name,
			email: this.state.email,
			subscribe18PlusNotifier: this.state.ageGroup.find((item) => item.name === '18plus')?.checked,
			subscribe45PlusNotifier: this.state.ageGroup.find((item) => item.name === '45plus')?.checked,
			stateId: this.state.stateList.find((item) => item.selected)?.state_id,
			districtId: this.state.districtList.find((item) => item.selected)?.district_id,
			notifyMe: notifyme
		});
	};
	backButtonClick = () => {
		this.setState({ navigateToSearchPage: !this.state.navigateToSearchPage });
	};

	render() {
		const renderElement = !this.state.navigateToSearchPage ? (
			<>
				<LandingPage onClickUnsubscribe={() => this.setState({ renderUnsubscribeComponent: true })} />
				{!this.state.renderUnsubscribeComponent ? (
					<SlotNotifierForm
						invalidfields={this.state.invalidFields}
						name={this.state.name}
						email={this.state.email}
						onNameChange={(name: string) => this.setState({ name: name })}
						onEmailChange={(email: string) => this.setState({ email: email })}
						onSubmitClick={(e: any, notifyMe: boolean) => this.onSubmitClick(e, notifyMe)}
						districtList={this.state.districtList}
						stateList={this.state.stateList}
						ageGroup={this.state.ageGroup}
						onStateChange={(state_id: number) => this.onStateChange(state_id)}
						onDistrictChange={(district_id: number) => this.onDistrictChange(district_id)}
						onCheckboxChecked={(name: string, checked: boolean) => this.onCheckboxChecked(name, checked)}
					/>
				) : (
					<UnsubscribeForm onCancelClick={() => this.setUnsubscribe()} />
				)}
			</>
		) : (
			<SearchSlotBuilder
				backButtonClick={() => this.backButtonClick()}
				state_name={this.state.stateList.find((item) => item.selected)!.state_name}
				state_id={this.state.stateList.find((item) => item.selected)!.state_id}
				district_name={this.state.districtList.find((item) => item.selected)!.district_name}
				districtId={this.state.districtList.find((item) => item.selected)!.district_id}
				notifyMe={this.state.notifyMe}
			/>
		);
		return (
			<>
				<div className="main-container">{renderElement}</div>
			</>
		);
	}
}

export default SlotNotifierBuilder;
