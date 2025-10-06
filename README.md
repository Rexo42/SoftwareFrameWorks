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
