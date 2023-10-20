import Image1 from "../../assets/Portfolio/Bild1.png";
import Image2 from "../../assets/Portfolio/Bild2.png";
import Image3 from "../../assets/Portfolio/Bild3.png";
import Image4 from "../../assets/Portfolio/Bild4.png";
import Image5 from "../../assets/Portfolio/Bild5.png";
import Image6 from "../../assets/Portfolio/Bild6.png";
import Image7 from "../../assets/Portfolio/Bild7.png";
import Image8 from "../../assets/Portfolio/Bild8.png";
import Image9 from "../../assets/Portfolio/Video1.mov";
import Image10 from "../../assets/Portfolio/Video2.mov";
import Image11 from "../../assets/Portfolio/Video3.mov";
import Image12 from "../../assets/Portfolio/Video4.mov";
import Image13 from "../../assets/Portfolio/Video5.mov";
import Image14 from "../../assets/Portfolio/Video6.mov";
import Image15 from "../../assets/Portfolio/Video7.mov";
import Image16 from "../../assets/Portfolio/Video8.mov";
import Image17 from "../../assets/Portfolio/Video9.mov";

const data = [
  {
    id: 1,
    category: "video",
    image: Image17,
    title: "Amazon Clone",
    desc: "Amazon Clone using React.js (and Redux), Next.js (and NextAuth), Webhooks, Tailwind.css, Firestore and Stripe.",
  },
  {
    id: 2,
    category: "video",
    image: Image16,
    title: "Company Website",
    desc: 'Bootstrap with some AOS.js.<p><a class="portfolio__link" href="https://strukturia-solar.de">Solar Website</a></p><p><a class="portfolio__link" href="https://www.strukturia-galabau.de">Gala Website</a></p><p><a class="portfolio__link" href="https://www.strukturia-bau.de">Bau Website</a></p>',
  },
  {
    id: 3,
    category: "video",
    image: Image9,
    title: "Car Selling Platform",
    desc: "With React, Bootstrap and Strapi. Video shows filter funtionality which considers all input values.",
  },
  {
    id: 4,
    category: "video",
    image: Image10,
    title: "Sidenavigation",
    desc: "Sidenavigation using jQuery and Bootstrap.",
  },
  {
    id: 5,
    category: "video",
    image: Image11,
    title: "cdnManager jQuery Version",
    desc: "Manages and Stores Bookmarks. Build with jQuery and Electron.",
  },
  {
    id: 6,
    category: "video",
    image: Image12,
    title: "Chart",
    desc: "Chart with options to redraw Chart with different time units. Made with Chart.js.",
  },
  {
    id: 7,
    category: "video",
    image: Image13,
    title: "Timeline",
    desc: "Timeline made with AOS.js, Bootstrap and some advanced CSS.",
  },
  {
    id: 8,
    category: "video",
    image: Image14,
    title: "Text Grid",
    desc: "Made with JS and CSS, also made the same with jQuery.",
  },
  {
    id: 9,
    category: "video",
    image: Image15,
    title: "Map with Hover",
    desc: "Made with Bootstrap.",
  },
  {
    id: 10,
    category: "image",
    image: [
      { original: Image1, thumbnail: Image1 },
      {
        original: Image2,
        thumbnail: Image2,
      },
      {
        original: Image3,
        thumbnail: Image3,
      },
      {
        original: Image4,
        thumbnail: Image4,
      },
      {
        original: Image5,
        thumbnail: Image5,
      },
      {
        original: Image6,
        thumbnail: Image6,
      },
      {
        original: Image7,
        thumbnail: Image7,
      },
    ],
    title: "Contact Form",
    desc: "Multistep contact form made with Jquery and Bootstrap.",
  },
  {
    id: 11,
    category: "image",
    image: Image8,
    title: "Map with Hover",
    desc: "Made with Bootstrap.",
  },
];

export default data;
