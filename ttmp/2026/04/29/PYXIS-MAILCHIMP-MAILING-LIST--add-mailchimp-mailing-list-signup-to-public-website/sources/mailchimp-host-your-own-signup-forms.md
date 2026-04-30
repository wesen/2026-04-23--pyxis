![](https://mailchimp.com/ctf/images/yzco4xsimv0y/Q1XaXEiUgMhAyHgiNY6hO/c5697714c405ff6f4fea7b32ed288c88/KB_Banner_1500x855_2.png?w=240&fm=avif&q=60)

**Get the job done with a pro**

From training to full-service marketing, our community of partners can help you make things happen.

[Hire A Partner](https://mailchimp.com/experts/)

To use a custom signup form on your website that transmits subscriber data to your Mailchimp audience, you'll need to add some Mailchimp information to your form code. You'll locate the form action, user ID, audience ID, and input name elements in your hosted Mailchimp form, and insert them into the form you host on your website.

This is an advanced feature and is recommended for users familiar with custom coding. Contact your developer, or hire a [Mailchimp Expert](https://mailchimp.com/experts/) if you need assistance.

In this article, you'll learn where to find this information.

## Access the Mailchimp form code

1. Click **Forms**, then click **Other forms**.
2. Scroll to the **Form builder** tile, then click **Manage forms**.
3. If you have more than 1 audience, click the **Audience** drop-down and choose the one you want to work with.
4. Highlight and copy the **Signup form URL**.  
	![](https://mailchimp.com/ctf/images/yzco4xsimv0y/3NGc8O45hcaaCeDEEbZxIV/d24eaf18e0602ffbac2fe88f269a458c/signup-forms-signup-form-URL.png?w=350)
5. Paste the **Signup form URL** into the address bar of a new browser tab or window.
6. Right-click (Windows) or control+click (Mac) anywhere on the page and choose **View Page Source** from the drop-down.  
	![View page source.](https://mailchimp.com/ctf/images/yzco4xsimv0y/6opm1UHbnaIy2wsS4sSaGq/83d69309e119e84dc1e64227acda3139/view-page-source.jpg?w=600)

## Edit your custom signup form

In the page source for your Mailchimp hosted signup form, you'll find the pieces of code that need to be added to the form code on your website.

First, copy and paste the form action and input information into the body of your custom signup form. Then, find the input type for each audience field, and copy that information into the corresponding fields in your custom signup form code. All of these values must be copied to your custom signup form for the data transfer to work properly.

1. Browse or search the page for "form action" to find the first piece of code you need, and copy the lines that look something like this.
	```
	<form action="http://mailchimp.us8.list-manage.com/subscribe/post" method="POST">
	<input type="hidden" name="u" value="a123cd45678ef90g7h1j7k9lm">
	<input type="hidden" name="id" value="ab2c468d10">
	```
	The code indicates your user ID and audience ID so we can link the information to the right place in your Mailchimp account.
2. Paste those rows into the hosted form code on your website.
3. Scroll to find the first audience field, like Email Address, and look for the <input> tag.
	```
	<input type="email" name="MERGE0" id="MERGE0">
	```
4. Copy the name value and insert text into the matching tag in your custom signup form. In this case, the name value is MERGE0.
5. Repeat steps 3 and 4 for every audience field in your custom signup form.

As always, test your form thoroughly. Visit your custom form and sign up with information in every field. Confirm your subscription, and then [search for your subscriber profile](https://mailchimp.com/help/search-your-account/) in Mailchimp. Check out all values and make sure that all fields transfer correctly.

**Technical Support**

---