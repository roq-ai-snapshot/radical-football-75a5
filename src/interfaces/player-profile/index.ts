import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlayerProfileInterface {
  id?: string;
  player_id: string;
  coach_id: string;
  notes?: string;
  observations?: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  user_player_profile_player_idTouser?: UserInterface;
  user_player_profile_coach_idTouser?: UserInterface;
  _count?: {};
}

export interface PlayerProfileGetQueryInterface extends GetQueryInterface {
  id?: string;
  player_id?: string;
  coach_id?: string;
  notes?: string;
  observations?: string;
}
