Software FrameWorks Documentation

- Section 1) Describe the Organisation of your Git repository and how you used it during the development of your solution

  - My Git repository utilises branches to test and develop additional features that might need to be rolled back or drastically altered throughout production. When that particular feature is then complete I merge them onto my repositories main branch. 
  most of the development took place on the main branch with only some significant features with larger scope/codebase covereage were tested on their own safe branches away from main.

- Section 2) Description of data structures used in the client and server to represent the various entities, eg: users, groups, channels, etc.

- User()
-   My Users class contains contains all relevant information needing to be stored in the database. It contains fields for a username, email, password, birthdate, role and an array of groups they are apart of.

-   Group()
    - My Group class contains all relevant information assosciated with a singular group to be stored in the database. it contains fields for a creators username, the name of the group, a list of members, a list of channels, and a list for the waitlist.
 
- Message()
-   My message class contains all necessary information that should be contained and stored as a message, with fields for a sender, time of sending and a body for its content.

- Channel()
-   My channel class holds all information needed for a singular channel of a group. It contains fields for the name of the channel, the creator of it and also a list for message history

- Section 3) Angular Architecture
- I have used angular components mostly to act as entire pages, however did segment my UI/logic via the use of child components that were responsible for displaying/performing one piece of logic.
- I created and used two services, one for handling all of my API routes established on the node server (Api) and another for handling all of my socket related events (socketService). The Api service provides a safe and easy way for components to send/recieve data and information from my database and server without worrying about exploitation of giving the user too much control of data flow. Moreover, the socketservice also provides an easy way to define event behaviour/overrides in the frontend where needed to achieve things like realtime channel and group creation/deletion, chat messaging and leave/join notifications.

- Section 4) REST API/Sockets
  Routes:
    User Routes:
    CreateUserRoute()
    @params (username, email, password) via request body
    @returns success boolean and message string
    Route takes in user information via login form and creates a new user if the username is not already present in the database

  removeUserRoute()
  @params username via parameters
  @returns success boolean and a message string
  Route takes in a username (since they are unique) and deletes them from the Users database as well as clears all instances of them in group member lists etc

  updateProfileRoute()
  @params (username, email, age, birthdate) via request body. Token attached to authorization header.
  @returns success boolean and message:string
  Route takes in input from a form containing fields of a users details and attempts to update them in the database/server side.

  updateUserRole()
  @params (role) via req.body, username via parameters
  @returns success boolean message string
  Route takes in a username and a desired role to change to, it then updtes that users role within the database.

  userLoginRoute()
  @params (username, password) from request body
  @returns success boolean, message string and new jsonwebtoken containing their userID to be stored locally
  Route takes in user input login form information and attempts to match it with a user entry in the database. If successful generates a JSONWEBTOKEN with encrypted user ID to be stored locally

  getUsersRoute()
  @params (page, limit) sent via request parameters
  @returns success boolean, usernames, userIds, userRoles, pageLimit
  Route takes in a page and limit for pagination / performance and returns that amount/page of users details to be displayed

  Group Routes;
  CreateGroupRoute()
  @params group name and username via request body
  @returns valid boolean
  Route checks given username has right permissions to be making a group and then creates anew group in the database, sends out socket emit to update UI in realtime on the chat room page

  DeleteGroupRoute()
  @params groupID via request parametres
  @returns success boolean and message string
  Route takes in a groups mongo database ID and then deletes that entry from the database. sends out secket event to update the UI in realtime to users on the chat-room page

  getGroupsRoute()
  @params page, limit, username and useCase.
  @returns all relevant fields of groups including ID's, members, waitlist users, channels, creator
  Route takes in the above paramters via the request. Usecase is an optional input and determines whether or not the call is being made for the admin dashboard or the user dashboard/chat room. I use the non existance OR actual value given to usecase to filter
  and control the flow of data.

  addUserToGroupRoute()
  @params groupID, username via request paramters
  @returns success boolean message string
  Route finds user and group from the ID and username. It then checks that the user is on the groups waitlist and then removes them from it and adds them to the group member list

  addUserToWaitlistRoute()
  @params username groupID passed via request parameters
  @returns valid boolean message string
  Route finds that the given group and user exist. The user is then added to that groups waitlist, ready to be approved by a GroupAdmin/SuperAdmin

  Channel Routes:
  createChannelRoute()
  @params username, groupID, channelName
  @returns valid boolean
  This route creates a channel with the given name, created by the passed username within the given group. Socket events are emitted to update UI in realtime

  deleteChannelRoute()
  @params channelName, groupName, username via request parametres
  @returns valid boolean message string
  This route deletes a given channel from the given group

  getChannelMessagesRoute()
  @params group name and channelname via request parametres
  @returns valid boolean and an array of messages
  This route retrieves all channel messages for a channel. used when a user joins a channel in the chatroom.

  Utility Routes:
  verifyTokenRoute()
  @params token passed via authorization header
  @returns valid boolean and all information related to that users details aside from sensitive information like password
  This route verifies that a users encrypted token is valid and assosciated with an existing user, before returning all of their information to be used for processing/logic for the UI etc
  
  
  
  
