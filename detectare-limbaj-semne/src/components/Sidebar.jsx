import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

//All the svg files
import Home from "../assets/home.svg";
import About from "../assets/about.svg";
import Camera from "../assets/camera.svg";
import Power from "../assets/power.svg";
import Book from "../assets/book.svg";
import Notebook from "../assets/notebook.svg";
import Administrator from "../assets/administrator.svg";
import User from "../assets/user.svg";
import Settings from "../assets/settings.svg";
import UserImage from "../assets/user-image.svg";
import Logo from "../assets/logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

const Container = styled.div`
.active {
  border-right: 4px solid var(--white);
  
  img {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
    brightness(103%) contrast(103%);
  }
}
`;

const SidebarContainer = styled.div`
  height: 90vh;
  opacity: ${(props) => (props.$clicked === "true" ? 1 : 0.2)};
  transition: all 0.3s ease;
`;

const Button = styled.button`
  &::before,
  &::after {
    content: "";
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    top: ${(props) => (props.$clicked === "true" ? "1.5" : "1rem")};
    transform: ${(props) => (props.$clicked === "true" ? "rotate(135deg)" : "rotate(0)")};
  }

  &::after {
    top: ${(props) => (props.$clicked === "true" ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.$clicked === "true" ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SlickBar = styled.ul`
width: ${(props) => (props.$clicked === "true" ? "20rem" : "3.5rem")};
transition: all 0.5s ease;
border-radius: 0 30px 30px 0;
`;

const Item = styled(NavLink)`
text-decoration: none;
color: var(--white);
width: 100%;
padding: 1rem 0;
cursor: pointer;

display: flex;
padding-left: 1rem;

&:hover {
  border-right: 4px solid var(--white);
  
  img {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg)
    brightness(103%) contrast(103%);
  }
}

img {
  width: 1.2rem;
  height: auto;
}
`;

const Profile = styled.div`
width: ${(props) => (props.$clicked === "true" ? "24rem" : "3rem")};
margin-left: ${(props) => (props.$clicked === "true" ? "20rem" : "0")};
transition: all 0.3s ease;

img {
  width: 2rem;
  height: auto;
  &:hover {
    border: 2px solid var(--grey);
    padding: 2px;
  }
}
`;

const Details = styled.div`
display: ${(props) => (props.$clicked === "true" ? "flex" : "none")};
`;

const Name = styled.div`
h4 {
  display: inline-block
}

a {
  font-size: 0.8rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
`;

const Logout = styled.button`
img {
  transition: all 0.3s ease;

  &:hover {
    border: none;
    padding: 0;
    opacity: 0.5;
  }
}
`;

const Text = styled.span`
width: ${(props) => (props.$clicked === "true" ? "100%" : "0")};
overflow: hidden;
white-space: nowrap;
margin-left: ${(props) => (props.$clicked ? "1.5rem" : "0")};
transition: all 0.3s ease;
`;

const Sidebar = ({ isAdmin, setIsLoggedIn, firstName, lastName }) => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [profileClick, setProfileClick] = useState(false);

  const handleClick = () => setClick((prevClick) => !prevClick)
  const handleProfileClick = () => setProfileClick((prevProfileClick) => !prevProfileClick);
  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false)
      navigate("/Login");
    })
  }

  return (
    <Container className="fixed z-10  ">
      <Button className="bg-primary-color border-none w-10 h-10 rounded-full mt-2 ml-2 cursor-pointer flex justify-center items-center relative" $clicked={click.toString()} onClick={handleClick} />
      <SidebarContainer
        as={motion.div}
        animate={{ opacity: (click || profileClick) ? 1 : 0.2 }}
        initial={{ opacity: 0.2 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-primary-color w-14 mt-4 rounded-r-[30px] py-4 flex flex-col items-center justify-between relative"
      >
        <div className="w-8">
          <img className="w-full h-auto" src={Logo} alt="logo" />
        </div>
        <SlickBar className="text-white list-none flex flex-col items-center bg-primary-color py-8 absolute top-24 left-0" $clicked={click.toString()}>
          <Item
            onClick={() => setClick(false)}
            to="/"
          >
            <img src={Home} alt="Home" />
            <Text $clicked={click.toString()}>Acasă</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/About"
          >
            <img src={About} alt="About" />
            <Text $clicked={click.toString()}>Despre Noi</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/Dictionary"
          >
            <img src={Book} alt="Dictionary" />
            <Text $clicked={click.toString()}>Dicționar Mimico Gestual</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/Practice"
          >
            <img src={Notebook} alt="Practice" />
            <Text $clicked={click.toString()}>Exersați</Text>
          </Item>
          {isAdmin ? (
            <Item
              onClick={() => setClick(false)}
              to="/Admin"
            >
              <img src={Administrator} alt="Admin" />
              <Text $clicked={click.toString()}>Panou Administrativ</Text>
            </Item>
          ) : (
            <></>
          )}
          <Item
            onClick={() => setClick(false)}
            to="/UserProfile"
          >
            <img src={User} alt="User Profile" />
            <Text $clicked={click.toString()}>Profil</Text>
          </Item>
        </SlickBar>
        <Profile className="h-12 py-2 px-4 rounded-[20px] flex items-center justify-center bg-primary-color text-white" $clicked={profileClick.toString()}>
          <img onClick={() => handleProfileClick()} src={UserImage} alt="Profile" />
          <Details className="w-full flex justify-between items-center" $clicked={profileClick.toString()}>
            <Name className="px-6 flex flex-col justify-center items-center">
              <h4>{`${firstName} ${lastName}`}</h4>
              <a href="/UserProfile">View&nbsp;profile</a>
            </Name>
            <Logout className="border-none w-8 h-8 bg-transparent" onClick={() => { handleLogout() }}>
              <img className="w-full h-auto" src={Power} alt="Logout" />
            </Logout>
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;