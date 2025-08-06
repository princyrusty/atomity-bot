export type Sender = 'user' | 'ai';

export type AttachmentType = 'image' | 'pdf' | 'text';

export interface MessageAttachment {
    name: string;
    type: AttachmentType;
    // For image previews
    dataUrl?: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  attachment?: MessageAttachment;
}

export interface MapLocation {
  lat: number;
  lng: number;
  label: string;
}

export type MapPath = Array<{
  lat: number;
  lng: number;
}>;

export interface MapView {
    lat: number;
    lng: number;
    zoom: number;
}

export interface MapData {
  locations: MapLocation[];
  paths: MapPath[];
  view?: MapView;
}