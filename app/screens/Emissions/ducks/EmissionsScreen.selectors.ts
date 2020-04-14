import { map, pipe, groupBy, toPairs, sum } from "ramda";
import { emissions } from "../../../ducks";
import { Emission } from "../../../interfaces";
import { calculation, ui } from "../../../utils";

interface EmissionListItem {
  id: string;
  isMitigated: boolean;
  name: string;
  title: string;
  creationDate: string;
  co2value: number;
  iconName: string;
  onPress: () => void;
}

const getEmissionListItem = (item: Emission) => {
  const emissionItem: EmissionListItem = {
    id: item.id,
    isMitigated: item.isMitigated,
    name: item.name,
    title: ui.getTranslationModelType(item.emissionModelType),
    creationDate: item.creationDate,
    co2value: calculation.getC02ValueFromEmission(item),
    iconName: ui.getIconFromModelType(item.emissionModelType),
    onPress: () => {
      // do nothing.
    },
  };

  return emissionItem;
};

const getStartOfMonth = (time) => {
  const date = new Date(time);
  date.setDate(1);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
};

const groupByMonth = groupBy((item: EmissionListItem) =>
  getStartOfMonth(item.creationDate)
);

const dateObjMap = map(([date, data, co2value]) => ({
  date: date,
  data: data,
  co2value: co2value,
}));

/* moment().utc().toISOString() gives "YYYY-MM-DDTHH:mm:ss.sssZ" */
const filterByMostRecent = (array: [EmissionListItem]) =>
  array.sort((a, b) => +new Date(b.creationDate) - +new Date(a.creationDate));

const getMonthlyPourcentage = (items) =>
  map(
    (item) => [...item, sum(map((emission) => emission.co2value, item[1]))],
    items
  );

const getEmissions = (state) =>
  pipe(
    emissions.selectors.getAllEmissions,
    map(getEmissionListItem),
    filterByMostRecent,
    groupByMonth,
    toPairs,
    getMonthlyPourcentage,
    dateObjMap
  )(state);

export default {
  getEmissions,
  getEmissionListItem,
};
