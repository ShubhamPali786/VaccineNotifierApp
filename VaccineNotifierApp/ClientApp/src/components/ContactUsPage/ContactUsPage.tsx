import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import "./styles.css"
export const ContactUsPage:React.FC<{}>=(props)=>{

    return  <div className="contact-page">
            <div className="linkedin-link" onClick={()=>window.open("https://www.linkedin.com/in/shubham-pali-006aa79a/")} >
                <FontAwesomeIcon color={"white"} icon={faLinkedin}  size={"2x"}/>
            </div>
            <div className="github-link" onClick={()=>window.open("https://www.linkedin.com/in/shubham-pali-006aa79a/")}>
                <FontAwesomeIcon color={"white"}  icon={faGithub} size={"2x"} />
            </div>
        </div>;
}