# Wrap Up

The payment proccess is a pretty long proccess with a lot of steps, there's collecting the payment method, then verifying it, charging it, manage payments and only then process the order. These are very complex taks, both from a legal and technical side. Stripe will be used as a middleman

## How does it work?

We'll collect credit card data and then send it to the stripe servers to validate that input. Once it is valid, stripe will return a token which includes that credit card data and the confirmation that it is correct, then we send that token to our server, so (once it's valid) we charge the payment method and then with the help of stripe again we create a payment, we send that to stripe with a token and the price included and stripe will then do the charge and gives us a response. Once this is done and we can store this in the database.
