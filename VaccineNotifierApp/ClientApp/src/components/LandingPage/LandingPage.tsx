import React from 'react';
import { ContactUsPage } from '../ContactUsPage/ContactUsPage';
import './styles.css';

interface LandingPageProps{

	onClickUnsubscribe:()=>void;
}

export const LandingPage: React.FC<LandingPageProps> = (props) => {
	return (
		<>
		<div className='landingpage-container'>
			<h3>
				<span>#</span>VaccinateMe
			</h3>
			<div>
				<h5>Search for Vaccination Slot | Get Notified when available on email</h5>
			</div>
			<div onClick={()=>props.onClickUnsubscribe()} className="unsubscribe-msg">
				<span>If you wish to stop receiving emails, <span style={{cursor:"pointer"}}>click here to Unsubsribe</span></span>
			</div>
			<ContactUsPage/>
		</div>
		</>
	);
};
