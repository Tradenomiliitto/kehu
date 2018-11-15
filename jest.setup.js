import React from "react";
import fetch from "jest-fetch-mock";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

global.React = React;
global.shallow = shallow;
global.fetch = fetch;
