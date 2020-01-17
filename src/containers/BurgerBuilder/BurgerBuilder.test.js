import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
configure({ adapter: new Adapter() });
import React from "react";

import { BurgerBuilder } from "./BurgerBuilder";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";

describe("<BurgerBuilder />", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}} />);
  });
  it("it should render <BuildControls /> when ingredients are passed as props", () => {
    wrapper.setProps({ ingredients: { salad: 0, cheese: 2 } });
    expect(wrapper.find(BuildControls)).toHaveLength(1);
  });
  it("it should not render <BuildControls /> when ingredients are not passed as props", () => {
    expect(wrapper.find(BuildControls)).toHaveLength(0);
  });
});
