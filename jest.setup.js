import "@babel/polyfill";
import { TextEncoder, TextDecoder } from "util";
import React from "react";
import fetch from "jest-fetch-mock";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.React = React;
global.shallow = shallow;
global.fetch = fetch;
