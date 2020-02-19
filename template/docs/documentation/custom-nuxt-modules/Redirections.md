# Redirections 🔀

## The idea 😏

[Alban 🔥] There's always a moment when your client (often at the project's end) will ask you:

> "How do I handle the redirections? 🤔".

If you didn't thought about it... well, you'll be in lateral safety position 😂

**🚀 BUT NOT WITH THIS MODULE 🚀**

## Easy peasy lemon squeezy 👌

One single config file. The one and only file's output: a query!

In this query you'll need to get all your redirection texts. Then... that's done ✅

The module will get all of those and write them down into your netlify \_redirects file (located at `~/static/_redirects`), or create it if it doesn't exist.

## The things you don't really need to know but that you'll want to... because you're that curious 😂

This nuxt module is referenced in the _nuxt.config.js_ configuration file as a build module (see the [build modules documentation](https://nuxtjs.org/api/configuration-modules#-code-buildmodules-code-)).

The _query_ is passed as a module option, then the module takes care of everything.
