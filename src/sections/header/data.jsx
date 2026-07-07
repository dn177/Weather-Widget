import { AiFillGithub } from "react-icons/ai";

const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

const data = [
  {
    id: 1,
    label: "GitHub repositories",
    link: "https://github.com/dn177?tab=repositories",
    icon: <AiFillGithub />,
  },
  {
    id: 2,
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
