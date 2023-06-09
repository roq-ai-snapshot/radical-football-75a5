import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ParentChildInterface {
  id?: string;
  parent_id: string;
  child_id: string;
  created_at?: Date | string;
  updated_at?: Date | string;

  user_parent_child_parent_idTouser?: UserInterface;
  user_parent_child_child_idTouser?: UserInterface;
  _count?: {};
}

export interface ParentChildGetQueryInterface extends GetQueryInterface {
  id?: string;
  parent_id?: string;
  child_id?: string;
}
