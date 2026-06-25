Webhooks Review
A webhook is just an event that's sent to your server by an external service. There are just a couple of things to keep in mind when building a webhook handler:

The third-party system will probably retry requests multiple times, so your handler should be idempotent.
Be extra careful to never "acknowledge" a webhook request unless you processed it successfully. By sending a 2XX code, you're telling the third-party system that you processed the request successfully, and they'll stop retrying it.
When you're writing a server, you typically get to define the API. However, when you're integrating a webhook from a service like Stripe, you'll probably need to adhere to their API: they'll tell you what shape the events will be sent in.