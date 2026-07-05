import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiOutlineDribbble } from "react-icons/ai";
import { AiFillGithub } from "react-icons/ai";

const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const data = [
  {
    id: 1,
    label: "Instagram profile",
    link: "https://instagram.com",
    icon: <AiOutlineInstagram />,
  },
  {
    id: 2,
    label: "Twitter profile",
    link: "https://twitter.com",
    icon: <AiOutlineTwitter />,
  },
  {
    id: 3,
    label: "Dribbble profile",
    link: "https://dribbble.com",
    icon: <AiOutlineDribbble />,
  },
  {
    id: 4,
    label: "GitHub repositories",
    link: "https://github.com/dn177?tab=repositories",
    icon: <AiFillGithub />,
  },
  {
    id: 5,
    label: "Hugging Face profile",
    link: "https://huggingface.co/cdtio33",
    icon: (
      <img
        className="header__social-icon"
        src={`${PUBLIC_URL}/hugging-face.png`}
        alt=""
      />
    ),
  },
];

export default data;
