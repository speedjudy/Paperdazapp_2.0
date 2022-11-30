import UserTypeEnum from '~/models/UserTypeEnum'

export default function ({ store, redirect }) {
  // If the user is not a free user
  if (store.getters.userType !== UserTypeEnum.FREE) {
    return redirect('/dashboard')
  }
}
