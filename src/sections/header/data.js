import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiOutlineDribbble } from "react-icons/ai";
import { AiFillGithub } from "react-icons/ai";
import { AiOutlineMediumWorkmark } from "react-icons/ai";

const data = [
  { id: 1, link: "https://instagram.com", icon: <AiOutlineInstagram /> },
  { id: 2, link: "https://twitter.com", icon: <AiOutlineTwitter /> },
  { id: 3, link: "https://dribbble.com", icon: <AiOutlineDribbble /> },
  {
    id: 4,
    link: "https://github.com/dn177?tab=repositories",
    icon: <AiFillGithub />,
  },
  {
    id: 5,
    link: "https://cddm.medium.com",
    icon: <AiOutlineMediumWorkmark />,
  },
];

export default data;
