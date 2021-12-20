import { Property } from './Property';

export interface Payment {
  id: string | undefined;
  amount: number;
  payment_date: Date;
  payment_type: string;
  is_on_time: boolean;
  user_id: string;
  payment_id: string;
}

export interface PaymentFlatten {
  id: string | undefined;
  amount: number;
  payment_date: Date;
  payment_type: string;
  is_on_time: boolean;
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
  user_first_name: string;
  user_middle_name: string | null;
  user_last_name: string;
  user_room_number: number;
  user_password: string | null;
  user_phone: number;
  user_property: Property | any;
  user_notes: string | null;
  user_payment_frequency: number;
  user_in_arrears: boolean;
  user_rent: number;
  user_email: string;
  user_id: string;
  user_name: string;
  user_isEmailVerified: boolean;
  user_role: string;
}
