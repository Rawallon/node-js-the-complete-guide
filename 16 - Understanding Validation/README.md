# Wrap Up

## Why Validate

If a users fills and sends a form to the server through a post request, without any form of validation can be dangerous, with this module a validation middleware was added return some information about that validation

## How to validate

Validation can be done both client and server side.

### Client side

When done on client-side it can check every key input at run time, greatly enhancing the user experience, however, the server cannot garantee that the validation wasn't tinkered with or maybe the user may have disabled javascript.

So whilist it helps UX it never should be considerd secure.

### Server side

This is what was implemented this module, and can is pretty much required to any site, it's considered secure since the user can't touch it.

Another important thing to remember when talking about server-side validation is to return both a warning and the previous input value, since it would be horrible to have to retype everthing just because there was an field missing.

There's also validation in the DB, but since the focus is on Node this was skipped.
