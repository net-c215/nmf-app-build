import React from "react";
import renderer from "react-test-renderer";
import EmissionsScreen from "../EmissionsScreen";

it("EmissionsScreen renders correctly", () => {
  let props: any;
  const tree = renderer.create(<EmissionsScreen {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});
