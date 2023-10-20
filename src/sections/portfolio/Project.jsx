import React from "react";
import Card from "../../components/Card";
import ImageGallery from "react-image-gallery";
import { useRef } from "react";
import "./portfolio.css";

const Project = ({ project }) => {
  const gallery = useRef(null);

  const handleClick = () => {
    console.log(gallery);
    gallery.current.toggleFullScreen();
  };

  return (
    <Card
      className={`portfolio__project ${
        project.category === "video" ? " portfoliovideo" : ""
      }`}
    >
      <div className="portfolio__project-image">
        {project.category === "video" ? (
          // <video
          //   muted={true}
          //   autoplay={true}
          //   preLoad={"auto"}
          //   loop={true}
          //   className="videoresource"
          // >
          <video muted playsInline controls loop className="videoresource">
            <source src={project.image} type="video/mp4" />
          </video>
        ) : Array.isArray(project.image) ? (
          <ImageGallery
            items={project.image}
            additionalClass="galleryimg"
            showThumbnails={false}
            ref={gallery}
            onClick={handleClick}
          />
        ) : (
          <img src={project.image} alt="Portfolio Project Image" />
        )}
      </div>
      <h4 className="portfolio__project-title">{project.title}</h4>
      <p
        className="portfolio__project-desc"
        dangerouslySetInnerHTML={{ __html: project.desc }}
      ></p>
    </Card>
  );
};

export default Project;
