
 interface Error{
    error: object
 }
   
   export function ErrorHandler( error : Error){
      console.log("error-handler",error)
      // return
    //getting the error
     let message = (error as any)?.data?.errors[0] || (error as any)?.data?.message;
   //   ErrorHandler(response)
   console.log("error-handler",message)
   //  return
    if( (message?.message || message)?.includes("email")) return ("Email already exists");

    else if((message?.message || message)?.includes("phone")) return ("Phone number already exists");

    else if((message?.message || message)?.includes("Invalid login")) return ("Email or password is Incorrect") ;

    else if(message == undefined) {
      return ("Network error")
    } 
    else if((message?.message || message)?.includes("subscriptions.userId")) {
      return ("You are already a subscribe user") 
    } 
    else if((message?.message || message)?.includes("Cannot read properties of undefined (reading 'teamMembers')")) {
      return ("Team trying to join does not exist") 
    }
    else if((message?.message || message)?.includes("Stripe")) {
      return ("Error occured, Trying to send card info") 
    }
 
    

    //   return(message.message.includes("email"))
   }