import UserTypeEnum from '~/models/UserTypeEnum'

export default interface AuthUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  social_id?: string
  social_media?: string
  profile_picture?: string
  country?: string
  state?: string
  timezone?: string
  role: UserTypeEnum
  email_verified_at?: string
  created_at: string
  updated_at: string
  [key: string]: any
}
