import React from 'react';
import { Footer } from './footer/Footer';
import { Header } from './header/Header';

export const Layout: React.FC<{}> = (props) => {
	return (
		<>
			<main>{props.children}</main>
		</>
	);
};
