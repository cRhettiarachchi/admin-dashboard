import { Property } from './Property';

export interface User {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  room_number: number;
  password: string | null;
  phone: number;
  property: Property | any;
  notes: string | null;
  payment_frequency: number;
  in_arrears: boolean;
  rent: number;
  email: string;
  id: string;
  name: string;
  isEmailVerified: boolean;
  role: string;
}

export interface UserFlatten {
  first_name: string;
  middle_name: string | null;
  last_name: string;
  room_number: number;
  password: string | null;
  phone: number;
  property_id: string | undefined;
  property_property_type: string;
  property_property_name: string;
  property_no_of_rooms: number;
  property_address_line_1: string;
  property_address_line_2: string;
  property_town: string;
  property_region: string;
  property_country: string;
  property_post_code: string;
  property_notes: string;
  notes: string | null;
  payment_frequency: number;
  in_arrears: boolean;
  rent: number;
  email: string;
  id: string;
  name: string;
  isEmailVerified: boolean;
  role: string;
}
