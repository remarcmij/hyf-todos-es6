## 2016-12-12

- Replaced HTTP PUT method with PATCH method in case of updates
- Returning HTTP status 204 instead of 200 if not content is returned

## 2016-12-09

- Added unit testing for the server api endpoints
- The server now returns a new list on POST and DELETE and request (except when deleting all todos). 
The client handles the returned lists to update the UI.
- Removed unused `todo` and `user` states.
- Introduces modules for `todoUsers` and `userTodos` states, and resolving required data before entering
the states.
- Added a FAB (Floating Action) button to add a todo or user.

## 2016-12-07

### Initial version