import React from "react";
import { useTranslation } from 'react-i18next';
import "./contact.css";
import contacts from "./data";

// Assets are now in public directory
const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="position-relative">
      {/* <img src={Zacuelu} alt="Zacuelu" loading="lazy" /> */}
      <img
        className="bg-img"
        src={`${process.env.PUBLIC_URL}/Zacuelu_800w.jpg`}
        srcSet={`${process.env.PUBLIC_URL}/Zacuelu_400w.jpg 400w, 
             ${process.env.PUBLIC_URL}/Zacuelu_800w.jpg 800w, 
             ${process.env.PUBLIC_URL}/Zacuelu_1200w.jpg 1200w`}
        sizes="(max-width: 600px) 400px, 
            (max-width: 1200px) 800px, 
            1200px"
        alt="Ancient stepped pyramid at Zaculeu, Guatemala"
        loading="lazy"
      />
      <div className="contact-wrapper">
        <h6 className="h1 text-center">{t('contact.title')}</h6>
        <p className="mt-3 text-center">
          {t('contact.description')}
        </p>
        <div className="container contact__container">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
