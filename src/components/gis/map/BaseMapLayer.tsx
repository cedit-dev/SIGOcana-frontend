import { TileLayer } from "react-leaflet";
import { BASE_MAPS, BaseMapKey } from "@/data/base-maps";

export default function BaseMapLayer({ baseMap }: { baseMap: BaseMapKey }) {
  const config = BASE_MAPS[baseMap];
  return <TileLayer key={baseMap} url={config.url} attribution={config.attribution} />;
}
