import {AiOutlineInstagram} from 'react-icons/ai'
import {AiOutlineTwitter} from 'react-icons/ai'
import {AiOutlineDribbble} from 'react-icons/ai'
import {AiFillGithub} from 'react-icons/ai'

export const links = [
    {id: 1, link: '#', titleKey: 'footer.home'},
    {id: 2, link: '#about', titleKey: 'footer.about'},
    {id: 3, link: '#services', titleKey: 'footer.services'},
    {id: 4, link: '#portfolio', titleKey: 'footer.portfolio'},
    {id: 5, link: '#contact', titleKey: 'footer.contact'}
]


export const socials = [
    {id: 1, link: 'https://instagram.com', icon: <AiOutlineInstagram/>},
    {id: 2, link: 'https://twitter.com', icon: <AiOutlineTwitter/>},
    {id: 3, link: 'https://dribbble.com', icon: <AiOutlineDribbble/>},
    {id: 4, link: 'https://github.com', icon: <AiFillGithub/>}
]