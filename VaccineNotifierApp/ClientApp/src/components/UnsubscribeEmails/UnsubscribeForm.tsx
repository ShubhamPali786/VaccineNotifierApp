import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { axiosAPIInstance } from '../../AxiosBase';
import './styles.css';
interface UnsubsribeFormProps {
	onCancelClick:()=>void;
}

export const UnsubscribeForm: React.FC<UnsubsribeFormProps> = (props) => {
	const [email, setEmail] = useState('');
	const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(false);
	const onSubmitClick = (e: any) => {
		e.preventDefault();
		axiosAPIInstance.delete(`/api/slotbooking/unsubscribeuser/${email}`).then((res) => setUnsubscribeSuccess(true));
	};

	return (
		<form className="form-container" onSubmit={(e) => onSubmitClick(e)}>
	
			<p>
				we hope we have helped you to get vaccination slots, Please provide your email address to stop receiving
				emails.
			</p>
			<div className="mb-3">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					className="form-control"
					required
				/>
			</div>
			<div className="mb-3">
				<button  type="submit" className="btn btn-primary" >
					Unsubscribe
				</button>
				<button type="reset" className="btn btn-danger ms-3" onClick={(e) => {props.onCancelClick()}}>
					Cancel
				</button>
			</div>

			{unsubscribeSuccess && <div className="mb-3">
				<p>Your email has been Unsubscribed Successfully.</p>
				</div>}
		</form>
	);
};
