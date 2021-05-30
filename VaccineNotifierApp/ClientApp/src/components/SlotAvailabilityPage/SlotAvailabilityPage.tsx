import { faArrowLeft, faDiceFive } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../AxiosBase';
import { CenterAvailabilityModel } from '../../models/ResponseModels/CenterAvailabilityModel';
import { DistrictModel } from '../../models/ResponseModels/DistrictModel';
import { StateModel } from '../../models/ResponseModels/StateModel';
import './styles.css';
interface SlotAvailabilityPageProps {
	centerAvailabilityModel: CenterAvailabilityModel;
	ageFilters: {
		label: string;
		key: string;
		selected: boolean;
	}[];
	isAnySlotAvailable: boolean;
	notifyMe: boolean;
	stateList: StateModel[];
	districtList: DistrictModel[];
	selectedState:string;
	selectedDistrict:string;

	backButtonClick: () => void;
	onFilterSelection: (key: string, selected: boolean) => void;
	onStateChange: (state_id: number) => void;
	onDistrictChange: (district_id: number) => void;
}

export const SlotAvailabilityPage: React.FC<SlotAvailabilityPageProps> = (props) => {
	const isCentersAvailable = props.centerAvailabilityModel.centers.length > 0;
	const [showStates, setShowStates] = useState(false);
	const [showDistrict, setShowDistrict] = useState(false);
	return (
		<>
			<div className="filter-controls">
				<div className="filter-controls selected-district">
					<div className="filter-controls back-arrow" onClick={() => props.backButtonClick()}>
						<FontAwesomeIcon icon={faArrowLeft} size={'2x'} color={'white'} />
					</div>
					{isCentersAvailable && (
						<>  
							
								<div
									className="filter-controls selection"
									onMouseEnter={() => setShowStates(true)}
								>
									{props.selectedState}
								</div>
								{props.stateList.length > 0 && (
									<div
										className={
											showStates
												? 'slotavailability-drop-down-state show'
												: 'slotavailability-drop-down-state'
										}
										onMouseLeave={() => setShowStates(false)}
									>
										<div className="slotavailability-drop-down-state-arrow"></div>
										<div className="slotavailability-drop-down-options slotavailability-states-options">
											{props.stateList.map((item) => (
												<p
													key={item.state_id}
													onClick={(e) => props.onStateChange(item.state_id)}
												>
													{item.state_name}
												</p>
											))}
										</div>
									</div>
								)}
								<div
									className="filter-controls selection"
									onMouseEnter={() => setShowDistrict(true)}
								>
									{props.selectedDistrict}
								</div>
								{props.districtList.length > 0 && (
									<div
										className={
											showDistrict
												? 'slotavailability-drop-down-district show'
												: 'slotavailability-drop-down-district'
										}
										onMouseLeave={() => setShowDistrict(false)}
									>
										<div className="slotavailability-drop-down-district-arrow"></div>
										<div className="slotavailability-drop-down-options slotavailability-districts-options">
											{props.districtList.map((item) => (
												<p
													key={item.district_id}
													onClick={(e) => props.onDistrictChange(item.district_id)}
												>
													{item.district_name}
												</p>
											))}
										</div>
									</div>
								)}
						</>
					)}
				</div>
				{props.isAnySlotAvailable && (
					<div className="filter-controls age-filters">
						<label>filters : </label>
						{props.ageFilters.map((item) => (
							<div
								key={item.key}
								className={
									item.selected
										? 'filter-controls selected-age selected'
										: 'filter-controls selected-age'
								}
								onClick={() => props.onFilterSelection(item.key, item.selected)}
							>
								{item.label}
							</div>
						))}
					</div>
				)}
			</div>
			{isCentersAvailable &&
				props.isAnySlotAvailable &&
				props.centerAvailabilityModel.centers.some((item) => item.sessions.length > 0) && (
					<div className="available-slots-table">
						<div>
							<div className="available-slots-table tblBody">
								{props.centerAvailabilityModel.centers.map((item) => {
									var sessions =
										[...item.sessions]?.length > 0
											? [...item.sessions].filter(
													(item) =>
														item.available_capacity > 0 ||
														item.available_capacity_dose1 > 0 ||
														item.available_capacity_dose2 > 0
											  )
											: [...item.sessions];
									if (sessions.length == 0) return;
									var is45PlusSlotAvailable = sessions.some((item) => item.min_age_limit >= 45);
									var is18plusSlotAvailable = sessions.some(
										(item) => item.min_age_limit >= 18 && item.min_age_limit <= 44
									);
									var dates = sessions.map((item) => item.date);
									var vaccines = [
										sessions.map((item) => item.vaccine).filter((x, i, a) => a.indexOf(x) == i),
									];
									return (
										<div className="available-slots-table row">
											<div className="first-cell">
												<span>{item.name}</span>
												<h6 className="address">
													{item.address} , {item.pincode}
												</h6>
												<div className="age-container">
													{is45PlusSlotAvailable && (
														<div className="age-container_box">
															<p>45+</p>
														</div>
													)}
													{is18plusSlotAvailable && (
														<div className="age-container_box">
															<p>18-44</p>
														</div>
													)}
												</div>
												<div className="vaccine-container">
													Vaccine:
													<div style={{ display: 'flex' }}>
														{vaccines.map((item) => (
															<div className="vaccine-box">{item}</div>
														))}
													</div>
												</div>
											</div>

											<div className="available-date-container">
												Available Dates:
												<div style={{ display: 'flex' }}>
													{dates.map((item) => (
														<div className="available-date">{item}</div>
													))}
												</div>
												<div className="book-slot">Book on Cowin</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				)}
			{(!props.centerAvailabilityModel.centers.some((item) => item.sessions.length > 0) ||(!props.isAnySlotAvailable)) && (
				<div className="noslots-msg-cn">
					<p>There are no slots available for current selection.</p>
				</div>
			)}
			{props.notifyMe && (
				<div className="notification-msg">
					{props.isAnySlotAvailable ? (
						<p>You will be notified in email when more slots are available for your selection.</p>
					) : (
						<p>
							Oops there are no slots available for current selection but don't worry, You will get email
							once slots are available.
						</p>
					)}
				</div>
			)}
		</>
	);
};
