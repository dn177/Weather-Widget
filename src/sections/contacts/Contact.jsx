import React from "react";
import { useTranslation } from 'react-i18next';
import "./contact.css";
import contacts from "./data";

const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

// Assets are now in public directory
const Contact = () => {
  const { t } = useTranslation();
  
  return (
    <section id="contact" className="position-relative">
      <img
        className="bg-img"
        src={`${PUBLIC_URL}/Zacuelu_800w.jpg`}
        srcSet={`${PUBLIC_URL}/Zacuelu_400w.jpg 400w, 
             ${PUBLIC_URL}/Zacuelu_800w.jpg 800w, 
             ${PUBLIC_URL}/Zacuelu_1200w.jpg 1200w`}
        sizes="(max-width: 600px) 400px, 
            (max-width: 1200px) 800px, 
            1200px"
        alt="Ancient stepped pyramid at Zaculeu, Guatemala"
        loading="lazy"
      />
      <div className="contact-wrapper">
        <h2 className="h1 text-center">{t('contact.title')}</h2>
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
