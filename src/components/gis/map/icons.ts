import L from "leaflet";

/**
 * Creates a Leaflet divIcon for the origin point (A).
 */
export function createOriginIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:32px;height:40px;">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(74,124,89,0.45));">
        <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 24 12 24S28 23 28 14C28 7.373 22.627 2 16 2z" fill="#4a7c59"/>
        <path d="M16 3C9.925 3 5 7.925 5 14c0 8.5 11 22.5 11 22.5S27 22.5 27 14C27 7.925 22.075 3 16 3z" fill="#5d9a6e"/>
        <circle cx="16" cy="14" r="7" fill="white" opacity="0.95"/>
        <text x="16" y="18" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="9" fill="#4a7c59">A</text>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

/**
 * Creates a Leaflet divIcon for the destination point (B).
 */
export function createDestinationIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:32px;height:40px;">
      <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:32px;height:40px;filter:drop-shadow(0 3px 6px rgba(220,53,69,0.45));">
        <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 24 12 24S28 23 28 14C28 7.373 22.627 2 16 2z" fill="#c0392b"/>
        <path d="M16 3C9.925 3 5 7.925 5 14c0 8.5 11 22.5 11 22.5S27 22.5 27 14C27 7.925 22.075 3 16 3z" fill="#e74c3c"/>
        <circle cx="16" cy="14" r="7" fill="white" opacity="0.95"/>
        <text x="16" y="18" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="700" font-size="9" fill="#c0392b">B</text>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}
