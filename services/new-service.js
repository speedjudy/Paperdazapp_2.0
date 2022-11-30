import { server, NEW_BASE_URL } from "../utils/axios-utils"
import axios from 'axios'
import { FAQ_URL } from "../utils/axios-utils"

   export async function faq(){  
         async () => { 
               const data = await axios.get(FAQ_URL)
           return console.log(data)
            }
    }


