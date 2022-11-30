// eslint-disable-next-line import/named
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import UserTypeEnum from '~/models/UserTypeEnum'
import FileAction from '~/models/FileAction'

export const state = () => ({
  pageName: '',
  pdfPageName: {},
  pdfUser: [],
  originalPdfFiles: [],
  filterUser: '',
  setPackage: {},
  initialUser: {},
  createPackage: undefined,
  beTeamMember: true as any,
  editAnnotation: true,
  loadedPdfFile: {},
  pdfExit: false,
  pdfScale: 1.345,
  pdfOffset_y: 0,
  pdfOffset_x: 0,
  scrollPosition: false,
  agreeSign: -1
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  profilePhoto(state: any) {
    const user = state.auth.user
    if (!user) return ''

    if (user.profilePicture != null) return user.profilePicture

    return '/img/placeholder_picture.png'
  },
  userType(state: any) {
    const user = state.auth.user
    if (!user) return ''
    // return UserTypeEnum.PAID

    return user.role

    // return UserTypeEnum.FREE === 'free_user'

    // const userType = (<any>UserTypeEnum)[user.role]

    // if (!userType) return UserTypeEnum.FREE
    // else return userType

    // // switch (user.role) {
    // //   case 'free_user':
    // //     return UserTypeEnum.FREE
    // //   case 'paid_user':
    // //     return UserTypeEnum.PAID
    // //   default:
    // //     return UserTypeEnum.FREE
    // // }
  },
}

export const mutations: MutationTree<RootState> = {
  // -- Setting the user --
  SET_PAGE_USER(state, user) {
    state.initialUser = user
  },
  SET_AGREE_SIGN(state) {
    state.agreeSign = 1;
  },
  UN_SET_AGREE_SIGN(state) {
    state.agreeSign = 0;
  },
  // -- Setting the routed page name --
  SET_PAGE_NAME(state, { name }: { name: string }) {
    state.pageName = name
  },

  // -- Setting the pdf page name --
  SET_PDF_PAGE_NAME(state, pdfRouteObj: object) {
    state.pdfPageName = pdfRouteObj
  },
  // -- Setting the pdf page name --
  SET_PDF_EXIT(state, pdfExitPayload: boolean) {
    state.pdfExit = pdfExitPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_Y(state, pdfOffsetPayload: number) {
    state.pdfOffset_y = pdfOffsetPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_X(state, pdfOffsetPayload: number) {
    state.pdfOffset_x = pdfOffsetPayload
  },
  // -- All info from a package --
  PACKAGE_INFO(state, info) {
    state.setPackage = info
  },

  // -- All info from a package --
  TEAM_MEMBER(state, team) {
    state.beTeamMember = team
  },

  // -- Setting a variable for custom package --
  PACKAGE_CREATE(state, condition) {
    state.createPackage = condition
  },

  // -- Getting all user file --
  FILTER_USERs(state, filter) {
    // set the initial state
    state.pdfUser = state.originalPdfFiles
    switch (filter.toLowerCase()) {
      case FileAction.LEDGER:
        (state.pdfUser as any) = state.pdfUser
        break;
      case FileAction.SHARED:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.shared != null)
        break;
      case FileAction.SAVED:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.favourites.length > 0)
        break;
      default:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.fileAction == filter.toLowerCase())
        break
    }
    // //filter the initial state and set all if ledger
    // if (filter != 'ledger') {
    //   state.pdfUser = filter != 'shared' ? state.pdfUser.filter(
    //     (item: any) => item.fileAction == filter.toLowerCase()
    //     ) : state.pdfUser.filter(
    //       (item: any) => item.shared != null
    //       )

    // } else {
    //   state.pdfUser = state.pdfUser
    // }
  },

  // -- Resetting the state of the total user-files --
  ADD_USER(state, pdfFiles) {
    state.pdfUser = pdfFiles
    state.originalPdfFiles = pdfFiles
  },
  SET_EDIT_ANNOTATION(state, condition) {
    state.editAnnotation = condition
  },
  SET_LOADED_PDF(state, pdfFile) {
    state.loadedPdfFile = pdfFile
  },

  SET_PDF_PAGE_BOTTOM(state) {
    state.scrollPosition = true;
  }
}

export const actions: ActionTree<RootState, RootState> = {}
