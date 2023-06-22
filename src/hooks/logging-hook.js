//This is for logging purposes
//We save the action (update,insert,delete) so we know if it is reversable (delete)

const logging = (user,action,ID,table,description) => {
    try {
        const request = {
          method: "post",
        credentials: "include", 
        mode: "cors", redirect: "follow",

          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user,
            action: action,
            ID: ID,
            table: table,
            description: description
          }),
        };
  
        fetch(`/api/logging`, request);
      }
      catch (error) {
        console.error(error)
      } 

}

export default logging;