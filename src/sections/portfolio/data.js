// All assets are now in the public directory
// No need for imports - use direct paths

// Define base paths
const PORTFOLIO_PATH = "/Portfolio/";
const POSTER_PATH = "/Portfolio/poster/";

const data = [
  {
    id: 16,
    category: "Image",
    image: PORTFOLIO_PATH + "ReleaseRadar.jpg",
    title: "Release Reader",
    desc: 'A tool to find relevant changes in GitHub release notes. Filter releases by version range, keywords, and display options. <p><a class="portfolio__link" href="https://www.cdtio.com/release/" target="_blank" rel="noopener noreferrer">Open Release Reader</a></p>',
  },
  {
    id: 13,
    category: "Video",
    image: PORTFOLIO_PATH + "Video16.mov",
    poster: POSTER_PATH + "poster13.png",
    title: "Example Contao Website",
    // Background colors outside of container implemented with pseudo elements, not negative margins, ofc.
    desc: 'Contao CMS with PHP, JQuery and LESS. Special: Contact form implemented using grid-template-areas. <p><a class="portfolio__link" href="https://fewo-riesserbaur.de" target="_blank" rel="noopener noreferrer">View the Website</a></p>',
  },
  {
    id: 15,
    category: "Image",
    image: PORTFOLIO_PATH + "MathtronVue.png",
    title: "Mathtron Vue Migration",
    desc: 'Vue with Vuetify. Desktop app build with electron. <p><a class="portfolio__link" href="https://cdtio.com/mathtron" target="_blank" rel="noopener noreferrer">Open the project</a></p>',
  },
  {
    id: 14,
    category: "Image",
    image: PORTFOLIO_PATH + "NextjsPortfolio.png",
    title: "Next.js Portfolio Website",
    desc: 'Portfolio alternative using Next.js. Resulted in this script being created as byproduct: <p><a class="portfolio__link" href="https://github.com/dn177/Next.js-static-export-path-fix-script" target="_blank" rel="noopener noreferrer">Open the script code in Github</a></p><p className="mt-4"><a class="portfolio__link" href="https://www.cdtio.com/next" target="_blank" rel="noopener noreferrer">Open the Next Portfolio</a></p>',
  },
  {
    id: 11,
    category: "Video",
    image: PORTFOLIO_PATH + "Video15.mov",
    poster: POSTER_PATH + "poster11.png",
    title: "Mathtron",
    desc: "Spontaneously made Latex editor aiming to give a good experience for taking math notes and doing math exercises on the Desktop. \nBuild with Electron, React.js, TypeScript and Material UI. <p><a class='portfolio__link' href='https://github.com/dn177/Mathtron/blob/main/src/renderer/App.tsx' target='_blank' rel='noopener noreferrer'>View on Github</a></p>",
  },
  {
    id: 12,
    category: "Video",
    image: PORTFOLIO_PATH + "Video10.mov",
    poster: POSTER_PATH + "poster12.png",
    title: "Private Blog",
    desc: 'Selfmade Blog using React (and SWR), Next.js (and NextAuth), Node.js, MongoDB, Prisma, Firebase, Quill and Highlight.js. <p><a class="portfolio__link" href="https://cddm.medium.com" target="_blank" rel="noopener noreferrer">My Medium Blog Posts</a></p>',
  },
  {
    id: 10,
    category: "Video",
    image: PORTFOLIO_PATH + "Video14.mov",
    poster: POSTER_PATH + "poster10.png",
    title: "REST Fullstack Code Example",
    desc: 'React.js, TypeScript, Express.js/Node.js, SQLite3. <p>Node Backend with REST API.</p> <p><a class="portfolio__link" href="https://github.com/dn177/BasicREST/tree/main" target="_blank" rel="noopener noreferrer">View on Github</a></p>',
  },
  {
    id: 9,
    category: "Video",
    image: PORTFOLIO_PATH + "Video12.mov",
    poster: POSTER_PATH + "poster9.png",
    title: "E-Commerce",
    desc: "Next.js (and NextAuth), React.js, TypeScript, TailwindCSS and shadcn/ui. <p>Strapi Backend with REST API. Passwords pre-hashed using base64 and hashed with bcrypt for additional security.</p>",
  },
  {
    id: 8,
    category: "Video",
    image: PORTFOLIO_PATH + "Video13.mp4",
    poster: POSTER_PATH + "poster8.png",
    title: "Emmet Live Coding Demo",
    desc: "Live Coding showing proficiency with Emmet and CSS shortcuts.",
  },
  {
    id: 7,
    category: "Video",
    image: PORTFOLIO_PATH + "Video11.mov",
    poster: POSTER_PATH + "poster7.png",
    title: "Kanban Board",
    desc: "Kanban Board implementation using Vue.js, Express.js/Node.js and Bootstrap. REST API used in the backend.",
  },
  {
    id: 6,
    category: "Video",
    image: PORTFOLIO_PATH + "Video1.mov",
    poster: POSTER_PATH + "poster6.png",
    title: "Car Selling Platform",
    desc: "With React, Bootstrap and Strapi. Video shows filter funtionality which considers all input values. <p>Initial Prototype for a Project.</p>",
  },
  {
    id: 5,
    category: "Video",
    image: PORTFOLIO_PATH + "Video8.mov",
    poster: POSTER_PATH + "poster5.png",
    title: "Company Website",
    desc: 'Bootstrap with some AOS.js. Additionally some PHP for the contact form functionality. <p><a class="portfolio__link" href="https://strukturia-solar.de" target="_blank" rel="noopener noreferrer">"Solar" Website</a></p><p><a class="portfolio__link" href="https://www.strukturia-galabau.de" target="_blank" rel="noopener noreferrer">"Gala" Website</a></p><p><a class="portfolio__link" href="https://www.strukturia-bau.de" target="_blank" rel="noopener noreferrer">"Bau" Website</a></p>',
  },
  {
    id: 3,
    category: "Video",
    image: PORTFOLIO_PATH + "Video4.mov",
    poster: POSTER_PATH + "poster3.png",
    title: "Chart",
    desc: "Chart with options to redraw with different time units. Made with Chart.js. <p>The design and basic functionality was taken from Bootstrap Studio, as the client wished.</p>",
  },
  {
    id: 2,
    category: "Video",
    image: PORTFOLIO_PATH + "Video3.mov",
    poster: POSTER_PATH + "poster2.png",
    title: "cdnManager jQuery Version",
    desc: "Private Project, manages and stores CDNs. <p>Build with jQuery and Electron with focus on functionality for private usage.</p>",
  },
  {
    id: 1,
    category: "Image",
    image: PORTFOLIO_PATH + "Molar.png",
    title: "Molar",
    desc: '<a class="portfolio__link" href="https://www.idownloadblog.com/2016/04/12/molar/" target="_blank" rel="noopener noreferrer">View Article</a> <p><pre><code>onClick={(e) => e.currentTarget.requestFullscreen({ navigationUI: "show" })}</code></pre> So you know what happens when you click on the image.</p>',
  },
  // {
  //   id: 1,
  //   category: "Image",
  //   image: [
  //     { original: Image1, thumbnail: Image1 },
  //     {
  //       original: Image2,
  //       thumbnail: Image2,
  //     },
  //     {
  //       original: Image3,
  //       thumbnail: Image3,
  //     },
  //     {
  //       original: Image4,
  //       thumbnail: Image4,
  //     },
  //     {
  //       original: Image5,
  //       thumbnail: Image5,
  //     },
  //     {
  //       original: Image6,
  //       thumbnail: Image6,
  //     },
  //     {
  //       original: Image7,
  //       thumbnail: Image7,
  //     },
  //   ],
  //   title: "Contact Form",
  //   desc: "Multistep contact form made with Jquery and Bootstrap. Form validation on every step.",
  // },
];

export default data;
