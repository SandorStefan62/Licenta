import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../index.css"

//All the svg files
import Home from "../assets/home.svg";
import About from "../assets/about.svg";
import Camera from "../assets/camera.svg";
import Power from "../assets/power.svg";

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
    top: ${(props) => (props.clicked === "true" ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked === "true" ? "rotate(135deg)" : "rotate(0)")};
  }

  &::after {
    top: ${(props) => (props.clicked === "true" ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked === "true" ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

const SlickBar = styled.ul`
width: ${(props) => (props.clicked === "true" ? "20rem" : "3.5rem")};
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
  filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg)
  brightness(78%) contrast(85%);
}
`;

const Profile = styled.div`
width: ${(props) => (props.clicked === "true" ? "14rem" : "3rem")};
margin-left: ${(props) => (props.clicked === "true" ? "9rem" : "0")};
transition: all 0.3s ease;

img {
  &:hover {
    border: 2px solid var(--grey);
    padding: 2px;
  }
}
`;

const Details = styled.div`
display: ${(props) => (props.clicked === "true" ? "flex" : "none")};
`;

const Name = styled.div`
h4 {
  display: inline-block
}

a {
  font-size: 0.8rem;
  text-decoration: none;
  color: var(--grey);

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
width: ${(props) => (props.clicked === "true" ? "100%" : "0")};
overflow: hidden;
white-space: nowrap;
margin-left: ${(props) => (props.clicked ? "1.5rem" : "0")};
transition: all 0.3s ease;
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [profileClick, setProfileClick] = useState(false);

  const handleClick = () => setClick((prevClick) => !prevClick);
  const handleProfileClick = () => setProfileClick((prevProfileClick) => !prevProfileClick);
  const handleLogout = () => {
    navigate("/Login");
  }

  return (
    <Container className="fixed">
      <Button className="bg-primary-color border-none w-10 h-10 rounded-full mt-2 ml-2 cursor-pointer flex justify-center items-center relative" clicked={click.toString()} onClick={() => handleClick()} />
      <SidebarContainer className="bg-primary-color w-14 mt-4 rounded-r-[30px] py-4 flex flex-col items-center justify-between relative">
        <div className="w-8">
          <img className="w-full h-auto" src="" alt="logo" />
        </div>
        <SlickBar className="text-white list-none flex flex-col items-center bg-primary-color py-8 absolute top-24 left-0" clicked={click.toString()}>
          <Item
            onClick={() => setClick(false)}
            to="/"
          >
            <img src={Home} alt="Home" />
            <Text clicked={click.toString()}>Home</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/About"
          >
            <img src={About} alt="About" />
            <Text clicked={click.toString()}>About Us</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            to="/Detection"
          >
            <img src={Camera} alt="Camera" />
            <Text clicked={click.toString()}>Sign Language Detection</Text>
          </Item>
        </SlickBar>
        <Profile className="h-12 py-2 px-4 rounded-[20px] flex items-center justify-center bg-primary-color text-white" clicked={profileClick.toString()}>
          <img onClick={() => handleProfileClick()} src="" alt="Profile" />
          <Details className="justify-space-between items-center" clicked={profileClick.toString()}>
            <Name className="px-6 flex flex-col justify-center items-center">
              <h4>John Doe</h4>
              <a href="/#">View&nbsp;profile</a>
            </Name>
            <Logout className="border-none w-8 h-8 bg-transparent" onClick={() => handleLogout()}>
              <img className="w-full h-auto" src={Power} alt="Logout" />
            </Logout>
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;