import React, { useState } from 'react';
import { DistrictModel } from '../../models/ResponseModels/DistrictModel';
import { StateModel } from '../../models/ResponseModels/StateModel';
import './styles.css';

interface slotNotifierFormProps {
	stateList: StateModel[];
	districtList: DistrictModel[];
	ageGroup: {
		labelTxt: string;
		checked: boolean;
		name: string;
	}[];
	name: string;
	email: string;
	invalidfields: {
		state: boolean;
		distrct: boolean;
		agegroup: boolean;
	};

	onStateChange: (state_id: number) => void;
	onDistrictChange: (district_id: number) => void;
	onCheckboxChecked: (name: string, checked: boolean) => void;
	onNameChange: (name: string) => void;
	onSubmitClick: (e: any,notifyMe: boolean) => void;
	onEmailChange: (email: string) => void;
}

export const SlotNotifierForm: React.FC<slotNotifierFormProps> = (props) => {

	const appendInvalidClass = (isInvalidField: boolean, classlist: string) => {
		var classes: string = isInvalidField ? classlist.concat(' invalid') : classlist;
		return classes;
	};

	const [notifyme, setNotifyme] = useState(true);

	return (
		<div className="form-container">
			<form className="slot-notifier-form" onSubmit={(e) => props.onSubmitClick(e,notifyme)}>
				<div className="mb-3">
					<input
						type="text"
						placeholder="Name"
						value={props.name}
						onChange={(e) => props.onNameChange(e.currentTarget.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<input
						type="email"
						placeholder="Email"
						value={props.email}
						onChange={(e) => props.onEmailChange(e.currentTarget.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="mb-3">
					<select
						onChange={(e) => props.onStateChange(parseInt(e.currentTarget.value))}
						value={props.stateList.find((item) => item.selected)?.state_id}
						className={appendInvalidClass(props.invalidfields.state, 'form-select')}
					>
						{props.stateList.map((item) => {
							return (
								<option value={item.state_id} key={item.state_id}>
									{item.state_name}
								</option>
							);
						})}
					</select>
				</div>
				<div className="mb-3">
					<select
						onChange={(e) => props.onDistrictChange(parseInt(e.currentTarget.value))}
						value={props.districtList.find((item) => item.selected)?.district_id}
						className={appendInvalidClass(props.invalidfields.distrct, 'form-select')}
					>
						{props.districtList.map((item) => {
							return (
								<option value={item.district_id} key={item.district_id}>
									{item.district_name}
								</option>
							);
						})}
					</select>
				</div>
				<div className={appendInvalidClass(props.invalidfields.agegroup, 'form-container age-group')}>
					<label className="form-label">Age Group:</label>
					{props.ageGroup.map((item) => {
						return (
							<div className="form-check">
								<input
									type="checkbox"
									onChange={(e) =>
										props.onCheckboxChecked(e.currentTarget.name, e.currentTarget.checked)
									}
									checked={item.checked}
									key={item.name}
									name={item.name}
									id={item.name}
									className="form-check-input"
								/>
								<label htmlFor={item.name} className="form-check-label">
									{item.labelTxt}
								</label>
							</div>
						);
					})}
				</div>
				<div className="notifyme-cn form-check">
					<input
						type="checkbox"
						checked={notifyme}
						onChange={() => setNotifyme(!notifyme)}
						className="form-check-input"
						id="notifyme"
						name="notifyme"
					/>
					<label htmlFor="notifyme" className="form-check-label">
						{' '}
						Notify me in email when slots will be available.
					</label>
				</div>
				<button style={{ width: '100%' }} type="submit" className="btn btn-primary submit-btn">
					Search Slot
				</button>
			</form>
		</div>
	);
};
