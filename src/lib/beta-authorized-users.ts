import BetaUsersList from './beta-users.json'
import DeveloperUsersList from './developer-beta-users.json'


export const BETA_AUTHORIZED_USERS = new Set(DeveloperUsersList.concat(BetaUsersList))
